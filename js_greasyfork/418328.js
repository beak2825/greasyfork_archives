// ==UserScript==
// @name         auto like on webinar
// @namespace    http://tampermonkey.net/
// @version      1
// @description  auto like on webinar infinity
// @author       https://vk.com/dimamakarov12345
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @match        https://events.webinar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418328/auto%20like%20on%20webinar.user.js
// @updateURL https://update.greasyfork.org/scripts/418328/auto%20like%20on%20webinar.meta.js
// ==/UserScript==
(function () {
	function press(link) {
		for (let i = 0; i < link.length; i++) {
			const element = link[i];
			element.click();
		}
		setTimeout(() => {
			press(link);
		}, 100);
	}
	("use strict");
	setTimeout(() => {
		let link = document.querySelectorAll(
			"div.Reaction__rippleContainer___gaQaA"
		);
		link = Array.from(link);
		press(link);
	}, 10000);
})();
