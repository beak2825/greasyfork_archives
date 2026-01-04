// ==UserScript==
// @name         Enlarge YouTube Comment Section Profile Pictures (HD Version with Caching)
// @namespace    typpi.online
// @version      2.2
// @description  Enlarges YouTube comment profile pictures on mouse over, shows HD version, Caches HD images for faster display using Tampermonkey caching.
// @author       Nick2bad4u
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      UnLicense
// @tag          youtube
// @downloadURL https://update.greasyfork.org/scripts/515707/Enlarge%20YouTube%20Comment%20Section%20Profile%20Pictures%20%28HD%20Version%20with%20Caching%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515707/Enlarge%20YouTube%20Comment%20Section%20Profile%20Pictures%20%28HD%20Version%20with%20Caching%29.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let debounceTimeout;
	const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
	const preloadedImages = new Map();

	// Load cache from Tampermonkey storage
	function loadCache() {
		const cache = GM_getValue('profilePicCache', {});
		const now = Date.now();
		// Clear out expired cache entries
		Object.keys(cache).forEach((key) => {
			if (now - cache[key].timestamp > CACHE_TTL_MS) {
				delete cache[key]; // Remove expired entry
			}
		});
		GM_setValue('profilePicCache', cache); // Update cache after removing expired entries
		return cache;
	}

	// Save cache to Tampermonkey storage
	function saveCache(cache) {
		GM_setValue('profilePicCache', cache);
	}

	let cache = loadCache(); // Load the cache once when the script runs

	// Preload HD image
	function preloadHDImage(src) {
		const hdSrc = src.replace(/=s(88|48)-c/, '=s800-c'); // Adjust as needed for HD
		if (!preloadedImages.has(hdSrc)) {
			if (cache[hdSrc]) {
				// If in persistent cache, load directly from cache
				preloadedImages.set(hdSrc, cache[hdSrc].url);
			} else {
				// Preload HD image and store in cache
				const img = new Image();
				img.src = hdSrc;
				preloadedImages.set(hdSrc, hdSrc); // Store in memory
				cache[hdSrc] = {
					url: hdSrc,
					timestamp: Date.now(),
				}; // Cache with timestamp
				saveCache(cache); // Save the updated cache
			}
		}
	}

	// Function to enlarge profile pictures, show HD image, add black outline, and shift position
	function enlargeProfilePic(event) {
		clearTimeout(debounceTimeout);

		const img = event.target;

		// If the image is already enlarged, skip further processing
		if (img.dataset.enlarged === 'true') return;

		debounceTimeout = setTimeout(() => {
			const originalSrc = img.src;
			const hdSrc = originalSrc.replace(/=s(88|48)-c/, '=s800-c'); // Use HD version
			img.dataset.originalSrc = originalSrc; // Store the original src
			img.src = preloadedImages.get(hdSrc) || hdSrc;

			// Get the position of the original image
			const rect = img.getBoundingClientRect();

			// Set fixed size, position relative to the original image, and make it a circle
			img.style.width = '260px'; // Adjust width as needed
			img.style.height = '260px'; // Adjust height as needed
			img.style.borderRadius = '50%'; // Make the image circular
			img.style.position = 'fixed';
			img.style.top = `${rect.top - 20}px`; // Adjust vertical position as needed
			img.style.left = `${rect.left + 70}px`; // Offset to the right
			img.style.border = '2px solid black';
			img.style.zIndex = '9999';
			img.dataset.enlarged = 'true'; // Mark as enlarged to prevent re-enlarging

			// Reset after 3 seconds
			setTimeout(() => {
				resetProfilePic(img);
			}, 3000);
		}, 100);
	}

	// Function to reset profile pictures to original size and source
	function resetProfilePic(img) {
		img.src = img.dataset.originalSrc || img.src; // Restore the original src if it was replaced
		img.style.width = ''; // Clear custom width
		img.style.height = ''; // Clear custom height
		img.style.borderRadius = ''; // Clear circular style
		img.style.position = ''; // Reset position to default
		img.style.top = ''; // Clear top position
		img.style.left = ''; // Clear left position
		img.style.border = 'none'; // Remove any border
		img.style.zIndex = 'auto'; // Reset z-index
		img.style.transform = ''; // Remove any transform applied
		delete img.dataset.enlarged; // Remove the enlarged flag
	}

	// Add event listeners to profile pictures
	function addEventListeners() {
		const profilePics = document.querySelectorAll(
			'.style-scope yt-img-shadow img:not(#avatar-btn > yt-img-shadow img)',
		);
		profilePics.forEach((pic) => {
			preloadHDImage(pic.src); // Preload HD image
			pic.addEventListener('mouseover', enlargeProfilePic);
		});
	}

	// Observe changes in the comments section to dynamically add event listeners
	const observer = new MutationObserver(() => {
		addEventListeners();
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// Initial call to add event listeners
	addEventListeners();
})();
