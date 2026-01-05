// ==UserScript==
// @name         NightShine skin for My Little Chat
// @namespace    http://tampermonkey.net/
// @version      0.153
// @description  Изменяет вид ночного режима MyLittleChat.ru, автор не несет никакой ответственности за нанесенные повреждения вашей психике, компутеру, коту.. и другим предметам.
// @author       June Aurelius
// @match https://mylittlechat.ru/Комнаты
// @match https://mylittlechat.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25884/NightShine%20skin%20for%20My%20Little%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/25884/NightShine%20skin%20for%20My%20Little%20Chat.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.page {border:(0px, 0px, 0px, 0px); width:70% !important; min-width:1200px; } ');
addGlobalStyle('* {border: 0px solid black !important; } ');
addGlobalStyle('.nightModeRule { background-image:url("http://www.hiveworkshop.com/attachments/canterlot_evening___wallpaper_by_crappyunicorn-d3fxiqk-jpg.103311/") !important; }');
//
addGlobalStyle('.head {background: rgba(00,00, 00, 0.5)!important; }');
addGlobalStyle('.full {background: rgba(00,00, 00, 0.1)!important; }');
addGlobalStyle('.head > div {max-width: 1200px; }');
addGlobalStyle('.opis { weight: 100; background: rgba(20,20,20,0.7); color:white }'); 

addGlobalStyle('.msgContent,.radio.Control {background:rgba(00,00,00,0.5) !important; border: 0px solid black !important; padding 0px 0px 3px 3px; } ');
addGlobalStyle('.menuRightChat {padding: 10px 0px 3px 0px; } ');
addGlobalStyle('.userAvatar { margin: 5px; } ');
addGlobalStyle('.topContainer  { height: 33px; background: rgba(00,00, 00, 0.6) !important; border-bottom: 0px;}');
addGlobalStyle('.my .ava { border-radius: 16px 0px 16px 16px !important;} ');
addGlobalStyle('.another .ava { border-radius: 0px 16px 16px 16px !important;} ');
addGlobalStyle('.mCustomScrollbar.mCS_no_scrollbar { height: 33px }');

//
addGlobalStyle('.MessageContainer,.ChatDialog {background: rgba(00,00, 00, 0.45) !important; border-bottom: 0px; }');
addGlobalStyle('.FavSmiles { background: rgba(00,00, 00, 0.3) !important; padding 2px 0px; height: 65px; }');
addGlobalStyle('.FavSmiles, .smiles { border: 0px solid black !important; border-bottom: 5px solid rgba(00,00,00,0.25) !important; border-top: 5px solid rgba(00,00,00,0.25) !important; }');
addGlobalStyle('..smiles { background: rgba(255,255, 255, 0.1) !important; border: 0px solid black !important; }');
addGlobalStyle('.ShowSmiles { background: rgba(255,255,255, 0.05); width: 90px; padding: 5px 0px 0px 0px; }');
addGlobalStyle('.addMenu { background: rgba(255,255,255, 0.08); padding: 5px 0px 0px 0px; }');
// addGlobalStyle('.MessageContainer >div {background: rgba(255,255,255, 0.1); }');
addGlobalStyle('.sendMessage { background: rgba(185,185,255, 0.075); min-width: 120px; }');

// Панелька управления высотой
addGlobalStyle('.resizer {background: rgba(255,255,255, 0.1); box-sizing: border-box; border-radius: 0px 0px 10px 10px; }');

// Код для удаления лишнего, пока не работает
//var parentRC = document.getElementById("div.menuRightChat");
//var childBC = document.getElementById("div.backgroundChange");
//parentRC.removeChild(childBC);

// Text 2 clickable URL script
// Author os0x 
// Version 0.8.1

(function(){

function TextURLLinker(config) {
	if (TextURLLinker.isInit) return;
	TextURLLinker.isInit = true;
	var newtab = config.open_in_newtab;
	var noref = config.noreferrer;
	var style = escapeTags(config.link_style);
	var TEXT = 'descendant::text()[contains(self::text(),"ttp") and not(ancestor::'+
	      ['a','textarea','script','style','head'].join(' or ancestor::') + ')]';
	linker(document.body);

	function linker(doc){
		return $X(TEXT, doc).filter(function(txt){
			return linkfy(txt, 'h?ttp(s?://.*)', '[ 　\\)\\]\'\"\n]|$', 'http');
		});
	}

	function linkfy(node, start, end, prefix) {
		var linked = false;
		if (node.nodeValue.search(start) >= 0) {
			var text = node.nodeValue, index;
			var parent = node.parentNode;
			while (text && (index = text.search(start)) >= 0) {
				var _txt = node.splitText(index);
				var _end = _txt.nodeValue.search(end);
				var __txt = _txt.splitText(_end);
				var a = document.createElement('a');
				a.href = prefix + _txt.nodeValue.match(start)[1];
				newtab && a.setAttribute('target', '_blank');
				noref && a.setAttribute('rel', 'noreferrer');
				style && a.setAttribute('style', style);
				if (noref && typeof GM_openInTab !== 'undefined' && !window.getMatchedCSSRules) {
					a.addEventListener('click',function(e){
						e.preventDefault();
						GM_openInTab(a.href);
					},false);
				}
				a.appendChild(_txt);
				parent.insertBefore(a, __txt);
				text = __txt.nodeValue;
				node = __txt;
				linked = true;
			}
		}
		return linked;
	}
	function escapeTags(str){
		return str.replace(/["&<>]/g,function($){
			return '&'+{'"':'quot','&':'amp','<':'lt','>':'gt'}[$]+';';
		});
	}
	var wait = true;
	document.addEventListener('DOMNodeInserted',function(e){
		if (wait){
			setTimeout(function(){
				linker(document.body);
				wait = true;
			}, 1500);
			wait = false;
		}
	},true);
}
var TextURLLinkerID = 'aegfbpchoheaflicfmggkmlmcccpjpgd';
if (this.chrome && chrome.extension &&
   /aegfbpchoheaflicfmggkmlmcccpjpgd/.test(chrome.extension.getURL('manifest.json')) ){
	chrome.extension.sendRequest(TextURLLinkerID,'init', TextURLLinker);
} else if(this.safari){
	safari.self.tab.dispatchMessage('config','');
	safari.self.addEventListener('message',function(evt){
		TextURLLinker(evt.message);
	},false);
} else {
	TextURLLinker({
		open_in_newtab:true,
		noreferrer:true,
		link_style:'cursor:help;display:inline !important;'
	});
}

// XPath snippet from http://gist.github.com/184276

// XPath 式中の接頭辞のない名前テストに接頭辞 prefix を追加する
// e.g. '//body[@class = "foo"]/p' -> '//prefix:body[@class = "foo"]/prefix:p'
// http://nanto.asablo.jp/blog/2008/12/11/4003371
function addDefaultPrefix(xpath, prefix) {
	var tokenPattern = /([A-Za-z_\u00c0-\ufffd][\w\-.\u00b7-\ufffd]*|\*)\s*(::?|\()?|(".*?"|'.*?'|\d+(?:\.\d*)?|\.(?:\.|\d+)?|[\)\]])|(\/\/?|!=|[<>]=?|[\(\[|,=+-])|([@$])/g;
	var TERM = 1, OPERATOR = 2, MODIFIER = 3;
	var tokenType = OPERATOR;
	prefix += ':';
	function replacer(token, identifier, suffix, term, operator, modifier) {
		if (suffix) {
			tokenType = 
				(suffix == ':' || (suffix == '::' && (identifier == 'attribute' || identifier == 'namespace')))
				? MODIFIER : OPERATOR;
		} else if (identifier) {
			if (tokenType == OPERATOR && identifier != '*')
				token = prefix + token;
			tokenType = (tokenType == TERM) ? OPERATOR : TERM;
		} else {
			tokenType = term ? TERM : operator ? OPERATOR : MODIFIER;
		}
		return token;
	}
	return xpath.replace(tokenPattern, replacer);
}

// $X on XHTML
// $X(exp);
// $X(exp, context);
// @target Freifox3, Chrome3, Safari4, Opera10
// @source http://gist.github.com/184276.txt
function $X (exp, context) {
	context || (context = document);
	var _document  = context.ownerDocument || document,
	documentElement = _document.documentElement;
	var isXHTML = documentElement.tagName !== 'HTML' && _document.createElement('p').tagName === 'p';
	var defaultPrefix = null;
	if (isXHTML) {
		defaultPrefix = '__default__';
		exp = addDefaultPrefix(exp, defaultPrefix);
	}
	function resolver (prefix) {
		return context.lookupNamespaceURI(prefix === defaultPrefix ? null : prefix) ||
			   documentElement.namespaceURI || '';
	}

	var result = _document.evaluate(exp, context, resolver, XPathResult.ANY_TYPE, null);
		switch (result.resultType) {
			case XPathResult.STRING_TYPE : return result.stringValue;
			case XPathResult.NUMBER_TYPE : return result.numberValue;
			case XPathResult.BOOLEAN_TYPE: return result.booleanValue;
			case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
				// not ensure the order.
				var ret = [], i = null;
				while (i = result.iterateNext()) ret.push(i);
				return ret;
		}
	return null;
}

})();

   
