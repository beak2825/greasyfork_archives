// ==UserScript==
// @name         Ogame search galaxy for empty solar systems
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Will search every solar system and console log any empty coordinates
// @author       You
// @match        https://*.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467017/Ogame%20search%20galaxy%20for%20empty%20solar%20systems.user.js
// @updateURL https://update.greasyfork.org/scripts/467017/Ogame%20search%20galaxy%20for%20empty%20solar%20systems.meta.js
// ==/UserScript==
var searchGalaxies;

var analyzeGalaxy = function() {
	var currentG = +document.getElementById('galaxy_input').value;
	var currentSS = +document.getElementById('system_input').value;
	if (currentSS == 499) {
		// Arrived at the last solar system of the last galaxy
		if (currentG == 6) {
			console.log('Search has ended');
			clearInterval(searchGalaxies);
			return false;
		}
		// Going Up Galaxy
		submitOnKey('ArrowUp');
	}
	submitOnKey('ArrowRight');
	var planetCount = document.querySelectorAll('.galaxyRow.empty_filter').length;
	if (planetCount == 15) {
		console.log('Empty Solar System found => ' + currentG + ':' + currentSS);
	}
}

var startSearching = function() {
	console.log('Starting search of empty Solar System');
	searchGalaxies = setInterval(analyzeGalaxy, 500);
}

startSearching();
