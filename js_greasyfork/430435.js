// ==UserScript==
// @name         </> Kurt Mod - Kalkan Ölümsüzlüğü
// @namespace    http://tampermonkey.net/
// @version      88.8
// @description  !adminyetki
// @icon         https://cdn.discordapp.com/emojis/821847415899947008.png?v=1
// @author       Kurt
// @match        http://tc-mod.glitch.me/
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/430435/%3C%3E%20Kurt%20Mod%20-%20Kalkan%20%C3%96l%C3%BCms%C3%BCzl%C3%BC%C4%9F%C3%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/430435/%3C%3E%20Kurt%20Mod%20-%20Kalkan%20%C3%96l%C3%BCms%C3%BCzl%C3%BC%C4%9F%C3%BC.meta.js
// ==/UserScript==

// Kalkan Ölümsüzlüğü
function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);