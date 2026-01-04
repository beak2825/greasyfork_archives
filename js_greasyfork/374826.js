// ==UserScript==
// @name        SLIPPA BLI SÅRAD AV ATT SIXTEN TYCKER SAKER
// @namespace   https://happyride.se/*
// @include     https://happyride.se/*
// @version     1
// @grant       none
// @description Skapar bättre stämning på Happyride
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374826/SLIPPA%20BLI%20S%C3%85RAD%20AV%20ATT%20SIXTEN%20TYCKER%20SAKER.user.js
// @updateURL https://update.greasyfork.org/scripts/374826/SLIPPA%20BLI%20S%C3%85RAD%20AV%20ATT%20SIXTEN%20TYCKER%20SAKER.meta.js
// ==/UserScript==

slippaBliSaaradAvAttSixtenTyckerSaker();

function slippaBliSaaradAvAttSixtenTyckerSaker() {
	$('a.author[href="https://happyride.se/forum/profile.php/1/34297"]').closest('li.forum-post').find('div.buttons-group').prev().before('<br><br>...tycker jag.');
}