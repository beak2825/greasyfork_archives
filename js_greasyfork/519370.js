// ==UserScript==
// @name         Strava Text Auto-Selector
// @namespace    typpi.online
// @version      1.0.9
// @description  Automatically selects text in specific Strava elements and displays a notification near the cursor. Also allows right-click to copy text.
// @author       Nick2bad4u
// @license      UnLicense
// @homepageURL  https://github.com/Nick2bad4u/UserScripts
// @grant        none
// @include      *://*.strava.com/activities/*
// @include      *://*.strava.com/athlete/training
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @downloadURL https://update.greasyfork.org/scripts/519370/Strava%20Text%20Auto-Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/519370/Strava%20Text%20Auto-Selector.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Log when the script starts
	console.log('Strava Text Auto-Selector script loaded.');

	// Wait for the page to fully load
	window.addEventListener('load', function () {
		console.log('Page fully loaded, initializing script.');

		// Delay script execution for 500 ms
		setTimeout(initializeScript, 500);
	});

	function initializeScript() {
		console.log('Initializing script after delay.');

		const selectors = [
			'#search-results > tbody > tr:nth-child(n) > td.view-col.col-title > a',
			'.summaryGrid .summaryGridDataContainer, .inline-stats strong, .inline-stats b',
			'#heading > div > div.row.no-margins.activity-summary-container > div.spans8.activity-summary.mt-md.mb-md > div.details-container > div > h1',
			'.ride .segment-effort-detail .effort-details table, .swim .segment-effort-detail .effort-details table',
			'.activity-description p:only-child',
			'.activity-description p:first-child',
		];
		const summarySelector = '.summaryGridDataContainer';

		// Function to add the event listener to target elements
		function addContextMenuListener(element) {
			console.log('Adding right-click event listener to element:', element);

			element.addEventListener('contextmenu', function (event) {
				console.log('Right-click detected on element:', element);

				event.preventDefault();
				console.log('Default right-click menu prevented.');

				const range = document.createRange();
				if (element.classList.contains('summaryGridDataContainer')) {
					const textNode = element.childNodes[0];
					range.selectNodeContents(textNode);
					console.log('Text range selected:', textNode.textContent);
				} else {
					range.selectNodeContents(element);
					console.log('Text range selected:', element.textContent);
				}

				const selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
				console.log('Text added to selection.');

				const copiedText = selection.toString();
				console.log('Text copied to clipboard:', copiedText);

				navigator.clipboard
					.writeText(copiedText)
					.then(() => {
						console.log('Clipboard write successful.');
						showNotification(event.clientX, event.clientY, 'Text Copied!');
					})
					.catch(() => {
						console.log('Clipboard write failed.');
						showNotification(event.clientX, event.clientY, 'Failed to Copy!');
					});
			});
		}

		// Query elements and add event listeners initially for the first three selectors
		selectors.forEach((selector) => {
			const elements = document.querySelectorAll(selector);
			console.log(`Found ${elements.length} elements for selector: ${selector}`);
			elements.forEach(addContextMenuListener);
		});

		// Function to handle the summaryGridDataContainer elements separately
		function handleSummaryGridDataContainer() {
			const elements = document.querySelectorAll(summarySelector);
			console.log(`Found ${elements.length} elements for selector: ${summarySelector}`);
			elements.forEach(addContextMenuListener);
		}

		// MutationObserver to detect changes in the DOM and add event listeners to new summaryGridDataContainer elements
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						if (node.matches(summarySelector)) {
							addContextMenuListener(node);
						}
						node.querySelectorAll(summarySelector).forEach(addContextMenuListener);
					}
				});
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
		console.log('MutationObserver set up to monitor the DOM for summaryGridDataContainer.');

		// Handle existing summaryGridDataContainer elements initially
		handleSummaryGridDataContainer();
	}

	function showNotification(x, y, message) {
		console.log('Displaying notification:', message);

		const notification = document.createElement('div');
		notification.textContent = message;
		notification.style.position = 'absolute';
		notification.style.left = `${x + 10}px`;
		notification.style.top = `${y + 10}px`;
		notification.style.background = 'rgba(0, 0, 0, 0.8)';
		notification.style.color = 'white';
		notification.style.padding = '5px 10px';
		notification.style.borderRadius = '5px';
		notification.style.fontSize = '12px';
		notification.style.zIndex = '1000';
		notification.style.pointerEvents = 'none';

		document.body.appendChild(notification);
		console.log('Notification added to DOM.');

		setTimeout(() => {
			notification.remove();
			console.log('Notification removed from DOM.');
		}, 2000);
	}
})();
