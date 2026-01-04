// ==UserScript==
// @name         WaniKani I have nothing to say to you
// @namespace    wanikaniihavenothingtosaytoyou
// @version      1.0
// @description  Submitting an empty answer fails the review.
// @author       Sinyaven
// @match        https://www.wanikani.com/review/session
// @match        https://preview.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402358/WaniKani%20I%20have%20nothing%20to%20say%20to%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/402358/WaniKani%20I%20have%20nothing%20to%20say%20to%20you.meta.js
// ==/UserScript==

(function() {
    "use strict";

	/* global $ */

	document.getElementById("user-response").addEventListener("keydown", ev => {
		if (ev.key !== "Enter" || ev.target.value !== "" || ev.ctrlKey || ev.altKey || ev.metaKey) return;
		ev.target.value = $.jStorage.get("questionType") === "reading" ? "しらない" : "I don't know";
		if (ev.shiftKey) window.setTimeout(() => document.querySelector("#user-response + button").click(), 1);
	});
})();
