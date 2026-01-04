// ==UserScript==
// @name           Old/New Twitter Toggle
// @namespace      https://github.com/w4tchdoge
// @version        2.0.0-20230725_001425
// @description    Adds ability to switch back and forth between dimdem's Old Twitter layout and the current Twitter layout
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://twitter.com/*
// @grant          GM_registerMenuCommand
// @grant          GM.registerMenuCommand
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license        AGPL-3.0-or-later
// @history        2.0.0 — Rewrote the thing once I realised there are clickable DOM elements that take you back and forth between Old and New Twitter
// @history        1.0.0 — Initial release
// @downloadURL https://update.greasyfork.org/scripts/471640/OldNew%20Twitter%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/471640/OldNew%20Twitter%20Toggle.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function toggleTwitter() {
		switch (window.location.href.includes('newtwitter=true')) {
			case true:
				document.evaluate('.//a[text()[contains(.,"Open this page in OldTwitter")]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
				break;

			case false:
				document.querySelector('#about > a').click();
				break;

			default:
				break;
		}
	}

	/* Below taken from https://stackoverflow.com/a/2511474/11750206 */
	/* Handler for the Keyboard Shortcut for Toggle Twitter */
	function toggleTwitter_handler(e) {
		/* Keyboard Shortcut for Toggle Twitter — Shift + Alt + K */
		if (e.shiftKey && e.altKey && e.code === 'KeyK') {
			/* Execute  */
			toggleTwitter();
		}
	}
	/* Register the toggleTwitter handler */
	document.addEventListener('keyup', toggleTwitter_handler, false);

	GM.registerMenuCommand('Toggle Twitter', toggleTwitter);

})();