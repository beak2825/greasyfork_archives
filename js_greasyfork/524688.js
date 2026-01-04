// ==UserScript==
// @name         Userstyle World - Auto Sync UserStyles with Selection UI
// @namespace    typpi.online
// @version      2.0
// @description  Automatically sync userstyles by visiting the mirror URL with a selection UI
// @author       Nick2bad4u
// @license      Unlicense
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userstyles.world
// @match        *://userstyles.world/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524688/Userstyle%20World%20-%20Auto%20Sync%20UserStyles%20with%20Selection%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/524688/Userstyle%20World%20-%20Auto%20Sync%20UserStyles%20with%20Selection%20UI.meta.js
// ==/UserScript==

(function () {
	'use strict';

	/**
	 * @constant {string} SYNC_STATUS_ID - The ID of the element displaying the sync status.
	 */
	const SYNC_STATUS_ID = 'sync-status';
	/**
	 * @constant {string} UI_CONTAINER_ID - The ID of the UI container element.
	 */
	const UI_CONTAINER_ID = 'sync-ui-container';
	/**
	 * @const {string} MINIMIZE_BUTTON_TEXT_COLLAPSE - The text used to represent the collapse action on a minimize button.
	 */
	const MINIMIZE_BUTTON_TEXT_COLLAPSE = '-';
	/**
	 * @const {string} MINIMIZE_BUTTON_TEXT_EXPAND - The text used to represent the expand button when a section is minimized.
	 */
	const MINIMIZE_BUTTON_TEXT_EXPAND = '+';
	/**
	 * @const {string} SELECT_ALL_BUTTON_TEXT_SELECT - The text for the "Select All" button.
	 */
	const SELECT_ALL_BUTTON_TEXT_SELECT = 'Select All';
	/**
	 * @const {string} SELECT_ALL_BUTTON_TEXT_DESELECT - Text for a button that deselects all items.
	 */
	const SELECT_ALL_BUTTON_TEXT_DESELECT = 'Deselect All';

	/**
	 * Extracts style IDs from the page.
	 * @returns {string[]} An array of style IDs.
	 */
	function getStyleIDs() {
		return Array.from(document.querySelectorAll('a.card-header.thumbnail'))
			.map((link) => link.getAttribute('href'))
			.map((href) => href.match(/\/style\/(\d+)\//))
			.filter(Boolean) // Remove null matches
			.map((match) => match[1]);
	}

	/**
	 * Visits the mirror URL for a given style ID.
	 * @param {string} styleID The style ID to visit.
	 * @returns {Promise<void>} A promise that resolves when the mirror URL is visited successfully, or rejects if an error occurs.
	 */
	async function visitMirrorURL(styleID) {
		const mirrorURL = `https://userstyles.world/mirror/${styleID}`;
		try {
			const response = await fetch(mirrorURL);
			if (!response.ok) {
				throw new Error(`Failed to visit ${mirrorURL}: ${response.status} ${response.statusText}`);
			}
			updateStatus(`Successfully visited mirror URL for style ID: ${styleID}`);
		} catch (error) {
			updateStatus(`Error visiting mirror URL for style ID: ${styleID}. Error: ${error.message}`);
			console.error(`Error visiting ${mirrorURL}:`, error);
		}
	}

	/**
	 * Updates the status message in the UI.
	 * @param {string} message The message to display.
	 */
	function updateStatus(message) {
		const statusElement = document.getElementById(SYNC_STATUS_ID);
		if (statusElement) {
			statusElement.textContent = message;
		}
	}

	/**
	 * Creates a user interface for selecting and syncing styles.
	 *
	 * @param {string[]} styleIDs An array of style IDs to be displayed as selectable options.
	 *
	 * @returns {void} This function does not return a value. It creates and appends a UI container to the document body.
	 *
	 * @description
	 * This function dynamically generates a UI container with checkboxes for each style ID provided.
	 * It includes features such as:
	 *  - A title bar with a minimize/expand button.
	 *  - Checkboxes for selecting individual styles.
	 *  - Shift-click functionality for selecting multiple checkboxes at once.
	 *  - A "Select All" button to toggle the selection of all styles.
	 *  - A "Sync Selected Styles" button to initiate the syncing process for selected styles.
	 *  - A status display to provide feedback on the syncing process.
	 *
	 * The UI is appended to the document body as a fixed element, allowing users to interact with it regardless of page scrolling.
	 *
	 * @fires syncButton.onclick - When the "Sync Selected Styles" button is clicked, it triggers the syncing process for the selected style IDs.
	 * @fires selectAllButton.onclick - When the "Select All" button is clicked, it toggles the selection state of all checkboxes.
	 * @fires checkbox.onclick - When a checkbox is clicked, it updates the visibility of the "Sync Selected Styles" button based on whether any checkboxes are selected.  It also handles shift-click selection.
	 * @fires minimizeButton.onclick - When the minimize button is clicked, it collapses or expands the form.
	 */
	function createUI(styleIDs) {
		const container = document.createElement('div');
		container.id = UI_CONTAINER_ID;
		Object.assign(container.style, {
			position: 'fixed',
			bottom: '10px',
			right: '10px',
			width: '250px',
			backgroundColor: '#000',
			border: '1px solid #5a4ebc',
			borderRadius: '5px',
			padding: '15px',
			boxShadow: '0 2px 10px #0000001a',
			zIndex: '1000',
			maxHeight: '50vh',
			overflowY: 'auto',
			color: '#fff',
		});

		const titleContainer = document.createElement('div');
		Object.assign(titleContainer.style, {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		});
		container.appendChild(titleContainer);

		const title = document.createElement('h3');
		title.textContent = 'Select Styles to Sync';
		Object.assign(title.style, {
			marginBottom: '10px',
			fontSize: '16px',
			fontWeight: 'bold',
		});
		titleContainer.appendChild(title);

		const minimizeButton = document.createElement('button');
		minimizeButton.textContent = MINIMIZE_BUTTON_TEXT_COLLAPSE;
		Object.assign(minimizeButton.style, {
			background: 'none',
			border: 'none',
			cursor: 'pointer',
			fontSize: '16px',
			marginBottom: '10px',
			color: '#fff',
		});
		titleContainer.appendChild(minimizeButton);

		let isMinimized = false;
		let lastCheckedCheckbox = null;

		const form = document.createElement('form');
		form.style.display = 'none';

		const checkboxes = styleIDs.map((styleID) => {
			const label = document.createElement('label');
			Object.assign(label.style, {
				display: 'flex',
				alignItems: 'center',
				marginBottom: '8px',
			});

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.value = styleID;
			Object.assign(checkbox.style, {
				marginRight: '10px',
				opacity: '1',
			});

			label.appendChild(checkbox);
			label.appendChild(document.createTextNode(` Style ID: ${styleID}`));
			form.appendChild(label);

			checkbox.addEventListener('click', (event) => {
				if (event.shiftKey && lastCheckedCheckbox !== null) {
					const currentIndex = checkboxes.indexOf(checkbox);
					const lastIndex = checkboxes.indexOf(lastCheckedCheckbox);
					const start = Math.min(currentIndex, lastIndex);
					const end = Math.max(currentIndex, lastIndex);

					for (let i = start; i <= end; i++) {
						checkboxes[i].checked = lastCheckedCheckbox.checked;
					}
				}
				lastCheckedCheckbox = checkbox;
				syncButton.style.display = checkboxes.some((checkbox) => checkbox.checked) ? 'block' : 'none';
			});

			return checkbox;
		});

		const selectAllButton = document.createElement('button');
		selectAllButton.textContent = SELECT_ALL_BUTTON_TEXT_SELECT;
		selectAllButton.type = 'button';
		Object.assign(selectAllButton.style, {
			width: '100%',
			padding: '10px',
			backgroundColor: '#28a745',
			color: '#fff',
			border: 'none',
			borderRadius: '5px',
			cursor: 'pointer',
			fontSize: '14px',
			marginBottom: '10px',
			display: 'none',
		});

		selectAllButton.onclick = () => {
			const allChecked = checkboxes.every((checkbox) => checkbox.checked);
			checkboxes.forEach((checkbox) => (checkbox.checked = !allChecked));
			selectAllButton.textContent = allChecked ? SELECT_ALL_BUTTON_TEXT_SELECT : SELECT_ALL_BUTTON_TEXT_DESELECT;
			syncButton.style.display = checkboxes.some((checkbox) => checkbox.checked) ? 'block' : 'none';
		};
		container.appendChild(selectAllButton);

		const syncButton = document.createElement('button');
		syncButton.textContent = 'Sync Selected Styles';
		syncButton.type = 'button';
		Object.assign(syncButton.style, {
			width: '100%',
			padding: '10px',
			backgroundColor: '#007bff',
			color: '#fff',
			border: 'none',
			borderRadius: '5px',
			cursor: 'pointer',
			fontSize: '14px',
			marginTop: '10px',
			display: 'none',
		});
		syncButton.addEventListener('mouseover', () => {
			syncButton.style.backgroundColor = '#0056b3';
		});
		syncButton.addEventListener('mouseout', () => {
			syncButton.style.backgroundColor = '#007bff';
		});

		syncButton.onclick = () => {
			const selectedIDs = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);

			if (selectedIDs.length > 0) {
				updateStatus('Syncing selected styles...');
				const promises = selectedIDs.map(async (styleID) => {
					const mirrorURL = `https://userstyles.world/mirror/${styleID}`;
					updateStatus(`Syncing from: ${mirrorURL}`);
					await visitMirrorURL(styleID);
				});
				Promise.all(promises).then(() => {
					updateStatus(`Syncing complete for styles: ${selectedIDs.join(', ')}`);
				});
			} else {
				updateStatus('No styles selected for syncing.');
			}
		};

		const status = document.createElement('div');
		status.id = SYNC_STATUS_ID;
		Object.assign(status.style, {
			marginBottom: '10px',
			fontSize: '12px',
			color: '#fff',
		});
		container.insertBefore(status, titleContainer);

		container.appendChild(syncButton);
		container.appendChild(form);
		document.body.appendChild(container);

		/**
		 * Toggles the visibility of the form and certain buttons based on the `isMinimized` state.
		 * When minimized, the form, selectAllButton, and status are hidden, and the syncButton is shown only if any checkboxes are checked.
		 * When not minimized, the form, selectAllButton, and status are shown, and the syncButton is hidden.
		 * The minimizeButton's text content is also updated to reflect the current state.
		 */
		function toggleMinimize() {
			isMinimized = !isMinimized;
			form.style.display = isMinimized ? 'none' : 'block';
			selectAllButton.style.display = isMinimized ? 'none' : 'block';
			syncButton.style.display = isMinimized && checkboxes.some((checkbox) => checkbox.checked) ? 'block' : 'none';
			status.style.display = isMinimized ? 'none' : 'block';
			minimizeButton.textContent = isMinimized ? MINIMIZE_BUTTON_TEXT_EXPAND : MINIMIZE_BUTTON_TEXT_COLLAPSE;
		}

		minimizeButton.onclick = toggleMinimize;
		toggleMinimize(); // Initialize to minimized state
	}

	/**
	 * @function main
	 * @description This is the main function that initializes the script. It retrieves style IDs from the page,
	 * and if style IDs are found, it creates the user interface. If no style IDs are found, it logs a warning
	 * to the console and updates the status message.
	 * @returns {void}
	 */
	function main() {
		const styleIDs = getStyleIDs();
		if (styleIDs.length > 0) {
			createUI(styleIDs);
		} else {
			console.warn('No style IDs found on the page.');
			updateStatus('No style IDs found on the page.');
		}
	}

	// Execute main function after the page is fully loaded
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', main);
	} else {
		main();
	}
})();
