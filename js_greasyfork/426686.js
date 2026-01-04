// ==UserScript==
// @name         AFS (AUTO FIX SHIELD)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto fix Zombie Shield Health
// @author       deathrain
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426686/AFS%20%28AUTO%20FIX%20SHIELD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426686/AFS%20%28AUTO%20FIX%20SHIELD%29.meta.js
// ==/UserScript==UUUPP
function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);