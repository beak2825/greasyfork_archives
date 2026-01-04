// ==UserScript==
// @name         Redacted :: Autoclick Confirm Edition
// @namespace    https://greasyfork.org/en/scripts/374837-redacted-autoclick-confirm-edition
// @version      1.1
// @description  Automatically clicks the Confirm Edition button for any torrents that contain at least Label info.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/user\.php\?page=\d+&action=unconfirmed_releases/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374837/Redacted%20%3A%3A%20Autoclick%20Confirm%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/374837/Redacted%20%3A%3A%20Autoclick%20Confirm%20Edition.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var checkLabel = true; var checkCatNo = true;
	var hasLabel, hasCatNo, clickConfirm, i, j, len;

	var torrents = document.querySelectorAll('tr.torrent.torrent_row');
	var label = false;

	for (i = 0, len = torrents.length; i < len; i++) {
		hasLabel = false; hasCatNo = false; clickConfirm = false;
		for (j = 0, len = torrents[i].querySelector('td.big_info > div.group_info').childNodes.length; j < len; j++) {
			if (torrents[i].querySelector('td.big_info > div.group_info').childNodes[j].nodeType != 3) continue;
			if (/Record Label:/.test(torrents[i].querySelector('td.big_info > div.group_info').childNodes[j].textContent)) hasLabel = true;
			if (/Catalog Number:/.test(torrents[i].querySelector('td.big_info > div.group_info').childNodes[j].textContent)) hasCatNo = true;
		}
		clickConfirm = (checkLabel ? hasLabel : true) && (checkCatNo ? hasCatNo : true) ? true : false;
		if (clickConfirm) torrents[i].querySelector('td.big_info > div.group_info > span.or_action_buttons > input').click();
	}

	var pageNumber = location.href.replace(/https:\/\/redacted\.ch\/user\.php\?page=(\d+)&action=unconfirmed_releases/, '$1');
	if (pageNumber > 1) {
		pageNumber--;
		location.assign('https://redacted.ch/user.php?page=' + pageNumber + '&action=unconfirmed_releases');
	}
})();