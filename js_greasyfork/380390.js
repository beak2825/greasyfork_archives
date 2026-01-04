// ==UserScript==
// @name         Redacted :: Artist Search Link on Advanced Search
// @namespace    https://greasyfork.org/en/scripts/380390-redacted-artist-search-link-on-advanced-search
// @version      1.0
// @description  Adds a bracketed "Artist search" link next to the Artist name input field on Advanced Search, which will open an artist search.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/torrents\.php\?.*artistname=.+/
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/380390/Redacted%20%3A%3A%20Artist%20Search%20Link%20on%20Advanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/380390/Redacted%20%3A%3A%20Artist%20Search%20Link%20on%20Advanced%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var openInSameTab = false;
	var openNewTabInBackground = true;

    var artistInput = document.querySelector('input[name="artistname"].inputtext');
	var searchLink = document.createElement('a');

	searchLink.href = 'javascript:void(0);';
	searchLink.classList.add('brackets');
	searchLink.title = 'Click to open an Artist search for "' + artistInput.value + '" in ' +
		(openInSameTab ? 'the current' : 'a new' + (openNewTabInBackground ? ' background' : '')) + ' tab';
	searchLink.appendChild(document.createTextNode('Artist search'));

	artistInput.parentNode.appendChild(document.createTextNode(' '));
	artistInput.parentNode.appendChild(searchLink);

	searchLink.addEventListener('click', function(e){
		var artistSearch = 'https://redacted.ch/artist.php?artistname=' + encodeURIComponent(artistInput.value);
		if (openInSameTab) {
			location.assign(artistSearch);
		} else {
			GM_openInTab(artistSearch, openNewTabInBackground);
		}
	});
})();