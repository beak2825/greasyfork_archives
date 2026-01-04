// ==UserScript==
// @name         </> Kurt Mod - Yeni Can Doldurma (Oyuncu + Pet)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  !kurt
// @icon         https://cdn.discordapp.com/emojis/853002908924510240.gif?v=1
// @author       Kurt
// @match        *://zombs.io/*
// @match        http://tc-mod-js.glitch.me/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/429208/%3C%3E%20Kurt%20Mod%20-%20Yeni%20Can%20Doldurma%20%28Oyuncu%20%2B%20Pet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429208/%3C%3E%20Kurt%20Mod%20-%20Yeni%20Can%20Doldurma%20%28Oyuncu%20%2B%20Pet%29.meta.js
// ==/UserScript==

let petTokens = {
    1: 100,
    2: 100,
    3: 100,
    4: 100,
    5: 200,
    6: 200,
    7: 300,
    8: Infinity
}
let myPlayer = {};
let myPet = {};
window.petheal = true;
window.playerheal = true;
window.autoRevivePets = false; // evcil hayvanı otomatik olarak canlandırmak istiyorsanız bunu true olarak ayarlayın, istemiyorsanız false.
let petHealSet = 70;
let HealSet = 30;
game.network.addEntityUpdateHandler((data) => {
    if (data.entities[game.world.myUid]) {
        if (data.entities[game.world.myUid].uid) {
            myPlayer = game.world.entities[game.world.myUid].fromTick;
            if ((myPlayer.health/myPlayer.maxHealth) * 100 < HealSet && (myPlayer.health/myPlayer.maxHealth) * 100 > 0) {
                if (window.playerheal) {
                    if (!window.healPlayer) {
                        game.network.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1})
                        game.network.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1})
                        window.healPlayer = true;
                        setTimeout(() => {
                            window.healPlayer = false;
                        }, 300);
                    }
                }
            }
        }
    }
    if (game.ui.playerTick.petUid) {
        window.activated = true;
        if (data.entities[game.ui.playerTick.petUid]) {
            if (data.entities[game.ui.playerTick.petUid].uid) {
                myPet = game.world.entities[game.ui.playerTick.petUid].fromTick;
                if (game.world.entities[game.ui.playerTick.petUid]) {
                    let isTokenHealing = false;
                    if (myPet.model == window.model && myPet.tier == window.tier && (myPet.health/myPet.maxHealth)*100 <= 95 && (myPet.health/myPet.maxHealth)*100 > 0 && game.ui.playerTick.token >= petTokens[myPet.tier] && game.ui.playerTick.petUid) {
                        game.network.sendRpc({name: "BuyItem", itemName: myPet.model, tier: myPet.tier + 1});
                        isTokenHealing = true;
                    }
                    if (window.petheal && !isTokenHealing) {
                        if ((myPet.health/myPet.maxHealth) * 100 < petHealSet && (myPet.health/myPet.maxHealth) * 100 > 0) {
                            if (!window.healPet) {
                                game.network.sendRpc({name: "BuyItem", itemName: "PetHealthPotion", tier: 1})
                                game.network.sendRpc({name: "EquipItem", itemName: "PetHealthPotion", tier: 1})
                                window.healPet = true;
                                setTimeout(() => {
                                    window.healPet = false;
                                }, 300);
                            }
                        }
                    }
                    if (window.model !== myPet.model) window.model = myPet.model;
                    if (window.tier !== myPet.tier) window.tier = myPet.tier;
                }
            }
        }
    }
    if (window.autoRevivePets && window.activated) {
        game.network.sendRpc({name: "BuyItem", itemName: "PetRevive", tier: 1});
        game.network.sendRpc({name: "EquipItem", itemName: "PetRevive", tier: 1});
    }
    game.network.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1});
})