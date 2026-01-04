// ==UserScript==
// @name         Dining Hall Script (WLU)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Refreshes with the times for the dining hall to get accurate menu.
// @author       @mohammadelhsn
// @match        https://wlu.campusdish.com/LocationsAndMenus/FreshFoodCompany
// @icon         https://www.google.com/s2/favicons?sz=64&domaain=campusdish.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482144/Dining%20Hall%20Script%20%28WLU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482144/Dining%20Hall%20Script%20%28WLU%29.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function checkTime() {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();

		const reload = () => window.location.reload();
		let time = '';

		if (hours == 11 && minutes == 0) {
			reload();
			time = 'Lunch';
			return;
		} else if (hours == 16 && minutes == 0) {
			reload();
			time = 'Dinner';
			return;
		} else if (hours == 7 && minutes == 30) {
			reload();
			time = 'Breakfast';
			return;
		} else if (hours == 14 && minutes == 22) {
			reload();
			time = 'Test';
			return;
		} else {
			time = 'None';
		}

		console.log(`Time: ${hours}:${minutes} | Status: ${time}`);
		return;
	}

	setInterval(checkTime, 60000);
})();
