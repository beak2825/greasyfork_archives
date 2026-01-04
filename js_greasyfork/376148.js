// ==UserScript==
// @name         Redacted :: Link Comedian in Torrent Title
// @namespace    https://greasyfork.org/en/scripts/376148-redacted-link-comedian-in-torrent-title
// @version      1.0
// @description  On browse/search pages, links the left-hand side of a torrent title (formatted 'comedian - releasetitle') to an artist.php search for that name.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/torrents\.php\?.+action=(basic|advanced)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376148/Redacted%20%3A%3A%20Link%20Comedian%20in%20Torrent%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/376148/Redacted%20%3A%3A%20Link%20Comedian%20in%20Torrent%20Title.meta.js
// ==/UserScript==

(function() {
	'use strict';

	if (/filter_cat(%5B|\[)[123457](%5D|])=1/.test(location.href) || !/filter_cat(%5B|\[)6(%5D|])=1/.test(location.href)) return;

	var torrentLinks = document.querySelectorAll('table#torrent_table > tbody > tr.torrent > td.big_info > div.group_info > a:nth-of-type(1)');
	var artistLinks = [];
	for (var i = 0, len= torrentLinks.length; i < len; i++) {
		var torrentTitle = torrentLinks[i].innerHTML;
		if (torrentTitle.indexOf(' - ') > -1) {
			torrentLinks[i].innerHTML = torrentTitle.split(' - ')[1];
			var artistName = torrentTitle.split(' - ')[0];
			var artistUrl = encodeURIComponent(artistName);
			artistLinks.push(document.createElement('a'));
			artistLinks[i].href = 'artist.php?artistname=' + artistUrl;
			artistLinks[i].target = '_blank';
			artistLinks[i].innerHTML = artistName;
			torrentLinks[i].parentNode.insertBefore(document.createTextNode(' - '), torrentLinks[i]);
			torrentLinks[i].parentNode.insertBefore(artistLinks[i], torrentLinks[i].previousSibling);
		} else {
			artistLinks.push(null);
		}
	}
})();