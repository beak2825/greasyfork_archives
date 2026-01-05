// ==UserScript==
// @name        Linkify Google Calendar Event Description
// @namespace   http://boris.joff3.com
// @description Displays clickable links found in Google calendar event description text
// @include     https://calendar.google.com/*
// @include     http://calendar.google.com/*
// @version     0.9
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/17183/Linkify%20Google%20Calendar%20Event%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/17183/Linkify%20Google%20Calendar%20Event%20Description.meta.js
// ==/UserScript==

/*
The MIT License (MIT) Copyright (c) 2016 Boris Joffe

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
'use strict';

var DBG = true;

function getTextarea() {
	return document.querySelectorAll('#coverinner textarea')[0];
}

function getDesc(textarea) {
	if (textarea) {
		return textarea.textContent;
	} else {
		return '';
	}
}

function getLinks(desc) {
	return desc.match(/http[^\s\]]*/) || [];
}

function A(url) {
	return '<a href="' + url + '" target=_blank>' + url + '</a>';
}

function DIV(html) {
	var div = document.createElement('div');
	div.id = 'eventDescriptionLinks';
	div.innerHTML = '<br><h3>Links in event description</h3>';
	div.innerHTML += html;
	return div;
}

function appendAfter(element, html) {
	if (!(element instanceof HTMLElement)) {
		throw new Error('element is not defined. element was: ' + element);
	}
	element.parentNode.appendChild(html);
}

function main() {
	var
		textarea  = getTextarea(),
		desc      = getDesc(textarea),
		links     = getLinks(desc),
		htmlLinks = links.map(A),
		container = textarea,
		div       = DIV(htmlLinks);

	appendAfter(container, div);
}

main();

function dbg() {
	if (DBG) {
		console.log.apply(console, arguments);
	}
}

(function (oldPushState) {
	// monkey patch pushState so that script works when navigating around Facebook
	window.history.pushState = function () {
		dbg('running pushState');
		oldPushState.apply(window.history, arguments);
		setTimeout(main, 1000);
	};
	dbg('monkey patched pushState');
})(window.history.pushState);

window.onpopstate = function () {
	//dbg('pop state');
	setTimeout(main, 1000);
};

window.onhashchange = main;

window.addEventListener('load', main, true);

}());
