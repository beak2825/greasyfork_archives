// ==UserScript==
// @name        Github Whitespace Ignorer
// @namespace   ameboide
// @author      ameboide
// @description Ignores whitespace on Github Diffs
// @include     *://github.com/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/3009/Github%20Whitespace%20Ignorer.user.js
// @updateURL https://update.greasyfork.org/scripts/3009/Github%20Whitespace%20Ignorer.meta.js
// ==/UserScript==

function w1(){
	var as = document.querySelectorAll('[href*="/commit/"]:not([href$="w=1"]), [href*="/pull/"]:not([href$="w=1"])');
	for(var i=0; i<as.length; i++){
		as[i].href += (as[i].href.indexOf('?') > -1 ? '&' : '?') + 'w=1';
	}
}
setInterval(w1, 1000);