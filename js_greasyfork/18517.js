// ==UserScript==
// @name         GLOBAL | DevTool(view url, useragent)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18517/GLOBAL%20%7C%20DevTool%28view%20url%2C%20useragent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/18517/GLOBAL%20%7C%20DevTool%28view%20url%2C%20useragent%29.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	if(!document.getElementById('devTool')){
		document.addEventListener('DOMNodeInserted', function(){
			if(document.getElementById('devTool')){
				document.getElementsByTagName('html')[0].style.cssText = 'margin-bottom:'+document.getElementById('devTool').offsetHeight+'px';
			}
		});
		// devTool UI
		var elDevTool = document.createElement('div');
		elDevTool.setAttribute('id', 'devTool');
		elDevTool.setAttribute('class', 'close');
		document.body.appendChild(elDevTool);

		// devTool controller(toggle height)
		var elDevToolController = document.createElement('button');
		elDevToolController.setAttribute('type', 'button');
		elDevToolController.setAttribute('id', 'devToolController');
		elDevToolController.innerHTML = '↕';

		elDevToolController.addEventListener('click', function(){
			console.log('click');
			if(document.getElementById('devTool').getAttribute('class') === 'close'){
				document.getElementById('devTool').setAttribute('class', 'open');
			} else {
				document.getElementById('devTool').setAttribute('class', 'close');
			}
		});
		elDevTool.appendChild(elDevToolController);

		// devTool CSS
		var styleEl = document.createElement('style');
		var rule = document.createTextNode('\
#devTool,\
#devTool.close {position:fixed !important;left:0;right:0;bottom:0;width:calc(100% - 50px);padding-right:50px;z-index:2147483647 !important;color:yellow !important;background-color:rgba(0,0,0,.7);}\
#devTool.open {top:0;}\
#devTool.close * {white-space:nowrap;}\
#devTool a {display:block;color:yellow !important;}\
#devTool #devToolController {position:absolute;top:0;bottom:0;right:0;width:50px;}\
	');

		styleEl.appendChild(rule);
		document.body.appendChild(styleEl);
	}

	// view useragent
	var elUserAgent = document.createElement('p');
	elUserAgent.setAttribute('href', navigator.userAgent);
	elUserAgent.innerHTML = navigator.userAgent;
	document.getElementById('devTool').appendChild(elUserAgent);

	// view url
	var elUrl = document.createElement('p');
	elUrl.setAttribute('id', 'elUrl');
	elUrl.setAttribute('title', 'document link');
	elUrl.setAttribute('href', location.href);
	elUrl.style.cssText = 'overflow:hidden;float:left;width:calc(100% - 40px);color:yellow;word-break:break-all;';
	elUrl.innerHTML = location.href;

	document.getElementById('devTool').appendChild(elUrl);
	document.getElementById('devTool').appendChild(elUrl);
});