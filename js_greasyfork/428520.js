// ==UserScript==
// @name         </> Apo & Java Otomatik Pet Can Doldurucu
// @namespace    http://tampermonkey.net/
// @version      28.1
// @description  ApoReisScripts
// @author       ApoReis
// @match        http://zombs.io/
// @match        http://yeni-tc-mod.glitch.me/
// @grant        ApoReis
// @downloadURL https://update.greasyfork.org/scripts/428520/%3C%3E%20Apo%20%20Java%20Otomatik%20Pet%20Can%20Doldurucu.user.js
// @updateURL https://update.greasyfork.org/scripts/428520/%3C%3E%20Apo%20%20Java%20Otomatik%20Pet%20Can%20Doldurucu.meta.js
// ==/UserScript==
Game.currentGame.ui._events.playerPetTickUpdate.push(({ health, maxHealth }) => {
    if(health < maxHealth - Math.sqrt(maxHealth)) {
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
})
/**aporeis**/