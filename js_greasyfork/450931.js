// ==UserScript==
// @name         Roblox Get Universe Id
// @namespace    http://roblox.com/
// @license MIT
// @version      0.1
// @description  Get the universe id of each game, showen next to "Report Abuse"
// @author       OfirApps
// @match        https://www.roblox.com/games/*
// @match        https://web.roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450931/Roblox%20Get%20Universe%20Id.user.js
// @updateURL https://update.greasyfork.org/scripts/450931/Roblox%20Get%20Universe%20Id.meta.js
// ==/UserScript==

/*(function() {
    'use strict';

    // Your code here...
})()*/
//window.open("https://api.roblox.com/universes/get-universe-containing-place?placeId="+window.location.href.split("/")[4])
window.getUniverseIdFunction = function () {
window.open("https://api.roblox.com/universes/get-universe-containing-place?placeId="+window.location.href.split("/")[4])

}
document.querySelector("#game-detail-page > div.col-xs-12.btr-game-main-container.section-content > div.remove-panel.btr-description > div.game-stat-footer").innerHTML+='<span class="game-report-abuse" style="margin-right: 10px;"><a class="text-report abuse-report-modal" href="javascript:getUniverseIdFunction()" style="color: #22d222;">Get universe ID</a></span>'
