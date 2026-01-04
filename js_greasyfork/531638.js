// ==UserScript==
// @name         Auto Click Google Sign-In Button
// @namespace    typpi.online
// @version      1.3
// @description  Automatically clicks the Google sign-in button on the page
// @author       Nick2bad4u
// @match        https://www.strava.com/login
// @grant        none
// @license      Unlicense
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @downloadURL https://update.greasyfork.org/scripts/531638/Auto%20Click%20Google%20Sign-In%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531638/Auto%20Click%20Google%20Sign-In%20Button.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Function to find and click the Google sign-in button
	const clickGoogleSignIn = () => {
		const buttons = Array.from(document.querySelectorAll('button, a')); // Get all buttons and links
		const googleButton = buttons.find((btn) => btn.innerText.includes('Sign In With Google'));
		if (googleButton) {
			googleButton.click();
		} else {
			console.log('Google Sign-In button not found.');
		}
	};

	// Use MutationObserver to wait for the button if the page loads dynamically
	const observer = new MutationObserver(() => {
		const buttons = Array.from(document.querySelectorAll('button, a'));
		const googleButton = buttons.find((btn) => btn.innerText.includes('Sign In With Google'));
		if (googleButton) {
			clickGoogleSignIn();
			observer.disconnect(); // Stop observing once the button is found and clicked
		}
	});

	// Observe changes in the document body
	observer.observe(document.body, { childList: true, subtree: true });
})();
