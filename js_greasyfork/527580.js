// ==UserScript==
// @name         Amazon Kindle Ebook Library Downloader
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically download your entire Kindle ebook library from Amazon
// @match        https://www.amazon.com/hz/mycd/digital-console/contentlist/booksAll/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @author       Audun Kvasbø
// @downloadURL https://update.greasyfork.org/scripts/527580/Amazon%20Kindle%20Ebook%20Library%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527580/Amazon%20Kindle%20Ebook%20Library%20Downloader.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Utility: Wait for a selector to appear
	function waitForElement(selector, root = document, timeoutMs = 10000) {
		return new Promise((resolve, reject) => {
			const el = root.querySelector(selector);
			if (el) return resolve(el);

			const observer = new MutationObserver(() => {
				const foundEl = root.querySelector(selector);
				if (foundEl) {
					observer.disconnect();
					resolve(foundEl);
				}
			});

			observer.observe(root, { childList: true, subtree: true });

			setTimeout(() => {
				observer.disconnect();
				reject(`Timeout waiting for ${selector}`);
			}, timeoutMs);
		});
	}

	// Helper: Click an element when it’s found
	async function clickWhenReady(selector, root = document, timeoutMs = 10000) {
		try {
			const el = await waitForElement(selector, root, timeoutMs);
			el.click();
			console.log('Clicked', selector);
		} catch (error) {
			console.warn(`Selector ${selector} not found within ${timeoutMs}ms. Skipping...`);
		}
	}

	// Process all dropdowns for the current page
	async function processDropdowns() {
		// Requery dropdowns on each page
		const dropdowns = [...document.querySelectorAll('[class^="Dropdown-module_container__"]')];

		// Limit the number of dropdowns for testing or processing
		const toDownload = dropdowns.length;

		console.log(`Processing ${toDownload} dropdowns on this page...`);

		for (let i = 0; i < toDownload; i++) {
			const dropdown = dropdowns[i];

			// Click dropdown to open it
			dropdown.click();
			console.log(`Dropdown ${i + 1} opened`);

			// Download & Transfer button
			try {
				await clickWhenReady('[id^="DOWNLOAD_AND_TRANSFER_ACTION_"]', dropdown);
				console.log('Download & Transfer button clicked.');
			} catch (error) {
				console.warn('Download & Transfer button not found for this dropdown. Skipping...');
			}

			// Choose the first Kindle in the list
			try {
				await clickWhenReady('span[id^="download_and_transfer_list_"]', dropdown);
				console.log('Download to Kindle list option selected.');
			} catch (error) {
				console.warn('No Kindle option available in this dropdown. Skipping...');
			}

			// Confirm download
			try {
				await clickWhenReady('[id^="DOWNLOAD_AND_TRANSFER_ACTION_"][id$="_CONFIRM"]', dropdown);
				console.log('Confirm Download button clicked.');
			} catch (error) {
				console.warn('Confirm Download button not found. Skipping...');
			}

			// Close success notification screen
			try {
				// Wait for the notification close button
				const notificationCloseButton = await waitForElement('span[id="notification-close"]', document, 15000); // Extended timeout
				if (notificationCloseButton) {
					notificationCloseButton.click();
					console.log('Notification close button clicked.');
				}
			} catch (error) {
				console.warn('Notification close button not found or did not appear. Skipping...');
			}

			// Wait before processing the next dropdown
			await new Promise(resolve => setTimeout(resolve, 1000));
			console.log(`Dropdown ${i + 1} processed.`);
		}

		// Handle pagination for the next page
		const nextPage = document.querySelector('.pagination .page-item.active')?.nextElementSibling;

		if (nextPage) {
			// Click the next page button
			nextPage.click();
			console.log('Clicked next page... waiting for content to load.');

			// Wait for the new dropdown container to update
			await new Promise(resolve => setTimeout(resolve, 3000)); // Fallback for pagination delay
			await processDropdowns(); // Recursively process dropdowns on the next page
		} else {
			console.log('No next page found. All dropdowns processed.');
			alert("Reached the last page - we should be good!");
		}
	}

	window.addEventListener('load', () => {
		// Start script after a short delay so Amazon’s UI can settle
		setTimeout(() => processDropdowns(), 3000);
	});
})();
