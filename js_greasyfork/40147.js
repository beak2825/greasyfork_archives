// ==UserScript==
// @name               TW Brightness Fix
// @version            0.02
// @license            LGPLv3
// @description        Fix The West April Fool's joke (2018)
// @author             hiroaki
// @match              https://*.the-west.com.br/game.php*
// @match              https://*.the-west.com.pt/game.php*
// @match              https://*.the-west.cz/game.php*
// @match              https://*.the-west.de/game.php*
// @match              https://*.the-west.dk/game.php*
// @match              https://*.the-west.es/game.php*
// @match              https://*.the-west.fr/game.php*
// @match              https://*.the-west.gr/game.php*
// @match              https://*.the-west.hu/game.php*
// @match              https://*.the-west.it/game.php*
// @match              https://*.the-west.net/game.php*
// @match              https://*.the-west.nl/game.php*
// @match              https://*.the-west.org/game.php*
// @match              https://*.the-west.pl/game.php*
// @match              https://*.the-west.ro/game.php*
// @match              https://*.the-west.ru/game.php*
// @match              https://*.the-west.se/game.php*
// @match              https://*.the-west.sk/game.php*
// @grant              none
// @namespace          https://greasyfork.org/users/3197
// @icon               https://cdn.rawgit.com/TWFriends/scripts/master/lights.png
// @downloadURL https://update.greasyfork.org/scripts/40147/TW%20Brightness%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/40147/TW%20Brightness%20Fix.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	$("#map").css({ "filter": "brightness(100%)", "-webkit-filter": "brightness(100%)" });
});