// ==UserScript==
// @name            Instagram Close Fix
// @namespace       https://greasyfork.org/users/821661
// @description     work around, for the instagram bug to select elements when closing the post
// @match           https://www.instagram.com/*
// @version         1.6
// @author          hdyzen
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/470382/Instagram%20Close%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/470382/Instagram%20Close%20Fix.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const events = ['pointerdown', 'pointerup'];
	events.forEach((event) => addEvent(event));

	function addEvent(event) {
		document.addEventListener(event, (e) => {
			if (!e.target.closest('.x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k')) return;
			e.preventDefault();
			e.stopPropagation();
			document.querySelector('[role="button"]:has([points="20.643 3.357 12 12 3.353 20.647"])').click();
		});
	}
})();
