// ==UserScript==
// @name         Duolingo Restore Golden
// @description  Duolingo used to show a golden circle around the skill icon when you reach level 5. After they introduced the legendary level, this golden circle is removed and the circle ramains gray. This script restores the golden circle.
// @version      0.1.0
// @author       Betty
// @namespace    https://github.com/BettyJJ
// @match        https://*.duolingo.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/447581/Duolingo%20Restore%20Golden.user.js
// @updateURL https://update.greasyfork.org/scripts/447581/Duolingo%20Restore%20Golden.meta.js
// ==/UserScript==

(function () {
	'use strict';


	init();


	/**
	 * initialize
	 */
	function init() {

		watch_page();

	}


	function watch_page() {
		const observer = new MutationObserver(function (mutationlist) {
			for (const { addedNodes } of mutationlist) {
				for (const node of addedNodes) {
					if (!node.tagName) continue; // not an element

					if (node.classList.contains('_15U-t')) {
						restore_golden(node);
					}

				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}


	/**
	 * restore the golden circle
	 * @param {Node} node Dom Node
	 */
	function restore_golden(node) {
		// only works for skills at level 5
		if (node.querySelector('.GkDDe') && node.querySelector('.GkDDe').textContent === '5') {
			node.querySelector('svg._2rKNN > g > path').style.fill = '#ffd90b';
		}
	}


})();
