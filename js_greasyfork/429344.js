// ==UserScript==
// @name         YouTube Music New Releases Fixer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fix some really bad UI/UX decisions.
// @author       Vaughn Royko
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429344/YouTube%20Music%20New%20Releases%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/429344/YouTube%20Music%20New%20Releases%20Fixer.meta.js
// ==/UserScript==

(function () {
	"use strict";

	function addGlobalStyle(css) {
		const head = document.getElementsByTagName("head")[0];
		const style = document.createElement("style");
		style.type = "text/css";
		if (window.trustedTypes && window.trustedTypes.createPolicy) {
			// Create a Trusted Types policy if not already created
			if (!window.globalStylePolicy) {
				window.globalStylePolicy = window.trustedTypes.createPolicy("globalStylePolicy", {
					createHTML: (input) => input,
				});
			}
			style.innerHTML = window.globalStylePolicy.createHTML(css);
		} else {
			style.innerHTML = css;
		}
		head.appendChild(style);
	}

	// Remove elipsis/truncation from titles and subtitles
	addGlobalStyle(".title-group.style-scope.ytmusic-two-row-item-renderer { max-height: fit-content; }");
	addGlobalStyle(".subtitle.style-scope.ytmusic-two-row-item-renderer { max-height: fit-content; -webkit-line-clamp: none; }");

	function addAlbumStyles() {
		// Check in the subtitles for album types
		const subTitles = document.getElementsByClassName("subtitle");
		for (let subTitle of subTitles) {
			// Look for all the spans inside
			const albumTypes = subTitle.getElementsByClassName("yt-formatted-string");
			for (let albumType of albumTypes) {
				const albumCover = albumType.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("image")[0];
				if (albumCover) {
					// Colors and styles for each album type
					albumCover.style.boxSizing = "border-box";
					if (albumType.innerHTML === "Single" || albumType.innerHTML === "Song") {
						albumCover.style.border = "5px solid #ff0047";
						albumType.style.color = "#ff0047";
					} else if (albumType.innerHTML === "EP") {
						albumCover.style.border = "5px solid #a9ff00";
						albumType.style.color = "#a9ff00";
					} else if (albumType.innerHTML === "Album") {
						albumCover.style.border = "5px solid #00d0ff";
						albumType.style.color = "#00d0ff";
					}
				}
			}
		}
	}

	// Function to set up the mutation observer
	function setupMutationObserver() {
		const contentElement = document.getElementById("content");
		if (!contentElement) {
			// If content element doesn't exist yet, wait for it
			setTimeout(setupMutationObserver, 1000);
			return;
		}

		// Create a mutation observer to watch for changes in the content element
		const observer = new MutationObserver(function (mutationsList, observer) {
			// Check if any mutations occurred
			for (let mutation of mutationsList) {
				if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
					// New content was added, re-apply album styles
					addAlbumStyles();
					break;
				}
			}
		});

		// Start observing the content element for changes
		observer.observe(contentElement, {
			childList: true,
			subtree: true,
		});

		console.log("YouTube Music New Releases Fixer: MutationObserver set up successfully");
	}

	// Initial call to add album styles
	addAlbumStyles();

	// Set up the mutation observer when the page loads
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setupMutationObserver);
	} else {
		setupMutationObserver();
	}
})();