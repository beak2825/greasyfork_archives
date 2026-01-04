// ==UserScript==
// @name         Neopets: Auto Treasure Map
// @namespace    *://tampermonkey.net/
// @version      0.1
// @description  The Simple Path to Wealth.
// @author       Fuzzy
// @match        *://www.neopets.com/games/treasure.phtml*
// @match        *://www.neopets.com/games/claim_treasure.phtml*
// @downloadURL https://update.greasyfork.org/scripts/453373/Neopets%3A%20Auto%20Treasure%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/453373/Neopets%3A%20Auto%20Treasure%20Map.meta.js
// ==/UserScript==


// Set min and max to wait between clicks.
var minToWait=100;//100 = 0.1 second
var maxToWait=250;//5000 = 5 seconds
var wait=Math.floor(Math.random() * (maxToWait - minToWait + 1)) + minToWait; //This will generate a random number between min and max

if(document.URL.indexOf("treasure.phtml") != -1) {
	setTimeout(function(){ $("[value='Find the Treasure!']").click();},wait);
}

if(document.URL.indexOf("claim_treasure.phtml") != -1) {
{location.href = 'http://www.neopets.com/games/treasure.phtml';}
}