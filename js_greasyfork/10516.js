// ==UserScript==
// @name        Hide Game Ads
// @namespace   https://greasyfork.org/en/scripts/10516-hide-game-ads
// @description Hide ads that are not yet added by ADBLOCK
// @author      euverve/thatskie
// @include     http://www.y9com.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10516/Hide%20Game%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/10516/Hide%20Game%20Ads.meta.js
// ==/UserScript==

var adsGames = document.getElementById("adsGames");
if (adsGames) {
   adsGames.parentNode.removeChild(adsGames);
}

var preload = document.getElementById("preload-ads");
if (preload) {
   preload.parentNode.removeChild(preload);
}

var mostGames = document.getElementById("mostGames");
if (mostGames) {
   mostGames.parentNode.removeChild(mostGames);
}
