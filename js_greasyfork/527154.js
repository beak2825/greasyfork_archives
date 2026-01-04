// ==UserScript==
// @name         Mark All Merged/Closed Notifications Done
// @namespace    typpi.online
// @version      1.8
// @description  Marks all merged and closed notifications as "done" on GitHub (client-side) and only shows UI when needed. Includes console logging and error handling.
// @author       Nick2bad4u
// @match        https://github.com/notifications
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @license      Unlicense
// @tag          github
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
//
// @downloadURL https://update.greasyfork.org/scripts/527154/Mark%20All%20MergedClosed%20Notifications%20Done.user.js
// @updateURL https://update.greasyfork.org/scripts/527154/Mark%20All%20MergedClosed%20Notifications%20Done.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const DONE_BUTTON_SELECTOR = 'button[aria-label="Done"]';
	const NOTIFICATION_SELECTOR = '.notifications-list-item';
	const MERGED_ICON_SELECTOR = 'svg.octicon-git-merge';
	const CLOSED_ICON_SELECTOR = 'svg.octicon-git-pull-request-closed';
	const DELAY_MS = 500; // Delay after each action (adjust as needed)

	let markAsDoneButton; // Declare the button outside the function

	function addButton() {
			try {
					markAsDoneButton = document.createElement('button');
					markAsDoneButton.textContent = 'Mark All Merged/Closed Done';
					markAsDoneButton.classList.add('mark-merged-done-button');
					markAsDoneButton.addEventListener('click', markAllMergedAndClosedAsDone);
					markAsDoneButton.style.display = 'none'; // Initially hide the button

					const notificationsToolbar = document.querySelector('.js-socket-channel.js-updatable-content');
					if (notificationsToolbar) {
							notificationsToolbar.appendChild(markAsDoneButton);
							console.log('Mark All Merged/Closed Done button added to notifications toolbar.');
					} else {
							console.warn('Could not find notifications toolbar. Button may not be visible.');
							document.body.appendChild(markAsDoneButton); // Fallback
							console.log('Mark All Merged/Closed Done button added to document body as fallback.');
					}

					// Check for relevant notifications and show the button if needed
					checkForMergedAndClosedNotifications();
			} catch (error) {
					console.error('Error in addButton function:', error);
			}
	}

	function checkForMergedAndClosedNotifications() {
			try {
					const notifications = document.querySelectorAll(NOTIFICATION_SELECTOR);
					let hasRelevantNotifications = false;

					for (const notification of notifications) {
							if (notification.querySelector(MERGED_ICON_SELECTOR) || notification.querySelector(CLOSED_ICON_SELECTOR)) {
									hasRelevantNotifications = true;
									break; // No need to continue checking
							}
					}

					if (hasRelevantNotifications) {
							markAsDoneButton.style.display = 'block'; // Show the button
							console.log('Relevant notifications found. Showing Mark All Merged/Closed Done button.');
					} else {
							markAsDoneButton.style.display = 'none'; // Hide the button
							console.log('No relevant notifications found. Hiding Mark All Merged/Closed Done button.');
					}
			} catch (error) {
					console.error('Error in checkForMergedAndClosedNotifications function:', error);
			}
	}

	async function markAllMergedAndClosedAsDone() {
			try {
					const notifications = document.querySelectorAll(NOTIFICATION_SELECTOR);
					console.log(`Found ${notifications.length} notifications.`);

					for (const notification of notifications) {
							const isMerged = notification.querySelector(MERGED_ICON_SELECTOR);
							const isClosed = notification.querySelector(CLOSED_ICON_SELECTOR);

							if (isMerged || isClosed) {
									console.log(`Marking ${isMerged ? 'merged' : 'closed'} notification as done`);
									const doneButton = notification.querySelector(DONE_BUTTON_SELECTOR);

									if (doneButton) {
											doneButton.click();
											await delay(DELAY_MS); // Wait for the UI to update
									} else {
											console.warn('Could not find "Done" button for notification.');
									}
							}
					}

					console.log('Finished processing notifications.');
					checkForMergedAndClosedNotifications(); // Recheck after marking
			} catch (error) {
					console.error('Error in markAllMergedAndClosedAsDone function:', error);
			}
	}

	// Helper function to introduce a delay
	function delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
	}

	const style = document.createElement('style');
	document.head.appendChild(style);
	style.textContent = `
			.mark-merged-done-button {
					position: fixed;
					bottom: 50px; /* Adjusted bottom position */
					right: 10px;
					z-index: 999; /* Ensure it's below the other button if necessary */
					background-color: #2ea44f; /* Same color as the other script */
					color: #ffffff;
					border: none;
					padding: 10px;
					border-radius: 5px;
					cursor: pointer;
			}
			.mark-merged-done-button:hover {
					background-color: #79e4f2; /* Same hover color as the other script */
			}
	`;

	window.addEventListener('load', addButton);
})();
