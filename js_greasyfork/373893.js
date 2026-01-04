// ==UserScript==
// @name         Redacted :: Probably Watermarked
// @namespace    https://greasyfork.org/en/scripts/373893-redacted-probably-watermarked
// @version      1.0
// @description  Appends 'Probably Watermarked' to WEB editions matching 'Universal' or 'UMG'
// @author       newstarshipsmell
// @include      /https://redacted\.ch/torrents\.php(\?|\?page=\d+&)id=\d+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373893/Redacted%20%3A%3A%20Probably%20Watermarked.user.js
// @updateURL https://update.greasyfork.org/scripts/373893/Redacted%20%3A%3A%20Probably%20Watermarked.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var labelsPattern = /(Universal|UMG)/;
	var editions = document.querySelectorAll('td.edition_info > strong');

	for (var i = 0, len = editions.length; i < len; i++) {
		if (!/^WEB\s*/.test(editions[i].lastChild.textContent.split(' / ').pop())) continue;
		if (labelsPattern.test(editions[i].lastChild.textContent)) editions[i].lastChild.textContent = editions[i].lastChild.textContent.replace(' / WEB', ' / WEB / Probably Watermarked');
	}
})();