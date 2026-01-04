// ==UserScript==
// @name         Shop Shortcut
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Fast & Convenient
// @author       vn_Havy
// @match        http://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438363/Shop%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/438363/Shop%20Shortcut.meta.js
// ==/UserScript==

document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<a id="shopshortcut1"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pickaxe-t7.svg"></a>
<a id="shopshortcut2"><img src="http://zombs.io/asset/image/ui/inventory/inventory-spear-t7.svg"></a>
<a id="shopshortcut3"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bow-t7.svg"></a>
<a id="shopshortcut4"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bomb-t7.svg"></a>
<a id="shopshortcut5"><img src="http://zombs.io/asset/image/ui/inventory/inventory-health-potion.svg"></a>
<a id="shopshortcut6"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-health-potion.svg"></a>
<a id="shopshortcut7"><img src="http://zombs.io/asset/image/ui/inventory/inventory-shield-t10.svg"></a>
<a id="shopshortcut8"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-ghost-t1.svg"></a>
<a id="shopshortcut9"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-miner-t8.svg"></a>
<a id="shopshortcut10"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-carl-t8.svg"></a>
`;

document.getElementById('shopshortcut1').addEventListener('click', buyPickaxe);
document.getElementById('shopshortcut2').addEventListener('click', buySpear);
document.getElementById('shopshortcut3').addEventListener('click', buyBow);
document.getElementById('shopshortcut4').addEventListener('click', buyBomb);
document.getElementById('shopshortcut5').addEventListener('click', () => {shopShortcut("HealthPotion", 1)});
document.getElementById('shopshortcut6').addEventListener('click', () => {shopShortcut("PetHealthPotion", 1)});
document.getElementById('shopshortcut7').addEventListener('click', buyZombieShield);
document.getElementById('shopshortcut8').addEventListener('click', () => {Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: game.ui.getPlayerPetUid()})});
document.getElementById('shopshortcut9').addEventListener('click', () => {buyPet("PetMiner", getPetTier(6))});
document.getElementById('shopshortcut10').addEventListener('click', () => {buyPet("PetCARL", getPetTier(5))});

function buyPet(item, tier) {
    if (game.ui.getPlayerPetName() == item) {
        shopShortcut("PetRevive", 1)
    } else {
        let i = 0
        let j = setInterval(function() {
            console.log(i)
            shopShortcut(item, tier)
            i++
            if (i >= 25 || game.ui.getPlayerPetName() == item) {
                i = 0
                clearInterval(j)
            }
        },250);
    }
}

function getPetTier(num) {
    if (document.querySelectorAll(".hud-shop-item-tier")[5].childNodes[0].textContent.match(/\d+/) != null) {
        let petLevel = document.querySelectorAll(".hud-shop-item-tier")[num].childNodes[0].textContent.match(/\d+/)[0]
        if (petLevel <= 8) return 1
        if (petLevel <= 16) return 2
        if (petLevel <= 24) return 3
        if (petLevel <= 32) return 4
        if (petLevel <= 48) return 5
        if (petLevel <= 64) return 6
        if (petLevel <= 96) return 7
        if (petLevel > 96) return 8
    } else return 8
}

function equipItem(item, tier) {
    game.network.sendRpc({
        name: "EquipItem",
        itemName: item,
        tier: tier
    })
};

function buyItem(item, tier) {
    game.network.sendRpc({
        name: "BuyItem",
        itemName: item,
        tier: tier
    })
}

function shopShortcut(item, tier) {
    buyItem(item, tier)
    if (game.ui.playerWeaponName !== item) {
        equipItem(item, tier)
    }
}



function buyPickaxe() {
    let gold = game.ui.playerTick.gold
    let pickaxe = game.ui.inventory.Pickaxe
    if (pickaxe.tier == 1 && gold >= 1000) {
        shopShortcut("Pickaxe", 2)
        return
    }
    if (pickaxe.tier == 2 && gold >= 3000) {
        shopShortcut("Pickaxe", 3);
        return
    }
    if (pickaxe.tier == 3 && gold >= 5000) {
        shopShortcut("Pickaxe", 4);
        return
    }
    if (pickaxe.tier == 4 && gold >= 8000) {
        shopShortcut("Pickaxe", 5);
        return
    }
    if (pickaxe.tier == 5 && gold >= 24000) {
        shopShortcut("Pickaxe", 6);
        return
    }
    if (pickaxe.tier == 6 && gold >= 90000) {
        shopShortcut("Pickaxe", 7);
        return
    } else if (game.ui.playerWeaponName !== "Pickaxe") {
        equipItem("Pickaxe", game.ui.inventory.Pickaxe.tier)
    }
}

function buySpear() {
    let gold = game.ui.playerTick.gold
    let spear = game.ui.inventory.Spear
    if (!spear && gold >= 1400) {
        shopShortcut("Spear", 1)
        return
    }
    if (spear.tier == 1 && gold >= 2800) {
        shopShortcut("Spear", 2)
        return
    }
    if (spear.tier == 2 && gold >= 5600) {
        shopShortcut("Spear", 3)
        return
    }
    if (spear.tier == 3 && gold >= 11200) {
        shopShortcut("Spear", 4)
        return
    }
    if (spear.tier == 4 && gold >= 22500) {
        shopShortcut("Spear", 5)
        return
    }
    if (spear.tier == 5 && gold >= 45000) {
        shopShortcut("Spear", 6)
        return
    }
    if (spear.tier == 6 && gold >= 90000) {
        shopShortcut("Spear", 7)
        return
    } else if (game.ui.playerWeaponName !== "Spear"){
        equipItem("Spear", game.ui.inventory.Spear.tier)
    }
}

function buyBow() {
    let gold = game.ui.playerTick.gold
    let bow = game.ui.inventory.Bow
    if (!bow && gold >= 100) {
        shopShortcut("Bow", 1)
        return
    }
    if (bow.tier == 1 && gold >= 400) {
        shopShortcut("Bow", 2)
        return
    }
    if (bow.tier == 2 && gold >= 2000) {
        shopShortcut("Bow", 3)
        return
    }
    if (bow.tier == 3 && gold >= 7000) {
        shopShortcut("Bow", 4)
        return
    }
    if (bow.tier == 4 && gold >= 24000) {
        shopShortcut("Bow", 5)
        return
    }
    if (bow.tier == 5 && gold >= 30000) {
        shopShortcut("Bow", 6)
        return
    }
    if (bow.tier == 6 && gold >= 90000) {
        shopShortcut("Bow", 7)
        return
    } else if (game.ui.playerWeaponName !== "Bow"){
        equipItem("Bow", game.ui.inventory.Bow.tier)
    }
}

function buyBomb() {
    let gold = game.ui.playerTick.gold
    let bomb = game.ui.inventory.Bomb
    if (!bomb && gold >= 100) {
        shopShortcut("Bomb", 1)
        return
    }
    if (bomb.tier == 1 && gold >= 400) {
        shopShortcut("Bomb", 2)
        return
    }
    if (bomb.tier == 2 && gold >= 3000) {
        shopShortcut("Bomb", 3)
        return
    }
    if (bomb.tier == 3 && gold >= 5000) {
        shopShortcut("Bomb", 4)
        return
    }
    if (bomb.tier == 4 && gold >= 24000) {
        shopShortcut("Bomb", 5)
        return
    }
    if (bomb.tier == 5 && gold >= 50000) {
        shopShortcut("Bomb", 6)
        return
    }
    if (bomb.tier == 6 && gold >= 90000) {
        shopShortcut("Bomb", 7)
        return
    } else if (game.ui.playerWeaponName !== "Bomb"){
        equipItem("Bomb", game.ui.inventory.Bomb.tier)
    }
}

function buyZombieShield() {
    let gold = game.ui.playerTick.gold
    let shield = game.ui.inventory.ZombieShield
    if (!shield && gold >= 1000) {
        buyItem("ZombieShield", 1)
        return
    }
    if (shield.tier == 1 && gold >= 3000) {
        buyItem("ZombieShield", 2)
        return
    }
    if (shield.tier == 2 && gold >= 7000) {
        buyItem("ZombieShield", 3)
        return
    }
    if (shield.tier == 3 && gold >= 14000) {
        buyItem("ZombieShield", 4)
        return
    }
    if (shield.tier == 4 && gold >= 18000) {
        buyItem("ZombieShield", 5)
        return
    }
    if (shield.tier == 5 && gold >= 22000) {
        buyItem("ZombieShield", 6)
        return
    }
    if (shield.tier == 6 && gold >= 24000) {
        buyItem("ZombieShield", 7)
        return
    }
    if (shield.tier == 7 && gold >= 30000) {
        buyItem("ZombieShield", 8)
        return
    }
    if (shield.tier == 8 && gold >= 45000) {
        buyItem("ZombieShield", 9)
        return
    }
    if (shield.tier == 9 && gold >= 70000) {
        buyItem("ZombieShield", 10)
        return
    }
}
