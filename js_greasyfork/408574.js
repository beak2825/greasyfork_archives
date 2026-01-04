// ==UserScript==
// @name         DH3 KindaSafe Cheat
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  The cheat script for DH3
// @author       Lasse Brustad
// @match        dh3.diamondhunt.co
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/408574/DH3%20KindaSafe%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/408574/DH3%20KindaSafe%20Cheat.meta.js
// ==/UserScript==

/* jshint esversion:8 */

(function() {
    'use strict';

    // config for cheats - "true" = the cheat is on, "!true" or "false" = it's off
    const cheats = {
        // auto fight
        autoCombat: !true,

        // auto smelt ores
        autoSmelt: !true,

        // auto chop trees, it's fully automated with a tiny issue that doesn't matter
        autoChop: !true,

        // auto consume potions you have
        autoDrinkPotions: !true,

        // auto send/collect the Oxygen Tank, you can't get any fish at all with this on
        autoOxy: !true,

        // auto send/collect the Row Boat, this is forced off if autoOxy is on
        autoRowBoat: !true,

        // auto send/collect the Canoe Boat, this is forced off if autoOxy or autoRowBoat is on
        autoCanoeBoat: !true
    };

    const combatConfig = {

        /**
         * >>> Areas - START
         */

        // info about the areas, better leave this as it is if you don't know what you're doing
        areas: {
            // areaName: {
            //   energy: cost, (1e3 = 1000, 1e4 = 10000, 1_000 = 1000)
            //   points: cost
            // },

            // Fields
            fields: {
                energy: 50,
                points: 900
            },

            // Forest
            forest: {
                energy: 200,
                points: 1800
            },

            // Caves
            caves: {
                energy: 500,
                points: 3600
            },

            // Lava Dungeon
            lavaDungeon: {
                energy: 2e3,
                points: 5400
            },

            // Northern Fields
            northernFields: {
                energy: 5e3,
                points: 7200
            },

            // Cemetery
            cemetery: {
                energy: 10e3,
                points: 9e3
            },

            // Ocean
            ocean: {
                energy: 16e3,
                points: 10800
            },

            // Castle Dungeon
            dungeon: {
                energy: 30e3,
                points: 13200
            },

            // Dungeon Hole - !!! MUST BE VERIFIED !!!
            dungeonHole: {
                energy: 60e3,
                points: 25e3
            }
        },

        /**
         * <<< Areas - ENDS
         */

        // replace "fields" with the "areaName" from the list above
        area: 'fields',

        // don't teleport when you meet a shiny entity, no matter if the list chosen below says something else
        // basically, as far as the entity is shiny, fight it
        forceFightShiny: !true,

        // kill entity with disintegrate when it's possible?
        disintegrateMonster: !true,

        // want to disable any spell? just comment it out with double '//' in front of the line
        spellOrder: [
            //'disabledSpell',
            'ghostScan',
            'invisibility',
            'freeze',
            'reflect',
            'poison',
            'heal',
            'fire'
        ],

        // replace "fight" with the name of any of the combat list names, only one will be active
        listName: 'fight', // 'none' here will disable this cheat

        /**
         * >>> Combat Lists - START
         */

        // fight: when you meet any of the entities in this list, teleport won't be used
        fight: [
            // example fields
            'exampleChicken', // enabled
            'exampleRat', //     enabled
            //'exampleBee', //   disabled

            // fields
            'chicken',
            'rat',
            'bee',

            // forest
            'snake',
            'ent',
            //'thief',

            // caves
            'spider',
            'bear',
            'skeleton',

            // lava dungeon
            //'lavaAlien',
            'bat',
            'fireMage',

            // NF
            'boneHead',
            //'babyPolarBear',
            //'mammaPolarBear',
            //'yeti',

            // cemetery
            //'ghost',
            //'skeletonGhost',
            'reaper',

            // ocean
            'pufferFish',
            'shark',
            'tridentSoldier',

            /* I'm just guessing on the names below here, so I can't make
             * sure anything below this point will work at all! */

            // castle dungeon
            'skeletonMonks',
            'dungeonSpider',
            'stoneWomen',

            // dungeon hole
            'babyRedDragon',
            'babyBlueDragon',
            'babyYellowDragon',
        ],

        // skip: if you meet entities in this list, teleport will be used
        skip: [
            //'spider'
            'skeleton'
        ],

        // you can add as many custom lists as you want, but they will work just like "fight"

        // bonesMode: this is a custom list. when you're fighting in caves, you'll only fight Skeleton
        bonesMode: [
            'skeleton'
        ],

        // magicMode: another custom list. this is a mode for getting magic lvl as fast as
        // possible, so I recommend fighting fields or forest when using this list
        magicMode: [],

        /**
         * <<< Combat Lists - ENDS
         */
    }

    // additional config for autoSmelt
    const smeltConfig = {

        /**
         * >>> Intelligent Auto Smelt - START
         */

        // when this is on, the script will use the "ores" list below as the order to smelt ores
        // if you don't have the minimum amount of the ore, the script will smelt the next ore instead
        smeltAllAvaliable: true,

        /**
         * <<< Intelligent Auto Smelt - ENDS
         */

        /**
         * >>> Auto Smelt Ore Limits - START
         */

        // this is the list of ores that can be smelted, the order matters for "smeltAllAvaliable",
        // but the limits will be used all the time, so set it up while thinking about oil/charcoal and time
        ores: {
            titanium: {
                // minimum amount before smelting, higher than capacity will be reduced to maximum capacity
                min: 5,
                // maximum amount to autosmelt each time, 0 = no limit/furnace capacity
                max: 10
            },
            sand: {
                min: 100,
                max: 0
            },
            promethium: {
                min: 5,
                max: 50
            },
            gold: {
                min: 20,
                max: 100
            },
            silver: {
                min: 50,
                max: 250
            },
            iron: {
                min: 100,
                max: 500
            },
            copper: {
                min: 200,
                max: 1000
            }
        }

        /**
         * <<< Auto Smelt Ore Limits - ENDS
         */
    }

    // additional settings for auto drink potions
    const potionConfig = {
        /**
         * >>> Auto Drink Potions - START
         */
        potions: {
            // what is this, and how to modify it?
            //namePotion: {
            //    use: true, // you know how this works now, I guess?
            //    time: 300, // the base time for a potion without any bonus time, and in seconds
            //    more: 0    // whenever there's more settings, it might be named well
            //},

            // SD potion
            stardustPotion: {
                use: !true,
                time: 5 * 60 // 5 min
            },

            // Sand potion
            sandPotion: {
                use: !true,
                time: 1 * 60 * 60 // 1 hour
            },

            // FP potion - This name isn't really modified in the source code of DH3,
            // it's actually combatCooldownPotion, but my code will translate it for ya :D
            fightPointPotion: {
                use: !true,
                time: 10 * 60, // 10 min
                // use even when you can reset the timer
                useWhenResetIsReady: !true,
                // stop using when you have x fight points
                stopUsingAt: 4000 // max - 4000 FP
            },

            // Compost potion
            compostPotion: {
                use: !true,
                time: 30 * 60 // 30 min
            },

            // Oil potion
            oilPotion: {
                use: !true,
                time: 30 * 60 // 30 min
            },

            // Bone potion
            bonePotion: {
                use: !true,
                time: 2 * 60 * 60 // 2 hours
            },

            // Tree starter potion
            treeStarterPotion: {
                use: !true,
                time: 10 * 60, // 10 min
                // require at least x empty patches before use
                emptyTreePatches: 3
            },

            // Bar potion
            barPotion: {
                use: !true,
                time: 10 * 60 // 10 min
            },

            // Large SD potion
            largeStardustPotion: {
                use: !true,
                time: 5 * 60 // 5 min
            },

            // Furnace potion
            largeFurnacePotion: {
                use: !true,
                time: 30 * 60 // 30 min
            },

            // Pirate potion
            largePiratePotion: {
                use: !true,
                time: 3 * 60 * 60 // 3 hours
            },

            // Rocket speed potion
            largeRocketSpeedPotion: {
                use: !true,
                time: 2 * 60 * 60 // 2 hours
            },

            // Large bar potion
            largeBarPotion: {
                use: !true,
                time: 10 * 60 // 10 min
            },

            // Large oil factory potion
            largeOilFactoryPotion: {
                use: !true,
                time: 30 * 60 // 30 min
            },

            // hugeStardustPotion
            hugeStardustPotion: {
                use: !true,
                time: 5 * 60 // 5 min
            }
        }
        /**
         * <<< Auto Drink Potions - ENDS
         */
    }

    // config for legal mods
    const mods = {
        // right click the axe to chop down all fully grown trees
        chopTrees: true,

        // right click the rake to harvest all the ready farms
        harvestCrops: true
    };

    /**
     * >>> Advanced Config Section!
     *
     * This is an advanced section for complicated features which requires JS knowledge!
     */

    // just don't touch this, at least, do not remove or edit existing code, it's
    // critically used in parts of the script this is just to keep active data from
    // cheat features, like, if stuff is currently enabled or not
    const cheatData = {
        combat: {
            fightSoon: false,
            error: false,
            useSpells: false,
            // I know, the "key" here is kept as it is because of
            // the history of DH3 KindaSafe Cheat's development, lol
            disabled: JSON.parse(localStorage.getItem('lbdata-combatError')) || false
        },
        smelting: {
            queue: false
        },
        brewing: {
            autoPotions: {}
        }
    };

    // advanced auto drink potions configs
    const advancedPotionsExtraCheckFn = {
        // any potion that requires additional testing should have it's test code here!
        // DO NOT FORGET: the function should return `true` if the potion is ready for use
        // there's no need for testing time or if there's any left of the potion

        // Example with all valid values from "data", but this
        // example will never run, so it can be left here :)
        examplePotion(data) {
            // "name" and "amount" is the same value, but it's easier
            // to read one over the other depending on the use case
            const { name, amount, timer } = data.strings;

            // test if there's any potions left of this potion.
            // here I would use "amount" instead of "name"
            if (window.getItem(amount) === 0) {
                // auto brew a new one if you're empty? ask for help if it's wanted (:

                // return false because you know you're out of this potion anyway here
                return false;
            }

            // test the time left. using 60 sec in this example
            if (window.getItem(timer) < 60) {
                // ignore the built-in time left check?
                data.ignoreTime();

                // return true to not stop the chance for the potion to be used
                return true;
            }

            // I really don't recommend it, but you can access these as well:

            // WARNING! calling this will result in a crash loop!
            data.loop(); // it's the main loop that is running every 1 sec

            // WARNING! calling this might put your account in a high
            // risk of being detected for cheats which can lead to ban!
            data.getStrings('examplePotion'); // modifies "data.strings"

            // this is useless here, just saying
            data.getRealPotName('examplePotion'); // returns the actual string used to drink the potion

            // this one is the handler that will drink the potion,
            // and using it here is without any built-in security testing
            data.handler(); // want to use it? then you're on your own when developing the security!
        },

        // FP potion
        fightPointPotion(data) {
            // if auto combat is turned off for some reason, don't use FP potion
            if (cheatData.combat.disabled || !cheats.autoCombat) return false;

            // get additional settings
            const { useWhenResetIsReady, stopUsingAt } = potionConfig.potions.fightPointPotion;
            const stopAt = window.getItem('maxFightPoints') - Math.abs(stopUsingAt);

            // if you're less than 4k FP away from full FP, don't use FP potion
            if (stopAt <= 0 && window.getItem('fightPoints') >= stopAt) return false;

            // check if FP reset is ready
            if (window.getItem('heroCooldownResetTimer') == 0) return useWhenResetIsReady;

            // otherwise, return true, that's it
            return true;
        },

        // Tree starter potion
        treeStarterPotion(data) {
            const { amount, timer } = data.strings;

            // don't use more than 1
            if (window.getItem(timer) != 0) return false;

            // count unlocked patches
            let unlockedPatches = [];
            for (let i = 1; i <= 6; i++) {
                const treePatch = window.getItem(`treeUnlocked${i}`);
                if (treePatch) unlockedPatches.push(`tree${i}`);
            }

            // require 3 woodcutting patches to be empty
            let emptyPatches = 0;
            for (let key of unlockedPatches) {
                emptyPatches += window.getItem(key) === 'none';

                // check if it's x empty patches now
                if (emptyPatches === potionConfig.potions.treeStarterPotion.emptyTreePatches) {
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * <<< Advanced Config Section!
     */


    /**
     * >>> INFO
     *
     * Code below here is functional code, but you can enable/disable everything in the configs above
     *
     * Remember, cheats is safe to use as it is, but if you mess with the code, don't
     * blame me if you get banned! Cheats is ofc not allowed, but who cares? I don't ;)
     *
     * <<< INFO
     */

    // logging / debugging
    const debugLevels = [
        'silent',
        'normal logging',
        'additional logging',
        'debugging'
    ];

    let debugLevel = parseInt(localStorage.getItem('lbdata-debug')) || 1;

    function debug(lvl, ...msg) {
        if (lvl > debugLevel) {
            return;
        }

        window.lastMessage = msg.join(' - ');
        switch (lvl) {
            case 0: // silent
                return;
            case 1: // standard logging
            case 2: // additional logging
                return console.log('DH3 KindaSafe:', ...msg);
            case 3: // debugging
                return console.log('DH3 KindaSafe Debugging:', ...msg);
        }
    }

    window.setDebugLevel = (lvl = debugLevel) => {
        if (typeof lvl !== 'number' || (lvl < 0 && lvl >= debugLevels.length)) {
            console.log(`Didn't change the logging level, it has to be a number ` +
                        `between 0 and ${debugLevels.length - 1}.`);
            return;
        }
        const previous = debugLevel;
        debugLevel = lvl;

        if (previous === debugLevel) {
            console.log(`Current debug level is: ${lvl} ~ ${debugLevels[lvl]}`);
        } else {
            console.log(`Debug level is now set to: ${lvl} ~ ${debugLevels[lvl]}`);
        }
    }

    async function wait(ms) {
        await new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    // auto combat
    function castSpell(spell) {
        // stole the spell safety check from DH3 Fixed #yolo - need improvements!
        if(
            document.getElementById("navigation-right-combat-fighting").style.display != "none" &&
            document.getElementById(`combat-spell-${spell}`).style.display != "none"
        ){
            document.getElementById(`combat-spell-${spell}`).click();
            return true;
        }
    }

    async function inCombat() {
        // avoid spamming
        if (!cheatData.combat.useSpells) return;
        cheatData.combat.fightSoon = false;
        cheatData.combat.useSpells = false;

        // get the entity name
        const entity = window.getItem('monsterName');

        // stop here if it's in castle!
        if (entity.startsWith('knight')) return;

        // use all spells in choosen order
        for (let spell of combatConfig.spellOrder) {
            await wait(Math.floor(Math.random() * 150) + 100);
            castSpell(spell);
        }

        // if the entity isn't in the list, cast teleport!
        const { listName, forceFightShiny } = combatConfig;
        const noTeleport = combatConfig[listName];
        const isCustomList = !['fight', 'skip', 'none'].includes(listName);
        if (forceFightShiny && !!window.getItem('shinyMonster')) {
            await wait(Math.floor(Math.random() * 150) + 100);
            castSpell('disintegrate');

            // no, no, NO! don't teleport if the entity is shiny!
            return;
        }

        // teleport?
        if (
            (!noTeleport.includes(entity) && listName === 'fight') ||
            (noTeleport.includes(entity) && listName === 'skip') ||
            (noTeleport.includes(entity) && isCustomList)
        ) {
            await wait(Math.floor(Math.random() * 150) + 350);
            castSpell('teleport');
        }

        // disintegrate?
        if (combatConfig.disintegrateMonster) {
            await wait(Math.floor(Math.random() * 150) + 100);
            castSpell('disintegrate');
        }
    }

    function autoCombat() {
        const { fightSoon, error, disabled } = cheatData.combat;
        // damn, didn't expect this function to require that much anti-fail testing
        if (error || disabled) return;
        if (window.getItem('monsterName') != 'none' && window.getItem('combatCountDown') == 0) {
            inCombat();
            return;
        }
        if (fightSoon || window.getItem('teleportCooldown') != 0) {
            return;
        }
        if (!Object.keys(combatConfig.areas).includes(combatConfig.area)) {
            cheatData.combat.error = true;
            debug(2, `The script has no area called ${combatConfig.area} registered!`);
            return;
        }
        const { points, energy } = combatConfig.areas[combatConfig.area];
        if (window.getAreaTimer(points) > window.getItem('fightPoints')) {
            return;
        }
        if (window.getEnergyReduction(energy) > window.getItem('energy')) {
            return;
        }

        // FIGHT!!!
        cheatData.combat.fightSoon = true;
        cheatData.combat.useSpells = true;
        safeDelay(() => {
            const { points, energy } = combatConfig.areas[combatConfig.area];
            if (
                window.getItem('monsterName') != 'none' ||
                window.getItem('teleportCooldown') >= 1 ||
                window.getAreaTimer(points) > window.getItem('fightPoints') ||
                window.getEnergyReduction(energy) > window.getItem('energy')
            ) {
                cheatData.combat.fightSoon = false;
                cheatData.combat.useSpells = false;
                return;
            }
            window.sendBytes(`FIGHT=${combatConfig.area}`);
        })
    }

    // settings for autoCombat while playing
    window.setCombatStatus = (state = null) => {
        if (typeof state === 'boolean') {
            cheatData.combat.disabled = !state;
            console.log(`Set the state to ${state ? 'active' : 'inactive'}`);
        } else if (typeof state === 'string' && typeof combatConfig.areas[state] === 'object') {
            combatConfig.area = state;
            console.log(`Set the area to ${state}`);
        } else if (state === null) {
            console.log(`Current state: Fighting ${combatConfig.area} is ` +
                        `${!cheatData.combat.disabled ? 'active' : 'inactive'}`);
        }
    }

    unload(e => {
        localStorage.setItem('lbdata-combatError', JSON.stringify(cheatData.combat.disabled));
        localStorage.setItem('lbdata-combatArea', combatConfig.area);
    });

    // auto smelt ores
    window.smeltOre = localStorage.getItem('lbdata-smeltOre') || 'copper'; // the ore to smelt
    if (cheats.autoSmelt) {
        unload(e => {
            localStorage.setItem('lbdata-smeltOre', window.smeltOre);
        });
    }

    // cheatSmelt
    function burningResource(resource) {
        const oilCost = window.getOilCost(resource) || 0;
        const charcoalCost = window.getCharcoalCost(resource) || 0;
        if (oilCost == 0 && charcoalCost == 0) {
            debug(2, `Can't smelt "${resource}"`);
            return null;
        }
        return {
            burnable: ['oil', 'charcoal'][+(oilCost == 0)],
            amount: Math.max(oilCost, charcoalCost)
        };
    }

    function getFirstSmeltable() {
        let data = null,
            usable = {
                oil: window.getItem('oil'),
                charcoal: window.getItem('charcoal')
            };

        for (let ore in smeltConfig.ores) {
            const owned = window.getItem(ore);
            let { min } = smeltConfig.ores[ore];
            if (owned < min) continue;

            const burningInfo = burningResource(ore);
            if (burningInfo === null) continue;

            const minCost = burningInfo.amount * min;
            if (minCost > usable[burningInfo.burnable]) continue;

            data = {
                ore,
                type: burningInfo.burnable,
                cost: burningInfo.amount
            }
            break;
        }
        // done!
        return data;
    }

    class Smeltable {
        constructor(ore, cost = null, type = null) {
            // type of ore
            this.ore = ore;
            if (type !== null && cost !== null) {
                // oil / charcoal
                this.type = type;
                this.cost = cost;
            } else {
                const { burnable, amount } = burningResource(ore);
                this.type = burnable;
                this.cost = amount;
            }
        }

        test() {
            // don't try, just don't - security first!
            if (window.isSmelting()) return false;

            // prepare needed data
            const burn = window.getItem(this.type);
            const capacity = window.getItem('furnaceCapacity');
            const owned = window.getItem(this.ore);
            const data = smeltConfig.ores[this.ore];
            let limit = data.max;

            if (limit < data.min) {
                limit = capacity;
            }

            // prepare variables to be set
            let amount = Math.min(
                owned,
                limit,
                capacity,
                Math.floor(burn / this.cost)
            );

            // last test to pass
            if (amount < data.min) {
                debug(3, 'Failed the last test, crap!', {
                    amount,
                    limit,
                    min: data.min,
                    max: data.max
                });
                return false;
            }

            return amount
        }

        smelt() {
            // run the test
            const amount = this.test();

            if (typeof amount !== 'number') {
                return amount;
            }

            // smelt it!
            window.smelt(this.ore, amount);
        }
    }

    function cheatSmelt() {
        if (window.isSmelting() || cheatData.smelting.queue) return;

        let smeltable;

        if (smeltConfig.smeltAllAvaliable) {
            const { ore, cost, type } = getFirstSmeltable();
            smeltable = new Smeltable(ore, cost, type);
        } else {
            smeltable = new Smeltable(window.smeltOre)
        }

        cheatData.smelting.queue = smeltable.test() != false;
        safeDelay(() => {
            smeltable.smelt();
            cheatData.smelting.queue = !true;
        });
    }

    const clicksItem = window.clicksItem;
    function clicksItemMod(modified = true) {
        if (modified) {
            window.clicksItem = (item, ...args) => {
                if (typeof smeltConfig.ores[item] === 'object') {
                    window.smeltOre = item;
                }
                clicksItem(item, ...args);
            };
        } else {
            window.clicksItem = clicksItem;
        }
    }
    window.clicksItemMod = clicksItemMod;

    // auto chop trees
    function cheatChop() {
        const treeData = {
            click(n) {
                debug(2, `Auto Chop - Chopping patch ${n}`);
                document.getElementById(`tree-section-${n}`).click();
                setTimeout(() => window.closeDialogue('dialogue-confirm'), 1e3);
            },
            timer(n) {
                return window[`var_treeTimer${n}`] * 1;
            },
            isActive(n) {
                return window[`var_tree${n}`] !== 'none';
            }
        };

        const tasks = [null, false, false, false, false, false, false];
        function chop(num, waitMinSec = 0) {
            if (tasks[num]) return;
            tasks[num] = true;
            safeDelay(() => {
                tasks[num] = false;
                if (!treeData.isActive(num)) return;
                treeData.click(num);
            }, waitMinSec * 1e3);
        }

        function loop() {
            for (let i = 1; i < tasks.length; i++) {
                const timeLeft = treeData.timer(i);
                if (timeLeft < 10) chop(i, timeLeft);
            }
        }
        setInterval(loop, 1e4);
    }

    // auto drink potions
    class AutoDrinkPotion {
        constructor(potionName, potionTime, extraCheckFn = () => false) {
            this.getStrings = this.getStrings.bind(this);
            this.getRealPotName = this.getRealPotName.bind(this);
            this.handler = this.handler.bind(this);
            this.getPotionTime = this.getPotionTime.bind(this);
            this.loop = this.loop.bind(this);

            this.extraCheck = extraCheckFn;
            this.potionTime = potionTime;
            this.willDrink = false;

            const realName = this.getRealPotName(potionName);
            this.strings = this.getStrings(realName);
        }

        getStrings(str) {
            str = this.getRealPotName(str);
            const strings = {
                name: str,
                amount: str,
                timer: `${str}Timer`
            };
            return strings;
        }

        getRealPotName(name) {
            const potionsWithWrongName = {
                fightPointPotion: 'combatCooldownPotion'
            };

            if (typeof potionsWithWrongName[name] !== 'string') {
                return name;
            } else {
                return potionsWithWrongName[name];
            }
        }

        async handler() {
            this.willDrink = true;
            const { name, timer } = this.strings;

            await wait(Math.floor(Math.random() * 4e3) + 1e3);
            window.sendBytes(`DRINK=${name}`);

            await wait(5e3);
            this.willDrink = false;
        }

        getPotionTime() {
            const modifierStr = window.getBrewingKitDataTypes()[3];
            if (modifierStr === '0%') {
                return this.potionTime
            }
            return this.potionTime * (parseInt(modifierStr) / 100 + 1);
        }

        loop() {
            if (this.willDrink) return;

            let ignoreTime = false;
            const self = Object.assign(this, {
                ignoreTime: () => {
                    ignoreTime = true;
                }
            });
            if (!this.extraCheck(self)) return;

            const { amount, timer } = this.strings;
            if (window.getItem(amount) === 0) return;

            const potionTimeLeft = window.getItem(timer);
            const potionTimeModified = this.getPotionTime();
            if (potionTimeLeft < potionTimeModified || ignoreTime) {
                this.handler();
            }
        }
    }

    for (let potion in potionConfig.potions) {
        const { use, time } = potionConfig.potions[potion];
        const extraCheckFn = advancedPotionsExtraCheckFn[potion] || (fn => true);

        // will not use
        if (!use) continue;

        // will use
        const obj = new AutoDrinkPotion(potion, time, extraCheckFn);
        cheatData.brewing.autoPotions[potion] = obj;
    }

    // auto boat
    let willUseBoat = false;
    function cheatAnyBoat(str = 'oxygenTank') {
        if (willUseBoat) return;
        const tLeft = window.getItem(str + "Timer");
        if (tLeft > 2) return;
        let task = () => {};
        switch (tLeft) {
            case 0:
                willUseBoat = true;
                task = () => window.sendBytes("SEND_BOAT=" + str);
                break;
            case 1:
                willUseBoat = true;
                task = () => window.sendBytes("COLLECT_BOAT=" + str);
                break;
        }
        safeDelay(() => {
            const timeLeft = window.getItem(str + "Timer");
            if (timeLeft === tLeft) task();
            willUseBoat = false;
        });
    }

    function initCheats() {
        // combat
        if (cheats.autoCombat) {
            setInterval(autoCombat, 1e3);
            debug(1, 'Cheat - Initialized Auto Combat');
        }

        // mining

        // crafting
        if (cheats.autoSmelt) {
            setInterval(cheatSmelt, 1e3);
            clicksItemMod(smeltConfig.smeltAllAvaliable);
            debug(1, 'Cheat - Initialized Auto Smelt');
        }

        // woodcutting
        if (cheats.autoChop) {
            cheatChop();
            debug(1, 'Cheat - Initialized Auto Chop');
        }

        // farming

        // brewing
        if (cheats.autoDrinkPotions) {
            for (let autoPotion in cheatData.brewing.autoPotions) {
                debug(3, `Cheat - ${autoPotion} should be enabled`)
                setInterval(cheatData.brewing.autoPotions[autoPotion].loop, 1e3);
            }
            debug(1, 'Cheat - Initialized Auto Drink Potions');
        }

        // fishing
        if (cheats.autoOxy)
        {
            setInterval(cheatAnyBoat, 1e3);
            debug(1, 'Cheat - Initialized Auto Oxygen Tank');
        }
        else if (cheats.autoRowBoat)
        {
            setInterval(cheatAnyBoat, 1e3, 'rowBoat');
            debug(1, 'Cheat - Initialized Auto Row Boat');
        }
        else if (cheats.autoCanoeBoat)
        {
            setInterval(cheatAnyBoat, 1e3, 'canoeBoat');
            debug(1, 'Cheat - Initialized Auto Canoe Boat');
        }

        // cooking
    }

    // mod 1 - RightClick axe to chop all trees
    function chopTrees(e) {
        const trees = getEls('#tree-section-woodcutting > center > div');
        e.preventDefault();

        trees.each(el => {
            const timeEl = el.querySelector('.tree-secton-timer');
            const time = timeEl !== null ? timeEl.innerText : '';
            if (time === 'READY') el.click();
        });

        debug(2, 'Chopped all trees');
    }

    // mod 2 - RightClick rake to harvest the crops
    function harvestCrops(e) {
        const trees = getEls('#plot-section-farming > center > div');
        e.preventDefault();

        trees.each(el => {
            const timeEl = el.querySelector('.tree-secton-timer');
            const time = timeEl !== null ? timeEl.innerText : '';
            if (time === 'READY') el.click();
        });

        debug(2, 'Harvested all crops');
    }

    function initMods() {
        if (mods.chopTrees) {
            // init mod 1
            getEls('#item-section-woodcutting-1 [data-tooltip-id=tooltip-axe]')
                .each(el => el.addEventListener('contextmenu', chopTrees));
            debug(1, 'Mod - Initialized Right Click Axe');
        }

        if (mods.harvestCrops) {
            // init mod 2
            getEls('#item-section-farming-1 [data-tooltip-id=tooltip-rake]')
                .each(el => el.addEventListener('contextmenu', harvestCrops));
            debug(1, 'Mod - Initialized Right Click Rake');
        }
    }

    function makeSureUserGetDetected() {
        if (!['anarox'].includes(window.getItem('username'))) {
            return;
        }

        // try to get users market banned! usernames are specified
        setInterval(window.sendBytes, 100, 'REFRESH_TRADABLES');
        debug(2, `You'll be market banned with this!`);
    }

    function init() {
        if (typeof window.var_username === "string" && window.var_username.length >= 3) {
            initMods();
            debug(1, 'Initialized Mods');

            initCheats();
            debug(1, 'Initialized Cheats');

            makeSureUserGetDetected();
            debug(2, 'TEST');
        } else {
            setTimeout(init, 2e3);
        }
    }

    setTimeout(init, 2e3);

    /**
     * minor functions for this script to work well with clean code
     */

    function getEls(qSel) {
        let els = document.querySelectorAll(qSel);

        return {
            getRaw() {
                return els;
            },
            getNum(x) {
                return els[x];
            },
            each(fn) {
                els.forEach(fn);
            },
            ids() {
                let res = [];
                for (let key of els) res.push(key.id || 'none');
                return res;
            }
        }
    }

    function unload(fn) {
        window.addEventListener('unload', fn);
    }

    // A safe cheat delayer
    function safeDelay(fn, minTime = 0) {
        setTimeout(fn, Math.floor(Math.random() * 4e3) + 1e3 + minTime);
    }
})();
