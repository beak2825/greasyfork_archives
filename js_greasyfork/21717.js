// ==UserScript==
// @name        Cyrillic To Latin ы-ŷ, й-y, ь-j (y[eoua] èöüä hžcčšś)
// @description Транслитерация русской кириллицы в латиницу.
// @namespace   2k1dmg@userscript
// @include     *
// @version     1.1.5
// @author      2k1dmg
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/21717/Cyrillic%20To%20Latin%20%D1%8B-%C5%B7%2C%20%D0%B9-y%2C%20%D1%8C-j%20%28y%5Beoua%5D%20%C3%A8%C3%B6%C3%BC%C3%A4%20h%C5%BEc%C4%8D%C5%A1%C5%9B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/21717/Cyrillic%20To%20Latin%20%D1%8B-%C5%B7%2C%20%D0%B9-y%2C%20%D1%8C-j%20%28y%5Beoua%5D%20%C3%A8%C3%B6%C3%BC%C3%A4%20h%C5%BEc%C4%8D%C5%A1%C5%9B%29.meta.js
// ==/UserScript==

(function() {
'use strict';

var translitWord = {
'- По умолчанию -': null,
"Чешская": function(text) {
  return text
  .replace(/ь[иеёюя]/g,function(found,offset,s){return "jijejojuja".substr("ьиьеьёьюья".indexOf(found),2)})
  .replace(/[бвдзлмнпрстф]ь/g,function(found,offset,s){return ["bj","vj","ď","ź","ĺ","ḿ","ń","ṕ","ŕ","ś","ť","fj"]["бьвьдьзьльмьньпьрьсьтьфь".indexOf(found)/2]})
  .replace(/([бвгдзклмнпрстфх])(ио|иу|иа|е|ё|ю|я)/g,function(found,p1,p2,offset,s){return p1+["ïo","ïu","ïa","e","io","iu","ia"][["ио","иу","иа","е","ё","ю","я"].indexOf(p2)]})
  .replace(/([йжцчшщ])([еёюя])/g,function(found,p1,p2,offset,s){return p1+"eoua".charAt("еёюя".indexOf(p2))})
  .replace(/[а-яё]/g,function(found,offset,s){return ["a","b","v","g","d","je","jo","ž","z","i","j","k","l","m","n","o","p","r","s","t","u","f","ch","c","č","š","šč","","y","","e","ju","ja"]["абвгдеёжзийклмнопрстуфхцчшщъыьэюя".indexOf(found)]});
},
"Польская": function(text) {
  return text
  .replace(/[лтд]ь[иеёюя]/g,function(found,offset,s){return ["lji","lje","ljo","lju","lja","cji","cje","cjo","cju","cja","dzji","dzje","dzjo","dzju","dzja"]["льильельёльюльятьитьетьётьютьядьидьедьёдьюдья".indexOf(found)/3]})
  .replace(/тти[оуа]/g,function(found,offset,s){return "ccíoccíuccía".substr("ттиоттиуттиа".indexOf(found),4)})
  .replace(/(?:лл|тт)[иеёюя]/g,function(found,offset,s){return ["lli","lle","llo","llu","lla","cci","ccie","ccio","cciu","ccia"]["ллиллеллёллюлляттиттеттёттюття".indexOf(found)/3]})
  .replace(/[тд]и[оуа]/g,function(found,offset,s){return ["cío","cíu","cía","dzío","dzíu","dzía"]["тиотиутиадиодиудиа".indexOf(found)/3]})
  .replace(/[лтд][иеёюя]/g,function(found,offset,s){return ["li","le","lo","lu","la","ci","cie","cio","ciu","cia","dzi","dzie","dzio","dziu","dzia"]["лилелёлюлятитетётютядидедёдюдя".indexOf(found)/2]})
  .replace(/ь[иеёюя]/g,function(found,offset,s){return "jijejojuja".substr("ьиьеьёьюья".indexOf(found),2)})
  .replace(/[лтдсзнр]ь/g,function(found,offset,s){return ["l","ć","dź","ś","ź","ń","ŕ"]["льтьдьсьзьньрь".indexOf(found)/2]})
  .replace(/([жцчшщ])ь/g,"$1")
  .replace(/ь(?=[а-яё])/g,"")
  .replace(/([бвгдзклмнпрстфх])(е|ё|ю|я|ио|иу|иа)/g,function(found,p1,p2,offset,s){return p1+"ieioiuiaïoïuïa".substr(["е","ё","ю","я","ио","иу","иа"].indexOf(p2)*2,2)})
  .replace(/ци/g,"cy")
  .replace(/([йжцчшщ])([еёюя])/g,function(found,p1,p2,offset,s){return p1+"eoua".charAt("еёюя".indexOf(p2))})
  .replace(/[а-яё]/g,function(found,offset,s){return ["a","b","w","g","d","je","jo","ż","z","i","j","k","ł","m","n","o","p","r","s","t","u","f","ch","c","cz","sz","szcz","’","y","’","e","ju","ja"]["абвгдеёжзийклмнопрстуфхцчшщъыьэюя".indexOf(found)]});
},
"Советская №2": function(text) {
  return text
  .replace(/ь[иеёюя]/g,function(found,offset,s){return "jijejojuja".substr("ьиьеьёьюья".indexOf(found),2)})
  .replace(/([жцчшщ])ь/g,"$1")
  .replace(/([бвгдзклмнпрстфх])([еёюя])/g,function(found,p1,p2,offset,s){return p1+"eöüä".charAt("еёюя".indexOf(p2))})
  .replace(/([йжцчшщъ])([еёюя])/g,function(found,p1,p2,offset,s){return p1+"eoua".charAt("еёюя".indexOf(p2))})
  .replace(/[а-яё]/g,function(found,offset,s){return ["a","b","v","g","d","je","jo","ƶ","z","i","j","k","l","m","n","o","p","r","s","t","u","f","x","ç","c","ş","sc","j","y","j","e","ju","ja"]["абвгдеёжзийклмнопрстуфхцчшщъыьэюя".indexOf(found)]});
},
"Кадинский": function(text) {
  return text
  .replace(/е([аоу])/g,function(found,p1,offset,s){return "е"+"äöü".charAt("аоу".indexOf(p1))})
  .replace(/[ьиы][йиеёюя]/g,function(found,offset,s){return ["ii","ie","io","iu","ia","y","ye","yo","yu","ya","iy","hy","hiy","hye","hyo","hyu","hya"]["ьиьеьёьюьяийиеиёиюияииыйыиыеыёыюыя".indexOf(found)/2]})
  .replace(/([аеёоуыэюя])и/g,"$1y")
  .replace(/([бвгджзклмнпрстфхцчшщ])([еёюяэыи])/g,function(found,p1,p2,offset,s){return p1+["e","eo","eu","ea","he","hi","i"]["еёюяэыи".indexOf(p2)]})
  .replace(/([жцчшщ])ь/g,"$1")
  .replace(/[гкхжчшщ][iey]/g,function(found,offset,s){return ["ghi","ghe","ghy","chi","che","chy","xhi","xhe","xhy","gi","ge","gy","ci","ce","cy","xi","xe","xy","sci","sce","scy"]["гiгeгyкiкeкyхiхeхyжiжeжyчiчeчyшiшeшyщiщeщy".indexOf(found)/2]})
  .replace(/[а-яё]/g,function(found,offset,s){return ["a","b","v","g","d","ie","io","gh","z","i","i","c","l","m","n","o","p","r","s","t","u","f","x","tz","ch","xh","sch","h","i","h","e","iu","ia"]["абвгдеёжзийклмнопрстуфхцчшщъыьэюя".indexOf(found)]});
},
"Морисон": function(text) {
  return text
  .replace(/тз/g,"т’з")
  .replace(/ь[иеёюя]/g,function(found,offset,s){return "yiyeyoyuya".substr("ьиьеьёьюья".indexOf(found),2)})
  .replace(/([аеёиоуыэюя])и/g,"$1yi")
  .replace(/([бвгджзклмнпрстфхцчшщ])(ио|иа|ё|ю|я)/g,function(found,p1,p2,offset,s){return p1+"ïoïaioiuia".substr(["ио","иа","ё","ю","я"].indexOf(p2)*2,2)})
  .replace(/([а-яё])([еэ])/g,function(found,p1,p2,offset,s){return p1+"eë".charAt("еэ".indexOf(p2))})
  .replace(/[а-яё]/g,function(found,offset,s){return ["a","b","v","g","d","ye","yo","j","z","i","i","k","l","m","n","o","p","r","s","t","ou","f","c","tz","ch","sh","sch","’","u","y","e","yu","ya"]["абвгдеёжзийклмнопрстуфхцчшщъыьэюя".indexOf(found)]});
},
"Лысактотал": function(text) {
  return text
  .replace(/[ьъ]([иеёюя])/g,function(found,p1,offser,s){return "’"+"ieoua".charAt("иеёюя".indexOf(p1))})
  .replace(/([жцчшщ])ь/g,"$1")
  .replace(/([аеёиоуыэюя])и/g,"$1’i")
  .replace(/([жцш])и/g,"$1ы")
  .replace(/([а-яё])е/g,"$1e")
  .replace(/([бвгдзклмнпрстфх])([ёюяь])/g,function(found,p1,p2,offset,s){return "’"+p1+"oua".charAt("ёюяь".indexOf(p2))})
  .replace(/([ийжцчшщ])([еёюя])/g,function(found,offser,p1,p2,s){return p1+"eoua".charAt("еёюя".indexOf(p2))})
  .replace(/щ/g,"’h")
  .replace(/(?=[еёюя])/g,"i")
  .replace(/[абвгдеёжзийклмнопрстуфхцчшыэюя]/g,function(found,offset,s){return "abvgdeojziiklmnoprstufxqchyeua".charAt("абвгдеёжзийклмнопрстуфхцчшыэюя".indexOf(found))});
},
'По умолчанию ы-ī': function(text) {
	return text
	.replace(/ъ([еёюя])/g, function(found,p1,offset,s) {
		return 'y'+'eoua'['еёюя'.indexOf(p1)];
	})
	.replace(/([йжцчшщ])([еёюя])/g, function(found,p1,p2,offset,s) {
		return p1+'eoua'['еёюя'.indexOf(p2)];
	})
	.replace(/([жцчшщ])ь(и)/g, '$1y$2')
	.replace(/([жцчшщ])ь/g, '$1')
	.replace(/([бвгдзклмнпрстфх])([еёюяэ])/g, function(found,p1,p2,offset,s) {
		return p1+'eöüäè'['еёюяэ'.indexOf(p2)];
	})
	.replace(/[а-яё]/g, function(found,offset,s) {
		return ['a','b','v','g','d','ye','yo','ž','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','č','š','ś','','ī','j','e','yu','ya']['абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.indexOf(found)];
	});
}
};

function scriptPage() {
	var selectElemnet = document.createElement('select');
	selectElemnet.id = 'c2l_translist';
	selectElemnet.onchange = function(value) {
		var selected = selectElemnet.options[selectElemnet.options.selectedIndex].value;
		if(selected == selectElemnet.options[0].value) {
			GM_deleteValue('translitWord');
		}
		else {
			GM_setValue('translitWord', selected);
		}
	};
	var currentSelected = GM_getValue('translitWord');
	for(var key in translitWord) {
		if(currentSelected == key) {
			selectElemnet.appendChild(new Option(key,key,true,true));
		}
		else {
			selectElemnet.appendChild(new Option(key,key));
		}
	}
	var alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
	var options = selectElemnet.getElementsByTagName('option');
	for(var opt in options) {
		var optionValue = options[opt].value;
		if(typeof optionValue != 'string' || optionValue == '- По умолчанию -')
			continue;
		options[opt].setAttribute('title', alphabet.split('').map(function(letter) {
			return translitWord[optionValue](letter).toUpperCase();
		}).join(' '));
	}
	var _script_content = document.getElementById('script-content');
	var conteiner = document.createElement('div');
	conteiner.style.cssText = 'padding:0 0 15px';
	conteiner.appendChild(document.createTextNode('Транслитератор: '));
	conteiner.appendChild(selectElemnet);
	if(!_script_content)
		_script_content = document.body;
	_script_content.insertBefore(conteiner, _script_content.firstChild);
}
function isScriptPage() {
	var pathnameList = location.pathname.slice(1).split(/[/-]/g);
	return (pathnameList[1] == 'scripts' && pathnameList[2] == '21717') ? true : false;
}
if(location.hostname == 'greasyfork.org' && isScriptPage())
	scriptPage();
var currentSelected = GM_getValue('translitWord');
if(currentSelected && translitWord[currentSelected])
	getTranslitWord = translitWord[currentSelected];

function getTranslitWord(text) {
	return text
	.replace(/ъ([еёюя])/g, function(found,p1,offset,s) {
		return 'y'+'eoua'['еёюя'.indexOf(p1)];
	})
	.replace(/([йжцчшщ])([еёюя])/g, function(found,p1,p2,offset,s) {
		return p1+'eoua'['еёюя'.indexOf(p2)];
	})
	.replace(/([жцчшщ])ь(и)/g, '$1y$2')
	.replace(/([жцчшщ])ь/g, '$1')
	.replace(/([бвгдзклмнпрстфх])([еёюяэ])/g, function(found,p1,p2,offset,s) {
		return p1+'eöüäè'['еёюяэ'.indexOf(p2)];
	})
	.replace(/[а-яё]/g, function(found,offset,s) {
		return ['a','b','v','g','d','ye','yo','ž','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','č','š','ś','','ŷ','j','e','yu','ya']['абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.indexOf(found)];
	});
}

function singleUpper(a, i, s) {
	var wb = getTranslitWord(a.toLowerCase());
	if(wb.length > 1) {
		for(var pi = i - 1; pi >= 0; pi--)
			if(/[а-яё]/i.test(s.charAt(pi)))
				break;
		for(var ni = i + 1; ni < s.length; ni++)
			if(/[а-яё]/i.test(s.charAt(ni)))
				break;
		for(var nif = ni + 1; nif < s.length; nif++)
			if(!/[а-яё]/i.test(s.charAt(nif)))
				break;
		var prevWordLastLetter = s.charAt(pi);
		var prevSpace = s.substring(pi + 1, i);
		var nextSpace = s.substring(i + 1, ni);
		var nextWord = s.substring(ni, nif);
		if( (/[А-ЯЁ]/.test(prevWordLastLetter) && !/[.…!?]/.test(prevSpace)) ||
				(nextWord && !/[а-яё]/.test(nextWord) && !/[.…!?]/.test(nextSpace)) )
			return wb.toUpperCase();
		return wb.charAt(0).toUpperCase() + wb.substring(1);
	}
	else {
		return wb.toUpperCase();
	}
}
function getTranslit(text) {
	return text.replace(/[А-ЯЁа-яё]+/g, function(a, i, s) {
		if(!/[А-ЯЁ]/.test(a))
			return getTranslitWord(a);
		if(!/[а-яё]/.test(a))
			return a.length == 1 ? singleUpper(a, i, s)
				: getTranslitWord(a.toLowerCase()).toUpperCase();
		return a.match(/([А-ЯЁ]?[а-яё]+)|([А-ЯЁ]+)/g).reduce(function(p, c) {
			if(!/[а-яё]/.test(c) && c.length > 1)
				return p + getTranslitWord(c.toLowerCase()).toUpperCase();
			var wb = getTranslitWord(c.toLowerCase());
			if(/[А-ЯЁ]/.test(c.charAt(0))) {
				var arr = wb.split('');
				for(var i = 0; i < arr.length; i++) {
					var upper = arr[i].toUpperCase();
					if(arr[i] != upper) {
						arr[i] = upper;
						break;
					}
				}
				wb = arr.join('');
			}
			return p + wb;
		}, '');
	});
}

function isTextInput(node) {
	var parentNode = node.parentNode;
	if('getAttribute' in parentNode) {
		if(parentNode.getAttribute('contenteditable') !== null)
			return true;
	}
	if('tagName' in parentNode) {
		var tagName = parentNode.tagName.toLowerCase();
		if(
			tagName == 'textarea' ||
			tagName == 'input' && (parentNode.type == 'text' || parentNode.type == 'password')
			)
			return true;
	}
}
function convertTextNodesTitle(node) {
    if(typeof node == 'string' && node !== '')
		document.title = getTranslit(node);
}
function convertTextNodes(node) {
	if(typeof node.title == 'string' && node.title !== '')
		node.title = getTranslit(node.title);
	if(typeof node.placeholder == 'string' && node.placeholder !== '')
		node.placeholder = getTranslit(node.placeholder);
	if(node.nodeType == 3) {
		if(isTextInput(node))
			return;
		node.nodeValue = getTranslit(node.nodeValue);
	}
	else {
		for(var i = 0; i < node.childNodes.length; i++) {
			convertTextNodes(node.childNodes[i]);
		}
	}
}

function addObserver(target, config, callback) {
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			callback.call(this, mutation);
		});
	});
	observer.observe(target, config);
	return observer;
}

function removeObserver(observer) {
	observer.disconnect();
}

function getNodes() {
	var _slice = Array.slice || Function.prototype.call.bind(Array.prototype.slice);
	var config = { childList: true, subtree: true };
	function getNode(mut) {
		var addedNodes = mut.addedNodes;
		var nodes = _slice(addedNodes);
		nodes.forEach(function(node) {
			convertTextNodes(node);
		});
	}
	var observer = addObserver(document, config, getNode);
	window.addEventListener('unload', function(event) {
		removeObserver(observer);
	}, false);
}

getNodes();
convertTextNodesTitle(document.title);
convertTextNodes(document.body);

})();