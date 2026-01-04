// ==UserScript==
// @name         Redacted :: Shift/Ctrl-Click Artists to Search on Deezer/Tidal/Bandcamp
// @namespace    https://greasyfork.org/en/scripts/376241-redacted-shift-ctrl-click-artists-to-search-on-deezer-tidal-bandcamp
// @version      1.0
// @description  Hold Shift and/or Ctrl while clicking artist links to search them on Deezer/Tidal/Bandcamp (Shift: Deezer; Ctrl: Tidal; Shift+Ctrl: Bandcamp)
// @author       newstarshipsmell
// @match        https://redacted.ch/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/376241/Redacted%20%3A%3A%20ShiftCtrl-Click%20Artists%20to%20Search%20on%20DeezerTidalBandcamp.user.js
// @updateURL https://update.greasyfork.org/scripts/376241/Redacted%20%3A%3A%20ShiftCtrl-Click%20Artists%20to%20Search%20on%20DeezerTidalBandcamp.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var artistLinks = document.querySelectorAll('a[href^="artist.php?"');
	for (var i = 0, len = artistLinks.length; i < len; i++) {
		artistLinks[i].addEventListener('click', function(e){
			if (e.shiftKey || e.ctrlKey) e.preventDefault();
			var url = e.shiftKey ? (e.ctrlKey ? "http://bandcamp.com/search?q=ARTISTNAME" : "http://www.deezer.com/search/ARTISTNAME/artist") :
			"https://listen.tidal.com/search/artists?q=ARTISTNAME";
			var artist = encodeURIComponent(this.textContent).replace(/%2F/g, (e.shiftKey && !e.ctrlKey) ? "%20" : "%2F");
			GM_openInTab(url.replace("ARTISTNAME", artist), true);
		});
	}
})();