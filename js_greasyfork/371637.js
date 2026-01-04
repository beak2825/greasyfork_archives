// ==UserScript==
// @name		Redacted :: Shift-Click ED to Unknown Release
// @namespace	https://greasyfork.org/en/scripts/371637-redacted-shift-click-ed-to-unknown-release
// @version		1.2
// @description	Shift+Click the ED link to automagically edit the torrent to an Unknown Release.
// @author		newstarshipsmell
// @include		/https://redacted\.ch/torrents\.php\?((page=\d+&)?id=\d+(&torrentid=\d+)?(#comments)?|action=edit&id=\d+)/
// @grant		GM_getValue
// @grant		GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/371637/Redacted%20%3A%3A%20Shift-Click%20ED%20to%20Unknown%20Release.user.js
// @updateURL https://update.greasyfork.org/scripts/371637/Redacted%20%3A%3A%20Shift-Click%20ED%20to%20Unknown%20Release.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var REDsetUR = GM_getValue('REDsetUR');
	if (REDsetUR === undefined) {
		REDsetUR = false;
		GM_setValue('REDsetUR', REDsetUR);
	}

	if (/\?action=edit&id=\d+/.test(location.search)) {
		var editionCheckbox = document.getElementById('remaster');
		var unknownCheckbox = document.getElementById('unknown');

		if (REDsetUR === true) {
			if (!editionCheckbox.checked) editionCheckbox.click();
			if (!unknownCheckbox.checked) unknownCheckbox.click();
			GM_setValue('REDsetUR', false);
			document.getElementById('post').click();
		}

	} else {
		document.addEventListener('click', function(e){
			if (e.shiftKey && e.target.tagName == 'A' && e.target.innerHTML == 'ED') {
				e.preventDefault();
				GM_setValue('REDsetUR', true);
				location.assign(e.target.href);
			}
		});
	}
})();