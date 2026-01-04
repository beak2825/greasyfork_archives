// ==UserScript==
// @name         ArxivMirror
// @namespace    https://github.com/yzs981130/ArxivMirror
// @homepage     https://github.com/yzs981130/ArxivMirror
// @version      0.2
// @author       yzs981130
// @description  Arxiv mirror for personal use
// @include      https://arxiv.org/abs/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443755/ArxivMirror.user.js
// @updateURL https://update.greasyfork.org/scripts/443755/ArxivMirror.meta.js
// ==/UserScript==

window.onload=function() {
	'use strict';
	let mirror = 'arxiv.yezhisheng.me';
	var ele = $(".full-text ul li a")[0];
	ele.href = ele.href.replace(/arxiv.org/g, mirror);

	GM_registerMenuCommand('Copy link', function() {
		const html = '<a href=\"' + window.location.href +'\">' + document.title.slice(document.title.indexOf(']') + 2) + '</a>'
		GM_setClipboard(html);
	}, 'r');
	GM_registerMenuCommand('Copy markdown link', function() {
	const markdown = '[' + document.title.slice(document.title.indexOf(']') + 2) + '](' + window.location.href + ')';
		GM_setClipboard(markdown);
	}, 'r');

// 	let h0 = document.querySelector('#abs-outer > div.extra-services > div.full-text > ul');
// 	let h1 = document.querySelector('#abs-outer > div.extra-services > div.full-text > ul > li:nth-child(1)');
// 	let h2 = h1.cloneNode(h1);
// 	h2.children[0].text = document.title.slice(document.title.indexOf(']') + 2);
// 	h2.children[0].href = window.location.href;
// 	h0.insertBefore(h2, h0.children[0]);

	let triple = document.createElement("div");
	triple.innerHTML = '<a href=\"' + window.location.href +'\">' + document.title.slice(document.title.indexOf(']') + 2) + '</a>'
	let authors = document.querySelector('.authors');
	triple.className = "authors";
	authors.parentElement.insertBefore(triple,authors);
	
	function selectElement(element) {
		if (window.getSelection) {
			var sel = window.getSelection();
			sel.removeAllRanges();
			var range = document.createRange();
			range.selectNodeContents(element);
			sel.addRange(range);
		} else if (document.selection) {
			var textRange = document.body.createTextRange();
			textRange.moveToElementText(element);
			textRange.select();
		}
	}
	function clearSelection() {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection) {
			document.selection.empty();
		}
	}
	selectElement(triple);
}
