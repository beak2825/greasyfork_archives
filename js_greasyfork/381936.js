// ==UserScript==
// @name         Vim-like Navigation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Use (h,j,k,l) to scroll around.  gg to go to top G to to bottom
// @author       Max Schulte
// @match        http*://*
// @match		 *://*/*
// @match		 *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381936/Vim-like%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/381936/Vim-like%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// Your code here...
	var keyLog = []

	document.onkeypress = function (e) {
		// if user is typing inside of a text box return
		if ( e.target.nodeName == 'INPUT' ) return;
		// event
		e = e || window.event;
		// horizontal and vertical
		var h = 0;
		var v = 0;
		// scroll amount
		keyLog.push(e.keyCode)
		//console.log(keyLog)
		var sa = 100;
		switch (e.keyCode){
			case 104:	// h
				h -= sa;
				keyLog = [];
				break;
			case 106:	// j
				v += sa;
				keyLog = [];
				break;
			case 107:	// k
				v -= sa;
				keyLog = [];
				break;
			case 108:	// l
				h += sa;
				keyLog = [];
				break;
			case 103: // gg
				if (keyLog[keyLog.length-2] != 103) {
					break;
				}
				window.scrollTo(0, 0);
				keyLog = [];
				return;
			case 71:	// G
				console.log(document.documentElement.scrollHeight)
				window.scrollTo(0, document.documentElement.scrollHeight)
				keyLog = [];
				return;
			default:
				keyLog = [];
				break;
		}
		window.scrollBy(h, v);
	};
})();