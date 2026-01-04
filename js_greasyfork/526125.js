// ==UserScript==
// @namespace    https://github.com/1LineAtaTime/TamperMonkey-Scripts
// @name         LinkedInJunkFilter
// @version      0.2
// @description  Removes customizable job offers from LinkedIn by automatically hiding any job element that has any keywords from the filterList. Fork from https://update.greasyfork.org/scripts/465779/LinkedInJunkFilter.user.js
// @author       1LineAtaTime
// @match        https://*.linkedin.com/jobs/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=linkedin.com
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/526125/LinkedInJunkFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/526125/LinkedInJunkFilter.meta.js
// ==/UserScript==

// // Customize this list. Job offers, where the preview contains one of these Strings will be removed.

const filterList = ["Applied", "Viewed", "Promoted"];
let $ = this.jQuery = jQuery.noConflict(true);

// Case insensitive contains
$.expr[':'].icontains = function(a, i, m) {
	return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

function removeLi(str) {
	let list = $(`li.ember-view:icontains('${str}')`);
	for (let li of list) {
		if (!li.hidden) {
			let jobTitleElement = li.querySelector(".job-card-container__link strong");
			let jobTitle = jobTitleElement ? jobTitleElement.innerText.trim() : "Unknown Title";
			console.log("Hiding job: " + jobTitle + " - " + str);
			li.hidden = true;
		}
	}

	setTimeout(() => {
		removeLi(str);
	}, 100);
}

function removeLiTimer() {
	setTimeout(() => {
		for (let filter of filterList) removeLi(filter);
	}, 300);
}

removeLiTimer();
