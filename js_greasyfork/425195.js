// ==UserScript==
// @name		Geoguessr Cheat
// @namespace		https://www.leonbrandt.com
// @version		2.0.0
// @description		Press SHIFT + ALT + G and the location of your current geoguessr game will open in a new tab
// @author		Leon Brandt
// @homepage		https://www.leonbrandt.com
// @match		http*://*/*
// @grant		none
// @run-at		document-idle
// @downloadURL https://update.greasyfork.org/scripts/425195/Geoguessr%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/425195/Geoguessr%20Cheat.meta.js
// ==/UserScript==

/*
	MAKE SURE TO RELOAD PAGE AFTER EVERY ROUND BEFORE PRESSING SHIFT + ALT + G
*/

function getTargetUrl() {
	const raw = document.querySelectorAll("#__NEXT_DATA__")[0].text;
	const json = JSON.parse(raw);
	const rounds = json.props.pageProps.game.rounds;
	const currentRound = rounds[rounds.length - 1];

	const targetUrl = "https://google.com/maps/place/" + currentRound.lat + "," + currentRound.lng;

	return targetUrl;
}

(function() {
	'use strict';

	document.onkeydown = evt => {
		evt = evt || window.event;
		if(evt.shiftKey && evt.altKey && evt.keyCode == 71){
			window.open(getTargetUrl(), '_blank');
		}
	};
})();