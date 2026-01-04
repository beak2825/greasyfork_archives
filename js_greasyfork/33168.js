// ==UserScript==
// @name 	5ch&BBSViewser
// @description URLの補正と画像表示とジャンプ確認回避と広告削除とCSSの修正(ダブルクリックで再処理)
// @author 	GinoaAI
// @namespace 	https://greasyfork.org/ja/users/119008-ginoaai
// @version 	4.0.0.2
// @match 	*://*.5ch.net/*
// @match 	*://*.5ch.sc/*
// @match 	*://*.2ch.net/*
// @match 	*://*.2ch.sc/*
// @match 	*://*.bbspink.com/*
// @match 	*://*.jbbs.shitaraba.net/*
// @match 	*://*.open2ch.net/*
// @icon 	https://pbs.twimg.com/profile_images/1099150852390977536/nvzJU-oD_400x400.png
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @run-at 	document-Start
// @downloadURL https://update.greasyfork.org/scripts/33168/5chBBSViewser.user.js
// @updateURL https://update.greasyfork.org/scripts/33168/5chBBSViewser.meta.js
// ==/UserScript==

$(function() {


// [2ch.net]の広告削除 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  if (location.href.indexOf("2ch.net") >= 0) {
    $('iframe').remove();
    $('div[id*="banner"]').remove();
    $('div[class*="ad--bottom"]').remove();
    $('div[class*="footer push"]').remove();
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ [2ch.net]の広告削除

// [2ch.net]のCSSの修正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
  if (location.href.indexOf("2ch.net") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container_body { margin-right: 0px;}');
    addGlobalStyle('.post { width: 100%; }');
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ [2ch.net]のCSSの修正




// [5ch.net]の広告削除 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  if (location.href.indexOf("5ch.net") >= 0) {
    $('iframe').remove();
    $('div[id*="banner"]').remove();
    $('div[class*="ad--bottom"]').remove();
    $('div[class*="footer push"]').remove();
    $('div[div*="thumb5ch"]').remove();
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ [5ch.net]の広告削除

// [5ch.net]のCSSの修正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
  if (location.href.indexOf("5ch.net") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container_body { margin-right: 0px;}');
    addGlobalStyle('.post { width: 100%; }');
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ [5ch.net]のCSSの修正




// [bbspink.com]の広告削除 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  if (location.href.indexOf("bbspink.com") >= 0) {
    $('iframe').remove();
    $('div[id*="announcement"]').remove();
    $('div[id*="banner"]').remove();
    $('div[class*="banner"]').remove();
    $('div[class*="ad--bottom"]').remove();
    $('div[class*="footer push"]').remove();
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ [bbspink.com]の広告削除

// [bbspink.com]のCSSの修正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
  if (location.href.indexOf("bbspink.com") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container { width: 100%;}');
    addGlobalStyle('.post { width: 100%;}');
    addGlobalStyle('.col-md-4 { width: 20%; }');
    addGlobalStyle('.sidebar-nv { width: 19%; }');
    addGlobalStyle('.col-md-8 { width: 80%; }');
  }

  if (location.href.indexOf("mercury.bbspink.com/test/read.cgi") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container_body { margin-right: 0px;}');
    addGlobalStyle('.post { width: 100%; }');
  }

  if (location.href.indexOf("phoebe.bbspink.com/test/read.cgi") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container_body { width: 100%;}');
    addGlobalStyle('.col-md-4 { width: 20%; }');
    addGlobalStyle('.sidebar-nv { width: 19%; }');
    addGlobalStyle('.col-md-8 { width: 80%; }');
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ [bbspink.com]のCSSの修正




// リンクの補正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
$(function () {
  function traverse(elem){
    var kids = elem.childNodes;

    var kid;
    for(var a=0; a<kids.length; a++){
      kid = kids.item(a);
      if(kid.nodeType == 3){
        kid.nodeValue = kid.nodeValue
          .replace(/ttps:/g  , "https:")
          .replace(/hhttps:/g  , "https:")
          .replace(/ttp:/g  , "http:")
          .replace(/hhttp:/g  , "http:")
        ;
      }else{
        if(kid.childNodes.length>0){
          traverse(kid);
        }
      }
    }
  }

  traverse(document.body);
});
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ リンクの補正




// jump@2ch回避 とげとげ様 https://goo.gl/bd81ct _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
$(function () {
  $('a').each(function () {
    var addres = $(this).text();
    if (addres.slice(0, 4) == "http") {
      $(this).attr("href", addres);
      $(this).attr('target', '_blank');
    }
  });
});
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ jump@2ch回避 とげとげ様 https://goo.gl/bd81ct




// Text URL Linker os0x様 https://goo.gl/i29D46 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
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
				var ret = [], i = null;
				while (i = result.iterateNext()) ret.push(i);
				return ret;
		}
	return null;
}

})();
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ Text URL Linker os0x様 https://goo.gl/i29D46




// 2chサムネイル表示 とげとげ様 https://goo.gl/vGtvCy _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
$(function () {
  $('a').each(function () {
    var addres = $(this).text();
    var end = addres.substr(addres.length - 3);
    if (end == "jpg" || end == "png" || end == "gif" || end == "bmp" || end == "rge" || end == "rig") {
      $(this).after($('<BR><a href=' + addres + ' target="_blank"><img src=' + addres + ' style="max-width:40%;"></a></br>'));
    }
  });
});
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ 2chサムネイル表示 とげとげ様 https://goo.gl/vGtvCy




// 読み込み後のアドレスを削除 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
$(function () {
  function traverse(elem){
    var kids = elem.childNodes;

    var kid;
    for(var a=0; a<kids.length; a++){
      kid = kids.item(a);
      if(kid.nodeType == 3){
        kid.nodeValue = kid.nodeValue
          .replace(/http.{1,}.jpg[&].{1,}|http.{1,}.jpg[:].{1,}|http.{1,}.jpg/g  , "")
          .replace(/http.{1,}.png[&].{1,}|http.{1,}.png[:].{1,}|http.{1,}.png/g  , "")
          .replace(/http.{1,}.gif[&].{1,}|http.{1,}.gif[:].{1,}|http.{1,}.gif/g  , "")
          .replace(/http.{1,}.bmp[&].{1,}|http.{1,}.bmp[:].{1,}|http.{1,}.bmp/g  , "")
          .replace(/http.{1,}.rge[&].{1,}|http.{1,}.rge[:].{1,}|http.{1,}.rge/g  , "")
          .replace(/http.{1,}.rig[&].{1,}|http.{1,}.rig[:].{1,}|http.{1,}.rig/g  , "")
        ;
      }else{
        if(kid.childNodes.length>0){
          traverse(kid);
        }
      }
    }
  }

  traverse(document.body);
});
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ 読み込み後のアドレスを削除








// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ ダブルクリック用処理








  $('*').dblclick(function(e) {


// [2ch.net]の広告削除 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  if (location.href.indexOf("2ch.net") >= 0) {
    $('iframe').remove();
    $('div[id*="banner"]').remove();
    $('div[class*="ad--bottom"]').remove();
    $('div[class*="footer push"]').remove();
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ [2ch.net]の広告削除

// [2ch.net]のCSSの修正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
  if (location.href.indexOf("2ch.net") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container_body { margin-right: 0px;}');
    addGlobalStyle('.post { width: 100%; }');
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ [2ch.net]のCSSの修正




// [5ch.net]の広告削除 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  if (location.href.indexOf("5ch.net") >= 0) {
    $('iframe').remove();
    $('div[id*="banner"]').remove();
    $('div[class*="ad--bottom"]').remove();
    $('div[class*="footer push"]').remove();
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ [5ch.net]の広告削除

// [5ch.net]のCSSの修正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
  if (location.href.indexOf("5ch.net") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container_body { margin-right: 0px;}');
    addGlobalStyle('.post { width: 100%; }');
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ [5ch.net]のCSSの修正




// [bbspink.com]の広告削除 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
  if (location.href.indexOf("bbspink.com") >= 0) {
    $('iframe').remove();
    $('div[id*="banner"]').remove();
    $('div[class*="banner"]').remove();
    $('div[class*="ad--bottom"]').remove();
    $('div[class*="footer push"]').remove();
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ [bbspink.com]の広告削除

// [bbspink.com]のCSSの修正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
  if (location.href.indexOf("bbspink.com") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container { width: 100%;}');
    addGlobalStyle('.col-md-4 { width: 20%; }');
    addGlobalStyle('.sidebar-nv { width: 19%; }');
    addGlobalStyle('.col-md-8 { width: 80%; }');
  }

  if (location.href.indexOf("mercury.bbspink.com/test/read.cgi") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container_body { margin-right: 0px;}');
    addGlobalStyle('.post { width: 100%; }');
  }

  if (location.href.indexOf("phoebe.bbspink.com/test/read.cgi") >= 0) {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) {
        return
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
    addGlobalStyle('.container_body { width: 100%;}');
    addGlobalStyle('.col-md-4 { width: 20%; }');
    addGlobalStyle('.sidebar-nv { width: 19%; }');
    addGlobalStyle('.col-md-8 { width: 80%; }');
  }
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ [bbspink.com]のCSSの修正




// Text URL Linker os0x様 https://goo.gl/i29D46 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
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
				var ret = [], i = null;
				while (i = result.iterateNext()) ret.push(i);
				return ret;
		}
	return null;
}

})();
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ Text URL Linker os0x様 https://goo.gl/i29D46




// リンクの補正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
$(function () {
  function traverse(elem){
    var kids = elem.childNodes;

    var kid;
    for(var a=0; a<kids.length; a++){
      kid = kids.item(a);
      if(kid.nodeType == 3){
        kid.nodeValue = kid.nodeValue
          .replace(/ttps:/g  , "https:")
          .replace(/hhttps:/g  , "https:")
          .replace(/ttp:/g  , "http:")
          .replace(/hhttp:/g  , "http:")
        ;
      }else{
        if(kid.childNodes.length>0){
          traverse(kid);
        }
      }
    }
  }
  
  traverse(document.body);
});
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ リンクの補正




// 2chサムネイル表示 とげとげ様 https://goo.gl/vGtvCy _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
$(function () {
  $('a').each(function () {
    var addres = $(this).text();
    var end = addres.substr(addres.length - 3);
    if (end == "jpg" || end == "png" || end == "gif" || end == "bmp" || end == "rge" || end == "rig") {
      $(this).after($('<a href=' + addres + ' target="_blank"><img src=' + addres + ' style="max-width:40%;"></a></br>'));
    }
  });
});
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ 2chサムネイル表示 とげとげ様 https://goo.gl/vGtvCy




// jump@2ch回避 とげとげ様 https://goo.gl/bd81ct _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
$(function () {
  $('a').each(function () {
    var addres = $(this).text();
    if (addres.slice(0, 4) == "http") {
      $(this).attr("href", addres);
      $(this).attr('target', '_blank');
    }
  });
});
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ jump@2ch回避 とげとげ様 https://goo.gl/bd81ct




// 読み込み後のアドレスを削除 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
$(function () {
  function traverse(elem){
    var kids = elem.childNodes;

    var kid;
    for(var a=0; a<kids.length; a++){
      kid = kids.item(a);
      if(kid.nodeType == 3){
        kid.nodeValue = kid.nodeValue
          .replace(/http.{1,}.jpg[&].{1,}|http.{1,}.jpg[:].{1,}|http.{1,}.jpg/g  , "")
          .replace(/http.{1,}.png[&].{1,}|http.{1,}.png[:].{1,}|http.{1,}.png/g  , "")
          .replace(/http.{1,}.gif[&].{1,}|http.{1,}.gif[:].{1,}|http.{1,}.gif/g  , "")
          .replace(/http.{1,}.bmp[&].{1,}|http.{1,}.bmp[:].{1,}|http.{1,}.bmp/g  , "")
          .replace(/http.{1,}.rge[&].{1,}|http.{1,}.rge[:].{1,}|http.{1,}.rge/g  , "")
          .replace(/http.{1,}.rig[&].{1,}|http.{1,}.rig[:].{1,}|http.{1,}.rig/g  , "")
        ;
      }else{
        if(kid.childNodes.length>0){
          traverse(kid);
        }
      }
    }
  }
  
  traverse(document.body);
});
// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ 読み込み後のアドレスを削除


  });
});