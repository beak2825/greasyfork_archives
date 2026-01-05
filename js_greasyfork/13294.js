// ==UserScript==
// @name        Pardus Necrophobia Revived
// @namespace   leaumar
// @description Returns you to the Nav after killing a monster.
// @include     https://*.pardus.at/ship2opponent_combat.php?opponentid=*
// @version     3
// @icon        https://icons.duckduckgo.com/ip2/pardus.at.ico
// @grant       none
// @license     MPL-2.0
// @author      leaumar@sent.com
// @downloadURL https://update.greasyfork.org/scripts/13294/Pardus%20Necrophobia%20Revived.user.js
// @updateURL https://update.greasyfork.org/scripts/13294/Pardus%20Necrophobia%20Revived.meta.js
// ==/UserScript==

const deathTextNode = document.querySelector("body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > table:nth-child(13) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > b:nth-child(5)");
if (deathTextNode != null && deathTextNode.textContent === "D E A D") {
	location.replace("/main.php");
}
