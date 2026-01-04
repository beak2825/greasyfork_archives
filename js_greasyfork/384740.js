// ==UserScript==
// @name         zombs.io Sell Stash |DL|
// @namespace    http://tampermonkey.net/

// @version      1
// @description  Press the button to sell the stash.
// @author       Apex
// @match        ://zombs.io/

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384740/zombsio%20Sell%20Stash%20%7CDL%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/384740/zombsio%20Sell%20Stash%20%7CDL%7C.meta.js
// ==/UserScript==

window.SellStash = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
var Settings = '';
Settings += "<button class=\"btn btn-green\" style=\"width: 100%;\" onclick=\"SellStash();\">Sell Stash!</button>";
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = Settings;
