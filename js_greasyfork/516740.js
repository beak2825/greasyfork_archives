// ==UserScript==
// @name         Old Reddit with New Reddit Profile Pictures - API Key Version - Reddit Only Version
// @namespace    typpi.online
// @version      7.0.7
// @description  Injects new Reddit profile pictures into Old Reddit and Reddit-Stream.com next to the username. Caches in localstorage. This version requires an API key. Enter your API Key under CLIENT_ID and CLIENT_SECRET or it will not work.
// @author       Nick2bad4u
// @match        *://*.reddit.com/*
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
// @downloadURL https://update.greasyfork.org/scripts/516740/Old%20Reddit%20with%20New%20Reddit%20Profile%20Pictures%20-%20API%20Key%20Version%20-%20Reddit%20Only%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/516740/Old%20Reddit%20with%20New%20Reddit%20Profile%20Pictures%20-%20API%20Key%20Version%20-%20Reddit%20Only%20Version.meta.js
// ==/UserScript==

(function () {
	'use strict';
	console.log('Reddit Profile Picture Injector Script loaded');

	// Reddit API credentials
	const CLIENT_ID = 'EnterClientIDHere';
	const CLIENT_SECRET = 'EnterClientSecretHere';
	const USER_AGENT = 'ProfilePictureInjector/7.0.6 by Nick2bad4u';
	let accessToken = localStorage.getItem('accessToken');

	// Retrieve cached profile pictures and timestamps from localStorage
	let profilePictureCache = JSON.parse(
		localStorage.getItem('profilePictureCache') || '{}',
	);
	let cacheTimestamps = JSON.parse(
		localStorage.getItem('cacheTimestamps') || '{}',
	);
	const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	const MAX_CACHE_SIZE = 100000; // Maximum number of cache entries
	const cacheEntries = Object.keys(profilePictureCache);

	// Rate limit variables
	let rateLimitRemaining = 1000;
	let rateLimitResetTime = 0;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const resetDate = new Date(rateLimitResetTime);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const now = Date.now();

	// Save the cache to localStorage
	function saveCache() {
		localStorage.setItem(
			'profilePictureCache',
			JSON.stringify(profilePictureCache),
		);
		localStorage.setItem('cacheTimestamps', JSON.stringify(cacheTimestamps));
	}

	// Remove old cache entries
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

	function getCacheSizeInMB() {
		return getCacheSizeInBytes() / (1024 * 1024); // Convert bytes to MB
	}

	function getCacheSizeInKB() {
		return getCacheSizeInBytes() / 1024; // Convert bytes to KB
	}

	// Obtain an access token from Reddit API
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
					`Rate Limit Requests Remaining: ${rateLimitRemaining} requests, reset in ${minutesRemaining} minutes and ${secondsRemaining} seconds`,
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

	// Inject profile pictures into comments
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
