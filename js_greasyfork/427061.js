// ==UserScript==
// @name         Auto-buy Spear for raiding in ZOMBS.IO!
// @namespace    raiding but much more ez
// @version      1
// @description  Press [#] to auto buy spear
// @author       Vengeance & REMZAS个
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427061/Auto-buy%20Spear%20for%20raiding%20in%20ZOMBSIO%21.user.js
// @updateURL https://update.greasyfork.org/scripts/427061/Auto-buy%20Spear%20for%20raiding%20in%20ZOMBSIO%21.meta.js
// ==/UserScript==
addEventListener('keydown', function(e){ // when key is pressed
    if(e.key == "#"){ // If the key being held down is '#'
Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Spear", tier: 1}); // Buys item
Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Spear", tier: 1}); // Holds item
    }
}) // : D