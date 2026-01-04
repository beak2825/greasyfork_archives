// ==UserScript==
// @name         Steam Game Title GGn Links
// @namespace    https://greasyfork.org/en/scripts/372963-steam-game-title-ggn-links
// @version      1.0
// @description  Links the Game Title on the Steam Store page to a GGn search - torrent search for released games, requests search for unreleased games; shift+click to toggle.
// @author       newstarshipsmell
// @include      /https://store\.steampowered\.com/app/\d+/(.+/)?/
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/372963/Steam%20Game%20Title%20GGn%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/372963/Steam%20Game%20Title%20GGn%20Links.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var gameTitle = document.querySelector('div.apphub_AppName');
	var gameTitleText = gameTitle.firstChild;
	var titleOfGame = encodeURIComponent(gameTitleText.textContent).replace(/%20/g, '+');
	var torrentSearch = 'https://gazellegames.net/torrents.php?groupname=' + titleOfGame;
	var requestSearch = 'https://gazellegames.net/requests.php?search=' + titleOfGame;
	var released = document.querySelectorAll('div.game_area_comingsoon').length > 0 ? false : true;
	var searchLink = document.createElement('a');
	searchLink.href = released ? torrentSearch : requestSearch;
	searchLink.target = '_blank';
	searchLink.appendChild(gameTitleText);
	gameTitle.appendChild(searchLink);
	searchLink.addEventListener('click', function(e) {
		if (e.shiftKey) {
			e.preventDefault();
			GM_openInTab((released ? requestSearch : torrentSearch), false);
		}
	});
})();