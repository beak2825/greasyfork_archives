// ==UserScript==
// @name         Left-Right Balance for Strava [Updated]
// @namespace    typpi.online
// @description  Shows your Left/Right balance under the analysis section on Strava.
// @version      2.9
// @include      https://www.strava.com/activities/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @author       Nick2bad4u
// @license      UnLicense
// @grant        none
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @downloadURL https://update.greasyfork.org/scripts/524193/Left-Right%20Balance%20for%20Strava%20%5BUpdated%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/524193/Left-Right%20Balance%20for%20Strava%20%5BUpdated%5D.meta.js
// ==/UserScript==

/**
 * URL of the script to be loaded from the CDN.
 * This script is hosted on jsDelivr and is part of the UserStyles repository.
 *
 * @constant {string}
 */
const SCRIPT_URL = 'https://cdn.jsdelivr.net/gh/Nick2bad4u/UserStyles@main/strava-balance/Strava-AddBalance.js';
// Cache expiration time set to 24 hours in milliseconds
const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000;
// Key used to store the last fetch time of the script in localStorage
const CACHE_LAST_FETCH_TIME_KEY = 'stravaBalanceScriptFetchTime';
// Key used to store the cached script in localStorage
const CACHED_SCRIPT_KEY = 'stravaBalanceScript';

//SCRIPT_BALANCE_ELEMENT.src="https://dmwnz.github.io/lrbalance4strava/addbal.js";

/**
 * Determines if the cache has expired based on the last fetch time and the cache expiration time.
 *
 * @param {number} CACHE_LAST_FETCH_TIME - The timestamp of the last fetch.
 * @param {number} CACHE_EXPIRE_TIME - The duration in milliseconds after which the cache is considered expired.
 * @returns {boolean} - Returns true if the cache is expired, otherwise false.
 */
const isCacheExpired = (CACHE_LAST_FETCH_TIME, CACHE_EXPIRE_TIME) => {
	const CURRENT_TIME = Date.now();
	return !CACHE_LAST_FETCH_TIME || CURRENT_TIME - CACHE_LAST_FETCH_TIME > CACHE_EXPIRE_TIME;
};

/**
 * Immediately Invoked Function Expression (IIFE) to load and execute the Strava balance script.
 * It checks the cache for the script and fetches it from the network if the cache is expired.
 */
function loadStravaBalanceScript() {
	const CACHED_SCRIPT = localStorage.getItem(CACHED_SCRIPT_KEY) || '';
	const CACHE_LAST_FETCH_TIME = localStorage.getItem(CACHE_LAST_FETCH_TIME_KEY) || '0';

	const CACHE_EXPIRED = isCacheExpired(Number(CACHE_LAST_FETCH_TIME) || 0, CACHE_EXPIRE_TIME);
	if (CACHED_SCRIPT && !CACHE_EXPIRED) {
		loadScriptFromCache(CACHED_SCRIPT);
		console.log('Strava balance script loaded from cache and executed successfully.');
	} else {
		fetchAndCacheScript();
	}
}

/**
 * Loads and executes the provided script from the cache.
 *
 * @param {string} script - The script content to be executed.
 */
function loadScriptFromCache(script) {
	let SCRIPT_BALANCE_ELEMENT = document.querySelector('script[data-source="stravaBalanceScript"]');
	if (!SCRIPT_BALANCE_ELEMENT) {
		SCRIPT_BALANCE_ELEMENT = document.createElement('script');
		SCRIPT_BALANCE_ELEMENT.type = 'module';
		SCRIPT_BALANCE_ELEMENT.setAttribute('data-source', 'stravaBalanceScript');
		document.body.appendChild(SCRIPT_BALANCE_ELEMENT);
	}
	SCRIPT_BALANCE_ELEMENT.text = script;
}

function fetchAndCacheScript() {
	const CONTROLLER = new AbortController();
	const TIMEOUT_ID = setTimeout(() => CONTROLLER.abort(), 10000); // 10 seconds timeout
	fetch(SCRIPT_URL, { signal: CONTROLLER.signal })
		.then((SCRIPT_URL_RESPONSE) => {
			clearTimeout(TIMEOUT_ID);
			if (!SCRIPT_URL_RESPONSE.ok) {
				throw new Error(`HTTP error! status: ${SCRIPT_URL_RESPONSE.status} while fetching ${SCRIPT_URL}`);
			}
			return SCRIPT_URL_RESPONSE.text();
		})
		.then((SCRIPT_URL_RESPONSE_DATA) => {
			localStorage.setItem(CACHED_SCRIPT_KEY, SCRIPT_URL_RESPONSE_DATA);
			localStorage.setItem(CACHE_LAST_FETCH_TIME_KEY, Date.now().toString());
			loadScriptFromCache(SCRIPT_URL_RESPONSE_DATA);
			console.log('Strava balance script loaded from network and executed successfully.');
		})
		.catch((error) => {
			if (error.name === 'AbortError') {
				console.error('Fetch request timed out after 10 seconds');
			} else {
				console.error(`Error fetching script from ${SCRIPT_URL}:`, error);
			}
		});
}

(function () {
	loadStravaBalanceScript();
})();
