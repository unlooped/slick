// Helpers

Function.prototype._type = "Function";

String.escapeSingle = function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};



/*
	Slick Parser Specs
*/
this.PARSE = this.PARSE || Slick.parse;
var s;
var it;
var its;
var specs;
specs = it = its = {};


it['should exist'] = function(){
	value_of(PARSE).should_not_be_undefined();
};



// expressions
it['should convert multiple comma-separated selector expressions into separate entries in the expressions array'] = function(){
	s = PARSE('a,b,c');
	value_of( s.expressions.length ).should_be( 3 );
};

it['should always have an expressions array property'] = function(){
	s = PARSE('a,b,c');
	value_of( s.expressions.length ).should_be( 3 );
	
	s = PARSE('a');
	value_of( s.expressions.length ).should_be( 1 );
	
	s = PARSE('');
	value_of( s.expressions.length ).should_be( 0 );
};


// parts
it['should always have a parts array'] = function(){
	s = PARSE('a');
	value_of( s.expressions[0][0].parts.length ).should_be( 0 );
	
	s = PARSE('a.class');
	value_of( s.expressions[0][0].parts.length ).should_be( 1 );
	
	s = PARSE('tag#id.class[attrib][attrib=attribvalue]:pseudo:pseudo(pseudovalue):not(pseudovalue)');
	value_of( s.expressions[0][0].parts.length ).should_be( 6 );
};
its['parts array items should have a type property'] = function(){
	s = PARSE('tag#id.class[attrib][attrib=attribvalue]:pseudo:pseudo(pseudovalue):not(pseudovalue)');
	
	for (var i=0, part; part = s.expressions[0][0].parts[i]; i++){
		
		value_of( part.type ).should_not_be_undefined();
	}
};


// tags
it['should always have a tag property'] = function(){
	s = PARSE('tag');
	value_of( s.expressions[0][0].tag ).should_be( 'tag' );
	
	for (var i=0, TAG; TAG = TAGS[i]; i++){
		
		s = PARSE(TAG);
		value_of( s.expressions[0][0].tag ).should_be( TAG );
		
	}
};


// ids
it['should always have an id property'] = function(){
	s = PARSE('#id');
	value_of( s.expressions[0][0].id ).should_be( 'id' );
	
};

it['should throw away all but the last id'] = function(){
	s = PARSE('#id1#id2');
	value_of( s.expressions[0][0].id ).should_be( 'id2' );
	
};


// classes
it['should parse classes into the parts array'] = function(){
	s = PARSE('.class');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].parts[0].value ).should_be( 'class' );
	
	s = PARSE('.class1.class2.class3');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].parts[0].value ).should_be( 'class1' );
	value_of( s.expressions[0][0].parts[1].value ).should_be( 'class2' );
	value_of( s.expressions[0][0].parts[2].value ).should_be( 'class3' );
	
};
it['should parse classes into a classes array'] = function(){
	s = PARSE('.class');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].classes[0] ).should_be( 'class' );
	
	s = PARSE('.class1.class2.class3');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].classes ).should_be( '.class1.class2.class3'.split('.').slice(1) );
	
};
its['classes array items should have a regexp property'] = function(){
	s = PARSE('.class');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].parts[0].regexp._type ).should_be( 'RegExp' );
	value_of( s.expressions[0][0].parts[0].regexp.source ).should_match( 'class' );
	
};


// attributes
it['should parse attributes into the attributes array'] = function(){
	s = PARSE('[attrib]');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'attribute' );
	
	s = PARSE('[attrib1][attrib2][attrib3]');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'attribute' );
};

its['attributes array items should have a key property'] = function(){
	s = PARSE('[attrib]');
	value_of( s.expressions[0][0].parts[0].key ).should_be( 'attrib' );
	
	s = PARSE('[attrib1][attrib2][attrib3]');
	value_of( s.expressions[0][0].parts[0].key ).should_be( 'attrib1' );
	value_of( s.expressions[0][0].parts[1].key ).should_be( 'attrib2' );
	value_of( s.expressions[0][0].parts[2].key ).should_be( 'attrib3' );
	
};
its['attributes array items should have a value property'] = function(){
	s = PARSE('[attrib=attribvalue]');
	value_of( s.expressions[0][0].parts[0].value ).should_be( 'attribvalue' );
	
	s = PARSE('[attrib1=attribvalue1][attrib2=attribvalue2][attrib3=attribvalue3]');
	value_of( s.expressions[0][0].parts[0].value ).should_be( 'attribvalue1' );
	value_of( s.expressions[0][0].parts[1].value ).should_be( 'attribvalue2' );
	value_of( s.expressions[0][0].parts[2].value ).should_be( 'attribvalue3' );
	
};
its['attributes array items should have a operator property'] = function(){
	s = PARSE('[attrib=attribvalue]');
	value_of( s.expressions[0][0].parts[0].operator ).should_be( '=' );
	
};
its['attributes array items should have a test method'] = function(){
	s = PARSE('[attrib=attribvalue]');
	value_of( s.expressions[0][0].parts[0].test._type ).should_be( 'Function' );
	
};



// pseudos
it['should parse pseudos into the pseudos array'] = function(){
	s = PARSE(':pseudo');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'pseudo' );
	
	s = PARSE(':pseudo1:pseudo2:pseudo3');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'pseudo' );
};

its['pseudos array items should have a key property'] = function(){
	s = PARSE(':pseudo');
	value_of( s.expressions[0][0].parts[0].key ).should_be( 'pseudo' );
	
	s = PARSE(':pseudo1:pseudo2:pseudo3');
	value_of( s.expressions[0][0].parts[0].key ).should_be( 'pseudo1' );
	value_of( s.expressions[0][0].parts[1].key ).should_be( 'pseudo2' );
	value_of( s.expressions[0][0].parts[2].key ).should_be( 'pseudo3' );
	
};
its['pseudos array items should have a value property'] = function(){
	s = PARSE(':pseudo(pseudoValue)');
	value_of( s.expressions[0][0].parts[0].value ).should_be( 'pseudoValue' );
	
};


// combinators
// reverse combinators



describe('Slick Parser', specs);
specs = it = its = {};



// TAG
var TAGS = 'normal UPCASE'.split(' ');
var newTAG = function(TAG){
	return function(){
		
		s = PARSE(TAG);
		s = s.expressions[0][0];
		value_of( s.tag ).should_be( TAG );
		
	};
};
for (var TAG_I=0, TAG; TAG = TAGS[TAG_I]; TAG_I++){
	it['should support TAG: `'+TAG+'`'] = newTAG(TAG);
}



// ID
var IDS = "normal with-dash with_underscore 123number".split(' ');
var newID = function(ID){
	return function(){
		
		s = PARSE('#' + ID);
		s = s.expressions[0][0];
		value_of( s.id ).should_be( ID );
		
	};
};
for (var ID_I=0, ID; ID = IDS[ID_I]; ID_I++){
	it['should support id: `#'+ID+'`'] = newID(ID);
}



// CLASS
var CLASSES = "normal with-dash with_underscore 123number".split(' ');
var newCLASS = function(CLASS){
	return function(){
		
		s = PARSE('.' + CLASS);
		s = s.expressions[0][0];
		value_of( s.classes[0] ).should_be( CLASS );
		
	};
};
for (var CLASS_I=0, CLASS; CLASS = CLASSES[CLASS_I]; CLASS_I++){
	it['should support CLASS: `.'+CLASS+'`'] = newCLASS(CLASS);
}
it['should support all CLASSES: `.'+CLASSES.join('.')+'`'] = function(){
	s = PARSE('.' + CLASSES.join('.'));
	s = s.expressions[0][0];
	
	for (var CLASS_I=0, CLASS; CLASS = CLASSES[CLASS_I]; CLASS_I++){
		
		value_of( s.classes[CLASS_I] ).should_be( CLASS );
		
	}
};





// ATTRIBUTE
var ATTRIB_KEYS = 'normal with-dash with_underscore 123number'.split(' ');
var ATTRIB_OPERATORS = '= != *= ^= $= ~= |='.split(' ');
var ATTRIB_VALUES = 'normal,"double quote",\'single quote\',"double\\"escaped",\'single\\\'escaped\',parens(),curly{},square[],"quoted parens()","quoted curly{}","quoted square[]"'.split(',');
var newATTRIB = function(ATTRIB_KEY, ATTRIB_OPERATOR, ATTRIB_VALUE){
	return function(){
		
		s = PARSE('[' + ATTRIB_KEY + ']');
		value_of( s.expressions.length ).should_be( 1 );
		value_of( s.expressions[0].length ).should_be( 1 );
		s = s.expressions[0][0];
		value_of( s.attributes[0].key ).should_be( ATTRIB_KEY );
		
		s = PARSE('[' + ATTRIB_KEY + ATTRIB_OPERATOR + ATTRIB_VALUE + ']');
		value_of( s.expressions.length ).should_be( 1 );
		value_of( s.expressions[0].length ).should_be( 1 );
		s = s.expressions[0][0];
		value_of( s.attributes[0].key ).should_be( ATTRIB_KEY );
		value_of( s.attributes[0].operator ).should_be( ATTRIB_OPERATOR );
		value_of( s.attributes[0].value ).should_be( ATTRIB_VALUE.replace(/^["']/g,'').replace(/["']$/g,'') );
		
	};
};
for (var ATTRIB_VALUE_I=0, ATTRIB_VALUE; ATTRIB_VALUE = ATTRIB_VALUES[ATTRIB_VALUE_I]; ATTRIB_VALUE_I++){
	for (var ATTRIB_OPERATOR_I=0, ATTRIB_OPERATOR; ATTRIB_OPERATOR = ATTRIB_OPERATORS[ATTRIB_OPERATOR_I]; ATTRIB_OPERATOR_I++){
		for (var ATTRIB_KEY_I=0, ATTRIB_KEY; ATTRIB_KEY = ATTRIB_KEYS[ATTRIB_KEY_I]; ATTRIB_KEY_I++){
			
			it['should support ATTRIB: `'+ '[' + ATTRIB_KEY + ATTRIB_OPERATOR + ATTRIB_VALUE + ']' +'`'] = newATTRIB(ATTRIB_KEY, ATTRIB_OPERATOR, ATTRIB_VALUE);
			
		}
	}
}



// PSEUDO
var PSEUDO_KEYS = 'normal with-dash with_underscore'.split(' ');
var PSEUDO_VALUES = ATTRIB_VALUES;
var newPSEUDO = function(PSEUDO_KEY, PSEUDO_VALUE){
	return function(){
		
		s = PARSE(':' + PSEUDO_KEY);
		value_of( s.expressions.length ).should_be( 1 );
		value_of( s.expressions[0].length ).should_be( 1 );
		s = s.expressions[0][0];
		value_of( s.pseudos[0].key ).should_be( PSEUDO_KEY );
		
		s = PARSE(':' + PSEUDO_KEY +'('+ PSEUDO_VALUE + ')');
		value_of( s.expressions.length ).should_be( 1 );
		value_of( s.expressions[0].length ).should_be( 1 );
		s = s.expressions[0][0];
		value_of( s.pseudos[0].key ).should_be( PSEUDO_KEY );
		value_of( s.pseudos[0].value ).should_be( PSEUDO_VALUE.replace(/^["']/g,'').replace(/["']$/g,'') );
		
	};
};
for (var PSEUDO_VALUE_I=0, PSEUDO_VALUE; PSEUDO_VALUE = PSEUDO_VALUES[PSEUDO_VALUE_I]; PSEUDO_VALUE_I++){
	for (var PSEUDO_KEY_I=0, PSEUDO_KEY; PSEUDO_KEY = PSEUDO_KEYS[PSEUDO_KEY_I]; PSEUDO_KEY_I++){
		
		it['should support PSEUDO: `'+ ':' + PSEUDO_KEY +'('+ PSEUDO_VALUE + ')' +'`'] = newPSEUDO(PSEUDO_KEY, PSEUDO_VALUE);
		
	}
}



// COMBINATOR
var COMBINATORS = ' ,>,+,~,   , > , + , ~ '.split(',');


describe('Slick Parser Syntax', specs);
