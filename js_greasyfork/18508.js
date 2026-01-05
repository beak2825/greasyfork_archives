// ==UserScript==
// @name         GLOBAL | enable selection
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18508/GLOBAL%20%7C%20enable%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/18508/GLOBAL%20%7C%20enable%20selection.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	var bodyEl = document.getElementsByTagName('body')[0];

	var styleEl = document.createElement('style');
	var rule = document.createTextNode('\
* {-webkit-touch-callout:default !important;-webkit-user-select:text !important;-moz-user-select:text !important;-ms-user-select:text !important;user-select:text !important;}\
	');

	styleEl.appendChild(rule);
	bodyEl.appendChild(styleEl);
	
});