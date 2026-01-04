// ==UserScript==
// @name        Rotten Tomatoes info on IMDb
// @namespace   k226zzno1ibma5mvtmxc
// @version     1.2
// @description Fetches review count and average review score from Rotten Tomatoes
// @license     MIT
// @include     https://www.imdb.com/title/tt*
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @connect     www.omdbapi.com
// @connect     rottentomatoes.com
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/381315/Rotten%20Tomatoes%20info%20on%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/381315/Rotten%20Tomatoes%20info%20on%20IMDb.meta.js
// ==/UserScript==

(async function () {
	"use strict";

	let apiKey = await GM.getValue("apiKey");

	if (!apiKey) {
		apiKey = prompt("Please enter your OMDb API key to use this userscript, or hit cancel if you need to sign up for one.");

		if (!apiKey) {
			if (apiKey === null) {
				location.href = "https://www.omdbapi.com/apikey.aspx";
			}
			return;
		} else {
			GM.setValue("apiKey", apiKey);
		}
	}

	apiKey = encodeURIComponent(apiKey);

	const id = location.pathname.match(/^\/title\/(tt\d{7})/)[1];

	// Cache data in milliseconds
	const cachePeriod = 3600000;
	const cachePrefix = `k226zzno1i-${id}-`;

	function cacheGet(key) {
		return sessionStorage[`${cachePrefix}${key}`];
	}

	function cacheSet(key, value) {
		sessionStorage[`${cachePrefix}${key}`] = value;
	}

	function isCacheCurrent(key) {
		const time = cacheGet(key);
		return time && (Date.now() - parseInt(time, 10)) < cachePeriod;
	}


	function queueTheTomato(url) {
		// Proceed if/when page is fully loaded
		if (document.readyState === "complete") {
			addTheTomato(url);
		} else {
			window.addEventListener("load", () => {
				addTheTomato(url);
			});
		}
	}

	function addTheTomato(url) {
		const link = document.createElement("a");
		link.target = "_blank";
		link.rel = "noopener";
		link.referrerPolicy = "no-referrer";
		link.title = "View on Rotten Tomatoes";
		link.href = url;
		link.append("\uD83C\uDF45"); // tomato emoji

		// New layout
		const nav = document.querySelector("[data-testid='hero-subnav-bar-topic-links']");
		if (!nav) {
			return;
		}

		const [template] = nav.getElementsByTagName("li");
		const [templateLink] = template.getElementsByTagName("a");

		link.className = templateLink.className;

		const newOption = template.cloneNode();
		newOption.append(link);
		nav.append(newOption);

		// Scrape ratings data from Rotten Tomatoes (or cache)
		if (isCacheCurrent("rtTime")) {
			link.append(` ${cacheGet("rtAverage")} (${cacheGet("rtNumReviews")})`);
		} else {
			GM.xmlHttpRequest({
				method: "GET",
				anonymous: true,
				url: url,
				onload: (response) => {
					const doc = new DOMParser().parseFromString(response.responseText, "text/html");
					// Scrape info from script tags
					const script = doc.getElementById("score-details-json");

					if (!script) {
						return;
					}

					// Parse as JSON, should probably always work
					let scoreInfo;
					try {
						scoreInfo = JSON.parse(script.textContent).modal.tomatometerScoreAll;
					} catch (ignore) {
						return;
					}


					// Cache data
					cacheSet("rtTime", Date.now());
					cacheSet("rtAverage",    scoreInfo.averageRating);
					cacheSet("rtNumReviews", scoreInfo.ratingCount);

					link.append(` ${scoreInfo.averageRating} (${scoreInfo.ratingCount})`);
				}
			});
		}
	}


	// Get Rotten Tomatoes movie alias from cache or OMDb API
	if (isCacheCurrent("omdbTime")) {
		queueTheTomato(cacheGet("rtURL"));
	} else {
		GM.xmlHttpRequest({
			method: "GET",
			anonymous: true,
			url: `https://www.omdbapi.com/?apikey=${apiKey}&tomatoes=true&i=${encodeURIComponent(id)}`,
			onload: (response) => {
				const json = JSON.parse(response.responseText);
				if (json && json.tomatoURL) {
					let url;
					try {
						// Check if URL is valid
						url = new URL(json.tomatoURL);
					} catch (ignore) {
						return;
					}

					// Cache data
					cacheSet("rtURL",    url.href);
					cacheSet("omdbTime", Date.now());

					queueTheTomato(url.href);
				} else if (json && json.Error) {
					console.log(`Error:  ${json.Error}`);
				}
			}
		});
	}
})();

