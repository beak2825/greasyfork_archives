// ==UserScript==
// @name         document link sticker & Enable Selection & form post to get
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/17860/document%20link%20sticker%20%20Enable%20Selection%20%20form%20post%20to%20get.user.js
// @updateURL https://update.greasyfork.org/scripts/17860/document%20link%20sticker%20%20Enable%20Selection%20%20form%20post%20to%20get.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	var bodyEl = document.getElementsByTagName('body')[0];
	
	// document link sticker & Enable Selection
	
	var link_thispage = document.createElement('a');
	link_thispage.setAttribute('id', 'link_thispage');
	link_thispage.setAttribute('title', 'document link');
	link_thispage.setAttribute('href', location.href);
	link_thispage.innerHTML = document.title || 'document link';
	
	bodyEl.appendChild(link_thispage);

	var styleEl = document.createElement('style');
	var rule = document.createTextNode('\
* {-webkit-touch-callout:default !important;-webkit-user-select:text !important;-moz-user-select:text !important;-ms-user-select:text !important;user-select:text !important;}\
#link_thispage {position:fixed;top:0;right:0;bottom:auto !important;z-index:999999999;width:auto !important;height:auto !important;font-size:0.5em;padding:2px;background-color:skyblue !important;color:#fff !important;}\
	');

	styleEl.appendChild(rule);
	bodyEl.appendChild(styleEl);
	
	// set post to get of form method
	
	var btn_formposttoget = document.createElement('a');
	btn_formposttoget.setAttribute('id', 'btnFormPostToGet');
	btn_formposttoget.setAttribute('title', 'form post to get');
	btn_formposttoget.innerHTML = 'form post to get';
	btn_formposttoget.addEventListener('click', function(){
		var forms = document.getElementsByTagName('form');
		for(var i=0; i<forms.length; i+=1){
			forms[i].setAttribute('method', 'get');
			forms[i].method = 'get';
		}
		alert('set post to get of <form>');
	});
	
	bodyEl.appendChild(btn_formposttoget);

	var styleEl = document.createElement('style');
	var rule = document.createTextNode('\
#btnFormPostToGet {position:fixed;top:25%;right:0;bottom:auto !important;z-index:999999999;width:auto !important;height:auto !important;font-size:0.5em;padding:2px;background-color:skyblue !important;color:#fff !important;}\
	');

	styleEl.appendChild(rule);
	bodyEl.appendChild(styleEl);
});