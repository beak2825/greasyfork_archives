// ==UserScript==
// @name        Alternative search engines 2.1
// @description Adds search on other sites for google, bing, yandex, duckduckgo. It is a version with a changed google input selector in the code of "Alternative search engines 2".
// @namespace   sarowx@userscript
// @license     GPL version 3 or any later version; http://www.gnu.org/licenses/gpl.html
// @version     0.2.1
// @grant       none
// @noframes
// @include     /^https?://yandex\.(ru|ua|by|kz|com|com\.tr)/.*$/
// @include     /^https?://www\.google\.(am|az|by|co\.uz|com|com\.tr|com\.ua|de|ee|fi|ge|kg|kz|lt|lv|md|ru|tm)/.*$/
// @include     https://encrypted.google.com/*
// @include     /^https?://www\.bing\.com/.*$/
// @include     /^https?://duckduckgo\.com/.*$/
// @downloadURL https://update.greasyfork.org/scripts/383270/Alternative%20search%20engines%2021.user.js
// @updateURL https://update.greasyfork.org/scripts/383270/Alternative%20search%20engines%2021.meta.js
// ==/UserScript==

// 2015-05-25

var SEARCH_ON = '• ';
var SEARCH_ON_END = ' •';
var LINK_BOX_ID = 'oeid-box';
var ENGINES_SEPARATOR = ' - ';
var POSITION = 'left';

var ENGINES = {
	Yandex: 'https://yandex.ru/yandsearch?text=',
	Google: 'https://www.google.com/search?q=',
	Bing: 'https://www.bing.com/search?q=',
	DuckDuckGo: 'https://duckduckgo.com/?q='
};

var PLACEHOLDER_SELECTORS = [
	'.content__left', // yandex
	'#resultStats', // google
	'.sb_count', // bing
	'#links_wrapper' // duckduckgo
].join(',');

var INPUT_FIELD_SELECTORS = [
	'.input__control', // yandex
	'input[name="q"]', // google
	'#sb_form_q', // bing
	'#search_form_input' // duckduckgo
].join(',');

function onClick(event) {
	var link = event.target;
	if(link.nodeName.toLowerCase() !== 'a')
		return;
	var engineSource = ENGINES[link.engineName];
	var engineURL;
	var engineParam = '';
	if(Array.isArray(engineSource)) {
		engineParam = engineSource[1];
		engineURL = engineSource[0];
	}
	else if(typeof engineSource === 'string') {
		engineURL = engineSource;
	}
	else {
		return;
	}
	var searchText = document.querySelector(INPUT_FIELD_SELECTORS);
	if(engineURL && searchText && searchText.value.length > 0) {
		var url = engineURL + encodeURIComponent(searchText.value) + engineParam;
		window.open(url, '_blank');
	}
}

function addCSSStyle() {
	var cssStyle = document.createElement('style');
	cssStyle.type = 'text/css';
	cssStyle.textContent = [
		'#' + LINK_BOX_ID + ' {',
		'	display: inline-block;',
		'	padding-right: 10px;',
		'	padding-bottom: 3px;',
		'	color: rgb(115, 115, 115);' ,
		'	font-family: Verdana,sans-serif;',
		'	font-size: 11px;',
		'	text-align: ' + POSITION + ';',
		'	z-index: 10000;',
		'}'
	].join('\n');
	document.head.appendChild(cssStyle);
}

var createFragment = (function() {
	var setCommon = function(node, sAttr, reason) {
		var aAttr = sAttr.split(',');
		aAttr.forEach(function(attr) {
			var attrSource = /:=/.test(attr) ? attr.split(':=') : [attr, ''];
			var attrName = attrSource[0].trim();
			var attrValue = attrSource[1].trim().replace(/^(['"])([^\1]*)\1$/, '$2');
			if(reason === 'a') {
				node.setAttribute(attrName, attrValue);
			}
			else {
				node[attrName] = attrValue;
			}
		});
		return node;
	};
	var setAttr = function(node, sAttr) {
		return setCommon(node, sAttr, 'a');
	};
	var setProp = function(node, sAttr) {
		return setCommon(node, sAttr, 'p');
	};
	var createFragmentInner = function(data, fragment) {
		if(data.n) {
			var node = document.createElement(data.n);
			if(data.a)
				node = setAttr(node, data.a);
			if(data.p)
				node = setProp(node, data.p);
			if(data.s)
				node.style.cssText = data.s;
			fragment.appendChild(node);
		}
		if(data.c) {
			data.c.forEach(function(cn) {
				createFragmentInner(cn, node || fragment);
			});
		}
		if(data.t && node) {
			node.appendChild(document.createTextNode(data.t));
		}
		if(data.tc) {
			fragment.appendChild(document.createTextNode(data.tc));
		}
		if(data.dn) {
			fragment.appendChild(data.dn);
		}
		return fragment;
	};
	return function(data) {
		var fragment = document.createDocumentFragment();
		return createFragmentInner({c:data}, fragment);
	};
})();

function createLinkBox() {
	return createFragment([
		{n:'div',a:'id:="'+LINK_BOX_ID+'"',c:(function() {
			var domain = document.domain;
			var aLinks = [{tc:SEARCH_ON}];
			for(var engine in ENGINES) {
				if(domain.indexOf(engine.toLowerCase()) !== -1)
					continue;
				aLinks.push(
					{n:'a',a:'href:="javascript:void(0)"',p:'engineName:="'+engine+'"',t:engine},
					{tc:ENGINES_SEPARATOR}
				);
			}
			aLinks[aLinks.length-1] = {tc:SEARCH_ON_END};
			return aLinks;
		})()}
	]);
}

function onDOMLoad() {
	var results = document.querySelector(PLACEHOLDER_SELECTORS);
	if(!results)
		return;
	if(document.getElementById(LINK_BOX_ID))
		return;
	addCSSStyle();
	var fragment = createLinkBox();
	var linkBox = fragment.querySelector('#'+LINK_BOX_ID);
	linkBox.onclick = onClick;
	results.insertBefore(fragment, results.firstChild);
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
	var trg = document.body;
	var params = { childList: true, subtree: true };
	var getNode = function(mut) {
		var addedNodes = mut.addedNodes;
		var nodes = _slice(addedNodes);
		nodes.forEach(function(node) {
			if(node.querySelector &&
					node.querySelector(PLACEHOLDER_SELECTORS)) {
				onDOMLoad();
			}
		});
	};
	var observer = addObserver(trg, params, getNode);
	window.addEventListener('unload', function(event) {
		removeObserver(observer);
	}, false);
}

onDOMLoad();
getNodes();