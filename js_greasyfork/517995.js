// ==UserScript==
// @name         Allow Right-Click with Tampermonkey Menu Option
// @namespace    typpi.online
// @version      1.9
// @description  Allows right-clicking on websites that prevent it by clicking the menu button in the Tampermonkey extension.
// @author       Nick2bad4u
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @icon         https://i.gyazo.com/ba5b7116d7140e7a247e176c312b4bd5.png
// @license      UnLicense
// @tag          all
// @downloadURL https://update.greasyfork.org/scripts/517030/Allow%20Right-Click%20with%20Tampermonkey%20Menu%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/517030/Allow%20Right-Click%20with%20Tampermonkey%20Menu%20Option.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Function to enable right-click
	function enableRightClick() {
		document.addEventListener(
			'contextmenu',
			function (event) {
				event.stopPropagation();
			},
			true,
		);

		document.addEventListener(
			'mousedown',
			function (event) {
				if (event.button === 2) {
					event.stopPropagation();
				}
			},
			true,
		);

		document.addEventListener(
			'mouseup',
			function (event) {
				if (event.button === 2) {
					event.stopPropagation();
				}
			},
			true,
		);

		// Create a non-blocking notification
		const notification = document.createElement('div');
		notification.textContent = 'Right-click has been enabled!';
		notification.style.position = 'fixed';
		notification.style.top = '10vh'; // Set to 10% of the viewport height for better consistency
		notification.style.left = '50%';
		notification.style.transform = 'translate(-50%, -50%)';
		notification.style.backgroundColor = '#4CAF50';
		notification.style.color = 'white';
		notification.style.padding = '20px';
		notification.style.fontSize = '18px';
		notification.style.borderRadius = '10px';
		notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
		notification.style.zIndex = '99999';
		notification.style.opacity = '0';
		notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background-color 0.5s ease';
		notification.style.border = '2px solid black'; // Added black border
		notification.style.cursor = 'move'; // Indicate that the notification is draggable

		// Add a tooltip for drag functionality
		notification.title = 'Drag to move this notification';
		document.body.appendChild(notification);

		// Add an exit button
		const exitButton = document.createElement('button');
		exitButton.textContent = '×';
		exitButton.style.position = 'absolute';
		exitButton.style.top = '5px';
		exitButton.style.right = '10px';
		exitButton.style.background = 'transparent';
		exitButton.style.border = 'none';
		exitButton.style.color = 'white';
		exitButton.style.fontSize = '16px';
		exitButton.style.cursor = 'pointer';
		exitButton.addEventListener('click', () => {
			if (typeof colorInterval !== 'undefined') {
				clearInterval(colorInterval); // Clear the color interval
			}
			notification.style.opacity = '0';
			notification.style.transform = 'translate(-50%, -10%)';
			setTimeout(() => notification.remove(), 500);
		});
		notification.appendChild(exitButton);

		// Make the notification draggable
		let isDragging = false;
		let offsetX = 0;
		let offsetY = 0;

		notification.addEventListener('mousedown', (event) => {
			isDragging = true;
			offsetX = event.clientX - notification.getBoundingClientRect().left;
			offsetY = event.clientY - notification.getBoundingClientRect().top;
			notification.style.transition = 'none'; // Disable transition during drag
		});

		document.addEventListener('mousemove', (event) => {
			if (isDragging) {
				notification.style.left = `${event.clientX - offsetX}px`;
				notification.style.top = `${event.clientY - offsetY}px`;
				notification.style.transform = 'none'; // Disable centering during drag
			}
		});

		document.addEventListener('mouseup', () => {
			isDragging = false;
			notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background-color 0.5s ease'; // Re-enable transition
		});

		// Trigger the fade-in animation
		setTimeout(() => {
			notification.style.opacity = '1';
		}, 0);

		// Change color every second
		let randomColors = Array.from({ length: 4 }, () => `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`); // Generate random bright colors
		let colorIndex = 0;

		let isNotificationActive = true; // Flag to track if the notification is active

		let colorInterval = setInterval(() => {
			if (isNotificationActive && notification.style.opacity === '1') {
				// Only update color if visible and active
				colorIndex = (colorIndex + 1) % randomColors.length; // Cycle through colors
				notification.style.backgroundColor = randomColors[colorIndex];
			}
		}, 750); // Change color every 750ms

		// Clear the interval when fading out
		setTimeout(() => {
			if (isNotificationActive) {
				clearInterval(colorInterval);
				isNotificationActive = false; // Mark as inactive
				if (notification.parentNode) { // Check if notification is still in the DOM
					notification.style.opacity = '0';
					notification.style.transform = 'translate(-50%, -10%)';
					setTimeout(() => notification.remove(), 500); // Remove after fade-out
				}
			}
		}, 3000); // Start fade-out after 3 seconds
	}

	// Register the option in the Tampermonkey menu
	/* eslint-disable no-undef */
	GM_registerMenuCommand('Enable Right-Click', enableRightClick);
	/* eslint-enable no-undef */
})();
