// ==UserScript==
// @name         Twitch: Event Remover
// @namespace    http://tampermonkey.net/
// @version      2017.10.31
// @description  Remove Upcoming and Recent Events from directory
// @author       Amraki
// @include      *://*twitch.tv/directory/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34693/Twitch%3A%20Event%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/34693/Twitch%3A%20Event%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$(document).ready(function() {
		var maxAttempts = 200; // 20 secs
		var i = 0;

		var returnVal = setInterval(function() {
			if ($("div.featured-events-layout__column").length) {
				$("div.featured-events-layout__column").remove();
			}

			if (i === maxAttempts) {
				clearInterval(returnVal);
			}
			i++;
		}, 100);

	});
})();