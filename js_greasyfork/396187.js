// ==UserScript==
// @name         SoundCloud :: Hide themusictea/Popular Selection Search Results
// @namespace    https://greasyfork.org/en/scripts/396187-soundcloud-hide-themusictea-popular-selection-search-results
// @version      1.0
// @description  Hides search results from users/accounts "themusictea" and "Popular Selection"
// @author       newstarshipsmell
// @include      /https://soundcloud\.com/search/(albums|sets)\?q=.+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396187/SoundCloud%20%3A%3A%20Hide%20themusicteaPopular%20Selection%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/396187/SoundCloud%20%3A%3A%20Hide%20themusicteaPopular%20Selection%20Search%20Results.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var scriptWait = 200;

	function hideResults() {
		if (!bGbl_ChangeEventListenerInstalled)
		{
			bGbl_ChangeEventListenerInstalled = true;
			document.addEventListener("DOMSubtreeModified", HandleDOM_ChangeWithDelay, false);
		}

		var results = document.querySelectorAll('li.searchList__item');
		var resultsUsers = document.querySelectorAll('li.searchList__item span.soundTitle__usernameText');
		for (var i = 0, len = resultsUsers.length; i < len; i++) {
			if (/(themusictea|Popular Selection)/.test(resultsUsers[i].textContent)) {
				results[i].style.display = 'none';
			}
		}
	}

	function HandleDOM_ChangeWithDelay(zEvent) {
		if (typeof zGbl_DOM_ChangeTimer == "number")
		{
			clearTimeout (zGbl_DOM_ChangeTimer);
			zGbl_DOM_ChangeTimer = '';
		}
		zGbl_DOM_ChangeTimer = setTimeout (function() { hideResults(); }, scriptWait);
	}

	var zGbl_DOM_ChangeTimer = '';
	var bGbl_ChangeEventListenerInstalled = false;

	window.addEventListener ("load", hideResults, false);
})();