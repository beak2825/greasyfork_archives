// ==UserScript==
// @name        Scroll To Top
// @description Scroll To Top.
// @namespace   2k1dmg@userscript
// @license     GPL version 3 or any later version; http://www.gnu.org/licenses/gpl.html
// @include     *
// @version     1
// @author      2k1dmg
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/21718/Scroll%20To%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/21718/Scroll%20To%20Top.meta.js
// ==/UserScript==

(function() {
'use strict';

var sttClassName = 'coTcfkMc_scrollToTop';
var timeoutID;
function scrollToTop() {
	var scrolled = window.pageYOffset || document.documentElement.scrollTop;
	var ch = document.documentElement.clientHeight;
	if(scrolled === 0) {
		clearTimeout(timeoutID);
		timeoutID = null;
		return;
	}
	else if(scrolled < ch) {
		window.scrollTo(0,parseInt(scrolled/1.3));
	}
	else if(scrolled < ch * 3) {
		window.scrollTo(0,parseInt(scrolled/1.5));
	}
	else {
		window.scrollTo(0,parseInt(scrolled/2));
	}
	timeoutID = setTimeout(scrollToTop, 15);
}

function onClick(event) {
	if(typeof timeoutID == 'number')
		return;
	scrollToTop();
}

function toggleScrollToTop() {
	var scrolled = window.pageYOffset || document.documentElement.scrollTop;
	var ch = document.documentElement.clientHeight;
	var elm = document.querySelector('.'+sttClassName);
	if(scrolled > ch/1.1) {
		elm.style.cssText = 'display: block;';
	}
	else {
		elm.style.cssText = 'display: none;';
	}
}
window.onscroll = toggleScrollToTop;

window.onwheel = function() {
	if(typeof timeoutID != 'number')
		return;
	clearTimeout(timeoutID);
	timeoutID = null;
};

function addCSSStyle() {
	var cssStyle = document.createElement('style');
	cssStyle.type = 'text/css';
	cssStyle.textContent = [
		'.'+sttClassName+' {',
		'	width: 40px;',
		'	height: 40px;',
		'	line-height: 30px;',
		'	text-align: center;',
		'	background: whiteSmoke;',
		'	font-weight: bold;',
		'	font-size: 25px;',
		'	color: #444;',
		'	text-decoration: none;',
		'	position: fixed;',
		'	bottom: 0;',
		'	right: 0;',
		'	display: none;',
		'	border: 1px solid grey;',
		'	border-top-left-radius: 8px;',
		'	box-shadow: 0 0 3px grey;',
		'	transition: opacity 250ms ease-out;',
		'	opacity: .1;',
		'	z-index: 1000;',
		'	cursor: pointer;',
		'}',
		'.'+sttClassName+':hover {',
		'	text-decoration: none;',
		'	opacity: 1;',
		'}'
	].join('\n');
	if(document.head)
		document.head.appendChild(cssStyle);
}

addCSSStyle();
var div = document.createElement('div');
div.className = sttClassName;
div.textContent = '↑';
div.onclick = onClick;
document.body.appendChild(div);
toggleScrollToTop();

})();