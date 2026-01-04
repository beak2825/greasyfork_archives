// ==UserScript==
// @name         Redacted :: Hide Subscribed Collages
// @namespace    https://greasyfork.org/en/scripts/376199-redacted-hide-subscribed-collages
// @version      1.0
// @description  Adds a linkbox item to hide/show subscribed collages while browsing the collages.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/collages?\.php/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/376199/Redacted%20%3A%3A%20Hide%20Subscribed%20Collages.user.js
// @updateURL https://update.greasyfork.org/scripts/376199/Redacted%20%3A%3A%20Hide%20Subscribed%20Collages.meta.js
// ==/UserScript==

(function() {
	'use strict';

	if (/(\.php\?id=\d+|action=(new|edit|manage|comments))/.test(location.href)) return;

	var hideSubscribed = GM_getValue('redHideSubColDef');
	hideSubscribed = hideSubscribed === undefined ? false : hideSubscribed;

	var bookmarkedCollages = document.querySelector('a[href="bookmarks.php?type=collages"]');
	var hideShowSubs = document.createElement('a');
	hideShowSubs.href = 'javascript:void(0);';
	hideShowSubs.classList.add('brackets');
	hideShowSubs.textContent = (hideSubscribed ? 'Show' : 'Hide') + ' subscribed';
	hideShowSubs.addEventListener('click', hideCollages);
	if (hideSubscribed) hideCollages(false);

	bookmarkedCollages.parentNode.insertBefore(hideShowSubs, bookmarkedCollages);
	bookmarkedCollages.parentNode.insertBefore(document.createTextNode(' '), bookmarkedCollages);

	function hideCollages(clicked) {
		var rowButtons = document.querySelectorAll('tr[class^="row"] > td:nth-of-type(4) > a.brackets');
		for (var i = 0, len = rowButtons.length; i < len; i++) {
			if (rowButtons[i].classList.contains('icon_remove')) {
				rowButtons[i].parentNode.parentNode.classList.toggle('hidden');
			}

			if (clicked) {
				hideSubscribed = hideSubscribed ? false : true;
				GM_setValue('redHideSubColDef', hideSubscribed);
				hideShowSubs.textContent = (hideSubscribed ? 'Show' : 'Hide') + ' subscribed';
			}
		}
	}
})();