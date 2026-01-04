// ==UserScript==
// @name        nhentai block popunders
// @namespace   sayixz01icji0pgmio1f4ayoth4vpuj2
// @description Blocks popunder ads on nhentai
// @license     MIT License
// @match       *://*.nhentai.net/*
// @version     1.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/40184/nhentai%20block%20popunders.user.js
// @updateURL https://update.greasyfork.org/scripts/40184/nhentai%20block%20popunders.meta.js
// ==/UserScript==

/* jshint bitwise: true, curly: true, eqeqeq: true, esversion: 6,
funcscope: false, futurehostile: true, latedef: true, noarg: true,
nocomma: true, nonbsp: true, nonew: true, notypeof: false,
shadow: outer, singleGroups: true, strict: true, undef: true,
unused: true, varstmt: true, browser: true */

(function () {
	"use strict";
	
	const HOUR = 60 * 60 * 1000;

	// Next popunder in 2h
	function killPopunders() {
		const key = "popunder_state";

		let state;

		try {
			let savedState = localStorage.getItem(key);

			if (savedState) {
				state = JSON.parse(savedState);
			}
		} catch (ignore) {}

		if (!state) {
			state = {};
		}

		state.lock_until = Date.now() + 2 * HOUR;

		try {
			localStorage.setItem(key, JSON.stringify(state));
		} catch (ignore) {}
	}

	killPopunders();

	// Call this again every hour just to make sure
	setInterval(killPopunders, HOUR);
})();
