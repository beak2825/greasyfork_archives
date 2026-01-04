// ==UserScript==
// @name         DH2 Fixed Version 3
// @namespace    FileFace
// @description  Improve Diamond Hunt 2's DH2 Fixed even further
// @version      1.0.15
// @author       Zorbing
// @license      ISC; http://opensource.org/licenses/ISC
// @grant        none
// @run-at       document-start
// @match        *.diamondhunt.co/*


// To-do list:
// add xp and stats into table loot mobs
// option to disable calc color
// hide button/drop down

// @downloadURL https://update.greasyfork.org/scripts/369532/DH2%20Fixed%20Version%203.user.js
// @updateURL https://update.greasyfork.org/scripts/369532/DH2%20Fixed%20Version%203.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jslint es5: true */
// This is a continue developing script from Zorbing's since he has been inactive for a long time, with help from other players
/**
 * ISC License (ISC)
 *
 * Copyright (c) 2017, Martin Boekhoff
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
 * AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 *
 * Source: http://opensource.org/licenses/ISC
 */

// main script
(function ()
 {
    'use strict';
    var version = '1.0.15';
    var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;


    /**
 * observer
 */
    var observer;
    (function (observer)
     {
        observer.GAME_TICK_KEY = 'dh2.gameTick';
        var observedKeys = new Map();

        function add(key, fn)
        {
            if (key instanceof Array)
            {
                for (var _i = 0, key_1 = key; _i < key_1.length; _i++)
                {
                    var k = key_1[_i];
                    add(k, fn);
                }
            }
            else
            {
                if (!observedKeys.has(key))
                {
                    observedKeys.set(key, new Set());
                }
                observedKeys.get(key).add(fn);
            }
            return fn;
        }

        observer.add = add;

        function notify(key, oldValue)
        {
            var newValue = getGameValue(key);
            if (observedKeys.has(key))
            {
                observedKeys.get(key).forEach(function (fn)
                                              {
                    return fn(key, oldValue, newValue);
                });
            }
        }
        observer.notify = notify;

        function notifyTick()
        {
            notify(observer.GAME_TICK_KEY, Math.floor(now() / 1000));
        }
        observer.notifyTick = notifyTick;

        function remove(key, fn)
        {
            if (key instanceof Array)
            {
                var ret = [];
                for (var _i = 0, key_2 = key; _i < key_2.length; _i++)
                {
                    var k = key_2[_i];
                    ret.push(remove(k, fn));
                }
                return ret;
            }
            if (!observedKeys.has(key))
            {
                return false;
            }
            return observedKeys.get(key).delete(fn);
        }
        observer.remove = remove;

        function addTick(fn)
        {
            return add(observer.GAME_TICK_KEY, fn);
        }
        observer.addTick = addTick;

        function removeTick(fn)
        {
            return remove(observer.GAME_TICK_KEY, fn);
        }
        observer.removeTick = removeTick;
    })(observer || (observer = {}));
    /**
 * global constants
 */
    //remove
    var postEventMessage = [];
    console.log("1 minute delay");
    setTimeout(function(){
        postEventMessage["#event"]=true;
        //postEventMessage["#eventType"]=true;
        postEventMessage["agrodon"]=true;
        console.log("ready");
    },60*1000);
    var PLUS_MINUS_SIGN = String.fromCharCode(177);
    var TIER_LEVELS = ['empty', 'sapphire', 'emerald', 'ruby', 'diamond'];
    var TIER_NAMES = ['Standard', 'Sapphire', 'Emerald', 'Ruby', 'Diamond'];
    var TIER_ITEMS = ['pickaxe', 'shovel', 'hammer', 'axe', 'rake', 'trowel', 'fishingRod', 'chisel'];
    var ORB_ITEMS = ['pickaxe', 'shovel', 'hammer', 'axe', 'rake', 'trowel', 'fishingRod', 'chisel', 'oilPipe'];
    var TIER_ITEMS_NOT_BINDABLE = ['rake', 'trowel'];
    var FURNACE_LEVELS = ['stone', 'bronze', 'iron', 'silver', 'gold', 'promethium', 'runite'];
    var OVEN_LEVELS = ['bronze', 'iron', 'silver', 'gold', 'promethium', 'runite'];
    var WAND_LEVELS = ['wooden', 'oak', 'willow', 'maple', 'stardust', 'strange', 'ancient'];
    var OIL_STORAGE_SIZES = [10e3, 50e3, 100e3, 300e3, 600e3, 2e6];
    var RECIPE_MAX = {
        'brewing':
        {
            'braveryPotion':
            {
                max: 1
            }
            , 'stardustCrystalPotion':
            {
                max: 1
            }
        }
        , 'cooksBook':
        {}
        , 'crafting':
        {
            'drills':
            {
                max: 10
            }
            , 'crushers':
            {
                max: 10
            }
            , 'giantDrills':
            {
                max: 10
            }
            , 'excavators':
            {
                max: 10
            }
            , 'oilPipe':
            {
                max: 1
            }
            , 'pumpjacks':
            {
                max: 10
            }
            , 'rowBoat':
            {
                max: 1
            }
            , 'canoe':
            {
                max: 1
            }
            , 'sailBoat':
            {
                max: 1
            }
            , 'steamBoat':
            {
                max: 1
            }
            // thanks aguyd
            , 'bonemealBin':
            {
                extraKeys: ['boundFilledBonemealBin']
                , max: 1
            }
            , 'oilFactory':
            {
                max: 1
            }
            , 'brewingKit':
            {
                max: 1
            }
            , 'rocket':
            {
                max: 1
            }
        }
        , 'magic':
        {}
    };
    var SMELTING_REQUIREMENTS = {
        'glass':
        {
            sand: 1
            , oil: 10
        }
        , 'bronzeBar':
        {
            copper: 1
            , tin: 1
            , oil: 10
        }
        , 'ironBar':
        {
            iron: 1
            , oil: 100
        }
        , 'silverBar':
        {
            silver: 1
            , oil: 300
        }
        , 'goldBar':
        {
            gold: 1
            , oil: 1e3
        }
        , 'promethiumBar':
        {
            promethium: 1
            , charcoal: 5
        }
        , 'runiteBar':
        {
            runite: 1
            , charcoal: 50
            , lava: 1
        }
    };
    var PLANT_NAME = {
        '1': 'Dark Mushrooms'
        , '2': 'Red Mushrooms'
        , '3': 'Dotted Green Leaves'
        , '4': 'Green Leaves'
        , '5': 'Lime Leaves'
        , '6': 'Gold Leaves'
        , '7': 'Striped Gold Leaves'
        , '8': 'Crystal Leaves'
        , '9': 'Striped Crystal Leaves'
        , '10': 'Blewit Mushrooms'
        , '11': 'Snapegrass'
        , '12': 'Tree'
        , '13': 'Oak Tree'
        , '14': 'Wheat'
        , '15': 'Willow Tree'
        , '16': 'Grass'
        , '17': 'Maple Tree'
        , '18': 'Stardust Tree'
        , '19': 'Carrots'
        , '20': 'Tomatoes'
        , '21': 'Potatoes'
        , '22': 'Strange Leaf Tree'
        , '23': 'Light Mushrooms'
        , '24': 'Pumpkins'
        , '25': 'Ancient Tree'
        , '26': 'Stardust Plant'
        , '27': 'White Leaf'
        , '28': 'Dark Leaf'
        , '29': 'Dark Mushrooms'
        , '30': 'Redwood Tree'
        , '31': 'Fire Wheat'
        , '32': 'Frozen Wheat'
    };
    var TREE_NAME = {
        '0': 'Empty'
        ,'1': 'Tree'
        , '2': 'Oak Tree'
        , '3': 'Willow Tree'
        , '4': 'Maple Tree'
        , '5': 'Stardust Tree'
        , '6': 'Strange Leaf Tree'
        , '7': 'Shiny Tree'
        , '8': 'Shiny Oak Tree'
        , '9': 'Shiny Willow Tree'
        , '10': 'Shiny Maple Tree'
        , '11': 'Shiny Stardust Tree'
        , '12': 'Shiny Strange Leaf Tree'
        , '13': 'Ancient Tree'
        , '14': 'Shiny Ancient Tree'
    };
    var SKILL_LIST = ['mining', 'crafting', 'woodcutting', 'farming', 'brewing', 'combat', 'fishing', 'cooking', 'magic'];
    var AREA_LIST = ['fields', 'forests', 'caves', 'volcano', 'northFields', 'hauntedMansion'];
    var AREA_NAMES = ['Fields', 'Forests', 'Caves', 'Volcano', 'Northern Fields', 'Haunted Mansion',
                      'Moon', 'Dark Forest','Near Faradox\'s Castle'];
    var FARMING_CRATE_CAPACITY = [101,10,20,30,50,70,100];

    function getAreaName(areaId)
    {
        if (areaId === 33)
        {
            return 'Quest';
        }
        else if (areaId === 34)
        {
            return "Faradox's Tombs";
        }
        else if (areaId === 35)
        {
            return "Goblin Hideout";
        }
        else if (areaId === 36)
        {
            return "Dark Faradox's Tombs";
        }
        else if (areaId === 38)
        {
            return "Volcano";
        }
        else if (areaId === 39)
        {
            return "Cold Lake";
        }
        else if (areaId === 40)
        {
            return "The Graveyard";
        }
        else
        {
            return AREA_NAMES[areaId];
        }
    }
    var MONSTER_NAMES = [
        'Chicken', 'Rat', 'Bee', 'Snake', 'Forest Tree', 'Thief', 'Bear', 'Bat', 'Skeleton', 'Golem',
        'Fire Bird', 'Volcano Mage', 'Lizard', 'Northern Tree', 'Ice Bird', 'Phantom', 'Ghost', 'Grim Reaper', 'Troll', 'Five Eyed',
        'Robot', 'Dark Mage', 'Pirate Skeleton', 'Dark Witch','Faradox\'s Dragon','Castle Golem', 'Castle Droids'
    ];
    var MONSTER_NAMES_2 = [
        'Evil Snake','Easter Bunny','Ghostly Old Mage',
        'Tomb Monster 1','Tomb Monster 2','Tomb Monster 3','Tomb Monster 4','Tomb Monster 5',
        'Gem Goblin','Skeleton Trainer','Faradox\'s Guardian',
        'Tomb Monster 1','Tomb Monster 2','Tomb Monster 3','Tomb Monster 4','Tomb Monster 5',
        'Wizard','Fire Wheat','Frozen Wheat','Robot Waves',
        'Halloween Witch', 'Halloween Skeleton', 'Halloween Spider'
    ];

    function getMonsterName(monsterId)
    {
        if(monsterId >= 99)
        {
            return MONSTER_NAMES_2[monsterId-99]
        }
        else
        {
            return MONSTER_NAMES[monsterId];
        }
    }
    var FISH_XP = {
        'rawShrimp': 50
        , 'rawSardine': 500
        , 'rawSalmon': 700
        , 'rawTuna': 3e3
        , 'rawLobster': 5e3
        , 'rawSwordfish': 5e3
        , 'rawEel': 6e3
        , 'rawShark': 12e3
        , 'rawWhale': 20e3
        , 'rawRainbowFish': 30e3
    };
    var ANIMALS = [
        {
            name: "sheep",
            technicalName : "sheep",
            sound : "Baaaa",
            windowConstant: function(){return win.sheep}
        },
        {
            name : "cows",
            technicalName : "cow",
            sound : "Moooo",
            animalYield : "milk",
            windowConstant: function(){return win.cow}
        },
        {
            name : "chickens",
            technicalName : "farmChicken",
            sound : "Cluck",
            animalYield: "eggs",
            windowConstant: function(){return win.farmChicken}
        },
        {
            name : "pigs",
            technicalName : "pig",
            sound : "Oink",
            windowConstant: function(){return win.pig}
        },
        {
            name : "fire chickens",
            technicalName : "fireChicken",
            sound : "Burning Cluck",
            animalYield : "fire eggs",
            windowConstant: function(){return win.fireChicken}
        },
        {
            name : "ice chickens",
            technicalName : "iceChicken",
            sound : "Freezing Cluck",
            animalYield : "ice eggs",
            windowConstant: function(){return win.iceChicken}
        },
        {
            name : "lava cows",
            technicalName : "lavaCow",
            sound : "Burning Moo",
            animalYield : "lava",
            windowConstant: function(){return win.lavaCow}
        },
        {
            name : "promethium souls",
            technicalName : "promethiumSoul",
            sound : "WHAT AM I!?",
            windowConstant: function(){return win.promethiumSoul}
        },
        {
            name : "runite souls",
            technicalName : "runiteSoul",
            sound : "KILL ME",
            windowConstant: function(){return win.runiteSoul}
        }
    ]
    var EVENTS = ['None', 'Stardust meteor', 'Promethium/Runite meteor', 'Fishing Lake', 'Magic tree', 'Skeleton Slaughter', 'Seed piles'];
    var EVENT_COMING_DESCRIPTIONS = ["No active event", "A stardust meteor is approaching!", "A promethium and runite meteor is approaching!",
                              "The fishing lake is going to be open soon!", "The magic tree will be available soon!",
                              "Prepare yourself for a Skeleton Slaughter!", "A pile of seeds has appeared!"];
    var EVENT_DESCRIPTIONS = ["No active event", "The stardust meteor has landed!", "The promethium and runite meteor has landed!",
                              "The fishing lake is open now!", "The magic tree is available now!",
                              "The skeletons have arrived!", "The pile of seeds is availble for harvest!"];
    var BOAT_LIST = ['rowBoat', 'canoe', 'sailBoat', 'steamBoat'];
    var TRIP_DURATION = {
        'rowBoat': 3
        , 'canoe': 5
        , 'sailBoat': 7
        , 'steamBoat': 10
    };
    var MAX_ROCKET_MOON_KM = 384400;
    var MAX_ROCKET_MARS_KM = 54600000;
    var MAX_ROCKET_INTERSTELLAR_KM = 15000000000;
    var format;
    (function (format)
     {
        var UNITS = [
            {
                threshold: 10e3
                , factor: 1e3
                , token: 'k'
            }
            , {
                threshold: 1e6
                , factor: 1e6
                , token: 'M'
            }
            , {
                threshold: 1e9
                , factor: 1e9
                , token: 'B'
            }
            , {
                threshold: 1e12
                , factor: 1e12
                , token: 'T'
            }
            , {
                threshold: 1e15
                , factor: 1e15
                , token: 'Q'
            }];
        var TIME_STEPS = [
            {
                threshold: 1
                , name: 'second'
                , short: 'sec'
                , padp: 0
            }
            , {
                threshold: 60
                , name: 'minute'
                , short: 'min'
                , padp: 0
            }
            , {
                threshold: 3600
                , name: 'hour'
                , short: 'h'
                , padp: 1
            }
            , {
                threshold: 86400
                , name: 'day'
                , short: 'd'
                , padp: 2
            }];

        function ensureNumber(num)
        {
            return (typeof num === 'number' ? num : Number(num));
        }

        function number(num, shorten)
        {
            if (shorten === void 0)
            {
                shorten = false;
            }
            num = ensureNumber(num);
            if (shorten)
            {
                for (var i = UNITS.length - 1; i >= 0; i--)
                {
                    var unit = UNITS[i];
                    if (num >= unit.threshold)
                    {
                        return number(Math.round(num / unit.factor)) + unit.token;
                    }
                }
            }
            return num.toLocaleString('en');
        }
        format.number = number;

        function numbersInText(text)
        {
            return text.replace(/\d(?:[\d',\.]*\d)?/g, function (numStr)
                                {
                return number(numStr.replace(/\D/g, ''));
            });
        }
        format.numbersInText = numbersInText;
        // use time format established in DHQoL (https://greasyfork.org/scripts/16041-dhqol)
        function timer(timer, shorten)
        {
            if (shorten === void 0)
            {
                shorten = true;
            }
            if (typeof timer === 'string')
            {
                timer = parseInt(timer, 10);
            }
            timer = Math.max(timer, 0);
            var days = Math.floor(timer / 86400); // 24 * 60 * 60
            var hours = Math.floor((timer % 86400) / 3600); // 60 * 60
            var minutes = Math.floor((timer % 3600) / 60);
            var seconds = timer % 60;
            return (shorten && days === 0 ? '' : days + 'd ')
                + (shorten && days === 0 && hours === 0 ? '' : zeroPadLeft(hours) + ':')
                + zeroPadLeft(minutes) + ':'
                + zeroPadLeft(seconds);
        }
        format.timer = timer;

        function time2NearestUnit(time, long)
        {
            if (long === void 0)
            {
                long = false;
            }
            var step = TIME_STEPS[0];
            for (var i = TIME_STEPS.length - 1; i > 0; i--)
            {
                if (time >= TIME_STEPS[i].threshold)
                {
                    step = TIME_STEPS[i];
                    break;
                }
            }
            var factor = Math.pow(10, step.padp);
            var num = Math.round(time / step.threshold * factor) / factor;
            var unit = long ? step.name + (num === 1 ? '' : 's') : step.short;
            return num + ' ' + unit;
        }
        format.time2NearestUnit = time2NearestUnit;

        function sec2Str(seconds)
        {
            seconds = Number(seconds);
            if (seconds < 0)
            {
                return seconds.toString();
            }
            var s = seconds % 60;
            var m = Math.floor(seconds / 60) % 60;
            var h = Math.floor(seconds / 3600);
            var strs = [];
            if (h > 0)
            {
                strs.push(h + ' hour' + (h == 1 ? '' : 's'));
            }
            if (m > 0)
            {
                strs.push(m + ' minute' + (m == 1 ? '' : 's'));
            }
            if (s > 0)
            {
                strs.push(s + ' second' + (s == 1 ? '' : 's'));
            }
            if (strs.length > 1)
            {
                var glue = ' and ';
                for (var i = strs.length - 2; i >= 0; i--)
                {
                    strs[i] = strs[i] + glue + strs[i + 1];
                    glue = ', ';
                }
                return strs[0];
            }
            else
            {
                return strs[0] || '';
            }
        }
        format.sec2Str = sec2Str;

        function min2Str(minutes)
        {
            return sec2Str(Number(minutes) * 60);
        }
        format.min2Str = min2Str;
    })(format || (format = {}));

    /**
 * general functions
 */
    function getStyle(elId)
    {
        var id = elId != null ? 'style-' + elId : null;
        var styleElement = id != null ? document.getElementById(id) : null;
        if (styleElement == null)
        {
            styleElement = document.createElement('style');
            if (id != null)
            {
                styleElement.id = id;
            }
            styleElement.type = 'text/css';
            if(document.head){
                document.head.appendChild(styleElement);
            }else{
                setTimeout(function(){
                    document.head.appendChild(styleElement);
                },2000);
            }
        }
        return styleElement;
    }

    function addStyle(styleCode, elId)
    {
        var styleElement = getStyle(elId);
        styleElement.innerHTML += styleCode;
    }

    function zeroPadLeft(num)
    {
        return (num < 10 ? '0' : '') + num;
    }

    function capitalize(str)
    {
        return str[0].toUpperCase() + str.substr(1);
    }

    function key2Name(key, lowerCase)
    {
        if (lowerCase === void 0)
        {
            lowerCase = false;
        }
        var name = key.replace(/[A-Z]/g, function (c)
                               {
            return ' ' + (lowerCase ? c.toLowerCase() : c);
        });
        return lowerCase ? name : capitalize(name);
    }

    function pluralize(name)
    {
        return name.replace(/([^aeiou])y$/, '$1ie').replace(/s?$/, '') + 's';
    }

    function split2Words(str, char)
    {
        if (char === void 0)
        {
            char = ' ';
        }
        return str.replace(/[A-Z]/g, char + '$&');
    }

    function getBoundKey(key)
    {
        return 'bound' + capitalize(key);
    }

    function getTierKey(key, tierLevel)
    {
        return TIER_LEVELS[tierLevel] + capitalize(key);
    }

    function getWikiaKey(key)
    {
        return key2Name(key.replace(/^bound-?|^special-case-/i, '').replace(/\d+[km]?$/i, ''))
            .replace(/^\s/, '').replace(/[ -]/g, '_')
            .replace(/^(?:Empty|Sapphire|Emerald|Ruby|Diamond|Raw|Uncooked|Filled)_/, '')
            .replace(/^(?:Bronze|Iron|Silver|Gold|Promethium|Runite)_(?!Bar)/, '')
            .replace(/^Npc_/, 'Monster_')
            .replace(/_(?:Unlocked|Quest)$/, '');
    }

    function getWikiaLink(key)
    {
        return 'http://diamondhuntonline.wikia.com/wiki/' + getWikiaKey(key);
    }

    function now()
    {
        return (new Date()).getTime();
    }

    function ensureTooltip(id, target)
    {
        var tooltipId = 'tooltip-' + id;
        var tooltipEl = document.getElementById(tooltipId);
        if (!tooltipEl)
        {
            tooltipEl = document.createElement('div');
            tooltipEl.id = tooltipId;
            tooltipEl.style.display = 'none';
            var tooltipList = document.getElementById('tooltip-list');
            tooltipList.appendChild(tooltipEl);
        }
        // ensure binded events to show the tooltip
        if (target.dataset.tooltipId == null)
        {
            target.dataset.tooltipId = tooltipId;
            win.$(target).bind(
                {
                    mousemove: win.changeTooltipPosition
                    , mouseenter: win.showTooltip
                    , mouseleave: function (event)
                    {
                        var target = event.target;
                        var parent = target.parentElement;
                        // ensure tooltips inside an tooltip element is possible
                        if (!!target.dataset.tooltipId && parent && !!parent.dataset.tooltipId)
                        {
                            win.showTooltip.call(parent, event);
                        }
                        else
                        {
                            win.hideTooltip(event);
                        }
                    }
                });
        }
        return tooltipEl;
    }
    var timeStr2Sec = (function ()
                       {
        var unitFactors = {
            'd': 24 * 60 * 60
            , 'h': 60 * 60
            , 'm': 60
            , 's': 1
        };
        return function timeStr2Sec(str)
        {
            return str
                .replace(/(\d+)([hms])/g, function (wholeMatch, num, unit)
                         {
                return parseInt(num) * (unitFactors[unit] || 1) + '+';
            })
                .split('+')
                .map(function (s)
                     {
                return parseInt(s, 10);
            })
                .filter(function (n)
                        {
                return !isNaN(n);
            })
                .reduce(function (p, c)
                        {
                return p + c;
            }, 0);
        };
    })();

    function getGameValue(key)
    {
        return win[key];
    }

    function getFurnaceLevel()
    {
        for (var i = FURNACE_LEVELS.length - 1; i >= 0; i--)
        {
            if (getGameValue(getBoundKey(FURNACE_LEVELS[i] + 'Furnace')) > 0)
            {
                return i;
            }
        }
        return -1;
    }

    function getFurnaceLevelName()
    {
        return FURNACE_LEVELS[getFurnaceLevel()] || '';
    }

    function getPrice(item)
    {
        var price = win.getPrice(item);
        if (typeof price === 'number')
        {
            return price;
        }
        var match = price.match(/(\d+)([kM])/);
        if (!match)
        {
            return parseInt(price, 10);
        }
        var FACTORS = {
            'k': 1e3
            , 'M': 1e6
        };
        return parseInt(match[1], 10) * (FACTORS[match[2]] || 1);
    }

    function doGet(url)
    {
        return new Promise(function (resolve, reject)
                           {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function (event)
            {
                if (request.readyState != XMLHttpRequest.DONE)
                {
                    return;
                }
                if (request.status != 200)
                {
                    return reject(event);
                }
                resolve(request.responseText);
            };
            request.open('GET', url);
            request.send();
        });
    }

    function removeWhitespaceChildNodes(el)
    {
        for (var i = 0; i < el.childNodes.length; i++)
        {
            var child = el.childNodes.item(i);
            if (child.nodeType === Node.TEXT_NODE && /^\s*$/.test(child.textContent || ''))
            {
                el.removeChild(child);
                i--;
            }
        }
    }

    function debounce(func, wait, immediate)
    {
        var timeout;
        return function ()
        {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++)
            {
                args[_i] = arguments[_i];
            }
            var callNow = immediate && !timeout;
            timeout && clearTimeout(timeout);
            timeout = setTimeout(function ()
                                 {
                timeout = null;
                if (!immediate)
                {
                    func.apply(_this, args);
                }
            }, wait);
            if (callNow)
            {
                func.apply(this, args);
            }
        };
    }

    function passThis(fn)
    {
        return function ()
        {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++)
            {
                args[_i] = arguments[_i];
            }
            return fn.apply(void 0, [this].concat(args));
        };
    }
    /**
 * persistence store
 */
    var store;
    (function (store)
     {
        var oldPrefix = 'dh2-';
        var storePrefix = 'dh2.';

        function update(key, keepOldValue)
        {
            if (keepOldValue === void 0)
            {
                keepOldValue = true;
            }
            if (localStorage.hasOwnProperty(oldPrefix + key))
            {
                if (keepOldValue)
                {
                    localStorage.setItem(storePrefix + key, localStorage.getItem(oldPrefix + key));
                }
                localStorage.removeItem(oldPrefix + key);
            }
        }
        var changeListener = new Map();

        function changeDetected(key, oldValue, newValue)
        {
            if (changeListener.has(key))
            {
                setTimeout(function ()
                           {
                    changeListener.get(key).forEach(function (fn)
                                                    {
                        return fn(key, oldValue, newValue);
                    });
                });
            }
        }

        function watchFn(fnName)
        {
            var _fn = localStorage[fnName];
            localStorage[fnName] = function (key)
            {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++)
                {
                    args[_i - 1] = arguments[_i];
                }
                var oldValue = localStorage.getItem(key);
                _fn.apply(localStorage, [key].concat(args));
                var newValue = localStorage.getItem(key);
                if (oldValue !== newValue)
                {
                    changeDetected(key, oldValue, newValue);
                }
            };
        }
        watchFn('setItem');
        watchFn('removeItem');
        var _clear = localStorage.clear;
        localStorage.clear = function ()
        {
            var oldValues = new Map();
            for (var i = 0; i < localStorage.length; i++)
            {
                var key = localStorage.key(i);
                oldValues.set(key, localStorage.getItem(key));
            }
            _clear();
            for (var key in oldValues)
            {
                var newValue = localStorage.getItem(key);
                if (oldValues.get(key) !== newValue)
                {
                    changeDetected(key, oldValues.get(key), newValue);
                }
            }
        };

        function addChangeListener(key, fn)
        {
            if (!changeListener.has(key))
            {
                changeListener.set(key, new Set());
            }
            changeListener.get(key).add(fn);
        }
        store.addChangeListener = addChangeListener;

        function removeChangeListener(key, fn)
        {
            if (changeListener.has(key))
            {
                changeListener.get(key).delete(fn);
            }
        }
        store.removeChangeListener = removeChangeListener;

        function get(key)
        {
            update(key);
            var value = localStorage.getItem(storePrefix + key);
            if (value != null)
            {
                try
                {
                    return JSON.parse(value);
                }
                catch (e)
                {}
            }
            return value;
        }
        store.get = get;

        function has(key)
        {
            update(key);
            return localStorage.hasOwnProperty(storePrefix + key);
        }
        store.has = has;

        function remove(key)
        {
            update(key, false);
            localStorage.removeItem(storePrefix + key);
        }
        store.remove = remove;

        function set(key, value)
        {
            update(key, false);
            localStorage.setItem(storePrefix + key, JSON.stringify(value));
        }
        store.set = set;
    })(store || (store = {}));

    var settings;
    (function (settings)
     {
        settings.name = 'settings';
        var DIALOG_WIDTH = 450;
        var KEY;
        (function (KEY)
         {
            var runningIndex = 0;
            KEY[KEY["hideCraftingRecipes"] = runningIndex++] = "hideCraftingRecipes";
            KEY[KEY["hideUselessItems"] = runningIndex++] = "hideUselessItems";
            KEY[KEY["useNewChat"] = runningIndex++] = "useNewChat";
            KEY[KEY["colorizeChat"] = runningIndex++] = "colorizeChat";
            KEY[KEY["intelligentScrolling"] = runningIndex++] = "intelligentScrolling";
            KEY[KEY["showTimestamps"] = runningIndex++] = "showTimestamps";
            KEY[KEY["showIcons"] = runningIndex++] = "showIcons";
            KEY[KEY["showTags"] = runningIndex++] = "showTags";
            KEY[KEY["enableSpamDetection"] = runningIndex++] = "enableSpamDetection";
            KEY[KEY["useTombNotif"] = runningIndex++] = "useTombNotif";
            KEY[KEY["useDarkTombNotif"] = runningIndex++] = "useDarkTombNotif";
            KEY[KEY["useBobsUncleNotif"] = runningIndex++] = "useBobsUncleNotif";
            KEY[KEY["useCharcoalFoundryNotif"] = runningIndex++] = "useCharcoalFoundryNotif";
            KEY[KEY["useSmeltingNotif"] = runningIndex++] = "useSmeltingNotif";
            KEY[KEY["woodcuttingDisableShiny"] = runningIndex++] = "woodcuttingDisableShiny";
            KEY[KEY["woodcuttingDisableAncient"] = runningIndex++] = "woodcuttingDisableAncient";
            KEY[KEY["useAnimalPenNotif"] = runningIndex++] = "useAnimalPenNotif";
            KEY[KEY["showNotifications"] = runningIndex++] = "showNotifications";
            KEY[KEY["wikiaLinks"] = runningIndex++] = "wikiaLinks";
            KEY[KEY["newXpAnimation"] = runningIndex++] = "newXpAnimation";
            KEY[KEY["amountSymbol"] = runningIndex++] = "amountSymbol";
            KEY[KEY["showTabTimer"] = runningIndex++] = "showTabTimer";
            KEY[KEY["showLootTab"] = runningIndex++] = "showLootTab";
            KEY[KEY["useEfficiencyStyle"] = runningIndex++] = "useEfficiencyStyle";
            KEY[KEY["makeNumberInputs"] = runningIndex++] = "makeNumberInputs";
            KEY[KEY["addKeepInput"] = runningIndex++] = "addKeepInput";
            KEY[KEY["addMaxBtn"] = runningIndex++] = "addMaxBtn";
            KEY[KEY["highlightUnplantableSeed"] = runningIndex++] = "highlightUnplantableSeed";
            KEY[KEY["showSdChange"] = runningIndex++] = "showSdChange";
            KEY[KEY["usePotionWarning"] = runningIndex++] = "usePotionWarning";
            KEY[KEY["showCaptions"] = runningIndex++] = "showCaptions";
            KEY[KEY["syncPriceHistory"] = runningIndex++] = "syncPriceHistory";
            KEY[KEY["useNewToolbar"] = runningIndex++] = "useNewToolbar";
            KEY[KEY["changeMachineDialog"] = runningIndex++] = "changeMachineDialog";
            KEY[KEY["skillBars"] = runningIndex++] = "skillBars";
        })(KEY = settings.KEY || (settings.KEY = {}));;
        var CFG = (_a = {}
                   , _a[KEY.hideCraftingRecipes] = {
            name: 'Hide crafting recipes of finished items'
            , description: "Hides crafting recipes of:\n\t\t\t\t<ul style=\"margin: .5rem 0 0;\">\n\t\t\t\t\t<li>furnace, oil storage and oven recipes if they aren't better than the current level</li>\n\t\t\t\t\t<li>machines if the user has the maximum amount of this type (counts bound and unbound items)</li>\n\t\t\t\t\t<li>non-stackable items which the user already owns (counts bound and unbound items)</li>\n\t\t\t\t</ul>"
            , defaultValue: true
        }
                   , _a[KEY.hideUselessItems] = {
            name: 'Hide useless items'
            , description: "Hides <em>unbound</em> items which may has been crafted accidentially and are of no use for the player:\n\t\t\t\t<ul style=\"margin: .5rem 0 0;\">\n\t\t\t\t\t<li>furnace, oil storage and oven recipes if they aren't better than the current level</li>\n\t\t\t\t\t<li>machines if the user has already bound the maximum amount of this type</li>\n\t\t\t\t\t<li>non-stackable items which the user has already bound</li>\n\t\t\t\t</ul>"
            , defaultValue: false
        }
                   , _a[KEY.useNewChat] = {
            name: 'Use the new chat'
            , description: "Enables using the completely new chat with pm tabs, clickable links, clickable usernames to send a pm, intelligent scrolling and suggesting commands while typing"
            , defaultValue: true
        }
                   , _a[KEY.colorizeChat] = {
            name: 'Colorize chat messages'
            , description: "Colorize chat messages according to a unique color for each user"
            , defaultValue: false
            , sub:
            {
                'colorizer':
                {
                    defaultValue: 0
                    , label: ['Equally Distributed', 'Random (light colors)', 'Random (dark colors)']
                    , options: ['equallyDistributed', 'random1', 'random2']
                }
            }
        }
                   , _a[KEY.intelligentScrolling] = {
            name: 'Intelligent scrolling'
            , description: "Autoscroll gets disabled when you scroll up and gets enabled again when you scroll all the way down to the bottom of the chat."
            , defaultValue: true
        }
                   , _a[KEY.showTimestamps] = {
            name: 'Show timestamps'
            , description: "Enables showing timestamps in chat"
            , defaultValue: true
        }
                   , _a[KEY.showIcons] = {
            name: 'Show user-icons'
            , description: "Enables showing icons (formerly sigils) for each user in chat"
            , defaultValue: true
        }
                   , _a[KEY.showTags] = {
            name: 'Show user-tags'
            , description: "Enables showing tags (Dev, Mod, Contributor) and colors for messages in chat"
            , defaultValue: true
        }
                   , _a[KEY.enableSpamDetection] = {
            name: 'Enable spam detection'
            , description: "Enables simple spam detection"
            , defaultValue: true
        }
                   , _a[KEY.useTombNotif] = {
            name: 'Use Tomb notification'
            , description: "Shows notification when Faradox's tomb is ready to fight"
            , defaultValue: false
        }
                   , _a[KEY.useDarkTombNotif] = {
            name: 'Use Dark Tomb notification'
            , description: "Shows notification when Dark Faradox's tomb is ready to fight"
            , defaultValue: false
        }
                   , _a[KEY.useBobsUncleNotif] = {
            name: 'Use Bobs uncle notification'
            , description: "Shows notification when Bob's uncle farm is ready to harvest"
            , defaultValue: true
        }
                   , _a[KEY.useCharcoalFoundryNotif] = {
            name: 'Use Charcoal Foundry notification'
            , description: "Shows notification when Charcoal Foundry is empty and ready for use"
            , defaultValue: true
        }
                   , _a[KEY.useSmeltingNotif] = {
            name: 'Use Smelting notification'
            , description: "Shows notification when your furnace is empty and ready for use"
            , defaultValue: false
        }
                   , _a[KEY.woodcuttingDisableShiny] = {
            name: 'Disable chopping down Shiny Trees'
            , description: "Disables manually chopping down Shiny Trees. WARNING: The lumberjack will still chop them down if asked"
            , defaultValue: false
        }
                   , _a[KEY.woodcuttingDisableAncient] = {
            name: 'Disable chopping down Ancient Trees'
            , description: "Disables manually chopping down Ancient Trees. WARNING: The lumberjack will still chop them down if asked"
            , defaultValue: false
        }
                   , _a[KEY.useAnimalPenNotif] = {
            name: 'Keep track of animals'
            , description: "Shows notification when you reach the wanted amount of animals"
            , defaultValue: true
            , sub:{}
        }
                   , _a[KEY.showNotifications] = {
            name: 'Show browser notifications'
            , description: "Shows browser notifications for enabled events (click the little gear for more options)"
            , defaultValue: true
            , sub:
            {
                'showType':
                {
                    defaultValue: 0
                    , label: ['only when window inactive', 'always']
                    , options: ['whenInactive', 'always']
                }
                , 'smelting':
                {
                    defaultValue: true
                    , label: 'Smelting finishes'
                }
                , 'chopping':
                {
                    defaultValue: true
                    , label: 'A tree is fully grown'
                }
                , 'harvest':
                {
                    defaultValue: true
                    , label: 'A plant can be harvested'
                }
                , 'potionEffect':
                {
                    defaultValue: true
                    , label: 'A potion\'s effect ends'
                }
                , 'boatReturned':
                {
                    defaultValue: true
                    , label: 'A boat returns'
                }
                , 'heroReady':
                {
                    defaultValue: true
                    , label: 'The hero is fully recovered and ready to fight'
                }
                , 'itemsSold':
                {
                    defaultValue: true
                    , label: 'Items are sold on the market'
                }
                , 'pirate':
                {
                    defaultValue: true
                    , label: 'A pirate has found a treasure map'
                }
                , 'rocket':
                {
                    defaultValue: true
                    , label: 'The rocket has landed on the moon or earth'
                }
                , 'wind':
                {
                    defaultValue: true
                    , label: 'The wind for the sail boat has changed'
                }
                , 'perk':
                {
                    defaultValue: true
                    , label: 'A new perk is unlocked (achievement set completed)'
                }
                , 'pm':
                {
                    defaultValue: true
                    , label: 'A private messages (pm) arrives'
                }
                , 'mention':
                {
                    defaultValue: true
                    , label: 'The username is mentioned in chat'
                }
                , 'keyword':
                {
                    defaultValue: true
                    , label: 'A keyword is mentioned in chat'
                }
                , 'serverMsg':
                {
                    defaultValue: true
                    , label: 'Server messages (like <em>Server is restarting...</em>)'
                }
                , 'animalCrate':
                {
                    defaultValue: true
                    , label: 'Your animal crate is full'
                }
                , 'animalMax':
                {
                    defaultValue: true
                    , label: 'One of your animal pens is full'
                }
            }
        }
                   , _a[KEY.wikiaLinks] = {
            name: 'Show wikia links'
            , description: "Show wikia links for every item on hover (the little icon in the upper left corner)"
            , defaultValue: true
        }
                   , _a[KEY.newXpAnimation] = {
            name: 'New XP-gain animation'
            , description: "Show gained xp on top skill bar instead on the position of the mouse"
            , defaultValue: true
        }
                   , _a[KEY.amountSymbol] = {
            name: 'Show \u00D7 on items'
            , description: "Show a tiny \u00D7-symbol before amount numbers of items"
            , defaultValue: true
        }
                   , _a[KEY.showTabTimer] = {
            name: 'Show tab timer and info'
            , description: "Show timer on tabs for trees, plants and hero"
            , defaultValue: true
        }
                   , _a[KEY.showLootTab] = {
            name: 'Show sub tab for loot table'
            , description: "Show a sub tab for combat drop table in combat"
            , defaultValue: true
        }
                   , _a[KEY.useEfficiencyStyle] = {
            name: 'Use space efficient style'
            , description: "Use a space efficient style with less blank space"
            , defaultValue: false
        }
                   , _a[KEY.makeNumberInputs] = {
            name: 'Turn text inputs into number inputs'
            , description: "Number inputs allow you to change the amount via arrow buttons"
            , defaultValue: true
        }
                   , _a[KEY.addKeepInput] = {
            name: 'Add keep input for selling to npc shop'
            , description: "A keep input allows you to set the amount of items you want to keep when selling"
            , defaultValue: true
        }
                   , _a[KEY.addMaxBtn] = {
            name: 'Add max button for some crafting inputs'
            , description: "Add max button for crafting (e.g. vials), brewing potions and cooking food"
            , defaultValue: true
        }
                   , _a[KEY.highlightUnplantableSeed] = {
            name: 'Show whether a seed can be planted'
            , description: "Fades the item box of a seed when it's not plantable"
            , defaultValue: true
        }
                   , _a[KEY.showSdChange] = {
            name: 'Show stardust change'
            , description: "Shows the amount of stardust earned or spent in the last tick"
            , defaultValue: true
        }
                   , _a[KEY.usePotionWarning] = {
            name: 'Use drink warning for active potions'
            , description: "Disable drink button for 3 seconds if the potion is already active"
            , defaultValue: true
        }
                   , _a[KEY.showCaptions] = {
            name: 'Show item captions'
            , description: "Show item captions for some items instead of the number of owned items"
            , defaultValue: true
        }
                   , _a[KEY.syncPriceHistory] = {
            name: 'Sync price history'
            , description: "Synchronize the local price history"
            , defaultValue: false
            , sub:
            {
                'url':
                {
                    defaultValue: ''
                    , label: 'paste url here'
                }
            }
        }
                   , _a[KEY.useNewToolbar] = {
            name: 'Use new toolbar'
            , description: "Use new reordered toolbar"
            , defaultValue: true
            , requiresReload: true
        }
                   , _a[KEY.changeMachineDialog] = {
            name: 'Use slider for machine dialog'
            , description: "Change buttons in machine dialog into slider"
            , defaultValue: true
            , requiresReload: true
        }
                   , _a[KEY.skillBars] = {
            name: 'Show XP bars'
            , description: "Show the XP bars under skills on top"
            , defaultValue: true
            , requiresReload: true
        }
                   , _a);

        for(var animalIndex = 0; animalIndex < ANIMALS.length; animalIndex++){
            var thisAnimal = ANIMALS[animalIndex];
            CFG[KEY.useAnimalPenNotif].sub[thisAnimal.name] = {
                    defaultValue: 10
                    , range: [2,10]
                };
        }
        var SETTINGS_TABLE_ID = 'dh2-settings';
        var SETTING_ID_PREFIX = 'dh2-setting-';
        var settings2Init = Object.keys(CFG);
        /**
	 * settings
	 */
        function toName(key, subKey)
        {
            var name = typeof key === 'string' ? key : KEY[key];
            if (subKey !== undefined)
            {
                return name + '.' + subKey;
            }
            return name;
        }

        function getStoreKey(key, subKey)
        {
            return 'setting.' + toName(key, subKey);
        }
        var observedSettings = new Map();
        var observedSubSettings = new Map();

        function observe(key, fn)
        {
            var n = toName(key);
            if (!observedSettings.has(n))
            {
                observedSettings.set(n, new Set());
            }
            observedSettings.get(n).add(fn);
        }
        settings.observe = observe;

        function observeSub(key, subKey, fn)
        {
            var n = toName(key, subKey);
            if (!observedSubSettings.has(n))
            {
                observedSubSettings.set(n, new Set());
            }
            observedSubSettings.get(n).add(fn);
        }
        settings.observeSub = observeSub;

        function unobserve(key, fn)
        {
            var n = toName(key);
            if (!observedSettings.has(n))
            {
                return false;
            }
            return observedSettings.get(n).delete(fn);
        }
        settings.unobserve = unobserve;

        function unobserveSub(key, subKey, fn)
        {
            var n = toName(key, subKey);
            if (!observedSubSettings.has(n))
            {
                return false;
            }
            return observedSubSettings.get(n).delete(fn);
        }
        settings.unobserveSub = unobserveSub;
        var settingsProxies = new Map();

        function get(key)
        {
            if (!CFG.hasOwnProperty(key))
            {
                return false;
            }
            if (settingsProxies.has(key))
            {
                var proxy = settingsProxies.get(key);
                return proxy.get(key);
            }
            var name = getStoreKey(key);
            return store.has(name) ? store.get(name) : CFG[key].defaultValue;
        }
        settings.get = get;

        function getSub(key, subKey)
        {
            if (!CFG.hasOwnProperty(key))
            {
                return null;
            }
            var name = getStoreKey(key, subKey);
            var def = CFG[key].sub[subKey].defaultValue;
            if (store.has(name))
            {
                var stored = store.get(name);
                if (def instanceof Array)
                {
                    for (var i = 0; i < def.length; i++)
                    {
                        if (stored.indexOf(def[i]) === -1)
                        {
                            stored.push(def[i]);
                        }
                    }
                    for (var i = 0; i < stored.length; i++)
                    {
                        if (def.indexOf(stored[i]) === -1)
                        {
                            stored.splice(i, 1);
                            i--;
                        }
                    }
                }
                return stored;
            }
            else
            {
                return def;
            }
        }
        settings.getSub = getSub;

        function set(key, newValue)
        {
            if (!CFG.hasOwnProperty(key))
            {
                return;
            }
            var oldValue = get(key);
            var n = toName(key);
            if (settingsProxies.has(key))
            {
                var proxy = settingsProxies.get(key);
                proxy.set(key, oldValue, newValue);
            }
            else
            {
                store.set(getStoreKey(key), newValue);
            }
            if (oldValue !== newValue && observedSettings.has(n))
            {
                observedSettings.get(n).forEach(function (fn)
                                                {
                    return fn(key, oldValue, newValue);
                });
            }
        }
        settings.set = set;

        function setSub(key, subKey, newValue)
        {
            if (!CFG.hasOwnProperty(key))
            {
                return;
            }
            var oldValue = getSub(key, subKey);
            var n = toName(key, subKey);
            store.set(getStoreKey(key, subKey), newValue);
            if (oldValue !== newValue && observedSubSettings.has(n))
            {
                observedSubSettings.get(n).forEach(function (fn)
                                                   {
                    return fn(key, subKey, oldValue, newValue);
                });
            }
        }
        settings.setSub = setSub;

        function getSubCfg(key)
        {
            if (!CFG.hasOwnProperty(key))
            {
                return;
            }
            return CFG[key].sub;
        }
        settings.getSubCfg = getSubCfg;

        function initSettingsStyle()
        {
            addStyle("\ntable.table-style1 tr:not([onclick])\n{\n\tcursor: initial;\n}\n#tab-container-profile h2.section-title\n{\n\tcolor: orange;\n\tline-height: 1.2rem;\n\tmargin-top: 2rem;\n}\n#tab-container-profile h2.section-title > a.version\n{\n\tcolor: orange;\n\tfont-size: 1.2rem;\n\ttext-decoration: none;\n}\n#tab-container-profile h2.section-title > a.version:hover\n{\n\tcolor: white;\n\ttext-decoration: underline;\n}\n#tab-container-profile h2.section-title > span.note\n{\n\tfont-size: 0.9rem;\n}\n#" + SETTINGS_TABLE_ID + " tr.reload td:first-child::after\n{\n\tcontent: '*';\n\tfont-weight: bold;\n\tmargin-left: 3px;\n}\n#" + SETTINGS_TABLE_ID + " tr.sub td\n{\n\tposition: relative;\n}\n#" + SETTINGS_TABLE_ID + " tr.sub td button:last-child\n{\n\tmargin: -1px;\n\tposition: absolute;\n\tright: 0;\n}\n\n.ui-dialog-content > h2:first-child\n{\n\tmargin-top: 0;\n}\n\n.settings-container\n{\n\tlist-style: none;\n\tmargin: 5px 30px;\n\tpadding: 0;\n}\n.ui-dialog-content .settings-container\n{\n\tmargin: 5px 0;\n}\n.settings-container > li.setting\n{\n\tbackground-color: silver;\n\tborder: 1px solid black;\n\tborder-left: 0;\n\tborder-right: 0;\n\tborder-top-width: 0;\n\tdisplay: flex;\n}\n.settings-container > li.setting:first-child\n{\n\tborder-top-width: 1px;\n}\n.ui-dialog-content .settings-container > li.setting,\n.ui-dialog-content .settings-container > li.setting:hover\n{\n\tbackground-color: transparent;\n\tborder: 0;\n\tmargin: .25rem 0;\n}\n.settings-container > li.setting,\n.settings-container > li.setting *\n{\n\tcursor: pointer;\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n.settings-container > li.setting:hover\n{\n\tbackground-color: gray;\n}\n.settings-container > li.setting > input[type=\"checkbox\"]\n{\n\tdisplay: none;\n}\n.settings-container > li.setting > label\n{\n\tdisplay: block;\n\tflex-grow: 1;\n\tpadding: .25rem .5rem;\n}\n.settings-container > li.setting > label.ui-checkboxradio-label\n{\n\ttext-align: left;\n}\n.settings-container > li.setting > label.ui-checkboxradio-label .ui-checkboxradio-icon-space\n{\n\tmargin-right: .25rem;\n}\n.settings-container > li.setting > input + label:not(.ui-checkboxradio-label)::before\n{\n\tbackground-image: url(images/icons/x.png);\n\tbackground-size: 20px;\n\tcontent: '';\n\tdisplay: inline-block;\n\theight: 20px;\n\tmargin: 0 .25rem;\n\twidth: 20px;\n\tvertical-align: middle;\n}\n.settings-container > li.setting > input:checked + label:not(.ui-checkboxradio-label)::before\n{\n\tbackground-image: url(images/icons/check.png);\n}\n.ui-dialog-content .settings-container > li.setting > label + button\n{\n\tmargin-left: -.2rem;\n\tz-index: 1;\n}\n.settings-container.sortable > li.setting > span.ui-icon.handle\n{\n\tfloat: left;\n\tmargin: 6px 10px;\n\tz-index: 10;\n}\n.settings-container > li.setting span.ui-selectmenu-button\n{\n\twidth: calc(100% - 2em - 2*3px + 2*.1em);\n}\n.settings-container > li.setting > button.ui-button\n{\n\twidth: 100%;\n}\n.ui-textfield\n{\n\tbackground: none;\n\tcolor: inherit;\n\tcursor: text;\n\tfont: inherit;\n\toutline: none;\n\ttext-align: inherit;\n}\n.ui-textfield.ui-state-active,\n.ui-widget-content .ui-textfield.ui-state-active,\n.ui-widget-header .ui-textfield.ui-state-active,\n.ui-button.ui-textfield:active,\n.ui-button.ui-textfield.ui-state-active:hover\n{\n\tbackground: transparent;\n\tborder: 1px solid #c5c5c5;\n\tcolor: #333333;\n\tfont-weight: normal;\n}\n.settings-container.list > li\n{\n\tborder: 1px solid #c5c5c5;\n\tborder-radius: 3px;\n\tdisplay: flex;\n\tmargin: 5px 0;\n}\n.settings-container.list > li > span.content\n{\n\tflex: 1 0 auto;\n\tline-height: 2rem;\n\tmargin: 0 5px 0 1rem;\n}\n.settings-container.list > li > button.ui-button\n{\n\tmargin: -1px;\n}\n.instruction\n{\n\tcursor: default;\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n.instruction code,\n.instruction a\n{\n\tcursor: initial;\n\t-webkit-user-select: text;\n\t-moz-user-select: text;\n\t-ms-user-select: text;\n\tuser-select: text;\n}\n.instruction code\n{\n\tbackground-color: lightgray;\n\tdisplay: inline-block;\n\tpadding: .25rem;\n}\n\t\t");
        }

        function getSettingId(key, subKey)
        {
            var name = toName(key) + (subKey !== undefined ? '-' + subKey : '');
            return SETTING_ID_PREFIX + split2Words(name, '-').toLowerCase();
        }

        function initSettingTable()
        {
            function insertAfter(newChild, oldChild)
            {
                var parent = oldChild.parentElement;
                if (oldChild.nextElementSibling == null)
                {
                    parent.appendChild(newChild);
                }
                else
                {
                    parent.insertBefore(newChild, oldChild.nextElementSibling);
                }
            }

            function getCheckImageSrc(value)
            {
                return 'images/icons/' + (value ? 'check' : 'x') + '.png';
            }
            var profileTable = document.getElementById('profile-toggleTable');
            if (!profileTable)
            {
                return;
            }
            var settingsHeader = document.createElement('h2');
            settingsHeader.className = 'section-title';
            settingsHeader.innerHTML = "Userscript \"DH2 Fixed\" <a class=\"version\" href=\"https://greasyfork.org/scripts/27642-dh2-fixed\" target=\"_blank\">v" + version + "</a><br>\n\t\t\t<span class=\"note\" style=\"display: none;\">(* changes require reloading the tab)</span>";
            var requiresReloadNote = settingsHeader.querySelector('.note');
            insertAfter(settingsHeader, profileTable);
            var settingsTable = document.createElement('table');
            settingsTable.id = SETTINGS_TABLE_ID;
            settingsTable.className = 'table-style1';
            settingsTable.width = '40%';
            settingsTable.innerHTML = "\n\t\t<tr style=\"background-color:grey;\">\n\t\t\t<th>Setting</th>\n\t\t\t<th>Enabled</th>\n\t\t</tr>\n\t\t";

            function addRowClickListener(row, key, settingId)
            {
                if(settingId == "dh2-setting-show-captions"){
                    row.addEventListener('click', function (){
                        var newValue = !get(key);
                        set(key, newValue);
                        document.getElementById(settingId).src = getCheckImageSrc(newValue);
                        if(newValue){
                            document.getElementById("item-box-boundRowBoat").firstElementChild.style.position = "";
                            document.getElementById("item-box-boundRowBoat").firstElementChild.style.width= "";
                            document.getElementById("item-box-boundCanoe").firstElementChild.style.position = "";
                            document.getElementById("item-box-boundCanoe").firstElementChild.style.width= "";
                            document.getElementById("item-box-boundSteamBoat").firstElementChild.style.position = "";
                            document.getElementById("item-box-boundSteamBoat").firstElementChild.style.width= "";
                        }else{
                            document.getElementById("item-box-boundRowBoat").firstElementChild.style.position = "absolute";
                            document.getElementById("item-box-boundRowBoat").firstElementChild.style.width= "inherit";
                            document.getElementById("item-box-boundCanoe").firstElementChild.style.position = "absolute";
                            document.getElementById("item-box-boundCanoe").firstElementChild.style.width= "inherit";
                            document.getElementById("item-box-boundSteamBoat").firstElementChild.style.position = "absolute";
                            document.getElementById("item-box-boundSteamBoat").firstElementChild.style.width= "inherit";
                        }
                    });
                }else{
                    row.addEventListener('click', function ()
                                         {
                        var newValue = !get(key);
                        set(key, newValue);
                        document.getElementById(settingId).src = getCheckImageSrc(newValue);
                    });
                }
            }

            function addSubClickListener(btn, dialog)
            {
                btn.addEventListener('click', function (event)
                                     {
                    initJQueryDialog(dialog);
                    event.stopPropagation();
                    event.preventDefault();
                });
            }
            for (var _i = 0, settings2Init_1 = settings2Init; _i < settings2Init_1.length; _i++)
            {
                var k = settings2Init_1[_i];
                // convert it into a KEY
                var key = parseInt(k, 10);
                var setting = CFG[key];
                if (setting == null)
                {
                    console.error('missing setting entry:', key, toName(key));
                    continue;
                }
                var settingId = getSettingId(key);
                var row = settingsTable.insertRow(-1);
                row.classList.add('setting');
                if (setting.requiresReload)
                {
                    row.classList.add('reload');
                    requiresReloadNote.style.display = '';
                }
                row.setAttribute('onclick', '');
                row.innerHTML = "\n\t\t\t<td>" + setting.name + "</td>\n\t\t\t<td><img src=\"" + getCheckImageSrc(get(key)) + "\" id=\"" + settingId + "\" class=\"image-icon-20\"></td>\n\t\t\t";
                if (setting.sub)
                {
                    row.classList.add('sub');
                    var subBtn = document.createElement('button');
                    subBtn.innerHTML = "<img src=\"images/icons/gearOff.gif\" class=\"image-icon-15\">";
                    row.cells.item(0).appendChild(subBtn);
                    var dialog = createSubSettingDialog(key);
                    addSubClickListener(subBtn, dialog);
                }
                var tooltipEl = ensureTooltip(settingId, row);
                tooltipEl.innerHTML = setting.description;
                if (setting.requiresReload)
                {
                    tooltipEl.innerHTML += "<span style=\"color: hsla(20, 100%, 50%, 1); font-size: .9rem; display: block; margin-top: 0.5rem;\">You have to reload the browser tab to apply changes to this setting.</span>";
                }
                addRowClickListener(row, key, settingId);
            }
            insertAfter(settingsTable, settingsHeader);
        }

        function initProxies()
        {
            var row = document.querySelector('tr[data-tooltip-id="tooltip-profile-removeCraftingFilter"]');
            if (row)
            {
                var valueCache_1 = getGameValue('profileRemoveCraftingFilter') != 1;
                settingsProxies.set(KEY.hideCraftingRecipes
                                    , {
                    get: function (key)
                    {
                        return getGameValue('profileRemoveCraftingFilter') != 1;
                    }
                    , set: function (key, oldValue, newValue)
                    {
                        if (valueCache_1 != newValue)
                        {
                            row.click();
                            valueCache_1 = newValue;
                        }
                    }
                });
                observer.add('profileRemoveCraftingFilter', function ()
                             {
                    set(KEY.hideCraftingRecipes, getGameValue('profileRemoveCraftingFilter') != 1);
                });
            }
        }
        var subDialog;
        (function (subDialog)
         {
            function defaultHandler(key, dialog)
            {
                var setting = CFG[key];
                var subSettings = setting.sub;
                var settingContainer = createSubSettingsContainer(key, subSettings);
                dialog.appendChild(settingContainer);
            }

            function colorizeChat(dialog)
            {
                defaultHandler(KEY.colorizeChat, dialog);
            }
            subDialog.colorizeChat = colorizeChat;
            function useAnimalPenNotif(dialog)
            {
                var titleSpan = document.createElement("span");
                titleSpan.appendChild(document.createTextNode('Show notifications when you have more than: (10 = never)'));
                titleSpan.style="float: left;width: 100%;";
                dialog.appendChild(titleSpan);
                defaultHandler(KEY.useAnimalPenNotif, dialog);
                var liElements = dialog.lastElementChild.children;
                dialog.lastElementChild.style = "float:left";
                for(var i = 0; i < liElements.length; i++)
                {
                    var element = liElements[i];
                    var input = element.lastElementChild;
                    var name = input.name;
                    var nameSpan = document.createElement("div");
                    nameSpan.appendChild(document.createTextNode(name));
                    nameSpan.style="width:6rem;text-align:left;";
                    element.insertBefore(nameSpan,input);
                    var valueSpan = document.createElement("div");
                    valueSpan.id = name.replace(/\s/g, "+")+"ValueSpan";
                    valueSpan.appendChild(document.createTextNode(input.value));
                    valueSpan.style="width:3rem;text-align:center;";
                    element.appendChild(valueSpan);
                }
            }
            subDialog.useAnimalPenNotif = useAnimalPenNotif;
            function showNotifications(dialog)
            {
                dialog.appendChild(document.createTextNode('Show notifications\u2026'));
                defaultHandler(KEY.showNotifications, dialog);
                dialog.appendChild(document.createTextNode('Events for which notifications are shown:'));
                var ulNotifType = dialog.lastElementChild;
                var ulEvents = ulNotifType.cloneNode(false);
                while (ulNotifType.children.length > 1)
                {
                    ulEvents.appendChild(ulNotifType.children.item(1));
                }
                dialog.appendChild(ulEvents);
            }
            subDialog.showNotifications = showNotifications;

            function syncPriceHistory(dialog)
            {
                var setting = CFG[KEY.syncPriceHistory];
                var subSettings = setting.sub;
                var instructionEl = document.createElement('div');
                instructionEl.className = 'instruction';
                instructionEl.innerHTML = "Go to <a href=\"http://myjson.com/\" target=\"_blank\">http://myjson.com/</a>, insert <code>{}</code> and press \"<em>Save</em>\". Then copy the URL of the created store (e.g. <code>http://myjson.com/ltk51</code>) and insert it into the following input:";
                dialog.appendChild(instructionEl);
                var settingContainer = createSubSettingsContainer(KEY.syncPriceHistory, subSettings);
                dialog.appendChild(settingContainer);
            }
            subDialog.syncPriceHistory = syncPriceHistory;
        })(subDialog || (subDialog = {}));

        function createSubSettingDialog(key)
        {
            var settingId = getSettingId(key);
            var setting = CFG[key];
            var dialog = document.createElement('div');
            dialog.id = 'dialog-' + settingId;
            dialog.style.display = 'none';
            dialog.innerHTML = "<h2>" + setting.name + "</h2>";
            var name = toName(key);
            if (subDialog.hasOwnProperty(name))
            {
                subDialog[name](dialog);
            }
            else
            {
                console.warn('missing setting handler for "%s"', name);
                var todoEl = document.createElement('span');
                todoEl.textContent = 'TODO';
                dialog.appendChild(todoEl);
            }
            document.body.appendChild(dialog);
            return dialog;
        }

        function createSubSettingsContainer(parentKey, subSettings)
        {
            var settingsContainer = document.createElement('ul');
            settingsContainer.className = 'settings-container';

            function addCheckbox(listEl, subKey, id, setting)
            {
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = id;
                checkbox.name = id;
                checkbox.checked = getSub(parentKey, subKey);
                var label = document.createElement('label');
                label.htmlFor = id;
                label.innerHTML = setting.label;
                checkbox.addEventListener('change', function ()
                                          {
                    return setSub(parentKey, subKey, checkbox.checked);
                });
                listEl.appendChild(checkbox);
                listEl.appendChild(label);
            }

            function addSelectmenu(listEl, subKey, id, setting)
            {
                var select = document.createElement('select');
                select.id = id;
                select.name = id;
                var options = setting.options;
                var selectedIndex = getSub(parentKey, subKey);
                for (var i = 0; i < options.length; i++)
                {
                    var option = document.createElement('option');
                    option.value = options[i];
                    if (setting.label)
                    {
                        option.innerHTML = setting.label[i];
                    }
                    else
                    {
                        option.innerHTML = key2Name(options[i]);
                    }
                    option.selected = i == selectedIndex;
                    select.appendChild(option);
                }
                select.addEventListener('change', function ()
                                        {
                    return setSub(parentKey, subKey, select.selectedIndex);
                });
                listEl.appendChild(select);
            }
            function addRangeMenu(listEl, subKey, id, setting)
            {
                var range = setting.range;
                var input = document.createElement('input');
                input.type = 'range';
                input.min = range[0];
                input.max = range[1];
                input.name = subKey;
                input.placeholder = setting.label || '';
                input.value = getSub(parentKey, subKey);
                var subKeyId = subKey.replace(/\s/g, "+");
                var onChange = function ()
                {
                    if(document.getElementById(subKeyId+"ValueSpan")){
                        document.getElementById(subKeyId+"ValueSpan").textContent = input.value;
                    }
                    return setSub(parentKey, subKey, input.value);
                };
                input.addEventListener('change', onChange);
                listEl.appendChild(input);
            }

            function addInput(listEl, subKey, id, setting)
            {
                var input = document.createElement('input');
                input.type = 'text';
                input.placeholder = setting.label || '';
                input.value = getSub(parentKey, subKey);
                var onChange = function ()
                {
                    return setSub(parentKey, subKey, input.value);
                };
                input.addEventListener('click', onChange);
                input.addEventListener('change', onChange);
                input.addEventListener('keyup', onChange);
                listEl.appendChild(input);
            }
            var keyList = Object.keys(subSettings);
            var orderIndex = keyList.findIndex(function (k)
                                               {
                return subSettings[k].defaultValue instanceof Array;
            });
            var isSortable = orderIndex != -1;
            if (isSortable)
            {
                keyList = getSub(parentKey, keyList[orderIndex]);
            }
            for (var _i = 0, keyList_1 = keyList; _i < keyList_1.length; _i++)
            {
                var subKey = keyList_1[_i];
                var settingId = getSettingId(parentKey, subKey);
                var setting = subSettings[subKey];
                var listEl = document.createElement('li');
                listEl.classList.add('setting');
                if (isSortable)
                {
                    listEl.dataset.subKey = subKey;
                    var sortableIcon = document.createElement('span');
                    sortableIcon.className = 'ui-icon ui-icon-arrowthick-2-n-s handle';
                    listEl.appendChild(sortableIcon);
                }
                if (setting.options)
                {
                    addSelectmenu(listEl, subKey, settingId, setting);
                }
                else if(setting.range)
                {
                    addRangeMenu(listEl, subKey, settingId, setting);
                }
                else if (typeof setting.defaultValue === 'boolean')
                {
                    addCheckbox(listEl, subKey, settingId, setting);
                }
                else if (typeof setting.defaultValue === 'string')
                {
                    addInput(listEl, subKey, settingId, setting);
                }
                settingsContainer.appendChild(listEl);
            }
            return settingsContainer;
        }

        function initJQueryDialog(dialog)
        {
            var $dialog = win.$(dialog);
            $dialog.dialog(
                {
                    width: DIALOG_WIDTH + 'px'
                });
            $dialog.find('input[type="checkbox"]').checkboxradio()
                .next().children(':first-child').removeClass('ui-state-hover');
            $dialog.find('button:not(.sub)').button();
            $dialog.find('input:text').button()
                .addClass('ui-textfield')
                .off('mouseenter').off('mousedown').off('keydown');
            $dialog.find('select').selectmenu(
                {
                    change: function (event, ui)
                    {
                        var changeEvent = document.createEvent('HTMLEvents');
                        changeEvent.initEvent('change', false, true);
                        event.target.dispatchEvent(changeEvent);
                    }
                });
            $dialog.find('.sortable').sortable(
                {
                    handle: '.handle'
                    , update: function (event, ui)
                    {
                        var newOrder = [];
                        var children = event.target.children;
                        for (var i = 0; i < children.length; i++)
                        {
                            var child = children[i];
                            newOrder.push(child.dataset.subKey);
                        }
                        var updateEvent = new CustomEvent('sortupdate'
                                                          , {
                            detail: newOrder
                        });
                        event.target.dispatchEvent(updateEvent);
                    }
                });
            return $dialog;
        }

        function createSettingsContainer(settingList)
        {
            var settingsContainer = document.createElement('ul');
            settingsContainer.className = 'settings-container';

            function addOpenDialogClickListener(el, dialog)
            {
                el.addEventListener('click', function (event)
                                    {
                    initJQueryDialog(dialog);
                    event.stopPropagation();
                    event.preventDefault();
                });
            }

            function addChangeListener(key, checkbox)
            {
                checkbox.addEventListener('change', function ()
                                          {
                    set(key, checkbox.checked);
                });
            }
            for (var _i = 0, settingList_1 = settingList; _i < settingList_1.length; _i++)
            {
                var key = settingList_1[_i];
                var settingId = getSettingId(key);
                var setting = CFG[key];
                var index = settings2Init.indexOf(key.toString());
                if (index != -1)
                {
                    settings2Init.splice(index, 1);
                }
                var listEl = document.createElement('li');
                listEl.classList.add('setting');
                if (setting.requiresReload)
                {
                    listEl.classList.add('reload');
                }
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = settingId;
                checkbox.checked = get(key);
                var label = document.createElement('label');
                label.htmlFor = settingId;
                label.textContent = setting.name;
                addChangeListener(key, checkbox);
                listEl.appendChild(checkbox);
                listEl.appendChild(label);
                if (setting.sub)
                {
                    var moreBtn = document.createElement('button');
                    moreBtn.className = 'sub';
                    moreBtn.innerHTML = "<img src=\"images/icons/gearOff.gif\" class=\"image-icon-20\" />";
                    listEl.appendChild(moreBtn);
                    var dialog = createSubSettingDialog(key);
                    addOpenDialogClickListener(moreBtn, dialog);
                }
                settingsContainer.appendChild(listEl);
                var tooltipEl = ensureTooltip(settingId, listEl);
                tooltipEl.innerHTML = setting.description;
                if (setting.requiresReload)
                {
                    tooltipEl.innerHTML += "<span style=\"color: hsla(20, 100%, 50%, 1); font-size: .9rem; display: block; margin-top: 0.5rem;\">You have to reload the browser tab to apply changes to this setting.</span>";
                }
            }
            return settingsContainer;
        }

        function initCraftingSettings()
        {
            var craftingItems = document.getElementById('tab-sub-container-crafting');
            if (!craftingItems)
            {
                return;
            }
            var br = craftingItems.nextElementSibling;
            var after = br.nextElementSibling;
            var parent = after.parentElement;
            var settingList = [KEY.hideCraftingRecipes, KEY.hideUselessItems];
            var settingsContainer = createSettingsContainer(settingList);
            parent.insertBefore(settingsContainer, after);
        }

        function initMuteDialog(settingsContainer)
        {
            // muted people dialog
            var dialog = document.createElement('div');
            dialog.id = 'dialog-chat-muted-people';
            dialog.style.display = 'none';
            dialog.innerHTML = "<h2>Muted people</h2>";
            var input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'username';
            dialog.appendChild(input);
            var addBtn = document.createElement('button');
            addBtn.textContent = '+';
            dialog.appendChild(addBtn);
            var listEl = document.createElement('ul');
            listEl.className = 'settings-container list';
            var username2Item = {};
            var username2Btn = {};

            function removeListener(event)
            {
                var target = event.target;
                var username = target.dataset.username || '';
                var index = win.mutedPeople.indexOf(username);
                if (index !== -1)
                {
                    win.mutedPeople.splice(index, 1);
                }
            }

            function add2List(username)
            {
                var item = document.createElement('li');
                item.innerHTML = "<span class=\"content\">" + username + "</span>";
                var removeBtn = document.createElement('button');
                removeBtn.dataset.username = username;
                removeBtn.textContent = '-';
                win.$(removeBtn).button();
                removeBtn.addEventListener('click', removeListener);
                username2Btn[username] = removeBtn;
                item.appendChild(removeBtn);
                username2Item[username] = item;
                listEl.appendChild(item);
            }
            var _push = win.mutedPeople.push;
            win.mutedPeople.push = function ()
            {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++)
                {
                    items[_i] = arguments[_i];
                }
                items.forEach(function (username)
                              {
                    return add2List(username);
                });
                return _push.call.apply(_push, [win.mutedPeople].concat(items));
            };
            var _splice = win.mutedPeople.splice;
            win.mutedPeople.splice = function (start, deleteCount)
            {
                var items = [];
                for (var _i = 2; _i < arguments.length; _i++)
                {
                    items[_i - 2] = arguments[_i];
                }
                for (var i = 0; i < deleteCount; i++)
                {
                    var username = win.mutedPeople[start + i];
                    var item = username2Item[username];
                    delete username2Item[username];
                    listEl.removeChild(item);
                    var btn = username2Btn[username];
                    delete username2Btn[username];
                    btn.removeEventListener('click', removeListener);
                }
                items.forEach(function (username)
                              {
                    return add2List(username);
                });
                return _splice.call.apply(_splice, [win.mutedPeople, start, deleteCount].concat(items));
            };
            dialog.appendChild(listEl);
            addBtn.addEventListener('click', function ()
                                    {
                win.mutedPeople.push(input.value);
                input.value = '';
            });
            document.body.appendChild(dialog);
            var listItem = document.createElement('li');
            listItem.classList.add('setting');
            var dialogBtn = document.createElement('button');
            dialogBtn.innerHTML = "List of muted people";
            dialogBtn.addEventListener('click', function ()
                                       {
                initJQueryDialog(dialog);
            });
            listItem.appendChild(dialogBtn);
            settingsContainer.appendChild(listItem);
        }

        function initKeywordDialog(settingsContainer)
        {
            // keyword dialog
            var dialog = document.createElement('div');
            dialog.id = 'dialog-chat-keyword-list';
            dialog.style.display = 'none';
            dialog.innerHTML = "<h2>Keywords</h2>";
            var input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'keyword';
            dialog.appendChild(input);
            var addBtn = document.createElement('button');
            addBtn.textContent = '+';
            dialog.appendChild(addBtn);
            var listEl = document.createElement('ul');
            listEl.className = 'settings-container list';

            function add2List(keyword)
            {
                var item = document.createElement('li');
                item.innerHTML = "<span class=\"content\">" + keyword + "</span>";
                var removeBtn = document.createElement('button');
                removeBtn.textContent = '-';
                win.$(removeBtn).button();
                var remove = function ()
                {
                    if (chat.removeKeyword(keyword))
                    {
                        listEl.removeChild(item);
                        removeBtn.removeEventListener('click', remove);
                    }
                };
                removeBtn.addEventListener('click', remove);
                item.appendChild(removeBtn);
                listEl.appendChild(item);
            }
            // add all keywords
            chat.keywordList.forEach(function (keyword)
                                     {
                return add2List(keyword);
            });
            dialog.appendChild(listEl);
            addBtn.addEventListener('click', function ()
                                    {
                var keyword = input.value;
                if (chat.addKeyword(keyword))
                {
                    add2List(keyword);
                    input.value = '';
                }
            });
            document.body.appendChild(dialog);
            var listItem = document.createElement('li');
            listItem.classList.add('setting');
            var dialogBtn = document.createElement('button');
            dialogBtn.innerHTML = "Manage list of keywords";
            dialogBtn.addEventListener('click', function ()
                                       {
                initJQueryDialog(dialog);
            });
            listItem.appendChild(dialogBtn);
            settingsContainer.appendChild(listItem);
        }

        function initChatSettings()
        {
            var controlDiv = document.querySelector('#div-chat > div:first-child');
            if (!controlDiv)
            {
                return;
            }
            var btn = document.createElement('button');
            btn.textContent = 'Chat Settings';
            controlDiv.appendChild(btn);
            var dialog = document.createElement('div');
            dialog.id = 'dialog-chat-settings';
            dialog.style.display = 'none';
            dialog.innerHTML = "<h2>Chat Settings</h2>";
            var settingList = [KEY.useNewChat, KEY.colorizeChat, KEY.intelligentScrolling, KEY.showTimestamps, KEY.showIcons, KEY.showTags, KEY.enableSpamDetection];
            var settingsContainer = createSettingsContainer(settingList);
            initMuteDialog(settingsContainer);
            initKeywordDialog(settingsContainer);
            dialog.appendChild(settingsContainer);
            document.body.appendChild(dialog);
            btn.addEventListener('click', function ()
                                 {
                initJQueryDialog(dialog);
            });
        }

        function init()
        {
            initProxies();
            initSettingsStyle();
            initCraftingSettings();
            initChatSettings();
            initSettingTable();
        }
        settings.init = init;
        var _a;
    })(settings || (settings = {}));
    /**
 * Code from https://github.com/davidmerfield/randomColor
 */
    var colorGenerator;
    (function (colorGenerator)
     {
        // seed to get repeatable colors
        var seed = null;
        var COLOR_NOT_FOUND = {
            hueRange: []
            , lowerBounds: []
            , saturationRange: []
            , brightnessRange: []
        };
        var COLOR_BOUNDS = {
            'monochrome':
            {
                hueRange: []
                , lowerBounds: [
                    [0, 0]
                    , [100, 0]
                ]
            }
            , 'red':
            {
                hueRange: [-26, 18]
                , lowerBounds: [
                    [20, 100]
                    , [30, 92]
                    , [40, 89]
                    , [50, 85]
                    , [60, 78]
                    , [70, 70]
                    , [80, 60]
                    , [90, 55]
                    , [100, 50]
                ]
            }
            , 'orange':
            {
                hueRange: [19, 46]
                , lowerBounds: [
                    [20, 100]
                    , [30, 93]
                    , [40, 88]
                    , [50, 86]
                    , [60, 85]
                    , [70, 70]
                    , [100, 70]
                ]
            }
            , 'yellow':
            {
                hueRange: [47, 62]
                , lowerBounds: [
                    [25, 100]
                    , [40, 94]
                    , [50, 89]
                    , [60, 86]
                    , [70, 84]
                    , [80, 82]
                    , [90, 80]
                    , [100, 75]
                ]
            }
            , 'green':
            {
                hueRange: [63, 178]
                , lowerBounds: [
                    [30, 100]
                    , [40, 90]
                    , [50, 85]
                    , [60, 81]
                    , [70, 74]
                    , [80, 64]
                    , [90, 50]
                    , [100, 40]
                ]
            }
            , 'blue':
            {
                hueRange: [179, 257]
                , lowerBounds: [
                    [20, 100]
                    , [30, 86]
                    , [40, 80]
                    , [50, 74]
                    , [60, 60]
                    , [70, 52]
                    , [80, 44]
                    , [90, 39]
                    , [100, 35]
                ]
            }
            , 'purple':
            {
                hueRange: [258, 282]
                , lowerBounds: [
                    [20, 100]
                    , [30, 87]
                    , [40, 79]
                    , [50, 70]
                    , [60, 65]
                    , [70, 59]
                    , [80, 52]
                    , [90, 45]
                    , [100, 42]
                ]
            }
            , 'pink':
            {
                hueRange: [283, 334]
                , lowerBounds: [
                    [20, 100]
                    , [30, 90]
                    , [40, 86]
                    , [60, 84]
                    , [80, 80]
                    , [90, 75]
                    , [100, 73]
                ]
            }
        };
        // shared color dictionary
        var colorDictionary = {};

        function defineColor(name, hueRange, lowerBounds)
        {
            var _a = lowerBounds[0]
            , sMin = _a[0]
            , bMax = _a[1];
            var _b = lowerBounds[lowerBounds.length - 1]
            , sMax = _b[0]
            , bMin = _b[1];
            colorDictionary[name] = {
                hueRange: hueRange
                , lowerBounds: lowerBounds
                , saturationRange: [sMin, sMax]
                , brightnessRange: [bMin, bMax]
            };
        }

        function loadColorBounds()
        {
            for (var name_1 in COLOR_BOUNDS)
            {
                defineColor(name_1, COLOR_BOUNDS[name_1].hueRange, COLOR_BOUNDS[name_1].lowerBounds);
            }
        }

        function randomWithin(min, max)
        {
            if (min === void 0)
            {
                min = 0;
            }
            if (max === void 0)
            {
                max = 0;
            }
            if (seed === null)
            {
                return Math.floor(min + Math.random() * (max + 1 - min));
            }
            else
            {
                // seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
                seed = (seed * 9301 + 49297) % 233280;
                var rnd = seed / 233280.0;
                return Math.floor(min + rnd * (max - min));
            }
        }

        function getColorInfo(hue)
        {
            // maps red colors to make picking hue easier
            if (hue >= 334 && hue <= 360)
            {
                hue -= 360;
            }
            for (var colorName in colorDictionary)
            {
                var color = colorDictionary[colorName];
                if (color.hueRange.length > 0
                    && hue >= color.hueRange[0]
                    && hue <= color.hueRange[1])
                {
                    return colorDictionary[colorName];
                }
            }
            return COLOR_NOT_FOUND;
        }

        function getHueRange(colorInput)
        {
            var number = typeof colorInput === 'undefined' ? Number.NaN : colorInput;
            if (typeof number === 'string')
            {
                number = parseInt(number, 10);
            }
            if (colorInput && isNaN(number) && colorDictionary.hasOwnProperty(colorInput))
            {
                var color = colorDictionary[colorInput];
                if (color.hueRange.length > 0)
                {
                    return color.hueRange;
                }
            }
            else if (!isNaN(number) && number < 360 && number > 0)
            {
                return [number, number];
            }
            return [0, 360];
        }

        function pickHue(options)
        {
            var hueRange = getHueRange(options.hue);
            var hue = randomWithin(hueRange[0], hueRange[1]);
            // instead of storing red as two seperate ranges, we group them, using negative numbers
            if (hue < 0)
            {
                return 360 + hue;
            }
            return hue;
        }

        function getSaturationRange(hue)
        {
            return getColorInfo(hue).saturationRange;
        }

        function pickSaturation(hue, options)
        {
            if (options.luminosity === 'random')
            {
                return randomWithin(0, 100);
            }
            if (options.hue === 'monochrome')
            {
                return 0;
            }
            var _a = getSaturationRange(hue)
            , sMin = _a[0]
            , sMax = _a[1];
            switch (options.luminosity)
            {
                case 'bright':
                    sMin = 55;
                    break;
                case 'dark':
                    sMin = sMax - 10;
                    break;
                case 'light':
                    sMax = 55;
                    break;
            }
            return randomWithin(sMin, sMax);
        }

        function getMinimumBrightness(H, S)
        {
            var lowerBounds = getColorInfo(H).lowerBounds;
            for (var i = 0; i < lowerBounds.length - 1; i++)
            {
                var _a = lowerBounds[i]
                , s1 = _a[0]
                , v1 = _a[1];
                var _b = lowerBounds[i + 1]
                , s2 = _b[0]
                , v2 = _b[1];
                if (S >= s1 && S <= s2)
                {
                    var m = (v2 - v1) / (s2 - s1);
                    var b = v1 - m * s1;
                    return m * S + b;
                }
            }
            return 0;
        }

        function pickBrightness(H, S, options)
        {
            var bMin = getMinimumBrightness(H, S);
            var bMax = 100;
            switch (options.luminosity)
            {
                case 'dark':
                    bMax = bMin + 20;
                    break;
                case 'light':
                    bMin = (bMax + bMin) / 2;
                    break;
                case 'random':
                    bMin = 0;
                    bMax = 100;
                    break;
            }
            return randomWithin(bMin, bMax);
        }
        var HSVColor = (function ()
                        {
            function HSVColor(H, S, V)
            {
                this.H = H;
                this.S = S;
                this.V = V;
            }
            HSVColor.fromHSVArray = function (hsv)
            {
                return new HSVColor(hsv[0], hsv[1], hsv[2]);
            };
            HSVColor.prototype.toHex = function ()
            {
                var rgb = this.toRGB();
                return '#' + this.componentToHex(rgb[0]) + this.componentToHex(rgb[1]) + this.componentToHex(rgb[2]);
            };
            HSVColor.prototype.toHSL = function ()
            {
                var h = this.H;
                var s = this.S / 100;
                var v = this.V / 100;
                var k = (2 - s) * v;
                return [
                    h
                    , Math.round(s * v / (k < 1 ? k : 2 - k) * 10e3) / 100
                    , k / 2 * 100
                ];
            };
            HSVColor.prototype.toHSLString = function (alpha)
            {
                var hsl = this.toHSL();
                if (alpha !== undefined)
                {
                    return "hsla(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%, " + alpha + ")";
                }
                else
                {
                    return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";
                }
            };
            HSVColor.prototype.toRGB = function ()
            {
                // this doesn't work for the values of 0 and 360 here's the hacky fix
                var h = Math.min(Math.max(this.H, 1), 359);
                // Rebase the h,s,v values
                h = h / 360;
                var s = this.S / 100;
                var v = this.V / 100;
                var h_i = Math.floor(h * 6);
                var f = h * 6 - h_i;
                var p = v * (1 - s);
                var q = v * (1 - f * s);
                var t = v * (1 - (1 - f) * s);
                var r = 256;
                var g = 256;
                var b = 256;
                switch (h_i)
                {
                    case 0:
                        r = v;
                        g = t;
                        b = p;
                        break;
                    case 1:
                        r = q;
                        g = v;
                        b = p;
                        break;
                    case 2:
                        r = p;
                        g = v;
                        b = t;
                        break;
                    case 3:
                        r = p;
                        g = q;
                        b = v;
                        break;
                    case 4:
                        r = t;
                        g = p;
                        b = v;
                        break;
                    case 5:
                        r = v;
                        g = p;
                        b = q;
                        break;
                }
                return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
            };
            HSVColor.prototype.toRGBString = function (alpha)
            {
                var rgb = this.toRGB();
                if (alpha !== undefined)
                {
                    return "rgba(" + rgb.join(', ') + ", " + alpha + ")";
                }
                else
                {
                    return "rgb(" + rgb.join(', ') + ")";
                }
            };
            HSVColor.prototype.componentToHex = function (c)
            {
                var hex = c.toString(16);
                return hex.length == 1 ? '0' + hex : hex;
            };
            return HSVColor;
        }());
        colorGenerator.HSVColor = HSVColor;

        function setFormat(hsv, options)
        {
            var color = HSVColor.fromHSVArray(hsv);
            switch (options.format)
            {
                case 'object':
                    return color;
                case 'hsvArray':
                    return hsv;
                case 'hslArray':
                    return color.toHSL();
                case 'hsl':
                    return color.toHSLString();
                case 'hsla':
                    return color.toHSLString(options.alpha || Math.random());
                case 'rgbArray':
                    return color.toRGB();
                case 'rgb':
                    return color.toRGBString();
                case 'rgba':
                    return color.toRGBString(options.alpha || Math.random());
                case 'hex':
                default:
                    return color.toHex();
            }
        }

        function generateColor(options)
        {
            // pick a hue (H)
            var H = pickHue(options);
            // use H to determine saturation (S)
            var S = pickSaturation(H, options);
            // use S and H to determine brightness (B)
            var B = pickBrightness(H, S, options);
            // return the HSB color in the desired format
            return setFormat([H, S, B], options);
        }

        function getRandom(options)
        {
            options = options ||
                {};
            seed = options.seed == null ? null : options.seed;
            // check if we need to generate multiple colors
            if (options.count !== null && options.count !== undefined)
            {
                var colors = [];
                while (options.count > colors.length)
                {
                    // Since we're generating multiple colors, the seed has to be incrememented.
                    // Otherwise we'd just generate the same color each time...
                    if (seed !== null)
                    {
                        seed += 1;
                    }
                    colors.push(generateColor(options));
                }
                return colors;
            }
            return generateColor(options);
        }
        colorGenerator.getRandom = getRandom;
        var ColorInterval = (function ()
                             {
            function ColorInterval(start, end)
            {
                this.start = start;
                this.end = end;
                this.left = null;
                this.right = null;
                this.value = null;
            }
            ColorInterval.prototype.getNextValue = function ()
            {
                if (this.value == null)
                {
                    this.value = (this.start + this.end) / 2;
                    return this.value;
                }
                if (this.left == null)
                {
                    this.left = new ColorInterval(this.start, this.value);
                    return this.left.getNextValue();
                }
                if (this.right == null)
                {
                    this.right = new ColorInterval(this.value, this.end);
                    return this.right.getNextValue();
                }
                if (this.left.getHeight() <= this.right.getHeight())
                {
                    return this.left.getNextValue();
                }
                else
                {
                    return this.right.getNextValue();
                }
            };
            ColorInterval.prototype.getHeight = function ()
            {
                return 1
                    + (this.left == null ? 0 : this.left.getHeight())
                    + (this.right == null ? 0 : this.right.getHeight());
            };
            return ColorInterval;
        }());
        colorGenerator.ColorInterval = ColorInterval;
        var defaultRootInterval = new ColorInterval(0, 360);

        function getEquallyDistributed(rootInterval)
        {
            if (rootInterval === void 0)
            {
                rootInterval = defaultRootInterval;
            }
            return 'hsl(' + rootInterval.getNextValue() + ', 100%, 80%)';
        }
        colorGenerator.getEquallyDistributed = getEquallyDistributed;
        var Color = (function ()
                     {
            function Color(r, g, b)
            {
                this.r = r;
                this.g = g;
                this.b = b;
            }
            Color.fromHex = function (hex)
            {
                return new Color(parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16));
            };
            Color.fromRgb = function (rgb)
            {
                var match = rgb.match(this.rgbRegex);
                return new Color(parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10));
            };
            Color.fromString = function (str)
            {
                if (this.hexRegex.test(str))
                {
                    return this.fromHex(str);
                }
                else if (this.rgbRegex.test(str))
                {
                    return this.fromRgb(str);
                }
                else
                {
                    throw new Error('Unexpected color format: ' + str);
                }
            };
            Color.prototype.toString = function (hex)
            {
                if (hex === void 0)
                {
                    hex = true;
                }
                return '#' + this.toHex(this.r) + this.toHex(this.g) + this.toHex(this.b);
            };
            Color.prototype.toHex = function (x)
            {
                var xStr = x.toString(16);
                return (xStr.length == 1 ? '0' : '') + xStr;
            };
            Color.hexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i;
            Color.rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
            return Color;
        }());

        function ratioColor(color1, color2, ratio)
        {
            var color = new Color(Math.ceil(color1.r * (1 - ratio) + color2.r * ratio), Math.ceil(color1.g * (1 - ratio) + color2.g * ratio), Math.ceil(color1.b * (1 - ratio) + color2.b * ratio));
            return color.toString();
        }

        function getColorTransition(value, colorStrings)
        {
            var smallerValue = -1;
            var biggerValue = Number.MAX_SAFE_INTEGER;
            var colors = {};
            for (var v in colorStrings)
            {
                var vNum = Number(v);
                if (vNum === value)
                {
                    return colorStrings[v];
                }
                else if (vNum < value)
                {
                    smallerValue = Math.max(smallerValue, vNum);
                }
                else
                {
                    biggerValue = Math.min(biggerValue, vNum);
                }
                colors[v] = Color.fromString(colorStrings[v]);
            }
            if (smallerValue === -1)
            {
                return colorStrings[biggerValue];
            }
            if (biggerValue === Number.MAX_SAFE_INTEGER)
            {
                return colorStrings[smallerValue];
            }
            var ratio = (value - smallerValue) / (biggerValue - smallerValue);
            return ratioColor(colors[smallerValue], colors[biggerValue], ratio);
        }
        colorGenerator.getColorTransition = getColorTransition;
        // populate the color dictionary
        loadColorBounds();
    })(colorGenerator || (colorGenerator = {}));

    /**
 * provides icons
 */
    var icons;
    (function (icons)
     {
        icons.CHART_LINE = 'M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z';
        icons.WIKIA = '<defs><linearGradient id="a" x1="0%" x2="63.85%" y1="100%" y2="32.54%"><stop stop-color="#94D11F" offset="0%"/><stop stop-color="#09D3BF" offset="100%"/></linearGradient></defs><path fill="url(#a)" fill-rule="evenodd" d="M10.18 16.8c0 .2-.05.46-.26.67l-.8.7-7.38-6.95v-2.7l8.1 7.62c.12.12.33.36.33.66zm11.2-8.1v2.53l-9.15 8.86a.67.67 0 0 1-.5.2.73.73 0 0 1-.5-.2l-.85-.77 11-10.62zm-6.97 4.5l-2.53 2.43-8.04-7.67a2 2 0 0 1 0-2.9l2.53-2.43 8.04 7.67c.84.8.84 2.1 0 2.9zm-1.5-6.68L15.56 4c.4-.4.94-.6 1.52-.6.57 0 1.1.2 1.52.6l2.72 2.6-4.16 3.98-1.52-1.45-2.73-2.6zm10.18-.4l-6-5.8L17 .2l-.14.12-5.22 5.03L6.96.87l-.6-.48-.12-.1-.1.1-6.1 5.7-.04.06v5.76l.05.05 11.4 10.87.12.1.12-.1 11.37-10.87.05-.05V6.17l-.05-.05z"/>';

        function getSvgAsUrl(svg)
        {
            return "url('data:image/svg+xml;base64," + btoa(svg) + "')";
        }
        icons.getSvgAsUrl = getSvgAsUrl;

        function wrapCodeWithSvg(code, viewBox, width, height)
        {
            return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + width + "\" height=\"" + height + "\" viewBox=\"" + viewBox + "\">" + code + "</svg>";
        }
        icons.wrapCodeWithSvg = wrapCodeWithSvg;

        function getMd(pathDots, color, width, height)
        {
            if (color === void 0)
            {
                color = 'black';
            }
            if (width === void 0)
            {
                width = '30';
            }
            if (height === void 0)
            {
                height = '30';
            }
            return getSvgAsUrl(wrapCodeWithSvg("<path fill=\"" + color + "\" d=\"" + pathDots + "\" />", '0 0 24 24', width, height));
        }
        icons.getMd = getMd;
    })(icons || (icons = {}));

    /**
 * notifications
 */
    var notifications;
    (function (notifications)
     {
        notifications.name = 'notifications';

        function event(title, options)
        {
            if ((!options || options.whenActive !== true)
                && !document.hidden && document.hasFocus()
                && settings.getSub(settings.KEY.showNotifications, 'showType') !== 1)
            {
                return;
            }
            if (!settings.get(settings.KEY.showNotifications))
            {
                // notifications disabled: return stub notification
                return Promise.resolve(
                    {
                        close: function () {}
                    });
            }
            if (!("Notification" in win))
            {
                return Promise.reject('Your browser does not support notifications.');
            }
            return Notification.requestPermission()
                .then(function (permission)
                      {
                if (permission === 'granted')
                {
                    var n_1 = new Notification(title, options);
                    n_1.onclick = function (event)
                    {
                        if (options && options.autoFocus !== false)
                        {
                            win.focus();
                        }
                        if (options && options.autoClose !== false)
                        {
                            n_1.close();
                        }
                        if (options && options.onclick)
                        {
                            options.onclick(n_1, event);
                        }
                    };
                    return Promise.resolve(n_1);
                }
                else
                {
                    return Promise.reject('Notification permission denied');
                }
            });
        }
        notifications.event = event;

        function requestPermission()
        {
            if (settings.get(settings.KEY.showNotifications))
            {
                Notification.requestPermission();
            }
        }

        function init()
        {
            requestPermission();
            settings.observe(settings.KEY.showNotifications, function ()
                             {
                return requestPermission();
            });
        }
        notifications.init = init;
    })(notifications || (notifications = {}));

    /**
 * process commands
 */
    var commands;
    (function (commands)
     {
        var XP_GAIN_KEY = 'xpGain';
        var MAX_XP_GAIN_HISTORY_LENGTH = 100;
        var IMAGE2SKILL = {
            // mining = #cc0000
            'icons/pickaxe': 'mining'
            // crafting = #cc0000
            , 'icons/anvil': 'crafting'
            // woodcutting = cyan
            , 'icons/woodcutting': 'woodcutting'
            // farming = green
            , 'icons/watering-can': 'farming'
            // brewing = #800080
            , 'icons/brewing': 'brewing'
            , 'vialOfWater': 'brewing'
            , 'largeVialOfWater': 'brewing'
            , 'hugeVialOfWater': 'brewing'
            // combat = lime
            , 'icons/combat': 'combat'
            // magic = blue
            , 'icons/wizardhat': 'magic'
            // fishing = blue
            , 'tuna': 'fishing'
            // cooking = yellow
            , 'icons/cooking': 'cooking'
        };
        var xpGainHistory = store.has(XP_GAIN_KEY) ? store.get(XP_GAIN_KEY) :
        {};
        addStyle("\n.scroller.xp\n{\n\tfont-size: 18pt;\n\tposition: absolute;\n\ttext-align: center;\n}\n\t");

        function minutes2String(data)
        {
            return data.replace(/Your account has been running for: (\d+) minutes./, function (wholeMatch, minutes)
                                {
                return 'Your account has been running for ' + format.min2Str(minutes) + '.';
            });
        }
        var LOOT_MSG_PREFIX = 'SHOW_LOOT_DIAG=';

        function processLoot(data)
        {
            if (!/^SM=Your boat found nothing\.$|^SHOW_LOOT_DIAG=/.test(data))
            {
                return false;
            }
            var loot = {
                type: 'loot'
                , title: ''
                , itemList: []
            };
            if (data.startsWith('SM='))
            {
                loot.title = 'Boat';
                loot.emptyText = 'Your boat found nothing.';
            }
            else if (data.startsWith(LOOT_MSG_PREFIX))
            {
                var split = data.substr(LOOT_MSG_PREFIX.length).split('~');
                loot.title = split[0];
                for (var i = 1; i < split.length; i += 2)
                {
                    loot.itemList.push(
                        {
                            icon: split[i]
                            , text: split[i + 1]
                        });
                }
            }
            log.add(loot);
            return true;
        }
        var XP_GAIN_REGEX = /^ST=([^~]+)\.png~([^~]+)~\+(\d+)\s*xp(.*)$/;
        var animationQueue = {};

        function queueXpAnimation(skill, cell, color, xpAmount, extraXp)
        {
            if (!settings.get(settings.KEY.newXpAnimation))
            {
                return;
            }
            animationQueue[skill] = animationQueue[skill] || [];
            animationQueue[skill].push(
                {
                    cell: cell
                    , color: color
                    , xpAmount: xpAmount
                    , extraXp: extraXp
                });
            if (animationQueue[skill].length === 1)
            {
                nextAnimation(skill);
            }
        }

        function nextAnimation(skill)
        {
            var entry = animationQueue[skill][0];
            if (!entry || !settings.get(settings.KEY.newXpAnimation))
            {
                return;
            }
            var cell = entry.cell
            , color = entry.color
            , xpAmount = entry.xpAmount
            , extraXp = entry.extraXp;
            var rect = cell.getBoundingClientRect();
            var extraXpStr = extraXp > 0 ? " (+" + extraXp + ")" : '';
            var $el = win.$("<div class=\"scroller xp\" style=\"color: " + color + "; left: " + (rect.left + 50) + "px; top: " + (document.body.scrollTop + rect.top) + "px; width: " + (rect.width - 2 * 20 - 50) + "px;\">+" + format.number(xpAmount) + extraXpStr + "</div>")
            .appendTo('body');
            // ensure the existence of $el, so the complete-function can be called instantly if the window is hidden
            $el
                .animate(
                {
                    top: '-=15px'
                }
                , {
                    duration: 1500
                    , easing: 'easeOutQuad'
                    , complete: function ()
                    {
                        animationQueue[skill].shift();
                        nextAnimation(skill);
                    }
                })
                .fadeOut(
                {
                    duration: 2500
                    , queue: false
                    , complete: function ()
                    {
                        return $el.remove();
                    }
                });
        }

        function processXpGain(data)
        {
            var match = data.match(XP_GAIN_REGEX);
            if (!match)
            {
                return false;
            }
            var icon = match[1];
            var skill = IMAGE2SKILL[icon] || '';
            var color = match[2];
            var xpAmount = Number(match[3]);
            var extra = match[4];
            var cell = document.getElementById('top-bar-level-td-' + skill);
            if (!cell)
            {
                console.debug('match (no cell found):', match);
                return false;
            }
            var entry = {
                time: now()
                , amount: xpAmount
            };
            if (match[4])
            {
                entry.extra = match[4];
            }
            if (skill == 'fishing')
            {
                log.processFishingXpChange(xpAmount);
            }
            var extraXp = 0;
            if (extra && settings.get(settings.KEY.newXpAnimation))
            {
                var extraMatch = extra.match(/^\s*\(<img[^>]+src=(['"])images\/([^']+)\.png\1[^>]+>\s*(.+)\)$/);
                var extraXpMatch = extra.match(/^\s*\(\+(\d+)\s*xp\)\s*$/);
                if (extraMatch)
                {
                    var icon_1 = extraMatch[2];
                    var text = extraMatch[3];
                    if (icon_1 == 'brewingKit')
                    {
                        text = '+' + text;
                    }
                    win.scrollText(icon_1, color, text);
                }
                else if (extraXpMatch)
                {
                    extraXp = Number(extraXpMatch[1]);
                }
                else
                {
                    win.scrollText('none', color, extra);
                }
            }
            // save the xp event
            var list = xpGainHistory[skill] || [];
            list.push(entry);
            xpGainHistory[skill] = list.slice(-MAX_XP_GAIN_HISTORY_LENGTH);
            store.set(XP_GAIN_KEY, xpGainHistory);
            if (settings.get(settings.KEY.newXpAnimation))
            {
                queueXpAnimation(skill, cell, color, xpAmount, extraXp);
            }
            return true;
        }

        function processLevelUp(data)
        {
            if (!data.startsWith('LVL_UP='))
            {
                return false;
            }
            var skill = data.substr('LVL_UP='.length);
            var xp = getGameValue(skill + 'Xp');
            var oldLvl = win.getLevel(xp);
            log.add(
                {
                    type: 'lvlup'
                    , skill: skill
                    , newLevel: oldLvl + 1
                });
            return true;
        }

        function processCombat(data)
        {
            //var match = data.match(/^STHS=([^~]+)~([^~]+)~([^~]+)~img-(.+)~(melee|heal)$/);
            if (data.split("=")[0]!="STHS")
            {
                return false;
            }
            let splitData = data.split("~");
            //console.log(splitData);
            // keep track of different battles and add the data to the current battle
            var number = splitData[3];
            if (!/\D/.test(number))
            {
                number = Number(number);
            }
            let type;
            if(splitData[1] == "red" && splitData[2] == "#4d0000"){
                type = "melee";
            }else if(splitData[1] == "green" && splitData[2] == "lime"){
                type = "heal";
            }
            log.add(
                {
                    type: 'combat'
                    , what: type
                    , who: splitData[4].split("-")[1]
                    , text: number
                });
            return true;
        }

        function processEnergy(data)
        {
            var match = data.match(/^ST=steak\.png~orange~\+([\d',]+)$/);
            if (!match)
            {
                return false;
            }
            log.add(
                {
                    type: 'energy'
                    , energy: Number(match[1].replace(/\D/g, ''))
                });
            return true;
        }

        function processHeat(data)
        {
            var match = data.match(/^ST=icons\/fire\.png~red~\+([\d',]+)$/);
            if (!match)
            {
                return false;
            }
            log.add(
                {
                    type: 'heat'
                    , heat: Number(match[1].replace(/\D/g, ''))
                });
            return true;
        }

        function processMarket(data)
        {
            if (data === 'ST=icons/shop.png~orange~Item Purchased')
            {
                log.add(
                    {
                        type: 'market'
                    });
                return true;
            }
            var match = data.match(/^ST=coins\.png~yellow~\+([\d',]+)$/);
            if (!match)
            {
                return false;
            }
            var coins = Number(match[1].replace(/\D/g, ''));
            log.add(
                {
                    type: 'market'
                    , coins: coins
                });
            return true;
        }

        function processBonemeal(data)
        {
            var match = data.match(/^ST=filledBonemealBin\.png~white~\+([\d',]+)$/);
            if (!match)
            {
                return false;
            }
            var bonemeal = Number(match[1].replace(/\D/g, ''));
            log.add(
                {
                    type: 'bonemeal'
                    , bonemeal: bonemeal
                });
            return true;
        }

        function processCrafting(data)
        {
            if (data === 'ST=none~#806600~Item Crafted')
            {
                log.add(
                    {
                        type: 'crafting'
                    });
                return true;
            }
            return false;
        }

        function processStardust(data)
        {
            var match = data.match(/^ST=(?:icons\/)?stardust\.png~yellow~\+([\d',]+)$/);
            if (!match)
            {
                return false;
            }
            var stardust = Number(match[1].replace(/\D/g, ''));
            log.add(
                {
                    type: 'stardust'
                    , stardust: stardust
                });
            return true;
        }
        var RUNNING_ACCOUNT_STR = 'Your account has been running for:';

        function formatData(data)
        {
            if (data.startsWith('STE=')
                || data.startsWith('SM=')
                || data.startsWith('ST=')
                || data.startsWith('SHOW_LOOT_DIAG='))
            {
                if (data.indexOf(RUNNING_ACCOUNT_STR) != -1)
                {
                    data = minutes2String(data);
                }
                data = format.numbersInText(data);
            }
            return data;
        }
        commands.formatData = formatData;

        function process(data)
        {
            // prepare for logging events in an activity log
            if (processLoot(data))
            {
                return;
            }
            else if (processXpGain(data))
            {
                // return undefined to let the original function be called
                return settings.get(settings.KEY.newXpAnimation) ? null : void 0;
            }
            else if (processLevelUp(data)
                     || processCombat(data)
                     || processEnergy(data)
                     || processHeat(data)
                     || processMarket(data)
                     || processBonemeal(data)
                     || processCrafting(data)
                     || processStardust(data))
            {
                return;
            }
            else if (data.startsWith('SM='))
            {
                log.add(
                    {
                        data: minutes2String(data.replace(/^[^=]+=/, ''))
                    });
            }
            else if (data.startsWith('STHS=') || data.startsWith('STE=') || data.startsWith('ST='))
            {}
            // notifications for this kind of message: "SM=An update has been scheduled for today."
            if (data.startsWith('SM='))
            {
                if (settings.getSub(settings.KEY.showNotifications, 'serverMsg'))
                {
                    var msg = data.substr(3)
                    .replace(/<br\s*\/?>/g, '\n')
                    .replace(/<img src='images\/(.+?)\.png'.+?\/?> (\d+)/g, function (wholeMatch, key, amount)
                             {
                        return format.number(amount) + ' ' + split2Words(key) + ', ';
                    })
                    .replace(/<.+?>/g, '')
                    .replace(/(\s)\1+/g, '$1')
                    .replace(/, $/, '');
                    notifications.event('Message from server'
                                        , {
                        body: minutes2String(msg)
                    });
                }
            }
            return;
        }
        commands.process = process;
    })(commands || (commands = {}));

    /**
 * log activities and stuff
 */
    var log;
    (function (log)
     {
        log.name = 'log';
        var LOG_KEY = 'activityLog.undefined'
        var MAX_LOG_SIZE = 100;
        var logList = [];
        var currentCombat = null;
        var currentCombatEl = null;
        var LOG_FILTER = {
            'combat':
            {
                title: 'Combat'
                , img: 'images/icons/combat.png'
            }
            , 'loot':
            {
                title: 'Loot'
                , img: 'images/npcLoot0.png'
            }
            , 'fish':
            {
                title: 'Caught fish'
                , img: 'images/tuna.png'
            }
            , 'skill':
            {
                title: 'Skill advance'
                , img: 'images/icons/skills.png'
            }
            , 'other':
            {
                title: 'All other'
                , label: 'Other'
            }
        };
        var logEl;

        function isFightStarted()
        {
            return win.fightMonsterId !== 0;
        }

        function saveLog()
        {
            store.set(LOG_KEY, logList);
        }

        function createLi(entry)
        {
            var entryEl = document.createElement('li');
            entryEl.dataset.time = (new Date(entry.time || 0)).toLocaleString();
            entryEl.dataset.type = entry.type;
            return entryEl;
        }

        function appendLi(entryEl)
        {
            var filterEl = logEl.firstElementChild;
            var next = filterEl && filterEl.nextElementSibling;
            if (next)
            {
                logEl.insertBefore(entryEl, next);
            }
            else
            {
                logEl.appendChild(entryEl);
            }
            logEl.classList.remove('empty');
        }

        function setGenericEntry(entry, init)
        {
            var el = createLi(entry);
            el.innerHTML = typeof entry.data === 'string' ? format.numbersInText(entry.data) : JSON.stringify(entry.data);
            appendLi(el);
        }
        var chest = '';
        function getChestType(){
            $("#dialogue-chestmenu-open :input[type='image']").click(function(){
                chest = 'Normal ';
            });
            $("#dialogue-promethiumChestmenu-open :input[type='image']").click(function(){
                chest = 'Green ';
            });
            $("#dialogue-runiteChestmenu-open :input[type='image']").click(function(){
                chest = 'Red ';
            });
        }
        function setLootEntry(entry, init)
        {
            var el = createLi(entry);
            var header = document.createElement('h1');
            header.className = 'container-title';
            header.textContent = entry.title;
            el.appendChild(header);
            var itemContainer = document.createElement('span');
            if (entry.itemList.length === 0)
            {
                itemContainer.innerHTML = "<span class=\"dialogue-loot\">" + entry.emptyText + "</span>";
            }
            else
            {
                var update = false;
                for (var _i = 0, _a = entry.itemList; _i < _a.length; _i++)
                {
                    var item = _a[_i];
                    if (item.hasOwnProperty('key'))
                    {
                        item.icon = item.key;
                        delete item.key;
                        update = true;
                    }
                    if (item.hasOwnProperty('amount'))
                    {
                        item.text = (item.amount || Number.NaN).toString();
                        delete item.amount;
                        update = true;
                    }
                    var itemEl = document.createElement('span');
                    itemEl.className = 'dialogue-loot';
                    itemEl.innerHTML = "<img src=\"" + item.icon + "\" class=\"image-icon-50\"> " + format.numbersInText(item.text);
                    itemContainer.appendChild(itemEl);
                    itemContainer.appendChild(document.createTextNode(' '));
                }
                // Chest loot:
                if (entry.title == "Chest loot:"){
                    header.textContent = chest + "Chest loot:";
                }

                if (update)
                {
                    saveLog();
                }
            }
            el.appendChild(itemContainer);
            var valueContainer = document.createElement('div');
            valueContainer.className = 'total-value';
            valueContainer.appendChild(document.createTextNode('Total value: '));
            var totalValue = document.createElement('span');
            totalValue.style.cursor = 'pointer';
            totalValue.textContent = 'Click to calculate';
            valueContainer.appendChild(totalValue);
            var shareButton = document.createElement('span');
            shareButton.style.float = 'right';
            shareButton.style.cursor = 'pointer';
            shareButton.textContent = 'Click here to share';
            valueContainer.appendChild(shareButton);

            shareButton.addEventListener('click', function (){
                //console.log(entry.itemList);
                $("body").append('<canvas id="myCanvas" width="600" height="300" style="display: block;margin: 0 auto;"></canvas>')
                createScreenshot(entry.itemList,entry.title);
                $("#activity-log-overlay").click();
            });

            totalValue.addEventListener('click', function ()
                                        {
                var items = {};
                for (var _i = 0, _a = entry.itemList; _i < _a.length; _i++)
                {
                    var item = _a[_i];
                    if (item.text.indexOf('xp') === -1)
                    {
                        var key = item.icon.replace(/^.+\/([^\/]+)\.png$/, '$1');
                        var num = Number(item.text.replace(/\D/g, ''));
                        if(key.includes("Orb") && (entry.title == "Chop All" || entry.title == "Harvest")){
                            continue;
                        }
                        items[key] = (items[key] || 0) + num;
                    }
                }
                console.log(entry);
                function add(){
                    let sum = market.calcMarketValue(items);
                    let obviously = (Object.keys(items).length===1 && Object.keys(items)[0] == "coins")?", obviously":"";
                    totalValue.innerHTML = "<img class=\"image-icon-20\" src=\"images/coins.png\"> " + format.number(Math.round(sum)) + obviously
                }
                if(!market.checkMarketDataValidity(add)){
                    return;
                }
                add();
            });
            el.appendChild(valueContainer);
            appendLi(el);
        }

        function createScreenshot(listOfItems, TitleText){
            var c=document.getElementById("myCanvas");
            var ctx=c.getContext("2d");
            let imgSize = 100
            let topMargin = 120
            let buffer = 20
            let rectBuffer = 5
            let images = []
            let amounts = []
            let offsets = [0]
            let topTextMargin = 10;



            let offset = 0;
            let loaded = 0
            ctx.font = "30px Arial"
            for(var i = 0; i < listOfItems.length;i++){
                let item = listOfItems[i];
                let image = new Image()
                image.src = item.icon;
                image.crossOrigin="anonymous"
                image.onload = checkLoad
                images.push(image)
                let amount = (isNaN(new Number(item.text)))?item.text:new Number(item.text).toLocaleString();
                amounts.push(amount)
                let o = rectBuffer + imgSize + buffer + ctx.measureText(amount).width + buffer + rectBuffer;
                offsets.push(offset + o)
                offset+=o
            }
            function checkLoad(){
                loaded++
                if(loaded == listOfItems.length){
                    drawImage();
                }
            }

            function drawImage(){
                ctx.font = "3em Arial"
                c.width = Math.max(ctx.measureText(TitleText).width,offset+buffer)
                c.height = topMargin+imgSize+buffer;

                ctx.fillStyle="white"
                ctx.fillRect(0,0,c.width,c.height)

                ctx.font = "3em Arial"
                ctx.fillStyle = "orange";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(TitleText,c.width/2,topTextMargin)

                ctx.font = "30px Arial"
                ctx.fillStyle = "black"
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";

                let initOffset = Math.max(buffer+rectBuffer,(c.width-offset)/2)
                for(var i = 0; i < images.length;i++){
                    let amount = amounts[i]
                    let image = images[i]
                    let rectSizeX = imgSize + buffer + ctx.measureText(amount).width + 2*rectBuffer;
                    let rectSizeY = imgSize+2*rectBuffer;
                    let rectStartX = initOffset+offsets[i]-rectBuffer;
                    let rectStartY = topMargin-rectBuffer;
                    var grd=ctx.createLinearGradient(rectStartX, rectStartY, rectStartX + rectSizeX, rectStartY + rectSizeY);
                    grd.addColorStop(0,"#fafad2");
                    grd.addColorStop(1,"#eee8aa");
                    ctx.fillStyle=grd;
                    ctx.fillRect(rectStartX,rectStartY,rectSizeX,rectSizeY);
                    ctx.fillStyle = "black"
                    ctx.rect(rectStartX,rectStartY,rectSizeX,rectSizeY);
                    ctx.fillText(amount, initOffset + offsets[i]+imgSize + buffer, topMargin+imgSize/2)
                    ctx.drawImage(image, initOffset + offsets[i], topMargin, imgSize, imgSize);
                }
                ctx.stroke();
                var imgFile;
                try {
                    imgFile = c.toDataURL('image/jpeg', 0.9).split(',')[1];
                } catch(e) {
                    imgFile = c.toDataURL().split(',')[1];
                }
                $.ajax({
                    url: 'https://api.imgur.com/3/image',
                    type: 'POST',
                    headers: {
                        Authorization: "Client-id 7c52702e6caeb09"
                    },
                    data: {
                        image: imgFile
                    },
                    success: function(result) {
                        let link = result.data.link;
                        //console.log(result.data);
                        $("#chat-input-text")[0].value+=link
                        $("#myCanvas").remove();
                    }
                });
            }
        }

        function setFishEntry(entry, init)
        {
            var el = createLi(entry);
            el.innerHTML = "You caught a " + key2Name(entry.fish, true) + ".";
            appendLi(el);
        }

        function setEnergyEntry(entry, init)
        {
            var el = createLi(entry);
            el.innerHTML = "Your hero gained " + format.number(entry.energy) + " energy.";
            appendLi(el);
        }

        function setHeatEntry(entry, init)
        {
            var el = createLi(entry);
            el.innerHTML = "You added " + format.number(entry.heat) + " heat to your oven.";
            appendLi(el);
        }

        function setLevelUpEntry(entry, init)
        {
            var el = createLi(entry);
            el.innerHTML = "You advanced your " + entry.skill + " skill to level " + entry.newLevel + ".";
            appendLi(el);
        }

        function getCombatInfo(data, initHp, scaleX, width)
        {
            var points = [];
            var startHp = -1;
            var hp = initHp;
            for (var tick in data)
            {
                hp = data[tick];
                if (startHp === -1)
                {
                    startHp = hp;
                }
                points.push((scaleX * Number(tick)) + ' ' + hp);
            }
            if (points.length === 0)
            {
                points.push('0 ' + initHp);
            }
            points.push(width + ' ' + hp, width + ' 0', '0 0');
            return {
                points: points
                , startHp: startHp === -1 ? initHp : startHp
                , endHp: hp
            };
        }

        function getHTMLFromCombatInfo(info, name)
        {
            return "<div class=\"combat-log-graph\">\n\t\t\t<span>" + name + " (" + info.startHp + " Hp to " + info.endHp + " Hp):</span><br>\n\t\t\t<svg style=\"height: " + info.startHp + "px;\"><polygon points=\"" + info.points.join(',') + "\"></polygon></svg>\n\t\t</div>";
        }

        function setCombatEntry(entry, init)
        {
            var created = init || currentCombatEl == null;
            if (init || currentCombatEl == null)
            {
                currentCombatEl = createLi(entry);
            }
            var HTML = '';
            // support old log format
            if (!entry.hasOwnProperty('ticks'))
            {
                var info = {
                    hero:
                    {
                        heal: 0
                        , melee: 0
                    }
                    , monster:
                    {
                        heal: 0
                        , melee: 0
                    }
                };
                for (var i = 0; i < entry.parts.length; i++)
                {
                    var part = entry.parts[i];
                    info[part.who][part.type] += part.number;
                }
                HTML = "<div>Hero: <span style=\"color: green;\">+" + info.hero.heal + "</span> <span style=\"color: red;\">-" + info.hero.melee + "</span></div>\n\t\t\t<div>Monster: <span style=\"color: green;\">+" + info.monster.heal + "</span> <span style=\"color: red;\">-" + info.monster.melee + "</span></div>";
            }
            else
            {
                var currentTick = Math.max(entry.ticks, 0);
                var width = logEl.scrollWidth - 4 * 12.8 - 2;
                var scaleX = currentTick === 0 ? 0 : width / currentTick;
                var hero = getCombatInfo(entry.hero, win.heroHp, scaleX, width);
                var monster = getCombatInfo(entry.monster, win.fightMonsterHp, scaleX, width);
                // TODO: who won?
                HTML = "The fight took " + format.sec2Str(currentTick) + ".\n\t\t\t" + getHTMLFromCombatInfo(hero, 'Hero') + "\n\t\t\t" + getHTMLFromCombatInfo(monster, 'Monster') + "\n\t\t\t";
            }
            // map monster name and area name from monster id (the ids are starting at 1)
            var isShiny = entry.monsterId > 1e3;
            var mId = entry.monsterId - (isShiny ? 1001 : 1);
            var monsterName = (isShiny ? 'Shiny ' : '') + (getMonsterName(mId) || '(' + (mId+1) + ')');
            var areaId = (mId == 105 || mId == 106) ? 34 : Math.floor(mId / 3);
            var areaName = getAreaName(areaId) || '(' + (areaId+1) + ')';
            currentCombatEl.innerHTML = "<h2>Combat against " + monsterName + " in " + areaName + "</h2>\n\t\t" + HTML;
            if (created)
            {
                appendLi(currentCombatEl);
            }
            if (!isFightStarted())
            {
                currentCombatEl = null;
            }
        }

        function setMarketEntry(entry, init)
        {
            var el = createLi(entry);
            if (entry.coins)
            {
                el.innerHTML = "You collected " + format.number(entry.coins) + " from market.";
            }
            else
            {
                el.innerHTML = "You purchased an item on market.";
            }
            appendLi(el);
        }

        function setBonemealEntry(entry, init)
        {
            var el = createLi(entry);
            el.innerHTML = "You added " + format.number(entry.bonemeal) + " bonemeal to your bonemeal bin.";
            appendLi(el);
        }

        function setCraftingEntry(entry, init)
        {
            var el = createLi(entry);
            el.innerHTML = "You crafted an item.";
            appendLi(el);
        }

        function setStardustEntry(entry, init)
        {
            var el = createLi(entry);
            el.innerHTML = "You got " + format.number(entry.stardust) + " stardust.";
            appendLi(el);
        }
        var entryType2Fn = {
            'loot': setLootEntry
            , 'fish': setFishEntry
            , 'energy': setEnergyEntry
            , 'heat': setHeatEntry
            , 'lvlup': setLevelUpEntry
            , 'combat': setCombatEntry
            , 'market': setMarketEntry
            , 'bonemeal': setBonemealEntry
            , 'crafting': setCraftingEntry
            , 'stardust': setStardustEntry
        };

        function updateLog(entry, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            if (!logEl)
            {
                return;
            }
            if (entry.type && entryType2Fn.hasOwnProperty(entry.type))
            {
                entryType2Fn[entry.type](entry, init);
            }
            else
            {
                setGenericEntry(entry, init);
            }
        }

        function add2Log(entry)
        {
            logList.push(entry);
            logList = logList.slice(-MAX_LOG_SIZE);
            saveLog();
        }
        // use the last stored combat, compare monster id and health state to check whether this combat might be interrupted last time (hero health != 0 && monster health != 0) and continue logging to that fight
        function findCurrentCombat()
        {
            for (var i = logList.length - 1; i >= 0; i--)
            {
                if (logList[i].type == 'combat')
                {
                    var entry = logList[i];
                    if (entry.monsterId == win.fightMonsterId
                        && entry.hero[entry.ticks] !== 0
                        && entry.hero[entry.ticks] !== 0)
                    {
                        return entry;
                    }
                    break;
                }
            }
            return null;
        }

        function add(entry)
        {
            if (!entry.time)
            {
                entry.time = now();
            }
            if (entry.type == 'combat')
            {
                currentCombat = currentCombat || findCurrentCombat();
                if (!currentCombat)
                {
                    return;
                }
                // skip entries without further information
                if (typeof entry.text !== 'number' || entry.text === 0)
                {
                    return;
                }
                var hp = entry.who == 'hero' ? win.heroHp : win.fightMonsterHp;
                // the hp values are updated after this event, so I have to calculate the new value by myself
                var hpDiff = (entry.what == 'heal' ? 1 : -1) * entry.text;
                if(win.fightMonsterId == 25 && hpDiff<-20 && entry.who == 'hero' && win.antiDragonFirePotionCharge>0){
                    hpDiff = 0;
                }
                hp += hpDiff
                currentCombat[entry.who][currentCombat.ticks] = hp;
                saveLog();
                updateLog(currentCombat);
            }

            else
            {
                add2Log(entry);
                updateLog(entry);
            }
        }
        log.add = add;

        function addLogEl()
        {
            addStyle("\n#show-activity-log\n{\n\tdisplay: none;\n}\nbody\n{\n\toverflow-y: scroll;\n}\n#activity-log-label\n{\n\tcolor: pink;\n\tcursor: pointer;\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n#activity-log-overlay\n{\n\tbackground-color: transparent;\n\tcolor: transparent;\n\tpointer-events: none;\n\tposition: fixed;\n\tbottom: 0;\n\tleft: 0;\n\ttop: 0;\n\tright: 0;\n\ttransition: background-color .3s ease-out;\n\tz-index: 1000;\n}\n#show-activity-log:checked ~ #activity-log-overlay\n{\n\tbackground-color: rgba(0, 0, 0, 0.4);\n\tpointer-events: all;\n}\n#activity-log\n{\n\tbackground-color: white;\n\tcolor: black;\n\tlist-style: none;\n\tmargin: 0;\n\toverflow-y: scroll;\n\tpadding: .4rem .8rem;\n\tposition: fixed;\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\ttransform: translateX(100%);\n\ttransition: transform .3s ease-out;\n\tmin-width: 15rem;\n\twidth: 40%;\n\tmax-width: 30rem;\n\tz-index: 1000;\n}\n#show-activity-log:checked ~ #activity-log\n{\n\ttransform: translateX(0%);\n}\n#activity-log::before\n{\n\tcontent: 'Activity Log';\n\tdisplay: block;\n\tfont-size: 1rem;\n\tfont-weight: bold;\n\tmargin-bottom: 0.8rem;\n}\n#activity-log.empty::after\n{\n\tcontent: 'Activities will be listed here.';\n}\n#activity-log li:not(.filter)\n{\n\tborder: 1px solid gray;\n\tborder-radius: .2rem;\n\tdisplay: none;\n\tmargin: .2rem 0;\n\tpadding: .4rem .8rem;\n}\n#activity-log li:not(.filter)::before\n{\n\tcolor: gray;\n\tcontent: attr(data-time);\n\tdisplay: block;\n\tfont-size: 0.8rem;\n\tmargin: -4px 0 4px -4px;\n}\n.combat-log-graph > svg\n{\n\ttransform: scaleY(-1);\n\twidth: 100%;\n}\n.combat-log-graph > svg polygon\n{\n\tfill: green;\n\tstroke: black;\n\tstroke-width: 1px;\n}\n#activity-log.combat > li[data-type=\"combat\"]\n{\n\tdisplay: block;\n}\n#activity-log.loot > li[data-type=\"loot\"]\n{\n\tdisplay: block;\n}\n#activity-log.fish > li[data-type=\"fish\"]\n{\n\tdisplay: block;\n}\n#activity-log.lvlup > li[data-type=\"lvlup\"]\n{\n\tdisplay: block;\n}\n#activity-log.other > li[data-type=\"energy\"],\n#activity-log.other > li[data-type=\"heat\"],\n#activity-log.other > li[data-type=\"market\"],\n#activity-log.other > li[data-type=\"bonemeal\"],\n#activity-log.other > li[data-type=\"crafting\"],\n#activity-log.other > li[data-type=\"stardust\"],\n#activity-log.other > li[data-type=\"undefined\"]\n{\n\tdisplay: block;\n}\n\t\t");
            // add new tab "Activity Log"
            var checkboxId = 'show-activity-log';
            var activityLogLabel = document.createElement('label');
            activityLogLabel.id = 'activity-log-label';
            activityLogLabel.htmlFor = checkboxId;
            activityLogLabel.textContent = 'Activity Log';
            newTopbar.addTabEntry(activityLogLabel);
            var checkbox = document.createElement('input');
            checkbox.id = checkboxId;
            checkbox.type = 'checkbox';
            checkbox.style.display = 'none';
            document.body.insertBefore(checkbox, document.body.firstChild);
            var label = document.createElement('label');
            label.id = 'activity-log-overlay';
            label.htmlFor = checkboxId;
            document.body.appendChild(label);
            logEl = document.createElement('ul');
            logEl.id = 'activity-log';
            var classList = [];
            var html = '';
            for (var key in LOG_FILTER)
            {
                // TODO: load saved filter
                var checked = true;
                classList.push(key);
                html += "<label for=\"log-filter-" + key + "\" title=\"" + LOG_FILTER[key].title + "\">\n\t\t\t\t" + (LOG_FILTER[key].img ? "<img class=\"image-icon-20\" src=\"" + LOG_FILTER[key].img + "\">" : LOG_FILTER[key].label) + "\n\t\t\t</label>\n\t\t\t<input type=\"checkbox\" id=\"log-filter-" + key + "\" " + (checked ? 'checked' : '') + ">";
            }
            logEl.className = 'empty ' + classList.join(' ');
            logEl.innerHTML = "<li class=\"filter\">\n\t\t\t" + html + "\n\t\t</li>";
            document.body.appendChild(logEl);
            var $checkboxes = win.$('li.filter > input[id^="log-filter-"]');
            $checkboxes.checkboxradio(
                {
                    icon: false
                });
            $checkboxes.change(function (event)
                               {
                var id = event.target.id;
                var key = id.replace('log-filter-', '');
                var checked = document.getElementById(id).checked;
                logEl.classList[checked ? 'add' : 'remove'](key);
                // TODO: save current state
            });
            // add all stored elements
            logList.forEach(function (e)
                            {
                return updateLog(e, true);
            });
        }

        function observeCombat()
        {
            observer.add('fightMonsterId', function (key, oldValue, newValue)
                         {
                if (isFightStarted())
                {
                    currentCombat = {
                        type: 'combat'
                        , time: now()
                        , monsterId: newValue
                        , ticks: -5
                        , hero:
                        {}
                        , monster:
                        {}
                    };
                    add2Log(currentCombat);
                    updateLog(currentCombat);
                }
                else
                {
                    if (currentCombat)
                    {
                        currentCombat.ticks--;
                        saveLog();
                    }
                    currentCombat = null;
                    currentCombatEl = null;
                }
            });
            observer.addTick(function ()
                             {
                if (currentCombat !== null)
                {
                    currentCombat.ticks++;
                    if (currentCombat.ticks === 0)
                    {
                        currentCombat.hero[0] = win.heroHp;
                        currentCombat.monster[0] = win.fightMonsterHp;
                    }
                    updateLog(currentCombat);
                }
            });
        }
        var possiblyCaughtFish;
        var lastFishingXpChange = 0;

        function fishObserver(key, oldValue, newValue)
        {
            if (oldValue < newValue && lastFishingXpChange >= now() - 5e3)
            {
                var idx = possiblyCaughtFish.indexOf(key);
                if (idx !== -1)
                {
                    add(
                        {
                            type: 'fish'
                            , fish: key
                        });
                    possiblyCaughtFish = [];
                    lastFishingXpChange = 0;
                }
            }
        }

        function processFishingXpChange(xp)
        {
            lastFishingXpChange = now();
            possiblyCaughtFish = [];
            for (var fish in FISH_XP)
            {
                if (FISH_XP[fish] == xp)
                {
                    possiblyCaughtFish.push(fish);
                }
            }
        }
        log.processFishingXpChange = processFishingXpChange;

        function observeFishing()
        {
            for (var fish in FISH_XP)
            {
                observer.add(fish, fishObserver);
            }
        }

        function init()
        {
            LOG_KEY = 'activityLog.'+win.username;
            logList = store.has(LOG_KEY) ? store.get(LOG_KEY) : logList;
            getChestType();
            addLogEl();
            observeCombat();
            observeFishing();
        }
        log.init = init;
    })(log || (log = {}));

    /**
 * game events
 */
    var gameEvents;
    (function (gameEvents)
     {
        gameEvents.name = 'gameEvents';
        // min time difference between two notifications with the same title (10 seconds)
        var MIN_TIME_DIFFERENCE = 10;
        gameEvents.enabled = {
            smelting: true
            , chopping: true
            , harvest: true
            , boat: true
            , battle: true
            , brewing: true
            , market: true
            , map: true
            //, essence: true
            , rocket: true
            , wind: true
            , perk: true
            , animalCrate: true
            , animalMax: true
        };
        var lastTimestamp = new Map();

        function notifyTabClickable(title, body, icon, tabKey, whenActive)
        {
            if (whenActive === void 0)
            {
                whenActive = false;
            }
            var now = (new Date).getTime();
            var timeDiff = now - (lastTimestamp.get(title) || 0);
            if (timeDiff < MIN_TIME_DIFFERENCE * 1e3)
            {
                return;
            }
            var promise = notifications.event(title
                                              , {
                body: body
                , icon: 'images/' + icon
                , whenActive: whenActive
                , onclick: function ()
                {
                    var tabNames = tabKey.split('.');
                    win.openTab(tabNames[0]);
                    if (tabNames.length > 1)
                    {
                        win.openSubTab(tabNames[1]);
                    }
                }
            });
            if (promise)
            {
                lastTimestamp.set(title, now);
            }
        }

        function observeTimer(k, fn)
        {
            observer.add(k, function (key, oldValue, newValue)
                         {
                if (oldValue > 0 && newValue == 0)
                {
                    fn(key, oldValue, newValue);
                }
            });
        }

        function smelting()
        {
            observeTimer('smeltingPercD', function (key, oldValue, newValue)
                         {
                if (!gameEvents.enabled.smelting || !settings.getSub(settings.KEY.showNotifications, 'smelting'))
                {
                    return;
                }
                notifyTabClickable('Hot topic', 'Your smelting has finished.', getFurnaceLevelName() + 'Furnace.png', 'crafting');
            });
        }

        function chopping()
        {
            observer.add([
                'treeStage1'
                , 'treeStage2'
                , 'treeStage3'
                , 'treeStage4'
                , 'treeStage5'
                , 'treeStage6'
            ], function (key, oldValue, newValue)
                         {
                if (!gameEvents.enabled.chopping || !settings.getSub(settings.KEY.showNotifications, 'chopping'))
                {
                    return;
                }
                if (newValue == 4)
                {
                    notifyTabClickable('Wood you be mine?', 'One or more of your trees are fully grown and can be chopped.', 'icons/woodcutting.png', 'woodcutting');
                }
            });
        }

        function harvest()
        {
            observer.add([
                'farmingPatchStage1'
                , 'farmingPatchStage2'
                , 'farmingPatchStage3'
                , 'farmingPatchStage4'
                , 'farmingPatchStage5'
                , 'farmingPatchStage6'
            ], function (key, oldValue, newValue)
                         {
                if (!gameEvents.enabled.harvest || !settings.getSub(settings.KEY.showNotifications, 'harvest'))
                {
                    return;
                }
                if (newValue == 4)
                {
                    notifyTabClickable('Green thumb', 'One or more of your crops is ready for harvest.', 'icons/watering-can.png', 'farming');
                }
                else if (newValue > 4)
                {
                    notifyTabClickable('I didn\'t plant this', 'One or more of your crops died.', 'icons/watering-can.png', 'farming');
                }
            });
        }

        function boat()
        {
            var timerKeys = BOAT_LIST.map(function (boatKey)
                                          {
                return boatKey + 'Timer';
            });
            observeTimer(timerKeys, function (key, oldValue, newValue)
                         {
                if (!gameEvents.enabled.boat || !settings.getSub(settings.KEY.showNotifications, 'boatReturned'))
                {
                    return;
                }
                var boatKey = key.replace(/Timer$/, '');
                notifyTabClickable('Fishy business', 'Your ' + split2Words(boatKey).toLowerCase() + ' returned from its trip.', boatKey + '.png',
                                   (win.profileCookingTab)? 'cooking' : 'combat');
            });
        }

        function battle()
        {
            observeTimer('combatGlobalCooldown', function (key, oldValue, newValue)
                         {
                if (!gameEvents.enabled.battle || !settings.getSub(settings.KEY.showNotifications, 'heroReady'))
                {
                    return;
                }
                notifyTabClickable('Ready to work', 'Your hero is eager to fight.', 'icons/combat.png', 'combat');
            });
        }

        function brewing()
        {
            observeTimer([
                'barPotionTimer'
                , 'seedPotionTimer'
                , 'stardustPotionTimer'
                , 'superStardustPotionTimer'
            ], function (key, oldValue, newValue)
                         {
                if (!gameEvents.enabled.brewing || !settings.getSub(settings.KEY.showNotifications, 'potionEffect'))
                {
                    return;
                }
                var potionKey = key.replace(/Timer$/, '');
                if (getGameValue(potionKey) > 0)
                {
                    notifyTabClickable('Cheers!', 'You can drink another ' + split2Words(potionKey) + '.', key.replace(/Timer$/, '') + '.png', 'brewing');
                }
            });
        }

        function market()
        {
            var _refreshMarketSlot = win.refreshMarketSlot;
            var lastCollectText = 0;
            win.refreshMarketSlot = function (offerId, itemKey, amount, price, collectText, slotId, timeLeft)
            {
                var diff = collectText - lastCollectText;
                lastCollectText = collectText;
                if (gameEvents.enabled.market && settings.getSub(settings.KEY.showNotifications, 'itemsSold') && collectText > 0)
                {
                    var soldAmount = diff / price;
                    var amountText = ['one (1)', 'two (2)', 'three (3)'][soldAmount - 1] || format.number(soldAmount);
                    var itemName = split2Words(itemKey).toLowerCase();
                    if (soldAmount > 1)
                    {
                        itemName = pluralize(itemName);
                    }
                    var textTemplate = function (itemText)
                    {
                        return "You've sold " + itemText + " to the market.";
                    };
                    if (amount > 0)
                    {
                        notifyTabClickable('Ka-ching', textTemplate(amountText + ' ' + itemName), 'icons/shop.png', 'playermarket');
                    }
                    else
                    {
                        notifyTabClickable('Sold out', textTemplate((soldAmount === 1 ? 'your' : 'all') + ' ' + amountText + ' ' + itemName), 'icons/shop.png', 'playermarket');
                    }
                }
                _refreshMarketSlot(offerId, itemKey, amount, price, collectText, slotId, timeLeft);
            };
        }

        function gameValues()
        {
            function addAnimalYieldObserver(animalTechnicalName,sound, animalYield)
            {
                observer.add(animalTechnicalName+'Yield', function (key, oldValue, newValue)
                         {
                if (gameEvents.enabled.animalCrate && settings.getSub(settings.KEY.showNotifications, 'animalCrate') && newValue>=FARMING_CRATE_CAPACITY[win.farmingCrate])
                {
                    var imageURL = 'farmingCrate'+((win.farmingCrate>1)?win.farmingCrate:'')+'.png';
                    notifyTabClickable(sound, 'Your crate is full of '+animalYield+'.', imageURL, 'animals');
                }
                });
            }

            function addAnimalKillObserver(animalName, animalTechnicalName, sound){
                observer.add(animalTechnicalName, function (key, oldValue, newValue){
                    if (gameEvents.enabled.animalMax && settings.getSub(settings.KEY.showNotifications, 'animalMax') && newValue>settings.getSub(settings.KEY.useAnimalPenNotif, animalName))
                    {
                        notifyTabClickable(sound, 'You have exceeded the wanted amount of '+animalName+'.', animalTechnicalName+'.png', 'animals');
                    }
                });
            }
            for(var animalIndex = 0; animalIndex < ANIMALS.length; animalIndex++){
                var thisAnimal = ANIMALS[animalIndex];
                addAnimalKillObserver(thisAnimal.name, thisAnimal.technicalName, thisAnimal.sound);
                if(thisAnimal.animalYield){
                    addAnimalYieldObserver(thisAnimal.technicalName,thisAnimal.sound,thisAnimal.animalYield);
                }
            }
            observer.add('eventToComeTimer', function (key, oldValue, newValue)
                         {
                let event = EVENTS[win.eventId];
                if (newValue > oldValue)
                {
                    console.log("event countdown notification sent for", event, new Date());
                    notifyTabClickable('Alert!', 'An event is approaching!', 'event.png', 'event');
                }
                if(newValue == 0 && win.eventId > 0){
                    console.log("event notification sent for",event, new Date());
                    notifyTabClickable('Alert!', EVENT_DESCRIPTIONS[win.eventId], 'event/'+win.eventId+'.png', 'event');
                }
            });
            observer.add('treasureMap', function (key, oldValue, newValue)
                         {
                if (gameEvents.enabled.map && settings.getSub(settings.KEY.showNotifications, 'pirate') && oldValue < newValue)
                {
                    notifyTabClickable('Arrrr!', 'Your pirates found a treasure map.', 'treasureMap.png', 'items');
                }
            });
            observer.add('rocketMoonId', function (key, oldValue, newValue)
                         {
                if (gameEvents.enabled.rocket && settings.getSub(settings.KEY.showNotifications, 'rocket'))
                {
                    if (newValue > 0)
                    {
                        let message;
                        let destination = win.rocketDestination
                        switch(destination){
                            case 1: message = 'Your rocket landed on the Moon.';break;
                            case 2: message = 'Your rocket landed on Mars.';break;
                            case 3: message = 'Your rocket has arrived in interstellar space.';break;
                        }
                        notifyTabClickable('One small step for a man...', 'Your rocket landed on the moon.', 'rocket.png', 'mining');
                    }
                    else if (oldValue < 0 && newValue === 0)
                    {
                        notifyTabClickable('Back home', 'Your rocket returned to earth.', 'rocket.png', 'mining');
                    }
                }
            });
            var WIND_DESCRIPTION = [
                'The sea is sleeping like a baby'
                , 'There is a slight breeze'
                , 'A normal day on the sea'
                , 'There is a storm coming'
                , 'The sea is raging'
            ];
            var WIND_CATEGORY = ['none', 'low', 'medium', 'high', 'very high'];
            var _setSailBoatWind = win.setSailBoatWind;
            var oldValue = -1;
            win.setSailBoatWind = function (windLevel)
            {
                _setSailBoatWind(windLevel);
                var newValue = win.sailBoatWindGlobal;
                if (oldValue !== -1
                    && oldValue !== newValue
                    && win.boundSailBoat > 0
                    && gameEvents.enabled.wind
                    && settings.getSub(settings.KEY.showNotifications, 'wind'))
                {
                    var windText = (WIND_DESCRIPTION[win.sailBoatWindGlobal] || 'The wind is turning')
                    + ' (' + (WIND_CATEGORY[win.sailBoatWindGlobal] || 'level ' + win.sailBoatWindGlobal) + ' wind).';
                    notifyTabClickable('Wind of change', windText, 'sailBoat.png', 'combat');
                }
                oldValue = newValue;
            };
            // trigger getting the wind level once at page load
            // so the script can distinguish between getting the wind initially and an actual wind change
            win.processTab('combat');
            // achievements (e.g. achBrewingEasyCompleted)
            var achRegex = /^ach([A-Z][a-z]+)([A-Z][a-z]+)Completed$/;

            function checkAchievement(key, oldValue, newValue)
            {
                if (gameEvents.enabled.perk && settings.getSub(settings.KEY.showNotifications, 'perk') && oldValue < newValue)
                {
                    var match = key.match(/^ach([A-Z][a-z]+)([A-Z][a-z]+)Completed$/);
                    var skillName = match[1].toLowerCase();
                    var difficulty = match[2].toLowerCase();
                    notifyTabClickable('New perk unlocked', 'You completed the ' + difficulty + ' ' + skillName + ' achievement set.', 'achievementBook.png', 'achievements');
                }
            }
            for (var _i = 0, _a = win.jsItemArray; _i < _a.length; _i++)
            {
                var key = _a[_i];
                if (achRegex.test(key))
                {
                    observer.add(key, checkAchievement);
                }
            }
            var stardustEl = document.querySelector('span[data-item-display="stardust"]');
            var parent = stardustEl && stardustEl.parentElement;
            if (stardustEl && parent)
            {
                addStyle("\n#dh2qol-stardustMonitor\n{\n\tdisplay: none !important;\n}\n#stardust-change\n{\n\tcolor: grey;\n\tdisplay: inline-block;\n\tmargin-left: .25rem;\n\ttext-align: left;\n\twidth: 2.5rem;\n}\n#stardust-change.hide\n{\n\tvisibility: hidden;\n}\n\t\t\t");
                var changeEl_1 = document.createElement('span');
                changeEl_1.className = 'hide';
                changeEl_1.id = 'stardust-change';
                parent.appendChild(changeEl_1);
                var HIDE_AFTER_TICKS_1 = 5;
                var ticksSinceSdChange_1 = HIDE_AFTER_TICKS_1;
                var sdDiff_1 = 0;
                observer.add('stardust', function (key, oldValue, newValue)
                             {
                    sdDiff_1 = Math.max(newValue - oldValue, 0);
                    if (sdDiff_1 > 0)
                    {
                        ticksSinceSdChange_1 = 0;
                    }
                });
                observer.addTick(function ()
                                 {
                    var show = settings.get(settings.KEY.showSdChange) && ticksSinceSdChange_1 < HIDE_AFTER_TICKS_1;
                    changeEl_1.classList[show ? 'remove' : 'add']('hide');
                    ticksSinceSdChange_1++;
                    var diff = ticksSinceSdChange_1 > 1 ? 0 : sdDiff_1;
                    var sign = diff > 0 ? '+' : PLUS_MINUS_SIGN;
                    changeEl_1.textContent = '(' + sign + format.number(diff) + ')';
                });
            }
        }
        function getAvgKMRocket(){
            var arr = [];
            var ticksSinceSdChange_1 = 5;
            var sdDiff_1 = 0;
            observer.add('rocketKm', function (key, oldValue, newValue)
                         {
                sdDiff_1 = Math.max(newValue - oldValue, 0);
                if (sdDiff_1 > 0)
                {
                    ticksSinceSdChange_1 = 0;
                }
            });
            observer.addTick(function (){
                ticksSinceSdChange_1++;
                var diff = ticksSinceSdChange_1 > 1 ? 0 : sdDiff_1;
                arr.push(diff);
            });
            win.getrocketkm = function(){
                var min = Math.min( ...arr);
                var max = Math.max( ...arr);

                console.log(min);
                console.log(max);
            };

        }

        function init()
        {
            smelting();
            chopping();
            harvest();
            boat();
            battle();
            brewing();
            market();
            gameValues();
            //getAvgKMRocket();
        }
        gameEvents.init = init;
    })(gameEvents || (gameEvents = {}));

    /**
 * hide crafting recipes of lower tiers or of maxed machines
 */
    var crafting;
    (function (crafting)
     {
        crafting.name = 'crafting';
        /**
	 * hide crafted recipes
	 */
        function setRecipeVisibility(key, visible)
        {
            var recipeRow = document.getElementById('crafting-' + key);
            if (recipeRow)
            {
                recipeRow.style.display = (!settings.get(settings.KEY.hideCraftingRecipes) || visible) ? '' : 'none';
            }
        }

        function hideLeveledRecipes(max, getKey, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var keys2Observe = [];
            var maxLevel = 0;
            for (var i = max - 1; i >= 0; i--)
            {
                var level = i + 1;
                var key = getKey(i);
                var boundKey = getBoundKey(key);
                keys2Observe.push(key);
                keys2Observe.push(boundKey);
                if (getGameValue(key) > 0 || getGameValue(boundKey) > 0)
                {
                    maxLevel = Math.max(maxLevel, level);
                }
                setRecipeVisibility(key, level > maxLevel);
            }
            if (init)
            {
                observer.add(keys2Observe, function ()
                             {
                    return hideLeveledRecipes(max, getKey, false);
                });
            }
        }

        function hideToolRecipe(key, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var emptyKey = getTierKey(key, 0);
            var keys2Observe = [emptyKey];
            var hasTool = getGameValue(emptyKey) > 0;
            for (var i = 0; i < TIER_LEVELS.length; i++)
            {
                var boundKey = getBoundKey(getTierKey(key, i));
                hasTool = hasTool || getGameValue(boundKey) > 0;
                keys2Observe.push(boundKey);
            }
            setRecipeVisibility(emptyKey, !hasTool);
            if (init)
            {
                observer.add(keys2Observe, function ()
                             {
                    return hideToolRecipe(key, false);
                });
            }
        }

        function hideRecipe(key, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var info = RECIPE_MAX.crafting[key];
            var maxValue = typeof info.max === 'function' ? info.max() : info.max;
            var boundKey = getBoundKey(key);
            var unbound = getGameValue(key);
            var bound = getGameValue(boundKey);
            var extra = (info.extraKeys || []).map(function (k)
                                                   {
                return getGameValue(k);
            }).reduce(function (p, c)
                      {
                return p + c;
            }, 0);
            setRecipeVisibility(key, maxValue - (bound + unbound + extra) > 0);
            if (init)
            {
                observer.add([key, boundKey], function ()
                             {
                    return hideRecipe(key, false);
                });
            }
        }
        /**
	 * hide useless items
	 */
        function setItemVisibility(key, visible)
        {
            var itemBox = document.getElementById('item-box-' + key);
            if (itemBox)
            {
                itemBox.style.display = getGameValue(key) > 0 && (!settings.get(settings.KEY.hideUselessItems) || visible) ? '' : 'none';
            }
        }

        function hideLeveledItems(max, getKey, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var keys2Observe = [];
            var maxLevel = 0;
            for (var i = max - 1; i >= 0; i--)
            {
                var level = i + 1;
                var key = getKey(i);
                var boundKey = getBoundKey(key);
                keys2Observe.push(key);
                keys2Observe.push(boundKey);
                if (getGameValue(boundKey) > 0)
                {
                    maxLevel = Math.max(maxLevel, level);
                }
                setItemVisibility(key, level > maxLevel);
            }
            if (init)
            {
                observer.add(keys2Observe, function ()
                             {
                    return hideLeveledItems(max, getKey, false);
                });
            }
        }

        function hideItem(key, hideInfo, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var maxValue = typeof hideInfo.max === 'function' ? hideInfo.max() : hideInfo.max;
            var boundKey = getBoundKey(key);
            var bound = getGameValue(boundKey);
            var extra = (hideInfo.extraKeys || []).map(function (k)
                                                       {
                return getGameValue(k);
            }).reduce(function (p, c)
                      {
                return p + c;
            }, 0);
            setItemVisibility(key, (bound + extra) < maxValue);
            if (init)
            {
                observer.add([key, boundKey], function ()
                             {
                    return hideItem(key, hideInfo, false);
                });
            }
        }

        function init()
        {
            function processRecipes(init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                // furnace
                hideLeveledRecipes(FURNACE_LEVELS.length, function (i)
                                   {
                    return FURNACE_LEVELS[i] + 'Furnace';
                }, init);
                // oil storage
                hideLeveledRecipes(OIL_STORAGE_SIZES.length, function (i)
                                   {
                    return 'oilStorage' + (i + 1);
                }, init);
                // oven recipes
                hideLeveledRecipes(OVEN_LEVELS.length, function (i)
                                   {
                    return OVEN_LEVELS[i] + 'Oven';
                }, init);
                // tools
                for (var _i = 0, TIER_ITEMS_1 = TIER_ITEMS; _i < TIER_ITEMS_1.length; _i++)
                {
                    var tool = TIER_ITEMS_1[_i];
                    hideToolRecipe(tool, init);
                }
                // other stuff
                for (var key in RECIPE_MAX.crafting)
                {
                    hideRecipe(key, init);
                }
                if (init)
                {
                    settings.observe(settings.KEY.hideCraftingRecipes, function ()
                                     {
                        return processRecipes(false);
                    });
                }
            }
            processRecipes(true);
            var _processCraftingTab = win.processCraftingTab;
            win.processCraftingTab = function ()
            {
                var reinit = !!win.refreshLoadCraftingTable;
                _processCraftingTab();
                if (reinit)
                {
                    processRecipes(false);
                }
            };

            function processItems(init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                // furnace
                hideLeveledItems(FURNACE_LEVELS.length, function (i)
                                 {
                    return FURNACE_LEVELS[i] + 'Furnace';
                }, init);
                // oil storage
                hideLeveledItems(OIL_STORAGE_SIZES.length, function (i)
                                 {
                    return 'oilStorage' + (i + 1);
                }, init);
                // oven recipes
                hideLeveledItems(OVEN_LEVELS.length, function (i)
                                 {
                    return OVEN_LEVELS[i] + 'Oven';
                }, init);
                // other stuff
                for (var key in RECIPE_MAX.crafting)
                {
                    hideItem(key, RECIPE_MAX.crafting[key], init);
                }
                if (init)
                {
                    settings.observe(settings.KEY.hideUselessItems, function ()
                                     {
                        return processItems(false);
                    });
                }
            }
            processItems(true);
        }
        crafting.init = init;
    })(crafting || (crafting = {}));

    /**
 * improve item boxes
 */
    var itemBoxes;
    (function (itemBoxes)
     {
        itemBoxes.name = 'itemBoxes';

        function hideNumberInItemBox(key, setVisibility)
        {
            if (setVisibility === void 0)
            {
                setVisibility = false;
            }
            var itemBox = document.getElementById('item-box-' + key);
            if (!itemBox)
            {
                return;
            }
            var numberElement = itemBox.querySelector('span[data-item-display]');
            if (!numberElement)
            {
                return;
            }
            numberElement.classList.add('number-caption');
            if (setVisibility)
            {
                numberElement.classList.remove('hide');
                numberElement.classList.add('hidden');
            }
            else
            {
                numberElement.classList.remove('hidden');
                numberElement.classList.add('hide');
            }
        }

        function addSpan2ItemBox(key, replace, setVisibility)
        {
            if (replace === void 0)
            {
                replace = true;
            }
            if (setVisibility === void 0)
            {
                setVisibility = false;
            }
            if (replace)
            {
                hideNumberInItemBox(key, setVisibility);
            }
            var itemBox = document.getElementById('item-box-' + key);
            if (!itemBox)
            {
                return;
            }
            var span = document.createElement('span');
            span.className = 'caption';
            itemBox.appendChild(span);
            return span;
        }

        function prependSpan2ItemBox(key, replace, setVisibility)
        {
            if (replace === void 0)
            {
                replace = true;
            }
            if (setVisibility === void 0)
            {
                setVisibility = false;
            }
            if (replace)
            {
                hideNumberInItemBox(key, setVisibility);
            }
            var itemBox = document.getElementById('item-box-' + key);
            if (!itemBox)
            {
                return;
            }
            var span = document.createElement('span');
            span.className = 'caption';
            itemBox.insertBefore(span,itemBox.firstChild);
            return span;
        }

        function addCaptionStyle()
        {
            var CLASS_NAME = 'show-captions';
            addStyle("\nbody:not(." + CLASS_NAME + ") span.caption\n{\n\tdisplay: none;\n}\nbody." + CLASS_NAME + " span.number-caption.hidden\n{\n\tvisibility: hidden;\n}\nbody." + CLASS_NAME + " span.number-caption.hide\n{\n\tdisplay: none;\n}\n\t\t");

            function updateBodyClass()
            {
                var show = settings.get(settings.KEY.showCaptions);
                document.body.classList[show ? 'add' : 'remove'](CLASS_NAME);
            }
            updateBodyClass();
            settings.observe(settings.KEY.showCaptions, function ()
                             {
                return updateBodyClass();
            });
        }

        function setOilPerSecond(span, oil)
        {
            span.innerHTML = "+ " + format.number(oil) + " L/s <img src=\"images/oil.png\" class=\"image-icon-20\">";
        }
        // show capacity of furnace
        function addFurnaceCaption()
        {
            for (var i = 0; i < FURNACE_LEVELS.length; i++)
            {
                var key = FURNACE_LEVELS[i] + 'Furnace';
                var boundKey = getBoundKey(key);
                var capacitySpan = addSpan2ItemBox(boundKey);
                if (capacitySpan)
                {
                    capacitySpan.classList.add('capacity');
                    capacitySpan.textContent = 'Capacity: ' + format.number(win.getFurnaceCapacity(boundKey), true);
                }
            }
            // charcoal foundry
            var foundryCapacitySpan = addSpan2ItemBox('charcoalFoundry');
            if (foundryCapacitySpan)
            {
                foundryCapacitySpan.classList.add('capacity');
                foundryCapacitySpan.textContent = 'Capacity: 100';
            }
        }
        // show oil cap of oil storage
        function addOilStorageCaption()
        {
            for (var i = 0; i < OIL_STORAGE_SIZES.length; i++)
            {
                var key = 'oilStorage' + (i + 1);
                var capSpan = addSpan2ItemBox(getBoundKey(key));
                if (capSpan)
                {
                    capSpan.classList.add('oil-cap');
                    capSpan.textContent = 'Oil cap: ' + format.number(OIL_STORAGE_SIZES[i], true);
                }
            }
        }
        var oilPipeOrbKey = 'boundBlueOilPipeOrb';

        function setOilPipeCaption(span)
        {
            setOilPerSecond(span, 50 + win.achMiningEasyCompleted * 50 + getGameValue(oilPipeOrbKey) * 100);
        }
        function setTombKeys(span, key)
        {
            span.style = 'color: #470058';
            span.innerHTML = format.number(key);
        }
        function addTombKeyCaption()
        {
            addStyle("\n#item-box-faradoxsCrystalCharged,\n#item-box-darkFaradoxsCrystalCharged\n{\n\tposition: relative;\n}\nspan.caption.tombKey\n{\n\tfont-size: 19px;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tright: 80px;\n{\n\t-webkit-filter: drop-shadow(0px 0px 5px rgb(255,255,255));\n\tfilter: url(#drop-shadow);\n\t-ms-filter: \"progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#FFF')\";\n\tfilter: \"progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#FFF')\";\n}\n\t\t");
            var tpl = document.createElement('templateWrapper');
            tpl.innerHTML = "\n<svg height=\"0\" xmlns=\"http://www.w3.org/2000/svg\">\n    <filter id=\"drop-shadow\">\n        <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"1\"></feGaussianBlur>\n        <feOffset dx=\"0\" dy=\"0\" result=\"offsetblur\"></feOffset>\n        <feFlood flood-color=\"rgba(255,255,255,1)\"></feFlood>\n        <feComposite in2=\"offsetblur\" operator=\"in\"></feComposite>\n        <feMerge>\n\n            <feMergeNode></feMergeNode><feMergeNode in=\"SourceGraphic\"></feMergeNode>\n        </feMerge>\n    </filter>\n</svg>\n\t\t";
            var shadowDrop = tpl.firstElementChild;
            document.body.appendChild(shadowDrop);
            var crystalChargedSpan = addSpan2ItemBox('faradoxsCrystalCharged');
            if (crystalChargedSpan)
            {
                crystalChargedSpan.classList.add('tombKey');
                var totalKeys = win.tombKeyTotal;
                setTombKeys(crystalChargedSpan, totalKeys);
                observer.add(crystalChargedSpan, function ()
                             {
                    return setTombKeys(crystalChargedSpan, totalKeys);
                });
            }
            var darkCrystalChargedSpan = addSpan2ItemBox('darkFaradoxsCrystalCharged');
            if (darkCrystalChargedSpan)
            {
                darkCrystalChargedSpan.classList.add('tombKey');
                var totalKeys = win.darkTombKeyTotal;
                setTombKeys(darkCrystalChargedSpan, totalKeys);
                observer.add(darkCrystalChargedSpan, function ()
                             {
                    return setTombKeys(darkCrystalChargedSpan, totalKeys);
                });
            }
        }
        // show oil per second
        function addOilCaption()
        {
            addStyle("\n#item-box-boundCharcoalFactory,\n#item-box-handheldOilPump,\n#item-box-boundOilPipe,\n#item-box-boundPumpjacks,\n#item-box-boundOilFactory\n{\n\tposition: relative;\n}\nspan.caption.oil\n{\n\tfont-size: .9rem;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n}\nspan.caption.oil img[src=\"images/oil.png\"]\n{\n\t-webkit-filter: drop-shadow(0px 0px 5px rgb(255,255,255));\n\tfilter: url(#drop-shadow);\n\t-ms-filter: \"progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#FFF')\";\n\tfilter: \"progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#FFF')\";\n}\n\t\t");
            var tpl = document.createElement('templateWrapper');
            tpl.innerHTML = "\n<svg height=\"0\" xmlns=\"http://www.w3.org/2000/svg\">\n    <filter id=\"drop-shadow\">\n        <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"1\"></feGaussianBlur>\n        <feOffset dx=\"0\" dy=\"0\" result=\"offsetblur\"></feOffset>\n        <feFlood flood-color=\"rgba(255,255,255,1)\"></feFlood>\n        <feComposite in2=\"offsetblur\" operator=\"in\"></feComposite>\n        <feMerge>\n\n            <feMergeNode></feMergeNode><feMergeNode in=\"SourceGraphic\"></feMergeNode>\n        </feMerge>\n    </filter>\n</svg>\n\t\t";
            var shadowDrop = tpl.firstElementChild;
            document.body.appendChild(shadowDrop);
            var handheldOilSpan = addSpan2ItemBox('handheldOilPump', true, true);
            if (handheldOilSpan)
            {
                handheldOilSpan.classList.add('oil');
                setOilPerSecond(handheldOilSpan, 1 * win.miner);
                observer.add('miner', function ()
                             {
                    return setOilPerSecond(handheldOilSpan, 1 * win.miner);
                });
            }
            var oilPipeSpan = addSpan2ItemBox('boundOilPipe', true, true);
            if (oilPipeSpan)
            {
                oilPipeSpan.classList.add('oil');
                setOilPipeCaption(oilPipeSpan);
                observer.add(oilPipeOrbKey, function ()
                             {
                    return setOilPipeCaption(oilPipeSpan);
                });
            }
            var charcoalFactorySpan = addSpan2ItemBox('boundCharcoalFactory');
            var charcoalFactoryOilGain = (boundRedCharcoalFactoryOrb) ? 600 : 300;
            if (charcoalFactorySpan)
            {
                charcoalFactorySpan.classList.add('oil');
                setOilPerSecond(charcoalFactorySpan, charcoalFactoryOilGain);
                observer.add(charcoalFactorySpan, function ()
                             {
                    return setOilPerSecond(charcoalFactorySpan, charcoalFactoryOilGain);
                });
            }
            // add pump jack oil display
            var pumpjackSpan = addSpan2ItemBox('boundPumpjacks', false);
            var totalOilPumpjacks = win.boundPumpjacks * 10;
            var pumpjackOilGain = (achMiningHardCompleted) ? (totalOilPumpjacks * 2) : totalOilPumpjacks;
            if (pumpjackSpan)
            {
                pumpjackSpan.classList.add('oil');
                var setCaption_1 = function ()
                {
                    return setOilPerSecond(pumpjackSpan, pumpjackOilGain);
                };
                setCaption_1();
                observer.add('boundPumpjacks', function ()
                             {
                    return setCaption_1();
                });
            }
            // add number of workers as caption to oil factory
            var workerSpan = addSpan2ItemBox('boundOilFactory');
            if (workerSpan)
            {
                var setCaption_2 = function ()
                {
                    return workerSpan.textContent = 'Workers: ' + format.number(win.oilFactoryCheapWorkers, true);
                };
                setCaption_2();
                observer.add('oilFactoryCheapWorkers', function ()
                             {
                    return setCaption_2();
                });
            }
            var factoryOilSpan = addSpan2ItemBox('boundOilFactory');
            var factoryOilGain = (boundGreenOilFactoryOrb) ? win.oilFactoryCheapWorkers * 2 :win.oilFactoryCheapWorkers;
            if (factoryOilSpan)
            {
                factoryOilSpan.classList.add('oil');
                var setCaption_3 = function ()
                {
                    return setOilPerSecond(factoryOilSpan, factoryOilGain);
                };
                setCaption_3();
                observer.add('oilFactoryCheapWorkers', function ()
                             {
                    return setCaption_3();
                });
            }
        }

        function addWandCaption()
        {
            for (var i = 0; i < WAND_LEVELS.length; i++)
            {
                var level = WAND_LEVELS[i];
                var key = level + 'Wand';
                var wandSpan = addSpan2ItemBox(key);
                if (wandSpan)
                {
                    wandSpan.textContent = capitalize(level) + ' Wand';
                }
            }
        }

        function addVariousCaptions()
        {
            var key2Name = {
                'achievementBook': 'Achievements'
                , 'emptyAnvil': 'Anvil'
                , 'tap': 'Tree Tap'
                , 'farmer': 'Farmer'
                , 'spellScroll1': 'Spell Scroll 1'
                , 'boundRuniteSpyglass': 'Spyglass'
                , 'bobsUncle': "Bob's Uncle"
                , 'boundBoatingDock': 'Boating Dock'
                , 'lumberjack': 'Lumberjack'
                , 'handheldOilPump': 'Oil Pump'
                , 'boundCharcoalFactory': 'Ch.coal Factory'
                , 'boundNeedle': 'Needle'
                , 'vendor': 'Vendor'
                , 'boundOilStorage1': 'Oil Storage 1'
                , 'boundOilStorage2': 'Oil Storage 2'
                , 'boundOilStorage3': 'Oil Storage 3'
                , 'boundOilStorage4': 'Oil Storage 4'
                , 'boundOilStorage5': 'Oil Storage 5'
                , 'boundOilStorage6': 'Oil Storage 6'
                , 'boundOilStorage7': 'Oil Storage 7'
                , 'boundOilPipe': 'Oil Pipe'
                , 'meditate1': 'Meditate level 1'
                , 'meditate2': 'Meditate level 2'
                , 'meditate3': 'Meditate level 3'
                , 'meditate4': 'Meditate level 4'
                , 'meditate5': 'Meditate level 5'
                , 'meditate6': 'Meditate level 6'
                , 'meditate7': 'Meditate level 7'
                , 'meditate8': 'Meditate level 8'
                , 'meditate9': 'Meditate level 9'
                , 'gardener': 'Gardener'
                , 'planter': 'Planter'
                , 'boundBrewingKit': 'Brewing Kit'
                , 'cooksBook': 'Cooks Book'
                , 'cooksPage': 'Cooks Page'
                , 'combatDropTable': 'Loot Table'
                , 'magicBook': 'Spell Book'
                , 'magicShop': 'Magic Shop'
                , 'crackedSpinningWheel': 'Cracked Wheel'
                , 'woodenSpinningWheel': 'Wooden Wheel'
                , 'oakSpinningWheel': 'Oak Wheel'
                , 'willowSpinningWheel': 'Willow Wheel'
                , 'mapleSpinningWheel': 'Maple Wheel'
                , 'stardustSpinningWheel': 'Stardust Wheel'
                , 'strangeSpinningWheel': 'Strange Wheel'
                , 'ancientSpinningWheel': 'Ancient Wheel'
                , 'animalTracker': 'Animal Tracker'
                , 'barnFence': 'Barn Fence'
                , 'horse': 'Horse'
                , 'lightHorse': 'Light Horse'
                , 'darkHorse': 'Dark Horse'
                , 'boundPirateShip': 'Pirate Ship'
                , 'robotGift': 'Robot Gift'
                , 'pumpkinSigil': 'Pumpkin Sigil'
                , 'santaHatSigil': 'Santa Hat Sigil'
                , 'easterEggSigil': 'Easter Egg Sigil'
                , 'ghostSigil': 'Ghost Sigil'
                , 'treeSigil': 'Tree Sigil'
                , 'pinkPartyHat': 'Pink Party Hat'
                , 'redPartyHat': 'Red Party Hat'
                , 'greenPartyHat': 'Green Party Hat'
                , 'yellowPartyHat': 'Yellow Party Hat'
                , 'whitePartyHat': 'White Party Hat'
                , 'bluePartyHat': 'Blue Party Hat'
                , 'bunnySigil': 'Bunny Sigil'
                , 'catSigil': 'Cat Sigil'
                , 'snowmanSigil': 'Snowman Sigil'
                , 'goldEventSigil': 'Gold Event #1 Sigil'
                , 'silverEventSigil': 'Silver Event #1 Sigil'
                , 'bronzeEventSigil': 'Bronze Event #1 Sigil'
                , 'eventSigil': 'Event #1 Sigil'
                , 'robotSigil': 'Robot Sigil'
                , 'boundTrawler': 'Trawler'
                , 'goldEventSigil2': 'Gold Event #2 Sigil'
                , 'silverEventSigil2': 'Silver Event #2 Sigil'
                , 'bronzeEventSigil2': 'Bronze Event #2 Sigil'
                , 'eventSigil2': 'Event #2 Sigil'
            };
            for (var key in key2Name)
            {
                var span = addSpan2ItemBox(key);
                if (span)
                {
                    span.textContent = key2Name[key];
                }
            }
        }
        // show current tier
        function addTierCaption()
        {
            addStyle("\nspan.item-box > span.orb::before\n{\n\tbackground-color: aqua;\n\tborder: 1px solid silver;\n\tborder-radius: 100%;\n\tcontent: '';\n\tdisplay: inline-block;\n\tmargin-left: -5px;\n\tmargin-right: 5px;\n\twidth: 10px;\n\theight: 10px;\n}\n\t\t");

            function addOrbObserver(key, spanList)
            {
                var boundOrbKey = getBoundKey('Blue' + capitalize(key) + 'Orb');

                function checkOrb()
                {
                    var classAction = getGameValue(boundOrbKey) > 0 ? 'add' : 'remove';
                    for (var _i = 0, spanList_1 = spanList; _i < spanList_1.length; _i++)
                    {
                        var span = spanList_1[_i];
                        span.classList[classAction]('orb');
                    }
                }
                checkOrb();
                observer.add(boundOrbKey, function ()
                             {
                    return checkOrb();
                });
            }
            var remainingOrbItems = ORB_ITEMS;
            for (var _i = 0, TIER_ITEMS_2 = TIER_ITEMS; _i < TIER_ITEMS_2.length; _i++)
            {
                var tierItem = TIER_ITEMS_2[_i];
                var isBindable = TIER_ITEMS_NOT_BINDABLE.indexOf(tierItem) === -1;
                var spanList = [];
                for (var i = 0; i < TIER_LEVELS.length; i++)
                {
                    var key = getTierKey(tierItem, i);
                    var toolKey = isBindable ? getBoundKey(key) : key;
                    var tierSpan = addSpan2ItemBox(toolKey);
                    if (tierSpan)
                    {
                        tierSpan.classList.add('tier');
                        tierSpan.textContent = TIER_NAMES[i];
                        spanList.push(tierSpan);
                    }
                }
                var orbIndex = remainingOrbItems.indexOf(tierItem);
                if (orbIndex !== -1)
                {
                    addOrbObserver(tierItem, spanList);
                    remainingOrbItems.splice(orbIndex, 1);
                }
            }
            for (var _a = 0, remainingOrbItems_1 = remainingOrbItems; _a < remainingOrbItems_1.length; _a++)
            {
                var itemKey = remainingOrbItems_1[_a];
                var captionSpan = document.querySelector('#item-box-' + getBoundKey(itemKey) + ' > span:last-of-type');
                if (!captionSpan)
                {
                    continue;
                }
                addOrbObserver(itemKey, [captionSpan]);
            }
        }
        var boatTimerKeys = BOAT_LIST.map(function (boatKey)
                                          {
            return boatKey + 'Timer';
        });

        function checkBoat(span, timerKey, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var isInTransit = getGameValue(timerKey) > 0;
            var otherInTransit = boatTimerKeys.some(function (k)
                                                    {
                return k != timerKey && getGameValue(k) > 0 && !boundBoatingDock;
            });
            span.textContent = isInTransit ? 'In transit' : 'Ready';
            span.style.visibility = otherInTransit ? 'hidden' : '';
            var parent = span.parentElement;
            parent.style.opacity = otherInTransit ? '.5' : '';
            if (init)
            {
                observer.add(boatTimerKeys, function ()
                             {
                    return checkBoat(span, timerKey, false);
                });
            }
        }
        // show boat progress
        function addBoatCaption()
        {
            for (var i = 0; i < BOAT_LIST.length; i++)
            {
                var span = prependSpan2ItemBox(getBoundKey(BOAT_LIST[i]));
                span.style.display = 'block';
                if (span)
                {
                    checkBoat(span, boatTimerKeys[i], true);
                }
            }
            document.getElementById("item-box-boundSailBoat").firstElementChild.style.position = "absolute";
            document.getElementById("item-box-boundSailBoat").firstElementChild.style.width= "inherit";
            if(!settings.get(settings.KEY.showCaptions)){
                document.getElementById("item-box-boundRowBoat").firstElementChild.style.position = "absolute";
                document.getElementById("item-box-boundRowBoat").firstElementChild.style.width= "inherit";
                document.getElementById("item-box-boundCanoe").firstElementChild.style.position = "absolute";
                document.getElementById("item-box-boundCanoe").firstElementChild.style.width= "inherit";
                document.getElementById("item-box-boundSteamBoat").firstElementChild.style.position = "absolute";
                document.getElementById("item-box-boundSteamBoat").firstElementChild.style.width= "inherit";
            }
        }
        // show bonemeal
        function addBonemealCaption()
        {
            var noBonemealSpan = addSpan2ItemBox('boundBonemealBin');
            if (!noBonemealSpan)
            {
                return;
            }
            noBonemealSpan.textContent = 'Bonemeal: 0';
            var bonemealSpan = addSpan2ItemBox('boundFilledBonemealBin');
            if (!bonemealSpan)
            {
                return;
            }
            bonemealSpan.dataset.itemDisplay = 'bonemeal';
            bonemealSpan.textContent = format.number(win.bonemeal);
            var captionSpan = document.createElement('span');
            captionSpan.className = 'caption';
            captionSpan.textContent = 'Bonemeal: ';
            bonemealSpan.parentElement.insertBefore(captionSpan, bonemealSpan);
        }

        function warningBeforeSellingGems()
        {
            var _sellNPCItemDialogue = win.sellNPCItemDialogue;
            win.sellNPCItemDialogue = function (item, amount)
            {
                if (item == 'sapphire' || item == 'emerald' || item == 'ruby' || item == 'diamond' || item == 'bloodDiamond' || item == 'dragonstone' ||
                    item == 'darkDiamond')
                {
                    var itemName = key2Name(amount == 1 ? item : item.replace(/y$/, 'ie') + 's', true);
                    if (amount == 0
                        || !win.confirm('Gems are precious and rare. Please consider carefully:\nDo you really want to sell ' + amount + ' ' + itemName + '?'))
                    {
                        return;
                    }
                }
                else if (item == 'logs' || item == 'oakLogs' || item == 'willowLogs' || item == 'mapleLogs' || item == 'stardustLogs' || item == 'strangeLogs' || item == 'ancientLogs')
                {
                    var itemName = key2Name(amount == 1 ? item.replace(/s$/, '') : item, true);
                    if (amount == 0
                        || !win.confirm('Logs are time consuming to collect. Please consider carefully:\nDo you really want to sell ' + amount + ' ' + itemName + '?'))
                    {
                        return;
                    }
                }
                _sellNPCItemDialogue(item, amount);
            };
        }

        function warningBeforeCraftingRuniteOven(){
            let el = document.getElementById("crafting-runiteFurnace");
            if(!el){
                setTimeout(()=>warningBeforeCraftingRuniteOven(), 3000); //move to when crafting tab is opened
                //console.log("waiting for crafting menu");
                return;
            }
            //console.log("found crafting menu");
            let _onclick = $._data(el).events.click[0].handler;
            var dialog = document.createElement('dialog');
            dialog.id = 'dialogue-id-runiteFurnace';
            document.body.appendChild(dialog);
            $(dialog).dialog(
                {
                    title: 'Are you sure you don\'t want to make a Runite Oven instead?',
                    height: 'auto',
                    width: 'auto'
                });
            let htmlText = "<div>You are trying to make a Runite Furnace, which increases your ore smelting capacity,<br>";
            htmlText+="but you haven't yet made a Runite Oven, which reduces the chance of burning food to 0%.<br>"
            htmlText+="Are you sure you don't want to make the Oven first?</div>"
            htmlText+="<div><button id=\"warningBeforeCraftingRuniteOvenButton\">I want to make a Runite Furnace</button>"
            htmlText+="<button id=\"warningBeforeCraftingRuniteOvenClose\">Thanks, I don't want to pull a SimenD</button></div>";
            $(dialog).html(htmlText);
            $(dialog).dialog("close");
            $("#dialogue-id-runiteFurnace :button").click(function(){
                $(this).closest(".ui-dialog-content").dialog("close");
            });
            document.getElementById("warningBeforeCraftingRuniteOvenButton").onclick = _onclick;
            document.getElementById("warningBeforeCraftingRuniteOvenClose").onclick = ()=>$(this).closest(".ui-dialog-content").dialog("close");
            $._data(el).events.click[0].handler = function(){
                if(win.boundRuniteOven == 0 && win.runiteOven == 0){
                    $(dialog).dialog("open");
                }else{
                    _onclick();
                }
            };
        }

        function warningForChoppingDownEliteTrees(){
            let plots = document.getElementsByClassName("woodcutting-tree")
            if(!plots){
                setTimeout(()=>warningForChoppingDownEliteTrees(), 3000); //maybe move to when wc tab is opened
                console.log("waiting for woodcutting menu");
                return;
            }
            //console.log("found woodcutting menu");
            var dialog = document.createElement('dialog');
            dialog.id = 'dialogue-id-woodcuttingDisableElite';
            document.body.appendChild(dialog);
            $(dialog).dialog(
                {
                    title: 'This action has been disabled',
                    height: 'auto',
                    width: 'auto'
                });
            let htmlText = "<div>You have disabled the ability to chop this tree, presumably to save it for elite achievements.<br>";
            htmlText+="To re-enable chopping of this tree, go to your profile and toggle the settings for enabling and<br>";
            htmlText+="disabling chopping of Shiny and/or Ancient Trees<br></div>"
            htmlText+="<div style= \"text-align: center;margin-top:15px;\"><button id=\"woodcuttingDisableEliteClose\">OK</button></div"
            $(dialog).html(htmlText);
            $(dialog).dialog("close");
            $("#dialogue-id-woodcuttingDisableElite :button").click(function(){
                $(this).closest(".ui-dialog-content").dialog("close");
            });
            document.getElementById("woodcuttingDisableEliteClose").onclick = ()=>$(this).closest(".ui-dialog-content").dialog("close");

            for(let i = 0; i < plots.length; i++){
                let plot = plots[i]
                if(plot.onclick.toSource().length>60){
                    continue;
                }
                let _onclick = plot.onclick;
                plot.onclick = function(){
                    let treeId = window["treeId"+plot.id.slice(plot.id.length-1)]
                    let treeName = TREE_NAME[treeId];
                    console.log(treeName);
                    if((treeName.includes("Shiny") && settings.get(settings.KEY.woodcuttingDisableShiny))
                      || (treeName.includes("Ancient") && settings.get(settings.KEY.woodcuttingDisableAncient))){
                        $(dialog).dialog("open");
                    }else{
                        _onclick();
                    }
                }
            }
            setTimeout(()=>warningForChoppingDownEliteTrees(), 3*60*60*1000 - 1000);
        }


        function addWikiaLinks()
        {
            var WIKIA_CLASS = 'wikia-links';
            addStyle("\n." + WIKIA_CLASS + " .item-box\n{\n\tposition: relative;\n}\n.item-box > .wikia-link\n{\n\tbackground-color: black;\n\tbackground-image: " + icons.getSvgAsUrl(icons.wrapCodeWithSvg(icons.WIKIA, '-2 -2 26 27', 30, 30)) + ";\n\tbackground-repeat: no-repeat;\n\tdisplay: none;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 30px;\n\theight: 30px;\n}\n." + WIKIA_CLASS + " .item-box:hover > .wikia-link\n{\n\tdisplay: block;\n}\n\t\t");

            function setWikiaLinksVisibility(init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                var show = settings.get(settings.KEY.wikiaLinks);
                document.body.classList[show ? 'add' : 'remove'](WIKIA_CLASS);
                if (init)
                {
                    settings.observe(settings.KEY.wikiaLinks, function ()
                                     {
                        return setWikiaLinksVisibility();
                    });
                }
            }
            setWikiaLinksVisibility(true);
            var boxes = document.getElementsByClassName('item-box');

            function disableClickPropagation(el)
            {
                el.addEventListener('click', function (event)
                                    {
                    event.stopPropagation();
                });
            }
            for (var i = 0; i < boxes.length; i++)
            {
                var box = boxes.item(i);
                var key = box.id.replace(/^item-box-/, '');
                var linkArea = document.createElement('a');
                linkArea.className = 'wikia-link';
                linkArea.href = getWikiaLink(key);
                linkArea.target = '_blank';
                disableClickPropagation(linkArea);
                box.appendChild(linkArea);
                var tooltipEl = ensureTooltip('wikiLink', linkArea);
                if (tooltipEl.innerHTML === '')
                {
                    tooltipEl.innerHTML = "Click to open the wikia page about this item.";
                }
            }
        }

        function init()
        {
            addCaptionStyle();
            addFurnaceCaption();
            //addOilStorageCaption();
            addOilCaption();
            addTombKeyCaption();
            addWandCaption();
            addVariousCaptions();
            addTierCaption();
            addBoatCaption();
            addBonemealCaption();
            warningBeforeSellingGems();
            addWikiaLinks();
            warningBeforeCraftingRuniteOven();
            warningForChoppingDownEliteTrees();
        }
        itemBoxes.init = init;
    })(itemBoxes || (itemBoxes = {}));

    /**
 * add new chat
 */
    var chat;
    (function (chat)
     {
        chat.name = 'chat';
        // min time difference between repeated messages to not be considered as spam
        var MIN_DIFF_REPEATED_MSG = 5e3;
        var KEYWORD_LIST_KEY = 'keywordList';
        chat.keywordList = store.has(KEYWORD_LIST_KEY) ? store.get(KEYWORD_LIST_KEY) : [];
        var CHAT_HISTORY_KEY = 'chatHistory';
        var MAX_CHAT_HISTORY_LENGTH = 100;
        var PM_HISTORY_KEY = 'pmHistory.undefined';
        var MAX_PM_HISTORY_LENGTH = 50;
        var Type;
        (function (Type)
         {
            Type[Type["reload"] = -1] = "reload";
            Type[Type["normal"] = 0] = "normal";
            Type[Type["pmReceived"] = 1] = "pmReceived";
            Type[Type["pmSent"] = 2] = "pmSent";
            Type[Type["serverMsg"] = 3] = "serverMsg";
        })(Type || (Type = {}));;
        var Tag;
        (function (Tag)
         {
            Tag[Tag["none"] = 0] = "none";
            Tag[Tag["donor"] = 1] = "donor";
            Tag[Tag["contributor"] = 2] = "contributor";
            Tag[Tag["mod"] = 3] = "mod";
            Tag[Tag["dev"] = 4] = "dev";
            Tag[Tag["server"] = 5] = "server";
        })(Tag || (Tag = {}));;
        /**
	 * The chunk hiding starts with at least 10 chunks.
	 * So there are at least
	 *	(chunkHidingMinChunks-1) * msgChunkSize + 1 = 9 * 100 + 1 = 901
	 * messages before the chunk hiding mechanism starts.
	 */
        var CHUNK_HIDING_MIN_CHUNKS = 10;
        var MSG_CHUNK_SIZE = 100;
        var RELOADED_CHAT_DATA = {
            timestamp: 0
            , username: ''
            , userlevel: 0
            , icon: 0
            , tag: 0
            , type: Type.reload
            , msg: '[...]'
        };
        var CHAT_BOX_ID = 'div-chat';
        var DEFAULT_CHAT_DIV_ID = 'div-chat-area';
        var GENERAL_CHAT_DIV_ID = 'div-chat-general';
        var PM_CHAT_TAB_PREFIX = 'tab-chat-pm-';
        var PM_CHAT_DIV_PREFIX = 'div-chat-pm-';
        var CHAT_TABS_ID = 'chat-tabs';
        var CHAT_INPUT_ID = 'chat-input-text';
        var CHAT_CLASS = 'div-chat-area';
        var COLORIZE_CLASS = 'colorize';
        var SpecialTab;
        (function (SpecialTab)
         {
            SpecialTab[SpecialTab["default"] = 0] = "default";
            SpecialTab[SpecialTab["general"] = 1] = "general";
            SpecialTab[SpecialTab["filler"] = 2] = "filler";
        })(SpecialTab || (SpecialTab = {}));;
        var CHAT_SPECIAL_TAB_ID = (_a = {}
                                   , _a[SpecialTab.default] = 'tab-chat-default'
                                   , _a[SpecialTab.general] = 'tab-chat-general'
                                   , _a[SpecialTab.filler] = 'tab-chat-filler'
                                   , _a);
        var CONTEXTMENU_ID = 'player-contextmenu';
        var CHAT_ICONS = [
            {
                key: ''
                , title: ''
            }
            , {
                key: 'halloween2015'
                , title: 'Halloween Gamer (2015)'
            }
            , {
                key: 'christmas2015'
                , title: 'Chirstmas Gamer (2015)'
            }
            , {
                key: 'easter2016'
                , title: 'Easter Gamer (2016)'
            }
            , {
                key: 'halloween2016'
                , title: 'Halloween Gamer (2016)'
            }
            , {
                key: 'christmas2016'
                , title: 'Christmas Gamer (2016)'
            }
            , {
                key: 'dh1Max'
                , title: 'DH1 Pro'
            }
            , {
                key: 'hardcore'
                , title: 'Hardcore Player'
            }
            , {
                key: 'quest'
                , title: 'Questmaster'
            }
            , {
                key: 'maxMining'
                , title: 'Mastery in mining'
            }
            , {
                key: 'maxCrafting'
                , title: 'Mastery in crafting'
            }
            , {
                key: 'maxWC'
                , title: 'Mastery in woodcutting'
            }
            , {
                key: 'maxFarming'
                , title: 'Mastery in farming'
            }
            , {
                key: 'maxBrewing'
                , title: 'Mastery in brewing'
            }
            , {
                key: 'maxCombat'
                , title: 'Mastery in combat'
            }
            , {
                key: 'maxMagic'
                , title: 'Mastery in magic'
            }
            , {
                key: 'maxFishing'
                , title: 'Mastery in fishing'
            }
            , {
                key: 'maxCooking'
                , title: 'Mastery in cooking'
            }
            , {
                key: 'maxLevel'
                , title: 'Mastery of all skills'
            }
            , {
                key: 'birdcage'
                , title: 'Stole a birdcage'
            }
            , {
                key: 'achievement'
                , title: 'Achievement Hunter'
            }
            , {
                key: 'pinkPartyHat'
                , title: 'Pink Party Hat'
            }
            , {
                key: 'redPartyHat'
                , title: 'Red Party Hat'
            }
            , {
                key: 'greenPartyHat'
                , title: 'Green Party Hat'
            }
            , {
                key: 'yellowPartyHat'
                , title: 'Yellow Party Hat'
            }
            , {
                key: 'whitePartyHat'
                , title: 'White Party Hat'
            }
            , {
                key: 'bluePartyHat'
                , title: 'Blue Party Hat'
            }
            , {
                key: 'easter2018'
                , title: 'Easter Gamer (2018)'
            }
            , {
                key: 'firstEvent20181st'
                , title: '1st place Gamer (#1 event 2018)'
            }
            , {
                key: 'firstEvent20182nd'
                , title: '2nd place Gamer (#1 event 2018)'
            }
            , {
                key: 'firstEvent20183rd'
                , title: '3rd place Gamer (#1 event 2018)'
            }
            , {
                key: 'firstEvent20184th'
                , title: '4th place Gamer (#1 event 2018)'
            }
            , {
                key: 'robotWaves'
                , title: 'Completed All Robot Waves'
            }
            , {
                key: 'teamAccount'
                , title: 'Team player'
            }
            , {
                key: 'halloween2018'
                , title: 'Halloween Gamer (2018)'
            }
            , {
                key: 'secondEvent20184th'
                , title: '4th place Gamer (#2 event 2018)'
            }
            , {
                key: 'secondEvent20183rd'
                , title: '3rd place Gamer (#2 event 2018)'
            }
            , {
                key: 'secondEvent20182nd'
                , title: '2nd place Gamer (#2 event 2018)'
            }
            , {
                key: 'secondEvent20181st'
                , title: '1st place Gamer (#2 event 2018)'
            }
            , {
                key: 'christmas2018'
                , title: 'Christmas Gamer (2018)'
            }
        ];
        var getUnknownChatIcon = function (icon)
        {
            addStyle(`\n.chat-msg .user .icon.${"unknown"+icon}::before\t{ background-image: url('images/chat-icons/${icon}.png'); }`)
            let obj = {
                key: 'unknown'+icon
                , title: 'unknown icon #'+icon
            };
            CHAT_ICONS[icon] = obj
            return obj
        };
        var CHAT_TAGS = [
            null
            , {
                key: 'donor'
                , name: ''
            }
            , {
                key: 'contributor'
                , name: 'Contributor'
            }
            , {
                key: 'mod'
                , name: 'Moderator'
            }
            , {
                key: 'dev'
                , name: 'Dev'
            }
            , {
                key: 'yell'
                , name: 'Server Message'
            }
        ];
        var LOCALE = 'en-US';
        var LOCALE_OPTIONS = {
            hour12: false
            , year: 'numeric'
            , month: 'long'
            , day: 'numeric'
            , hour: '2-digit'
            , minute: '2-digit'
            , second: '2-digit'
        };
        // game commands
        var COMMANDS = [
            'pm'
            , 'mute'
            , 'clear'
            , 'ipmute'
        ];
        var CLEAR_CMD = 'clear';
        var TUTORIAL_CMD = 'tutorial';
        // load chat history
        var chatHistory = store.get(CHAT_HISTORY_KEY) || [];
        var pmHistory = [];
        // store chat colors for each user
        var user2Color;
        var usedColors;
        // reserve color for special messages (e.g. server messages): white
        var reservedColors = ['#ffffff'];
        // message chunks
        var msgChunkMap = new Map();
        // for adding elements at startup
        var chatboxFragments = new Map();
        var chatInitialized = false;
        // find index of last message which is not a pm
        var isLastMsgNotReload = false;
        for (var i = chatHistory.length - 1; i >= 0; i--)
        {
            if (!isDataPM(chatHistory[i]))
            {
                isLastMsgNotReload = chatHistory[i].type != Type.reload;
                break;
            }
        }
        // insert a placeholder for a reloaded chat
        if (isLastMsgNotReload)
        {
            RELOADED_CHAT_DATA.timestamp = (new Date()).getTime();
            chatHistory.push(RELOADED_CHAT_DATA);
        }

        function isMuted(user)
        {
            return user !== win.username
            && win.mutedPeople.some(function (name)
                                    {
                return user.indexOf(name) > -1;
            });
        }

        function isSpam(data)
        {
            // allow all own messages, messages from contributors, mods, devs and all server messages
            if (data.username === win.username || data.tag != Tag.none)
            {
                return false;
            }
            /**
		 * get last message of current user
		 */
            var historyIndex = chatHistory.indexOf(data);
            if (historyIndex == -1)
            {
                historyIndex = chatHistory.length;
            }
            var lastData = null;
            for (var i = historyIndex - 1; i >= 0 && (lastData === null); i--)
            {
                var dataBefore = chatHistory[i];
                if (dataBefore.username === data.username)
                {
                    lastData = dataBefore;
                }
            }
            /**
		 * compare message and don't allow the same message twice
		 */
            if (lastData
                && lastData.msg === data.msg
                && (data.timestamp - lastData.timestamp) < MIN_DIFF_REPEATED_MSG)
            {
                return true;
            }
            return false;
        }

        function saveKeywordList()
        {
            store.set(KEYWORD_LIST_KEY, chat.keywordList);
        }

        function addKeyword(keyword)
        {
            if (keyword !== '' && chat.keywordList.indexOf(keyword) === -1)
            {
                chat.keywordList.push(keyword);
                saveKeywordList();
                return true;
            }
            return false;
        }
        chat.addKeyword = addKeyword;

        function removeKeyword(keyword)
        {
            var index = chat.keywordList.indexOf(keyword);
            if (index !== -1)
            {
                chat.keywordList.splice(index, 1);
                saveKeywordList();
                return true;
            }
            return false;
        }
        chat.removeKeyword = removeKeyword;

        function handleScrolling(chatbox)
        {
            if (win.isAutoScrolling)
            {
                setTimeout(function ()
                           {
                    return chatbox.scrollTop = chatbox.scrollHeight;
                });
            }
        }
        // for chat messages which arrive before DOMContentLoaded and can not be displayed since the DOM isn't ready
        function processChatData(username, iconString, tagString, msg, isPM)
        {
            var tag = parseInt(tagString, 10);
            var userlevel = 0;
            var type = Type.normal;
            if (isPM == 1)
            {
                var match = msg.match(/^\s*\[(PM from|Sent to) ([A-Za-z0-9_ ]+)\]: (.+?)\s*$/) || ['', '', username, msg];
                type = match[1] == 'Sent to' ? Type.pmSent : Type.pmReceived;
                username = match[2];
                if (username !== 'sexy_squid')
                {
                    username = username.replace(/_/g, ' ');
                }
                msg = match[3];
            }
            else if (tag == Tag.server)
            {
                type = Type.serverMsg;
            }
            else
            {
                var match = msg.match(/^\s*\((\d+)\): (.+?)\s*$/);
                if (match)
                {
                    userlevel = parseInt(match[1], 10);
                    msg = match[2];
                }
                else
                {
                    userlevel = win.getGlobalLevel();
                }
            }
            // unlinkify when using DH2QoL to store the plain message
            if (win.addToChatBox.toString().includes('linkify(arguments[3])'))
            {
                msg = msg.replace(/<a href='([^']+)' target='_blank'>\1<\/a>/ig, '$1');
            }
            if (type == Type.pmSent)
            {
                // turn some critical characters into HTML entities
                msg = msg.replace(/[<>]/g, function (char)
                                  {
                    return '&#' + char.charCodeAt(0) + ';';
                });
            }
            return {
                timestamp: now()
                , username: username
                , userlevel: userlevel
                , icon: parseInt(iconString, 10)
                , tag: tag
                , type: type
                , msg: msg
            };
        }

        function saveChatHistory()
        {
            store.set(CHAT_HISTORY_KEY, chatHistory);
        }

        function savePmHistory()
        {
            store.set(PM_HISTORY_KEY, pmHistory);
        }

        function add2ChatHistory(data)
        {
            if (data.type === Type.pmReceived
                || data.type === Type.pmSent)
            {
                pmHistory.push(data);
                pmHistory = pmHistory.slice(-MAX_PM_HISTORY_LENGTH);
                savePmHistory();
            }
            else
            {
                chatHistory.push(data);
                chatHistory = chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH);
                saveChatHistory();
            }
        }

        function username2Id(username)
        {
            return username.replace(/ /g, '_');
        }

        function setNewCounter(tab, num, force)
        {
            if (force === void 0)
            {
                force = false;
            }
            var panel = getChatPanel(tab.dataset.username || '');
            if (force
                || !tab.classList.contains('selected')
                || !win.isAutoScrolling && panel.scrollHeight > panel.scrollTop + panel.offsetHeight)
            {
                tab.dataset.new = num.toString();
            }
        }

        function incrementNewCounter(tab)
        {
            setNewCounter(tab, parseInt(tab.dataset.new || '0', 10) + 1);
        }

        function getChatTab(username, specialTab)
        {
            var id = (specialTab != null)
            ? CHAT_SPECIAL_TAB_ID[specialTab]
            : PM_CHAT_TAB_PREFIX + username2Id(username);
            var tab = document.getElementById(id);
            if (!tab)
            {
                tab = document.createElement('div');
                tab.className = 'chat-tab';
                if (specialTab != null)
                {
                    tab.classList.add(SpecialTab[specialTab]);
                }
                tab.id = id;
                tab.dataset.username = username;
                setNewCounter(tab, 0, true);
                if (username.length > 0)
                {
                    tab.textContent = username;
                    // thanks /u/Spino-Prime for pointing out this was missing
                    var closeSpan = document.createElement('span');
                    closeSpan.className = 'close';
                    tab.appendChild(closeSpan);
                }
                var chatTabs = document.getElementById(CHAT_TABS_ID);
                var filler = chatTabs.querySelector('.filler');
                if (filler)
                {
                    chatTabs.insertBefore(tab, filler);
                }
                else
                {
                    chatTabs.appendChild(tab);
                }
            }
            return tab;
        }

        function getChatPanel(username)
        {
            var id = username == '' ? GENERAL_CHAT_DIV_ID : PM_CHAT_DIV_PREFIX + username2Id(username);
            var panel = document.getElementById(id);
            if (!panel)
            {
                panel = document.createElement('div');
                panel.setAttribute('disabled', 'disabled');
                panel.id = id;
                panel.className = CHAT_CLASS;
                var defaultChat = document.getElementById(DEFAULT_CHAT_DIV_ID);
                var height = defaultChat.style.height;
                panel.style.height = height;
                var chatDiv = defaultChat.parentElement;
                chatDiv.insertBefore(panel, defaultChat);
            }
            return panel;
        }

        function changeChatTab(oldTab, newTab)
        {
            if (oldTab)
            {
                oldTab.classList.remove('selected');
                var oldChatPanel = void 0;
                if (oldTab.classList.contains('default'))
                {
                    oldChatPanel = document.getElementById(DEFAULT_CHAT_DIV_ID);
                }
                else
                {
                    oldChatPanel = getChatPanel(oldTab.dataset.username || '');
                }
                oldChatPanel.classList.remove('selected');
            }
            newTab.classList.add('selected');
            setNewCounter(newTab, 0, true);
            var newChatPanel;
            if (newTab.classList.contains('default'))
            {
                newChatPanel = document.getElementById(DEFAULT_CHAT_DIV_ID);
            }
            else
            {
                newChatPanel = getChatPanel(newTab.dataset.username || '');
            }
            newChatPanel.classList.add('selected');
            var toUsername = newTab.dataset.username;
            var newTextPlaceholder = toUsername == '' ? win.username + ':' : 'PM to ' + toUsername + ':';
            document.getElementById(CHAT_INPUT_ID).placeholder = newTextPlaceholder;
            handleScrolling(newChatPanel);
        }

        function clearChat(username)
        {
            if (username === '')
            {
                // clean server chat
                chatHistory = [];
                saveChatHistory();
            }
            else
            {
                // delete pms stored for that user
                for (var i = 0; i < pmHistory.length; i++)
                {
                    var data = pmHistory[i];
                    if (data.username == username)
                    {
                        pmHistory.splice(i, 1);
                        i--;
                    }
                }
                savePmHistory();
            }
            // clear pm-chat panel
            var panel = getChatPanel(username);
            while (panel.children.length > 0)
            {
                panel.removeChild(panel.children[0]);
            }
            msgChunkMap.delete(username);
            return panel;
        }

        function closeChatTab(username)
        {
            // clear pm-chat panel and remove message-history
            clearChat(username);
            // remove pm-tab (and change tab if necessary)
            var selectedTab = getSelectedTab();
            var tab2Close = getChatTab(username, null);
            if (selectedTab.dataset.username == username)
            {
                var generalTab = getChatTab('', SpecialTab.general);
                changeChatTab(tab2Close, generalTab);
            }
            var tabContainer = tab2Close.parentElement;
            tabContainer.removeChild(tab2Close);
        }

        function isDataPM(data)
        {
            return data.type === Type.pmSent || data.type === Type.pmReceived;
        }

        function colorizeMsg(username)
        {
            if (username == '')
            {
                return null;
            }
            if (!user2Color.has(username))
            {
                var color = void 0;
                do {
                    var colorizer = settings.getSub(settings.KEY.colorizeChat, 'colorizer');
                    if (colorizer == 1)
                    {
                        color = colorGenerator.getRandom(
                            {
                                luminosity: 'light'
                            });
                    }
                    else if (colorizer == 2)
                    {
                        color = colorGenerator.getRandom(
                            {
                                luminosity: 'dark'
                            });
                    }
                    else
                    {
                        color = colorGenerator.getEquallyDistributed();
                    }
                } while (usedColors.has(color));
                user2Color.set(username, color);
                usedColors.add(color);
                addStyle("\n#" + CHAT_BOX_ID + "." + COLORIZE_CLASS + " .chat-msg[data-username=\"" + username + "\"]\n{\n\tbackground-color: " + color + ";\n}\n\t\t\t", 'name-color');
            }
            return user2Color.get(username);
        }

        function createMessageSegment(data)
        {
            var isThisPm = isDataPM(data);
            var msgUsername = data.type === Type.pmSent ? win.username : data.username;
            var history = isThisPm ? pmHistory : chatHistory;
            var historyIndex = history.indexOf(data);
            var isSameUser = null;
            var isSameTime = null;
            for (var i = historyIndex - 1; i >= 0 && (isSameUser === null || isSameTime === null); i--)
            {
                var dataBefore = history[i];
                if (isThisPm === isDataPM(dataBefore))
                {
                    if (isSameUser === null)
                    {
                        var beforeUsername = dataBefore.type == Type.pmSent ? win.username : dataBefore.username;
                        isSameUser = beforeUsername === msgUsername;
                    }
                    if (dataBefore.type != Type.reload)
                    {
                        isSameTime = Math.floor(data.timestamp / 1000 / 60) - Math.floor(dataBefore.timestamp / 1000 / 60) === 0;
                    }
                }
            }
            var d = new Date(data.timestamp);
            var hour = (d.getHours() < 10 ? '0' : '') + d.getHours();
            var minute = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
            var icon = CHAT_ICONS[data.icon] || getUnknownChatIcon(data.icon);
            if(!isThisPm){
                if(data.username == "jellybones"){
                    icon = {
                        key: 'jellybones',
                        title: 'A skull made of jelly'
                    }
                }
                if(data.username == "stardustlove"){
                    icon = {
                        key: 'stardustlove',
                        title: 'A true stardust lover'
                    }
                }
            }
            var tag = CHAT_TAGS[data.tag] ||
                {
                    key: ''
                    , name: ''
                };
            let formattedMsg = data.msg
            .replace(/<a href='(.+?)' target='_blank'>\1<\/a>/g, '$1')
            .replace(/(https?:\/\/[^\s"<>]+)/g, '<a target="_blank" href="$1">$1</a>');
            colorizeMsg(msgUsername);
            var msgTitle = data.type == Type.reload ? 'Chat loaded on ' + d.toLocaleString(LOCALE, LOCALE_OPTIONS) : '';
            var user = data.type === Type.serverMsg ? 'Server Message' : msgUsername;
            var levelAppendix = data.type == Type.normal ? ' (' + data.userlevel + ')' : '';
            var userTitle = data.tag != Tag.server ? tag.name : '';
            return "<span class=\"chat-msg\" data-type=\"" + data.type + "\" data-tag=\"" + tag.key + "\" data-username=\"" + msgUsername + "\">"
                + ("<span\n\t\t\t\tclass=\"timestamp\"\n\t\t\t\tdata-timestamp=\"" + data.timestamp + "\"\n\t\t\t\tdata-same-time=\"" + isSameTime + "\">" + hour + ":" + minute + "</span>")
                + ("<span class=\"user\" data-name=\"" + msgUsername + "\" data-same-user=\"" + isSameUser + "\">")
                + ("<span class=\"icon " + icon.key + "\" title=\"" + icon.title + "\"></span>")
                + ("<span class=\"name chat-tag-" + tag.key + "\" title=\"" + userTitle + "\">" + user + levelAppendix + ":</span>")
                + "</span>"
                + ("<span class=\"msg\" title=\"" + msgTitle + "\">" + formattedMsg + "</span>")
                + "</span>";
        }

        function add2Chat(data)
        {
            if (!chatInitialized)
            {
                return;
            }
            var isThisPm = isDataPM(data);
            // don't mute pms (you can just ignore pm-tab if you like)
            if (!isThisPm && isMuted(data.username))
            {
                return;
            }
            var userKey = isThisPm ? data.username : '';
            if (isThisPm)
            {
                win.lastPMUser = data.username;
            }

            //remove
            if(win.username == "messagebot"){
                //console.log(data,postEventMessage);
                if(postEventMessage["agrodon"] && data.username == "agrodon" && data.msg.includes("#event")){
                    let inputEl = document.getElementById("chat-input-text");
                    inputEl.value = "no.";
                    win.sendChat(inputEl);
                }else if(data.msg.includes("#eventType") && !data.username.includes("messagebot")){
                    if(postEventMessage["#eventType"]){
                        console.log(data);
                        let inputEl = document.getElementById("chat-input-text");
                        inputEl.value = "The upcoming event is a meteor made of Promethium and Runite. You get loot based on your mining level";
                        win.sendChat(inputEl);
                        postEventMessage["#eventType"]=false;
                        console.log("5 min delay eventType")
                        setTimeout(function(){postEventMessage["#eventType"]=true;console.log("ready eventType")},5*60*1000);
                    }
                }else if(postEventMessage["#event"] && data.msg.includes("#event") && !data.username.includes("messagebot")){
                    console.log(data);
                    let inputEl = document.getElementById("chat-input-text");
                    inputEl.value = "The sigil vote has happened, the community voted for the snowman sigil, found here https://www.diamondhunt.co/images/snowmanSigil.png";
                    win.sendChat(inputEl);
                    postEventMessage["#event"]=false;
                    console.log("5 min delay event")
                    setTimeout(function(){postEventMessage["#event"] = true;console.log("ready event")},5*60*1000);
                }
            }
            // username is 3-12 characters long
            var chatbox = getChatPanel(userKey);
            var msgChunk = msgChunkMap.get(userKey);
            if (!msgChunk || msgChunk.children.length >= MSG_CHUNK_SIZE)
            {
                msgChunk = document.createElement('div');
                msgChunk.className = 'msg-chunk';
                msgChunkMap.set(userKey, msgChunk);
                if (chatboxFragments != null)
                {
                    if (!chatboxFragments.has(userKey))
                    {
                        chatboxFragments.set(userKey, document.createDocumentFragment());
                    }
                    chatboxFragments.get(userKey).appendChild(msgChunk);
                }
                else
                {
                    chatbox.appendChild(msgChunk);
                }
            }
            var tmp = document.createElement('templateWrapper');
            let formattedMessage = createMessageSegment(data);
            //console.log(formattedMessage);
            let preText = '<span class="msg" title="">'
            let preMessage = formattedMessage.slice(0,formattedMessage.indexOf(preText)+preText.length);
            let postMessage = '</span></span>';
            let message = formattedMessage.slice(preMessage.length,-postMessage.length);
            let regex = /<a[\s\w\\"_=:/.#]*>https?:\/\/[^\s"<>]+<\/a>/g
            let linkList = message.match(regex);
            let messageList = message.split(regex);
            console.log(data);
            regex = new RegExp("#[A-z0-9/]+","g");
            for(let i = 0; i < messageList.length; i++){
                let fullMessage = messageList[i];
                let imageTags = fullMessage.match(regex);
                if(imageTags){
                    //console.log(imageTags);
                    for(let j = 0; j < imageTags.length; j++){
                        let imageTitle = imageTags[j];
                        let index = fullMessage.indexOf(imageTitle)-1;
                        if(index>=0 && fullMessage.charAt(index)==="&")
                            continue;
                        let url = "images/"+imageTitle.slice(1)+".png";
                        let regexp = new RegExp("\\"+imageTitle+"\\b","g")
                        let tagId = "msgImg"+data.timestamp+i+j;
                        let title = decamelize(imageTitle.slice(1), " ");
                        fullMessage = fullMessage.replace(regexp, '<span id="'+tagId+'">'+imageTitle+'</span>');
                        let image = new Image();
                        image.src = url;
                        image.onload = ()=>{
                            document.getElementById(tagId).innerHTML = '<img title="'+title+'" src='+url+' class="image-icon-21" />';
                            //console.log(tagId);
                        }
                        image.onerror = ()=>{
                            let $tag = $("#"+tagId)
                            let $tagParent = $tag.parent()
                            $tag.after(imageTitle);
                            $tag[0].remove()
                            $tagParent[0].normalize();
                            //console.log(tagId, " not a link");
                        }
                    }
                }
                messageList[i] = fullMessage
            }
            console.log(linkList, messageList);
            let totalMessage = "";
            for(let i = 0; i < messageList.length; i++){
                totalMessage+=messageList[i];
                if(linkList && i<linkList.length)
                    totalMessage+=linkList[i];
            }
            tmp.innerHTML = preMessage+totalMessage+postMessage;
            msgChunk.appendChild(tmp.children[0]);
            handleScrolling(chatbox);
            // add delay because handleScrolling is will set scrollTop delayed
            setTimeout(function ()
                       {
                var chatTab = getChatTab(userKey, isThisPm ? null : SpecialTab.general);
                incrementNewCounter(chatTab);
            });
        }

        function decamelize(str, separator){
            separator = typeof separator === 'undefined' ? '_' : separator;

            return str
                .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
                .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
                .toLowerCase()
                .replace(/^\w/, c => c.toUpperCase());
        }

        function applyChatStyle()
        {
            addStyle("\ndiv.div-chat-area\n{\n\tpadding-left: 0;\n}\nspan.chat-msg\n{\n\tdisplay: flex;\n\tmin-height: 21px;\
\n\tpadding: 1px 0;\n\tpadding-left: 5px;\n}\n#" + CHAT_BOX_ID + ":not(." + COLORIZE_CLASS + ") span.chat-msg:nth-child(2n)\
\n{\n\tbackground-color: hsla(0, 0%, 90%, 1);\n}\n.chat-msg[data-type=\"" + Type.reload + "\"]\n{\n\tfont-size: 0.8rem;\
\n\tline-height: 1.2rem;\n}\n.chat-msg .timestamp\n{\n\tdisplay: none;\n}\n#" + CHAT_BOX_ID + ".showTimestamps \
.chat-msg:not([data-type=\"" + Type.reload + "\"]) .timestamp\n{\n\tcolor: hsla(0, 0%, 50%, 1);\n\tdisplay: inline-block;\
\n\tfont-size: .9rem;\n\tmargin: 0;\n\tmargin-right: 5px;\n\tposition: relative;\n\twidth: 2.5rem;\n}\n.chat-msg \
.timestamp[data-same-time=\"true\"]\n{\n\tcolor: hsla(0, 0%, 50%, .1);\n}\n.chat-msg:not([data-type=\"" + Type.reload + "\"]) \
.timestamp:hover::after\n{\n\tbackground-color: hsla(0, 0%, 12%, 1);\n\tborder-radius: .2rem;\n\tcontent: attr(data-fulltime);\
\n\tcolor: hsla(0, 0%, 100%, 1);\n\tline-height: 1.35rem;\n\tpadding: .4rem .8rem;\n\tpointer-events: none;\n\tposition: absolute;\
\n\tleft: 2.5rem;\n\ttop: -0.4rem;\n\ttext-align: center;\n\twhite-space: nowrap;\n}\n\n#" + CHAT_BOX_ID + ".showTags \
.chat-msg[data-type=\"" + Type.pmReceived + "\"] { color: purple; }\n#" + CHAT_BOX_ID + ".showTags \
.chat-msg[data-type=\"" + Type.pmSent + "\"] { color: purple; }\n#" + CHAT_BOX_ID + ".showTags \
.chat-msg[data-type=\"" + Type.serverMsg + "\"] { color: blue; }\n#" + CHAT_BOX_ID + ".showTags \
.chat-msg[data-tag=\"contributor\"] { color: green; }\n#" + CHAT_BOX_ID + ".showTags .chat-msg[data-tag=\"mod\"] \
{ color: #669999; }\n#" + CHAT_BOX_ID + ".showTags .chat-msg[data-tag=\"dev\"] { color: #666600; }\n.chat-msg:not([data-type=\"" + Type.reload + "\"]) \
.user\n{\n\tflex: 0 0 132px;\n\tmargin-right: 5px;\n\twhite-space: nowrap;\n}\n#" + GENERAL_CHAT_DIV_ID + " .chat-msg:not([data-type=\"" + Type.reload + "\"]) \
.user\n{\n\tflex-basis: 182px;\n}\n#" + CHAT_BOX_ID + ".showIcons #" + GENERAL_CHAT_DIV_ID + " .chat-msg:not([data-type=\"" + Type.reload + "\"]) \
.user\n{\n\tpadding-left: 22px;\n}\n.chat-msg .user[data-same-user=\"true\"]:not([data-name=\"\"])\n{\n\tcursor: default;\n\topacity: 0;\n}\n\n.chat-msg \
.user .icon\n{\n\tdisplay: none;\n}\n#" + CHAT_BOX_ID + ".showIcons .chat-msg .user .icon\n{\n\tdisplay: inline-block;\n\tmargin-left: -22px;\n}\n.chat-msg \
.user .icon.unknown > img,\n.chat-msg .user .icon:not(.unknown)::before\n{\n\tbackground-size: 20px 20px;\n\tcontent: '';\n\tdisplay: inline-block;\
\n\tmargin-right: 2px;\n\twidth: 20px;\n\theight: 20px;\n\tvertical-align: middle;\n}\n.chat-msg \
.user .icon.jellybones::before\t{ background-image: url('images/skull.png'); }\n\n.chat-msg \
.user .icon.stardustlove::before\t{ background-image: url('images/stardust.png'); }\n\n.chat-msg \
.user:not([data-same-user=\"true\"]) .name\n{\n\tcolor: rgba(0, 0, 0, 0.7);\n\tcursor: pointer;\n}\n.chat-msg \
.user .name.chat-tag-donor::before\n{\n\tbackground-image: url('images/chat-icons/donor.png');\n\tbackground-size: 20px 20px;\
\n\tcontent: '';\n\tdisplay: inline-block;\n\theight: 20px;\n\twidth: 20px;\n\tvertical-align: middle;\n}\n.chat-msg \
.user .name.chat-tag-yell\n{\n\tcursor: default;\n}\n#" + CHAT_BOX_ID + ".showTags .chat-msg \
.user .name.chat-tag-contributor,\n#" + CHAT_BOX_ID + ".showTags .chat-msg \
.user .name.chat-tag-mod,\n#" + CHAT_BOX_ID + ".showTags .chat-msg \
.user .name.chat-tag-dev,\n#" + CHAT_BOX_ID + ".showTags .chat-msg \
.user .name.chat-tag-yell\n{\n\tcolor: white;\n\tdisplay: inline-block;\n\tfont-size: 10pt;\n\tmargin-bottom: -1px;\n\tmargin-top: -1px;\
\n\tpadding-bottom: 2px;\n\ttext-align: center;\n\t/* 2px border, 10 padding */\n\twidth: calc(100% - 2*1px - 2*5px);\
\n}\n#" + CHAT_BOX_ID + ":not(.showTags) .chat-msg .user .name.chat-tag-contributor,\n#" + CHAT_BOX_ID + ":not(.showTags) .chat-msg \
.user .name.chat-tag-mod,\n#" + CHAT_BOX_ID + ":not(.showTags) .chat-msg .user .name.chat-tag-dev,\n#" + CHAT_BOX_ID + ":not(.showTags) .chat-msg \
.user .name.chat-tag-yell\n{\n\tbackground: initial;\n\tborder: inherit;\n\tfont-family: inherit;\n\tfont-size: inherit;\n\tpadding: initial;\
\n}\n\n.chat-msg[data-type=\"" + Type.reload + "\"] .user > *,\n.chat-msg[data-type=\"" + Type.pmReceived + "\"] .user > .icon,\
\n.chat-msg[data-type=\"" + Type.pmSent + "\"] .user > .icon\n{\n\tdisplay: none;\n}\n\n.chat-msg .msg\n{\n\tmin-width: 0;\n\toverflow: hidden;\
\n\tword-wrap: break-word;\n}\n\n#" + CHAT_BOX_ID + " ." + CHAT_CLASS + "\n{\n\twidth: calc(100% - 5px);\n\theight: 130px;\n\tdisplay: none;\n}\n#"
+ CHAT_BOX_ID + " ." + CHAT_CLASS + ".selected\n{\n\tdisplay: block;\n}\n#" + CHAT_TABS_ID + "\n{\n\tdisplay: flex;\n\tmargin: 10px -5px -6px;\
\n\tflex-wrap: wrap;\n}\n#" + CHAT_TABS_ID + " .chat-tab\n{\n\tbackground-color: gray;\n\tborder-top: 1px solid black;\n\tborder-right: 1px solid black;\
\n\tcursor: pointer;\n\tdisplay: inline-block;\n\tfont-weight: normal;\n\tpadding: 0.3rem .6rem;\n\tposition: relative;\n}\n#" + CHAT_TABS_ID +
" .chat-tab.selected\n{\n\tbackground-color: transparent;\n\tborder-top-color: transparent;\n}\n#" + CHAT_TABS_ID + " .chat-tab.default\n{\n\tdisplay: none;\
\n}\n#" + CHAT_TABS_ID + " .chat-tab.filler\n{\n\tbackground-color: hsla(0, 0%, 90%, 1);\n\tborder-right: 0;\n\tbox-shadow: inset 5px 5px 5px -5px rgba(0, 0, 0, 0.5);\
\n\tcolor: transparent;\n\tcursor: default;\n\tflex-grow: 1;\n}\n#" + CHAT_TABS_ID + " .chat-tab::after\n{\n\tcolor: white;\n\tcontent: '(' attr(data-new) ')';\
\n\tfont-size: .9rem;\n\tfont-weight: bold;\n\tmargin-left: .4rem;\n}\n#" + CHAT_TABS_ID + " .chat-tab.selected::after\n{\n\tcolor: gray;\n}\n#" + CHAT_TABS_ID +
" .chat-tab[data-new=\"0\"]::after\n{\n\tcolor: inherit;\n\tfont-weight: normal;\n}\n#" + CHAT_TABS_ID + " .chat-tab:not(.general).selected::after,\n#" + CHAT_TABS_ID +
" .chat-tab:not(.general):hover::after\n{\n\tvisibility: hidden;\n}\n#" + CHAT_TABS_ID + " .chat-tab:not(.general).selected .close::after,\n#" + CHAT_TABS_ID +
" .chat-tab:not(.general):hover .close::after\n{\n\tcontent: '\u00D7';\n\tfont-size: 1.5rem;\n\tposition: absolute;\n\ttop: 0;\n\tright: .6rem;\n\tbottom: 0;\n}\n\n#"+
CONTEXTMENU_ID + "\n{\n\tbox-shadow: rgba(0, 0, 0, 0.8) 4px 4px 4px -2px;\n\tposition: fixed;\n}\n#" + CONTEXTMENU_ID + " .ui-widget-header\n{\n\tcursor: default;\
\n\tpadding: .25rem;\n}\n\t\t\n.image-icon-21{\n\theight:21px;\n\twidth:21px;\n\tvertical-align:middle;\n}\n");
            for(let i = 1; i < CHAT_ICONS.length; i++){
                let icon = CHAT_ICONS[i];
                addStyle(`\n.chat-msg .user .icon.${icon.key}::before\t{ background-image: url('images/chat-icons/${i}.png'); }`)
            }
        }

        function initColorizer(init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var usernameList = user2Color && Array.from(user2Color.keys()) || [];
            user2Color = new Map();
            usedColors = new Set();
            for (var _i = 0, reservedColors_1 = reservedColors; _i < reservedColors_1.length; _i++)
            {
                var color = reservedColors_1[_i];
                usedColors.add(color);
            }
            var colorStyle = getStyle('name-color');
            colorStyle.innerHTML = '';
            for (var _a = 0, usernameList_1 = usernameList; _a < usernameList_1.length; _a++)
            {
                var username = usernameList_1[_a];
                colorizeMsg(username);
            }
            if (init)
            {
                settings.observeSub(settings.KEY.colorizeChat, 'colorizer', function ()
                                    {
                    return initColorizer();
                });
            }
        }

        function addIntelligentScrolling()
        {
            // add checkbox instead of button for toggling auto scrolling
            var btn = document.querySelector('input[value="Toggle Autoscroll"]');
            var btnParent = btn.parentElement;
            var checkboxId = 'chat-toggle-autoscroll';
            // create checkbox
            var toggleCheckbox = document.createElement('input');
            toggleCheckbox.type = 'checkbox';
            toggleCheckbox.id = checkboxId;
            toggleCheckbox.checked = true;
            // create label
            var toggleLabel = document.createElement('label');
            toggleLabel.htmlFor = checkboxId;
            toggleLabel.textContent = 'Autoscroll';
            btnParent.insertBefore(toggleCheckbox, btn);
            btnParent.insertBefore(toggleLabel, btn);
            btn.style.display = 'none';
            var chatArea = document.getElementById(GENERAL_CHAT_DIV_ID);
            var showScrollTextTimeout = null;

            function setAutoScrolling(value, full)
            {
                if (full === void 0)
                {
                    full = false;
                }
                if (win.isAutoScrolling != value)
                {
                    toggleCheckbox.checked = value;
                    win.isAutoScrolling = value;
                    var icon_2 = 'none';
                    var color_1 = value ? 'lime' : 'red';
                    var text_1 = (value ? 'En' : 'Dis') + 'abled' + (full ? ' Autoscroll' : '');
                    if (full)
                    {
                        if (showScrollTextTimeout)
                        {
                            win.clearTimeout(showScrollTextTimeout);
                        }
                        showScrollTextTimeout = win.setTimeout(function ()
                                                               {
                            return win.scrollText(icon_2, color_1, text_1);
                        }, 300);
                    }
                    else
                    {
                        win.scrollText(icon_2, color_1, text_1);
                    }
                    setNewCounter(getSelectedTab(), 0, true);
                    return true;
                }
                return false;
            }
            toggleCheckbox.addEventListener('change', function ()
                                            {
                setAutoScrolling(this.checked);
                if (this.checked && settings.get(settings.KEY.intelligentScrolling))
                {
                    chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
                }
            });
            var placeholderTemplate = document.createElement('div');
            placeholderTemplate.className = 'placeholder';
            var childStore = new WeakMap();

            function scrollHugeChat()
            {
                // # of children
                var chunkNum = chatArea.children.length;
                // start chunk hiding at a specific amount of chunks
                if (chunkNum < CHUNK_HIDING_MIN_CHUNKS)
                {
                    return;
                }
                var visibleTop = chatArea.scrollTop;
                var visibleBottom = visibleTop + chatArea.clientHeight;
                var referenceTop = visibleTop - win.innerHeight;
                var referenceBottom = visibleBottom + win.innerHeight;
                var top = 0;
                // never hide the last element since its size may change at any time when a new message gets appended
                for (var i = 0; i < chunkNum - 1; i++)
                {
                    var child = chatArea.children[i];
                    var height = child.clientHeight;
                    var bottom = top + height;
                    var isVisible = top >= referenceTop && top <= referenceBottom
                    || bottom >= referenceTop && bottom <= referenceBottom
                    || top < referenceTop && bottom > referenceBottom;
                    var isPlaceholder = child.classList.contains('placeholder');
                    if (!isVisible && !isPlaceholder)
                    {
                        var newPlaceholder = placeholderTemplate.cloneNode(false);
                        newPlaceholder.style.height = height + 'px';
                        chatArea.replaceChild(newPlaceholder, child);
                        childStore.set(newPlaceholder, child);
                    }
                    else if (isVisible && isPlaceholder)
                    {
                        var oldChild = childStore.get(child);
                        chatArea.replaceChild(oldChild, child);
                        childStore.delete(child);
                    }
                    top = bottom;
                }
            }
            var delayedScrollStart = null;
            var delayedScrollTimeout = null;
            // does not consider pm tabs; may be changed in a future version?
            chatArea.addEventListener('scroll', function ()
                                      {
                if (settings.get(settings.KEY.intelligentScrolling))
                {
                    var scrolled2Bottom = (chatArea.scrollTop + chatArea.clientHeight) >= chatArea.scrollHeight - 1;
                    setAutoScrolling(scrolled2Bottom, true);
                }
                var n = now();
                if (delayedScrollStart == null)
                {
                    delayedScrollStart = n;
                }
                if (delayedScrollStart + 300 > n)
                {
                    if (delayedScrollTimeout)
                    {
                        win.clearTimeout(delayedScrollTimeout);
                    }
                    delayedScrollTimeout = win.setTimeout(function ()
                                                          {
                        delayedScrollStart = null;
                        delayedScrollTimeout = null;
                        scrollHugeChat();
                    }, 50);
                }
            });
        }

        function getSelectedTab()
        {
            return document.querySelector('#' + CHAT_TABS_ID + ' .chat-tab.selected');
        }

        function getSelectedTabUsername()
        {
            var selectedTab = getSelectedTab();
            return selectedTab.dataset.username || '';
        }

        function clickChatTab(newTab)
        {
            var oldTab = getSelectedTab();
            if (newTab == oldTab)
            {
                return;
            }
            changeChatTab(oldTab, newTab);
        }

        function clickCloseChatTab(tab)
        {
            var username = tab.dataset.username || '';
            var chatPanel = getChatPanel(username);
            if (chatPanel.children.length === 0
                || confirm("Do you want to close the pm tab of \"" + username + "\"?"))
            {
                closeChatTab(username);
            }
        }

        function checkSetting(init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var enabled = settings.get(settings.KEY.useNewChat);
            // dis-/enable chat tabs
            var chatTabs = document.getElementById(CHAT_TABS_ID);
            chatTabs.style.display = enabled ? '' : 'none';
            // dis-/enable checkbox for intelligent scrolling
            var intelScrollId = 'chat-toggle-intelligent-scroll';
            var input = document.getElementById(intelScrollId);
            if (input)
            {
                input.style.display = enabled ? '' : 'none';
            }
            var label = document.querySelector('label[for="' + intelScrollId + '"]');
            if (label)
            {
                label.style.display = enabled ? '' : 'none';
            }
            // virtually click on a tab
            var defaultTab = getChatTab('', SpecialTab.default);
            var generalTab = getChatTab('', SpecialTab.general);
            clickChatTab(enabled ? generalTab : defaultTab);
            if (init)
            {
                settings.observe(settings.KEY.useNewChat, function ()
                                 {
                    return checkSetting(false);
                });
            }
        }

        function addChatTabs()
        {
            var chatBoxArea = document.getElementById(CHAT_BOX_ID);
            var chatTabs = document.createElement('div');
            chatTabs.id = CHAT_TABS_ID;
            chatTabs.addEventListener('click', function (event)
                                      {
                var newTab = event.target;
                if (newTab.classList.contains('close'))
                {
                    return clickCloseChatTab(newTab.parentElement);
                }
                if (!newTab.classList.contains('chat-tab') || newTab.classList.contains('filler'))
                {
                    return;
                }
                clickChatTab(newTab);
            });
            chatBoxArea.appendChild(chatTabs);
            // default tab (for disabled new chat)
            getChatTab('', SpecialTab.default);
            // general server chat
            var generalTab = getChatTab('', SpecialTab.general);
            generalTab.textContent = 'Server';
            getChatPanel('');
            getChatTab('', SpecialTab.filler);
            var _sendChat = win.sendChat;
            win.sendChat = function (inputEl)
            {
                var msg = inputEl.value;
                var selectedTab = document.querySelector('.chat-tab.selected');
                if (selectedTab.dataset.username != '' && msg[0] != '/')
                {
                    inputEl.value = '/pm ' + (selectedTab.dataset.username || '').replace(/ /g, '_') + ' ' + msg;
                }
                _sendChat(inputEl);
            };
        }

        function switch2PmTab(username)
        {
            if (settings.get(settings.KEY.useNewChat)){
                var newTab = getChatTab(username, null);
                clickChatTab(newTab);
            }
        }

        function notifyPm(data)
        {
            notifications.event('Message from "' + data.username + '"'
                                , {
                body: data.msg
                , onclick: function ()
                {
                    return switch2PmTab(data.username);
                }
                , whenActive: getSelectedTab().dataset.username != data.username
            });
        }

        function checkMentionAndKeywords(data)
        {
            var lowerMsg = data.msg.toLowerCase();
            var usernameRegex = new RegExp('\\b' + win.username + '\\b', 'i');
            if (settings.getSub(settings.KEY.showNotifications, 'mention') && usernameRegex.test(lowerMsg))
                // if (lowerMsg.indexOf(win.username) > -1)
            {
                notifications.event('You\'ve been mentioned'
                                    , {
                    body: data.msg
                });
            }
            var match = [];
            for (var _i = 0, keywordList_1 = chat.keywordList; _i < keywordList_1.length; _i++)
            {
                var keyword = keywordList_1[_i];
                var regex = new RegExp('\\b' + keyword + '\\b', 'i');
                if (regex.test(lowerMsg))
                    // if (lowerMsg.indexOf(keyword) > -1)
                {
                    match.push(keyword);
                }
            }
            if (settings.getSub(settings.KEY.showNotifications, 'keyword') && match.length > 0)
            {
                notifications.event('Keyword: "' + match.join('", "') + '"'
                                    , {
                    body: data.msg
                });
            }
        }
        var addToChatBox_ = null;

        function newAddToChatBox(username, icon, tag, msg, isPM)
        {
            var data = processChatData(username, icon, tag, msg, isPM);
            var isThisSpam = false;
            if (isDataPM(data))
            {
                if (data.type == Type.pmSent)
                {
                    switch2PmTab(data.username);
                }
                else
                {
                    notifyPm(data);
                }
            }
            else
            {
                isThisSpam = settings.get(settings.KEY.enableSpamDetection) && isSpam(data);
                if (!isThisSpam && data.username != win.username)
                {
                    // check mentioning and keywords only for non-pms and only for messages from other players
                    checkMentionAndKeywords(data);
                }
            }
            if (isThisSpam)
            {
                console.info('detected spam:', data);
            }
            else
            {
                add2ChatHistory(data);
                add2Chat(data);
            }
            var fn = addToChatBox_ == null ? win.addToChatBox : addToChatBox_;
            fn(username, icon, tag, msg, isPM);
        }
        chat.newAddToChatBox = newAddToChatBox;

        function openPmTab(username)
        {
            if (username == win.username || username == '')
            {
                return;
            }
            var userTab = getChatTab(username, null);
            clickChatTab(userTab);
            var input = document.getElementById(CHAT_INPUT_ID);
            input.focus();
        }

        function newChat()
        {
            addChatTabs();
            applyChatStyle();
            initColorizer(true);
            addToChatBox_ = win.addToChatBox;
            win.addToChatBox = newAddToChatBox;
            chatInitialized = true;
            var chatbox = document.getElementById(CHAT_BOX_ID);
            chatbox.addEventListener('click', function (event)
                                     {
                var target = event.target;
                var userEl = target && target.parentElement;
                if (!target || !userEl || !target.classList.contains('name') || !userEl.classList.contains('user'))
                {
                    return;
                }
                if (userEl.dataset.sameUser != 'true')
                {
                    openPmTab(userEl.dataset.name || '');
                }
            });
            chatbox.addEventListener('mouseover', function (event)
                                     {
                var target = event.target;
                if (!target.classList.contains('timestamp') || !target.dataset.timestamp)
                {
                    return;
                }
                var timestamp = parseInt(target.dataset.timestamp || '0', 10);
                target.dataset.fulltime = (new Date(timestamp)).toLocaleDateString(LOCALE, LOCALE_OPTIONS);
                target.dataset.timestamp = '';
            });
            // add context menu
            var contextmenu = document.createElement('ul');
            contextmenu.id = CONTEXTMENU_ID;
            contextmenu.style.display = 'none';
            contextmenu.innerHTML = "<li class=\"name ui-widget-header\"><div></div></li>\n\t\t<li class=\"open-pm\"><div>Open pm tab</div></li>\n\t\t<li class=\"stats\"><div>Open stats</div></li>\n\t\t<li class=\"mute\"><div>Mute</div></li>\n\t\t<li class=\"unmute\"><div>Unmute</div></li>";
            document.body.appendChild(contextmenu);
            win.$(contextmenu).menu(
                {
                    items: '> :not(.ui-widget-header)'
                });
            var nameListEl = contextmenu.querySelector('.name');
            var nameDivEl = nameListEl.firstElementChild;
            var muteEl = contextmenu.querySelector('.mute');
            var unmuteEl = contextmenu.querySelector('.unmute');
            chatbox.addEventListener('contextmenu', function (event)
                                     {
                var target = event.target;
                var userEl = target && target.parentElement;
                if (!userEl || !userEl.classList.contains('user'))
                {
                    return;
                }
                var username = userEl.dataset.name;
                // ignore clicks on server messages or other special messages
                if (!username || userEl.dataset.sameUser == 'true')
                {
                    return;
                }
                contextmenu.style.left = event.clientX + 'px';
                contextmenu.style.top = event.clientY + 'px';
                contextmenu.style.display = '';
                contextmenu.dataset.username = username;
                nameDivEl.textContent = username;
                var isMuted = win.mutedPeople.indexOf(username) !== -1;
                muteEl.style.display = isMuted ? 'none' : '';
                unmuteEl.style.display = isMuted ? '' : 'none';
                event.stopPropagation();
                event.preventDefault();
            });
            // add click listener for context menu and stop propagation
            contextmenu.addEventListener('click', function (event)
                                         {
                var target = event.target;
                event.stopPropagation();
                while (target && target.id != CONTEXTMENU_ID && target.tagName != 'LI')
                {
                    target = target.parentElement;
                }
                if (!target || target.id == CONTEXTMENU_ID)
                {
                    return;
                }
                var username = contextmenu.dataset.username || '';
                if (target.classList.contains('open-pm'))
                {
                    openPmTab(username);
                }
                else if (target.classList.contains('stats'))
                {
                    win.lookup(username);
                }
                else if (target.classList.contains('mute'))
                {
                    if (username == '')
                    {
                        return;
                    }
                    win.mutedPeople.push(username);
                    win.scrollText('none', 'lime', '<em>' + username + '</em> muted');
                }
                else if (target.classList.contains('unmute'))
                {
                    if (username == '')
                    {
                        return;
                    }
                    var index = win.mutedPeople.indexOf(username);
                    if (index !== -1)
                    {
                        win.mutedPeople.splice(index, 1);
                    }
                    win.scrollText('none', 'red', '<em>' + username + '</em> unmuted');
                }
                else
                {
                    return;
                }
                contextmenu.style.display = 'none';
            });
            // add click listener to hide context menu
            document.addEventListener('click', function (event)
                                      {
                if (contextmenu.style.display != 'none')
                {
                    contextmenu.style.display = 'none';
                }
            });
            win.addEventListener('contextmenu', function (event)
                                 {
                if (contextmenu.style.display != 'none')
                {
                    contextmenu.style.display = 'none';
                }
            });
            // handle settings
            var showSettings = [settings.KEY.showTimestamps, settings.KEY.showIcons, settings.KEY.showTags];

            function setShowSetting(key)
            {
                var enabled = settings.get(key);
                chatbox.classList[enabled ? 'add' : 'remove'](settings.KEY[key]);
            }
            for (var _i = 0, showSettings_1 = showSettings; _i < showSettings_1.length; _i++)
            {
                var key = showSettings_1[_i];
                setShowSetting(key);
                settings.observe(key, function (k)
                                 {
                    return setShowSetting(k);
                });
            }
        }

        function addCommandSuggester()
        {
            var input = document.getElementById(CHAT_INPUT_ID);
            input.addEventListener('keyup', function (event)
                                   {
                if (event.key == 'Backspace' || event.key == 'Delete' || event.key == 'Enter' || event.key == 'Tab'
                    || input.selectionStart != input.selectionEnd
                    || input.selectionStart != input.value.length
                    || !input.value.startsWith('/'))
                {
                    return;
                }
                var value = input.value.substr(1);
                for (var _i = 0, COMMANDS_1 = COMMANDS; _i < COMMANDS_1.length; _i++)
                {
                    var cmd = COMMANDS_1[_i];
                    if (cmd.startsWith(value))
                    {
                        input.value = '/' + cmd;
                        input.selectionStart = 1 + value.length;
                        input.selectionEnd = input.value.length;
                        break;
                    }
                }
            });
        }

        function addOwnCommands()
        {
            COMMANDS.push(TUTORIAL_CMD);

            function processOwnCommands(value)
            {
                if (!value.startsWith('/'))
                {
                    return value;
                }
                var msgPrefix = '/';
                var msg = value.substr(1);
                if (msg.startsWith('pm'))
                {
                    var split = msg.split(' ');
                    msgPrefix = '/' + split.slice(0, 2).join(' ') + ' ';
                    msg = split.slice(2).join(' ');
                }
                if (msg.startsWith(CLEAR_CMD))
                {
                    // clear current chat (pm chat, or general chat)
                    var username = getSelectedTabUsername();
                    clearChat(username);
                }
                else if (msg.startsWith(TUTORIAL_CMD))
                {
                    // thanks aguyd (https://greasyfork.org/forum/profile/aguyd) for the idea
                    var name_2 = msg.substr(TUTORIAL_CMD.length).trim();
                    msgPrefix = '';
                    msg = 'https://www.reddit.com/r/DiamondHunt/comments/5vrufh/diamond_hunt_2_starter_faq/';
                    if (name_2.length != 0)
                    {
                        // maybe add '@' before the name?
                        msg = name_2 + ', ' + msg;
                    }
                }
                return msgPrefix + msg;
            }
            var _sendChat = win.sendChat;
            win.sendChat = function (inputEl)
            {
                inputEl.value = processOwnCommands(inputEl.value);
                _sendChat(inputEl);
            };
        }

        function checkColorize(init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var chatDiv = document.getElementById(CHAT_BOX_ID);
            chatDiv.classList[settings.get(settings.KEY.colorizeChat) ? 'add' : 'remove'](COLORIZE_CLASS);
            if (init)
            {
                settings.observe(settings.KEY.colorizeChat, function ()
                                 {
                    return checkColorize(false);
                });
            }
        }

        function init()
        {
            PM_HISTORY_KEY = 'pmHistory.'+win.username;
            pmHistory = store.get(PM_HISTORY_KEY) || pmHistory;
            newChat();
            addIntelligentScrolling();
            addCommandSuggester();
            addOwnCommands();
            checkColorize(true);
            checkSetting(true);
            var _enlargeChat = win.enlargeChat;
            var chatBoxArea = document.getElementById(CHAT_BOX_ID);

            function setChatBoxHeight(height)
            {
                var defaultChat = document.getElementById(DEFAULT_CHAT_DIV_ID);
                defaultChat.style.height = height;
                var generalChat = document.getElementById(GENERAL_CHAT_DIV_ID);
                generalChat.style.height = height;
                var chatDivs = chatBoxArea.querySelectorAll('div[id^="' + PM_CHAT_DIV_PREFIX + '"]');
                for (var i = 0; i < chatDivs.length; i++)
                {
                    chatDivs[i].style.height = height;
                }
            }
            win.enlargeChat = function (enlargeB)
            {
                _enlargeChat(enlargeB);
                var defaultChatDiv = document.getElementById(DEFAULT_CHAT_DIV_ID);
                var height = defaultChatDiv.style.height;
                store.set('chat.height', height);
                setChatBoxHeight(height);
                handleScrolling(defaultChatDiv);
            };
            setChatBoxHeight(store.get('chat.height'));
            // add history to chat
            // TEMP >>>
            // move pm entries to pm history
            var changed = false;
            for (var i = 0; i < chatHistory.length; i++)
            {
                var data = chatHistory[i];
                if (isDataPM(data))
                {
                    chatHistory.splice(i, 1);
                    i--;
                    pmHistory.push(data);
                    changed = true;
                }
            }
            if (changed)
            {
                saveChatHistory();
                savePmHistory();
            }
            // TEMP <<<
            chatHistory.forEach(function (d)
                                {
                return add2Chat(d);
            });
            pmHistory.forEach(function (d)
                              {
                return add2Chat(d);
            });
            if (chatboxFragments)
            {
                chatboxFragments.forEach(function (fragment, key)
                                         {
                    var chatbox = getChatPanel(key);
                    chatbox.appendChild(fragment);
                });
                chatboxFragments = null;
            }
            // reset the new counter for all tabs
            var tabs = document.querySelectorAll('.chat-tab');
            for (var i = 0; i < tabs.length; i++)
            {
                setNewCounter(tabs[i], 0, true);
            }
        }
        chat.init = init;
        var _a;
    })(chat || (chat = {}));

    /**
 * hopefully only temporary fixes
 */
    var temporaryFixes;
    (function (temporaryFixes)
     {
        temporaryFixes.name = 'temporaryFixes';
        function fixMagicShopButton(){
            var getBackButton = $("#tab-container-magicShop span:first");
            getBackButton.prop("class", "medium-button");
            getBackButton.html(`<img class="image-icon-30" src="images/icons/back.png"> back`);
            getBackButton.after("<br/><br/>");
        }
        function fixWrongURLs()
        {
            var image = document.querySelectorAll('.dialogue-loot .image-icon-50');
            for (var i=0; i < image.length; i++){
                var key = image[i];
                var change = key.src = key.src.replace('/images/icons/darkTombKey.png','/images/darkTombKey.png');
            }
        }
        // warn before unloading/reloading the tab if combat is in progress
        function combatWarnOnUnload()
        {
            if (!win.isInCombat())
            {
                win.onbeforeunload = null;
            }
            else
            {
                if (win.onbeforeunload == null)
                {
                    win.onbeforeunload = function ()
                    {
                        return 'You are in a fight!';
                    };
                }
            }
        }

        function fixCombatCountdown()
        {
            var el = document.getElementById('combat-countdown');
            if (!el)
            {
                return;
            }
            if (win.isInCombat())
            {
                el.style.display = '';
                var visible = win.combatCommenceTimer != 0;
                el.style.visibility = visible ? '' : 'hidden';
            }
        }
        // fix exhaustion timer and updating brewing and cooking recipes
        function fixExhaustionTimer()
        {
            if (document.getElementById('tab-container-combat').style.display != 'none')
            {
                win.combatNotFightingTick();
            }
        }

        function fixClientGameLoop()
        {
            var _clientGameLoop = win.clientGameLoop;
            win.clientGameLoop = function ()
            {
                _clientGameLoop();
                combatWarnOnUnload();
                fixCombatCountdown();
                fixExhaustionTimer();
            };
        }
        // fix elements of scrollText (e.g. when joining the game and receiving xp at that moment)
        function fixScroller()
        {
            var textEls = document.querySelectorAll('div.scroller');
            for (var i = 0; i < textEls.length; i++)
            {
                var scroller = textEls[i];
                if (scroller.style.position != 'absolute')
                {
                    scroller.style.display = 'none';
                }
            }
        }
        // fix style of tooltips
        function fixTooltipStyle()
        {
            addStyle("\nbody > div.tooltip > h2:first-child\n{\n\tmargin-top: 0;\n\tfont-size: 20pt;\n\tfont-weight: normal;\n}\n\t\t");
        }
        // fix buiulding magic table dynamically
        function fixRefreshingMagicRecipes()
        {
            // define missing properties for checking the needed materials
            win.enchantStargemPotionMagic = 0;
            win.changeWeatherMagic = 0;
            win.refreshLoadMagicTable = false;
            var _processMagicTab = win.processMagicTab;
            win.processMagicTab = function ()
            {
                var _refreshLoadCraftingTable = win.refreshLoadCraftingTable;
                win.refreshLoadCraftingTable = win.refreshLoadMagicTable;
                _processMagicTab();
                win.refreshLoadCraftingTable = _refreshLoadCraftingTable;
                if (win.magicPage3 == 1)
                {
                    win.showMateriesNeededAndLevelLabelsMagic('enchantStargemPotion');
                    win.showMateriesNeededAndLevelLabelsMagic('beam');
                    win.showMateriesNeededAndLevelLabelsMagic('changeWeather');
                }
            };
        }

        function moveItemBox(itemKey, targetElId, color1, color2)
        {
            var itemBox = document.getElementById('item-box-' + itemKey);
            var targetContainer = document.getElementById(targetElId);
            targetContainer.appendChild(itemBox);
            // remove event listeners before binding the tooltip to it
            var $itemBox = win.$(itemBox);
            $itemBox.off('mouseover').off('mouseleave');
            itemBox.title = '';
            // bind tooltip to item box
            ensureTooltip('ingredient-secondary', itemBox);
            // change color
            itemBox.style.background = 'linear-gradient(' + color1 + ', ' + color2 + ')';
            $itemBox
                .mouseover(function ()
                           {
                itemBox.style.background = 'none';
                itemBox.style.backgroundColor = color2;
            })
                .mouseleave(function ()
                            {
                itemBox.style.background = 'linear-gradient(' + color1 + ', ' + color2 + ')';
            });
        }
        // fix height of map item
        function fixTreasureMap()
        {
            var mapBox = document.getElementById('item-box-treasureMap');
            var numSpan = mapBox.lastElementChild;
            numSpan.style.display = '';
            numSpan.style.visibility = 'hidden';
        }
        // fix wobbling tree places on hover (in wood cutting)
        function fixWoodcutting()
        {
            addStyle("\nimg.woodcutting-tree-img\n{\n\tborder: 1px solid transparent;\n}\n\t\t");
        }
        // fix wobbling quest rows on hover (in quest book)
        function fixQuestBook()
        {
            addStyle("\n#table-quest-list tr\n{\n\tborder: 1px solid transparent;\n}\n\t\t");
        }

        function fixScrollImages()
        {
            function fixIcon(icon)
            {
                return icon + (icon != 'none' && !/\..{3,4}$/.test(icon) ? '.png' : '');
            }
            var _scrollTextHitSplat = win.scrollTextHitSplat;
            win.scrollTextHitSplat = function (icon, color, text, elId, cbType)
            {
                _scrollTextHitSplat(fixIcon(icon), color, text, elId, cbType);
            };
            var _scrollText = win.scrollText;
            win.scrollText = function (icon, color, text)
            {
                _scrollText(fixIcon(icon), color, text);
            };
        }

        function fixQuest8BraveryRecipe()
        {
            observer.add([
                'quest8'
                , 'braveryPotion'
            ], function ()
                         {
                var show = win.quest8 > 0 && win.braveryPotion == 0;
                var recipe = document.getElementById('brewing-braveryPotion');
                if (recipe)
                {
                    recipe.style.display = show ? '' : 'none';
                }
            });
        }

        function fixHitText()
        {
            var scrollTextHitSplat_ = win.scrollTextHitSplat;
            win.scrollTextHitSplat = function (icon, color, backgroundColor, text, elId)
            {
                var imgTag = icon != 'none' ? "<img src=\"images/" + icon + "\" class=\"image-icon-50\" />" : '';
                var elementChosen = document.getElementById(elId);
                if (!elementChosen)
                {
                    scrollTextHitSplat_(icon,color,backgroundColor,text,elId);
                    console.warn("fixHitText failed - Dh2Fixed");
                    return;
                }
                let rect = elementChosen.getBoundingClientRect();
                let xCoord = (rect.left + rect.right) / 2;
                let yCoord = (rect.bottom + rect.top) / 2;
                let extraStyle = 'border: 1px solid '+color+'; background-color: '+backgroundColor+';';
                var $elementToAppend = win.$("<div class=\"scroller\" style=\"" + extraStyle + " color: " + color + "; position: fixed;\">" + imgTag + text + "</div>").appendTo('body');
                if (xCoord == 0 && yCoord == 0)
                {
                    var tab = document.getElementById('tab-container-bar-combat');
                    var tabRect = tab.getBoundingClientRect();
                    var boxRect = $elementToAppend.get(0).getBoundingClientRect();
                    xCoord = elId == 'img-hero' ? (tabRect.left - boxRect.width) : tabRect.right;
                    yCoord = tabRect.top;
                }
                $elementToAppend
                    .css(
                    {
                        left: xCoord
                        , top: yCoord
                    })
                    .animate(
                    {
                        top: '-=50px'
                    }, function ()
                    {
                        return $elementToAppend.fadeOut(1000, function ()
                                                        {
                            return $elementToAppend.remove();
                        });
                    });
            };
        }

        function fixBoatTooltips()
        {
            var boatBox = document.getElementById('item-box-boundRowBoat');
            var boatTooltip = boatBox && document.getElementById(boatBox.dataset.tooltipId || '');
            var tooltipParent = boatTooltip && boatTooltip.parentElement;
            if (!boatBox || !boatTooltip || !tooltipParent)
            {
                return;
            }

            function setTripDuration(durationEl, boatKey)
            {
                var durationStr = TRIP_DURATION.hasOwnProperty(boatKey) ? TRIP_DURATION[boatKey].toString(10) : '?';
                durationEl.innerHTML = "<strong>Trip duration:</strong> " + durationStr + " hours";
            }
            boatTooltip.id = boatBox.dataset.tooltipId = 'tooltip-boundRowBoat';
            boatTooltip.appendChild(document.createElement('br'));
            var boatDuration = document.createElement('span');
            boatDuration.className = 'trip-duration';
            setTripDuration(boatDuration, 'rowBoat');
            boatTooltip.appendChild(boatDuration);
            for (var _i = 0, BOAT_LIST_1 = BOAT_LIST; _i < BOAT_LIST_1.length; _i++)
            {
                var boatKey = BOAT_LIST_1[_i];
                var boundKey = getBoundKey(boatKey);
                var itemBox = document.getElementById('item-box-' + boundKey);
                if (!itemBox)
                {
                    continue;
                }
                var tooltip = document.getElementById('tooltip-' + boundKey);
                if (!tooltip)
                {
                    tooltip = boatTooltip.cloneNode(true);
                    tooltip.id = 'tooltip-' + boundKey;
                    var header = tooltip.firstElementChild;
                    header.textContent = capitalize(split2Words(boatKey));
                    tooltipParent.appendChild(tooltip);
                    itemBox.dataset.tooltipId = 'tooltip-' + boundKey;
                }
                var durationEl = tooltip.getElementsByClassName('trip-duration').item(0);
                if (durationEl)
                {
                    setTripDuration(durationEl, boatKey);
                }
            }
        }

        function fixAlignments()
        {
            addStyle("\nspan.item-box[id^=\"item-box-\"] > img:not(.image-icon-100),\nspan.item-box[id^=\"item-box-\"] > span > img\n{\n\tmargin-top: -2px;\n}\n\n#tab-container-crafting .settings-container\n{\n\tmargin: 5px 30px;\n}\n#table-crafting-recipe,\n#table-brewing-recipe,\n#table-magic-recipe\n{\n\twidth: calc(100% - 2*20px - 2*10px);\n}\n#tab-sub-container-magic-items\n{\n\tmargin: 5px 0px;\n}\n#table-magic-recipe\n{\n\twidth: calc(100% - 2*10px);\n}\n\n#tab-container-farming\n{\n\tpadding: 0 20px;\n}\n#tab-sub-container-farming\n{\n\tmargin: 5px 0;\n\tmargin-bottom: -10px;\n}\ndiv.farming-patch,\ndiv.farming-patch-locked\n{\n\tmargin: 10px;\n}\nimg.farming-patch-img\n{\n\twidth: 349px;\n\theight: 400px;\n}\n/* fix position of some plant images */\nimg.farming-patch-img[src$=\"/3_1.png\"]\n{\n\theight: 398px;\n\tmargin-top: -2px;\n\tmargin-bottom: 4px;\n}\nimg.farming-patch-img[src$=\"/3_2.png\"]\n{\n\theight: 399px;\n\tmargin-top: -1px;\n\tmargin-bottom: 2px;\n\tmargin-left: 2px;\n\tmargin-right: -2px;\n}\nimg.farming-patch-img[src$=\"/3_4.png\"]\n{\n\tmargin-top: 1px;\n\tmargin-bottom: -1px;\n\tmargin-left: -2px;\n\tmargin-right: 2px;\n}\n\n#combat-table-area\n{\n\tborder-spacing: 0;\n}\n#combat-table-area > tbody > tr > td\n{\n\tvertical-align: top;\n}\ndiv#hero-area.hero,\ndiv#monster-area.monster\n{\n\tmargin-left: 20px;\n\tmargin-right: 20px;\n\tmargin-top: 10px;\n}\ntable.table-hero-stats,\ndiv.hp-bar,\n#hero-area div.fight-spellbook\n{\n\tmargin-left: 0;\n}\ndiv.hp-bar\n{\n\tmin-width: calc(100% - 2px);\n}\n#hero-area div.fight-spellbook\n{\n\tmargin: 0 -3px;\n}\n#hero-area span.fight-spell\n{\n\tmargin-bottom: 0;\n\tmargin-top: 0;\n}\n#hero-area > div:last-child,\n.imageMonster\n{\n\theight: 556px !important;\n\tmargin-top: -50px;\n}\n#monster-area div.hp-bar\n{\n\tmargin-top: 66px;\n\tmargin-bottom: 74px;\n}\n#monster-area > br:first-child,\n#monster-area table.table-hero-stats + br\n{\n\tdisplay: none;\n}\n.imageMonster\n{\n\talign-items: flex-end;\n\tdisplay: flex;\n\tposition: relative;\n}\n#combat-table-area[style$=\"auto;\"]\n{\n\tborder-color: transparent;\n}\n#img-monster\n{\n\tposition: absolute;\n}\n#img-monster[src$=\"/1.png\"]\n{\n\theight: 250px;\n}\n#img-monster[src$=\"/2.png\"]\n{\n\ttransform: translateY(30px);\n}\n#img-monster[src$=\"/3.png\"]\n{\n\theight: 180px;\n\ttransform: translateY(-350px);\n}\n#img-monster[src$=\"/4.png\"]\n{\n\theight: 180px;\n}\n#img-monster[src$=\"/5.png\"]\n{\n\theight: 700px;\n\ttransform: translateY(130px);\n}\n#img-monster[src$=\"/7.png\"]\n{\n\theight: 450px;\n\ttransform: translateY(30px);\n}\n#img-monster[src$=\"/8.png\"]\n{\n\theight: 280px;\n\ttransform: translateY(-260px);\n}\n#img-monster[src$=\"/9.png\"]\n{\n\theight: 450px;\n\ttransform: translateY(-10px);\n}\n#img-monster[src$=\"/11.png\"],\n#img-monster[src$=\"/15.png\"]\n{\n\ttransform: translateY(-180px);\n}\n#img-monster[src$=\"/14.png\"]\n{\n\theight: 500px;\n\tmargin-left: -50px;\n\tmargin-right: -50px;\n}\n#img-monster[src$=\"/100.png\"]\n{\n\theight: 300px;\n}\n#img-monster[src$=\"/101.png\"]\n{\n\ttransform: translateY(-10px);\n}\n#tab-sub-container-combat > .large-button > .image-icon-50\n{\n\theight: 70px;\n\tmargin-top: -10px;\n\twidth: 70px;\n}\n#combat-table-area span.large-button,\n#combat-table-area span.medium-button\n{\n\tmargin: 10px;\n}\n#combat-table-area span.large-button\n{\n\tfont-size: 3rem;\n}\n#combat-table-area span.medium-button + br + br\n{\n\tdisplay: none;\n}\n\t\t");
        }
        function fixFontSize11Tabs()
        {
            var tabKey = ['items', 'skills', 'mining', 'crafting', 'woodcutting', 'farming', 'brewing', 'combat', 'magic', 'cooking', 'shop'];
            for (var i = 0; i < tabKey.length; i++)
            {
                var tab = document.getElementById('tab-container-bar-'+ tabKey[i] +'-label');
                tab.style.fontSize = "15px";
            }
        }
        function addSpellTooltips()
        {
            var heal = document.querySelector('[data-spell-name="heal"]');
            heal.title = 'Mana: 2';
            win.$(heal).tooltip();
            var pound = document.querySelector('[data-spell-name="pound"]');
            pound.title = 'Mana: 2';
            win.$(pound).tooltip();
            var teleport = document.querySelector('[data-spell-name="teleport"]');
            teleport.title = 'Mana: 10';
            win.$(teleport).tooltip();
            var gust = document.querySelector('[data-spell-name="gust"]');
            gust.title = 'Mana: 3';
            win.$(gust).tooltip();
            var bubble = document.querySelector('[data-spell-name="bubble"]');
            bubble.title = 'Mana: 10';
            win.$(bubble).tooltip();
            var sandstorm = document.querySelector('[data-spell-name="sandstorm"]');
            sandstorm.title = 'Mana: 20';
            win.$(sandstorm).tooltip();
            var ghostScan = document.querySelector('[data-spell-name="ghostScan"]');
            ghostScan.title = 'Mana: 20';
            win.$(ghostScan).tooltip();
            var beam = document.querySelector('[data-spell-name="beam"]');
            beam.title = 'Mana: 15';
            win.$(beam).tooltip();
            var reflect = document.querySelector('[data-spell-name="reflect"]');
            reflect.title = 'Mana: 20';
            win.$(reflect).tooltip();
            var superHeal = document.querySelector('[data-spell-name="superHeal"]');
            superHeal.title = 'Mana: 8';
            win.$(superHeal).tooltip();
            var barrier = document.querySelector('[data-spell-name="barrier"]');
            barrier.title = 'Mana: 25';
            win.$(barrier).tooltip();
            var healSteal = document.querySelector('[data-spell-name="healSteal"]');
            healSteal.title = 'Mana: 25';
            win.$(healSteal).tooltip();
            var poison = document.querySelector('[data-spell-name="poison"]');
            poison.title = 'Mana: 30';
            win.$(poison).tooltip();
        }
        function modifySpellImages()
        {
            var spell = document.querySelectorAll('.fight-spell');
            console.log(spell);
            for (var i = 0; i < spell.length; i++){
                spell[i].style.width = '43px';
                spell[i].style.height = '43px';
            }
            var img= [];
            for (let i = 0; i < spell.length; i++){
                img[i] = spell[i].getElementsByTagName('img')[0];
                img[i].style.width = '43px';
            }
        }
        function addHeroStatTooltips()
        {
            var table = document.querySelector('#hero-area table.table-hero-stats');
            if (!table)
            {
                return;
            }
            var statRow = table.rows.item(0);
            var attackCell = statRow.cells.item(0);
            attackCell.title = 'Attack Damage';
            win.$(attackCell).tooltip();
            var accuracyCell = statRow.cells.item(1);
            accuracyCell.title = 'Attack Accuracy';
            win.$(accuracyCell).tooltip();
            var speedCell = statRow.cells.item(2);
            speedCell.title = 'Attack Speed';
            win.$(speedCell).tooltip();
            var defenseCell = statRow.cells.item(3);
            defenseCell.title = 'Defense';
            win.$(defenseCell).tooltip();
            var magicCell = statRow.cells.item(4);
            magicCell.title = 'Magic Bonus';
            win.$(magicCell).tooltip();
            // energy, cooldown, HP and mana
            var energyRow = table.rows.item(1);
            var energy = energyRow.cells.item(0);
            energy.title = 'Energy';
            var cdRow = table.rows.item(2);
            var cd = cdRow.cells.item(0);
            cd.title = 'Combat Cooldown';
            var getHPbar = document.querySelectorAll('.inner-hp-bar-label');
            getHPbar[0].title = 'Health Points';
            var getManabar = document.querySelectorAll('.inner-mana-bar-label');
            getManabar[0].title = 'Mana Points';
        }

        function unifyTooltips()
        {
            function getLastNonEmptyChild(parent)
            {
                for (var i = parent.childNodes.length - 1; i >= 0; i--)
                {
                    var child = parent.childNodes.item(i);
                    if (child.nodeType === Node.TEXT_NODE
                        && (child.textContent || '').trim() !== '')
                    {
                        return null;
                    }
                    else if (child.nodeType === Node.ELEMENT_NODE)
                    {
                        return child;
                    }
                }
                return null;
            }
            // clean unnecessary br-tags in tooltips
            var tooltips = document.querySelectorAll('#tooltip-list > div[id^="tooltip-"]');
            for (var i = 0; i < tooltips.length; i++)
            {
                var tooltip = tooltips[i];
                var lneChild = void 0;
                while ((lneChild = getLastNonEmptyChild(tooltip)) && lneChild.tagName == 'BR')
                {
                    tooltip.removeChild(lneChild);
                }
            }

            function getTooltip(item)
            {
                return document.getElementById('tooltip-' + item);
            }
            var boldify = [
                'oilBarrel'
                , 'boundEmptyPickaxe'
                , 'boundEmptyShovel'
                , 'boundRocket'
                , 'ashes'
                , 'iceBones'
            ];
            var lastDotRegex = /\.\s*$/;
            for (var _i = 0, boldify_1 = boldify; _i < boldify_1.length; _i++)
            {
                var item = boldify_1[_i];
                var tooltip = getTooltip(item);
                if (!tooltip)
                {
                    continue;
                }
                var textNode = tooltip.lastChild;
                while (textNode && (textNode.nodeType != Node.TEXT_NODE || (textNode.textContent || '').trim() === ''))
                {
                    if (textNode.nodeName === 'SPAN')
                    {
                        textNode = textNode.lastChild;
                    }
                    else
                    {
                        textNode = textNode.previousSibling;
                    }
                }
                if (!textNode)
                {
                    continue;
                }
                var text = textNode.textContent || '';
                var split = text.split(/\.(?=\s*\S+)/);
                var clickText = split[split.length - 1];
                textNode.textContent = text.replace(clickText, '');
                if (split.length > 1)
                {
                    tooltip.appendChild(document.createElement('br'));
                    tooltip.appendChild(document.createElement('br'));
                }
                var boldText = document.createElement('b');
                boldText.textContent = clickText;
                tooltip.appendChild(boldText);
            }

            function prepareTooltip(item, editText, createOnMissing)
            {
                if (createOnMissing === void 0)
                {
                    createOnMissing = false;
                }
                var tooltip = getTooltip(item);
                if (!tooltip)
                {
                    return;
                }
                // try to find the b-node:
                var bNode = getLastNonEmptyChild(tooltip);
                if (bNode && bNode.tagName === 'SPAN')
                {
                    bNode = getLastNonEmptyChild(bNode);
                }
                if (!bNode || bNode.tagName !== 'B')
                {
                    if (!createOnMissing)
                    {
                        bNode = null;
                    }
                    else
                    {
                        tooltip.appendChild(document.createElement('br'));
                        tooltip.appendChild(document.createElement('br'));
                        bNode = document.createElement('b');
                        tooltip.appendChild(bNode);
                    }
                }
                if (bNode)
                {
                    bNode.textContent = editText(bNode);
                }
            }
            // remove dots
            for (var i = 0; i < tooltips.length; i++)
            {
                var item = tooltips.item(i).id.replace(/^tooltip-/, '');
                prepareTooltip(item, function (bNode)
                               {
                    var text = bNode.textContent || '';
                    if (/Click to /.test(text))
                    {
                        return text.replace(lastDotRegex, '');
                    }
                    return text;
                });
            }
            // add click texts
            function setText(item, text)
            {
                prepareTooltip(item, function ()
                               {
                    return text;
                }, true);
            }
            for (var _a = 0, FURNACE_LEVELS_1 = FURNACE_LEVELS; _a < FURNACE_LEVELS_1.length; _a++)
            {
                var furnaceLevel = FURNACE_LEVELS_1[_a];
                var furnaceItem = getBoundKey(furnaceLevel + 'Furnace');
                setText(furnaceItem, 'Click to operate');
                var ovenItem = getBoundKey(furnaceLevel + 'Oven');
                setText(ovenItem, 'Click to operate');
            }
            // fix tooltip of quests-book
            var questBookTooltip = getTooltip('quests-book');
            if (questBookTooltip)
            {
                var childNodes = questBookTooltip.childNodes;
                for (var i = 0; i < childNodes.length; i++)
                {
                    var node = childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE
                        && (node.textContent || '').indexOf('Click to see a list of quests.') > -1)
                    {
                        var next = node.nextSibling;
                        if (next)
                        {
                            questBookTooltip.removeChild(next);
                        }
                        questBookTooltip.removeChild(node);
                    }
                }
            }
            // fix tooltip of axe
            var axeTooltip = getTooltip('boundEmptyAxe');
            if (axeTooltip)
            {
                axeTooltip.insertBefore(document.createElement('br'), axeTooltip.lastElementChild);
            }
            var texts = {
                'quests-book': 'Click to see the list of quests'
                , 'achievementBook': 'Click to see the list of achievements'
                , 'boundEmptyChisel': 'Click to use'
                , 'rake': 'Click to upgrade your rake'
                , 'boundBoat': 'Click to send boat'
            };
            for (var item in texts)
            {
                setText(item, texts[item]);
            }
            for (var _b = 0, BOAT_LIST_2 = BOAT_LIST; _b < BOAT_LIST_2.length; _b++)
            {
                var boatKey = BOAT_LIST_2[_b];
                setText(getBoundKey(boatKey), 'Click to send boat');
            }
        }
        var cached = {
            scrollWidth: 0
            , scrollHeight: 0
        };

        function changeTooltipPosition(event)
        {
            var tooltipX = event.pageX - 8;
            var tooltipY = event.pageY + 8;
            var el = document.querySelector('body > div.tooltip');
            if (!el)
            {
                return;
            }
            if (!this)
            {
                // init
                cached.scrollWidth = document.body.scrollWidth;
                cached.scrollHeight = document.body.scrollHeight;
            }
            var rect = el.getBoundingClientRect();
            var css = {
                left: tooltipX
                , top: tooltipY
                , width: ''
                , height: ''
                , maxWidth: cached.scrollWidth
                , maxHeight: cached.scrollHeight
            };
            var diffX = cached.scrollWidth - 20 - tooltipX - rect.width;
            if (diffX < 0)
            {
                css.left += diffX;
                css.width = rect.width - 42;
            }
            var diffY = cached.scrollHeight - 20 - tooltipY - rect.height;
            if (diffY < 0)
            {
                css.top += diffY;
                css.height = rect.height - 22;
            }
            win.$(el).css(css);
        }

        function fixTooltipPositioning()
        {
            win.changeTooltipPosition = changeTooltipPosition;
            win.loadTooltips();
        }

        function fixCombatNavigation()
        {
            var backBtns = document.querySelectorAll('span.medium-button[onclick*="openTab(\'combat\')"]');
            for (var i = 0; i < backBtns.length; i++)
            {
                var btn = backBtns.item(i);
                var img = btn.firstElementChild;
                var textNode = btn.lastChild;
                if (!img || img.tagName != 'IMG' || !textNode)
                {
                    continue;
                }
                img.className = img.className.replace(/(-\d+)-b/, '$1');
                textNode.textContent = ' back';
            }
        }

        function fixPromethiumSmeltingTime()
        {
            var _getTimerPerBar = win.getTimerPerBar;
            win.getTimerPerBar = function (bar)
            {
                if (bar == 'promethiumBar')
                {
                    return 80;
                }
                return _getTimerPerBar(bar);
            };
        }

        function fixImage()
        {
            var oxygenEl = document.querySelector('img[src="images/oxygenPotion"]');
            if (oxygenEl)
            {
                oxygenEl.src += '.png';
            }
        }

        function init()
        {
            fixMagicShopButton();
            fixWrongURLs();
            fixClientGameLoop();
            fixScroller();
            fixTooltipStyle();
            //fixRefreshingMagicRecipes();
            fixTreasureMap();
            fixWoodcutting();
            fixQuestBook();
            // apply fix for scroll images later to fix images in this code too
            fixHitText();
            fixScrollImages();
            fixQuest8BraveryRecipe();
            fixBoatTooltips();
            fixAlignments();
            //addHeroStatTooltips();
            fixFontSize11Tabs();
            //addSpellTooltips();
            modifySpellImages();
            unifyTooltips();
            fixTooltipPositioning();
            fixCombatNavigation();
            fixPromethiumSmeltingTime();
            fixImage();
        }
        temporaryFixes.init = init;
    })(temporaryFixes || (temporaryFixes = {}));

    /**
 * improve timer
 */
    var timer;
    (function (timer)
     {
        timer.name = 'timer';
        var IMPROVED_CLASS = 'improved';
        var NOTIFICATION_AREA_ID = 'notifaction-area';
        var PERCENT_CLASS = 'percent';
        var REMAINING_CLASS = 'remaining';
        var TIMER_CLASS = 'timer';

        function bindNewFormatter()
        {
            function doBind()
            {
                win.formatTime = win.formatTimeShort = win.formatTimeShort2 = function (seconds)
                {
                    return format.timer(seconds);
                };
            }
            win.addEventListener('load', function ()
                                 {
                return setTimeout(function ()
                                  {
                    return doBind();
                }, 100);
            });
            doBind();
            setTimeout(function ()
                       {
                return doBind();
            }, 100);
        }

        function applyStyle()
        {
            addStyle("\nspan.notif-box." + IMPROVED_CLASS + "\n{\n\tposition: relative;\n}\nspan.notif-box." + IMPROVED_CLASS + " > span:not(." + TIMER_CLASS + "):not(." + REMAINING_CLASS + "):not(." + PERCENT_CLASS + ")\n{\n\tdisplay: none;\n}\nspan.notif-box." + IMPROVED_CLASS + " > span." + REMAINING_CLASS + ",\nspan.notif-box." + IMPROVED_CLASS + " > span." + PERCENT_CLASS + "\n{\n\tposition: absolute;\n\tleft: 10px;\n\tfont-size: 0.9rem;\n\tbottom: 0px;\n\twidth: 50px;\n\ttext-align: right;\n\ttext-shadow: 1px 1px 4px black;\n}\nspan.notif-box." + IMPROVED_CLASS + " > span." + REMAINING_CLASS + "::before\n{\n\tcontent: '\\0D7';\n\tmargin-right: .25rem;\n\tmargin-left: -.5rem;\n}\nspan.notif-box." + IMPROVED_CLASS + " > span." + PERCENT_CLASS + "::after\n{\n\tcontent: '%';\n}\n\t\t");
        }

        function improveSmeltingTimer()
        {
            var el = document.getElementById('notif-smelting');
            if (!el)
            {
                return;
            }
            var smeltingNotifBox = el;
            smeltingNotifBox.classList.add(IMPROVED_CLASS);
            var smeltingTimerEl = document.createElement('span');
            smeltingTimerEl.className = TIMER_CLASS;
            smeltingNotifBox.appendChild(smeltingTimerEl);
            var remainingBarsEl = document.createElement('span');
            remainingBarsEl.className = REMAINING_CLASS;
            smeltingNotifBox.appendChild(remainingBarsEl);
            var delta = 0;

            function updatePercValues(init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                updateSmeltingTimer(delta = 0);
                if (init)
                {
                    observer.add('smeltingPercD', function ()
                                 {
                        return updatePercValues();
                    });
                    observer.add('smeltingPerc', function ()
                                 {
                        return updatePercValues();
                    });
                }
            }

            function updateSmeltingTimer(delta)
            {
                if (delta === void 0)
                {
                    delta = 0;
                }
                var totalTime = win.smeltingPercD;
                // thanks at /u/marcus898 for your bug report
                var elapsedTime = Math.round(win.smeltingPerc * totalTime / 100) + delta;
                smeltingTimerEl.textContent = format.timer(Math.max(totalTime - elapsedTime, 0));
                remainingBarsEl.textContent = (win.smeltingTotalAmount - win.smeltingAmount).toString();
            }
            observer.addTick(function ()
                             {
                return updateSmeltingTimer(delta++);
            });
            updatePercValues(true);
        }

        function improveTimer(cssRulePrefix, textColor, timerColor, infoIdPrefx, containerPrefix, updateFn)
        {
            addStyle("\n/* hide built in timer elements */\n" + cssRulePrefix + " > *:not(img):not(.info)\n{\n\tdisplay: none;\n}\n" + cssRulePrefix + " > div.info\n{\n\tcolor: " + textColor + ";\n\tmargin-top: 5px;\n\tpointer-events: none;\n\ttext-align: center;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n}\n" + cssRulePrefix + " > div.info > div.name\n{\n\tfont-size: 1.2rem;\n}\n" + cssRulePrefix + " > div.info > div.timer\n{\n\tcolor: " + timerColor + ";\n}\n\t\t");
            let iteration = cssRulePrefix == '.woodcutting-tree' ? 6 : 7;
            for (var i = 0; i < iteration; i++)
            {
                var num = i + 1;
                var infoId = infoIdPrefx + num;
                var container = document.getElementById(containerPrefix + num);
                container.style.position = 'relative';
                var infoEl = document.createElement('div');
                infoEl.className = 'info';
                infoEl.id = infoId;
                infoEl.innerHTML = "<div class=\"name\"></div><div class=\"timer\"></div>";
                container.appendChild(infoEl);
                updateFn(num, infoId, true);
            }
        }

        function updateTreeInfo(placeId, infoElId, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var infoEl = document.getElementById(infoElId);
            var nameEl = infoEl.firstElementChild;
            var timerEl = infoEl.lastElementChild;
            var idKey = 'treeId' + placeId;
            var growTimerKey = 'treeGrowTimer' + placeId;
            var lockedKey = 'treeUnlocked' + placeId;
            var treeId = getGameValue(idKey);
            if (treeId == 0)
            {
                var isLocked = (placeId == 5 || placeId == 6) && win.donorWoodcuttingPatch < win.currentTimeMillis;
                nameEl.textContent = isLocked ? 'Locked' : 'Empty';
                timerEl.textContent = '';
            }
            else
            {
                nameEl.textContent = key2Name(win.getTreeName(treeId)) || 'Unknown Tree';
                var remainingTime = win.TREE_GROW_TIME[treeId - 1] - getGameValue(growTimerKey);
                timerEl.textContent = remainingTime > 0 ? '(' + format.timer(remainingTime) + ')' : 'Fully grown';
            }
            if (init)
            {
                observer.add([idKey, growTimerKey, lockedKey], function ()
                             {
                    return updateTreeInfo(placeId, infoElId, false);
                });
            }
        }
        // add tree grow timer
        function improveTreeGrowTimer()
        {
            improveTimer('.woodcutting-tree', 'white', 'yellow', 'wc-tree-info-', 'wc-div-tree-', updateTreeInfo);
        }

        function updatePatchInfo(patchId, infoElId, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var infoEl = document.getElementById(infoElId);
            var nameEl = infoEl.querySelector('.name');
            var timerEl = infoEl.querySelector('.timer');
            var idKey = 'farmingPatchSeed' + patchId;
            var growTimeKey = 'farmingPatchGrowTime' + patchId;
            var timerKey = 'farmingPatchTimer' + patchId;
            var stageKey = 'farmingPatchStage' + patchId;
            var stage = getGameValue(stageKey);
            var seedName = PLANT_NAME[getGameValue(idKey)] || 'Unkown Plant';
            if (stage == 0)
            {
                var isLocked = (patchId == 5 || patchId == 6) && win.donorFarmingPatch < win.currentTimeMillis;
                nameEl.textContent = isLocked ? 'Locked' : 'Click to grow';
                timerEl.textContent = '';
            }
            else if (stage >= 4)
            {
                nameEl.textContent = stage > 4 ? 'Dead Plant' : seedName;
                timerEl.textContent = stage > 4 ? 'Click to remove' : 'Click to harvest';
            }
            else
            {
                nameEl.textContent = seedName;
                var remainingTime = getGameValue(growTimeKey) - getGameValue(timerKey);
                timerEl.textContent = '(' + format.timer(remainingTime) + ')';
            }
            if (init)
            {
                observer.add([idKey, timerKey, stageKey, 'donorFarmingPatch'], function ()
                             {
                    return updatePatchInfo(patchId, infoElId, false);
                });
            }
        }
        // add seed name and change color of timer
        function getSoonestTreeTimer()
        {
            if (win.treeStage1 == 4
                || win.treeStage2 == 4
                || win.treeStage3 == 4
                || win.treeStage4 == 4
                || win.treeStage5 == 4
                || win.treeStage6 == 4)
            {
                return -1;
            }
            var minTimer = null;
            for (var i = 1; i <= 6; i++)
            {
                var treeId = getGameValue('treeId' + i);
                var unlocked = getGameValue('treeUnlocked' + i) == 1;
                var timerValue = getGameValue('treeGrowTimer' + i);
                if (unlocked && treeId !== 0 && timerValue > 0)
                {
                    var remainingTime = win.TREE_GROW_TIME[treeId - 1] - timerValue;
                    minTimer = minTimer === null ? remainingTime : Math.min(minTimer, remainingTime);
                }
            }
            return minTimer || 0;
        }

        function getSoonestFarmingTimer()
        {
            if (win.farmingPatchStage1 == 0 || win.farmingPatchStage1 == 4
                || win.farmingPatchStage2 == 0 || win.farmingPatchStage2 == 4
                || win.farmingPatchStage3 == 0 || win.farmingPatchStage3 == 4
                || win.farmingPatchStage4 == 0 || win.farmingPatchStage4 == 4
                || win.donorFarmingPatch > win.currentTimeMillis && (win.farmingPatchStage5 == 0 || win.farmingPatchStage5 == 4
                                                                     || win.farmingPatchStage6 == 0 || win.farmingPatchStage6 == 4))
            {
                return -1;
            }
            var minTimer = null;
            for (var i = 1; i <= ((win.donorFarmingPatch > win.currentTimeMillis) ? 6 : 4); i++)
            {
                var remainingTimer = getGameValue('farmingPatchGrowTime' + i) - getGameValue('farmingPatchTimer' + i);
                minTimer = minTimer === null ? remainingTimer : Math.min(minTimer, remainingTimer);
            }
            return minTimer || 0;
        }

        function improveSeedGrowTimer()
        {
            improveTimer('div[id^="farming-patch-area"]', 'black', 'blue', 'farming-patch-info-', 'farming-patch-area-', updatePatchInfo);
        }

        function addTabTimer()
        {
            var TAB_TIMER_KEY = 'tabTimer';
            addStyle("\ntable.tab-bar td\n{\n\tposition: relative;\n}\n." + TAB_TIMER_KEY + " table.tab-bar td.ready > img:first-child\n{\n\tbackground-image: linear-gradient(#161618, #48ab32);\n\tmargin: -2px -5px -3px;\n\tpadding: 6px 5px 7px;\n}\ntable.tab-bar td .info\n{\n\tcolor: yellow;\n\tdisplay: none;\n\tfont-size: 0.8rem;\n\tpadding-left: 50px;\n\tposition: absolute;\n\tleft: 0;\n\tright: 0;\n\ttext-align: center;\n}\n." + TAB_TIMER_KEY + " table.tab-bar td .info\n{\n\tdisplay: block;\n}\ntable.tab-bar td .info.timer\n{\n\tbottom: 0;\n\tpadding-bottom: 5px;\n}\ntable.tab-bar td .info.timer:not(:empty)::before\n{\n\tcontent: '(';\n}\ntable.tab-bar td .info.timer:not(:empty)::after\n{\n\tcontent: ')';\n}\nbody.short-tabs table.tab-bar td .info.timer\n{\n\tdisplay: none;\n}\ntable.tab-bar td .info.extra\n{\n\tcolor: white;\n\tpadding-top: 5px;\n\ttop: 0;\n}\nbody.short-tabs table.tab-bar td .info.extra\n{\n\tdisplay: none;\n}\n." + TAB_TIMER_KEY + " #dhqol-notif-woodcutting,\n." + TAB_TIMER_KEY + " #dhqol-notif-farming,\n." + TAB_TIMER_KEY + " #dhqol-notif-combat,\n." + TAB_TIMER_KEY + " #dhqol-notif-vial\n{\n\tdisplay: none !important;\n}\n\t\t");

            function getTabEl(key)
            {
                return document.getElementById('tab-container-bar-' + key);
            }

            function addInfoDiv(key)
            {
                var infoDiv = document.createElement('div');
                infoDiv.className = 'info';
                var tab = getTabEl(key);
                if (tab)
                {
                    tab.appendChild(infoDiv);
                }
                return infoDiv;
            }

            function createTabTimer(key, timerFn)
            {
                var tab = getTabEl(key);
                var timerDiv = addInfoDiv(key);
                if (!tab || !timerDiv)
                {
                    return;
                }
                timerDiv.classList.add('timer');

                function updateTimer()
                {
                    var minTimer = timerFn();
                    if (tab)
                    {
                        tab.classList[minTimer == -1 ? 'add' : 'remove']('ready');
                    }
                    timerDiv.textContent = minTimer <= 0 ? '' : format.timer(minTimer);
                }
                updateTimer();
                observer.addTick(function ()
                                 {
                    return updateTimer();
                });
            }
            createTabTimer('woodcutting', getSoonestTreeTimer);
            createTabTimer('farming', getSoonestFarmingTimer);
            createTabTimer('combat', function ()
                           {
                return win.combatGlobalCooldown;
            });
            var energyDiv = addInfoDiv('combat');
            energyDiv.classList.add('extra');

            function updateEnergy()
            {
                energyDiv.innerHTML = '<img src="images/steak.png" class="image-icon-15"> ' + format.number(win.energy);
            }
            updateEnergy();
            observer.add('energy', function ()
                         {
                return updateEnergy();
            });
            // add highlight for stardust potions
            var potionDiv = addInfoDiv('brewing');
            potionDiv.classList.add('extra');
            var potionList = ['stardustPotion', 'superStardustPotion'];
            var potionImageList = [];

            function updatePotion(key, img, init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                var timerKey = key + 'Timer';
                var show = getGameValue(key) > 0 && getGameValue(timerKey) === 0;
                img.style.display = show ? '' : 'none';
                if (init)
                {
                    observer.add(key, function ()
                                 {
                        return updatePotion(key, img);
                    });
                    observer.add(timerKey, function ()
                                 {
                        return updatePotion(key, img);
                    });
                }
            }
            for (var i = 0; i < potionList.length; i++)
            {
                var key = potionList[i];
                var img = document.createElement('img');
                img.src = 'images/' + key + '.png';
                img.className = 'image-icon-15';
                potionImageList[i] = img;
                potionDiv.appendChild(img);
                updatePotion(key, img, true);
            }

            function updateVisibility()
            {
                document.body.classList[settings.get(settings.KEY.showTabTimer) ? 'add' : 'remove'](TAB_TIMER_KEY);
            }
            updateVisibility();
            settings.observe(settings.KEY.showTabTimer, function ()
                             {
                return updateVisibility();
            });
            observer.add('profileShortTabs', function ()
                         {
                var short = !!win.profileShortTabs;
                document.body.classList[short ? 'add' : 'remove']('short-tabs');
            });
        }

        function addOilInfo()
        {
            var NULL_TYPE = 'null';
            var PLUS_TYPE = 'plus';
            var MINUS_TYPE = 'minus';
            addStyle("\n#oil-filling-level\n{\n\tbackground-color: black;\n\tborder: 1px solid white;\n\tdisplay: inline-block;\n\tposition: absolute;\n\tbottom: 0;\n\ttop: 0;\n\ttransform: translateX(-10px);\n\twidth: 8px;\n}\n#oil-filling-level > div\n{\n\tbackground-color: white;\n\twidth: 100%;\n}\n\ntable.top-bar span[id^=\"dh2qol-oil\"]\n{\n\tdisplay: none;\n}\n#oil-flow-net\n{\n\tcolor: hsla(195, 100%, 50%, 1);\n\tfont-weight: bold;\n}\n#oil-flow-net[data-type=\"" + NULL_TYPE + "\"]\n{\n\tcolor: hsla(195, 100%, 50%, 1);\n}\n#oil-flow-net[data-type=\"" + PLUS_TYPE + "\"]\n{\n\tcolor: green;\n}\n#oil-flow-net[data-type=\"" + MINUS_TYPE + "\"]\n{\n\tcolor: red;\n}\n#oil-flow-net-timer[data-type=\"" + NULL_TYPE + "\"]\n{\n\tdisplay: none;\n}\n#oil-flow-net-timer[data-type=\"" + PLUS_TYPE + "\"]\n{\n\tcolor: yellow;\n}\n#oil-flow-net-timer[data-type=\"" + MINUS_TYPE + "\"]\n{\n\tcolor: orange;\n}\n\t\t");
            var oilFlow = document.getElementById('oil-flow-values');
            var parent = oilFlow && oilFlow.parentElement;
            if (!oilFlow || !parent)
            {
                return;
            }
            var container = document.createElement('div');
            container.id = 'oil-filling-level';
            var fillingLevel = document.createElement('div');
            container.appendChild(fillingLevel);
            var first = parent.firstElementChild;
            if (first)
            {
                parent.insertBefore(container, first);
            }
            else
            {
                parent.appendChild(container);
            }
            parent.style.position = 'relative';
            var netFlow = document.createElement('span');
            netFlow.id = 'oil-flow-net';
            parent.insertBefore(netFlow, oilFlow);
            var next = oilFlow.nextElementSibling;
            var netTimer = document.createElement('span');
            netTimer.id = 'oil-flow-net-timer';
            if (next)
            {
                parent.insertBefore(netTimer, next);
            }
            else
            {
                parent.appendChild(netTimer);
            }
            var oilNet;
            var oilNetType;

            function updateNetFlow(init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                oilNet = win.oilIn - win.oilOut;
                oilNetType = oilNet === 0 ? NULL_TYPE : (oilNet > 0 ? PLUS_TYPE : MINUS_TYPE);
                netFlow.dataset.type = oilNetType;
                var sign = oilNet === 0 ? PLUS_MINUS_SIGN : (oilNet > 0 ? '+' : '');
                netFlow.textContent = sign + oilNet;
                if (init)
                {
                    observer.add('oilIn', function ()
                                 {
                        return updateNetFlow();
                    });
                    observer.add('oilOut', function ()
                                 {
                        return updateNetFlow();
                    });
                }
                updateFullTimer(init);
            }
            var hour2Color = (_a = {}
                              , // 30min
                              _a[.5 * 60 * 60] = 'rgb(255, 0, 0)'
                              , _a[5 * 60 * 60] = 'rgb(255, 255, 0)'
                              , _a[8 * 60 * 60] = 'rgb(255, 255, 255)'
                              , _a);

            function updateFullTimer(init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                netTimer.dataset.type = oilNetType;
                var time = 0;
                if (oilNet > 0)
                {
                    netTimer.title = 'full in...';
                    var diff = win.maxOil - win.oil;
                    time = diff / oilNet;
                }
                else if (oilNet < 0)
                {
                    netTimer.title = 'empty in...';
                    time = win.oil / Math.abs(oilNet);
                }
                netTimer.textContent = '(' + format.timer(Math.ceil(time)) + ')';
                var filledPercent = win.oil / win.maxOil * 100;
                fillingLevel.style.height = (100 - filledPercent) + '%';
                /**
			 * colorize filling level according to the time it needs to be full/empty:
			 *	- red		iff oil storage full/empty in 30min
			 *	- yellow	iff oil storage full/empty in 5h
			 *	- white		iff oil storage full/empty in 8h or more
			 */
                var color = oilNet === 0 ? '#ffffff' : colorGenerator.getColorTransition(time, hour2Color);
                container.style.borderColor = color;
                if (init)
                {
                    observer.add('maxOil', function ()
                                 {
                        return updateFullTimer();
                    });
                    observer.add('oil', function ()
                                 {
                        return updateFullTimer();
                    });
                    observer.addTick(function ()
                                     {
                        return updateFullTimer();
                    });
                }
            }
            updateNetFlow(true);
            var _a;
        }

        function addRocketTimer()
        {
            var notifArea = document.getElementById(NOTIFICATION_AREA_ID);
            if (!notifArea)
            {
                return;
            }
            var notifBox = document.createElement('span');
            notifBox.className = 'notif-box ' + IMPROVED_CLASS;
            notifBox.id = 'notif-rocket';
            notifBox.style.display = 'none';
            notifBox.innerHTML = "<img src=\"images/rocket.png\" class=\"image-icon-50\" id=\"notif-rocket-img\" style=\"margin-right: 10px;\"><span class=\"timer\" data-item-display=\"rocketTimer\"></span><span class=\"" + PERCENT_CLASS + "\" data-item-display=\"rocketPercent\"></span>";
            var AVG_KM_PER_SEC;
            if (rocketDestination == 1){
                AVG_KM_PER_SEC = 15;
            }else if (rocketDestination == 3){
                AVG_KM_PER_SEC = 37000;
            }else{
                AVG_KM_PER_SEC = 400;
            }
            notifBox.title = 'This value is only an estimation based on an average speed of '+AVG_KM_PER_SEC+'km per second.';
            notifArea.appendChild(notifBox);
            var img = notifBox.getElementsByTagName('img').item(0);
            var timerEl = notifBox.getElementsByClassName(TIMER_CLASS).item(0);
            var percentEl = notifBox.getElementsByClassName(PERCENT_CLASS).item(0);
            var smoothedTime = 0;

            function updateRocketKm()
            {
/*                 if(AVG_KM_PER_SEC != (rocketDestination == 1 ? 15 : 392))
                {
                    AVG_KM_PER_SEC = rocketDestination == 1 ? 15 : 392;
                    notifBox.title = 'This value is only an estimation based on an average speed of '+AVG_KM_PER_SEC+'km per second.';
                } */
                var distance;
                if (rocketDestination == 1){
                    AVG_KM_PER_SEC = 15;
                    distance = MAX_ROCKET_MOON_KM;
                }else if (rocketDestination == 3){
                    AVG_KM_PER_SEC = 37000;
                    distance = MAX_ROCKET_INTERSTELLAR_KM;
                }else{
                    AVG_KM_PER_SEC = 400;
                    distance = MAX_ROCKET_MARS_KM;
                }
                notifBox.title = 'This value is only an estimation based on an average speed of '+AVG_KM_PER_SEC+'km per second.';

                var hideStatic = win.rocketKm < distance;
                var hideTimer = win.rocketKm <= 0 || !hideStatic;
                notifBox.style.display = hideTimer ? 'none' : '';
                var percent = win.rocketKm / distance;
                var diff = distance - win.rocketKm;
                if (win.rocketMoonId < 0)
                {
                    percent = 1 - percent;
                    diff = win.rocketKm;
                }
                var avgRemainingTime = Math.round(diff / AVG_KM_PER_SEC);
                // be more accurate in the last few seconds (may be the last 2 up to 16 seconds)
                var threshold = smoothedTime < 10 ? 1 : 8;
                if (Math.abs(smoothedTime - avgRemainingTime) >= threshold)
                {
                    smoothedTime = avgRemainingTime + 1;
                }
                percentEl.textContent = Math.floor(percent * 100).toString();
            }

            function tickRocketTimer()
            {
                if (smoothedTime > 0)
                {
                    smoothedTime = Math.max(smoothedTime - 1, 0);
                    timerEl.textContent = format.timer(smoothedTime);
                }
            }
            updateRocketKm();
            observer.add('rocketKm', function (key, oldValue, newValue)
                         {
                return updateRocketKm();
            });
            observer.addTick(function ()
                             {
                return tickRocketTimer();
            });

            function updateRocketDirection()
            {
                // alternatively: `transform: rotateZ(180deg) rotateY(180deg)`
                var transform = win.rocketMoonId >= 0 ? '' : 'rotate(90deg)';
                img.style.transform = transform;
                var itemBox = document.getElementById('default-item-img-tag-boundRocket');
                if (itemBox)
                {
                    itemBox.style.transform = transform;
                }
            }
            updateRocketDirection();
            observer.add('rocketMoonId', function ()
                         {
                return updateRocketDirection();
            });
        }
        function addVendorRefreshTimer()
        {
            var notifArea = document.getElementById(NOTIFICATION_AREA_ID);
            if (!notifArea)
            {
                return;
            }
            var notifBox = document.createElement('span');
            notifBox.className = 'notif-box ' + IMPROVED_CLASS;
            notifBox.id = 'notif-vendorRefresh';
            notifBox.style.display = 'none';
            notifBox.innerHTML = "<img src=\"images/vendor.png\" class=\"image-icon-50\" id=\"notif-vendorRefresh-img\" style=\"margin-right: 10px;\"><span class=\"timer\" data-item-display=\"vendorRefreshTimer\"></span>";
            notifArea.appendChild(notifBox);
            var img = notifBox.getElementsByTagName('img').item(0);
            var timerEl = notifBox.getElementsByClassName(TIMER_CLASS).item(0);

            function updateVendorRefreshTimer()
            {
                var hideTimer = win.vendorNotification == 1;
                notifBox.style.display = hideTimer ? 'none' : '';
                var timeLeft = Math.floor( (12*60*60) - (Date.now()-vendorLastChanged)/1000 );
                timerEl.textContent = format.timer(timeLeft);
            }
            updateVendorRefreshTimer();
            observer.addTick(function ()
                             {
                return updateVendorRefreshTimer();
            });
        }
        function addBobsUncleTimer()
        {
            var notifArea = document.getElementById(NOTIFICATION_AREA_ID);
            if (!notifArea)
            {
                return;
            }
            var notifBox = document.createElement('span');
            notifBox.className = 'notif-box ' + IMPROVED_CLASS;
            notifBox.id = 'notif-bobsUncle';
            notifBox.style.display = 'none';
            notifBox.innerHTML = "<img src=\"images/bobsUncle.png\" class=\"image-icon-50\" id=\"notif-bobsUncle-img\" style=\"margin-right: 10px;\"><span class=\"timer\" data-item-display=\"bobsUncleTimer\"></span>";
            notifArea.appendChild(notifBox);
            var img = notifBox.getElementsByTagName('img').item(0);
            var timerEl = notifBox.getElementsByClassName(TIMER_CLASS).item(0);

            function updateBobsUncleTimer()
            {
                var hideTimer = win.farmingPatchStage7 == 0 || win.farmingPatchStage7 == 4;
                notifBox.style.display = hideTimer ? 'none' : '';
                var timeLeft = getGameValue('farmingPatchGrowTime7') - getGameValue('farmingPatchTimer7');
                timerEl.textContent = format.timer(timeLeft);
            }
            updateBobsUncleTimer();
            observer.addTick(function ()
                             {
                return updateBobsUncleTimer();
            });
        }
        function addCharcoalFactoryTimer()
        {
            var notifArea = document.getElementById(NOTIFICATION_AREA_ID);
            if (!notifArea)
            {
                return;
            }
            var notifBox = document.createElement('span');
            notifBox.className = 'notif-box ' + IMPROVED_CLASS;
            notifBox.id = 'notif-charcoalFactory';
            notifBox.style.display = 'none';
            var consumeTime = (boundRedCharcoalFactoryOrb) ? 492: 112;
            notifBox.title = 'This value is only an estimation based on an average consumption rate of one charcoal every '+consumeTime+' seconds.';
            notifBox.innerHTML = "<img src=\"images/charcoalFactory.png\" class=\"image-icon-50\" id=\"notif-charcoalFactory-img\" style=\"margin-right: 10px;\"><span class=\"timer\" data-item-display=\"charcoalFactoryTimer\"></span>";
            notifArea.appendChild(notifBox);
            var img = notifBox.getElementsByTagName('img').item(0);
            var timerEl = notifBox.getElementsByClassName(TIMER_CLASS).item(0);
            var now = Math.floor(Date.now()/1000);
            function updateCharcoalFactoryTimer()
            {
                var hideTimer = win.boundCharcoalFactory == 0 || win.charcoalFactoryCharcoal == 0;
                notifBox.style.display = hideTimer ? 'none' : '';
                var averageTimeLeft = getGameValue('charcoalFactoryCharcoal') * consumeTime;
                var smoothedTime = averageTimeLeft + now - Math.floor(Date.now()/1000);
                timerEl.textContent = format.timer(smoothedTime);
            }
            updateCharcoalFactoryTimer();
            observer.addTick(function (){
                return updateCharcoalFactoryTimer();
            });
        }

        function getLogTypeList()
        {
            var list = [];
            var els = document.querySelectorAll('input[id^="input-charcoalFoundry-"]');
            for (var i = 0; i < els.length; i++)
            {
                list.push(els[i].id.replace(/^input-charcoalFoundry-/i, ''));
            }
            return list;
        }

        function improveFoundryTimer()
        {
            var el = document.getElementById('notif-charcoalFoundry');
            if (!el)
            {
                return;
            }
            var notifBox = el;
            notifBox.classList.add(IMPROVED_CLASS);
            var timerEl = document.createElement('span');
            timerEl.className = TIMER_CLASS;
            notifBox.appendChild(timerEl);
            var remainingEl = document.createElement('span');
            remainingEl.className = REMAINING_CLASS;
            notifBox.appendChild(remainingEl);
            var logTypeList = null;
            observer.add('charcoalFoundryN', function (key, oldValue, newValue)
                         {
                timerEl.textContent = format.timer((win.charcoalFoundryD - win.charcoalFoundryN)/(win.achCraftingEliteCompleted+1));
                // init log type list when needed
                if (!logTypeList)
                {
                    logTypeList = getLogTypeList();
                }
                var woodAmount = win.charcoalFoundryTotal - win.charcoalFoundryCurrent;
                var coalPerLog = win.getCharcoalPerLog(logTypeList[(win.charcoalFoundryLogId==10)?6:win.charcoalFoundryLogId - 1]);
                var remainingCoal = woodAmount * (isNaN(coalPerLog) ? 1 : coalPerLog);
                remainingEl.textContent = remainingCoal.toString();
            });
        }
        function improveCharcoalFactoryTimer()
        {
            var el = document.getElementById('notif-charcoalFactory');
            if (!el)
            {
                return;
            }
            var notifBox = el;
            notifBox.classList.add(IMPROVED_CLASS);
            var remainingEl = document.createElement('span');
            remainingEl.className = REMAINING_CLASS;
            notifBox.appendChild(remainingEl);
            observer.add('charcoalFactoryCharcoal', function (key, oldValue, newValue)
                         {
                var remainingCoal = win.charcoalFactoryCharcoal;
                remainingEl.textContent = remainingCoal.toString();
            });
        }

        function init()
        {
            bindNewFormatter();
            applyStyle();
            improveSmeltingTimer();
            improveTreeGrowTimer();
            improveSeedGrowTimer();
            addTabTimer();
            addOilInfo();
            addRocketTimer();
            improveFoundryTimer();
            addVendorRefreshTimer();
            addBobsUncleTimer();
            addCharcoalFactoryTimer();
            //improveCharcoalFactoryTimer();
        }
        timer.init = init;
    })(timer || (timer = {}));

    /**
 * improve smelting dialog
 */
    var smelting;
    (function (smelting)
     {
        smelting.name = 'smelting';
        var TIME_NEEDED_ID = 'smelting-time-needed';
        var LAST_SMELTING_AMOUNT_KEY = 'lastSmeltingAmount';
        var LAST_SMELTING_BAR_KEY = 'lastSmeltingBar';
        var smeltingValue = null;
        var amountInput;

        function prepareAmountInput()
        {
            amountInput = document.getElementById('input-smelt-bars-amount');
            amountInput.type = 'number';
            amountInput.min = '0';
            amountInput.step = '5';

            function onValueChange()
            {
                smeltingValue = null;
                win.selectBar('', null, amountInput, document.getElementById('smelting-furnace-capacity').value);
            }
            amountInput.addEventListener('mouseup', onValueChange);
            amountInput.addEventListener('keyup', onValueChange);
            amountInput.setAttribute('onkeyup', '');
        }

        function setBarCap(bar, capacity)
        {
            if (bar == '')
            {
                bar = win.selectedBar;
            }
            var requirements = SMELTING_REQUIREMENTS[bar];
            var maxAmount = parseInt(capacity, 10);
            for (var key in requirements)
            {
                var req = requirements[key];
                maxAmount = Math.min(Math.floor(getGameValue(key) / req), maxAmount);
            }
            var value = parseInt(amountInput.value, 10);
            if (value > maxAmount)
            {
                smeltingValue = value;
                amountInput.value = maxAmount.toString();
            }
            else if (smeltingValue != null)
            {
                amountInput.value = Math.min(smeltingValue, maxAmount).toString();
                if (smeltingValue <= maxAmount)
                {
                    smeltingValue = null;
                }
            }
        }

        function prepareTimeNeeded()
        {
            var neededMatsEl = document.getElementById('dialogue-furnace-mats-needed');
            var parent = neededMatsEl && neededMatsEl.parentElement;
            if (!neededMatsEl || !parent)
            {
                return;
            }
            var br = document.createElement('br');
            var timeBox = document.createElement('div');
            timeBox.className = 'basic-smallbox';
            timeBox.innerHTML = "<img src=\"images/icons/hourglass.png\" class=\"image-icon-30\">\n\t\tDuration: <span id=\"" + TIME_NEEDED_ID + "\"></span>";
            var next = neededMatsEl.nextElementSibling;
            parent.insertBefore(br, next);
            parent.insertBefore(timeBox, next);
        }

        function updateTimeNeeded(value)
        {
            var timeEl = document.getElementById(TIME_NEEDED_ID);
            if (!timeEl)
            {
                return;
            }
            var num = parseInt(value, 10);
            var timePerBar = win.getTimerPerBar(win.selectedBar);
            timeEl.textContent = format.timer(timePerBar * num);
        }

        function init()
        {
            prepareAmountInput();
            prepareTimeNeeded();
            var _selectBar = win.selectBar;
            var updateSmeltingRequirements = function (bar, inputElement, inputBarsAmountEl, capacity)
            {
                _selectBar(bar, inputElement, inputBarsAmountEl, capacity);
                var matsArea = document.getElementById('dialogue-furnace-mats-needed');
                if (matsArea)
                {
                    matsArea.innerHTML = format.numbersInText(matsArea.innerHTML);
                }
                updateTimeNeeded(inputBarsAmountEl.value);
            };
            win.selectBar = function (bar, inputElement, inputBarsAmountEl, capacity)
            {
                setBarCap(bar, capacity);
                // save selected bar
                if (bar != '')
                {
                    store.set(LAST_SMELTING_BAR_KEY, bar);
                }
                // save amount
                store.set(LAST_SMELTING_AMOUNT_KEY, inputBarsAmountEl.value);
                updateSmeltingRequirements(bar, inputElement, inputBarsAmountEl, capacity);
            };
            var lastBar = store.get(LAST_SMELTING_BAR_KEY);
            var lastAmount = store.get(LAST_SMELTING_AMOUNT_KEY);
            var _openFurnaceDialogue = win.openFurnaceDialogue;
            win.openFurnaceDialogue = function (furnace)
            {
                var capacity = win.getFurnaceCapacity(furnace);
                if (win.smeltingBarType == 0)
                {
                    amountInput.max = capacity.toString();
                }
                // restore amount
                var inputBarsAmountEl = document.getElementById('input-smelt-bars-amount');
                if (inputBarsAmountEl && inputBarsAmountEl.value == '-1' && lastAmount != null)
                {
                    inputBarsAmountEl.value = lastAmount;
                }
                _openFurnaceDialogue(furnace);
                // restore selected bar
                if ((!win.selectedBar || win.selectedBar == 'none') && lastBar != null)
                {
                    win.selectedBar = lastBar;
                }
                // update whether requirements are fulfilled
                var barInputId = 'input-furnace-' + split2Words(win.selectedBar, '-').toLowerCase();
                var inputElement = document.getElementById(barInputId);
                if (inputElement && inputBarsAmountEl)
                {
                    updateSmeltingRequirements(win.selectedBar, inputElement, inputBarsAmountEl, capacity.toString());
                }
            };
        }
        smelting.init = init;
    })(smelting || (smelting = {}));

    /**
 * add chance to time calculator
 */
    var fishingInfo;
    (function (fishingInfo)
     {
        fishingInfo.name = 'fishingInfo';
        /**
	 * calculates the number of seconds until the event with the given chance happened at least once with the given
	 * probability p (in percent)
	 */
        function calcSecondsTillP(chancePerSecond, p)
        {
            return Math.round(Math.log(1 - p / 100) / Math.log(1 - chancePerSecond));
        }

        function addChanceTooltip(headline, chancePerSecond, elId, targetEl)
        {
            // ensure tooltip exists and is correctly binded
            var tooltipEl = ensureTooltip('chance-' + elId, targetEl);
            // set elements content
            var percValues = [1, 10, 20, 50, 80, 90, 99];
            var percRows = '';
            for (var _i = 0, percValues_1 = percValues; _i < percValues_1.length; _i++)
            {
                var p = percValues_1[_i];
                percRows += "\n\t\t\t\t<tr>\n\t\t\t\t\t<td>" + p + "%</td>\n\t\t\t\t\t<td>" + format.time2NearestUnit(calcSecondsTillP(chancePerSecond, p), true) + "</td>\n\t\t\t\t</tr>";
            }
            tooltipEl.innerHTML = "<h2>" + headline + "</h2>\n\t\t\t<table class=\"chance\">\n\t\t\t\t<tr>\n\t\t\t\t\t<th>Probability</th>\n\t\t\t\t\t<th>Time</th>\n\t\t\t\t</tr>\n\t\t\t\t" + percRows + "\n\t\t\t</table>\n\t\t";
        }

        function addChanceStyle()
        {
            addStyle("\ntable.chance\n{\n\tborder-spacing: 0;\n}\ntable.chance th\n{\n\tborder-bottom: 1px solid gray;\n}\ntable.chance td:first-child\n{\n\tborder-right: 1px solid gray;\n\ttext-align: center;\n}\ntable.chance th,\ntable.chance td\n{\n\tpadding: 4px 8px;\n}\ntable.chance tr:nth-child(2n) td\n{\n\tbackground-color: white;\n}\n\t\t");
        }

        function addXp()
        {
            var table = document.querySelector('#dialogue-id-fishingRod table');
            if (!table)
            {
                return;
            }
            var rows = table.rows;
            for (var i = 0; i < rows.length; i++)
            {
                var row = rows.item(i);
                if (row.classList.contains('xp-added'))
                {
                    continue;
                }
                if (i == 0)
                {
                    var xpCell = document.createElement('th');
                    xpCell.textContent = 'XP';
                    row.appendChild(xpCell);
                }
                else
                {
                    var cell = row.insertCell(-1);
                    var rawFish = row.id.replace('dialogue-fishing-rod-tr-', '');
                    var xp = FISH_XP[rawFish];
                    cell.textContent = xp == null ? '?' : format.number(xp);
                }
                row.classList.add('xp-added');
            }
        }

        function chance2TimeCalculator()
        {
            var table = document.querySelector('#dialogue-id-fishingRod table');
            if (!table)
            {
                return;
            }
            var rows = table.rows;
            for (var i = 1; i < rows.length; i++)
            {
                var row = rows.item(i);
                var rawFish = row.id.replace('dialogue-fishing-rod-tr-', '');
                var fish = rawFish.replace('raw', '').toLowerCase();
                if (!rawFish || !fish)
                {
                    continue;
                }
                var chanceCell = row.cells.item(row.cells.length - 2);
                var chance = (chanceCell.textContent || '')
                .replace(/[^\d\/]/g, '')
                .split('/')
                .reduce(function (p, c)
                        {
                    return p / parseInt(c, 10);
                }, 1);
                addChanceTooltip("One raw " + fish + " at least every:", chance, rawFish, row);
            }
        }

        function init()
        {
            addChanceStyle();
            var _clicksShovel = win.clicksShovel;
            win.clicksShovel = function ()
            {
                _clicksShovel();
                var shovelChance = document.getElementById('dialogue-shovel-chance');
                var titleEl = shovelChance.parentElement;
                var chance = 1 / win.getChanceOfDiggingSand();
                addChanceTooltip('One sand at least every:', chance, 'shovel', titleEl);
            };
            // depends on fishingXp
            var _clicksFishingRod = win.clicksFishingRod;
            win.clicksFishingRod = function ()
            {
                _clicksFishingRod();
                addXp();
                chance2TimeCalculator();
            };
        }
        fishingInfo.init = init;
    })(fishingInfo || (fishingInfo = {}));

    /**
 * add tooltips for recipes
 */
    var recipeTooltips;
    (function (recipeTooltips)
     {
        recipeTooltips.name = 'recipeTooltips';

        function updateRecipeTooltips(recipeKey, recipes)
        {
            var table = document.getElementById('table-' + recipeKey + '-recipe');
            var rows = table.rows;

            function recipe2Title(recipe)
            {
                return recipe.recipe
                    .map(function (name, i)
                         {
                    return format.number(recipe.recipeCost[i]) + String.fromCharCode(160)
                        + split2Words(name).toLowerCase();
                })
                    .join(' + ');
            };
            for (var i = 1; i < rows.length; i++)
            {
                var row = rows.item(i);
                var key = row.id.replace(recipeKey + '-', '');
                var recipe = recipes[key];
                var requirementCell = row.cells.item(3);
                requirementCell.title = recipe2Title(recipe);
                win.$(requirementCell).tooltip();
            }
        }

        function updateTooltipsOnReinitRecipes(key)
        {
            var capitalKey = capitalize(key);
            var processKey = 'process' + capitalKey + 'Tab';
            var _processTab = win[processKey];
            win[processKey] = function ()
            {
                var reinit = !!getGameValue('refreshLoad' + capitalKey + 'Table');
                _processTab();
                if (reinit)
                {
                    updateRecipeTooltips(key, getGameValue(key + 'Recipes'));
                }
            };
        }

        function init()
        {
            updateTooltipsOnReinitRecipes('crafting');
            updateTooltipsOnReinitRecipes('brewing');
            updateTooltipsOnReinitRecipes('magic');
            updateTooltipsOnReinitRecipes('cooksBook');
        }
        recipeTooltips.init = init;
    })(recipeTooltips || (recipeTooltips = {}));

    /**
 * fix formatting of numbers
 */
    var fixNumbers;
    (function (fixNumbers)
     {
        fixNumbers.name = 'fixNumbers';

        function prepareRecipeForTable(recipe)
        {
            // create a copy of the recipe to prevent requirement check from failing
            var newRecipe = JSON.parse(JSON.stringify(recipe));
            newRecipe.recipeCost = recipe.recipeCost.map(function (cost)
                                                         {
                return format.number(cost);
            });
            newRecipe.description = format.numbersInText(newRecipe.description);
            newRecipe.xp = format.number(recipe.xp);
            return newRecipe;
        }

        function init()
        {
            var _addRecipeToBrewingTable = win.addRecipeToBrewingTable;
            win.addRecipeToBrewingTable = function (brewingRecipe)
            {
                _addRecipeToBrewingTable(prepareRecipeForTable(brewingRecipe));
            };
            var _addRecipeToMagicTable = win.addRecipeToMagicTable;
            win.addRecipeToMagicTable = function (magicRecipe)
            {
                _addRecipeToMagicTable(prepareRecipeForTable(magicRecipe));
            };
            var _addRecipeToCooksBookTable = win.addRecipeToCooksBookTable;
            win.addRecipeToCooksBookTable = function (cooksBookRecipe)
            {
                _addRecipeToCooksBookTable(prepareRecipeForTable(cooksBookRecipe));
            };
            var tooltipList = document.querySelectorAll('#tooltip-list div[id^="tooltip-"][id$="Seeds"]');
            for (var i = 0; i < tooltipList.length; i++)
            {
                var tooltip = tooltipList[i];
                tooltip.innerHTML = format.numbersInText(tooltip.innerHTML);
            }
            var fightEnergyCells = document.querySelectorAll('#dialogue-fight tr > td:nth-child(4)');
            for (var i = 0; i < fightEnergyCells.length; i++)
            {
                var cell = fightEnergyCells[i];
                cell.innerHTML = format.numbersInText(cell.innerHTML);
            }
            var _rocketTick = win.rocketTick;
            win.rocketTick = function ()
            {
                _rocketTick();
                var rocketBox = document.getElementById('itembox-rocket');
                if (rocketBox && /^\d+\s*Km$/i.test(rocketBox.textContent || ''))
                {
                    rocketBox.innerHTML = format.numbersInText(rocketBox.innerHTML).replace('Km', 'km');
                }
            };
        }
        fixNumbers.init = init;
    })(fixNumbers || (fixNumbers = {}));

    /**
 * add slider for machines
 */
    var machineDialog;
    (function (machineDialog)
     {
        machineDialog.name = 'machineDialog';
        var $slider;

        function createSlider()
        {
            var br = document.querySelector('#dialogue-machinery-current-total ~ br');
            var parent = br && br.parentElement;
            if (!br || !parent)
            {
                return;
            }
            addStyle("\n#dialogue-id-boundMachinery .ui-slider\n{\n\tmargin: 10px 5px;\n}\n#dialogue-id-boundMachinery .ui-slider:not([data-owned=\"10\"])::after\n{\n\tbackground: hsla(0, 0%, 0%, 1);\n\tborder: 1px solid #c5c5c5;\n\tborder-radius: 3px;\n\tborder-top-left-radius: 0;\n\tborder-bottom-left-radius: 0;\n\tcontent: '';\n\tmargin-left: -3px;\n\tpadding-left: 3px;\n\theight: 100%;\n\twidth: 0%;\n\tposition: absolute;\n\tleft: 100%;\n\ttop: -1px;\n}\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"9\"] { width: calc((100% - 10px - 2px) / 10*9); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"9\"]::after { width: calc(100% / 9 * 1); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"8\"] { width: calc((100% - 10px - 2px) / 10*8); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"8\"]::after { width: calc(100% / 8 * 2); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"7\"] { width: calc((100% - 10px - 2px) / 10*7); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"7\"]::after { width: calc(100% / 7 * 3); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"6\"] { width: calc((100% - 10px - 2px) / 10*6); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"6\"]::after { width: calc(100% / 6 * 4); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"5\"] { width: calc((100% - 10px - 2px) / 10*5); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"5\"]::after { width: calc(100% / 5 * 5); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"4\"] { width: calc((100% - 10px - 2px) / 10*4); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"4\"]::after { width: calc(100% / 4 * 6); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"3\"] { width: calc((100% - 10px - 2px) / 10*3); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"3\"]::after { width: calc(100% / 3 * 7); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"2\"] { width: calc((100% - 10px - 2px) / 10*2); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"2\"]::after { width: calc(100% / 2 * 8); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"1\"] { width: calc((100% - 10px - 2px) / 10*1); }\n#dialogue-id-boundMachinery .ui-slider[data-owned=\"1\"]::after { width: calc(100% / 1 * 9); }\n\t\t");
            var slider = document.createElement('div');
            parent.insertBefore(slider, br);
            $slider = win.$(slider)
                .slider(
                {
                    range: 'max'
                    , min: 0
                    , max: 10
                    , value: 0
                    , slide: function (event, ui)
                    {
                        return updateValue(ui.value);
                    }
                });
            // hide br and up/down arrows
            br.style.display = 'none';
            var arrows = document.querySelectorAll('input[onclick^="turnOn("]');
            for (var i = 0; i < arrows.length; i++)
            {
                arrows[i].style.display = 'none';
            }
            var els = document.querySelectorAll('[onclick*="openMachineryDialogue("]');
            var boundMachineKeyList = [];
            for (var i = 0; i < els.length; i++)
            {
                var match = els[i].id.match(/openMachineryDialogue\('(.+?)'\)/);
                if (match)
                {
                    boundMachineKeyList.push(getBoundKey(match[1]));
                }
            }
            observer.add(boundMachineKeyList, function ()
                         {
                return updateMax();
            });
        }

        function updateMax()
        {
            var machineEl = document.getElementById('dialogue-machinery-chosen');
            if (machineEl && machineEl.value != '')
            {
                var boundMachineKey = getBoundKey(machineEl.value);
                var ownedNum = getGameValue(boundMachineKey);
                $slider.slider('option', 'max', ownedNum);
                $slider.get(0).dataset.owned = ownedNum.toString();
            }
        }

        function updateValue(value)
        {
            var typeEl = document.getElementById('dialogue-machinery-chosen');
            var numEl = document.getElementById('dialogue-machinery-current-on');
            if (numEl && typeEl)
            {
                var valueBefore = parseInt(numEl.textContent || '0', 10);
                var machine = typeEl.value;
                var increment = valueBefore < value;
                var diff = Math.abs(valueBefore - value);
                for (var i = 0; i < diff; i++)
                {
                    win.turnOn(machine, increment);
                }
            }
        }

        function init()
        {
            if (!settings.get(settings.KEY.changeMachineDialog))
            {
                return;
            }
            createSlider();
            var _openMachineryDialogue = win.openMachineryDialogue;
            win.openMachineryDialogue = function (machineType)
            {
                _openMachineryDialogue(machineType);
                updateMax();
                $slider.slider('value', getGameValue(machineType + 'On'));
            };
        }
        machineDialog.init = init;
    })(machineDialog || (machineDialog = {}));

    /**
 * improve behaviour of amount inputs
 */
    var amountInputs;
    (function (amountInputs)
     {
        amountInputs.name = 'amountInputs';

        function getVialType(recipe)
        {
            return recipe.levelReq < 35 ? 'vialOfWater' : (recipe.levelReq < 65 ? 'largeVialOfWater' : 'hugeVialOfWater');
        }

        function getSimpleMax(recipe)
        {
            var max = Number.MAX_SAFE_INTEGER;
            for (var i = 0; i < recipe.recipe.length; i++)
            {
                max = Math.min(max, Math.floor(getGameValue(recipe.recipe[i]) / recipe.recipeCost[i]));
            }
            return max;
        }

        function getMax(recipe)
        {
            var max = getSimpleMax(recipe);
            if (/Potion$/.test(recipe.itemName))
            {
                var vialType = getVialType(recipe);
                max = Math.min(max, getGameValue(vialType));
            }
            return max;
        }

        function ensureNumberInput(idOrEl)
        {
            var numInput = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
            if (numInput)
            {
                if (numInput.type != 'number' && settings.get(settings.KEY.makeNumberInputs))
                {
                    var width = numInput.clientWidth;
                    if (width !== 0)
                    {
                        numInput.style.width = width + 'px';
                    }
                    numInput.type = 'number';
                    numInput.min = '0';
                    var onkeyup_1 = numInput.getAttribute('onkeyup');
                    if (onkeyup_1)
                    {
                        numInput.setAttribute('onmouseup', onkeyup_1);
                    }
                }
                else if (numInput.type == 'number' && !settings.get(settings.KEY.makeNumberInputs))
                {
                    numInput.style.width = '';
                    numInput.type = '';
                    numInput.removeAttribute('onmouseup');
                }
            }
            return numInput;
        }

        function getCurrentMax(keyId, recipeCollection)
        {
            var keyEl = document.getElementById(keyId);
            if (!keyEl)
            {
                return 0;
            }
            var key = keyEl.value;
            return getMax(recipeCollection[key]);
        };

        function ensureMaxBtn(keyId, inputId, recipeCollection, key)
        {
            var recipe = recipeCollection[key];
            var numInput = ensureNumberInput(inputId);
            var next = numInput && numInput.nextElementSibling;
            var parent = numInput && numInput.parentElement;
            if (numInput && parent)
            {
                if ((!next || next.nodeName !== 'BUTTON') && settings.get(settings.KEY.addMaxBtn))
                {
                    var btn = document.createElement('button');
                    btn.textContent = 'Max';
                    btn.addEventListener('click', function ()
                                         {
                        numInput.value = getCurrentMax(keyId, recipeCollection).toString();
                    });
                    parent.appendChild(btn);
                }
                else if (next && next.nodeName === 'BUTTON' && !settings.get(settings.KEY.addMaxBtn))
                {
                    parent.removeChild(next);
                }
                numInput.value = Math.min(1, getMax(recipe)).toString();
                numInput.select();
            }
        }

        function ensureMaxBtnMarket(inputId, item)
        {
            var numInput = ensureNumberInput(inputId);
            var next = numInput && numInput.nextElementSibling;
            var parent = numInput && numInput.parentElement;
            let price = item.attributes["data-market-price"].value;
            var marketItemAmount = item.attributes["data-market-amount"].value
            var marketRecipe = {
                            'recipe' :['coins'],
                            'recipeCost': [price]
                        }
            if (numInput && parent)
            {
                if ((!next || next.nodeName !== 'BUTTON') && settings.get(settings.KEY.addMaxBtn))
                {
                    let maxBtnMarket = document.createElement('button');
                    maxBtnMarket.id = "maxBtnMarket";
                    maxBtnMarket.textContent = 'Max';
                    maxBtnMarket.addEventListener('click', function ()
                                         {
                        numInput.value = maxBtnMarket.value;
                    });
                    parent.appendChild(maxBtnMarket);
                }
                else if (next && next.nodeName === 'BUTTON' && !settings.get(settings.KEY.addMaxBtn))
                {
                    parent.removeChild(next);
                }
                let maxVal = Math.min(getMax(marketRecipe),marketItemAmount).toString();
                document.getElementById("maxBtnMarket").value = maxVal
                numInput.value = maxVal
                numInput.select();
            }
        }

        function watchKeepInput(event)
        {
            var itemInput = document.getElementById('npc-sell-item-chosen');
            var numInput = ensureNumberInput('dialogue-input-cmd');
            if (!itemInput || !numInput)
            {
                return;
            }
            var item = itemInput.value;
            var newValue = Math.max(getGameValue(item) - Number(this.value), 0);
            numInput.value = newValue.toString();
        }

        function updateKeepMaxValue(keepInput, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var itemInput = document.getElementById('npc-sell-item-chosen');
            if (!itemInput)
            {
                return;
            }
            var item = itemInput.value;
            var max = getGameValue(item);
            keepInput.max = max.toString();
            if (init)
            {
                observer.addTick(function ()
                                 {
                    return updateKeepMaxValue(keepInput);
                });
            }
        }

        function ensureKeepInput(item)
        {
            var numInput = ensureNumberInput('dialogue-input-cmd');
            var parent = numInput && numInput.parentElement;
            var next = numInput && numInput.nextElementSibling;
            var nextNext = next && next.nextElementSibling;
            if (next && nextNext && parent)
            {
                if (nextNext.nodeName === 'BR' && settings.get(settings.KEY.addKeepInput))
                {
                    var div = document.createElement('div');
                    var text = document.createTextNode('Keep: ');
                    div.appendChild(text);
                    var keepInput = document.createElement('input');
                    keepInput.type = 'number';
                    keepInput.value = keepInput.min = '0';
                    keepInput.max = getGameValue(item).toString();
                    keepInput.addEventListener('keyup', watchKeepInput);
                    keepInput.addEventListener('mouseup', watchKeepInput);
                    updateKeepMaxValue(keepInput, true);
                    div.appendChild(keepInput);
                    parent.insertBefore(div, nextNext);
                }
                else if (nextNext.nodeName !== 'BR' && !settings.get(settings.KEY.addKeepInput))
                {
                    var br = document.createElement('br');
                    parent.insertBefore(br, nextNext);
                    parent.removeChild(nextNext);
                }
            }
        }

        function init()
        {
            ensureNumberInput("dialogue-input-cmd-fireChickenPotion");
            ensureNumberInput("dialogue-input-cmd-iceChickenPotion");
            ensureNumberInput("dialogue-input-cmd-lavaChickenPotion");
            var _multiCraft = win.multiCraft;
            win.multiCraft = function (item)
            {
                _multiCraft(item);
                ensureMaxBtn('dialogue-multicraft-chosen', 'dialogue-multicraft-input', win.craftingRecipes, item);
            };
            var _brew = win.brew;
            win.brew = function (potion)
            {
                _brew(potion);
                ensureMaxBtn('dialogue-potion-chosen', 'dialogue-brewing-input', win.brewingRecipes, potion);
            };
            var _cooksBookInputDialogue = win.cooksBookInputDialogue;
            win.cooksBookInputDialogue = function (food)
            {
                _cooksBookInputDialogue(food);
                ensureMaxBtn('dialogue-cooksBook-chosen', 'dialogue-cooksBook-input', win.cooksBookRecipes, food);
            };
            var _openSellNPCDialogue = win.openSellNPCDialogue;
            win.openSellNPCDialogue = function (item)
            {
                _openSellNPCDialogue(item);
                ensureKeepInput(item);
            };
            var npcBuyMultipleItems = [];
            npcBuyMultipleItems['empoweredStone'] = {
                'recipe' : ['stone','stardust'],
                'recipeCost': [win.achMagicMediumCompleted?5e5:1e6,1e5]
            };
            npcBuyMultipleItems['empoweredMoonstone'] = {
                'recipe' : ['moonstone','stardust'],
                'recipeCost': [win.achMagicMediumCompleted?50:100,1e5]
            };
            npcBuyMultipleItems['empoweredMarsRock'] = {
                'recipe' :['marsRock','stardust'],
                'recipeCost': [win.achMagicMediumCompleted?5:10,1e5]
            };
            npcBuyMultipleItems['empoweredPromethium'] = {
                'recipe' :['promethium','stardust'],
                'recipeCost': [win.achMagicMediumCompleted?15:30,1e5]
            };
            npcBuyMultipleItems['empoweredRunite'] = {
                'recipe' :['runite','stardust'],
                'recipeCost': [1,1e5]
            };
            npcBuyMultipleItems['greenWizardSilk'] = {
                'recipe' :['strangeGreenLeaf'],
                'recipeCost': [1]
            };
            npcBuyMultipleItems['yellowWizardSilk'] = {
                'recipe' :['strangeYellowLeaf'],
                'recipeCost': [1]
            };
            npcBuyMultipleItems['blueWizardSilk'] = {
                'recipe' :['strangeBlueLeaf'],
                'recipeCost': [1]
            };
            npcBuyMultipleItems['pinkWizardSilk'] = {
                'recipe' :['strangePinkLeaf'],
                'recipeCost': [1]
            };
            npcBuyMultipleItems['purpleWizardSilk'] = {
                'recipe' :['strangePurpleLeaf'],
                'recipeCost': [1]
            };
            npcBuyMultipleItems['darkWizardSilk'] = {
                'recipe' :['strangeDarkLeaf'],
                'recipeCost': [1]
            };
            npcBuyMultipleItems['sickCurePotion'] = {
                'recipe' :['coins'],
                'recipeCost': [5e5]
            };
            npcBuyMultipleItems['stardustBox1'] = {
                'recipe' :['coins'],
                'recipeCost': [5e5]
            };
            npcBuyMultipleItems['stardustBox2'] = {
                'recipe' :['coins'],
                'recipeCost': [2e6]
            };
            npcBuyMultipleItems['stardustBox3'] = {
                'recipe' :['coins'],
                'recipeCost': [175e5]
            };
            var _buyMultipleFromNpcShop = win.buyMultipleFromNpcShop;
            win.buyMultipleFromNpcShop = function(item)
            {
                _buyMultipleFromNpcShop(item);
                ensureMaxBtn('npc-buy-item-chosen-2', 'dialogue-input-cmd-2', npcBuyMultipleItems, item);
            }
            var _openBuyFromPlayerMarketDialogue = win.openBuyFromPlayerMarketDialogue;
            win.openBuyFromPlayerMarketDialogue = function(item)
            {
                _openBuyFromPlayerMarketDialogue(item);
                ensureMaxBtnMarket('buyFromMarket-input', item);
            }
            var allowedInputs = [
                'dialogue-ashes'
                , 'dialogue-bindDonorCoins'
                , 'dialogue-bonemeal'
                , 'dialogue-bones'
                , 'dialogue-brewing'
                , 'dialogue-buy-item-2'
                , 'dialogue-buyFromMarket'
                , 'dialogue-charcoalFoundry'
                , 'dialogue-consume'
                , 'dialogue-cooksBook'
                , 'dialogue-createArrows'
                , 'dialogue-createFireArrows'
                , 'dialogue-createIceArrows'
                , 'dialogue-furnace'
                , 'dialogue-iceBones'
                , 'dialogue-id-boundHammer'
                , 'dialogue-id-boundPickaxe'
                , 'dialogue-id-cook-food'
                , 'dialogue-id-oven-addheat'
                , 'dialogue-market-chosenpostitem'
                , 'dialogue-multicraft'
                , 'dialogue-oilBarrels'
                , 'dialogue-oilFactory'
                , 'dialogue-sell-item'
                , 'dialogue-stardustCrystals'
                , 'dialogue-wand'
            ];
            var _openDialogue = win.openDialogue;
            win.openDialogue = function (id, width, position)
            {
                _openDialogue(id, width, position);
                if (allowedInputs.indexOf(id) === -1
                    || id === 'dialogue-buyFromMarket' && market.detectTedsUI()
                    || id === 'dialogue-market-chosenpostitem' && market.detectTedsUI())
                {
                    return;
                }
                var dialog = document.getElementById(id);
                var input = dialog && dialog.querySelector('input[type="text"],input[type="number"]');
                if (!input)
                {
                    return;
                }
                ensureNumberInput(input);
            };
        }
        amountInputs.init = init;
    })(amountInputs || (amountInputs = {}));

    /**
 * improves the top bar
 */
    var newTopbar;
    (function (newTopbar)
     {
        newTopbar.name = 'newTopbar';
        var linkCell, tabCell, infoCell;
        var addQueues = {
            link: []
            , tab: []
            , info: []
        };

        function createPipeNode()
        {
            return document.createTextNode('|');
        }

        function addLinkEntry(el)
        {
            if (!linkCell)
            {
                addQueues.link.push(el);
            }
            else
            {
                linkCell.appendChild(createPipeNode());
                linkCell.appendChild(el);
            }
        }
        newTopbar.addLinkEntry = addLinkEntry;

        function addTabEntry(el)
        {
            if (!tabCell)
            {
                addQueues.tab.push(el);
            }
            else
            {
                tabCell.appendChild(createPipeNode());
                tabCell.appendChild(el);
            }
        }
        newTopbar.addTabEntry = addTabEntry;

        function addInfoEntry(el)
        {
            if (!infoCell)
            {
                addQueues.info.push(el);
            }
            else
            {
                if (infoCell.firstChild)
                {
                    infoCell.insertBefore(createPipeNode(), infoCell.firstChild);
                    infoCell.insertBefore(el, infoCell.firstChild);
                }
                else
                {
                    infoCell.appendChild(createPipeNode());
                    infoCell.appendChild(el);
                }
            }
        }
        newTopbar.addInfoEntry = addInfoEntry;

        function init()
        {
            if (!settings.get(settings.KEY.useNewToolbar))
            {
                return;
            }
            addStyle("\ntable.top-links,\ntable.top-links *\n{\n\tpadding: 0;\n}\ntable.top-links td > *\n{\n\tdisplay: inline-block;\n\tpadding: 2px 6px;\n}\n\t\t");
            var table = document.querySelector('table.top-links');
            if (!table)
            {
                return;
            }
            var row = table.rows.item(0);
            var cells = row.cells;
            var tabIdx = [2, 5];
            var infoIdx = [6, 7];
            var newRow = table.insertRow(-1);
            linkCell = newRow.insertCell(-1);
            tabCell = newRow.insertCell(-1);
            tabCell.style.textAlign = 'center';
            infoCell = newRow.insertCell(-1);
            infoCell.style.textAlign = 'right';
            for (var i = 0; i < cells.length; i++)
            {
                var container = linkCell;
                if (tabIdx.indexOf(i) != -1)
                {
                    container = tabCell;
                }
                else if (infoIdx.indexOf(i) != -1)
                {
                    container = infoCell;
                }
                var cell = cells.item(i);
                var el = cell.firstElementChild;
                if (cell.childNodes.length > 1)
                {
                    el = document.createElement('span');
                    el.style.color = 'yellow';
                    while (cell.childNodes.length > 0)
                    {
                        el.appendChild(cell.childNodes[0]);
                    }
                }
                if (container.children.length > 0)
                {
                    container.appendChild(createPipeNode());
                }
                if (el)
                {
                    container.appendChild(el);
                }
            }
            var parent = row.parentElement;
            if (parent)
            {
                parent.removeChild(row);
            }
            for (var _i = 0, _a = addQueues.link; _i < _a.length; _i++)
            {
                var el = _a[_i];
                addLinkEntry(el);
            }
            for (var _b = 0, _c = addQueues.tab; _b < _c.length; _b++)
            {
                var el = _c[_b];
                addTabEntry(el);
            }
            for (var _d = 0, _e = addQueues.info; _d < _e.length; _d++)
            {
                var el = _e[_d];
                addInfoEntry(el);
            }
            var _openTab = win.openTab;
            win.openTab = function (newTab)
            {
                var oldTab = win.currentOpenTab;
                _openTab(newTab);
                var children = tabCell.children;
                for (var i = 0; i < children.length; i++)
                {
                    var el = children[i];
                    var match = (el.getAttribute('onclick') || '').match(/openTab\('([^']+)'\)/);
                    if (!match)
                    {
                        continue;
                    }
                    var tab = match[1];
                    if (oldTab == tab)
                    {
                        el.style.color = '';
                    }
                    if (newTab == tab)
                    {
                        el.style.color = 'white';
                    }
                }
            };
        }
        newTopbar.init = init;
    })(newTopbar || (newTopbar = {}));

    /**
 * style tweaks
 */
    var styleTweaks;
    (function (styleTweaks)
     {
        styleTweaks.name = 'styleTweaks';
        var bodyRegex = /(\bbody)(\s|$)/i;

        function addTweakStyle(setting, style)
        {
            if (setting != '')
            {
                var prefix_1 = setting === '' ? '' : 'body.' + setting + ' ';
                style = style
                    .replace(/(^\s*|\}\s*)([^\{\}]+)(?=\s*\{)/g, function (wholeMatch, before, rules)
                             {
                    return before + rules.split(',').map(function (rule)
                                                         {
                        if (bodyRegex.test(rule) && setting !== '')
                        {
                            return rule.replace(bodyRegex, '$1.' + setting + '$2');
                        }
                        return rule.replace(/^(\s*\n\s*)?/, '$1' + prefix_1);
                    }).join(',');
                });
                document.body.classList.add(setting);
            }
            addStyle(style, setting != '' ? setting : null);
        }
        // tweak oil production/consumption
        function tweakOil()
        {
            addTweakStyle('tweak-oil', "\nspan#oil-flow-values\n{\n\tmargin-left: .5em;\n\tpadding-left: 2rem;\n\tposition: relative;\n}\n#oil-flow-values > span:nth-child(-n+2)\n{\n\tfont-size: 0px;\n\tposition: absolute;\n\tleft: 0;\n\ttop: -0.75rem;\n\tvisibility: hidden;\n}\n#oil-flow-values > span:nth-child(-n+2) > span\n{\n\tfont-size: 1rem;\n\tvisibility: visible;\n}\n#oil-flow-values > span:nth-child(2)\n{\n\ttop: 0.75rem;\n}\n#oil-flow-values span[data-item-display=\"oilIn\"]::before\n{\n\tcontent: '+';\n}\n#oil-flow-values span[data-item-display=\"oilOut\"]::before\n{\n\tcontent: '-';\n}\n\t\t");
            // make room for oil cell on small devices
            var oilFlowValues = document.getElementById('oil-flow-values');
            var oilFlowCell = oilFlowValues.parentElement;
            oilFlowCell.style.width = '30%';
        }

        function tweakSelection()
        {
            addTweakStyle('no-select', "\ntable.tab-bar,\nspan.item-box,\ndiv.farming-patch,\ndiv.farming-patch-locked,\ndiv#tab-sub-container-combat > span,\ntable.top-links a,\n#hero-area > div:last-child\n{\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n\t\t");
        }
        // tweak stardust monitor of DH2QoL to keep it in place
        function tweakStardust()
        {
            addTweakStyle('dh2qol', "\n#dh2qol-stardustMonitor\n{\n\tdisplay: inline-block;\n\tmargin-left: .25rem;\n\ttext-align: left;\n\twidth: 2.5rem;\n}\n\t\t");
        }

        function tweakSkillLevelText()
        {
            addTweakStyle('', "\ndiv.skill-xp-label\n{\n\ttext-shadow: white 0px 0px 0.5rem;\n}\n\t\t");
        }

        function tweakFightDialog()
        {
            addTweakStyle('smaller-fight-dialog', "\n#dialogue-fight img[width=\"150px\"]\n{\n\twidth: 120px;\n\theight: 50px;\n}\n#dialogue-fight img[src=\"images/icons/combat.png\"] ~ br\n{\n\tdisplay: none;\n}\n\t\t");
        }

        function addAdditionalSkillBars()
        {
            if (!settings.get(settings.KEY.skillBars)){
                return;
            }
            var _loadSkillTabs = win.loadSkillTabs;
            win.loadSkillTabs = function ()
            {
                _loadSkillTabs();
                for (var _i = 0, SKILL_LIST_1 = SKILL_LIST; _i < SKILL_LIST_1.length; _i++)
                {
                    var skill = SKILL_LIST_1[_i];
                    var unlocked = getGameValue(skill + 'Unlocked') == 1;
                    if (!unlocked)
                    {
                        continue;
                    }
                    var xp = getGameValue(skill + 'Xp');
                    var currentLevelXp = win.getXpNeeded(win.getLevel(xp));
                    var nextLevelXp = win.getXpNeeded(win.getLevel(xp) + 1);
                    var perc = (xp - currentLevelXp) / (nextLevelXp - currentLevelXp) * 100;
                    var progress = document.getElementById('skill-progress-' + skill);
                    if (progress)
                    {
                        if (currentLevelXp >= 10000000)
                        {
                            perc = 100;
                            progress.style.backgroundColor = "yellow";
                        }
                        progress.style.width = perc + '%';
                    }
                }
            };
            // init additional skill bars
            addStyle("\ntd[id^=\"top-bar-level-td-\"]\n{\n\tposition: relative;\n}\n#top-bar-levels .skill-bar\n{\n\tbackground-color: grey;\n\theight: 5px;\n\tposition: absolute;\n\tbottom: 5px;\n\tleft: 60px;\n\tright: 10px;\n}\n#top-bar-levels .skill-bar > .skill-progress\n{\n\tbackground-color: rgb(51, 204, 51);\n\theight: 100%;\n\twidth: 0%;\n}\n\t\t");
            for (var _i = 0, SKILL_LIST_2 = SKILL_LIST; _i < SKILL_LIST_2.length; _i++)
            {
                var skill = SKILL_LIST_2[_i];
                var cell = document.getElementById('top-bar-level-td-' + skill);
                if (!cell)
                {
                    continue;
                }
                var levelBar = document.createElement('div');
                levelBar.className = 'skill-bar';
                var progress = document.createElement('div');
                progress.id = 'skill-progress-' + skill;
                progress.className = 'skill-progress';
                levelBar.appendChild(progress);
                cell.appendChild(levelBar);
                // update skill level progress bars on click
                levelBar.addEventListener('click', function ()
                                          {
                    return win.loadSkillTabs();
                });
            }
            win.loadSkillTabs();
        }
        // highlight cooking level requirement when not matched
        function highlightCookinglevel()
        {
            var _cookFoodDialogue = win.cookFoodDialogue;
            win.cookFoodDialogue = function (rawFood)
            {
                _cookFoodDialogue(rawFood);
                var dialog = document.getElementById('dialogue-id-cook-food');
                if (!dialog)
                {
                    return;
                }
                var levelReq = document.getElementById('dialogue-cook-levelReq');
                var levelReqLabel = levelReq && levelReq.previousElementSibling;
                if (!levelReq || !levelReqLabel)
                {
                    return;
                }
                var fulfilled = win.getCookingLevelReq(rawFood) > win.getLevel(win.cookingXp);
                levelReq.style.color = fulfilled ? 'rgb(204, 0, 0)' : '';
                levelReq.style.fontWeight = fulfilled ? 'bold' : '';
                levelReqLabel.style.color = fulfilled ? 'rgb(204, 0, 0)' : '';
                var ratioEl = document.getElementById('dialogue-cook-ratio');
                if (!ratioEl)
                {
                    var cookReqBox = levelReq.parentElement;
                    var br = document.createElement('br');
                    cookReqBox.appendChild(br);
                    var b = document.createElement('b');
                    b.innerHTML = "<img src=\"images/steak.png\" class=\"image-icon-20\" title=\"Energy\"> per <img src=\"images/icons/fire.png\" class=\"image-icon-20\" title=\"Heat\">: ";
                    cookReqBox.appendChild(b);
                    ratioEl = document.createElement('span');
                    ratioEl.id = 'dialogue-cook-ratio';
                    cookReqBox.appendChild(ratioEl);
                }
                var heat = win.getHeatNeeded(rawFood);
                var energy = win.getEnergyGained(rawFood);
                ratioEl.textContent = format.number(Math.round(energy / heat * 100) / 100);
            };
        }

        function amountStyle()
        {
            var tweakName = 'amount-symbol';
            addTweakStyle(tweakName, "\n.item-box:not(#item-box-special-case-questsUnlocked):not(#item-box-pirate):not(#item-box-miner):not(#item-box-boundPumpjacks):not([onclick^=\"openMachineryDialogue(\"]):not(#item-box-sandCollectorsQuest):not(#item-box-boundFilledBonemealBin) > span[data-item-display]::before\n{\n\tcontent: '\\0D7';\n\tmargin-right: .25rem;\n\tmargin-left: -.5rem;\n}\n\t\t");

            function setAmountSymbolVisibility(init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                var show = settings.get(settings.KEY.amountSymbol);
                document.body.classList[show ? 'add' : 'remove'](tweakName);
                if (init)
                {
                    settings.observe(settings.KEY.amountSymbol, function ()
                                     {
                        return setAmountSymbolVisibility();
                    });
                }
            }
            setAmountSymbolVisibility(true);
        }

        function efficiency()
        {
            var EFFICIENCY_CLASS = 'efficiency';
            addTweakStyle(EFFICIENCY_CLASS, "\nbody\n{\n\tmargin: 0;\n}\nbody > br\n{\n\tdisplay: none;\n}\ntable.top-links\n{\n\tborder-left-width: 0px;\n\tborder-right-width: 0px;\n}\n#game-div\n{\n\tmargin-top: 29px;\n}\n#game-div > table.top-bar,\n#game-div > table.tab-bar,\n#div-chat\n{\n\tborder-width: 0;\n\tmargin-top: 0;\n}\n#game-div > table.top-bar#top-bar-levels\n{\n\tborder-width: 1px 0;\n}\n#notifaction-area\n{\n\tpadding: 0;\n}\nspan.notif-box\n{\n\tmargin: -1px;\n\tmargin-left: 0;\n\tpadding: 5px;\n}\n#game-div > div.tab-container\n{\n\tborder-width: 1px 0 0;\n\tpadding: 0;\n}\ndiv.tab-container > h1.container-title:first-child\n{\n\tdisplay: none;\n}\ndiv.item-box-area,\n#tab-sub-container-farming,\n#tab-sub-container-magic-items\n{\n\tmargin: 0;\n\tpadding: 1px 1px 0 0;\n}\nspan.item-box\n{\n\tmargin: -1px -1px 0 0;\n}\ndiv.tab-container > center > table.table-default,\n#table-crafting-recipe,\n#table-brewing-recipe,\n#table-magic-recipe\n{\n\twidth: calc(100% - 1px);\n}\nul.settings-container,\n#tab-container-crafting .settings-container\n{\n\tmargin: 0;\n}\ndiv.tab-container > br:last-child,\n#tab-sub-container-crafting + br,\n#tab-sub-container-woodcutting + br,\n#tab-sub-container-farming + br,\n#tab-sub-container-brewing + br,\n#tab-sub-container-spells > br,\n#tab-container-shop > br:last-child\n{\n\tdisplay: none;\n}\n\ndiv.side-by-side > div\n{\n\tmargin: 0 !important;\n\twidth: 50%;\n}\n.side-by-side h1.container-title\n{\n\tmargin: 2px;\n}\n.side-by-side h1.container-title + br,\n.side-by-side h1.container-title + br + br,\n.side-by-side input[type=\"image\"] + br,\n#hiscores-table-ingame + br\n{\n\tdisplay: none;\n}\n\ndiv.farming-patch,\ndiv.farming-patch-locked\n{\n\tborder-width: 0;\n\tmargin: 0;\n}\n\n#combat-table-area\n{\n\tborder-width: 0;\n}\n#combat-table-area > tbody > tr > td\n{\n\tborder-width: 0;\n\tborder-right-width: 1px;\n}\n#combat-table-area > tbody > tr > td:last-child\n{\n\tborder-right-width: 0;\n}\n#combat-table-area span.large-button,\n#combat-table-area span.medium-button\n{\n\tmargin: 2px 2px 4px;\n}\n#combat-loot-tables\n{\n\tmargin-top: -3px;\n}\n#combat-loot-tables > table.hiscores-table\n{\n\tmargin: 2px -1px 0 0;\n\twidth: calc(33.33% - 4px);\n}\n#combat-loot-tables > div[style*=\"both\"]\n{\n\theight: 0px;\n}\n\t\t");
            var farmingTab = document.getElementById('tab-container-farming');
            if (farmingTab)
            {
                removeWhitespaceChildNodes(farmingTab);
            }
            var combatSubTab = document.getElementById('tab-sub-container-combat');
            if (combatSubTab)
            {
                removeWhitespaceChildNodes(combatSubTab);
            }

            function checkSetting(init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                var show = settings.get(settings.KEY.useEfficiencyStyle);
                document.body.classList[show ? 'add' : 'remove'](EFFICIENCY_CLASS);
                if (init)
                {
                    settings.observe(settings.KEY.useEfficiencyStyle, function ()
                                     {
                        return checkSetting();
                    });
                }
            }
            checkSetting(true);
        }

        function hardcore()
        {
            if (win.isHardcore != 1)
            {
                return;
            }
            addStyle("\nspan#shop-giant-button-playermarket\n{\n\tbackground-color: gray;\n\tbackground-image: none;\n\tcursor: not-allowed;\n}\n\t\t");
            var marketBtn = document.getElementById('shop-giant-button-playermarket');
            if (marketBtn)
            {
                marketBtn.removeAttribute('onclick');
                marketBtn.setAttribute('title', 'The player market is disabled for hardcore accounts');
            }
        }

        function smallScreen()
        {
            addStyle("\ntable.top-links\n{\n\tz-index: 10;\n}\n\t\t");
        }

        function init()
        {
            tweakOil();
            tweakSelection();
            tweakStardust();
            tweakSkillLevelText();
            tweakFightDialog();
            addAdditionalSkillBars();
            highlightCookinglevel();
            amountStyle();
            efficiency();
            //hardcore();
            smallScreen();
        }
        styleTweaks.init = init;
    })(styleTweaks || (styleTweaks = {}));

    /**
 * add ingame notification boxes
 */
    var notifBoxes;
    (function (notifBoxes)
     {
        notifBoxes.name = 'notifBoxes';

        function addNotifBox(imageKey, itemKey, showFront)
        {
            if (itemKey === void 0)
            {
                itemKey = null;
            }
            if (showFront === void 0)
            {
                showFront = false;
            }
            var notifBox = document.createElement('span');
            notifBox.className = 'notif-box';
            notifBox.id = 'notification-static-' + imageKey;
            notifBox.style.display = 'none';
            if (showFront)
            {
                notifBox.style.cssFloat = 'left';
            }
            notifBox.innerHTML = "<img src=\"images/" + imageKey + ".png\" class=\"image-icon-50\" id=\"notif-" + imageKey + "-img\">";
            if (itemKey != null)
            {
                notifBox.innerHTML += "<span data-item-display=\"" + itemKey + "\" style=\"margin-left: 10px;\"></span>";
            }
            var notifArea = document.getElementById('notifaction-area');
            if (notifArea)
            {
                notifArea.appendChild(notifBox);
            }
            return notifBox;
        }
        function addFaradoxCrystal()
        {
            var notifBox = addNotifBox('faradoxsCrystalCharged', null, true);

            function setVisibility()
            {
                var show = (win.tombCd == 0 && quest16 == -1) && settings.get(settings.KEY.useTombNotif);
                notifBox.style.display = show ? '' : 'none';
            }
            setVisibility();
            observer.addTick(function ()
                             {
                return setVisibility();
            });
        }
        function addDarkFaradoxCrystal()
        {
            var notifBox = addNotifBox('darkFaradoxsCrystalCharged', null, true);

            function setVisibility()
            {
                var show = (win.darkTombCd == 0 && quest21 == -1) && settings.get(settings.KEY.useDarkTombNotif);
                notifBox.style.display = show ? '' : 'none';
            }
            setVisibility();
            observer.addTick(function ()
                             {
                return setVisibility();
            });
        }
        function addBobsUncle()
        {
            var notifBox = addNotifBox('bobsUncle', null, true);

            function setVisibility()
            {
                var show = win.farmingPatchStage7 == 4 && settings.get(settings.KEY.useBobsUncleNotif);
                notifBox.style.display = show ? '' : 'none';
            }
            setVisibility();
            observer.addTick(function ()
                             {
                return setVisibility();
            });
        }
        function addSmelting()
        {
            var notifBox = addNotifBox(getFurnaceLevelName()+'Furnace', null, true);

            function setVisibility()
            {
                var show = win.smeltingPerc == 0 && settings.get(settings.KEY.useSmeltingNotif);
                notifBox.style.display = show ? '' : 'none';
            }
            setVisibility();
            observer.addTick(function ()
                             {
                return setVisibility();
            });
        }
        function addRedCombatLootOrb()
        {
            var notifBox = addNotifBox('redCombatLootOrb', null, true);

            function setVisibility()
            {
                var show = (win.redCombatLootOrbTimer === 0 && win.boundRedCombatLootOrb === 1);
                notifBox.style.display = show ? '' : 'none';
            }
            setVisibility();
            observer.addTick(function ()
                             {
                return setVisibility();
            });
        }
        function addRedAxeOrb()
        {
            var notifBox = addNotifBox('redAxeOrb', null, true);

            function setVisibility()
            {
                var show = (win.redAxeOrbTimer === 0 && win.boundRedAxeOrb === 1);
                notifBox.style.display = show ? '' : 'none';
            }
            setVisibility();
            observer.addTick(function ()
                             {
                return setVisibility();
            });
        }

        function addAnimalKilling(name, technicalName, getWindowVariable)
        {
            var notifBox = addNotifBox(technicalName, null, true);
            function setVisibility()
            {
                var showNotification = getWindowVariable() > settings.getSub(settings.KEY.useAnimalPenNotif, name) && settings.get(settings.KEY.useAnimalPenNotif);
                notifBox.style.display = showNotification ? '' : 'none';
            }
            setVisibility();
            observer.addTick(function (){
                return setVisibility();
            });
        }

        function addCharcoalFoundry()
        {
            var notifBox = addNotifBox('charcoalFoundry', null, true);

            function setVisibility()
            {
                var show = (win.charcoalFoundry === 1 && win.charcoalFoundryPerc === 0 && settings.get(settings.KEY.useCharcoalFoundryNotif));
                notifBox.style.display = show ? '' : 'none';
            }
            setVisibility();
            observer.addTick(function ()
                             {
                return setVisibility();
            });
        }
        function fixMixingStandTimer(){
            function checkReady(){
                if (mixingStandTimer > 1){
                    $("#notification-static-mixingStand").css("background", "linear-gradient(#801A00, #C15033)");
                }else {
                    $("#notification-static-mixingStand").css("background", "linear-gradient(rgb(22, 22, 24), rgb(239, 255, 0))");
                }
            }
            checkReady();
            observer.addTick(function ()
                             {
                return checkReady();
            });
        }

        function init()
        {
            addStyle("\n#notifaction-area\n{\n\tpadding: 5px 0;\n}\nspan.notif-box\n{\n\tfont-size: 1rem;\n\tmargin: 0;\n\tmargin-right: 5px;\n}\ntable.tab-bar\n{\n\tmargin-top: 0;\n}\nspan.notif-box,\ntable.tab-bar td\n{\n\tborder-color: gray;\n}\nspan.notif-box[id^=\"notification-static-\"]\n{\n\tbackground: linear-gradient(rgb(22, 22, 24), rgb(239, 255, 0));\n}\n\t\t");

            // remove pure text nodes
            var notifArea = document.getElementById('notifaction-area');
            if (notifArea)
            {
                removeWhitespaceChildNodes(notifArea);
            }
            addBobsUncle();
            addFaradoxCrystal();
            addDarkFaradoxCrystal();
            addRedCombatLootOrb();
            addRedAxeOrb();
            addCharcoalFoundry();
            fixMixingStandTimer();
            addSmelting();
            document.getElementById("item-box-special-case-questsUnlocked").firstElementChild.style.marginBottom = "-3px"
            for(var animalIndex = 0; animalIndex < ANIMALS.length; animalIndex++){
                var thisAnimal = ANIMALS[animalIndex];
                addAnimalKilling(thisAnimal.name, thisAnimal.technicalName,thisAnimal.windowConstant);
            }
        }
        notifBoxes.init = init;
    })(notifBoxes || (notifBoxes = {}));


    /**
 * extend market
 */
    var market;
    (function (market)
     {
        market.name = 'market';
        // max limit age: 5min
        var MAX_LIMIT_AGE = 5 * 60 * 1e3;
        var PRICE_HISTORY_KEY = 'priceHistory';
        // restrict the size of the history of each item to 2000 entries (for a number comparison: 1 entry per minute, would result in 1440 entries per day)
        var MAX_ENTRIES_PER_ITEM = 2e3;
        var SYNC_URL_REGEX = /^(?:https?:\/\/)?(?:(?:www\.)?myjson\.com\/|api\.myjson\.com\/bins\/)([^\/]+)$/i;
        var detectedTedsUIOnce = false;

        function detectTedsUI()
        {
            return detectedTedsUIOnce = detectedTedsUIOnce || typeof win.changeSetting === 'function';
        }
        market.detectTedsUI = detectTedsUI;
        var priceHistory = store.has(PRICE_HISTORY_KEY) ? store.get(PRICE_HISTORY_KEY) :
        {};
        var getItemColor = function (H, S, L)
        {
            return [
                "hsl(" + H + ", " + S + "%, " + L + "%)"
                , "hsl(" + H + ", " + S + "%, " + (L < 35 ? L + 35 : L - 35) + "%)"
            ];
        };
        var itemColor = {
            'blewitMushroom': getItemColor(255, 100, 78)
            , 'bronzeBar': getItemColor(39, 100, 46)
            , 'crystalLeaf': getItemColor(226, 100, 50)
            , 'diamond': getItemColor(186, 76, 82)
            , 'dottedGreenLeaf': getItemColor(92, 63, 19)
            , 'emerald': getItemColor(110, 100, 48)
            , 'goldLeaf': getItemColor(50, 100, 50)
            , 'goldBar': getItemColor(54, 100, 46)
            , 'greenLeaf': getItemColor(92, 63, 28)
            , 'ironBar': getItemColor(44, 11, 46)
            , 'limeLeaf': getItemColor(110, 72, 40)
            , 'promethiumBar': getItemColor(354, 81, 46)
            , 'redMushroom': getItemColor(0, 83, 48)
            , 'ruby': getItemColor(5, 87, 45)
            , 'sapphire': getItemColor(197, 100, 32)
            , 'shrimp': getItemColor(17, 88, 50)
            , 'silverBar': getItemColor(0, 0, 74)
            , 'snapegrass': getItemColor(120, 99, 42)
            , 'stardust': getItemColor(37, 100, 50)
            //, 'strangeLeaf': getItemColor(195, 100, 40)
        };
        // use ambassadors to name the categories
        var categoryAmbassador2CategoryName = {
            'stone': 'Ores' // 0
            , 'emptyChisel': 'Crystals' // 1
            , 'bronzeBar': 'Bars' // 2
            , 'dottedGreenLeafSeeds': 'Seeds' // 3
            , 'logs': 'Logs' // 4
            , 'dottedGreenLeaf': 'Ingredients' // 5
            , 'rawShrimp': 'Fish' // 6
            , 'shrimp': 'Food' // 7
            , 'stinger': 'Equipment' // 8
            , 'promethiumHelmetMould': 'Mould' // 9
            //, 'essence': 'Magic' // 10
            , 'blueFishingRodOrb': 'Orbs' // 10
            , 'stardust': 'Other' // 11
        };
        var item2Category = new Map();
        var category2Name = new Map();
        var item2Resolver = new Map();
        var itemLimits = new Map();
        var offerPerItem = new Map();
        var offerList = new Array();
        var lastSyncValue = '{}';

        function getSyncUrl()
        {
            if (!settings.get(settings.KEY.syncPriceHistory))
            {
                return null;
            }
            var url = settings.getSub(settings.KEY.syncPriceHistory, 'url');
            var match = url.match(SYNC_URL_REGEX);
            if (!match)
            {
                console.error('URL "' + url + '" does not match the expected pattern: ' + SYNC_URL_REGEX.source);
                return null;
            }
            return 'https://api.myjson.com/bins/' + match[1];
        }

        function integratePriceData(data, responseText)
        {
            var changed = recIntegrate(data, priceHistory);
            lastSyncValue = responseText;
            return changed;

            function recIntegrate(source, target)
            {
                var changed = false;
                if (typeof source !== typeof target)
                {
                    console.error('Different data types. Could not integrate data into local price history.\nsource: ' + JSON.stringify(source) + '\ntarget: ' + JSON.stringify(target));
                }
                else if (typeof source === 'object')
                {
                    for (var key in source)
                    {
                        if (source.hasOwnProperty(key))
                        {
                            if (!target.hasOwnProperty(key))
                            {
                                target[key] = source[key];
                                changed = true;
                            }
                            else if (recIntegrate(source[key], target[key]))
                            {
                                changed = true;
                            }
                        }
                    }
                }
                else
                {
                    // do nothing and prefer the local value
                }
                return changed;
            }
        }

        function loadPriceHistory()
        {
            var url = getSyncUrl();
            if (url)
            {
                win.$.get(url, function (data, textStatus, jqXHR)
                          {
                    if (integratePriceData(data, jqXHR.responseText))
                    {
                        savePriceHistory(true);
                    }
                });
            }
        }

        function savePriceHistory(forceWrite)
        {
            if (forceWrite === void 0)
            {
                forceWrite = false;
            }
            for (var itemKey in priceHistory)
            {
                var history_1 = priceHistory[itemKey];
                var timestampList = Object.keys(history_1).sort();
                var i = 0;
                for (var _i = 0, timestampList_1 = timestampList; _i < timestampList_1.length; _i++)
                {
                    var timestamp = timestampList_1[_i];
                    i++;
                    if (i > MAX_ENTRIES_PER_ITEM)
                    {
                        delete history_1[timestamp];
                    }
                }
            }
            store.set(PRICE_HISTORY_KEY, priceHistory);
            var url = getSyncUrl();
            if (url)
            {
                var doPut_1 = function ()
                {
                    $.ajax(
                        {
                            url: url
                            , type: 'PUT'
                            , data: JSON.stringify(priceHistory)
                            , contentType: 'application/json; charset=utf-8'
                            , dataType: 'json'
                            , success: function (data, textStatus, jqXHR)
                            {
                                lastSyncValue = jqXHR.responseText;
                            }
                        });
                };
                if (forceWrite === true)
                {
                    doPut_1();
                }
                else
                {
                    win.$.get(url, function (data, textStatus, jqXHR)
                              {
                        if (lastSyncValue !== jqXHR.responseText)
                        {
                            integratePriceData(data, jqXHR.responseText);
                        }
                        doPut_1();
                    });
                }
            }
        }

        function processMarketData(data)
        {
            var nowKey = now();
            offerPerItem = new Map();
            offerList = new Array();
            if (data != 'NONE')
            {
                offerList = data.split(';').map(function (offerData)
                                                {
                    var values = offerData.split('~');
                    var itemId = Number(values[1]);
                    var itemKey = win.jsItemArray[itemId];
                    var itemName = key2Name(itemKey);
                    var categoryId = item2Category.has(itemKey) ? item2Category.get(itemKey) : -1;
                    var offer = {
                        offerId: Number(values[0])
                        , itemId: itemId
                        , itemKey: itemKey
                        , itemName: itemName
                        , categoryId: categoryId
                        , amount: Number(values[2])
                        , price: Number(values[3])
                        , timeLeft: values[4]
                        , playerId: Number(values[5])
                    };
                    if (!offerPerItem.has(itemKey))
                    {
                        offerPerItem.set(itemKey, []);
                    }
                    offerPerItem.get(itemKey).push(offer);
                    var history = priceHistory[itemKey];
                    if (!history)
                    {
                        history = {};
                        priceHistory[itemKey] = history;
                    }
                    if (!history.hasOwnProperty(nowKey)
                        || history[nowKey] > offer.price)
                    {
                        history[nowKey] = offer.price;
                    }
                    return offer;
                });
            }
            savePriceHistory();
        }

        function processItemLimits(itemKey, lowerLimit, upperLimit)
        {
            var limit = {
                timestamp: now()
                , min: lowerLimit
                , max: upperLimit
            };
            itemLimits.set(itemKey, limit);
            if (item2Resolver.has(itemKey))
            {
                var limitArr_1 = [lowerLimit, upperLimit];
                item2Resolver.get(itemKey).forEach(function (resolve)
                                                   {
                    return resolve(limitArr_1);
                });
                item2Resolver.delete(itemKey);
                return false;
            }
            return true;
        }

        function showOfferCancelCooldown()
        {
            if (detectTedsUI())
            {
                return;
            }
            addStyle("\n.market-slot-cancel:not([data-cooldown=\"0\"])\n{\n\tbackground: linear-gradient(hsla(12, 40%, 50%, 1), hsla(12, 40%, 40%, 1));\n\tcursor: not-allowed;\n\tposition: relative;\n}\n.market-slot-cancel:not([data-cooldown=\"0\"]):hover\n{\n\tbackground-color: hsla(0, 40%, 50%, 1);\n}\n.market-slot-cancel:not([data-cooldown=\"0\"])::after\n{\n\tcontent: attr(data-cooldown);\n\tposition: absolute;\n\tright: 10px;\n}\n\t\t");

            function slotCooldown(i, init)
            {
                if (init === void 0)
                {
                    init = false;
                }
                var cooldownKey = 'marketCancelCooldownSlot' + i;
                var btn = document.getElementById('market-slot-' + i + '-cancel-btn');
                if (btn)
                {
                    btn.dataset.cooldown = detectTedsUI() ? '0' : getGameValue(cooldownKey).toString();
                }
                if (init)
                {
                    observer.add(cooldownKey, function ()
                                 {
                        return slotCooldown(i);
                    });
                }
            }
            for (var i = 1; i <= 3; i++)
            {
                slotCooldown(i, true);
            }
        }

        function addExtraBtns()
        {
            var browseBtn = document.querySelector('.market-browse-button');
            if (!browseBtn)
            {
                return;
            }
            var HISTORY_CLASS = 'local-history';
            var paddingLeft = 30 + 42;
            var paddingRight = 30;
            addStyle("\ncenter > span.market-browse-button,\n#ted-market-ui > span.market-browse-button\n{\n\tposition: relative;\n}\ncenter > span.market-browse-button\n{\n\tpadding-left: " + paddingLeft + "px;\n\tpadding-right: " + paddingRight + "px;\n}\nspan.market-browse-button > span.market-browse-button\n{\n\tpadding: 10px 20px;\n\tposition: absolute;\n\ttop: -1px;\n\tbottom: -1px;\n}\n/*\n*/\nspan.market-browse-button > span.market-browse-button." + HISTORY_CLASS + "\n{\n\tleft: -1px;\n}\nspan.market-browse-button > span.market-browse-button::before\n{\n\tbackground-color: transparent;\n\tbackground-position: center;\n\tbackground-repeat: no-repeat;\n\tbackground-size: 30px;\n\tcontent: '';\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\tbottom: 0;\n\tright: 0;\n}\n/*\n*/\nspan.market-browse-button." + HISTORY_CLASS + "::before\n{\n\tbackground-image: " + icons.getMd(icons.CHART_LINE) + ";\n}\n/*\n*/\n#ted-market-ui > span.market-browse-button > span.market-browse-button." + HISTORY_CLASS + "\n{\n\tborder-left: 0;\n\tleft: 0;\n}\n\t\t");
            var historyBtn = document.createElement('span');
            historyBtn.className = 'market-browse-button ' + HISTORY_CLASS;
            browseBtn.appendChild(historyBtn);
            var historyItemKey = null;
            var _postItemDialogue = win.postItemDialogue;
            win.postItemDialogue = function (offerTypeEl, itemName, inputEl)
            {
                historyItemKey = itemName;
                _postItemDialogue(offerTypeEl, itemName, inputEl);
            };
            var PRICE_HISTORY_DIALOG_ID = 'dialog-price-history';
            var PRICE_HISTORY_ID = 'price-history';
            var PRICE_HISTORY_ITEM_SELECT_ID = 'price-history-item-select';
            addStyle("\n#" + PRICE_HISTORY_DIALOG_ID + "\n{\n\tdisplay: flex;\n\tflex-direction: column;\n}\n#" + PRICE_HISTORY_ID + "\n{\n\tflex-grow: 1;\n\tposition: relative;\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n}\n#" + PRICE_HISTORY_ID + " > div\n{\n\tposition: absolute !important;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n}\n#" + PRICE_HISTORY_ID + " .anychart-credits\n{\n\tdisplay: none;\n}\n\t\t");
            var dialog = document.createElement('dialog');
            dialog.id = PRICE_HISTORY_DIALOG_ID;
            dialog.style.display = 'none';
            dialog.style.overflowX = 'hidden';
            dialog.innerHTML = "\n\t\t<select id=\"" + PRICE_HISTORY_ITEM_SELECT_ID + "\" multiple=\"multiple\" data-placeholder=\"Add items\" style=\"width: 100%\"></select>\n\t\t<div id=\"" + PRICE_HISTORY_ID + "\"></div>\n\t\t";
            document.body.appendChild(dialog);
            var itemSelect = document.getElementById(PRICE_HISTORY_ITEM_SELECT_ID);
            var $itemSelect = win.$(itemSelect);

            function loadScripts(urlList, callback)
            {
                var url = urlList[0];
                if (!url)
                {
                    callback && callback();
                    return;
                }
                var script = document.createElement('script');
                script.src = url;
                script.onload = function ()
                {
                    return loadScripts(urlList.slice(1), callback);
                };
                document.head.appendChild(script);
            }
            var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var lastHistoryItemKey;
            var itemKey2SeriesId = {};
            var chart;
            var stage;
            // add style for select2
            var style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css';
            document.head.appendChild(style);
            loadScripts([
                'https://cdn.anychart.com/js/7.14.3/anychart.min.js'
                , 'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js'
            ], function ()
                        {
                chart = win.anychart.area();
                // pass the container id, chart will be displayed there
                stage = anychart.graphics.create(PRICE_HISTORY_ID);
                chart.container(stage);
                var tooltip = chart.tooltip();
                tooltip.displayMode('union');
                tooltip.format(passThis(function (context)
                                        {
                    var name = context.seriesName || 'Price';
                    return name + ': ' + (isNaN(context.value) ? '-' : format.number(context.value));
                }));
                tooltip.titleFormat(passThis(function (context)
                                             {
                    var d = new Date(context.x);
                    return monthArray[d.getMonth()] + ' ' + d.getDate() + ' @ ' + zeroPadLeft(d.getHours()) + ':' + zeroPadLeft(d.getMinutes()) + ':' + zeroPadLeft(d.getSeconds());
                }));
                var valueAxis = chart.yAxis();
                valueAxis.title().text('Price').enabled(true);
                valueAxis.labels().format(passThis(function (context)
                                                   {
                    return format.number(context.value);
                }));
                var timeAxis = chart.xAxis();
                timeAxis.labels().format(passThis(function (context)
                                                  {
                    var d = new Date(context.tickValue);
                    return d.getDate() + '. ' + monthArray[d.getMonth()];
                }));
                var timeScale = win.anychart.scales.dateTime();
                var ticks = timeScale.ticks();
                ticks.interval(0, 0, 1);
                chart.xScale(timeScale);
                var timeScroller = chart.xScroller();
                timeScroller.enabled(true);
                chart.animation(true, 300);
                chart.legend(true);
            });
            historyBtn.addEventListener('click', function (event)
                                        {
                event.preventDefault();
                event.stopPropagation();
                var height = Math.floor(.66 * window.innerHeight);
                var width = Math.min(Math.floor(.66 * window.innerWidth), window.innerWidth - 30);
                win.$(dialog).dialog(
                    {
                        title: 'Price history from local data'
                        , height: height
                        , width: width
                    });
                dialog.style.height = (height) + 'px';
                var itemKeyList = Object.keys(priceHistory).sort();
                itemSelect.innerHTML = "";
                var category2OptGroup = {};

                function ensureOptGroup(categoryId)
                {
                    var optGroup = category2OptGroup[categoryId];
                    if (!optGroup)
                    {
                        optGroup = document.createElement('optgroup');
                        optGroup.label = category2Name.get(categoryId) || 'Stuff';
                        itemSelect.appendChild(optGroup);
                        category2OptGroup[categoryId] = optGroup;
                    }
                    return optGroup;
                }
                var categoryList = Array.from(category2Name.keys()).map(function (id)
                                                                        {
                    return Number(id);
                }).sort();
                for (var _i = 0, categoryList_1 = categoryList; _i < categoryList_1.length; _i++)
                {
                    var categoryId = categoryList_1[_i];
                    ensureOptGroup(categoryId);
                }
                var itemKey2EnabledFn = {};

                function replaceEnabled(itemKey, series)
                {
                    var _enabled = series.enabled.bind(series);
                    itemKey2EnabledFn[itemKey] = _enabled;
                    series.enabled = function (value)
                    {
                        if (value !== undefined)
                        {
                            var itemList = $itemSelect.val();
                            var index = itemList.indexOf(itemKey);
                            if (index !== -1)
                            {
                                itemList.splice(index, 1);
                            }
                            else
                            {
                                itemList.push(itemKey);
                            }
                            $itemSelect.val(itemList).trigger('change');
                        }
                        return _enabled(value);
                    };
                }
                var min = Number.MAX_SAFE_INTEGER;
                var max = 0;
                var enabledSeriesList = [];
                var _loop_1 = function (itemKey)
                {
                    if (!itemColor[itemKey])
                    {
                        var baseColor = colorGenerator.getRandom(
                            {
                                format: 'hslArray'
                            });
                        var borderColor = baseColor.slice(0);
                        if (borderColor[2] < 35)
                        {
                            borderColor[2] += 35;
                        }
                        else
                        {
                            borderColor[2] -= 35;
                        }
                        itemColor[itemKey] = [
                            "hsl(" + baseColor[0] + ", " + baseColor[1] + "%, " + baseColor[2] + "%)"
                            , "hsl(" + borderColor[0] + ", " + borderColor[1] + "%, " + borderColor[2] + "%)"
                        ];
                    }
                    var history_2 = priceHistory[itemKey];
                    var keyList = Object.keys(history_2).sort();
                    var data = keyList
                    .map(function (n)
                         {
                        return ([
                            Number(n)
                            , history_2[n]
                        ]);
                    });
                    min = Math.min(Number(keyList[0]), min);
                    max = Math.max(Number(keyList[keyList.length - 1]), max);
                    var id = itemKey2SeriesId[itemKey];
                    var series = void 0;
                    if (id != null)
                    {
                        series = chart.getSeries(id);
                        series.data(data);
                    }
                    else
                    {
                        var hoverifyColor = function (hslColor)
                        {
                            return (
                                {
                                    color: hslColor
                                    , opacity: .8
                                });
                        };
                        series = chart.area(data);
                        itemKey2SeriesId[itemKey] = series.id();
                        series.name(key2Name(itemKey));
                        var bgColor = itemColor[itemKey][0];
                        var strokeColor = itemColor[itemKey][1];
                        series.fill(bgColor);
                        var bgColorHover = hoverifyColor(bgColor);
                        series.selectFill(bgColorHover);
                        series.hoverFill(bgColorHover);
                        series.stroke(strokeColor, 2);
                        var strokeColorHover = hoverifyColor(strokeColor);
                        series.hoverStroke(strokeColorHover, 2);
                        series.selectStroke(strokeColorHover, 2);
                        var markerOptions = {
                            fill: strokeColor
                            , size: 5
                            , type: 'circle'
                        };
                        series.hoverMarkers(markerOptions);
                        series.selectMarkers(markerOptions);
                        replaceEnabled(itemKey, series);
                    }
                    if (lastHistoryItemKey !== historyItemKey)
                    {
                        if (itemKey === historyItemKey)
                        {
                            enabledSeriesList.push(series);
                        }
                        series.enabled(false);
                    }
                    var categoryId = item2Category.has(itemKey) ? item2Category.get(itemKey) : -1;
                    var optGroup = ensureOptGroup(categoryId);
                    var option = document.createElement('option');
                    option.value = itemKey;
                    option.textContent = key2Name(itemKey);
                    optGroup.appendChild(option);
                };
                for (var _a = 0, itemKeyList_1 = itemKeyList; _a < itemKeyList_1.length; _a++)
                {
                    var itemKey = itemKeyList_1[_a];
                    _loop_1(itemKey);
                }
                stage.listenOnce('renderfinish', function ()
                                 {
                    enabledSeriesList.forEach(function (series)
                                              {
                        return series.enabled(true);
                    });
                });
                var timeScale = chart.xScale();
                timeScale.minimum(min);
                timeScale.maximum(max);
                var timeZoom = chart.xZoom();
                var threeDaysLong = 3 * 24 * 60 * 60 * 1e3;
                timeZoom.setToValues(Math.max(max - threeDaysLong, min), max);
                // call the chart draw() method to initiate chart display
                chart.draw(true);
                // init item select
                if ($itemSelect.data('select2'))
                {
                    $itemSelect.select2('destroy');
                }
                $itemSelect.select2();

                function getEnabledFn(event)
                {
                    var data = event.params.data;
                    var itemKey = data.id;
                    var enabledFn = itemKey2EnabledFn[itemKey];
                    if (enabledFn)
                    {
                        return enabledFn;
                    }
                    else
                    {
                        var id = itemKey2SeriesId[itemKey];
                        var series = chart.getSeries(id);
                        return series.enabled.bind(series);
                    }
                }
                $itemSelect.on('select2:select', function (event)
                               {
                    getEnabledFn(event)(true);
                });
                $itemSelect.on('select2:unselect', function (event)
                               {
                    getEnabledFn(event)(false);
                    // close select menu when it was closed before an element has been removed
                    var openBefore = $itemSelect.data('select2').$container.hasClass('select2-container--open');
                    setTimeout(function ()
                               {
                        if (!openBefore && $itemSelect.data('select2').$container.hasClass('select2-container--open'))
                        {
                            $itemSelect.select2('close');
                        }
                    });
                });
                lastHistoryItemKey = historyItemKey;
            });
        }
        var categoryList = [-1];
        var itemListPerCategory = new Map();

        function improveOfferList()
        {
            var itemArea = document.getElementById('dialogue-market-items-area');
            if (itemArea)
            {
                var children = itemArea.children;
                for (var i = 1; i < children.length; i++)
                {
                    var categoryId = i - 1;
                    categoryList.push(categoryId);
                    var box = children.item(i);
                    var inputs = box.children;
                    for (var j = 0; j < inputs.length; j++)
                    {
                        var match = inputs.item(j).src.match(/images\/([^\/]+)\.(?:png|jpe?g|gif)/);
                        if (!match)
                        {
                            continue;
                        }
                        var itemKey = match[1];
                        item2Category.set(itemKey, categoryId);
                        if (categoryAmbassador2CategoryName[itemKey])
                        {
                            category2Name.set(categoryId, categoryAmbassador2CategoryName[itemKey]);
                        }
                        if (!itemListPerCategory.has(categoryId))
                        {
                            itemListPerCategory.set(categoryId, []);
                        }
                        itemListPerCategory.get(categoryId).push(itemKey);
                    }
                }
            }
        }

        function getItemLimit(itemKey)
        {
            // TODO: combine list of offers with min/max-boundries
            var limit = itemLimits.get(itemKey);
            if (limit && limit.timestamp > now() - MAX_LIMIT_AGE)
            {
                return Promise.resolve([limit.min, limit.max]);
            }
            else if (!win.jsTradalbeItems.hasOwnProperty(itemKey))
            {
                return Promise.resolve([0, 0]);
            }
            return new Promise(function (resolve, reject)
                               {
                win.postItemDialogue(
                    {
                        value: 'sell'
                    }, itemKey, null);
                if (!item2Resolver.has(itemKey))
                {
                    item2Resolver.set(itemKey, []);
                }
                item2Resolver.get(itemKey).push(resolve);
                setTimeout(function ()
                           {
                    return reject(new Error('Request timed out'));
                }, 30e3);
            });
        }

        function calcMarketValueOld(items)
        {
            console.log(items);
            var itemKeyList = Object.keys(items);
            return Promise.all(itemKeyList.map(function (key)
                                               {
                return getItemLimit(key);
            }))
                .then(function (limitList)
                      {
                var sum = [0, 0];
                for (var i = 0; i < itemKeyList.length; i++)
                {
                    var amount = items[itemKeyList[i]];
                    var limit = limitList[i];
                    sum[0] += amount * limit[0];
                    sum[1] += amount * limit[1];
                }
                return sum;
            });
        }
        market.calcMarketValueOld = calcMarketValueOld;

        function calcMarketValue(items){
            if(!itemValuesUpToDate()){
                console.warn("@kape142 This should be checked for every time you ask for data")
                return 0;
            }
            let prices = store.get("itemValues");
            let total = 0;
            for(let i in items){
                total+=findValue(i, items[i], prices);
            }
            return total;
        }
        market.calcMarketValue = calcMarketValue;

        function calcMarketValueIndividual(items){
            if(!itemValuesUpToDate()){
                console.warn("@kape142 This should be checked for every time you ask for data")
                return {};
            }
            let prices = store.get("itemValues");
            for(let i in items){
                items[i]=findValue(i, items[i], prices);
            }
            return items;
        }
        market.calcMarketValueIndividual = calcMarketValueIndividual;

        function calcMarketValueAll(){
            if(!itemValuesUpToDate()){
                console.warn("@kape142 This should be checked for every time you ask for data")
                return 0;
            }
            let prices = store.get("itemValues");
            let total = 0;
            for(let i in prices){
                total+=new Number(prices[i]*win[i]);
            }
            return total;
        }
        market.calcMarketValueAll = calcMarketValueAll;


        function checkMarketDataValidity(callback, data){
            if(itemValuesUpToDate()){
                return true;
            }
            updateItemValues(callback, data);
            return false;
        }
        market.checkMarketDataValidity = checkMarketDataValidity;

        function findValue(item, amount, prices){
            let price = new Number(prices[item]);
            //console.log(item+": "+price);
            if (isNaN(price)){
                return 0;
            }
            return price*amount;
        }

        function addExtraValues(prices){
            prices.coins = 1;
            prices.lifeAmulet = prices["lifeAmuletCharged"];
            prices.copper = 2;
            prices.tin = 2;
            prices.iron = 5;
            prices.silver = 10;
            prices.gold = 20;
            prices.emptyBlueOrb = Math.max(prices["blueFishingRodOrb"],prices["blueShovelOrb"],prices["blueAxeOrb"],prices["blueRakeOrb"],prices["blueTrowelOrb"],prices["bluePickaxeOrb"],prices["blueOilPipeOrb"],prices["blueHammerOrb"],prices["blueChiselOrb"],prices["blueMeditationOrb"]);
            prices.emptyGreenOrb = Math.max(prices["greenOilFactoryOrb"],prices["greenCombatOrb"],prices["greenBrewingKitOrb"],prices["greenBowOrb"],prices["greenBonemealBinOrb"],prices["greenRocketOrb"],prices["greenOilStorageOrb"],prices["greenEmpoweredRockOrb"],prices["greenCannonOrb"]);
            prices.emptyRedOrb = Math.max(prices["redMagicWandOrb"],prices["redCharcoalFactoryOrb"],prices["redManaStarOrb"],prices["redCombatLootOrb"],prices["redAxeOrb"],prices["redFishingBaitOrb"],prices["redRocketOrb"]);
            return prices;
        }

        function updateItemValues(callback, data){
            fetch("https://dh2fixed-market-backend.herokuapp.com/data",{
                method: "GET",
                header: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
                .then(response => response.json())
                .then(json =>
                {
                    store.set("itemValues",addExtraValues(json));
                    store.set("itemValuesTimestamp",new Date().getTime());
                    console.log("item values updated!");
                    if(callback){
                        (data)?callback(data):callback();
                    }
                })
                .catch(error => console.log(error));
        }

        function itemValuesUpToDate(){
            if(!store.has("itemValuesTimestamp")){
                //store.set("itemValuesTimestamp",new Date(new Date().setDate(-1)));
                return false;
            }
            let timestamp = new Date()
            timestamp.setTime(new Number(store.get("itemValuesTimestamp")));
            let now = new Date();
            now = now.setHours(now.getHours()-12);
            //console.log("Data valid for another "+Math.ceil((timestamp - now) / (1000*60*60))+ " hours");
            return now<timestamp;
        }

        function init()
        {

            showOfferCancelCooldown();
            addExtraBtns();
            improveOfferList();
            var _chosenPostItemDialogue = win.chosenPostItemDialogue;
            win.chosenPostItemDialogue = function (itemName, lowerLimit, upperLimit)
            {
                if (processItemLimits(itemName, Number(lowerLimit), Number(upperLimit)))
                {
                    _chosenPostItemDialogue(itemName, lowerLimit, upperLimit);
                }
            };
            var _addToPlayerMarket = win.addToPlayerMarket;
            win.addToPlayerMarket = function (data)
            {
                processMarketData(data);
                _addToPlayerMarket(data);
            };
            loadPriceHistory();
            // delay (debounce) sending the request for 3s
            var startDebouncedRequest = debounce(function ()
                                                 {
                return loadPriceHistory();
            }, 3e3);
            settings.observe(settings.KEY.syncPriceHistory, function ()
                             {
                return startDebouncedRequest();
            });
            settings.observeSub(settings.KEY.syncPriceHistory, 'url', function ()
                                {
                return startDebouncedRequest();
            });
        }
        market.init = init;
    })(market || (market = {}));

    var combat;
    (function (combat)
     {
        combat.name = 'combat';
        var LOOT_TABLE_URL = '/wiki/combat.php';
        var COMBAT_LOOT_TABLES_ID = 'combat-loot-tables';
        var CAT_2_NAME = {
            'always': 'Always'
            , 'common': 'Common'
            , 'uncommon': 'Uncommon'
            , 'rare': 'Rare'
            , 'veryrare': 'Very Rare'
        };
        var lootInfoInitialized = false;
        var lootInfo = {};

        function readLootTable(table)
        {
            var monsterImg = table.getElementsByTagName('img').item(0);
            var src = monsterImg.getAttribute('src') || '';
            var monsterId = src.replace(/.+npc\/(\d+)\.png$/, '$1');
            var info = {
                always: []
                , common: []
                , uncommon: []
                , rare: []
                , veryrare: []
            };
            for (var i = 2; i < table.rows.length; i++)
            {
                var row = table.rows.item(i);
                var match = row.cells.item(0).innerHTML.match(/images\/(.+)\.png/) || row.cells.item(0).innerHTML.match(/images\/(.+)\.gif/);
                if (!match)
                {
                    console.error('no item key found:', row.innerHTML);
                    continue;
                }
                var itemKey = match[1];
                var amount = row.cells.item(1).textContent || '';
                var rarityCategory = row.cells.item(2).className;
                var dropRate = (rarityCategory == 'Always') ? 'Always' : row.cells.item(2).textContent;
                if (!info.hasOwnProperty(rarityCategory))
                {
                    console.error('unknown rarity category:', rarityCategory);
                    continue;
                }
                info[rarityCategory].push(
                    {
                        key: itemKey
                        , amount: amount.split(' - ').map(function (s)
                                                          {
                            return Number(s.replace(/\D/g, ''));
                        })
                        , dropRate: dropRate
                    });
            }
            lootInfo[monsterId] = info;
            lootInfoInitialized = true;
        }

        function updateLootTableInfo()
        {
            return doGet(LOOT_TABLE_URL)
                .then(function (response)
                      {
                var parser = new DOMParser();
                var doc = parser.parseFromString(response, 'text/html');
                var tables = doc.getElementsByTagName('table');
                for (var i = 0; i < tables.length; i++)
                {
                    readLootTable(tables.item(i));
                }
                return lootInfo;
            })
                .then(function (info)
                      {
                setLootTableTabContent(info);
            });
        }

        function addLootTableTab()
        {
            var subTabContainer = document.getElementById('tab-sub-container-combat');
            var itemContainer = document.getElementById('tab-sub-container-combat-large-btns');
            var afterEl = itemContainer && itemContainer.previousElementSibling;
            if (!subTabContainer || !afterEl)
            {
                return;
            }
            addStyle("\nspan.medium-button.active\n{\n\tbackground: hsla(109, 55%, 43%, 1);\n\tcursor: not-allowed;\n}\n#combat-table-area:not([style$=\"auto;\"]) > tbody > tr > td:last-child\n{\n\twidth: 100%;\n}\n#" + COMBAT_LOOT_TABLES_ID + " td.always\n{\n\tbackground-color: #ccffff;\n}\n#" + COMBAT_LOOT_TABLES_ID + " td.common\n{\n\tbackground-color: #ccffcc;\n}\n#" + COMBAT_LOOT_TABLES_ID + " td.uncommon\n{\n\tbackground-color: #ffffcc;\n}\n#" + COMBAT_LOOT_TABLES_ID + " td.rare\n{\n\tbackground-color: #ffcc99;\n}\n#" + COMBAT_LOOT_TABLES_ID + " td.veryrare\n{\n\tbackground-color: #ff9999;\n}\n\n#" + COMBAT_LOOT_TABLES_ID + " table.hiscores-table\n{\n\tfloat: left;\n\tmargin: 0 10px;\n\twidth: calc(33.3% - 20px);\n}\n#" + COMBAT_LOOT_TABLES_ID + " table.hiscores-table img.image-icon-50\n{\n\twidth: auto;\n}\n\t\t");
            var REFRESH_LOOT_TABLE_ID = 'refresh-loot-table';
            var subTab = document.createElement('span');
            subTab.className = 'large-button';
            subTab.innerHTML = "<img class=\"image-icon-50\" src=\"images/combatDropTable.png\" style=\"filter: grayscale(100%);\">Loot";
            subTab.addEventListener('click', function ()
                                    {
                var _confirmDialogue = win.confirmDialogue;
                win.confirmDialogue = function () {};
                win.clicksOpenDropTable();
                win.confirmDialogue = _confirmDialogue;
                win.openSubTab('loot');
            });

            function setLootTabVisibility()
            {
                var show = settings.get(settings.KEY.showLootTab);
                subTab.style.display = show ? '' : 'none';
                var dropTableItemBox = document.getElementById('item-box-combatDropTable');
                if (dropTableItemBox)
                {
                    dropTableItemBox.style.display = show ? 'none' : '';
                }
                if (show && !lootInfoInitialized)
                {
                    updateLootTableInfo();
                }
            }
            setLootTabVisibility();
            settings.observe(settings.KEY.showLootTab, function ()
                             {
                return setLootTabVisibility();
            });
            subTabContainer.insertBefore(subTab, afterEl);
            var combatSubTab = document.getElementById('tab-sub-container-combat');
            var equipSubTab = document.getElementById('tab-sub-container-equip');
            var spellsSubTab = document.getElementById('tab-sub-container-spells');
            var subPanelContainer = combatSubTab.parentElement;
            var lootSubTab = document.createElement('div');
            lootSubTab.id = 'tab-sub-container-loot';
            lootSubTab.style.display = 'none';
            lootSubTab.innerHTML = "<span onclick=\"openTab('combat')\" class=\"medium-button\"><img class=\"image-icon-30\" src=\"images/icons/back.png\"> back</span>\n\t\t<span id=\"" + REFRESH_LOOT_TABLE_ID + "\" class=\"medium-button\">refresh</span>\n\t\t<div id=\"" + COMBAT_LOOT_TABLES_ID + "\">Loading...</div>";
            subPanelContainer.appendChild(lootSubTab);
            var refreshBtn = document.getElementById(REFRESH_LOOT_TABLE_ID);
            if (refreshBtn)
            {
                refreshBtn.addEventListener('click', function ()
                                            {
                    if (refreshBtn.classList.contains('active'))
                    {
                        return;
                    }
                    refreshBtn.classList.add('active');
                    updateLootTableInfo()
                        .then(function ()
                              {
                        return refreshBtn.classList.remove('active');
                    })
                        .catch(function ()
                               {
                        return refreshBtn.classList.remove('active');
                    });
                });
            }
            var _openSubTab = win.openSubTab;
            win.openSubTab = function (tab)
            {
                combatSubTab.style.display = 'none';
                equipSubTab.style.display = 'none';
                spellsSubTab.style.display = 'none';
                lootSubTab.style.display = 'none';
                _openSubTab(tab);
                if (tab == 'loot')
                {
                    lootSubTab.style.display = 'block';
                }
            };
            var _loadDefaultCombatTab = win.loadDefaultCombatTab;
            win.loadDefaultCombatTab = function ()
            {
                _loadDefaultCombatTab();
                lootSubTab.style.display = 'none';
            };
        }

        function setLootTableTabContent(lootInfo)
        {
            if(!market.checkMarketDataValidity(setLootTableTabContent,lootInfo)){
                return;
            }
            var combatTableWrapper = document.getElementById(COMBAT_LOOT_TABLES_ID);
            if (!combatTableWrapper)
            {
                return;
            }
            combatTableWrapper.innerHTML = "";
            for (var monsterId in lootInfo)
            {
                var info = lootInfo[monsterId];
                let avgValue = getAvgValue(info);
                var monsterNum = Number(monsterId);
                if (monsterNum > 1 && monsterNum % 3 === 1)
                {
                    var lineBreak = document.createElement('div');
                    lineBreak.style.clear = 'both';
                    lineBreak.innerHTML = "<br>";
                    combatTableWrapper.appendChild(lineBreak);
                }
                var table = document.createElement('table');
                table.className = 'hiscores-table';
                var imgRow = table.insertRow(-1);
                imgRow.innerHTML = "<td colspan=\"3\">\n\t\t\t\t<img src=\"../images/hero/npc/" + monsterId + ".png\" class=\"image-icon-50\"><img id=\"lootTableCoin"+monsterId+"\" src=\"../images/coins.png\" class=\"image-icon-30\" style=\"float:right;margin:10px;\" title=\""+Math.round(avgValue).toLocaleString()+"\">\n\t\t\t</td>";
                var headerRow = table.insertRow(-1);
                headerRow.innerHTML = "<th>Item</th><th>Amount</th><th>Rarity</th>";
                for (var rarityCategory in info)
                {
                    var itemList = info[rarityCategory];
                    for (var i = 0; i < itemList.length; i++)
                    {
                        var item = itemList[i];
                        var row = table.insertRow(-1);
                        row.innerHTML = "<td><img src=\"../images/" + item.key + ".png\" class=\"image-icon-40\"></td><td>" + item.amount.map(function (n){
                            return format.number(n);
                        }).join(' - ') + "</td><td class=\"" + rarityCategory + "\">" + item.dropRate + "</td>";
                    }
                }
                combatTableWrapper.appendChild(table);
            }
            var images = document.querySelectorAll('.hiscores-table .image-icon-40');
            for (let i=0; i < images.length; i++){
                var enchantSG = images[i];
                var fixURL = enchantSG.src = enchantSG.src.replace('/images/enchantedStargemPotion.png','/images/enchantedStargemPotion.gif');
            }
        }

        function getAvgValue(loot){
            let items = {}
            for(let key in loot){
                let r = loot[key];
                for(let i = 0; i < r.length; i++){
                    let name = r[i].key;
                    let amount = (r[i].amount.length==1)? r[i].amount[0]:(r[i].amount[0]+r[i].amount[1])/2;
                    let text = r[i].dropRate.split("/");
                    let rarity = (text.length==1)?1:text[0]/text[1];
                    items[name] = amount*rarity;
                }
            }
            return market.calcMarketValue(items);
        }


        function init()
        {
            addLootTableTab();
            if (settings.get(settings.KEY.showLootTab))
            {
                updateLootTableInfo();
            }
        }
        combat.init = init;
    })(combat || (combat = {}));

    /**
 * farming improvements
 */
    var farming;
    (function (farming)
     {
        farming.name = 'farming';
        var SEED_INFO_REGEX = {
            minLevel: />\s*Level:/
            , stopsDyingLevel: />\s*Stops\s+Dying\s+Level:/
            , bonemeal: />\s*Bonemeal:/
            , woodcuttingLevel: />\s*Woodcutting\s+Level:/
        };
        var seedInfoSpans = {};
        var seedInfo = {};
        var checkInfo = {
            bonemeal: function (amount)
            {
                return amount <= win.bonemeal;
            }
            , minLevel: function (level)
            {
                return level <= win.getLevel(win.farmingXp);
            }
            , stopsDyingLevel: function (level)
            {
                return level <= win.getLevel(win.farmingXp);
            }
            , woodcuttingLevel: function (level)
            {
                return level <= win.getLevel(win.woodcuttingXp);
            }
        };
        var RED = 'rgb(204, 0, 0)';

        function addBetterStyle()
        {
            var CLASS_NAME = 'seedHighlight';
            addStyle("\n#dialogue-plant-farming input.input-img-farming-patch-dialogue-seeds\n{\n\tpadding: 2px 4px;\n}\n#dialogue-plant-farming #dialogue-plant-grassSeeds\n{\n\theight: 75px;\n\tpadding: 0;\n\twidth: 75px;\n}\n#dialogue-plant-farming #dialogue-plant-treeSeeds,\n#dialogue-plant-farming #dialogue-plant-oakTreeSeeds,\n#dialogue-plant-farming #dialogue-plant-willowTreeSeeds,\n#dialogue-plant-farming #dialogue-plant-mapleTreeSeeds\n{\n\tpadding: 0;\n}\n\nbody." + CLASS_NAME + " #dialogue-plant-farming input.input-img-farming-patch-dialogue-seeds:hover\n{\n\tbackground-color: transparent;\n\tborder: 1px solid black;\n\tmargin: -1px;\n\ttransform: scale(1.1);\n}\n\t\t");
            // seedHighlight
            function updateHoverStyle()
            {
                document.body.classList[settings.get(settings.KEY.highlightUnplantableSeed) ? 'add' : 'remove'](CLASS_NAME);
            }
            updateHoverStyle();
            settings.observe(settings.KEY.highlightUnplantableSeed, function ()
                             {
                return updateHoverStyle();
            });
        }

        function readSeedInfo(seedName, tooltipEl)
        {
            var spans = tooltipEl.querySelectorAll(':scope > span');
            var infoSpans = {
                bonemeal: null
                , minLevel: null
                , stopsDyingLevel: null
                , woodcuttingLevel: null
            };
            var info = {
                bonemeal: 0
                , minLevel: 0
                , stopsDyingLevel: 0
                , woodcuttingLevel: 0
            };
            var i = 0;
            for (var key in SEED_INFO_REGEX)
            {
                if (SEED_INFO_REGEX[key].test(spans[i].innerHTML))
                {
                    infoSpans[key] = spans.item(i);
                    var textNode = spans.item(i).lastChild;
                    info[key] = parseInt(textNode.textContent || '', 10);
                    i++;
                }
            }
            seedInfoSpans[seedName] = infoSpans;
            seedInfo[seedName] = info;
        }

        function checkSpan(span, fulfilled)
        {
            span.style.color = fulfilled ? '' : RED;
            span.style.fontWeight = fulfilled ? '' : 'bold';
        }

        function checkSeedInfo(seedName, init)
        {
            if (init === void 0)
            {
                init = false;
            }
            var highlight = settings.get(settings.KEY.highlightUnplantableSeed);
            var info = seedInfo[seedName];
            var spans = seedInfoSpans[seedName];
            var canBePlanted = true;
            for (var key in info)
            {
                var span = spans[key];
                if (span)
                {
                    var fulfilled = checkInfo[key](info[key]);
                    checkSpan(span, !highlight || fulfilled);
                    canBePlanted = !highlight || canBePlanted && (key == 'stopsDyingLevel' || fulfilled);
                }
            }
            var itemBox = document.getElementById('item-box-' + seedName);
            if (itemBox)
            {
                itemBox.style.opacity = (!highlight || canBePlanted) ? '' : '.5';
            }
            var plantInput = document.getElementById('dialogue-plant-' + seedName);
            if (plantInput)
            {
                plantInput.style.backgroundColor = (!highlight || canBePlanted) ? '' : 'hsla(0, 100%, 50%, .5)';
            }
            if (init)
            {
                observer.add('bonemeal', function ()
                             {
                    return checkSeedInfo(seedName);
                });
                observer.add('farmingXp', function ()
                             {
                    return checkSeedInfo(seedName);
                });
                observer.add('woodcuttingXp', function ()
                             {
                    return checkSeedInfo(seedName);
                });
                settings.observe(settings.KEY.highlightUnplantableSeed, function ()
                                 {
                    return checkSeedInfo(seedName);
                });
            }
        }

        function getSeedInfo(seedName)
        {
            return seedInfo[seedName];
        }
        farming.getSeedInfo = getSeedInfo;

        function init()
        {
            addBetterStyle();
            // read all seed information
            var tooltipEls = document.querySelectorAll('div[id^="tooltip-"][id$="Seeds"]');
            for (var i = 0; i < tooltipEls.length; i++)
            {
                var tooltipEl = tooltipEls[i];
                var seedName = tooltipEl.id.replace(/^tooltip-/, '');
                readSeedInfo(seedName, tooltipEl);
                checkSeedInfo(seedName, true);
            }
        }
        farming.init = init;
    })(farming || (farming = {}));

    /**
 * add in-game calculators
 */
    var calc;
    (function (calc)
     {
        var mining = {};
        var crafting = {};
        mining.XPConvert = 'xp-gain-pickaxe-convert';
        mining.dialog = 'dialogue-id-boundPickaxe';
        mining.name = 'mining';
        crafting.XPConvert = 'xp-gain-hammer-convert';
        crafting.dialog = 'dialogue-id-boundHammer';
        crafting.name = 'crafting';

        function doubleCalcs(skill){
            var getXPConvert = document.getElementById(skill.XPConvert).innerHTML;
            getXPConvert = getXPConvert.replace(/\,/g,'');
            getXPConvert = parseInt(getXPConvert, 10);
            var currentXP = getGameValue(skill.name + 'Xp');
            var totalXP = currentXP + getXPConvert;
            var level = getLevel(totalXP);

            $('#'+skill.name+'-level').html(format.number(level));
            $('#'+skill.name+'-xp').html(format.number(totalXP));
        }
        function doubleSkills(skill){
            var getSkillDialog = document.getElementById(skill.dialog);
            var div = document.createElement("div");
            div.className = 'basic-smallbox';
            div.innerHTML = '<b>Your next level will be: <x id="'+skill.name+'-level" style="color: blue"></x></b> (<x id="'+skill.name+'-xp"></x> xp)';

            var smallboxes = getSkillDialog.querySelectorAll('div.basic-smallbox');
            getSkillDialog.insertBefore(div, smallboxes[0]);
        }

        function magic(){

            var getSkillDialog = document.getElementById("dialogue-id-meditate");
            var div = document.createElement("div");
            var div2 = document.createElement("div");
            var title = document.createElement("h1");
            title.className = 'container-title';
            title.innerHTML = "Meditation Calculator";
            var closeButton= '<br/><input type="button" value="Close"/>';

            div2.className = 'basic-smallbox';
            div.className = 'basic-smallbox';
            div2.innerHTML = '<b>Target level: </b><input type="number" value="1" id="magic-level" size="4" min="1" max="100" style="width: 47px;">';
            div.innerHTML = '<span> \
<input type="image" width="50px" id="stone" src="images/empoweredStone.png"> \
<input type="image" width="50px" id="moonstone" src="images/empoweredMoonstone.png"> \
<input type="image" width="50px" id="marsrock" src="images/empoweredMarsRock.png"> \
<input type="image" width="50px" id="promethium" src="images/empoweredPromethium.png"> \
<input type="image" width="50px" id="runite" src="images/empoweredRunite.png"> \
</span><br /><b>Empowered Rocks needed:</b> \
<input type="number" value="0" id="input-empowered-amount" size="4" min="0" max="9999" style="width: 67px;"> \
<br><img src="images/icons/wizardhat.png" class="image-icon-20"> +<span id="xp-gain-meditate-convert"></span> xp \
<br><span id="stone-display"><img src="images/stone.png" class="image-icon-20"> -<span id="stone-cost-meditate-convert"></span></span> \
<span id="moonstone-display" style="display: none"> \
<img src="images/moonstone.png"  class="image-icon-20"> -<span id="moonstone-cost-meditate-convert"></span></span></span> \
<span id="marsrock-display" style="display: none"> \
<img src="images/marsRock.png"  class="image-icon-20"> -<span id="marsrock-cost-meditate-convert"></span></span> \
<span id="promethium-display" style="display: none"> \
<img src="images/promethium.png"  class="image-icon-20"> -<span id="promethium-cost-meditate-convert"></span></span> \
<span id="runite-display" style="display: none"><img src="images/runite.png"  class="image-icon-20"> -<span id="runite-cost-meditate-convert"></span></span> \
<br><img src="images/icons/stardust.png" class="image-icon-20"> -<span id="stardust-cost-meditate-convert"></span> \
<br><img src="images/icons/hourglass.png" class="image-icon-20"> <span id="duration-meditate-convert"></span> hours \
';
            $(getSkillDialog).append(title, div2, div, closeButton);
        }
        function magicCalcXP(number, node){
            if (!number){
                return;
            }
            if (!node){
                return;
            }
            var rock;
            var inputLevel = $('#magic-level');
            var inputRock = $('#input-empowered-amount');

            var getRocks = inputRock.val();
            var donorXPBoost = (win.donorXpBoost > win.currentTimeMillis) ? 1.1 : 1;
            var greenRockOrb = (boundGreenEmpoweredRockOrb) ? 0.8 : 1;
            var achvPerk = (achMagicMediumCompleted) ? 0.5 : 1;
            var blueMeditateOrb = (boundBlueMeditationOrb) ? 0.5 : 1;

            var materials = 1;
            if (number === 1){
                rock = 'stone';
                materials = 1000000 * achvPerk;
            }else if (number === 2){
                rock = 'moonstone';
                materials = 100 * achvPerk;
            }else if (number === 3){
                rock = 'marsrock';
                materials = 10 * achvPerk;
            }else if (number === 4){
                rock = 'promethium';
                materials = 30 * achvPerk;
            }else if (number === 5){
                rock = 'runite';
                materials = 1;
            }
            //find meditate level and time
            var meditateTime = 0;
            for (var i = 1; i <= 9; i++){
                if (getGameValue("meditate"+i) === 1){
                    meditateTime = 11 - i;
                }
            }

            var gainXP = (getRocks > 9999) ? Number.NaN : getRocks*10000*donorXPBoost;
            var sdCost = (getRocks > 9999) ? Number.NaN : getRocks*100000*greenRockOrb;
            var matCost = (getRocks > 9999) ? Number.NaN : getRocks*materials;
            var duration = (getRocks > 9999) ? Number.NaN : getRocks*meditateTime*blueMeditateOrb;
            gainXP = parseInt(Math.round(gainXP), 10);
            sdCost = parseInt(Math.round(sdCost), 10);
            var totalXP = win.magicXp + gainXP;
            var level = getLevel(totalXP);

            $('#xp-gain-meditate-convert').html(format.number(gainXP));
            $('#stardust-cost-meditate-convert').html(format.number(sdCost));
            $('#'+node.id+'-cost-meditate-convert').html(format.number(matCost));
            $('#duration-meditate-convert').html(format.number(duration));
            inputLevel.val(level);

            if (node.id == rock){
                document.getElementById('stone').style.backgroundColor = '';
                document.getElementById('moonstone').style.backgroundColor = '';
                document.getElementById('marsrock').style.backgroundColor = '';
                document.getElementById('promethium').style.backgroundColor = '';
                document.getElementById('runite').style.backgroundColor = '';
                node.style.backgroundColor = 'red';
                document.getElementById('stone-display').style.display = "none";
                document.getElementById('moonstone-display').style.display = "none";
                document.getElementById('marsrock-display').style.display = "none";
                document.getElementById('promethium-display').style.display = "none";
                document.getElementById('runite-display').style.display = "none";
                document.getElementById(node.id+'-display').style.display = "";
            }
        }

        function magicCalcLevel(number, node){
            if (!number){
                return;
            }
            if (!node){
                return;
            }

            var inputLevel = $('#magic-level');
            var inputRock = $('#input-empowered-amount');

            var desireLevel = inputLevel.val();
            var donorXPBoost = (win.donorXpBoost > win.currentTimeMillis) ? 1.1 : 1;
            var greenRockOrb = (boundGreenEmpoweredRockOrb) ? 0.8 : 1;
            var achvPerk = (achMagicMediumCompleted) ? 0.5 : 1;
            var blueMeditateOrb = (boundBlueMeditationOrb) ? 0.5 : 1;
            var rock;
            var materials = 1;
            if (number === 1){
                rock = 'stone';
                materials = 1000000 * achvPerk;
            }else if (number === 2){
                rock = 'moonstone';
                materials = 100 * achvPerk;
            }else if (number === 3){
                rock = 'marsrock';
                materials = 10 * achvPerk;
            }else if (number === 4){
                rock = 'promethium';
                materials = 30 * achvPerk;
            }else if (number === 5){
                rock = 'runite';
                materials = 1;
            }
            //find meditate level and time
            var meditateTime = 0;
            for (var i = 1; i <= 9; i++){
                if (getGameValue("meditate"+i) === 1){
                    meditateTime = 11 - i;
                }
            }

            var desireXP = Math.round(Math.pow(desireLevel, 3 + desireLevel/200));
            var actualXPneed = (desireLevel > 100) ? Number.NaN : (desireXP - win.magicXp);
            var rockneed = Math.round(actualXPneed/(donorXPBoost * 10000));
            var rockneed2 = (rockneed < 1) ? 1 : rockneed;
            var sdneed = (desireLevel > 100) ? Number.NaN : rockneed2*100000*greenRockOrb;
            var matneed = (desireLevel > 100) ? Number.NaN : rockneed2*materials;
            var duration = (desireLevel > 100) ? Number.NaN : rockneed2*meditateTime*blueMeditateOrb;

            inputRock.val(rockneed2);
            $('#xp-gain-meditate-convert').html(format.number(actualXPneed));
            $('#stardust-cost-meditate-convert').html(format.number(sdneed));
            $('#'+node.id+'-cost-meditate-convert').html(format.number(matneed));
            $('#duration-meditate-convert').html(format.number(duration));

            if (node.id == rock){
                document.getElementById('stone').style.backgroundColor = '';
                document.getElementById('moonstone').style.backgroundColor = '';
                document.getElementById('marsrock').style.backgroundColor = '';
                document.getElementById('promethium').style.backgroundColor = '';
                document.getElementById('runite').style.backgroundColor = '';
                node.style.backgroundColor = 'red';
                document.getElementById('stone-display').style.display = "none";
                document.getElementById('moonstone-display').style.display = "none";
                document.getElementById('marsrock-display').style.display = "none";
                document.getElementById('promethium-display').style.display = "none";
                document.getElementById('runite-display').style.display = "none";
                document.getElementById(node.id+'-display').style.display = "";
            }
        }
        function woodcuttingCalc(){
            var treeXP = {0: 0, 1: 1000, 2: 2500, 3: 5000, 4: 10000, 5: 16000, 6: 20000, 7: 1000,
                          8: 2500, 9: 5000, 10: 10000, 11: 16000, 12: 20000, 13: 40000, 14: 40000};
            var getXP = 0;

            for (var i = 1; i <= 6 ;i++){
                getXP += treeXP[getGameValue('treeId'+ i)];
            }
            var donorXPBoost = (win.donorXpBoost > win.currentTimeMillis) ? 1.1 : 1;
            getXP = getXP*donorXPBoost;
            var bonusPerk = ((win.achWoodcuttingMediumCompleted) ? 5 : 0) + ((win.achWoodcuttingEliteCompleted) ? 10 : 0);
            var bonusGem;

            if (boundEmptyAxe){
                bonusGem = 0;
            }else if (boundSapphireAxe){
                bonusGem = 5;
            }else if (boundEmeraldAxe){
                bonusGem = 10;
            }else if (boundRubyAxe){
                bonusGem = 15;
            }else if (boundDiamondAxe){
                bonusGem = 20;
            }
            var bonusLevel = {};
            bonusLevel = {max: 1, average: 1};
            var WCLevel = win.getLevel(win.woodcuttingXp);
            if (WCLevel < 20){
                bonusLevel = {max: 1, average: 1};
            }else if (WCLevel >= 20 && WCLevel < 30){
                bonusLevel = {max: 2, average: 1};
            }else if (WCLevel >= 30 && WCLevel < 40){
                bonusLevel = {max: 3, average: 2};
            }else if (WCLevel >= 40 && WCLevel < 50){
                bonusLevel = {max: 4, average: 2};
            }else if (WCLevel >= 50 && WCLevel < 60){
                bonusLevel = {max: 5, average: 3};
            }else if (WCLevel >= 60 && WCLevel < 70){
                bonusLevel = {max: 6, average: 3};
            }else if (WCLevel >= 70 && WCLevel < 80){
                bonusLevel = {max: 7, average: 4};
            }else if (WCLevel >= 80 && WCLevel < 90){
                bonusLevel = {max: 8, average: 4};
            }else if (WCLevel >= 90 && WCLevel < 100){
                bonusLevel = {max: 9, average: 5};
            }else if (WCLevel == 100){
                bonusLevel = {max: 10, average: 5};
            }
            var totalMin = 15+bonusPerk+bonusGem+1;
            var totalMax = 30+bonusPerk+bonusGem+bonusLevel.max;
            var totalAverage = (totalMin+totalMax)/2;
            $('#wc-xp').html(format.number(getXP));
            $('#wc-logs-perk').html(format.number(bonusPerk));
            $('#wc-logs-gem').html(format.number(bonusGem));
            $('#wc-level-max').html(format.number(bonusLevel.max));
            $('#wc-level-average').html(format.number(bonusLevel.average));
            $('#wc-total-min').html(format.number(totalMin));
            $('#wc-total-max').html(format.number(totalMax));
            $('#wc-total-logs-average').html(format.number(totalAverage));
        }
        function woodcutting(){
            addStyle('div.smallbox-fix-lines \n{\n\tline-height: 1.6;\n}');
            $("#dialogue-axe-chance").parentsUntil("div").css({"display": "none"});
            $("#dialogue-id-axe").find("br:first").remove();
            var getSkillDialog = document.getElementById('dialogue-id-axe');
            var div = document.createElement("div");
            div.className = 'basic-smallbox';

            div.innerHTML = '<div class="smallbox-fix-lines"><b>Total xp for chopping all of current trees: <x id="wc-xp" style="color: blue"></x></b><br /> \
<b>Current total logs per tree: <x id="wc-total-min" style="color: blue"></x> - <x id="wc-total-max" style="color: blue"></x> \
(<x id="wc-total-logs-average" style="color: blue"></x> on average)</b><br/> \
Original logs per tree: 15 - 30 (22 on average)<br/> \
Bonus logs from woodcutting level: random between 1 - <x id="wc-level-max"></x> \
(<x id="wc-level-average"></x> on average)</b><br/> \
Bonus logs from gems: <x id="wc-logs-gem"></x><br/> \
Bonus logs from achievement perk: <x id="wc-logs-perk"></x></div><br/> \
<table border="1"><tr><th>Level</th><th>1</th><th>15</th><th>30</th><th>50</th><th>70</th><th>85</th><th>95</th></tr> \
<tr><th>Tree</th><td><img src="images/woodcutting/tree4.png" width="65"></td><td><img src="images/woodcutting/oakTree4.png" width="65"></td> \
<td><img src="images/woodcutting/willowTree4.png" width="65"></td><td><img src="images/woodcutting/mapleTree4.png" width="65"></td> \
<td><img src="images/woodcutting/stardustTree4.png" width="65"></td><td><img src="images/woodcutting/strangeLeafTree4.png" width="65"></td> \
<td><img src="images/woodcutting/ancientTree4.png" width="65"></td> \
<tr><th>XP</th><th>1,000</th><th>2,500</th><th>5,000</th><th>10,000</th><th>16,000</th><th>20,000</th><th>40,000</th></tr> \
<tr><th>Time</th><th>3</th><th>6</th><th>8</th><th>12</th><th>16</th><th>20</th><th>40</th></tr> \
<tr><th>XP/h ratio</th><th>333</th><th>416</th><th>625</th><th>833</th><th>1,000</th><th>1,000</th><th>1,000</th></tr> \
</table>';

            getSkillDialog.insertBefore(div, document.getElementById('dialgoue-axe-upgrade-with'));
        }
        function bonemealBinCalc(){
            var stripedCrystalLeafSeeds = ['stripedCrystalLeafSeeds', 100];
            var ancientTreeSeeds = ['ancientTreeSeeds', 100];
            var strangeLeafTreeSeeds = ['strangeLeafTreeSeeds', 65];
            var stardustTreeSeeds = ['stardustTreeSeeds', 50];
            var crystalLeafSeeds = ['crystalLeafSeeds', 50];
            var mapleTreeSeeds = ['mapleTreeSeeds', 30];
            var willowTreeSeeds = ['willowTreeSeeds', 15];
            var goldLeafSeeds = ['goldLeafSeeds', 10];
            var stardustSeeds = ['stardustSeeds', 5];

            var stripedCrystalBM = getGameValue(stripedCrystalLeafSeeds[0]) * stripedCrystalLeafSeeds[1];
            var ancientTreeBM = getGameValue(ancientTreeSeeds[0]) * ancientTreeSeeds[1];
            var strangeLeafTreeBM = getGameValue(strangeLeafTreeSeeds[0]) * strangeLeafTreeSeeds[1];
            var stardustTreeBM = getGameValue(stardustTreeSeeds[0]) * stardustTreeSeeds[1];
            var crystalLeafBM = getGameValue(crystalLeafSeeds[0]) * crystalLeafSeeds[1];
            var mapleTreeBM = getGameValue(mapleTreeSeeds[0]) * mapleTreeSeeds[1];
            var willowTreeBM = getGameValue(willowTreeSeeds[0]) * willowTreeSeeds[1];
            var goldLeafBM = getGameValue(goldLeafSeeds[0]) * goldLeafSeeds[1];
            var stardustBM = getGameValue(stardustSeeds[0]) * stardustSeeds[1];

            var totalBM = stripedCrystalBM+ancientTreeBM+strangeLeafTreeBM+stardustTreeBM +crystalLeafBM +mapleTreeBM +willowTreeBM +goldLeafBM +stardustBM;
            $("#bonemeal-need").text(format.number(totalBM));
        }
        function bonemealBin(){
            $('#bonemeal-bones-input').css('width', "51px");
            var getSkillDialog = document.getElementById('dialogue-bonemeal');
            var div = document.createElement("div");
            div.className = 'basic-smallbox';
            div.innerHTML = '<div class="smallbox-fix-lines"><b>You will need <x id="bonemeal-need" style="color: blue"></x> bonemeal to grow all of your seeds</b><br /> \
Bone Amulet (Skeleton in Caves) or Bone Ring (Vendor) x2 bones in lootbags<br /> \
Green Bonemeal Bin Orb +1 bonemeal for every bonemeal item<br /></div> \
';
            $(div).insertAfter("#dialogue-bonemeal h2:first");
            $("#dialogue-bonemeal h2:first").css("display", "none");
            var boneSource = " <b>Source: </b><img title='Treasure Chest' src='images/treasureChest.png' class='image-icon-50'> \
<img title='Chicken' src='images/hero/npc/1.png' class='image-icon-50'> \
<img title='Rat' src='images/hero/npc/2.png' class='image-icon-50'> <img title='Thief' src='images/hero/npc/6.png' class='image-icon-50'> \
<img title='Bear' src='images/hero/npc/7.png' class='image-icon-50'> <img title='Skeleton' src='images/hero/npc/9.png' class='image-icon-50'> \
<img title='Vendor' src='images/vendor.png' class='image-icon-50'> \
";
            var ashesSource = " <b>Source: </b><img title='Green Treasure Chest' src='images/greenTreasureChest.png' class='image-icon-50'> \
<img title='Golem' src='images/hero/npc/10.png' class='image-icon-50'> \
<img title='Fire Bird' src='images/hero/npc/11.png' class='image-icon-50'> <img title='Fire Mage' src='images/hero/npc/12.png' class='image-icon-50'> \
";
            var iceBonesSource = " <b>Source: </b><img title='Lizard' src='images/hero/npc/13.png' class='image-icon-50'> \
<img title='Ice Bird' src='images/hero/npc/15.png' class='image-icon-50'> \
";
            var moonBonesSource = " <b>Source: </b><img title='Giant' src='images/hero/npc/19.png' class='image-icon-50'> \
<img title='Five Eyed' src='images/hero/npc/20.png' class='image-icon-50'> \
";
            var darkBonesSource = " <b>Source: </b><img title='Dark Mage' src='images/hero/npc/22.png' class='image-icon-50'> \
<img title='Pirate Skeleton' src='images/hero/npc/23.png' class='image-icon-50'> <img title='Dark Witch' src='images/hero/npc/24.png' class='image-icon-50'> \
";
            $("#bonemeal-bones-box").append(boneSource);
            $("#bonemeal-ashes-box").append(ashesSource);
            $("#bonemeal-iceBones-box").append(iceBonesSource);
            $("#bonemeal-moonBones-box").append(moonBonesSource);
            $("#bonemeal-darkBones-box").append(darkBonesSource);
        }
        function brewing(){
            var getSkillDialog = document.getElementById("dialogue-id-brewingkit");
            var note = (!boundBrewingKit) ? '<b style="color:red">Note:</b> You do not have this item yet, this is just a DH2 Fixed effect to<br/> show the calculator' : '';
            var title = "<h1 class='container-title'>Brewing Calculator</h1>";
            var closeButton= '<br/><input type="button" value="Close"/>';
            var div = `<br/><div class='basic-smallbox' style="line-height: 1.6"><b>You need about <span style="color:blue" id="total-current-pot-xp"></span> \
to drink all of current potions</b> <br/>(click on headers to sort the table)<br/> \
The <b>Brewable XP</b> column will give you an idea about the priority of which potion<br/> should be brewed in term of XP<br/> \
<table id="brewing-calc-table" border="1" style="text-align:center"><thead><tr><th>Potion</th><th class="sortable ascending-sort number"> \
Current</th><th class="sortable ascending-sort number">Brewable</th><th class="sortable ascending-sort number">Total</th> \
<th class="sortable ascending-sort number"> \
Current XP</th><th class="sortable ascending-sort number">Brewable XP</th><th class="sortable ascending-sort number">Total XP</th> \
<th class="sortable ascending-sort time">Current Time</th></tr></thead><tbody></tbody></table></div>`;

            $(getSkillDialog).append(title);
            $(getSkillDialog).append(note);
            $(getSkillDialog).append(div);
            $(getSkillDialog).append(closeButton);
            var allPots = ['stardust', 'tree', 'seed', 'smelting', 'oil', 'bar','supersd', 'cd', 'farmingspeed', 'stargem', 'mana', 'superoil',
                           'supertree', 'supercombatcd', 'supercompost', 'supermana', 'dark', 'oxygen', 'crit', 'lootbag'];
            var image = ['stardust', 'tree', 'seed', 'smelting', 'oil', 'bar','superStardust', 'combatCooldown', 'farmingSpeed', 'stargem', 'mana', 'superOil',
                         'superTree', 'superCombatCooldown', 'superCompost', 'superMana', 'dark', 'oxygen', 'criticalStrike', 'lootBag'];

            for (let i = 0; i < allPots.length; i++){
                var potRow = `<tr><td><img src='images/`+image[i]+`Potion.png' class="image-icon-40"></td><td id ="`+allPots[i]+`-current"> \
</td><td id ="`+allPots[i]+`-brewable"></td><td id ="`+allPots[i]+`-total"></td><td id ="`+allPots[i]+`-current-xp"> \
</td><td id ="`+allPots[i]+`-brewable-xp"></td><td id ="`+allPots[i]+`-total-xp"></td> \
<td id ="`+allPots[i]+`-current-time"></td></tr>`;
                $("#brewing-calc-table tbody").append(potRow);
            }
        }
        function findMinPot(){
            var arrPots = [];
            for (let i = 0; i < arguments.length; i++) {
                if (i % 2 == 0){
                    var x = arguments[i]/arguments[i+1];
                    arrPots.push(x);
                }else {
                    continue;
                }
            }
            var getMin = Math.min(...arrPots);
            var min = Math.floor(getMin);
            return min;
        }
        function formatRound(value){
            return format.number(Math.floor(value));

        }
        function fullTime(timer)
        {

            if (typeof timer === 'string')
            {
                timer = parseInt(timer, 10);
            }
            timer = Math.max(timer, 0);
            var days = Math.floor(timer / 86400);
            var hours = Math.floor((timer % 86400) / 3600);
            var minutes = Math.floor((timer % 3600) / 60);
            var seconds = timer % 60;
            return  zeroPadLeft(days) + 'd ' + zeroPadLeft(hours) + ':' + zeroPadLeft(minutes) + ':' + zeroPadLeft(seconds) ;
        }
        function removeComma(string){
            return parseInt(string.replace(/,/g,''), 10);
        }
        function convertTime(time){
            return new Date("2018/01/01 "+ time.replace(/[0-9][0-9]d\s/g,'')).getTime() +
                parseInt(time.replace(/d\s[0-2]?[0-3]:[0-5][0-9]:[0-5][0-9]/g,''), 10) * 86400000;
        }

        function brewingCalc(){

            var donorXPBoost = (win.donorXpBoost > win.currentTimeMillis) ? 1.1 : 1;
            var bonusDuration = 1;
            var bonusAch = 0;
            var bonusLevel = 0;
            var brewingLevel = win.getLevel(win.brewingXp);
            if (achBrewingHardCompleted){
                bonusAch = 15;
            }else if (achBrewingMediumCompleted){
                bonusAch = 10;
            }else if (achBrewingEasyCompleted){
                bonusAch = 5;
            }else{
                bonusAch = 0;
            }
            for(let i = 0; i <= 100; i += 5){
                if (brewingLevel >= i && brewingLevel < (i+5)){
                    bonusLevel = i/5;
                }
            }
            bonusDuration = bonusDuration * (1 + (bonusAch+bonusLevel)/100);

            var sdBrewable = findMinPot(dottedGreenLeaf, 1, redMushroom, 25);
            var treeBrewable = findMinPot(dottedGreenLeaf, 2, redMushroom, 15);
            var seedBrewable = findMinPot(dottedGreenLeaf, 1, redMushroom, 30);
            var smeltingBrewable = findMinPot(dottedGreenLeaf, 3);
            var oilBrewable = findMinPot(greenLeaf, 1, redMushroom, 50);
            var barBrewable = findMinPot(greenLeaf, 3, blewitMushroom, 50);
            var supersdBrewable = findMinPot(limeLeaf, 5, snapegrass, 50);
            var cdBrewable = findMinPot(strangeBlueLeaf, 1, greenLeaf, 5);
            var farmingspeedBrewable = findMinPot(redMushroom, 100, blewitMushroom, 50, snapegrass, 10);
            var stargemBrewable = findMinPot(goldLeaf, 1, blewitMushroom, 100);
            var manaBrewable = findMinPot(goldLeaf, 1, limeLeaf, 10, strangePurpleLeaf, 1);
            var superoilBrewable = findMinPot(goldLeaf, 3, redMushroom, 150);
            var supertreeBrewable = findMinPot(goldLeaf, 3, blewitMushroom, 50);
            var supercombatcdBrewable = findMinPot(strangeBlueLeaf, 4, greenLeaf, 20);
            var supercompostBrewable = findMinPot(crystalLeaf, 5, redMushroom, 200, blewitMushroom, 100, snapegrass, 50);
            var supermanaBrewable = findMinPot(crystalLeaf, 5, limeLeaf, 25, strangePurpleLeaf, 5);
            var darkBrewable = findMinPot(limeLeaf, 25, goldLeaf, 10, darkMushroomLair, 10);
            var oxygenBrewable = findMinPot(greenLeaf, 100, limeLeaf, 50, goldLeaf, 20, crystalLeaf, 10, strangePinkLeaf, 1);
            var critBrewable = findMinPot(crystalLeaf, 10, stripedCrystalLeaf, 1, strangeBlueLeaf, 5);
            var lootbagBrewable = findMinPot(crystalLeaf, 10, stripedCrystalLeaf, 2, goldLeaf, 15, strangePurpleLeaf, 1);

            var stardust = {"current" : win.stardustPotion, "brewable" : sdBrewable, "xp": 50, "time": 5};
            var tree = {"current" : win.treePotion, "brewable" : treeBrewable, "xp": 70, "time": 10};
            var seed = {"current" : win.seedPotion, "brewable" : seedBrewable, "xp": 75, "time": 30};
            var smelting = {"current" : win.smeltingPotion, "brewable" : smeltingBrewable, "xp": 200, "time": 30};
            var oil = {"current" : win.oilPotion, "brewable" : oilBrewable, "xp": 210, "time": 15};
            var bar = {"current" : win.barPotion, "brewable" : barBrewable, "xp": 380, "time": 30};
            var supersd = {"current" : win.superStardustPotion, "brewable" : supersdBrewable, "xp": 480, "time": 5};
            var cd = {"current" : win.combatCooldownPotion, "brewable" : cdBrewable, "xp": 555, "time": 0};
            var farmingspeed = {"current" : win.farmingSpeedPotion, "brewable" : farmingspeedBrewable, "xp": 900, "time": 30};
            var stargem = {"current" : win.stargemPotion, "brewable" : stargemBrewable, "xp": 1000, "time": 0};
            var mana = {"current" : win.manaPotion, "brewable" : manaBrewable, "xp": 1250, "time": 1};
            var superoil = {"current" : win.superOilPotion, "brewable" : superoilBrewable, "xp": 2200, "time": 15};
            var supertree = {"current" : win.superTreePotion, "brewable" : supertreeBrewable, "xp": 2350, "time": 30};
            var supercombatcd = {"current" : win.superCombatCooldownPotion, "brewable" : supercombatcdBrewable, "xp": 2550, "time": 0};
            var supercompost = {"current" : win.superCompostPotion, "brewable" : supercompostBrewable, "xp": 4550, "time": 0};
            var supermana = {"current" : win.superManaPotion, "brewable" : supermanaBrewable, "xp": 5000, "time": 1};
            var dark = {"current" : win.darkPotion, "brewable" : darkBrewable, "xp": 6000, "time": 1440};
            var oxygen = {"current" : win.oxygenPotion, "brewable" : oxygenBrewable, "xp": 6650, "time": 0};
            var crit = {"current" : win.criticalStrikePotion, "brewable" : critBrewable, "xp": 7000, "time": 1};
            var lootbag = {"current" : win.lootBagPotion, "brewable" : lootbagBrewable, "xp": 15000, "time": 0};

            var allPots = [stardust, tree, seed, smelting, oil, bar, supersd, cd, farmingspeed, stargem, mana, superoil,
                           supertree, supercombatcd, supercompost, supermana, dark, oxygen, crit, lootbag];
            var allPotName = ['stardust', 'tree', 'seed', 'smelting', 'oil', 'bar','supersd', 'cd', 'farmingspeed', 'stargem', 'mana', 'superoil',
                              'supertree', 'supercombatcd', 'supercompost', 'supermana', 'dark', 'oxygen', 'crit', 'lootbag'];

            var durationList = [];

            for (let i = 0; i < allPots.length; i++){
                durationList.push(allPots[i].current * Math.floor(allPots[i].time * 60 * bonusDuration));

                $('#'+allPotName[i]+'-current').html(formatRound(allPots[i].current));
                $('#'+allPotName[i]+'-brewable').html(formatRound(allPots[i].brewable));
                $('#'+allPotName[i]+'-total').html(formatRound(allPots[i].current + allPots[i].brewable));
                $('#'+allPotName[i]+'-current-xp').html(formatRound(allPots[i].current * allPots[i].xp * donorXPBoost));
                $('#'+allPotName[i]+'-brewable-xp').html(formatRound(allPots[i].brewable * allPots[i].xp * 2* donorXPBoost));
                $('#'+allPotName[i]+'-total-xp').html(formatRound(allPots[i].current * allPots[i].xp* donorXPBoost +
                                                                  allPots[i].brewable * allPots[i].xp * 2* donorXPBoost));
                $('#'+allPotName[i]+'-current-time').html(fullTime(allPots[i].current * Math.floor(allPots[i].time * 60 * bonusDuration)));
            }

            $('#total-current-pot-xp').html(format.timer(Math.max(...durationList)));

        }
        function orbs(){
            var getSkillDialog = document.getElementById("dialogue-id-orbs-tracking");
            var title = "<h1 class='container-title'>Orbs tracking status</h1>";
            var closeButton= '<br/><input type="button" value="Close"/>';
            var blueOrbBox = `<br/><div class='basic-smallbox'> \
<table id="blue-orbs-table" style="text-align:center"><tr></tr><tr></tr></table></div>`;
            var greenOrbBox = `<br/><div class='basic-smallbox'> \
<table id="green-orbs-table" style="text-align:center"><tr></tr><tr></tr></table></div>`;
            var redOrbBox = `<br/><div class='basic-smallbox'> \
<table id="red-orbs-table" style="text-align:center"><tr></tr><tr></tr></table></div>`;
            $(getSkillDialog).append(title);
            $(getSkillDialog).append(blueOrbBox);
            $(getSkillDialog).append(greenOrbBox);
            $(getSkillDialog).append(redOrbBox);
            $(getSkillDialog).append(closeButton);

            var statusNo = "<td><img src='images/icons/x.png' class='image-icon-20'></td>";
            var statusYes = "<td><img src='images/icons/check.png' class='image-icon-20'></td>";

            var blueOrbs = ["FishingRod", "Shovel", "Axe", "Rake", "Trowel", "Pickaxe", "OilPipe", "Hammer", "Chisel", "Meditation"];
            var blueTitles = ["Your fishermen will catch 3 new types of fish", "Collects bait over time", "10% chance that a tree will rewgrow instantly when chopped",
                              "10% chance of getting seeds back on harvest", "10% chance of getting food seeds back on harvest", "Ores will grant twice the XP \
when using the pickaxe", "Doubles your oil pipe income", "Save 2 stardust per xp for when converting bars to xp", "10% more stardust when opening stardust \
crystals", "Meditate twice as fast"];
            for (let i = 0; i < blueOrbs.length; i++){
                var orbRow1 = "<td><img title='"+blueTitles[i]+"' src='images/blue"+blueOrbs[i]+"Orb.png' class='image-icon-50'></td>";
                $("#blue-orbs-table tr:first").append(orbRow1);
                $("#blue-orbs-table tr:eq(1)").append((getGameValue("boundBlue"+blueOrbs[i]+"Orb")) ? statusYes : statusNo);
            }
            var greenOrbs = ["OilFactory", "Combat", "BrewingKit", "Bow", "BonemealBin", "Rocket", "OilStorage", "EmpoweredRock", "Cannon"];
            var greenTitles = ["Doubles your oil income for each factory worker", "Increases your attack, accuracy, defence and magic by 1 permanently",
                               "Doubles the chances of getting two potions instead of one from the brewing kit", "50% chance to save an arrow every attack",
                               "+1 bonemeal on every bone", "Allows your rocket to travel to mars", "Doubles oil capacity on every oil \
storage", "Get 20% stardust back each time you use an empowered rock","50% chance to save your cannonball every attack"];
            for (let i = 0; i < greenOrbs.length; i++){
                var orbRow2 = "<td><img title='"+greenTitles[i]+"' src='images/green"+greenOrbs[i]+"Orb.png' class='image-icon-50'></td>";
                $("#green-orbs-table tr:first").append(orbRow2);
                $("#green-orbs-table tr:eq(1)").append((getGameValue("boundGreen"+greenOrbs[i]+"Orb")) ? statusYes : statusNo);
            }
            var redOrbs = ["MagicWand", "CharcoalFactory", "ManaStar", "CombatLoot", "Axe", "FishingBait", "Rocket"];
            var redTitles = ["Double damage on all magic spells", "Doubles oil income from the charcoal factory and uses much less charcoal \
", "Every mana star is increased by 1", "Allows you to convert a loot bag into a shiny one by right clicking it every 72h", "Allows \
you to convert a fully grown tree into a shiny one every 72h", "Increases efficiency of bait on all boats", "Allows your rocket \
travelling into intesteller space to collect space dust."];
            for (let i = 0; i < redOrbs.length; i++){
                var orbRow3 = "<td><img title='"+redTitles[i]+"' src='images/red"+redOrbs[i]+"Orb.png' class='image-icon-50'></td>";
                $("#red-orbs-table tr:first").append(orbRow3);
                $("#red-orbs-table tr:eq(1)").append((getGameValue("boundRed"+redOrbs[i]+"Orb")) ? statusYes : statusNo);
            }
        }
        function orbsCalc(){
            var blueOrbs = ["FishingRod", "Shovel", "Axe", "Rake", "Trowel", "Pickaxe", "OilPipe", "Hammer", "Chisel", "Meditation"];
            var greenOrbs = ["OilFactory", "Combat", "BrewingKit", "Bow", "BonemealBin", "Rocket", "OilStorage", "EmpoweredRock","Cannon"];
            var redOrbs = ["MagicWand", "CharcoalFactory", "ManaStar", "CombatLoot", "Axe", "FishingBait", "Rocket"];
            var statusNo = "<img src='images/icons/x.png' class='image-icon-20'>";
            var statusYes = "<img src='images/icons/check.png' class='image-icon-20'>";

            for (let i = 0; i < blueOrbs.length; i++){
                $("#blue-orbs-table tr:eq(1) td:eq("+i+")").html((getGameValue("boundBlue"+blueOrbs[i]+"Orb")) ? statusYes : statusNo);
            }
            for (let i = 0; i < greenOrbs.length; i++){
                $("#green-orbs-table tr:eq(1) td:eq("+i+")").html((getGameValue("boundGreen"+greenOrbs[i]+"Orb")) ? statusYes : statusNo);
            }
            for (let i = 0; i < redOrbs.length; i++){
                $("#red-orbs-table tr:eq(1) td:eq("+i+")").html((getGameValue("boundRed"+redOrbs[i]+"Orb")) ? statusYes : statusNo);
            }

        }
        function levelDialog(){
            var getDialog = $("#level-table-dialog");
            var title = `<h1 class='container-title'>XP/level calculator</h1>`;
            var box1 = `<br/><div class='basic-smallbox' style="line-height: 1.7;">Calculate the XP needed to upgrade <br/>
one of your skills<br/><table><tr><td><b>Target level: </b></td><td><input type="number" value="1" \
id="input-level-calc" size="4" min="1" max="100" style="width: 47px;"></td></tr> \
<tr><td><b>Current level: </b></td><td><input type="number" value="1" id="input-current-level-calc" \
size="4" min="1" max="100" style="width: 47px;"></td></tr></table></div>`;
            var box2 = `<div class='basic-smallbox' style="line-height: 1.7;"><table><tr><td><b>Target XP: </b></td><td><span id="output-xp-calc" ></span></td> \
</tr><tr><td><b>Needed XP: </b></td><td><span id="output-needed-xp-calc" ></span></td></tr></table></div>`;

            var closeButton= '<br/><input type="button" value="Close"/>';
            getDialog.append(title);
            getDialog.append(box1);
            getDialog.append(box2);
            getDialog.append(closeButton);
        }
        function levelCalc(){
            var levelVal = $('#input-level-calc').val();
            var XP = (levelVal > 100) ? Number.NaN : Math.pow(levelVal, 3+(levelVal/200));
            XP = Math.floor(XP);
            var currentLevel = $('#input-current-level-calc').val();
            var currentXP = (currentLevel > 100) ? Number.NaN : Math.pow(currentLevel, 3+(currentLevel/200));
            var needXP = XP - currentXP;
            needXP = Math.floor(needXP);
            $('#output-xp-calc').html(format.number(XP));
            $('#output-needed-xp-calc').html(format.number(needXP));
        }
        function fightDialog(){
            $("#dialogue-fight table tr:eq(0)").append("<th>Avg XP/energy</th><th>Avg XP/minute</th>");
            $("#dialogue-fight table tr:eq(1)").append("<td>0.8</td><td>2.67</td>");
            $("#dialogue-fight table tr:eq(2)").append("<td style='background-color: yellow'>1.6</td><td>5.33</td>");
            $("#dialogue-fight table tr:eq(3)").append("<td style='background-color: #e4bf91'>1.23</td><td>20.56</td>");
            $("#dialogue-fight table tr:eq(4)").append("<td style='background-color: white'>1.43</td><td>35.69</td>");
            $("#dialogue-fight table tr:eq(5)").append("<td>0.82</td><td>31.85</td>");
            $("#dialogue-fight table tr:eq(6)").append("<td>0.92</td><td style='background-color: white'>57.78</td>");
            $("#dialogue-fight table tr:eq(7)").append("<td>0.41</td><td style='background-color: #e4bf91'>55.22</td>");
            $("#dialogue-fight table tr:eq(8)").append("<td>0.41</td><td style='background-color: #e4bf91'>55.22</td>");
            $("#dialogue-fight table tr:eq(9)").append("<td>0.37</td><td style='background-color: yellow'>76.04</td>");
            $("#dialogue-fight table tr:eq(10)").append("<td>0.37</td><td style='background-color: yellow'>76.04</td>");
            $("#dialogue-fight table tr:eq(11) td:first").attr("colspan", 7);
        }
        function fishingBait(){
            var getSkillDialog = document.getElementById("dialogue-id-fishingbait-calc");
            var title = "<h1 class='container-title'>Fishing Bait Calculator</h1>";
            var closeButton= '<br/><input type="button" value="Close"/>';
            var baitTable = `<br/><div class='basic-smallbox smallbox-fix-lines'>Beside from loot bags, baits can be found from<br> the shovel with Blue Shovel Orb<br/> \
<br/><table id="fishing-bait-table" border="1" style="text-align:center"><tr><th>Area</th><th>Baits/hour</th><th>Energy cost/bait</th></tr></table></div>`;

            $(getSkillDialog).append(title);
            $(getSkillDialog).append(baitTable);
            $(getSkillDialog).append(closeButton);

            var areaList = {name : ["Fields", "Forests", "Caves", "Volcano", "Northern Fields", "Haunted Mansion", "Moon", "Dark Forest"],
                            baitPerhour: [1, 2.88, 1.7, 0.92, 0.61, 2, 0.71, 2.05],
                            energyPerbait: [200, 69, 588, 1620, 3825, 1875, 2000, 3902]};
            for (let i = 0; i < areaList.name.length; i++){
                var row = "<tr><td>"+areaList.name[i]+"</td><td>"+areaList.baitPerhour[i]+"</td><td>"+format.number(areaList.energyPerbait[i])+"</td></tr>";
                $("#fishing-bait-table").append(row);
            }
            $("#fishing-bait-table tr:eq(2) td:eq(1)").css("background-color", "yellow");
            $("#fishing-bait-table tr:eq(2) td:eq(2)").css("background-color", "yellow");
            $("#fishing-bait-table tr:eq(8) td:eq(1)").css("background-color", "silver");
            $("#fishing-bait-table tr:eq(1) td:eq(2)").css("background-color", "silver");
            $("#fishing-bait-table tr:eq(6) td:eq(1)").css("background-color", "#e4bf91");
            $("#fishing-bait-table tr:eq(3) td:eq(2)").css("background-color", "#e4bf91");
        }

        function initFishingBaitCalc(){
            var box = $("#item-box-fishingBait");
            var dialog = document.createElement('dialog');
            dialog.id = 'dialogue-id-fishingbait-calc';
            document.body.appendChild(dialog);

            box.click(function(){
                $(dialog).dialog(
                    {
                        title: 'Fishing Bait',
                        height: 'auto',
                        width: 'auto'
                    });
            });
            fishingBait();
            $("#dialogue-id-fishingbait-calc :button").click(function(){
                $(this).closest(".ui-dialog-content").dialog("close");
            });
        }
        function initlevelCalc(){

            $("<tr><td colspan='3'><span id='level-table-btn' class='market-browse-button' style='font-size:30px;font-weight:bold;color: \
#f57a90;'><img src='images/icons/skills.png' class='image-icon-50'>XP/level calculator</span></td></tr>").insertBefore("#view-full-profile-btn");

            var btn = $("#level-table-btn");
            var dialog = document.createElement('dialog');
            dialog.id = 'level-table-dialog';
            document.body.appendChild(dialog);
            btn.click(function(){
                $(dialog).dialog(
                    {
                        title: 'XP and level',
                        height: 'auto',
                        width: 'auto'
                    });
            });
            levelDialog();
            var getDialog = $('#level-table-dialog');
            $(":button", getDialog).click(function(){
                $(this).closest(".ui-dialog-content").dialog("close");
            });
            document.getElementById("input-level-calc").addEventListener("keyup", function(){
                levelCalc();
            });
            document.getElementById("input-level-calc").addEventListener("mouseup", function(){
                levelCalc();
            });
            document.getElementById("input-current-level-calc").addEventListener("keyup", function(){
                levelCalc();
            });
            document.getElementById("input-current-level-calc").addEventListener("mouseup", function(){
                levelCalc();
            });
        }
        function initOrbsCalc(){
            var box = $("#item-box-pirate");
            var dialog = document.createElement('dialog');
            dialog.id = 'dialogue-id-orbs-tracking';
            document.body.appendChild(dialog);

            box.click(function(){
                $(dialog).dialog(
                    {
                        title: 'Orb tracker',
                        height: 'auto',
                        width: 'auto'
                    });
                orbsCalc();
            });
            orbs();
            $("#dialogue-id-orbs-tracking :button").click(function(){
                $(this).closest(".ui-dialog-content").dialog("close");
            });
        }
        function initBrewingCalc(){
            var brewingKit = $("#item-box-boundBrewingKit");
            if(!boundBrewingKit){
                brewingKit.css("display", "inline-block");
            }
            var dialog = document.createElement('dialog');
            dialog.id = 'dialogue-id-brewingkit';
            document.body.appendChild(dialog);

            brewingKit.click(function(){
                $(dialog).dialog(
                    {
                        title: 'Brewing Kit',
                        height: 'auto',
                        width: 'auto'

                    });
                brewingCalc();
            });
            brewing();


            $("#dialogue-id-brewingkit :button").click(function(){
                $(this).closest(".ui-dialog-content").dialog("close");
            });

            $(".sortable").click(function(){
                var header = this;
                var table = document.getElementById("brewing-calc-table");
                var rows = table.rows, arr = [];
                var col = $(this).index();
                for (let i = 1; i < rows.length; i++) {
                    var cells = rows[i].cells;
                    arr[i] = [];
                    for (let j = 0; j < cells.length; j++) {
                        arr[i][j] = cells[j].innerHTML;
                    }
                }

                if($(this).hasClass('ascending-sort')){
                    $(this).removeClass('ascending-sort').addClass("descending-sort");
                    arr.sort(function(a, b){
                        if($(header).hasClass('number')){
                            return removeComma(a[col]) - removeComma(b[col]);
                        }else if($(header).hasClass('time')){
                            return convertTime(a[col]) - convertTime(b[col]);
                        }
                    });

                } else if($(this).hasClass('descending-sort')){
                    $(this).removeClass('descending-sort').addClass("ascending-sort");
                    arr.sort(function(a, b){
                        if($(header).hasClass('number')){
                            return removeComma(b[col]) - removeComma(a[col]);
                        }else if($(header).hasClass('time')){
                            return convertTime(b[col]) - convertTime(a[col]);
                        }
                    });
                }
                for (let i = 1; i < rows.length; i++) {
                    rows[i].innerHTML = "<td>" + arr[i-1].join("</td><td>") + "</td>";
                }

                var allPots = ['stardust', 'tree', 'seed', 'smelting', 'oil', 'bar','supersd', 'cd', 'farmingspeed', 'stargem', 'mana', 'superoil',
                               'supertree', 'supercombatcd', 'supercompost', 'supermana', 'dark', 'oxygen', 'crit', 'lootbag'];
                var image = ['stardust', 'tree', 'seed', 'smelting', 'oil', 'bar','superStardust', 'combatCooldown', 'farmingSpeed', 'stargem', 'mana', 'superOil',
                             'superTree', 'superCombatCooldown', 'superCompost', 'superMana', 'dark', 'oxygen', 'criticalStrike', 'lootBag'];
                for (let i = 1; i <= allPots.length; i++){
                    var getImageName1 = $('#brewing-calc-table tr:eq('+i+') td:eq(0)').html();
                    var getImageName2 = getImageName1.substr(17);
                    var pot = getImageName2.slice(0, -34);

                    for (let img in image){
                        for (let x in allPots){
                            if (pot == image[img] && x == img){
                                pot = allPots[x];
                            }
                        }
                    }
                    $('#brewing-calc-table tr:eq('+i+') td:eq(1)').attr('id', pot+'-current');
                    $('#brewing-calc-table tr:eq('+i+') td:eq(2)').attr('id', pot+'-brewable');
                    $('#brewing-calc-table tr:eq('+i+') td:eq(3)').attr('id', pot+'-total');
                    $('#brewing-calc-table tr:eq('+i+') td:eq(4)').attr('id', pot+'-current-xp');
                    $('#brewing-calc-table tr:eq('+i+') td:eq(5)').attr('id', pot+'-brewable-xp');
                    $('#brewing-calc-table tr:eq('+i+') td:eq(6)').attr('id', pot+'-total-xp');
                    $('#brewing-calc-table tr:eq('+i+') td:eq(7)').attr('id', pot+'-current-time');
                }
            });
        }
        function initBonemealBinCalc(){
            bonemealBin();
            var _clicksBonemealBin = win.clicksBonemealBin;
            win.clicksBonemealBin = function()
            {
                _clicksBonemealBin();
                bonemealBinCalc();
            };
        }
        function initMagicCalc()
        {

            var dialog = document.createElement('dialog');
            dialog.id = 'dialogue-id-meditate';
            document.body.appendChild(dialog);

            var _clicksMeditate = win.clicksMeditate;
            win.clicksMeditate = function()
            {
                //openDialogue('dialogue-id-1');
                var height = 430;
                var width = 370;
                $(dialog).dialog(
                    {
                        title: 'Magic Meditation',
                        height: height,
                        width: width
                    });
            };
            magic();
            $("#stone").click(function(){
                magicCalcXP(1, this);
            });
            $("#moonstone").click(function(){
                magicCalcXP(2, this);
            });
            $("#marsrock").click(function(){
                magicCalcXP(3, this);
            });
            $("#promethium").click(function(){
                magicCalcXP(4, this);
            });
            $("#runite").click(function(){
                magicCalcXP(5, this);
            });
            $("#dialogue-id-meditate :button").click(function(){
                $(this).closest(".ui-dialog-content").dialog("close");
            });

            function checkRock(){
                var rock = [];
                var getstone = document.getElementById('stone');
                var getmoonstone = document.getElementById('moonstone');
                var getmarsrock = document.getElementById('marsrock');
                var getpromethium = document.getElementById('promethium');
                var getrunite = document.getElementById('runite');

                if (getstone.style.backgroundColor == 'red'){
                    rock[0] = 1;
                    rock[1] = getstone;
                }else if (getmoonstone.style.backgroundColor == 'red'){
                    rock[0] = 2;
                    rock[1] = getmoonstone;
                }else if (getmarsrock.style.backgroundColor == 'red'){
                    rock[0] = 3;
                    rock[1] = getmarsrock;
                }else if (getpromethium.style.backgroundColor == 'red'){
                    rock[0] = 4;
                    rock[1] = getpromethium;
                }else if (getrunite.style.backgroundColor == 'red'){
                    rock[0] = 5;
                    rock[1] = getrunite;
                }
                return rock;
            }

            document.getElementById("magic-level").addEventListener("keyup", function(){
                magicCalcLevel(checkRock()[0], checkRock()[1]);
            });
            document.getElementById("magic-level").addEventListener("mouseup", function(){

                magicCalcLevel(checkRock()[0], checkRock()[1]);
            });

            document.getElementById("input-empowered-amount").addEventListener("keyup", function(){
                magicCalcXP(checkRock()[0], checkRock()[1]);
            });
            document.getElementById("input-empowered-amount").addEventListener("mouseup", function(){

                magicCalcXP(checkRock()[0], checkRock()[1]);
            });

        }

        function initWoodcuttingCalc(){
            woodcutting();
            var _clicksAxe = win.clicksAxe;
            win.clicksAxe = function()
            {
                _clicksAxe();
                woodcuttingCalc();
            };
        }

        function initMiningCalc()
        {
            doubleSkills(mining);
            document.getElementById("xp-gain-pickaxe-convert").addEventListener("DOMSubtreeModified", function(){
                doubleCalcs(mining);
            });
        }

        function initCraftingCalc()
        {
            doubleSkills(crafting);
            document.getElementById("xp-gain-hammer-convert").addEventListener("DOMSubtreeModified", function(){
                doubleCalcs(crafting);
            });
        }
        function settingColorCalcs(){
            var gradientColorLight = '#00ff37';
            var gradientColorDark = '#065b00';
            // crafting
            var gemHammer = 'Empty';
            if (boundEmptyHammer){
                gemHammer = 'Empty';
            }else if (boundSapphireHammer){
                gemHammer = 'Sapphire';
            }else if (boundEmeraldHammer){
                gemHammer = 'Emerald';
            }else if (boundRubyHammer){
                gemHammer = 'Ruby';
            }else if (boundDiamondHammer){
                gemHammer = 'Diamond';
            }
            var boxHammer = $("#item-box-bound"+gemHammer+"Hammer");
            boxHammer.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            boxHammer.hover(function(){
                boxHammer.css("background", ""+gradientColorDark+"");
            }, function(){
                boxHammer.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-bound"+gemHammer+"Hammer").hover(function(){
                boxHammer.css("background", ""+gradientColorDark+"");
            }, function(){
                boxHammer.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            // mining
            var gemPickaxe = 'Empty';
            if (boundEmptyPickaxe){
                gemPickaxe = 'Empty';
            }else if (boundSapphirePickaxe){
                gemPickaxe = 'Sapphire';
            }else if (boundEmeraldPickaxe){
                gemPickaxe = 'Emerald';
            }else if (boundRubyPickaxe){
                gemPickaxe = 'Ruby';
            }else if (boundDiamondPickaxe){
                gemPickaxe = 'Diamond';
            }
            var boxPickaxe = $("#item-box-bound"+gemPickaxe+"Pickaxe");
            boxPickaxe.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            boxPickaxe.hover(function(){
                boxPickaxe.css("background", ""+gradientColorDark+"");
            }, function(){
                boxPickaxe.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-bound"+gemPickaxe+"Pickaxe").hover(function(){
                boxPickaxe.css("background", ""+gradientColorDark+"");
            }, function(){
                boxPickaxe.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            // woodcutting
            var gemAxe = 'Empty';
            if (boundEmptyAxe){
                gemAxe = 'Empty';
            }else if (boundSapphireAxe){
                gemAxe = 'Sapphire';
            }else if (boundEmeraldAxe){
                gemAxe = 'Emerald';
            }else if (boundRubyAxe){
                gemAxe = 'Ruby';
            }else if (boundDiamondAxe){
                gemAxe = 'Diamond';
            }

            var boxAxe = $("#item-box-bound"+gemAxe+"Axe");
            boxAxe.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            boxAxe.hover(function(){
                boxAxe.css("background", ""+gradientColorDark+"");
            }, function(){
                boxAxe.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-bound"+gemAxe+"Axe").hover(function(){
                boxAxe.css("background", ""+gradientColorDark+"");
            }, function(){
                boxAxe.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            // magic
            var meditateLevel = 0;
            for (var i = 1; i <= 9; i++){
                if (getGameValue("meditate"+i) === 1){
                    meditateLevel = i;
                }
            }
            var boxMagic = $("#item-box-meditate"+meditateLevel);
            boxMagic.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            boxMagic.hover(function(){
                boxMagic.css("background", ""+gradientColorDark+"");
            }, function(){
                boxMagic.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-meditate"+meditateLevel).hover(function(){
                boxMagic.css("background", ""+gradientColorDark+"");
            }, function(){
                boxMagic.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            // bonemealbin
            var boxBin = $("#item-box-boundBonemealBin");
            boxBin.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            boxBin.hover(function(){
                boxBin.css("background", ""+gradientColorDark+"");
            }, function(){
                boxBin.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-boundBonemealBin").hover(function(){
                boxBin.css("background", ""+gradientColorDark+"");
            }, function(){
                boxBin.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            var box2 = $("#item-box-boundFilledBonemealBin");
            box2.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            box2.hover(function(){
                box2.css("background", ""+gradientColorDark+"");
            }, function(){
                box2.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-boundFilledBonemealBin").hover(function(){
                box2.css("background", ""+gradientColorDark+"");
            }, function(){
                box2.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            // brewingkit
            var brewingKit = $("#item-box-boundBrewingKit");
            brewingKit.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            brewingKit.hover(function(){
                brewingKit.css("background", ""+gradientColorDark+"");
            }, function(){
                brewingKit.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-boundBrewingKit").hover(function(){
                brewingKit.css("background", ""+gradientColorDark+"");
            }, function(){
                brewingKit.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            // orb pirate
            var boxPirate = $("#item-box-pirate");
            boxPirate.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            boxPirate.hover(function(){
                boxPirate.css("background", ""+gradientColorDark+"");
            }, function(){
                $(this).css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-pirate").hover(function(){
                boxPirate.css("background", ""+gradientColorDark+"");
            }, function(){
                boxPirate.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            // fishingbait

            var boxBait = $("#item-box-fishingBait");
            boxBait.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            boxBait.hover(function(){
                boxBait.css("background", ""+gradientColorDark+"");
            }, function(){
                $(this).css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-fishingBait").hover(function(){
                boxBait.css("background", ""+gradientColorDark+"");
            }, function(){
                boxBait.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            //woodcutting speed potion
            var boxWoodcuttingSpeed = $("#item-box-woodcuttingSpeedPotion");
            boxWoodcuttingSpeed.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            boxWoodcuttingSpeed.hover(function(){
                boxWoodcuttingSpeed.css("background", ""+gradientColorDark+"");
            }, function(){
                $(this).css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
            $("#default-item-img-tag-woodcuttingSpeedPotion").hover(function(){
                boxWoodcuttingSpeed.css("background", ""+gradientColorDark+"");
            }, function(){
                boxWoodcuttingSpeed.css("background", "linear-gradient("+gradientColorLight+", "+gradientColorDark+")");
            });
        }
        function initWoodcuttingPotionCalc()
        {
            function findValueOfWoodcuttingPotion(){
                woodcuttingCalc();
                let items = {
                    "ancientLogs": 1,
                    "strangeLogs": 1,
                    "stardustLogs": 1,
                    "mapleLogs": 1,
                    "willowLogs": 1,
                    "oakLogs": 1,
                    "logs": 1
                }
                items = market.calcMarketValueIndividual(items);
                let potionTime = win.getPotionTimerUsingBrewingLevel(30*60)/3600
                let ancientPrice = items.ancientLogs/(40/potionTime);
                let strangePrice = items.strangeLogs/(20/potionTime);
                let stardustPrice = items.stardustLogs/(16/potionTime);
                let maplePrice = items.mapleLogs/(12/potionTime);
                let willowPrice = items.willowLogs/(8/potionTime);
                let oakPrice = items.oakLogs/(6/potionTime);
                let logPrice = items.logs/(3/potionTime);

                let totalPrice = 0;
                var trees = [];
                trees.push(win.treeId1);
                trees.push(win.treeId2);
                trees.push(win.treeId3);
                trees.push(win.treeId4);
                trees.push(win.treeId5);
                trees.push(win.treeId6);
                for(let i = 0; i < 6; i++){
                    switch(trees[i]){
                        case 0: totalPrice+=0;
                            break;
                        case 1: totalPrice+=logPrice;
                            break;
                        case 2: totalPrice+=oakPrice;
                            break;
                        case 3: totalPrice+=willowPrice;
                            break;
                        case 4: totalPrice+=maplePrice;
                            break;
                        case 5: totalPrice+=stardustPrice;
                            break;
                        case 6: totalPrice+=strangePrice;
                            break;
                        case 7: totalPrice+=logPrice*5;
                            break;
                        case 8: totalPrice+=oakPrice*5;
                            break;
                        case 9: totalPrice+=willowPrice*5;
                            break;
                        case 10: totalPrice+=maplePrice*5;
                            break;
                        case 11: totalPrice+=stardustPrice*5;
                            break;
                        case 12: totalPrice+=strangePrice*5;
                            break;
                        case 13: totalPrice+=ancientPrice;
                            break;
                        case 14: totalPrice+=ancientPrice*5;
                            break;
                        default:
                            console.log(trees[i]);
                    }
                }
                return totalPrice*document.getElementById("wc-total-logs-average").textContent;
            }

            function getPriceOfWoodcuttingPotion(){
                let recipe = {
                    "redMushroom": 100,
                    "blewitMushroom": 50,
                    "logs": 10
                }
                return market.calcMarketValue(recipe);
            }

            var box = $("#item-box-woodcuttingSpeedPotion");
            var dialog = document.createElement('dialog');
            dialog.id = 'dialogue-id-woodcuttingSpeedPotion';
            document.body.appendChild(dialog);
            function onRightClick(ev){
                if(!market.checkMarketDataValidity(onRightClick,ev)){
                    return;
                }
                ev.preventDefault();
                $(dialog).dialog(
                    {
                        title: 'Woodcutting Speed Potion Value',
                        height: 'auto',
                        width: 'auto'
                    });
                var returnValue = findValueOfWoodcuttingPotion();
                var price = getPriceOfWoodcuttingPotion();
                var goldPerXp = (price-returnValue)/800;
                var htmlText = '<table style="padding:5px;"><tr><td>Cost</td><td>'+Math.round(price).toLocaleString()+'</td></tr>';
                htmlText+= '<tr><td>Return</td><td>'+Math.round(returnValue).toLocaleString()+'</td></tr>';
                htmlText+= '<tr><td>Profit</td><td>'+Math.round((returnValue-price)).toLocaleString()+'</td></tr>';
                htmlText+= '<tr><td>Gold Per XP</td><td>'+Math.round(goldPerXp).toLocaleString()+'</td></tr></table>';
                $(dialog).html(htmlText);
                return false
            }

            box.contextmenu(onRightClick);
            $("#dialogue-id-woodcuttingSpeedPotion :button").click(function(){
                $(this).closest(".ui-dialog-content").dialog("close");
            });
        }

        function initMarketValueCalc(){
            document.getElementById("activity-log").firstElementChild.innerHTML += '<img id="accountValueButton" src="images/coins.png" class="image-icon-30" style="float:right;cursor:pointer;" title="Click to calculate account value">'
            document.getElementById("accountValueButton").addEventListener('click', addAccountValueToLog);
        }

        function addAccountValueToLog(){
            if(!market.checkMarketDataValidity(addAccountValueToLog)){
                return;
            }
            let value = market.calcMarketValueAll();
            let entry = {
                type: "loot",
                title: "Account Value",
                itemList: [
                    {
                        icon: "images/coins.png",
                        text: ""+Math.round(value)
                    }
                    ],
                time: new Date().getTime()
            }
            log.add(entry,false)
        }

        function init(){
            initFishingBaitCalc();
            initMiningCalc();
            initCraftingCalc();
            initMagicCalc();
            initWoodcuttingCalc();
            initBonemealBinCalc();
            initBrewingCalc();
            initOrbsCalc();
            initlevelCalc();
            settingColorCalcs();
            fightDialog();
            initWoodcuttingPotionCalc();
            initMarketValueCalc();
        }
        calc.init = init;

    })(calc || (calc = {}));

    /**
 * general features which doesn't really belong anywhere
 */
    var general;
    (function (general)
     {
        general.name = 'general';
        // disable the drink button for 3 seconds
        var DRINK_DELAY = 3;

        function getSentBoat()
        {
            for (var i = 0; i < BOAT_LIST.length; i++)
            {
                if (getGameValue(BOAT_LIST[i] + 'Timer') > 0)
                {
                    return BOAT_LIST[i];
                }
            }
            return null;
        }

        function checkBoat(boat)
        {
            var boatDialog = null;
            var sendBtn = null;
            var initiatedDialogs = document.querySelectorAll('div[role="dialog"]');
            for (var i = 0; i < initiatedDialogs.length; i++)
            {
                var dialog = initiatedDialogs[i];
                if (dialog.style.display !== 'none')
                {
                    var btn = dialog.querySelector('input[type="button"][value="Send Boat"]');
                    if (btn)
                    {
                        sendBtn = btn;
                        boatDialog = dialog;
                        break;
                    }
                }
            }
            if (!boatDialog || !sendBtn)
            {
                return;
            }
            var smallboxes = boatDialog.querySelectorAll('div.basic-smallbox');
            var baitBox = smallboxes[0];
            var runningBox = smallboxes[1];
            if (smallboxes.length === 1)
            {
                runningBox = document.createElement('div');
                runningBox.className = 'basic-smallbox';
                runningBox.style.display = 'none';
                var parent_1 = baitBox.parentElement;
                var next = baitBox.nextElementSibling;
                if (parent_1)
                {
                    if (next)
                    {
                        parent_1.insertBefore(runningBox, next);
                    }
                    else
                    {
                        parent_1.appendChild(runningBox);
                    }
                }
            }
            var sentBoat = getSentBoat();
            baitBox.style.display = sentBoat !== null ? 'none' : '';
            runningBox.style.display = sentBoat !== null ? '' : 'none';
            // just in case Smitty changes this game mechanic somehow, don't disable the button:
            // sendBtn.disabled = sentBoat !== null;

            sendBtn.style.color = sentBoat !== null ? 'gray' : '';
            win.$(boatDialog).on('dialogclose', function ()
                                 {
                if (sendBtn)
                {
                    sendBtn.style.color = '';
                }
            });
            if (sentBoat === boat)
            {
                runningBox.innerHTML = "<b>Returning in:</b> <span data-item-display=\"" + boat + "Timer\">" + format.timer(getGameValue(boat + 'Timer')) + "</span>";
            }

            else if (sentBoat !== null)
            {
                runningBox.innerHTML = "Wait for the other boat to return.";
            }

            else
            {
                var enoughBaitAndCoal = win.fishingBait >= win.fishingBaitCost(boat)
                && (boat !== 'steamBoat' || win.charcoal >= 300);
                baitBox.style.color = enoughBaitAndCoal ? '' : 'red';
            }

        }

        function initBoatDialog()
        {
            var _clicksBoat = win.clicksBoat;
            win.clicksBoat = function (boat)
            {
                _clicksBoat(boat);
                checkBoat(boat);
            };
            var _doCommand = win.doCommand;
            win.doCommand = function (data)
            {
                _doCommand(data);
                if (data.startsWith('RUN_FUNC=SAIL_BOAT_WIND'))
                {
                    checkBoat('sailBoat');
                }
            };
        }
        var potionDrinkEnable = null;
        var POTION_ACTIVE_HTML = "<br>It's already active.";
        function updateDialogEls(timerKey, dialog, close)
        {
            if (close === void 0)
            {
                close = false;
            }
            var timer = getGameValue(timerKey);
            var showActive = settings.get(settings.KEY.usePotionWarning) && timer > 0 && !close;
            var confirmText = document.getElementById('dialogue-confirm-text');
            var br = confirmText && confirmText.nextElementSibling;
            if (confirmText && br)
            {
                if (showActive)
                {
                    confirmText.innerHTML += POTION_ACTIVE_HTML;
                }
                else
                {
                    confirmText.innerHTML = confirmText.innerHTML.replace(POTION_ACTIVE_HTML, '');
                }
                br.style.display = showActive ? 'none' : '';
            }
            var confirmBtn = document.getElementById('dialogue-confirm-yes');
            if (confirmBtn && showActive)
            {
                confirmBtn.disabled = true;
                var i_1 = DRINK_DELAY;
                var updateValue_1 = function ()
                {
                    confirmBtn.value = 'Drink' + (i_1 > 0 ? ' (' + i_1 + ')' : '');
                    if (i_1 === 0)
                    {
                        potionDrinkEnable && potionDrinkEnable();
                    }
                    else
                    {
                        i_1--;
                    }
                };
                var countDownInterval_1;
                var dialogClose_1 = function ()
                {
                    return potionDrinkEnable && potionDrinkEnable();
                };
                potionDrinkEnable = function ()
                {
                    potionDrinkEnable = null;
                    win.$(dialog).off('dialogclose', dialogClose_1);
                    countDownInterval_1 && clearInterval(countDownInterval_1);
                    confirmBtn.disabled = false;
                    confirmBtn.value = 'Drink';
                };
                updateValue_1();
                countDownInterval_1 = setInterval(function ()
                                                  {
                    return updateValue_1();
                }, 1e3);
                win.$(dialog).on('dialogclose', dialogClose_1);
            }
            else if (!showActive)
            {
                potionDrinkEnable && potionDrinkEnable();
            }
        }

        function checkPotionActive(potion)
        {
            var dialog = document.getElementById('dialogue-confirm');
            var parent = dialog && dialog.parentElement;
            if (!dialog || !parent || parent.style.display === 'none')
            {
                return;
            }
            var timerKey = potion + 'Timer';
            updateDialogEls(timerKey, dialog);
            var fn = observer.add(timerKey, function (key, oldValue, newValue)
                                  {
                if (oldValue < newValue && oldValue === 0
                    || oldValue > newValue && newValue === 0)
                {
                    updateDialogEls(timerKey, dialog);
                }
            });
            win.$(dialog).on('dialogclose', function ()
                             {
                updateDialogEls(timerKey, dialog, true);
                observer.remove(timerKey, fn);
            });
        }

        function initPotionDialog()
        {
            var _confirmDialogue = win.confirmDialogue;
            win.confirmDialogue = function (width, text, btn1Text, btn2Text, cmd)
            {
                potionDrinkEnable && potionDrinkEnable();
                _confirmDialogue(width, text, btn1Text, btn2Text, cmd);
            };
            var _clicksPotion = win.clicksPotion;
            win.clicksPotion = function (potion)
            {
                _clicksPotion(potion);
                checkPotionActive(potion);
            };
        }
        function init()
        {
            //initBoatDialog();
            initPotionDialog();
        }
        general.init = init;
    })(general || (general = {}));

    /**
 * init
 */
    var scriptInitialized = false;

    function init()
    {
        console.info('[%s] "DH2 Fixed %s" up and running.', (new Date).toLocaleTimeString(), version);

        scriptInitialized = true;
        var initModules = [
            settings
            , notifications
            , log
            , gameEvents
            , temporaryFixes
            , crafting
            , itemBoxes
            , chat
            , timer
            , smelting
            , fishingInfo
            //, recipeTooltips
            //, fixNumbers
            , machineDialog
            , amountInputs
            , newTopbar
            , styleTweaks
            , notifBoxes
            , market
            , combat
            , farming
            , general
            , calc
        ];
        for (var _i = 0, initModules_1 = initModules; _i < initModules_1.length; _i++)
        {
            var module = initModules_1[_i];
            try
            {
                module.init();
            }
            catch (error)
            {
                console.error('Error during initialization in module "' + module.name + '":', error);
            }
        }
    }
    document.addEventListener('DOMContentLoaded', function ()
                              {
        var oldValues = new Map();
        var _doCommand = win.doCommand;
        win.doCommand = function (data)
        {
            if (data.startsWith('REFRESH_ITEMS='))
            {
                oldValues = new Map();
                for (var _i = 0, _a = win.jsItemArray; _i < _a.length; _i++)
                {
                    var key = _a[_i];
                    oldValues.set(key, getGameValue(key));
                }
                _doCommand(data);
                if (!scriptInitialized)
                {
                    init();
                }
                return;
            }
            else if (!scriptInitialized)
            {
                if (data.startsWith('CHAT='))
                {
                    var parts = data.substr(5).split('~');
                    return chat.newAddToChatBox(parts[0], parts[1], parts[2], parts[3], 0);
                }
                else if (data.startsWith('PM='))
                {
                    return chat.newAddToChatBox(win.username, '0', '0', data.substr(3), 1);
                }
            }
            var ret = commands.process(data);
            if (ret === void 0)
            {
                ret = _doCommand(commands.formatData(data));
            }
            return ret;
        };
        var _refreshItemValues = win.refreshItemValues;
        win.refreshItemValues = function (itemKeyList, firstLoad)
        {
            _refreshItemValues(itemKeyList, firstLoad);
            for (var _i = 0, itemKeyList_2 = itemKeyList; _i < itemKeyList_2.length; _i++)
            {
                var key = itemKeyList_2[_i];
                observer.notify(key, oldValues.get(key));
            }
            observer.notifyTick();
        };
    });

    /**
 * fix web socket errors
 */
    var main;
    (function (main)
     {
        var WS_TIMEOUT_SEC = 30;
        var WS_TIMEOUT_CODE = 3000;
        var WS_OPEN_TIMEOUT_SEC = 2 * 60; // 2 minutes
        // reload the page after 5 consecutive reconnect attempts without successfully opening the websocket once
        var MAX_RECONNECTS = 5;

        function webSocketLoaded(event)
        {
            if (win.webSocket == null)
            {
                //console.error('WebSocket instance not initialized!');
                return;
            }
            // cache old event listener
            var _onClose = win.webSocket.onclose;
            var _onError = win.webSocket.onerror;
            var _onMessage = win.webSocket.onmessage;
            var _onOpen = win.webSocket.onopen;
            var commandQueue = [];
            var _cBytes = win.cBytes;
            win.cBytes = function (command)
            {
                if (win.webSocket && win.webSocket.readyState === WebSocket.OPEN)
                {
                    _cBytes(command);
                }
                else
                {
                    commandQueue.push(command);
                }
            };
            var pageLoaded = false;
            var wsTimeout = null;
            var reconnectAttempts = 0;

            function onTimeout()
            {
                wsTimeout = null;
                // renew the websocket
                if (reconnectAttempts <= MAX_RECONNECTS)
                {
                    win.webSocket = new WebSocket(win.SSL_ENABLED);
                    win.ignoreBytesTracker = Date.now();
                    initWSListener(win.webSocket);
                    reconnectAttempts++;
                }
                if (win.webSocket)
                {
                    win.webSocket.close(WS_TIMEOUT_CODE, 'Connection timed out after ' + WS_TIMEOUT_SEC + ' seconds');
                }
            }

            function updateWSTimeout()
            {
                if (wsTimeout)
                {
                    win.clearTimeout(wsTimeout);
                }
                wsTimeout = win.setTimeout(onTimeout, WS_TIMEOUT_SEC * 1e3);
            }
            var messageQueue = [];

            function onMessage(event)
            {
                if (pageLoaded)
                {
                    updateWSTimeout();
                    return _onMessage.call(this, event);
                }
                else
                {
                    messageQueue.push(event);
                }
            };
            var wsOpenTimeout = null;

            function onOpenTimeout()
            {
                wsOpenTimeout = null;
                location.reload();
            }

            function onOpen(event)
            {
                reconnectAttempts = 0;
                if (wsOpenTimeout)
                {
                    win.clearTimeout(wsOpenTimeout);
                    wsOpenTimeout = null;
                }
                // do the handshake first
                _onOpen.call(this, event);
                commandQueue.forEach(function (command)
                                     {
                    return win.cBytes(command);
                });
            }

            function onError(event)
            {
                console.error('error in websocket:', event);
                return _onError.call(this, event);
            }

            function onClose(event)
            {
                console.info('websocket closed:', event);
                if (event.code !== WS_TIMEOUT_CODE || reconnectAttempts > MAX_RECONNECTS)
                {
                    location.reload();
                }
                return _onClose.call(this, event);
            }

            function initWSListener(ws)
            {
                if (ws.readyState === WebSocket.CONNECTING)
                {
                    wsOpenTimeout = win.setTimeout(onOpenTimeout, WS_OPEN_TIMEOUT_SEC * 1e3);
                }
                ws.onclose = onClose;
                ws.onerror = onError;
                ws.onmessage = onMessage;
                ws.onopen = onOpen;
            }
            initWSListener(win.webSocket);
            document.addEventListener('DOMContentLoaded', function ()
                                      {
                pageLoaded = true;
                messageQueue.forEach(function (event)
                                     {
                    return win.webSocket.onmessage(event);
                });
            });
        }

        function isScriptElement(el)
        {
            return el.nodeName === 'SCRIPT';
        }

        function isWebSocketScript(script)
        {
            return script.src.includes('socket.js');
        }
        var found = false;
        if (document.head)
        {
            var scripts = document.head.querySelectorAll('script');
            for (var i = 0; i < scripts.length; i++)
            {
                if (isWebSocketScript(scripts[i]))
                {
                    // does this work?
                    scripts[i].onload = webSocketLoaded;
                    found = true;
                }
            }
        }
        if (!found)
        {
            // create an observer instance
            var mutationObserver_1 = new MutationObserver(function (mutationList)
                                                          {
                mutationList.forEach(function (mutation)
                                     {
                    if (mutation.addedNodes.length === 0)
                    {
                        return;
                    }
                    for (var i = 0; i < mutation.addedNodes.length; i++)
                    {
                        var node = mutation.addedNodes[i];
                        if (isScriptElement(node) && isWebSocketScript(node))
                        {
                            mutationObserver_1.disconnect();
                            node.onload = webSocketLoaded;
                            return;
                        }
                    }
                });
            });
            mutationObserver_1.observe(document.head
                                       , {
                childList: true
            });
        }
        // fix scrollText (e.g. when joining the game and receiving xp at that moment)
        win.mouseX = win.innerWidth / 2;
        win.mouseY = win.innerHeight / 2;
        var _confirm = win.confirm;
        win.confirm = function (message)
        {
            // don't show the annoying update confirm box (instead of a confirm box, an ingame dialog could be used...)
            if (message && message.indexOf('Ted\'s Market Script') !== -1)
            {
                return false;
            }
            return _confirm(message);
        };
    })(main || (main = {}));

})();