// ==UserScript==
// @name         Old Reddit with New Reddit Profile Pictures - Universal Version
// @namespace    typpi.online
// @version      7.0.7
// @description  Injects new Reddit profile pictures into Old Reddit and Reddit-Stream.com next to the username. Caches in localstorage.
// @author       Nick2bad4u
// @match        *://*.reddit.com/*
// @match        *://reddit-stream.com/*
// @connect      reddit.com
// @connect      reddit-stream.com
// @grant        GM_xmlhttpRequest
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @license      Unlicense
// @resource     https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @run-at       document-start
// @tag          reddit
// @downloadURL https://update.greasyfork.org/scripts/516088/Old%20Reddit%20with%20New%20Reddit%20Profile%20Pictures%20-%20Universal%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/516088/Old%20Reddit%20with%20New%20Reddit%20Profile%20Pictures%20-%20Universal%20Version.meta.js
// ==/UserScript==

(function () {
	'use strict';
	console.log('Script loaded');

	// Initialize the profile picture cache from localStorage or as an empty object if not present
	let profilePictureCache = JSON.parse(localStorage.getItem('profilePictureCache') || '{}');

	// Initialize the cache timestamps from localStorage or as an empty object if not present
	let cacheTimestamps = JSON.parse(localStorage.getItem('cacheTimestamps') || '{}');

	// Define the cache duration as 7 days in milliseconds
	const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

	// Define the maximum number of cache entries
	const MAX_CACHE_SIZE = 25000; // Maximum number of cache entries

	// Function to save the current state of the cache to localStorage
	function saveCache() {
		localStorage.setItem('profilePictureCache', JSON.stringify(profilePictureCache));
		localStorage.setItem('cacheTimestamps', JSON.stringify(cacheTimestamps));
	}

	// Function to flush old cache entries
	function flushOldCache() {
		console.log('Flushing old cache');
		const now = Date.now();

		// Iterate over all usernames in the cache timestamps
		for (const username in cacheTimestamps) {
			// Check if the cache entry is older than the allowed cache duration
			if (now - cacheTimestamps[username] > CACHE_DURATION) {
				console.log(`Deleting cache for ${username}`);
				// Delete the cache entry for this username
				delete profilePictureCache[username];
				// Delete the timestamp for this username
				delete cacheTimestamps[username];
			}
		}

		// Save the updated cache state to localStorage
		saveCache();
		console.log('Old cache entries flushed');
	}

	// Function to limit the size of the profile picture cache
	function limitCacheSize() {
		// Get an array of all usernames currently in the cache
		const cacheEntries = Object.keys(profilePictureCache);

		// Check if the cache size exceeds the maximum allowed size
		if (cacheEntries.length > MAX_CACHE_SIZE) {
			console.log('Cache size exceeded, removing oldest entries');

			// Sort the cache entries by their timestamps in ascending order
			const sortedEntries = cacheEntries.sort((a, b) => cacheTimestamps[a] - cacheTimestamps[b]);

			// Determine the number of entries to remove to fit within the maximum cache size
			const entriesToRemove = sortedEntries.slice(0, cacheEntries.length - MAX_CACHE_SIZE);

			// Remove the oldest entries from the cache and timestamps
			entriesToRemove.forEach((username) => {
				delete profilePictureCache[username];
				delete cacheTimestamps[username];
			});

			// Save the updated cache state
			saveCache();
			console.log('Cache size limited');
		}
	}

	// Asynchronous function to fetch profile pictures for a list of usernames
	async function fetchProfilePictures(usernames) {
		console.log('Fetching profile pictures');

		// Filter out usernames that are already in the cache or are marked as deleted or removed
		const uncachedUsernames = usernames.filter((username) => !profilePictureCache[username] && username !== '[deleted]' && username !== '[removed]');

		// If all usernames are cached, return the cached profile pictures
		if (uncachedUsernames.length === 0) {
			console.log('All usernames are cached');
			return usernames.map((username) => profilePictureCache[username]);
		}

		console.log(`Fetching profile pictures for: ${uncachedUsernames.join(', ')}`);

		// Map over the uncached usernames and fetch their profile pictures
		const fetchPromises = uncachedUsernames.map(async (username) => {
			try {
				// Fetch user data from Reddit
				const response = await fetch(`https://www.reddit.com/user/${username}/about.json`);

				// Check if the response is successful
				if (!response.ok) {
					console.error(`Error fetching profile picture for ${username}: ${response.statusText}`);
					return null;
				}

				// Parse the response JSON data
				const data = await response.json();

				// Check if the data contains a profile picture URL
				if (data.data && data.data.icon_img) {
					const profilePictureUrl = data.data.icon_img.split('?')[0];

					// Cache the profile picture URL and timestamp
					profilePictureCache[username] = profilePictureUrl;
					cacheTimestamps[username] = Date.now();
					saveCache();
					console.log(`Fetched profile picture: ${username}`);
					return profilePictureUrl;
				} else {
					console.warn(`No profile picture found for: ${username}`);
					return null;
				}
			} catch (error) {
				console.error(`Error fetching profile picture for ${username}:`, error);
				return null;
			}
		});

		// Wait for all fetch promises to resolve
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const results = await Promise.all(fetchPromises);

		// Limit the cache size if necessary
		limitCacheSize();

		// Return the profile pictures, using the cache for already fetched usernames
		return usernames.map((username) => profilePictureCache[username]);
	}

	// Asynchronous function to inject profile pictures into comments
	async function injectProfilePictures(comments) {
		console.log(`Comments found: ${comments.length}`);

		// Extract usernames from comments, filtering out deleted or removed comments
		const usernames = Array.from(comments)
			.map((comment) => comment.textContent.trim())
			.filter((username) => username !== '[deleted]' && username !== '[removed]');

		// Fetch profile pictures for the extracted usernames
		const profilePictureUrls = await fetchProfilePictures(usernames);

		// Iterate over each comment and inject the corresponding profile picture
		comments.forEach((comment, index) => {
			const username = usernames[index];
			const profilePictureUrl = profilePictureUrls[index];

			// Check if the profile picture URL is valid and the profile picture is not already injected
			if (profilePictureUrl && !comment.previousElementSibling?.classList.contains('profile-picture')) {
				console.log(`Injecting profile picture: ${username}`);

				// Create and configure the img element for the profile picture
				const img = document.createElement('img');
				img.src = profilePictureUrl;
				img.classList.add('profile-picture');
				img.onerror = () => {
					img.style.display = 'none';
				};
				img.addEventListener('click', () => {
					window.open(profilePictureUrl, '_blank');
				});

				// Insert the profile picture before the comment element
				comment.insertAdjacentElement('beforebegin', img);

				// Create an enlarged version of the profile picture for hover effect
				const enlargedImg = document.createElement('img');
				enlargedImg.src = profilePictureUrl;
				enlargedImg.classList.add('enlarged-profile-picture');
				document.body.appendChild(enlargedImg);

				// Show the enlarged profile picture on mouseover
				img.addEventListener('mouseover', () => {
					enlargedImg.style.display = 'block';
					const rect = img.getBoundingClientRect();
					enlargedImg.style.top = `${rect.top + window.scrollY + 20}px`;
					enlargedImg.style.left = `${rect.left + window.scrollX + 20}px`;
				});

				// Hide the enlarged profile picture on mouseout
				img.addEventListener('mouseout', () => {
					enlargedImg.style.display = 'none';
				});
			}
		});

		console.log('Profile pictures injected');
	}

	// Function to set up a MutationObserver to detect new comments
	function setupObserver() {
		console.log('Setting up observer');

		// Create a new MutationObserver instance and define the callback function
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const observer = new MutationObserver((mutations) => {
			// Select all elements with the classes 'author' or 'c-username'
			const comments = document.querySelectorAll('.author, .c-username');

			// If new comments are detected, disconnect the observer and inject profile pictures
			if (comments.length > 0) {
				console.log('New comments detected');
				observer.disconnect();
				injectProfilePictures(comments);
			}
		});

		// Start observing the document body for changes in the child elements and subtree
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		console.log('Observer initialized');
	}

	// Function to run the script
	function runScript() {
		// Flush old cache data
		flushOldCache();

		// Log the current state of the profile picture cache
		console.log('Cache loaded:', profilePictureCache);

		// Set up a MutationObserver to detect new comments
		setupObserver();
	}

	// Add an event listener for the 'load' event to ensure the script runs after the page has fully loaded
	window.addEventListener('load', () => {
		console.log('Page loaded');

		// Run the script immediately after the page loads
		runScript();

		// Set an interval to run the script every 10 seconds
		setInterval(runScript, 10000); // Run every 10 seconds
	});
	const style = document.createElement('style');
	style.textContent = `
        .profile-picture {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 5px;
            transition: transform 0.2s ease-in-out;
            position: relative;
            z-index: 1;
            cursor: pointer;
        }
        .enlarged-profile-picture {
            width: 250px;
            height: 250px;
            border-radius: 50%;
            position: absolute;
            display: none;
            z-index: 1000;
            pointer-events: none;
            outline: 3px solid #000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 1);
            background-color: rgba(0, 0, 0, 1);
        }
    `;
	document.head.appendChild(style);
})();
