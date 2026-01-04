// ==UserScript==
// @name         Garmin Connect: Select All Participants for Challenges
// @namespace    typpi.online
// @version      1.8
// @description  Adds a button to select all participants in Garmin Connect challenges and logs participant details
// @author       Nick2bad4u
// @match        https://connect.garmin.com/modern/challenge/create-challenge
// @grant        none
// @license      Unlicense
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @downloadURL https://update.greasyfork.org/scripts/532475/Garmin%20Connect%3A%20Select%20All%20Participants%20for%20Challenges.user.js
// @updateURL https://update.greasyfork.org/scripts/532475/Garmin%20Connect%3A%20Select%20All%20Participants%20for%20Challenges.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Create the button
	const button = document.createElement('button');
	button.textContent = 'Select All Participants';
	button.className = 'select-participants-button'; // custom class to avoid duplicate insertions

	// Adjust styling suitable for inline placement (instead of fixed position)
	button.style.marginLeft = '10px';
	button.style.padding = '5px 10px';
	button.style.backgroundColor = '#007bff';
	button.style.color = '#fff';
	button.style.border = 'none';
	button.style.borderRadius = '5px';
	button.style.cursor = 'pointer';

	// Button click handler: simulate a click event on each checkbox
	button.addEventListener('click', () => {
		// Find all checkbox inputs within the participant labels
		const checkboxes = document.querySelectorAll('label.ConnectionParticipant_connection__9WFV6 input[type="checkbox"]');
		checkboxes.forEach((checkbox) => {
			// Only simulate click if not already checked (to avoid toggling off)
			if (!checkbox.checked) {
				checkbox.click();
			}
			// Log participant details by retrieving the name element in the same label structure
			const participantNameElement = checkbox.closest('label').querySelector('div.ConnectionParticipant_name__A620Z');
			const participantName = participantNameElement ? participantNameElement.textContent.trim() : 'Unknown';
			console.log(`Simulated click on participant: ${participantName}`);
		});

		console.log(`Total simulated clicks: ${checkboxes.length}`);
		// Create a popup notification
		const notification = document.createElement('div');
		notification.textContent = `Successfully selected ${checkboxes.length} participants!`;
		notification.style.position = 'absolute';
		notification.style.top = `${button.offsetTop + button.offsetHeight + 10}px`;
		notification.style.left = `${button.offsetLeft}px`;
		notification.style.backgroundColor = '#007bff';
		notification.style.color = '#fff';
		notification.style.padding = '10px 20px';
		notification.style.borderRadius = '5px';
		notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
		notification.style.zIndex = '1000';

		// Append the notification near the button
		button.parentElement.appendChild(notification);

		// Remove the notification after 3 seconds
		setTimeout(() => {
			notification.remove();
		}, 3000);
	});

	// Function that looks for the section title element and inserts the button when found
	function insertButton() {
		const sectionTitle = document.querySelector('div.CreateChallengePageIndex_sectionTitle__kLfj1');
		if (sectionTitle && sectionTitle.textContent.includes('Who do you want to challenge?') && !sectionTitle.querySelector('.select-participants-button')) {
			// Append the button to the section title element
			sectionTitle.appendChild(button);
			console.log('Select button inserted into the section title element.');
			// Once inserted, stop further observation
			observer.disconnect();
		}
	}

	// Create a MutationObserver to monitor the DOM for the section title element
	const observer = new MutationObserver(() => {
		insertButton();
	});

	// Start observing the document body
	observer.observe(document.body, { childList: true, subtree: true });

	// Also try to insert immediately in case the element is already present
	insertButton();
})();
