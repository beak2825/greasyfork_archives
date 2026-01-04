// ==UserScript==
// @name         PvPRP Auto-Download
// @namespace    https://tampermonkey.net/
// @version      0.31
// @description  Automatically downloads PvPRP texture packs for you
// @author       darraghd493 (github.com/darraghd493)
// @match        *://*.pvprp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pvprp.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467663/PvPRP%20Auto-Download.user.js
// @updateURL https://update.greasyfork.org/scripts/467663/PvPRP%20Auto-Download.meta.js
// ==/UserScript==

(function () {
	"use strict";

	var removedYoutubeElement = false;
	var clickedDownloadElement = false;

	// Initialise the script
	log("Loading pvprp Auto Download.js");

	// Wait for the website to load
	log("Waiting for website to load");

	var parentInterval = setInterval(function () {
		if (document.readyState === "complete") {
			// Get the subscribe element by its div
			var subscribeDiv = document.getElementById("fullstep-1");

			// Check if it has any <a> tags
			if (subscribeDiv != null && subscribeDiv.getElementsByTagName("a") != null && subscribeDiv.getElementsByTagName("a").length && !removedYoutubeElement) {
				var subscribeElement = subscribeDiv.getElementsByTagName("a")[0];
				log("Found subscribe element: " + subscribeElement);

				// Remove the href attribute
				if (subscribeElement && subscribeElement.tagName.toLowerCase() === "a") {
					subscribeElement.removeAttribute("href");
					log("Removed href attribute from subscribe element");

					subscribeElement.click();
					log("Clicked subscribe element");

					removedYoutubeElement = true;
				}
			}

			// Create an interval and search for the download link
			if (!clickedDownloadElement) {
				var downloadInterval = setInterval(function () {
					// Go through all hrefs and find the one that contains "/packs/"
					var elements = document.querySelectorAll("a");

					for (var i = 0; i < elements.length; i++) {
						var element = elements[i];
						var href = element.getAttribute("href");
						if (href) {
							if (href.startsWith("assets/packs") && !clickedDownloadElement) { // Double check to prevent duplicate downloods
								log("Found download link: " + href);

								// Click the element
								element.click();
								clickedDownloadElement = true;

								// Clear the intervals
								clearInterval(parentInterval);
								clearInterval(downloadInterval);
								break;
							}
						}
					}
				}, 100);
			}
		}
	}, 100);

	// Functions
	function log(str) {
		console.log("%c%s", "color: red; font: 1.2rem/1 Tahoma;", str);
	}
})();
