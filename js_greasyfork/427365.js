// ==UserScript==
// @name         Invincibility Shield
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Never die again
// @author       Vengeance
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427365/Invincibility%20Shield.user.js
// @updateURL https://update.greasyfork.org/scripts/427365/Invincibility%20Shield.meta.js
// ==/UserScript==UUUUPP
function FixHealth() {
        if (Game.currentGame.ui.playerTick.Health < 85000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "Health", tier:  Game.currentGame.ui.inventory.Health.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixHealth);