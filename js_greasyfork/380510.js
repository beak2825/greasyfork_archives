// ==UserScript==
// @name         Redacted :: Hide/Show Old Notifications
// @namespace    https://greasyfork.org/en/scripts/380510-redacted-hide-show-old-notifications
// @version      1.0
// @description  Adds a linkbox item [Hide|Show old notifications] to toggle display of groups that are not marked New!
// @author       newstarshipsmell
// @include      /https://redacted\.ch/torrents\.php\?(page=\d+&)?action=notify/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/380510/Redacted%20%3A%3A%20HideShow%20Old%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/380510/Redacted%20%3A%3A%20HideShow%20Old%20Notifications.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var hideOldNotifs = GM_getValue('RedactedNotificationsHideOldNotifs');
	hideOldNotifs = hideOldNotifs === undefined ? false : hideOldNotifs;

	var notifs, isOld, i, j, len, leng;

	if (hideOldNotifs) {
		notifs = document.querySelectorAll('tbody > tr.torrent_row > td.big_info > div.group_info > div.torrent_info');

		for (i = 0, len = notifs.length; i < len ; i++) {
			isOld = true;
			for (j = 0, leng = notifs[i].childNodes.length; j < leng; j++) {
				try {
					isOld = notifs[i].childNodes[j].classList.contains('new') ? false : isOld;
				} catch(e) {}
			}

			if (isOld) {
				notifs[i].parentNode.parentNode.parentNode.classList.add('hidden');
			}
		}
	}

	var linkbox = document.querySelector('div.linkbox');
	linkbox.appendChild(document.createTextNode('\u00A0'.repeat(3)));
	var toggleOldNotifs = document.createElement('a');
	toggleOldNotifs.id = 'show_hide_old_toggle';
	toggleOldNotifs.href = 'javascript:void(0);';
	toggleOldNotifs.classList.add('brackets');
	var toggleText = (hideOldNotifs ? 'Show' : 'Hide') + ' old notifications';
	var toggleTextNode = document.createTextNode(toggleText);
	toggleOldNotifs.appendChild(toggleTextNode);
	linkbox.appendChild(toggleOldNotifs);

	toggleOldNotifs.addEventListener('click', function(e) {
		notifs = document.querySelectorAll('tbody > tr.torrent_row > td.big_info > div.group_info > div.torrent_info');
		hideOldNotifs = hideOldNotifs ? false : true;
		GM_setValue('RedactedNotificationsHideOldNotifs', hideOldNotifs);
		toggleTextNode.textContent = (toggleTextNode.textContent.split(' ')[0] == 'Hide' ? 'Show' : 'Hide') + ' old notifications';

		for (i = 0, len = notifs.length; i < len ; i++) {
			isOld = true;

			for (j = 0, leng = notifs[i].childNodes.length; j < leng; j++) {
				try {
					isOld = notifs[i].childNodes[j].classList.contains('new') ? false : isOld;
				} catch(e) {}
			}

			if (isOld) {
				if (hideOldNotifs) {
					notifs[i].parentNode.parentNode.parentNode.classList.add('hidden');
				} else {
					notifs[i].parentNode.parentNode.parentNode.classList.remove('hidden');
				}
			}
		}
	});
})();