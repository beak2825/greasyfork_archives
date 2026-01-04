// ==UserScript==
// @name         Enlarge YouTube Chat Profile Pictures (HD Version with Caching)
// @namespace    typpi.online
// @version      2.1
// @description  Enlarges YouTube chat profile pictures on mouse over, shows HD version, Caches HD images for faster display using Tampermonkey caching.
// @author       Nick2bad4u
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      UnLicense
// @tag          youtube
// @downloadURL https://update.greasyfork.org/scripts/513619/Enlarge%20YouTube%20Chat%20Profile%20Pictures%20%28HD%20Version%20with%20Caching%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513619/Enlarge%20YouTube%20Chat%20Profile%20Pictures%20%28HD%20Version%20with%20Caching%29.meta.js
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
		const hdSrc = src.replace(/=s32-c/, '=s800-c'); // Adjust as needed for HD
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

	// Function to enlarge profile pictures, show HD image, add black outline, and shift to the right
	function enlargeProfilePic(event) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			const img = event.target;
			const originalSrc = img.src;
			const hdSrc = originalSrc.replace(/=s32-c/, '=s800-c'); // Increase the size to 800px
			img.dataset.originalSrc = originalSrc; // Store the original src
			// Swap in the HD version, check preloadedImages cache
			img.src = preloadedImages.get(hdSrc) || hdSrc;
			img.style.transform = 'scale(6) translateX(20px)';
			img.style.transition = 'transform 0.2s ease';
			img.style.border = '1px solid black';
			img.style.zIndex = '9999';
			img.style.position = 'relative';
			// Reset after 3 seconds
			setTimeout(() => {
				resetProfilePic(img);
			}, 3000);
		}, 100);
	}

	// Function to reset profile pictures to original size and source
	function resetProfilePic(img) {
		img.src = img.dataset.originalSrc || img.src; // Restore the original src if it was replaced
		img.style.transform = 'scale(1) translateX(0)';
		img.style.border = 'none';
		img.style.zIndex = 'auto';
		img.style.position = 'static';
	}

	// Add event listeners to profile pictures
	function addEventListeners() {
		const profilePics = document.querySelectorAll(
			'.h-5.w-5.inline.align-middle.rounded-full.flex-none',
		);
		profilePics.forEach((pic) => {
			preloadHDImage(pic.src); // Preload HD image
			pic.addEventListener('mouseover', enlargeProfilePic);
		});
	}

	// Observe changes in the chat to dynamically add event listeners
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
