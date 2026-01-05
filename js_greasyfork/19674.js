// ==UserScript==
// @name         MyAnimeList(MAL) - Remove all watch video/pv icons
// @version      1.0.5
// @description  This script will remove any watch icon on myanimelist
// @author       Cpt_mathix
// @license      GPL-2.0-or-later
// @match        *://myanimelist.net/*
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/19674/MyAnimeList%28MAL%29%20-%20Remove%20all%20watch%20videopv%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/19674/MyAnimeList%28MAL%29%20-%20Remove%20all%20watch%20videopv%20icons.meta.js
// ==/UserScript==

(function() {
	var icons = document.querySelectorAll(".icon-watch, .icon-watch2, .icon-watch-pv, .icon-watch-pv2, .prodsrc > .video > a");
	for (var i = icons.length - 1; i >= 0; i--) {
		var icon = icons[i];
		icon.parentNode.removeChild(icon);
	}
})();