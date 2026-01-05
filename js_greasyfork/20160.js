// ==UserScript==
// @name         Firebug Mobile
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/20160/Firebug%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/20160/Firebug%20Mobile.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	if(!document.getElementById('devTools')){
        document.addEventListener('DOMNodeInserted', function(){
            if(document.getElementById('devTools')){
                document.getElementsByTagName('html')[0].style.cssText = 'margin-bottom:'+document.getElementById('devTools').offsetHeight+'px';
            }
        });
		// devTools UI
		var elDevTools = document.createElement('div');
		elDevTools.setAttribute('id', 'devTools');
		elDevTools.style.cssText = '';
		document.body.appendChild(elDevTools);

		// devTools CSS
		var styleEl = document.createElement('style');
		var rule = document.createTextNode('\
#devTools {position:fixed !important;left:0;right:0;bottom:0;width:100%;z-index:2147483647 !important;background-color:rgba(0,0,0,.7);}\
#devTools a {display:block;color:yellow !important;}\
	');
		styleEl.appendChild(rule);
		document.body.appendChild(styleEl);
	}

	var btn_firebug = document.createElement('button');
	btn_firebug.setAttribute('type', 'button');
	btn_firebug.setAttribute('title', 'firebug 실행');
    btn_firebug.addEventListener('click', function(){
        javascript:(function(){
            var fb = document.createElement('script');
            fb.type = 'text/javascript';
            fb.src = 'https://getfirebug.com/firebug-lite.js#startOpened';
            document.getElementsByTagName('body')[0].appendChild(fb);
        })();
    });
	btn_firebug.style.cssText = 'width:100%;';
	btn_firebug.innerHTML = 'Firebug';

	document.getElementById('devTools').appendChild(btn_firebug);
});