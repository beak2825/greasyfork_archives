// ==UserScript==
// @name         Vimfari
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16473/Vimfari.user.js
// @updateURL https://update.greasyfork.org/scripts/16473/Vimfari.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Settings
	var setings = {
		'j': 'scrollDown',
		'k': 'scrollUp',
		'gg': 'scrollToTop',
		'G': 'scrollToBottom',
		'u': 'scrollPageUp',
		'd': 'scrollPageDown'
	};

	// Methods
	window.scrollDown = function () {
		var yPos = $(window).scrollTop();
		$('html, body').animate({ scrollTop: yPos + 300 }, 150);
	};
	window.scrollUp = function () {
		var yPos = $(window).scrollTop();
		$('html, body').animate({ scrollTop: yPos - 300 }, 150);
	};
	window.scrollToTop = function () {
		$("html, body").animate({ scrollTop: 0 }, 200);
	};
	window.scrollToBottom = function () {
		$("html, body").animate({ scrollTop: $(document).height() }, 200);
	};
	window.scrollPageDown = function () {
		var yPos = $(window).scrollTop();
		$("html, body").animate({ scrollTop: yPos + $(window).height() }, 150);
	};
	window.scrollPageUp = function () {
		var yPos = $(window).scrollTop();
		$("html, body").animate({ scrollTop: yPos - $(window).height() }, 150);
	};

	// Remove AutoFocus at the first time
	$('input').blur();


	// Controllers
	var timing = 500;
	var lastKeypressTime = 0;
	var prevKey = '';

	$('html').keypress(function(e) {
		var unicode = e.keyCode? e.keyCode : e.charCode;
		var key = String.fromCharCode(unicode);

		// Detect the double key press
		var thisKeypressTime = new Date();
		if ( thisKeypressTime - lastKeypressTime <= timing ) {
			key = prevKey + key;
			thisKeypressTime = 0;
		}
		lastKeypressTime = thisKeypressTime;

		var fn = window[setings[key]];

		if(typeof fn === 'function') {
			fn();
		}

		console.log(key + " : " + unicode);
		prevKey = key;
	});

})();