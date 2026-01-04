// ==UserScript==
// @name         MWI TaskManager
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  sort all task in taskboard
// @author       shykai
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/509720/MWI%20TaskManager.user.js
// @updateURL https://update.greasyfork.org/scripts/509720/MWI%20TaskManager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //default config
    let globalConfig = {
        isActionIcon: true,
        isBattleIcon: true,
        dungeonConfig: {
            "/actions/combat/chimerical_den": false,
            "/actions/combat/sinister_circus": false,
            "/actions/combat/enchanted_fortress": false,
            "/actions/combat/pirate_cove": false,
        }
    };

    const globalConfigName = "MWITaskManager_globalConfig";
    function saveConfig() {
        GM_setValue(globalConfigName, JSON.stringify(globalConfig));
    }

    const savedConfig = GM_getValue(globalConfigName, null);
    if (savedConfig) {
        let readConfig = JSON.parse(savedConfig);
        globalConfig.isBattleIcon = readConfig.isBattleIcon;
        for (let key in readConfig.dungeonConfig) {
            globalConfig.dungeonConfig[key] = readConfig.dungeonConfig[key];
        }
        if ('isActionIcon' in readConfig) {
            globalConfig.isActionIcon = readConfig.isActionIcon;
        }
    }

    const itemSVG = "/static/media/items_sprite.328d6606.svg";
    const actionSVG = "/static/media/actions_sprite.e6388cbc.svg";
    const monsterSVG = "/static/media/combat_monsters_sprite.75d964d1.svg";

    const taskBattleIndex = 99; //Battle at bottom
    const taskOrderIndex = {
        Milking: 1,
        Foraging: 2,
        Woodcutting: 3,
        Cheesesmithing: 4,
        Crafting: 5,
        Tailoring: 6,
        Cooking: 7,
        Brewing: 8,
        Alchemy: 9,
        Enhancing: 10,
        Defeat: taskBattleIndex, //Battle at bottom
    };
    const taskOrderIndex_CN = {
        挤奶: 1,
        采摘: 2,
        伐木: 3,
        奶酪锻造: 4,
        制作: 5,
        缝纫: 6,
        烹饪: 7,
        冲泡: 8,
        炼金: 9,
        强化: 10,
        击败: taskBattleIndex, //Battle at bottom
    };

    const allMonster = {
        "/monsters/abyssal_imp": {
            "en": "Abyssal Imp",
            "cn": "深渊小鬼",
            "zone": "/actions/combat/infernal_abyss",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 11
        },
        "/monsters/acrobat": {
            "en": "Acrobat",
            "cn": "杂技师",
            "zone": "",
            "dungeon": [
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": -1
        },
        "/monsters/alligator": {
            "en": "Sherlock",
            "cn": "夏洛克",
            "zone": "/actions/combat/swamp_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 2
        },
        "/monsters/anchor_shark": {
            "en": "Anchor Shark",
            "cn": "持锚鲨",
            "zone": "",
            "dungeon": [
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": -1
        },
        "/monsters/aquahorse": {
            "en": "Aquahorse",
            "cn": "水马",
            "zone": "/actions/combat/aqua_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 3
        },
        "/monsters/black_bear": {
            "en": "Black Bear",
            "cn": "黑熊",
            "zone": "/actions/combat/bear_with_it",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 8
        },
        "/monsters/brine_marksman": {
            "en": "Brine Marksman",
            "cn": "海盐射手",
            "zone": "",
            "dungeon": [
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": -1
        },
        "/monsters/butterjerry": {
            "en": "Butterjerry",
            "cn": "蝶鼠",
            "zone": "",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": -1
        },
        "/monsters/captain_fishhook": {
            "en": "Captain Fishhook",
            "cn": "鱼钩船长",
            "zone": "",
            "dungeon": [
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": -1
        },
        "/monsters/centaur_archer": {
            "en": "Centaur Archer",
            "cn": "半人马弓箭手",
            "zone": "/actions/combat/jungle_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 4
        },
        "/monsters/chronofrost_sorcerer": {
            "en": "Chronofrost Sorcerer",
            "cn": "霜时巫师",
            "zone": "/actions/combat/sorcerers_tower",
            "sortIndex": 7
        },
        "/monsters/crab": {
            "en": "I Pinch",
            "cn": "螃蟹",
            "zone": "/actions/combat/aqua_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 3
        },
        "/monsters/crystal_colossus": {
            "en": "Crystal Colossus",
            "cn": "水晶巨像",
            "zone": "/actions/combat/golem_cave",
            "sortIndex": 9
        },
        "/monsters/demonic_overlord": {
            "en": "Demonic Overlord",
            "cn": "恶魔霸主",
            "zone": "/actions/combat/infernal_abyss",
            "sortIndex": 11
        },
        "/monsters/deranged_jester": {
            "en": "Deranged Jester",
            "cn": "小丑皇",
            "zone": "",
            "dungeon": [
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": -1
        },
        "/monsters/dodocamel": {
            "en": "Dodocamel",
            "cn": "渡渡驼",
            "zone": "",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": -1
        },
        "/monsters/dusk_revenant": {
            "en": "Dusk Revenant",
            "cn": "黄昏亡灵",
            "zone": "/actions/combat/twilight_zone",
            "sortIndex": 10
        },
        "/monsters/elementalist": {
            "en": "Elementalist",
            "cn": "元素法师",
            "zone": "/actions/combat/sorcerers_tower",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 7
        },
        "/monsters/enchanted_bishop": {
            "en": "Enchanted Bishop",
            "cn": "秘法主教",
            "zone": "",
            "dungeon": [
                "/actions/combat/enchanted_fortress"
            ],
            "sortIndex": -1
        },
        "/monsters/enchanted_king": {
            "en": "Enchanted King",
            "cn": "秘法国王",
            "zone": "",
            "dungeon": [
                "/actions/combat/enchanted_fortress"
            ],
            "sortIndex": -1
        },
        "/monsters/enchanted_knight": {
            "en": "Enchanted Knight",
            "cn": "秘法骑士",
            "zone": "",
            "dungeon": [
                "/actions/combat/enchanted_fortress"
            ],
            "sortIndex": -1
        },
        "/monsters/enchanted_pawn": {
            "en": "Enchanted Pawn",
            "cn": "秘法士兵",
            "zone": "",
            "dungeon": [
                "/actions/combat/enchanted_fortress"
            ],
            "sortIndex": -1
        },
        "/monsters/enchanted_queen": {
            "en": "Enchanted Queen",
            "cn": "秘法王后",
            "zone": "",
            "dungeon": [
                "/actions/combat/enchanted_fortress"
            ],
            "sortIndex": -1
        },
        "/monsters/enchanted_rook": {
            "en": "Enchanted Rook",
            "cn": "秘法堡垒",
            "zone": "",
            "dungeon": [
                "/actions/combat/enchanted_fortress"
            ],
            "sortIndex": -1
        },
        "/monsters/eye": {
            "en": "Eye",
            "cn": "独眼",
            "zone": "/actions/combat/planet_of_the_eyes",
            "dungeon": [
                "/actions/combat/chimerical_den",
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 6
        },
        "/monsters/eyes": {
            "en": "Eyes",
            "cn": "叠眼",
            "zone": "/actions/combat/planet_of_the_eyes",
            "dungeon": [
                "/actions/combat/chimerical_den",
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 6
        },
        "/monsters/flame_sorcerer": {
            "en": "Flame Sorcerer",
            "cn": "火焰巫师",
            "zone": "/actions/combat/sorcerers_tower",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 7
        },
        "/monsters/fly": {
            "en": "Fly",
            "cn": "苍蝇",
            "zone": "/actions/combat/smelly_planet",
            "sortIndex": 1
        },
        "/monsters/frog": {
            "en": "Frogger",
            "cn": "青蛙",
            "zone": "/actions/combat/swamp_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 2
        },
        "/monsters/giant_shoebill": {
            "en": "Giant Shoebill",
            "cn": "鲸头鹳",
            "zone": "/actions/combat/swamp_planet",
            "sortIndex": 2
        },
        "/monsters/gobo_boomy": {
            "en": "Boomy",
            "cn": "轰轰",
            "zone": "/actions/combat/gobo_planet",
            "dungeon": [
                "/actions/combat/chimerical_den",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 5
        },
        "/monsters/gobo_chieftain": {
            "en": "Gobo Chieftain",
            "cn": "哥布林酋长",
            "zone": "/actions/combat/gobo_planet",
            "sortIndex": 5
        },
        "/monsters/gobo_shooty": {
            "en": "Shooty",
            "cn": "咻咻",
            "zone": "/actions/combat/gobo_planet",
            "dungeon": [
                "/actions/combat/chimerical_den",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 5
        },
        "/monsters/gobo_slashy": {
            "en": "Slashy",
            "cn": "砍砍",
            "zone": "/actions/combat/gobo_planet",
            "dungeon": [
                "/actions/combat/chimerical_den",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 5
        },
        "/monsters/gobo_smashy": {
            "en": "Smashy",
            "cn": "锤锤",
            "zone": "/actions/combat/gobo_planet",
            "dungeon": [
                "/actions/combat/chimerical_den",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 5
        },
        "/monsters/gobo_stabby": {
            "en": "Stabby",
            "cn": "刺刺",
            "zone": "/actions/combat/gobo_planet",
            "dungeon": [
                "/actions/combat/chimerical_den",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 5
        },
        "/monsters/granite_golem": {
            "en": "Granite Golem",
            "cn": "花岗魔像",
            "zone": "/actions/combat/golem_cave",
            "dungeon": [
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 9
        },
        "/monsters/griffin": {
            "en": "Griffin",
            "cn": "狮鹫",
            "zone": "",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": -1
        },
        "/monsters/grizzly_bear": {
            "en": "Grizzly Bear",
            "cn": "棕熊",
            "zone": "/actions/combat/bear_with_it",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 8
        },
        "/monsters/gummy_bear": {
            "en": "Gummy Bear",
            "cn": "软糖熊",
            "zone": "/actions/combat/bear_with_it",
            "dungeon": [
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 8
        },
        "/monsters/ice_sorcerer": {
            "en": "Ice Sorcerer",
            "cn": "冰霜巫师",
            "zone": "/actions/combat/sorcerers_tower",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 7
        },
        "/monsters/infernal_warlock": {
            "en": "Infernal Warlock",
            "cn": "地狱术士",
            "zone": "/actions/combat/infernal_abyss",
            "dungeon": [
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 11
        },
        "/monsters/jackalope": {
            "en": "Jackalope",
            "cn": "鹿角兔",
            "zone": "",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": -1
        },
        "/monsters/juggler": {
            "en": "Juggler",
            "cn": "杂耍者",
            "zone": "",
            "dungeon": [
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": -1
        },
        "/monsters/jungle_sprite": {
            "en": "Jungle Sprite",
            "cn": "丛林精灵",
            "zone": "/actions/combat/jungle_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 4
        },
        "/monsters/luna_empress": {
            "en": "Luna Empress",
            "cn": "月神之蝶",
            "zone": "/actions/combat/jungle_planet",
            "sortIndex": 4
        },
        "/monsters/magician": {
            "en": "Magician",
            "cn": "魔术师",
            "zone": "",
            "dungeon": [
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": -1
        },
        "/monsters/magnetic_golem": {
            "en": "Magnetic Golem",
            "cn": "磁力魔像",
            "zone": "/actions/combat/golem_cave",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 9
        },
        "/monsters/manticore": {
            "en": "Manticore",
            "cn": "狮蝎兽",
            "zone": "",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": -1
        },
        "/monsters/marine_huntress": {
            "en": "Marine Huntress",
            "cn": "海洋猎手",
            "zone": "/actions/combat/aqua_planet",
            "sortIndex": 3
        },
        "/monsters/myconid": {
            "en": "Myconid",
            "cn": "蘑菇人",
            "zone": "/actions/combat/jungle_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 4
        },
        "/monsters/nom_nom": {
            "en": "Nom Nom",
            "cn": "咬咬鱼",
            "zone": "/actions/combat/aqua_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 3
        },
        "/monsters/novice_sorcerer": {
            "en": "Novice Sorcerer",
            "cn": "新手巫师",
            "zone": "/actions/combat/sorcerers_tower",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 7
        },
        "/monsters/panda": {
            "en": "Panda",
            "cn": "熊猫",
            "zone": "/actions/combat/bear_with_it",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 8
        },
        "/monsters/polar_bear": {
            "en": "Polar Bear",
            "cn": "北极熊",
            "zone": "/actions/combat/bear_with_it",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 8
        },
        "/monsters/porcupine": {
            "en": "Porcupine",
            "cn": "豪猪",
            "zone": "/actions/combat/smelly_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 1
        },
        "/monsters/rabid_rabbit": {
            "en": "Rabid Rabbit",
            "cn": "疯魔兔",
            "zone": "",
            "dungeon": [
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": -1
        },
        "/monsters/rat": {
            "en": "Jerry",
            "cn": "杰瑞",
            "zone": "/actions/combat/smelly_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 1
        },
        "/monsters/red_panda": {
            "en": "Red Panda",
            "cn": "小熊猫",
            "zone": "/actions/combat/bear_with_it",
            "sortIndex": 8
        },
        "/monsters/sea_snail": {
            "en": "Gary",
            "cn": "蜗牛",
            "zone": "/actions/combat/aqua_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 3
        },
        "/monsters/skunk": {
            "en": "Skunk",
            "cn": "臭鼬",
            "zone": "/actions/combat/smelly_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 1
        },
        "/monsters/slimy": {
            "en": "Slimy",
            "cn": "史莱姆",
            "zone": "/actions/combat/smelly_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 1
        },
        "/monsters/snake": {
            "en": "Thnake",
            "cn": "蛇",
            "zone": "/actions/combat/swamp_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 2
        },
        "/monsters/soul_hunter": {
            "en": "Soul Hunter",
            "cn": "灵魂猎手",
            "zone": "/actions/combat/infernal_abyss",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 11
        },
        "/monsters/squawker": {
            "en": "Squawker",
            "cn": "鹦鹉",
            "zone": "",
            "dungeon": [
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": -1
        },
        "/monsters/stalactite_golem": {
            "en": "Stalactite Golem",
            "cn": "钟乳石魔像",
            "zone": "/actions/combat/golem_cave",
            "dungeon": [
                "/actions/combat/enchanted_fortress",
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 9
        },
        "/monsters/swampy": {
            "en": "Swampy",
            "cn": "沼泽虫",
            "zone": "/actions/combat/swamp_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 2
        },
        "/monsters/the_kraken": {
            "en": "The Kraken",
            "cn": "克拉肯",
            "zone": "",
            "dungeon": [
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": -1
        },
        "/monsters/the_watcher": {
            "en": "The Watcher",
            "cn": "观察者",
            "zone": "/actions/combat/planet_of_the_eyes",
            "sortIndex": 6
        },
        "/monsters/tidal_conjuror": {
            "en": "Tidal Conjuror",
            "cn": "潮汐召唤师",
            "zone": "",
            "dungeon": [
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": -1
        },
        "/monsters/treant": {
            "en": "Treant",
            "cn": "树人",
            "zone": "/actions/combat/jungle_planet",
            "sortIndex": 4
        },
        "/monsters/turtle": {
            "en": "Turuto",
            "cn": "忍者龟",
            "zone": "/actions/combat/aqua_planet",
            "dungeon": [
                "/actions/combat/chimerical_den"
            ],
            "sortIndex": 3
        },
        "/monsters/vampire": {
            "en": "Vampire",
            "cn": "吸血鬼",
            "zone": "/actions/combat/twilight_zone",
            "dungeon": [
                "/actions/combat/pirate_cove",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 10
        },
        "/monsters/veyes": {
            "en": "Veyes",
            "cn": "复眼",
            "zone": "/actions/combat/planet_of_the_eyes",
            "dungeon": [
                "/actions/combat/chimerical_den",
                "/actions/combat/pirate_cove"
            ],
            "sortIndex": 6
        },
        "/monsters/werewolf": {
            "en": "Werewolf",
            "cn": "狼人",
            "zone": "/actions/combat/twilight_zone",
            "dungeon": [
                "/actions/combat/pirate_cove",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 10
        },
        "/monsters/zombie": {
            "en": "Zombie",
            "cn": "僵尸",
            "zone": "/actions/combat/twilight_zone",
            "dungeon": [
                "/actions/combat/pirate_cove",
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": 10
        },
        "/monsters/zombie_bear": {
            "en": "Zombie Bear",
            "cn": "僵尸熊",
            "zone": "",
            "dungeon": [
                "/actions/combat/sinister_circus"
            ],
            "sortIndex": -1
        }
    };

    const allActions = {
        "/actions/milking/cow": {
            "en": "Cow",
            "cn": "奶牛",
            "target": "/items/milk"
        },
        "/actions/milking/verdant_cow": {
            "en": "Verdant Cow",
            "cn": "翠绿奶牛",
            "target": "/items/verdant_milk"
        },
        "/actions/milking/azure_cow": {
            "en": "Azure Cow",
            "cn": "蔚蓝奶牛",
            "target": "/items/azure_milk"
        },
        "/actions/milking/burble_cow": {
            "en": "Burble Cow",
            "cn": "深紫奶牛",
            "target": "/items/burble_milk"
        },
        "/actions/milking/crimson_cow": {
            "en": "Crimson Cow",
            "cn": "绛红奶牛",
            "target": "/items/crimson_milk"
        },
        "/actions/milking/unicow": {
            "en": "Unicow",
            "cn": "彩虹奶牛",
            "target": "/items/rainbow_milk"
        },
        "/actions/milking/holy_cow": {
            "en": "Holy Cow",
            "cn": "神圣奶牛",
            "target": "/items/holy_milk"
        },
        "/actions/foraging/egg": {
            "en": "Egg",
            "cn": "鸡蛋"
        },
        "/actions/foraging/wheat": {
            "en": "Wheat",
            "cn": "小麦"
        },
        "/actions/foraging/sugar": {
            "en": "Sugar",
            "cn": "糖"
        },
        "/actions/foraging/cotton": {
            "en": "Cotton",
            "cn": "棉花"
        },
        "/actions/foraging/farmland": {
            "en": "Farmland",
            "cn": "翠野农场",
            "multiAction": true
        },
        "/actions/foraging/blueberry": {
            "en": "Blueberry",
            "cn": "蓝莓"
        },
        "/actions/foraging/apple": {
            "en": "Apple",
            "cn": "苹果"
        },
        "/actions/foraging/arabica_coffee_bean": {
            "en": "Arabica Coffee Bean",
            "cn": "低级咖啡豆"
        },
        "/actions/foraging/flax": {
            "en": "Flax",
            "cn": "亚麻"
        },
        "/actions/foraging/shimmering_lake": {
            "en": "Shimmering Lake",
            "cn": "波光湖泊",
            "multiAction": true
        },
        "/actions/foraging/blackberry": {
            "en": "Blackberry",
            "cn": "黑莓"
        },
        "/actions/foraging/orange": {
            "en": "Orange",
            "cn": "橙子"
        },
        "/actions/foraging/robusta_coffee_bean": {
            "en": "Robusta Coffee Bean",
            "cn": "中级咖啡豆"
        },
        "/actions/foraging/misty_forest": {
            "en": "Misty Forest",
            "cn": "迷雾森林",
            "multiAction": true
        },
        "/actions/foraging/strawberry": {
            "en": "Strawberry",
            "cn": "草莓"
        },
        "/actions/foraging/plum": {
            "en": "Plum",
            "cn": "李子"
        },
        "/actions/foraging/liberica_coffee_bean": {
            "en": "Liberica Coffee Bean",
            "cn": "高级咖啡豆"
        },
        "/actions/foraging/bamboo_branch": {
            "en": "Bamboo Branch",
            "cn": "竹子"
        },
        "/actions/foraging/burble_beach": {
            "en": "Burble Beach",
            "cn": "深紫沙滩",
            "multiAction": true
        },
        "/actions/foraging/mooberry": {
            "en": "Mooberry",
            "cn": "哞莓"
        },
        "/actions/foraging/peach": {
            "en": "Peach",
            "cn": "桃子"
        },
        "/actions/foraging/excelsa_coffee_bean": {
            "en": "Excelsa Coffee Bean",
            "cn": "特级咖啡豆"
        },
        "/actions/foraging/cocoon": {
            "en": "Cocoon",
            "cn": "蚕茧"
        },
        "/actions/foraging/silly_cow_valley": {
            "en": "Silly Cow Valley",
            "cn": "傻牛山谷",
            "multiAction": true
        },
        "/actions/foraging/marsberry": {
            "en": "Marsberry",
            "cn": "火星莓"
        },
        "/actions/foraging/dragon_fruit": {
            "en": "Dragon Fruit",
            "cn": "火龙果"
        },
        "/actions/foraging/fieriosa_coffee_bean": {
            "en": "Fieriosa Coffee Bean",
            "cn": "火山咖啡豆"
        },
        "/actions/foraging/olympus_mons": {
            "en": "Olympus Mons",
            "cn": "奥林匹斯山",
            "multiAction": true
        },
        "/actions/foraging/spaceberry": {
            "en": "Spaceberry",
            "cn": "太空莓"
        },
        "/actions/foraging/star_fruit": {
            "en": "Star Fruit",
            "cn": "杨桃"
        },
        "/actions/foraging/spacia_coffee_bean": {
            "en": "Spacia Coffee Bean",
            "cn": "太空咖啡豆"
        },
        "/actions/foraging/radiant_fiber": {
            "en": "Radiant Fiber",
            "cn": "光辉纤维"
        },
        "/actions/foraging/asteroid_belt": {
            "en": "Asteroid Belt",
            "cn": "小行星带",
            "multiAction": true
        },
        "/actions/woodcutting/tree": {
            "en": "Tree",
            "cn": "树",
            "target": "/items/log"
        },
        "/actions/woodcutting/birch_tree": {
            "en": "Birch Tree",
            "cn": "桦树",
            "target": "/items/birch_log"
        },
        "/actions/woodcutting/cedar_tree": {
            "en": "Cedar Tree",
            "cn": "雪松树",
            "target": "/items/cedar_log"
        },
        "/actions/woodcutting/purpleheart_tree": {
            "en": "Purpleheart Tree",
            "cn": "紫心树",
            "target": "/items/purpleheart_log"
        },
        "/actions/woodcutting/ginkgo_tree": {
            "en": "Ginkgo Tree",
            "cn": "银杏树",
            "target": "/items/ginkgo_log"
        },
        "/actions/woodcutting/redwood_tree": {
            "en": "Redwood Tree",
            "cn": "红杉树",
            "target": "/items/redwood_log"
        },
        "/actions/woodcutting/arcane_tree": {
            "en": "Arcane Tree",
            "cn": "奥秘树",
            "target": "/items/arcane_log"
        },
        "/actions/cheesesmithing/cheese": {
            "en": "Cheese",
            "cn": "奶酪"
        },
        "/actions/cheesesmithing/cheese_boots": {
            "en": "Cheese Boots",
            "cn": "奶酪靴"
        },
        "/actions/cheesesmithing/cheese_gauntlets": {
            "en": "Cheese Gauntlets",
            "cn": "奶酪护手"
        },
        "/actions/cheesesmithing/cheese_sword": {
            "en": "Cheese Sword",
            "cn": "奶酪剑"
        },
        "/actions/cheesesmithing/cheese_brush": {
            "en": "Cheese Brush",
            "cn": "奶酪刷子"
        },
        "/actions/cheesesmithing/cheese_shears": {
            "en": "Cheese Shears",
            "cn": "奶酪剪刀"
        },
        "/actions/cheesesmithing/cheese_hatchet": {
            "en": "Cheese Hatchet",
            "cn": "奶酪斧头"
        },
        "/actions/cheesesmithing/cheese_spear": {
            "en": "Cheese Spear",
            "cn": "奶酪长枪"
        },
        "/actions/cheesesmithing/cheese_hammer": {
            "en": "Cheese Hammer",
            "cn": "奶酪锤子"
        },
        "/actions/cheesesmithing/cheese_chisel": {
            "en": "Cheese Chisel",
            "cn": "奶酪凿子"
        },
        "/actions/cheesesmithing/cheese_needle": {
            "en": "Cheese Needle",
            "cn": "奶酪针"
        },
        "/actions/cheesesmithing/cheese_spatula": {
            "en": "Cheese Spatula",
            "cn": "奶酪锅铲"
        },
        "/actions/cheesesmithing/cheese_pot": {
            "en": "Cheese Pot",
            "cn": "奶酪壶"
        },
        "/actions/cheesesmithing/cheese_mace": {
            "en": "Cheese Mace",
            "cn": "奶酪钉头锤"
        },
        "/actions/cheesesmithing/cheese_alembic": {
            "en": "Cheese Alembic",
            "cn": "奶酪蒸馏器"
        },
        "/actions/cheesesmithing/cheese_enhancer": {
            "en": "Cheese Enhancer",
            "cn": "奶酪强化器"
        },
        "/actions/cheesesmithing/cheese_helmet": {
            "en": "Cheese Helmet",
            "cn": "奶酪头盔"
        },
        "/actions/cheesesmithing/cheese_buckler": {
            "en": "Cheese Buckler",
            "cn": "奶酪圆盾"
        },
        "/actions/cheesesmithing/cheese_bulwark": {
            "en": "Cheese Bulwark",
            "cn": "奶酪重盾"
        },
        "/actions/cheesesmithing/cheese_plate_legs": {
            "en": "Cheese Plate Legs",
            "cn": "奶酪腿甲"
        },
        "/actions/cheesesmithing/cheese_plate_body": {
            "en": "Cheese Plate Body",
            "cn": "奶酪胸甲"
        },
        "/actions/cheesesmithing/verdant_cheese": {
            "en": "Verdant Cheese",
            "cn": "翠绿奶酪"
        },
        "/actions/cheesesmithing/verdant_boots": {
            "en": "Verdant Boots",
            "cn": "翠绿靴"
        },
        "/actions/cheesesmithing/verdant_gauntlets": {
            "en": "Verdant Gauntlets",
            "cn": "翠绿护手"
        },
        "/actions/cheesesmithing/verdant_sword": {
            "en": "Verdant Sword",
            "cn": "翠绿剑"
        },
        "/actions/cheesesmithing/verdant_brush": {
            "en": "Verdant Brush",
            "cn": "翠绿刷子"
        },
        "/actions/cheesesmithing/verdant_shears": {
            "en": "Verdant Shears",
            "cn": "翠绿剪刀"
        },
        "/actions/cheesesmithing/verdant_hatchet": {
            "en": "Verdant Hatchet",
            "cn": "翠绿斧头"
        },
        "/actions/cheesesmithing/verdant_spear": {
            "en": "Verdant Spear",
            "cn": "翠绿长枪"
        },
        "/actions/cheesesmithing/verdant_hammer": {
            "en": "Verdant Hammer",
            "cn": "翠绿锤子"
        },
        "/actions/cheesesmithing/verdant_chisel": {
            "en": "Verdant Chisel",
            "cn": "翠绿凿子"
        },
        "/actions/cheesesmithing/verdant_needle": {
            "en": "Verdant Needle",
            "cn": "翠绿针"
        },
        "/actions/cheesesmithing/verdant_spatula": {
            "en": "Verdant Spatula",
            "cn": "翠绿锅铲"
        },
        "/actions/cheesesmithing/verdant_pot": {
            "en": "Verdant Pot",
            "cn": "翠绿壶"
        },
        "/actions/cheesesmithing/verdant_mace": {
            "en": "Verdant Mace",
            "cn": "翠绿钉头锤"
        },
        "/actions/cheesesmithing/snake_fang_dirk": {
            "en": "Snake Fang Dirk",
            "cn": "蛇牙短剑"
        },
        "/actions/cheesesmithing/verdant_alembic": {
            "en": "Verdant Alembic",
            "cn": "翠绿蒸馏器"
        },
        "/actions/cheesesmithing/verdant_enhancer": {
            "en": "Verdant Enhancer",
            "cn": "翠绿强化器"
        },
        "/actions/cheesesmithing/verdant_helmet": {
            "en": "Verdant Helmet",
            "cn": "翠绿头盔"
        },
        "/actions/cheesesmithing/verdant_buckler": {
            "en": "Verdant Buckler",
            "cn": "翠绿圆盾"
        },
        "/actions/cheesesmithing/verdant_bulwark": {
            "en": "Verdant Bulwark",
            "cn": "翠绿重盾"
        },
        "/actions/cheesesmithing/verdant_plate_legs": {
            "en": "Verdant Plate Legs",
            "cn": "翠绿腿甲"
        },
        "/actions/cheesesmithing/verdant_plate_body": {
            "en": "Verdant Plate Body",
            "cn": "翠绿胸甲"
        },
        "/actions/cheesesmithing/azure_cheese": {
            "en": "Azure Cheese",
            "cn": "蔚蓝奶酪"
        },
        "/actions/cheesesmithing/azure_boots": {
            "en": "Azure Boots",
            "cn": "蔚蓝靴"
        },
        "/actions/cheesesmithing/azure_gauntlets": {
            "en": "Azure Gauntlets",
            "cn": "蔚蓝护手"
        },
        "/actions/cheesesmithing/azure_sword": {
            "en": "Azure Sword",
            "cn": "蔚蓝剑"
        },
        "/actions/cheesesmithing/azure_brush": {
            "en": "Azure Brush",
            "cn": "蔚蓝刷子"
        },
        "/actions/cheesesmithing/azure_shears": {
            "en": "Azure Shears",
            "cn": "蔚蓝剪刀"
        },
        "/actions/cheesesmithing/azure_hatchet": {
            "en": "Azure Hatchet",
            "cn": "蔚蓝斧头"
        },
        "/actions/cheesesmithing/azure_spear": {
            "en": "Azure Spear",
            "cn": "蔚蓝长枪"
        },
        "/actions/cheesesmithing/azure_hammer": {
            "en": "Azure Hammer",
            "cn": "蔚蓝锤子"
        },
        "/actions/cheesesmithing/azure_chisel": {
            "en": "Azure Chisel",
            "cn": "蔚蓝凿子"
        },
        "/actions/cheesesmithing/azure_needle": {
            "en": "Azure Needle",
            "cn": "蔚蓝针"
        },
        "/actions/cheesesmithing/azure_spatula": {
            "en": "Azure Spatula",
            "cn": "蔚蓝锅铲"
        },
        "/actions/cheesesmithing/azure_pot": {
            "en": "Azure Pot",
            "cn": "蔚蓝壶"
        },
        "/actions/cheesesmithing/azure_mace": {
            "en": "Azure Mace",
            "cn": "蔚蓝钉头锤"
        },
        "/actions/cheesesmithing/pincer_gloves": {
            "en": "Pincer Gloves",
            "cn": "蟹钳手套"
        },
        "/actions/cheesesmithing/azure_alembic": {
            "en": "Azure Alembic",
            "cn": "蔚蓝蒸馏器"
        },
        "/actions/cheesesmithing/azure_enhancer": {
            "en": "Azure Enhancer",
            "cn": "蔚蓝强化器"
        },
        "/actions/cheesesmithing/azure_helmet": {
            "en": "Azure Helmet",
            "cn": "蔚蓝头盔"
        },
        "/actions/cheesesmithing/azure_buckler": {
            "en": "Azure Buckler",
            "cn": "蔚蓝圆盾"
        },
        "/actions/cheesesmithing/azure_bulwark": {
            "en": "Azure Bulwark",
            "cn": "蔚蓝重盾"
        },
        "/actions/cheesesmithing/azure_plate_legs": {
            "en": "Azure Plate Legs",
            "cn": "蔚蓝腿甲"
        },
        "/actions/cheesesmithing/snail_shell_helmet": {
            "en": "Snail Shell Helmet",
            "cn": "蜗牛壳头盔"
        },
        "/actions/cheesesmithing/azure_plate_body": {
            "en": "Azure Plate Body",
            "cn": "蔚蓝胸甲"
        },
        "/actions/cheesesmithing/turtle_shell_legs": {
            "en": "Turtle Shell Legs",
            "cn": "龟壳腿甲"
        },
        "/actions/cheesesmithing/turtle_shell_body": {
            "en": "Turtle Shell Body",
            "cn": "龟壳胸甲"
        },
        "/actions/cheesesmithing/burble_cheese": {
            "en": "Burble Cheese",
            "cn": "深紫奶酪"
        },
        "/actions/cheesesmithing/burble_boots": {
            "en": "Burble Boots",
            "cn": "深紫靴"
        },
        "/actions/cheesesmithing/burble_gauntlets": {
            "en": "Burble Gauntlets",
            "cn": "深紫护手"
        },
        "/actions/cheesesmithing/burble_sword": {
            "en": "Burble Sword",
            "cn": "深紫剑"
        },
        "/actions/cheesesmithing/burble_brush": {
            "en": "Burble Brush",
            "cn": "深紫刷子"
        },
        "/actions/cheesesmithing/burble_shears": {
            "en": "Burble Shears",
            "cn": "深紫剪刀"
        },
        "/actions/cheesesmithing/burble_hatchet": {
            "en": "Burble Hatchet",
            "cn": "深紫斧头"
        },
        "/actions/cheesesmithing/burble_spear": {
            "en": "Burble Spear",
            "cn": "深紫长枪"
        },
        "/actions/cheesesmithing/burble_hammer": {
            "en": "Burble Hammer",
            "cn": "深紫锤子"
        },
        "/actions/cheesesmithing/burble_chisel": {
            "en": "Burble Chisel",
            "cn": "深紫凿子"
        },
        "/actions/cheesesmithing/burble_needle": {
            "en": "Burble Needle",
            "cn": "深紫针"
        },
        "/actions/cheesesmithing/burble_spatula": {
            "en": "Burble Spatula",
            "cn": "深紫锅铲"
        },
        "/actions/cheesesmithing/burble_pot": {
            "en": "Burble Pot",
            "cn": "深紫壶"
        },
        "/actions/cheesesmithing/burble_mace": {
            "en": "Burble Mace",
            "cn": "深紫钉头锤"
        },
        "/actions/cheesesmithing/burble_alembic": {
            "en": "Burble Alembic",
            "cn": "深紫蒸馏器"
        },
        "/actions/cheesesmithing/burble_enhancer": {
            "en": "Burble Enhancer",
            "cn": "深紫强化器"
        },
        "/actions/cheesesmithing/burble_helmet": {
            "en": "Burble Helmet",
            "cn": "深紫头盔"
        },
        "/actions/cheesesmithing/burble_buckler": {
            "en": "Burble Buckler",
            "cn": "深紫圆盾"
        },
        "/actions/cheesesmithing/burble_bulwark": {
            "en": "Burble Bulwark",
            "cn": "深紫重盾"
        },
        "/actions/cheesesmithing/burble_plate_legs": {
            "en": "Burble Plate Legs",
            "cn": "深紫腿甲"
        },
        "/actions/cheesesmithing/burble_plate_body": {
            "en": "Burble Plate Body",
            "cn": "深紫胸甲"
        },
        "/actions/cheesesmithing/crimson_cheese": {
            "en": "Crimson Cheese",
            "cn": "绛红奶酪"
        },
        "/actions/cheesesmithing/crimson_boots": {
            "en": "Crimson Boots",
            "cn": "绛红靴"
        },
        "/actions/cheesesmithing/crimson_gauntlets": {
            "en": "Crimson Gauntlets",
            "cn": "绛红护手"
        },
        "/actions/cheesesmithing/crimson_sword": {
            "en": "Crimson Sword",
            "cn": "绛红剑"
        },
        "/actions/cheesesmithing/crimson_brush": {
            "en": "Crimson Brush",
            "cn": "绛红刷子"
        },
        "/actions/cheesesmithing/crimson_shears": {
            "en": "Crimson Shears",
            "cn": "绛红剪刀"
        },
        "/actions/cheesesmithing/crimson_hatchet": {
            "en": "Crimson Hatchet",
            "cn": "绛红斧头"
        },
        "/actions/cheesesmithing/crimson_spear": {
            "en": "Crimson Spear",
            "cn": "绛红长枪"
        },
        "/actions/cheesesmithing/crimson_hammer": {
            "en": "Crimson Hammer",
            "cn": "绛红锤子"
        },
        "/actions/cheesesmithing/crimson_chisel": {
            "en": "Crimson Chisel",
            "cn": "绛红凿子"
        },
        "/actions/cheesesmithing/crimson_needle": {
            "en": "Crimson Needle",
            "cn": "绛红针"
        },
        "/actions/cheesesmithing/crimson_spatula": {
            "en": "Crimson Spatula",
            "cn": "绛红锅铲"
        },
        "/actions/cheesesmithing/crimson_pot": {
            "en": "Crimson Pot",
            "cn": "绛红壶"
        },
        "/actions/cheesesmithing/crimson_mace": {
            "en": "Crimson Mace",
            "cn": "绛红钉头锤"
        },
        "/actions/cheesesmithing/crimson_alembic": {
            "en": "Crimson Alembic",
            "cn": "绛红蒸馏器"
        },
        "/actions/cheesesmithing/crimson_enhancer": {
            "en": "Crimson Enhancer",
            "cn": "绛红强化器"
        },
        "/actions/cheesesmithing/crimson_helmet": {
            "en": "Crimson Helmet",
            "cn": "绛红头盔"
        },
        "/actions/cheesesmithing/crimson_buckler": {
            "en": "Crimson Buckler",
            "cn": "绛红圆盾"
        },
        "/actions/cheesesmithing/crimson_bulwark": {
            "en": "Crimson Bulwark",
            "cn": "绛红重盾"
        },
        "/actions/cheesesmithing/crimson_plate_legs": {
            "en": "Crimson Plate Legs",
            "cn": "绛红腿甲"
        },
        "/actions/cheesesmithing/vision_helmet": {
            "en": "Vision Helmet",
            "cn": "视觉头盔"
        },
        "/actions/cheesesmithing/vision_shield": {
            "en": "Vision Shield",
            "cn": "视觉盾"
        },
        "/actions/cheesesmithing/crimson_plate_body": {
            "en": "Crimson Plate Body",
            "cn": "绛红胸甲"
        },
        "/actions/cheesesmithing/rainbow_cheese": {
            "en": "Rainbow Cheese",
            "cn": "彩虹奶酪"
        },
        "/actions/cheesesmithing/rainbow_boots": {
            "en": "Rainbow Boots",
            "cn": "彩虹靴"
        },
        "/actions/cheesesmithing/black_bear_shoes": {
            "en": "Black Bear Shoes",
            "cn": "黑熊鞋"
        },
        "/actions/cheesesmithing/grizzly_bear_shoes": {
            "en": "Grizzly Bear Shoes",
            "cn": "棕熊鞋"
        },
        "/actions/cheesesmithing/polar_bear_shoes": {
            "en": "Polar Bear Shoes",
            "cn": "北极熊鞋"
        },
        "/actions/cheesesmithing/rainbow_gauntlets": {
            "en": "Rainbow Gauntlets",
            "cn": "彩虹护手"
        },
        "/actions/cheesesmithing/rainbow_sword": {
            "en": "Rainbow Sword",
            "cn": "彩虹剑"
        },
        "/actions/cheesesmithing/panda_gloves": {
            "en": "Panda Gloves",
            "cn": "熊猫手套"
        },
        "/actions/cheesesmithing/rainbow_brush": {
            "en": "Rainbow Brush",
            "cn": "彩虹刷子"
        },
        "/actions/cheesesmithing/rainbow_shears": {
            "en": "Rainbow Shears",
            "cn": "彩虹剪刀"
        },
        "/actions/cheesesmithing/rainbow_hatchet": {
            "en": "Rainbow Hatchet",
            "cn": "彩虹斧头"
        },
        "/actions/cheesesmithing/rainbow_spear": {
            "en": "Rainbow Spear",
            "cn": "彩虹长枪"
        },
        "/actions/cheesesmithing/rainbow_hammer": {
            "en": "Rainbow Hammer",
            "cn": "彩虹锤子"
        },
        "/actions/cheesesmithing/rainbow_chisel": {
            "en": "Rainbow Chisel",
            "cn": "彩虹凿子"
        },
        "/actions/cheesesmithing/rainbow_needle": {
            "en": "Rainbow Needle",
            "cn": "彩虹针"
        },
        "/actions/cheesesmithing/rainbow_spatula": {
            "en": "Rainbow Spatula",
            "cn": "彩虹锅铲"
        },
        "/actions/cheesesmithing/rainbow_pot": {
            "en": "Rainbow Pot",
            "cn": "彩虹壶"
        },
        "/actions/cheesesmithing/rainbow_mace": {
            "en": "Rainbow Mace",
            "cn": "彩虹钉头锤"
        },
        "/actions/cheesesmithing/rainbow_alembic": {
            "en": "Rainbow Alembic",
            "cn": "彩虹蒸馏器"
        },
        "/actions/cheesesmithing/rainbow_enhancer": {
            "en": "Rainbow Enhancer",
            "cn": "彩虹强化器"
        },
        "/actions/cheesesmithing/rainbow_helmet": {
            "en": "Rainbow Helmet",
            "cn": "彩虹头盔"
        },
        "/actions/cheesesmithing/rainbow_buckler": {
            "en": "Rainbow Buckler",
            "cn": "彩虹圆盾"
        },
        "/actions/cheesesmithing/rainbow_bulwark": {
            "en": "Rainbow Bulwark",
            "cn": "彩虹重盾"
        },
        "/actions/cheesesmithing/rainbow_plate_legs": {
            "en": "Rainbow Plate Legs",
            "cn": "彩虹腿甲"
        },
        "/actions/cheesesmithing/rainbow_plate_body": {
            "en": "Rainbow Plate Body",
            "cn": "彩虹胸甲"
        },
        "/actions/cheesesmithing/holy_cheese": {
            "en": "Holy Cheese",
            "cn": "神圣奶酪"
        },
        "/actions/cheesesmithing/holy_boots": {
            "en": "Holy Boots",
            "cn": "神圣靴"
        },
        "/actions/cheesesmithing/holy_gauntlets": {
            "en": "Holy Gauntlets",
            "cn": "神圣护手"
        },
        "/actions/cheesesmithing/holy_sword": {
            "en": "Holy Sword",
            "cn": "神圣剑"
        },
        "/actions/cheesesmithing/holy_brush": {
            "en": "Holy Brush",
            "cn": "神圣刷子"
        },
        "/actions/cheesesmithing/holy_shears": {
            "en": "Holy Shears",
            "cn": "神圣剪刀"
        },
        "/actions/cheesesmithing/holy_hatchet": {
            "en": "Holy Hatchet",
            "cn": "神圣斧头"
        },
        "/actions/cheesesmithing/holy_spear": {
            "en": "Holy Spear",
            "cn": "神圣长枪"
        },
        "/actions/cheesesmithing/holy_hammer": {
            "en": "Holy Hammer",
            "cn": "神圣锤子"
        },
        "/actions/cheesesmithing/holy_chisel": {
            "en": "Holy Chisel",
            "cn": "神圣凿子"
        },
        "/actions/cheesesmithing/holy_needle": {
            "en": "Holy Needle",
            "cn": "神圣针"
        },
        "/actions/cheesesmithing/holy_spatula": {
            "en": "Holy Spatula",
            "cn": "神圣锅铲"
        },
        "/actions/cheesesmithing/holy_pot": {
            "en": "Holy Pot",
            "cn": "神圣壶"
        },
        "/actions/cheesesmithing/holy_mace": {
            "en": "Holy Mace",
            "cn": "神圣钉头锤"
        },
        "/actions/cheesesmithing/magnetic_gloves": {
            "en": "Magnetic Gloves",
            "cn": "磁力手套"
        },
        "/actions/cheesesmithing/stalactite_spear": {
            "en": "Stalactite Spear",
            "cn": "石钟长枪"
        },
        "/actions/cheesesmithing/granite_bludgeon": {
            "en": "Granite Bludgeon",
            "cn": "花岗岩大棒"
        },
        "/actions/cheesesmithing/vampire_fang_dirk": {
            "en": "Vampire Fang Dirk",
            "cn": "吸血鬼短剑"
        },
        "/actions/cheesesmithing/werewolf_slasher": {
            "en": "Werewolf Slasher",
            "cn": "狼人关刀"
        },
        "/actions/cheesesmithing/holy_alembic": {
            "en": "Holy Alembic",
            "cn": "神圣蒸馏器"
        },
        "/actions/cheesesmithing/holy_enhancer": {
            "en": "Holy Enhancer",
            "cn": "神圣强化器"
        },
        "/actions/cheesesmithing/holy_helmet": {
            "en": "Holy Helmet",
            "cn": "神圣头盔"
        },
        "/actions/cheesesmithing/holy_buckler": {
            "en": "Holy Buckler",
            "cn": "神圣圆盾"
        },
        "/actions/cheesesmithing/holy_bulwark": {
            "en": "Holy Bulwark",
            "cn": "神圣重盾"
        },
        "/actions/cheesesmithing/holy_plate_legs": {
            "en": "Holy Plate Legs",
            "cn": "神圣腿甲"
        },
        "/actions/cheesesmithing/holy_plate_body": {
            "en": "Holy Plate Body",
            "cn": "神圣胸甲"
        },
        "/actions/cheesesmithing/celestial_brush": {
            "en": "Celestial Brush",
            "cn": "星空刷子"
        },
        "/actions/cheesesmithing/celestial_shears": {
            "en": "Celestial Shears",
            "cn": "星空剪刀"
        },
        "/actions/cheesesmithing/celestial_hatchet": {
            "en": "Celestial Hatchet",
            "cn": "星空斧头"
        },
        "/actions/cheesesmithing/celestial_hammer": {
            "en": "Celestial Hammer",
            "cn": "星空锤子"
        },
        "/actions/cheesesmithing/celestial_chisel": {
            "en": "Celestial Chisel",
            "cn": "星空凿子"
        },
        "/actions/cheesesmithing/celestial_needle": {
            "en": "Celestial Needle",
            "cn": "星空针"
        },
        "/actions/cheesesmithing/celestial_spatula": {
            "en": "Celestial Spatula",
            "cn": "星空锅铲"
        },
        "/actions/cheesesmithing/celestial_pot": {
            "en": "Celestial Pot",
            "cn": "星空壶"
        },
        "/actions/cheesesmithing/celestial_alembic": {
            "en": "Celestial Alembic",
            "cn": "星空蒸馏器"
        },
        "/actions/cheesesmithing/celestial_enhancer": {
            "en": "Celestial Enhancer",
            "cn": "星空强化器"
        },
        "/actions/cheesesmithing/colossus_plate_body": {
            "en": "Colossus Plate Body",
            "cn": "巨像胸甲"
        },
        "/actions/cheesesmithing/colossus_plate_legs": {
            "en": "Colossus Plate Legs",
            "cn": "巨像腿甲"
        },
        "/actions/cheesesmithing/demonic_plate_body": {
            "en": "Demonic Plate Body",
            "cn": "恶魔胸甲"
        },
        "/actions/cheesesmithing/demonic_plate_legs": {
            "en": "Demonic Plate Legs",
            "cn": "恶魔腿甲"
        },
        "/actions/cheesesmithing/spiked_bulwark": {
            "en": "Spiked Bulwark",
            "cn": "尖刺重盾"
        },
        "/actions/cheesesmithing/dodocamel_gauntlets": {
            "en": "Dodocamel Gauntlets",
            "cn": "渡渡驼护手"
        },
        "/actions/cheesesmithing/corsair_helmet": {
            "en": "Corsair Helmet",
            "cn": "掠夺者头盔"
        },
        "/actions/cheesesmithing/knights_aegis": {
            "en": "Knights Aegis",
            "cn": "骑士盾"
        },
        "/actions/cheesesmithing/anchorbound_plate_legs": {
            "en": "Anchorbound Plate Legs",
            "cn": "锚定腿甲"
        },
        "/actions/cheesesmithing/maelstrom_plate_legs": {
            "en": "Maelstrom Plate Legs",
            "cn": "怒涛腿甲"
        },
        "/actions/cheesesmithing/griffin_bulwark": {
            "en": "Griffin Bulwark",
            "cn": "狮鹫重盾"
        },
        "/actions/cheesesmithing/furious_spear": {
            "en": "Furious Spear",
            "cn": "狂怒长枪"
        },
        "/actions/cheesesmithing/chaotic_flail": {
            "en": "Chaotic Flail",
            "cn": "混沌连枷"
        },
        "/actions/cheesesmithing/regal_sword": {
            "en": "Regal Sword",
            "cn": "君王之剑"
        },
        "/actions/cheesesmithing/anchorbound_plate_body": {
            "en": "Anchorbound Plate Body",
            "cn": "锚定胸甲"
        },
        "/actions/cheesesmithing/maelstrom_plate_body": {
            "en": "Maelstrom Plate Body",
            "cn": "怒涛胸甲"
        },
        "/actions/cheesesmithing/dodocamel_gauntlets_refined": {
            "en": "Dodocamel Gauntlets (R)",
            "cn": "渡渡驼护手（精）"
        },
        "/actions/cheesesmithing/corsair_helmet_refined": {
            "en": "Corsair Helmet (R)",
            "cn": "掠夺者头盔（精）"
        },
        "/actions/cheesesmithing/knights_aegis_refined": {
            "en": "Knights Aegis (R)",
            "cn": "骑士盾（精）"
        },
        "/actions/cheesesmithing/anchorbound_plate_legs_refined": {
            "en": "Anchorbound Plate Legs (R)",
            "cn": "锚定腿甲（精）"
        },
        "/actions/cheesesmithing/maelstrom_plate_legs_refined": {
            "en": "Maelstrom Plate Legs (R)",
            "cn": "怒涛腿甲（精）"
        },
        "/actions/cheesesmithing/griffin_bulwark_refined": {
            "en": "Griffin Bulwark (R)",
            "cn": "狮鹫重盾（精）"
        },
        "/actions/cheesesmithing/furious_spear_refined": {
            "en": "Furious Spear (R)",
            "cn": "狂怒长枪（精）"
        },
        "/actions/cheesesmithing/chaotic_flail_refined": {
            "en": "Chaotic Flail (R)",
            "cn": "混沌连枷（精）"
        },
        "/actions/cheesesmithing/regal_sword_refined": {
            "en": "Regal Sword (R)",
            "cn": "君王之剑（精）"
        },
        "/actions/cheesesmithing/anchorbound_plate_body_refined": {
            "en": "Anchorbound Plate Body (R)",
            "cn": "锚定胸甲（精）"
        },
        "/actions/cheesesmithing/maelstrom_plate_body_refined": {
            "en": "Maelstrom Plate Body (R)",
            "cn": "怒涛胸甲（精）"
        },
        "/actions/crafting/lumber": {
            "en": "Lumber",
            "cn": "木板"
        },
        "/actions/crafting/wooden_crossbow": {
            "en": "Wooden Crossbow",
            "cn": "木弩"
        },
        "/actions/crafting/wooden_water_staff": {
            "en": "Wooden Water Staff",
            "cn": "木制水法杖"
        },
        "/actions/crafting/basic_task_badge": {
            "en": "Basic Task Badge",
            "cn": "基础任务徽章"
        },
        "/actions/crafting/advanced_task_badge": {
            "en": "Advanced Task Badge",
            "cn": "高级任务徽章"
        },
        "/actions/crafting/expert_task_badge": {
            "en": "Expert Task Badge",
            "cn": "专家任务徽章"
        },
        "/actions/crafting/wooden_shield": {
            "en": "Wooden Shield",
            "cn": "木盾"
        },
        "/actions/crafting/wooden_nature_staff": {
            "en": "Wooden Nature Staff",
            "cn": "木制自然法杖"
        },
        "/actions/crafting/wooden_bow": {
            "en": "Wooden Bow",
            "cn": "木弓"
        },
        "/actions/crafting/wooden_fire_staff": {
            "en": "Wooden Fire Staff",
            "cn": "木制火法杖"
        },
        "/actions/crafting/birch_lumber": {
            "en": "Birch Lumber",
            "cn": "白桦木板"
        },
        "/actions/crafting/birch_crossbow": {
            "en": "Birch Crossbow",
            "cn": "桦木弩"
        },
        "/actions/crafting/birch_water_staff": {
            "en": "Birch Water Staff",
            "cn": "桦木水法杖"
        },
        "/actions/crafting/crushed_pearl": {
            "en": "Crushed Pearl",
            "cn": "珍珠碎片"
        },
        "/actions/crafting/birch_shield": {
            "en": "Birch Shield",
            "cn": "桦木盾"
        },
        "/actions/crafting/birch_nature_staff": {
            "en": "Birch Nature Staff",
            "cn": "桦木自然法杖"
        },
        "/actions/crafting/birch_bow": {
            "en": "Birch Bow",
            "cn": "桦木弓"
        },
        "/actions/crafting/ring_of_gathering": {
            "en": "Ring Of Gathering",
            "cn": "采集戒指"
        },
        "/actions/crafting/birch_fire_staff": {
            "en": "Birch Fire Staff",
            "cn": "桦木火法杖"
        },
        "/actions/crafting/earrings_of_gathering": {
            "en": "Earrings Of Gathering",
            "cn": "采集耳环"
        },
        "/actions/crafting/cedar_lumber": {
            "en": "Cedar Lumber",
            "cn": "雪松木板"
        },
        "/actions/crafting/cedar_crossbow": {
            "en": "Cedar Crossbow",
            "cn": "雪松弩"
        },
        "/actions/crafting/cedar_water_staff": {
            "en": "Cedar Water Staff",
            "cn": "雪松水法杖"
        },
        "/actions/crafting/basic_milking_charm": {
            "en": "Basic Milking Charm",
            "cn": "基础挤奶护符"
        },
        "/actions/crafting/basic_foraging_charm": {
            "en": "Basic Foraging Charm",
            "cn": "基础采摘护符"
        },
        "/actions/crafting/basic_woodcutting_charm": {
            "en": "Basic Woodcutting Charm",
            "cn": "基础伐木护符"
        },
        "/actions/crafting/basic_cheesesmithing_charm": {
            "en": "Basic Cheesesmithing Charm",
            "cn": "基础奶酪锻造护符"
        },
        "/actions/crafting/basic_crafting_charm": {
            "en": "Basic Crafting Charm",
            "cn": "基础制作护符"
        },
        "/actions/crafting/basic_tailoring_charm": {
            "en": "Basic Tailoring Charm",
            "cn": "基础缝纫护符"
        },
        "/actions/crafting/basic_cooking_charm": {
            "en": "Basic Cooking Charm",
            "cn": "基础烹饪护符"
        },
        "/actions/crafting/basic_brewing_charm": {
            "en": "Basic Brewing Charm",
            "cn": "基础冲泡护符"
        },
        "/actions/crafting/basic_alchemy_charm": {
            "en": "Basic Alchemy Charm",
            "cn": "基础炼金护符"
        },
        "/actions/crafting/basic_enhancing_charm": {
            "en": "Basic Enhancing Charm",
            "cn": "基础强化护符"
        },
        "/actions/crafting/cedar_shield": {
            "en": "Cedar Shield",
            "cn": "雪松盾"
        },
        "/actions/crafting/cedar_nature_staff": {
            "en": "Cedar Nature Staff",
            "cn": "雪松自然法杖"
        },
        "/actions/crafting/cedar_bow": {
            "en": "Cedar Bow",
            "cn": "雪松弓"
        },
        "/actions/crafting/crushed_amber": {
            "en": "Crushed Amber",
            "cn": "琥珀碎片"
        },
        "/actions/crafting/cedar_fire_staff": {
            "en": "Cedar Fire Staff",
            "cn": "雪松火法杖"
        },
        "/actions/crafting/ring_of_essence_find": {
            "en": "Ring Of Essence Find",
            "cn": "精华发现戒指"
        },
        "/actions/crafting/earrings_of_essence_find": {
            "en": "Earrings Of Essence Find",
            "cn": "精华发现耳环"
        },
        "/actions/crafting/necklace_of_efficiency": {
            "en": "Necklace Of Efficiency",
            "cn": "效率项链"
        },
        "/actions/crafting/purpleheart_lumber": {
            "en": "Purpleheart Lumber",
            "cn": "紫心木板"
        },
        "/actions/crafting/purpleheart_crossbow": {
            "en": "Purpleheart Crossbow",
            "cn": "紫心弩"
        },
        "/actions/crafting/purpleheart_water_staff": {
            "en": "Purpleheart Water Staff",
            "cn": "紫心水法杖"
        },
        "/actions/crafting/purpleheart_shield": {
            "en": "Purpleheart Shield",
            "cn": "紫心盾"
        },
        "/actions/crafting/purpleheart_nature_staff": {
            "en": "Purpleheart Nature Staff",
            "cn": "紫心自然法杖"
        },
        "/actions/crafting/purpleheart_bow": {
            "en": "Purpleheart Bow",
            "cn": "紫心弓"
        },
        "/actions/crafting/advanced_milking_charm": {
            "en": "Advanced Milking Charm",
            "cn": "高级挤奶护符"
        },
        "/actions/crafting/advanced_foraging_charm": {
            "en": "Advanced Foraging Charm",
            "cn": "高级采摘护符"
        },
        "/actions/crafting/advanced_woodcutting_charm": {
            "en": "Advanced Woodcutting Charm",
            "cn": "高级伐木护符"
        },
        "/actions/crafting/advanced_cheesesmithing_charm": {
            "en": "Advanced Cheesesmithing Charm",
            "cn": "高级奶酪锻造护符"
        },
        "/actions/crafting/advanced_crafting_charm": {
            "en": "Advanced Crafting Charm",
            "cn": "高级制作护符"
        },
        "/actions/crafting/advanced_tailoring_charm": {
            "en": "Advanced Tailoring Charm",
            "cn": "高级缝纫护符"
        },
        "/actions/crafting/advanced_cooking_charm": {
            "en": "Advanced Cooking Charm",
            "cn": "高级烹饪护符"
        },
        "/actions/crafting/advanced_brewing_charm": {
            "en": "Advanced Brewing Charm",
            "cn": "高级冲泡护符"
        },
        "/actions/crafting/advanced_alchemy_charm": {
            "en": "Advanced Alchemy Charm",
            "cn": "高级炼金护符"
        },
        "/actions/crafting/advanced_enhancing_charm": {
            "en": "Advanced Enhancing Charm",
            "cn": "高级强化护符"
        },
        "/actions/crafting/advanced_stamina_charm": {
            "en": "Advanced Stamina Charm",
            "cn": "高级耐力护符"
        },
        "/actions/crafting/advanced_intelligence_charm": {
            "en": "Advanced Intelligence Charm",
            "cn": "高级智力护符"
        },
        "/actions/crafting/advanced_attack_charm": {
            "en": "Advanced Attack Charm",
            "cn": "高级攻击护符"
        },
        "/actions/crafting/advanced_defense_charm": {
            "en": "Advanced Defense Charm",
            "cn": "高级防御护符"
        },
        "/actions/crafting/advanced_melee_charm": {
            "en": "Advanced Melee Charm",
            "cn": "高级近战护符"
        },
        "/actions/crafting/advanced_ranged_charm": {
            "en": "Advanced Ranged Charm",
            "cn": "高级远程护符"
        },
        "/actions/crafting/advanced_magic_charm": {
            "en": "Advanced Magic Charm",
            "cn": "高级魔法护符"
        },
        "/actions/crafting/crushed_garnet": {
            "en": "Crushed Garnet",
            "cn": "石榴石碎片"
        },
        "/actions/crafting/crushed_jade": {
            "en": "Crushed Jade",
            "cn": "翡翠碎片"
        },
        "/actions/crafting/crushed_amethyst": {
            "en": "Crushed Amethyst",
            "cn": "紫水晶碎片"
        },
        "/actions/crafting/catalyst_of_coinification": {
            "en": "Catalyst Of Coinification",
            "cn": "点金催化剂"
        },
        "/actions/crafting/treant_shield": {
            "en": "Treant Shield",
            "cn": "树人盾"
        },
        "/actions/crafting/purpleheart_fire_staff": {
            "en": "Purpleheart Fire Staff",
            "cn": "紫心火法杖"
        },
        "/actions/crafting/ring_of_regeneration": {
            "en": "Ring Of Regeneration",
            "cn": "恢复戒指"
        },
        "/actions/crafting/earrings_of_regeneration": {
            "en": "Earrings Of Regeneration",
            "cn": "恢复耳环"
        },
        "/actions/crafting/fighter_necklace": {
            "en": "Fighter Necklace",
            "cn": "战士项链"
        },
        "/actions/crafting/ginkgo_lumber": {
            "en": "Ginkgo Lumber",
            "cn": "银杏木板"
        },
        "/actions/crafting/ginkgo_crossbow": {
            "en": "Ginkgo Crossbow",
            "cn": "银杏弩"
        },
        "/actions/crafting/ginkgo_water_staff": {
            "en": "Ginkgo Water Staff",
            "cn": "银杏水法杖"
        },
        "/actions/crafting/ring_of_armor": {
            "en": "Ring Of Armor",
            "cn": "护甲戒指"
        },
        "/actions/crafting/catalyst_of_decomposition": {
            "en": "Catalyst Of Decomposition",
            "cn": "分解催化剂"
        },
        "/actions/crafting/ginkgo_shield": {
            "en": "Ginkgo Shield",
            "cn": "银杏盾"
        },
        "/actions/crafting/earrings_of_armor": {
            "en": "Earrings Of Armor",
            "cn": "护甲耳环"
        },
        "/actions/crafting/ginkgo_nature_staff": {
            "en": "Ginkgo Nature Staff",
            "cn": "银杏自然法杖"
        },
        "/actions/crafting/ranger_necklace": {
            "en": "Ranger Necklace",
            "cn": "射手项链"
        },
        "/actions/crafting/ginkgo_bow": {
            "en": "Ginkgo Bow",
            "cn": "银杏弓"
        },
        "/actions/crafting/ring_of_resistance": {
            "en": "Ring Of Resistance",
            "cn": "抗性戒指"
        },
        "/actions/crafting/crushed_moonstone": {
            "en": "Crushed Moonstone",
            "cn": "月亮石碎片"
        },
        "/actions/crafting/ginkgo_fire_staff": {
            "en": "Ginkgo Fire Staff",
            "cn": "银杏火法杖"
        },
        "/actions/crafting/earrings_of_resistance": {
            "en": "Earrings Of Resistance",
            "cn": "抗性耳环"
        },
        "/actions/crafting/wizard_necklace": {
            "en": "Wizard Necklace",
            "cn": "巫师项链"
        },
        "/actions/crafting/ring_of_rare_find": {
            "en": "Ring Of Rare Find",
            "cn": "稀有发现戒指"
        },
        "/actions/crafting/expert_milking_charm": {
            "en": "Expert Milking Charm",
            "cn": "专家挤奶护符"
        },
        "/actions/crafting/expert_foraging_charm": {
            "en": "Expert Foraging Charm",
            "cn": "专家采摘护符"
        },
        "/actions/crafting/expert_woodcutting_charm": {
            "en": "Expert Woodcutting Charm",
            "cn": "专家伐木护符"
        },
        "/actions/crafting/expert_cheesesmithing_charm": {
            "en": "Expert Cheesesmithing Charm",
            "cn": "专家奶酪锻造护符"
        },
        "/actions/crafting/expert_crafting_charm": {
            "en": "Expert Crafting Charm",
            "cn": "专家制作护符"
        },
        "/actions/crafting/expert_tailoring_charm": {
            "en": "Expert Tailoring Charm",
            "cn": "专家缝纫护符"
        },
        "/actions/crafting/expert_cooking_charm": {
            "en": "Expert Cooking Charm",
            "cn": "专家烹饪护符"
        },
        "/actions/crafting/expert_brewing_charm": {
            "en": "Expert Brewing Charm",
            "cn": "专家冲泡护符"
        },
        "/actions/crafting/expert_alchemy_charm": {
            "en": "Expert Alchemy Charm",
            "cn": "专家炼金护符"
        },
        "/actions/crafting/expert_enhancing_charm": {
            "en": "Expert Enhancing Charm",
            "cn": "专家强化护符"
        },
        "/actions/crafting/expert_stamina_charm": {
            "en": "Expert Stamina Charm",
            "cn": "专家耐力护符"
        },
        "/actions/crafting/expert_intelligence_charm": {
            "en": "Expert Intelligence Charm",
            "cn": "专家智力护符"
        },
        "/actions/crafting/expert_attack_charm": {
            "en": "Expert Attack Charm",
            "cn": "专家攻击护符"
        },
        "/actions/crafting/expert_defense_charm": {
            "en": "Expert Defense Charm",
            "cn": "专家防御护符"
        },
        "/actions/crafting/expert_melee_charm": {
            "en": "Expert Melee Charm",
            "cn": "专家近战护符"
        },
        "/actions/crafting/expert_ranged_charm": {
            "en": "Expert Ranged Charm",
            "cn": "专家远程护符"
        },
        "/actions/crafting/expert_magic_charm": {
            "en": "Expert Magic Charm",
            "cn": "专家魔法护符"
        },
        "/actions/crafting/catalyst_of_transmutation": {
            "en": "Catalyst Of Transmutation",
            "cn": "转化催化剂"
        },
        "/actions/crafting/earrings_of_rare_find": {
            "en": "Earrings Of Rare Find",
            "cn": "稀有发现耳环"
        },
        "/actions/crafting/necklace_of_wisdom": {
            "en": "Necklace Of Wisdom",
            "cn": "经验项链"
        },
        "/actions/crafting/redwood_lumber": {
            "en": "Redwood Lumber",
            "cn": "红杉木板"
        },
        "/actions/crafting/redwood_crossbow": {
            "en": "Redwood Crossbow",
            "cn": "红杉弩"
        },
        "/actions/crafting/redwood_water_staff": {
            "en": "Redwood Water Staff",
            "cn": "红杉水法杖"
        },
        "/actions/crafting/redwood_shield": {
            "en": "Redwood Shield",
            "cn": "红杉盾"
        },
        "/actions/crafting/redwood_nature_staff": {
            "en": "Redwood Nature Staff",
            "cn": "红杉自然法杖"
        },
        "/actions/crafting/redwood_bow": {
            "en": "Redwood Bow",
            "cn": "红杉弓"
        },
        "/actions/crafting/crushed_sunstone": {
            "en": "Crushed Sunstone",
            "cn": "太阳石碎片"
        },
        "/actions/crafting/chimerical_entry_key": {
            "en": "Chimerical Entry Key",
            "cn": "奇幻钥匙"
        },
        "/actions/crafting/chimerical_chest_key": {
            "en": "Chimerical Chest Key",
            "cn": "奇幻宝箱钥匙"
        },
        "/actions/crafting/eye_watch": {
            "en": "Eye Watch",
            "cn": "掌上监工"
        },
        "/actions/crafting/watchful_relic": {
            "en": "Watchful Relic",
            "cn": "警戒遗物"
        },
        "/actions/crafting/redwood_fire_staff": {
            "en": "Redwood Fire Staff",
            "cn": "红杉火法杖"
        },
        "/actions/crafting/ring_of_critical_strike": {
            "en": "Ring Of Critical Strike",
            "cn": "暴击戒指"
        },
        "/actions/crafting/mirror_of_protection": {
            "en": "Mirror Of Protection",
            "cn": "保护之镜"
        },
        "/actions/crafting/earrings_of_critical_strike": {
            "en": "Earrings Of Critical Strike",
            "cn": "暴击耳环"
        },
        "/actions/crafting/necklace_of_speed": {
            "en": "Necklace Of Speed",
            "cn": "速度项链"
        },
        "/actions/crafting/arcane_lumber": {
            "en": "Arcane Lumber",
            "cn": "神秘木板"
        },
        "/actions/crafting/arcane_crossbow": {
            "en": "Arcane Crossbow",
            "cn": "神秘弩"
        },
        "/actions/crafting/arcane_water_staff": {
            "en": "Arcane Water Staff",
            "cn": "神秘水法杖"
        },
        "/actions/crafting/master_milking_charm": {
            "en": "Master Milking Charm",
            "cn": "大师挤奶护符"
        },
        "/actions/crafting/master_foraging_charm": {
            "en": "Master Foraging Charm",
            "cn": "大师采摘护符"
        },
        "/actions/crafting/master_woodcutting_charm": {
            "en": "Master Woodcutting Charm",
            "cn": "大师伐木护符"
        },
        "/actions/crafting/master_cheesesmithing_charm": {
            "en": "Master Cheesesmithing Charm",
            "cn": "大师奶酪锻造护符"
        },
        "/actions/crafting/master_crafting_charm": {
            "en": "Master Crafting Charm",
            "cn": "大师制作护符"
        },
        "/actions/crafting/master_tailoring_charm": {
            "en": "Master Tailoring Charm",
            "cn": "大师缝纫护符"
        },
        "/actions/crafting/master_cooking_charm": {
            "en": "Master Cooking Charm",
            "cn": "大师烹饪护符"
        },
        "/actions/crafting/master_brewing_charm": {
            "en": "Master Brewing Charm",
            "cn": "大师冲泡护符"
        },
        "/actions/crafting/master_alchemy_charm": {
            "en": "Master Alchemy Charm",
            "cn": "大师炼金护符"
        },
        "/actions/crafting/master_enhancing_charm": {
            "en": "Master Enhancing Charm",
            "cn": "大师强化护符"
        },
        "/actions/crafting/master_stamina_charm": {
            "en": "Master Stamina Charm",
            "cn": "大师耐力护符"
        },
        "/actions/crafting/master_intelligence_charm": {
            "en": "Master Intelligence Charm",
            "cn": "大师智力护符"
        },
        "/actions/crafting/master_attack_charm": {
            "en": "Master Attack Charm",
            "cn": "大师攻击护符"
        },
        "/actions/crafting/master_defense_charm": {
            "en": "Master Defense Charm",
            "cn": "大师防御护符"
        },
        "/actions/crafting/master_melee_charm": {
            "en": "Master Melee Charm",
            "cn": "大师近战护符"
        },
        "/actions/crafting/master_ranged_charm": {
            "en": "Master Ranged Charm",
            "cn": "大师远程护符"
        },
        "/actions/crafting/master_magic_charm": {
            "en": "Master Magic Charm",
            "cn": "大师魔法护符"
        },
        "/actions/crafting/sinister_entry_key": {
            "en": "Sinister Entry Key",
            "cn": "阴森钥匙"
        },
        "/actions/crafting/sinister_chest_key": {
            "en": "Sinister Chest Key",
            "cn": "阴森宝箱钥匙"
        },
        "/actions/crafting/arcane_shield": {
            "en": "Arcane Shield",
            "cn": "神秘盾"
        },
        "/actions/crafting/arcane_nature_staff": {
            "en": "Arcane Nature Staff",
            "cn": "神秘自然法杖"
        },
        "/actions/crafting/manticore_shield": {
            "en": "Manticore Shield",
            "cn": "蝎狮盾"
        },
        "/actions/crafting/arcane_bow": {
            "en": "Arcane Bow",
            "cn": "神秘弓"
        },
        "/actions/crafting/enchanted_entry_key": {
            "en": "Enchanted Entry Key",
            "cn": "秘法钥匙"
        },
        "/actions/crafting/enchanted_chest_key": {
            "en": "Enchanted Chest Key",
            "cn": "秘法宝箱钥匙"
        },
        "/actions/crafting/arcane_fire_staff": {
            "en": "Arcane Fire Staff",
            "cn": "神秘火法杖"
        },
        "/actions/crafting/vampiric_bow": {
            "en": "Vampiric Bow",
            "cn": "吸血弓"
        },
        "/actions/crafting/soul_hunter_crossbow": {
            "en": "Soul Hunter Crossbow",
            "cn": "灵魂猎手弩"
        },
        "/actions/crafting/frost_staff": {
            "en": "Frost Staff",
            "cn": "冰霜法杖"
        },
        "/actions/crafting/infernal_battlestaff": {
            "en": "Infernal Battlestaff",
            "cn": "炼狱法杖"
        },
        "/actions/crafting/jackalope_staff": {
            "en": "Jackalope Staff",
            "cn": "鹿角兔之杖"
        },
        "/actions/crafting/philosophers_ring": {
            "en": "Philosopher's Ring",
            "cn": "贤者戒指"
        },
        "/actions/crafting/crushed_philosophers_stone": {
            "en": "Crushed Philosopher's Stone",
            "cn": "贤者之石碎片"
        },
        "/actions/crafting/pirate_entry_key": {
            "en": "Pirate Entry Key",
            "cn": "海盗钥匙"
        },
        "/actions/crafting/pirate_chest_key": {
            "en": "Pirate Chest Key",
            "cn": "海盗宝箱钥匙"
        },
        "/actions/crafting/philosophers_earrings": {
            "en": "Philosopher's Earrings",
            "cn": "贤者耳环"
        },
        "/actions/crafting/philosophers_necklace": {
            "en": "Philosopher's Necklace",
            "cn": "贤者项链"
        },
        "/actions/crafting/bishops_codex": {
            "en": "Bishop's Codex",
            "cn": "主教法典"
        },
        "/actions/crafting/cursed_bow": {
            "en": "Cursed Bow",
            "cn": "咒怨之弓"
        },
        "/actions/crafting/sundering_crossbow": {
            "en": "Sundering Crossbow",
            "cn": "裂空之弩"
        },
        "/actions/crafting/rippling_trident": {
            "en": "Rippling Trident",
            "cn": "涟漪三叉戟"
        },
        "/actions/crafting/blooming_trident": {
            "en": "Blooming Trident",
            "cn": "绽放三叉戟"
        },
        "/actions/crafting/blazing_trident": {
            "en": "Blazing Trident",
            "cn": "炽焰三叉戟"
        },
        "/actions/crafting/grandmaster_milking_charm": {
            "en": "Grandmaster Milking Charm",
            "cn": "宗师挤奶护符"
        },
        "/actions/crafting/grandmaster_foraging_charm": {
            "en": "Grandmaster Foraging Charm",
            "cn": "宗师采摘护符"
        },
        "/actions/crafting/grandmaster_woodcutting_charm": {
            "en": "Grandmaster Woodcutting Charm",
            "cn": "宗师伐木护符"
        },
        "/actions/crafting/grandmaster_cheesesmithing_charm": {
            "en": "Grandmaster Cheesesmithing Charm",
            "cn": "宗师奶酪锻造护符"
        },
        "/actions/crafting/grandmaster_crafting_charm": {
            "en": "Grandmaster Crafting Charm",
            "cn": "宗师制作护符"
        },
        "/actions/crafting/grandmaster_tailoring_charm": {
            "en": "Grandmaster Tailoring Charm",
            "cn": "宗师缝纫护符"
        },
        "/actions/crafting/grandmaster_cooking_charm": {
            "en": "Grandmaster Cooking Charm",
            "cn": "宗师烹饪护符"
        },
        "/actions/crafting/grandmaster_brewing_charm": {
            "en": "Grandmaster Brewing Charm",
            "cn": "宗师冲泡护符"
        },
        "/actions/crafting/grandmaster_alchemy_charm": {
            "en": "Grandmaster Alchemy Charm",
            "cn": "宗师炼金护符"
        },
        "/actions/crafting/grandmaster_enhancing_charm": {
            "en": "Grandmaster Enhancing Charm",
            "cn": "宗师强化护符"
        },
        "/actions/crafting/grandmaster_stamina_charm": {
            "en": "Grandmaster Stamina Charm",
            "cn": "宗师耐力护符"
        },
        "/actions/crafting/grandmaster_intelligence_charm": {
            "en": "Grandmaster Intelligence Charm",
            "cn": "宗师智力护符"
        },
        "/actions/crafting/grandmaster_attack_charm": {
            "en": "Grandmaster Attack Charm",
            "cn": "宗师攻击护符"
        },
        "/actions/crafting/grandmaster_defense_charm": {
            "en": "Grandmaster Defense Charm",
            "cn": "宗师防御护符"
        },
        "/actions/crafting/grandmaster_melee_charm": {
            "en": "Grandmaster Melee Charm",
            "cn": "宗师近战护符"
        },
        "/actions/crafting/grandmaster_ranged_charm": {
            "en": "Grandmaster Ranged Charm",
            "cn": "宗师远程护符"
        },
        "/actions/crafting/grandmaster_magic_charm": {
            "en": "Grandmaster Magic Charm",
            "cn": "宗师魔法护符"
        },
        "/actions/crafting/philosophers_mirror": {
            "en": "Philosopher's Mirror",
            "cn": "贤者之镜"
        },
        "/actions/crafting/bishops_codex_refined": {
            "en": "Bishop's Codex (R)",
            "cn": "主教法典（精）"
        },
        "/actions/crafting/cursed_bow_refined": {
            "en": "Cursed Bow (R)",
            "cn": "咒怨之弓（精）"
        },
        "/actions/crafting/sundering_crossbow_refined": {
            "en": "Sundering Crossbow (R)",
            "cn": "裂空之弩（精）"
        },
        "/actions/crafting/rippling_trident_refined": {
            "en": "Rippling Trident (R)",
            "cn": "涟漪三叉戟（精）"
        },
        "/actions/crafting/blooming_trident_refined": {
            "en": "Blooming Trident (R)",
            "cn": "绽放三叉戟（精）"
        },
        "/actions/crafting/blazing_trident_refined": {
            "en": "Blazing Trident (R)",
            "cn": "炽焰三叉戟（精）"
        },
        "/actions/tailoring/rough_leather": {
            "en": "Rough Leather",
            "cn": "粗糙皮革"
        },
        "/actions/tailoring/cotton_fabric": {
            "en": "Cotton Fabric",
            "cn": "棉花布料"
        },
        "/actions/tailoring/rough_boots": {
            "en": "Rough Boots",
            "cn": "粗糙靴"
        },
        "/actions/tailoring/cotton_boots": {
            "en": "Cotton Boots",
            "cn": "棉靴"
        },
        "/actions/tailoring/rough_bracers": {
            "en": "Rough Bracers",
            "cn": "粗糙护腕"
        },
        "/actions/tailoring/cotton_gloves": {
            "en": "Cotton Gloves",
            "cn": "棉手套"
        },
        "/actions/tailoring/small_pouch": {
            "en": "Small Pouch",
            "cn": "小袋子"
        },
        "/actions/tailoring/rough_hood": {
            "en": "Rough Hood",
            "cn": "粗糙兜帽"
        },
        "/actions/tailoring/cotton_hat": {
            "en": "Cotton Hat",
            "cn": "棉帽"
        },
        "/actions/tailoring/rough_chaps": {
            "en": "Rough Chaps",
            "cn": "粗糙皮裤"
        },
        "/actions/tailoring/cotton_robe_bottoms": {
            "en": "Cotton Robe Bottoms",
            "cn": "棉袍裙"
        },
        "/actions/tailoring/rough_tunic": {
            "en": "Rough Tunic",
            "cn": "粗糙皮衣"
        },
        "/actions/tailoring/cotton_robe_top": {
            "en": "Cotton Robe Top",
            "cn": "棉袍服"
        },
        "/actions/tailoring/reptile_leather": {
            "en": "Reptile Leather",
            "cn": "爬行动物皮革"
        },
        "/actions/tailoring/linen_fabric": {
            "en": "Linen Fabric",
            "cn": "亚麻布料"
        },
        "/actions/tailoring/reptile_boots": {
            "en": "Reptile Boots",
            "cn": "爬行动物靴"
        },
        "/actions/tailoring/linen_boots": {
            "en": "Linen Boots",
            "cn": "亚麻靴"
        },
        "/actions/tailoring/reptile_bracers": {
            "en": "Reptile Bracers",
            "cn": "爬行动物护腕"
        },
        "/actions/tailoring/linen_gloves": {
            "en": "Linen Gloves",
            "cn": "亚麻手套"
        },
        "/actions/tailoring/reptile_hood": {
            "en": "Reptile Hood",
            "cn": "爬行动物兜帽"
        },
        "/actions/tailoring/linen_hat": {
            "en": "Linen Hat",
            "cn": "亚麻帽"
        },
        "/actions/tailoring/reptile_chaps": {
            "en": "Reptile Chaps",
            "cn": "爬行动物皮裤"
        },
        "/actions/tailoring/linen_robe_bottoms": {
            "en": "Linen Robe Bottoms",
            "cn": "亚麻袍裙"
        },
        "/actions/tailoring/medium_pouch": {
            "en": "Medium Pouch",
            "cn": "中袋子"
        },
        "/actions/tailoring/reptile_tunic": {
            "en": "Reptile Tunic",
            "cn": "爬行动物皮衣"
        },
        "/actions/tailoring/linen_robe_top": {
            "en": "Linen Robe Top",
            "cn": "亚麻袍服"
        },
        "/actions/tailoring/shoebill_shoes": {
            "en": "Shoebill Shoes",
            "cn": "鲸头鹳鞋"
        },
        "/actions/tailoring/gobo_leather": {
            "en": "Gobo Leather",
            "cn": "哥布林皮革"
        },
        "/actions/tailoring/bamboo_fabric": {
            "en": "Bamboo Fabric",
            "cn": "竹子布料"
        },
        "/actions/tailoring/gobo_boots": {
            "en": "Gobo Boots",
            "cn": "哥布林靴"
        },
        "/actions/tailoring/bamboo_boots": {
            "en": "Bamboo Boots",
            "cn": "竹靴"
        },
        "/actions/tailoring/gobo_bracers": {
            "en": "Gobo Bracers",
            "cn": "哥布林护腕"
        },
        "/actions/tailoring/bamboo_gloves": {
            "en": "Bamboo Gloves",
            "cn": "竹手套"
        },
        "/actions/tailoring/gobo_hood": {
            "en": "Gobo Hood",
            "cn": "哥布林兜帽"
        },
        "/actions/tailoring/bamboo_hat": {
            "en": "Bamboo Hat",
            "cn": "竹帽"
        },
        "/actions/tailoring/gobo_chaps": {
            "en": "Gobo Chaps",
            "cn": "哥布林皮裤"
        },
        "/actions/tailoring/bamboo_robe_bottoms": {
            "en": "Bamboo Robe Bottoms",
            "cn": "竹袍裙"
        },
        "/actions/tailoring/large_pouch": {
            "en": "Large Pouch",
            "cn": "大袋子"
        },
        "/actions/tailoring/gobo_tunic": {
            "en": "Gobo Tunic",
            "cn": "哥布林皮衣"
        },
        "/actions/tailoring/bamboo_robe_top": {
            "en": "Bamboo Robe Top",
            "cn": "竹袍服"
        },
        "/actions/tailoring/marine_tunic": {
            "en": "Marine Tunic",
            "cn": "海洋皮衣"
        },
        "/actions/tailoring/marine_chaps": {
            "en": "Marine Chaps",
            "cn": "航海皮裤"
        },
        "/actions/tailoring/icy_robe_top": {
            "en": "Icy Robe Top",
            "cn": "冰霜袍服"
        },
        "/actions/tailoring/icy_robe_bottoms": {
            "en": "Icy Robe Bottoms",
            "cn": "冰霜袍裙"
        },
        "/actions/tailoring/flaming_robe_top": {
            "en": "Flaming Robe Top",
            "cn": "烈焰袍服"
        },
        "/actions/tailoring/flaming_robe_bottoms": {
            "en": "Flaming Robe Bottoms",
            "cn": "烈焰袍裙"
        },
        "/actions/tailoring/beast_leather": {
            "en": "Beast Leather",
            "cn": "野兽皮革"
        },
        "/actions/tailoring/silk_fabric": {
            "en": "Silk Fabric",
            "cn": "丝绸"
        },
        "/actions/tailoring/beast_boots": {
            "en": "Beast Boots",
            "cn": "野兽靴"
        },
        "/actions/tailoring/silk_boots": {
            "en": "Silk Boots",
            "cn": "丝靴"
        },
        "/actions/tailoring/beast_bracers": {
            "en": "Beast Bracers",
            "cn": "野兽护腕"
        },
        "/actions/tailoring/silk_gloves": {
            "en": "Silk Gloves",
            "cn": "丝手套"
        },
        "/actions/tailoring/collectors_boots": {
            "en": "Collectors Boots",
            "cn": "收藏家靴"
        },
        "/actions/tailoring/sighted_bracers": {
            "en": "Sighted Bracers",
            "cn": "瞄准护腕"
        },
        "/actions/tailoring/beast_hood": {
            "en": "Beast Hood",
            "cn": "野兽兜帽"
        },
        "/actions/tailoring/silk_hat": {
            "en": "Silk Hat",
            "cn": "丝帽"
        },
        "/actions/tailoring/beast_chaps": {
            "en": "Beast Chaps",
            "cn": "野兽皮裤"
        },
        "/actions/tailoring/silk_robe_bottoms": {
            "en": "Silk Robe Bottoms",
            "cn": "丝绸袍裙"
        },
        "/actions/tailoring/centaur_boots": {
            "en": "Centaur Boots",
            "cn": "半人马靴"
        },
        "/actions/tailoring/sorcerer_boots": {
            "en": "Sorcerer Boots",
            "cn": "巫师靴"
        },
        "/actions/tailoring/giant_pouch": {
            "en": "Giant Pouch",
            "cn": "巨大袋子"
        },
        "/actions/tailoring/beast_tunic": {
            "en": "Beast Tunic",
            "cn": "野兽皮衣"
        },
        "/actions/tailoring/silk_robe_top": {
            "en": "Silk Robe Top",
            "cn": "丝绸袍服"
        },
        "/actions/tailoring/red_culinary_hat": {
            "en": "Red Culinary Hat",
            "cn": "红色厨师帽"
        },
        "/actions/tailoring/luna_robe_top": {
            "en": "Luna Robe Top",
            "cn": "月神袍服"
        },
        "/actions/tailoring/luna_robe_bottoms": {
            "en": "Luna Robe Bottoms",
            "cn": "月神袍裙"
        },
        "/actions/tailoring/umbral_leather": {
            "en": "Umbral Leather",
            "cn": "暗影皮革"
        },
        "/actions/tailoring/radiant_fabric": {
            "en": "Radiant Fabric",
            "cn": "光辉布料"
        },
        "/actions/tailoring/umbral_boots": {
            "en": "Umbral Boots",
            "cn": "暗影靴"
        },
        "/actions/tailoring/radiant_boots": {
            "en": "Radiant Boots",
            "cn": "光辉靴"
        },
        "/actions/tailoring/umbral_bracers": {
            "en": "Umbral Bracers",
            "cn": "暗影护腕"
        },
        "/actions/tailoring/radiant_gloves": {
            "en": "Radiant Gloves",
            "cn": "光辉手套"
        },
        "/actions/tailoring/enchanted_gloves": {
            "en": "Enchanted Gloves",
            "cn": "附魔手套"
        },
        "/actions/tailoring/fluffy_red_hat": {
            "en": "Fluffy Red Hat",
            "cn": "蓬松红帽子"
        },
        "/actions/tailoring/chrono_gloves": {
            "en": "Chrono Gloves",
            "cn": "时空手套"
        },
        "/actions/tailoring/umbral_hood": {
            "en": "Umbral Hood",
            "cn": "暗影兜帽"
        },
        "/actions/tailoring/radiant_hat": {
            "en": "Radiant Hat",
            "cn": "光辉帽"
        },
        "/actions/tailoring/umbral_chaps": {
            "en": "Umbral Chaps",
            "cn": "暗影皮裤"
        },
        "/actions/tailoring/radiant_robe_bottoms": {
            "en": "Radiant Robe Bottoms",
            "cn": "光辉袍裙"
        },
        "/actions/tailoring/umbral_tunic": {
            "en": "Umbral Tunic",
            "cn": "暗影皮衣"
        },
        "/actions/tailoring/radiant_robe_top": {
            "en": "Radiant Robe Top",
            "cn": "光辉袍服"
        },
        "/actions/tailoring/revenant_chaps": {
            "en": "Revenant Chaps",
            "cn": "亡灵皮裤"
        },
        "/actions/tailoring/griffin_chaps": {
            "en": "Griffin Chaps",
            "cn": "狮鹫皮裤"
        },
        "/actions/tailoring/dairyhands_top": {
            "en": "Dairyhand's Top",
            "cn": "挤奶工上衣"
        },
        "/actions/tailoring/dairyhands_bottoms": {
            "en": "Dairyhand's Bottoms",
            "cn": "挤奶工下装"
        },
        "/actions/tailoring/foragers_top": {
            "en": "Forager's Top",
            "cn": "采摘者上衣"
        },
        "/actions/tailoring/foragers_bottoms": {
            "en": "Forager's Bottoms",
            "cn": "采摘者下装"
        },
        "/actions/tailoring/lumberjacks_top": {
            "en": "Lumberjack's Top",
            "cn": "伐木工上衣"
        },
        "/actions/tailoring/lumberjacks_bottoms": {
            "en": "Lumberjack's Bottoms",
            "cn": "伐木工下装"
        },
        "/actions/tailoring/cheesemakers_top": {
            "en": "Cheesemaker's Top",
            "cn": "奶酪师上衣"
        },
        "/actions/tailoring/cheesemakers_bottoms": {
            "en": "Cheesemaker's Bottoms",
            "cn": "奶酪师下装"
        },
        "/actions/tailoring/crafters_top": {
            "en": "Crafter's Top",
            "cn": "工匠上衣"
        },
        "/actions/tailoring/crafters_bottoms": {
            "en": "Crafter's Bottoms",
            "cn": "工匠下装"
        },
        "/actions/tailoring/tailors_top": {
            "en": "Tailor's Top",
            "cn": "裁缝上衣"
        },
        "/actions/tailoring/tailors_bottoms": {
            "en": "Tailor's Bottoms",
            "cn": "裁缝下装"
        },
        "/actions/tailoring/chefs_top": {
            "en": "Chef's Top",
            "cn": "厨师上衣"
        },
        "/actions/tailoring/chefs_bottoms": {
            "en": "Chef's Bottoms",
            "cn": "厨师下装"
        },
        "/actions/tailoring/brewers_top": {
            "en": "Brewer's Top",
            "cn": "饮品师上衣"
        },
        "/actions/tailoring/brewers_bottoms": {
            "en": "Brewer's Bottoms",
            "cn": "饮品师下装"
        },
        "/actions/tailoring/alchemists_top": {
            "en": "Alchemist's Top",
            "cn": "炼金师上衣"
        },
        "/actions/tailoring/alchemists_bottoms": {
            "en": "Alchemist's Bottoms",
            "cn": "炼金师下装"
        },
        "/actions/tailoring/enhancers_top": {
            "en": "Enhancer's Top",
            "cn": "强化师上衣"
        },
        "/actions/tailoring/enhancers_bottoms": {
            "en": "Enhancer's Bottoms",
            "cn": "强化师下装"
        },
        "/actions/tailoring/revenant_tunic": {
            "en": "Revenant Tunic",
            "cn": "亡灵皮衣"
        },
        "/actions/tailoring/griffin_tunic": {
            "en": "Griffin Tunic",
            "cn": "狮鹫皮衣"
        },
        "/actions/tailoring/gluttonous_pouch": {
            "en": "Gluttonous Pouch",
            "cn": "贪食之袋"
        },
        "/actions/tailoring/guzzling_pouch": {
            "en": "Guzzling Pouch",
            "cn": "暴饮之囊"
        },
        "/actions/tailoring/marksman_bracers": {
            "en": "Marksman Bracers",
            "cn": "神射护腕"
        },
        "/actions/tailoring/acrobatic_hood": {
            "en": "Acrobatic Hood",
            "cn": "杂技师兜帽"
        },
        "/actions/tailoring/magicians_hat": {
            "en": "Magician's Hat",
            "cn": "魔术师帽"
        },
        "/actions/tailoring/kraken_chaps": {
            "en": "Kraken Chaps",
            "cn": "克拉肯皮裤"
        },
        "/actions/tailoring/royal_water_robe_bottoms": {
            "en": "Royal Water Robe Bottoms",
            "cn": "皇家水系袍裙"
        },
        "/actions/tailoring/royal_nature_robe_bottoms": {
            "en": "Royal Nature Robe Bottoms",
            "cn": "皇家自然系袍裙"
        },
        "/actions/tailoring/royal_fire_robe_bottoms": {
            "en": "Royal Fire Robe Bottoms",
            "cn": "皇家火系袍裙"
        },
        "/actions/tailoring/kraken_tunic": {
            "en": "Kraken Tunic",
            "cn": "克拉肯皮衣"
        },
        "/actions/tailoring/royal_water_robe_top": {
            "en": "Royal Water Robe Top",
            "cn": "皇家水系袍服"
        },
        "/actions/tailoring/royal_nature_robe_top": {
            "en": "Royal Nature Robe Top",
            "cn": "皇家自然系袍服"
        },
        "/actions/tailoring/royal_fire_robe_top": {
            "en": "Royal Fire Robe Top",
            "cn": "皇家火系袍服"
        },
        "/actions/tailoring/chimerical_quiver_refined": {
            "en": "Chimerical Quiver (R)",
            "cn": "奇幻箭袋（精）"
        },
        "/actions/tailoring/sinister_cape_refined": {
            "en": "Sinister Cape (R)",
            "cn": "阴森斗篷（精）"
        },
        "/actions/tailoring/enchanted_cloak_refined": {
            "en": "Enchanted Cloak (R)",
            "cn": "秘法披风（精）"
        },
        "/actions/tailoring/marksman_bracers_refined": {
            "en": "Marksman Bracers (R)",
            "cn": "神射护腕（精）"
        },
        "/actions/tailoring/acrobatic_hood_refined": {
            "en": "Acrobatic Hood (R)",
            "cn": "杂技师兜帽（精）"
        },
        "/actions/tailoring/magicians_hat_refined": {
            "en": "Magician's Hat (R)",
            "cn": "魔术师帽（精）"
        },
        "/actions/tailoring/kraken_chaps_refined": {
            "en": "Kraken Chaps (R)",
            "cn": "克拉肯皮裤（精）"
        },
        "/actions/tailoring/royal_water_robe_bottoms_refined": {
            "en": "Royal Water Robe Bottoms (R)",
            "cn": "皇家水系袍裙（精）"
        },
        "/actions/tailoring/royal_nature_robe_bottoms_refined": {
            "en": "Royal Nature Robe Bottoms (R)",
            "cn": "皇家自然系袍裙（精）"
        },
        "/actions/tailoring/royal_fire_robe_bottoms_refined": {
            "en": "Royal Fire Robe Bottoms (R)",
            "cn": "皇家火系袍裙（精）"
        },
        "/actions/tailoring/kraken_tunic_refined": {
            "en": "Kraken Tunic (R)",
            "cn": "克拉肯皮衣（精）"
        },
        "/actions/tailoring/royal_water_robe_top_refined": {
            "en": "Royal Water Robe Top (R)",
            "cn": "皇家水系袍服（精）"
        },
        "/actions/tailoring/royal_nature_robe_top_refined": {
            "en": "Royal Nature Robe Top (R)",
            "cn": "皇家自然系袍服（精）"
        },
        "/actions/tailoring/royal_fire_robe_top_refined": {
            "en": "Royal Fire Robe Top (R)",
            "cn": "皇家火系袍服（精）"
        },
        "/actions/cooking/donut": {
            "en": "Donut",
            "cn": "甜甜圈"
        },
        "/actions/cooking/cupcake": {
            "en": "Cupcake",
            "cn": "纸杯蛋糕"
        },
        "/actions/cooking/gummy": {
            "en": "Gummy",
            "cn": "软糖"
        },
        "/actions/cooking/yogurt": {
            "en": "Yogurt",
            "cn": "酸奶"
        },
        "/actions/cooking/blueberry_donut": {
            "en": "Blueberry Donut",
            "cn": "蓝莓甜甜圈"
        },
        "/actions/cooking/blueberry_cake": {
            "en": "Blueberry Cake",
            "cn": "蓝莓蛋糕"
        },
        "/actions/cooking/apple_gummy": {
            "en": "Apple Gummy",
            "cn": "苹果软糖"
        },
        "/actions/cooking/apple_yogurt": {
            "en": "Apple Yogurt",
            "cn": "苹果酸奶"
        },
        "/actions/cooking/blackberry_donut": {
            "en": "Blackberry Donut",
            "cn": "黑莓甜甜圈"
        },
        "/actions/cooking/blackberry_cake": {
            "en": "Blackberry Cake",
            "cn": "黑莓蛋糕"
        },
        "/actions/cooking/orange_gummy": {
            "en": "Orange Gummy",
            "cn": "橙子软糖"
        },
        "/actions/cooking/orange_yogurt": {
            "en": "Orange Yogurt",
            "cn": "橙子酸奶"
        },
        "/actions/cooking/strawberry_donut": {
            "en": "Strawberry Donut",
            "cn": "草莓甜甜圈"
        },
        "/actions/cooking/strawberry_cake": {
            "en": "Strawberry Cake",
            "cn": "草莓蛋糕"
        },
        "/actions/cooking/plum_gummy": {
            "en": "Plum Gummy",
            "cn": "李子软糖"
        },
        "/actions/cooking/plum_yogurt": {
            "en": "Plum Yogurt",
            "cn": "李子酸奶"
        },
        "/actions/cooking/mooberry_donut": {
            "en": "Mooberry Donut",
            "cn": "哞莓甜甜圈"
        },
        "/actions/cooking/mooberry_cake": {
            "en": "Mooberry Cake",
            "cn": "哞莓蛋糕"
        },
        "/actions/cooking/peach_gummy": {
            "en": "Peach Gummy",
            "cn": "桃子软糖"
        },
        "/actions/cooking/peach_yogurt": {
            "en": "Peach Yogurt",
            "cn": "桃子酸奶"
        },
        "/actions/cooking/marsberry_donut": {
            "en": "Marsberry Donut",
            "cn": "火星莓甜甜圈"
        },
        "/actions/cooking/marsberry_cake": {
            "en": "Marsberry Cake",
            "cn": "火星莓蛋糕"
        },
        "/actions/cooking/dragon_fruit_gummy": {
            "en": "Dragon Fruit Gummy",
            "cn": "火龙果软糖"
        },
        "/actions/cooking/dragon_fruit_yogurt": {
            "en": "Dragon Fruit Yogurt",
            "cn": "火龙果酸奶"
        },
        "/actions/cooking/spaceberry_donut": {
            "en": "Spaceberry Donut",
            "cn": "太空莓甜甜圈"
        },
        "/actions/cooking/spaceberry_cake": {
            "en": "Spaceberry Cake",
            "cn": "太空莓蛋糕"
        },
        "/actions/cooking/star_fruit_gummy": {
            "en": "Star Fruit Gummy",
            "cn": "杨桃软糖"
        },
        "/actions/cooking/star_fruit_yogurt": {
            "en": "Star Fruit Yogurt",
            "cn": "杨桃酸奶"
        },
        "/actions/brewing/milking_tea": {
            "en": "Milking Tea",
            "cn": "挤奶茶"
        },
        "/actions/brewing/stamina_coffee": {
            "en": "Stamina Coffee",
            "cn": "耐力咖啡"
        },
        "/actions/brewing/foraging_tea": {
            "en": "Foraging Tea",
            "cn": "采摘茶"
        },
        "/actions/brewing/intelligence_coffee": {
            "en": "Intelligence Coffee",
            "cn": "智力咖啡"
        },
        "/actions/brewing/gathering_tea": {
            "en": "Gathering Tea",
            "cn": "采集茶"
        },
        "/actions/brewing/woodcutting_tea": {
            "en": "Woodcutting Tea",
            "cn": "伐木茶"
        },
        "/actions/brewing/cooking_tea": {
            "en": "Cooking Tea",
            "cn": "烹饪茶"
        },
        "/actions/brewing/defense_coffee": {
            "en": "Defense Coffee",
            "cn": "防御咖啡"
        },
        "/actions/brewing/brewing_tea": {
            "en": "Brewing Tea",
            "cn": "冲泡茶"
        },
        "/actions/brewing/attack_coffee": {
            "en": "Attack Coffee",
            "cn": "攻击咖啡"
        },
        "/actions/brewing/gourmet_tea": {
            "en": "Gourmet Tea",
            "cn": "美食茶"
        },
        "/actions/brewing/alchemy_tea": {
            "en": "Alchemy Tea",
            "cn": "炼金茶"
        },
        "/actions/brewing/enhancing_tea": {
            "en": "Enhancing Tea",
            "cn": "强化茶"
        },
        "/actions/brewing/cheesesmithing_tea": {
            "en": "Cheesesmithing Tea",
            "cn": "奶酪锻造茶"
        },
        "/actions/brewing/melee_coffee": {
            "en": "Melee Coffee",
            "cn": "近战咖啡"
        },
        "/actions/brewing/crafting_tea": {
            "en": "Crafting Tea",
            "cn": "制作茶"
        },
        "/actions/brewing/ranged_coffee": {
            "en": "Ranged Coffee",
            "cn": "远程咖啡"
        },
        "/actions/brewing/wisdom_tea": {
            "en": "Wisdom Tea",
            "cn": "经验茶"
        },
        "/actions/brewing/wisdom_coffee": {
            "en": "Wisdom Coffee",
            "cn": "经验咖啡"
        },
        "/actions/brewing/tailoring_tea": {
            "en": "Tailoring Tea",
            "cn": "缝纫茶"
        },
        "/actions/brewing/magic_coffee": {
            "en": "Magic Coffee",
            "cn": "魔法咖啡"
        },
        "/actions/brewing/super_milking_tea": {
            "en": "Super Milking Tea",
            "cn": "超级挤奶茶"
        },
        "/actions/brewing/super_stamina_coffee": {
            "en": "Super Stamina Coffee",
            "cn": "超级耐力咖啡"
        },
        "/actions/brewing/super_foraging_tea": {
            "en": "Super Foraging Tea",
            "cn": "超级采摘茶"
        },
        "/actions/brewing/super_intelligence_coffee": {
            "en": "Super Intelligence Coffee",
            "cn": "超级智力咖啡"
        },
        "/actions/brewing/processing_tea": {
            "en": "Processing Tea",
            "cn": "加工茶"
        },
        "/actions/brewing/lucky_coffee": {
            "en": "Lucky Coffee",
            "cn": "幸运咖啡"
        },
        "/actions/brewing/super_woodcutting_tea": {
            "en": "Super Woodcutting Tea",
            "cn": "超级伐木茶"
        },
        "/actions/brewing/super_cooking_tea": {
            "en": "Super Cooking Tea",
            "cn": "超级烹饪茶"
        },
        "/actions/brewing/super_defense_coffee": {
            "en": "Super Defense Coffee",
            "cn": "超级防御咖啡"
        },
        "/actions/brewing/super_brewing_tea": {
            "en": "Super Brewing Tea",
            "cn": "超级冲泡茶"
        },
        "/actions/brewing/ultra_milking_tea": {
            "en": "Ultra Milking Tea",
            "cn": "究极挤奶茶"
        },
        "/actions/brewing/super_attack_coffee": {
            "en": "Super Attack Coffee",
            "cn": "超级攻击咖啡"
        },
        "/actions/brewing/ultra_stamina_coffee": {
            "en": "Ultra Stamina Coffee",
            "cn": "究极耐力咖啡"
        },
        "/actions/brewing/efficiency_tea": {
            "en": "Efficiency Tea",
            "cn": "效率茶"
        },
        "/actions/brewing/swiftness_coffee": {
            "en": "Swiftness Coffee",
            "cn": "迅捷咖啡"
        },
        "/actions/brewing/super_alchemy_tea": {
            "en": "Super Alchemy Tea",
            "cn": "超级炼金茶"
        },
        "/actions/brewing/super_enhancing_tea": {
            "en": "Super Enhancing Tea",
            "cn": "超级强化茶"
        },
        "/actions/brewing/ultra_foraging_tea": {
            "en": "Ultra Foraging Tea",
            "cn": "究极采摘茶"
        },
        "/actions/brewing/ultra_intelligence_coffee": {
            "en": "Ultra Intelligence Coffee",
            "cn": "究极智力咖啡"
        },
        "/actions/brewing/channeling_coffee": {
            "en": "Channeling Coffee",
            "cn": "吟唱咖啡"
        },
        "/actions/brewing/super_cheesesmithing_tea": {
            "en": "Super Cheesesmithing Tea",
            "cn": "超级奶酪锻造茶"
        },
        "/actions/brewing/ultra_woodcutting_tea": {
            "en": "Ultra Woodcutting Tea",
            "cn": "究极伐木茶"
        },
        "/actions/brewing/super_melee_coffee": {
            "en": "Super Melee Coffee",
            "cn": "超级近战咖啡"
        },
        "/actions/brewing/artisan_tea": {
            "en": "Artisan Tea",
            "cn": "工匠茶"
        },
        "/actions/brewing/super_crafting_tea": {
            "en": "Super Crafting Tea",
            "cn": "超级制作茶"
        },
        "/actions/brewing/ultra_cooking_tea": {
            "en": "Ultra Cooking Tea",
            "cn": "究极烹饪茶"
        },
        "/actions/brewing/super_ranged_coffee": {
            "en": "Super Ranged Coffee",
            "cn": "超级远程咖啡"
        },
        "/actions/brewing/ultra_defense_coffee": {
            "en": "Ultra Defense Coffee",
            "cn": "究极防御咖啡"
        },
        "/actions/brewing/catalytic_tea": {
            "en": "Catalytic Tea",
            "cn": "催化茶"
        },
        "/actions/brewing/critical_coffee": {
            "en": "Critical Coffee",
            "cn": "暴击咖啡"
        },
        "/actions/brewing/super_tailoring_tea": {
            "en": "Super Tailoring Tea",
            "cn": "超级缝纫茶"
        },
        "/actions/brewing/ultra_brewing_tea": {
            "en": "Ultra Brewing Tea",
            "cn": "究极冲泡茶"
        },
        "/actions/brewing/super_magic_coffee": {
            "en": "Super Magic Coffee",
            "cn": "超级魔法咖啡"
        },
        "/actions/brewing/ultra_attack_coffee": {
            "en": "Ultra Attack Coffee",
            "cn": "究极攻击咖啡"
        },
        "/actions/brewing/blessed_tea": {
            "en": "Blessed Tea",
            "cn": "福气茶"
        },
        "/actions/brewing/ultra_alchemy_tea": {
            "en": "Ultra Alchemy Tea",
            "cn": "究极炼金茶"
        },
        "/actions/brewing/ultra_enhancing_tea": {
            "en": "Ultra Enhancing Tea",
            "cn": "究极强化茶"
        },
        "/actions/brewing/ultra_cheesesmithing_tea": {
            "en": "Ultra Cheesesmithing Tea",
            "cn": "究极奶酪锻造茶"
        },
        "/actions/brewing/ultra_melee_coffee": {
            "en": "Ultra Melee Coffee",
            "cn": "究极近战咖啡"
        },
        "/actions/brewing/ultra_crafting_tea": {
            "en": "Ultra Crafting Tea",
            "cn": "究极制作茶"
        },
        "/actions/brewing/ultra_ranged_coffee": {
            "en": "Ultra Ranged Coffee",
            "cn": "究极远程咖啡"
        },
        "/actions/brewing/ultra_tailoring_tea": {
            "en": "Ultra Tailoring Tea",
            "cn": "究极缝纫茶"
        },
        "/actions/brewing/ultra_magic_coffee": {
            "en": "Ultra Magic Coffee",
            "cn": "究极魔法咖啡"
        },
        "/actions/alchemy/coinify": {
            "en": "Coinify",
            "cn": "点金"
        },
        "/actions/alchemy/decompose": {
            "en": "Decompose",
            "cn": "分解"
        },
        "/actions/alchemy/transmute": {
            "en": "Transmute",
            "cn": "转化"
        },
        "/actions/enhancing/enhance": {
            "en": "Enhance",
            "cn": "强化"
        }
    };

    function getTaskDetailFromTaskName(fullTaskName) {
        var taskType = -1;
        var taskName = "";

        if (/^(.+) - (.+)$/.test(fullTaskName)) {
            let res = /^(.+) - (.+)$/.exec(fullTaskName);
            if (res[1] in taskOrderIndex) {
                taskType = taskOrderIndex[res[1]];
            }
            else if (res[1] in taskOrderIndex_CN) {
                taskType = taskOrderIndex_CN[res[1]];
            }
            taskName = res[2];
        }
        if (taskType == -1) console.log("Task Parse error", fullTaskName);

        return { taskType, taskName };
    }

    function getHridFromAcionName(name) {
        for (let key in allActions) {
            if (allActions[key].en === name || allActions[key].cn === name) {
                var actionHrid = key;
                if (allActions[key].target != null) {
                    actionHrid = allActions[key].target;
                }
                var isAction = false;
                if (allActions[key].multiAction == true) {
                    isAction = true;
                }
                return {actionHrid, isAction};
            }
        }
        console.log("Action not found", name);
        return {actionHrid: null, isAction: false};
    }

    function getHridFromMonsterName(name) {
        for (let key in allMonster) {
            if (allMonster[key].en === name || allMonster[key].cn === name) {
                return key;
            }
        }
        console.log("Monster not found", name);
        return null;
    }
    function getMapIndexFromMonsterName(name) {
        const key = getHridFromMonsterName(name);
        if (!key) {
            return -1;
        }
        return allMonster[key].sortIndex;
    }

    function getTaskDetailFromElement(ele) {
        const div = ele.querySelector("div.RandomTask_name__1hl1b");

        const translatedfrom = div.getAttribute("script_translatedfrom"); //adapt old zhCN Script
        if (translatedfrom) {
            return getTaskDetailFromTaskName(translatedfrom);
        }

        const fullTaskName = Array.from(div.childNodes).find(node => node.nodeType === Node.TEXT_NODE).textContent.trim();
        return getTaskDetailFromTaskName(fullTaskName);
    }

    function compareFn(a, b) {
        var { taskType: a_TypeIndex, taskName: a_taskName } = getTaskDetailFromElement(a);

        var { taskType: b_TypeIndex, taskName: b_TaskName } = getTaskDetailFromElement(b);

        if (a_TypeIndex === taskBattleIndex && b_TypeIndex === taskBattleIndex) {
            var a_MapIndex = getMapIndexFromMonsterName(a_taskName);
            var b_MapIndex = getMapIndexFromMonsterName(b_TaskName);

            if (a_MapIndex != b_MapIndex) {
                return (a_MapIndex > b_MapIndex ? 1 : -1);
            }
        }

        if (a_TypeIndex == b_TypeIndex) {
            return a_taskName == b_TaskName ? 0
            : (a_taskName > b_TaskName ? 1 : -1);
        }

        return a_TypeIndex > b_TypeIndex ? 1 : -1;
    }

    function adaptSVG(svg, objSVG, target) {
        svg.setAttribute('target', target);
        if (typeof objSVG == 'string' && objSVG.endsWith(".svg")) {
            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute("href", objSVG + '#' + target);
            svg.appendChild(use);
        } else {
            const targetSymbolElement = objSVG.querySelector(`symbol[id="${target}"]`);
            if (targetSymbolElement) {
                const children = targetSymbolElement.childNodes;
                for (let i = 0; i < children.length; i++) {
                    svg.appendChild(children[i].cloneNode(true));
                }
                svg.setAttribute('viewBox', targetSymbolElement.getAttribute('viewBox'));
                svg.setAttribute('fill', 'none');
            }
        }
    }

    function addActionIconToTask(div) {
        var { taskType, taskName } = getTaskDetailFromElement(div);

        if (taskType == taskBattleIndex) {
            return;
        }

        var { actionHrid, isAction } = getHridFromAcionName(taskName);
        if (!actionHrid) {
            return;
        }

        var offset = 50; // best
        //         const isShowDungeon = Object.values(globalConfig.dungeonConfig).filter(Boolean).length > 0;
        //         if (!isShowDungeon) {
        //             offset = 50;
        //         }else {
        //             offset += 30;
        //         }

        const backgroundDiv = document.createElement('div');
        backgroundDiv.id = "ActionIcon";
        backgroundDiv.style.position = 'absolute';
        backgroundDiv.style.left = `${offset}%`;
        backgroundDiv.style.width = '30%';
        backgroundDiv.style.height = '100%';
        backgroundDiv.style.opacity = '0.3';

        const actionName = actionHrid.split("/").pop();

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");

        if (!isAction) {
            adaptSVG(svg, itemSVG, actionName);
        } else {
            adaptSVG(svg, actionSVG, actionName);
        }

        backgroundDiv.appendChild(svg);

        div.appendChild(backgroundDiv);

        // fix button style
        div.style.position = 'relative';
        div.querySelector(".RandomTask_content__VVQva").style.zIndex = 1;
        div.querySelectorAll(".Item_item__2De2O").forEach(node => node.style.backgroundColor = "transparent");
    }

    function addBattleIconToTask(div) {
        var { taskType, taskName } = getTaskDetailFromElement(div);

        if (taskType != taskBattleIndex) {
            return;
        }

        const monsterHrid = getHridFromMonsterName(taskName);
        if (!monsterHrid) {
            return;
        }

        var offset = 5; // 5% from left and each 30% width
        const isShowDungeon = Object.values(globalConfig.dungeonConfig).filter(Boolean).length > 0;
        if (!isShowDungeon) {
            offset = 50;
        }

        const backgroundDiv = document.createElement('div');
        backgroundDiv.id = "MonsterIcon";
        backgroundDiv.style.position = 'absolute';
        backgroundDiv.style.left = `${offset}%`; offset += 30;
        backgroundDiv.style.width = '30%';
        backgroundDiv.style.height = '100%';
        backgroundDiv.style.opacity = '0.3';

        const monsterName = monsterHrid.split("/").pop();

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");

        adaptSVG(svg, monsterSVG, monsterName);

        backgroundDiv.appendChild(svg);

        div.appendChild(backgroundDiv);


        const dungeonMap = allMonster[monsterHrid]?.dungeon;
        if (isShowDungeon && dungeonMap) {
            Object.keys(globalConfig.dungeonConfig).filter(dungeon => globalConfig.dungeonConfig[dungeon]).forEach(dungeon => {
                if (dungeonMap.includes(dungeon)) {
                    const dungeonDiv = document.createElement('div');
                    dungeonDiv.id = "DungeonIcon";
                    dungeonDiv.style.position = 'absolute';
                    dungeonDiv.style.left = `${offset}%`; offset += 30;
                    dungeonDiv.style.width = '30%';
                    dungeonDiv.style.height = '100%';
                    dungeonDiv.style.opacity = '0.3';

                    const dungeonName = dungeon.split("/").pop();

                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("width", "100%");
                    svg.setAttribute("height", "100%");

                    adaptSVG(svg, actionSVG, dungeonName);

                    dungeonDiv.appendChild(svg);
                    div.appendChild(dungeonDiv);
                }
            })
        }

        // fix button style
        div.style.position = 'relative';
        div.querySelector(".RandomTask_content__VVQva").style.zIndex = 1;
        div.querySelectorAll(".Item_item__2De2O").forEach(node => node.style.backgroundColor = "transparent");

    }

    function updateIconByConfig() {
        const battleIcon = document.querySelector("#BattleIcon");
        if (battleIcon) {
            if (globalConfig.isBattleIcon) {
                battleIcon.style.opacity = '1';
                battleIcon.querySelector("#taskCount").style.display = 'inline';
            } else {
                battleIcon.style.opacity = '0.3';
                battleIcon.querySelector("#taskCount").style.display = 'none';
            }
        }

        Object.keys(globalConfig.dungeonConfig).forEach(dungeon => {
            const dungeonIcon = document.querySelector(`#${dungeon.split("/").pop()}`);
            if (dungeonIcon) {
                if (globalConfig.isBattleIcon && globalConfig.dungeonConfig[dungeon]) {
                    dungeonIcon.style.opacity = '1';
                    dungeonIcon.querySelector("#taskCount").style.display = 'inline';
                } else {
                    dungeonIcon.style.opacity = '0.3';
                    dungeonIcon.querySelector("#taskCount").style.display = 'none';
                }
            }
        });
    }

    function createIcon(id, objSVG, target) {

        // battle icon
        const div = document.createElement("div");
        div.id = id;
        div.style.height = "100%"; // 设置高度

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "Combat");
        svg.setAttribute("class", "Icon_icon__2LtL_ Icon_xtiny__331pI Icon_inline__1Idwv");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.margin = "1px";

        adaptSVG(svg, objSVG, target);

        const divCount = document.createElement("span");
        divCount.id = "taskCount";
        divCount.textContent = "";

        div.appendChild(svg);
        div.appendChild(divCount);

        // div onclick change config
        div.addEventListener("click", function (evt) {
            if (id === "BattleIcon") {
                globalConfig.isBattleIcon = !globalConfig.isBattleIcon;
            } else {
                let configkey = Object.keys(globalConfig.dungeonConfig).find(key => key.split("/").pop() === id);
                globalConfig.dungeonConfig[configkey] = !globalConfig.dungeonConfig[configkey];
            }
            saveConfig(); //auto save when click

            updateIconByConfig();

            //clean all checkers to refresh statics
            document.querySelectorAll("#taskChekerInCoin").forEach(checker => checker.id = null);
        });

        return div;
    }

    function addSortButtonAndStaticsBar(pannel) {
        const sortButton = document.createElement("button");
        sortButton.setAttribute("class", "Button_button__1Fe9z Button_small__3fqC7");
        sortButton.id = "TaskSort";
        sortButton.innerHTML = "TaskSort";
        sortButton.addEventListener("click", function (evt) {
            const list = document.querySelector("div.TasksPanel_taskList__2xh4k");
            [...list.querySelectorAll("div.RandomTask_randomTask__3B9fA")]
                .sort(compareFn)
                .forEach(node => list.appendChild(node));
        });
        pannel.appendChild(sortButton);

        // add statics bar
        const battleIcon = createIcon("BattleIcon", "/static/media/misc_sprite.426c5d78.svg", "combat");
        pannel.appendChild(battleIcon);

        // add all dungeon icon
        Object.keys(globalConfig.dungeonConfig).forEach(dungeon => {
            const dungeonIcon = createIcon(dungeon.split("/").pop(), actionSVG, dungeon.split("/").pop());
            pannel.appendChild(dungeonIcon);
        });
    }

    function optimizeForMobile(pannel) {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            const upgradeButton = pannel.querySelector("button.Button_button__1Fe9z.Button_small__3fqC7");
            if (upgradeButton) {
                upgradeButton.style.display = "none";
                console.log("hide upgrade button when mobile");
            }
        }
    }

    function refresh() {
        const pannel = document.querySelector("div.TasksPanel_taskSlotCount__nfhgS");
        if (pannel) {
            let sortButton = pannel.querySelector("#TaskSort");
            if (!sortButton) {
                optimizeForMobile(pannel);
                addSortButtonAndStaticsBar(pannel);
                updateIconByConfig();
            }
        }
        else {
            return; //not in task board
        }

        let needRefreshTaskStatics = false;
        const taskNodes = document.querySelectorAll("div.TasksPanel_taskList__2xh4k div.RandomTask_randomTask__3B9fA");
        for (let node of taskNodes) {
            const coinDiv = node.querySelector(".Item_count__1HVvv");
            if (coinDiv && !coinDiv.querySelector("#taskChekerInCoin")) {
                needRefreshTaskStatics = true;

                //remove old and add new icon
                const oldActionIcon = node.querySelector("#ActionIcon");
                if (oldActionIcon) {
                    oldActionIcon.remove();
                }

                const oldIcon = node.querySelector("#MonsterIcon");
                if (oldIcon) {
                    oldIcon.remove();
                }
                const oldDungeonIcons = node.querySelectorAll("#DungeonIcon");
                oldDungeonIcons.forEach(icon => icon.remove());

                // do refresh
                if (globalConfig.isBattleIcon) {
                    addBattleIconToTask(node);
                }
                if (globalConfig.isActionIcon) {
                    addActionIconToTask(node);
                }

                //add checker
                const checker = document.createElement("div");
                checker.id = "taskChekerInCoin";
                coinDiv.appendChild(checker);
            }
        }

        if (needRefreshTaskStatics) {
            const battleIcon = document.querySelector("#BattleIcon #taskCount");
            if (battleIcon) {
                const battleCount = [...document.querySelectorAll("div.RandomTask_randomTask__3B9fA")].filter(node => node.querySelector("#MonsterIcon")).length;
                battleIcon.textContent = battleCount > 0 ? `*${battleCount}` : '';
            }

            Object.keys(globalConfig.dungeonConfig).forEach(dungeon => {
                const dungeonIcon = document.querySelector(`#${dungeon.split("/").pop()} #taskCount`);
                if (dungeonIcon) {
                    const dungeonCount = [...document.querySelectorAll("div.RandomTask_randomTask__3B9fA")].filter(node => {
                        const dungeonIcons = node.querySelectorAll("#DungeonIcon svg");
                        return Array.from(dungeonIcons).some(svg => svg.getAttribute("target").includes(dungeon.split("/").pop()));
                    }).length;
                    dungeonIcon.textContent = dungeonCount > 0 ? `*${dungeonCount}` : '';
                }
            });
        }
    }

    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(function (mutationsList, observer) {
        refresh();
    });

    observer.observe(document, config);

})();
