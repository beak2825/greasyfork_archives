// ==UserScript==
// @name         GLOBAL | document link sticker
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18507/GLOBAL%20%7C%20document%20link%20sticker.user.js
// @updateURL https://update.greasyfork.org/scripts/18507/GLOBAL%20%7C%20document%20link%20sticker.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	var bodyEl = document.getElementsByTagName('body')[0];
		
	var link_thispage = document.createElement('a');
	link_thispage.setAttribute('id', 'link_thispage');
	link_thispage.setAttribute('title', 'document link');
	link_thispage.setAttribute('href', location.href);
	link_thispage.innerHTML = document.title || 'document link';
	
	bodyEl.appendChild(link_thispage);

	var styleEl = document.createElement('style');
	var rule = document.createTextNode('\
#link_thispage {position:fixed;top:0;right:0;bottom:auto !important;z-index:999999999;width:auto !important;height:auto !important;font-size:0.5em;padding:2px;background-color:skyblue !important;color:#fff !important;}\
	');

	styleEl.appendChild(rule);
	bodyEl.appendChild(styleEl);
});