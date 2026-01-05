// ==UserScript==
// @namespace       heroeswm
// @name            HWM Map Objects
// @description     Отображение всех объектов в регионе на одной странице.
// @version         2.11.10.1
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues 
// @grant           GM_info 
// @grant           GM_log
// @grant           GM_xmlhttpRequest
// @include         http://www.heroeswm.ru/map.php*
// @include         http://www.heroeswm.ru/object-info.php*
// @require         http://code.jquery.com/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/2614/HWM%20Map%20Objects.user.js
// @updateURL https://update.greasyfork.org/scripts/2614/HWM%20Map%20Objects.meta.js
// ==/UserScript==


/*
 * JQuery URL Parser plugin, v2.2.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */ 

;(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD available; use anonymous module
		if ( typeof jQuery !== 'undefined' ) {
			define(['jquery'], factory);	
		} else {
			define([], factory);
		}
	} else {
		// No AMD available; mutate global vars
		if ( typeof jQuery !== 'undefined' ) {
			factory(jQuery);
		} else {
			factory();
		}
	}
})(function($, undefined) {
	
	var tag2attr = {
			a       : 'href',
			img     : 'src',
			form    : 'action',
			base    : 'href',
			script  : 'src',
			iframe  : 'src',
			link    : 'href'
		},
		
		key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query
		
		aliases = { 'anchor' : 'fragment' }, // aliases for backwards compatability
		
		parser = {
			strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
			loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
		},
		
		toString = Object.prototype.toString,
		
		isint = /^[0-9]+$/;
	
	function parseUri( url, strictMode ) {
		var str = decodeURI( url ),
		res   = parser[ strictMode || false ? 'strict' : 'loose' ].exec( str ),
		uri = { attr : {}, param : {}, seg : {} },
		i   = 14;
		
		while ( i-- ) {
			uri.attr[ key[i] ] = res[i] || '';
		}
		
		// build query and fragment parameters		
		uri.param['query'] = parseString(uri.attr['query']);
		uri.param['fragment'] = parseString(uri.attr['fragment']);
		
		// split path and fragement into segments		
		uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');     
		uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');
		
		// compile a 'base' domain attribute        
		uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ?  uri.attr.protocol+'://'+uri.attr.host : uri.attr.host) + (uri.attr.port ? ':'+uri.attr.port : '') : '';      
		  
		return uri;
	};
	
	function getAttrName( elm ) {
		var tn = elm.tagName;
		if ( typeof tn !== 'undefined' ) return tag2attr[tn.toLowerCase()];
		return tn;
	}
	
	function promote(parent, key) {
		if (parent[key].length == 0) return parent[key] = {};
		var t = {};
		for (var i in parent[key]) t[i] = parent[key][i];
		parent[key] = t;
		return t;
	}

	function parse(parts, parent, key, val) {
		var part = parts.shift();
		if (!part) {
			if (isArray(parent[key])) {
				parent[key].push(val);
			} else if ('object' == typeof parent[key]) {
				parent[key] = val;
			} else if ('undefined' == typeof parent[key]) {
				parent[key] = val;
			} else {
				parent[key] = [parent[key], val];
			}
		} else {
			var obj = parent[key] = parent[key] || [];
			if (']' == part) {
				if (isArray(obj)) {
					if ('' != val) obj.push(val);
				} else if ('object' == typeof obj) {
					obj[keys(obj).length] = val;
				} else {
					obj = parent[key] = [parent[key], val];
				}
			} else if (~part.indexOf(']')) {
				part = part.substr(0, part.length - 1);
				if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
				parse(parts, obj, part, val);
				// key
			} else {
				if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
				parse(parts, obj, part, val);
			}
		}
	}

	function merge(parent, key, val) {
		if (~key.indexOf(']')) {
			var parts = key.split('['),
			len = parts.length,
			last = len - 1;
			parse(parts, parent, 'base', val);
		} else {
			if (!isint.test(key) && isArray(parent.base)) {
				var t = {};
				for (var k in parent.base) t[k] = parent.base[k];
				parent.base = t;
			}
			set(parent.base, key, val);
		}
		return parent;
	}

	function parseString(str) {
		return reduce(String(str).split(/&|;/), function(ret, pair) {
			try {
				pair = decodeURIComponent(pair.replace(/\+/g, ' '));
			} catch(e) {
				// ignore
			}
			var eql = pair.indexOf('='),
				brace = lastBraceInKey(pair),
				key = pair.substr(0, brace || eql),
				val = pair.substr(brace || eql, pair.length),
				val = val.substr(val.indexOf('=') + 1, val.length);

			if ('' == key) key = pair, val = '';

			return merge(ret, key, val);
		}, { base: {} }).base;
	}
	
	function set(obj, key, val) {
		var v = obj[key];
		if (undefined === v) {
			obj[key] = val;
		} else if (isArray(v)) {
			v.push(val);
		} else {
			obj[key] = [v, val];
		}
	}
	
	function lastBraceInKey(str) {
		var len = str.length,
			 brace, c;
		for (var i = 0; i < len; ++i) {
			c = str[i];
			if (']' == c) brace = false;
			if ('[' == c) brace = true;
			if ('=' == c && !brace) return i;
		}
	}
	
	function reduce(obj, accumulator){
		var i = 0,
			l = obj.length >> 0,
			curr = arguments[2];
		while (i < l) {
			if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
			++i;
		}
		return curr;
	}
	
	function isArray(vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	}
	
	function keys(obj) {
		var keys = [];
		for ( prop in obj ) {
			if ( obj.hasOwnProperty(prop) ) keys.push(prop);
		}
		return keys;
	}
		
	function purl( url, strictMode ) {
		if ( arguments.length === 1 && url === true ) {
			strictMode = true;
			url = undefined;
		}
		strictMode = strictMode || false;
		url = url || window.location.toString();
	
		return {
			
			data : parseUri(url, strictMode),
			
			// get various attributes from the URI
			attr : function( attr ) {
				attr = aliases[attr] || attr;
				return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
			},
			
			// return query string parameters
			param : function( param ) {
				return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
			},
			
			// return fragment parameters
			fparam : function( param ) {
				return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
			},
			
			// return path segments
			segment : function( seg ) {
				if ( typeof seg === 'undefined' ) {
					return this.data.seg.path;
				} else {
					seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
					return this.data.seg.path[seg];                    
				}
			},
			
			// return fragment segments
			fsegment : function( seg ) {
				if ( typeof seg === 'undefined' ) {
					return this.data.seg.fragment;                    
				} else {
					seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
					return this.data.seg.fragment[seg];                    
				}
			}
	    	
		};
	
	};
	
	if ( typeof $ !== 'undefined' ) {
		
		$.fn.url = function( strictMode ) {
			var url = '';
			if ( this.length ) {
				url = $(this).attr( getAttrName(this[0]) ) || '';
			}    
			return purl( url, strictMode );
		};
		
		$.url = purl;
		
	} else {
		window.purl = purl;
	}

});





/** Библиотека строк
*
* Реализует функции работы со строками.
*
* @file libString.js
* @version 3.1.3
* @author hotamateurxxx
* @link http://userscripts.org/users/362572
* @license GPL
*/


/** Строковое представление
* @param Object obj
* @return String
*/
String.fromObject = function(object) {
    if (object === undefined)
        return '';
    if (object === null)
        return 'null';
    return String(object);
}


/** Усечение по краям
* @param String str
* @param String charlist
* @return String
*/
String.trim = function(str, charlist) {
    charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
    var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
    return str.replace(re, '');
}


/** Форматированная строка
* @param String text
* @param Number length
* @param String align
* @return String
*/
String.format = function(text, length, align) {
    var result = String.fromObject(text);
    while (result.length < length)
        switch (align) {
            case 'right':
                result = ' ' + result;
                break;
            case 'center':
                result = ' ' + result + ' ';
                break;
            default:
                result = result + ' ';
        }
    return (result);
}


/** Записи в строке
* @param Array records
* @param Array aligns
* @param Boolean border
* @return String
*/
String.fromRecords = function(records, aligns, border) {
    
    if ((records === undefined) || (records.length === 0))
        return '';
    
    // Выравнивания
    if (aligns === undefined)
        aligns = [];
    
    // Ширина колонок
    var lengths = [];
    for (var j = 0; j < records[0].length; j++)
        lengths[j] = 0;
    for (var i = 0; i < records.length; i++)
        for (var j = 0; j < records[i].length; j++)
            lengths[j] = Math.max(lengths[j], String.fromObject(records[i][j]).length);
    
    // Результирующая строка
    var str = '';
    for (var i = 0; i < records.length; i++) {
        str += (i == 0) ? '' : '\n';
        for (var j = 0; j < records[i].length; j++) {
            str += String.format(records[i][j], lengths[j], aligns[j]) + ' ';
        }
    }
    
    // Возврат результата
    return str;
    
}


/** Колонки в строке
* @param Array columns
* @param Array aligns
* @param Boolean border
* @return String
*/
String.fromColumns = function(columns, aligns, border) {
    
    if ((columns === undefined) || (columns.length === 0))
        return '';
    
    // Выравнивания
    if (aligns === undefined)
        aligns = [];
    
    // Ширина колонок
    var lengths = [];
    for (var j = 0; j < columns.length; j++)
        lengths[j] = 0;
    for (var j = 0; j < columns.length; j++)
        for (var i = 0; i < columns[j].length; i++)
            lengths[j] = Math.max(lengths[j], String.fromObject(columns[j][i]).length);
    
    // Результирующая строка
    var str = '';
    for (var i = 0; i < columns[0].length; i++) {
        str += (i == 0) ? '' : '\n';
        for (var j = 0; j < columns.length; j++)
            str += String.format(columns[j][i], lengths[j], aligns[j]) + ' ';
    }
    
    // Возврат результата
    return str;
    
}


/** Объекты в строке
* @param Array objescts
* @param Object aligns
* @param Boolean border
* @param Array exclude
* @return String
*/
String.fromObjects = function(objescts, aligns, border, exclude) {
    
    if ((objescts === undefined) || (objescts.length === 0))
        return '';
    
    // Выравнивания
    if (aligns === undefined)
        aligns = [];
    
    // Исключения
    if (exclude === undefined)
        exclude = [];
    
    // Ширина колонок
    var lengths = [];
    for (var i = 0; i < objescts.length; i++)
        for (var j in objescts[i])
            lengths[j] = Math.max(
                lengths[j] !== undefined ? lengths[j] : 0, 
                String.fromObject(objescts[i][j]).length
            );
    
    // Результирующая строка
    var str = '';
    for (var i = 0; i < objescts.length; i++) {
        str += (i == 0) ? '' : '\n';
        for (var j in lengths) {
            var skip = false;
            for (var k = 0; k < exclude.length; k++)
                if (exclude[k] == j) {
                    skip = true;
                    break;
                }
            if (skip)
                continue;
            str += String.format(objescts[i][j], lengths[j], aligns[j]) + ' ';
        }
    }
    
    // Возврат результата
    return str;
    
}


/** Декодирование строки
* @param String str
* @return String
*/
String.decode = function(str) {
	var chars = 
        'абвгдеёжзийклмнопрстуфхцчшщъыьэюя' + 
        'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
	var codes = 
        '%E0%E1%E2%E3%E4%E5%B8%E6%E7%E8%E9%EA%EB%EC%ED%EE%EF%F0%F1%F2%F3%F4%F5%F6%F7%F8%F9%FA%FB%FC%FD%FE%FF' +
        '%C0%C1%C2%C3%C4%C5%A8%C6%C7%C8%C9%CA%CB%CC%CD%CE%CF%D0%D1%D2%D3%D4%D5%D6%D7%D8%D9%DA%DB%DC%DD%DE%DF';
	codes = codes.split('%');
	for (var i = 0; i < codes.length; i++) {
        str = str.split('%' + codes[i + 1]).join(chars[i]);
    }
	return str;
}



/** Функции работы со временем
*
* @file libTime.js
* @version 1.1.7
* @author hotamateurxxx
* @license GPL
*/


/**
*/
function Time() {}


/** Строка времени
* @param Date time
* @return String
*/
Time.toString = function(time) {
    time = (time === undefined) ? (new Date()) : time;
    return time.toLocaleTimeString(); 
}


/** Строка даты
* @param Date time
* @return String
*/
Time.toDateString = function(time) {
    time = (time === undefined) ? (new Date()) : time;
    var mstr = String(time.getMonth() + 1);
    var dstr = String(time.getDate());
    var str =
        time.getFullYear() + '/' + 
        (mstr.length > 1 ? '' : '0') + mstr + '/'  + 
        (dstr.length > 1 ? '' : '0') + dstr; 
    return str;
}


/** Полная строка времени
* @param Date time
* @return String
*/
Time.toDateTimeString = function(time) {
    time = (time === undefined) ? (new Date()) : time;
    var str =
        Time.toDateString(time) + ' ' +
        time.toLocaleTimeString(); 
    return str;
}


/**
* @param Date time
* @return Number
*/
Time.toNumber = function(time) {
    time = (time === undefined) ? (new Date()) : time;
    return Math.floor(time.getTime() / 1000);
}


/**
* @param Number num
* @return Date
*/
Time.fromNumber = function(num) {
    return new Date(num * 1000);
}


/** Интервал времени строкой
* @param Number value Интервал в милисекундах
* @return String
*/
Time.delayString = function(value) {
    var sign = (value < 0) ? '-' : '';
    value = Math.abs(value);
    var unit = 'милисекунд';
    var divs = [
        {value: 1000, unit: 'секунд'},
        {value: 60, unit: 'минут'},
        {value: 60, unit: 'часов'},
        {value: 24, unit: 'суток'}
    ]
    var text = value.toFixed(1) + ' ' + unit;
    for (var i in divs) {
        if (value < divs[i].value)
            break;
        value = value / divs[i].value;
        unit = divs[i].unit;
        text = value.toFixed(1) + ' ' + unit;
    }
    return sign + text;
}



/** Библиотека событий
*
* Реализует кроссбраузерный механизм работы с событиями.
*
* @file libEvent.js
* @version 2.0.0
* @author DrunkenStranger
* @link http://userscripts.org/users/362572
* @license GPL
*/


/** Событие
* 
* Реализация кроссбраузерного механизма работы с событиями.
* @link http://javascript.ru/tutorial/events/crossbrowser
*/
Event = (function() {
    var guid = 0;
        
    function fixEvent(event) {
        event = event || window.event;
        
        if (event.isFixed)
            return event;
        event.isFixed = true;
        
        event.preventDefault = event.preventDefault || function() {this.returnValue = false;};
        event.stopPropagation = event.stopPropagaton || function() {this.cancelBubble = true;};
        
        if (!event.target)
            event.target = event.srcElement;
        
        if (!event.relatedTarget && event.fromElement)
            event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
        
        if (event.pageX == null && event.clientX != null) {
            var html = document.documentElement, body = document.body;
            event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
            event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
        }
        
        if (!event.which && event.button)
            event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
        
        return event
    }    
    
    // Вызывается в контексте элемента всегда this = element
    function commonHandle(event) {
        event = fixEvent(event);
        
        var handlers = this.events[event.type];
        for (var g in handlers) {
            var handler = handlers[g];
            var ret = handler.call(this, event);
            if (ret === false) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
    
    return {
        add: function(elem, type, handler) {
            if (elem.setInterval && (elem != window && !elem.frameElement)) {
                elem = window;
            }
            
            if (!handler.guid) {
                handler.guid = ++guid;
            }
            
            if (!elem.events) {
                elem.events = {};
		elem.handle = function(event) {
		    if (typeof Event !== 'undefined') {
			return commonHandle.call(elem, event)
		    }
                }
            }
	    
            if (!elem.events[type]) {
                elem.events[type] = {}                
            
                if (elem.addEventListener)
		    elem.addEventListener(type, elem.handle, false)
		else if (elem.attachEvent)
                    elem.attachEvent('on' + type, elem.handle)
            }
            
            elem.events[type][handler.guid] = handler
        },
        
        remove: function(elem, type, handler) {
            var handlers = elem.events && elem.events[type]
            
            if (!handlers) return
            
            delete handlers[handler.guid]
            
            for(var any in handlers) return 
	    if (elem.removeEventListener)
		elem.removeEventListener(type, elem.handle, false)
	    else if (elem.detachEvent)
		elem.detachEvent('on' + type, elem.handle)
		
	    delete elem.events[type]
	
	    
	    for (var any in elem.events) return
	    try {
	        delete elem.handle
	        delete elem.events 
	    } catch(e) { // IE
	        elem.removeAttribute('handle')
	        elem.removeAttribute('events')
	    }
        } 
    }
}())



/** Библиотека наследования
*
* Реализует механизм наследования.
*
* @file libExtend.js
* @version 2.0.0
* @author DrunkenStranger
* @link http://userscripts.org/users/362572
* @license GPL
*/


Function.prototype.extends = function(parent) {
    var Inheritance = function(){};
    Inheritance.prototype = parent.prototype;
    this.prototype = new Inheritance();
    this.prototype.constructor = this;
    this.prototype.parent = parent;
    this.parent = parent;
}



/** Библиотека смещений
*
* Реализует механизм смещений.
*
* @file libOffset.js
* @version 3.0.0
* @author DrunkenStranger
* @link http://userscripts.org/users/362572
* @license GPL
*/


/**
*/
function Offset() {}


/** Получение смещения
* @param Element elem
* @return Object
*/
Offset.get = function(elem) {
    if (elem.getBoundingClientRect) {
        return this.getRect(elem);
    } else {
        return this.getSum(elem);
    }
}


/** Установка смещения
* @param Element elem
* @param Object offset
* @param Element base
*/
Offset.set = function(elem, offset, base) {
    var coords = this.get(base);
    elem.style.top = coords.top + offset.top;
    elem.style.left = coords.left + offset.left;
}


/** Получение смещения через сумму смещений родителских элементов
* @param Element elem
* @return Object
*/
Offset.getSum = function(elem) {
    var top=0, left=0;
    while(elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }
    return {
        top: top, 
        left: left
    };
}


/** Получение смещения метод getBoundingClientRect
* @param Element elem
* @return Object
*/
Offset.getRect = function(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return {
        top: Math.round(top), 
        left: Math.round(left) 
    };
}



/** Функции работы с xpath
*
* @file libXpath.js
* @version 1.0.0
* @author hotamateurxxx
* @license GPL
*/


/**
*/
function XPath() {}


/** Найти первый элемент
* @param String xpath
* @param Document doc
* @param Node start
* @return Node
*/
XPath.findFirst = function(xpath, doc, start) {
    doc = (doc === undefined) ? document : doc;
    start = (start === undefined) ? doc : start;
    var res = doc.evaluate(xpath, start, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return res.snapshotItem(0);
}



/** Класс работы с аукционом
*
* @file libAuction.js
* @version 1.4.3
* @author hotamateurxxx
* @license GPL
*/


/**
*/
function Auction() {}


/**
*/
Auction.treeFuncs = [
    'a_helm',
    'a_necklace',
    'a_cuirass',
    'a_cloack',
    'a_weapon',
    'a_shield',
    'a_boots',
    'a_ring',
    'a_potions',
    'a_other',
    'a_thief',
    'a_tactic',
    'a_verb',
    'a_medals',
    'a_relict'
];
    
    
Auction.treeMarks = [
    'mark_info_helm',
    'mark_info_necklace',
    'mark_info_cuirass',
    'mark_info_cloack',
    'mark_info_weapon',
    'mark_info_shield',
    'mark_info_boots',
    'mark_info_ring',
    'mark_info_potions',
    'mark_info_other',
    'mark_info_thief',
    'mark_info_tactic',
    'mark_info_verb',
    'mark_info_medals',
    'mark_info_relict'
];


/** Строка с ценой как на рынке (запятая разделяет разряды)
* @param Number price
* @return String
*/
Auction.formPrice = function(price) {
    var result = String(parseInt(price).toFixed(0)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    //GM_log('Auction.formPrice(' + price + ') == ' + result);
    return result;
}


/** HTML с ценой как на рынке (запятая разделяет разряды)
* @param Number price
* @param Number precision
* @param Boolean bold
* @return String
*/
Auction.htmlPrice = function(price, precision, bold) {
    price = (precision === undefined) ? Auction.formPrice(price) : price.toFixed(precision);
    price = (bold === true) ? '<b>' + price + '</b>' : price;
    return '<table border="0" cellspacing="0" cellpadding="0"><tr><td><img width="24" height="24" src="i/gold.gif" border="0" title="Золото"></td><td>' + price + '</td></tr></table>';
}


/** Загрузка артефакта
* @param Object art
* @return Object
*/
Auction.loadArt = function(art) {
    
    var key = 'Art_' + art.id;
    var str = GM_getValue(key, null);
    if (str === null)
        return art;
    
    var arr1 = str.split('|');
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        var attrName = arr2[0];
        var attrValue = arr2[1];
        if (art[attrName] !== undefined)
            continue;
        switch (attrName) {
            default: art[attrName] = attrValue;
        }
    }
    
    return art;
    
}


/** Сохранение артефакта
* @param Object art
*/
Auction.saveArt = function(art) {    
    
    var art = Auction.loadArt(art);
    
    var str = '';
    for (var i in art) {
        var attrName = i;
        var attrValue = art[i];
        switch (attrName) {
            case 'url': break;
            default: str += '|' + attrName + '=' + attrValue;
        }
    }
    str = str.substr(1);
    
    var key = 'Art_' + art.id;
    GM_setValue(key, str);
    
}


/** Обработчик загрузки
* @param Object art
* @param String text
* @param Number max
* @return Object
*/
Auction.parsePricesList = function(art, text, max) {
    //GM_log(Time.toString() + ' Поиск объявлений...');    
    
    // AJAX
    //<td align=center><b>Купить сразу!</b></td><td align=left><table cellspacing=0 cellpadding=0><tr><td><table border=0 cellspacing=0 cellpadding=0><tr><td><img width=24 height=24 src="http://dcdn3.heroeswm.ru/i/gold.gif" border=0 title="Золото" alt=""></td><td>240</td></tr></table></td><td>&nbsp;</td></tr></table></td>
    //<td align=center><b>Купить сразу!</b></td><td align=left><table cellspacing=0 cellpadding=0><tr><td><table border=0 cellspacing=0 cellpadding=0><tr><td><img width=24 height=24 src="http://dcdn3.heroeswm.ru/i/gold.gif" border=0 title="Золото" alt=""></td><td>243</td></tr></table></td><td>&nbsp;<b>за 1 шт.</b></td></tr></table></td>
    //<td align=center><b>Купить сразу!</b></td><td align=left><table cellspacing=0 cellpadding=0><tr><td><table border=0 cellspacing=0 cellpadding=0><tr><td><img width=24 height=24 src="http://dcdn3.heroeswm.ru/i/gold.gif" border=0 title="Золото" alt=""></td><td>239</td></tr></table></td><td>&nbsp;<font style="font-size:8px;color:#21211D;">(237)</font><b>за 1 шт.</b></td></tr></table></td>
    var retAJAX = '<td align=center><b>[^<>"\']+\\s+[^<>"\']+!</b></td><td align=left>(<table cellspacing=0 cellpadding=0><tr><td><table border=0 cellspacing=0 cellpadding=0><tr><td><img width=24 height=24 src="http://dcdn3.heroeswm.ru/i/gold.gif" border=0 title="[^"]+" alt=""></td><td>([\\,\\d]+)</td></tr></table></td><td>&nbsp;(<font style="font-size:8px;color:#21211D;">\\(([\\,\\d]+)\\)</font>)?(<b>[^<>"\']+\\s+1\\s+[^<>"\']+\\.</b>)?</td></tr></table>)</td>';

    // DOM
    //<td align="center"><b>Купить сразу!</b></td><td align="left"><table cellpadding="0" cellspacing="0"><tbody><tr><td><table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td><img src="http://dcdn3.heroeswm.ru/i/gold.gif" title="Золото" alt="" border="0" height="24" width="24"></td><td>525</td></tr></tbody></table></td><td>&nbsp;<font style="font-size:8px;color:#21211D;">(235)</font><b>за 1 шт.</b></td></tr></tbody></table></td>
    var retDOM = 
        // <td align="center"><b>Купить сразу!</b></td>
        '<td align="center"><b>[^<>"\']+\\s+[^<>"\']+!</b></td>' + 
        // <td align="left"><table cellpadding="0" cellspacing="0"><tbody><tr><td>
        '<td align="left">(<table cellpadding="0" cellspacing="0"><tbody><tr><td>' + 
        // <table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td>
        '<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td>' + 
        // <img src="http://dcdn3.heroeswm.ru/i/gold.gif" title="Золото" alt="" border="0" height="24" width="24"></td>
        '<img src="http://dcdn\\d?.heroeswm.ru/i/gold.gif" title="[^"]+" alt="" border="0" height="24" width="24"></td>' + 
        // <td>525</td></tr></tbody></table></td><td>&nbsp;
        '<td>([\\,\\d]+)</td></tr></tbody></table></td><td>&nbsp;' + 
        // <font style="font-size:8px;color:#21211D;">(235)</font>
        '(<font style="font-size:8px;color:#[\\d\\w]+;">\\(([\\,\\d]+)\\)</font>)?' + 
        // <b>за 1 шт.</b>
        '(<b>[^<>"\']+\\s+1\\s+[^<>"\']+\\.</b>)?' + 
        // </td></tr></tbody></table></td>
        '</td></tr></tbody></table>)</td>';
    
    var ret = retDOM;
    var res = text.match(new RegExp(ret, 'ig'));
    if (res === null) {
        ret = retAJAX;
        res = text.match(new RegExp(ret, 'ig'));
        if (res === null)
            return false;
    }
    //GM_log(Time.toString() + ' Найдено ' + res.length + ' объявлений.');

    
    var prices = [];
    max = (max === undefined) ? res.length : max;
    for (var i = 0; i < Math.min(res.length, max); i++) {
        var res2 = (new RegExp(ret, 'ig')).exec(res[i]);
        if (res2 === null)
            continue;
        var node = res2[1];
        node = node.replace(/title="[^"]+"/ig, 'title="Золото"');
        node = node.replace(res2[3], '');
        node = node.replace(res2[5], '');
        prices[prices.length] = {
            node: node,
            cost: parseInt(res2[2].replace(',', ''))
        }
    }
    
    // Сохраняем информацию о минимальной и максимальной цене
    if (prices.length > 0) {
        
        var art = Auction.loadArt(art);
        if (art.priceMin === undefined) {
            art.priceMin = prices[0].cost;
            art.priceMinTime = Time.toNumber();
        }
        if (art.priceMax === undefined) {
            art.priceMax = prices[0].cost;
            art.priceMaxTime = Time.toNumber();
        }
        if (prices[0].cost < art.priceMin) {
            art.priceMin = prices[0].cost;
            art.priceMinTime = Time.toNumber();
        }
        if (prices[0].cost > art.priceMax) {
            art.priceMax = prices[0].cost;
            art.priceMaxTime = Time.toNumber();
        }
        Auction.saveArt(art);
        
    }
    
    // Возвращаем результат
    return {prices: prices, count: res.length};
    
}


/** Загрузка рыночной цены артефакта
* @param Object art
* @param Document doc
* @param Function handler
* @param Number max
*/
Auction.loadPricesList = function(art, doc, handler, max) {
    
    function onLoad(resp) {
        var name = (art.title === undefined) ? art.id : art.title;
        //GreaseMonkey.log('Загружен список объявлений для артефакта "' + name + '".');
        var data = Auction.parsePricesList(art, resp.responseText, max); 
        GreaseMonkey.log('Загружено ' + data.count + ' объявлений для "' + name + '".');
        if (handler !== undefined) {
            handler(data.prices, data.count);
        }
    }
    
    var url = 'http://' + doc.location.hostname + '/auction.php?cat=' + art.cat + '&art_type=' + art.id + '&sort=4&sbn=1&sau=0&snew=1';
    GreaseMonkey.xmlhttpRequest({method: 'GET', url: url, onload: onLoad});
    
}


/** Обработчик загрузки
* @param Document doc
* @param String text
*/
Auction.parseArtsList = function(doc, text) {
    
    var container = doc.createElement('div');
    container.style.display = 'none';
    doc.body.appendChild(container);
    
    var arts = [];
    for (var i = 0; i < Auction.treeFuncs.length; i++) {
        
        var reText = "function " + Auction.treeFuncs[i] + "\\(\\)\\{\\s*document\\.getElementById\\('" + Auction.treeMarks[i] + "'\\)\\.innerHTML = '(.+)';\\s*\\}";
        var re = new RegExp(reText);
        var reRes = re.exec(text);
        if (reRes === null)
            continue;
        var code = reRes[1];
        
        var category = doc.createElement('div');
        category.innerHTML = code;
        container.appendChild(category);
        
        // Собираем ссылки
        var links = category.getElementsByTagName('a');
    
        // Анализируем ссылки
        for (var j = 0; j < links.length; j++) {
            // <a href="/auction.php?cat=helm&sort=0&art_type=leatherhat"><font style="font-size:9px;">Кожаная шляпа (5)</font></a>
            var link = links[j];
            var url = $.url(link.href);
            if (url.attr('path') != '/auction.php')
                continue;
            var cat = url.param('cat');
            var id = url.param('art_type');
            if (cat === undefined)
                continue;
            if (id === undefined)
                continue;
            try {
                var title = link.firstChild.textContent;
                var matches = /(\S.*\S)\s+\(\d+\)/.exec(title);
                title = matches[1];
            } catch (e) {
                // do nothing
            }
            var art = {'cat': cat, 'id': id, 'url': link.href, 'title': title};
            Auction.saveArt(art);
            arts[arts.length] = art;
        }
        
    }

    // Удаляем временные узлы
    container.parentNode.removeChild(container);
    
    // Возвращаем результат
    return arts;
    
}


/** Загрузка общего списка артефактов со страницы аукциона
* @param Document doc
* @param Function handler
*/
Auction.loadArtsList = function(doc, handler) {
    
    function onLoad(resp) {
        GreaseMonkey.log('Список артефактов с рынка загружен.');
        var arts = Auction.parseArtsList(doc, resp.responseText); 
        if (handler !== undefined) {
            handler(arts);
        }
    }
    
    var url = 'http://' + doc.location.hostname + '/auction.php';
    GreaseMonkey.xmlhttpRequest({method: 'GET', url: url, onload: onLoad});
    
}




/** Оболочка пользовательских скриптов
*
* @file libUserScriptGUI.js
* @version 2.3.0
* @author hotamateurxxx
* @license GPL
*/


/** Оболочка пользовательских скриптов
* @param Document context
*/
function UserScriptGUI(context) {
    
    
    /** Разрешение конфликта имен для обработчиков
    * @var UserScriptGUI
    */
    var self = this;
    
    
    /** Документ
    * @var contextument
    */
    this.context = context;    
    
    
    /** Создание кнопки
    * @param Array path Путь
    * @param String title Заголовок
    * @param String desc Описание
    * @return jQuery
    */
    this.createMenuButton = function(path, title, desc) {
        //GM_log('UserScriptGUI.createMenuButton([' + path.join(', ') + '], ' + title + ', ' + desc +')');
        title = (title === undefined) ? path[path.length - 1] : title;
        desc = (desc === undefined) ? '' : desc;
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var ppath = fpath.slice(0, fpath.length - 1);
        var pid = ppath.join('_');   
        if ($('#b' + fid, context).length === 0) {
            if (path.length > 1)
                this.createMenu(path.slice(0, path.length - 1));
            $('#m' + pid, context).append("<input id='b" + fid + "' type='button' value='" + title + "' title='" + desc + "'/>");
            $('#b' + fid, context).css({'display': 'block', 'width': '95%', 'border': 'solid 1px #999999', 'margin': '2px', 'padding': '1px', 'background': '#cccccc', 'font-size': '12px', 'cursor': 'pointer'});
            $('#b' + fid, context).hover(
                function(){ $('#b' + fid, context).css({'background': '#ccffcc'}); },
                function(){ 
                    $('#b' + fid, context).css({'background': '#cccccc'}); 
                    $('#b' + fid + '.Active', context).css({'background': '#ffffcc'}); 
                }
            );
            $('#b' + fid, context).addClass('Button');
        }
        return $('#b' + fid, context);
    }
    
    
    /** Создание меню
    * @param Array path Путь
    * @return jQuery
    */
    this.createMenu = function(path) {
        //GM_log('UserScriptGUI.createMenu([' + path.join(', ') + '])');
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var ppath = fpath.slice(0, fpath.length - 1);
        var pid = ppath.join('_');        
        if ($('#m' + fid, context).length === 0) {
            $('#m' + pid, context).append("<div id='m" + fid + "'/>");
            $('#m' + fid, context).css({'position': 'fixed'});
            $('#m' + fid, context).hide();
            $('#b' + fid, context).click( function(){ self.toggleMenu(path); } );
            $('#m' + fid, context).addClass('Menu');
        }
        return $('#m' + fid, context);
    }
    
    
    /** Переключение меню
    * @param Array path Путь
    */
    this.toggleMenu = function(path) {
        //GM_log('UserScriptGUI.toggleMenu([' + path.join(', ') + '])');
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var ppath = fpath.slice(0, fpath.length - 1);
        var pid = ppath.join('_');        
        var show = ($('#m' + fid, context).css('display') == 'none');
        $('#m' + pid + ' .Menu', context).hide();
        $('#m' + pid + ' .Button', context).css({'background': '#cccccc'}).removeClass('Active');
        if (show) {
            $('#m' + fid, context).show();
            $('#b' + fid, context).css({'background': '#ffffcc'}).addClass('Active');
        }
        var top = parseInt($('#m' + pid, context).css('top'));
        var right = parseInt($('#m' + pid, context).css('right'));
        var width = $('#b' + fid, context).width();
        $('#m' + fid, context).css({'top': top + 'px', 'right': right + width + 10 + 'px'});
    }
    
    
    /** Создание кнопки окна
    * @param Array path Путь
    * @param String title Заголовок
    * @param String desc Описание
    * @return jQuery
    */
    this.createWindowButton = function(path, title, desc) {
        //GM_log('UserScriptGUI.createWindowButton([' + path.join(', ') + '], ' + title + ', ' + desc +')');
        title = (title === undefined) ? path[path.length - 1] : title;
        desc = (desc === undefined) ? '' : desc;
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var ppath = fpath.slice(0, fpath.length - 1);
        var pid = ppath.join('_');   
        if ($('#b' + fid, context).length === 0) {
            $('#w' + pid + ' .Footer', context).append("<input id='b" + fid + "' type='button' value='" + title + "' title='" + desc + "'/>");
            $('#b' + fid, context).css({'width': '80px', 'border': 'solid 1px #999999', 'margin': '2px', 'padding': '1px', 'background': '#cccccc', 'font-size': '12px', 'cursor': 'pointer', 'margin-left': '10px'});
            $('#b' + fid, context).hover(
                function(){ $('#b' + fid, context).css({'background': '#ccffcc'}); },
                function(){ 
                    $('#b' + fid, context).css({'background': '#cccccc'}); 
                    $('#b' + fid + '.Active', context).css({'background': '#ffffcc'}); 
                }
            );
            $('#b' + fid, context).addClass('Button');
        }
        return $('#b' + fid, context);
    }
    
    
    /** Создание опции в окне
    * @param Array path Путь
    * @param String title Заголовок
    * @param String desc Описание
    * @param String def По уиолчанию
    * @return jQuery
    */
    this.createWindowOption = function(path, title, desc, def) {
        //GM_log('UserScriptGUI.createWindowOption([' + path.join(', ') + '], ' + title + ', ' + desc +')');
        title = (title === undefined) ? path[path.length - 1] : title;
        desc = (desc === undefined) ? '' : desc;
        def = (def === undefined) ? '' : def;
        var name = path[path.length - 1];
        var value = GM_getValue(name, def);
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var ppath = fpath.slice(0, fpath.length - 1);
        var pid = ppath.join('_');   
        if ($('#o' + fid, context).length === 0) {
            $('#w' + pid + ' .Body', context).append("<div class='Option' id='o" + fid + "' title='" + desc + "'><input type='text' name='" + name + "' value='" + value + "' def='" + def + "'/><b style='color: #000000;'>" + title + "</b></div>");
            $('#o' + fid + ' input', context).css({'width': '100px', 'border': 'solid 1px #999999', 'margin': '2px', 'padding': '1px', 'background': '#ffffff', 'font-size': '12px', 'color': '#000000', 'margin-right': '10px'});
            $('#o' + fid, context).addClass('Option');
        }
        return $('#o' + fid, context);
    }
        
    
    /** Создание опции в окне (логического типа)
    * @param Array path Путь
    * @param String title Заголовок
    * @param String desc Описание
    * @param Boolean def По уиолчанию
    * @return jQuery
    */
    this.createWindowOptionBool = function(path, title, desc, def) {
        //GM_log('UserScriptGUI.createWindowOption([' + path.join(', ') + '], ' + title + ', ' + desc +')');
        title = (title === undefined) ? path[path.length - 1] : title;
        desc = (desc === undefined) ? '' : desc;
        def = (def === undefined) ? false : def;
        var name = path[path.length - 1];
        var value = GM_getValue(name, def);
        var valueStr = value ? 'true' : 'false';
        var defStr = def ? 'true' : 'false';
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var ppath = fpath.slice(0, fpath.length - 1);
        var pid = ppath.join('_');   
        //GM_log('path == [' + path.join(', ') + ']');
        //GM_log('fpath == [' + fpath.join(', ') + ']');
        //GM_log('ppath == [' + ppath.join(', ') + ']');
        if ($('#o' + fid, context).length === 0) {
            $('#w' + pid + ' .Body', context).append("<div class='OptionBool' id='o" + fid + "' title='" + desc + "'><input type='button' name='" + name + "' value='" + valueStr + "' def='" + defStr + "'/><b style='color: #000000;'>" + title + "</b></div>");
            $('#o' + fid + ' input', context).css({'width': '100px', 'color': '#000000', 'border': 'solid 1px #999999', 'margin': '2px', 'padding': '1px', 'background': '#cccccc', 'font-weight': 'bold', 'font-size': '12px', 'cursor': 'pointer', 'margin-right': '10px'});
            $('#o' + fid + ' input', context).click(function() {this.value = (this.value == 'true') ? 'false' : 'true';});
            $('#o' + fid, context).addClass('Option');
        }
        return $('#o' + fid, context);
    }
    
    
    /** Создание окна
    * @param Array path Путь
    * @param String title Заголовок
    * @param String content Содержание
    * @return jQuery
    */
    this.createWindow = function(path, title, content) {
        //GM_log('UserScriptGUI.createWindow([' + path.join(', ') + '], ' + title + ', ' + content + ')');
        title = (title === undefined) ? '' : title;
        content = (content === undefined) ? '' : content;        
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var ppath = fpath.slice(0, fpath.length - 1);
        var pid = ppath.join('_');        
        if ($('#w' + fid, context).length === 0) {
            $('#wUserScriptGUI', context).append(
                "<div id='w" + fid + "'>" + 
                    "<div class='Header' style='font-weight: bold; font-size: 14px; margin-bottom: 10px;'>" + title + "</div>" + 
                    "<div class='Body' style='text-align: left; background: #ffffff;'>" + content + "</div>" + 
                    "<div class='Footer' style='text-align: right; margin-top: 10px;'></div>" + 
                "</div>"
            );
            $('#w' + fid, context).css({'position': 'fixed', 'border': 'solid 2px #666666', 'background': '#ffffff', 'text-align': 'center', 'font-size': '12px', 'color': '#000000', 'padding': '10px', 'width': '320px', 'top': '80px'});
            $('#w' + fid, context).hide();
            $('#w' + fid, context).addClass('Window');
        }
        return $('#w' + fid, context);
    }
    
    
    /** Создание окна описания
    * @param Array path Путь
    * @return jQuery
    */
    this.createWindowDesc = function(path, params) {
        var win = this.createWindow(path, 'Описание');
        // <col width='25%'/><col width='75%'/>
        $('#' + win.attr('id') + ' .Body', context).append("<table></table>");
        
        function createLink(link, title) {
            if (link === undefined)
                return title;
            if (title === undefined)
                return "<a href='" + link + "'>" + link + "</a>";
            return "<a href='" + link + "'>" + title + "</a>";
        }
        
        var data = {};
        if (params.title !== undefined) {data.title = {name: 'Скрипт', value: params.title}};
        if (params.version !== undefined) {data.version = {name: 'Версия', value: params.version}};
        if (params.hint !== undefined) {data.hint = {name: 'Описание', value: params.hint}};
        if (params.details !== undefined) {data.details = {name: 'Детали', value: params.details}};
        if (params.homepage !== undefined) {data.homepage = {name: 'Домашняя страница', value: createLink(params.homepage.link, params.homepage.title)}};
        if (params.author !== undefined) {data.author = {name: 'Автор', value: createLink(params.author.link, params.author.title)}};
        if (params.license !== undefined) {data.license = {name: 'Лицензия', value: createLink(params.license.link, params.license.title)}};
        if (params.updated !== undefined) {data.updated = {name: 'Обновлено', value: params.updated}};
        
        for (var i in data) {
            if (data[i].name !== undefined) {
                var row = "<tr><th>" + data[i].name + "</th><td>" + data[i].value + "</td></tr>";
            } else {
                var row = "<tr><td colspan='2'>" + data[i].value + "</td></tr>";
            }
            $('#' + win.attr('id') + ' .Body table', context).append(row);
        }
        
        $('#' + win.attr('id'), context).css({'width': '480px'});
        $('#' + win.attr('id') + ' .Body table', context).css({'width': '100%', 'border': 'none'});
        $('#' + win.attr('id') + ' .Body th', context).css({'color': '#000000', 'font-size': '12px', 'text-align': 'left', 'vertical-align': 'top'});
        $('#' + win.attr('id') + ' .Body td', context).css({'color': '#000000', 'font-size': '12px', 'text-align': 'left', 'vertical-align': 'top'});
        $('#' + win.attr('id') + ' .Body a', context).css({'color': 'blue', 'font-size': '12px', 'text-decoration': 'none'});
        
        var bClose = this.createWindowButton(path.concat(['Close']), 'Закрыть');
        bClose.click( function(){ self.toggleWindow(path); } );
        return win;
    }
    
    
    /** Создание окна конфигурации
    * @param Array path Путь
    * @param Object options Опции
    * @return jQuery
    */
    this.createWindowConf = function(path, options) {
        var win = this.createWindow(path, 'Конфигурация');     
        
        for (var i in options) {
            var opath = path.concat(i);
            switch (options[i].type) {
                case 'bool':
                    this.createWindowOptionBool(opath, options[i].title, options[i].desc, options[i].def);
                    break;
                default:
                    this.createWindowOption(opath, options[i].title, options[i].desc, options[i].def);
            }
        }
        
        var bSave = this.createWindowButton(path.concat(['Save']), 'Сохранить');
        var bClose = this.createWindowButton(path.concat(['Close']), 'Закрыть');
        var self = this;
        bSave.click( function(){ self.saveWindowConf(path); self.toggleWindowConf(path); } );
        bClose.click( function(){ self.toggleWindowConf(path); } );
        return win;
    }
    
    
    /** Создание окна отладки
    * @param Array path Путь
    * @return jQuery
    */
    this.createWindowDebug = function(path) {
        var win = this.createWindow(path, 'Отладка');
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        
        $('#w' + fid + ' .Body', context).css({'overflow': 'auto', 'max-height': '480px', 'border': 'solid 1px #cccccc'});
        
        var bReset = this.createWindowButton(path.concat(['Reset']), 'Сбросить');
        var bClose = this.createWindowButton(path.concat(['Close']), 'Закрыть');
        bReset.click( function(){ self.resetWindowDebug(path); self.toggleWindowDebug(path); } );
        bClose.click( function(){ self.toggleWindowDebug(path); } );
        return win;
    }
    
    
    /** Переключение окна
    * @param Array path Путь
    */
    this.toggleWindow = function(path) {
        //GM_log('UserScriptGUI.toggleWindow([' + path.join(', ') + '])');
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var show = ($('#w' + fid, context).css('display') == 'none');
        $('#libUserScriptGUI .Window', context).hide();
        if (show) {
            $('#w' + fid, context).show();
        }
        var selfWidth = parseInt($('#w' + fid, context).css('width'));
        var bodyWidth = $('body', context).width();
        var left = (bodyWidth - selfWidth) / 2;
        $('#w' + fid, context).css({'left': left + 'px'});
    }
    
    
    /** Переключение окна конфигурации
    * @param Array path Путь
    */
    this.toggleWindowConf = function(path) {
        this.toggleWindow(path);
        this.updateWindowConf(path);
    }
    
    
    /** Переключение окна отладки
    * @param Array path Путь
    */
    this.toggleWindowDebug = function(path) {
        this.toggleWindow(path);
        this.updateWindowDebug(path);
    }
    
    
    /** Сохранение окна конфигурации
    * @param Array path Путь
    */
    this.saveWindowConf = function(path) {
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var inputs = $('#w' + fid + ' .Body input[type="text"]', context);
        var values = [];
        var aligns = {name: 'right', value: 'left'};
        for (var i = 0; i < inputs.length; i++) {
            var name = inputs[i].name;
            var value = inputs[i].value;
            GM_setValue(name, value);
            values[values.length] = {indent: '    ', name: name + ':', value: value};
        }
        var inputs = $('#w' + fid + ' .Body input[type="button"]', context);
        for (var i = 0; i < inputs.length; i++) {
            var name = inputs[i].name;
            var value = (inputs[i].value == 'true');
            GM_setValue(name, value);
            values[values.length] = {indent: '    ', name: name + ':', value: value};
        }
        GM_log(Time.toString() + ' ' + 'Сохранение значений:' + '\n' + String.fromObjects(values, aligns));
    }
    
    
    /** Сброс окна отладки
    * @param Array path Путь
    */
    this.resetWindowDebug = function(path) {
        var list = GM_listValues();
        var values = [];
        for (var i = 0; i < list.length; i++)
            GM_deleteValue(list[i]);
        this.updateWindowDebug(path);
    }
    
    
    /** Обновление окна отладки
    * @param Array path Путь
    */
    this.updateWindowDebug = function(path) {
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        if ($('#w' + fid, context).css('display') == 'none') 
            return false;
        
        var list = GM_listValues();
        var values = [];
        for (var i = 0; i < list.length; i++)
            values[values.length] = {indent: '    ', name: list[i] + ':', value: GM_getValue(list[i])};
        var aligns = {name: 'right', value: 'left'};        
        GM_log(Time.toString() + ' ' + 'Список сохраненных значений:' + '\n' + String.fromObjects(values, aligns));
        
        $('#w' + fid + ' .Body', context).html('');
        $('#w' + fid + ' .Body', context).append('<table><tr><th>Переменная</th><th>Значение</th></tr></table>');
        $('#w' + fid + ' .Body table', context).css({'width': '100%'});
        for (var i = 0; i < list.length; i++)
            $('#w' + fid + ' .Body table', context).append('<tr><td class="Name">' + list[i] + '</td><td class="Value">' + GM_getValue(list[i]) + '</td></tr>');
        $('#w' + fid + ' .Body table *', context).css({'font-face': 'Courier New', 'font-size': '10px', 'color': '#000000'});
        $('#w' + fid + ' .Body table td.Name', context).css({'text-align': 'right', 'padding-right': '10px'});
        $('#w' + fid + ' .Body table td.Value', context).css({'white-space': 'pre'});
        $('#w' + fid + ' .Body table th', context).css({'font-weight': 'bold'});
        
        return true;
    }
    
    
    /** Обновление окна конфигурации
    * @param Array path Путь
    */
    this.updateWindowConf = function(path) {
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        if ($('#w' + fid, context).css('display') == 'none') 
            return false;
        
        var inputs = $('#w' + fid + ' .Body .Option input', context);
        for (var i = 0; i < inputs.length; i++) {
            var def = inputs[i].attributes['def'].value;
            var value = GM_getValue(inputs[i].name, def);
            inputs[i].value = value;
        }
        
        var inputs = $('#w' + fid + ' .Body .OptionBool input', context);
        for (var i = 0; i < inputs.length; i++) {
            var def = (inputs[i].attributes['def'].value == 'true');
            var value = GM_getValue(inputs[i].name, def);
            var valueStr = value ? 'true' : 'false';
            inputs[i].value = valueStr;
        }
        
        return true;
    }
    
    
    /** Создание набора по умолчанию
    * @param Object desc
    * @param Object conf
    */
    this.createDefaultSet = function(desc, conf) {
        var name = GM_info.script.name.replace(/\s/g, '');
        var title = GM_info.script.name;
        var hint = GM_info.script.description;
        var version = GM_info.script.version;
        
        desc = (desc === undefined) ? {} : desc;
        desc.title = (desc.title === undefined) ? title : desc.title;
        desc.hint = (desc.hint === undefined) ? hint : desc.hint;
        desc.version = (desc.version === undefined) ? version : desc.version;
        
        conf = (conf === undefined) ? {} : conf;
        
        var bScript = this.createMenuButton(['Scripts', name], title, hint);
        var bDesc = this.createMenuButton(['Scripts', name, 'Desc'], 'Описание');
        var bConf = this.createMenuButton(['Scripts', name, 'Conf'], 'Конфигурация');
        var bDebug = this.createMenuButton(['Scripts', name, 'Debug'], 'Отладка');
        
        var wDesc = this.createWindowDesc([name, 'Desc'], desc);
        var wConf = this.createWindowConf([name, 'Conf'], conf);
        var wDebug = this.createWindowDebug([name, 'Debug']);
        
        bDesc.click(function() { self.toggleWindow([name, 'Desc']); self.toggleMenu(); });
        bConf.click(function() { self.toggleWindowConf([name, 'Conf']); self.toggleMenu(); });
        bDebug.click(function() { self.toggleWindowDebug([name, 'Debug']); self.toggleMenu(); });
        
    }
    
    
    /** Создание всплывающего окна
    * @param Array path Путь
    * @param String title Заголовок
    * @param String content Содержание
    * @return jQuery
    */
    this.createPopup = function(path, title, content) {
        //GM_log('UserScriptGUI.createPopup([' + path.join(', ') + '], ' + title + ', ' + content + ')');
        title = (title === undefined) ? '' : title;
        content = (content === undefined) ? '' : content;        
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        
        this.destroyPopup(path);
        $('#pUserScriptGUI', context).prepend(
            "<div id='p" + fid + "' class='Popup'>" + 
                "<div class='Header' style='font-weight: bold; font-size: 14px; margin-bottom: 10px;'>" + title + "</div>" + 
                "<div class='Body' style='text-align: left; background: #ffffff;'>" + content + "</div>" + 
                "<div class='Footer' style='text-align: right; margin-top: 10px;'></div>" + 
            "</div>"
        );
        $('#p' + fid, context).css({'border': 'solid 1px #666666', 'background': '#ffffff', 'text-align': 'center', 'font-size': '12px', 'color': '#000000', 'padding': '5px', 'margin': '0px', 'margin-bottom': '10px'});
        $('#p' + fid + ' .Footer', context).append("<a class='Close'>Закрыть</a>");
        $('#p' + fid + ' .Footer .Close', context).css({'font-style': 'italic', 'cursor': 'pointer'});
        $('#p' + fid + ' .Footer .Close', context).click(function() { self.destroyPopup(path); });
        $('#p' + fid, context).attr('popupClass', path[path.length - 1]);
        
        return $('#p' + fid, context);
    }
    
    
    /** Извлечение всплывающего окна
    * @param Array path Путь
    * @return jQuery
    */
    this.getPopup = function(path) {
        //GM_log('UserScriptGUI.getPopup([' + path.join(', ') + '])');
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        return $('#p' + fid, context);
    }
    
    
    /** Удаление всплывающего окна
    * @param Array path Путь
    * @return jQuery
    */
    this.destroyPopup = function(path) {
        //GM_log('UserScriptGUI.destroyPopup([' + path.join(', ') + '])');
        var fpath = ['UserScriptGUI'].concat(path);
        var fid = fpath.join('_');
        var popup = $('#p' + fid, context);
        popup.remove();
    }
    
    
    /** Удаление класса всплывающих окон
    * @param String popupClass Класс
    * @return jQuery
    */
    this.destroyPopupClass = function(popupClass) {
        //GM_log('UserScriptGUI.destroyPopupClass(' + className + ')');
        if (popupClass === undefined) {
            var popup = $('#pUserScriptGUI *', context);
        } else {
            var popup = $('#pUserScriptGUI [popupClass="' + popupClass + '"]', context);
        }
        popup.remove();
    }
    
    
    /** Установка таймера на всплывающем окне
    * @param String id
    * @param String text
    */
    this.setPopupTimer = function(id, text) {
        var popup = tgui.getPopup(['Timer']);
        if (popup.length === 0)
            popup = tgui.createPopup(['Timer'], 'Таймеры', '<ul></ul>');
        var row = $('.Body li#' + id, popup);
        if (row.length === 0)
            $('.Body ul', popup).append('<li id="' + id + '"></li>');
        $('.Body li#' + id, popup).html(text);
    }
        
    
    /** Установка набора на всплывающем окне
    * @param String id
    * @param String text
    */
    this.setPopupSet = function(id, text) {
        var popup = tgui.getPopup(['Set']);
        if (popup.length === 0)
            popup = tgui.createPopup(['Set'], 'Наборы', '<ul></ul>');
        var row = $('.Body li#' + id, popup);
        if (row.length === 0)
            $('.Body ul', popup).append('<li id="' + id + '"></li>');
        $('.Body li#' + id, popup).html(text);
    }
    
    
    /** Удаление таймера на всплывающем окне
    * @param String id
    */
    this.unsetPopupTimer = function(id) {
        var popup = tgui.getPopup(['Timer']);
        if (popup.length > 0)
            $('.Body li#' + id, popup).remove();
    }
    
    // Атрибуты скрипта
    this.scriptName = GM_info.script.name.replace(/\s/g, '');
    this.scriptTitle = GM_info.script.name;
    this.scriptHint = GM_info.script.description;
    this.scriptVersion = GM_info.script.version;
    
    // Инициализация
    if ($('#libUserScriptGUI', context).length === 0) {
        $('body', context).append("<div id='libUserScriptGUI'/>");
        $('#libUserScriptGUI', context).append("<div id='mUserScriptGUI'/>");
        $('#libUserScriptGUI', context).append("<div id='pUserScriptGUI'/>");
        $('#libUserScriptGUI', context).append("<div id='wUserScriptGUI'/>");
        $('#mUserScriptGUI', context).css({'position': 'fixed', 'top': '5px', 'right': '5px'});
        $('#pUserScriptGUI', context).css({'position': 'fixed', 'top': '0px', 'left': '0px', 'width': '420px'});
        //$('#wUserScriptGUI', context).css();
        var bScripts = this.createMenuButton(['Scripts'], 'Скрипты', 'Быстрый и удобный доступ к конфигурации пользовательских скриптов.');
        var bPopup = this.createMenuButton(['Popup'], 'Сообщения', 'Показать/спрятать всплывающие сообщения.');
        bPopup.click(function() { $('#pUserScriptGUI', context).toggle(); });
    }
    return this;
    
}



/** Менеджер фреймов
*
* @file libUserScriptFrameManager.js
* @version 1.2.0
* @author hotamateurxxx
* @license GPL
*/


/** Менеджер фреймов
* @param Document context
*/
function UserScriptFrameManager(context) {
    
    
    /** Разрешение конфликта имен для обработчиков
    * @var UserScriptFrameManager
    */
    var self = this;
    
    
    /** Документ
    * @var contextument
    */
    this.context = context;    
    
    
    /** Доступ к фрейму
    * @param String id
    * @return jQuery
    */
    this.getFrame = function(id) {
        return $('#' + id, context);
    }
    
    
    /** Проверка наличия фрейма
    * @param String id
    * @return Bool
    */
    this.hasFrame = function(id) {
        var iframe = $('#' + id, context);
        if (iframe.length > 0)
            return true;
        return false;
    }
    
    
    /** Удаление фрейма
    * @param String id
    */
    this.removeFrame = function(id) {
        var iframe = $('#' + id, context);
        if (iframe.length > 0)
            iframe.remove();
    }
    
    
    /** Создание фрейма
    * @param String id
    * @param String type
    * @param String url
    * @return jQuery
    */
    this.createFrame = function(id, type, url) {
        //GM_log('id == ' + id + ', type == ' + type + ', url == ' + url);
        var iframe = $('#' + id, context);
        if (iframe.length === 0) {
            // Создание фрейма
            $('#libUserScriptFrame', context).append('<iframe id="' + id + '" src="' + url + '" type="' + type + '"></iframe>');
        }
        return $('#' + id, context);
    }
    
    
    /** Перезагрузка фрейма
    * @param String id
    * @param Number delay
    */
    this.reloadFrame = function(id, delay) {
        if (delay === undefined) {
            // Обновление фрейма
            try {
                var iframe = $('#' + id, context);
                var url = iframe.attr('src');
                if (iframe.length === 0)
                    throw new Error('Сработало обновление уже не существующего фрейма.');
                var doc = iframe.prop('contentDocument');
                var win = iframe.prop('contentWindow');
                if (win.location !== null)
                    if (win.location.href == url) {
                        win.location.reload(true);
                    } else {
                        win.location.replace(url);
                    }
            } catch (e) {
                GM_log(Time.toString() + ' ' + 'Ошибка перезагрузки фрейма:' + '\n' + e.message + '\n' + iframe.src);
            }
        } else {
            var self = this;
            setTimeout(function(){ self.reloadFrame(id); }, delay);
        }
    }
    
    
    /** Удаление фреймов по типу
    * @param String type
    */
    this.removeFramesByType = function(type) {
        var iframes = $('#libUserScriptFrame [type="' + type + '"]', context);
        if (iframes.length > 0)
            iframes.remove();
    }
    
    
    /** Навешивание обработчика
    * @param String id
    * @param String event
    * @param Function handler
    */
    this.bindFrameHandler = function(id, event, handler) {
        $('#' + id, context).bind(event, handler);
    }
    
    
    // Инициализация
    if ($('#libUserScriptFrame', context).length === 0) {
        $('body', context).append("<div id='libUserScriptFrame'/>");
        $('#libUserScriptFrame', context).hide();
    }
    return this;
    
}



/** 
* @file libObjectPreviewGUI.js
* @version 2.1.13
* @author DrunkenStranger
* @link http://userscripts.org/users/362572
* @license GPL
*/


/** Интерфейс предпросмотра объекта
* @param String ref
* @param Boolean autoclose
*/
function UIObjectPreview(ref, autoclose) {
    
    
    /** Переключение предпросмотра
    * @param Node refNode
    * @param Number objectId
    */
    function togglePreview(refNode, objectId) {
        //GM_log('togglePreview(refNode, ' + objectId + ')');
        
        /** Проверка видимости блока
        * @param Node block
        * @return Boolean
        */
        function previewIsVisible(block) {
            if (block.style.display == 'none')
                return false;
            return true;
        }
        
        /** Установка смещения блока
        * @param Node block
        * @param Node refNode
        */
        function previewSetOffset(block, refNode) {
            var divContent = block.childNodes[1];
            if (divContent.firstChild.tagName == 'TD') {
                Offset.set(block, {left: -1, top: refNode.parentNode.clientHeight}, refNode.parentNode);
            } else {
                Offset.set(block, {left: 5, top: 15}, refNode);
            }
        }
        
        /** Отображение блока
        */
        function previewShow(block) {
            if (autoclose) {
                var nodes = container.childNodes;
                for (var i = 0; i < nodes.length; i++)
                    nodes[i].style.display = 'none';
            }
            block.style.display = 'block';
        }
        
        /** Сокрытие блока
        */
        function previewHide(block) {
            block.style.display = 'none';
        }
        
        
        /** Создание предпросмотра
        */
        function previewCreate() {
            
            /** Обработчик загрузки фрейма
            * @param Document frameDoc Загруженный документ
            * @param Node block Блок в который будет импортироваться содержимое
            * @param Node refNode
            */
            function onFrameLoad(frameDoc, block, refNode) {
                var divCtrls = block.childNodes[0];
                var divContent = block.childNodes[1];
            
                var page = new PageObjectInfo(frameDoc);
                page.parse();
                
                if (page.state === 1) {
                
                    page.truncateContent();
                    
                    var contentNode = refNode.ownerDocument.importNode(page.nodes.content, true);
                    contentNode.style.backgroundColor = '#ffffff';
                    contentNode.style.width = '640px';
                    
                    // <img width="200" height="150" title="Кузница щитов хранителя" alt="Кузница щитов хранителя" src="http://dcdn.heroeswm.ru/i/objs/factory.jpg?v=1">
                    var imgs = contentNode.getElementsByTagName('img');
                    for (var i = 0; i < imgs.length; i++) {
                        var re = /i\/objs\/(.+).jpg\?v=(\d+)/ig;
                        if (re.test(imgs[i].src)) {
                            imgs[i].width = Math.floor(parseInt(imgs[i].width) * 0.75);
                            imgs[i].height = Math.floor(parseInt(imgs[i].height) * 0.75);
                        }
                    }
                    
                    divCtrls.style.display = 'block';
                    divContent.appendChild(contentNode);
                    delete divContent.removeChild(divContent.firstChild);
                    
                    if (previewIsVisible(block)) {
                        previewHide(block);
                        previewSetOffset(block, refNode);
                        previewShow(block);
                    }
                
                } else {
                
                    divCtrls.style.display = 'none';
                    divContent.childNodes[0].textContent = 'Ошибка.';
                    divContent.childNodes[0].style.display = 'block';
                
                }
                
            }
            
            function createPopup() {
                var result = refNode.ownerDocument.createElement('div');
                result.style.display = 'block';
                result.style.position = 'absolute';
                return container.appendChild(result);
            }
            
            function createCtrlRefresh() {
                var result = refNode.ownerDocument.createElement('i');
                result.style.cursor = 'pointer';
                result.style.marginRight = '10px';
                result.textContent = 'Обновить';
                Event.add(
                    result, 'click', 
                    function() {
                        delete block.parentNode.removeChild(block);
                        togglePreview(refNode, objectId);
                    }
                );
                return result;
            }
            
            function createCtrlClose() {
                var result = refNode.ownerDocument.createElement('i');
                result.style.cursor = 'pointer';
                result.textContent = 'Закрыть';
                Event.add(
                    result, 'click', 
                    function() {
                        togglePreview(refNode, objectId);
                    }
                );
                return result;
            }
            
            var block = createPopup();
            block.id = popupId;
            block.style.borderStyle = 'solid';
            block.style.borderWidth = '1px';
            block.style.borderColor = '#666666';
            block.style.backgroundColor = '#ffffff';
            block.style.overflow = 'auto';
            block.style.display = 'none';
            
            var divCtrls = ref.ownerDocument.createElement('div');
            divCtrls.style.display = 'none';
            divCtrls.style.padding = '2px';
            divCtrls.style.textAlign = 'right';
            divCtrls.appendChild(createCtrlRefresh());
            divCtrls.appendChild(createCtrlClose());
        
            var divContent = ref.ownerDocument.createElement('div');
            divContent.style.padding = '5px';
            
            var p = ref.ownerDocument.createElement('p');
            p.style.margin = '0pt';
            p.style.padding = '0pt';
            p.style.paddingLeft = '10px';
            p.style.paddingRight = '10px';
            p.textContent = 'Загрузка...';
            
            divContent.appendChild(p);        
            block.appendChild(divCtrls);
            block.appendChild(divContent);
            
            frameManager.removeFrame('iframe_' + popupId);
            var iframe = frameManager.createFrame('iframe_' + popupId, 'objectInfo', popupRef);
            iframe.attr('objectId', objectId);
            iframe.bind('load', function(){ 
                onFrameLoad(iframe.prop('contentDocument'), block, refNode); 
                
            });
            
            togglePreview(refNode, objectId);
        }
        
        
        // Идентификатор и ссылка всплывающего окна
        var popupId = 'popupObject_' + 'id_' + objectId;
        var popupRef = 'http://' + ref.ownerDocument.location.hostname + '/object-info.php?id=' + objectId;

        // А может всплывающее окно уже создано?
        var block = refNode.ownerDocument.getElementById(popupId);       
        if (block) {
            if (previewIsVisible(block)) {
                previewHide(block);
            } else {
                previewSetOffset(block, refNode);
                previewShow(block);
            }
        } else {
            previewCreate();
        }
        
    }
    
    
    /** Прицепление предпросмотра к узлу
    * @param Node node
    * @param Number objectId
    */
    function attachPreview(refNode, objectId) {
        $(refNode).click( function() {togglePreview(refNode, objectId);} );
    }
    
    
    // Значения по умолчанию
    if (autoclose === undefined)
        autoclose = true;
    
    
    // Определение номера объекта по ссылке
    var res = /object-info.php\?id=(\d+)/ig.exec(ref.href);
    if (res === null)
        return false;
    
    var objectId = parseInt(res[1]);
    //GM_log('ref.href == ' + ref.href);
    //GM_log('objectId == ' + objectId);
    
    
    // Контейнер блоков предпросмотра
    var container = ref.ownerDocument.getElementById('objectPreview');
    if (container === null) {
        container = ref.ownerDocument.createElement('div');
        container.id = 'objectPreview';
        ref.ownerDocument.body.appendChild(container);
    }
    
    
    // Менеджер фреймов
    var frameManager = UserScriptFrameManager(ref.ownerDocument);

    
    // Навешивание предпросмотра
    if (ref.style.textDecoration != 'none') {

        ref.style.textDecoration = 'none';
        var sup = ref.ownerDocument.createElement('sup');
        sup.style.cursor = 'pointer';
        sup.title = 'Предпросмотр';
        var img = ref.ownerDocument.createElement('img');
        img.src = 'http://im.heroeswm.ru/i/top/line/pismo.gif';
        sup.appendChild(img);
        ref.parentNode.insertBefore(sup, ref.nextSibling);
        attachPreview(sup, objectId);

    }
    
}



/** Функции работы с состоянием страницы
*
* @file libPageState.js
* @version 1.0.1
* @author hotamateurxxx
* @license GPL
*/


/**
*/
function PageState() {}


/** Представление в строке
* @param Number state
* @return String
*/
PageState.getStateTitle = function(state) {
    if (state === undefined)
        state = 1;
    switch (state) {
        case 1: return 'Страница загружена';
        case 2: return 'Технические проблемы';
        case 4: return 'Вы не авторизированы';
        case 5: return 'Герой в битве';
        case 6: return 'Герой за карточным столом';
        case 7: return 'Герой путешествует';
        default: return 'Неизвестное состояние';
    }
}


/** Заголовок страницы
* @param String href
* @param Number state
* @return String
*/
PageState.getPageTitle = function(href, state) {
    if (state === undefined)
        state = 1;
    if (state > 1)
        return this.getStateTitle(state);
    return 'Герои войны и денег';
}



/** Функции работы с GreaseMonkey
*
* @file libGreaseMonkey.js
* @version 1.0.0
* @author hotamateurxxx
* @license GPL
*/


/**
*/
function GreaseMonkey() {};


/** HTTP запрос
* @param Object details
*/
GreaseMonkey.xmlhttpRequest = function (details) {
    details.overrideMimeType = 'text/html; charset=windows-1251';
    if (details.headers === undefined)
        details.headers = {};
    details.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return GM_xmlhttpRequest(details);
}


/** Вывод в лог
* @param String text
*/
GreaseMonkey.log = function (text) {
    GM_log(Time.toString() + ' ' + text);
}


/** Загрузка объекта
* @param String key
* @param Object def
* @return Object
*/
GreaseMonkey.loadObject = function(key, def) {
    
    var str = GM_getValue(key, null);
    if (str === null)
        return def;
    
    var obj = {};
    var arr1 = str.split('|');
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        var attrName = arr2[0];
        var attrValue = arr2[1];
        if (obj[attrName] !== undefined)
            continue;
        switch (attrName) {
            default: obj[attrName] = attrValue;
        }
    }
    
    return obj;
    
}


/** Сохранение объекта
* @param String key
* @param Object obj
*/
GreaseMonkey.saveObject = function(key, obj) {    
    
    var str = '';
    for (var i in obj) {
        var attrName = i;
        var attrValue = obj[i];
        switch (attrName) {
            default: str += '|' + attrName + '=' + attrValue;
        }
    }
    str = str.substr(1);
    GM_setValue(key, str);
    
}



/** 
* @file page.js
* @version 2.3.10
* @author hotamateurxxx
* @link http://userscripts.org/users/362572
* @license GPL
*/


/** Страница
* @param Document doc 
* @param Game game
* @link http://heroeswm.ru/*
*/
function Page(doc, game) {

    this.doc = doc;
    this.game = game;

    this.nodes = {
        balance: null,
        time: null,
        online: null,
        buttons: null
    };

    this.state = 0;
    this.time = new Date();
    this.online = null;
    this.hero = null;
    this.heroHP = null;
    this.heroMP = null;
    this.heroMPMax = null;
    if (this.game !== undefined)
        this.hero = new Hero(this.game);
        
    this.groupJoinHunt = false;

    this.reloadSender = null;
    this.reloadTime = null;
    this.reloadDelay = null;
    this.reloadReason = null;
    this.reloadTimer = null;
    
}


/** Урезание страницы
* @return Boolean Результат
*/
Page.prototype.truncate = function() {
    
    try {
    
        // Удаляем верхний колонтитул
        var node = XPath.findFirst('/html/body/table', this.doc);
        if (node === null)
            throw new Error('Не могу найти верхний колонтитул для урезания');
        delete node.parentNode.removeChild(node);
        
        // Удаляем пользовательские ссылки
        var node = XPath.findFirst('/html/body/center/center', this.doc);
        if (node === null)
            throw new Error('Не могу найти пользовательские ссылки для урезания');
        delete node.parentNode.removeChild(node);
    
    } catch (e) {
        
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
    
    }
    
    return true;
    
}


/** Парсинг страницы
* @return Boolean Результат
*/
Page.prototype.parse = function() {
    
    
    if (this.doc == null) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Тело документа отсутствует');
        GM_log('this.doc.innerHTML == ' + this.doc);
        this.state = -1;
        return false;
    }
    
    if (this.doc.body == null) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Тело документа отсутствует');
        GM_log('this.doc.body == ' + this.doc.body);
        this.state = -1;
        return false;
    }
    
    if (this.doc.body.innerHTML == null) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Тело документа отсутствует');
        GM_log('this.doc.body.innerHTML == ' + this.body.doc.innerHTML);
        this.state = -1;
        return false;
    }
    
    if (this.parseTechnicalProblems()) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Игра остановлена');
        this.state = 2;
        return false;
    }
    
    if (this.parseQRATOR()) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'QRATOR HTTP 500');
        this.state = 3;
        return false;
    }

    if (this.parseLogin()) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Вы не авторизированы');
        this.state = 4;
        return false;
    }
    
    if (this.parseBattle()) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Герой находится в битве');
        this.state = 5;
        return false;
    }
    
    if (this.parseCardGame()) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Герой находится за карточным столом');
        this.state = 6;
        return false;
    }
    
    if (this.parseTravel()) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Герой путешествует');
        this.state = 7;
        return false;
    }
    
    if (this.parseBattleFinished()) {
        GM_log(Time.toString() + ' ' + this + '\n' + 'Страница обращается к уже законченной битве');
        this.state = 8;
        return false;
    }
    
//    if (!this.parseHP()) {
//        GM_log(Time.toString() + ' ' + this + '\n' + 'Ошибка распознавания здоровья');
//        this.state = -1;
//        return false;
//    }
    
//    if (!this.parseMP()) {
//        GM_log(Time.toString() + ' ' + this + '\n' + 'Ошибка распознавания маны');
//        this.state = -1;
//        return false;
//    }
    
    try {

        if (!this.parseBalance())
            throw new Error('Ошибка распознавания баланса');
        
        if (!this.parseTime())
            throw new Error('Ошибка распознавания времени');
        
        if (!this.parseOnline())
            throw new Error('Ошибка распознавания онлайна');
    
        if (!this.parseButtons())
            throw new Error('Ошибка распознавания кнопок');
    
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        if (this.doc.location !== null)
            GM_log('this.doc.location.href == ' + this.doc.location.href);
        GM_log('this.doc.body.innerHTML == ' + this.doc.body.innerHTML);
        this.state = -1;
        return false;
    
    }
    
    this.state = 1;
    return true;
    
}


/** Парсит страницу на предмет сообщения об остановленной игре
* @return Boolean Резльтат
*/
Page.prototype.parseTechnicalProblems = function() {
    var msgs = [
        'Извините, страница недоступна. Игра остановлена.',
        'MySQL server Error. Подождите или нажмите Ctrl+F5'
    ];
    for (var i = 0; i < msgs.length; i++) {
        var re = new RegExp(msgs[i], 'ig');
        if (re.test(this.doc.body.textContent))
            return true;
    }
    return false;
}


/** Парсит страницу на предмет сообщения QRATOR HTTP 500
* @return Boolean Резльтат
*/
Page.prototype.parseQRATOR = function() {
    if (/QRATOR\s+HTTP\s+(\d+)/ig.test(this.doc.body.innerHTML))
        return true;
    return false;
}


/** Парсит страницу на предмет отсутствия авторизации
* @return Boolean Резльтат
*/
Page.prototype.parseLogin = function() {
    var form = null;
    for (var i = 0; i < document.forms.length; i++) {
        if (document.forms[i].name == 'log') {
            form = document.forms[i];
            break;
        }
    }
    if (form !== null)
        return true;
    return false;
}


/** Парсит страницу на предмет битвы
* @return Boolean Резльтат
*/
Page.prototype.parseBattle = function() {
    var node = XPath.findFirst('//object[@id="combat2"]', this.doc);
    return (node !== null);
}


/** Парсит страницу на предмет завершенной битвы
* @return Boolean Резльтат
*/
Page.prototype.parseBattleFinished = function() {
    var node = XPath.findFirst('//object[@id="combat2"]', this.doc);
    return (node !== null);
}


/** Парсит страницу на предмет карточной игры
* @return Boolean Резльтат
*/
Page.prototype.parseCardGame = function() {
    var node = XPath.findFirst('//object[@id="arcomag"]', this.doc);
    return (node !== null);
}


/** Парсит страницу на предмет путешествия
* @return Boolean Резльтат
*/
Page.prototype.parseTravel = function() {
    var node = XPath.findFirst('/html/body/center/table/tbody/tr/td/center', this.doc);
    if (node === null)
        return false;
    var re = new RegExp('Во время пути Вам доступны');
    if (re.test(node.textContent))
        return true;
    return false;
}


/** Парсинг баланса героя
*/
Page.prototype.parseBalance = function() {

    try {
    
        var xpath = '/html/body/table/tbody/tr/td/table/tbody/tr/td[6]/table/tbody/tr[2]/td/table/tbody/tr/td[2]/table/tbody/tr';
        var node = XPath.findFirst(xpath, this.doc);
        if (node == null) throw new Error('Узел по пути \'' + xpath + '\' не найден');
        this.nodes.balance = node;
        
        if (this.game !== undefined) {
            this.hero.balance = Price.fromNode(this.game, this.nodes.balance);
            this.hero.loadBalance();
        }
    
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
    
    }
    
    return true;
    
}


/** Парсинг времени
* @return Boolean
*/
Page.prototype.parseTime = function() {

    try {
        var xpath = '/html/body/table/tbody/tr/td/table/tbody/tr/td[9]/table/tbody/tr/td';
        var node = XPath.findFirst(xpath, this.doc);
        if (node == null) throw new Error('Узел по пути \'' + xpath + '\' не найден');
        this.nodes.time = node;
        
        var matches = /(\d+):(\d+)/g.exec(this.nodes.time.textContent);
        if (matches !== null)
            this.time.setHours(matches[1], matches[2]);
        
        
    } catch (e) {
        
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
    
    }
    
    return true;

}


/** Парсинг онлайна
*/
Page.prototype.parseOnline = function() {

    try {
    
        var xpath = '/html/body/table/tbody/tr/td/table/tbody/tr/td[9]/table/tbody/tr/td';
        var node = XPath.findFirst(xpath, this.doc);
        if (node == null) throw new Error('Узел по пути \'' + xpath + '\' не найден');
        this.nodes.online = node;
        
        var matches = /(\d+):(\d+),\s*(\d+)\s*online/g.exec(this.nodes.online.textContent);
        if (matches !== null)
            this.online = Number(matches[3]);
        
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
    
    }
    
    return true;

}


/** Парсинг HP
*/
Page.prototype.parseHP = function() { return true;}


/** Парсинг MP
*/
Page.prototype.parseMP = function() { return true;}


/** Парсинг кнопок
*
* Кнопки "Персонаж", "Битвы" и т.д. вверху каждой страницы.
*/
Page.prototype.parseButtons = function() {
    
    try {
        
        var xpath = '/html/body/table/tbody/tr/td/table/tbody/tr[3]/td/table/tbody/tr/td[4]/table';
        var node = XPath.findFirst(xpath, this.doc);
        if (node == null) throw new Error('Узел по пути \'' + xpath + '\' не найден');
        
        var cellHunt = node.rows[0].cells[4];
        var refs = cellHunt.getElementsByTagName('A');
        for (var i = 0; i < refs.length; i++)
            if (Page.isGroupWarsHuntURL(refs[i].href))
                this.groupJoinHunt = true;
        
        this.nodes.buttons = node;
        
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
    
    }
    
    return true;
    
}


/** Задание времени обновления
*/
Page.prototype.setReloadTime = function(sender, time, reason) {

    var delay = time.getTime() - (new Date()).getTime();
    this.setReloadDelay(sender, delay, reason);

}


/** Задание задержки перед обновлением
*/
Page.prototype.setReloadDelay = function(sender, delay, reason) {

    if (reason === undefined)
        reason = 'Неизвестно';

    var reloadTime = new Date((new Date()).getTime() + delay);
    
    if (
        (this.reloadTime != null) && 
        (this.reloadTime < reloadTime)
    ) {
        // К этому моменту страница уже будет перезагружена
        return false;
    }

    // Удаляем старый таймер перезагрузки
    if (this.reloadTimer != null)
        this.unsetReload();

    // Устанавливаем новый таймер перезагрузки
    var page = this;
    this.reloadSender = sender;
    this.reloadTime = reloadTime;
    this.reloadDelay = delay;
    this.reloadReason = reason;
    this.reloadTimer = setTimeout(function() {page.reloadFunction();}, delay);

}


/** Отмена обновления
*/
Page.prototype.unsetReload = function() {

    clearTimeout(this.reloadTimer);
    this.reloadSender = null; 
    this.reloadTime = null;
    this.reloadDelay = null;
    this.reloadReason = null; 
    this.reloadTimer = null;

}


/** Функция обновления
*/
Page.prototype.reloadFunction = function reloadFunction() {
    if (this.doc.location === null) {
        // Do nothing
    } else {
        this.doc.location.reload(true);
    }
}


/** Задание баланса героя
*
* Изменение отображаемых 7 ресурсов сверху на любой странице.
* @param Price balance Баланс
*/
Page.prototype.setBalance = function(balance) {

    Price.updateNode(balance, this.nodes.balance);
    if (this.hero !== null)
        this.hero.balance = balance;

}


/** Представление в строке
*/
Page.prototype.toString = function() {
    var str = 'Парсер страницы';
    if (this.doc.location === null)
        return str;
    return str + '\n' + this.doc.location.href;
}


/** Парсинг URL игрока
*
* http://www.heroeswm.ru/pl_info.php?id=2861211
* @param String url
* @return Object|null
*/
Page.parsePlayerURL = function(url) {
    var res = /\/pl_info\.php\?id=(\d+)/ig.exec(url);
    if (res === null)
        return null;
    return {id: Number(res[1])};
}


// http://www.heroeswm.ru/war.php?warid=33037391
Page.isBattleURL = function(url) {
    var re = /\/war\.php/ig;
    if (re.test(url))
        return true;
    return false;
}


// http://www.heroeswm.ru/cgame.php?gameid=33037391
Page.isCardGameURL = function(url) {
    var re = /\/cgame\.php/ig;
    if (re.test(url))
        return true;
    return false;
}


// http://www.heroeswm.ru/group_join.php?wrid=15692877
Page.isBattleGroupJoinURL = function(url) {
    var re = /\/group\_join\.php/ig;
    if (re.test(url))
        return true;
    return false;
}


// http://www.heroeswm.ru/
Page.isLoginURL = function(url) {
    var re = /^http:\/\/www\.heroeswm\.ru\/$/;
    if (re.test(url))
        return true;
    return false;
}


// http://www.heroeswm.ru/home.php
Page.isHomeURL = function(url) {
    var re = /\/home\.php/ig;
    if (re.test(url))
        return true;
    return false;
}


// http://www.heroeswm.ru/group_wars.php
Page.isGroupWarsURL = function(url) {
    return /\/group_wars\.php/ig.test(url);
}


// http://www.heroeswm.ru/group_wars.php?filter=hunt
Page.isGroupWarsHuntURL = function(url) {
    return /\/group_wars\.php\?filter=hunt/ig.test(url);
}


// http://www.heroeswm.ru/warlog.php?warid=334352419
Page.isBattleLogURL = function(url) {
    return /\/war\.php\?warid=(\d+)/ig.test(url);
}


// http://www.heroeswm.ru/object-info.php?id=51
Page.isObjectInfoURL = function(url) {
    return /\/object-info\.php\?id=(\d+)/ig.test(url);
}


// http://www.heroeswm.ru/object_do.php*
Page.isObjectDoURL = function(url) {
    return /\/object_do\.php/ig.test(url);
}


// http://www.heroeswm.ru/ecostat_details.php?id=9
Page.isEcostatDetailsURL = function(url) {
    var re = /\/ecostat_details\.php/ig;
    if (re.test(url))
        return true;
    return false;
}


// http://www.heroeswm.ru/pl_info.php?id=2861211
Page.isPlayerInfoURL = function(url) {
    var re = /\/pl_info\.php/ig;
    if (re.test(url))
        return true;
    return false;
}



/** 
* @file pageMap.js
* @version 2.3.2
* @author hotamateurxxx
* @link http://userscripts.org/users/362572
* @license GPL
*/


/** Страница карты
* @param Document doc
* @param Game game
* @link http://www.heroeswm.ru/map.php
*/
function PageMap(doc, game) {

    this.constructor.parent.prototype.constructor.apply(this, arguments);
    
    this.region = null;
    this.regionName = null;
    this.divisions = null;
    this.currentDivision = null;
    
    this.nodes.content = null;
    this.nodes.map = null;
    this.nodes.region = null;
    this.nodes.divisions = null;
    this.nodes.hunt = null;
    this.nodes.contest = null;
    this.nodes.mercenary = null;
    this.nodes.objects = null;
    this.nodes.houses = null;

}


PageMap.extends(Page);


PageMap.prototype.parse = function() {

    // Парсим как страницу вообще
    if (!this.constructor.parent.prototype.parse.apply(this, arguments))
        return false;

    try {
        
        this.parseURL();
        this.parseContent();
        
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        GM_log('this.doc.location.href == ' + this.doc.location.href);
        GM_log('this.doc.textContent == ' + this.doc.textContent);
        this.state = -1;
        return false;
    
    }
    
    this.state = 1;
    return true;
    
}


/** Парсинг адреса
*/
PageMap.prototype.parseURL = function() {
    var url = $.url(this.doc.location.href);
    if (url.attr('path') != '/map.php')
        throw new Error('Адрес страницы не соответствует ожидаемому.');
}


PageMap.prototype.parseContent = function() {
    var xpath = '/html/body/center/table/tbody/tr/td/table';
    var xpathRes = this.doc.evaluate(xpath, this.doc, null, XPathResult.ANY_TYPE, null);
    var table = xpathRes.iterateNext();
    if (table === null)
        throw new Error('Не найденое содержимое страницы.');
        
    // left
    var cell = table.rows[0].cells[0];
    this.parseMap(cell);
    
    // right
    var cell = table.rows[0].cells[2];
    this.parseRegion(cell);
    this.parseDivisions(cell);
    this.parseObjects(cell);
    
    try {
        this.parseHunt(cell);
        this.parseContest(cell);
    } catch (e) {
        //GM_log(Time.toString() + ' ' + this + '\n' + e.message);
    }
        
    this.nodes.content = table;
}


PageMap.prototype.parseMap = function(cell) {
    try {
    
        this.nodes.map = cell.getElementsByTagName('object')[0];
    
    } catch (e) {
        
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        throw new Error('Не найден Flash объект карты.');
    
    }
}


/** Парсинг района
*/
PageMap.prototype.parseRegion = function(cell) {
    try {
        
        // /html/body/center/table/tbody/tr/td/table/tbody/tr/td[3]/b/a
        var node = cell.firstChild;
        var re = new RegExp('Район');
        if (!re.test(node.textContent))
            throw new Error('Узел не найден.');
        
        var a = node.nextSibling.firstChild;
        var name = a.textContent;
        this.regionName = name.replace(/^\s*/g, '').replace(/\s*$/g, '');
        if (this.game !== undefined) {
            this.region = this.game.getRegionByName(this.regionName);
        }
        
        this.nodes.region = node;
    
    } catch (e) {
        
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        throw new Error('Не найден текущий регион.');
    
    }
}


PageMap.prototype.parseDivisions = function(cell) {
    try {
    
        // map.php?cx=49&cy=49&st=mn
        var hrefs = cell.getElementsByTagName('a');
        var divisions = [];
        for (var i = 0; i < hrefs.length; i++) {
            var re = /map\.php\?cx=(\d+)\&cy=(\d+)\&st=(\w+)/;
            var matches = re.exec(hrefs[i].href);
            if (matches === null)
                continue;
        
            divisions[divisions.length] = {
                node: hrefs[i],
                href: hrefs[i].href,
                x: matches[1],
                y: matches[2],
                type: matches[3],
                current: false
            };
        }
        if (divisions.length === 0)
            throw new Error('Ни одна ссылка не найдена');
            
        for (var i = 0; i < divisions.length; i++)
            if (divisions[i].node.getElementsByTagName('b').length > 0) {
                divisions[i].current = true;
                this.currentDivision = i;
                break;
            }
        
        this.divisions = divisions;
        this.nodes.divisions = divisions[0].node.previousSibling;
    
    } catch (e) {
        
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        throw new Error('Не распознан текущий раздел.');
    
    }
}


/**
*/
PageMap.prototype.parseObjects = function(cell) {
    try {
    
        var tables = cell.getElementsByTagName('table');
        for (var i = 0; i < tables.length; i++) 
            try {
                var re = new RegExp('Тип');
                if (!re.test(tables[i].rows[0].cells[0].innerHTML))
                    continue;
                var table = tables[i];
                break;
            } catch (e) {
                // Do nothing
            }
        if (table === undefined)
            throw new Error('Таблица не найдена');
        
        this.nodes.objects = table;
    
    } catch (e) {
        
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        throw new Error('Таблица объектов не найдена');
    
    }
}


PageMap.prototype.parseHunt = function(cell) {
    // map.php?action=attack
    // Напасть
    try {
    
        var tables = cell.getElementsByTagName('table');
        for (var i = 0; i < table.length; i++) 
            try {
                var re = new RegExp('Напасть');
                if (!re.test(tables[i].rows[1].cells[0].innerHTML))
                    continue;
                var table = tables[i];
                break;
            } catch (e) {
                // Do nothing
            }
        if (table === undefined)
            throw new Error('Таблица не найдена');
        
        this.nodes.hunt = table;
    
    } catch (e) {
        
        //GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        throw new Error('Охота не найдена');
    
    }
}


PageMap.prototype.parseContest = function(cell) {
    try {
    
        var tables = cell.getElementsByTagName('table');
        for (var i = 0; i < table.length; i++) 
            try {
                var re = new RegExp('Площадка состязаний');
                if (!re.test(tables[i].rows[0].cells[0].innerHTML))
                    continue;
                var table = tables[i];
                break;
            } catch (e) {
                // Do nothing
            }
        if (table === undefined)
            throw new Error('Таблица не найдена');
        
        this.nodes.contest = table;
    
    } catch (e) {
        
        //GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        throw new Error('Площадка состязаний не найдена');
    
    }
}


/** Представление в строке
*/
PageMap.prototype.toString = function() {
    return 'Парсер страницы карты' + '\n' + this.doc.location.href;
}



/** 
* @file pageObjectInfo.js
* @version 2.4.2
* @author hotamateurxxx
* @link http://userscripts.org/users/362572
* @license GPL
*/


/** Страница информации об объекте
*
* @param Document doc
* @param Game game
* @link http://www.heroeswm.ru/object-info.php?id=97
*/
function PageObjectInfo(doc, game) {

    this.constructor.parent.prototype.constructor.apply(this, arguments);
    
    this.object = null;
    this.objectId = null;
    this.objectType = null;
    this.objectHasCaptcha = null;
    this.objectResume = null;
    this.objectBalance = null;
    this.objectPayment = null;
    this.objectRegion = null;
    this.objectPlacesBusy = null;
    this.objectPlacesFree = null;
    this.objectChangeTime = null;
    if (this.game !== undefined)
        this.object = new Object(this.game);

    this.nodes.content = null;
    this.nodes.objectData = null;
    this.nodes.objectType = null;
    this.nodes.objectRegion = null;
    this.nodes.objectBalance = null;
    this.nodes.objectPayment = null;
    this.nodes.objectChangeTime = null;
    this.nodes.placesBusy = null;
    this.nodes.placesFree = null;
    this.nodes.objectOffersSell = null;
    this.nodes.objectOffersBuy = null;
    this.nodes.objectCaptcha = null;
    this.nodes.objectResume = null;
    this.nodes.mercenary = null;

}


PageObjectInfo.extends(Page);


/** Усечение страницы
*/
PageObjectInfo.prototype.truncate = function() {

    if (!this.constructor.parent.prototype.truncate.apply(this, arguments))
        return false;

    if (!this.truncateContent())
        return false;
        
    return true;
    
}


/** Усечение содержимого страницы
*/
PageObjectInfo.prototype.truncateContent = function() {

    try {
    
        // Удаляем верхний колонтитул содержимого
        var node = this.nodes.content.firstChild;
        for (var i = 0; i < 2; i++) {
            var nextNode = node.nextSibling;
            delete node.parentNode.removeChild(node);
            node = nextNode;
        }
        
        if (
            (this.nodes.objectResume !== null) || (this.nodes.objectCaptcha !== null)
        ) {
        
            // Удаляем нижний колонтитул содержимого
            var node = this.nodes.content.lastChild;
            for (var i = 0; i < 10; i++) {
                var nextNode = node.previousSibling;
                delete node.parentNode.removeChild(node);
                node = nextNode;
            }
        
        }
        
        // Удаляем район
        var node = this.nodes.objectRegion;
        while (node.tagName != 'BR') {
            node = node.nextSibling;
            delete node.parentNode.removeChild(node.previousSibling);
        }
        delete node.parentNode.removeChild(node);
        
        if (this.nodes.objectBalance !== null) {
        
            // Удаляем отступ перед балансом
            var node = this.nodes.objectBalance.previousSibling;
            delete node.parentNode.removeChild(node);

            // Удаляем площадь
            var node = this.nodes.objectBalance.nextSibling;
            while (node.tagName != 'TABLE') {
                node = node.nextSibling;
                delete node.parentNode.removeChild(node.previousSibling);
            }
            
        }

        // Добавляем общее количество мест
        var busy = this.objectPlacesBusy;
        var free = this.objectPlacesFree;
        if ((busy !== null) && (free !== null)) {
            var text = 'Рабочие места: ' + busy + '/' + (busy + free);
            var node = this.nodes.objectData.rows[0].cells[0];
            node.appendChild(page.doc.createElement('br'));
            node.appendChild(page.doc.createTextNode(text));
        }
        
        if (this.nodes.placesBusy !== null) {

            // Удаляем количество мест
            var node = this.nodes.placesBusy;
            while (node.tagName != 'BR') {
                node = node.nextSibling;
                delete node.parentNode.removeChild(node.previousSibling);
            }
            
        }

        if (this.nodes.placesFree !== null) {
        
            // Удаляем количество свободных мест
            var node = this.nodes.placesFree;
            while (node.tagName != 'BR') {
                node = node.nextSibling;
                delete node.parentNode.removeChild(node.previousSibling);
            }
        
        }
        
        // Удаляем двойные переносы строки
        var brs = this.nodes.content.getElementsByTagName('br');
        for (var i = 0; i < brs.length; i++) {
            if (brs[i].previousSibling !== null)
                if (brs[i].previousSibling.tagName == 'TABLE') {
                    brs[i].parentNode.removeChild(brs[i]);
                    continue;
                }
            if (brs[i].nextSibling !== null)
                if (brs[i].nextSibling.tagName == 'BR') {
                    brs[i].parentNode.removeChild(brs[i]);
                    continue;
                }
        }
        
        // Урезаем ширину таблиц
        var node = this.nodes.content;
        while (node !== null) {
            if (node.tagName == 'TABLE')
                node.removeAttribute('width');
            node = node.parentNode;
        }
        
        // Добавляем рамку картинке
        var imgs = this.nodes.objectData.rows[0].cells[1].getElementsByTagName('IMG');
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].style.borderStyle = 'solid';
            imgs[i].style.borderWidth = '1px';
            imgs[i].style.borderColor = '#999999';
        }
        
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
    
    }
    
    return true;

}


/** Парсинг страницы
*/
PageObjectInfo.prototype.parse = function() {
    
    // Парсим как страницу вообще
    if (!this.constructor.parent.prototype.parse.apply(this, arguments))
        return false;

    try {
    
        this.parseURL();
            
        if (!this.parseContent())
            throw new Error('Содержимое страницы не соответствует ожидаемому.');
        
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        if (this.doc.location !== null)
            GM_log('this.doc.location.href == ' + this.doc.location.href);
        GM_log('this.doc.body.innerHTML == ' + this.doc.body.innerHTML);
        this.state = -1;
        return false;
    
    }
    
    this.state = 1;
    return true;
    
}


/** Парсинг адреса
*/
PageObjectInfo.prototype.parseURL = function() {
    if (this.doc.location === null)
        return false;
    
    var url = $.url(this.doc.location.href);
    if (url.attr('path') != '/object-info.php')
        return false;
    
    var objectId = url.param('id');
    if (objectId === null)
        return false;
    this.objectId = Number(objectId);
    
    if (this.game !== undefined) {
        this.object = game.getObjectById(objectId);
        this.object.removeOffers();
    }
    
    return true;
}


/** Парсинг содержимого
*/
PageObjectInfo.prototype.parseContent = function() {
    
    try {
    
        var xpath = '/html/body/center/table/tbody/tr/td/table/tbody/tr/td';
        var node = XPath.findFirst(xpath, this.doc);
        if (node === null)
            return false;
        
        this.nodes.content = node;
        var nodes = this.nodes.content.childNodes;
        for (var i = 0; i < nodes.length; i++) {

            if (this.nodes.mercenary === null)
                if (this.parseMercenary(nodes[i]))
                    continue;

            if (this.nodes.objectData === null)
                if (this.parseData(nodes[i]))
                    continue;
                    
            if (this.nodes.placesBusy === null)
                if (this.parsePlacesBusy(nodes[i]))
                    continue;

            if (this.nodes.placesFree === null)
                if (this.parsePlacesFree(nodes[i]))
                    continue;

            if (this.nodes.objectOffersSell === null)
                if (this.parseObjectOffersSell(nodes[i]))
                    continue;

            if (this.nodes.objectOffersBuy === null)
                if (this.parseObjectOffersBuy(nodes[i]))
                    continue;
                
            if (this.nodes.objectResume === null)
                if (this.parseObjectResume(nodes[i]))
                    continue;
                    
            if (this.nodes.objectCaptcha === null)
                if (this.parseObjectCaptcha(nodes[i]))
                    continue;
                    
        }

        if (this.nodes.objectType === null)
            throw new Error('Не найден элемент с указанием типа объекта');
            
        return true;
        
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
        
    }
    
}


/** Парсинг данных
*/
PageObjectInfo.prototype.parseData = function(node) {
    try {

        if (node.tagName !== 'TABLE')
            return false;
        
        var nodes = node.rows[0].cells[0].childNodes;
        for (var i = 0; i < nodes.length; i++) {
            
            if (this.nodes.objectType === null)
                if (this.parseObjectType(nodes[i]))
                    continue;
            
            if (this.nodes.objectRegion === null)
                if (this.parseObjectRegion(nodes[i]))
                    continue;
            
            if (this.nodes.objectBalance === null)
                if (this.parseObjectBalance(nodes[i]))
                    continue;
                    
            if (this.nodes.objectPayment === null)
                if (this.parseObjectPayment(nodes[i]))
                    continue;

            if (this.nodes.objectChangeTime === null)
                if (this.parseObjectChangeTime(nodes[i]))
                    continue;

        }

        if (this.nodes.objectType === null)
            throw new Error('Не найден элемент с указанием типа объекта');
            
        this.nodes.objectData = node;
        return true;
        
    } catch (e) {
    
        GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
        
    }
}


/** Парсинг задания гильдии наемников
*/
PageObjectInfo.prototype.parseMercenary = function(table) {
    /*
        <tbody><tr><td><center><b>Задание от <a href='mercenary_guild.php'>гильдии наемников</a></b></center><br>&nbsp;<a href='/object-info.php?action=accept_merc_task5' onclick='javascript: return (confirm('Вы уверены?'));'>Приступить к выполнению задания</a></td></tr></tbody>
    */
    try {
        
        if (table.tagName != 'TABLE')
            return false;
            
        var refs = table.getElementsByTagName('A');
        if (!/mercenary_guild\.php/.test(refs[0].href))
            return false;
            
        this.nodes.mercenary = table;
        return true;
    
    } catch (e) {
        
        //GM_log(Time.toString() + ' ' + this + '\n' + e.message);
        return false;
    
    }
}


/** Парсинг типа объекта
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectType = function(node) {
    if (node.nodeType !== 3)
        return false;
    var re = new RegExp('Тип:\\s+(\\S.+\\S)\\s*(\\.)?');
    var matches = re.exec(node.textContent);
    if (matches === null)
        return false;
    this.nodes.objectType = node;
    this.objectType = matches[1];
    if (this.game !== undefined)
        this.object.type = this.objectType;
    return true;
}


/** Парсинг района
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectRegion = function(node) {
    if (node.nodeType !== 3)
        return false;
    var re = new RegExp('Район:');
    var matches = re.exec(node.textContent);
    if (matches === null)
        return false;
    var re = /map\.php\?cx=(\d+)&cy=(\d+)/;
    var matches = re.exec(node.nextSibling.href);
    if (matches === null)
        return false;
    this.nodes.objectRegion = node;
    var regionText = node.nextSibling.firstChild.textContent;
    if (regionText[regionText.length - 1] == '-')
        regionText = regionText.substr(0, regionText.length - 1);
    this.objectRegion = String.trim(regionText);
    if (this.game !== undefined)
        this.object.region = this.game.getRegionByXY(matches[1], matches[2]);
    return true;
}


/** Парсинг баланса объекта
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectBalance = function(node) {
    if (node.tagName !== 'TABLE')
        return false;
    var re = new RegExp('Баланс:');
    var matches = re.exec(node.rows[0].cells[0].textContent);
    if (matches === null)
        return false;
    this.nodes.objectBalance = node;
    var cell = node.rows[0].cells[1].getElementsByTagName('TABLE')[0].rows[0].cells[1];
    this.objectBalance = Number(cell.firstChild.textContent.replace(/\D/g, ''));
    if (this.game !== undefined)
        this.object.balance = Price.fromNode(this.game, node.rows[0].cells[1]);
    return true;
}


/** Парсинг зарплаты объекта
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectPayment = function(node) {
    if (node.tagName !== 'TABLE')
        return false;
    var re = new RegExp('Зарплата:');
    var matches = re.exec(node.rows[0].cells[0].textContent);
    if (matches === null)
        return false;
    this.nodes.objectPayment = node;
    var cell = node.rows[0].cells[1].getElementsByTagName('TABLE')[0].rows[0].cells[1];
    this.objectPayment = Number(cell.firstChild.textContent.replace(/\D/g, ''));
    if (this.game !== undefined)
        this.object.payment = Price.fromNode(this.game, node.rows[0].cells[1]);
    return true;
}


/** Парсинг окончания смены
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectChangeTime = function(node) {
    if (node.nodeType !== 3)
        return false;
    var re = new RegExp('Окончание смены:\\s*(\\d+):(\\d+)');
    if (!re.test(node.textContent)) 
        return false;
    var matches = /(\d+):(\d+)/g.exec(node.textContent);
    if (matches === null)
        return false;
    this.objectChangeTime = matches[0];
    this.nodes.objectChangeTime = node;
    if (this.game !== undefined) {
        this.object.changeTime = new Date();
        this.object.changeTime.setHours(matches[1], matches[2], 0);
        // Если идет смена суток
        if ((Number(matches[1]) === 0) && ((new Date()).getHours() === 23))
            this.object.changeTime = new Date(this.object.changeTime.getTime() + 1000 * 60 * 60 * 24);
    }
    return true;
}


/** Парсинг предложений продажи
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectOffersSell = function(node) {
    if (node.tagName !== 'B')
        return false;
    var re = new RegExp('Произведено:');
    var matches = re.exec(node.firstChild.textContent);
    if (matches === null)
        return false;
    this.nodes.objectOffersSell = node;
    if (this.game !== undefined) {
        var table = node.nextSibling.nextSibling;
        for (var i = 1; i < table.rows.length; i++) {
            var row = table.rows[i];
            var offer = this.object.appendOffer(
                new ObjectOfferSell(this.object)
            );
            offer.row = row;
            offer.item = this.game.getItemByTitle(row.cells[0].textContent);
            offer.count = Number(row.cells[2].textContent.match(/\d+/)[0]);
            offer.price = Price.fromNode(this.game, row.cells[3]);
            forms = table.getElementsByTagName('FORM');
            if (forms.length > 0)
                offer.form = forms[0];
        }
    }
    return true;
}


/** Парсинг предложений покупки
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectOffersBuy = function(node) {
    if (node.tagName !== 'B')
        return false;
    var re = new RegExp('Для производства требуется:');
    var matches = re.exec(node.firstChild.textContent);
    if (matches === null)
        return false;
    this.nodes.objectOffersBuy = node;
    if (this.game !== undefined) {
        var table = node.nextSibling;
        for (var i = 2; i < table.rows.length; i++) {
            try {
                var row = table.rows[i];
                var item = this.game.getItemByTitle(row.cells[0].textContent);
                var offer = this.object.appendOffer(
                    new ObjectOfferBuy(this.object)
                );
                offer.row = row;
                offer.item = item;
                offer.rate = Number(row.cells[1].textContent.match(/\d+/)[0]);
                var matches = /(\d+(\.\d+)?)\s*\/\s*(\d+)/g.exec(row.cells[3].textContent);
                offer.count = Math.floor(Number(matches[3]) - Number(matches[1]));
                offer.countHero = Number(row.cells[5].textContent.match(/\d+/)[0]);
                offer.price = Price.fromNode(this.game, row.cells[2]);
                forms = row.getElementsByTagName('FORM');
                if (forms.length > 0)
                    offer.form = forms[0];
            } catch (e) {
                // do nothing
            }
        }
    }
    return true;
}


/** Парсинг количества занятых мест
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parsePlacesBusy = function(node) {
    if (node.nodeType !== 3)
        return false;
    var re = new RegExp('Список рабочих');
    if (!re.test(node.textContent)) 
        return false;
    var matches = /\s+\((\d+)\):\s+/g.exec(node.textContent);
    if (matches === null)
        return false;
    this.nodes.placesBusy = node;
    this.objectPlacesBusy = Number(matches[1]);
    if (this.game !== undefined)
        this.object.placesBusy = this.objectPlacesBusy;
    return true;
}


/** Парсинг количества свободных мест
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parsePlacesFree = function(node) {
    if (node.nodeType !== 3)
        return false;
    var re = new RegExp('Свободных мест');
    if (!re.test(node.textContent)) 
        return false;
    this.nodes.placesFree = node;
    this.objectPlacesFree = Number(node.nextSibling.textContent);
    if (this.game !== undefined)
        this.object.placesFree = this.objectPlacesFree;
    return true;
}


/** Парсинг резюме
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectResume = function(node) {
    // Вы уже устроены.
    if (node.nodeType !== 3)
        return false;
    var nextNode = node.nextSibling;
    if ((nextNode == null) || (nextNode.tagName != 'BR')) 
        return false;
    nextNode = nextNode.nextSibling;
    if ((nextNode == null) || (nextNode.tagName != 'BR')) 
        return false;
    this.nodes.objectResume = node;
    this.objectResume = node.textContent;
    return true;
}


/** Парсинг формы устройства на работу
* @param Node node
* @return Boolean
*/
PageObjectInfo.prototype.parseObjectCaptcha = function(node) {
    if (node.tagName != 'FORM')
        return false;
    var re = new RegExp('Устройство на работу');
    var table = node.getElementsByTagName('table')[0];
    var matches = re.exec(table.rows[0].cells[0].textContent);
    if (matches === null)
        return false;
    this.nodes.objectCaptcha = node;
    return true;
}


/** Совершение сделки
* @param Offer offer
* @param Number count
* @return Boolean
*/
PageObjectInfo.prototype.deal = function(offer, count) {
    if (offer.isActive() == false)
        return false;
    
    offer.changeCount(count);
    offer.form.elements['count'].value = count;
    offer.form.submit();
    
    if (offer instanceof ObjectOfferBuy)
        this.hero.changeItemCountById(offer.item.id, -count);
    if (offer instanceof ObjectOfferSell)
        this.hero.changeItemCountById(offer.item.id, count);
    this.unsetReload();
    return true;
}


/** Проверка региона
* @return Boolean
*/
PageObjectInfo.prototype.checkRegion = function() {
    var re = new RegExp('Вы находитесь в другом секторе');
    if (re.test(this.objectResume))
        return false;
    return true;
}


/** Общее количество мест на объекте
* @param Number def
*/
PageObjectInfo.prototype.objectPlacesTotal = function(def) {
    if ((this.objectPlacesBusy !== null) && (this.objectPlacesFree !== null)) 
        return this.objectPlacesBusy + this.objectPlacesFree;
    if (this.objectPlacesBusy !== null)
        return this.objectPlacesBusy;
    if (this.objectPlacesFree !== null)
        return this.objectPlacesFree;
    return def;
}


/** Представление в строке
*/
PageObjectInfo.prototype.toString = function() {
    var str = 'Парсер страницы информации об объекте';
    if (this.doc.location === null)
        return str;
    return str + '\n' + this.doc.location.href;
}



// Создаем интерфейс
if (window === top) {
    
    var desc = {
        'details':
              '<ul>'
            + '<li>На карте подгружает в скрытые фреймы остальные части карты (Добыча, Обработка, Производство) и копирует сисок объектов в отображаемый документ.</li>'
            + '<li>При заходе на страницу объекта запоминает баланс и время окончания смены объекта чтобы потом отображать эту информацию прямо на странице карты.</li>'
            +'</ul>',
        'homepage': {'title': 'userscripts.org', 'link': 'http://userscripts.org/users/362572/scripts'},
        'author': {'title': 'hotamateurxxx', 'link': 'http://userscripts.org/users/hotamateurxxx'},
        'updated': '2013.04.14'
    };
    
    var conf = {
        'disabled': {'type': 'bool', 'title': 'Отключение', 'def': false, 'desc': 'Отключение работы скрипта.'},
        'enableCache': {'type': 'bool', 'title': 'Кэширование', 'def': true, 'desc': 'Кэширование информации об объектах.'},
        'enableSort': {'type': 'bool', 'title': 'Сортировка', 'def': true, 'desc': 'Сортировка объектов по зарплате.'},
        'showChangeTime': {'type': 'bool', 'title': 'Пересменка', 'def': true, 'desc': 'Отображение времени окончания смены.'},
        'showBalance': {'type': 'bool', 'title': 'Баланс', 'def': true, 'desc': 'Отображение баланса предприятия.'},
        'showPlaces': {'type': 'bool', 'title': 'Места', 'def': true, 'desc': 'Отображение рабочих мест предприятия.'},
        'loadObjects': {'type': 'bool', 'title': 'Подгрузка объектов', 'def': false, 'desc': 'Автоматически при заходе на карту подгружать все объекты на карте чтобы показывать актуальные баланс и время смены.'},
        'enablePreview': {'type': 'bool', 'title': 'Предпросмотр', 'def': true, 'desc': 'Возможность предпросмотра объектов с карты.'},
        'enableAutoclose': {'type': 'bool', 'title': 'Автозакрытие', 'def': true, 'desc': 'Автозакрытие окна предпросмотра.'},
        'cacheTime': {'title': 'Время жизни кэша', 'def': 5.0, 'desc': 'Время в минутах жизни закэшированной информации о предприятии (баланс, смена и т.д.).'}
    }
    
    var gui = UserScriptGUI(document);
    gui.createDefaultSet(desc, conf);
    
}


/** Сохранение информации об объекте
* @param Object objInfo
*/
function saveObjectInfo(objInfo) {
    
    var str = '';
    for (var i in objInfo) {
        if (objInfo[i] === undefined)
            continue;
        if (objInfo[i] === null)
            continue;
        str += (str.length > 0) ? '|' : '';
        switch (i) {
            case 'updateTime': str += i + '=' + Time.toNumber(objInfo[i]); break;
            default: str += i + '=' + objInfo[i];
        }
    }
    
    var key = 'ObjectInfo_' + objInfo.objectId;
    GM_setValue(key, str);
    
}


/** Загрузка информации об объекте
* @param Number objectId
* @return Object
*/
function loadObjectInfo(objectId) {
    
    var key = 'ObjectInfo_' + objectId;
    var str = GM_getValue(key, null);
    if (str === null)
        return false;
    
    var arr = str.split('|');
    var objInfo = {};
    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=');
        switch (arr2[0]) {
            case 'updateTime': objInfo[arr2[0]] = Time.fromNumber(arr2[1]); break;
            default: objInfo[arr2[0]] = arr2[1];
        }
    }
    
    return objInfo;
    
}


/** Возвращает время пересменки объекта
* @global cacheTime
* @param Object objInfo
* @return String
*/
function getChangeTimeStr(objInfo) {
    if (!objInfo)
        return '';
    if (objInfo.changeTimeHours === undefined)
        return '';
    var hours = objInfo.changeTimeHours;
    var minutes = objInfo.changeTimeMins;
    var currentTime = new Date();
    if (currentTime.getHours() !== hours)
        hours = currentTime.getHours();
    if ((currentTime.getHours() == hours) && (currentTime.getMinutes() > minutes)) 
        hours++;
    if (hours === 24)
        hours = 0;
    hours = String(hours);
    minutes = String(minutes);
    if (hours.length < 2)
        hours = '0' + hours;
    if (minutes.length < 2)
        minutes = '0' + minutes;
    return hours + ':' + minutes;
}


/** Возвращает баланс объекта
* @global cacheTime
* @param Object objInfo
* @return String
*/
function getBalanceStr(objInfo) {
    if (!objInfo)
        return '';
    if (objInfo.balance === undefined)
        return '';
    return Auction.formPrice(objInfo.balance);
}


/** Возвращает места объекта
* @global cacheTime
* @param Object objInfo
* @return String
*/
function getPlacesStr(objInfo) {
    if (!objInfo)
        return '';
    if (objInfo.placesFree === undefined)
        return '';
    return Number(objInfo.placesBusy) + '/' + (Number(objInfo.placesBusy) + Number(objInfo.placesFree));
}


/** Обновление таблицы объектов на странице карты
* @param PageMap page
*/
function updateMapTable(page) {
    
    var table = page.nodes.objects;   
    
    if (showChangeTime) 
        table.rows[0].cells[1].innerHTML = '<b>Смена</b>';
    if (showPlaces) 
        table.rows[0].cells[2].innerHTML = '<b>Места</b>';
    if (showBalance) 
        table.rows[0].cells[3].innerHTML = '<b>Баланс</b>';
    
    // Смена, места, баланс
    for (var i = 1; i < table.rows.length; i++) {
        var ref = table.rows[i].cells[0].getElementsByTagName('a')[0];
        var objectId = Number(/object\-info\.php\?id\=(\d+)/.exec(ref.href)[1]);
        var objInfo = loadObjectInfo(objectId);
        if (objInfo.updateTime !== undefined)
            table.rows[i].title = 'Обновлено: ' + Time.toDateTimeString(objInfo.updateTime);
        var color = ((objInfo.updateTime === undefined) || (objInfo.updateTime < cacheTime)) ? 'grey' : 'inherit';        
        
        if (showChangeTime) {
            var cell = table.rows[i].cells[1];
            while (cell.childNodes.length > 0)
                delete cell.removeChild(cell.firstChild);
            cell.textContent = getChangeTimeStr(objInfo);
            cell.style.color = color;
            cell.setAttribute('align', 'center');
        }
        
        if (showPlaces) {
            var cell = table.rows[i].cells[2];
            while (cell.childNodes.length > 0)
                delete cell.removeChild(cell.firstChild);
            cell.textContent = getPlacesStr(objInfo);
            cell.style.color = color;
            cell.setAttribute('align', 'center');
        }
        
        if (showBalance) {
            var cell = table.rows[i].cells[3];
            while (cell.childNodes.length > 0)
                delete cell.removeChild(cell.firstChild);
            cell.textContent = getBalanceStr(objInfo);
            cell.style.color = color;
            cell.style.textAlign = 'center';
        }
        
    }

    // Сортировка
    if (enableSort) {
        for (var i = 1; i < table.rows.length; i++)
            for (var j = table.rows.length - 1; j > i; j--) {
                var payment1 = Number(table.rows[i].cells[4].getElementsByTagName('b')[0].textContent);
                var payment2 = Number(table.rows[j].cells[4].getElementsByTagName('b')[0].textContent);
                var text1 = table.rows[i].cells[5].getElementsByTagName('a')[0].textContent;
                var text2 = table.rows[j].cells[5].getElementsByTagName('a')[0].textContent;
                if (
                    (payment2 > payment1) ||
                    ((payment2 == payment1) && (text2.length > text1.length))
                )
                    table.rows[i].parentNode.insertBefore(
                        table.rows[j].parentNode.removeChild(table.rows[j]), 
                        table.rows[i]
                    );
            }
    }
    
    // Предпросмотр
    var enablePreview = GM_getValue('enablePreview', true);
    var enableAutoclose = GM_getValue('enableAutoclose', true);
    if (enablePreview) {
        var refs = table.getElementsByTagName('a');
        for (var i = 0; i < refs.length; i++)
            new UIObjectPreview(refs[i], enableAutoclose);
    }
    
}


/** Подзагрузка всех разделов карты
* 
* @param PageMap page
*/
function completeMap(page) {
    
    
    /** Сохранение списка объектов
    * @param Object coords
    * @param Array list
    */
    function saveObjectsList(coords, list) {
        var key = 'Objects_' + coords.cx + '_' + coords.cy + '_' + coords.st;
        var str = '';
        for (var i = 0; i < list.length; i++)
            str += ((i > 0) ? '|' : '') + list[i];
        GM_setValue(key, str);
    }
    
    
    /** Загрузка списка объектов
    * @param Object coords
    * @return Array
    */
    function loadObjectsList(coords) {
        var key = 'Objects_' + coords.cx + '_' + coords.cy + '_' + coords.st;
        var str = GM_getValue(key, null);
        if (str === null)
            return false;
        return str.split('|');
    }
    
    
    /** Строка в информацию об объекте
    * @param Element row
    * @return Object
    */
    function rowToObjectInfo(row) {
        
        // <tr><td class="wblight">&nbsp;<a href="object-info.php?id=120">Кузница щитов хранителя</a>&nbsp;</td><td class="wblight">&nbsp;<a href="pl_info.php?id=9" style="text-decoration:none;"><b>Империя</b></a>&nbsp;</td><td align="center" class="wblight">&nbsp;<a href="clan_info.php?id=783"><img width="20" height="15" border="0" align="absmiddle" alt="#783" title="#783 Rutenia" src="http://dcdn.heroeswm.ru/i_clans/l_783.gif?v=30"></a><img width="2" height="15" align="absmiddle" alt="" src="http://dcdn.heroeswm.ru/i/transparent.gif">&nbsp;</td><td align="center" class="wblight">16509.85</td><td align="center" class="wblight">&nbsp;<b>210</b>&nbsp;</td><td class="wblight">&nbsp;<a style="text-decoration:none;" href="object-info.php?id=120"></a>&nbsp;</td></tr>
        var objInfo = {};
        var links = row.getElementsByTagName('a');
        var imgs = row.getElementsByTagName('img');
        objInfo.objectId = /id=(\d+)/ig.exec(links[0].href)[1];
        objInfo.objectType = links[0].textContent;
        objInfo.playerId = /id=(\d+)/ig.exec(links[1].href)[1];
        objInfo.playerName = links[1].textContent;
        var res = /clan_info.php\?id=(\d+)/ig.exec(links[2].href);
        if (res !== null) {
            objInfo.clanId = res[1];
            var res2 = /\#(\d+)\s+(.+)$/ig.exec(imgs[0].title);
            objInfo.clanName = res2[2];
            var res3 = /i_clans\/l_(\d+).gif\?v=(\d+)/ig.exec(imgs[0].src);
            objInfo.clanLogo = res3[2];
        }
        objInfo.resource = Number(row.cells[3].textContent);
        objInfo.payment = Number(row.cells[4].textContent);
        return objInfo;
        
    }
    
    
    /** Информация об объекте в строку
    * @param Object objInfo
    * @return String
    */
    function objectInfoToRow(objInfo) {
        
        /*
            <td class="wblight">&nbsp;<a href="object-info.php?id=120">Кузница щитов хранителя</a>&nbsp;</td>
            <td class="wblight">&nbsp;<a href="pl_info.php?id=9" style="text-decoration:none;"><b>Империя</b></a>&nbsp;</td>
            <td align="center" class="wblight">&nbsp;<a href="clan_info.php?id=783"><img width="20" height="15" border="0" align="absmiddle" alt="#783" title="#783 Rutenia" src="http://dcdn.heroeswm.ru/i_clans/l_783.gif?v=30"></a><img width="2" height="15" align="absmiddle" alt="" src="http://dcdn.heroeswm.ru/i/transparent.gif">&nbsp;</td>
            <td align="center" class="wblight">16509.85</td>
            <td align="center" class="wblight">&nbsp;<b>210</b>&nbsp;</td>
            <td class="wblight">&nbsp;<a style="text-decoration:none;" href="object-info.php?id=120"></a>&nbsp;</td>
        */
        var clanInfo = (objInfo.clanId === undefined) ? '-' : '<a href="clan_info.php?id=' + objInfo.clanId + '"><img width="20" height="15" border="0" align="absmiddle" alt="#' + objInfo.clanId + '" title="#' + objInfo.clanId + ' ' + objInfo.clanName + '" src="http://dcdn.heroeswm.ru/i_clans/l_' + objInfo.clanId + '.gif?v=' + objInfo.clanLogo + '"></a><img width="2" height="15" align="absmiddle" alt="" src="http://dcdn.heroeswm.ru/i/transparent.gif">';
        
        var html = 
            '<td class="wblight">&nbsp;<a href="object-info.php?id=' + objInfo.objectId + '">' + objInfo.objectType + '</a>&nbsp;</td>' + 
            '<td class="wblight">&nbsp;<a href="pl_info.php?id=' + objInfo.playerId + '" style="text-decoration:none;"><b>' + objInfo.playerName + '</b></a>&nbsp;</td>' +
            '<td align="center" class="wblight">&nbsp;' + clanInfo + '&nbsp;</td>' +
            '<td align="center" class="wblight">' + objInfo.resource + '</td>' + 
            '<td align="center" class="wblight">&nbsp;<b>' + objInfo.payment + '</b>&nbsp;</td>' +
            '<td class="wblight">&nbsp;<a style="text-decoration:none;" href="object-info.php?id=' + objInfo.objectId + '"></a>&nbsp;</td>';
        
        return '<tr>' + html + '</tr>';
        
    }
    
    
    /** Навешивание фрейма раздела карты
    * @param Object div
    */
    function appendMapFrame(div) {
        var id = gui.scriptName + '_' + div.type;
        var src = div.href;
        var res = /cx=(\d+)&cy=(\d+)&st=(\w+)/ig.exec(src);
        var coords = {cx: res[1], cy: res[2], st: res[3]};
        
        var enableCache = GM_getValue('enableCache', true);
        var list = loadObjectsList(coords);
        if ((!enableCache) || (!list)) {
            
            var iframe = frameManager.createFrame(id, 'map', src);
            iframe.bind('load', function(){ onMapFrameLoad(iframe, coords); });
            
        } else {
            
            var html = '';
            for (var i = 0; i < list.length; i++) {
                if (list[i] == '')
                    continue;
                // Загружаем информацию об объекте
                var objInfo = loadObjectInfo(list[i]);
                if (objInfo !== false)
                    html += objectInfoToRow(objInfo);
            }
            
            // Добавляем строки к таблице объектов
            var tbody = document.createElement('tbody');
            tbody.innerHTML = html;
            page.nodes.objects.appendChild(tbody);
            
            // Обновляем таблицу объектов
            updateMapTable(page);
            
        }
        
    }
    
    
    /** Обработчик загрузки фрейма раздела карты
    * @param jQuery iframe
    * @param Object coords
    */
    function onMapFrameLoad(iframe, coords) {
        
        var subDoc = iframe.prop('contentDocument');
        var subPage = new PageMap(subDoc);
        subPage.parse();
        
        // Работаем только с нормальной страницей
        if (subPage.state === 1) {
            
            // Cписок объектов
            var list = [];
            
            // Импортируем список объектов
            var rows = subPage.nodes.objects.rows;
            for (var i = 1; i < rows.length; i++) {
                var row = page.nodes.objects.appendChild(
                    page.doc.importNode(rows[i], true)
                );
                var objectId = /id=(\d+)/ig.exec(row.getElementsByTagName('a')[0].href)[1];
                // Добавляем номер объекта в список
                list[list.length] = objectId;
                // Сохраняем информацию об объекте
                var objInfo = rowToObjectInfo(row);
                saveObjectInfo(objInfo);
            }
            
            // Сохраняем список объектов
            saveObjectsList(coords, list);
            
            // Обновляем таблицу объектов
            updateMapTable(page);
                
        }
        
        // Удаляем ненужный фрейм
        iframe.remove();
        
        // Автоматическая подгрузка объектов
        mapFrames++;
        if ((mapFrames == 2) && (loadObjects))
            updateObjects(page);
        
    }
    
    
    // Не работаем с домами
    if (page.divisions[page.currentDivision].type != 'hs') {
        
        updateMapTable(page);
        
        // Подгружаем остальные разделы карты
        var frameManager = UserScriptFrameManager(page.doc);
        var mapFrames = 0;
        for (i = 0; i < page.divisions.length - 1; i++)
            if (!page.divisions[i].current) 
                appendMapFrame(page.divisions[i]);
        
    }

}


/** Обновление всех объектов
* @param PageMap page
*/
function updateObjects(pageMap) {
    
    /** Обновление объекта
    * @param Array list
    * @param Number idx
    */
    function updateObject(list, idx) {
        
        /** Обработчик ответа
        * @param Object resp
        */
        function onLoad(resp) {
            //GM_log('onLoad(resp)');
            
            var parser = new DOMParser();
            var doc = parser.parseFromString(resp.responseText, 'text/html');
            //GM_log('idx == ' + idx);
            //GM_log('doc.location == ' + doc.location);
            
            if (showChangeTime || showBalance || enableEcostat) {
                
                var pageObj = new PageObjectInfo(doc);
                pageObj.parse();
                pageObj.objectId = list[idx];
                //GM_log('pageObj.state == ' + pageObj.state);
                
                if (pageObj.state === 1) {
                    
                    updateObjectDetails(pageObj);
                    updateMapTable(pageMap);
                    
                }
                
            }
            
            // Запускаем обновление следущего объекта
            updateObject(list, idx + 1);
        }
        
        //GM_log('updateObject([' + list.join(', ') + '], ' + idx + ')');
        
        if (idx == list.length)
            return true;
        
        var url = 'http://' + pageMap.doc.location.hostname + '/object-info.php?id=' + list[idx];
        //GM_log('url == ' + url);
        
        // Загружаем дополнительную страницу
        GreaseMonkey.xmlhttpRequest({method: 'GET', url: url, onload: onLoad});

    }
    
    // Составляем список объектов для проверки
    var list = [];
    var table = pageMap.nodes.objects;
    for (var i = 1; i < table.rows.length; i++) {
        var ref = table.rows[i].cells[0].getElementsByTagName('a')[0];
        var objectId = Number(/object\-info\.php\?id\=(\d+)/.exec(ref.href)[1]);
        list[list.length] = objectId;
        var objInfo = loadObjectInfo(objectId);
        delete objInfo.updateTime;
        saveObjectInfo(objInfo);
    }
    //GM_log('list == ' + list.join(', '));
    
    // Начинаем последовательное обновление объектов
    updateObject(list, 0);
    
}


/** Обновление статистики объекта
* @param PageObjectInfo page
*/
function updateObjectDetails(page) {
    
    // Загружаем информацию об объекте
    var objInfo = loadObjectInfo(page.objectId);
    if (!objInfo)
        objInfo = {};
    
    // Добавляем регион, баланс
    objInfo.objectId = page.objectId;
    objInfo.region = page.objectRegion;
    objInfo.balance = page.objectBalance;
    objInfo.placesBusy = (page.objectPlacesBusy !== null) ? Number(page.objectPlacesBusy) : 0;
    objInfo.placesFree = (page.objectPlacesFree !== null) ? Number(page.objectPlacesFree) : 0;
    
    // Добавляем пересменку
    if (page.nodes.objectChangeTime !== null) {

        var text = page.nodes.objectChangeTime.textContent;
        var matches = /.*:\s*(\d+):(\d+)/.exec(text);
        objInfo.changeTimeHours = parseInt(matches[1]);
        objInfo.changeTimeMins =parseInt(matches[2]);
        
    } else {

        if (page.objectBalance > page.objectPayment) {
        
            var hours = (new Date()).getHours();
            var minutes = (new Date()).getMinutes();
            minutes = 5 * Math.floor(minutes / 5);
            if (minutes % 5 > 0)
                minutes += 5;
            if (minutes == 60) {
                hours++;
                minutes = 0;
            }
            if (hours == 24)
                hours = 0;
            
            objInfo.changeTimeHours = hours;
            objInfo.changeTimeMins = minutes;
        
        } else {

            objInfo.changeTimeHours = null;
            objInfo.changeTimeMins = null;
        
        }
    
    }
    
    // Сохраняем информацию об объекте
    objInfo.updateTime = new Date();
    saveObjectInfo(objInfo);

}


var disabled = GM_getValue('disabled', false);
if (!disabled) {
    
    
    var enableSort = GM_getValue('enableSort', true);
    var showChangeTime = GM_getValue('showChangeTime', true);
    var showBalance = GM_getValue('showBalance', true);
    var showPlaces = GM_getValue('showPlaces', true);
    var loadObjects = GM_getValue('loadObjects', false);
    var cacheTime = new Date();
    cacheTime.setTime(cacheTime.getTime() - 1000 * 60 * GM_getValue('cacheTime', 5.0));
    
    
    // Если мы на странице карты
    if (window.location.pathname == '/map.php') {

        // Не работаем во фрейме
        if (window === top) {
        
            var page = new PageMap(document);
            page.parse();
            document.title = PageState.getPageTitle(undefined, page.state);
            
            // Работаем только с нормальной страницей
            if (page.state === 1) {
            
                completeMap(page);
                
                var bCheck = gui.createMenuButton(['UpdateObjects'], 'Обновить объекты');
                bCheck.click(function() { updateObjects(page); gui.toggleMenu(); });
            
            }
        
        }

    }
    
    
    // Если мы на странице информации об объекте
    if (window.location.pathname == '/object-info.php') {
    
        if (showChangeTime || showBalance || enableEcostat) {
        
            var page = new PageObjectInfo(document);
            page.parse();
            
            if (page.state === 1) {
            
                updateObjectDetails(page);
            
            }
            
        }
    
    }
    
}