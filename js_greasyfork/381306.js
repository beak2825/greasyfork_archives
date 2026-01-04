// ==UserScript==
// @name        PassThePopcorn: Rotten Tomatoes and Metacritic review counts
// @namespace   xr5p6aa6hwnltb7hzyzi
// @description Shows how many Rotten Tomatoes and Metacritic ratings a movie on PTP has received, and the average Rotten Tomatoes rating. Data is cached for 1 hour.
// @license     MIT
// @match       https://passthepopcorn.me/torrents.php?*id=*
// @connect     rottentomatoes.com
// @connect     metacritic.com
// @version     1.3.2
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/381306/PassThePopcorn%3A%20Rotten%20Tomatoes%20and%20Metacritic%20review%20counts.user.js
// @updateURL https://update.greasyfork.org/scripts/381306/PassThePopcorn%3A%20Rotten%20Tomatoes%20and%20Metacritic%20review%20counts.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// Cache in milliseconds
	const cachePeriod = 3600000;

	// Avoid clashing with site sessionStorage.
	const cachePrefix = "xr5p6aa6hw-";

	// Greasemonkey compat
	// it's all so tiresome
	const plsComputerSend2Internet = (typeof GM_xmlhttpRequest === "function" && GM_xmlhttpRequest || GM.xmlHttpRequest);

	// Locate the Rotten Tomatoes and Metacritic sections in the ratings table
	const ratingsTable = document.getElementById("movie-ratings-table");

	if (!ratingsTable) {
		return;
	}

	const rtLogo = ratingsTable.querySelector("img[title='Rotten Tomatoes']");
	const mcLogo = ratingsTable.querySelector("img[title='Metacritic']");

	// Rotten Tomatoes rating present
	if (rtLogo) {
		// Ratings are the next cell over, next to the logo
		const logoCell = rtLogo.closest("td");
		const ratingCell = logoCell.closest("tr").cells[logoCell.cellIndex + 1];

		// URL to fetch
		const url = rtLogo.closest("a").href;

		const cache = cachePrefix + url;

		if (isCacheCurrent(cache)) {
			displayInfo(ratingCell, sessionStorage[cache + "numReviews"], sessionStorage[cache + "avgScore"]);
		} else {
			fetchDocument(url).then((doc) => {
				const result = processRT(doc, cache);
				displayInfo(ratingCell, result.numReviews, result.avgScore);
			});
		}
	}


	// Metacritic rating present
	if (mcLogo) {
		// Ratings are the next cell over, next to the logo
		const logoCell = mcLogo.closest("td");
		const ratingCell = logoCell.closest("tr").cells[logoCell.cellIndex + 1];

		// URL to fetch
		const url = mcLogo.closest("a").href;

		const cache = cachePrefix + url;

		if (isCacheCurrent(cache)) {
			displayInfo(ratingCell, sessionStorage[cache + "numReviews"]);
		} else {
			fetchDocument(url).then((doc) => {
				const result = processMC(doc, cache);
				displayInfo(ratingCell, result.numReviews);
			});
		}
	}


	function isCacheCurrent(key) {
		key += "time";
		return key in sessionStorage && (Date.now() - parseInt(sessionStorage[key], 10)) < cachePeriod;
	}

	// Fetches and parses an HTML document with a Promise API
	function fetchDocument(url) {
		return new Promise((resolve, reject) => {
			plsComputerSend2Internet({
				method: "GET",
				url: url,
				anonymous: true,
				onload: (response) => {
					// Resolve with parsed HTML document
					resolve(new DOMParser().parseFromString(response.responseText, "text/html"));
				},
				onerror: (response) => {
					reject(response);
				},
			});
		});
	}


	// Adds info to the ratings table
	function displayInfo(cell, numReviews, avgScore) {
		cell.appendChild(document.createElement("br"));
		cell.appendChild(document.createTextNode("(" + numReviews + ")"));
		if (avgScore !== undefined) {
			cell.appendChild(document.createElement("br"));
			cell.appendChild(document.createTextNode(avgScore));
		}
	}


	// Heavy lifting for Rotten Tomatoes happens here
	function processRT(doc, cache) {
		// Rip and tear the info out of the document
		const script = doc.getElementById("score-details-json");

		if (!script) {
			return;
		}

		// Parse as JSON, should probably always work
		let scoreInfo;
		try {
			scoreInfo = JSON.parse(script.textContent);
		} catch (ignore) {
			return;
		}

		const numReviews = String(scoreInfo.modal.tomatometerScoreAll.reviewCount);
		const avgScore   = String(scoreInfo.modal.tomatometerScoreAll.averageRating);

		// Cache info f'later
		sessionStorage[cache + "numReviews"] = numReviews;
		sessionStorage[cache + "avgScore"]   = avgScore;
		sessionStorage[cache + "time"]       = Date.now();

		return { numReviews, avgScore };
	}


	// Heavy lifting for Metacritic happens here
	function processMC(doc, cache) {
		// Rip and tear the info out of the document
		const script = doc.evaluate("//script[@type='application/ld+json' and contains(., 'aggregateRating')]", doc, null, XPathResult.ANY_UNORDERED_NODE_TYPE).singleNodeValue;

		if (!script) {
			return;
		}

		// Metacritic embeds this info as JSON already which is nice
		const scoreInfo = JSON.parse(script.textContent);

		const numReviews = String(scoreInfo.aggregateRating.ratingCount);

		// Cache info f'later
		sessionStorage[cache + "numReviews"] = numReviews;
		sessionStorage[cache + "time"]       = Date.now();

		return { numReviews };
	}
})();
