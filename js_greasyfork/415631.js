// ==UserScript==
// @name         DH3 SuperSafe Cheat
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  The safe cheat script for DH3
// @author       Lasse Brustad
// @match        https://dh3.diamondhunt.co/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415631/DH3%20SuperSafe%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/415631/DH3%20SuperSafe%20Cheat.meta.js
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

        // auto consume stardust potions you have
        autoDrinkSD: !true,

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
            // areaName: energy cost (1e3 = 1000, 1e4 = 10000, 1_000 = 1000)

            // Fields
            fields: 50,

            // Forest
            forest: 200,

            // Caves
            caves: 500,

            // Lava Dungeon
            lavaDungeon: 2e3,

            // Northern Fields
            northernFields: 5e3,

            // Cemetery
            cemetery: 10e3,

            // Ocean
            ocean: 15e3,

            // Dungeon
            dungeon: 30e3
        },

        /**
         * <<< Areas - ENDS
         */

        // replace "fields" with the "areaName" from the list above
        area: 'fields',

        // don't teleport when you meet a shiny entity, no matter if the list chosen below says something else
        // basically, as far as the entity is shiny, fight it
        forceFightShiny: !true,

        // replace "fight" with the name of any of the combat list names, only one will be active
        listName: 'fight', // 'none' here will disable this cheat

        /**
         * >>> Combat Lists - START
         */

        // fight: when you meet any of the entities in this list, teleport won't be used
        fight: [
            'chicken',
            'ent',
            'skeleton',
            'bat',
            'boneHead',
            'reaper',
            // I'm just guessing on this
            'tridentSoldier',
            // and this
            'stoneWomen'
        ],

        // skip: if you meet entities in this list, teleport will be used
        skip: [
            'spider'
        ],

        // you can add as many custom lists as you want, but they will work just like "fight"

        // bonesMode: this is a custom list. when you're fighting in caves, you'll only fight Skeleton
        bonesMode: [
            'skeleton'
        ],

        // magicMode: another custom list. this is a mode for getting magic lvl as fast as possible, so I recommend fighting fields or forest when using this list
        magicMode: []

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
        smeltAllAvaliable: !true,

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
            sand: {
                min: 100,
                max: 0
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

    window.setDebugLevel = (lvl = debugLevel) => {
        if (typeof lvl !== 'number' || (lvl < 0 && lvl > (debugLevels.length - 1))) {
            console.log(`Didn't change the logging level, it has to be a number between 0 and 3.`);
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

    const cheatData = {
        combat: {
            fightSoon: false,
            error: false,
            useSpells: false,
            disabled: JSON.parse(localStorage.getItem('lbdata-combatError')) || false
        },
        smelting: {
            queue: false
        }
    };

    // auto combat
    function castSpell(spell) {
        if (!['heal', 'poison', 'reflect', 'fire', 'teleport', 'freeze', 'ghostScan', 'invisibility'].includes(spell)) return false;

        // stole the spell safety check from DH3 Fixed #yolo
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

        // use all spells except teleport
        const spells = ['heal', 'poison', 'reflect', 'fire', 'freeze', 'ghostScan', 'invisibility'].reverse();
        for (let spell of spells) {
            await wait(Math.floor(Math.random() * 150) + 100);
            castSpell(spell);
        }

        // if the entity isn't in the list, cast teleport!
        const { listName, forceFightShiny } = combatConfig;
        const noTeleport = combatConfig[listName];
        const isCustomList = !['fight', 'skip', 'none'].includes(listName);
        if (forceFightShiny && !!window.getItem('shinyMonster')) {
            // no, no, NO! don't teleport if the entity is shiny!
            return;
        }
        if (
            (!noTeleport.includes(entity) && listName === 'fight') ||
            (noTeleport.includes(entity) && listName === 'skip') ||
            (noTeleport.includes(entity) && isCustomList)
        ) {
            await wait(Math.floor(Math.random() * 150) + 350);
            castSpell('teleport');
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
        if (fightSoon || window.getItem('heroCooldown') !== 0 || window.getItem('teleportCooldown') != 0) return;
        if (!Object.keys(combatConfig.areas).includes(combatConfig.area)) {
            cheatData.combat.error = true;
            debug(2, `The script has no area called ${combatConfig.area} registered!`);
            return;
        }
        if (combatConfig.areas[combatConfig.area] > window.getItem('energy')) return debug(2, `You're low on energy! Eat some food to continue fighting!`);

        // FIGHT!!!
        cheatData.combat.fightSoon = true;
        cheatData.combat.useSpells = true;
        safeDelay(() => {
            if (window.getItem('heroCooldown') !== 0) return;
            window.sendBytes(`FIGHT=${combatConfig.area}`);
        })
    }

    // settings for autoCombat while playing
    window.setCombatStatus = (state = null) => {
        if (typeof state === 'boolean') {
            cheatData.combat.disabled = !state;
            console.log(`Set the state to ${state ? 'active' : 'inactive'}`);
        } else if (typeof state === 'string' && typeof combatConfig.areas[state] === 'number') {
            combatConfig.area = state;
            console.log(`Set the area to ${state}`);
        } else if (state === null) {
            console.log(`Current state: Fighting ${combatConfig.area} is ${!cheatData.combat.disabled ? 'active' : 'inactive'}`);
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

    // auto drink stardust potion
    let willConsumeSDPot = false;
    function autoSDPot() {
        const timeLeft = parseInt(window.var_stardustPotionTimer);
        if (timeLeft <= (5 * 60) && parseInt(window.var_stardustPotion) > 0 && !willConsumeSDPot) {
            willConsumeSDPot = true;
            safeDelay(() => {
                window.sendBytes('DRINK=stardustPotion');
                setTimeout(() => {
                    willConsumeSDPot = false;
                }, 3e3);
            });
        }
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

        // mining/crafting
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

        // brewing
        if (cheats.autoDrinkSD) {
            setInterval(autoSDPot, 2e3);
            debug(1, 'Cheat - Initialized Auto Drink Stardust Potion');
        }

        // fishing
        if (cheats.autoOxy) {
            setInterval(cheatAnyBoat, 1e3);
            debug(1, 'Cheat - Initialized Auto Oxygen Tank');
        } else if (cheats.autoRowBoat) {
            setInterval(() => cheatAnyBoat('rowBoat'), 1e3);
            debug(1, 'Cheat - Initialized Auto Row Boat');
        } else if (cheats.autoCanoeBoat) {
            setInterval(() => cheatAnyBoat('canoeBoat'), 1e3);
            debug(1, 'Cheat - Initialized Auto Canoe Boat');
        }
    }

    function init() {
        if (typeof window.var_username === "string" && window.var_username.length >= 3) {
            initCheats();
            debug(1, 'Initialized Cheats');
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
                return console.log('DH3 SuperSafe:', ...msg);
            case 3: // debugging
                return console.log('DH3 SuperSafe Debugging:', ...msg);
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