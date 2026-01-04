// ==UserScript==
// @name         gamedev.ru - top menu always visible
// @namespace    gamedev.ru
// @description  top menu always visible
// @version      0.1
// @author       entryway
// @include      /^https?:\/\/(www.)?gamedev\.ru\/.*$/
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/435097/gamedevru%20-%20top%20menu%20always%20visible.user.js
// @updateURL https://update.greasyfork.org/scripts/435097/gamedevru%20-%20top%20menu%20always%20visible.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
	'use strict';

	if (['interactive', 'complete'].includes(document.readyState)) {
		jsStuff();
	} else {
		addEventListener('DOMContentLoaded', jsStuff);
	}

	function jsStuff() {
		topMenuAlwaysVisible();
	}

	function topMenuAlwaysVisible() {
		function makeVisible(elem) {
			elem.style.display = 'block';
			elem.style.opacity = '1';
		}

		const top_menu = document.getElementById('tool');
		makeVisible(top_menu);

		const observer = new MutationObserver(mutations => {
			mutations.forEach(() => {
				makeVisible(top_menu);
			});
		});
		const config = {attributes: true, childList: false, characterData: false};
		observer.observe(top_menu, config);
	}
})();
