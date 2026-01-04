// ==UserScript==
// @name         Give 'Ride-ons' to everyone on Zwift Feed
// @namespace    typpi.online
// @version      2.3
// @description  Click all buttons with a 750ms delay between each click
// @author       Nick2bad4u
// @license      UnLicense
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @grant        none
// @run-at       document-idle
// @include      *://*.zwift.com/feed
// @icon         https://www.google.com/s2/favicons?sz=256&domain=zwift.com
// @downloadURL https://update.greasyfork.org/scripts/519908/Give%20%27Ride-ons%27%20to%20everyone%20on%20Zwift%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/519908/Give%20%27Ride-ons%27%20to%20everyone%20on%20Zwift%20Feed.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let isClicking = false;
	let intervalId = null;
	// Define startStopButton globally
	let startStopButton = null;

	// Function to click buttons with a delay using a promise
	function clickButtonWithDelay(button, delay) {
		return new Promise((resolve) => {
			setTimeout(() => {
				button.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
				button.click();
				console.log('Clicked button');
				resolve();
			}, delay);
		});
	}

	// Function to click all buttons sequentially
	async function clickButtonsSequentially(buttons, delay) {
		for (let i = 0; i < buttons.length; i++) {
			await clickButtonWithDelay(buttons[i], delay);
		}
	}

	// Main process to find and click buttons, and keep scrolling
	async function startClickingProcess() {
		if (isClicking) return;
		isClicking = true;
		console.log('Starting the clicking process...');

		intervalId = setInterval(async () => {
			const buttons = Array.from(
				document.querySelectorAll('.button.button--rideon:not(.clicked)'),
			);
			if (buttons.length > 0) {
				console.log(`Found ${buttons.length} buttons. Clicking...`);
				await clickButtonsSequentially(buttons, 750); // 750ms delay
				buttons.forEach((button) => button.classList.add('clicked'));
			} else {
				console.log('No new buttons found at this moment.');
			}
		}, 3000); // Check for new buttons every 3 seconds
	}

	// Stop the clicking process
	function stopClickingProcess() {
		if (!isClicking) return;
		isClicking = false;
		clearInterval(intervalId);
		intervalId = null;
		console.log('Stopped the clicking process.');
	}

	// Toggle the clicking process
	function toggleClickingProcess() {
		if (isClicking) {
			stopClickingProcess();
			startStopButton.textContent = 'Give Ride-ons';
		} else {
			startClickingProcess();
			startStopButton.textContent = 'Stop';
		}
	}

	// Create a UI integrated into the navbar
	function createUI() {
		const navRight = document.querySelector('.PrimaryNav-module__right--_UfGm');
		if (!navRight) {
			console.error('Navbar not found. UI cannot be created.');
			return;
		}

		const uiContainer = document.createElement('li');
		uiContainer.className =
			'PrimaryNav-module__hideNav--2X2zV PrimaryNav-module__lessLinks--2fidO';
		// Assign to the global variable
		startStopButton = document.createElement('a');
		startStopButton.textContent = 'Give Ride-ons';
		startStopButton.className = 'PrimaryNav-module__page-link--24LJd';
		startStopButton.style.cursor = 'pointer';
		startStopButton.style.marginRight = '10px';
		startStopButton.addEventListener('click', toggleClickingProcess);

		uiContainer.appendChild(startStopButton);
		navRight.appendChild(uiContainer);
	}

	createUI();
})();
