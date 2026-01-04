// ==UserScript==
// @name         Deezer :: Search Exact Artist
// @namespace    https://greasyfork.org/en/scripts/382373-deezer-search-exact-artist
// @version      1.0
// @description  Opens exact matches in new tabs and adds a button to filter results to near-matches.
// @author       newstarshipsmell
// @include      https://www.deezer.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/382373/Deezer%20%3A%3A%20Search%20Exact%20Artist.user.js
// @updateURL https://update.greasyfork.org/scripts/382373/Deezer%20%3A%3A%20Search%20Exact%20Artist.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var scriptWait = 500;
	var contentLoadTimeout = 4000;
	var currentPage = location.href;
	var lastPage = '';
	var searchtermsH1, searchterms, searchString, searchPattern, searchPatternNoThe, searchPatternStripped, searchPatternThe, searchResults, extFltBtn, btnAdded,
		linksOpened, scrolledToEnd, lastContentLoadTime, nowContentLoadTime;

	function addFilterButton() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		currentPage = location.href;
		if (!/https:\/\/www\.deezer\.com\/search\/.+\/artist/.test(currentPage)) {
			lastPage = currentPage;
			if (extFltBtn) {
				extFltBtn.parentNode.removeChild(extFltBtn);
				extFltBtn = undefined;
			}
			return;
		}

		if (currentPage != lastPage) {
			btnAdded = false;
			linksOpened = [];
			scrolledToEnd = false;
			lastContentLoadTime = new Date();
			lastContentLoadTime = lastContentLoadTime.getTime();
		}
		lastPage = currentPage;

		searchtermsH1 = document.querySelector('div.search-header > div.container > h1');
		if (searchtermsH1 === null) return;

		searchterms = searchtermsH1.innerHTML;
		if (searchterms === undefined) return;

		searchString = searchterms.replace(/Search results for « (.+) »/, '$1').toLowerCase().replace(/(\S)\+(\S)/g,
																									  '$1 $2').replace(/([\[\\\^\$\.\|\?\*\+\(\)])/g, '\$1');
		searchPattern = new RegExp('^' + searchString + '$');
		searchPatternNoThe = new RegExp('^' + searchString.replace(/^the /, '') + '$');
		searchPatternStripped = new RegExp('^' + searchString.replace(/[^ \w]/g, '') + '$');
		searchPatternThe = new RegExp('^the ' + searchString + '$');

		if (!btnAdded) {
			extFltBtn = document.createElement('input');
			extFltBtn.setAttribute('type', 'button');
			extFltBtn.setAttribute('id', 'exact_filter');
			extFltBtn.setAttribute('value', 'Exact Filter');
			extFltBtn.setAttribute('title', 'Hides all results that are not exact or near-exact matches to the searchterms');

			searchtermsH1.parentNode.appendChild(extFltBtn);
			btnAdded = true;

			extFltBtn.addEventListener('click', function(e) {
				searchResults = document.querySelectorAll('li.thumbnail-col > div.thumbnail-caption > div.heading-4 > a');

				for (var i = 0, len = searchResults.length; i < len; i++) {
					if (!searchPattern.test(searchResults[i].title.toLowerCase()) &&
						!searchPatternNoThe.test(searchResults[i].title.toLowerCase()) &&
						!searchPatternStripped.test(searchResults[i].title.toLowerCase().replace(/[^ \w]/g, '')) &&
						!searchPatternThe.test(searchResults[i].title.toLowerCase())) {
						searchResults[i].parentNode.parentNode.parentNode.classList.add('hidden');
					}
				}
			});
		}

		searchResults = document.querySelectorAll('li.thumbnail-col > div.thumbnail-caption > div.heading-4 > a');
		if (searchResults === null) return;

		for (var i = 0, len = searchResults.length; i < len; i++) {
			if (linksOpened.indexOf(searchResults[i].href) < 0 &&
				searchPattern.test(searchResults[i].title.toLowerCase())) {
				linksOpened.push(searchResults[i].href);
				GM_openInTab(searchResults[i].href, true);
			}
		}

		if (scrolledToEnd) return;
		nowContentLoadTime = new Date();
		nowContentLoadTime = nowContentLoadTime.getTime();

		if (nowContentLoadTime - lastContentLoadTime < contentLoadTimeout) {
			lastContentLoadTime = nowContentLoadTime;
			document.querySelector('ul.thumbnail-grid-responsive').lastChild.scrollIntoView();

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
		zGbl_DOM_ChangeTimer = setTimeout (function() { addFilterButton(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", addFilterButton, false);
})();