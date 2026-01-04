// ==UserScript==
// @name         time os veery important
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Removes bright colors from the website and editor. Still in development.
// @author       44D3A7HQ
// @match        https://scratch.mit.edu/projects/547134533/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428357/time%20os%20veery%20important.user.js
// @updateURL https://update.greasyfork.org/scripts/428357/time%20os%20veery%20important.meta.js
// ==/UserScript==

//I am aware of how bad this code is, I began this endeavour when I was not very good at javascript or css. This will be improved.

(function() {
    'use strict';
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

    //editor
    addGlobalStyle('audio, canvas, progress, video {    display: inline-block;    vertical-align: baseline;    cursor: none;}');   
})();
