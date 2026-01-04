// ==UserScript==
// @name         </> Kurt Mod Ölümsüzlük Parçası
// @namespace    http://tampermonkey.net/
// @version      88.4
// @description  Kurt & Java
// @author       Kurt
// @match        http://tc-mod.glitch.me/
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/426953/%3C%3E%20Kurt%20Mod%20%C3%96l%C3%BCms%C3%BCzl%C3%BCk%20Par%C3%A7as%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/426953/%3C%3E%20Kurt%20Mod%20%C3%96l%C3%BCms%C3%BCzl%C3%BCk%20Par%C3%A7as%C4%B1.meta.js
// ==/UserScript==

// Kalkan Ölümsüzlüğü
function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);
