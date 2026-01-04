// ==UserScript==
// @name Tinychat YouTube Playback Script
// @namespace tinychat-yt-playback
// @description Opens a separate window for YouTube video playback on Tinychat.
// @version 2.0
// @license CC0-1.0
// @author meth0dZ
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant GM_xmlhttpRequest
// @run-at document-end
// @match https://tinychat.com/room/*
// @downloadURL https://update.greasyfork.org/scripts/465732/Tinychat%20YouTube%20Playback%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/465732/Tinychat%20YouTube%20Playback%20Script.meta.js
// ==/UserScript==

// Tinychat YouTube Playback - © [2023] [meth0dZ]
// SPDX-License-Identifier: CC0-1.0
(async () => {
	'use strict';

	// Regular expression for matching YouTube URLs
	const videoRegex = /https?:\/\/(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=|embed\/)([a-zA-Z0-9-_]+)/;

	// Function to fetch YouTube API key
	async function fetchAPIKey() {
		// Add your logic to fetch the API key from a secure location
		return 'ADD_YOUR_API_KEY';
	}

	// Fetch and store the YouTube API key
	const apiKey = await fetchAPIKey();

	// Function to open a separate window for video playback
	const openVideoWindow = (url) => {
		const videoWindow = window.open(url, 'tinychat-video', 'toolbar=0,location=0,status=0,menubar=0,resizable=1,width=640,height=360,autoplay=1');
		videoWindow.focus();
	}

	// Add CSS styles for the video button
	GM_addStyle(`
.tc-video-button {
  display: inline-block;
  width: 32px;
  height: 32px;
  background-color: #ff0000;
  border-radius: 50%;
  opacity: 0.7;
  cursor: pointer;
}

.tc-video-button:hover {
  opacity: 1;
}
`);

	// Create a menu command to clear the stored video URL
	GM_registerMenuCommand('Clear Tinychat YouTube Video URL', () => {
		GM_setValue('tcYtVideoUrl', '');
	});

	// Check for a stored video URL and display the video button if found
	const videoUrl = GM_getValue('tcYtVideoUrl', '');
	if (videoUrl !== '') {
		const videoButton = document.createElement('div');
		videoButton.className = 'tc-video-button';
		videoButton.title = 'Play YouTube Video';
		videoButton.onclick = () => openVideoWindow(videoUrl);
		document.body.appendChild(videoButton);
	}

	// Function to create the YouTube search bar
	function createSearchBar() {
		// Create the search bar container
		const searchBar = document.createElement('div');
		Object.assign(searchBar.style, {
			position: 'fixed',
			top: '10px',
			left: '10px',
			zIndex: '9999',
		});

		// Create the search input field
		const searchInput = document.createElement('input');
		searchInput.type = 'text';
		searchInput.id = 'yt-search-input';
		searchInput.placeholder = 'Search';
		searchInput.setAttribute('autocomplete', 'off');
		searchInput.setAttribute('list', 'yt-search-datalist');
		searchBar.appendChild(searchInput);

		// Create the search datalist element
		const searchDatalist = document.createElement('datalist');
		searchDatalist.id = 'yt-search-datalist';
		searchBar.appendChild(searchDatalist);
		// Add event listener for search input updates
		searchInput.addEventListener('input', async () => {
			const query = searchInput.value.trim();
			if (query.length < 3) {
				searchDatalist.innerHTML = '';
				return;
			}

			// Build the YouTube search API request URL
			const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}&maxResults=5`;

			// Fetch YouTube search results using GM_xmlhttpRequest
			GM_xmlhttpRequest({
				method: 'GET',
				url: searchUrl,
				onload: (response) => {
					const {
						items
					} = JSON.parse(response.responseText);
					if (items?.length > 0) {
						searchDatalist.innerHTML = ''; // Clear existing options before adding new ones
						items.forEach(({
							id: {
								videoId
							},
							snippet: {
								title
							}
						}) => {
							addUniqueOption(searchDatalist, videoId, title);
						});
					}
				},
				onerror: () => {
					console.error('Error fetching search results');
				}
			});
		});

		// Function to add an option to the datalist only if it's unique
		function addUniqueOption(datalist, videoId, title) {
			// Check if the option already exists in the datalist
			const existingOption = [...datalist.children].find(option => option.getAttribute('data-video-id') === videoId);
			if (!existingOption) {
				const option = document.createElement('option');
				option.setAttribute('data-video-id', videoId);
				option.innerText = title;
				datalist.appendChild(option);
			}
		}

		// Create the search button
		const searchButton = document.createElement('button');
		searchButton.innerText = 'Play Video';
		searchButton.onclick = () => {
			const selectedOption = searchInput.value;
			const selectedVideoId = [...searchDatalist.children].find(option => option.innerText === selectedOption)?.getAttribute('data-video-id');

			// Play the selected video and store the video URL
			if (selectedVideoId) {
				GM_setValue('tcYtVideoUrl', `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`);
				openVideoWindow(`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`);
				searchInput.value = '';
			} else {
				alert('Invalid YouTube URL');
			}
		};
		searchBar.appendChild(searchButton);

		// Add the search bar to the document body
		document.body.appendChild(searchBar);
	}

	// Create the search bar
	createSearchBar();

})();