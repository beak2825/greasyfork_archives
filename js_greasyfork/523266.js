// ==UserScript==
// @name         Hide Non-English Userstyles on Userstyles.World
// @namespace    typpi.online
// @version      1.10
// @description  Hide userstyles containing non-English characters on userstyles.world
// @author       Nick2bad4u
// @license      UnLicense
// @match        https://userstyles.world/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userstyles.world
// @grant        none
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @downloadURL https://update.greasyfork.org/scripts/523266/Hide%20Non-English%20Userstyles%20on%20UserstylesWorld.user.js
// @updateURL https://update.greasyfork.org/scripts/523266/Hide%20Non-English%20Userstyles%20on%20UserstylesWorld.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Function to check if a string contains non-English characters
	function containsNonEnglishCharacters(text) {
		// Allow English letters, digits, spaces, and common punctuation
		return /[^ -~\t\n\r]/.test(text);
		// Matches characters outside printable ASCII, tab, newline, and carriage return
	}

	// Find all card elements on the page
	document.querySelectorAll('.card').forEach((card) => {
		// Get the text content from relevant child elements
		const title = card.querySelector('.name')?.textContent.trim() || '';
		// Get the title of the userstyle
		const description =
			card.querySelector('.card-body')?.textContent.trim() || '';
		// Get the description of the userstyle
		const ariaLabel =
			card
				.querySelector('.card-header.thumbnail')
				?.getAttribute('aria-label') || '';
		// Get the aria-label which may contain a description

		// Log the content being checked
		console.log(
			`Checking card: Title="${title}", Description="${description}", Aria-Label="${ariaLabel}"`,
		);

		// Check if any of these contain non-English characters
		if (
			containsNonEnglishCharacters(title) ||
			containsNonEnglishCharacters(description) ||
			containsNonEnglishCharacters(ariaLabel)
		) {
			// Hide the card if non-English characters are found
			card.style.display = 'none';
			console.log(
				`Hiding card: Title="${title}", Description="${description}", Aria-Label="${ariaLabel}"`,
			);
		}
	});
})();
