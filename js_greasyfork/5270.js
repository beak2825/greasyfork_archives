// ==UserScript==
// @name         GreasyFork 代码页格式化代码
// @name:zh-TW   GreasyFork 代碼頁面格式化代碼
// @name:en      GreasyFork re-format code page

// @description       在代码页添加重新格式化代码的链接
// @description:zh-TW 在代碼頁面添加一個格式化代碼的連接
// @description:en    Add an extra link to reformat the code on source page.

// @namespace    org.jixun.gf.reformat.code
// @version      1.0.1
// @include      https://greasyfork.org/scripts/*/code
// @include      https://greasyfork.org/*/scripts/*/code

// @require      https://greasyfork.org/scripts/5259/code/exports.js
// @require      https://greasyfork.org/scripts/5266/code/js-beautify.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.2/highlight.min.js
// @copyright    2014+, Jixun
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/5270/GreasyFork%20%E4%BB%A3%E7%A0%81%E9%A1%B5%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/5270/GreasyFork%20%E4%BB%A3%E7%A0%81%E9%A1%B5%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

var __ = (function (lang) {
	var ln = navigator.language;
	if (lang[ln.slice(0, 2)]) {
		ln = ln.slice(0, 2);
	} else if (!lang[ln]) {
		return function (text) {
			return text;
		};
	}
	
	lang = lang[ln];
	return function (text) {
		return lang[text] || text;
	};
})({
	'zh': {
		Reformat: '格式化'
	}
});

addEventListener ('DOMContentLoaded', function () {
	var styleBlock   = document.createElement ('link'),
		newCodeBlock = document.createElement ('pre'),
		linkReFormat = document.createElement ('a'),
		reformatSpan = document.createElement ('span'),
		codeBlock    = document.querySelector ('#script-content .code>pre'),
		codeRay      = document.querySelector ('#script-content > .CodeRay'),
		currentLink  = document.querySelector ('#script-links > li.current > span');
	
	// Preload stylesheet 
	styleBlock.rel = 'stylesheet';
	styleBlock.href = '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.2/styles/github.min.css';
	document.head.appendChild (styleBlock);
	
	linkReFormat.style.cursor = 'pointer';
	linkReFormat.textContent = __('Reformat');
	linkReFormat.addEventListener ('click', function (e) {
		e.preventDefault ();
		// reformatSpan.style.display = 'none';
		reformatSpan.parentNode.removeChild (reformatSpan);
		
		console.info ('Begin fix the code');
		newCodeBlock.textContent = exports.js_beautify (codeBlock.textContent);
		codeRay.style.display = 'none';
		codeRay.parentNode.insertBefore (newCodeBlock, codeRay);
		newCodeBlock.style.margin = 0;
		newCodeBlock.parentNode.style.padding = 0;
		
		console.info ('Begin Highlight');
		hljs.highlightBlock (newCodeBlock);
		
		console.info ('All done.');
	});
	
	currentLink.appendChild (reformatSpan);
	reformatSpan.appendChild (document.createTextNode (' [ '));
	reformatSpan.appendChild (linkReFormat);
	reformatSpan.appendChild (document.createTextNode (' ]'));
}, false);