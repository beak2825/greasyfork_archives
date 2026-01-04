// ==UserScript==
// @name         CSSreloader
// @namespace    DuKaT
// @version      0.8
// @description  That allows you to reload all the CSS files of any site or local HTML file without you have to reload the page itself. Just press F8.
// @author       DuKaT
// @match        file:///*
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33638/CSSreloader.user.js
// @updateURL https://update.greasyfork.org/scripts/33638/CSSreloader.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const eventCode = 'F8';
	// @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
	const keyCode = 119; // F8

	function reload() {
		const hrefSuffix = 'cssreloader=' + Date.now();

		document.querySelectorAll('link[rel="stylesheet"][href]').forEach((linkEl) => {
			const href = linkEl.href.replace(/[?&]cssreloader=\d+$/, '');
			linkEl.href = href + (href.indexOf('?') === -1 ? '?' : '&') + hrefSuffix;
		});
    }

	document.addEventListener('keyup', (evt) => {
		if (evt.code !== undefined) {
			if (evt.code === eventCode) {
				reload();
			}
		} else if (evt.keyCode === keyCode) {
			reload();
        }
	});

})();