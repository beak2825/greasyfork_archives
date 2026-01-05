// ==UserScript==
// @name         Treasure Hunt
// @name:ru      Охота на сокровища
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @description:ru try to take over the world!
// @author       IvanKalyada
// @match        http://www.coingamers.co/treasure-game/
// @match        http://www.coingamers.co/treasure-island-game/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18541/Treasure%20Hunt.user.js
// @updateURL https://update.greasyfork.org/scripts/18541/Treasure%20Hunt.meta.js
// ==/UserScript==
/* jshint -W097 */

function randomInt(xmin,xmax) { return Math.floor( Math.random() * (xmax + 1 - xmin) + xmin ); }
if (window.location.href == "http://www.coingamers.co/treasure-game/") {
    var random = randomInt(0, 15);
    setTimeout(function(){ document.getElementsByClassName('entry-content')[0].getElementsByTagName('a')[random].click(); }, 7000);
}
if (window.location.href == "http://www.coingamers.co/treasure-island-game/") {
    setTimeout(function(){window.location = 'http://www.coingamers.co/treasure-game/'}, 7000);
}