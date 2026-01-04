// ==UserScript==
// @name         Delete YouTube Playlists Except First
// @namespace    typpi.online
// @version      1.6
// @description  Delete all YouTube playlists except the first one from YouTube Studio
// @author       Nick2bad4u
// @license      UnLicense
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @match        https://studio.youtube.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/521789/Delete%20YouTube%20Playlists%20Except%20First.user.js
// @updateURL https://update.greasyfork.org/scripts/521789/Delete%20YouTube%20Playlists%20Except%20First.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Create and style the UI button
	const uiButton = document.createElement('button');
	uiButton.innerText = 'Start Deleting Playlists';
	uiButton.style.position = 'fixed';
	uiButton.style.top = '10px';
	uiButton.style.right = '10px';
	uiButton.style.zIndex = '1000';
	uiButton.style.padding = '10px 20px';
	uiButton.style.backgroundColor = '#ff0000';
	uiButton.style.color = '#ffffff';
	uiButton.style.border = 'none';
	uiButton.style.borderRadius = '5px';
	uiButton.style.cursor = 'pointer';
	document.body.appendChild(uiButton);

	// Function to delete playlists
	function deletePlaylists() {
		// Get all menu buttons
		const menuButtons = document.querySelectorAll(
			'ytcp-icon-button#overflow-menu-button',
		);

		if (menuButtons.length > 1) {
			let i = 1;

			function deleteNextPlaylist() {
				if (i < menuButtons.length) {
					menuButtons[i].click();

					setTimeout(() => {
						const deleteButton = Array.from(
							document.querySelectorAll(
								'ytcp-text-menu yt-formatted-string.item-text',
							),
						).find((el) => el.innerText === 'Delete');

						if (deleteButton) {
							deleteButton.click();

							setTimeout(() => {
								const confirmButton = document.querySelector(
									'ytcp-button[id="confirm-button"]',
								);
								if (confirmButton) {
									confirmButton.click();
									i++;
									setTimeout(deleteNextPlaylist, 1000); // Wait for 1 seconds before the next deletion
								}
							}, 500);
						} else {
							i++;
							setTimeout(deleteNextPlaylist, 2000); // Move to next if delete button not found
						}
					}, 500);
				} else {
					uiButton.innerText = 'Deletion Complete';
				}
			}

			deleteNextPlaylist();
		} else {
			alert('No playlists found or only one playlist present.');
		}
	}

	// Add event listener to the button
	uiButton.addEventListener('click', () => {
		uiButton.innerText = 'Deleting Playlists...';
		deletePlaylists();
	});
})();
