// ==UserScript==
// @name        Convert Ascent and Descent to Feet
// @namespace   typpi.online
// @version     1.1
// @description Converts ascent and descent values from meters to feet on the for Strava Sauce users.
// @author      Nick2bad4u
// @license     UnLicense
// @match       https://www.strava.com/activities/*
// @resource    https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @icon        https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @icon64      https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/520655/Convert%20Ascent%20and%20Descent%20to%20Feet.user.js
// @updateURL https://update.greasyfork.org/scripts/520655/Convert%20Ascent%20and%20Descent%20to%20Feet.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Function to convert meters to feet
	const metersToFeet = (meters) => {
		// Return converted value or 0 if invalid
		if (isNaN(meters) || meters === null || meters === '') {
			return 0; // Return 0 if value is invalid
		}
		return (meters * 3.28084).toFixed(2);
	};

	// Function to update the values in feet and insert them into the correct grid
	const updateValues = () => {
		console.log('updateValues called');

		// Select the elements using the given selectors
		const ascentElement = document.querySelector(
			'body > div.fancybox-overlay.fancybox-overlay-fixed > div > div > div > div > div > div:nth-child(17) > div.grid > table > tbody > tr:nth-child(1) > td:nth-child(2) > span',
		);
		const descentElement = document.querySelector(
			'body > div.fancybox-overlay.fancybox-overlay-fixed > div > div > div > div > div > div:nth-child(17) > div.grid > table > tbody > tr:nth-child(1) > td:nth-child(3) > span',
		);

		// Check if the elements exist on the page
		if (ascentElement && descentElement) {
			console.log('Ascent and descent elements found:', ascentElement, descentElement);

			// Extract the numeric values and convert them to feet
			const ascentValueInMeters = parseFloat(ascentElement.textContent.trim());
			const descentValueInMeters = parseFloat(descentElement.textContent.trim());

			// Convert ascent value and check if valid
			const ascentValueInFeet = metersToFeet(ascentValueInMeters);
			if (ascentValueInFeet !== 0) {
				console.log('Converted ascent value (feet):', ascentValueInFeet);
				ascentElement.innerHTML = `${ascentValueInFeet} <span class="gridUnits">ft</span><br><span class="gridTitle">Ascent</span>`;
			} else {
				console.log('Invalid Ascent value detected:', ascentValueInMeters);
			}

			// Convert descent value and check if valid
			const descentValueInFeet = metersToFeet(descentValueInMeters);
			if (descentValueInFeet !== 0) {
				console.log('Converted descent value (feet):', descentValueInFeet);
				descentElement.innerHTML = `${descentValueInFeet} <span class="gridUnits">ft</span><br><span class="gridTitle">Descent</span>`;
			} else {
				console.log('Invalid Descent value detected:', descentValueInMeters);
			}

			// Add the ascent and descent data to the same row in the grid
			const grid = document.querySelector(
				'#heading > div > div.row.no-margins.activity-summary-container > div.spans8.activity-stats.mt-md.mb-md > div.summaryGrid > table > tbody',
			);
			console.log('Adding ascent and descent values to the grid:', grid);

			const newRow = document.createElement('tr');
			newRow.innerHTML = `
                <td data-column="0" data-row="8">
                    <span class="summaryGridDataContainer" onclick="javascript:window.open(&quot;chrome-extension:/dhiaggccakkgdfcadnklkbljcgicpckn/app/index.html#/globalSettings?viewOptionHelperId=displayAdvancedPowerData&quot;,&quot;_blank&quot;);">
                        ${ascentValueInFeet} <span class="summaryGridUnits">ft</span><br><span class="summaryGridTitle">Ascent</span>
                    </span>
                </td>
                <td data-column="1" data-row="8">
                    <span class="summaryGridDataContainer" onclick="javascript:window.open(&quot;chrome-extension:/dhiaggccakkgdfcadnklkbljcgicpckn/app/index.html#/globalSettings?viewOptionHelperId=displayAdvancedPowerData&quot;,&quot;_blank&quot;);">
                        ${descentValueInFeet} <span class="summaryGridUnits">ft</span><br><span class="summaryGridTitle">Descent</span>
                    </span>
                </td>
            `;
			grid.appendChild(newRow);
			console.log('Ascent and Descent values added to grid:', newRow);

			// Disconnect the observer after updating the values
			observer.disconnect();
			console.log('Observer disconnected after values are updated');
		} else {
			console.log('Ascent or descent elements not found');
		}
	};

	// Debounce function to limit the frequency of function calls
	function debounce(func, wait) {
		let timeout;
		return function (...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	// Create a MutationObserver to watch for changes in the DOM
	const observer = new MutationObserver(() => {
		console.log('Mutation observed');
		// Run the update function when the elements are added to the DOM
		updateValuesDebounced();
	});

	// Wrap the updateValues function with debounce
	const updateValuesDebounced = debounce(updateValues, 1000); // Adjust the delay as needed

	// Observe changes to the document body
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
	console.log('Observer is now watching for changes');
})();
