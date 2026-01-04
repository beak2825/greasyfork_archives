// ==UserScript==
// @name         Deezer Mobile Ad Hider
// @namespace    https://greasyfork.org/en/scripts/370301-deezer-mobile-ad-hider
// @version      1.2
// @description  Hides the ad for the mobile app that no one gives a shit about.
// @author       newstarshipsmell
// @include      /https?://(www\.)?deezer\.com/(\w{2}/|search/).+/
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/370301/Deezer%20Mobile%20Ad%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/370301/Deezer%20Mobile%20Ad%20Hider.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var scriptWait = 222;
	var btnAdded = false;

	function removeSomeIrritatingBullshit() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		try {
			var searchterms = document.querySelector('div.search-header > div.container > h1');
		} catch(err) {}

		try {
			if (searchterms.innerHTML !== undefined){
				var searchString = searchterms.innerHTML.replace(/Search results for « (.+) »/, '$1').toLowerCase().replace(/([\[\\\^\$\.\|\?\*\+\(\)])/g, '\$1');
				var searchPattern = new RegExp('^' + searchString + '$');
				var searchPatternNoThe = new RegExp('^' + searchString.replace(/^the /, '') + '$');
				var searchPatternStripped = new RegExp('^' + searchString.replace(/[^ \w]/g, '') + '$');
				var searchPatternThe = new RegExp('^the ' + searchString + '$');
			}
		} catch(err) {}

		try {
			if (!btnAdded && searchterms.innerHTML !== undefined) {
				var extFltBtn = document.createElement('input');
				extFltBtn.setAttribute('type', 'button');
				extFltBtn.setAttribute('id', 'exact_filter');
				extFltBtn.setAttribute('value', 'Exact Filter');
				extFltBtn.setAttribute('title', 'Hides all results that are not exact matches to the search terms');

				searchterms.parentNode.appendChild(extFltBtn);
				btnAdded = true;

				document.getElementById('exact_filter').addEventListener("click", function(){
					var searchResults = document.querySelectorAll('li.thumbnail-col > div.thumbnail-caption > div.heading-4 > a');

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
		} catch(err) {}

		try {
			var irritatingBullshit = document.querySelector('div.modal');
			irritatingBullshit.parentNode.removeChild(irritatingBullshit);
		}
		catch(err) {}

		try {document.querySelector('div.c0130 > button').click();}
		catch(err) {}

		try {document.querySelector('div.ads-bottom').classList.add('hidden');}
		catch(err) {}

		try {
			var searchBar = document.querySelector('div.search');
			var catCont = document.querySelector('div.catalog-content');
			catCont.appendChild(searchBar);
		} catch(err) {}

		try {document.querySelector('div.conversion-banner').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('div.header-creator-thumbnails').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('span.sticker-orange').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('svg.svg-icon-search').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('div.page-sidebar').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('div.page-panels').classList.add('hidden');}
		catch(err) {}

		try {document.querySelector('ul.action-center').classList.add('hidden');}
		catch(err) {}

		try {var cover = document.querySelector('img.picture-img');}
		catch(err) {}

		try {
			var shareBtn = document.querySelectorAll('button.c011.c0110')[1];
			shareBtn.addEventListener('click', function(e){
				e.preventDefault();
				var coverURL = cover.src.replace(/264x264-000000-80-0-0.jpg/, '1000x1000-000000-0-0-0.jpg');
				GM_setClipboard(coverURL);
				//GM_openInTab(coverURL);
				window.close();
			});
		} catch(err) {}

	}

	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { removeSomeIrritatingBullshit(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", removeSomeIrritatingBullshit, false);

})();