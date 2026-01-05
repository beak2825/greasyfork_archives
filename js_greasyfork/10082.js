// ==UserScript==
// @name        Neopets Flash Game Auto-Low Quality
// @namespace   Jarofgrease.captainmaxthecat.com
// @description Automatically sets the quality for flash games to low in the settings
// @author 	Demeiz
// @email 	admin@captainmaxthecat.com
// @homepage	http://www.captainmaxthecat.com
// @version	1.2
// @language	en
// @include     *neopets.com/games/game.phtml?game_id=*
// @exclude     *neopets.com/games/game.phtml?game_id=*&size=regular&quality=low&play=true
// @require	http://code.jquery.com/jquery-latest.min.js
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/10082/Neopets%20Flash%20Game%20Auto-Low%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/10082/Neopets%20Flash%20Game%20Auto-Low%20Quality.meta.js
// ==/UserScript==

// set the hidden game quality value as low
$("input:hidden#sel_qual_dd").val("low");
// current issue with this method is that the menu is no longer accessible.