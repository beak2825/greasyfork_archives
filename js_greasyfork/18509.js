// ==UserScript==
// @name         GLOBAL | form post to get sticker
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18509/GLOBAL%20%7C%20form%20post%20to%20get%20sticker.user.js
// @updateURL https://update.greasyfork.org/scripts/18509/GLOBAL%20%7C%20form%20post%20to%20get%20sticker.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	var bodyEl = document.getElementsByTagName('body')[0];

	var btn_formposttoget = document.createElement('button');
	btn_formposttoget.setAttribute('id', 'btnFormPostToGet');
	btn_formposttoget.setAttribute('type', 'button');
	btn_formposttoget.setAttribute('title', 'form post to get');
	btn_formposttoget.innerHTML = 'form post to get';
	btn_formposttoget.addEventListener('click', function(){
		for(var i=0; i<document.forms.length; i+=1){
            try {
                document.forms[i].setAttribute('method', 'get');
                document.forms[i].method = 'get';
            } catch(e){}
		}
		alert('set post to get of <form>');
	});

	bodyEl.appendChild(btn_formposttoget);

	var styleEl = document.createElement('style');
	var rule = document.createTextNode('\
#btnFormPostToGet {position:fixed;bottom:0;right:0;top:auto !important;z-index:999999999;width:auto !important;height:auto !important;font-size:1em;padding:2px;background-color:#000 !important;color:#fff !important;}\
	');

	styleEl.appendChild(rule);
	bodyEl.appendChild(styleEl);
});