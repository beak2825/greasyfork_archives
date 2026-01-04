// ==UserScript==
// @name               TW Messages Centered
// @version            0.02
// @license            LGPLv3
// @description        The West Messages Window centered
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
// @icon               https://cdn.rawgit.com/TWFriends/scripts/master/messages.png
// @downloadURL https://update.greasyfork.org/scripts/372150/TW%20Messages%20Centered.user.js
// @updateURL https://update.greasyfork.org/scripts/372150/TW%20Messages%20Centered.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
	var VERSION = 0.02;
	var URL_INSTALL = "https://greasyfork.org/scripts/372150-tw-messages-centered";
	var DESCRIPTION = "Open Messages Window centered";
	var scriptAuthor = "hiroaki";
	var scriptName = "TW Messages";
	var scriptObject = "HiroMessages";
	$(function() { 
		var api = TheWestApi.register(scriptObject, scriptName, '2.04', Game.version.toString(), scriptAuthor, URL_INSTALL);
		api.setGui(DESCRIPTION);
		var cdnBase = Game.cdnURL || "https://westzz.innogamescdn.com";
		var divHiroMessages = $("<div />", { style: "position: absolute; top: 0px; right: 0px; z-index: 18; width: 52px; height: 52px;" }).appendTo("#ui_bottombar .ui_bottombar_wrapper .button:nth-child(6) .dock-image").click(function(){ WestUi.BottomBar.links[5].click(); MessagesWindow.window.center(); return false; });
	});
});