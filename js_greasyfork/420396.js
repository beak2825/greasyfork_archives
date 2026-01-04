// ==UserScript==
// @name         Invisible Weapon (CrossBow)
// @namespace    -
// @version      1
// @description  Press [-] for this invisible weapon! It is called crossbow and it is found in the game files
// @author       ℋℒ քǟɨքɛ
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420396/Invisible%20Weapon%20%28CrossBow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420396/Invisible%20Weapon%20%28CrossBow%29.meta.js
// ==/UserScript==
addEventListener('keydown', function(e){ // when key is pressed
    if(e.key == "-"){ // If the key being held down is '-'
Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1}); // Buys item
Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1}); // Holds item

console.log('invisable') // debuggin stuff
    }
}) // :D