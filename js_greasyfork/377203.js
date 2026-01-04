// ==UserScript==
// @name         Facebook :: Filter Artist, Band or Public Figure Searches
// @namespace    https://greasyfork.org/en/scripts/377203-facebook-filter-artist-band-or-public-figure-searches
// @version      1.1
// @description  Automatically removes search results whose categories match a blacklist or do not match a whitelist, specified below in userscript.
// @author       newstarshipsmell
// @include      /https://www\.facebook\.com/search/(pages/\?q=.+|str/.+/keywords_pages\?epa=FILTERS)&filters=eyJjYXRlZ29yeSI6IntcIm5hbWVcIjpcInBhZ2VzX2NhdGVnb3J5XCIsXCJhcmdzXCI6XCIxMDA3LDE4MDE2NDY0ODY4NTk4MlwifSJ9/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377203/Facebook%20%3A%3A%20Filter%20Artist%2C%20Band%20or%20Public%20Figure%20Searches.user.js
// @updateURL https://update.greasyfork.org/scripts/377203/Facebook%20%3A%3A%20Filter%20Artist%2C%20Band%20or%20Public%20Figure%20Searches.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var listToUse = 'whitelist';

	var whitelist = [
		'Artist',
		'Band',
		'Musician',
		'Musician/Band',
		'Performing Arts'
	];

	var blacklist = [
		'Arts & Entertainment',
		'Athlete',
		'Author',
		'Blogger',
		'Book',
		'Comedian',
		'Dancer',
		'Entrepreneur',
		'Fictional Character',
		'Movie Character',
		'News Personality',
		'Photographer',
		'Producer',
		'Professional Gamer',
		'Public Figure',
		'Sports & Recreation',
		'Ticket Sales',
		'Writer'
	]

	var logging = true;
	var scriptWait = 222;
	var resultsRemoved = 0;

	function removeSomeResults() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		try {
			var results = document.querySelectorAll('div._pac :nth-child(3)');

			for (var i = 0, len = results.length; i < len; i++) {

				if ((listToUse == 'whitelist' && whitelist.indexOf(results[i].textContent.trim()) < 0 ) ||
					(listToUse == 'blacklist' && blacklist.indexOf(results[i].textContent.trim()) > -1)) {
					results[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
					if (logging) console.log("Removed results[" + i + "]");
				} else {
					if (logging) console.log("Retained results[" + i + "]");
				}
				resultsRemoved++;
			}
			if (logging) console.log("Results removed: " + resultsRemoved);

		} catch(e) {
			if (logging) console.log("Error / nothing removed!");
		}
	}

	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { removeSomeResults(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", removeSomeResults, false);
})();