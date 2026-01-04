// ==UserScript==
// @name         Old Reddit with New Reddit Profile Pictures - API Key Version
// @namespace    typpi.online
// @version      7.0.7
// @description  Injects new Reddit profile pictures into Old Reddit and Reddit-Stream.com next to the username. Caches in localstorage. This version requires an API key. Enter your API Key under CLIENT_ID and CLIENT_SECRET or it will not work.
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
// @downloadURL https://update.greasyfork.org/scripts/516615/Old%20Reddit%20with%20New%20Reddit%20Profile%20Pictures%20-%20API%20Key%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/516615/Old%20Reddit%20with%20New%20Reddit%20Profile%20Pictures%20-%20API%20Key%20Version.meta.js
// ==/UserScript==

(function () {
	'use strict';
	console.log('Reddit Profile Picture Injector Script loaded');

	// Reddit API credentials
	/**
	 * @constant {string} CLIENT_ID
	 * The client ID used for authentication with Reddit's API.
	 * This ID is required to make authenticated requests to Reddit's API endpoints.
	 * Obtain this value by registering your application at https://www.reddit.com/prefs/apps
	 */
	const CLIENT_ID = 'EnterClientIDHere';
	/**
	 * @constant {string} CLIENT_SECRET
	 * The client secret key required for Reddit API authentication.
	 * This key should be kept private and not shared publicly.
	 * Obtain this value from your Reddit API application settings.
	 */
	const CLIENT_SECRET = 'EnterClientSecretHere';
	/**
	 * User agent string used for making API requests.
	 * Format: {ApplicationName}/{Version} by {Author}
	 * @constant {string}
	 */
	const USER_AGENT = 'ProfilePictureInjector/7.0.6 by Nick2bad4u';
	/**
	 * Access token retrieved from localStorage for authentication purposes.
	 * @type {string|null}
	 */
	let accessToken = localStorage.getItem('accessToken');

	// Retrieve cached profile pictures and timestamps from localStorage
	/**
	 * Object containing cached profile picture URLs.
	 * Data is persisted in localStorage and parsed from JSON.
	 * @type {Object.<string, string>} Key-value pairs of username to profile picture URL
	 */
	let profilePictureCache = JSON.parse(
		localStorage.getItem('profilePictureCache') || '{}',
	);
	/**
	 * Object storing timestamps for cached items.
	 * Retrieved from localStorage, defaults to empty object if not found.
	 * @type {Object.<string, number>}
	 */
	let cacheTimestamps = JSON.parse(
		localStorage.getItem('cacheTimestamps') || '{}',
	);
	/**
	 * Duration in milliseconds for which profile picture data will be cached.
	 * Set to 7 days to balance between API rate limits and data freshness.
	 * @constant
	 * @type {number}
	 */
	const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	/**
	 * Maximum number of entries that can be stored in the cache.
	 * Prevents memory overflow by limiting cache size.
	 * @constant {number}
	 */
	const MAX_CACHE_SIZE = 100000; // Maximum number of cache entries
	/**
	 * Array of keys from the profilePictureCache object representing cached profile picture entries
	 * @type {string[]}
	 * @const
	 */
	const cacheEntries = Object.keys(profilePictureCache);

	// Rate limit variables
	/**
	 * Remaining number of API requests allowed before hitting rate limit
	 * @type {number}
	 * @default 1000
	 */
	let rateLimitRemaining = 1000;
	/**
	 * Unix timestamp indicating when the Reddit API rate limit will reset
	 * @type {number}
	 */
	let rateLimitResetTime = 0;
	/**
	 * Date object representing when the rate limit will reset
	 * @type {Date}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const resetDate = new Date(rateLimitResetTime);
	/**
	 * Current timestamp in milliseconds since January 1, 1970 00:00:00 UTC.
	 * @type {number}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const now = Date.now();

	// Save the cache to localStorage
	/**
	 * Saves the profile picture cache and cache timestamps to localStorage.
	 * The cache is stored as stringified JSON under 'profilePictureCache' key,
	 * and timestamps are stored under 'cacheTimestamps' key.
	 */
	function saveCache() {
		localStorage.setItem(
			'profilePictureCache',
			JSON.stringify(profilePictureCache),
		);
		localStorage.setItem('cacheTimestamps', JSON.stringify(cacheTimestamps));
	}

	// Remove old cache entries
	/**
	 * Removes expired entries from the Reddit profile picture URL cache.
	 * Iterates through cached usernames and removes entries older than CACHE_DURATION.
	 * After cleaning expired entries, saves the updated cache to storage.
	 *
	 * @function flushOldCache
	 * @returns {void}
	 *
	 * @requires CACHE_DURATION - Maximum age of cache entries in milliseconds
	 * @requires cacheTimestamps - Object storing timestamps for each cached username
	 * @requires profilePictureCache - Object storing profile picture URLs by username
	 * @requires saveCache - Function to persist the cache to storage
	 */
	function flushOldCache() {
		console.log('Flushing old Reddit profile picture URL cache');
		const now = Date.now();
		for (const username in cacheTimestamps) {
			if (now - cacheTimestamps[username] > CACHE_DURATION) {
				console.log(`Deleting cache for Reddit user - ${username}`);
				delete profilePictureCache[username];
				delete cacheTimestamps[username];
			}
		}
		saveCache();
		console.log('Old cache entries flushed');
	}

	// Limit the size of the cache to the maximum allowed entries
	/**
	 * Manages the size of the profile picture cache by removing oldest entries when the maximum size is exceeded.
	 * Sorts entries by timestamp and removes the oldest ones until the cache size is within the specified limit.
	 * After removal, saves the updated cache to persistent storage.
	 *
	 * @function limitCacheSize
	 * @returns {void}
	 *
	 * @uses profilePictureCache - Global object storing profile picture URLs
	 * @uses cacheTimestamps - Global object storing timestamps for each cache entry
	 * @uses MAX_CACHE_SIZE - Global constant defining maximum number of entries allowed in cache
	 * @uses saveCache - Function to persist the cache to storage
	 */
	function limitCacheSize() {
		const cacheEntries = Object.keys(profilePictureCache);
		if (cacheEntries.length > MAX_CACHE_SIZE) {
			console.log(`Current cache size: ${cacheEntries.length} URLs`);
			console.log('Cache size exceeded, removing oldest entries');
			const sortedEntries = cacheEntries.sort(
				(a, b) => cacheTimestamps[a] - cacheTimestamps[b],
			);
			const entriesToRemove = sortedEntries.slice(
				0,
				cacheEntries.length - MAX_CACHE_SIZE,
			);
			entriesToRemove.forEach((username) => {
				delete profilePictureCache[username];
				delete cacheTimestamps[username];
			});
			saveCache();
			console.log(
				`Cache size limited to ${MAX_CACHE_SIZE.toLocaleString()} URLs`,
			);
		}
	}

	/**
	 * Calculates the total size in bytes of the profile picture cache and its timestamps.
	 * The size is estimated by serializing cache entries to JSON and measuring their byte length.
	 * Each cache entry consists of picture data and timestamp data for a username.
	 * @returns {number} The total size of the cache in bytes
	 */
	function getCacheSizeInBytes() {
		const cacheEntries = Object.keys(profilePictureCache);
		let totalSize = 0;

		// Calculate size of profilePictureCache
		cacheEntries.forEach((username) => {
			const pictureData = profilePictureCache[username];
			const timestampData = cacheTimestamps[username];

			// Estimate size of data by serializing to JSON and getting the length
			totalSize += new TextEncoder().encode(JSON.stringify(pictureData)).length;
			totalSize += new TextEncoder().encode(
				JSON.stringify(timestampData),
			).length;
		});

		return totalSize; // in bytes
	}

	/**
	 * Calculates the current cache size in megabytes.
	 * @returns {number} The size of the cache in megabytes (MB)
	 */
	function getCacheSizeInMB() {
		return getCacheSizeInBytes() / (1024 * 1024); // Convert bytes to MB
	}

	/**
	 * Calculates the cache size in kilobytes (KB).
	 * @returns {number} The size of the cache in KB, calculated by dividing the size in bytes by 1024.
	 */
	function getCacheSizeInKB() {
		return getCacheSizeInBytes() / 1024; // Convert bytes to KB
	}

	// Obtain an access token from Reddit API
	/**
	 * Obtains an access token from Reddit's API using client credentials.
	 * The token is stored in localStorage along with its expiration time.
	 *
	 * @async
	 * @function getAccessToken
	 * @returns {Promise<string|null>} The access token if successful, null if the request fails
	 * @throws {Error} When the network request fails
	 *
	 * @example
	 * const token = await getAccessToken();
	 * if (token) {
	 *   // Use token for authenticated requests
	 * }
	 */
	async function getAccessToken() {
		console.log('Obtaining access token');
		const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
		try {
			const response = await fetch(
				'https://www.reddit.com/api/v1/access_token',
				{
					method: 'POST',
					headers: {
						Authorization: `Basic ${credentials}`,
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: 'grant_type=client_credentials',
				},
			);
			if (!response.ok) {
				console.error('Failed to obtain access token:', response.statusText);
				return null;
			}
			const data = await response.json();
			accessToken = data.access_token;
			const expiration = Date.now() + data.expires_in * 1000;
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('tokenExpiration', expiration.toString());
			console.log('Access token obtained and saved');
			return accessToken;
		} catch (error) {
			console.error('Error obtaining access token:', error);
			return null;
		}
	}

	// Fetch profile pictures for a list of usernames
	/**
	 * Fetches profile pictures for a list of Reddit usernames using Reddit's OAuth API
	 * @async
	 * @param {string[]} usernames - Array of Reddit usernames to fetch profile pictures for
	 * @returns {Promise<(string|null)[]>} Array of profile picture URLs corresponding to the input usernames. Returns null for usernames where fetching failed
	 * @description
	 * - Handles rate limiting by waiting when limit is reached
	 * - Manages OAuth token refresh when expired
	 * - Caches profile pictures to avoid redundant API calls
	 * - Filters out [deleted] and [removed] usernames
	 * - Updates rate limit tracking based on API response headers
	 * - Saves fetched profile pictures to cache
	 * @throws {Error} Possible network or API errors during fetch operations
	 */
	async function fetchProfilePictures(usernames) {
		console.log('Fetching profile pictures');
		const now = Date.now();
		const tokenExpiration = parseInt(
			localStorage.getItem('tokenExpiration'),
			10,
		);

		// Check rate limit
		if (rateLimitRemaining <= 0 && now < rateLimitResetTime) {
			console.warn('Rate limit reached. Waiting until reset...');

			const timeRemaining = rateLimitResetTime - now;
			const minutesRemaining = Math.floor(timeRemaining / 60000);
			const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);

			console.log(
				`Rate limit will reset in ${minutesRemaining} minutes and ${secondsRemaining} seconds.`,
			);
			await new Promise((resolve) =>
				setTimeout(resolve, rateLimitResetTime - now),
			);
		}

		// Refresh access token if expired
		if (!accessToken || now > tokenExpiration) {
			accessToken = await getAccessToken();
			if (!accessToken) return null;
		}

		// Filter out cached usernames
		const uncachedUsernames = usernames.filter(
			(username) =>
				!profilePictureCache[username] &&
				username !== '[deleted]' &&
				username !== '[removed]',
		);
		if (uncachedUsernames.length === 0) {
			console.log('All usernames are cached');
			return usernames.map((username) => profilePictureCache[username]);
		}

		// Fetch profile pictures for uncached usernames
		/**
		 * Array of promises that fetch profile pictures for uncached Reddit usernames using Reddit's OAuth API
		 * @type {Promise<(string|null)>[]}
		 * @description Each promise attempts to:
		 * 1. Fetch user data from Reddit's OAuth API
		 * 2. Extract and cache the profile picture URL
		 * 3. Update rate limit tracking
		 * 4. Handle errors gracefully
		 * @returns {Promise<(string|null)>[]} Array of promises that resolve to either:
		 * - Profile picture URLs (string) for successful fetches
		 * - null for failed fetches or users without profile pictures
		 * @throws {Error} Individual promises may throw network or API errors, but these are caught and handled
		 */
		const fetchPromises = uncachedUsernames.map(async (username) => {
			try {
				const response = await fetch(
					`https://oauth.reddit.com/user/${username}/about`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'User-Agent': USER_AGENT,
						},
					},
				);

				// Update rate limit
				rateLimitRemaining =
					parseInt(response.headers.get('x-ratelimit-remaining')) ||
					rateLimitRemaining;
				rateLimitResetTime =
					now + parseInt(response.headers.get('x-ratelimit-reset')) * 1000 ||
					rateLimitResetTime;

				// Log rate limit information
				const timeRemaining = rateLimitResetTime - now;
				const minutesRemaining = Math.floor(timeRemaining / 60000);
				const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);

				console.log(
					`Rate Limit Requests Remaining: ${rateLimitRemaining}, 1000 more requests will be added in ${minutesRemaining} minutes and ${secondsRemaining} seconds`,
				);

				if (!response.ok) {
					console.error(
						`Error fetching profile picture for ${username}: ${response.statusText}`,
					);
					return null;
				}
				const data = await response.json();
				if (data.data && data.data.icon_img) {
					const profilePictureUrl = data.data.icon_img.split('?')[0];
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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const results = await Promise.all(fetchPromises);
		limitCacheSize();
		return usernames.map((username) => profilePictureCache[username]);
	}

	/**
	 * Injects profile pictures next to user comments and adds hover functionality for enlarged views
	 * @async
	 * @param {NodeList} comments - NodeList of comment elements to process
	 * @returns {Promise<void>}
	 *
	 * @description
	 * This function:
	 * 1. Extracts usernames from comments, filtering out deleted/removed users
	 * 2. Fetches profile picture URLs for valid usernames
	 * 3. Creates and injects profile picture elements before each comment
	 * 4. Adds click handlers to open full-size images in new tabs
	 * 5. Implements hover functionality to show enlarged previews
	 * 6. Tracks injection count and logs cache statistics
	 * 7. Reports rate limit status for API calls
	 *
	 * @requires fetchProfilePictures - External function to retrieve profile picture URLs
	 * @requires cacheEntries - Global array tracking cached URLs
	 * @requires MAX_CACHE_SIZE - Global constant for maximum cache size
	 * @requires rateLimitResetTime - Global variable tracking API rate limit reset time
	 * @requires rateLimitRemaining - Global variable tracking remaining API calls
	 * @requires getCacheSizeInMB - Function to calculate cache size in megabytes
	 * @requires getCacheSizeInKB - Function to calculate cache size in kilobytes
	 */
	async function injectProfilePictures(comments) {
		console.log(`Comments found: ${comments.length}`);
		const usernames = Array.from(comments)
			.map((comment) => comment.textContent.trim())
			.filter(
				(username) => username !== '[deleted]' && username !== '[removed]',
			);
		const profilePictureUrls = await fetchProfilePictures(usernames);

		let injectedCount = 0; // Counter for injected profile pictures

		comments.forEach((comment, index) => {
			const username = usernames[index];
			const profilePictureUrl = profilePictureUrls[index];
			if (
				profilePictureUrl &&
				!comment.previousElementSibling?.classList.contains('profile-picture')
			) {
				console.log(`Injecting profile picture: ${username}`);
				const img = document.createElement('img');
				img.src = profilePictureUrl;
				img.classList.add('profile-picture');
				img.onerror = () => {
					img.style.display = 'none';
				};
				img.addEventListener('click', () => {
					window.open(profilePictureUrl, '_blank');
				});
				comment.insertAdjacentElement('beforebegin', img);

				const enlargedImg = document.createElement('img');
				enlargedImg.src = profilePictureUrl;
				enlargedImg.classList.add('enlarged-profile-picture');
				document.body.appendChild(enlargedImg);
				img.addEventListener('mouseover', () => {
					enlargedImg.style.display = 'block';
					const rect = img.getBoundingClientRect();
					enlargedImg.style.top = `${rect.top + window.scrollY + 20}px`;
					enlargedImg.style.left = `${rect.left + window.scrollX + 20}px`;
				});
				img.addEventListener('mouseout', () => {
					enlargedImg.style.display = 'none';
				});

				injectedCount++; // Increment count after successful injection
			}
		});

		console.log(`Profile pictures injected this run: ${injectedCount}`);
		console.log(`Current cache size: ${cacheEntries.length}`);
		console.log(
			`Cache size limited to ${MAX_CACHE_SIZE.toLocaleString()} URLs`,
		);
		const currentCacheSizeMB = getCacheSizeInMB();
		const currentCacheSizeKB = getCacheSizeInKB();
		console.log(
			`Current cache size: ${currentCacheSizeMB.toFixed(2)} MB or ${currentCacheSizeKB.toFixed(2)} KB`,
		);

		const timeRemaining = rateLimitResetTime - Date.now();
		const minutesRemaining = Math.floor(timeRemaining / 60000);
		const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);
		console.log(
			`Rate Limit Requests Remaining: ${rateLimitRemaining} requests, refresh in ${minutesRemaining} minutes and ${secondsRemaining} seconds`,
		);
	}

	/**
	 * Sets up a MutationObserver to watch for new comments on Reddit.
	 * The observer looks for elements with class 'author' or 'c-username'.
	 * When new comments are detected, it disconnects the observer and
	 * injects profile pictures into the found elements.
	 *
	 * The observer monitors the entire document body for DOM changes,
	 * including nested elements.
	 *
	 * @function setupObserver
	 */
	function setupObserver() {
		console.log('Setting up observer');
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const observer = new MutationObserver((mutations) => {
			const comments = document.querySelectorAll('.author, .c-username');
			if (comments.length > 0) {
				console.log('New comments detected');
				observer.disconnect();
				injectProfilePictures(comments);
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
		console.log('Observer initialized');
	}

	// Run the script
	/**
	 * Initializes and runs the main script functionality.
	 * This function performs the following operations:
	 * 1. Clears outdated cache entries
	 * 2. Logs the current state of the profile picture cache
	 * 3. Initializes the DOM observer
	 * @function runScript
	 */
	function runScript() {
		flushOldCache();
		console.log('Cache loaded:', profilePictureCache);
		setupObserver();
	}

	window.addEventListener('load', () => {
		console.log('Page loaded');
		runScript();
	});

	// Add CSS styles for profile pictures
	/**
	 * Creates a new style element to be injected into the document
	 * @type {HTMLStyleElement}
	 */
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
