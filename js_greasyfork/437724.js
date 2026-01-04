// ==UserScript==
// @name         Auto Heal & Revive Pets
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto heal, revive and evolve pet
// @author       Havy
// @match        http://zombs.io
// @downloadURL https://update.greasyfork.org/scripts/437724/Auto%20Heal%20%20Revive%20Pets.user.js
// @updateURL https://update.greasyfork.org/scripts/437724/Auto%20Heal%20%20Revive%20Pets.meta.js
// ==/UserScript==

// Auto heal player
Game.currentGame.ui._events.playerTickUpdate.push(({health, maxHealth}) => {
    if ((health < (maxHealth/2)) && (health > 0)) {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "HealthPotion",
            "tier": 1
        })
        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "HealthPotion",
            "tier": 1
        })
    }
})

// Auto heal and revive pet
Game.currentGame.ui._events.playerPetTickUpdate.push(({health, maxHealth}) => {
    if ((health < (maxHealth/2)) && (health > 0)) {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "PetHealthPotion",
            "tier": 1
        })
        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "PetHealthPotion",
            "tier": 1
        })
    }
    if (health <= 0) {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "PetRevive",
            "tier": 1
        })
        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "PetRevive",
            "tier": 1
        })
    }
})

// Auto evolve pet and revive pet if the about code fail
setInterval(() => {document.querySelectorAll('.hud-shop-actions-evolve, .hud-shop-actions-revive').forEach(el => el.click())},250) //<- delay 250ms
