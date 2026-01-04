// ==UserScript==
// @name         Tidal :: Search Exact Artist
// @namespace    https://greasyfork.org/en/scripts/382374-tidal-search-exact-artist
// @version      1.0
// @description  Opens exact matches in new tabs.
// @author       newstarshipsmell
// @include      https://listen.tidal.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/382374/Tidal%20%3A%3A%20Search%20Exact%20Artist.user.js
// @updateURL https://update.greasyfork.org/scripts/382374/Tidal%20%3A%3A%20Search%20Exact%20Artist.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var scriptWait = 200;
	var contentLoadTimeout = 2000;
	var currentPage = location.href;
	var lastPage = '';
	var artists, searchTermsSpan, searchTerms, resultName, resultLink, linksOpened, scrolledToEnd, lastContentLoadTime, nowContentLoadTime;

	function searchExactMatches() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		currentPage = location.href;
		if (!/https:\/\/listen\.tidal\.com\/search\/artists\?q=.+/.test(currentPage)) {
			lastPage = currentPage;
			return;
		}

		if (currentPage != lastPage) {
			linksOpened = [];
			scrolledToEnd = false;
			lastContentLoadTime = new Date();
			lastContentLoadTime = lastContentLoadTime.getTime();
		}
		lastPage = currentPage;

		searchTermsSpan = document.querySelector('span.activeItem--ujRko.item--2qpWg');
		if (searchTermsSpan === null) return;

		searchTerms = searchTermsSpan.textContent.replace(/Search results for: /, '').replace(/[^ a-zA-Z0-9]/g, '').toLowerCase();
		if (searchTerms === undefined) return;

		artists = document.querySelectorAll('h2.title--25q_A.title--3lmOu > a');
		if (artists === null) return;

		for (var i = 0, len = artists.length; i < len; i++) {
			resultName = artists[i].textContent.replace(/[^ a-zA-Z0-9]/g, '').toLowerCase();
			resultLink = artists[i].parentNode.parentNode.previousSibling.href;
			if (searchTerms != resultName) continue;
			if (linksOpened.indexOf(resultLink) > -1) continue;
			linksOpened.push(resultLink);
			GM_openInTab(resultLink, true);
		}

		if (scrolledToEnd) return;
		nowContentLoadTime = new Date();
		nowContentLoadTime = nowContentLoadTime.getTime();

		if (nowContentLoadTime - lastContentLoadTime < contentLoadTimeout) {
			lastContentLoadTime = nowContentLoadTime;
			document.querySelector('div.ReactVirtualized__Grid__innerScrollContainer').lastChild.scrollIntoView();

		} else {
			scrolledToEnd = true;
		}
	}

	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { searchExactMatches(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", searchExactMatches, false);
})();