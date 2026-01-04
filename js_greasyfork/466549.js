// ==UserScript==
// @name         INE Better Time Calculator
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Provides a more accurate calculation of the progress made in INE learning paths.
// @author       Pavel Sushko
// @license      MIT
// @match        https://my.ine.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ine.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466549/INE%20Better%20Time%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/466549/INE%20Better%20Time%20Calculator.meta.js
// ==/UserScript==

(async function () {
	let falseProgressSelector = '.lpsection__group-progress'; // Selector for the element that contains the false progress
	let falseProgress = document.querySelector(falseProgressSelector); // The element that contains the false progress
	let heroAnchorSelector = '.lphero__cta-wrapper a'; // Selector for the element that contains the link to the learning path
	let heroAnchor = document.querySelector(heroAnchorSelector); // The element that contains the link to the learning path

	// Wait for the false progress and the link to the learning path to be loaded
	while (!falseProgress || !heroAnchor) {
		await new Promise((r) => setTimeout(r, 100)); // Wait 100ms

		falseProgress = document.querySelector(falseProgressSelector); // Reassign the false progress element
		heroAnchor = document.querySelector(heroAnchorSelector); // Reassign the link to the learning path element
	}

	/**
	 * Parses the cookie string into an object
	 * @param {str} str
	 * @returns {object}
	 */
	const parseCookie = (str) =>
		str
			.split(';')
			.map((v) => v.split('='))
			.reduce((acc, v) => {
				acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
				return acc;
			}, {});

	let regex = /([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i; // Regex to match the learning path ID
	let match = heroAnchor.href.match(regex); // Match the learning path ID

	// If the learning path ID is not found, return
	if (!match) return;

	// Fetch the learning path data
	let result = await fetch(`https://content-api.rmotr.com/api/v1/learning-paths/${match[0]}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${parseCookie(document.cookie).ine_access_token}`,
		},
	});

	// If the learning path data is not found, return
	if (!result) return;

	let resultJson = await result.json(); // Parse the learning path data into JSON
	let durationInSeconds = resultJson.duration_in_seconds; // Get the duration of the learning path in seconds
	let progress = resultJson.user_status.progress; // Get the progress of the learning path
	let progressInSeconds = progress * durationInSeconds; // Calculate the progress in seconds
	let timeLeftInSeconds = durationInSeconds - progressInSeconds; // Calculate the time left in seconds

	// If the progress_at_start cookie is not set, set it
	if (document.cookie.indexOf('progress_at_start') === -1)
		document.cookie = `progress_at_start=${progressInSeconds}; path=/; domain=.ine.com; secure; samesite=none;`;

	// Get the progress_at_start cookie
	let progressAtStart = parseCookie(document.cookie).progress_at_start;

	// Completed time object
	let completed = {
		hours: Math.floor(progressInSeconds / 3600), // Calculate the completed hours
		minutes: Math.floor((progressInSeconds % 3600) / 60), // Calculate the completed minutes
	};

	// Remaining time object
	let remaining = {
		hours: Math.floor(timeLeftInSeconds / 3600), // Calculate the remaining hours
		minutes: Math.floor((timeLeftInSeconds % 3600) / 60), // Calculate the remaining minutes
	};

	// Session time object
	let session = {
		hours: Math.floor((progressInSeconds - progressAtStart) / 3600), // Calculate the session hours
		minutes: Math.floor(((progressInSeconds - progressAtStart) % 3600) / 60), // Calculate the session minutes
	};

	// Array of time strings
	let timeStrings = [
		`${progress * 100}% Complete (${completed.hours}h ${completed.minutes}m)`, // Completed time string
		`${100 - progress * 100}% Remaining (${remaining.hours}h ${remaining.minutes}m)`, // Remaining time string
		`\nCurrent session: ${session.hours}h ${session.minutes}m`, // Session time string
	];

	// Set the false progress to the correct value
	document.querySelector(falseProgressSelector).innerText = timeStrings.join('\n');
})();
