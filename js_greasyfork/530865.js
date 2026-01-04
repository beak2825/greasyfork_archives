// ==UserScript==
// @name         SteamTrade Matcher Bulk Notification Deleter
// @namespace    typpi.online
// @version      2.8
// @description  Select notifications via UI, navigate to each page, fetch token, send POST, and continue sequentially
// @author       Nick2bad4u
// @match        *://*.steamtradematcher.com/*
// @grant        none
// @license      Unlicense
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamtradematcher.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=steamtradematcher.com
//
// @downloadURL https://update.greasyfork.org/scripts/530865/SteamTrade%20Matcher%20Bulk%20Notification%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/530865/SteamTrade%20Matcher%20Bulk%20Notification%20Deleter.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let selectedNotifications = JSON.parse(sessionStorage.getItem('selectedNotifications')) || [];
	let currentIndex = parseInt(localStorage.getItem('currentIndex'), 10) || 0;
	let isProcessing = false;

	// Create a UI panel
	const controlPanel = document.createElement('div');
	controlPanel.style.cssText = `
			position: fixed;
			bottom: 10px;
			right: 10px;
			background-color: #333;
			color: #fff;
			border: 1px solid #444;
			padding: 10px;
			z-index: 10000;
			width: 200px;
			height: 30px; /* Start minimized */
	`;

	// Add a class for minimized state
	controlPanel.classList.add('minimized');

	// Add CSS for minimized state
	const style = document.createElement('style');
	style.innerHTML = `
			.minimized {
					background-color: transparent !important;
					border: none !important;
					padding: 0 !important;
			}
	`;
	document.head.appendChild(style);
	controlPanel.innerHTML = `
			<h4 style="margin: 0; display: none;">Notification Deletion Tool</h4>
			<div style="display: none;">
					<button id="selectAllBtn">Select All</button>
					<button id="deselectAllBtn">Deselect All</button>
			</div>
			<button id="startProcessBtn" style="margin-top: 10px; display: none;">Start Deletion</button>
			<button id="stopProcessBtn" style="margin-top: 10px; display: none;">Stop Deletion</button>
			<div id="status" style="margin-top: 10px; font-size: 12px; display: none;"></div>
			<button id="minimizeBtn" style="position: absolute; top: 5px; right: 5px; display: none;">-</button>
			<button id="maximizeBtn" style="position: absolute; top: 5px; right: 5px;">+</button>
	`;
	document.body.appendChild(controlPanel);

	// Add checkboxes to each notification
	const notifications = document.querySelectorAll('a[id^="notification_"]');
	notifications.forEach((notification) => {
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.style.marginRight = '5px';

		const parent = notification.parentNode;
		parent.insertBefore(checkbox, notification);
	});

	// Event listener for "Select All" button
	document.getElementById('selectAllBtn').addEventListener('click', () => {
		notifications.forEach((notification) => {
			notification.previousSibling.checked = true; // Check all checkboxes
		});
	});

	// Event listener for "Deselect All" button
	document.getElementById('deselectAllBtn').addEventListener('click', () => {
		notifications.forEach((notification) => {
			notification.previousSibling.checked = false; // Uncheck all checkboxes
		});
	});

	// Event listener for "Start Deletion" button
	document.getElementById('startProcessBtn').addEventListener('click', () => {
		selectedNotifications = Array.from(notifications)
			.filter(
				(notification) => notification.previousSibling.checked, // Get selected notifications
			)
			.map((notification) => notification.href); // Get the href attribute
		currentIndex = 0; // Reset currentIndex to 0
		isProcessing = true;

		if (selectedNotifications.length === 0) {
			alert('No notifications selected. Please check the boxes next to the notifications you want to delete.');
			return;
		}

		if (confirm(`Are you sure you want to delete ${selectedNotifications.length} notification(s)?`)) {
			document.getElementById('status').textContent = `Deleting ${selectedNotifications.length} notification(s)...`;
			sessionStorage.setItem('selectedNotifications', JSON.stringify(selectedNotifications));
			sessionStorage.setItem('currentIndex', currentIndex);
			navigateToNotification(selectedNotifications[currentIndex]);
		}
	});

	// Event listener for "Stop Deletion" button
	document.getElementById('stopProcessBtn').addEventListener('click', () => {
		isProcessing = false;
		document.getElementById('status').textContent = 'Deletion process stopped.';
	});

	// Event listener for "Minimize" button
	document.getElementById('minimizeBtn').addEventListener('click', () => {
		controlPanel.style.height = '30px';
		controlPanel.querySelectorAll('h4, div, #startProcessBtn, #stopProcessBtn, #status, #minimizeBtn').forEach((el) => (el.style.display = 'none'));
		document.getElementById('maximizeBtn').style.display = 'block';
	});

	// Event listener for "Maximize" button
	document.getElementById('maximizeBtn').addEventListener('click', () => {
		controlPanel.style.height = 'auto';
		controlPanel.querySelectorAll('h4, div, #startProcessBtn, #stopProcessBtn, #status, #minimizeBtn').forEach((el) => (el.style.display = 'block'));
		document.getElementById('maximizeBtn').style.display = 'none';
	});

	// Navigate to the notification page
	function navigateToNotification(link) {
		if (isProcessing) {
			console.log(`Navigating to ${link}`);
			window.location.href = link;
		}
	}

	// Fetch token and delete the notification directly via POST
	function deleteNotificationDirectly() {
		const tokenElement = document.querySelector('input[name="_token"]'); // Fetch CSRF token
		const deleteForm = document.querySelector('form[action*="/notification/delete/"]');

		if (tokenElement && deleteForm) {
			const token = tokenElement.value; // Get token value
			const actionUrl = deleteForm.getAttribute('action'); // Get delete URL

			fetch(actionUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `_token=${encodeURIComponent(token)}`,
			})
				.then((response) => {
					if (response.ok) {
						console.log(`Notification deleted successfully!`);
					} else {
						console.error(`Failed to delete notification.`);
					}
				})
				.catch((error) => {
					console.error('Error:', error);
				})
				.finally(() => {
					// Move to the next notification or finish
					currentIndex++;
					localStorage.setItem('currentIndex', currentIndex);
					if (currentIndex < selectedNotifications.length && isProcessing) {
						setTimeout(() => {
							navigateToNotification(selectedNotifications[currentIndex]);
						}, 1000); // Delay for navigation
					} else {
						sessionStorage.removeItem('selectedNotifications');
						sessionStorage.removeItem('currentIndex');
						alert('All selected notifications deleted.');
						console.log('Completed deleting all selected notifications.');
						window.location.href = '/notification'; // Return to notifications list
					}
				});
		} else {
			console.error('Token or delete form not found!');
			// Skip to the next notification if the form is missing
			currentIndex++;
			if (currentIndex < selectedNotifications.length && isProcessing) {
				setTimeout(() => {
					navigateToNotification(selectedNotifications[currentIndex]);
				}, 1000); // Delay for navigation
			} else {
				alert('All selected notifications deleted.');
				console.log('Completed deleting all selected notifications.');
				window.location.href = '/notification'; // Return to notifications list
			}
		}
	}

	// Check if on a notification page and trigger deletion
	if (window.location.pathname.includes('/notification/show/')) {
		setTimeout(deleteNotificationDirectly, 1000); // Add a delay before calling deleteNotificationDirectly
	}
})();
