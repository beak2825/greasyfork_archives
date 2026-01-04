// ==UserScript==
// @name         PageAlwaysVisible
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable the Page Visibility API
// @author       gortik
// @license      MIT
// @match        https://www.twitch.tv/*
// @match        https://www.twitch.tv/popout/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476131/PageAlwaysVisible.user.js
// @updateURL https://update.greasyfork.org/scripts/476131/PageAlwaysVisible.meta.js
// ==/UserScript==

setFocusAlwaysOn();

function setFocusAlwaysOn() {
	console.log( document.location.href + ': trying FocusAlwaysOn');
	//Tricking Twitch to think that the stream is never tabbed off
	// Try to trick the site into thinking it's never hidden
	Object.defineProperty(document, 'hidden', {value: false, writable: false});
	Object.defineProperty(document, 'visibilityState', {value: 'visible', writable: false});
	Object.defineProperty(document, 'webkitVisibilityState', {value: 'visible', writable: false});
	document.dispatchEvent(new Event('visibilitychange'));
	document.hasFocus = function () { return true; };

	/*
	**	visibilitychange events are captured and stopped
	**	page listener handler will launch before this function :/
	*/
	
	document.addEventListener('visibilitychange', function(e) {
		e.stopImmediatePropagation();
	}, true, true);

	/*
	Object.defineProperty(window.document, 'hidden', {
		get: function () {
			return false;
		},
		configurable: true,
	});
	Object.defineProperty(window.document, 'visibilityState', {
		get: function () {
			return 'visible';
		},
		configurable: true,
	});
	window.document.dispatchEvent(new Event('visibilitychange'));
	*/

	//https://stackoverflow.com/questions/58772369/headless-google-chrome-how-to-prevent-sites-to-know-whether-their-window-is-foc
	// Set the player quality to "Source"
	//window.localStorage.setItem('s-qs-ts', Math.floor(Date.now()));
	//window.localStorage.setItem('video-quality', '{"default":"chunked"}');
}