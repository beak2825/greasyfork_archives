// ==UserScript==
// @name         Steam: Bypass age confirmation prompts
// @namespace    steam
// @version      2.1
// @description  Suppresses age confirmations on Steam store pages and community hubs
// @license      MIT
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/agecheck/*
// @match        https://store.steampowered.com/*/agecheck*
// @grant        none
// @run-at       document-start
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/18450/Steam%3A%20Bypass%20age%20confirmation%20prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/18450/Steam%3A%20Bypass%20age%20confirmation%20prompts.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// Set up 1 year cookies to bypass age verification
	const cookieOptions = "; Secure; Path=/; Max-Age=31536000; SameSite=None";

	// This cookie bypasses the "mature content - view page/cancel" screen.
	// It works on both community and the store.
	document.cookie = "wants_mature_content=1" + cookieOptions;


	if (location.hostname === "store.steampowered.com") {
		// This cookie bypasses the "enter your date of birth" screen.
		const twentyFiveYearsAgo = ((Date.now() - 788_400_000_000) / 1000).toFixed();
		document.cookie = "birthtime=" + twentyFiveYearsAgo + cookieOptions;

		// Reload after making sure we're actually on a page with an age gate
		window.addEventListener("DOMContentLoaded", () => {
			if (document.getElementById("app_agegate")) {
				location.reload();
			}
		});
	} else if (location.hostname === "steamcommunity.com") {
		// Auto reload if we managed to land on an age gate on our very
		// first load. The wants_mature_content cookie should prevent this.
		window.addEventListener("DOMContentLoaded", () => {
			const proceed = function (context = window) {
				if ("AcceptAppHub" in context) {
					context.Proceed?.();
				}
			};

			if ("wrappedJSObject" in window) {
				// Firefox sandbox, bypass and execute directly
				proceed(window.wrappedJSObject);
			} else {
				// Inject as script tag otherwise
				const script = document.createElement("script");
				script.text = `"use strict";(${proceed})();`;
				(document.head ?? document.documentElement).prepend(script);
				script.remove();
			}
		});
	}
})();
