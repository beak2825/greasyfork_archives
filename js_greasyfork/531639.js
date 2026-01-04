// ==UserScript==
// @name         Automatically Select First Google Account to Sign In
// @namespace    typpi.online
// @version      1.7
// @description  Automatically selects the first Google account in the Google account selector page
// @author       Nick2bad4u
// @match        https://accounts.google.com/*
// @grant        none
// @license      Unlicense
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL https://update.greasyfork.org/scripts/531639/Automatically%20Select%20First%20Google%20Account%20to%20Sign%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/531639/Automatically%20Select%20First%20Google%20Account%20to%20Sign%20In.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Configurable delay for automatic selection (default: 5000ms)
	const AUTO_SELECT_DELAY_MS = 5000;

	// Function to select the first account
	const selectFirstAccount = () => {
		const firstAccount = Array.from(document.querySelectorAll('li')).find((el) => el.textContent.includes('@gmail.com'));
		if (firstAccount) {
			const firstLink = firstAccount.querySelector('div[role="link"]');
			if (firstLink) {
				firstLink.click();
			} else {
				console.log(
					'First account link not found. Ensure the page contains a <li> element with a child <div> having role="link". This might be due to changes in the page structure or the account list not being fully loaded.',
				);
			}
		} else {
			console.log('First account not found on the page. Waiting for the element to load dynamically via MutationObserver...');
		}
	};

	// Set up a MutationObserver to wait for dynamic content
	const observer = new MutationObserver(() => {
		if (Array.from(document.querySelectorAll('li')).some((el) => el.textContent.includes('@gmail.com'))) {
			selectFirstAccount();
			observer.disconnect(); // Stop observing once the element is found
		}
	});

	// Observe changes in the document body
	observer.observe(document.body, { childList: true, subtree: true });

	// Automatically run the function after 5 seconds
	setTimeout(() => {
		if (Array.from(document.querySelectorAll('li')).some((el) => el.textContent.includes('@gmail.com'))) {
			selectFirstAccount();
		} else {
			console.log('Account list not loaded within 5 seconds. Skipping automatic selection.');
		}
	}, AUTO_SELECT_DELAY_MS);
})();
