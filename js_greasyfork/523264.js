// ==UserScript==
// @name         Hide Chinese Userstyles on Userstyles.World
// @namespace    typpi.online
// @version      1.6
// @description  Hide userstyles containing Chinese characters on userstyles.world
// @author       Nick2bad4u
// @license      UnLicense
// @match        https://userstyles.world/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userstyles.world
// @grant        none
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @downloadURL https://update.greasyfork.org/scripts/523264/Hide%20Chinese%20Userstyles%20on%20UserstylesWorld.user.js
// @updateURL https://update.greasyfork.org/scripts/523264/Hide%20Chinese%20Userstyles%20on%20UserstylesWorld.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Function to check if a string contains Chinese characters
	function containsChineseCharacters(text) {
		// Matches any Chinese characters in the range \u4E00-\u9FFF
		return /[\u4E00-\u9FFF]/.test(text);
	}

	// Function to process each card element
	function processCard(card) {
		// Get the text content from relevant child elements and trim whitespace
		const title = card.querySelector('.name')?.textContent.trim() || '';
		const description =
			card.querySelector('.card-body')?.textContent.trim() || '';
		const ariaLabel =
			card
				.querySelector('.card-header.thumbnail')
				?.getAttribute('aria-label')
				?.trim() || '';

		// Log the content being checked
		console.log(
			`Checking card: Title="${title}", Description="${description}", Aria-Label="${ariaLabel}"`,
		);

		// Check if any of these contain Chinese characters
		if (
			containsChineseCharacters(title) ||
			containsChineseCharacters(description) ||
			containsChineseCharacters(ariaLabel)
		) {
			// Hide the card if Chinese characters are found
			card.style.display = 'none';
			console.log(
				`Hiding card: Title="${title}", Description="${description}", Aria-Label="${ariaLabel}"`,
			);
		}
	}

	// Find all card elements on the page and process each
	document.querySelectorAll('.card').forEach(processCard);
})();
