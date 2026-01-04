// ==UserScript==
// @name         IsraBox :: Hide Old Releases
// @namespace    https://greasyfork.org/en/scripts/395670-israbox-hide-old-releases
// @version      1.0
// @description  Hides releases on the browse page which are older than the specified year.
// @author       newstarshipsmell
// @include      /https://(www\.)?(israbox|isrbx)\.(site|com|net)/([a-z]+/){1,2}(page/\d+/)?/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/395670/IsraBox%20%3A%3A%20Hide%20Old%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/395670/IsraBox%20%3A%3A%20Hide%20Old%20Releases.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var hideBefore = GM_getValue('IsraBoxHideOldReleasesYear', new Date().getFullYear());

	var searchDiv = document.querySelector('div.search');
	var filtSpn = document.createElement('span');
	filtSpn.style.float = 'right';
	filtSpn.title = 'All releases dated earlier than the specified year will be hidden.';
	var filtTxt = document.createElement('input');
	filtTxt.type = 'text';
	filtTxt.size = 4;
	filtTxt.title = filtSpn.title;
	filtTxt.value = hideBefore;

	searchDiv.appendChild(document.createElement('br'));
	searchDiv.appendChild(filtSpn);
	filtSpn.appendChild(document.createTextNode('Exclude releases before: '));
	filtSpn.appendChild(filtTxt);

	function hideReleases(y) {
		var relEvts = document.querySelectorAll('span[itemprop="releasedEvent"]');

		for (var i = 0, len = relEvts.length; i < len; i++) {
			relEvts[i].parentNode.parentNode.parentNode.style.display = (y == '' || parseInt(relEvts[i].textContent) >= y) ? '' : 'none';
		}
	}

	if (hideBefore) hideReleases(hideBefore);

	filtTxt.addEventListener('change', function(e){
		hideBefore = filtTxt.value == '' ? '' : (isNaN(parseInt(filtTxt.value)) ? hideBefore : parseInt(filtTxt.value));
		filtTxt.value = hideBefore;
		GM_setValue('IsraBoxHideOldReleasesYear', hideBefore);
		hideReleases(hideBefore);
	});
})();