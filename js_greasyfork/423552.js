// ==UserScript==
// @name         Melvor Golbin Raider
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Bloop Bleep. I am a robot.
// @author       NotCorgan#1234
// @match        https://melvoridle.com/*
// @match        https://www.melvoridle.com/*
// @match        https://test.melvoridle.com/*
// @exclude      https://melvoridle.com/update/*
// @exclude      https://www.melvoridle.com/update/*
// @exclude      https://test.melvoridle.com/update/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/423552/Melvor%20Golbin%20Raider.user.js
// @updateURL https://update.greasyfork.org/scripts/423552/Melvor%20Golbin%20Raider.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// Made for version 1.0.2

(function () {
	function injectScript(main) {
		var script = document.createElement('script');
		script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
		document.body.appendChild(script).parentNode.removeChild(script);
	}

    function script() {
        // Loading script

        /*
        RaidManager.difficulties[3] = {
            coinMultiplier: 1.5,
            combatTriangle: 1,
            enemyAccuracyModifier: 10,
            enemyEvasionModifier: 10,
            enemyHPModifier: 25,
            enemyMaxHitModifier: 10,
            hasSecondPassiveChange: true,
            name: "Chaos",
            negativeModifierCount: 10,
            positiveModifierCount: 5,
            selectedClass: "btn-info",
            unselectedClass: "btn-outline-info",
        }
        RaidDifficulty[3] = 'Chaos';
        RaidDifficulty['Chaos'] = 3;

        $('#raid-difficulty-btn-2').after(`
        <button class="btn btn-outline-info w-25" type="button" id="raid-difficulty-btn-3" onclick="raidManager.changeDifficulty(3);">
            <span>Chaos</span>
        </button>
        `);
        */

        let defaultSteps = [
            {
                "result": "weapons",
                "conditional": "wave",
                "comparison": "equals",
                "num": "1"
            },
            {
                "result": "armour",
                "conditional": "wave",
                "comparison": "equals",
                "num": 2
            },
            {
                "result": "food",
                "conditional": "wave",
                "comparison": "equals",
                "num": 3
            },
            {
                "conditional": "and",
                "result": "passive",
                "num": "0",
                "mod": "5",
                "conditions": [
                    {
                        "conditional": "wave",
                        "comparison": "mod",
                        "num": 0,
                        "mod": "5"
                    },
                    {
                        "conditional": "equipment",
                        "slot": 11,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "1"
                    }
                ]
            },
            {
                "result": "weapons",
                "conditional": "and",
                "conditions": [
                    {
                        "conditional": "wave",
                        "comparison": "greater-than-equals",
                        "num": 4
                    },
                    {
                        "conditional": "equipment",
                        "comparison": "in",
                        "slot": 4,
                        "collection": [
                            {
                                "num": -1
                            },
                            {
                                "num": 436
                            },
                            {
                                "num": 431
                            }
                        ],
                        "type": "item"
                    }
                ]
            },
            {
                "result": "food",
                "conditional": "food",
                "comparison": "less-than",
                "type": "total",
                "num": 800
            },
            {
                "result": "runes",
                "conditional": "and",
                "conditions": [
                    {
                        "conditional": "or",
                        "conditions": [
                            {
                                "conditional": "rune",
                                "comparison": "less-than",
                                "type": 389,
                                "num": "500"
                            },
                            {
                                "conditional": "rune",
                                "comparison": "less-than",
                                "type": 393,
                                "num": "500"
                            },
                            {
                                "conditional": "rune",
                                "type": 390,
                                "comparison": "less-than",
                                "num": "500"
                            }
                        ]
                    },
                    {
                        "conditional": "wave",
                        "comparison": "greater-than-equals",
                        "num": "4"
                    }
                ]
            },
            {
                "conditional": "and",
                "result": "armour",
                "conditions": [
                    {
                        "conditional": "stats",
                        "type": "damage-reduction",
                        "comparison": "less-than",
                        "num": "20"
                    },
                    {
                        "conditional": "wave",
                        "comparison": "less-than",
                        "num": "20"
                    }
                ]
            },
            {
                "conditional": "and",
                "result": "weapons",
                "conditions": [
                    {
                        "conditional": "equipment",
                        "slot": 4,
                        "comparison": "not-equals",
                        "type": "item",
                        "num": 932
                    },
                    {
                        "conditional": "wave",
                        "comparison": "greater-than",
                        "num": "20"
                    }
                ]
            },
            {
                "conditional": "and",
                "result": "runes",
                "conditions": [
                    {
                        "conditional": "equipment",
                        "slot": 4,
                        "comparison": "equals",
                        "num": 932,
                        "type": "item"
                    },
                    {
                        "conditional": "or",
                        "conditions": [
                            {
                                "conditional": "rune",
                                "type": 394,
                                "comparison": "less-than",
                                "num": "500"
                            },
                            {
                                "conditional": "rune",
                                "type": 822,
                                "comparison": "less-than",
                                "num": "500"
                            },
                            {
                                "conditional": "rune",
                                "type": 392,
                                "comparison": "less-than",
                                "num": "500"
                            },
                            {
                                "conditional": "rune",
                                "type": 820,
                                "comparison": "less-than",
                                "num": "500"
                            }
                        ]
                    }
                ]
            },
            {
                "conditional": "or",
                "result": "armour",
                "conditions": [
                    {
                        "conditional": "equipment",
                        "slot": 0,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "2"
                    },
                    {
                        "conditional": "equipment",
                        "slot": 1,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "2"
                    },
                    {
                        "conditional": "equipment",
                        "slot": 2,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "2"
                    },
                    {
                        "conditional": "equipment",
                        "slot": 3,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "2"
                    },
                    {
                        "conditional": "equipment",
                        "slot": 6,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "2"
                    },
                    {
                        "conditional": "equipment",
                        "slot": 7,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "2"
                    },
                    {
                        "conditional": "equipment",
                        "slot": 8,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "2"
                    },
                    {
                        "conditional": "equipment",
                        "slot": 10,
                        "type": "prio",
                        "comparison": "greater-than",
                        "num": "2"
                    }
                ]
            },
            {
                "result": "runes",
                "conditional": "default"
            }
        ];

        let golbinRaiderSelectionSteps = JSON.parse(localStorage.getItem(`golbinRaiderSelectionSteps`)||JSON.stringify(defaultSteps))
        window.golbinRaiderSelectionSteps = golbinRaiderSelectionSteps;

        let prioritiesList = [
            CONSTANTS.equipmentSlot.Weapon,
            CONSTANTS.equipmentSlot.Shield,
            CONSTANTS.equipmentSlot.Helmet,
            CONSTANTS.equipmentSlot.Platebody,
            CONSTANTS.equipmentSlot.Gloves,
            CONSTANTS.equipmentSlot.Platelegs,
            CONSTANTS.equipmentSlot.Boots,
            CONSTANTS.equipmentSlot.Cape,
            CONSTANTS.equipmentSlot.Amulet,
            CONSTANTS.equipmentSlot.Ring,
            CONSTANTS.equipmentSlot.Quiver,
            CONSTANTS.equipmentSlot.Passive];


        let defaultPriorities = {
            "Weapon":[932,1200,930,1199,928,499,497],
            "Shield":[812,1114,1226],
            "Helmet":[1225,1214,718,713,776,781],
            "Platebody":[1216,720,715,778,783],
            "Gloves":[1147,722,717,780,785],
            "Platelegs":[719,714,777,782],
            "Boots":[1213,721,716,779,784],
            "Cape":[941,818,361],
            "Amulet":[819,795,793],
            "Ring":[1146,794,1115,792,1144,1148],
            "Quiver":[1083],
            "Passive":[1115,1114,795]
        };

        let golbinRaiderPriorities = JSON.parse(localStorage.getItem(`golbinRaiderPriorities`)||JSON.stringify(defaultPriorities))
        window.golbinRaiderPriorities = golbinRaiderPriorities;

        let golbinRaiderSettings = JSON.parse(localStorage.getItem(`golbinRaiderSettings`)||JSON.stringify({
            autoHeal: true
        }))
        window.golbinRaiderSettings = golbinRaiderSettings;

        let golbinRaiderModifierPriority = JSON.parse(localStorage.getItem(`golbinRaiderModifierPriority`)||JSON.stringify({
            positive: [...RaidManager.possibleModifiers].map(mod => ({key: mod.key, soft: 0, hard: 0 })),
            negative: [...RaidManager.possibleModifiers].map(mod => ({key: mod.key, soft: 0, hard: 0 }))
        }));
        window.golbinRaiderModifierPriority = golbinRaiderModifierPriority;
        /*
        TODO
        Item Selection Revamp (customizable weighting?)
          Ammo Selection
          Rune Selection
        Settings (???)
          autoHeal
          Allow 2H
          Allow Magic
          Allow Ranged
        */

        let golbinRaidResults = {
            weapons: { id: "weapons", name: "Weapons" },
            armour: { id: "armour", name: "Armor" },
            food: { id: "food", name: "Food" },
            runes: { id: "runes", name: "Runes" },
            ammo: { id: "ammo", name: "Ammo" },
            passive: { id: "passive", name: "Passive" },
            pause: { id: "pause", name: "Pause Run" },
            abort: { id: "abort", name: "Abort Run" }
        };

        let golbinItemCount = id => raidManager.bank.getQty(id)
        let haveRunes = runes => runes.reduce((bool, rune) => bool && golbinItemCount(rune[0]) >= rune[1], true)
        let availableRunes = () => items.filter(item => item.type === "Rune" && !RaidManager.bannedItems.includes(item.id)).map(item => item.id);
        let combatLevel = (item) => {
            if(item.equipRequirements == undefined || item.equipRequirements.length == 0)
                return 0;
            return item.equipRequirements.filter(er => er.type == "Level").map(er => {
                return Math.max(...er.levels.filter(l => {
                    return [6,7,8,12,16].includes(l.skill)
                }).map(l => l.level));
            })[0];
        }
        let hasOceanSong = () => raidManager.player.availableAttacks.map(aa => aa.attack.id).indexOf(31) != -1
        const camel2title = (camelCase) => camelCase.replace(/([A-Z])/g, (match) => ` ${match}`).replace(/^./, (match) => match.toUpperCase()).trim();

        const golbinRaidValues = {
            'num': {
                id: 'num',
                name: 'Value',
                type: 'number',
                default: 0
            },
            'mod': {
                id: 'mod',
                name: 'Mod',
                type: 'number',
                default: 0
            }
        }

        const golbinRaidComparisons = {
            'true': {
                id: 'true',
                name: "Is True",
                fn: (a) => a == true,
                values: () => [],
            },
            'false': {
                id: 'false',
                name: "Is False",
                fn: (a) => a == false,
                values: () => [],
            },
            'equals': {
                id: 'equals',
                name: "==",
                fn: (a, {num}) => a == num,
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'not-equals': {
                id: 'not-equals',
                name: "!=",
                fn: (a, {num}) => a != num,
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'less-than': {
                id: 'less-than',
                name: "<",
                fn: (a, {num}) => a < num,
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'less-than-equals': {
                id: 'less-than-equals',
                name: "<=",
                fn: (a, {num}) => a <= num,
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'greater-than': {
                id: 'greater-than',
                name: ">",
                fn: (a, {num}) => a > num,
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'greater-than-equals': {
                id: 'greater-than-equals',
                name: ">=",
                fn: (a, {num}) => a >= num,
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'in': {
                id: 'in',
                name: "In",
                fn: (a, {collection}) => collection.findIndex(({num}) => num == a) != -1,
                collection: true,
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'not-in': {
                id: 'not-in',
                name: "Not In",
                fn: (a, {collection}) => collection.findIndex(({num}) => num == a) == -1,
                collection: true,
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'includes': {
                id: 'includes',
                name: "Includes",
                fn: (a, {num}) => a.includes(num),
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'not-includes': {
                id: 'not-includes',
                name: "Doesn't Include",
                fn: (a, {num}) => !a.includes(num),
                values: () => [
                    golbinRaidValues['num']
                ],
            },
            'mod': {
                id: 'mod',
                name: "%",
                fn: (a, {num, mod}) => a % mod == num,
                values: () => [
                    golbinRaidValues['num'],
                    golbinRaidValues['mod']
                ],
            }
        }

        const golbinRaidConditionals = {
            wave: {
                id: 'wave',
                name: 'Wave',
                visible: true,
                selectable: true,
                params: [],
                evaluate: ({comparison, ...rest}) => {
                    let a = raidManager.wave;
                    return golbinRaidComparisons[comparison].fn(a, rest);
                },
                comparisons: () => [
                    golbinRaidComparisons['equals'],
                    golbinRaidComparisons['not-equals'],
                    golbinRaidComparisons['less-than'],
                    golbinRaidComparisons['less-than-equals'],
                    golbinRaidComparisons['greater-than'],
                    golbinRaidComparisons['greater-than-equals'],
                    golbinRaidComparisons['mod'],
                    golbinRaidComparisons['in'],
                    golbinRaidComparisons['not-in'],
                ],
                values: () => []
            },
            equipment: {
                id: 'equipment',
                name: 'Equipment',
                visible: true,
                selectable: true,
                params: [
                    {
                        id: 'slot',
                        name: 'Slot',
                        type: 'dropdown',
                        default: -1,
                        values: ({type}) => {
                            let v = [...prioritiesList].map((id) => ({id: id, name: CONSTANTS.equipmentSlot[id]}))
                            v.unshift({id: -1, name: 'Any'});
                            return v
                        }
                    },
                    {
                        id: 'type',
                        name: 'Type',
                        type: 'dropdown',
                        default: 'item',
                        values: ({slot}) => {
                            let v = [];
                            v.push({id: 'item', name: 'Item'})
                            v.push({id: 'prio', name: 'Priority'})
                            if(slot != -1)
                                v.push({id: 'stats', name: 'Stats'})
                            v.push({id: 'alt', name: 'Alt'})
                            if(slot != -1)
                                v.push({id: 'special', name: 'Has Special'})
                            return v
                        }
                    },
                    {
                        id: 'stat',
                        name: 'Stat',
                        type: 'dropdown',
                        default: 'damageReduction',
                        visible: ({type}) => type == 'stats',
                        values: () => equipStatKeys.map(stat => {
                            return {id: stat, name: camel2title(stat)};
                        })
                    }
                ],
                evaluate: ({comparison, slot, type, stat, ...rest}) => {
                    let a = 0;
                    if(type == 'special')
                        a = raidManager.player.equipment.slotArray[slot].occupiedBy === 'None' && raidManager.player.altAttacks[CONSTANTS.equipmentSlot[slot]].length == 0 && raidManager.player.equipment.slotArray[slot].item.hasSpecialAttack;
                    if(type == 'alt')
                        a = raidManager.player.equipment.slotArray[slot].occupiedBy === 'None' && raidManager.player.altAttacks[CONSTANTS.equipmentSlot[slot]];
                    if(type == 'item')
                        a = raidManager.player.equipment.slotArray[slot].item.id;
                    if(type == 'stats')
                        a = (raidManager.player.equipment.slotArray[slot].item.equipmentStats.find(i => i.key == stat) || {value: 0}).value;
                    if(type == 'prio') {
                        a = golbinRaiderPriorities[CONSTANTS.equipmentSlot[slot]] && golbinRaiderPriorities[CONSTANTS.equipmentSlot[slot]].length > 0 && golbinRaiderPriorities[CONSTANTS.equipmentSlot[slot]].findIndex(id => id == raidManager.player.equipment.slotArray[slot].item.id);
                        if(a === false || a == -1) {
                            a = Infinity;
                        } else {
                            a++;
                        }
                    }
                    return golbinRaidComparisons[comparison].fn(a, rest);
                },
                comparisons: ({slot, type}) => {
                    let comparisons = [
                        golbinRaidComparisons['equals'],
                        golbinRaidComparisons['not-equals'],
                    ];
                    if(type == 'item') {
                        comparisons = comparisons.concat([
                            golbinRaidComparisons['in'],
                            golbinRaidComparisons['not-in'],
                        ])
                    }
                    if(type == 'stats' || type == 'prio') {
                        comparisons = comparisons.concat([
                            golbinRaidComparisons['less-than'],
                            golbinRaidComparisons['less-than-equals'],
                            golbinRaidComparisons['greater-than'],
                            golbinRaidComparisons['greater-than-equals'],
                        ])
                    }
                    if(type == 'alt' || slot == -1) {
                        comparisons = [
                            golbinRaidComparisons['includes'],
                            golbinRaidComparisons['not-includes'],
                        ];
                    }
                    if(type == 'special') {
                        comparisons = [
                            golbinRaidComparisons['true'],
                            golbinRaidComparisons['false'],
                        ];
                    }
                    return comparisons;
                },
                values: ({type}) => {
                    let values = [];
                    if(type == 'item')
                        values.push({
                        id: 'num',
                        name: 'Item',
                        type: 'dropdown',
                        default: -1,
                        values: ({slot}) => {
                            let v = items.filter(item => slot == -1 ? item.validSlots && item.validSlots.length > 0 : item.validSlots && item.validSlots.includes(CONSTANTS.equipmentSlot[slot]));
                            v.unshift({id: -1, name: 'Empty'});
                            return v;
                        },
                        content: ({num}, collection) => `${num > -1 ? `<img class="skill-icon-xs mr-1" src="${CDNDIR}${items[num].media}"> ` : ''}${num > -1 ? items[num].name : 'Empty'}`,
                        render: ({id, name}) => `${id > -1 ? `<img class="skill-icon-xs mr-1" src="${CDNDIR}${items[id].media}"> ` : ''} ${name}`
                    });
                    if(type == 'alt')
                        values.push({
                        id: 'num',
                        name: 'Alts',
                        type: 'dropdown',
                        default: -1,
                        values: ({slot}) => {
                            let v = [...raidManager.specialAttackSelection].filter((attack, i, arr) => arr.findIndex(a => attack.id == a.id) == i);
                            v.unshift({id: -1, name: 'Empty'});
                            return v;
                        },
                        content: ({num}, collection) => `${collection.find(attack => attack.id == num).name}`,
                        render: ({id, name, attackTypes}) => `${attackTypes && attackTypes.length == 1 ? `(${attackTypes[0].toUpperCase()})` : ''} ${name}`
                    });
                    return values;
                }
            },
            food: {
                id: 'food',
                name: 'Food',
                visible: true,
                selectable: true,
                params: [
                    {
                        id: 'type',
                        name: 'Type',
                        default: 'qty',
                        type: 'dropdown',
                        values: () => ({healsFor: {id: 'healsFor', name: 'Heals For'}, qty: {id: 'qty', name: 'Quantity'}, total: {id: 'total', name: 'Total Healing'}})
                    }
                ],
                evaluate: ({comparison, type, ...rest}) => {
                    let a = 0;
                    if(type == 'healsFor')
                        a = items[raidManager.player.food.slots[raidManager.player.food.selectedSlot].item.id].healsFor;
                    if(type == 'qty')
                        a = raidManager.player.food.slots[raidManager.player.food.selectedSlot].quantity;
                    if(type == 'total')
                        a = items[raidManager.player.food.slots[raidManager.player.food.selectedSlot].item.id].healsFor * raidManager.player.food.slots[raidManager.player.food.selectedSlot].quantity;

                    return golbinRaidComparisons[comparison].fn(a, rest);
                },
                comparisons: () => [
                    golbinRaidComparisons['less-than'],
                    golbinRaidComparisons['less-than-equals'],
                    golbinRaidComparisons['greater-than'],
                    golbinRaidComparisons['greater-than-equals'],
                ],
                values: () => []
            },
            rune: {
                id: 'rune',
                name: 'Rune Count',
                visible: true,
                selectable: true,
                params: [
                    {
                        id: 'type',
                        name: 'Rune',
                        type: 'dropdown',
                        default: CONSTANTS.item.Air_Rune,
                        values: () => Object.fromEntries(availableRunes().map(rune => [rune, items[rune]])),
                        content: ({type}, collection) => `<img class="skill-icon-xs mr-1" src="${CDNDIR}${items[type].media}"> ${items[type].name}`,
                        render: ({id, name}) => `<img class="skill-icon-xs mr-1" src="${CDNDIR}${items[id].media}"> ${name}`
                    }
                ],
                evaluate: ({comparison, type, ...rest}) => {
                    let a = golbinItemCount(type);
                    return golbinRaidComparisons[comparison].fn(a, rest);
                },
                comparisons: () => [
                    golbinRaidComparisons['less-than'],
                    golbinRaidComparisons['less-than-equals'],
                    golbinRaidComparisons['greater-than'],
                    golbinRaidComparisons['greater-than-equals'],
                ],
                values: () => []
            },
            ammo: {
                id: 'ammo',
                name: 'Ammo Count',
                visible: true,
                selectable: true,
                params: [],
                evaluate: ({comparison, ...rest}) => {
                    let a = raidManager.player.equipment.slotArray[CONSTANTS.equipmentSlot.Quiver].quantity;
                    return golbinRaidComparisons[comparison].fn(a, rest);
                },
                comparisons: () => [
                    golbinRaidComparisons['less-than'],
                    golbinRaidComparisons['less-than-equals'],
                    golbinRaidComparisons['greater-than'],
                    golbinRaidComparisons['greater-than-equals'],
                ],
                values: () => []
            },
            stats: {
                id: 'stats',
                name: 'Stats',
                visible: true,
                selectable: true,
                params: [
                    {
                        id: 'type',
                        name: 'Type',
                        default: 'damage-reduction',
                        type: 'dropdown',
                        values: () => {
                            let stats = raidManager.player.stats.getValueTable();
                            stats.forEach(stat => stat.id = stat.name.toLowerCase().replace(' ', '-'));
                            return stats.map(stat => stat);
                        },
                        content: ({type}, collection) => `${collection.find(c => c.id == type).name}`,
                        render: ({id, name}) => `${name}`
                    }
                ],
                evaluate: ({comparison, type, ...rest}) => {
                    let stats = raidManager.player.stats.getValueTable();
                    let stat = stats.find(stat => stat.name.toLowerCase().replace(' ', '-') == type);
                    return golbinRaidComparisons[comparison].fn((stat || {value: 0}).value, rest);
                },
                comparisons: () => [
                    golbinRaidComparisons['equals'],
                    golbinRaidComparisons['not-equals'],
                    golbinRaidComparisons['less-than'],
                    golbinRaidComparisons['less-than-equals'],
                    golbinRaidComparisons['greater-than'],
                    golbinRaidComparisons['greater-than-equals'],
                ],
                values: () => []
            },
            or: {
                id: 'or',
                name: 'OR',
                visible: true,
                selectable: true,
                container: true,
                evaluate: ({conditions, ...rest}) => {
                    return conditions.reduce((a,b) => a || golbinRaidConditionals[b.conditional].evaluate(b), false);
                }
            },
            and: {
                id: 'and',
                name: 'AND',
                visible: true,
                selectable: true,
                container: true,
                evaluate: ({conditions, ...rest}) => {
                    return conditions.reduce((a,b) => a && golbinRaidConditionals[b.conditional].evaluate(b), true);
                }
            },
            default: {
                id: 'default',
                name: 'Default',
                visible: true,
                selectable: true,
                evaluate: ({...rest}) => {
                    return true
                }
            },
            result: {
                visible: false,
                selectable: false,
                evaluate: ({result, conditional, ...rest}) => {
                    let ret = golbinRaidConditionals[conditional].evaluate(rest);
                    if(result == 'passive' && raidManager.player.modifiers.golbinRaidPassiveSlotUnlocked == 0)
                        ret = false;
                    return result && ret ? result : ret;
                }
            }
        }

        function evaluateSteps(steps) {
            for(let i=0; i<steps.length; i++) {
                let result = golbinRaidConditionals.result.evaluate(steps[i]);
                if(result !== false)
                    return { result: result, step: steps[i] };
            }
        }
        window.evaluateSteps = evaluateSteps;

        function itemWeight(id, isAlt=false, slot=false) {
            let item = items[id];
            if(!item)
                return -1;

            let equipmentStats = new EquipmentStats(item.equipmentStats);

            let weight = 0;

            weight += equipmentStats.attackSpeed / 1000

            if(Math.max(equipmentStats.stabAttackBonus, equipmentStats.slashAttackBonus, equipmentStats.blockAttackBonus) > 0)
                weight += Math.max(equipmentStats.stabAttackBonus, equipmentStats.slashAttackBonus, equipmentStats.blockAttackBonus);
            if(equipmentStats.rangedAttackBonus > 0)
                weight += equipmentStats.rangedAttackBonus / 2;
            if(equipmentStats.magicAttackBonus > 0)
                weight += equipmentStats.magicAttackBonus / 2;

            if(equipmentStats.meleeStrengthBonus > 0)
                weight += equipmentStats.meleeStrengthBonus
            if(equipmentStats.rangedStrengthBonus > 0)
                weight += equipmentStats.rangedStrengthBonus / 2
            if(equipmentStats.magicDamageBonus > 0)
                weight += equipmentStats.magicDamageBonus / 2

            if(equipmentStats.meleeDefenceBonus > 0)
                weight += equipmentStats.meleeDefenceBonus
            if(equipmentStats.rangedDefenceBonus > 0)
                weight += equipmentStats.rangedDefenceBonus / 2
            if(equipmentStats.magicDefenceBonus > 0)
                weight += equipmentStats.magicDefenceBonus / 2

            weight += equipmentStats.damageReduction * 1000


            if(combatLevel(item) >= 70)
                weight += 2500;

            if(combatLevel(item) >= 85)
                weight += 5000;

            if(item.validSlots.includes('Weapon') && item.occupiesSlots.includes('Shield'))
                weight = -1;

            if(item.attackType === "ranged" && item.validSlots.filter(slot => slot != CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Passive]).includes("Weapon"))
                weight = -1;

            if(item.attackType == "magic" && item.validSlots.filter(slot => slot != CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Passive]).includes("Weapon"))
                weight = -1;

            equipmentStats = null;

            return weight;
        }

        function generateTooltip(id, qty=1, isPassive=false, isAlt=false, slot=false, altAttacks=[]) {
            let item = items[id];
            if(!item)
                return `<div class="text-center"><span class="text-warning">${slot}</span></div>`;
            if(!slot && item.validSlots !== undefined && item.validSlots.length > 0)
                slot = item.validSlots[0];
            if(isPassive)
                slot = CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Passive];
            let itemStat = "";
            if (item.healsFor)
                itemStat += `<br><span class="text-white">Healing: ${(item.healsFor * qty).toFixed(2)}</span>`;
            if (isEquipment(item) && !isPassive && !(slot && golbinRaiderPriorities[slot] && golbinRaiderPriorities[slot].includes(id)))
                itemStat += `<br><span class="text-white">Weight: ${itemWeight(id, isAlt, slot)}</span>`;
            if(slot && golbinRaiderPriorities[slot] && golbinRaiderPriorities[slot].includes(id))
                itemStat += `<br><span class="text-white">Priority: ${golbinRaiderPriorities[slot].indexOf(id) + 1}</span>`;
            if (isEquipment(item) && !isPassive && isAlt)
                itemStat += `<br><span class="text-warning">ALT</span>`;
            if (isEquipment(item) && !isPassive && isAlt && altAttacks.length > 0)
                itemStat += altAttacks.map((id)=>{
                    let attack = attacksIDMap.get(id);
                    if(attack !== undefined) {
                        return `<br><span class="text-danger">${attack.name} (${formatPercent(attack.defaultChance)}): <span class="text-warning">${describeAttack(attack)}</span></span>`;
                    } else {
                        return ``;
                    }
                }).join("");
            if (isEquipment(item) && !isPassive && !isAlt && item.hasSpecialAttack)
                itemStat += item.specialAttacks.map((attack)=>{
                    return `<br><span class="text-danger">${attack.name} (${formatPercent(attack.defaultChance)}): <span class="text-warning">${describeAttack(attack)}</span></span>`;
                }).join("");
            if (item.description != undefined)
                itemStat += `<br><span class="text-info">${item.description}</span>`;

            if (!isPassive) {
                let equipStats = item.equipmentStats;
                if(equipStats) {
                    equipStats.forEach((stat)=>{
                        itemStat += '<br>';
                        if (stat.value > 0) {
                            itemStat += Equipment.getEquipStatDescription(stat.key, stat.value);
                        } else {
                            itemStat += `<span class="text-danger">${Equipment.getEquipStatDescription(stat.key, stat.value)}</span>`;
                        }
                    });
                }
            }

            return `<div class="text-center"><span class="text-warning">${item.name}</span><small class='text-success'>${itemStat}</small></div>`;
        }

        function generateSpecialTooltip(specialAttacks=[]) {
            let allAttacks = specialAttacks.map((slot, i) => {
                if(slot.length == 0)
                    return "";
                let specials = slot.map((id)=>{
                    let attack = attacksIDMap.get(id);
                    if(attack !== undefined) {
                        return `<br><span class="text-danger">${attack.name} (${formatPercent(attack.defaultChance)}): <span class="text-warning">${describeAttack(attack)}</span></span>`;
                    } else {
                        return "";
                    }
                }).join("");
                return `<br><span class="text-success">${CONSTANTS.equipmentSlot[i]}</span><small class='text-warning'>${specials}</small>`
            }).join("");
            return `<div class="text-center"><span class="text-warning">Special Attacks</span>${allAttacks}</div>`;
        }

        function generateItemImage(id, qty=0, selected=false, current=false, slot=false, isAlt=false, altAttacks=[]) {
            return `
                <item-icon
                    class="draggable"
                    data-id="${id}"
                    data-qty="${qty}"
                    data-slot="${slot}"
                    data-is-alt="${isAlt}"
                    data-alt-attacks="${JSON.stringify(altAttacks)}"
                    data-is-passive="${slot === CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Passive]}"
                    style="display: inline-block; position: relative; height: 59px; width: 59px;"
                    draggable="true">
                    <img class="combat-equip-img border border-2x border-rounded-equip border-combat-outline p-1 ${selected ? 'border-info' : ''} ${isAlt && !selected ? 'border-warning' : ''}"
                         src="${CDNDIR + (id != -1 && items[id] ? items[id].media : (slot!==false ? 'assets/media/bank/' + equipmentSlotData[slot].emptyMedia + '.png' : 'assets/media/bank/passive_slot.png'))}"
                         style="${current ? 'border-color: #e56767 !important;' : ''}" />
                    <div class="font-size-sm text-white text-center ${qty <= 1 ? 'd-none' : ''}" style="position: absolute; bottom: 0px; width: 100%;">
                        <small class="badge-pill bg-secondary">${qty}</small>
                    </div>
                </item-icon>
                `;
        }

        function generateRuneImage(runeCount=false) {
            return `
                <rune-icon
                    style="display: inline-block; position: relative; height: 59px; width: 59px;"
                    data-rune-count='${JSON.stringify(runeCount)}'>
                    <img class="combat-equip-img border border-2x border-rounded-equip border-combat-outline p-1"
                         src="${CDNDIR + items[CONSTANTS.item.Rune_Essence].media}"/>
                </rune-icon>
                `
        }

        function generateSpecialImage(currentItems=false) {
            let specialAttacks = currentItems.map((slot, i) => {
                if(slot.isAlt)
                    return slot.altAttacks;
                if(slot.id == -1 || i == CONSTANTS.equipmentSlot.Passive)
                    return [];
                let item = items[slot.id];
                if(isEquipment(item) && item.hasSpecialAttack)
                    return item.specialAttacks.map(attack => attack.id);
                return [];
            });
            if(specialAttacks.flat().length > 0)
                return `
                    <special-icon
                        style="display: inline-block; position: relative; height: 59px; width: 59px;"
                        data-special-attacks='${JSON.stringify(specialAttacks)}'>
                        <img class="combat-equip-img border border-2x border-rounded-equip border-combat-outline p-1"
                             src="${CDNDIR}assets/media/main/special_attack.svg"/>
                    </rune-icon>
                    `;
            return "";
        }

        function generateEquipmentGrid(currentItems=false, currentRunes=false, currentFood=false) {
            let equipMap = [CONSTANTS.equipmentSlot.Passive, CONSTANTS.equipmentSlot.Helmet,    -1,
                            CONSTANTS.equipmentSlot.Cape,    CONSTANTS.equipmentSlot.Amulet,      CONSTANTS.equipmentSlot.Quiver,
                            CONSTANTS.equipmentSlot.Weapon,  CONSTANTS.equipmentSlot.Platebody, CONSTANTS.equipmentSlot.Shield,
                            -1,                              CONSTANTS.equipmentSlot.Platelegs, -1,
                            CONSTANTS.equipmentSlot.Gloves,  CONSTANTS.equipmentSlot.Boots,     CONSTANTS.equipmentSlot.Ring,
                            (currentRunes ? -2 : -1), -1, (currentFood ? -3 : -1)];
            return `<div class="text-center"><span class="text-warning">Equipment</span>
                <equipment-grid style="display: grid; grid-template-rows: 60px 60px 60px 60px 60px 60px; grid-template-columns: 60px 60px 60px;">
                    ${equipMap.map(slot => {
                        if(slot > -1) {
                            return generateItemImage(currentItems[slot].id, currentItems[slot].qty, false, false, CONSTANTS.equipmentSlot[slot], currentItems[slot].isAlt, currentItems[slot].altAttacks);
                        } else if (slot == -2) {
                            return generateRuneImage(currentRunes)
                        } else if (slot == -3) {
                            return generateItemImage(currentFood.id, currentFood.qty, false, false, CONSTANTS.equipmentSlot[slot]);
                        } else {
                            return `<div></div>`
                        }
                    }).join('')}
                </equipment-grid>
            </div>`;
        }

        function generateRuneGrid(runeCount=false) {
            return `<div class="text-center"><span class="text-warning">Runes</span>
                <rune-grid style="display: grid; grid-template-rows: 60px 60px 60px; grid-template-columns: 60px 60px 60px 60px;">
                    ${runeCount.map(rune => generateItemImage(rune[0], rune[1], true, false)).join('')}
                </rune-grid>
            </div>`;
        }

        function itemOnShow(instance) {
            let id = parseInt(instance.reference.dataset.id);
            let qty = parseInt(instance.reference.dataset.qty);
            let isAlt = instance.reference.dataset.isAlt === "true";
            let altAttacks = JSON.parse(instance.reference.dataset.altAttacks);
            let isPassive = instance.reference.dataset.isPassive === "true";
            let slot = instance.reference.dataset.slot;
            if(slot === "false")
                slot = false;
            instance.setContent(generateTooltip(id, qty, isPassive, isAlt, slot, altAttacks));
        }

        function itemOnHidden(instance) {
            instance.setContent('');
        }

        function specialOnShow(instance) {
            let specialAttacks = JSON.parse(instance.reference.dataset.specialAttacks);
            instance.setContent(generateSpecialTooltip(specialAttacks));
        }

        function specialOnHidden(instance) {
            instance.setContent('');
        }

        function runeOnShow(instance) {
            let runeCount = JSON.parse(instance.reference.dataset.runeCount);
            instance.setContent(generateRuneGrid(runeCount));

            tippy($('item-icon', instance.popper.children[0].children[0]).toArray(), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: false,
                animation: false,
                onShow: itemOnShow,
                onHidden: itemOnHidden
            });
        }

        function runeOnHidden(instance) {
            $('item-icon', instance.popper.children[0].children[0]).toArray().forEach(el => {
                if(el._tippy) {
                    el._tippy.destroy();
                }
            });
            instance.setContent('');
        }

        function equipmentOnShow(instance) {
            let currentItems = JSON.parse(instance.reference.dataset.currentItems);
            let currentRunes = JSON.parse(instance.reference.dataset.currentRunes);
            let currentFood = JSON.parse(instance.reference.dataset.currentFood);
            instance.setContent(generateEquipmentGrid(currentItems, currentRunes, currentFood));

            tippy($('item-icon', instance.popper.children[0].children[0]).toArray(), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: false,
                animation: false,
                onShow: itemOnShow,
                onHidden: itemOnHidden
            });

            tippy($('rune-icon', instance.popper.children[0].children[0]).toArray(), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: true,
                animation: false,
                onShow: runeOnShow,
                onHidden: runeOnHidden
            });
        }

        function equipmentOnHidden(instance) {
            $('item-icon', instance.popper.children[0].children[0]).toArray().forEach(el => {
                if(el._tippy) {
                    el._tippy.destroy();
                }
            });
            instance.setContent('');
        }

        function addChoice(category, selected, options, currentItems, currentRunes, currentFood, extra={}) {
            if(extra.oldPassive) {
                if(extra.oldPassive == -1) {
                    currentItems[CONSTANTS.equipmentSlot.Passive].id = -1;
                } else {
                    currentItems[CONSTANTS.equipmentSlot.Passive].id = extra.oldPassive;
                }
            }

            let logEntry = `
                <entry
                    style="display: grid; grid-template-rows: 60px; grid-template-columns: auto 1fr auto auto auto; margin-top: 5px; height: 60px; width: 100%; ${raidManager.wave == 1 ? 'border-bottom: 2px solid black;' : ''}"
                    data-wave="${raidManager.wave}"
                    data-category="${category}"
                    data-selected="${selected}"
                    data-options='${JSON.stringify(options)}'>

                    <wave
                        style="display: inline-block; grid-area: 1 / 1 / 1 / 1; font-size: 36px; line-height: 60px; height: 60px; color: white; margin-top: -2px; margin-left: 10px; min-width: 65px;"
                        data-wave='${raidManager.wave}'
                        data-current-items='${JSON.stringify(currentItems)}'
                        data-current-runes='${JSON.stringify(currentRunes)}'
                        data-current-food='${JSON.stringify(currentFood)}'>
                        ${raidManager.wave}
                    </wave>
                    <special style="display: flex; grid-area: 1 / 2 / 1 / 2">
                        ${generateSpecialImage(currentItems)}
                    </special>
                    <existing-items style="display: flex; justify-content: flex-end; grid-area: 1 / 3 / 1 / 3;">
                        ${selected == -1 && category == 'weapons' ? generateItemImage(currentItems[CONSTANTS.equipmentSlot.Weapon].id, 0, true, false, CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Weapon], currentItems[CONSTANTS.equipmentSlot.Weapon].isAlt, currentItems[CONSTANTS.equipmentSlot.Weapon].altAttacks) : ''}
                        ${selected == -1 && category == 'armour' ? options.filter((value, index, self) => self.map(item => items[item.itemID].validSlots[0]).indexOf(items[value.itemID].validSlots[0]) === index).map((item, i, self) => generateItemImage(currentItems[CONSTANTS.equipmentSlot[items[item.itemID].validSlots[0]]].id, 0, true, false, false, currentItems[CONSTANTS.equipmentSlot[items[item.itemID].validSlots[0]]].isAlt, currentItems[CONSTANTS.equipmentSlot.Weapon].altAttacks)).join('') : ''}
                        ${selected == -1 && category == 'food' ? generateItemImage(currentFood.id, currentFood.qty, true, false) : ''}
                        ${selected == -1 && category == 'ammo' ? generateItemImage(currentItems[CONSTANTS.equipmentSlot.Quiver].id, currentItems[CONSTANTS.equipmentSlot.Quiver].qty, true, false, false, currentItems[CONSTANTS.equipmentSlot.Quiver].isAlt, currentItems[CONSTANTS.equipmentSlot.Weapon].altAttacks) : ''}
                        ${selected == -1 && category == 'runes' ? generateRuneImage(currentRunes) : ''}
                        ${selected == -1 && category == 'passive' ? generateItemImage(currentItems[CONSTANTS.equipmentSlot.Passive].id, 0, true, false, CONSTANTS.equipmentSlot.Passive, currentItems[CONSTANTS.equipmentSlot.Passive].isAlt, currentItems[CONSTANTS.equipmentSlot.Weapon].altAttacks) : ''}
                        ${selected > -1 && category == 'weapons' ? generateItemImage(currentItems[CONSTANTS.equipmentSlot.Weapon].id, 0, false, true, CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Weapon], currentItems[CONSTANTS.equipmentSlot.Weapon].isAlt, currentItems[CONSTANTS.equipmentSlot.Weapon].altAttacks) : ''}
                        ${selected > -1 && category == 'armour' ? options.map((item, i, self) => (self.map(option => items[option.itemID].validSlots[0]).findIndex((slot, idx) => items[item.itemID].validSlots[0] == items[options[selected].itemID].validSlots[0] ? selected == idx : items[item.itemID].validSlots[0] == slot) == i) ? generateItemImage(currentItems[CONSTANTS.equipmentSlot[items[item.itemID].validSlots[0]]].id, 0, false, selected == i, items[item.itemID].validSlots[0], currentItems[CONSTANTS.equipmentSlot[items[item.itemID].validSlots[0]]].isAlt, currentItems[CONSTANTS.equipmentSlot.Weapon].altAttacks) : '').join('') : ''}
                        ${selected > -1 && category == 'food' ? generateItemImage(currentFood.id, currentFood.qty, options[selected].itemID == currentFood.id, options[selected].itemID != currentFood.id) : ''}
                        ${selected > -1 && category == 'ammo' ? generateItemImage(currentItems[CONSTANTS.equipmentSlot.Quiver].id, currentItems[CONSTANTS.equipmentSlot.Quiver].qty, options[selected].itemID == currentItems[CONSTANTS.equipmentSlot.Quiver].id, options[selected].itemID != currentItems[CONSTANTS.equipmentSlot.Quiver].id, false, currentItems[CONSTANTS.equipmentSlot.Quiver].isAlt, currentItems[CONSTANTS.equipmentSlot.Weapon].altAttacks) : ''}
                        ${selected > -1 && category == 'runes' ? generateRuneImage(currentRunes) : ''}
                        ${selected > -1 && category == 'passive' ? generateItemImage(currentItems[CONSTANTS.equipmentSlot.Passive].id, 0, false, true, CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Passive], false) : ''}
                    </existing-items>
                    <span style="grid-area: 1 / 4 / 1 / 4; font-size: 36px; line-height: 60px; height: 60px; color: white; margin-top: -2px; margin-left: 5px; margin-right: 5px;">-></span>
                    <item-options style="display: inline-block; grid-area: 1 / 5 / 1 / 5; margin-right: 10px;">
                        ${options.map((item, i) => (item != undefined && item.itemID != undefined && item.itemID > -1) ? generateItemImage(item.itemID, item.qty, selected == i, false, items[item.itemID].validSlots != undefined ? (category == 'passive' ? CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Passive] : items[item.itemID].validSlots[0]) : false, item.isAlt, item.altAttacks) : '').join('')}
                    </item-options>
                </entry>`;
            $('log').prepend(logEntry);

            tippy($('item-icon', $('log').get(0).children[0]).toArray(), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: false,
                animation: false,
                onShow: itemOnShow,
                onHidden: itemOnHidden,
            });

            tippy($('special-icon', $('log').get(0).children[0]).toArray(), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: false,
                animation: false,
                onShow: specialOnShow,
                onHidden: specialOnHidden,
            });

            tippy($('rune-icon', $('log').get(0).children[0]).toArray(), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: true,
                animation: false,
                onShow: runeOnShow,
                onHidden: runeOnHidden,
            });

            tippy($('wave', $('log').get(0).children[0]).get(0), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: true,
                animation: false,
                onShow: equipmentOnShow,
                onHidden: equipmentOnHidden,
                appendTo: () => document.body
            });

            if($('log').get(0).children.length > 25) {
                let entries = $('log').get(0).children;

                $('item-icon', entries[entries.length-1]).toArray().forEach(el => {
                    if(el._tippy)
                        el._tippy.destroy();
                });

                $('rune-icon', entries[entries.length-1]).toArray().forEach(el => {
                    if(el._tippy)
                        el._tippy.destroy();
                });

                $('wave', entries[entries.length-1]).toArray().forEach(el => {
                    if(el._tippy)
                        el._tippy.destroy();
                });

                if(entries[entries.length-1]._tippy)
                    entries[entries.length-1]._tippy.destroy();

                $('log').get(0).removeChild(entries[entries.length-1]);

                entries = null;
            }
        }

        function generateModifiersTab() {
            //modifierData
            //RaidManager.possibleModifiers
            /*
        const playerMods = new MappedModifiers();
        playerMods.addArrayModifiers(this.randomPlayerModifiers);
        const golbinMods = new MappedModifiers();
        golbinMods.addArrayModifiers(this.randomEnemyModifiers);
        ...playerMods.getActiveModifierDescriptions()
        ...golbinMods.getActiveModifierDescriptions()
        */
            return `
                <div style='display: grid; grid-template-rows: 60px 1fr; justify-items: start; align-items: center; position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow-y: scroll;'>
                <buttons style='display: grid; grid-template-rows: 60px; grid-template-columns: repeat(2, 1fr); justify-items: center; align-items: center; width: 100%;'>
                    <button class='btn m-1 btn-outline-success' onclick="showGolbinRaiderModifiers('positive')">Positive</button>
                    <button class='btn m-1 btn-outline-danger' onclick="showGolbinRaiderModifiers('negative')">Negative</button>
                </buttons>
                <modifiers style='display: grid; grid-template-columns: 1fr; grid-auto-flow: row; margin: 10px;'></modifiers>
                </div>
            `;
        }

        let sortableModifiersInstance = false;

        function updateGolbinModifierSoftCap(type, key, val) {
            golbinRaiderModifierPriority[type].find(m => m.key == key).soft = parseInt(val);
            localStorage.setItem(`golbinRaiderModifierPriority`, JSON.stringify(golbinRaiderModifierPriority));
        }
        window.updateGolbinModifierSoftCap = updateGolbinModifierSoftCap;

        function updateGolbinModifierHardCap(type, key, val) {
            golbinRaiderModifierPriority[type].find(m => m.key == key).hard = parseInt(val);
            localStorage.setItem(`golbinRaiderModifierPriority`, JSON.stringify(golbinRaiderModifierPriority));
        }
        window.updateGolbinModifierHardCap = updateGolbinModifierHardCap;


        function showGolbinRaiderModifiers(type) {
            if(sortableModifiersInstance) {
                sortableModifiersInstance.destroy();
                sortableModifiersInstance = false;
            }
            let buttons = $('buttons button', $('sidebar container tabs tab.modifiers')).toArray()
            buttons[0].classList.remove('btn-secondary');
            buttons[1].classList.remove('btn-secondary');
            if(type == 'positive')
                buttons[0].classList.add('btn-secondary');
            if(type == 'negative')
                buttons[1].classList.add('btn-secondary');

            let posHead = getLangString('GOLBIN_RAID', type == 'positive' ? 'GIVES_YOU' : 'GIVES_GOLBINS');
            let negHead = getLangString('GOLBIN_RAID', type == 'positive' ? 'GIVES_GOLBINS' : 'GIVES_YOU');
            let textClass = type == 'positive' ? 'text-success' : 'text-danger';

            $('sidebar container tabs tab.modifiers modifiers').get(0).innerHTML = '';
            $('sidebar container tabs tab.modifiers modifiers').append(`
            <header style='display: grid; grid-template-columns: 1fr repeat(2, 100px); grid-auto-flow: row; align-items: center;'>
                <span class='text-white'>Modifier</span>
                <span class='text-white'>Soft Cap</span>
                <span class='text-white'>Hard Cap</span>
            </header>`);

            let sortedModifiers = [...RaidManager.possibleModifiers].sort((a,b) => golbinRaiderModifierPriority[type].findIndex(m => m.key == a.key) - golbinRaiderModifierPriority[type].findIndex(m => m.key == b.key));
            $('sidebar container tabs tab.modifiers modifiers').append(sortedModifiers.map(mod => {
                const modData = modifierData[mod.key];

                let min = 1;
                let max = 5;

                if(mod.multiplier !== undefined) {
                    min *= mod.multiplier;
                    max *= mod.multiplier;
                }

                if(modData.modifyValue !== undefined) {
                    min = modData.modifyValue(min);
                    max = modData.modifyValue(max);
                }

                let val = `<span class='text-warning'>(${min}-${max})</span>`;
                const text = `${modData.isNegative ? negHead : posHead} ${templateString(modifierData[mod.key].langDescription, {value: val})}`;
                return `<modifier style='display: grid; grid-template-columns: 1fr repeat(2, 100px); grid-auto-flow: row; align-items: center;'>
                    <span class='${textClass}'>
                        <small>${text}</small>
                    </span>
                    <value style="display: inline-block; width: 100px;">
                        <input type="number" min="0" class="form-control m-1" placeholder="" value="${golbinRaiderModifierPriority[type].find(m => m.key == mod.key).soft}" oninput='updateGolbinModifierSoftCap("${type}", "${mod.key}", this.value)'>
                    </value>
                    <value style="display: inline-block; width: 100px;">
                        <input type="number" min="0" class="form-control m-1" placeholder="" value="${golbinRaiderModifierPriority[type].find(m => m.key == mod.key).hard}" oninput='updateGolbinModifierHardCap("${type}", "${mod.key}", this.value)'>
                    </value>
                </modifier>`;
            }).join(''));



            sortableModifiersInstance = Sortable.create($('sidebar container tabs tab.modifiers modifiers').get(0), {
                group: `golbinRaiderModifiers`,
                draggable: "modifier",
                filter: "header",
                handle: ".text-success, .text-danger",
                onEnd: (evt) => {
                    golbinRaiderModifierPriority[type].splice(evt.newDraggableIndex, 0, golbinRaiderModifierPriority[type].splice(evt.oldDraggableIndex, 1)[0]);
                    localStorage.setItem(`golbinRaiderModifierPriority`, JSON.stringify(golbinRaiderModifierPriority));
                },
                onMove: function() {
                    tippy.hideAll();
                },
                onChoose: function(evt) {
                    tippy.hideAll();
                },
            });
        }
        window.showGolbinRaiderModifiers = showGolbinRaiderModifiers;

        function generatePrioritiesTab() {
            return `
                <priorities style='display: grid; grid-template-rows: repeat(2, 60px); grid-template-columns: repeat(6, 60px); justify-items: center; align-items: center;'>
                    ${prioritiesList.map(slot => `<priority onclick="showGolbinRaiderPriority('${CONSTANTS.equipmentSlot[slot]}')">${generateItemImage(-1, 0, false, false, CONSTANTS.equipmentSlot[slot])}</priority>`).join('')}
                </priorities>
                <itemlist style='height: 100%; width: 100%;'></itemlist>
            `;
        };
        function showGolbinRaiderItemSelect(slot, index) {
            $("#modal-golbinraider-item-select").get(0).dataset.slot = slot;
            $("#modal-golbinraider-item-select").get(0).dataset.index = index;
            updateGolbinRaiderItemSearch('');
            $("#modal-golbinraider-item-select").modal("show");
        }

        let sortableInstance = false;

        function showGolbinRaiderPriority(slot) {
            if(sortableInstance) {
                sortableInstance.destroy();
                sortableInstance = false;
            }
            $('item-icon img', $('sidebar container tabs tab priorities').get(0)).toArray().forEach((el, i) => {
                el.classList.remove('border-info');
                if(CONSTANTS.equipmentSlot[prioritiesList[i]] == slot)
                    el.classList.add('border-info');
            });
            $('sidebar container tabs tab itemlist').get(0).innerHTML = '';
            $('sidebar container tabs tab itemlist').append(golbinRaiderPriorities[slot].map(id => generateItemImage(id, 0, false, false, slot)).join(''));
            $('sidebar container tabs tab itemlist').append(generateItemImage(-1, 0, false, false, slot));


            sortableInstance = Sortable.create($('sidebar container tabs tab itemlist').get(0), {
                group: `golbinRaiderPriority-${slot}`,
                draggable: "item-icon",
                onEnd: (evt) => {
                    golbinRaiderPriorities[slot].splice(evt.newIndex, 0, golbinRaiderPriorities[slot].splice(evt.oldIndex, 1)[0]);
                    golbinRaiderPriorities[slot] = golbinRaiderPriorities[slot].filter(id => id > -1);
                    localStorage.setItem(`golbinRaiderPriorities`, JSON.stringify(golbinRaiderPriorities));
                },
                onMove: function() {
                    tippy.hideAll();
                },
                onChoose: function(evt) {
                    tippy.hideAll();
                },
            });

            $('item-icon', $('sidebar container tabs tab itemlist').get(0)).toArray().forEach((el, i) => {
               el.setAttribute('onclick', `showGolbinRaiderItemSelect('${slot}', ${i})`);
            });

            tippy($('item-icon', $('sidebar container tabs tab itemlist').get(0)).toArray(), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: false,
                animation: false,
                onShow: itemOnShow,
                onHidden: itemOnHidden
            });
        }

        function generateDropdown(collection=[],
                                   selected=-1,
                                   content=() => `<img class="skill-icon-xs mr-1" src="${CDNDIR}assets/media/main/bank_header.svg">`,
                                   render=({media, name}) => `<a class="dropdown-item pointer-enabled"><img class="skill-icon-xs mr-1" src="${media}">${name}</a>`) {
            return `
                <div class="dropdown" style="margin: 0 5px; display: inline-block;">
                  	<button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                   		${content(selected, collection.map ? collection : Object.values(collection))}
                  	</button>
                    <div class="dropdown-menu dropdown-menu-right font-size-sm overflow-y-auto" style="max-height:80vh;">
                        ${(collection.map ? collection : Object.values(collection)).map(item => render(item)).join('')}
                    </div>
                </div>
            `;
        }

        function triggerStepsSave() {
            localStorage.setItem(`golbinRaiderSelectionSteps`, JSON.stringify(golbinRaiderSelectionSteps));
        }

        function getConditionAndStep(idxs) {
            let path = idxs.length ? [...idxs] : [idxs];

            let i = path.shift();
            let condition = golbinRaiderSelectionSteps[i];
            let step = $('steps > sortable-steps > step, steps > step').get(i);
            if(path.length > 0) {
                condition = path.reduce((a,b) => a.conditions[b], condition);
                step = path.reduce((a,b) => $('> conditional > conditions > step', a).get(b), step);
            }

            return {condition: condition, step: step};
        }

        function updateGolbinRaiderConditional(idxs, id) {
            let { condition, step } = getConditionAndStep(idxs);

            let el = $('> conditional', step).get(0);

            let old = condition.conditional;

            condition.conditional = id;

            if(golbinRaidConditionals[old].params)
                golbinRaidConditionals[old].params.forEach(param => delete condition[param.id]);

            if(golbinRaidConditionals[id].params)
                golbinRaidConditionals[id].params.forEach(param => param.visible === undefined || param.visible(condition) ? condition[param.id] = param.default : '');

            if(golbinRaidConditionals[old].container && !golbinRaidConditionals[id].container)
                delete condition.conditions;
            if(!golbinRaidConditionals[old].container && golbinRaidConditionals[id].container) {
                delete condition.comparison;
                condition.conditions = [];
            }


            if(condition.comparison) {
                if(golbinRaidComparisons[condition.comparison].collection) {
                    delete condition.collection;
                } else {
                    let values = [...golbinRaidComparisons[condition.comparison].values(condition)];

                    if(golbinRaidConditionals[old].values) {
                        golbinRaidConditionals[old].values(condition).forEach(val => {
                            let idx = values.findIndex(v => v.id == val.id);
                            if(idx > -1)
                                values[idx] = val;
                        });
                    }

                    if(values.length > 0)
                        values.forEach(value => delete condition[value.id]);
                }
            }

            let comparisons = golbinRaidConditionals[id].comparisons && golbinRaidConditionals[id].comparisons(condition);
            if(comparisons && comparisons.length > 0) {
                if(comparisons.findIndex(comp => comp.id == condition.comparison) == -1)
                    condition.comparison = comparisons[0].id;
            } else {
                delete condition.comparison;
            }

            if(condition.comparison) {
                if(golbinRaidComparisons[condition.comparison].collection) {
                    condition.collection = [];
                } else {
                    let values = [...golbinRaidComparisons[condition.comparison].values(condition)];

                    if(golbinRaidConditionals[id].values) {
                        golbinRaidConditionals[id].values(condition).forEach(val => {
                            let idx = values.findIndex(v => v.id == val.id);
                            if(idx > -1)
                                values[idx] = val;
                        });
                    }

                    if(values.length > 0)
                        values.forEach(value => condition[value.id] = value.default);
                }
            }

            el.outerHTML = generateConditional(idxs, condition);
            triggerStepsSave();
        }
        window.updateGolbinRaiderConditional = updateGolbinRaiderConditional;

        function updateGolbinRaiderComparison(idxs, id) {
            let { condition, step } = getConditionAndStep(idxs);

            let el = $('> conditional > comparison', step).get(0);

            let old = condition.comparison;

            condition.comparison = id;

            let oldValues = [...golbinRaidComparisons[old].values(condition)];
            let values = [...golbinRaidComparisons[condition.comparison].values(condition)];

            if(golbinRaidConditionals[condition.conditional].values) {
                golbinRaidConditionals[condition.conditional].values(condition).forEach(val => {
                    let oldIdx = oldValues.findIndex(v => v.id == val.id);
                    let idx = values.findIndex(v => v.id == val.id);

                    if(oldIdx > -1)
                        oldValues[oldIdx] = val;
                    if(idx > -1)
                        values[idx] = val;
                });
            }

            if(golbinRaidComparisons[old].collection && golbinRaidComparisons[id].collection) {
                if(oldValues.length > 0) {
                    oldValues.forEach(value => {
                        let vIdx = values.findIndex(val => val.id == value.id);
                        if(vIdx == -1 || values[vIdx].type != value.type) {
                            condition.collection.forEach(item => {
                                delete item[value.id];
                            });
                        }
                    });
                }
                if(values.length > 0) {
                    values.forEach((value, i) => {
                        let vIdx = oldValues.findIndex(val => val.id == value.id);
                        if(vIdx == -1 || oldValues[vIdx].type != value.type) {
                            condition.collection.forEach((item, j) => {
                                item[value.id] = value.default;
                                updateGolbinRaiderValue(idxs, value.id, condition[value.id]);
                            });
                        }
                    });
                }
            } else if(golbinRaidComparisons[old].collection && !golbinRaidComparisons[id].collection) {
                    delete condition.collection;
                    if(values.length > 0) {
                        values.forEach((value, i) => {
                            condition[value.id] = value.default;
                            updateGolbinRaiderValue(idxs, value.id, condition[value.id]);
                        });
                    }
            } else if(!golbinRaidComparisons[old].collection && golbinRaidComparisons[id].collection) {
                    condition.collection = [];
                    if(oldValues.length > 0)
                        oldValues.forEach(value => delete condition[value.id]);
            } else {
                if(values.length > 0) {
                    values.forEach((value, i) => {
                        let vIdx = oldValues.findIndex(val => val.id == value.id);
                        if(vIdx == -1 || oldValues[vIdx].type != value.type) {
                            condition[value.id] = value.default;
                        }
                        updateGolbinRaiderValue(idxs, value.id, condition[value.id]);
                    });
                }
            }

            el.outerHTML = generateComparison(idxs, condition);
            triggerStepsSave();
        }
        window.updateGolbinRaiderComparison = updateGolbinRaiderComparison;

        function updateGolbinRaiderResult(idxs, id) {
            let { condition, step } = getConditionAndStep(idxs);

            let el = $('> conditional > result', step).get(0);

            condition.result = id;

            el.outerHTML = generateResult(idxs, condition);
            triggerStepsSave();
        }
        window.updateGolbinRaiderResult = updateGolbinRaiderResult;

        function updateGolbinRaiderParameter(idxs, i, id) {
            let { condition, step } = getConditionAndStep(idxs);

            let els = $('> conditional > parameters', step);
            let param = golbinRaidConditionals[condition.conditional].params[i];

            let oldCondition = { ...condition }

            condition[param.id] = id;

            for(let j=0; j < golbinRaidConditionals[condition.conditional].params.length; j++) {
                let p = golbinRaidConditionals[condition.conditional].params[j];
                if(p.visible === undefined || p.visible(condition)) {
                    let values = p.values && p.values(condition);
                    if(values && values.length > 0) {
                        if(values.findIndex(val => val.id == condition[p.id]) == -1) {
                            condition[p.id] = values[0].id;
                        }
                    }
                } else {
                    delete condition[p.id];
                }
            }

            for(let j=0; j < golbinRaidConditionals[condition.conditional].params.length; j++) {
                let p = golbinRaidConditionals[condition.conditional].params[j];
                let el = $('parameter', els).get(j);
                if(p.visible === undefined || p.visible(condition)) {
                    if(el === undefined) {
                        condition[p.id] = p.default;
                        els.append(generateParam(idxs, j, condition));
                    } else {
                        el.outerHTML = generateParam(idxs, j, condition);
                    }
                } else {
                    if(el !== undefined) {
                        el.outerHTML = '';
                    }
                }
            }

            let comparisons = golbinRaidConditionals[condition.conditional].comparisons && golbinRaidConditionals[condition.conditional].comparisons(condition);
            if(comparisons && comparisons.length > 0) {
                if(comparisons.findIndex(comp => comp.id == condition.comparison) == -1) {
                    condition.comparison = comparisons[0].id;
                }
                updateGolbinRaiderComparison(idxs, condition.comparison);
            } else {
                delete condition.comparison;
            }



            let oldValues = [...golbinRaidComparisons[oldCondition.comparison].values(oldCondition)];
            let values = [...golbinRaidComparisons[condition.comparison].values(condition)];

            if(golbinRaidConditionals[condition.conditional].values) {
                golbinRaidConditionals[condition.conditional].values(condition).forEach(val => {
                    let idx = values.findIndex(v => v.id == val.id);

                    if(idx > -1)
                        values[idx] = val;
                });
            }

            if(golbinRaidConditionals[oldCondition.conditional].values) {
                golbinRaidConditionals[oldCondition.conditional].values(oldCondition).forEach(val => {
                    let idx = values.findIndex(v => v.id == val.id);

                    if(idx > -1)
                        oldValues[idx] = val;
                });
            }

            if(golbinRaidComparisons[oldCondition.comparison].collection && golbinRaidComparisons[condition.comparison].collection) {
                if(oldValues.length > 0) {
                    oldValues.forEach(value => {
                        let vIdx = values.findIndex(val => val.id == value.id);
                        if(vIdx == -1 || values[vIdx].type != value.type) {
                            condition.collection.forEach(item => {
                                delete item[value.id];
                            });
                        }
                    });
                }
                if(values.length > 0) {
                    values.forEach((value, i) => {
                        let vIdx = oldValues.findIndex(val => val.id == value.id);
                        if(vIdx == -1 || oldValues[vIdx].type != value.type) {
                            condition.collection.forEach((item, j) => {
                                item[value.id] = value.default;
                                updateGolbinRaiderValue(idxs, value.id, condition[value.id]);
                            });
                        }
                    });
                }
            } else if(golbinRaidComparisons[oldCondition.comparison].collection && !golbinRaidComparisons[condition.comparison].collection) {
                    delete condition.collection;
                    if(values.length > 0) {
                        values.forEach((value, i) => {
                            condition[value.id] = value.default;
                            updateGolbinRaiderValue(idxs, value.id, condition[value.id]);
                        });
                    }
            } else if(!golbinRaidComparisons[oldCondition.comparison].collection && golbinRaidComparisons[condition.comparison].collection) {
                    condition.collection = [];
                    if(oldValues.length > 0)
                        oldValues.forEach(value => delete condition[value.id]);
            } else {
                if(values.length > 0) {
                    values.forEach((value, i) => {
                        let vIdx = oldValues.findIndex(val => val.id == value.id);
                        if(vIdx == -1 || oldValues[vIdx].type != value.type) {
                            condition[value.id] = value.default;
                        }
                        updateGolbinRaiderValue(idxs, value.id, condition[value.id]);
                    });
                }
            }
            triggerStepsSave();
        }
        window.updateGolbinRaiderParameter = updateGolbinRaiderParameter;

        function updateGolbinRaiderValue(idxs, i, id, collectionIdx=-1) {
            let { condition, step } = getConditionAndStep(idxs);

            let values = [...golbinRaidComparisons[condition.comparison].values(condition)];
            if(golbinRaidConditionals[condition.conditional].values) {
                golbinRaidConditionals[condition.conditional].values(condition).forEach(val => {
                    let idx = values.findIndex(v => v.id == val.id);
                    if(idx > -1)
                        values[idx] = val;
                });
            }

            let value = values.find(val => val.id == i);
            let valueIdx = values.findIndex(val => val.id == i);

            let els = $('> conditional > comparison > values', step).get(0);
            let el = $('> value, > value-collection > value', els).get(collectionIdx > -1 ? collectionIdx : valueIdx);

            if(collectionIdx > -1) {
                condition.collection[collectionIdx][i] = id;
            } else {
                condition[i] = id;
            }

            if(el && !el.contains(document.activeElement)) // Fixes redrawing text boxes while editing
                el.outerHTML = generateValue(idxs, i, condition, collectionIdx);
            triggerStepsSave();
        }
        window.updateGolbinRaiderValue = updateGolbinRaiderValue;

        function addGolbinRaiderStep(idxs=-1) {
            if(idxs == -1) {
                golbinRaiderSelectionSteps.splice(golbinRaiderSelectionSteps.length-1, 0, {conditional: 'default', result: 'food'});
                $('steps > sortable-steps').append(generateStep([golbinRaiderSelectionSteps.length-2], golbinRaiderSelectionSteps[golbinRaiderSelectionSteps.length-2]));
                $('steps > step').get(0).outerHTML = generateStep([golbinRaiderSelectionSteps.length-1], golbinRaiderSelectionSteps[golbinRaiderSelectionSteps.length-1]);
            } else {
                let { condition, step } = getConditionAndStep(idxs);
                condition.conditions.push({conditional: 'default'});
                $('> conditional > conditions > add-condition', step).before(generateStep(idxs.concat([condition.conditions.length-1]), condition.conditions[condition.conditions.length-1]));
            }
            triggerStepsSave();
        }
        window.addGolbinRaiderStep = addGolbinRaiderStep;

        function addGolbinRaiderValueCollection(idxs) {
            let { condition, step } = getConditionAndStep(idxs);
            let valuesRoot = $('> conditional > comparison > values', step).get(0);

            let values = [...golbinRaidComparisons[condition.comparison].values(condition)];
            if(golbinRaidConditionals[condition.conditional].values) {
                golbinRaidConditionals[condition.conditional].values(condition).forEach(val => {
                    let idx = values.findIndex(v => v.id == val.id);
                    if(idx > -1)
                        values[idx] = val;
                });
            }

            let newValues = {};

            if(values.length > 0)
                values.forEach(value => newValues[value.id] = value.default);

            condition.collection.push(newValues);
            $('add-value', valuesRoot).before(generateValueCollection(idxs, condition, condition.collection.length-1));
            triggerStepsSave();
        }
        window.addGolbinRaiderValueCollection = addGolbinRaiderValueCollection;

        function removeGolbinRaiderValueCollection(idxs, collectionIdx) {
            let { condition, step } = getConditionAndStep(idxs);
            $('> conditional > comparison > values > value-collection', step).get(collectionIdx).outerHTML = '';
            condition.collection.splice(collectionIdx, 1);

            for(let i=collectionIdx; i<condition.collection.length; i++)
                $('> conditional > comparison > values > value-collection', step).get(i).outerHTML = generateValueCollection(idxs, condition, i);
            triggerStepsSave();
        }
        window.removeGolbinRaiderValueCollection = removeGolbinRaiderValueCollection;

        function removeGolbinRaiderStep(idxs) {
            if(idxs.length == 1) {
                let { condition, step } = getConditionAndStep(idxs);
                golbinRaiderSelectionSteps.splice(idxs[0], 1);
                step.outerHTML = '';

                for(let i=idxs[0]; i<golbinRaiderSelectionSteps.length-1; i++)
                    $('steps > sortable-steps > step').get(i).outerHTML = generateStep([i], golbinRaiderSelectionSteps[i]);
                 $('steps > step').get(0).outerHTML = generateStep([golbinRaiderSelectionSteps.length-1], golbinRaiderSelectionSteps[golbinRaiderSelectionSteps.length-1]);
            } else {
                let { step } = getConditionAndStep(idxs);
                let idx = idxs.pop();
                let { condition, step: conditionRoot } = getConditionAndStep(idxs);
                step.outerHTML = '';
                condition.conditions.splice(idx, 1);

                for(let i=idx; i<condition.conditions.length; i++)
                    $('> conditional > conditions > step', conditionRoot).get(i).outerHTML = generateStep(idxs.concat(i), condition.conditions[i]);
            }
            triggerStepsSave();
        }
        window.removeGolbinRaiderStep = removeGolbinRaiderStep;

        function generateConditional(idxs, condition) {
            let conditional = `<conditional style="display: flex; align-items: center;">`;
            if(golbinRaidConditionals[condition.conditional].selectable && !golbinRaidConditionals[condition.conditional].visible) {
                conditional += `<div class="btn btn-dark">${golbinRaidConditionals[condition.conditional].name}</div>`
            } else {
                    conditional += `
                    ${generateDropdown(golbinRaidConditionals,
                                                    condition,
                                                    ({conditional}) => golbinRaidConditionals[conditional].name,
                                                    ({id, name, selectable, visible}) => (selectable && visible ? `<a class='dropdown-item pointer-enabled' onclick='updateGolbinRaiderConditional(${JSON.stringify(idxs)}, ${typeof id == 'number' || typeof id == 'boolean' ? id : `"${id}"`})'>${name}</a>` : ''))}
                `;
                }

            if(golbinRaidConditionals[condition.conditional].params && golbinRaidConditionals[condition.conditional].params.length > 0) {
                conditional += `
                <parameters>
                    ${golbinRaidConditionals[condition.conditional].params.map((param, i) => generateParam(idxs, i, condition)).join('')}
                </parameters>`;
            }

            if(condition.comparison) {
                conditional += generateComparison(idxs, condition);
            }

            if(condition.conditions) {
                conditional += `
                <conditions>
                    ${condition.conditions.map((con, i) => generateStep(idxs.concat([i]), con)).join('')}
                <add-condition
                    style="display: inline-flex; justify-content: flex-start; position: relative; min-height: 60px; margin: 3px; align-items: center; border: 2px solid black; border-radius: 10px; padding: 5px;">
                    <img class="pointer-enabled skill-icon-xs mr-1" onclick="addGolbinRaiderStep(${JSON.stringify(idxs)})" src="${CDNDIR}assets/media/main/plus.svg">
                </add-condition>
                </conditions>`;
            }

            if(condition.result) {
                conditional += generateResult(idxs, condition);
            }

            conditional += `</conditional>`;
            return conditional;
        }

        function generateValueCollection(idxs, condition, collectionIdx) {
            let values = [...golbinRaidComparisons[condition.comparison].values(condition)];
            if(golbinRaidConditionals[condition.conditional].values) {
                golbinRaidConditionals[condition.conditional].values(condition).forEach(val => {
                    let idx = values.findIndex(v => v.id == val.id);
                    if(idx > -1)
                        values[idx] = val;
                });
            }

            return `<value-collection style="position: relative; margin: 3px; padding-right: 25px;">
                                 <remove-value style="position: absolute; right: 0; height: 100%; width: 25px; display: flex; justify-content: center; align-items: center; align-self: center;">
                                 <button type="button" class="btn-block-option" onclick="removeGolbinRaiderValueCollection(${JSON.stringify(idxs)}, ${collectionIdx})" aria-label="Close">
                                 <i class="fa fa-fw fa-times"></i>
                                 </button>
                                 </remove-value>
                            ${values.map((v, j) => generateValue(idxs, v.id, condition, collectionIdx)).join('')}
                            </value-collection>`;
        }

        function generateValues(idxs, condition) {
            let valueStr = ``;
            let values = [...golbinRaidComparisons[condition.comparison].values(condition)];
            if(golbinRaidConditionals[condition.conditional].values) {
                golbinRaidConditionals[condition.conditional].values(condition).forEach(val => {
                    let idx = values.findIndex(v => v.id == val.id);
                    if(idx > -1)
                        values[idx] = val;
                });
            }
            if(values.length > 0) {
                valueStr += `<values style="display: grid; grid-template-columns: 1fr; margin: 3px; padding: 5px; grid-auto-flow: row; grid-gap: 4px; ${golbinRaidComparisons[condition.comparison].collection ? `border: 2px solid black; border-radius: 10px;` : ``}">`;
                if(golbinRaidComparisons[condition.comparison].collection) {
                    valueStr += condition.collection.map((val, i) => {
                        return generateValueCollection(idxs, condition, i);
                    }).join('')
                    valueStr += `<add-value
                            style="display: inline-flex; justify-content: flex-start; position: relative; margin: 3px; align-items: center;">
                                <img class="pointer-enabled skill-icon-xs mr-1" src="${CDNDIR}assets/media/main/plus.svg" onclick="addGolbinRaiderValueCollection(${JSON.stringify(idxs)})">
                            </add-value>`;
                } else {
                    valueStr += values.map((val, i) => generateValue(idxs, val.id, condition)).join('')
                }
                valueStr += `</values>`;
            }
            return valueStr;
        }

        function generateComparison(idxs, condition) {
            let comparison = `
                <comparison style="display: flex; align-items: center;">
                    ${generateDropdown(golbinRaidConditionals[condition.conditional].comparisons(condition),
                                                    condition,
                                                    ({comparison}) => golbinRaidComparisons[comparison].name,
                                                    ({id, name}) => `<a class='dropdown-item pointer-enabled' onclick='updateGolbinRaiderComparison(${JSON.stringify(idxs)}, ${typeof id == 'number' || typeof id == 'boolean' ? id : `"${id}"`})'>${name}</a>`)}`;

            comparison += generateValues(idxs, condition);
            comparison += `</comparison>`;
            return comparison;
        }

        function generateResult(idxs, condition) {
            return `
                <result style="display: flex; align-items: center; margin-left: auto; margin-right: 15px; padding-left: 10px;">
                    <span style="width: 40px; font-size: 36px; color: white;">-></span>
                    ${generateDropdown(golbinRaidResults,
                                                    condition,
                                                    ({result}) => golbinRaidResults[result].name,
                                                    ({id, name}) => `<a class='dropdown-item pointer-enabled' onclick='updateGolbinRaiderResult(${JSON.stringify(idxs)}, ${typeof id == 'number' || typeof id == 'boolean' ? id : `"${id}"`})'>${name}</a>`)}
                </result>`;
        }

        function generateParam(idxs, i, condition) {
            let param = golbinRaidConditionals[condition.conditional].params[i];
            if(param.visible === undefined || param.visible(condition)) {
                if(param.type == "dropdown") {
                    return `
                <parameter>
                    ${generateDropdown(param.values(condition),
                                       condition,
                                       (args, collection) => {
                        let {[param.id]:result} = args;
                        return param.content ? param.content(args, collection) : (collection.find(c => c.id == result) || collection.find(c => c.id == param.default)).name;
                    },
                                       (args) => {
                        let { id, name } = args;
                        return `<a class='dropdown-item pointer-enabled' onclick='updateGolbinRaiderParameter(${JSON.stringify(idxs)}, ${i}, ${typeof id == 'number' || typeof id == 'boolean' ? id : `"${id}"`})'>${param.render ? param.render(args) : name}</a>`
                    }
                                      )}
                </parameter>`;
                } else {
                    console.log("unknown param" + param.type);
                    return '';
                }
            } else {
                return ''
            }
        }

        function generateValue(idxs, id, condition, collectionIdx=-1) {
            let values = [...golbinRaidComparisons[condition.comparison].values(condition)];
            if(golbinRaidConditionals[condition.conditional].values) {
                golbinRaidConditionals[condition.conditional].values(condition).forEach(val => {
                    let idx = values.findIndex(v => v.id == val.id);
                    if(idx > -1)
                        values[idx] = val;
                });
            }

            let value = values.find(val => val.id == id);
            let ret = ``;
            if(value.type == "dropdown") {
                ret += `
                    <value style="display: inline-block;">
                        ${generateDropdown(value.values(condition),
                                           collectionIdx > -1 ? condition.collection[collectionIdx] : condition,
                                       (args, collection) => {
                                           let {[value.id]:result} = args;
                                           return value.content ? value.content(args, collection) : collection[result].name;
                                       },
                                       (args) => {
                                           let { id, name } = args;
                                           return `<a class='dropdown-item pointer-enabled' onclick='updateGolbinRaiderValue(${JSON.stringify(idxs)}, "${value.id}", ${typeof id == 'number' || typeof id == 'boolean' ? id : `"${id}"`}${collectionIdx > -1 ? `, ${collectionIdx}` : ''})'>${value.render ? value.render(args) : name}</a>`
                                       }
                                      )}
                </value>`;
            } else if(value.type == "number") {
                let result = condition[value.id];
                ret += `
                <value style="display: inline-block; width: 100px;">
                    <input type="number" min="0" class="form-control m-1" placeholder="" value="${result}" oninput='updateGolbinRaiderValue(${JSON.stringify(idxs)}, "${value.id}", this.value${collectionIdx > -1 ? `, ${collectionIdx}` : ''})'>
                </value>`;
            } else {
                console.log(`unknown value ${value.type}`);
                return '';
            }
            return ret;
        }

        function generateStep(idxs, step) {
            return `
                <step style="display: flex; justify-content: flex-start; position: relative; min-height: 60px; margin: 3px; align-items: center; border: 2px solid black; border-radius: 10px; padding: 15px;">
                    <remove-step style="align-self: flex-end; position: absolute; top: 0; right: 0; height: 25px; width: 25px; display: flex; justify-content: center; align-items: center;">
                    <button type="button" class="btn-block-option" onclick="removeGolbinRaiderStep(${JSON.stringify(idxs)})" aria-label="Close">
                    <i class="fa fa-fw fa-times"></i>
                    </button>
                    </remove-step>
                    ${idxs.length == 1 ? `<step-number style="display: inline-block; font-size: 36px; line-height: 60px; height: 60px; color: white; min-width: 35px;">${idxs[idxs.length-1] + 1}</step-number>` : ``}
                    ${generateConditional(idxs, step)}
                </step>
            `;
        }

        function generateSteps(steps) {
            return `
            <steps style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: 0; overflow-y: auto;'>
                <sortable-steps>
                    ${steps.map((step, i) => i != steps.length-1 ? generateStep([i], step) : '').join('')}
                </sortable-steps>
                <add-step
                    style="display: inline-flex; justify-content: flex-start; position: relative; min-height: 60px; margin: 3px; align-items: center; border: 2px solid black; border-radius: 10px; padding: 5px;">
                    <img class="pointer-enabled skill-icon-xs mr-1" onclick="addGolbinRaiderStep()" src="${CDNDIR}assets/media/main/plus.svg">
                </add-step>
                ${generateStep([steps.length-1], steps[steps.length-1])}
            </steps>
            `;
        }

        function generateSideBar() {
            return `
                <sidebar style='position: fixed; right: -600px; top: 4rem; height: 90%; width: 600px; z-index: 999; transition: right 500ms ease, width 500ms ease; background-color: grey; border-radius: 10px;'>
                    <button
                        style='position: absolute; left: -40px; top: 50%; height: 50px; width: 40px; z-index: 999; background-color: #a9a9a9;'
                        onclick='toggleGolbinRaiderSidebar();'>GR</button>
                    <container style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: 10px; background-color: #404040; display: grid; grid-template-rows: 30px 30px auto; grid-template-columns: auto; border-radius: 10px;'>
                        <stats style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; grid-area: 1 / 1 / 1 / 1; display: grid; grid-template-rows: auto; grid-template-columns: auto;'></stats>
                        <navigation style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; grid-area: 2 / 1 / 2 / 1;'>
                            <button class='history' onclick='showGolbinRaiderTab(0);'>History</button>
                            <button class='priorities' onclick='showGolbinRaiderTab(1);'>Priorities</button>
                            <button class='steps' onclick='showGolbinRaiderTab(2);'>Steps</button>
                            <button class='modifiers' onclick='showGolbinRaiderTab(3);'>Modifiers</button>
                            <button class='runes' onclick='showGolbinRaiderTab(4);'>Runes</button>
                            <button class='weights' onclick='showGolbinRaiderTab(5);'>Weights</button>
                            <button class='settings' onclick='showGolbinRaiderTab(6);'>Settings</button>
                        </navigation>
                        <tabs style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; grid-area: 3 / 1 / 3 / 1;'>
                            <tab class='history' style='position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
                                <log style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: 0; overflow-y: auto;'></log>
                            </tab>
                             <tab class='priorities d-none' style='position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: grid; grid-template-rows: 120px auto; grid-template-columns: auto; justify-items: center; align-items: center;'>
                                ${generatePrioritiesTab()}
                            </tab>
                            <tab class='steps d-none' style='position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
                                ${generateSteps(golbinRaiderSelectionSteps)}
                            </tab>
                            <tab class='modifiers d-none' style='position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
                                ${generateModifiersTab()}
                            </tab>
                            <tab class='runes d-none' style='position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
                                <span style='color: white;'>Coming Soon :)</span>
                            </tab>
                            <tab class='weights d-none' style='position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
                                <span style='color: white;'>Coming Soon :)</span>
                            </tab>
                            <tab class='settings d-none'>
                                <span style='color: white;'>Coming Soon :)</span>
                            </tab>
                        </tabs>
                    </container>
                </sidebar>`;
        }

        function generateItemSearchModal() {
            return `
<div class="modal" id="modal-golbinraider-item-select" tabindex="-1" role="dialog" aria-labelledby="modal-block-extra-large" aria-modal="true" style="display: none;">
   <div class="modal-dialog modal-xl" role="document" style="height:80%;">
      <div class="modal-content">
         <div class="block block-themed block-transparent mb-0">
            <div class="block-header bg-primary-dark">
               <h3 class="block-title">
                  Hey
               </h3>
               <div class="block-options">
                  <button type="button" class="btn-block-option" data-dismiss="modal" aria-label="Close">
                  <i class="fa fa-fw fa-times"></i>
                  </button>
               </div>
            </div>
            <div class="block-content block-content-full">
               <div class="col-12">
                  <div class="row" id="golbinraider-items-search">
                     <div class="col-12">
                        <input type="text" class="form-control form-control-lg py-4" id="golbinraider-item-search" name="golbinraider-item-search" placeholder="Search Items">
                     </div>
                     <div id="golbinraider-items-list" class="col-12">
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
`
        }

        function updateGolbinRaiderItemSearch(search) {
            let slot = $("#modal-golbinraider-item-select").get(0).dataset.slot;
            let index = $("#modal-golbinraider-item-select").get(0).dataset.index;
            const options = {
                shouldSort: true,
                tokenize: true,
                matchAllTokens: true,
                findAllMatches: true,
                threshold: 0,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: ["name"],
            };
            let slotItems = items.filter(item => item.validSlots && item.validSlots.includes(slot) && !RaidManager.bannedItems.includes(item.id) && (!golbinRaiderPriorities[slot].includes(item.id) || item.id == golbinRaiderPriorities[slot][index]));
            if(slot == CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Passive])
                slotItems = slotItems.filter(item => !RaidManager.bannedPassiveItems.includes(item.id))
            const fuse = new Fuse(slotItems, options);
            let result = fuse.search(search);
            if(search == '')
                result = slotItems;


            $('item-icon', $('#golbinraider-items-list').get(0)).toArray().forEach(el => {
                if(el._tippy)
                    el._tippy.destroy();
            });
            $('#golbinraider-items-list').get(0).innerHTML = '';
            $('#golbinraider-items-list').append(generateItemImage(-1, 0, false, true, slot));
            $('#golbinraider-items-list').append(result.map(item => generateItemImage(item.id, 0, item.id == golbinRaiderPriorities[slot][index], false, slot)).join(''));

            $('item-icon', $('#golbinraider-items-list').get(0)).toArray().forEach(el => {
               el.setAttribute('onclick', `selectGolbinRaiderItemPriority('${slot}', ${index}, ${el.dataset.id})`);
            });

            tippy($('item-icon', $('#golbinraider-items-list').get(0)).toArray(), {
                content: '',
                allowHTML: true,
                placement: "left",
                interactive: false,
                animation: false,
                onShow: itemOnShow,
                onHidden: itemOnHidden
            });
        }

        function selectGolbinRaiderItemPriority(slot, index, id=-1) {
            golbinRaiderPriorities[slot][index] = id;
            golbinRaiderPriorities[slot] = golbinRaiderPriorities[slot].filter(id => id > -1);
            localStorage.setItem(`golbinRaiderPriorities`, JSON.stringify(golbinRaiderPriorities));
            showGolbinRaiderPriority(slot);
            $("#modal-golbinraider-item-select").modal("hide");
        }

        let sortableSteps = false;

        function updateSortableSteps() {
            if(sortableSteps) {
                sortableSteps.destroy();
                sortableSteps = false;
            }
            sortableSteps = Sortable.create($('sidebar container tabs tab steps sortable-steps').get(0), {
                group: `golbinRaiderSteps`,
                draggable: "step",
                handle: 'step-number',
                onEnd: (evt) => {
                    let start = Math.min(evt.newIndex, evt.oldIndex);
                    let end = Math.max(evt.newIndex, evt.oldIndex);
                    golbinRaiderSelectionSteps.splice(evt.newIndex, 0, golbinRaiderSelectionSteps.splice(evt.oldIndex, 1).pop());

                    for(let i=start; i<=end; i++)
                        $('steps > sortable-steps > step').get(i).outerHTML = generateStep([i], golbinRaiderSelectionSteps[i]);
                    triggerStepsSave();
                },
                onMove: function() {
                },
                onChoose: function(evt) {
                },
            });
        }

        const sideBar = generateSideBar();
        $('#page-container').append(sideBar);

        updateSortableSteps();

        window.toggleGolbinRaiderSidebar = () => {
            let width = $('sidebar').get(0).style.getPropertyValue('width');
            let right = $('sidebar').get(0).style.getPropertyValue('right');
            $('sidebar').get(0).style.setProperty('right', right == '0px' ? `-${width}` : '0px');
        }
        window.showGolbinRaiderTab = (i) => {
            $($('sidebar tabs tab').addClass('d-none').get(i)).removeClass('d-none');
            if(i == 2) {
                 $('sidebar').get(0).style.setProperty('width', '1200px');
            } else {
                 $('sidebar').get(0).style.setProperty('width', '600px');
            }
        };
        window.showGolbinRaiderPriority = showGolbinRaiderPriority;
        window.showGolbinRaiderItemSelect = showGolbinRaiderItemSelect;
        window.selectGolbinRaiderItemPriority = selectGolbinRaiderItemPriority;
        $('#page-container').append(generateItemSearchModal());
        $("#golbinraider-item-search").keyup(function() {
            let search = $("#golbinraider-item-search").val();
            updateGolbinRaiderItemSearch(search);
        });

        let golbinLogStats = [];

        function addStat(updateFn) {
            golbinLogStats.push({el: document.createElement('stat'), updateFn: updateFn});
            golbinLogStats[golbinLogStats.length-1].el.style.setProperty('grid-area', `1 / ${golbinLogStats.length} / 1 / ${golbinLogStats.length}`);
            golbinLogStats[golbinLogStats.length-1].el.style.setProperty('color', 'white');
            golbinLogStats[golbinLogStats.length-1].el.style.setProperty('font-size', '12px');
            golbinLogStats[golbinLogStats.length-1].el.style.setProperty('text-align', 'center');
            $('stats').get(0).style.setProperty('grid-template-columns', golbinLogStats.map(s => 'auto').join(' '));
            $('stats').append(golbinLogStats[golbinLogStats.length-1].el);
        }

        addStat(() => `Wave ${raidManager.wave+1}`);
        addStat(() => `${raidManager.waveProgress + 1} / ${raidManager.waveLength}`);
        //addStat(() => `${maxFood()} Max Food`);
        //addStat(() => `${maxAmmo()} Max Ammo`);
        //addStat(() => `${maxRunes()} Max Runes`);
        //addStat(() => `${raidManager.player.equipmentStats.damageReduction}% DR`);
        addStat(() => `${new Date((new Date().getTime() - raidManager.startTimestamp)).toISOString().substr(11, 8)}`);
        addStat(() => `${raidManager.coinsEarned} GC`);
        addStat(() => `${(raidManager.coinsEarned / ((new Date().getTime() - raidManager.startTimestamp)/1000)).toFixed(2)} GC/s`);

        function statTick() {
            if($('#page-header').get(0).classList.contains('bg-golbinraid') && $('sidebar button').get(0).classList.contains('d-none')) {
                $('sidebar button').get(0).classList.remove('d-none');
            } else if(!$('#page-header').get(0).classList.contains('bg-golbinraid') && !$('sidebar button').get(0).classList.contains('d-none')) {
                $('sidebar button').get(0).classList.add('d-none');
            }

            if(!game.isGolbinRaid) return;

            golbinLogStats.forEach(stat => stat.el.innerText = stat.updateFn());
        }

        let __raidManagerStopCombat = raidManager.stopCombat.bind(raidManager);
        function _raidManagerStopCombat(fled=true) {
            raidManager.selectedDifficulty = raidManager._setDifficulty;
            __raidManagerStopCombat(...arguments);

            if(!fled) {
                setTimeout(() => { Swal.close(); raidManager.preStartRaid() }, 1000);
            }
        }
        raidManager.stopCombat = _raidManagerStopCombat.bind(raidManager);

        function restartCombat() {
            raidManager.selectedDifficulty = raidManager._setDifficulty;
            raidManager.stopCombat(true);
            setTimeout(() => { Swal.close(); raidManager.preStartRaid() }, 1000);
        }

        let __golbinTick = raidManager.tick.bind(raidManager);
        function _golbinTick() {
            __golbinTick(...arguments);

            try {
                if(raidManager.state == RaidState.FightingWave) {
                    if(golbinRaiderSettings.autoHeal) {
                        let enemyMaxHit = Math.max(...raidManager.enemy.availableAttacks.map(a => raidManager.enemy.getAttackMaxDamage(a.attack)))
                        if(raidManager.player.hitpoints <= enemyMaxHit) {
                            //console.log(`ALMOST DIED ${raidManager.player.hitpoints}hp, ${enemyMaxHit} max hit`);
                            if(raidManager.player.hitpoints < raidManager.player.stats.maxHitpoints)
                                raidManager.player.eatFood();
                        }
                    }
                }

                if(!(raidManager.state === RaidState.Unstarted || raidManager.isPaused || !game.isGolbinRaid))
                    statTick();
            } catch (e) {
                console.log(e);
            }
        }
        raidManager.tick = _golbinTick.bind(raidManager);


        let __fireRandomModifierSelection = raidManager.fireRandomModifierSelection.bind(raidManager);
        function _fireRandomModifierSelection() {
            //__fireRandomModifierSelection(...arguments);
            //modifierData
            //RaidManager.possibleModifiers
            const playerMods = new MappedModifiers();
            playerMods.addArrayModifiers(this.randomPlayerModifiers);
            const golbinMods = new MappedModifiers();
            golbinMods.addArrayModifiers(this.randomEnemyModifiers);

            let option = rollInteger(0, raidManager.randomModifiersBeingSelected.length-1);
            const modifiers = golbinRaiderModifierPriority[raidManager.isSelectingPositiveModifier ? 'positive' : 'negative'];
            const priorities = [...raidManager.randomModifiersBeingSelected].map(mod => modifiers.findIndex(m => m.key == mod.key));
            const values = [...raidManager.randomModifiersBeingSelected].map(mod => {
                let modData = modifierData[mod.key]
                let v = 0;
                if(raidManager.isSelectingPositiveModifier) {
                    v = (modData.isNegative ? golbinMods.standardModifiers.get(mod.key) : playerMods.standardModifiers.get(mod.key)) || 0
                } else {
                    v = (modData.isNegative ? playerMods.standardModifiers.get(mod.key) : golbinMods.standardModifiers.get(mod.key)) || 0
                }
                if(modData.modifyValue)
                    v = modData.modifyValue(v);
                return v;
            })

            const underSoftCap = priorities.map((idx, i) => values[i] < modifiers[idx].soft || modifiers[idx].soft == 0);
            const underHardCap = priorities.map((idx, i) => values[i] < modifiers[idx].hard || modifiers[idx].hard == 0);

            for(let i=0; i<priorities.length; i++) {
                if(underHardCap[i]) {
                    if(underHardCap[option]) {
                        if(underSoftCap[i]) {
                            if(underSoftCap[option]) {
                                if(priorities[i] < priorities[option])
                                    option = i;
                            } else {
                                option = i;
                            }
                        }
                    } else {
                        option = i;
                    }
                }
            }
            raidManager.selectRandomModifier(option);
        }
        raidManager.fireRandomModifierSelection = _fireRandomModifierSelection.bind(raidManager);

        let __fireCategorySelectModal = raidManager.fireCategorySelectModal.bind(raidManager);
        function _fireCategorySelectModal() {
            //__fireCategorySelectModal(...arguments);

            let result, step;
            try {
                ({ result, step } = evaluateSteps(golbinRaiderSelectionSteps));
            } catch (e) {
                console.log(e);
            }

            if(result == 'abort') {
                restartCombat();
                return;
            }

            if(result == 'pause') {
                raidManager.pause();
                return;
            }

            if(result == 'passive') {
                let currentRunes = availableRunes().map(id => [id, golbinItemCount(id)]);
                let currentItems = raidManager.player.equipment.slotArray.map(slot => {
                    return { id: slot.item.id, qty: slot.quantity, isAlt: raidManager.player.altAttacks[slot.type].length > 0, altAttacks: raidManager.player.altAttacks[slot.type].map(alt => alt.id) };
                });
                let currentFood = {
                    id: (items[raidManager.player.food.slots[raidManager.player.food.selectedSlot].item.id] || {id: -1}).id,
                    qty: raidManager.player.food.slots[raidManager.player.food.selectedSlot].quantity || 0
                }

                raidManager.rerollPassiveCallback();
                addChoice('passive', 0, [{ itemID: raidManager.player.equipment.slotArray[CONSTANTS.equipmentSlot.Passive].item.id, qty: 1 }], currentItems, currentRunes, currentFood);
                return;
            }

            if(result !== undefined && result != false) {
                raidManager.showEquipmentSelectionModal(result);
                return;
            }
        }
        raidManager.fireCategorySelectModal = _fireCategorySelectModal.bind(raidManager);

        let __fireItemSelectModal = raidManager.fireItemSelectModal.bind(raidManager);
        function _fireItemSelectModal() {
            //__fireItemSelectModal(...arguments);
        }
        raidManager.fireItemSelectModal = _fireItemSelectModal.bind(raidManager);

        let __setEquipmentSelection = raidManager.setEquipmentSelection.bind(raidManager);
        function _setEquipmentSelection(category) {
            __setEquipmentSelection(...arguments);
            let options = [...raidManager.itemsBeingSelected];
            let availRunes = availableRunes();
            let currentRunes = availableRunes().map(id => [id, golbinItemCount(id)]);
            let currentItems = raidManager.player.equipment.slotArray.map(slot => {
                if(slot.occupiedBy !== 'None')
                    return { id: -1, qty: 0, isAlt: false, altAttacks: [] }
                return { id: slot.item.id, qty: slot.quantity, isAlt: raidManager.player.altAttacks[slot.type].length > 0, altAttacks: raidManager.player.altAttacks[slot.type].map(alt => alt.id) };
            });
            let currentFood = {
                id: (items[raidManager.player.food.slots[raidManager.player.food.selectedSlot].item.id] || {id: -1}).id,
                qty: raidManager.player.food.slots[raidManager.player.food.selectedSlot].quantity || 0
            }

            try {
                if(category == 'runes') {
                    let option = options.findIndex(o => o.itemID == -1);

                    for(let i = 0; i<availRunes.length; i++) {
                        let rune = availRunes[i];
                        if(hasOceanSong && !haveRunes([[rune, 1]]) && options.findIndex(item => item.itemID == rune) != -1)
                            option = options.findIndex(item => item.itemID == rune)
                    }

                    options[options.findIndex(o => o.itemID == -1)].itemID = CONSTANTS.item.Rune_Essence;

                    if(options[option].itemID != CONSTANTS.item.Rune_Essence) {
                        raidManager.addRunesCallback(options[option].itemID, options[option].qty)
                    } else {
                        raidManager.addExistingRunesCallback(options[option].qty)
                    }

                    addChoice(category, option, options, currentItems, currentRunes, currentFood);
                } else if (category == 'food') {
                    options = options.map(option => {
                        option.healing = items[option.itemID].healsFor * option.qty;
                        if(option.itemID == raidManager.player.food.slots[raidManager.player.food.selectedSlot].item.id)
                            option.healing += raidManager.player.food.slots[raidManager.player.food.selectedSlot].item.healsFor * raidManager.player.food.slots[raidManager.player.food.selectedSlot].quantity;
                        return option;
                    });

                    let option = -1;

                    let currentHealing = raidManager.player.food.slots[raidManager.player.food.selectedSlot].item.healsFor * raidManager.player.food.slots[raidManager.player.food.selectedSlot].quantity;

                    options.forEach((o, i) => {
                        if(o.healing > currentHealing && (options[option] === undefined || o.healing > options[option].healing))
                            option = i;
                    });


                    if(option > -1) {
                        raidManager.addFoodCallback(options[option].itemID, options[option].qty);
                    } else {
                        raidManager.selectNothingCallback();
                    }

                    addChoice(category, option, options, currentItems, currentRunes, currentFood);
                } else {
                    options = options.map(option => {
                        option.slots = items[option.itemID].validSlots.concat(items[option.itemID].occupiesSlots).filter(slot => slot != CONSTANTS.equipmentSlot[CONSTANTS.equipmentSlot.Passive]);
                        option.weight = itemWeight(option.itemID, option.isAlt, items[option.itemID].validSlots[0]);
                        option.diff = option.weight - option.slots.map(slot => itemWeight(raidManager.player.equipment.slotArray[CONSTANTS.equipmentSlot[slot]].item.id, raidManager.player.altAttacks[slot].length > 0, slot)).reduce((a,b) => a + b, 0);
                        option.existingPriority = golbinRaiderPriorities[items[option.itemID].validSlots[0]].includes(raidManager.player.equipment.slotArray[CONSTANTS.equipmentSlot[items[option.itemID].validSlots[0]]].item.id) ? golbinRaiderPriorities[items[option.itemID].validSlots[0]].indexOf(raidManager.player.equipment.slotArray[CONSTANTS.equipmentSlot[items[option.itemID].validSlots[0]]].item.id) : -1
                        option.priority = golbinRaiderPriorities[items[option.itemID].validSlots[0]].includes(option.itemID) ? golbinRaiderPriorities[items[option.itemID].validSlots[0]].indexOf(option.itemID) : -1;
                        return option;
                    });
                    let option = -1;

                    options.forEach((o, i) => {
                        let priority = o.priority;
                        let currentPriority = option > -1 ? options[option].priority : -1;
                        let existingPriority = o.existingPriority;
                        let diff = o.diff;
                        let currentDiff = option > -1 ? options[option].diff : 0;

                        if(priority != -1 && (existingPriority == -1 || priority < existingPriority) && (currentPriority == -1 || priority < currentPriority))
                            option = i;
                        if(priority == existingPriority && priority == currentPriority && diff > currentDiff)
                            option = i;
                    });

                    if(option > -1) {
                        raidManager.equipItemCallback(options[option].itemID, options[option].qty, options[option].isAlt);

                        if(options[option].isAlt)
                            options[option].altAttacks = raidManager.player.altAttacks[items[options[option].itemID].validSlots[0]].map(alt => alt.id);
                    } else {
                        raidManager.selectNothingCallback();
                    }

                    addChoice(category, option, options, currentItems, currentRunes, currentFood);
                }
            } catch (e) {
                console.log(e);
            }

            options = null;
            currentRunes = null;
        }
        raidManager.setEquipmentSelection = _setEquipmentSelection.bind(raidManager);

        console.log('Melvor Golbin Raider Loaded');
    }

    if(window.loadCombat) {
        let __loadCombat = window.loadCombat;
        window.loadCombat = function() {
            __loadCombat();
			injectScript(script);
        }
    } else if (typeof unsafeWindow !== 'undefined' && unsafeWindow.loadCombat) {
        let __loadCombat = unsafeWindow.loadCombat;
        unsafeWindow.loadCombat = function() {
            __loadCombat();
			injectScript(script);
        }
    }
})();