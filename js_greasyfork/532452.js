// ==UserScript==
// @name         AntiMooAddict
// @description  like moomoo.i ?
// @version      Alpha
// @author       cah blX
// @match        *://sploop.io/*
// @run-at       document-start
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant        none
// @namespace https://greasyfork.org/users/1456327
// @downloadURL https://update.greasyfork.org/scripts/532452/AntiMooAddict.user.js
// @updateURL https://update.greasyfork.org/scripts/532452/AntiMooAddict.meta.js
// ==/UserScript==

/*
  Author: cah blX
  Discord: cahblx.rsc
  Description: my bundle.js
  Version: Alpha
*/

window.layerData = {};
window.hatsData = {};
window.itemData = {};
window.AntiMooAddict = {};

Function("(" + ((GM_info) => {
    "use strict";
    var __webpack_modules__ = {
        147: module => {
            module.exports = {
                i8: "1.0.21"
            };
        }
    };
    var __webpack_module_cache__ = {};

    function __webpack_require__(moduleId) {
            var cachedModule = __webpack_module_cache__[moduleId];
            if (cachedModule !== undefined) {
                return cachedModule.exports;
            }
            var module = __webpack_module_cache__[moduleId] = {
                exports: {}
            };
            __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
            return module.exports;
        }
        (() => {
            __webpack_require__.d = (exports, definition) => {
                for (var key in definition) {
                    if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                        Object.defineProperty(exports, key, {
                            enumerable: true,
                            get: definition[key]
                        });
                    }
                }
            };
        })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    var __webpack_exports__ = {};
    (() => {
        __webpack_require__.d(__webpack_exports__, {
            sv: () => AntiMooAddict,
            lZ: () => pingCount,
        });
        var ELayer;
        (function(ELayer) {
            ELayer[ELayer.PLAYER = 0] = "PLAYER";
            ELayer[ELayer.STONE = 1] = "STONE";
            ELayer[ELayer.HARDSPIKE = 2] = "HARDSPIKE";
            ELayer[ELayer.TREE = 3] = "TREE";
            ELayer[ELayer.GOLD = 4] = "GOLD";
            ELayer[ELayer.BUSH = 5] = "BUSH";
            ELayer[ELayer.TRAP = 6] = "TRAP";
            ELayer[ELayer.SPIKE = 7] = "SPIKE";
            ELayer[ELayer.WOODWALL = 8] = "WOODWALL";
            ELayer[ELayer.PLATFORM = 9] = "PLATFORM";
            ELayer[ELayer.BOOST = 10] = "BOOST";
            ELayer[ELayer.LOOTBOX = 11] = "LOOTBOX";
            ELayer[ELayer.PROJECTILE = 12] = "PROJECTILE";
            ELayer[ELayer.WINDMILL = 13] = "WINDMILL";
            ELayer[ELayer.COW = 14] = "COW";
            ELayer[ELayer.SPAWN = 15] = "SPAWN";
            ELayer[ELayer.POWERMILL = 16] = "POWERMILL";
            ELayer[ELayer.CASTLESPIKE = 17] = "CASTLESPIKE";
            ELayer[ELayer.TURRET = 18] = "TURRET";
            ELayer[ELayer.WOODFARM = 19] = "WOODFARM";
            ELayer[ELayer.CHERRYWOODFARM = 20] = "CHERRYWOODFARM";
            ELayer[ELayer.STONEWARM = 21] = "STONEWARM";
            ELayer[ELayer.CASTLEWALL = 22] = "CASTLEWALL";
            ELayer[ELayer.SHARK = 23] = "SHARK";
            ELayer[ELayer.WOLF = 24] = "WOLF";
            ELayer[ELayer.GOLDENCOW = 25] = "GOLDENCOW";
            ELayer[ELayer.ROOF = 26] = "ROOF";
            ELayer[ELayer.DRAGON = 27] = "DRAGON";
            ELayer[ELayer.MAMMOTH = 28] = "MAMMOTH";
            ELayer[ELayer.FIREBALL = 29] = "FIREBALL";
            ELayer[ELayer.CHEST = 30] = "CHEST";
            ELayer[ELayer.DRAGONWALLBIG = 31] = "DRAGONWALLBIG";
            ELayer[ELayer.DRAGONWALLMEDIUM = 32] = "DRAGONWALLMEDIUM";
            ELayer[ELayer.DRAGONWALLSMALL = 33] = "DRAGONWALLSMALL";
            ELayer[ELayer.MAMMOTHWALL = 34] = "MAMMOTHWALL";
            ELayer[ELayer.MAMMOTHWALLSMALL = 35] = "MAMMOTHWALLSMALL";
            ELayer[ELayer.DUCK = 36] = "DUCK";
            ELayer[ELayer.TELEPORT = 37] = "TELEPORT";
            ELayer[ELayer.CACTUS = 38] = "CACTUS";
            ELayer[ELayer.TORNADO = 39] = "TORNADO";
            ELayer[ELayer.RUBY = 40] = "RUBY";
        })(ELayer || (ELayer = {}));

        const LayerDataArray = [{
            id: ELayer.PLAYER,
            radius: 35,
            maxHealth: 100,
            Qa: 1
        }, {
            id: ELayer.STONE,
            shoot: true,
            radius: 75,
            Qa: 1,
            Pa: 1,
            pe: "rock"
        }, {
            id: ELayer.HARDSPIKE,
            shoot: true,
            qa: 35,
            radius: 45,
            maxHealth: 500,
            Qa: 1
        }, {
            id: ELayer.TREE,
            shoot: true,
            cannotShoot: true,
            radius: 90,
            Qa: 1,
            Ka: 1,
            pe: "tree"
        }, {
            id: ELayer.GOLD,
            shoot: true,
            radius: 76,
            Qa: 1,
            Xa: 5,
            pe: "gold"
        }, {
            id: ELayer.BUSH,
            shoot: true,
            radius: 50,
            Qa: 1,
            Na: 1,
            pe: "bush"
        }, {
            id: ELayer.TRAP,
            radius: 40,
            maxHealth: 500,
            Qa: 1
        }, {
            id: ELayer.SPIKE,
            shoot: true,
            qa: 20,
            radius: 45,
            maxHealth: 375,
            Ia: 20,
            Qa: 1
        }, {
            id: ELayer.WOODWALL,
            shoot: true,
            radius: 45,
            maxHealth: 380,
            Qa: 1
        }, {
            id: ELayer.PLATFORM,
            radius: 60,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.BOOST,
            radius: 40,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.LOOTBOX,
            radius: 40,
            maxHealth: 4,
            Qa: 1
        }, {
            id: ELayer.PROJECTILE,
            radius: 0,
            maxHealth: 0
        }, {
            id: ELayer.WINDMILL,
            shoot: true,
            radius: 45,
            maxHealth: 400,
            rotateSpeed: Math.PI / 4,
            Qa: 1
        }, {
            id: ELayer.COW,
            radius: 90,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 9,
            ts: 0
        }, {
            id: ELayer.SPAWN,
            shoot: true,
            radius: 50,
            maxHealth: 380,
            Qa: 1
        }, {
            id: ELayer.POWERMILL,
            shoot: true,
            radius: 54,
            maxHealth: 400,
            rotateSpeed: Math.PI / 2,
            Qa: 1
        }, {
            id: ELayer.CASTLESPIKE,
            shoot: true,
            qa: 5,
            radius: 42,
            maxHealth: 1200,
            Ia: 24,
            Qa: 1
        }, {
            id: ELayer.TURRET,
            shoot: true,
            radius: 45,
            maxHealth: 800,
            Qa: 1
        }, {
            id: ELayer.WOODFARM,
            shoot: true,
            cannotShoot: true,
            radius: 80,
            Qa: 1,
            Ka: 1,
            pe: "tree"
        }, {
            id: ELayer.CHERRYWOODFARM,
            shoot: true,
            cannotShoot: true,
            radius: 80,
            Qa: 1,
            Ka: 1,
            pe: "cherry_tree"
        }, {
            id: ELayer.STONEWARM,
            shoot: true,
            radius: 60,
            Qa: 1,
            Pa: 1,
            pe: "rock"
        }, {
            id: ELayer.CASTLEWALL,
            shoot: true,
            radius: 59,
            maxHealth: 1750,
            Qa: 1
        }, {
            id: ELayer.SHARK,
            radius: 90,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.2,
            $a: 49,
            qa: 14,
            ts: 3
        }, {
            id: ELayer.WOLF,
            radius: 50,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 14,
            ts: 0
        }, {
            id: ELayer.GOLDENCOW,
            radius: 90,
            maxHealth: 1e3,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 19
        }, {
            id: ELayer.ROOF,
            radius: 50,
            maxHealth: 300,
            Qa: 1
        }, {
            id: ELayer.DRAGON,
            radius: 100,
            maxHealth: 5e3,
            animal: true,
            Qa: 1,
            Ja: 1.15,
            $a: 17,
            qa: 30,
            ts: 0
        }, {
            id: ELayer.MAMMOTH,
            radius: 90,
            maxHealth: 5e3,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 17,
            qa: 30,
            ts: 1
        }, {
            id: ELayer.FIREBALL,
            radius: 100,
            maxHealth: 380,
            Qa: 1,
            Ja: .4,
            $a: 1,
            qa: 15,
            ts: 0
        }, {
            id: ELayer.CHEST,
            shoot: true,
            radius: 45,
            maxHealth: 380,
            Qa: 1,
            Xa: 50,
            Lr: 20
        }, {
            id: ELayer.DRAGONWALLBIG,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.DRAGONWALLMEDIUM,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.DRAGONWALLSMALL,
            shoot: true,
            radius: 58,
            Qa: 1,
            Pa: 1
        }, {
            id: ELayer.MAMMOTHWALL,
            shoot: true,
            radius: 92,
            Qa: 1,
            Pa: 0
        }, {
            id: ELayer.MAMMOTHWALLSMALL,
            shoot: true,
            radius: 20,
            Qa: 1,
            Pa: 0
        }, {
            id: ELayer.DUCK,
            radius: 20,
            maxHealth: 380,
            animal: true,
            Qa: 1,
            Ja: 1.6,
            $a: 9,
            ts: 0
        }, {
            id: ELayer.TELEPORT,
            shoot: true,
            radius: 35,
            maxHealth: 150,
            Qa: 1
        }, {
            id: ELayer.CACTUS,
            shoot: true,
            radius: 50,
            Qa: 1,
            Na: 5,
            qa: 20
        }, {
            id: ELayer.TORNADO,
            radius: 220,
            rotateSpeed: Math.PI / 4,
            Qa: 0,
            Na: 5,
            qa: 1
        }, {
            id: ELayer.RUBY,
            shoot: true,
            radius: 76,
            Qa: 1,
            Xa: 40,
            pe: "ruby"
        }];
        var Hat;
        (function(Hat) {
            Hat[Hat.UNEQUIP = 0] = "UNEQUIP";
            Hat[Hat.BUSH = 1] = "BUSH";
            Hat[Hat.BERSERKER = 2] = "BERSERKER";
            Hat[Hat.JUNGLE = 3] = "JUNGLE";
            Hat[Hat.CRYSTAL = 4] = "CRYSTAL";
            Hat[Hat.SPIKEGEAR = 5] = "SPIKEGEAR";
            Hat[Hat.IMMUNITY = 6] = "IMMUNITY";
            Hat[Hat.BOOST = 7] = "BOOST";
            Hat[Hat.APPLEHAT = 8] = "APPLEHAT";
            Hat[Hat.SCUBA = 9] = "SCUBA";
            Hat[Hat.HOOD = 10] = "HOOD";
            Hat[Hat.DEMOLIST = 11] = "DEMOLIST";
        })(Hat || (Hat = {}));

        const Hats = [ {
            bought: true,
            equipped: true,
            default: true,
            price: 0
        }, {
            image: 109,
            price: 250,
            axisY: 0,
            description: "Become a bush",
            name: "Bush Hat",
            bought: false,
            equipped: false,
            rs: true
        }, {
            image: 41,
            price: 5e3,
            description: "Increased melee damage",
            axisY: 10,
            cs: 1.25,
            speed: .85,
            name: "Berserker Gear",
            bought: false,
            equipped: false
        }, {
            image: 44,
            price: 3e3,
            description: "Regenerate health",
            axisY: 13,
            hs: 25,
            name: "Jungle Gear",
            bought: false,
            equipped: false
        }, {
            image: 45,
            price: 5e3,
            description: "Receive reduced damage",
            axisY: 10,
            reduceDmg: .75,
            speed: .95,
            name: "Crystal Gear",
            bought: false,
            equipped: false
        }, {
            image: 48,
            price: 1e3,
            description: "Attacker's receive damage",
            axisY: 10,
            reflect: .45,
            name: "Spike Gear",
            bought: false,
            equipped: false
        }, {
            image: 49,
            price: 4e3,
            description: "Gain more health",
            axisY: 15,
            ls: 150,
            reduceDmg: .75,
            name: "Immunity Gear",
            bought: false,
            equipped: false
        }, {
            image: 50,
            price: 1500,
            description: "Move quicker",
            axisY: 23,
            speed: 1.23,
            name: "Boost Hat",
            bought: false,
            equipped: false
        }, {
            image: 93,
            price: 150,
            description: "Apples become more succulent",
            axisY: 5,
            speed: 1.05,
            name: "Apple hat",
            bought: false,
            equipped: false
        }, {
            image: 121,
            price: 4e3,
            description: "Move fast in ocean",
            axisY: 5,
            speed: .75,
            river: 1.5,
            name: "Scuba Gear",
            bought: false,
            equipped: false
        }, {
            image: 126,
            price: 3500,
            description: "Become invisible when still",
            axisY: 5,
            name: "Hood",
            bought: false,
            equipped: false,
            rs: true
        }, {
            image: 197,
            price: 4e3,
            description: "Destroy buildings faster",
            axisY: 10,
            name: "Demolist",
            bought: false,
            equipped: false,
            speed: .3
        } ];

        var EWeapons;
        (function(EWeapons) {
            EWeapons[EWeapons.TOOL_HAMMER = 0] = "TOOL_HAMMER";
            EWeapons[EWeapons.STONE_SWORD = 1] = "STONE_SWORD";
            EWeapons[EWeapons.STONE_SPEAR = 2] = "STONE_SPEAR";
            EWeapons[EWeapons.STONE_AXE = 3] = "STONE_AXE";
            EWeapons[EWeapons.MUSKET = 4] = "MUSKET";
            EWeapons[EWeapons.SHIELD = 11] = "SHIELD";
            EWeapons[EWeapons.STICK = 13] = "STICK";
            EWeapons[EWeapons.HAMMER = 15] = "HAMMER";
            EWeapons[EWeapons.KATANA = 17] = "KATANA";
            EWeapons[EWeapons.BOW = 26] = "BOW";
            EWeapons[EWeapons.XBOW = 27] = "XBOW";
            EWeapons[EWeapons.NAGINATA = 28] = "NAGINATA";
            EWeapons[EWeapons.GREAT_AXE = 30] = "GREAT_AXE";
            EWeapons[EWeapons.BAT = 31] = "BAT";
            EWeapons[EWeapons.PEARL = 50] = "PEARL";
            EWeapons[EWeapons.SCYTHE = 57] = "SCYTHE";
        })(EWeapons || (EWeapons = {}));
        var ActionType;
        (function(ActionType) {
            ActionType[ActionType.MELEE = 0] = "MELEE";
            ActionType[ActionType.RANGED = 1] = "RANGED";
            ActionType[ActionType.PLACEABLE = 2] = "PLACEABLE";
            ActionType[ActionType.EATABLE = 3] = "EATABLE";
        })(ActionType || (ActionType = {}));

        var ItemType;
        (function(ItemType) {
            ItemType[ItemType.PRIMARY = 0] = "PRIMARY";
            ItemType[ItemType.SECONDARY = 1] = "SECONDARY";
            ItemType[ItemType.FOOD = 2] = "FOOD";
            ItemType[ItemType.WALL = 3] = "WALL";
            ItemType[ItemType.SPIKE = 4] = "SPIKE";
            ItemType[ItemType.WINDMILL = 5] = "WINDMILL";
            ItemType[ItemType.FARM = 6] = "FARM";
            ItemType[ItemType.TRAP = 7] = "TRAP";
            ItemType[ItemType.PLATFORM = 8] = "PLATFORM";
            ItemType[ItemType.SPAWN = 9] = "SPAWN";
            ItemType[ItemType.TURRET = 10] = "TURRET";
        })(ItemType || (ItemType = {}));

        var upgradeType;
        (function(upgradeType) {
            upgradeType[upgradeType.STONE = 1] = "STONE";
            upgradeType[upgradeType.GOLD = 2] = "GOLD";
            upgradeType[upgradeType.DIAMOND = 3] = "DIAMOND";
            upgradeType[upgradeType.RUBY = 4] = "RUBY";
        })(upgradeType || (upgradeType = {}));

        const ItemData = [ {
            id: EWeapons.TOOL_HAMMER,
            gs: 46,
            upgradeType: upgradeType.STONE,
            imageinv: 29,
            image: 25,
            name: "Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 25,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: EWeapons.STONE_SWORD,
            ks: 1,
            ys: 2,
            imageinv: 28,
            image: 24,
            name: "Stone Sword",
            description: "Sharp and pointy",
            range: 135,
            Ms: 250,
            itemType: ItemType.PRIMARY,
            damage: 35,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -8,
            os: -4
        }, {
            id: EWeapons.STONE_SPEAR,
            gs: 39,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 4,
            imageinv: 31,
            image: 26,
            name: "Stone Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 49,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: EWeapons.STONE_AXE,
            gs: 33,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 128,
            imageinv: 32,
            image: 35,
            name: "Stone Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 30,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: EWeapons.MUSKET,
            cost: {
                food: 0,
                wood: 0,
                stone: 10,
                gold: 0
            },
            ks: 16,
            xs: 2,
            ys: 8,
            imageinv: 30,
            image: 27,
            name: "Stone Musket",
            description: "Deal Long Range Damage",
            range: 1e3,
            itemType: ItemType.SECONDARY,
            damage: 49,
            reload: 1500,
            projectile: 17,
            Ls: 1500,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .63,
            As: 0,
            os: 0
        }, {
            id: 5,
            cost: {
                food: 0,
                wood: 10,
                stone: 0,
                gold: 0
            },
            imageinv: 33,
            image: 103,
            name: "Wood Wall",
            description: "A sturdy wall",
            itemType: ItemType.WALL,
            actionType: ActionType.PLACEABLE,
            Hs: 5,
            As: 0,
            os: 15,
            layer: ELayer.WOODWALL,
            ps: 2
        }, {
            id: 6,
            cost: {
                food: 0,
                wood: 5,
                stone: 20,
                gold: 0
            },
            ks: 1,
            ys: 512,
            imageinv: 36,
            image: 106,
            name: "Boost",
            description: "Provides a thrust",
            itemType: ItemType.TRAP,
            actionType: ActionType.PLACEABLE,
            Hs: -5,
            As: 0,
            os: 3,
            layer: ELayer.BOOST,
            ps: 2
        }, {
            id: 7,
            cost: {
                food: 0,
                wood: 20,
                stone: 5,
                gold: 0
            },
            imageinv: 37,
            image: 104,
            name: "Spike",
            description: "Sharp defence",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 15,
            layer: ELayer.SPIKE,
            ps: 2
        }, {
            id: 8,
            cost: {
                food: 0,
                wood: 20,
                stone: 0,
                gold: 0
            },
            ks: 1,
            imageinv: 38,
            image: 114,
            name: "Platform",
            description: "Shoot over structures",
            itemType: ItemType.PLATFORM,
            actionType: ActionType.PLACEABLE,
            Hs: -2,
            As: 0,
            os: 8,
            layer: ELayer.PLATFORM,
            ps: 2
        }, {
            id: 9,
            cost: {
                food: 0,
                wood: 30,
                stone: 30,
                gold: 0
            },
            ks: 1,
            ys: 1024,
            imageinv: 39,
            image: 107,
            name: "Trap",
            description: "Snared enemies are stuck",
            itemType: ItemType.TRAP,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 26,
            layer: ELayer.TRAP,
            ps: 2
        }, {
            id: 10,
            cost: {
                food: 10,
                wood: 0,
                stone: 0,
                gold: 0
            },
            imageinv: 43,
            image: 42,
            name: "Apple",
            description: "Heals you",
            itemType: ItemType.FOOD,
            actionType: ActionType.EATABLE,
            restore: 20,
            As: 0,
            os: 22,
            ps: 2
        }, {
            id: EWeapons.SHIELD,
            ks: 1,
            ys: 256,
            imageinv: 47,
            image: 46,
            name: "Shield",
            description: "Reduces damage",
            itemType: ItemType.SECONDARY,
            actionType: ActionType.MELEE,
            Us: .7,
            shieldAngle: .75,
            range: 55,
            Ms: 350,
            damage: 15,
            _s: 40,
            reload: 500,
            As: -15,
            os: 10,
            ps: 3
        }, {
            id: 12,
            cost: {
                food: 15,
                wood: 0,
                stone: 0,
                gold: 0
            },
            ks: 1,
            ys: 64,
            imageinv: 52,
            image: 51,
            name: "Cookie",
            description: "Heals you",
            itemType: ItemType.FOOD,
            actionType: ActionType.EATABLE,
            restore: 35,
            As: 0,
            os: 22,
            ps: 2
        }, {
            id: EWeapons.STICK,
            gs: 41,
            upgradeType: upgradeType.STONE,
            ks: 1,
            ys: 32,
            imageinv: 55,
            image: 54,
            name: "Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 7,
            Cs: 7,
            Bs: 7,
            zs: 4
        }, {
            id: 14,
            cost: {
                food: 0,
                wood: 50,
                stone: 10,
                gold: 0
            },
            imageinv: 57,
            image: 61,
            name: "Windmill",
            description: "Generates score over time",
            itemType: ItemType.WINDMILL,
            actionType: ActionType.PLACEABLE,
            rotateSpeed: Math.PI / 4,
            Hs: -5,
            As: 0,
            os: 38,
            layer: ELayer.WINDMILL,
            ps: 2
        }, {
            id: EWeapons.HAMMER,
            ks: 1,
            ys: 1,
            imageinv: 63,
            image: 62,
            name: "Hammer",
            description: "Breaks structures faster",
            range: 80,
            itemType: ItemType.SECONDARY,
            damage: 12,
            _s: 76,
            Us: .89,
            Ms: 200,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 5,
            os: 2
        }, {
            id: 16,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 200,
                gold: 200
            },
            imageinv: 65,
            image: 115,
            name: "Cosy Bed",
            description: "Respawn at the bed",
            itemType: ItemType.SPAWN,
            actionType: ActionType.PLACEABLE,
            Hs: 8,
            As: 0,
            os: 25,
            layer: ELayer.SPAWN,
            ps: 2
        }, {
            id: EWeapons.KATANA,
            gs: 37,
            upgradeType: upgradeType.STONE,
            ks: 2,
            ys: 2,
            imageinv: 68,
            image: 67,
            name: "Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 40,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 18,
            cost: {
                food: 0,
                wood: 30,
                stone: 30,
                gold: 0
            },
            ks: 160,
            ys: 1,
            imageinv: 69,
            image: 113,
            name: "Castle Spike",
            description: "Great for bases",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            damage: {
                hit: 24,
                touch: 5
            },
            Hs: -8,
            As: 0,
            os: 14,
            layer: ELayer.CASTLESPIKE,
            ps: 2
        }, {
            id: 19,
            cost: {
                food: 0,
                wood: 100,
                stone: 50,
                gold: 0
            },
            ks: 1,
            ys: 1,
            imageinv: 57,
            image: 61,
            name: "Powermill",
            description: "Generates more score over time",
            itemType: ItemType.WINDMILL,
            actionType: ActionType.PLACEABLE,
            rotateSpeed: Math.PI / 2,
            Hs: 5,
            As: 0,
            os: 38,
            layer: ELayer.POWERMILL,
            ps: 2
        }, {
            id: 20,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 30,
                stone: 10,
                gold: 0
            },
            imageinv: 73,
            image: 112,
            name: "Hard Spike",
            description: "Sharper defence",
            itemType: ItemType.SPIKE,
            actionType: ActionType.PLACEABLE,
            Hs: 2,
            As: 0,
            os: 15,
            layer: ELayer.HARDSPIKE,
            ps: 2
        }, {
            id: 21,
            cost: {
                food: 0,
                wood: 200,
                stone: 150,
                gold: 10
            },
            ks: 1,
            ys: 1,
            imageinv: 77,
            image: 74,
            name: "Turret",
            description: "Defence for your base",
            itemType: ItemType.TURRET,
            actionType: ActionType.PLACEABLE,
            Hs: 6,
            As: 0,
            os: 25,
            layer: ELayer.TURRET,
            ps: 2
        }, {
            id: 22,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 0,
                gold: 0
            },
            imageinv: 78,
            image: 110,
            name: "Cherry wood farm",
            description: "Used for decoration and wood",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 47,
            layer: ELayer.CHERRYWOODFARM,
            ps: 2
        }, {
            id: 23,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 200,
                stone: 0,
                gold: 0
            },
            imageinv: 80,
            image: 111,
            name: "Wood farm",
            description: "Used for decoration and wood",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 47,
            layer: ELayer.WOODFARM,
            ps: 2
        }, {
            id: 24,
            ks: 1,
            ys: 1,
            cost: {
                food: 200,
                wood: 0,
                stone: 0,
                gold: 0
            },
            imageinv: 85,
            image: 109,
            name: "Berry farm",
            description: "Used for decoration and berries",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 17,
            layer: ELayer.BUSH,
            ps: 2
        }, {
            id: 25,
            ks: 1,
            ys: 1,
            cost: {
                food: 0,
                wood: 0,
                stone: 200,
                gold: 0
            },
            imageinv: 83,
            image: 108,
            name: "Stone farm",
            description: "Used for decoration and stone",
            itemType: ItemType.FARM,
            actionType: ActionType.PLACEABLE,
            Hs: 3,
            As: 0,
            os: 20,
            layer: ELayer.STONEWARM,
            ps: 2
        }, {
            id: EWeapons.BOW,
            cost: {
                food: 0,
                wood: 4,
                stone: 0,
                gold: 0
            },
            ks: 1,
            ys: 16,
            imageinv: 86,
            image: 87,
            name: "Bow",
            description: "Deal Long Range Damage",
            range: 800,
            itemType: ItemType.SECONDARY,
            damage: 25,
            reload: 600,
            projectile: 88,
            Ls: 1200,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .75,
            As: 0,
            os: 35
        }, {
            id: EWeapons.XBOW,
            cost: {
                food: 0,
                wood: 10,
                stone: 0,
                gold: 0
            },
            ks: 16,
            ys: 176,
            imageinv: 90,
            image: 91,
            name: "XBow",
            description: "Rapid fire bow",
            range: 800,
            itemType: ItemType.SECONDARY,
            damage: 27,
            reload: 235,
            projectile: 88,
            Ls: 1200,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .35,
            As: 0,
            os: 30
        }, {
            id: EWeapons.NAGINATA,
            gs: 45,
            upgradeType: upgradeType.STONE,
            ks: 4,
            ys: 4,
            imageinv: 100,
            image: 99,
            name: "Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 52,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 29,
            cost: {
                food: 0,
                wood: 0,
                stone: 35,
                gold: 10
            },
            ks: 1,
            ys: 1,
            imageinv: 101,
            image: 105,
            name: "Castle Wall",
            description: "A very sturdy wall",
            itemType: ItemType.WALL,
            actionType: ActionType.PLACEABLE,
            Hs: 8,
            As: 0,
            os: 13,
            layer: ELayer.CASTLEWALL,
            ps: 2
        }, {
            id: EWeapons.GREAT_AXE,
            gs: 35,
            upgradeType: upgradeType.STONE,
            ks: 128,
            ys: 128,
            imageinv: 117,
            image: 116,
            name: "Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 37,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: EWeapons.BAT,
            ks: 1,
            ys: 2048,
            imageinv: 128,
            image: 127,
            name: "Bat",
            description: "Hit enemies for a home run",
            range: 115,
            itemType: ItemType.PRIMARY,
            damage: 28,
            Us: .92,
            Ms: 870,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 2
        }, {
            id: 32,
            ks: 1,
            ys: 128,
            imageinv: 131,
            image: 130,
            name: "Diamond Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 35.5,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: 33,
            gs: 32,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 128,
            imageinv: 133,
            image: 132,
            name: "Gold Axe",
            description: "Gathers materials faster",
            range: 90,
            itemType: ItemType.PRIMARY,
            damage: 33,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -2,
            os: 2,
            Es: 2,
            Cs: 2,
            Bs: 2,
            zs: 2
        }, {
            id: 34,
            ks: 128,
            ys: 128,
            imageinv: 135,
            image: 134,
            name: "Diamond Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 47,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: 35,
            gs: 34,
            upgradeType: upgradeType.GOLD,
            ks: 128,
            ys: 128,
            imageinv: 145,
            image: 144,
            name: "Gold Great Axe",
            description: "More powerful axe.",
            range: 94,
            itemType: ItemType.PRIMARY,
            damage: 40,
            Ms: 250,
            reload: 400,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 4,
            os: 2,
            Es: 4,
            Cs: 4,
            Bs: 4,
            zs: 2
        }, {
            id: 36,
            gs: 40,
            upgradeType: upgradeType.DIAMOND,
            ks: 2,
            ys: 2,
            imageinv: 137,
            image: 136,
            name: "Diamond Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 46.5,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 37,
            gs: 36,
            upgradeType: upgradeType.GOLD,
            ks: 2,
            ys: 2,
            imageinv: 139,
            image: 138,
            name: "Gold Katana",
            description: "Excellent melee weapon",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 43,
            reload: 300,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 38,
            ks: 1,
            ys: 4,
            imageinv: 141,
            image: 140,
            name: "Diamond Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 53,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: 39,
            gs: 38,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 4,
            imageinv: 143,
            image: 142,
            name: "Gold Spear",
            description: "Long melee range",
            range: 160,
            itemType: ItemType.PRIMARY,
            damage: 51,
            Us: .81,
            Ms: 450,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: 2
        }, {
            id: 40,
            ks: 2,
            ys: 2,
            imageinv: 147,
            image: 148,
            name: "Chillrend",
            description: "A powerful force flows through this blade.",
            range: 140,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 48.5,
            reload: 300,
            Us: .9,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 1,
            os: 3
        }, {
            id: 41,
            gs: 42,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 32,
            imageinv: 150,
            image: 149,
            name: "Gold Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 8,
            Cs: 8,
            Bs: 8,
            zs: 5
        }, {
            id: 42,
            gs: 43,
            upgradeType: upgradeType.DIAMOND,
            ks: 1,
            ys: 32,
            imageinv: 167,
            image: 151,
            name: "Diamond Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 9,
            Cs: 9,
            Bs: 9,
            zs: 6
        }, {
            upgradeType: upgradeType.RUBY,
            id: 43,
            ks: 1,
            ys: 32,
            imageinv: 168,
            image: 152,
            name: "Ruby Stick",
            description: "Gathers resources quickly",
            range: 100,
            itemType: ItemType.PRIMARY,
            damage: 1,
            reload: 400,
            actionType: ActionType.MELEE,
            Ms: 60,
            ps: 0,
            As: 4,
            os: 0,
            Es: 10,
            Cs: 10,
            Bs: 10,
            zs: 7
        }, {
            id: 44,
            ks: 4,
            ys: 4,
            imageinv: 154,
            image: 153,
            name: "Diamond Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 56,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 45,
            gs: 44,
            upgradeType: upgradeType.GOLD,
            ks: 4,
            ys: 4,
            imageinv: 156,
            image: 155,
            name: "Gold Naginata",
            description: "Long melee range",
            range: 165,
            itemType: ItemType.PRIMARY,
            damage: 54,
            Us: .81,
            Ms: 470,
            reload: 700,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 0,
            os: -4
        }, {
            id: 46,
            gs: 47,
            upgradeType: upgradeType.GOLD,
            imageinv: 158,
            image: 157,
            name: "Gold Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 32,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: 47,
            gs: 48,
            upgradeType: upgradeType.DIAMOND,
            imageinv: 160,
            image: 159,
            name: "Diamond Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 38,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            upgradeType: upgradeType.RUBY,
            id: 48,
            imageinv: 162,
            image: 161,
            name: "Ruby Tool Hammer",
            description: "Gather materials",
            range: 80,
            itemType: ItemType.PRIMARY,
            damage: 41,
            reload: 300,
            _s: 30,
            Ms: 200,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -3.5,
            os: 1
        }, {
            id: 49,
            cost: {
                food: 0,
                wood: 20,
                stone: 0,
                gold: 0
            },
            ks: 1,
            imageinv: 170,
            image: 169,
            name: "Roof",
            description: "Take cover from projectiles",
            itemType: ItemType.PLATFORM,
            actionType: ActionType.PLACEABLE,
            Hs: 0,
            As: 0,
            os: 15,
            layer: ELayer.ROOF,
            ps: 2
        }, {
            id: 50,
            cost: {
                food: 80,
                wood: 80,
                stone: 80,
                gold: 80
            },
            ks: 1,
            ys: 256,
            imageinv: 182,
            image: 182,
            name: "Pearl",
            description: "Teleport on impact",
            range: 700,
            itemType: ItemType.SECONDARY,
            damage: 10,
            reload: 1e4,
            projectile: 182,
            Ls: 1e3,
            actionType: ActionType.RANGED,
            ps: 1,
            Us: .4,
            As: 0,
            os: 35
        }, {
            id: 51,
            cost: {
                food: 0,
                wood: 50,
                stone: 50,
                gold: 0
            },
            ks: 2208,
            ys: 1,
            imageinv: 183,
            image: 183,
            name: "Teleporter",
            description: "Teleports to location on map",
            itemType: ItemType.SPAWN,
            actionType: ActionType.PLACEABLE,
            Hs: 5,
            As: 0,
            os: 15,
            layer: ELayer.TELEPORT,
            ps: 2
        }, {
            gs: 53,
            upgradeType: upgradeType.STONE,
            id: 52,
            ks: 1,
            ys: 4096,
            imageinv: 189,
            image: 193,
            name: "Stone Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 22,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            gs: 54,
            upgradeType: upgradeType.GOLD,
            id: 53,
            ks: 1,
            ys: 4096,
            imageinv: 190,
            image: 194,
            name: "Gold Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 24,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            gs: 55,
            upgradeType: upgradeType.DIAMOND,
            id: 54,
            ks: 1,
            ys: 4096,
            imageinv: 191,
            image: 195,
            name: "Diamond Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 26,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            upgradeType: upgradeType.RUBY,
            id: 55,
            ks: 1,
            ys: 4096,
            imageinv: 192,
            image: 196,
            name: "Ruby Dagger",
            description: "A stubbier sword",
            range: 80,
            Ms: 100,
            itemType: ItemType.PRIMARY,
            damage: 29,
            reload: 150,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 10,
            os: 20
        }, {
            id: 56,
            gs: 57,
            upgradeType: upgradeType.GOLD,
            ks: 1,
            ys: 1,
            imageinv: 198,
            image: 198,
            name: "Secret Item",
            description: "Dont leak how to get it :)",
            range: 115,
            itemType: ItemType.PRIMARY,
            damage: 28,
            Us: .92,
            Ms: 1570,
            reload: 2e3,
            actionType: ActionType.MELEE,
            ps: 0,
            As: 40,
            os: 40
        }, {
            id: 57,
            ks: 2,
            ys: 2,
            imageinv: 199,
            image: 199,
            name: "Daedric Scythe",
            description: "Whispers fill the air",
            range: 160,
            Ms: 150,
            itemType: ItemType.PRIMARY,
            damage: 52,
            reload: 450,
            Us: .85,
            actionType: ActionType.MELEE,
            ps: 0,
            As: -5,
            os: 20
        } ];

        const LayerData = LayerDataArray;
        const hatsData = Hats;
        const itemData = ItemData;
        const fromCharCode = codes => codes.map((code => String.fromCharCode(code))).join("");

        window.layerData = LayerData;
        window.hatsData = hatsData;
        window.itemData = itemData;
        window.AntiMooAddict = window;

        const AntiMooAddict = window.AntiMooAddict;
        const pingCount = fromCharCode([ 68, 111, 119, 110, 108, 111, 97, 100, 32, 68, 115, 121, 110, 99, 32, 67, 108, 105, 101, 110, 116, 32, 111, 110, 32, 103, 114, 101, 97, 115, 121, 102, 111, 114, 107 ]);

        const log = console.log;

        log("InfoDataGlobal: " + window.layerData)
        log("HatsDataGlobal: " + window.hatsData)
        log("ItemDataGlobal: " + window.itemData)
    })();
}).toString() + `)(${JSON.stringify(GM_info)});`)();

Math.lerpAngle = function(value1, value2, amount) {
    let difference = Math.abs(value2 - value1);
    if (difference > Math.PI) {
        if (value1 > value2) {
            value2 += 360;
        } else {
            value1 += 360;
        }
    }

    let value = value2 + ((value1 - value2) * amount);
    if (value >= 0 && value <= 360) return value;
    return value % (180 / Math.PI * 2);
};

const { log } = console;
var autoChoose = true;
var placeObjects = 0;
var kills = 0;
var placeDelay;
var time;
var ws;
let pps = 0;
let wsPushing = false
let wasBreaking = false
let Game;
let Entity = [];
let keyDown = [];
let user = {};
let tribe = [];
let enemy = [];
let encoder = new TextEncoder();
let decoder = new TextDecoder();
let teammates = [];
let userPos = { x: user.x + user.xVel, y: user.y + user.yVel }
let enemyPos = { x: enemy.x + enemy.xVel, y: enemy.y + enemy.yVel }
let skinLoaded = true;
let weaponReload = true;
let lastPlaceTime = 0;
let placeExecutions = 0;
let ctxt;
let layerData = window.layerData;
const maxPlaceExecutions = 2;
const spamCooldown = 450;
const healthThreshold = 40;
const enemyThreshold = 210;

var styleItem1 = document.createElement('style');
styleItem1.type = 'text/css';
styleItem1.appendChild(document.createTextNode(`
@import url(\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css\");

#nav, #main-login-button, #main-sign-up-button, .background-img-play, #logo, #cross-promo, #bottom-wrap, #google_play, #game-left-content-main, #game-bottom-content, #game-right-content-main, #right-content, #left-content {
   display: none !important;
}

#game-content {
   justifyContent: center !important;
}

#main-content {
  width: auto
  background: rgba(0, 0, 0, 0),
  display: flex,
  align-items: center,
  align-content: center,
  margin-bottom: 10px,
  padding: 0px,
}

#homepage {
  background: black;
}

#middle-wrap {
  height: 9999999px,
  width: 500px,
  padding: none,
}

.side-main {
  opacity: 0,
}

#top-wrap-left {
  opacity: 0,
}

#top-wrap-right {
  height: 20px,
  opacity: 30,
}

#server-select {
  font-size: 14px,
  line-height: 1.7,
  text-transform: uppercase,
  display: block,
  background: rgba(0, 0, 0, 0),
  box-shadow: none,
  border: none,
  border-radius: 31px,
  padding: 0px 20px,
  height: 50px,
  min-width: 230px,
  justify-content: center,
  align-items: center,
  margin-top: 5px,
  margin-left: auto,
  margin-right: auto,
  text-decoration: underline,
}

.text-shadowed-5 {
  font-size: 16px,
  color: #fff,
  text-shadow: none,
  padding-bottom: 35px,
}

.gameover {
    width: 650px;
    height: 450px;
    background-color: #5e3837;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    border: 5px solid #141414;
    text-content: "AntiMooAddict cant die...";
}

.gameover .header {
    background-color: #91553b;
    padding: 10px;
    display: flex;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: inset 0 -4px 0 #141414;
}

.gameover .header h1 {
    color: white;
    margin-left: auto;
    margin-right: auto;
}

.gameover .header #close {
    color: rgb(244, 235, 228);
    cursor: pointer;
    width: 20px;
    height: 20px;
    padding: 5px;
    border-radius: 5px;
    background-color: #5e3837;
    border: 4px solid #141414;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -17px;
    right: -17px;
    z-index: 1;
}

.gameover .header #close:hover {
    color: #ccc;
}

.gameover .stats {
    display: flex;
    height: 75%;
    align-items: center;
    width: 90%;
    margin: auto;
}

.gameover .stats .stat {
    display: flex;
    flex-direction: column;
    min-width: 100px;
    margin-left: auto;
    margin-right: auto;
}

.gameover .stats .stat img {
    margin-bottom: 20px;
    height: 60px;
    width: 60px;
    margin-left: auto;
    margin-right: auto;
}

.gameover .stats .stat .stat-type {
    margin-right: auto;
    color: #f3c39f;
    text-transform: uppercase;
    font-weight: bold;
}

.gameover .stats .stat .stat-content {
    color: #f3c39f;
    font-weight: bold;
}

#play {
  box-shadow: none,
  border: none,
  border-radius: 31px,
  padding: 0px 20px,
  height: 50px,
  min-width: 150px,
  justify-content: center,
  align-items: center,
  font-size: 20px,
  margin-top: 5px,
  margin-left: auto,
  margin-right: auto,
}

#nickname {
  text-align: center,
  color: #666666,
  display: block,
  background: #fff,
  border: none,
  border-radius: 31px,
  box-shadow: none,
  padding: 6px 15px,
  margin-left: auto,
  margin-right: auto,
  font-size: 20px,
  width: 300px,
}

.nav-button {
  display: none,
  height: 0px,
}

#currency-container {
  display: none,
}


#game-mode-container {
    display: flex;
    flex-direction: column;
}

.game-mode {
    transition: all 0.5s ease;
    border-radius: 25px;
}

.side-button:hover {
    transition: all 0.5s ease;
}

#ffa-mode, #sandbox-mode, #event-mode, #play, #server-select {
   border-radius: 25px;
   display: block;
}

.menu-text-icon::before {
   margin-bottom: 0.2vh;
   margin-right: .4vw;
}

`));

document.head.appendChild(styleItem1);

var textDiv = document.createElement('div');
textDiv.className = 'text';

setInterval(() => {
    setTimeout(() => {
        textDiv.textContent = 'A';
        setTimeout(() => {
            textDiv.textContent = 'An';
            setTimeout(() => {
                textDiv.textContent = 'Ant';
                setTimeout(() => {
                    textDiv.textContent = 'Anti';
                    setTimeout(() => {
                        textDiv.textContent = 'AntiM';
                        setTimeout(() => {
                            textDiv.textContent = 'AntiMo';
                            setTimeout(() => {
                                textDiv.textContent = 'AntiMoo';
                                setTimeout(() => {
                                    textDiv.textContent = 'AntiMooA';
                                    setTimeout(() => {
                                        textDiv.textContent = 'AntiMooAd';
                                        setTimeout(() => {
                                            textDiv.textContent = 'AntiMooAdd';
                                            setTimeout(() => {
                                                textDiv.textContent = 'AntiMooAddi';
                                                setTimeout(() => {
                                                    textDiv.textContent = 'AntiMooAddic';
                                                    setTimeout(() => {
                                                        textDiv.textContent = 'AntiMooAddict';
                                                    }, 500);
                                                }, 500);
                                            }, 500);
                                        }, 500);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}, 10000);


textDiv.style.color = 'yellow';
textDiv.style.fontSize = '30px';
var middleWrap = document.getElementById('middle-wrap');

if (middleWrap) {
    if (middleWrap.children.length >= 1) {
        middleWrap.insertBefore(textDiv, middleWrap.children[1]);
    } else {
        middleWrap.appendChild(textDiv);
    }
}

setInterval(() => {
    pps = 0;
}, 2000);

let Config = {
    serverUpdate: 1000 / 9,
    breaking: false,
    pushing: false,
    oldTrap: null,
    trapBroken: null,
    antiBull: false,
    aimBot: true,
    breakHitReload: true,
    autoAttack: false,
    weapon: 0,
    enemiesNear: [],
    angle: 0,
    move: 0,
    messages: new Array([], []),
    counter: 0,
    resolver: function () {},
    last: Date.now(),
    WS: null
};

Config.tick = () => {
    return new Promise((e) => (Config.resolver = e))
};

function fixTo(n, v) {
    return parseFloat(n.toFixed(v));
}

function getAttackDir() {
    let lastDir = Config.angle;
    return fixTo(lastDir || 0, 2);
}

function doubleHeal() {
    setTimeout(() => {
        Sploop.place(2, getAttackDir());
        setTimeout(() => {
            Sploop.place(2, getAttackDir());
        }, window.pingTime > 100 ? 0 : 30);
    }, 0)
}

function tripleHeal() {
    setTimeout(() => {
        doubleHeal();
        setTimeout(() => {
            Sploop.place(2, getAttackDir());
        }, 1e3);
    }, 0);
}

let Toggle = {
    autoBreak: true,
    autoPush: true,
    autoPlace: true,
    autoSync: true,
    autoHeal: true,
    Replacer: true,
    antiTrap: true,
    markers: true,
    aimBot: true,
    smoothBarHealth: true,
    safeWalk: true,
    aimLerpAngle: true,
    spikeNearSync: false,
    spikeSyncPerfect: false,
    trapSync: false
}

const items = [
    {
        id: 0,
        name: "Tool Hammer",
        description: "Gather materials",
        range: 80,
        damage: 25,
        reload: 300,
        weapon: true,
    },
    {
        id: 1,
        name: "Stone Sword",
        description: "Sharp and pointy",
        range: 135,
        damage: 35,
        reload: 300,
        weapon: true,
    },
    {
        id: 2,
        name: "Stone Spear",
        description: "Long melee range",
        range: 160,
        damage: 49,
        reload: 700,
        weapon: true,
    },
    {
        id: 3,
        name: "Stone Axe",
        description: "Gathers materials faster",
        range: 90,
        damage: 30,
        reload: 400,
        weapon: true,
    },
    {
        id: 4,
        name: "Stone Musket",
        description: "Deal Long Range Damage",
        range: 1000,
        damage: 49,
        reload: 1500,
        weapon: true,
    },
    {
        id: 5,
        name: "Wood Wall",
        description: "A sturdy wall",
    },
    {
        id: 6,
        name: "Boost",
        description: "Provides a thrust",
    },
    {
        id: 7,
        name: "Spike",
        description: "Sharp defence",
    },
    {
        id: 8,
        name: "Platform",
        description: "Shoot over structures",
    },
    {
        id: 9,
        name: "Trap",
        description: "Snared enemies are stuck",
    },
    {
        id: 10,
        name: "Apple",
        description: "Heals you",
    },
    {
        id: 11,
        name: "Shield",
        description: "Reduces damage",
        range: 55,
        damage: 15,
        reload: 500,
    },
    {
        id: 12,
        name: "Cookie",
        description: "Heals you",
    },
    {
        id: 13,
        name: "Stick",
        description: "Gathers resources quickly",
        range: 100,
        damage: 1,
        reload: 400,
        weapon: true,
    },
    {
        id: 14,
        name: "Windmill",
        description: "Generates score over time",
    },
    {
        id: 15,
        name: "Hammer",
        description: "Breaks structures faster",
        range: 80,
        damage: 12,
        reload: 400,
        weapon: true,
    },
    {
        id: 16,
        name: "Cosy Bed",
        description: "Respawn at the bed",
    },
    {
        id: 17,
        name: "Katana",
        description: "Excellent melee weapon",
        range: 140,
        damage: 40,
        reload: 300,
        weapon: true,
    },
    {
        id: 18,
        name: "Castle Spike",
        description: "Great for bases",
    },
    {
        id: 19,
        name: "Powermill",
        description: "Generates more score over time",
    },
    {
        id: 20,
        name: "Hard Spike",
        description: "Sharper defence",
    },
    {
        id: 21,
        name: "Turret",
        description: "Defence for your base",
    },
    {
        id: 22,
        name: "Cherry wood farm",
        description: "Used for decoration and wood",
    },
    {
        id: 23,
        name: "Wood farm",
        description: "Used for decoration and wood",
    },
    {
        id: 24,
        name: "Berry farm",
        description: "Used for decoration and berries",
    },
    {
        id: 25,
        name: "Stone farm",
        description: "Used for decoration and stone",
    },
    {
        id: 26,
        name: "Bow",
        description: "Deal Long Range Damage",
        range: 800,
        damage: 25,
        reload: 600,
        weapon: true,
    },
    {
        id: 27,
        name: "XBow",
        description: "Rapid fire bow",
        range: 800,
        damage: 27,
        reload: 235,
        weapon: true,
    },
    {
        id: 28,
        name: "Naginata",
        description: "Long melee range",
        range: 165,
        damage: 52,
        reload: 700,
        weapon: true,
    },
    {
        id: 29,
        name: "Castle Wall",
        description: "A very sturdy wall",
    },
    {
        id: 30,
        name: "Great Axe",
        description: "More powerful axe.",
        range: 94,
        damage: 37,
        reload: 400,
        weapon: true,
    },
    {
        id: 31,
        name: "Bat",
        description: "Hit enemies for a home run",
        range: 115,
        damage: 28,
        reload: 700,
        weapon: true,
    },
    {
        id: 32,
        name: "Diamond Axe",
        description: "Gathers materials faster",
        range: 90,
        damage: 35.5,
        reload: 400,
        weapon: true,
    },
    {
        id: 33,
        name: "Gold Axe",
        description: "Gathers materials faster",
        range: 90,
        damage: 33,
        reload: 400,
        weapon: true,
    },
    {
        id: 34,
        name: "Diamond Great Axe",
        description: "More powerful axe.",
        range: 94,
        damage: 47,
        reload: 400,
        weapon: true,
    },
    {
        id: 35,
        name: "Gold Great Axe",
        description: "More powerful axe.",
        range: 94,
        damage: 40,
        reload: 400,
        zs: 2,
        weapon: true,
    },
    {
        id: 36,
        image: 136,
        name: "Diamond Katana",
        description: "Excellent melee weapon",
        range: 140,
        damage: 46.5,
        reload: 300,
        weapon: true,
    },
    {
        id: 37,
        name: "Gold Katana",
        description: "Excellent melee weapon",
        range: 140,
        damage: 43,
        reload: 300,
        weapon: true,
    },
    {
        id: 38,
        name: "Diamond Spear",
        description: "Long melee range",
        range: 160,
        damage: 53,
        reload: 700,
        weapon: true,
    },
    {
        id: 39,
        name: "Gold Spear",
        description: "Long melee range",
        range: 160,
        damage: 51,
        reload: 700,
        weapon: true,
    },
    {
        id: 40,
        name: "Chillrend",
        description: "A powerful force flows through this blade.",
        range: 140,
        damage: 48.5,
        reload: 300,
        weapon: true,
    },
    {
        id: 41,
        name: "Gold Stick",
        description: "Gathers resources quickly",
        range: 100,
        damage: 1,
        reload: 400,
        weapon: true,
    },
    {
        id: 42,
        name: "Diamond Stick",
        description: "Gathers resources quickly",
        range: 100,
        damage: 1,
        reload: 400,
        weapon: true,
    },
    {
        id: 43,
        name: "Ruby Stick",
        description: "Gathers resources quickly",
        range: 100,
        damage: 1,
        reload: 400,
        weapon: true,
    },
    {
        id: 44,
        name: "Diamond Naginata",
        description: "Long melee range",
        range: 165,
        damage: 56,
        reload: 700,
        weapon: true,
    },
    {
        id: 45,
        name: "Gold Naginata",
        description: "Long melee range",
        range: 165,
        damage: 54,
        reload: 700,
        weapon: true,
    },
    {
        id: 46,
        name: "Gold Tool Hammer",
        description: "Gather materials",
        range: 80,
        damage: 32,
        reload: 300,
        weapon: true,
    },
    {
        id: 47,
        name: "Diamond Tool Hammer",
        description: "Gather materials",
        range: 80,
        damage: 38,
        reload: 300,
        weapon: true,
    },
    {
        id: 48,
        name: "Ruby Tool Hammer",
        description: "Gather materials",
        range: 80,
        damage: 41,
        reload: 300,
        weapon: true,
    },
    {
        id: 49,
        name: "Roof",
        description: "Take cover from projectiles",
    },
    {
        id: 50,
        name: "Pearl",
        description: "Teleport on impact",
        range: 700,
        damage: 10,
        reload: 10000,
        weapon: true,
    },
    {
        id: 51,
        name: "Teleporter",
        description: "Teleports to location on map",
    },
    {
        id: 52,
        name: "Stone Dagger",
        description: "A stubbier sword",
        range: 80,
        damage: 22,
        reload: 150,
        weapon: true,
    },
    {
        id: 53,
        name: "Gold Dagger",
        description: "A stubbier sword",
        range: 80,
        damage: 24,
        reload: 150,
        weapon: true,
    },
    {
        id: 54,
        name: "Diamond Dagger",
        description: "A stubbier sword",
        range: 80,
        damage: 26,
        reload: 150,
        weapon: true,
    },
    {
        id: 55,
        name: "Ruby Dagger",
        description: "A stubbier sword",
        range: 80,
        damage: 29,
        reload: 150,
        weapon: true,
    },
    {
        id: 56,
        name: "Secret Item",
        description: "Dont leak how to get it :)",
        range: 115,
        damage: 28,
        reload: 2000,
        weapon: true,
    },
    {
        id: 57,
        name: "Daedric Scythe",
        description: "Whispers fill the air",
        range: 160,
        damage: 52,
        reload: 450,
        weapon: true,
    },
];

class technices {
    calculateSpikeAndTrapHoles() {
        let areaSize = 150;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            let distance = 100;
            let spot = {
                x: user.x + distance * Math.cos(angle),
                y: user.y + distance * Math.sin(angle)
            };
            if (!this.isSpaceOccupied(spot)) {
                let spikeNearby = Entity.find(e => e && [2, 7, 17].includes(e.type) && getDistance(e, spot) <= 50);
                if (spikeNearby) {
                    Sploop.place(7, getAngle(spot, user));
                } else {
                    Sploop.place(4, getAngle(spot, user));
                }
            }
        }
    }

    placeTrapsAround() {
        placeObjects++
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
            let distance = 80;
            let spot = {
                x: user.x + distance * Math.cos(angle),
                y: user.y + distance * Math.sin(angle)
            };
            if (!this.isSpaceOccupied(spot) && placeObjects >= 4) {
                Sploop.place(7, getAngle(spot, user));
                placeObjects = 0;
            }
        }
    }

    analyzePotentialTrapSpots() {
        let potentialSpots = [];
        for (let i = -100; i <= 100; i += 50) {
            for (let j = -100; j <= 100; j += 50) {
                let spot = { x: user.x + i, y: user.y + j };
                if (!this.isSpaceOccupied(spot)) {
                    potentialSpots.push(spot);
                }
            }
        }
        return potentialSpots;
    }

    analyzePotentialSpikeSpots() {
        let potentialSpots = [];
        if (enemy) {
            potentialSpots.push({ x: enemy.x + 50, y: enemy.y })
            potentialSpots.push({ x: enemy.x - 50, y: enemy.y })
            potentialSpots.push({ x: enemy.x, y: enemy.y + 50 })
            potentialSpots.push({ x: enemy.x, y: enemy.y - 50 })
        }
        return potentialSpots;
    }

    isSpaceOccupied(position) {
        return Entity.some(e => getDistance(e, position) <= 50);
    }

    analyzeAndPlace() {
        let areaSize = 200;
        for (let i = -areaSize; i <= areaSize; i += 50) {
            for (let j = -areaSize; j <= areaSize; j += 50) {
                let spot = { x: user.x + i, y: user.y + j };
                if (!this.isSpaceOccupied(spot)) {
                    if (Math.random() < 0.5) {
                        placeObjects++;

                        if (placeObjects >= 4) {
                            Sploop.place(7, getAngle(spot, user));
                            placeObjects = 0;
                        }
                    } else {
                        placeObjects++

                        if (placeObjects >= 4) {
                            Sploop.place(4, getAngle(spot, user));
                            placeObjects = 0;
                        }
                    }
                }
            }
        }
    }

    calculateBestBreakAngle(spikes) {
        let bestAngle = null;
        let maxSpikesHit = 0;

        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
            let hitSpikes = spikes.filter(spike => Math.abs(getAngle(spike, user) - angle) < Math.PI / 16);
            if (hitSpikes.length > maxSpikesHit) {
                maxSpikesHit = hitSpikes.length;
                bestAngle = angle;
            }
        }
        return bestAngle;
    }



}

const Technices = new technices();

class Macro {
    constructor(advanced, spike, trap, mill, food) {
        this.advanced = advanced;
        this.spike = spike;
        this.trap = trap;
        this.mill = mill;
        this.food = food;
    }

    update() {
        if (keyDown[this.spike]) Sploop.place(4);
        if (keyDown[this.trap]) Sploop.place(7);
        if (keyDown[this.mill]) Sploop.place(5);
        if (keyDown[this.food]) Sploop.place(2);
    }

};

let Placer = new Macro(true, 86, 70, 78, 81);

var negative = {
    delayed: false,
    found: false,
    lastAngle: 0,
    angle: 0,
};
var positive = {
    found: false,
    lastAngle: 0,
    angle: 0,
};

var antiTrap = {
    nDelayed: false,
    pLastAngle: 0,
    nLastAngle: 0,
    pFound: false,
    nFound: false,
    pAngle: 0,
    nAngle: 0,
};

if (user.skin !== user.previousSkin) {
    skinLoaded = false;

    setTimeout(() => {
        skinLoaded = true;
    }, 1500);
}


const toRad = (degrees) => {
    degrees = degrees % 360;
    if (degrees < 0) {
        degrees += 360;
    }
    return (degrees * Math.PI) / 180;
};

const toDegree = (radians) => {
    return (radians * 180) / Math.PI;
};

function getDistance(a, b) {
    if (a && b) return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
}

function getAngle(a, b) {
    if (a && b) return Math.atan2(a.y - b.y, a.x - b.x);
}

class Sploop {
    static place(id, angle = Config.angle) {
        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);
        const back = Config.angle;

        Game.send(0, id);
        Game.send(19, 255 & angle, angle >> 8 & 255);
        Sploop.watch(back, true);
        Game.send(18);
        Game.send(0, Config.weapon);
    }

    static equip(id) {
        if (user.skin !== id && skinLoaded == true) {
            Game.send(5, id);
        }
    }

    static parseAngle(a) {
        const b = (a + Math.PI) * 65535 / (Math.PI * 2);
        return [b & 255, b >> 8 & 255];
    }

    static walk(angle = Config.move) {
        if (typeof angle !== 'number') {
            return Game.send(15);
        } else {
            angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);
            Game.send(1, 255 & angle, (angle >> 8) & 255);
        }
    }

    static take(id) {
        Game.send(0, id);
    }

    static chat(text) {
        const msg = encoder.encode(text);
        Game.send(7, ...msg);
    }

    static hit(angle) {
        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);

        Game.send(19, 255 & angle, (angle >> 8) & 255);
        Game.send(18);
    }

    static watch(angle, isTransformed = false) {

        if (isTransformed) {
            Game.send(13, 255 & angle, angle >> 8 & 255);
            return;
        } else {
            const angle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
            Game.send(13, 255 & angle2, angle2 >> 8 & 255);
        }
    }

    static offensive() {
        let offensive = () => {
            let distance = enemy ? getDistance(enemy, user) : 0;

            if (user.x >= 160 && user.y >= 8000 && user.x <= 9840 && user.y <= 9000) return 9;
            if (enemy && distance <= 300) return false && distance <= 150 ? 6 : 6;

            return 6;
        }

        setTimeout(Sploop.equip(offensive()), 0);
    }

    static invisHit(hitWith, angle, switchBackTo, lookBackTo = Config.angle) {
        if (!weaponReload) return;

        Game.send(0, hitWith);
        Sploop.hit(angle);
        Game.send(0, switchBackTo);
        Sploop.watch(lookBackTo);
    }

    static ally(build) {
        let id = build.typeof === "number" ? build : build.id2;
        if (user.team) {
            let length = user.team.length;
            for (let index = 0; index < length; index++) {
                let teammate = user.team[index];
                if (build.id2 == teammate.id2) {
                    return true;
                }
            }
        }
        return false;
    }

    static mine(build) {
        if (this.ally(build) || user.id2 == build.id2) {
            return !0;
        }
        return !1;
    }

    static healthChange(health, oldHealth) {
        if (oldHealth > health) {
            user.hitDate = Config.counter;
        };

        user.health = health;
    }

    static canPlace(where, checkIsPlayer) {

        let placeCoord = {
            y: user.y + 80 * Math.sin(where),
            x: user.x + 80 * Math.cos(where),
        };
        return checkIsPlayer ? Entity.find(entity => entity && entity.type == 0 && getDistance(placeCoord, entity) < 90) : Entity.find(entity => entity && [3, 4, 1, 19, 20, 38, 25, 34, 33, 32, 21, 29, 1].includes(entity.type) ? getDistance(placeCoord, entity) < 135 : getDistance(placeCoord, entity) < 90);

        console.log("check canPlace");
    }

    static instaToggled() {
        Sploop.equip(2);
        Sploop.place(4, Config.angle);
        Sploop.invisHit(0, Config.angle, 1);
        setTimeout(() => Sploop.offensive(), 1200);
    }

    static syncCool(angle) {
        if (enemy.skin != 6 && enemy.skin != 4) Sploop.equip(2);
        Sploop.invisHit(0, angle, 1);
        setTimeout(() => Sploop.offensive(), 1200);
    }

    static antiTrap(id) {
        const originalAngle = Config.angle;
        const angleStep = 360 / 90;
        for (let i = 0; i < 3; i++) {
            const angle = i * angleStep;
            setTimeout(() => {
                Sploop.place(id, angle)
            }, 0);
        }
    }

    static rotateAroundObject(x, y) {
        let currentRotationAngle = 0;
        let lerpProgress = 0;
        const lerpDuration = 1000;
        if (!weaponReload) {
            currentRotationAngle += 0.05;
            if (currentRotationAngle > Math.PI * 2) {
                currentRotationAngle -= Math.PI * 2;
            }
            const targetX = x + 100 * Math.cos(currentRotationAngle);
            const targetY = y + 100 * Math.sin(currentRotationAngle);
            const targetLookAngle = getAngle({ x: user.x, y: user.y }, { x: targetX, y: targetY });
            if (Toggle.aimLerpAngle) {
                lerpProgress += Date.now() / lerpDuration;
                const lerpedAngle = Sploop.lerpAngle(user.angle, targetLookAngle, Math.min(1, lerpProgress));
                const b = Sploop.parseAngle(lerpedAngle);
                Game.send(13, b[0], b[1]);

                if (lerpProgress >= 1) {
                    lerpProgress = 0;
                }
            } else {
                const b = Sploop.parseAngle(targetLookAngle);
                Game.send(13, b[0], b[1]);
            }
        }
    }

    static lerpAngle(a, b, t) {
        const da = (b - a + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        return a + da * t;
    }

    static healingTick(speed) {
        const spiker = Entity.find(a => a && [2, 7, 17].includes(a.type) && !Sploop.mine(a) && !teammates.includes(a.id2) && getDistance(a, user) < 60);

        setTimeout(() => {
            return Sploop.place(2);
        }, (Config.serverUpdate - 20 - Config.ping) + parseInt(speed));

        if (user.inTrap) {
            if (spiker) {
                setTimeout(() => {
                    return Sploop.extraHealSupport(3);
                }, parseInt(speed));
            }
        }

        let distance = enemy ? getDistance(enemy, user) : 0;
        if (enemy) {
            const currentTime = Date.now();
            const timeSinceLastPlace = currentTime - lastPlaceTime;
            if (user.health < healthThreshold && distance <= enemyThreshold) {
                if (Toggle.autoHat) Sploop.equip(Toggle.onlyDefendCrystal ? 4 : 6);
                if (timeSinceLastPlace >= spamCooldown && placeExecutions < maxPlaceExecutions) {
                    placeExecutions++;
                    lastPlaceTime = currentTime;
                    Sploop.place(2, getAttackDir());
                    const nextInterval = Math.max(300, spamCooldown - distance / 2);
                    setTimeout(() => {
                        if (placeExecutions < maxPlaceExecutions) {
                            tripleHeal();
                            lastPlaceTime = Date.now();
                        }
                    }, nextInterval);
                }
            } else {
                placeExecutions = 0;
            }

            let spikeNearby = Entity.find(e => e && [2, 7, 17].includes(e.type) && getDistance(e, enemy) <= 55 && !Sploop.mine(e) && !teammates.includes(e.id2));
            let enemyCanSync = Entity.find(e => e && [2, 28, 57].includes(e.weapon) && !Sploop.mine(e) && !teammates.includes(e.id2));

            if (spikeNearby && distance <= 200 && enemyCanSync) {
                return Sploop.extraHealSupport(4);
            }
        }

        if (user.health < 20) {
            setTimeout(() => {
                return Sploop.extraHealSupport(4);
            }, Config.serverUpdate - Config.ping);
        }
    }

    static extraHealSupport(count) {
        for (let i = 0; i <= count; i++) Sploop.place(2, getAttackDir())
    }

    static update() {
        Config.counter += 1;
        Config.resolver();
        Config.last = Date.now();

        if (user.alive) {
            user.timeOfLastOmg = 0;
            user.shameCounter = 0;

            if (user.health > user.prevHealth) {
                if (user.shameCounter < 8) {
                    if (Date.now() - user.timeOfLastDmg < 200) {
                        user.shameCounter += 1;
                    }
                } else {
                    user.shameCounter = 0;
                }
                if (user.shameCounter > 1) {
                    if (Date.now() - user.timeOfLastDmg >= 200) {
                        user.shameCounter -= 1;
                    }
                }
            }

            if (user.health < user.prevHealth) user.timeOfLastDmg = Date.now();
            if (user.clowned) user.shameCounter = 0;

            // Auto heal
            const speed = 22.5;

            if (Toggle.autoHeal && user.health < 100) {
                Sploop.healingTick(speed);
            }

            if (Toggle.aimBot && !user.inTrap) {
                if (getDistance(enemy, user) <= 200 && Config.aimbot) {
                    const b = Sploop.parseAngle(getAngle(enemy, user));
                    Game.send(13, b[0], b[1]);
                    if (getDistance(enemy, user) <= 120) {
                        placeObjects++

                        if (placeObjects >= 5) {
                            Sploop.place(7, getAngle(enemy, user));
                            placeObjects = 0;
                        }
                    }
                }
            }
            let wasBreaking = Config.breaking;
            Config.breaking = false;
            let userInTrap = Entity.find(e => e && e.type == 6 && getDistance(e, user) <= 56 && !Sploop.mine(e) && !teammates.includes(e.id2));

            if (userInTrap && Toggle.autoBreak) {
                Sploop.rotateAroundObject(userInTrap.x, userInTrap.y);

                Config.breaking = true;
                Config.aimbot = false;
                user.inTrap = true;
                var distance = getDistance(enemy, user)
                var breakingTrap = getAngle(userInTrap, user)
                Sploop.equip(11);
                Sploop.invisHit(1, breakingTrap, 1);

                if (Toggle.antiTrap) {
                    placeObjects++;
                    if (placeObjects >= 6) {
                        Sploop.antiTrap(7);
                        placeObjects = 0;
                    }
                }

                Config.oldTrap = userInTrap;

            } else if (wasBreaking) {

                if (Config.oldTrap) {
                    let oldTrap = getAngle(Config.oldTrap, user);
                    Sploop.place(7, oldTrap);
                    setTimeout(() => Sploop.offensive(), 1300);
                    Sploop.equip(6);

                }

                user.inTrap = false;
                Config.breaking = false;
                Config.aimbot = true;
                Config.oldTrap = null;
            }

            if (Toggle.safeWalk && !user.inTrap) {
                const inSpike = Entity.find(a => a && [2, 7, 17].includes(a.type) && !Sploop.mine(a) && !teammates.includes(a.id2) && getDistance(a, user) <= 120);
                const spikeAim = inSpike ? getAngle(inSpike, user) : null;
                if (inSpike) {
                    placeObjects++;
                    if (getDistance(enemy, user) <= 250 && placeObjects >= 8) {
                        Sploop.place(4, getAngle(enemy, user));
                        Sploop.place(7, spikeAim * 1.2);
                        placeObjects = 0;
                    }

                    Sploop.take(1);

                    if (wsPushing) return Sploop.walk('stop');

                    if (inSpike.length > 2) {
                        const greatBreak = Technices.calculateBestBreakAngle(inSpike);
                        Sploop.hit(greatBreak);
                    } else {
                        Sploop.hit(spikeAim);
                    }
                }
            }

            let wasPushing = Config.pushing;
            Config.pushing = false;

            if (enemy && !userInTrap && user.alive) {
                let distance = getDistance(enemy, user);

                if (Toggle.autoPush && distance <= 165) {
                    let trap = Entity.find(c => c && getDistance(c, enemy) <= 60 && c.type == 6 && Sploop.mine(c) && !teammates.includes(c.id2));

                    if (wsPushing && !trap) {
                        wsPushing = false;
                        Sploop.walk('stop');
                    }

                    if (trap) {
                        let spikes = Entity.filter(c => c && [2, 7, 17].includes(c.type) && Sploop.mine(c) && getDistance(c, trap) <= 95 && !teammates.includes(c.id2));
                        if (wsPushing && !spikes.length) {
                            wsPushing = false;
                        }
                        if (spikes.length) {
                            let spike = spikes.sort((a, b) => getDistance(a, enemy) - getDistance(b, enemy))[0];
                            let angle = getAngle(enemy, spike);
                            distance = getDistance(enemy, spike) + 70;
                            let position = {
                                x: spike.x + (distance * Math.cos(angle)),
                                y: spike.y + (distance * Math.sin(angle))
                            };

                            distance = getDistance(position, user);

                            if (distance > 15) {
                                wsPushing = true;
                                angle = getAngle(position, user)
                            } else {
                                wsPushing = true;
                                angle = getAngle(enemy, user)
                            }

                            Config.pushing = true;
                            Sploop.walk(angle)
                        }
                    }
                }

                distance = getDistance(enemy, user)
                if (Toggle.autoPlace && distance <= 190) {
                    let trap = Entity.find(c => c && c.type == 6 && Sploop.mine(c) && getDistance(c, enemy) <= 60 && !teammates.includes(c.id2));
                    let enemyPos = { x: enemy.x + enemy.xVel, y: enemy.y + enemy.yVel }
                    let userPos = { x: user.x + user.xVel, y: user.y + user.yVel }
                    distance = getDistance(enemyPos, userPos);
                    let angle = getAngle(enemyPos, userPos)
                    const nEA = getAngle(enemy, user)
                    const trapAngle = getAngle(trap, user);

                    if (trap) {
                        Config.aimbot = false;
                        enemy.inTrap = true;
                        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 20) {
                            Sploop.rotateAroundObject(angle.x, angle.y)

                            let a = Sploop.canPlace(nEA + angle, false).length > 1;
                            let b = Sploop.canPlace(nEA - angle, false).length > 1;
                            if (!a && positive.angle !== angle && !positive.found) {
                                positive.angle = angle;
                                positive.found = true;
                            }

                            if (!b && negative.angle !== angle && !negative.found) {
                                negative.angle = angle;
                                negative.found = true;
                            }
                        }

                        const cantPlace = Sploop.canPlace(nEA + positive.angle, false).length > 1;
                        const cantPlace2 = Sploop.canPlace(nEA - negative.angle, false).length > 1;
                        if (!cantPlace && cantPlace2) {
                            positive.lastAngle = positive.angle;
                            placeObjects++

                            if (placeObjects >= 15) {
                                Sploop.place(4, nEA + positive.angle);
                                placeObjects = 0;
                            }
                            positive.found = false;
                        }

                        if (!cantPlace2 && cantPlace) {
                            negative.lastAngle = negative.angle;
                            placeObjects++

                            if (placeObjects >= 15) {
                                Sploop.place(4, nEA - negative.angle);
                                placeObjects = 0;
                            }
                            negative.found = false;
                        }
                    } else {
                        enemy.inTrap = false;
                        Config.aimbot = true;
                        if (distance <= 210) {

                            let cantPlace = Sploop.canPlace(nEA, true).length > 1;
                            if (!cantPlace) {
                                placeObjects++
                                Sploop.place(7, nEA);

                                if (placeObjects >= 6) {
                                    Sploop.place(7, nEA + 0.45);
                                    Sploop.place(7, nEA - 0.45);
                                    placeObjects = 0;
                                }

                                if (distance <= 165) {
                                    Technices.placeTrapsAround();
                                }
                            }
                        }
                    }
                }

                if (Toggle.autoSync && distance <= 165) {
                    Config.aimbot = false;
                    let userPos = { x: user.x + user.xVel, y: user.y + user.yVel }
                    let enemyPos = { x: enemy.x + user.xVel, y: user.y + user.yVel };
                    let spike = Entity.find(c => c && c.type == 7 && Sploop.mine(c) && !teammates.includes(c.id2) && getDistance(c, enemy) <= 62);

                    const nEA = getAngle(enemyPos, userPos)

                    if (enemy.health < 65 && !user.inTrap) {
                        Sploop.syncCool(nEA);
                    }
                }

                if (!enemy.inTrap && !user.inTrap && Toggle.spikeSyncPerfect && distance <= 165) {
                    Config.aimbot = false;
                    let userPos = { x: user.x + user.xVel, y: user.y + user.yVel }
                    let enemyPos = { x: enemy.x + user.xVel, y: user.y + user.yVel };

                    let spike = Entity.find(a => a && [2, 7, 17].includes(a.type) && Sploop.mine(a) && !teammates.includes(a.id2) && getDistance(a, enemyPos) <= 55);
                    let touch = (spike.x - 45, spike.y - 45, spike.x + 45, spike.y + 45, enemyPos.x, enemyPos.y);

                    const nEA = getAngle(enemyPos, userPos)

                    if (touch) {
                        Sploop.syncCool(nEA);
                    }
                }

                if (!enemy.inTrap && Toggle.spikeNearSync && distance <= 165) {
                    const spikes = Entity.find(a => a && [2, 7, 17].includes(a.type) && Sploop.mine(a) && !teammates.includes(a.id2) && getDistance(a, enemyPos) <= 135);
                    Config.spikeSync = true;

                    const near = (spikes.x - 45, spikes.y - 45, spikes.x + 45, spikes.y + 45, enemyPos.x - 45, enemyPos.y - 45, enemyPos.x + 45, enemyPos.y + 45);
                    if (near && Config.spikeSync) {
                        let spikeangle = getAngle(spikes, user)
                        Sploop.place(4, spikeangle);
                        Sploop.syncCool(spikeangle);

                        Config.spikeSync = false;
                        setTimeout(() => {Config.spikeSync = true}, 2000);
                    }
                }

                if (wasPushing && !Config.pushing) Sploop.walk('stop');
            }
        }
    }
}

const prevRect = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.clearRect = function (x, y, width, height) {
    if (this.canvas.id === "game-canvas") {
        ctxt = this.canvas.getContext("2d");
    }
    return prevRect.apply(this, arguments);
}
class Img extends Image {
    constructor(src, width = Img.width, height = Img.height) {
        super(width, height);

        this.src = src;
    }
}

function makeColumn(offsetX, sid, name, icon) {
    const column = document.createElement("column");
    column.style = `
    width: 350px;
    height: auto;
    color: white;
    z-index: 3;
    top: ${100 * column.length}px;
    left: ${offsetX}%;
    background-color: #1e1e1e;
    position: absolute;
    pointer-events: all;
    touch-events: all;
    scrollbar-color: #1e1e1e transparent;
    text-align: center;
    transition: 0.5s;
    `;

    column.id = sid;
    column.innerHTML = `<i class="menu-text-icon ${icon}"></i> - ${name} - <i class="menu-text-icon ${icon}"><br>`;
    column.style.userSelect = "none";
    column.draggable = true;

    document.documentElement.appendChild(column);

    let _offsetX = offsetX / window.innerWidth;
    let offsetY = 5 / window.innerHeight;

    column.addEventListener("dragstart", e => {
        const elementX = parseInt(column.style.left);
        const elementY = parseInt(column.style.top);
        _offsetX = elementX - e.clientX;
        offsetY = elementY - e.clientY;
    });

    column.addEventListener("dragend", e => {
        column.style.top = e.clientY + offsetY + "px";
        column.style.left = e.clientX + _offsetX + "px";
    });
}
makeColumn(40, "column", "AntiMooAddict", "bi bi-display");

class Toggles {
    constructor(column, name, option) {
        this.toggleElement = document.createElement("input");
        this.toggleText = document.createElement("label");
        this.lineSeparator = document.createElement("br");
        this.toggleText.style = "display: inline-block; width: 97.5%; height: 35px; background: #313131; font-size: 12px; margin-top: 2px; color: #fff; transition: 0.5s;";
        this.toggleText.className = "sigittariusFeature";
        this.toggleElement.type = "checkbox";
        this.toggleElement.style.visibility = "hidden";
        this.toggleElement.checked = Toggle[option];
        this.toggleText.style.background = this.toggleElement.checked ? "#313131" : "#1e1e1e";
        this.toggleElement.onchange = () => {
            Toggle[option] = !Toggle[option];

            this.toggleText.style.background = this.toggleElement.checked ? "#313131" : "#1e1e1e";
        }

        this.toggleText.innerHTML = name;
        document.getElementById(column).appendChild(this.toggleText);
        document.getElementById(column).appendChild(this.lineSeparator);
        this.toggleText.appendChild(this.toggleElement);
    }
}

new Toggles("column", "Markers", "markers");
new Toggles("column", "Smooth HP", "smoothBarHealth");
new Toggles("column", "Aim Force", "aimForce")
new Toggles("column", "Lerp Angle", "aimLerpAngle");
new Toggles("column", "Auto Smart Break", "autoBreak");
new Toggles("column", "Auto Heal", "autoHeal");
new Toggles("column", "Anti Trap", "antiTrap");
new Toggles("column", "Safe Walk", "safeWalk")
new Toggles("column", "Auto Placer", "autoPlace");
new Toggles("column", "Auto Replacer", "Replacer");
new Toggles("column", "Auto Sync", "autoSync");
new Toggles("column", "Spike Tick", "spikeSyncPerfect");
new Toggles("column", "NearSpike Sync", "spikeNearSync");
new Toggles("column", "Trap Sync", "trapSync");
new Toggles("column", "Aim Bot", "aimBot");
new Toggles("column", "Auto Push", "autoPush");

class Aim {
    constructor() {
        this._targetAim = 0;
        this.safeAim = 0;
        this.x = 0;
        this.y = 0;
        this.x2 = 0;
        this.y2 = 0;
    }

    set targetAim(val) {
        this._targetAim = val;

        this.x2 = window.innerWidth / 2 + Math.cos(val) * 10;
        this.y2 = window.innerHeight / 2 + Math.sin(val) * 10;
    }

    countAngle(x, y, x1, y1) {
        const opposite = y1 - y;
        const adjacent = x1 - x;

        return 1 / Math.tan(opposite / adjacent);
    }

    safeAngle(baseAngle) {
        const a = 0.95;

        return baseAngle * a + this.safeAim * (1 - a);
    }

    executeModule() {
        const velocity = 0.5 + Math.random() * 0.5;
        const velocityX = velocity + Math.random() * 0.15 - 0.15 / 2;
        const velocityY = velocity + Math.random() * 0.15 - 0.15 / 2;
        const deviationX = Math.random() * 0.35 - 0.22 / 2;
        const deviationY = Math.random() * 0.35 - 0.22 / 2;

        this.x = deviationX + (this.x || 0) * velocityX + this.x2 * (1 - velocityX);
        this.y = deviationY + (this.y || 0) * velocityY + this.x2 * (1 - velocityY);

        const Aim = this.countAngle(window.innerWidth / 2, window.innerHeight / 2, this.x, this.y);

        this.safeAim = Aim;

        if (Toggle.aimForce) Sploop.watch(Aim);
    }
}

const Images = {
    gaugeBackground: new Img("https://i.imgur.com/xincrX4.png"),
    gaugeFront: new Img("https://i.imgur.com/6AkHQM4.png"),
};

class drawingOptions {

    static previousPositions = new Map();

    static drawPossiblePlace(ctx, entity, fst) {
        const animationDuration = 37;
        const currentTime = Date.now();

        if (!this.previousPositions.has(entity)) {
            this.previousPositions.set(entity, { x: entity.x, y: entity.y, startTime: currentTime });
        }

        const previousPosition = this.previousPositions.get(entity);
        const elapsedTime = currentTime - previousPosition.startTime;

        if (elapsedTime < animationDuration) {
            const progress = elapsedTime / animationDuration;
            const interpolatedX = previousPosition.x + (entity.x - previousPosition.x) * progress;
            const interpolatedY = previousPosition.y + (entity.y - previousPosition.y) * progress;

            this.drawCircle(ctx, interpolatedX, interpolatedY, fst);
        } else {
            this.drawCircle(ctx, entity.x, entity.y, fst);

            previousPosition.x = entity.x;
            previousPosition.y = entity.y;
            previousPosition.startTime = currentTime;
        }
    }

    static drawCircle(ctx, x, y, fst) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = fst;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    static lines(ctx, entity, entity2) {
        ctx.save();
        ctx.globalAlpha = 0.75;
        ctx.strokeStyle = "#000000";
        ctx.lineCap = "round";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(entity.x, entity.y);
        ctx.lineTo(entity2.x, entity2.y);
        ctx.stroke();
        ctx.restore();
    }

    static marker(ctx, color) {
        ctx.strokeStyle = "#303030";
        ctx.lineWidth = 3;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    static drawImage(ctx, image) {
        if (!(image && image.naturalHeight !== 0)) return;
        const w = image.width;
        const h = image.height;
        const s = .5;
        ctx.drawImage(image, -s * w / 2, -s * h, w * s, h * s);
    }

    static renderBar(ctx, entity, value, maxValue) {
        const {x, y, radius} = entity;
        const background = Images.gaugeBackground;
        const front = Images.gaugeFront;
        const scale = .5;
        const width = front.width * scale;
        const fill = value / maxValue * (width - 10);
        ctx.save();
        ctx.translate(x, y + radius + front.height * scale);
        this.drawImage(ctx, background);
        ctx.fillStyle = "#AA0000";
        ctx.fillRect(-width / 2 + 5, -scale * front.height + 5, fill, scale * front.height - 10);
        this.drawImage(ctx, front);
        ctx.restore();

        return front.height * scale;
    }

    static reloadBar(ctx, entity, reload) {
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const fill = clamp(reload, 0, reload);
        const value = fill;
        return this.renderBar(ctx, entity, value, reload);
    }
}

const drawCombatVisuals = (target, ctx, isTeam) => {
    const colors = ["#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493", "#F9CCCA", "#E8CCD7", "#FFC0EB", "#FCD0B4", "#FF007F", "#F4B4C4", "#F6B8B8"];
    const nEA = getAngle(enemy, user);

    if (Toggle.autoInsta && getDistance(enemy, user) <= 90 && !enemy.inTrap && !user.inTrap) {
        let cantPlace3 = Sploop.canPlace(nEA, true).length > 1;
        let placeCoord = {
            y: user.y + 80 * Math.sin(nEA),
            x: user.x + 80 * Math.cos(nEA),
        };
        if (!cantPlace3) {
            drawingOptions.drawPossiblePlace(ctx, placeCoord, colors[Math.floor(Math.random() * colors.length)]);
        }
    }

    if (Toggle.autoPlace && getDistance(enemy, user) <= 230 && !enemy.inTrap && !user.inTrap) {
        let cantPlace3 = Sploop.canPlace(nEA, true).length > 1;

        let placeCoord = {
            y: user.y + 80 * Math.sin(nEA),
            x: user.x + 80 * Math.cos(nEA),
        };

        if (!cantPlace3) {
            drawingOptions.drawPossiblePlace(ctx, placeCoord, "#91B2DB");
        }

    }

    if (Toggle.autoPlace && getDistance(enemy, user) <= 190 && enemy.inTrap && !user.inTrap) {
        let placeCoord = {
            y: user.y + 80 * Math.sin(nEA + positive.angle),
            x: user.x + 80 * Math.cos(nEA + positive.angle),
        };
        let placeCoord2 = {
            y: user.y - 80 * Math.sin(nEA - negative.angle),
            x: user.x - 80 * Math.cos(nEA - negative.angle),
        };

        let cantPlace = Sploop.canPlace(nEA + positive.angle, false).length > 1;
        let cantPlace2 = Sploop.canPlace(nEA - negative.angle, false).length > 1;
        if (!cantPlace) {
            drawingOptions.drawPossiblePlace(ctx, placeCoord, "#91B2DB");
        }
        if (!cantPlace2) {
            drawingOptions.drawPossiblePlace(ctx, placeCoord2, "#E8CCD7");
        }
    }
}

window.drawingBoard = (target, ctx, isTeam) => {
    if (!user.alive) return;
    drawCombatVisuals(target, ctx, isTeam);
};

class Hooks {
    static renderItem(ctx, target) {}
}

class Script {
    setup() {
        this.run();
    };

    send() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            if (pps >= 599) {
                return;
            } else {
                return this.ws.send(new Uint8Array([...arguments]))
                pps++
            }
        }
    }

    message(event) {
        let data = event.data;
        let decoded = typeof data === 'string' ? JSON.parse(data) : new Uint8Array(data);
        let length = decoded.length;
        switch (decoded[0]) {
            case 20:
                Config.enemiesNear = []
                enemy = null;
                user.previousSkin = user.skin;
                user.prevHealth = user.health;

                Config.tickSpeed = Date.now() - time;
                time = Date.now();
                for (let int = 1; int < length; int += 19) {
                    Sploop.canPlace(Config.angle);

                    let type = decoded[int],
                        owner = decoded[int + 1],
                        index = decoded[int + 2] | decoded[int + 3] << 8,
                        x = decoded[int + 4] | decoded[int + 5] << 8,
                        y = decoded[int + 6] | decoded[int + 7] << 8,
                        currentItem = decoded[int + 10],
                        broken = decoded[int + 8],
                        angle = decoded[int + 9] / 255 * 6.283185307179586 - Math.PI,
                        rawAngle = decoded[int + 9],
                        skin = decoded[int + 11],
                        team = decoded[int + 12],
                        projectileType = decoded[int + 14],
                        health = decoded[int+ 13] / 255 * 100,
                        clown = decoded[int + 8] === 128,
                        datas = data;

                    let temp = Entity[index] || {
                        fd: 2,
                        active: true,
                        health: 100,
                        x: 0,
                        y: 0
                    };

                    if (2 && broken) {
                        if (Toggle.trapSync && !user.inTrap) { // dont work, i fix it...
                            Config.trapSyncer = true;
                            const trapBroken = Entity[index]

                            if (trapBroken && trapBroken.type == 6) {
                                if (trapBroken.id2 !== enemy.id2) {
                                    if (getDistance(trapBroken, user) <= 110 && getDistance(enemy, user) <= 100) {
                                        const objectAngle = getAngle(trapBroken, user);
                                        const enemyAngle = getAngle(enemy, user);
                                        if (Config.trapSyncer) {
                                            if (enemy.skin != 4 && enemy.skin != 6) if (Toggle.autoHat) Sploop.equip(2);
                                            Sploop.place(4, objectAngle);
                                            Sploop.invisHit(0, objectAngle, 1);
                                            Config.trapSyncer = false;
                                            setTimeout(() => { Config.trapSyncer = true }, 3500);
                                        }
                                    }
                                }
                            }
                        }

                        if (Toggle.Replacer) {
                            const nearestObjects = Entity[index];
                            if (nearestObjects) {
                                if ([2, 5, 7, 9, 17].includes(nearestObjects.type) && getDistance(nearestObjects, user) <= 145 && getDistance(enemy, user) <= 220) {
                                    setTimeout(() => {
                                        placeDelay -= 1e3 / 9;
                                        if (nearestObjects.type == 6) {
                                            if (user.inTrap) {
                                                Sploop.place(7, getAngle(enemy, user));
                                                Sploop.place(7, getAngle(nearestObjects, user));
                                                Sploop.place(4, (getAngle(enemy, user) + Math.PI));
                                                Sploop.place(4, (getAngle(enemy, user) + 0.9));
                                            }
                                        } else {
                                            Sploop.place(4, getAngle(nearestObjects, user));
                                        }
                                        if (getDistance(enemy, user) < 100) {
                                            if (nearestObjects.type == 6) {
                                                if (enemy.inTrap) {
                                                    Sploop.place(7, getAngle(enemy, user));
                                                    Sploop.place(7, getAngle(nearestObjects, user));
                                                } else {
                                                    Sploop.place(7, getAngle(enemy, user));
                                                    Sploop.place(4, (getAngle(enemy, user) + 1.2));
                                                    Sploop.place(4, (getAngle(enemy, user) - 1.2));
                                                }
                                            } else {
                                                Sploop.place(4, getAngle(nearestObjects, user));
                                                Sploop.place(4, getAngle(enemy, user));
                                            }
                                        }
                                    }, placeDelay);

                                    placeDelay += 1e3 / 9;
                                }
                            }
                        }

                        Entity[index] = null;
                    }

                    if (!type && broken == 2) {
                        temp = {};
                    } else {
                        temp.type = type;
                        temp.angle = angle;
                        temp.rawAngle = rawAngle;
                        temp.id = index;
                        temp.weapon = currentItem;
                        temp.health = health;
                        temp.health2 = Math.trunc(health);
                        temp.xVel = temp.x - x;
                        temp.yVel = temp.y - y;
                        temp.speed = Math.hypot(y - temp.y, x - temp.x);
                        temp.move = Math.atan2(y - temp.y, x - temp.x);
                        temp.x = x;
                        temp.y = y;
                        temp.id2 = owner;
                        temp.skin = skin;
                        temp.datas = datas;
                        temp.team = team;
                        temp.projectileType = projectileType;
                        temp.clown = clown;

                        Config.enemiesNear.push(temp)

                        Entity[index] = temp;
                    }

                    if (temp.id === user.id) {
                        Sploop.healthChange(temp.health, user.health);
                        Object.assign(user, temp)
                    } else if (!temp.type && (!user.team || temp.team != user.team)) {
                        let distance = Math.hypot(user.y - temp.y, user.x - temp.x);
                        let distance2 = enemy ? Math.hypot(user.y - enemy.y, user.x - enemy.x) : null;
                        if (enemy) {
                            if (distance < distance2) enemy = temp;
                        } else {
                            enemy = temp;
                        }
                    }

                }
                Sploop.update();
                break;

            case 35:
                user.id = decoded[1];
                user.alive = true;
                user.spawnDate = Date.now();
                user.health = 100;
                Config.weapon = 0;

                if (!user.hatsBought) {
                    for (let hats = 0; hats < 12; hats++) Sploop.equip(hats);
                    user.hatsBought = true;
                }

                Sploop.equip(7);
                Sploop.place(5);
                break;

            case 15:
                Config.ping = decoded[1];
                break;
            case 19:
                user.health = 0;
                user.speed = 0;
                user.age = 0;
                user.alive = false;
                kills = 0;
                break;
            case 28:
                kills++

                if (wsPushing) {
                    wsPushing = false;
                    Sploop.walk('stop');
                }

                enemy.health = 0;
                break;
            case 24:
                var array_with_ID = [...data.slice(3, data.length)];
                array_with_ID.splice(array_with_ID.indexOf(user.id), 1);
                teammates = array_with_ID;
                break;

            case 16:
                var array_with_ID2 = [...data.slice(2, data.length)];
                array_with_ID2.splice(array_with_ID2.indexOf(user.id), 1);
                teammates = array_with_ID2;
                break;

            case 27:
                teammates = [];
                break;
            case 8:
                var a = Math.max(0, decoded[1] | decoded[2] << 8 | decoded[3] << 16 | decoded[4] << 24);
                user.age = ~~(Math.log(1 + a) ** 2.4 / 13);
                break;

            case 2:
                if (decoded.byteLength > 1) {
                    user.item = [];
                    for (let a = 1; a < decoded.byteLength; a++) {
                        user.item.push(decoded[a]);
                    }
                }
                break;
            case 29:
                for (let int = 1; int < data.length; int += 5) {
                    const id = data[int + 1] | (data[int + 2] << 8);
                    const weapon = data[int + 3];
                    const type = data[int];

                    if (type === 0) {
                        if (weaponReload == true) {
                            if (id === user.id2) {
                                let maxReload = items[weapon].reload;
                                weaponReload = false;
                                setTimeout(() => {
                                    weaponReload = true;
                                }, maxReload);
                            }
                        }
                    }
                }
                break;
        }

        Placer.update();
    }

    log(group, symbol, result, color) {
        return log(`%c[${group}] %c${symbol}`, `color:${color};font-weight:bold`, `color:${color}`, result);
    }

    run(ws) {
        this.ws = ws;
        window.addEventListener("mousemove", (a) => {
            Config.angle = Math.atan2(a.pageY - window.innerHeight / 2, a.pageX - window.innerWidth / 2);
        });


    }

    constructor() {
        this.ws = null;
    }
};

const Setup = () => {
    Game = new Script();
    Game.log(`Setup`, `⦿`, '', '#000000');
    let data = Config.messages;

    data[0][1] = { name: 'Player update', string: false };
    data[0][2] = { name: 'Verify', string: false };
    data[0][5] = { name: 'Choose', string: false };
    data[0][7] = { name: 'Hit', string: false };
    data[0][14] = { name: 'Resource update', string: false };
    data[0][16] = { name: 'Projectile Hit', string: false };
    data[0][18] = { name: 'Chat', string: false };
    data[0][19] = { name: 'Choose x3', string: true };
    data[0][20] = { name: 'Choose x2', string: false };
    data[0][22] = { name: 'Ping update', string: false };
    data[0][23] = { name: 'Ping update', string: false };
    data[0][24] = { name: 'Create clan', string: false };
    data[0][25] = { name: 'Leave clan', string: false };
    data[0][26] = { name: 'Create clan', string: false };
    data[0][27] = { name: 'Leave clan', string: false };
    data[0][30] = { name: 'Place', string: false };

    data[1][2] = { name: 'Spawn', string: true };
    data[1][8] = { name: 'Player setup', string: true };
    data[1][9] = { name: 'Leaderboard update', string: true };
    data[1][11] = { name: 'Text', string: true };
    data[1][13] = { name: 'Death', string: true };
    data[1][19] = { name: 'Choose', string: true };
    data[1][35] = { name: 'new Verify', string: true };

    for (let index = 0; index <= 1; index++) {
        let length = data[index].length;
        for (let id = 0; id < length; id++) {
            if (data[index][id]) data[index][id].id = id;
        }
        ;
    }
    ;
};

Setup();

WebSocket.prototype.unmodifiedSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (arguments) {
    this.unmodifiedSend(arguments);
    if (ws !== this) {
        this.addEventListener('message', event => Game.message(event));
        ws = this;
        Game.run(this);
        Config.WS = this.url;
    }
}

let blockReact = ['clan-menu-clan-name-input', 'nickname', 'chat'];

const keyChange = (event, down) => {
    if (blockReact.includes(document.activeElement.id.toLowerCase())) return `Blocked key change.`
    keyDown[event.keyCode] = down;
    let distEnemy = getDistance(enemy, user);
    let aimEnemy = getAngle(enemy, user);
    let isPrimary = [49, 97].includes(event.keyCode);
    let isSecondary = [50, 98].includes(event.keyCode);
    console.debug(event.code)
    if (event.code == 'KeyY') {
        let katana = [2, 12, 9, 19, 20, 15, 8, 28, 16];
        katana.forEach(e => Game.send(14, e));
    }

    if (down && (isPrimary || isSecondary)) Config.weapon = Number(isSecondary);
    switch (event.code) {
        case "KeyR":
            Sploop.instaToggled();
            break;
        case "KeyG":
            Sploop.equip(6);
            break
        case "ShiftRight":
            Sploop.equip(7)
            break;
        case "KeyB":
            Sploop.equip(2)
            break
        case "KeyZ":
            Sploop.equip(11)
            break;
    }
    Placer.update();
};

document.addEventListener("keydown", (event) => keyChange(event, true));
document.addEventListener("keyup", (event) => keyChange(event, false));

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode == 27) {
            Array.from(document.querySelectorAll("column"), menu => {
                menu.style.display = menu.style.display == "block" ? "none" : "block";
            });
        }
    });

    function enableSmoothZoom() {
        let maxScreenHeight = 1026;
        let maxScreenWidth = 1824;
        const scaleFactor = 50;
        Math.max = new Proxy(Math.max, {
            apply(target, thisArg, args) {
                const height = Math.ceil(args[0] * 1026);
                const width = Math.ceil(args[1] * 1824);
                const scaledHeight = height === window.innerHeight ? height / maxScreenHeight : height / 1026;
                const scaledWidth = width === window.innerWidth ? width / maxScreenWidth : width / 1824;
                return target.call(thisArg, scaledHeight, scaledWidth);
            },
        });

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    const style = mutation.target.getAttribute("style");
                    if (style && style.includes("display: none;")) {
                        return;
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style"],
        });

        window.addEventListener("wheel", function (event) {
            if (event.target.id !== "game-canvas") return;

            const zoomIncrement = event.deltaY > 0 ? scaleFactor : -scaleFactor;
            let increment = 0;
            const intervalId = setInterval(() => {
                increment += zoomIncrement / 10;
                maxScreenWidth += increment;
                maxScreenHeight += increment;
                maxScreenWidth = Math.max(maxScreenWidth, 100);
                maxScreenHeight = Math.max(maxScreenHeight, 100);
               window.dispatchEvent(new Event("resize"));
               if (Math.abs(increment) >= Math.abs(zoomIncrement)) {
                   clearInterval(intervalId);
               }
            }, 16);
        });
    }

    enableSmoothZoom();
})

function lerp(start, end, amt) {
    return start + (end - start) * amt;
}

let health = false;

const enhanceFillRect = function (fill, cColor) {
    return function (x, y, width, height) {
        if (this.fillStyle === "#a4cc4f") {
            this.fillStyle = cColor;

            if (Toggle.smoothBarHealth) {
                const old = health;
                const smooth = lerp(old, width, .42)

                width = smooth

                health = smooth
            }
        }
        fill.call(this, x, y, width, height);
    };
};
const customColor = "#E8CCD7";
const FillRect = CanvasRenderingContext2D.prototype.fillRect;

CanvasRenderingContext2D.prototype.fillRect = enhanceFillRect(FillRect, customColor);

window.render = (ctx, shit) => {
};

let mySpikes = [];
let myTraps = [];
window.drawMarkers = (target, id, ctx, step) => {
    const objectID = target[Variables.id]
    const isSpike = [2, 7, 17].includes(target.type);

    if (isSpike) {
        let isMySpike = user.id == objectID;
        if (isMySpike && !mySpikes.find(c => c[Variables.id2] == target[Variables.id2])) {
            mySpikes.push(target);
        }
    }

    if (myTraps && target.type == 6) {
        let isMyTrap = user.id == objectID;
        if (isMyTrap && !myTraps.find(c => c[Variables.id2] == target[Variables.id2])) {
            myTraps.push(target);
        }
    };

    let color;
    if (Toggle.markers) {
        if (teammates.includes(target[Variables.id])) {
            color = "#A4CC4F";
        } else if (objectID === user.id2) {
            color = "#E8CCD7";
        } else {
            color = "#A53F3F";
        }
    } else {
        color = "rgba(0, 0, 0, 0)";
    }

    if ([2, 6, 7, 17].includes(target.type)) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
};

let traps = [];
window.receiveMsg = async ({ data }) => {
    const decoded = typeof data === "string" ? JSON.parse(data) : new Uint8Array(data);
    switch (decoded[0]) {
        case 35:
            user.name = decoded[2];
            break;
        case 33:
            user.id = decoded[1];
            break;
        case 16: {
            const array_with_ID = [...decoded.slice(2, decoded.length)];
            array_with_ID.splice(array_with_ID.indexOf(user.id), 1);
            teammates = array_with_ID;
            return;
        }
        case 24: {
            const array_with_ID = [...decoded.slice(3, decoded.length)];
            array_with_ID.splice(array_with_ID.indexOf(user.id), 1);
            teammates = array_with_ID;
            break;
        }
        case 27:
            teammates = [];
            break;
        case 20: {
            for (let i = 1; i < decoded.length; i += 19) {
                const newEnemy = {
                    type: decoded[i],
                    id: decoded[i + 1],
                    hat: decoded[i + 11],
                    teamID: decoded[i + 12],
                    x: decoded[i + 4] | decoded[i + 5] << 8,
                    y: decoded[i + 6] | decoded[i + 7] << 8,
                    index: decoded[i + 2] | decoded[i + 3] << 8,
                    health: Math.ceil(decoded[i + 13] / 2.55),
                    angle: decoded[i + 9] * 0.02454369260617026 - 3.141592653589793,
                    broken: decoded[i + 8]
                }
                newEnemy.id === user.id && Object.assign(user, newEnemy);
                traps = traps.filter(trap => trap.index !== newEnemy.index);
            }
            if (user.clown === 128 && !user.clowned) {
                user.clowned = true;
                setTimeout(() => {
                    user.clowned = false;
                }, 3000)
            };
        }
    }
}

const TYPEOF = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
const NumberSystem = [{
    radix: 2,
    prefix: "0b0*"
}, {
    radix: 8,
    prefix: "0+"
}, {
    radix: 10,
    prefix: ""
}, {
    radix: 16,
    prefix: "0x0*"
}];

class Regex {
    constructor(code, unicode) {
        this.code = code;
        this.COPY_CODE = code;
        this.unicode = unicode || false;
        this.hooks = {};
        this.totalHooks = 0;
    }
    static parseValue(value) {
        try {
            return Function(`return (${value})`)();
        } catch (err) {
            return null;
        }
    }
    isRegexp(value) {
        return TYPEOF(value) === "regexp";
    }
    generateNumberSystem(int) {
        const copy = [...NumberSystem];
        const template = copy.map((({
            prefix,
            radix
        }) => prefix + int.toString(radix)));
        return `(?:${template.join("|")})`;
    }
    parseVariables(regex) {
        regex = regex.replace(/\{VAR\}/g, "(?:let|var|const)");
        regex = regex.replace(/\{QUOTE\}/g, "['\"`]");
        regex = regex.replace(/ARGS\{(\d+)\}/g, ((...args) => {
            let count = Number(args[1]),
                arr = [];
            while (count--) arr.push("\\w+");
            return arr.join("\\s*,\\s*");
        }));
        regex = regex.replace(/NUMBER\{(\d+)\}/g, ((...args) => {
            const int = Number(args[1]);
            return this.generateNumberSystem(int);
        }));
        return regex;
    }
    format(name, inputRegex, flags) {
        this.totalHooks += 1;
        let regex = "";
        if (Array.isArray(inputRegex)) {
            regex = inputRegex.map((exp => this.isRegexp(exp) ? exp.source : exp)).join("\\s*");
        } else if (this.isRegexp(inputRegex)) {
            regex = inputRegex.source;
        }
        regex = this.parseVariables(regex);
        if (this.unicode) {
            regex = regex.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
        }
        const expression = new RegExp(regex.replace(/\{INSERT\}/, ""), flags);
        const match = this.code.match(expression);
        if (match === null) console.debug("failed to find " + name)
        return regex.includes("{INSERT}") ? new RegExp(regex, flags) : expression;
    }
    template(type, name, regex, substr) {
        const expression = new RegExp(`(${this.format(name, regex).source})`);
        const match = this.code.match(expression) || [];
        this.code = this.code.replace(expression, type === 0 ? "$1" + substr : substr + "$1");
        return match;
    }
    match(name, regex, flags, debug = false) {
        const expression = this.format(name, regex, flags);
        const match = this.code.match(expression) || [];
        this.hooks[name] = {
            expression,
            match
        };
        return match;
    }
    matchAll(name, regex, debug = false) {
        const expression = this.format(name, regex, "g");
        const matches = [...this.code.matchAll(expression)];
        this.hooks[name] = {
            expression,
            match: matches
        };
        return matches;
    }
    replace(name, regex, substr, flags) {
        const expression = this.format(name, regex, flags);
        this.code = this.code.replace(expression, substr);
        return this.code.match(expression) || [];
    }
    append(name, regex, substr) {
        return this.template(0, name, regex, substr);
    }
    prepend(name, regex, substr) {
        return this.template(1, name, regex, substr);
    }
    insert(name, regex, substr) {
        const {
            source
        } = this.format(name, regex);
        if (!source.includes("{INSERT}")) throw new Error("Your regexp must contain {INSERT} keyword");
        const findExpression = new RegExp(source.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
        this.code = this.code.replace(findExpression, `$1${substr}$2`);
        return this.code.match(findExpression);
    }
}
window.currentAngle = 0;

const lerpAngle = (current, target, alpha) => {
    let diff = (target - current + 30) % 360 - 30;
    return current + diff * alpha;
}

window.lerpAngle = lerpAngle;

let smoothCamVal = 43;
let Variables;
const applyHooks = code => {
    const Hook = new Regex(code, true);
    window.COPY_CODE = (Hook.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
    Hook.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;");
    Hook.replace("fix", /\(function (\w+)\(\w+\)\{/, `(function snowvibe(){`);
    Hook.replace("fix", /"function"==typeof \w+&&\(\w+=\w\(\w+,\w+\)\);/, ``);
    const nick = Hook.match("nick", /\.(\w+):"XX"/)[1];
    const myPlayer = Hook.match("myPlayer", /=(\w.get\(\w{2}\));\w&&\w\(\)/)[1];
    const X = Hook.match("playerX", /\{this\.(\w{2})=\w\|\|0/)[1];
    const Y = Hook.match("playerY", /,this\.(\w{2})=\w\|\|0\}/)[1];
    const ID = Hook.match("ID", /&&\w{2}===\w\.(\w{2})\){/)[1];
    const ID2 = Hook.match("ID2", /-1!==\w+\.(\w+)&&/)[1];
    const currentWeapon = Hook.match("crntWeapon", /,\w.(\w{2})===/)[1];
    const angle = Hook.match("angle", /;\w.(\w{2})=\w\(\)/)[1];
    const weaponName = Hook.match("wpnName", /(\w{2}):"XX/)[1];
    const health = Hook.match("health", /(\w{2})<<8;/)[1];
    const weaponDamage = Hook.match("wpnDamage", /(\w{2}):32,reload:300/)[1];
    const teamID = Hook.match("test", /,\w=\w.(\w{2})\|.+?\<\<8/)[1];
    const radius = Hook.match("radius", /(\w{2}):220/)[1];
    const [, currentItem, hat] = Hook.match("hat", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
    const size = Hook.match("size", /\.(\w{2})\+50/)[1];
    const inWhichObject = Hook.match("iwo", /110\).+?,1===\w.(\w{2})&&!\w{2}/)[1];
    const weaponID = Hook.match("el", /(\w{2}):0,\w{2}:22,reload:150/)[1];
    const itemType = Hook.matchAll("el", /,(\w+):9,\w+:2/)[1][1];
    const itemsID = Hook.match("IDs", />1\){.{3}(\w{2})/)[1];
    const itemBar = Hook.match("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/)[3];
    const objCount = Hook.match("Quantity", /\),this.(\w{2})=\w\):/)[1];
    const weaponList = Hook.match("weaponList", /\?Math\.PI\/2.+?(\w\(\))/)[1];
    const isTyping = Hook.match("is typing", /=\+new Date,(\w{2})=!1,/)[1];
    const damageReduce = Hook.match("damage reduce value", /10,(\w{2}):\.75,/)[1];
    const [, animations, hitAngle, weaponAnimation, animationTime, animationSpeed, playAnimation] = Hook.match("weapon animations", /0,\w\.(\w{2})\.(\w{2})=.{4}(\w{2})\.(\w{2}).{6}(\w{2}).+?(\w{2})\(\.01/);
    const sortedEntities = Hook.match("entities", /,\w=0;\w=(\w)\[/)[1];
    const speedBuff = Hook.match("speed", /(\w+):1\.23/)[1];
    const weaponSpeedBuff = Hook.match("speed", /300,(\w+):\.85/)[1];
    const cam = Hook.match("cam", /,\w\)}},(\w{2})=new function/)[1];
    const ctx = Hook.match("ctx", /(\w{2})=\w{2}(\[\w\(\d{3}\)\]|\.getContext)\("2d"\),\w{2}/)[1];
    const [, camX, camY] = Hook.match("data", /height:20,(\w+).+?.(\w+)/);
    const [, biomeY, biomeHeight] = Hook.match("data", /\w{2}:160,(\w{2}):160,\w{2}.+?(\w{2}):/);

    Variables = {
        myPlayer: {
            myPlayer,
            nick: `${myPlayer}.${nick}`,
            x: `${myPlayer}.${X}`,
            y: `${myPlayer}.${Y}`,
            id: `${myPlayer}.${ID}`,
            teamID: `${myPlayer}.${teamID}`,
            angle: `${myPlayer}.${angle}`
        },
        nick: nick,
        x: X,
        y: Y,
        id: ID,
        id2: ID2,
        hat,
        size,
        camX,
        camY,
        type: "type",
        angle,
        biomeY,
        health,
        radius,
        teamID,
        itemsID,
        isTyping,
        weaponID,
        objCount,
        itemType,
        hitAngle,
        speedBuff,
        weaponList,
        weaponName,
        animations,
        biomeHeight,
        weaponDamage,
        damageReduce,
        playAnimation,
        inWhichObject,
        currentWeapon,
        animationTime,
        animationSpeed,
        weaponAnimation,
        weaponSpeedBuff
    };

    const log = console.log;
    log(Variables);
    window.Variables = Variables;
    Hook.append("getMsg", /0;fu.{10}(\w).{2}/, `window.receiveMsg($2);`);
    Hook.replace("renderItems", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, `$1window.drawMarkers(...arguments)$2`);
    Hook.append("showHoods", /\w+\.\w+!==\w+\)/, "|| true");
    Hook.replace("animTextTime", /this.(\w{2})=400/, `this.$1=400`);
    Hook.replace("BiggerSquaresOnRenderGrid", /(\w+)=\w\(\)\.\w{2};(\w+)=Math/, `$1=200;$2=Math`);
    Hook.replace("LOCKROT ATIONISFUCKINGAY", /(return )(\w+\?)(\w+:)(\w+\(\)\.\w+\(window\[\w+\(570\)\]\/2,window\.innerHeight\/2,\w+,\w+\))/, "$1 $4");
    Hook.replace("skull next to kills", /\w+\.drawImage\(\w+,\w+-\w+\.width-5,350\);/, "");
    Hook.replace("smoothCam", /\w{4}.\w{3}\(.[0-9]{2}\*/, `Math.min(.00${smoothCamVal}*`);
    Hook.replace("xp bar", /\w+\.drawImage\(\w+,\w+-\w+\.width-5,350\);/, "");
    Hook.replace("skull next to kills", /\w+\.drawImage\(\w+,\w+-\w+\.width-5,350\);/, "");
    Hook.replace("fill xp bar", /\w+\.\w+\(\w+\);const \w+=\.7\+\w+\[\w+\(\w+\)\]\(1,\w+\(\)\.\w+\.\w+\(\w+\.\w+\)\)\/2,\w+=\w+\.\w+,\w+=\w+\.width\*\w+\|\|1,\w+=\w+\.height\*\w+\|\|1;\w+\.save\(\),\w+\.globalAlpha=\w+\.\w+,\w+\.drawImage\(\w+\.\w+,\.5\*\w+-\w+\/2,50-\w+\/2,\w+,\w+\),\w+\.restore\(\)/, "");
    Hook.replace("update resources", /function \w+\(\){const \w+=Math\.max\(\w+,\w+\[\w+\]\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+\),\w+=\w+\[\w+\]\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+,\w+=\w+\[\w+\]\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+,\w+=\w+\[\w+\]\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+,\w+=\w+\[\w+\]\|\w+\[\w+\]<<8\|\w+\[\w+\]<<\w+\|\w+\[\w+\]<<\w+;\w+\.\w+\(\w+\),\w+\.\w+\(\w+,\w+,\w+,\w+\)\}/, "");
    Hook.replace("widtah", /(\w+\.lineWidth=)4,/, "$1 3,");
    Hook.replace("widtah", /(\w+\.lineWidth=)7,/, "$1 4,");
    Hook.replace('customBar', /F2C39F/, `FFF`)
    Hook.replace("LBPos", /width:250/, `width: 260`);
    Hook.replace("biggerLBoard", /250,330/, `260, 330`);
    Hook.replace("scorePos", /\+145/, `\+145`);
    Hook.replace("strokeForScrInLB", /(\),\w\(\)\.\w+,)\w\(\)\..{2}\)/, `$1"#ffffff", "#2D3030")`);
    Hook.insert("test", /{INSERT}.{12}\w+\[2\]\<<8;\w+=/, `return;`);
    Hook.replace("test", /this.Fl=this.Fl/, "this.Fl=0");
    Hook.replace("test", /.ag=.02/, ".ag=.0");
    Hook.replace("Map Color", /"#788F57"/, "\#64803d\"");
    Hook.replace("ColorMats", /\)\,24,\"\#\w{6}\"\)|\)\,24,\w\(\d{3}\)\)/, `),24,"#AE4D57", "#303030")`)
    Hook.replace("ColorMats", /\)\,24,\"\#\w{6}\"\)|\)\,24,\w\(\d{3}\)\)/, `),24,"#935F3B", "#303030")`)
    Hook.replace("ColorMats", /\)\,24,\"\#\w{6}\"\)|\)\,24,\w\(\d{3}\)\)/, `),24,"#7B7A91", "#303030")`)
    Hook.replace("ColorMats", /\"\",24\,\D{9}|\"\",24\,\w\(\d{3}\)/, `"",24,"#FFD700", "#303030"`)
    Hook.replace("ColorBioms", /(\w{2}:16\*.+?20,\w{2}):"#ece5db"}|(:16\*.+?20,\w{2}):\w\(\d{3}\)}/, `$1:"#A9A9A9"}`)
    Hook.replace('ItemChoose', /\w\(\d{3}\),40,\D{6}|"Choose item",40,\D{6}/, `"",40,"#fff","#303030"`);
    Hook.replace('customItemObvodka', /23,"#fff"/, `23,"#fff","#303030"`)
    Hook.replace('customItemObvodka', /eec39d"/, `eec39d", "#303030"`)
    Hook.replace('customItemInfo', /4f403c/, '4f403c80')
    Hook.replace('customBar', /F2C39F/, `FFF`)
    Hook.replace('customBar', /10,"#5D3A37"|10,\w\(\d{3}\)/, `10,"#00000080"`)
    Hook.replace('grid', /1,(\w{2})=!0/, `1, $1=false`)
    Hook.replace('millMarker', /=false,(\w{2})=!0/, `=false,$1=false`)
    Hook.replace('enablePing', /42.5\),(\w{2})=!1/, `42.5),$1=false`)
    Hook.append("qwes", /t\(570\)\+o;/, `console.debug(r, bt);`);
    Hook.append("wbty", /w-form-urlencoded"\),/, `console.debug(o);`)
    Hook.append("awbr", /519\)\]\.visibility="visible"\);/, `console.debug(t);`)
    Hook.append("drawstuff", /-NUMBER{50},.+?function \w+\((ARGS{3})\)\{/, `window.drawingBoard($2);`);
    Hook.replace("showIDS", /===(\w+)(&&\w+\(\)&&\w+\(\).+?)return void\((\w+)=!0/, "===$1$2;if('/show'==$1)return void($3 = !$3");
    Hook.replace("lerpAngle", /\w{4} 0:\w.\w{6}(\w),/, `case 0: currentAngle = window.lerpAngle(currentAngle, m, 0.4);n.rotate(currentAngle);`);
    return Hook.code;
};

window.eval = new Proxy(window.eval, {
    apply(target, _this, args) {
        const code = args[0];
        console.log("Eval Code Length:", code.length);
        if (code.length > 1e5) {
            args[0] = applyHooks(code);
            console.log("Modified Code:", args[0].slice(0, 500));
            target.apply(_this, args);
            window.eval = target;

            document.title = "AntiMooAddict";
            return;
        }
        return target.apply(_this, args);
    }
});