// ==UserScript==
// @name         MOOMOO.io BASIC HAT MACRO 2.0
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Use this mod to switch hats with the press of a key
// @author       II
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io/*
// @match                 *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525793/MOOMOOio%20BASIC%20HAT%20MACRO%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/525793/MOOMOOio%20BASIC%20HAT%20MACRO%2020.meta.js
// ==/UserScript==
 
// Function to get hats, weapons, or accessories
function hats() {
    return [
        {
            id: 45,
            name: "Shame!",
            dontSell: true,
            price: 0,
            scale: 120,
            desc: "hacks are for losers",
        },
        {
            id: 51,
            name: "Moo Cap",
            price: 0,
            scale: 120,
            desc: "coolest mooer around",
        },
        {
            id: 50,
            name: "Apple Cap",
            price: 0,
            scale: 120,
            desc: "apple farms remembers",
        },
        {
            id: 28,
            name: "Moo Head",
            price: 0,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 29,
            name: "Pig Head",
            price: 0,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 30,
            name: "Fluff Head",
            price: 0,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 36,
            name: "Pandou Head",
            price: 0,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 37,
            name: "Bear Head",
            price: 0,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 38,
            name: "Monkey Head",
            price: 0,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 44,
            name: "Polar Head",
            price: 0,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 35,
            name: "Fez Hat",
            price: 0,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 42,
            name: "Enigma Hat",
            price: 0,
            scale: 120,
            desc: "join the enigma army",
        },
        {
            id: 43,
            name: "Blitz Hat",
            price: 0,
            scale: 120,
            desc: "hey everybody i'm blitz",
        },
        {
            id: 49,
            name: "Bob XIII Hat",
            price: 0,
            scale: 120,
            desc: "like and subscribe",
        },
        {
            id: 57,
            name: "Pumpkin",
            price: 50,
            scale: 120,
            desc: "Spooooky",
        },
        {
            id: 8,
            name: "Bummle Hat",
            price: 100,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 2,
            name: "Straw Hat",
            price: 500,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 15,
            name: "Winter Cap",
            price: 600,
            scale: 120,
            desc: "allows you to move at normal speed in snow",
            coldM: 1,
        },
        {
            id: 5,
            name: "Cowboy Hat",
            price: 1000,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 4,
            name: "Ranger Hat",
            price: 2000,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 18,
            name: "Explorer Hat",
            price: 2000,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 31,
            name: "Flipper Hat",
            price: 2500,
            scale: 120,
            desc: "have more control while in water",
            watrImm: true,
        },
        {
            id: 1,
            name: "Marksman Cap",
            price: 3000,
            scale: 120,
            desc: "increases arrow speed and range",
            aMlt: 1.3,
        },
        {
            id: 10,
            name: "Bush Gear",
            price: 3000,
            scale: 160,
            desc: "allows you to disguise yourself as a bush",
        },
        {
            id: 48,
            name: "Halo",
            price: 3000,
            scale: 120,
            desc: "no effect",
        },
        {
            id: 6,
            name: "Soldier Helmet",
            price: 4000,
            scale: 120,
            desc: "reduces damage taken but slows movement",
            spdMult: 0.94,
            dmgMult: 0.75,
        },
        {
            id: 23,
            name: "Anti Venom Gear",
            price: 4000,
            scale: 120,
            desc: "makes you immune to poison",
            poisonRes: 1,
        },
        {
            id: 13,
            name: "Medic Gear",
            price: 5000,
            scale: 110,
            desc: "slowly regenerates health over time",
            healthRegen: 3,
        },
        {
            id: 9,
            name: "Miners Helmet",
            price: 5000,
            scale: 120,
            desc: "earn 1 extra gold per resource",
            extraGold: 1,
        },
        {
            id: 32,
            name: "Musketeer Hat",
            price: 5000,
            scale: 120,
            desc: "reduces cost of projectiles",
            projCost: 0.5,
        },
        {
            id: 7,
            name: "Bull Helmet",
            price: 6000,
            scale: 120,
            desc: "increases damage done but drains health",
            healthRegen: -5,
            dmgMultO: 1.5,
            spdMult: 0.96,
        },
        {
            id: 22,
            name: "Emp Helmet",
            price: 6000,
            scale: 120,
            desc: "turrets won't attack but you move slower",
            antiTurret: 1,
            spdMult: 0.7,
        },
        {
            id: 12,
            name: "Booster Hat",
            price: 6000,
            scale: 120,
            desc: "increases your movement speed",
            spdMult: 1.16,
        },
        {
            id: 26,
            name: "Barbarian Armor",
            price: 8000,
            scale: 120,
            desc: "knocks back enemies that attack you",
            dmgK: 0.6,
        },
        {
            id: 21,
            name: "Plague Mask",
            price: 10000,
            scale: 120,
            desc: "melee attacks deal poison damage",
            poisonDmg: 5,
            poisonTime: 6,
        },
        {
            id: 46,
            name: "Bull Mask",
            price: 10000,
            scale: 120,
            desc: "bulls won't target you unless you attack them",
            bullRepel: 1,
        },
        {
            id: 14,
            name: "Windmill Hat",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "generates points while worn",
            pps: 1.5,
        },
        {
            id: 11,
            name: "Spike Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "deal damage to players that damage you",
            dmg: 0.45,
        },
        {
            id: 53,
            name: "Turret Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "you become a walking turret",
            turret: {
                proj: 1,
                range: 700,
                rate: 2500,
            },
            spdMult: 0.7,
        },
        {
            id: 20,
            name: "Samurai Armor",
            price: 12000,
            scale: 120,
            desc: "increased attack speed and fire rate",
            atkSpd: 0.78,
        },
        {
            id: 58,
            name: "Dark Knight",
            price: 12000,
            scale: 120,
            desc: "restores health when you deal damage",
            healD: 0.4,
        },
        {
            id: 27,
            name: "Scavenger Gear",
            price: 15000,
            scale: 120,
            desc: "earn double points for each kill",
            kScrM: 2,
        },
        {
            id: 40,
            name: "Tank Gear",
            price: 15000,
            scale: 120,
            desc: "increased damage to buildings but slower movement",
            spdMult: 0.3,
            bDmg: 3.3,
        },
        {
            id: 52,
            name: "Thief Gear",
            price: 15000,
            scale: 120,
            desc: "steal half of a player's gold when you kill them",
            goldSteal: 0.5,
        },
        {
            id: 55,
            name: "Bloodthirster",
            price: 20000,
            scale: 120,
            desc: "Restore Health when dealing damage. And increased damage",
            healD: 0.25,
            dmgMultO: 1.2,
        },
        {
            id: 56,
            name: "Assassin Gear",
            price: 20000,
            scale: 120,
            desc: "Go invisible when not moving. Can't eat. Increased speed",
            noEat: true,
            spdMult: 1.1,
            invisTimer: 1000,
        }
    ];
}

// Hat images for customization
var newHatImgs = {
    7: "https://i.imgur.com/vAOzlyY.png",
    15: "https://i.imgur.com/YRQ8Ybq.png",
    11: "https://i.imgur.com/yfqME8H.png",
    12: "https://i.imgur.com/VSUId2s.png",
    40: "https://i.imgur.com/Xzmg27N.png",
    26: "https://i.imgur.com/I0xGtyZ.png",
    6: "https://i.imgur.com/vM9Ri8g.png",
};

// Weapon images for customization
var newWeaponImgs = {
    "samurai_1": "https://i.imgur.com/mbDE77n.png",
    "samurai_1_g": "https://cdn.discordapp.com/attachments/967213871267971072/1030852038948552724/image.png",
    "great_hammer_1": "https://cdn.discordapp.com/attachments/748171769155944448/1048806049924259860/image.png",
    "great_hammer_1_g": "https://cdn.discordapp.com/attachments/748171769155944448/1048806467995713607/image_1.png",
    "great_hammer_1_d": "https://cdn.discordapp.com/attachments/748171769155944448/1048806745910292571/image_2.png",
    "dagger_1": "https://cdn.discordapp.com/attachments/748171769155944448/1048808212129927288/image.png",
    "dagger_1_g": "https://cdn.discordapp.com/attachments/748171769155944448/1048808419932504074/image_1.png",
    "hammer_1": "https://cdn.discordapp.com/attachments/748171769155944448/1048809420806692894/image.png",
    "hammer_1_g": "https://cdn.discordapp.com/attachments/748171769155944448/1048809420437602394/image_1.png",
    "spear_1": "https://cdn.discordapp.com/attachments/748171769155944448/1048810908564066324/image_2.png",
    "spear_1_g": "https://cdn.discordapp.com/attachments/748171769155944448/1048810908207558787/image_3.png",
};

// Function to set skin texture image based on index and type (hat/weapon/accessory)
function setSkinTextureImage(id, type, id2) {
    if (true) {
        if (newHatImgs[id] && type === "hat") {
            return newHatImgs[id];
        } else if (newWeaponImgs[id] && type === "weapons") {
            return newWeaponImgs[id];
        } else {
            return ".././img/" + type + "/" + type + "_" + id + ".png";
        }
    } else {
        return ".././img/" + type + "/" + type + "_" + id + ".png";
    }
}

// Function to render the skin based on the provided index and context
function renderSkin(index, ctxt, parentSkin, owner) {
    let tmpSkin = skinSprites[index];
    if (!tmpSkin) {
        let tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = setSkinTextureImage(index, "hat", index);
        skinSprites[index] = tmpImage;
    }
}
