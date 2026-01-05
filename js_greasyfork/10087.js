// ==UserScript==
// @name        Neopets Auto Snowfaerie
// @namespace   Jarofgrease.captainmaxthecat.com
// @description Auto Navigate while using snowfaerie
// @author 		Demeiz
// @email       admin@captainmaxthecat.com
// @license     GNU GPL
// @homepage    http://jarofgrease.captainmaxthecat.com
// @version     1.0
// @language    en
// @include     *neopets.com/winter/snowfaerie*
// @require  	http://code.jquery.com/jquery-latest.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10087/Neopets%20Auto%20Snowfaerie.user.js
// @updateURL https://update.greasyfork.org/scripts/10087/Neopets%20Auto%20Snowfaerie.meta.js
// ==/UserScript==

// go to an easier to use page after accept
// also goes to the page where we can accept quests after a quest is completed
if (window.location.href == "http://www.neopets.com/winter/snowfaerie2.phtml")
{
	window.location.assign("http://www.neopets.com/winter/snowfaerie.phtml")
}

// auto accept the quest
if (window.location.href == "http://www.neopets.com/winter/snowfaerie.phtml"){
$("input[value='I will help you!']").click();
}