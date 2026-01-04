// ==UserScript==
// @name         Garmin Connect - Remove all Gear from Activity
// @namespace    typpi.online
// @version      1.8
// @description  Adds a button to remove all gear from Garmin Connect activities.
// @author       Nick2bad4u
// @match        *://connect.garmin.com/modern/activity/*
// @match        *://connect.garmin.com/modern/activities
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        none
// @license      UnLicense
// @tag          garmin
// @downloadURL https://update.greasyfork.org/scripts/516924/Garmin%20Connect%20-%20Remove%20all%20Gear%20from%20Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/516924/Garmin%20Connect%20-%20Remove%20all%20Gear%20from%20Activity.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Function to click all elements with the specified class with a delay
	function clickElements() {
		// Select all elements with the class name ActivityGearStatusView_active__l8MV9
		var elements = document.querySelectorAll(
			'.ActivityGearStatusView_active__l8MV9:not(.clicked)',
		);
		var delay = 250; // Delay in milliseconds

		elements.forEach(function (element, index) {
			setTimeout(function () {
				// Dispatch a click event
				element.dispatchEvent(
					new MouseEvent('click', {
						bubbles: true,
						cancelable: true,
						view: window,
					}),
				);
				// Mark the element as clicked
				element.classList.add('clicked');
			}, index * delay);
		});
	}

	// Add a button to the page to run clickElements function
	var button = document.createElement('button');
	button.innerText = 'Remove Gear';
	button.style.position = 'fixed';
	button.style.bottom = '10px';
	button.style.right = '10px';
	button.style.zIndex = 1000;
	button.style.backgroundColor = '#6272a4';
	button.style.color = '#f8f8f2';
	button.style.border = 'none';
	button.style.padding = '10px 20px';
	button.style.borderRadius = '5px';
	button.style.fontSize = '16px';
	button.style.cursor = 'pointer';
	button.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.3)';
	button.onclick = clickElements;
	document.body.appendChild(button);
})();
