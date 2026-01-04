// ==UserScript==
// @name         MWI HouseCost/房屋升级材料计算器
// @namespace    http://tampermonkey.net/
// @version      0.81
// @description  House Cost Calc/计算房屋升级所需的材料
// @author       shykai
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/528870/MWI%20HouseCost%E6%88%BF%E5%B1%8B%E5%8D%87%E7%BA%A7%E6%9D%90%E6%96%99%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528870/MWI%20HouseCost%E6%88%BF%E5%B1%8B%E5%8D%87%E7%BA%A7%E6%9D%90%E6%96%99%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh"); // 获取游戏内设置语言
    let isZH = isZHInGameSetting; // 本身显示的语言默认由游戏内设置语言决定

    // 装备物品价格
    var trainPriceUpdatetime = "2025.12.29";
    var trainPrice = {
        "/items/cheese_brush": 5471,
        "/items/verdant_brush": 21687,
        "/items/azure_brush": 55535,
        "/items/burble_brush": 127481,
        "/items/crimson_brush": 240470,
        "/items/rainbow_brush": 469982,
        "/items/holy_brush": 923203,
        "/items/cheese_shears": 5471,
        "/items/verdant_shears": 21687,
        "/items/azure_shears": 55535,
        "/items/burble_shears": 127481,
        "/items/crimson_shears": 240470,
        "/items/rainbow_shears": 469982,
        "/items/holy_shears": 923203,
        "/items/cheese_hatchet": 5471,
        "/items/verdant_hatchet": 21687,
        "/items/azure_hatchet": 55535,
        "/items/burble_hatchet": 127481,
        "/items/crimson_hatchet": 240470,
        "/items/rainbow_hatchet": 469982,
        "/items/holy_hatchet": 923203,
        "/items/cheese_hammer": 5474,
        "/items/verdant_hammer": 21696,
        "/items/azure_hammer": 55555,
        "/items/burble_hammer": 127522,
        "/items/crimson_hammer": 240551,
        "/items/rainbow_hammer": 470147,
        "/items/holy_hammer": 923546,
        "/items/cheese_chisel": 5474,
        "/items/verdant_chisel": 21696,
        "/items/azure_chisel": 55555,
        "/items/burble_chisel": 127522,
        "/items/crimson_chisel": 240551,
        "/items/rainbow_chisel": 470147,
        "/items/holy_chisel": 923546,
        "/items/cheese_spatula": 5474,
        "/items/verdant_spatula": 23515,
        "/items/azure_spatula": 58035,
        "/items/burble_spatula": 131379,
        "/items/crimson_spatula": 244904,
        "/items/rainbow_spatula": 481544,
        "/items/holy_spatula": 957425,
        "/items/cheese_needle": 5474,
        "/items/verdant_needle": 23515,
        "/items/azure_needle": 58035,
        "/items/burble_needle": 131379,
        "/items/crimson_needle": 244904,
        "/items/rainbow_needle": 481544,
        "/items/holy_needle": 957425,
        "/items/cheese_pot": 5474,
        "/items/verdant_pot": 23515,
        "/items/azure_pot": 58035,
        "/items/burble_pot": 131379,
        "/items/crimson_pot": 244904,
        "/items/rainbow_pot": 481544,
        "/items/holy_pot": 957425,
        "/items/cheese_alembic": 5478,
        "/items/verdant_alembic": 23524,
        "/items/azure_alembic": 58055,
        "/items/burble_alembic": 131421,
        "/items/crimson_alembic": 244988,
        "/items/rainbow_alembic": 481714,
        "/items/holy_alembic": 957777,
        "/items/cheese_enhancer": 5478,
        "/items/verdant_enhancer": 23524,
        "/items/azure_enhancer": 58055,
        "/items/burble_enhancer": 131421,
        "/items/crimson_enhancer": 244988,
        "/items/rainbow_enhancer": 481714,
        "/items/holy_enhancer": 957777,
        "/items/cheese_bulwark": 13161,
        "/items/verdant_bulwark": 43609,
        "/items/azure_bulwark": 102023,
        "/items/burble_bulwark": 226369,
        "/items/crimson_bulwark": 418477,
        "/items/rainbow_bulwark": 819405,
        "/items/holy_bulwark": 1626173,
        "/items/cheese_sword": 5470,
        "/items/verdant_sword": 28459,
        "/items/azure_sword": 72515,
        "/items/burble_sword": 166216,
        "/items/crimson_sword": 311089,
        "/items/rainbow_sword": 613267,
        "/items/holy_sword": 1221128,
        "/items/cheese_spear": 5473,
        "/items/verdant_spear": 24832,
        "/items/azure_spear": 67576,
        "/items/burble_spear": 158542,
        "/items/crimson_spear": 302463,
        "/items/rainbow_spear": 590636,
        "/items/holy_spear": 1153709,
        "/items/cheese_mace": 5476,
        "/items/verdant_mace": 24842,
        "/items/azure_mace": 67596,
        "/items/burble_mace": 158584,
        "/items/crimson_mace": 302546,
        "/items/rainbow_mace": 590804,
        "/items/holy_mace": 1154057,
        "/items/cheese_buckler": 6768,
        "/items/verdant_buckler": 22335,
        "/items/azure_buckler": 52090,
        "/items/burble_buckler": 115262,
        "/items/crimson_buckler": 213124,
        "/items/rainbow_buckler": 417019,
        "/items/holy_buckler": 826959,
        "/items/cheese_helmet": 5702,
        "/items/verdant_helmet": 18790,
        "/items/azure_helmet": 43769,
        "/items/burble_helmet": 96747,
        "/items/crimson_helmet": 178906,
        "/items/rainbow_helmet": 349969,
        "/items/holy_helmet": 693787,
        "/items/cheese_plate_body": 8903,
        "/items/verdant_plate_body": 29439,
        "/items/azure_plate_body": 68762,
        "/items/burble_plate_body": 152354,
        "/items/crimson_plate_body": 281689,
        "/items/rainbow_plate_body": 551381,
        "/items/holy_plate_body": 1093849,
        "/items/cheese_plate_legs": 7836,
        "/items/verdant_plate_legs": 25889,
        "/items/azure_plate_legs": 60431,
        "/items/burble_plate_legs": 133819,
        "/items/crimson_plate_legs": 247428,
        "/items/rainbow_plate_legs": 484243,
        "/items/holy_plate_legs": 960493,
        "/items/cheese_gauntlets": 4629,
        "/items/verdant_gauntlets": 15221,
        "/items/azure_gauntlets": 35398,
        "/items/burble_gauntlets": 78131,
        "/items/crimson_gauntlets": 144483,
        "/items/rainbow_gauntlets": 282502,
        "/items/holy_gauntlets": 559751,
        "/items/cheese_boots": 4629,
        "/items/verdant_boots": 15218,
        "/items/azure_boots": 35390,
        "/items/burble_boots": 78112,
        "/items/crimson_boots": 144445,
        "/items/rainbow_boots": 282423,
        "/items/holy_boots": 559586,
        "/items/rough_hood": 7539,
        "/items/reptile_hood": 26180,
        "/items/gobo_hood": 67095,
        "/items/beast_hood": 160753,
        "/items/umbral_hood": 386709,
        "/items/cotton_hat": 6070,
        "/items/linen_hat": 25078,
        "/items/bamboo_hat": 44779,
        "/items/silk_hat": 190784,
        "/items/radiant_hat": 499392,
        "/items/rough_tunic": 11847,
        "/items/reptile_tunic": 41098,
        "/items/gobo_tunic": 105233,
        "/items/beast_tunic": 251993,
        "/items/umbral_tunic": 607355,
        "/items/cotton_robe_top": 9496,
        "/items/linen_robe_top": 39335,
        "/items/bamboo_robe_top": 69527,
        "/items/silk_robe_top": 300042,
        "/items/radiant_robe_top": 787649,
        "/items/rough_chaps": 10409,
        "/items/reptile_chaps": 36118,
        "/items/gobo_chaps": 92500,
        "/items/beast_chaps": 221523,
        "/items/umbral_chaps": 533667,
        "/items/cotton_robe_bottoms": 8352,
        "/items/linen_robe_bottoms": 34576,
        "/items/bamboo_robe_bottoms": 61257,
        "/items/silk_robe_bottoms": 263566,
        "/items/radiant_robe_bottoms": 691424,
        "/items/rough_bracers": 6101,
        "/items/reptile_bracers": 21202,
        "/items/gobo_bracers": 54365,
        "/items/beast_bracers": 130294,
        "/items/umbral_bracers": 313051,
        "/items/cotton_gloves": 4926,
        "/items/linen_gloves": 20320,
        "/items/bamboo_gloves": 36512,
        "/items/silk_gloves": 154319,
        "/items/radiant_gloves": 403197,
        "/items/rough_boots": 6098,
        "/items/reptile_boots": 21184,
        "/items/gobo_boots": 54312,
        "/items/beast_boots": 130148,
        "/items/umbral_boots": 312693,
        "/items/cotton_boots": 4923,
        "/items/linen_boots": 20303,
        "/items/bamboo_boots": 36459,
        "/items/silk_boots": 154173,
        "/items/radiant_boots": 402840,
        "/items/wooden_crossbow": 5470,
        "/items/birch_crossbow": 23497,
        "/items/cedar_crossbow": 70854,
        "/items/purpleheart_crossbow": 169504,
        "/items/ginkgo_crossbow": 351551,
        "/items/redwood_crossbow": 653688,
        "/items/arcane_crossbow": 1157320,
        "/items/wooden_water_staff": 5470,
        "/items/birch_water_staff": 23497,
        "/items/cedar_water_staff": 70854,
        "/items/purpleheart_water_staff": 169504,
        "/items/ginkgo_water_staff": 351551,
        "/items/redwood_water_staff": 653688,
        "/items/arcane_water_staff": 1157320,
        "/items/wooden_nature_staff": 5473,
        "/items/birch_nature_staff": 23510,
        "/items/cedar_nature_staff": 70882,
        "/items/purpleheart_nature_staff": 169563,
        "/items/ginkgo_nature_staff": 351669,
        "/items/redwood_nature_staff": 653930,
        "/items/arcane_nature_staff": 1157823,
        "/items/wooden_fire_staff": 5478,
        "/items/birch_fire_staff": 23524,
        "/items/cedar_fire_staff": 70912,
        "/items/purpleheart_fire_staff": 169625,
        "/items/ginkgo_fire_staff": 351794,
        "/items/redwood_fire_staff": 654183,
        "/items/arcane_fire_staff": 1158348,
        "/items/wooden_bow": 5476,
        "/items/birch_bow": 29305,
        "/items/cedar_bow": 92116,
        "/items/purpleheart_bow": 223053,
        "/items/ginkgo_bow": 464711,
        "/items/redwood_bow": 865552,
        "/items/arcane_bow": 1533278,
        "/items/wooden_shield": 4998,
        "/items/birch_shield": 17246,
        "/items/cedar_shield": 49184,
        "/items/purpleheart_shield": 115620,
        "/items/ginkgo_shield": 238196,
        "/items/redwood_shield": 441920,
        "/items/arcane_shield": 782072
    }

    // 加载房屋数据
    const houseDetails = {
        "/house_rooms/archery_range": {
            "hrid": "/house_rooms/archery_range",
            "name": "Archery Range",
            "skillHrid": "/skills/ranged",
            "usableInActionTypeMap": {
                "/action_types/combat": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_ranged_level",
                    "typeHrid": "/buff_types/ranged_level",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 1,
                    "flatBoostLevelBonus": 1,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/wooden_crossbow",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/wooden_bow",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/rough_hood",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/rough_tunic",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/rough_chaps",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/rough_bracers",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/rough_boots",
                        "count": 4
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/wooden_crossbow",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/birch_crossbow",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/wooden_bow",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/birch_bow",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/reptile_hood",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/reptile_tunic",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/reptile_chaps",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/reptile_bracers",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/reptile_boots",
                        "count": 8
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/birch_crossbow",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/cedar_crossbow",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/birch_bow",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/cedar_bow",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/reptile_hood",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/reptile_tunic",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/reptile_chaps",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/reptile_bracers",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/reptile_boots",
                        "count": 16
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/cedar_crossbow",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/purpleheart_crossbow",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/cedar_bow",
                        "count": 10
                    },
                    {
                        "itemHrid": "/items/purpleheart_bow",
                        "count": 10
                    },
                    {
                        "itemHrid": "/items/gobo_hood",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/gobo_tunic",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/gobo_chaps",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/gobo_bracers",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/gobo_boots",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/ranged_coffee",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/purpleheart_crossbow",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/ginkgo_crossbow",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/purpleheart_bow",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/ginkgo_bow",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/gobo_hood",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/gobo_tunic",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/gobo_chaps",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/gobo_bracers",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/gobo_boots",
                        "count": 32
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/ginkgo_crossbow",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/redwood_crossbow",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/ginkgo_bow",
                        "count": 14
                    },
                    {
                        "itemHrid": "/items/redwood_bow",
                        "count": 14
                    },
                    {
                        "itemHrid": "/items/beast_hood",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/beast_tunic",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/beast_chaps",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/beast_bracers",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/beast_boots",
                        "count": 24
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/redwood_crossbow",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/arcane_crossbow",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/redwood_bow",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/arcane_bow",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/beast_hood",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/beast_tunic",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/beast_chaps",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/beast_bracers",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/beast_boots",
                        "count": 48
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/arcane_crossbow",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/arcane_bow",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/umbral_hood",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/umbral_tunic",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/umbral_chaps",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/umbral_bracers",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/umbral_boots",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/super_ranged_coffee",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 16
        },
        "/house_rooms/armory": {
            "hrid": "/house_rooms/armory",
            "name": "Armory",
            "skillHrid": "/skills/defense",
            "usableInActionTypeMap": {
                "/action_types/combat": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_defense_level",
                    "typeHrid": "/buff_types/defense_level",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 1,
                    "flatBoostLevelBonus": 1,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/cheese_helmet",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/cheese_plate_body",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/cheese_plate_legs",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/cheese_gauntlets",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/cheese_boots",
                        "count": 8
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/cheese_helmet",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/verdant_helmet",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/cheese_plate_body",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/verdant_plate_body",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/cheese_plate_legs",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/verdant_plate_legs",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/cheese_gauntlets",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/verdant_gauntlets",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/cheese_boots",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/verdant_boots",
                        "count": 12
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/verdant_helmet",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/azure_helmet",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/verdant_plate_body",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/azure_plate_body",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/verdant_plate_legs",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/azure_plate_legs",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/verdant_gauntlets",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/azure_gauntlets",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/verdant_boots",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/azure_boots",
                        "count": 16
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/azure_helmet",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/burble_helmet",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/azure_plate_body",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/burble_plate_body",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/azure_plate_legs",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/burble_plate_legs",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/azure_gauntlets",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/burble_gauntlets",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/azure_boots",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/burble_boots",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/defense_coffee",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/burble_helmet",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/crimson_helmet",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/burble_plate_body",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/crimson_plate_body",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/burble_plate_legs",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/crimson_plate_legs",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/burble_gauntlets",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/crimson_gauntlets",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/burble_boots",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/crimson_boots",
                        "count": 24
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/crimson_helmet",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/rainbow_helmet",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/crimson_plate_body",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/rainbow_plate_body",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/crimson_plate_legs",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/rainbow_plate_legs",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/crimson_gauntlets",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/rainbow_gauntlets",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/crimson_boots",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/rainbow_boots",
                        "count": 28
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/rainbow_helmet",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/holy_helmet",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/rainbow_plate_body",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/holy_plate_body",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/rainbow_plate_legs",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/holy_plate_legs",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/rainbow_gauntlets",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/holy_gauntlets",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/rainbow_boots",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/holy_boots",
                        "count": 32
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/holy_helmet",
                        "count": 80
                    },
                    {
                        "itemHrid": "/items/holy_plate_body",
                        "count": 80
                    },
                    {
                        "itemHrid": "/items/holy_plate_legs",
                        "count": 80
                    },
                    {
                        "itemHrid": "/items/holy_gauntlets",
                        "count": 80
                    },
                    {
                        "itemHrid": "/items/holy_boots",
                        "count": 80
                    },
                    {
                        "itemHrid": "/items/super_defense_coffee",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 14
        },
        "/house_rooms/brewery": {
            "hrid": "/house_rooms/brewery",
            "name": "Brewery",
            "skillHrid": "/skills/brewing",
            "usableInActionTypeMap": {
                "/action_types/brewing": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/green_tea_leaf",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/arabica_coffee_bean",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cheese_pot",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/green_tea_leaf",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/black_tea_leaf",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/arabica_coffee_bean",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/robusta_coffee_bean",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/cheese_pot",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_pot",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/black_tea_leaf",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/robusta_coffee_bean",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/verdant_pot",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_pot",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/black_tea_leaf",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/burble_tea_leaf",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/robusta_coffee_bean",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/liberica_coffee_bean",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/azure_pot",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_pot",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/brewing_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/burble_tea_leaf",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/moolong_tea_leaf",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/liberica_coffee_bean",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/excelsa_coffee_bean",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/burble_pot",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_pot",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/moolong_tea_leaf",
                        "count": 9600
                    },
                    {
                        "itemHrid": "/items/red_tea_leaf",
                        "count": 9600
                    },
                    {
                        "itemHrid": "/items/excelsa_coffee_bean",
                        "count": 9600
                    },
                    {
                        "itemHrid": "/items/fieriosa_coffee_bean",
                        "count": 9600
                    },
                    {
                        "itemHrid": "/items/crimson_pot",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_pot",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/red_tea_leaf",
                        "count": 19200
                    },
                    {
                        "itemHrid": "/items/emp_tea_leaf",
                        "count": 19200
                    },
                    {
                        "itemHrid": "/items/fieriosa_coffee_bean",
                        "count": 19200
                    },
                    {
                        "itemHrid": "/items/spacia_coffee_bean",
                        "count": 19200
                    },
                    {
                        "itemHrid": "/items/rainbow_pot",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_pot",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/emp_tea_leaf",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/spacia_coffee_bean",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/holy_pot",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_brewing_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 8
        },
        "/house_rooms/dairy_barn": {
            "hrid": "/house_rooms/dairy_barn",
            "name": "Dairy Barn",
            "skillHrid": "/skills/milking",
            "usableInActionTypeMap": {
                "/action_types/milking": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/milk",
                        "count": 1500
                    },
                    {
                        "itemHrid": "/items/cheese_brush",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/milk",
                        "count": 3000
                    },
                    {
                        "itemHrid": "/items/verdant_milk",
                        "count": 3000
                    },
                    {
                        "itemHrid": "/items/cheese_brush",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_brush",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/verdant_milk",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/azure_milk",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/verdant_brush",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_brush",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/azure_milk",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/burble_milk",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/azure_brush",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_brush",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/milking_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/burble_milk",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/crimson_milk",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/burble_brush",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_brush",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/crimson_milk",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/rainbow_milk",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/crimson_brush",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_brush",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/rainbow_milk",
                        "count": 96000
                    },
                    {
                        "itemHrid": "/items/holy_milk",
                        "count": 96000
                    },
                    {
                        "itemHrid": "/items/rainbow_brush",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_brush",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/holy_milk",
                        "count": 240000
                    },
                    {
                        "itemHrid": "/items/holy_brush",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_milking_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 1
        },
        "/house_rooms/dining_room": {
            "hrid": "/house_rooms/dining_room",
            "name": "Dining Room",
            "skillHrid": "/skills/stamina",
            "usableInActionTypeMap": {
                "/action_types/combat": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_stamina_level",
                    "typeHrid": "/buff_types/stamina_level",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 1,
                    "flatBoostLevelBonus": 1,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_hp_regen",
                    "typeHrid": "/buff_types/hp_regen",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0003,
                    "flatBoostLevelBonus": 0.0003,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/donut",
                        "count": 125
                    },
                    {
                        "itemHrid": "/items/cupcake",
                        "count": 125
                    },
                    {
                        "itemHrid": "/items/small_pouch",
                        "count": 1
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/donut",
                        "count": 250
                    },
                    {
                        "itemHrid": "/items/blueberry_donut",
                        "count": 250
                    },
                    {
                        "itemHrid": "/items/cupcake",
                        "count": 250
                    },
                    {
                        "itemHrid": "/items/blueberry_cake",
                        "count": 250
                    },
                    {
                        "itemHrid": "/items/small_pouch",
                        "count": 3
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/blueberry_donut",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/blackberry_donut",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/blueberry_cake",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/blackberry_cake",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/medium_pouch",
                        "count": 1
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/blackberry_donut",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/strawberry_donut",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/blackberry_cake",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/strawberry_cake",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/medium_pouch",
                        "count": 3
                    },
                    {
                        "itemHrid": "/items/stamina_coffee",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/strawberry_donut",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/mooberry_donut",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/strawberry_cake",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/mooberry_cake",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/large_pouch",
                        "count": 1
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/mooberry_donut",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/marsberry_donut",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/mooberry_cake",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/marsberry_cake",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/large_pouch",
                        "count": 3
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/marsberry_donut",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/spaceberry_donut",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/marsberry_cake",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/spaceberry_cake",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/giant_pouch",
                        "count": 1
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/spaceberry_donut",
                        "count": 20000
                    },
                    {
                        "itemHrid": "/items/spaceberry_cake",
                        "count": 20000
                    },
                    {
                        "itemHrid": "/items/giant_pouch",
                        "count": 3
                    },
                    {
                        "itemHrid": "/items/super_stamina_coffee",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 11
        },
        "/house_rooms/dojo": {
            "hrid": "/house_rooms/dojo",
            "name": "Dojo",
            "skillHrid": "/skills/attack",
            "usableInActionTypeMap": {
                "/action_types/combat": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_attack_level",
                    "typeHrid": "/buff_types/attack_level",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 1,
                    "flatBoostLevelBonus": 1,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_attack_speed",
                    "typeHrid": "/buff_types/attack_speed",
                    "ratioBoost": 0.005,
                    "ratioBoostLevelBonus": 0.005,
                    "flatBoost": 0,
                    "flatBoostLevelBonus": 0,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_cast_speed",
                    "typeHrid": "/buff_types/cast_speed",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.005,
                    "flatBoostLevelBonus": 0.005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/cheese_spear",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/cheese_sword",
                        "count": 8
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/cheese_spear",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/verdant_spear",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/cheese_sword",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/verdant_sword",
                        "count": 12
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/verdant_spear",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/azure_spear",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/verdant_sword",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/azure_sword",
                        "count": 16
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/azure_spear",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/burble_spear",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/azure_sword",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/burble_sword",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/attack_coffee",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/burble_spear",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/crimson_spear",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/burble_sword",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/crimson_sword",
                        "count": 24
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/crimson_spear",
                        "count": 56
                    },
                    {
                        "itemHrid": "/items/rainbow_spear",
                        "count": 56
                    },
                    {
                        "itemHrid": "/items/crimson_sword",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/rainbow_sword",
                        "count": 28
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/rainbow_spear",
                        "count": 64
                    },
                    {
                        "itemHrid": "/items/holy_spear",
                        "count": 64
                    },
                    {
                        "itemHrid": "/items/rainbow_sword",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/holy_sword",
                        "count": 32
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/holy_spear",
                        "count": 160
                    },
                    {
                        "itemHrid": "/items/holy_sword",
                        "count": 80
                    },
                    {
                        "itemHrid": "/items/super_attack_coffee",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 13
        },
        "/house_rooms/forge": {
            "hrid": "/house_rooms/forge",
            "name": "Forge",
            "skillHrid": "/skills/cheesesmithing",
            "usableInActionTypeMap": {
                "/action_types/cheesesmithing": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/cheese",
                        "count": 375
                    },
                    {
                        "itemHrid": "/items/cheese_hammer",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/cheese",
                        "count": 750
                    },
                    {
                        "itemHrid": "/items/verdant_cheese",
                        "count": 750
                    },
                    {
                        "itemHrid": "/items/cheese_hammer",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_hammer",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/verdant_cheese",
                        "count": 1500
                    },
                    {
                        "itemHrid": "/items/azure_cheese",
                        "count": 1500
                    },
                    {
                        "itemHrid": "/items/verdant_hammer",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_hammer",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/azure_cheese",
                        "count": 3000
                    },
                    {
                        "itemHrid": "/items/burble_cheese",
                        "count": 3000
                    },
                    {
                        "itemHrid": "/items/azure_hammer",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_hammer",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/cheesesmithing_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/burble_cheese",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/crimson_cheese",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/burble_hammer",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_hammer",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/crimson_cheese",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/rainbow_cheese",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/crimson_hammer",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_hammer",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/rainbow_cheese",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/holy_cheese",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/rainbow_hammer",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_hammer",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/holy_cheese",
                        "count": 60000
                    },
                    {
                        "itemHrid": "/items/holy_hammer",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_cheesesmithing_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 4
        },
        "/house_rooms/garden": {
            "hrid": "/house_rooms/garden",
            "name": "Garden",
            "skillHrid": "/skills/foraging",
            "usableInActionTypeMap": {
                "/action_types/foraging": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/egg",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/wheat",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/cotton",
                        "count": 750
                    },
                    {
                        "itemHrid": "/items/cheese_shears",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/egg",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/blueberry",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/wheat",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/apple",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/cotton",
                        "count": 1500
                    },
                    {
                        "itemHrid": "/items/flax",
                        "count": 1500
                    },
                    {
                        "itemHrid": "/items/cheese_shears",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_shears",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/blueberry",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/blackberry",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/apple",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/orange",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/flax",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/verdant_shears",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_shears",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/blackberry",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/strawberry",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/orange",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/plum",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/flax",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/bamboo_branch",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/azure_shears",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_shears",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/foraging_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/strawberry",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/mooberry",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/plum",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/peach",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/bamboo_branch",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/burble_shears",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_shears",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/mooberry",
                        "count": 16000
                    },
                    {
                        "itemHrid": "/items/marsberry",
                        "count": 16000
                    },
                    {
                        "itemHrid": "/items/peach",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/dragon_fruit",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/bamboo_branch",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/cocoon",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/crimson_shears",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_shears",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/marsberry",
                        "count": 32000
                    },
                    {
                        "itemHrid": "/items/spaceberry",
                        "count": 32000
                    },
                    {
                        "itemHrid": "/items/dragon_fruit",
                        "count": 16000
                    },
                    {
                        "itemHrid": "/items/star_fruit",
                        "count": 16000
                    },
                    {
                        "itemHrid": "/items/cocoon",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/radiant_fiber",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/rainbow_shears",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_shears",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/spaceberry",
                        "count": 80000
                    },
                    {
                        "itemHrid": "/items/star_fruit",
                        "count": 40000
                    },
                    {
                        "itemHrid": "/items/radiant_fiber",
                        "count": 120000
                    },
                    {
                        "itemHrid": "/items/holy_shears",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_foraging_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 2
        },
        "/house_rooms/gym": {
            "hrid": "/house_rooms/gym",
            "name": "Gym",
            "skillHrid": "/skills/melee",
            "usableInActionTypeMap": {
                "/action_types/combat": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_melee_level",
                    "typeHrid": "/buff_types/melee_level",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 1,
                    "flatBoostLevelBonus": 1,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/cheese_mace",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/cheese_sword",
                        "count": 8
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/cheese_mace",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/verdant_mace",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/cheese_sword",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/verdant_sword",
                        "count": 12
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/verdant_mace",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/azure_mace",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/verdant_sword",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/azure_sword",
                        "count": 16
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/azure_mace",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/burble_mace",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/azure_sword",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/burble_sword",
                        "count": 20
                    },
                    {
                        "itemHrid": "/items/melee_coffee",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/burble_mace",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/crimson_mace",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/burble_sword",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/crimson_sword",
                        "count": 24
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/crimson_mace",
                        "count": 56
                    },
                    {
                        "itemHrid": "/items/rainbow_mace",
                        "count": 56
                    },
                    {
                        "itemHrid": "/items/crimson_sword",
                        "count": 28
                    },
                    {
                        "itemHrid": "/items/rainbow_sword",
                        "count": 28
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/rainbow_mace",
                        "count": 64
                    },
                    {
                        "itemHrid": "/items/holy_mace",
                        "count": 64
                    },
                    {
                        "itemHrid": "/items/rainbow_sword",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/holy_sword",
                        "count": 32
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/holy_mace",
                        "count": 160
                    },
                    {
                        "itemHrid": "/items/holy_sword",
                        "count": 80
                    },
                    {
                        "itemHrid": "/items/super_melee_coffee",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 15
        },
        "/house_rooms/kitchen": {
            "hrid": "/house_rooms/kitchen",
            "name": "Kitchen",
            "skillHrid": "/skills/cooking",
            "usableInActionTypeMap": {
                "/action_types/cooking": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/sugar",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/egg",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/wheat",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/cheese_spatula",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/sugar",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/egg",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/blueberry",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/wheat",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/apple",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/cheese_spatula",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_spatula",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/sugar",
                        "count": 20000
                    },
                    {
                        "itemHrid": "/items/blueberry",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/blackberry",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/apple",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/orange",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/verdant_spatula",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_spatula",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/sugar",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/blackberry",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/strawberry",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/orange",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/plum",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/azure_spatula",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_spatula",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/cooking_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/sugar",
                        "count": 100000
                    },
                    {
                        "itemHrid": "/items/strawberry",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/mooberry",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/plum",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/peach",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/burble_spatula",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_spatula",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/sugar",
                        "count": 200000
                    },
                    {
                        "itemHrid": "/items/mooberry",
                        "count": 16000
                    },
                    {
                        "itemHrid": "/items/marsberry",
                        "count": 16000
                    },
                    {
                        "itemHrid": "/items/peach",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/dragon_fruit",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/crimson_spatula",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_spatula",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/sugar",
                        "count": 360000
                    },
                    {
                        "itemHrid": "/items/marsberry",
                        "count": 32000
                    },
                    {
                        "itemHrid": "/items/spaceberry",
                        "count": 32000
                    },
                    {
                        "itemHrid": "/items/dragon_fruit",
                        "count": 16000
                    },
                    {
                        "itemHrid": "/items/star_fruit",
                        "count": 16000
                    },
                    {
                        "itemHrid": "/items/rainbow_spatula",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_spatula",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/sugar",
                        "count": 640000
                    },
                    {
                        "itemHrid": "/items/spaceberry",
                        "count": 80000
                    },
                    {
                        "itemHrid": "/items/star_fruit",
                        "count": 40000
                    },
                    {
                        "itemHrid": "/items/holy_spatula",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_cooking_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 7
        },
        "/house_rooms/laboratory": {
            "hrid": "/house_rooms/laboratory",
            "name": "Laboratory",
            "skillHrid": "/skills/alchemy",
            "usableInActionTypeMap": {
                "/action_types/alchemy": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/milking_essence",
                        "count": 100
                    },
                    {
                        "itemHrid": "/items/foraging_essence",
                        "count": 100
                    },
                    {
                        "itemHrid": "/items/woodcutting_essence",
                        "count": 100
                    },
                    {
                        "itemHrid": "/items/cheese_alembic",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/cheesesmithing_essence",
                        "count": 200
                    },
                    {
                        "itemHrid": "/items/crafting_essence",
                        "count": 200
                    },
                    {
                        "itemHrid": "/items/tailoring_essence",
                        "count": 200
                    },
                    {
                        "itemHrid": "/items/cheese_alembic",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_alembic",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cooking_essence",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/brewing_essence",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/verdant_alembic",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_alembic",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/alchemy_essence",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/enhancing_essence",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/azure_alembic",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_alembic",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/alchemy_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/milking_essence",
                        "count": 1600
                    },
                    {
                        "itemHrid": "/items/foraging_essence",
                        "count": 1600
                    },
                    {
                        "itemHrid": "/items/woodcutting_essence",
                        "count": 1600
                    },
                    {
                        "itemHrid": "/items/burble_alembic",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_alembic",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/cheesesmithing_essence",
                        "count": 3200
                    },
                    {
                        "itemHrid": "/items/crafting_essence",
                        "count": 3200
                    },
                    {
                        "itemHrid": "/items/tailoring_essence",
                        "count": 3200
                    },
                    {
                        "itemHrid": "/items/crimson_alembic",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_alembic",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/cooking_essence",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/brewing_essence",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/rainbow_alembic",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_alembic",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/alchemy_essence",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/enhancing_essence",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/holy_alembic",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_alchemy_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 9
        },
        "/house_rooms/library": {
            "hrid": "/house_rooms/library",
            "name": "Library",
            "skillHrid": "/skills/intelligence",
            "usableInActionTypeMap": {
                "/action_types/combat": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_intelligence_level",
                    "typeHrid": "/buff_types/intelligence_level",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 1,
                    "flatBoostLevelBonus": 1,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_mp_regen",
                    "typeHrid": "/buff_types/mp_regen",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0003,
                    "flatBoostLevelBonus": 0.0003,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/gummy",
                        "count": 250
                    },
                    {
                        "itemHrid": "/items/yogurt",
                        "count": 250
                    },
                    {
                        "itemHrid": "/items/poke",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/scratch",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/smack",
                        "count": 2
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/gummy",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/apple_gummy",
                        "count": 250
                    },
                    {
                        "itemHrid": "/items/yogurt",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/apple_yogurt",
                        "count": 250
                    },
                    {
                        "itemHrid": "/items/quick_shot",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/water_strike",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/entangle",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/fireball",
                        "count": 2
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/apple_gummy",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/orange_gummy",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/apple_yogurt",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/orange_yogurt",
                        "count": 500
                    },
                    {
                        "itemHrid": "/items/toughness",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/precision",
                        "count": 2
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/orange_gummy",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/plum_gummy",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/orange_yogurt",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/plum_yogurt",
                        "count": 1000
                    },
                    {
                        "itemHrid": "/items/impale",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/cleave",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/sweep",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/intelligence_coffee",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/plum_gummy",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/peach_gummy",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/plum_yogurt",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/peach_yogurt",
                        "count": 2000
                    },
                    {
                        "itemHrid": "/items/rain_of_arrows",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/ice_spear",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/flame_blast",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/toxic_pollen",
                        "count": 2
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/peach_gummy",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/dragon_fruit_gummy",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/peach_yogurt",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/dragon_fruit_yogurt",
                        "count": 4000
                    },
                    {
                        "itemHrid": "/items/berserk",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/frenzy",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/elemental_affinity",
                        "count": 2
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/dragon_fruit_gummy",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/star_fruit_gummy",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/dragon_fruit_yogurt",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/star_fruit_yogurt",
                        "count": 8000
                    },
                    {
                        "itemHrid": "/items/puncture",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/maim",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/stunning_blow",
                        "count": 2
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/star_fruit_gummy",
                        "count": 20000
                    },
                    {
                        "itemHrid": "/items/star_fruit_yogurt",
                        "count": 20000
                    },
                    {
                        "itemHrid": "/items/silencing_shot",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/frost_surge",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/natures_veil",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/firestorm",
                        "count": 2
                    },
                    {
                        "itemHrid": "/items/super_intelligence_coffee",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 12
        },
        "/house_rooms/log_shed": {
            "hrid": "/house_rooms/log_shed",
            "name": "Log Shed",
            "skillHrid": "/skills/woodcutting",
            "usableInActionTypeMap": {
                "/action_types/woodcutting": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/log",
                        "count": 1500
                    },
                    {
                        "itemHrid": "/items/cheese_hatchet",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/log",
                        "count": 3000
                    },
                    {
                        "itemHrid": "/items/birch_log",
                        "count": 3000
                    },
                    {
                        "itemHrid": "/items/cheese_hatchet",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_hatchet",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/birch_log",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/cedar_log",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/verdant_hatchet",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_hatchet",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/cedar_log",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/purpleheart_log",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/azure_hatchet",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_hatchet",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/woodcutting_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/purpleheart_log",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/ginkgo_log",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/burble_hatchet",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_hatchet",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/ginkgo_log",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/redwood_log",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/crimson_hatchet",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_hatchet",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/redwood_log",
                        "count": 96000
                    },
                    {
                        "itemHrid": "/items/arcane_log",
                        "count": 96000
                    },
                    {
                        "itemHrid": "/items/rainbow_hatchet",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_hatchet",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/arcane_log",
                        "count": 240000
                    },
                    {
                        "itemHrid": "/items/holy_hatchet",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_woodcutting_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 3
        },
        "/house_rooms/mystical_study": {
            "hrid": "/house_rooms/mystical_study",
            "name": "Mystical Study",
            "skillHrid": "/skills/magic",
            "usableInActionTypeMap": {
                "/action_types/combat": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_magic_level",
                    "typeHrid": "/buff_types/magic_level",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 1,
                    "flatBoostLevelBonus": 1,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/wooden_water_staff",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/wooden_nature_staff",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/wooden_fire_staff",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/cotton_hat",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/cotton_robe_top",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/cotton_robe_bottoms",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/cotton_gloves",
                        "count": 4
                    },
                    {
                        "itemHrid": "/items/cotton_boots",
                        "count": 4
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/wooden_water_staff",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/birch_water_staff",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/wooden_nature_staff",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/birch_nature_staff",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/wooden_fire_staff",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/birch_fire_staff",
                        "count": 6
                    },
                    {
                        "itemHrid": "/items/linen_hat",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/linen_robe_top",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/linen_robe_bottoms",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/linen_gloves",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/linen_boots",
                        "count": 8
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/birch_water_staff",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/cedar_water_staff",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/birch_nature_staff",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/cedar_nature_staff",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/birch_fire_staff",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/cedar_fire_staff",
                        "count": 8
                    },
                    {
                        "itemHrid": "/items/linen_hat",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/linen_robe_top",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/linen_robe_bottoms",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/linen_gloves",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/linen_boots",
                        "count": 16
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/cedar_water_staff",
                        "count": 10
                    },
                    {
                        "itemHrid": "/items/purpleheart_water_staff",
                        "count": 10
                    },
                    {
                        "itemHrid": "/items/cedar_nature_staff",
                        "count": 10
                    },
                    {
                        "itemHrid": "/items/purpleheart_nature_staff",
                        "count": 10
                    },
                    {
                        "itemHrid": "/items/cedar_fire_staff",
                        "count": 10
                    },
                    {
                        "itemHrid": "/items/purpleheart_fire_staff",
                        "count": 10
                    },
                    {
                        "itemHrid": "/items/bamboo_hat",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/bamboo_robe_top",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/bamboo_robe_bottoms",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/bamboo_gloves",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/bamboo_boots",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/magic_coffee",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/purpleheart_water_staff",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/ginkgo_water_staff",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/purpleheart_nature_staff",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/ginkgo_nature_staff",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/purpleheart_fire_staff",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/ginkgo_fire_staff",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/bamboo_hat",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/bamboo_robe_top",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/bamboo_robe_bottoms",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/bamboo_gloves",
                        "count": 32
                    },
                    {
                        "itemHrid": "/items/bamboo_boots",
                        "count": 32
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/ginkgo_water_staff",
                        "count": 14
                    },
                    {
                        "itemHrid": "/items/redwood_water_staff",
                        "count": 14
                    },
                    {
                        "itemHrid": "/items/ginkgo_nature_staff",
                        "count": 14
                    },
                    {
                        "itemHrid": "/items/redwood_nature_staff",
                        "count": 14
                    },
                    {
                        "itemHrid": "/items/ginkgo_fire_staff",
                        "count": 14
                    },
                    {
                        "itemHrid": "/items/redwood_fire_staff",
                        "count": 14
                    },
                    {
                        "itemHrid": "/items/silk_hat",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/silk_robe_top",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/silk_robe_bottoms",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/silk_gloves",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/silk_boots",
                        "count": 24
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/redwood_water_staff",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/arcane_water_staff",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/redwood_nature_staff",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/arcane_nature_staff",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/redwood_fire_staff",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/arcane_fire_staff",
                        "count": 16
                    },
                    {
                        "itemHrid": "/items/silk_hat",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/silk_robe_top",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/silk_robe_bottoms",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/silk_gloves",
                        "count": 48
                    },
                    {
                        "itemHrid": "/items/silk_boots",
                        "count": 48
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/arcane_water_staff",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/arcane_nature_staff",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/arcane_fire_staff",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/radiant_hat",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/radiant_robe_top",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/radiant_robe_bottoms",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/radiant_gloves",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/radiant_boots",
                        "count": 40
                    },
                    {
                        "itemHrid": "/items/super_magic_coffee",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 17
        },
        "/house_rooms/observatory": {
            "hrid": "/house_rooms/observatory",
            "name": "Observatory",
            "skillHrid": "/skills/enhancing",
            "usableInActionTypeMap": {
                "/action_types/enhancing": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_action_speed",
                    "typeHrid": "/buff_types/action_speed",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.01,
                    "flatBoostLevelBonus": 0.01,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_enhancing_success",
                    "typeHrid": "/buff_types/enhancing_success",
                    "ratioBoost": 0.0005,
                    "ratioBoostLevelBonus": 0.0005,
                    "flatBoost": 0,
                    "flatBoostLevelBonus": 0,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/swamp_essence",
                        "count": 750
                    },
                    {
                        "itemHrid": "/items/cheese_enhancer",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/swamp_essence",
                        "count": 1500
                    },
                    {
                        "itemHrid": "/items/aqua_essence",
                        "count": 1500
                    },
                    {
                        "itemHrid": "/items/cheese_enhancer",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_enhancer",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/aqua_essence",
                        "count": 3000
                    },
                    {
                        "itemHrid": "/items/jungle_essence",
                        "count": 3000
                    },
                    {
                        "itemHrid": "/items/verdant_enhancer",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_enhancer",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/jungle_essence",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/gobo_essence",
                        "count": 6000
                    },
                    {
                        "itemHrid": "/items/azure_enhancer",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_enhancer",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/enhancing_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/gobo_essence",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/eyessence",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/burble_enhancer",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_enhancer",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/eyessence",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/sorcerer_essence",
                        "count": 24000
                    },
                    {
                        "itemHrid": "/items/crimson_enhancer",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_enhancer",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/sorcerer_essence",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/bear_essence",
                        "count": 48000
                    },
                    {
                        "itemHrid": "/items/rainbow_enhancer",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_enhancer",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/bear_essence",
                        "count": 120000
                    },
                    {
                        "itemHrid": "/items/holy_enhancer",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_enhancing_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 10
        },
        "/house_rooms/sewing_parlor": {
            "hrid": "/house_rooms/sewing_parlor",
            "name": "Sewing Parlor",
            "skillHrid": "/skills/tailoring",
            "usableInActionTypeMap": {
                "/action_types/tailoring": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 75
                    },
                    {
                        "itemHrid": "/items/rough_leather",
                        "count": 180
                    },
                    {
                        "itemHrid": "/items/cotton_fabric",
                        "count": 180
                    },
                    {
                        "itemHrid": "/items/cheese_needle",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 150
                    },
                    {
                        "itemHrid": "/items/rough_leather",
                        "count": 360
                    },
                    {
                        "itemHrid": "/items/reptile_leather",
                        "count": 360
                    },
                    {
                        "itemHrid": "/items/cotton_fabric",
                        "count": 360
                    },
                    {
                        "itemHrid": "/items/linen_fabric",
                        "count": 360
                    },
                    {
                        "itemHrid": "/items/cheese_needle",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_needle",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 300
                    },
                    {
                        "itemHrid": "/items/reptile_leather",
                        "count": 1440
                    },
                    {
                        "itemHrid": "/items/linen_fabric",
                        "count": 1440
                    },
                    {
                        "itemHrid": "/items/verdant_needle",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_needle",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 600
                    },
                    {
                        "itemHrid": "/items/reptile_leather",
                        "count": 1440
                    },
                    {
                        "itemHrid": "/items/gobo_leather",
                        "count": 1440
                    },
                    {
                        "itemHrid": "/items/linen_fabric",
                        "count": 1440
                    },
                    {
                        "itemHrid": "/items/bamboo_fabric",
                        "count": 1440
                    },
                    {
                        "itemHrid": "/items/azure_needle",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_needle",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/tailoring_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 1200
                    },
                    {
                        "itemHrid": "/items/gobo_leather",
                        "count": 5760
                    },
                    {
                        "itemHrid": "/items/bamboo_fabric",
                        "count": 5760
                    },
                    {
                        "itemHrid": "/items/burble_needle",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_needle",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 2400
                    },
                    {
                        "itemHrid": "/items/gobo_leather",
                        "count": 5760
                    },
                    {
                        "itemHrid": "/items/beast_leather",
                        "count": 5760
                    },
                    {
                        "itemHrid": "/items/bamboo_fabric",
                        "count": 5760
                    },
                    {
                        "itemHrid": "/items/silk_fabric",
                        "count": 5760
                    },
                    {
                        "itemHrid": "/items/crimson_needle",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_needle",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 4800
                    },
                    {
                        "itemHrid": "/items/beast_leather",
                        "count": 11520
                    },
                    {
                        "itemHrid": "/items/umbral_leather",
                        "count": 11520
                    },
                    {
                        "itemHrid": "/items/silk_fabric",
                        "count": 11520
                    },
                    {
                        "itemHrid": "/items/radiant_fabric",
                        "count": 11520
                    },
                    {
                        "itemHrid": "/items/rainbow_needle",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_needle",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 12000
                    },
                    {
                        "itemHrid": "/items/umbral_leather",
                        "count": 28800
                    },
                    {
                        "itemHrid": "/items/radiant_fabric",
                        "count": 28800
                    },
                    {
                        "itemHrid": "/items/holy_needle",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_tailoring_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 6
        },
        "/house_rooms/workshop": {
            "hrid": "/house_rooms/workshop",
            "name": "Workshop",
            "skillHrid": "/skills/crafting",
            "usableInActionTypeMap": {
                "/action_types/crafting": true
            },
            "actionBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_efficiency",
                    "typeHrid": "/buff_types/efficiency",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.015,
                    "flatBoostLevelBonus": 0.015,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "globalBuffs": [
                {
                    "uniqueHrid": "/buff_uniques/house_experience",
                    "typeHrid": "/buff_types/wisdom",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.0005,
                    "flatBoostLevelBonus": 0.0005,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                },
                {
                    "uniqueHrid": "/buff_uniques/house_rare_find",
                    "typeHrid": "/buff_types/rare_find",
                    "ratioBoost": 0,
                    "ratioBoostLevelBonus": 0,
                    "flatBoost": 0.002,
                    "flatBoostLevelBonus": 0.002,
                    "startTime": "0001-01-01T00:00:00Z",
                    "duration": 0
                }
            ],
            "upgradeCostsMap": {
                "1": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 500000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 450
                    },
                    {
                        "itemHrid": "/items/cheese_chisel",
                        "count": 6
                    }
                ],
                "2": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 2000000
                    },
                    {
                        "itemHrid": "/items/lumber",
                        "count": 900
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 900
                    },
                    {
                        "itemHrid": "/items/cheese_chisel",
                        "count": 9
                    },
                    {
                        "itemHrid": "/items/verdant_chisel",
                        "count": 9
                    }
                ],
                "3": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 5000000
                    },
                    {
                        "itemHrid": "/items/birch_lumber",
                        "count": 1800
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 1800
                    },
                    {
                        "itemHrid": "/items/verdant_chisel",
                        "count": 12
                    },
                    {
                        "itemHrid": "/items/azure_chisel",
                        "count": 12
                    }
                ],
                "4": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 12000000
                    },
                    {
                        "itemHrid": "/items/cedar_lumber",
                        "count": 3600
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 3600
                    },
                    {
                        "itemHrid": "/items/azure_chisel",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/burble_chisel",
                        "count": 15
                    },
                    {
                        "itemHrid": "/items/crafting_tea",
                        "count": 1000
                    }
                ],
                "5": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 25000000
                    },
                    {
                        "itemHrid": "/items/purpleheart_lumber",
                        "count": 7200
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 7200
                    },
                    {
                        "itemHrid": "/items/burble_chisel",
                        "count": 18
                    },
                    {
                        "itemHrid": "/items/crimson_chisel",
                        "count": 18
                    }
                ],
                "6": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 50000000
                    },
                    {
                        "itemHrid": "/items/ginkgo_lumber",
                        "count": 14400
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 14400
                    },
                    {
                        "itemHrid": "/items/crimson_chisel",
                        "count": 21
                    },
                    {
                        "itemHrid": "/items/rainbow_chisel",
                        "count": 21
                    }
                ],
                "7": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 90000000
                    },
                    {
                        "itemHrid": "/items/redwood_lumber",
                        "count": 28800
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 28800
                    },
                    {
                        "itemHrid": "/items/rainbow_chisel",
                        "count": 24
                    },
                    {
                        "itemHrid": "/items/holy_chisel",
                        "count": 24
                    }
                ],
                "8": [
                    {
                        "itemHrid": "/items/coin",
                        "count": 160000000
                    },
                    {
                        "itemHrid": "/items/arcane_lumber",
                        "count": 72000
                    },
                    {
                        "itemHrid": "/items/holy_chisel",
                        "count": 60
                    },
                    {
                        "itemHrid": "/items/super_crafting_tea",
                        "count": 2000
                    }
                ]
            },
            "sortIndex": 5
        }
    };

    const houseRoomNamesCN = {
        "/house_rooms/dairy_barn": "\u5976\u725b\u68da",
        "/house_rooms/garden": "\u82b1\u56ed",
        "/house_rooms/log_shed": "\u6728\u68da",
        "/house_rooms/forge": "\u953b\u9020\u53f0",
        "/house_rooms/workshop": "\u5de5\u4f5c\u95f4",
        "/house_rooms/sewing_parlor": "\u7f1d\u7eab\u5ba4",
        "/house_rooms/kitchen": "\u53a8\u623f",
        "/house_rooms/brewery": "\u51b2\u6ce1\u574a",
        "/house_rooms/laboratory": "\u5b9e\u9a8c\u5ba4",
        "/house_rooms/observatory": "\u5929\u6587\u53f0",
        "/house_rooms/dining_room": "\u9910\u5385",
        "/house_rooms/library": "\u56fe\u4e66\u9986",
        "/house_rooms/dojo": "\u9053\u573a",
        "/house_rooms/armory": "\u519b\u68b0\u5e93",
        "/house_rooms/gym": "\u5065\u8eab\u623f",
        "/house_rooms/archery_range": "\u5c04\u7bad\u573a",
        "/house_rooms/mystical_study": "\u795e\u79d8\u7814\u7a76\u5ba4"
    };

    const itemsNameCN = {
        "/items/coin": "\u91d1\u5e01",
        "/items/task_token": "\u4efb\u52a1\u4ee3\u5e01",
        "/items/chimerical_token": "\u5947\u5e7b\u4ee3\u5e01",
        "/items/sinister_token": "\u9634\u68ee\u4ee3\u5e01",
        "/items/enchanted_token": "\u79d8\u6cd5\u4ee3\u5e01",
        "/items/pirate_token": "\u6d77\u76d7\u4ee3\u5e01",
        "/items/cowbell": "\u725b\u94c3",
        "/items/bag_of_10_cowbells": "\u725b\u94c3\u888b (10\u4e2a)",
        "/items/purples_gift": "\u5c0f\u7d2b\u725b\u7684\u793c\u7269",
        "/items/small_meteorite_cache": "\u5c0f\u9668\u77f3\u8231",
        "/items/medium_meteorite_cache": "\u4e2d\u9668\u77f3\u8231",
        "/items/large_meteorite_cache": "\u5927\u9668\u77f3\u8231",
        "/items/small_artisans_crate": "\u5c0f\u5de5\u5320\u5323",
        "/items/medium_artisans_crate": "\u4e2d\u5de5\u5320\u5323",
        "/items/large_artisans_crate": "\u5927\u5de5\u5320\u5323",
        "/items/small_treasure_chest": "\u5c0f\u5b9d\u7bb1",
        "/items/medium_treasure_chest": "\u4e2d\u5b9d\u7bb1",
        "/items/large_treasure_chest": "\u5927\u5b9d\u7bb1",
        "/items/chimerical_chest": "\u5947\u5e7b\u5b9d\u7bb1",
        "/items/chimerical_refinement_chest": "\u5947\u5e7b\u7cbe\u70bc\u5b9d\u7bb1",
        "/items/sinister_chest": "\u9634\u68ee\u5b9d\u7bb1",
        "/items/sinister_refinement_chest": "\u9634\u68ee\u7cbe\u70bc\u5b9d\u7bb1",
        "/items/enchanted_chest": "\u79d8\u6cd5\u5b9d\u7bb1",
        "/items/enchanted_refinement_chest": "\u79d8\u6cd5\u7cbe\u70bc\u5b9d\u7bb1",
        "/items/pirate_chest": "\u6d77\u76d7\u5b9d\u7bb1",
        "/items/pirate_refinement_chest": "\u6d77\u76d7\u7cbe\u70bc\u5b9d\u7bb1",
        "/items/blue_key_fragment": "\u84dd\u8272\u94a5\u5319\u788e\u7247",
        "/items/green_key_fragment": "\u7eff\u8272\u94a5\u5319\u788e\u7247",
        "/items/purple_key_fragment": "\u7d2b\u8272\u94a5\u5319\u788e\u7247",
        "/items/white_key_fragment": "\u767d\u8272\u94a5\u5319\u788e\u7247",
        "/items/orange_key_fragment": "\u6a59\u8272\u94a5\u5319\u788e\u7247",
        "/items/brown_key_fragment": "\u68d5\u8272\u94a5\u5319\u788e\u7247",
        "/items/stone_key_fragment": "\u77f3\u5934\u94a5\u5319\u788e\u7247",
        "/items/dark_key_fragment": "\u9ed1\u6697\u94a5\u5319\u788e\u7247",
        "/items/burning_key_fragment": "\u71c3\u70e7\u94a5\u5319\u788e\u7247",
        "/items/chimerical_entry_key": "\u5947\u5e7b\u94a5\u5319",
        "/items/chimerical_chest_key": "\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319",
        "/items/sinister_entry_key": "\u9634\u68ee\u94a5\u5319",
        "/items/sinister_chest_key": "\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319",
        "/items/enchanted_entry_key": "\u79d8\u6cd5\u94a5\u5319",
        "/items/enchanted_chest_key": "\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319",
        "/items/pirate_entry_key": "\u6d77\u76d7\u94a5\u5319",
        "/items/pirate_chest_key": "\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319",
        "/items/donut": "\u751c\u751c\u5708",
        "/items/blueberry_donut": "\u84dd\u8393\u751c\u751c\u5708",
        "/items/blackberry_donut": "\u9ed1\u8393\u751c\u751c\u5708",
        "/items/strawberry_donut": "\u8349\u8393\u751c\u751c\u5708",
        "/items/mooberry_donut": "\u54de\u8393\u751c\u751c\u5708",
        "/items/marsberry_donut": "\u706b\u661f\u8393\u751c\u751c\u5708",
        "/items/spaceberry_donut": "\u592a\u7a7a\u8393\u751c\u751c\u5708",
        "/items/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
        "/items/blueberry_cake": "\u84dd\u8393\u86cb\u7cd5",
        "/items/blackberry_cake": "\u9ed1\u8393\u86cb\u7cd5",
        "/items/strawberry_cake": "\u8349\u8393\u86cb\u7cd5",
        "/items/mooberry_cake": "\u54de\u8393\u86cb\u7cd5",
        "/items/marsberry_cake": "\u706b\u661f\u8393\u86cb\u7cd5",
        "/items/spaceberry_cake": "\u592a\u7a7a\u8393\u86cb\u7cd5",
        "/items/gummy": "\u8f6f\u7cd6",
        "/items/apple_gummy": "\u82f9\u679c\u8f6f\u7cd6",
        "/items/orange_gummy": "\u6a59\u5b50\u8f6f\u7cd6",
        "/items/plum_gummy": "\u674e\u5b50\u8f6f\u7cd6",
        "/items/peach_gummy": "\u6843\u5b50\u8f6f\u7cd6",
        "/items/dragon_fruit_gummy": "\u706b\u9f99\u679c\u8f6f\u7cd6",
        "/items/star_fruit_gummy": "\u6768\u6843\u8f6f\u7cd6",
        "/items/yogurt": "\u9178\u5976",
        "/items/apple_yogurt": "\u82f9\u679c\u9178\u5976",
        "/items/orange_yogurt": "\u6a59\u5b50\u9178\u5976",
        "/items/plum_yogurt": "\u674e\u5b50\u9178\u5976",
        "/items/peach_yogurt": "\u6843\u5b50\u9178\u5976",
        "/items/dragon_fruit_yogurt": "\u706b\u9f99\u679c\u9178\u5976",
        "/items/star_fruit_yogurt": "\u6768\u6843\u9178\u5976",
        "/items/milking_tea": "\u6324\u5976\u8336",
        "/items/foraging_tea": "\u91c7\u6458\u8336",
        "/items/woodcutting_tea": "\u4f10\u6728\u8336",
        "/items/cooking_tea": "\u70f9\u996a\u8336",
        "/items/brewing_tea": "\u51b2\u6ce1\u8336",
        "/items/alchemy_tea": "\u70bc\u91d1\u8336",
        "/items/enhancing_tea": "\u5f3a\u5316\u8336",
        "/items/cheesesmithing_tea": "\u5976\u916a\u953b\u9020\u8336",
        "/items/crafting_tea": "\u5236\u4f5c\u8336",
        "/items/tailoring_tea": "\u7f1d\u7eab\u8336",
        "/items/super_milking_tea": "\u8d85\u7ea7\u6324\u5976\u8336",
        "/items/super_foraging_tea": "\u8d85\u7ea7\u91c7\u6458\u8336",
        "/items/super_woodcutting_tea": "\u8d85\u7ea7\u4f10\u6728\u8336",
        "/items/super_cooking_tea": "\u8d85\u7ea7\u70f9\u996a\u8336",
        "/items/super_brewing_tea": "\u8d85\u7ea7\u51b2\u6ce1\u8336",
        "/items/super_alchemy_tea": "\u8d85\u7ea7\u70bc\u91d1\u8336",
        "/items/super_enhancing_tea": "\u8d85\u7ea7\u5f3a\u5316\u8336",
        "/items/super_cheesesmithing_tea": "\u8d85\u7ea7\u5976\u916a\u953b\u9020\u8336",
        "/items/super_crafting_tea": "\u8d85\u7ea7\u5236\u4f5c\u8336",
        "/items/super_tailoring_tea": "\u8d85\u7ea7\u7f1d\u7eab\u8336",
        "/items/ultra_milking_tea": "\u7a76\u6781\u6324\u5976\u8336",
        "/items/ultra_foraging_tea": "\u7a76\u6781\u91c7\u6458\u8336",
        "/items/ultra_woodcutting_tea": "\u7a76\u6781\u4f10\u6728\u8336",
        "/items/ultra_cooking_tea": "\u7a76\u6781\u70f9\u996a\u8336",
        "/items/ultra_brewing_tea": "\u7a76\u6781\u51b2\u6ce1\u8336",
        "/items/ultra_alchemy_tea": "\u7a76\u6781\u70bc\u91d1\u8336",
        "/items/ultra_enhancing_tea": "\u7a76\u6781\u5f3a\u5316\u8336",
        "/items/ultra_cheesesmithing_tea": "\u7a76\u6781\u5976\u916a\u953b\u9020\u8336",
        "/items/ultra_crafting_tea": "\u7a76\u6781\u5236\u4f5c\u8336",
        "/items/ultra_tailoring_tea": "\u7a76\u6781\u7f1d\u7eab\u8336",
        "/items/gathering_tea": "\u91c7\u96c6\u8336",
        "/items/gourmet_tea": "\u7f8e\u98df\u8336",
        "/items/wisdom_tea": "\u7ecf\u9a8c\u8336",
        "/items/processing_tea": "\u52a0\u5de5\u8336",
        "/items/efficiency_tea": "\u6548\u7387\u8336",
        "/items/artisan_tea": "\u5de5\u5320\u8336",
        "/items/catalytic_tea": "\u50ac\u5316\u8336",
        "/items/blessed_tea": "\u798f\u6c14\u8336",
        "/items/stamina_coffee": "\u8010\u529b\u5496\u5561",
        "/items/intelligence_coffee": "\u667a\u529b\u5496\u5561",
        "/items/defense_coffee": "\u9632\u5fa1\u5496\u5561",
        "/items/attack_coffee": "\u653b\u51fb\u5496\u5561",
        "/items/melee_coffee": "\u8fd1\u6218\u5496\u5561",
        "/items/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
        "/items/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
        "/items/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
        "/items/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
        "/items/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
        "/items/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
        "/items/super_melee_coffee": "\u8d85\u7ea7\u8fd1\u6218\u5496\u5561",
        "/items/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
        "/items/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
        "/items/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
        "/items/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
        "/items/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
        "/items/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
        "/items/ultra_melee_coffee": "\u7a76\u6781\u8fd1\u6218\u5496\u5561",
        "/items/ultra_ranged_coffee": "\u7a76\u6781\u8fdc\u7a0b\u5496\u5561",
        "/items/ultra_magic_coffee": "\u7a76\u6781\u9b54\u6cd5\u5496\u5561",
        "/items/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561",
        "/items/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
        "/items/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
        "/items/channeling_coffee": "\u541f\u5531\u5496\u5561",
        "/items/critical_coffee": "\u66b4\u51fb\u5496\u5561",
        "/items/poke": "\u7834\u80c6\u4e4b\u523a",
        "/items/impale": "\u900f\u9aa8\u4e4b\u523a",
        "/items/puncture": "\u7834\u7532\u4e4b\u523a",
        "/items/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
        "/items/scratch": "\u722a\u5f71\u65a9",
        "/items/cleave": "\u5206\u88c2\u65a9",
        "/items/maim": "\u8840\u5203\u65a9",
        "/items/crippling_slash": "\u81f4\u6b8b\u65a9",
        "/items/smack": "\u91cd\u78be",
        "/items/sweep": "\u91cd\u626b",
        "/items/stunning_blow": "\u91cd\u9524",
        "/items/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
        "/items/shield_bash": "\u76fe\u51fb",
        "/items/quick_shot": "\u5feb\u901f\u5c04\u51fb",
        "/items/aqua_arrow": "\u6d41\u6c34\u7bad",
        "/items/flame_arrow": "\u70c8\u7130\u7bad",
        "/items/rain_of_arrows": "\u7bad\u96e8",
        "/items/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
        "/items/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
        "/items/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
        "/items/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
        "/items/water_strike": "\u6d41\u6c34\u51b2\u51fb",
        "/items/ice_spear": "\u51b0\u67aa\u672f",
        "/items/frost_surge": "\u51b0\u971c\u7206\u88c2",
        "/items/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
        "/items/entangle": "\u7f20\u7ed5",
        "/items/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
        "/items/natures_veil": "\u81ea\u7136\u83cc\u5e55",
        "/items/life_drain": "\u751f\u547d\u5438\u53d6",
        "/items/fireball": "\u706b\u7403",
        "/items/flame_blast": "\u7194\u5ca9\u7206\u88c2",
        "/items/firestorm": "\u706b\u7130\u98ce\u66b4",
        "/items/smoke_burst": "\u70df\u7206\u706d\u5f71",
        "/items/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
        "/items/heal": "\u81ea\u6108\u672f",
        "/items/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
        "/items/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
        "/items/taunt": "\u5632\u8bbd",
        "/items/provoke": "\u6311\u8845",
        "/items/toughness": "\u575a\u97e7",
        "/items/elusiveness": "\u95ea\u907f",
        "/items/precision": "\u7cbe\u786e",
        "/items/berserk": "\u72c2\u66b4",
        "/items/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
        "/items/frenzy": "\u72c2\u901f",
        "/items/spike_shell": "\u5c16\u523a\u9632\u62a4",
        "/items/retribution": "\u60e9\u6212",
        "/items/vampirism": "\u5438\u8840",
        "/items/revive": "\u590d\u6d3b",
        "/items/insanity": "\u75af\u72c2",
        "/items/invincible": "\u65e0\u654c",
        "/items/speed_aura": "\u901f\u5ea6\u5149\u73af",
        "/items/guardian_aura": "\u5b88\u62a4\u5149\u73af",
        "/items/fierce_aura": "\u7269\u7406\u5149\u73af",
        "/items/critical_aura": "\u66b4\u51fb\u5149\u73af",
        "/items/mystic_aura": "\u5143\u7d20\u5149\u73af",
        "/items/gobo_stabber": "\u54e5\u5e03\u6797\u957f\u5251",
        "/items/gobo_slasher": "\u54e5\u5e03\u6797\u5173\u5200",
        "/items/gobo_smasher": "\u54e5\u5e03\u6797\u72fc\u7259\u68d2",
        "/items/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
        "/items/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
        "/items/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
        "/items/griffin_bulwark_refined": "\u72ee\u9e6b\u91cd\u76fe\uff08\u7cbe\uff09",
        "/items/gobo_shooter": "\u54e5\u5e03\u6797\u5f39\u5f13",
        "/items/vampiric_bow": "\u5438\u8840\u5f13",
        "/items/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
        "/items/cursed_bow_refined": "\u5492\u6028\u4e4b\u5f13\uff08\u7cbe\uff09",
        "/items/gobo_boomstick": "\u54e5\u5e03\u6797\u706b\u68cd",
        "/items/cheese_bulwark": "\u5976\u916a\u91cd\u76fe",
        "/items/verdant_bulwark": "\u7fe0\u7eff\u91cd\u76fe",
        "/items/azure_bulwark": "\u851a\u84dd\u91cd\u76fe",
        "/items/burble_bulwark": "\u6df1\u7d2b\u91cd\u76fe",
        "/items/crimson_bulwark": "\u7edb\u7ea2\u91cd\u76fe",
        "/items/rainbow_bulwark": "\u5f69\u8679\u91cd\u76fe",
        "/items/holy_bulwark": "\u795e\u5723\u91cd\u76fe",
        "/items/wooden_bow": "\u6728\u5f13",
        "/items/birch_bow": "\u6866\u6728\u5f13",
        "/items/cedar_bow": "\u96ea\u677e\u5f13",
        "/items/purpleheart_bow": "\u7d2b\u5fc3\u5f13",
        "/items/ginkgo_bow": "\u94f6\u674f\u5f13",
        "/items/redwood_bow": "\u7ea2\u6749\u5f13",
        "/items/arcane_bow": "\u795e\u79d8\u5f13",
        "/items/stalactite_spear": "\u77f3\u949f\u957f\u67aa",
        "/items/granite_bludgeon": "\u82b1\u5c97\u5ca9\u5927\u68d2",
        "/items/furious_spear": "\u72c2\u6012\u957f\u67aa",
        "/items/furious_spear_refined": "\u72c2\u6012\u957f\u67aa\uff08\u7cbe\uff09",
        "/items/regal_sword": "\u541b\u738b\u4e4b\u5251",
        "/items/regal_sword_refined": "\u541b\u738b\u4e4b\u5251\uff08\u7cbe\uff09",
        "/items/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
        "/items/chaotic_flail_refined": "\u6df7\u6c8c\u8fde\u67b7\uff08\u7cbe\uff09",
        "/items/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
        "/items/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
        "/items/sundering_crossbow_refined": "\u88c2\u7a7a\u4e4b\u5f29\uff08\u7cbe\uff09",
        "/items/frost_staff": "\u51b0\u971c\u6cd5\u6756",
        "/items/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
        "/items/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
        "/items/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
        "/items/rippling_trident_refined": "\u6d9f\u6f2a\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
        "/items/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
        "/items/blooming_trident_refined": "\u7efd\u653e\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
        "/items/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
        "/items/blazing_trident_refined": "\u70bd\u7130\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
        "/items/cheese_sword": "\u5976\u916a\u5251",
        "/items/verdant_sword": "\u7fe0\u7eff\u5251",
        "/items/azure_sword": "\u851a\u84dd\u5251",
        "/items/burble_sword": "\u6df1\u7d2b\u5251",
        "/items/crimson_sword": "\u7edb\u7ea2\u5251",
        "/items/rainbow_sword": "\u5f69\u8679\u5251",
        "/items/holy_sword": "\u795e\u5723\u5251",
        "/items/cheese_spear": "\u5976\u916a\u957f\u67aa",
        "/items/verdant_spear": "\u7fe0\u7eff\u957f\u67aa",
        "/items/azure_spear": "\u851a\u84dd\u957f\u67aa",
        "/items/burble_spear": "\u6df1\u7d2b\u957f\u67aa",
        "/items/crimson_spear": "\u7edb\u7ea2\u957f\u67aa",
        "/items/rainbow_spear": "\u5f69\u8679\u957f\u67aa",
        "/items/holy_spear": "\u795e\u5723\u957f\u67aa",
        "/items/cheese_mace": "\u5976\u916a\u9489\u5934\u9524",
        "/items/verdant_mace": "\u7fe0\u7eff\u9489\u5934\u9524",
        "/items/azure_mace": "\u851a\u84dd\u9489\u5934\u9524",
        "/items/burble_mace": "\u6df1\u7d2b\u9489\u5934\u9524",
        "/items/crimson_mace": "\u7edb\u7ea2\u9489\u5934\u9524",
        "/items/rainbow_mace": "\u5f69\u8679\u9489\u5934\u9524",
        "/items/holy_mace": "\u795e\u5723\u9489\u5934\u9524",
        "/items/wooden_crossbow": "\u6728\u5f29",
        "/items/birch_crossbow": "\u6866\u6728\u5f29",
        "/items/cedar_crossbow": "\u96ea\u677e\u5f29",
        "/items/purpleheart_crossbow": "\u7d2b\u5fc3\u5f29",
        "/items/ginkgo_crossbow": "\u94f6\u674f\u5f29",
        "/items/redwood_crossbow": "\u7ea2\u6749\u5f29",
        "/items/arcane_crossbow": "\u795e\u79d8\u5f29",
        "/items/wooden_water_staff": "\u6728\u5236\u6c34\u6cd5\u6756",
        "/items/birch_water_staff": "\u6866\u6728\u6c34\u6cd5\u6756",
        "/items/cedar_water_staff": "\u96ea\u677e\u6c34\u6cd5\u6756",
        "/items/purpleheart_water_staff": "\u7d2b\u5fc3\u6c34\u6cd5\u6756",
        "/items/ginkgo_water_staff": "\u94f6\u674f\u6c34\u6cd5\u6756",
        "/items/redwood_water_staff": "\u7ea2\u6749\u6c34\u6cd5\u6756",
        "/items/arcane_water_staff": "\u795e\u79d8\u6c34\u6cd5\u6756",
        "/items/wooden_nature_staff": "\u6728\u5236\u81ea\u7136\u6cd5\u6756",
        "/items/birch_nature_staff": "\u6866\u6728\u81ea\u7136\u6cd5\u6756",
        "/items/cedar_nature_staff": "\u96ea\u677e\u81ea\u7136\u6cd5\u6756",
        "/items/purpleheart_nature_staff": "\u7d2b\u5fc3\u81ea\u7136\u6cd5\u6756",
        "/items/ginkgo_nature_staff": "\u94f6\u674f\u81ea\u7136\u6cd5\u6756",
        "/items/redwood_nature_staff": "\u7ea2\u6749\u81ea\u7136\u6cd5\u6756",
        "/items/arcane_nature_staff": "\u795e\u79d8\u81ea\u7136\u6cd5\u6756",
        "/items/wooden_fire_staff": "\u6728\u5236\u706b\u6cd5\u6756",
        "/items/birch_fire_staff": "\u6866\u6728\u706b\u6cd5\u6756",
        "/items/cedar_fire_staff": "\u96ea\u677e\u706b\u6cd5\u6756",
        "/items/purpleheart_fire_staff": "\u7d2b\u5fc3\u706b\u6cd5\u6756",
        "/items/ginkgo_fire_staff": "\u94f6\u674f\u706b\u6cd5\u6756",
        "/items/redwood_fire_staff": "\u7ea2\u6749\u706b\u6cd5\u6756",
        "/items/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
        "/items/eye_watch": "\u638c\u4e0a\u76d1\u5de5",
        "/items/snake_fang_dirk": "\u86c7\u7259\u77ed\u5251",
        "/items/vision_shield": "\u89c6\u89c9\u76fe",
        "/items/gobo_defender": "\u54e5\u5e03\u6797\u9632\u5fa1\u8005",
        "/items/vampire_fang_dirk": "\u5438\u8840\u9b3c\u77ed\u5251",
        "/items/knights_aegis": "\u9a91\u58eb\u76fe",
        "/items/knights_aegis_refined": "\u9a91\u58eb\u76fe\uff08\u7cbe\uff09",
        "/items/treant_shield": "\u6811\u4eba\u76fe",
        "/items/manticore_shield": "\u874e\u72ee\u76fe",
        "/items/tome_of_healing": "\u6cbb\u7597\u4e4b\u4e66",
        "/items/tome_of_the_elements": "\u5143\u7d20\u4e4b\u4e66",
        "/items/watchful_relic": "\u8b66\u6212\u9057\u7269",
        "/items/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
        "/items/bishops_codex_refined": "\u4e3b\u6559\u6cd5\u5178\uff08\u7cbe\uff09",
        "/items/cheese_buckler": "\u5976\u916a\u5706\u76fe",
        "/items/verdant_buckler": "\u7fe0\u7eff\u5706\u76fe",
        "/items/azure_buckler": "\u851a\u84dd\u5706\u76fe",
        "/items/burble_buckler": "\u6df1\u7d2b\u5706\u76fe",
        "/items/crimson_buckler": "\u7edb\u7ea2\u5706\u76fe",
        "/items/rainbow_buckler": "\u5f69\u8679\u5706\u76fe",
        "/items/holy_buckler": "\u795e\u5723\u5706\u76fe",
        "/items/wooden_shield": "\u6728\u76fe",
        "/items/birch_shield": "\u6866\u6728\u76fe",
        "/items/cedar_shield": "\u96ea\u677e\u76fe",
        "/items/purpleheart_shield": "\u7d2b\u5fc3\u76fe",
        "/items/ginkgo_shield": "\u94f6\u674f\u76fe",
        "/items/redwood_shield": "\u7ea2\u6749\u76fe",
        "/items/arcane_shield": "\u795e\u79d8\u76fe",
        "/items/sinister_cape": "\u9634\u68ee\u6597\u7bf7",
        "/items/sinister_cape_refined": "\u9634\u68ee\u6597\u7bf7\uff08\u7cbe\uff09",
        "/items/chimerical_quiver": "\u5947\u5e7b\u7bad\u888b",
        "/items/chimerical_quiver_refined": "\u5947\u5e7b\u7bad\u888b\uff08\u7cbe\uff09",
        "/items/enchanted_cloak": "\u79d8\u6cd5\u62ab\u98ce",
        "/items/enchanted_cloak_refined": "\u79d8\u6cd5\u62ab\u98ce\uff08\u7cbe\uff09",
        "/items/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
        "/items/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
        "/items/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
        "/items/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
        "/items/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
        "/items/corsair_helmet_refined": "\u63a0\u593a\u8005\u5934\u76d4\uff08\u7cbe\uff09",
        "/items/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
        "/items/acrobatic_hood_refined": "\u6742\u6280\u5e08\u515c\u5e3d\uff08\u7cbe\uff09",
        "/items/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
        "/items/magicians_hat_refined": "\u9b54\u672f\u5e08\u5e3d\uff08\u7cbe\uff09",
        "/items/cheese_helmet": "\u5976\u916a\u5934\u76d4",
        "/items/verdant_helmet": "\u7fe0\u7eff\u5934\u76d4",
        "/items/azure_helmet": "\u851a\u84dd\u5934\u76d4",
        "/items/burble_helmet": "\u6df1\u7d2b\u5934\u76d4",
        "/items/crimson_helmet": "\u7edb\u7ea2\u5934\u76d4",
        "/items/rainbow_helmet": "\u5f69\u8679\u5934\u76d4",
        "/items/holy_helmet": "\u795e\u5723\u5934\u76d4",
        "/items/rough_hood": "\u7c97\u7cd9\u515c\u5e3d",
        "/items/reptile_hood": "\u722c\u884c\u52a8\u7269\u515c\u5e3d",
        "/items/gobo_hood": "\u54e5\u5e03\u6797\u515c\u5e3d",
        "/items/beast_hood": "\u91ce\u517d\u515c\u5e3d",
        "/items/umbral_hood": "\u6697\u5f71\u515c\u5e3d",
        "/items/cotton_hat": "\u68c9\u5e3d",
        "/items/linen_hat": "\u4e9a\u9ebb\u5e3d",
        "/items/bamboo_hat": "\u7af9\u5e3d",
        "/items/silk_hat": "\u4e1d\u5e3d",
        "/items/radiant_hat": "\u5149\u8f89\u5e3d",
        "/items/dairyhands_top": "\u6324\u5976\u5de5\u4e0a\u8863",
        "/items/foragers_top": "\u91c7\u6458\u8005\u4e0a\u8863",
        "/items/lumberjacks_top": "\u4f10\u6728\u5de5\u4e0a\u8863",
        "/items/cheesemakers_top": "\u5976\u916a\u5e08\u4e0a\u8863",
        "/items/crafters_top": "\u5de5\u5320\u4e0a\u8863",
        "/items/tailors_top": "\u88c1\u7f1d\u4e0a\u8863",
        "/items/chefs_top": "\u53a8\u5e08\u4e0a\u8863",
        "/items/brewers_top": "\u996e\u54c1\u5e08\u4e0a\u8863",
        "/items/alchemists_top": "\u70bc\u91d1\u5e08\u4e0a\u8863",
        "/items/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
        "/items/gator_vest": "\u9cc4\u9c7c\u9a6c\u7532",
        "/items/turtle_shell_body": "\u9f9f\u58f3\u80f8\u7532",
        "/items/colossus_plate_body": "\u5de8\u50cf\u80f8\u7532",
        "/items/demonic_plate_body": "\u6076\u9b54\u80f8\u7532",
        "/items/anchorbound_plate_body": "\u951a\u5b9a\u80f8\u7532",
        "/items/anchorbound_plate_body_refined": "\u951a\u5b9a\u80f8\u7532\uff08\u7cbe\uff09",
        "/items/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
        "/items/maelstrom_plate_body_refined": "\u6012\u6d9b\u80f8\u7532\uff08\u7cbe\uff09",
        "/items/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
        "/items/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
        "/items/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
        "/items/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
        "/items/kraken_tunic_refined": "\u514b\u62c9\u80af\u76ae\u8863\uff08\u7cbe\uff09",
        "/items/icy_robe_top": "\u51b0\u971c\u888d\u670d",
        "/items/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
        "/items/luna_robe_top": "\u6708\u795e\u888d\u670d",
        "/items/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
        "/items/royal_water_robe_top_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
        "/items/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
        "/items/royal_nature_robe_top_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
        "/items/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
        "/items/royal_fire_robe_top_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
        "/items/cheese_plate_body": "\u5976\u916a\u80f8\u7532",
        "/items/verdant_plate_body": "\u7fe0\u7eff\u80f8\u7532",
        "/items/azure_plate_body": "\u851a\u84dd\u80f8\u7532",
        "/items/burble_plate_body": "\u6df1\u7d2b\u80f8\u7532",
        "/items/crimson_plate_body": "\u7edb\u7ea2\u80f8\u7532",
        "/items/rainbow_plate_body": "\u5f69\u8679\u80f8\u7532",
        "/items/holy_plate_body": "\u795e\u5723\u80f8\u7532",
        "/items/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
        "/items/reptile_tunic": "\u722c\u884c\u52a8\u7269\u76ae\u8863",
        "/items/gobo_tunic": "\u54e5\u5e03\u6797\u76ae\u8863",
        "/items/beast_tunic": "\u91ce\u517d\u76ae\u8863",
        "/items/umbral_tunic": "\u6697\u5f71\u76ae\u8863",
        "/items/cotton_robe_top": "\u68c9\u888d\u670d",
        "/items/linen_robe_top": "\u4e9a\u9ebb\u888d\u670d",
        "/items/bamboo_robe_top": "\u7af9\u888d\u670d",
        "/items/silk_robe_top": "\u4e1d\u7ef8\u888d\u670d",
        "/items/radiant_robe_top": "\u5149\u8f89\u888d\u670d",
        "/items/dairyhands_bottoms": "\u6324\u5976\u5de5\u4e0b\u88c5",
        "/items/foragers_bottoms": "\u91c7\u6458\u8005\u4e0b\u88c5",
        "/items/lumberjacks_bottoms": "\u4f10\u6728\u5de5\u4e0b\u88c5",
        "/items/cheesemakers_bottoms": "\u5976\u916a\u5e08\u4e0b\u88c5",
        "/items/crafters_bottoms": "\u5de5\u5320\u4e0b\u88c5",
        "/items/tailors_bottoms": "\u88c1\u7f1d\u4e0b\u88c5",
        "/items/chefs_bottoms": "\u53a8\u5e08\u4e0b\u88c5",
        "/items/brewers_bottoms": "\u996e\u54c1\u5e08\u4e0b\u88c5",
        "/items/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
        "/items/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
        "/items/turtle_shell_legs": "\u9f9f\u58f3\u817f\u7532",
        "/items/colossus_plate_legs": "\u5de8\u50cf\u817f\u7532",
        "/items/demonic_plate_legs": "\u6076\u9b54\u817f\u7532",
        "/items/anchorbound_plate_legs": "\u951a\u5b9a\u817f\u7532",
        "/items/anchorbound_plate_legs_refined": "\u951a\u5b9a\u817f\u7532\uff08\u7cbe\uff09",
        "/items/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
        "/items/maelstrom_plate_legs_refined": "\u6012\u6d9b\u817f\u7532\uff08\u7cbe\uff09",
        "/items/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
        "/items/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
        "/items/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
        "/items/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
        "/items/kraken_chaps_refined": "\u514b\u62c9\u80af\u76ae\u88e4\uff08\u7cbe\uff09",
        "/items/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
        "/items/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
        "/items/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
        "/items/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
        "/items/royal_water_robe_bottoms_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
        "/items/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
        "/items/royal_nature_robe_bottoms_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
        "/items/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
        "/items/royal_fire_robe_bottoms_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
        "/items/cheese_plate_legs": "\u5976\u916a\u817f\u7532",
        "/items/verdant_plate_legs": "\u7fe0\u7eff\u817f\u7532",
        "/items/azure_plate_legs": "\u851a\u84dd\u817f\u7532",
        "/items/burble_plate_legs": "\u6df1\u7d2b\u817f\u7532",
        "/items/crimson_plate_legs": "\u7edb\u7ea2\u817f\u7532",
        "/items/rainbow_plate_legs": "\u5f69\u8679\u817f\u7532",
        "/items/holy_plate_legs": "\u795e\u5723\u817f\u7532",
        "/items/rough_chaps": "\u7c97\u7cd9\u76ae\u88e4",
        "/items/reptile_chaps": "\u722c\u884c\u52a8\u7269\u76ae\u88e4",
        "/items/gobo_chaps": "\u54e5\u5e03\u6797\u76ae\u88e4",
        "/items/beast_chaps": "\u91ce\u517d\u76ae\u88e4",
        "/items/umbral_chaps": "\u6697\u5f71\u76ae\u88e4",
        "/items/cotton_robe_bottoms": "\u68c9\u888d\u88d9",
        "/items/linen_robe_bottoms": "\u4e9a\u9ebb\u888d\u88d9",
        "/items/bamboo_robe_bottoms": "\u7af9\u888d\u88d9",
        "/items/silk_robe_bottoms": "\u4e1d\u7ef8\u888d\u88d9",
        "/items/radiant_robe_bottoms": "\u5149\u8f89\u888d\u88d9",
        "/items/enchanted_gloves": "\u9644\u9b54\u624b\u5957",
        "/items/pincer_gloves": "\u87f9\u94b3\u624b\u5957",
        "/items/panda_gloves": "\u718a\u732b\u624b\u5957",
        "/items/magnetic_gloves": "\u78c1\u529b\u624b\u5957",
        "/items/dodocamel_gauntlets": "\u6e21\u6e21\u9a7c\u62a4\u624b",
        "/items/dodocamel_gauntlets_refined": "\u6e21\u6e21\u9a7c\u62a4\u624b\uff08\u7cbe\uff09",
        "/items/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
        "/items/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
        "/items/marksman_bracers_refined": "\u795e\u5c04\u62a4\u8155\uff08\u7cbe\uff09",
        "/items/chrono_gloves": "\u65f6\u7a7a\u624b\u5957",
        "/items/cheese_gauntlets": "\u5976\u916a\u62a4\u624b",
        "/items/verdant_gauntlets": "\u7fe0\u7eff\u62a4\u624b",
        "/items/azure_gauntlets": "\u851a\u84dd\u62a4\u624b",
        "/items/burble_gauntlets": "\u6df1\u7d2b\u62a4\u624b",
        "/items/crimson_gauntlets": "\u7edb\u7ea2\u62a4\u624b",
        "/items/rainbow_gauntlets": "\u5f69\u8679\u62a4\u624b",
        "/items/holy_gauntlets": "\u795e\u5723\u62a4\u624b",
        "/items/rough_bracers": "\u7c97\u7cd9\u62a4\u8155",
        "/items/reptile_bracers": "\u722c\u884c\u52a8\u7269\u62a4\u8155",
        "/items/gobo_bracers": "\u54e5\u5e03\u6797\u62a4\u8155",
        "/items/beast_bracers": "\u91ce\u517d\u62a4\u8155",
        "/items/umbral_bracers": "\u6697\u5f71\u62a4\u8155",
        "/items/cotton_gloves": "\u68c9\u624b\u5957",
        "/items/linen_gloves": "\u4e9a\u9ebb\u624b\u5957",
        "/items/bamboo_gloves": "\u7af9\u624b\u5957",
        "/items/silk_gloves": "\u4e1d\u624b\u5957",
        "/items/radiant_gloves": "\u5149\u8f89\u624b\u5957",
        "/items/collectors_boots": "\u6536\u85cf\u5bb6\u9774",
        "/items/shoebill_shoes": "\u9cb8\u5934\u9e73\u978b",
        "/items/black_bear_shoes": "\u9ed1\u718a\u978b",
        "/items/grizzly_bear_shoes": "\u68d5\u718a\u978b",
        "/items/polar_bear_shoes": "\u5317\u6781\u718a\u978b",
        "/items/centaur_boots": "\u534a\u4eba\u9a6c\u9774",
        "/items/sorcerer_boots": "\u5deb\u5e08\u9774",
        "/items/cheese_boots": "\u5976\u916a\u9774",
        "/items/verdant_boots": "\u7fe0\u7eff\u9774",
        "/items/azure_boots": "\u851a\u84dd\u9774",
        "/items/burble_boots": "\u6df1\u7d2b\u9774",
        "/items/crimson_boots": "\u7edb\u7ea2\u9774",
        "/items/rainbow_boots": "\u5f69\u8679\u9774",
        "/items/holy_boots": "\u795e\u5723\u9774",
        "/items/rough_boots": "\u7c97\u7cd9\u9774",
        "/items/reptile_boots": "\u722c\u884c\u52a8\u7269\u9774",
        "/items/gobo_boots": "\u54e5\u5e03\u6797\u9774",
        "/items/beast_boots": "\u91ce\u517d\u9774",
        "/items/umbral_boots": "\u6697\u5f71\u9774",
        "/items/cotton_boots": "\u68c9\u9774",
        "/items/linen_boots": "\u4e9a\u9ebb\u9774",
        "/items/bamboo_boots": "\u7af9\u9774",
        "/items/silk_boots": "\u4e1d\u9774",
        "/items/radiant_boots": "\u5149\u8f89\u9774",
        "/items/small_pouch": "\u5c0f\u888b\u5b50",
        "/items/medium_pouch": "\u4e2d\u888b\u5b50",
        "/items/large_pouch": "\u5927\u888b\u5b50",
        "/items/giant_pouch": "\u5de8\u5927\u888b\u5b50",
        "/items/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
        "/items/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
        "/items/necklace_of_efficiency": "\u6548\u7387\u9879\u94fe",
        "/items/fighter_necklace": "\u6218\u58eb\u9879\u94fe",
        "/items/ranger_necklace": "\u5c04\u624b\u9879\u94fe",
        "/items/wizard_necklace": "\u5deb\u5e08\u9879\u94fe",
        "/items/necklace_of_wisdom": "\u7ecf\u9a8c\u9879\u94fe",
        "/items/necklace_of_speed": "\u901f\u5ea6\u9879\u94fe",
        "/items/philosophers_necklace": "\u8d24\u8005\u9879\u94fe",
        "/items/earrings_of_gathering": "\u91c7\u96c6\u8033\u73af",
        "/items/earrings_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u8033\u73af",
        "/items/earrings_of_armor": "\u62a4\u7532\u8033\u73af",
        "/items/earrings_of_regeneration": "\u6062\u590d\u8033\u73af",
        "/items/earrings_of_resistance": "\u6297\u6027\u8033\u73af",
        "/items/earrings_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u8033\u73af",
        "/items/earrings_of_critical_strike": "\u66b4\u51fb\u8033\u73af",
        "/items/philosophers_earrings": "\u8d24\u8005\u8033\u73af",
        "/items/ring_of_gathering": "\u91c7\u96c6\u6212\u6307",
        "/items/ring_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u6212\u6307",
        "/items/ring_of_armor": "\u62a4\u7532\u6212\u6307",
        "/items/ring_of_regeneration": "\u6062\u590d\u6212\u6307",
        "/items/ring_of_resistance": "\u6297\u6027\u6212\u6307",
        "/items/ring_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u6212\u6307",
        "/items/ring_of_critical_strike": "\u66b4\u51fb\u6212\u6307",
        "/items/philosophers_ring": "\u8d24\u8005\u6212\u6307",
        "/items/trainee_milking_charm": "\u5b9e\u4e60\u6324\u5976\u62a4\u7b26",
        "/items/basic_milking_charm": "\u57fa\u7840\u6324\u5976\u62a4\u7b26",
        "/items/advanced_milking_charm": "\u9ad8\u7ea7\u6324\u5976\u62a4\u7b26",
        "/items/expert_milking_charm": "\u4e13\u5bb6\u6324\u5976\u62a4\u7b26",
        "/items/master_milking_charm": "\u5927\u5e08\u6324\u5976\u62a4\u7b26",
        "/items/grandmaster_milking_charm": "\u5b97\u5e08\u6324\u5976\u62a4\u7b26",
        "/items/trainee_foraging_charm": "\u5b9e\u4e60\u91c7\u6458\u62a4\u7b26",
        "/items/basic_foraging_charm": "\u57fa\u7840\u91c7\u6458\u62a4\u7b26",
        "/items/advanced_foraging_charm": "\u9ad8\u7ea7\u91c7\u6458\u62a4\u7b26",
        "/items/expert_foraging_charm": "\u4e13\u5bb6\u91c7\u6458\u62a4\u7b26",
        "/items/master_foraging_charm": "\u5927\u5e08\u91c7\u6458\u62a4\u7b26",
        "/items/grandmaster_foraging_charm": "\u5b97\u5e08\u91c7\u6458\u62a4\u7b26",
        "/items/trainee_woodcutting_charm": "\u5b9e\u4e60\u4f10\u6728\u62a4\u7b26",
        "/items/basic_woodcutting_charm": "\u57fa\u7840\u4f10\u6728\u62a4\u7b26",
        "/items/advanced_woodcutting_charm": "\u9ad8\u7ea7\u4f10\u6728\u62a4\u7b26",
        "/items/expert_woodcutting_charm": "\u4e13\u5bb6\u4f10\u6728\u62a4\u7b26",
        "/items/master_woodcutting_charm": "\u5927\u5e08\u4f10\u6728\u62a4\u7b26",
        "/items/grandmaster_woodcutting_charm": "\u5b97\u5e08\u4f10\u6728\u62a4\u7b26",
        "/items/trainee_cheesesmithing_charm": "\u5b9e\u4e60\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/basic_cheesesmithing_charm": "\u57fa\u7840\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/advanced_cheesesmithing_charm": "\u9ad8\u7ea7\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/expert_cheesesmithing_charm": "\u4e13\u5bb6\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/master_cheesesmithing_charm": "\u5927\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/grandmaster_cheesesmithing_charm": "\u5b97\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
        "/items/trainee_crafting_charm": "\u5b9e\u4e60\u5236\u4f5c\u62a4\u7b26",
        "/items/basic_crafting_charm": "\u57fa\u7840\u5236\u4f5c\u62a4\u7b26",
        "/items/advanced_crafting_charm": "\u9ad8\u7ea7\u5236\u4f5c\u62a4\u7b26",
        "/items/expert_crafting_charm": "\u4e13\u5bb6\u5236\u4f5c\u62a4\u7b26",
        "/items/master_crafting_charm": "\u5927\u5e08\u5236\u4f5c\u62a4\u7b26",
        "/items/grandmaster_crafting_charm": "\u5b97\u5e08\u5236\u4f5c\u62a4\u7b26",
        "/items/trainee_tailoring_charm": "\u5b9e\u4e60\u7f1d\u7eab\u62a4\u7b26",
        "/items/basic_tailoring_charm": "\u57fa\u7840\u7f1d\u7eab\u62a4\u7b26",
        "/items/advanced_tailoring_charm": "\u9ad8\u7ea7\u7f1d\u7eab\u62a4\u7b26",
        "/items/expert_tailoring_charm": "\u4e13\u5bb6\u7f1d\u7eab\u62a4\u7b26",
        "/items/master_tailoring_charm": "\u5927\u5e08\u7f1d\u7eab\u62a4\u7b26",
        "/items/grandmaster_tailoring_charm": "\u5b97\u5e08\u7f1d\u7eab\u62a4\u7b26",
        "/items/trainee_cooking_charm": "\u5b9e\u4e60\u70f9\u996a\u62a4\u7b26",
        "/items/basic_cooking_charm": "\u57fa\u7840\u70f9\u996a\u62a4\u7b26",
        "/items/advanced_cooking_charm": "\u9ad8\u7ea7\u70f9\u996a\u62a4\u7b26",
        "/items/expert_cooking_charm": "\u4e13\u5bb6\u70f9\u996a\u62a4\u7b26",
        "/items/master_cooking_charm": "\u5927\u5e08\u70f9\u996a\u62a4\u7b26",
        "/items/grandmaster_cooking_charm": "\u5b97\u5e08\u70f9\u996a\u62a4\u7b26",
        "/items/trainee_brewing_charm": "\u5b9e\u4e60\u51b2\u6ce1\u62a4\u7b26",
        "/items/basic_brewing_charm": "\u57fa\u7840\u51b2\u6ce1\u62a4\u7b26",
        "/items/advanced_brewing_charm": "\u9ad8\u7ea7\u51b2\u6ce1\u62a4\u7b26",
        "/items/expert_brewing_charm": "\u4e13\u5bb6\u51b2\u6ce1\u62a4\u7b26",
        "/items/master_brewing_charm": "\u5927\u5e08\u51b2\u6ce1\u62a4\u7b26",
        "/items/grandmaster_brewing_charm": "\u5b97\u5e08\u51b2\u6ce1\u62a4\u7b26",
        "/items/trainee_alchemy_charm": "\u5b9e\u4e60\u70bc\u91d1\u62a4\u7b26",
        "/items/basic_alchemy_charm": "\u57fa\u7840\u70bc\u91d1\u62a4\u7b26",
        "/items/advanced_alchemy_charm": "\u9ad8\u7ea7\u70bc\u91d1\u62a4\u7b26",
        "/items/expert_alchemy_charm": "\u4e13\u5bb6\u70bc\u91d1\u62a4\u7b26",
        "/items/master_alchemy_charm": "\u5927\u5e08\u70bc\u91d1\u62a4\u7b26",
        "/items/grandmaster_alchemy_charm": "\u5b97\u5e08\u70bc\u91d1\u62a4\u7b26",
        "/items/trainee_enhancing_charm": "\u5b9e\u4e60\u5f3a\u5316\u62a4\u7b26",
        "/items/basic_enhancing_charm": "\u57fa\u7840\u5f3a\u5316\u62a4\u7b26",
        "/items/advanced_enhancing_charm": "\u9ad8\u7ea7\u5f3a\u5316\u62a4\u7b26",
        "/items/expert_enhancing_charm": "\u4e13\u5bb6\u5f3a\u5316\u62a4\u7b26",
        "/items/master_enhancing_charm": "\u5927\u5e08\u5f3a\u5316\u62a4\u7b26",
        "/items/grandmaster_enhancing_charm": "\u5b97\u5e08\u5f3a\u5316\u62a4\u7b26",
        "/items/trainee_stamina_charm": "\u5b9e\u4e60\u8010\u529b\u62a4\u7b26",
        "/items/basic_stamina_charm": "\u57fa\u7840\u8010\u529b\u62a4\u7b26",
        "/items/advanced_stamina_charm": "\u9ad8\u7ea7\u8010\u529b\u62a4\u7b26",
        "/items/expert_stamina_charm": "\u4e13\u5bb6\u8010\u529b\u62a4\u7b26",
        "/items/master_stamina_charm": "\u5927\u5e08\u8010\u529b\u62a4\u7b26",
        "/items/grandmaster_stamina_charm": "\u5b97\u5e08\u8010\u529b\u62a4\u7b26",
        "/items/trainee_intelligence_charm": "\u5b9e\u4e60\u667a\u529b\u62a4\u7b26",
        "/items/basic_intelligence_charm": "\u57fa\u7840\u667a\u529b\u62a4\u7b26",
        "/items/advanced_intelligence_charm": "\u9ad8\u7ea7\u667a\u529b\u62a4\u7b26",
        "/items/expert_intelligence_charm": "\u4e13\u5bb6\u667a\u529b\u62a4\u7b26",
        "/items/master_intelligence_charm": "\u5927\u5e08\u667a\u529b\u62a4\u7b26",
        "/items/grandmaster_intelligence_charm": "\u5b97\u5e08\u667a\u529b\u62a4\u7b26",
        "/items/trainee_attack_charm": "\u5b9e\u4e60\u653b\u51fb\u62a4\u7b26",
        "/items/basic_attack_charm": "\u57fa\u7840\u653b\u51fb\u62a4\u7b26",
        "/items/advanced_attack_charm": "\u9ad8\u7ea7\u653b\u51fb\u62a4\u7b26",
        "/items/expert_attack_charm": "\u4e13\u5bb6\u653b\u51fb\u62a4\u7b26",
        "/items/master_attack_charm": "\u5927\u5e08\u653b\u51fb\u62a4\u7b26",
        "/items/grandmaster_attack_charm": "\u5b97\u5e08\u653b\u51fb\u62a4\u7b26",
        "/items/trainee_defense_charm": "\u5b9e\u4e60\u9632\u5fa1\u62a4\u7b26",
        "/items/basic_defense_charm": "\u57fa\u7840\u9632\u5fa1\u62a4\u7b26",
        "/items/advanced_defense_charm": "\u9ad8\u7ea7\u9632\u5fa1\u62a4\u7b26",
        "/items/expert_defense_charm": "\u4e13\u5bb6\u9632\u5fa1\u62a4\u7b26",
        "/items/master_defense_charm": "\u5927\u5e08\u9632\u5fa1\u62a4\u7b26",
        "/items/grandmaster_defense_charm": "\u5b97\u5e08\u9632\u5fa1\u62a4\u7b26",
        "/items/trainee_melee_charm": "\u5b9e\u4e60\u8fd1\u6218\u62a4\u7b26",
        "/items/basic_melee_charm": "\u57fa\u7840\u8fd1\u6218\u62a4\u7b26",
        "/items/advanced_melee_charm": "\u9ad8\u7ea7\u8fd1\u6218\u62a4\u7b26",
        "/items/expert_melee_charm": "\u4e13\u5bb6\u8fd1\u6218\u62a4\u7b26",
        "/items/master_melee_charm": "\u5927\u5e08\u8fd1\u6218\u62a4\u7b26",
        "/items/grandmaster_melee_charm": "\u5b97\u5e08\u8fd1\u6218\u62a4\u7b26",
        "/items/trainee_ranged_charm": "\u5b9e\u4e60\u8fdc\u7a0b\u62a4\u7b26",
        "/items/basic_ranged_charm": "\u57fa\u7840\u8fdc\u7a0b\u62a4\u7b26",
        "/items/advanced_ranged_charm": "\u9ad8\u7ea7\u8fdc\u7a0b\u62a4\u7b26",
        "/items/expert_ranged_charm": "\u4e13\u5bb6\u8fdc\u7a0b\u62a4\u7b26",
        "/items/master_ranged_charm": "\u5927\u5e08\u8fdc\u7a0b\u62a4\u7b26",
        "/items/grandmaster_ranged_charm": "\u5b97\u5e08\u8fdc\u7a0b\u62a4\u7b26",
        "/items/trainee_magic_charm": "\u5b9e\u4e60\u9b54\u6cd5\u62a4\u7b26",
        "/items/basic_magic_charm": "\u57fa\u7840\u9b54\u6cd5\u62a4\u7b26",
        "/items/advanced_magic_charm": "\u9ad8\u7ea7\u9b54\u6cd5\u62a4\u7b26",
        "/items/expert_magic_charm": "\u4e13\u5bb6\u9b54\u6cd5\u62a4\u7b26",
        "/items/master_magic_charm": "\u5927\u5e08\u9b54\u6cd5\u62a4\u7b26",
        "/items/grandmaster_magic_charm": "\u5b97\u5e08\u9b54\u6cd5\u62a4\u7b26",
        "/items/basic_task_badge": "\u57fa\u7840\u4efb\u52a1\u5fbd\u7ae0",
        "/items/advanced_task_badge": "\u9ad8\u7ea7\u4efb\u52a1\u5fbd\u7ae0",
        "/items/expert_task_badge": "\u4e13\u5bb6\u4efb\u52a1\u5fbd\u7ae0",
        "/items/celestial_brush": "\u661f\u7a7a\u5237\u5b50",
        "/items/cheese_brush": "\u5976\u916a\u5237\u5b50",
        "/items/verdant_brush": "\u7fe0\u7eff\u5237\u5b50",
        "/items/azure_brush": "\u851a\u84dd\u5237\u5b50",
        "/items/burble_brush": "\u6df1\u7d2b\u5237\u5b50",
        "/items/crimson_brush": "\u7edb\u7ea2\u5237\u5b50",
        "/items/rainbow_brush": "\u5f69\u8679\u5237\u5b50",
        "/items/holy_brush": "\u795e\u5723\u5237\u5b50",
        "/items/celestial_shears": "\u661f\u7a7a\u526a\u5200",
        "/items/cheese_shears": "\u5976\u916a\u526a\u5200",
        "/items/verdant_shears": "\u7fe0\u7eff\u526a\u5200",
        "/items/azure_shears": "\u851a\u84dd\u526a\u5200",
        "/items/burble_shears": "\u6df1\u7d2b\u526a\u5200",
        "/items/crimson_shears": "\u7edb\u7ea2\u526a\u5200",
        "/items/rainbow_shears": "\u5f69\u8679\u526a\u5200",
        "/items/holy_shears": "\u795e\u5723\u526a\u5200",
        "/items/celestial_hatchet": "\u661f\u7a7a\u65a7\u5934",
        "/items/cheese_hatchet": "\u5976\u916a\u65a7\u5934",
        "/items/verdant_hatchet": "\u7fe0\u7eff\u65a7\u5934",
        "/items/azure_hatchet": "\u851a\u84dd\u65a7\u5934",
        "/items/burble_hatchet": "\u6df1\u7d2b\u65a7\u5934",
        "/items/crimson_hatchet": "\u7edb\u7ea2\u65a7\u5934",
        "/items/rainbow_hatchet": "\u5f69\u8679\u65a7\u5934",
        "/items/holy_hatchet": "\u795e\u5723\u65a7\u5934",
        "/items/celestial_hammer": "\u661f\u7a7a\u9524\u5b50",
        "/items/cheese_hammer": "\u5976\u916a\u9524\u5b50",
        "/items/verdant_hammer": "\u7fe0\u7eff\u9524\u5b50",
        "/items/azure_hammer": "\u851a\u84dd\u9524\u5b50",
        "/items/burble_hammer": "\u6df1\u7d2b\u9524\u5b50",
        "/items/crimson_hammer": "\u7edb\u7ea2\u9524\u5b50",
        "/items/rainbow_hammer": "\u5f69\u8679\u9524\u5b50",
        "/items/holy_hammer": "\u795e\u5723\u9524\u5b50",
        "/items/celestial_chisel": "\u661f\u7a7a\u51ff\u5b50",
        "/items/cheese_chisel": "\u5976\u916a\u51ff\u5b50",
        "/items/verdant_chisel": "\u7fe0\u7eff\u51ff\u5b50",
        "/items/azure_chisel": "\u851a\u84dd\u51ff\u5b50",
        "/items/burble_chisel": "\u6df1\u7d2b\u51ff\u5b50",
        "/items/crimson_chisel": "\u7edb\u7ea2\u51ff\u5b50",
        "/items/rainbow_chisel": "\u5f69\u8679\u51ff\u5b50",
        "/items/holy_chisel": "\u795e\u5723\u51ff\u5b50",
        "/items/celestial_needle": "\u661f\u7a7a\u9488",
        "/items/cheese_needle": "\u5976\u916a\u9488",
        "/items/verdant_needle": "\u7fe0\u7eff\u9488",
        "/items/azure_needle": "\u851a\u84dd\u9488",
        "/items/burble_needle": "\u6df1\u7d2b\u9488",
        "/items/crimson_needle": "\u7edb\u7ea2\u9488",
        "/items/rainbow_needle": "\u5f69\u8679\u9488",
        "/items/holy_needle": "\u795e\u5723\u9488",
        "/items/celestial_spatula": "\u661f\u7a7a\u9505\u94f2",
        "/items/cheese_spatula": "\u5976\u916a\u9505\u94f2",
        "/items/verdant_spatula": "\u7fe0\u7eff\u9505\u94f2",
        "/items/azure_spatula": "\u851a\u84dd\u9505\u94f2",
        "/items/burble_spatula": "\u6df1\u7d2b\u9505\u94f2",
        "/items/crimson_spatula": "\u7edb\u7ea2\u9505\u94f2",
        "/items/rainbow_spatula": "\u5f69\u8679\u9505\u94f2",
        "/items/holy_spatula": "\u795e\u5723\u9505\u94f2",
        "/items/celestial_pot": "\u661f\u7a7a\u58f6",
        "/items/cheese_pot": "\u5976\u916a\u58f6",
        "/items/verdant_pot": "\u7fe0\u7eff\u58f6",
        "/items/azure_pot": "\u851a\u84dd\u58f6",
        "/items/burble_pot": "\u6df1\u7d2b\u58f6",
        "/items/crimson_pot": "\u7edb\u7ea2\u58f6",
        "/items/rainbow_pot": "\u5f69\u8679\u58f6",
        "/items/holy_pot": "\u795e\u5723\u58f6",
        "/items/celestial_alembic": "\u661f\u7a7a\u84b8\u998f\u5668",
        "/items/cheese_alembic": "\u5976\u916a\u84b8\u998f\u5668",
        "/items/verdant_alembic": "\u7fe0\u7eff\u84b8\u998f\u5668",
        "/items/azure_alembic": "\u851a\u84dd\u84b8\u998f\u5668",
        "/items/burble_alembic": "\u6df1\u7d2b\u84b8\u998f\u5668",
        "/items/crimson_alembic": "\u7edb\u7ea2\u84b8\u998f\u5668",
        "/items/rainbow_alembic": "\u5f69\u8679\u84b8\u998f\u5668",
        "/items/holy_alembic": "\u795e\u5723\u84b8\u998f\u5668",
        "/items/celestial_enhancer": "\u661f\u7a7a\u5f3a\u5316\u5668",
        "/items/cheese_enhancer": "\u5976\u916a\u5f3a\u5316\u5668",
        "/items/verdant_enhancer": "\u7fe0\u7eff\u5f3a\u5316\u5668",
        "/items/azure_enhancer": "\u851a\u84dd\u5f3a\u5316\u5668",
        "/items/burble_enhancer": "\u6df1\u7d2b\u5f3a\u5316\u5668",
        "/items/crimson_enhancer": "\u7edb\u7ea2\u5f3a\u5316\u5668",
        "/items/rainbow_enhancer": "\u5f69\u8679\u5f3a\u5316\u5668",
        "/items/holy_enhancer": "\u795e\u5723\u5f3a\u5316\u5668",
        "/items/milk": "\u725b\u5976",
        "/items/verdant_milk": "\u7fe0\u7eff\u725b\u5976",
        "/items/azure_milk": "\u851a\u84dd\u725b\u5976",
        "/items/burble_milk": "\u6df1\u7d2b\u725b\u5976",
        "/items/crimson_milk": "\u7edb\u7ea2\u725b\u5976",
        "/items/rainbow_milk": "\u5f69\u8679\u725b\u5976",
        "/items/holy_milk": "\u795e\u5723\u725b\u5976",
        "/items/cheese": "\u5976\u916a",
        "/items/verdant_cheese": "\u7fe0\u7eff\u5976\u916a",
        "/items/azure_cheese": "\u851a\u84dd\u5976\u916a",
        "/items/burble_cheese": "\u6df1\u7d2b\u5976\u916a",
        "/items/crimson_cheese": "\u7edb\u7ea2\u5976\u916a",
        "/items/rainbow_cheese": "\u5f69\u8679\u5976\u916a",
        "/items/holy_cheese": "\u795e\u5723\u5976\u916a",
        "/items/log": "\u539f\u6728",
        "/items/birch_log": "\u767d\u6866\u539f\u6728",
        "/items/cedar_log": "\u96ea\u677e\u539f\u6728",
        "/items/purpleheart_log": "\u7d2b\u5fc3\u539f\u6728",
        "/items/ginkgo_log": "\u94f6\u674f\u539f\u6728",
        "/items/redwood_log": "\u7ea2\u6749\u539f\u6728",
        "/items/arcane_log": "\u795e\u79d8\u539f\u6728",
        "/items/lumber": "\u6728\u677f",
        "/items/birch_lumber": "\u767d\u6866\u6728\u677f",
        "/items/cedar_lumber": "\u96ea\u677e\u6728\u677f",
        "/items/purpleheart_lumber": "\u7d2b\u5fc3\u6728\u677f",
        "/items/ginkgo_lumber": "\u94f6\u674f\u6728\u677f",
        "/items/redwood_lumber": "\u7ea2\u6749\u6728\u677f",
        "/items/arcane_lumber": "\u795e\u79d8\u6728\u677f",
        "/items/rough_hide": "\u7c97\u7cd9\u517d\u76ae",
        "/items/reptile_hide": "\u722c\u884c\u52a8\u7269\u76ae",
        "/items/gobo_hide": "\u54e5\u5e03\u6797\u76ae",
        "/items/beast_hide": "\u91ce\u517d\u76ae",
        "/items/umbral_hide": "\u6697\u5f71\u76ae",
        "/items/rough_leather": "\u7c97\u7cd9\u76ae\u9769",
        "/items/reptile_leather": "\u722c\u884c\u52a8\u7269\u76ae\u9769",
        "/items/gobo_leather": "\u54e5\u5e03\u6797\u76ae\u9769",
        "/items/beast_leather": "\u91ce\u517d\u76ae\u9769",
        "/items/umbral_leather": "\u6697\u5f71\u76ae\u9769",
        "/items/cotton": "\u68c9\u82b1",
        "/items/flax": "\u4e9a\u9ebb",
        "/items/bamboo_branch": "\u7af9\u5b50",
        "/items/cocoon": "\u8695\u8327",
        "/items/radiant_fiber": "\u5149\u8f89\u7ea4\u7ef4",
        "/items/cotton_fabric": "\u68c9\u82b1\u5e03\u6599",
        "/items/linen_fabric": "\u4e9a\u9ebb\u5e03\u6599",
        "/items/bamboo_fabric": "\u7af9\u5b50\u5e03\u6599",
        "/items/silk_fabric": "\u4e1d\u7ef8",
        "/items/radiant_fabric": "\u5149\u8f89\u5e03\u6599",
        "/items/egg": "\u9e21\u86cb",
        "/items/wheat": "\u5c0f\u9ea6",
        "/items/sugar": "\u7cd6",
        "/items/blueberry": "\u84dd\u8393",
        "/items/blackberry": "\u9ed1\u8393",
        "/items/strawberry": "\u8349\u8393",
        "/items/mooberry": "\u54de\u8393",
        "/items/marsberry": "\u706b\u661f\u8393",
        "/items/spaceberry": "\u592a\u7a7a\u8393",
        "/items/apple": "\u82f9\u679c",
        "/items/orange": "\u6a59\u5b50",
        "/items/plum": "\u674e\u5b50",
        "/items/peach": "\u6843\u5b50",
        "/items/dragon_fruit": "\u706b\u9f99\u679c",
        "/items/star_fruit": "\u6768\u6843",
        "/items/arabica_coffee_bean": "\u4f4e\u7ea7\u5496\u5561\u8c46",
        "/items/robusta_coffee_bean": "\u4e2d\u7ea7\u5496\u5561\u8c46",
        "/items/liberica_coffee_bean": "\u9ad8\u7ea7\u5496\u5561\u8c46",
        "/items/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
        "/items/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
        "/items/spacia_coffee_bean": "\u592a\u7a7a\u5496\u5561\u8c46",
        "/items/green_tea_leaf": "\u7eff\u8336\u53f6",
        "/items/black_tea_leaf": "\u9ed1\u8336\u53f6",
        "/items/burble_tea_leaf": "\u7d2b\u8336\u53f6",
        "/items/moolong_tea_leaf": "\u54de\u9f99\u8336\u53f6",
        "/items/red_tea_leaf": "\u7ea2\u8336\u53f6",
        "/items/emp_tea_leaf": "\u865a\u7a7a\u8336\u53f6",
        "/items/catalyst_of_coinification": "\u70b9\u91d1\u50ac\u5316\u5242",
        "/items/catalyst_of_decomposition": "\u5206\u89e3\u50ac\u5316\u5242",
        "/items/catalyst_of_transmutation": "\u8f6c\u5316\u50ac\u5316\u5242",
        "/items/prime_catalyst": "\u81f3\u9ad8\u50ac\u5316\u5242",
        "/items/snake_fang": "\u86c7\u7259",
        "/items/shoebill_feather": "\u9cb8\u5934\u9e73\u7fbd\u6bdb",
        "/items/snail_shell": "\u8717\u725b\u58f3",
        "/items/crab_pincer": "\u87f9\u94b3",
        "/items/turtle_shell": "\u4e4c\u9f9f\u58f3",
        "/items/marine_scale": "\u6d77\u6d0b\u9cde\u7247",
        "/items/treant_bark": "\u6811\u76ae",
        "/items/centaur_hoof": "\u534a\u4eba\u9a6c\u8e44",
        "/items/luna_wing": "\u6708\u795e\u7ffc",
        "/items/gobo_rag": "\u54e5\u5e03\u6797\u62b9\u5e03",
        "/items/goggles": "\u62a4\u76ee\u955c",
        "/items/magnifying_glass": "\u653e\u5927\u955c",
        "/items/eye_of_the_watcher": "\u89c2\u5bdf\u8005\u4e4b\u773c",
        "/items/icy_cloth": "\u51b0\u971c\u7ec7\u7269",
        "/items/flaming_cloth": "\u70c8\u7130\u7ec7\u7269",
        "/items/sorcerers_sole": "\u9b54\u6cd5\u5e08\u978b\u5e95",
        "/items/chrono_sphere": "\u65f6\u7a7a\u7403",
        "/items/frost_sphere": "\u51b0\u971c\u7403",
        "/items/panda_fluff": "\u718a\u732b\u7ed2",
        "/items/black_bear_fluff": "\u9ed1\u718a\u7ed2",
        "/items/grizzly_bear_fluff": "\u68d5\u718a\u7ed2",
        "/items/polar_bear_fluff": "\u5317\u6781\u718a\u7ed2",
        "/items/red_panda_fluff": "\u5c0f\u718a\u732b\u7ed2",
        "/items/magnet": "\u78c1\u94c1",
        "/items/stalactite_shard": "\u949f\u4e73\u77f3\u788e\u7247",
        "/items/living_granite": "\u82b1\u5c97\u5ca9",
        "/items/colossus_core": "\u5de8\u50cf\u6838\u5fc3",
        "/items/vampire_fang": "\u5438\u8840\u9b3c\u4e4b\u7259",
        "/items/werewolf_claw": "\u72fc\u4eba\u4e4b\u722a",
        "/items/revenant_anima": "\u4ea1\u8005\u4e4b\u9b42",
        "/items/soul_fragment": "\u7075\u9b42\u788e\u7247",
        "/items/infernal_ember": "\u5730\u72f1\u4f59\u70ec",
        "/items/demonic_core": "\u6076\u9b54\u6838\u5fc3",
        "/items/griffin_leather": "\u72ee\u9e6b\u4e4b\u76ae",
        "/items/manticore_sting": "\u874e\u72ee\u4e4b\u523a",
        "/items/jackalope_antler": "\u9e7f\u89d2\u5154\u4e4b\u89d2",
        "/items/dodocamel_plume": "\u6e21\u6e21\u9a7c\u4e4b\u7fce",
        "/items/griffin_talon": "\u72ee\u9e6b\u4e4b\u722a",
        "/items/chimerical_refinement_shard": "\u5947\u5e7b\u7cbe\u70bc\u788e\u7247",
        "/items/acrobats_ribbon": "\u6742\u6280\u5e08\u5f69\u5e26",
        "/items/magicians_cloth": "\u9b54\u672f\u5e08\u7ec7\u7269",
        "/items/chaotic_chain": "\u6df7\u6c8c\u9501\u94fe",
        "/items/cursed_ball": "\u8bc5\u5492\u4e4b\u7403",
        "/items/sinister_refinement_shard": "\u9634\u68ee\u7cbe\u70bc\u788e\u7247",
        "/items/royal_cloth": "\u7687\u5bb6\u7ec7\u7269",
        "/items/knights_ingot": "\u9a91\u58eb\u4e4b\u952d",
        "/items/bishops_scroll": "\u4e3b\u6559\u5377\u8f74",
        "/items/regal_jewel": "\u541b\u738b\u5b9d\u77f3",
        "/items/sundering_jewel": "\u88c2\u7a7a\u5b9d\u77f3",
        "/items/enchanted_refinement_shard": "\u79d8\u6cd5\u7cbe\u70bc\u788e\u7247",
        "/items/marksman_brooch": "\u795e\u5c04\u80f8\u9488",
        "/items/corsair_crest": "\u63a0\u593a\u8005\u5fbd\u7ae0",
        "/items/damaged_anchor": "\u7834\u635f\u8239\u951a",
        "/items/maelstrom_plating": "\u6012\u6d9b\u7532\u7247",
        "/items/kraken_leather": "\u514b\u62c9\u80af\u76ae\u9769",
        "/items/kraken_fang": "\u514b\u62c9\u80af\u4e4b\u7259",
        "/items/pirate_refinement_shard": "\u6d77\u76d7\u7cbe\u70bc\u788e\u7247",
        "/items/butter_of_proficiency": "\u7cbe\u901a\u4e4b\u6cb9",
        "/items/thread_of_expertise": "\u4e13\u7cbe\u4e4b\u7ebf",
        "/items/branch_of_insight": "\u6d1e\u5bdf\u4e4b\u679d",
        "/items/gluttonous_energy": "\u8d2a\u98df\u80fd\u91cf",
        "/items/guzzling_energy": "\u66b4\u996e\u80fd\u91cf",
        "/items/milking_essence": "\u6324\u5976\u7cbe\u534e",
        "/items/foraging_essence": "\u91c7\u6458\u7cbe\u534e",
        "/items/woodcutting_essence": "\u4f10\u6728\u7cbe\u534e",
        "/items/cheesesmithing_essence": "\u5976\u916a\u953b\u9020\u7cbe\u534e",
        "/items/crafting_essence": "\u5236\u4f5c\u7cbe\u534e",
        "/items/tailoring_essence": "\u7f1d\u7eab\u7cbe\u534e",
        "/items/cooking_essence": "\u70f9\u996a\u7cbe\u534e",
        "/items/brewing_essence": "\u51b2\u6ce1\u7cbe\u534e",
        "/items/alchemy_essence": "\u70bc\u91d1\u7cbe\u534e",
        "/items/enhancing_essence": "\u5f3a\u5316\u7cbe\u534e",
        "/items/swamp_essence": "\u6cbc\u6cfd\u7cbe\u534e",
        "/items/aqua_essence": "\u6d77\u6d0b\u7cbe\u534e",
        "/items/jungle_essence": "\u4e1b\u6797\u7cbe\u534e",
        "/items/gobo_essence": "\u54e5\u5e03\u6797\u7cbe\u534e",
        "/items/eyessence": "\u773c\u7cbe\u534e",
        "/items/sorcerer_essence": "\u6cd5\u5e08\u7cbe\u534e",
        "/items/bear_essence": "\u718a\u718a\u7cbe\u534e",
        "/items/golem_essence": "\u9b54\u50cf\u7cbe\u534e",
        "/items/twilight_essence": "\u66ae\u5149\u7cbe\u534e",
        "/items/abyssal_essence": "\u5730\u72f1\u7cbe\u534e",
        "/items/chimerical_essence": "\u5947\u5e7b\u7cbe\u534e",
        "/items/sinister_essence": "\u9634\u68ee\u7cbe\u534e",
        "/items/enchanted_essence": "\u79d8\u6cd5\u7cbe\u534e",
        "/items/pirate_essence": "\u6d77\u76d7\u7cbe\u534e",
        "/items/task_crystal": "\u4efb\u52a1\u6c34\u6676",
        "/items/star_fragment": "\u661f\u5149\u788e\u7247",
        "/items/pearl": "\u73cd\u73e0",
        "/items/amber": "\u7425\u73c0",
        "/items/garnet": "\u77f3\u69b4\u77f3",
        "/items/jade": "\u7fe1\u7fe0",
        "/items/amethyst": "\u7d2b\u6c34\u6676",
        "/items/moonstone": "\u6708\u4eae\u77f3",
        "/items/sunstone": "\u592a\u9633\u77f3",
        "/items/philosophers_stone": "\u8d24\u8005\u4e4b\u77f3",
        "/items/crushed_pearl": "\u73cd\u73e0\u788e\u7247",
        "/items/crushed_amber": "\u7425\u73c0\u788e\u7247",
        "/items/crushed_garnet": "\u77f3\u69b4\u77f3\u788e\u7247",
        "/items/crushed_jade": "\u7fe1\u7fe0\u788e\u7247",
        "/items/crushed_amethyst": "\u7d2b\u6c34\u6676\u788e\u7247",
        "/items/crushed_moonstone": "\u6708\u4eae\u77f3\u788e\u7247",
        "/items/crushed_sunstone": "\u592a\u9633\u77f3\u788e\u7247",
        "/items/crushed_philosophers_stone": "\u8d24\u8005\u4e4b\u77f3\u788e\u7247",
        "/items/shard_of_protection": "\u4fdd\u62a4\u788e\u7247",
        "/items/mirror_of_protection": "\u4fdd\u62a4\u4e4b\u955c",
        "/items/philosophers_mirror": "\u8d24\u8005\u4e4b\u955c"
    };

    const houseMaterialsSortIndex = {
        "/items/coin": 1,
        "/items/lumber": 731,
        "/items/wooden_crossbow": 259,
        "/items/wooden_bow": 211,
        "/items/rough_hood": 338,
        "/items/rough_tunic": 387,
        "/items/rough_chaps": 435,
        "/items/rough_bracers": 462,
        "/items/rough_boots": 486,
        "/items/birch_lumber": 732,
        "/items/birch_crossbow": 260,
        "/items/birch_bow": 212,
        "/items/reptile_hood": 339,
        "/items/reptile_tunic": 388,
        "/items/reptile_chaps": 436,
        "/items/reptile_bracers": 463,
        "/items/reptile_boots": 487,
        "/items/cedar_lumber": 733,
        "/items/cedar_crossbow": 261,
        "/items/cedar_bow": 213,
        "/items/purpleheart_lumber": 734,
        "/items/purpleheart_crossbow": 262,
        "/items/purpleheart_bow": 214,
        "/items/gobo_hood": 340,
        "/items/gobo_tunic": 389,
        "/items/gobo_chaps": 437,
        "/items/gobo_bracers": 464,
        "/items/gobo_boots": 488,
        "/items/ranged_coffee": 115,
        "/items/ginkgo_lumber": 735,
        "/items/ginkgo_crossbow": 263,
        "/items/ginkgo_bow": 215,
        "/items/redwood_lumber": 736,
        "/items/redwood_crossbow": 264,
        "/items/redwood_bow": 216,
        "/items/beast_hood": 341,
        "/items/beast_tunic": 390,
        "/items/beast_chaps": 438,
        "/items/beast_bracers": 465,
        "/items/beast_boots": 489,
        "/items/arcane_lumber": 737,
        "/items/arcane_crossbow": 265,
        "/items/arcane_bow": 217,
        "/items/umbral_hood": 342,
        "/items/umbral_tunic": 391,
        "/items/umbral_chaps": 439,
        "/items/umbral_bracers": 466,
        "/items/umbral_boots": 490,
        "/items/super_ranged_coffee": 122,
        "/items/cheese_helmet": 331,
        "/items/cheese_plate_body": 380,
        "/items/cheese_plate_legs": 428,
        "/items/cheese_gauntlets": 455,
        "/items/cheese_boots": 479,
        "/items/verdant_helmet": 332,
        "/items/verdant_plate_body": 381,
        "/items/verdant_plate_legs": 429,
        "/items/verdant_gauntlets": 456,
        "/items/verdant_boots": 480,
        "/items/azure_helmet": 333,
        "/items/azure_plate_body": 382,
        "/items/azure_plate_legs": 430,
        "/items/azure_gauntlets": 457,
        "/items/azure_boots": 481,
        "/items/burble_helmet": 334,
        "/items/burble_plate_body": 383,
        "/items/burble_plate_legs": 431,
        "/items/burble_gauntlets": 458,
        "/items/burble_boots": 482,
        "/items/defense_coffee": 112,
        "/items/crimson_helmet": 335,
        "/items/crimson_plate_body": 384,
        "/items/crimson_plate_legs": 432,
        "/items/crimson_gauntlets": 459,
        "/items/crimson_boots": 483,
        "/items/rainbow_helmet": 336,
        "/items/rainbow_plate_body": 385,
        "/items/rainbow_plate_legs": 433,
        "/items/rainbow_gauntlets": 460,
        "/items/rainbow_boots": 484,
        "/items/holy_helmet": 337,
        "/items/holy_plate_body": 386,
        "/items/holy_plate_legs": 434,
        "/items/holy_gauntlets": 461,
        "/items/holy_boots": 485,
        "/items/super_defense_coffee": 119,
        "/items/green_tea_leaf": 779,
        "/items/arabica_coffee_bean": 773,
        "/items/cheese_pot": 687,
        "/items/black_tea_leaf": 780,
        "/items/robusta_coffee_bean": 774,
        "/items/verdant_pot": 688,
        "/items/azure_pot": 689,
        "/items/burble_tea_leaf": 781,
        "/items/liberica_coffee_bean": 775,
        "/items/burble_pot": 690,
        "/items/brewing_tea": 76,
        "/items/moolong_tea_leaf": 782,
        "/items/excelsa_coffee_bean": 776,
        "/items/crimson_pot": 691,
        "/items/red_tea_leaf": 783,
        "/items/fieriosa_coffee_bean": 777,
        "/items/rainbow_pot": 692,
        "/items/emp_tea_leaf": 784,
        "/items/spacia_coffee_bean": 778,
        "/items/holy_pot": 693,
        "/items/super_brewing_tea": 86,
        "/items/milk": 710,
        "/items/cheese_brush": 631,
        "/items/verdant_milk": 711,
        "/items/verdant_brush": 632,
        "/items/azure_milk": 712,
        "/items/azure_brush": 633,
        "/items/burble_milk": 713,
        "/items/burble_brush": 634,
        "/items/milking_tea": 72,
        "/items/crimson_milk": 714,
        "/items/crimson_brush": 635,
        "/items/rainbow_milk": 715,
        "/items/rainbow_brush": 636,
        "/items/holy_milk": 716,
        "/items/holy_brush": 637,
        "/items/super_milking_tea": 82,
        "/items/donut": 44,
        "/items/cupcake": 51,
        "/items/small_pouch": 496,
        "/items/blueberry_donut": 45,
        "/items/blueberry_cake": 52,
        "/items/blackberry_donut": 46,
        "/items/blackberry_cake": 53,
        "/items/medium_pouch": 497,
        "/items/strawberry_donut": 47,
        "/items/strawberry_cake": 54,
        "/items/stamina_coffee": 110,
        "/items/mooberry_donut": 48,
        "/items/mooberry_cake": 55,
        "/items/large_pouch": 498,
        "/items/marsberry_donut": 49,
        "/items/marsberry_cake": 56,
        "/items/spaceberry_donut": 50,
        "/items/spaceberry_cake": 57,
        "/items/giant_pouch": 499,
        "/items/super_stamina_coffee": 117,
        "/items/cheese_spear": 245,
        "/items/cheese_sword": 238,
        "/items/verdant_spear": 246,
        "/items/verdant_sword": 239,
        "/items/azure_spear": 247,
        "/items/azure_sword": 240,
        "/items/burble_spear": 248,
        "/items/burble_sword": 241,
        "/items/attack_coffee": 113,
        "/items/crimson_spear": 249,
        "/items/crimson_sword": 242,
        "/items/rainbow_spear": 250,
        "/items/rainbow_sword": 243,
        "/items/holy_spear": 251,
        "/items/holy_sword": 244,
        "/items/super_attack_coffee": 120,
        "/items/cheese": 717,
        "/items/cheese_hammer": 655,
        "/items/verdant_cheese": 718,
        "/items/verdant_hammer": 656,
        "/items/azure_cheese": 719,
        "/items/azure_hammer": 657,
        "/items/burble_cheese": 720,
        "/items/burble_hammer": 658,
        "/items/cheesesmithing_tea": 79,
        "/items/crimson_cheese": 721,
        "/items/crimson_hammer": 659,
        "/items/rainbow_cheese": 722,
        "/items/rainbow_hammer": 660,
        "/items/holy_cheese": 723,
        "/items/holy_hammer": 661,
        "/items/super_cheesesmithing_tea": 89,
        "/items/egg": 758,
        "/items/wheat": 759,
        "/items/cotton": 748,
        "/items/cheese_shears": 639,
        "/items/blueberry": 761,
        "/items/apple": 767,
        "/items/flax": 749,
        "/items/verdant_shears": 640,
        "/items/blackberry": 762,
        "/items/orange": 768,
        "/items/azure_shears": 641,
        "/items/strawberry": 763,
        "/items/plum": 769,
        "/items/bamboo_branch": 750,
        "/items/burble_shears": 642,
        "/items/foraging_tea": 73,
        "/items/mooberry": 764,
        "/items/peach": 770,
        "/items/crimson_shears": 643,
        "/items/marsberry": 765,
        "/items/dragon_fruit": 771,
        "/items/cocoon": 751,
        "/items/rainbow_shears": 644,
        "/items/spaceberry": 766,
        "/items/star_fruit": 772,
        "/items/radiant_fiber": 752,
        "/items/holy_shears": 645,
        "/items/super_foraging_tea": 83,
        "/items/cheese_mace": 252,
        "/items/verdant_mace": 253,
        "/items/azure_mace": 254,
        "/items/burble_mace": 255,
        "/items/melee_coffee": 114,
        "/items/crimson_mace": 256,
        "/items/rainbow_mace": 257,
        "/items/holy_mace": 258,
        "/items/super_melee_coffee": 121,
        "/items/sugar": 760,
        "/items/cheese_spatula": 679,
        "/items/verdant_spatula": 680,
        "/items/azure_spatula": 681,
        "/items/burble_spatula": 682,
        "/items/cooking_tea": 75,
        "/items/crimson_spatula": 683,
        "/items/rainbow_spatula": 684,
        "/items/holy_spatula": 685,
        "/items/super_cooking_tea": 85,
        "/items/milking_essence": 851,
        "/items/foraging_essence": 852,
        "/items/woodcutting_essence": 853,
        "/items/cheese_alembic": 695,
        "/items/cheesesmithing_essence": 854,
        "/items/crafting_essence": 855,
        "/items/tailoring_essence": 856,
        "/items/verdant_alembic": 696,
        "/items/cooking_essence": 857,
        "/items/brewing_essence": 858,
        "/items/azure_alembic": 697,
        "/items/alchemy_essence": 859,
        "/items/enhancing_essence": 860,
        "/items/burble_alembic": 698,
        "/items/alchemy_tea": 77,
        "/items/crimson_alembic": 699,
        "/items/rainbow_alembic": 700,
        "/items/holy_alembic": 701,
        "/items/super_alchemy_tea": 87,
        "/items/gummy": 58,
        "/items/yogurt": 65,
        "/items/poke": 136,
        "/items/scratch": 140,
        "/items/smack": 144,
        "/items/apple_gummy": 59,
        "/items/apple_yogurt": 66,
        "/items/quick_shot": 149,
        "/items/water_strike": 157,
        "/items/entangle": 161,
        "/items/fireball": 165,
        "/items/orange_gummy": 60,
        "/items/orange_yogurt": 67,
        "/items/toughness": 175,
        "/items/precision": 177,
        "/items/plum_gummy": 61,
        "/items/plum_yogurt": 68,
        "/items/impale": 137,
        "/items/cleave": 141,
        "/items/sweep": 145,
        "/items/intelligence_coffee": 111,
        "/items/peach_gummy": 62,
        "/items/peach_yogurt": 69,
        "/items/rain_of_arrows": 152,
        "/items/ice_spear": 158,
        "/items/flame_blast": 166,
        "/items/toxic_pollen": 162,
        "/items/dragon_fruit_gummy": 63,
        "/items/dragon_fruit_yogurt": 70,
        "/items/berserk": 178,
        "/items/frenzy": 180,
        "/items/elemental_affinity": 179,
        "/items/star_fruit_gummy": 64,
        "/items/star_fruit_yogurt": 71,
        "/items/puncture": 138,
        "/items/maim": 142,
        "/items/stunning_blow": 146,
        "/items/silencing_shot": 153,
        "/items/frost_surge": 159,
        "/items/natures_veil": 163,
        "/items/firestorm": 167,
        "/items/super_intelligence_coffee": 118,
        "/items/log": 724,
        "/items/cheese_hatchet": 647,
        "/items/birch_log": 725,
        "/items/verdant_hatchet": 648,
        "/items/cedar_log": 726,
        "/items/azure_hatchet": 649,
        "/items/purpleheart_log": 727,
        "/items/burble_hatchet": 650,
        "/items/woodcutting_tea": 74,
        "/items/ginkgo_log": 728,
        "/items/crimson_hatchet": 651,
        "/items/redwood_log": 729,
        "/items/rainbow_hatchet": 652,
        "/items/arcane_log": 730,
        "/items/holy_hatchet": 653,
        "/items/super_woodcutting_tea": 84,
        "/items/wooden_water_staff": 266,
        "/items/wooden_nature_staff": 273,
        "/items/wooden_fire_staff": 280,
        "/items/cotton_hat": 343,
        "/items/cotton_robe_top": 392,
        "/items/cotton_robe_bottoms": 440,
        "/items/cotton_gloves": 467,
        "/items/cotton_boots": 491,
        "/items/birch_water_staff": 267,
        "/items/birch_nature_staff": 274,
        "/items/birch_fire_staff": 281,
        "/items/linen_hat": 344,
        "/items/linen_robe_top": 393,
        "/items/linen_robe_bottoms": 441,
        "/items/linen_gloves": 468,
        "/items/linen_boots": 492,
        "/items/cedar_water_staff": 268,
        "/items/cedar_nature_staff": 275,
        "/items/cedar_fire_staff": 282,
        "/items/purpleheart_water_staff": 269,
        "/items/purpleheart_nature_staff": 276,
        "/items/purpleheart_fire_staff": 283,
        "/items/bamboo_hat": 345,
        "/items/bamboo_robe_top": 394,
        "/items/bamboo_robe_bottoms": 442,
        "/items/bamboo_gloves": 469,
        "/items/bamboo_boots": 493,
        "/items/magic_coffee": 116,
        "/items/ginkgo_water_staff": 270,
        "/items/ginkgo_nature_staff": 277,
        "/items/ginkgo_fire_staff": 284,
        "/items/redwood_water_staff": 271,
        "/items/redwood_nature_staff": 278,
        "/items/redwood_fire_staff": 285,
        "/items/silk_hat": 346,
        "/items/silk_robe_top": 395,
        "/items/silk_robe_bottoms": 443,
        "/items/silk_gloves": 470,
        "/items/silk_boots": 494,
        "/items/arcane_water_staff": 272,
        "/items/arcane_nature_staff": 279,
        "/items/arcane_fire_staff": 286,
        "/items/radiant_hat": 347,
        "/items/radiant_robe_top": 396,
        "/items/radiant_robe_bottoms": 444,
        "/items/radiant_gloves": 471,
        "/items/radiant_boots": 495,
        "/items/super_magic_coffee": 123,
        "/items/swamp_essence": 861,
        "/items/cheese_enhancer": 703,
        "/items/aqua_essence": 862,
        "/items/verdant_enhancer": 704,
        "/items/jungle_essence": 863,
        "/items/azure_enhancer": 705,
        "/items/gobo_essence": 864,
        "/items/burble_enhancer": 706,
        "/items/enhancing_tea": 78,
        "/items/eyessence": 865,
        "/items/crimson_enhancer": 707,
        "/items/sorcerer_essence": 866,
        "/items/rainbow_enhancer": 708,
        "/items/bear_essence": 867,
        "/items/holy_enhancer": 709,
        "/items/super_enhancing_tea": 88,
        "/items/rough_leather": 743,
        "/items/cotton_fabric": 753,
        "/items/cheese_needle": 671,
        "/items/reptile_leather": 744,
        "/items/linen_fabric": 754,
        "/items/verdant_needle": 672,
        "/items/azure_needle": 673,
        "/items/gobo_leather": 745,
        "/items/bamboo_fabric": 755,
        "/items/burble_needle": 674,
        "/items/tailoring_tea": 81,
        "/items/crimson_needle": 675,
        "/items/beast_leather": 746,
        "/items/silk_fabric": 756,
        "/items/rainbow_needle": 676,
        "/items/umbral_leather": 747,
        "/items/radiant_fabric": 757,
        "/items/holy_needle": 677,
        "/items/super_tailoring_tea": 91,
        "/items/cheese_chisel": 663,
        "/items/verdant_chisel": 664,
        "/items/azure_chisel": 665,
        "/items/burble_chisel": 666,
        "/items/crafting_tea": 80,
        "/items/crimson_chisel": 667,
        "/items/rainbow_chisel": 668,
        "/items/holy_chisel": 669,
        "/items/super_crafting_tea": 90
    }

    // 获取背包中的物品数量
    function getInventoryItems() {
        const inventoryItems = {};
        try {
            const resourceContainer = document.querySelector(".Inventory_items__6SXv0");

            if (!resourceContainer) return inventoryItems;

            resourceContainer.querySelectorAll(".Item_itemContainer__x7kH1").forEach(item => {
                const countText = item.querySelector("div.Item_count__1HVvv").textContent;

                // 解析数量，处理带有单位的数值（如MKB）
                let count;
                if (countText.includes('B')) {
                    // 处理百万级别的数值
                    count = parseFloat(countText.replace('B', '')) * 1000000000;
                } else if (countText.includes('M')) {
                    // 处理千级别的数值
                    count = parseFloat(countText.replace('M', '')) * 1000000;
                } else if (countText.includes('K')) {
                    // 处理千级别的数值
                    count = parseFloat(countText.replace('K', '')) * 1000;
                } else {
                    // 普通数值，去除逗号
                    count = parseInt(countText.replace(/,/g, ''));
                }

                const href = item.querySelector("use").getAttribute("href");
                const hrefName = href.split("#")[1];
                const itemHrid = "/items/" + hrefName;

                if (itemHrid && !isNaN(count)) {
                    if (!inventoryItems[itemHrid]) inventoryItems[itemHrid] = 0;
                    inventoryItems[itemHrid] += count;
                }
            });
        } catch (error) {
            console.error(isZH?'读取背包物品失败:' : 'Failed to read inventory items:', error);
        }
        return inventoryItems;
    }

    // 计算升级材料
    function calculateUpgradeMaterials(houseDetails, roomHrid, fromLevel, toLevel) {
        const requiredMaterials = {};

        if (!(roomHrid in houseDetails)) {
            throw new Error(isZH ? `找不到房屋 ${roomHrid} 的信息` : `House ${roomHrid} not found`);
        }

        const roomInfo = houseDetails[roomHrid];

        if (fromLevel >= toLevel) {
            throw new Error(isZH ? "目标等级必须大于起始等级" : "Target level must be greater than the starting level");
        }

        for (let level = fromLevel + 1; level <= toLevel; level++) {
            const levelStr = level.toString();

            if (!(levelStr in roomInfo.upgradeCostsMap)) {
                throw new Error(isZH ? `找不到房屋 ${roomHrid} 等级 ${level} 的升级信息` : `Upgrade costs for house ${roomHrid} at level ${level} not found`);
            }

            const levelMaterials = roomInfo.upgradeCostsMap[levelStr];

            for (const material of levelMaterials) {
                const itemHrid = material.itemHrid;
                const count = material.count;

                requiredMaterials[itemHrid] = (requiredMaterials[itemHrid] || 0) + count;
            }
        }

        return requiredMaterials;
    }

    let isInitialized = false;

    // 添加触发按钮
    function addTriggerButton() {
        const targetSelector = '.HousePanel_housePanel__lpphK button.Button_button__1Fe9z';
        const targetButton = document.querySelector(targetSelector);

        if (targetButton && !document.getElementById('house-calculator-trigger')) {
            const triggerBtn = document.createElement('button');
            triggerBtn.className = 'Button_button__1Fe9z';
            triggerBtn.id = 'house-calculator-trigger';
            triggerBtn.style.marginLeft = '10px';
            triggerBtn.textContent = isZH ? '升级计算器' : 'House Cost Calc';

            triggerBtn.addEventListener('click', async () => {
                if (!isInitialized) {
                    try {
                        getTrainPrice();
                        createUI(houseDetails);
                        isInitialized = true;
                    } catch (error) {
                        console.error('初始化失败:', error);
                        alert(isZH ? '加载房屋数据失败，请确保数据文件可访问' : 'Failed to load house data. Please ensure the data file is accessible.');
                    }
                } else {
                    const calculator = document.getElementById('house-calculator');
                    if (calculator) {
                        calculator.style.display = calculator.style.display === 'none' ? 'block' : 'none';
                    }
                }
            });

            targetButton.parentNode.style.display = 'flex';
            targetButton.parentNode.style.gap = '10px';
            targetButton.parentNode.insertBefore(triggerBtn, targetButton.nextSibling);
        }
    }
    // 从网页读取房间当前等级和图标
    function getRoomLevelsFromUI() {
        const roomLevels = {};
        const roomIcons = {};
        const roomDivs = document.querySelectorAll(".HousePanel_housePanel__lpphK .HousePanel_houseRoom__nOmpF");

        roomDivs.forEach(div => {
            const nameElement = div.querySelector(".HousePanel_name__1SBye");
            const levelElement = div.querySelector(".HousePanel_level__2UlEu");
            const iconElement = div.querySelector("svg use");

            if (nameElement && levelElement) {
                const name = nameElement.textContent.trim();
                const levelMatch = levelElement.textContent.match(/\d+/);
                const level = levelMatch ? parseInt(levelMatch[0]) : 0;
                const iconHref = iconElement ? iconElement.getAttribute("href") : null;

                const hrid = Object.keys(houseRoomNamesCN).find(key =>
                    houseRoomNamesCN[key] === name ||
                    houseDetails[key]?.name === name
                );

                if (hrid) {
                    roomLevels[hrid] = level;
                    if (iconHref) {
                        roomIcons[hrid] = iconHref;
                    }
                }
            }
        });

        return { roomLevels, roomIcons };
    }

    function dateToStr(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const timeStr = `${y}.${m}.${d}`;

        return timeStr;
    }

    // 获取价格
    function getTrainPrice() {
        const nowDate = dateToStr(new Date());
        if (nowDate === trainPriceUpdatetime) return;
 
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/SUAN-MWI/API/refs/heads/main/train.json",
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                let jsonObj = JSON.parse(response.responseText);
                console.log("Request Result", jsonObj);
 
                trainPrice = {};
                for (const obj of jsonObj.train) {
                    trainPrice[obj.hrid] = obj.price;
                }

                const updateStr = dateToStr(new Date(jsonObj.time * 1000));

                trainPriceUpdatetime = updateStr;
 
            },
            onerror: function(error) {
                console.error("Request failed:", error);
            }
        });
 
    }

    // 创建UI界面
    function createUI(houseDetails) {
        // 获取当前房间等级和图标
        const { roomLevels: currentRoomLevels, roomIcons } = getRoomLevelsFromUI();

        GM_addStyle(`
            #house-calculator {
                position: fixed;
                top: 50px;
                right: 10px;
                background: white;
                padding: 15px;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                z-index: 9999;
                width: 400px;
                font-family: Arial, sans-serif;
                max-height: 80vh;
                overflow: auto;
                resize: both;
                color-scheme: light;
            }
            #calculator-header {
                cursor: move;
                user-select: none;
            }
            .room-checkbox {
                display: block;
                margin: 8px 0;
                padding: 8px;
                background: #f8f8f8;
                border-radius: 6px;
                border-left: 3px solid #ccc;
                transition: all 0.2s ease;
                opacity: 0.75;
            }
            .room-checkbox:hover {
                background: #f0f0f0;
                transform: translateX(2px);
                opacity: 0.9;
            }
            .room-checkbox.selected {
                background: #e8f5e9;
                border-left-color: #2E7D32;
                opacity: 1;
            }
            #results-text {
                width: 100%;
                height: 160px;
                margin-top: 10px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                resize: vertical;
                font-family: Consolas, monospace;
                font-size: 13px;
                line-height: 1.4;
            }
            .select-all-btn, #calculate-btn, #apply-to-level {
                padding: 8px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
                font-weight: bold;
            }
            .select-all-btn:hover, #calculate-btn:hover, #apply-to-level:hover {
                background: #388E3C;
            }
            #calculate-btn {
                width: 100%;
                margin-top: 10px;
                padding: 10px;
                font-size: 15px;
            }
            .level-display {
                display: inline-block;
                background: #e0e0e0;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 12px;
                margin-left: 5px;
            }
            .room-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .room-levels {
                margin-top: 5px;
                display: flex;
                align-items: center;
            }
            .level-arrow {
                margin: 0 5px;
                color: #666;
            }
            .level-input {
                width: 45%;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                text-align: center;
            }
            .calculator-header {
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                margin-bottom: 10px;
            }
            .display-option {
                margin-top: 10px;
                padding: 8px;
                background: #f5f5f5;
                border-radius: 6px;
                display: flex;
                align-items: center;
            }
            .display-option label {
                margin-right: 10px;
                cursor: pointer;
            }
        `);

        const container = document.createElement('div');
        container.id = 'house-calculator';
        container.innerHTML = `
            <div id="calculator-header" class="calculator-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #2E7D32;">${isZH ? '房屋升级材料计算器' : 'House Upgrade Material Calculator'}</h3>
                <button style="padding: 5px 10px; background: none; border: none; cursor: pointer; font-size: 18px;" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <button class="select-all-btn" id="select-all" style="width: 48%;">${isZH ? '全选/取消全选' : 'Select/Deselect All'}</button>
                <div style="width: 48%; display: flex;">
                    <input type="number" id="batch-to-level" placeholder="${isZH ? '批量目标等级' : 'Batch Target Level'}" min="1" max="8" value="8" style="width: 65%; padding: 5px; border: 1px solid #ddd; border-radius: 4px 0 0 4px; text-align: center;">
                    <button id="apply-to-level" style="width: 35%; border-radius: 0 4px 4px 0;">${isZH ? '应用' : 'Apply'}</button>
                </div>
            </div>
            <div id="rooms-container" style="max-height: 300px; overflow-y: auto; margin-bottom: 10px; padding-right: 5px;">
            ${Object.keys(houseRoomNamesCN).map(hrid => {
            const room = houseDetails[hrid];
            if (!room) return '';
            const currentLevel = currentRoomLevels[hrid] || 0;
            const iconHref = roomIcons[hrid] || '';
            return `
                <div class="room-checkbox" data-hrid="${hrid}">
                    <div class="room-header">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" value="${hrid}" style="margin-right: 8px; transform: scale(1.2);">
                            ${iconHref ? `
                            <div class="room-icon">
                                <svg role="img" aria-label="Room icon" width="100%" height="100%" class="Icon_icon__2LtL_ Icon_small__2bxvH">
                                    <use href="${iconHref}"></use>
                                </svg>
                            </div>
                            ` : ''}
                            <span>${isZH ? houseRoomNamesCN[hrid] || room.name : room.name}</span>
                        </label>
                    </div>
                    <div class="room-levels">
                        <input type="number" class="level-input" data-room="${hrid}" data-type="from" placeholder="起始" min="0" max="7" value="${currentLevel}" readonly style="background-color: #f5f5f5;">
                        <span class="level-arrow">→</span>
                        <input type="number" class="level-input" data-room="${hrid}" data-type="to" placeholder="目标" min="${currentLevel + 1}" max="8" value="8">
                    </div>
                </div>
                `;
        }).join('')}
            </div>
            <div class="display-option">
                <span>${isZH ? '物品显示格式：' : 'Item Display Format:'}</span>
                <label><input type="radio" name="display-format" value="name" checked> ${isZH ? '名称' : 'Name'}</label>
                <label><input type="radio" name="display-format" value="hrid"> HRID</label>
            </div>
            <button id="calculate-btn">${isZH ? '计算升级材料' : 'Calculate Upgrade Material'}</button>
            <textarea id="results-text" readonly placeholder="${isZH ? '计算结果将显示在这里...' : 'Upgrade material calculation results will be displayed here...'}"></textarea>
        `;

        document.body.appendChild(container);

        // 添加拖拽功能
        makeDraggable(container);

        // 添加选中房间高亮效果
        document.querySelectorAll('#rooms-container input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const roomDiv = this.closest('.room-checkbox');
                if (this.checked) {
                    roomDiv.classList.add('selected');
                } else {
                    roomDiv.classList.remove('selected');
                }
            });

            // 初始化时应用样式
            if (checkbox.checked) {
                checkbox.closest('.room-checkbox').classList.add('selected');
            }
        });

        // 全选/取消全选功能
        document.getElementById('select-all').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#rooms-container input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            checkboxes.forEach(cb => {
                cb.checked = !allChecked;
                const roomDiv = cb.closest('.room-checkbox');
                if (!allChecked) {
                    roomDiv.classList.add('selected');
                } else {
                    roomDiv.classList.remove('selected');
                }
            });
        });

        // 批量设置目标等级功能
        document.getElementById('apply-to-level').addEventListener('click', () => {
            const batchToLevel = document.getElementById('batch-to-level').value;
            if (batchToLevel && !isNaN(parseInt(batchToLevel))) {
                const toInputs = document.querySelectorAll('.level-input[data-type="to"]');
                toInputs.forEach(input => {
                    const roomHrid = input.getAttribute('data-room');
                    const fromLevel = currentRoomLevels[roomHrid] || 0;
                    // 确保目标等级大于当前等级
                    if (parseInt(batchToLevel) > fromLevel) {
                        input.value = batchToLevel;
                    }
                });
            }
        });

        // 添加计算按钮事件
        document.getElementById('calculate-btn').addEventListener('click', () => {
            const selectedRooms = Array.from(document.querySelectorAll('#rooms-container input[type="checkbox"]:checked'))
                .map(cb => ({
                    hrid: cb.value,
                    fromLevel: parseInt(document.querySelector(`input[data-room="${cb.value}"][data-type="from"]`).value),
                    toLevel: parseInt(document.querySelector(`input[data-room="${cb.value}"][data-type="to"]`).value)
                }));

            if (selectedRooms.length === 0) {
                document.getElementById('results-text').value = isZH ? '请至少选择一个房屋' : 'Please select at least one house.';
                return;
            }

            try {
                const allMaterials = {};
                const roomDetails = [];

                // 计算所有选中房间的材料总和
                selectedRooms.forEach(({ hrid, fromLevel, toLevel }) => {
                    try {
                        const materials = calculateUpgradeMaterials(houseDetails, hrid, fromLevel, toLevel);
                        Object.entries(materials).forEach(([itemHrid, count]) => {
                            allMaterials[itemHrid] = (allMaterials[itemHrid] || 0) + count;
                        });
                        roomDetails.push(`${houseDetails[hrid].name}(${fromLevel}->${toLevel})`);
                    } catch (error) {
                        roomDetails.push(`${houseDetails[hrid].name}(${isZH ? '错误' : 'Error'}: ${error.message})`);
                    }
                });

                displayResults(allMaterials, roomDetails);
            } catch (error) {
                document.getElementById('results-text').value = `${isZH ? '错误' : 'Error'}: ${error.message}`;
            }
        });
    }

    /// 修改显示计算结果的函数
    function displayResults(materials, roomDetails) {
        const resultsText = document.getElementById('results-text');
        const inventoryItems = getInventoryItems();
        const useHrid = document.querySelector('input[name="display-format"]:checked').value === 'hrid';

        let output = `${isZH ? '[升级房屋]' : '[Upgraded Houses]'}\n${roomDetails.map(detail => {
            const match = detail.match(/(.*?)\((.*?)\)/);
            if (match) {
                const [_, roomName, levels] = match;
                const hrid = Object.keys(houseDetails).find(key => houseDetails[key].name === roomName);
                if (useHrid) {
                    return `• ${hrid} (${levels})`;
                } else {
                    return `• ${isZH ? houseRoomNamesCN[hrid] || roomName : roomName} (${levels})`;
                }
            }
            return detail;
        }).join('\n')}\n\n`;

        // 计算实际需要的材料数量（扣除已有物品）
        const neededMaterials = {};
        let totalCost = 0; // 添加总造价计算

        Object.entries(materials).forEach(([itemHrid, count]) => {
            const available = inventoryItems[itemHrid] || 0;
            const needed = Math.max(0, count - available);

            if (needed > 0) {
                neededMaterials[itemHrid] = needed;
            }

            // 计算总造价
            const price = trainPrice[itemHrid] || 0;
            if (price > 0) {
                totalCost += needed * price;
            }
        });

        // 添加总造价显示
        output += `${isZH ? '[装备部分报价(' : '[Equipment Part Price('}${trainPriceUpdatetime})]\n• ${totalCost.toLocaleString()} ${isZH?'金币':'Coins'}\n\n`;

        output += `${isZH ? '[所需材料]' : '[Required Materials]'}\n`;

        if (Object.keys(neededMaterials).length === 0) {
            output += `• ${isZH?'背包中的材料已足够完成升级':'Inventory materials are sufficient for upgrade'}`;
        } else {
            Object.entries(neededMaterials)
                .sort(([itemHridA, countA], [itemHridB, countB]) => {
                    // 获取排序索引，如果不存在则使用一个较大的数值作为默认值
                    const indexA = houseMaterialsSortIndex[itemHridA] || 9999;
                    const indexB = houseMaterialsSortIndex[itemHridB] || 9999;
                    return indexA - indexB;
                })
                .forEach(([itemHrid, count]) => {
                    const itemName = itemHrid.split('/').pop().replace(/_/g, ' ');
                    const displayName = isZH ? itemsNameCN[itemHrid] || itemName : itemName;
                    const available = inventoryItems[itemHrid] || 0;
                    const total = count + available;

                    // 添加单项造价显示
                    const price = trainPrice[itemHrid] || 0;
                    const itemCost = count * price;
                    const costDisplay = price > 0 ? ` (${isZH?'价值':'Value'}: ${itemCost.toLocaleString()} ${isZH?'金币':'Coins'})` : '';

                    if (useHrid) {
                        output += `• ${itemHrid}: ${isZH?'还需':'Need'} ${count.toLocaleString()} (${isZH?'现有':'Now'} ${available.toLocaleString()}/${total.toLocaleString()})${costDisplay}\n`;
                    } else {
                        output += `• ${displayName}: ${isZH?'还需':'Need'} ${count.toLocaleString()} (${isZH?'现有':'Now'} ${available.toLocaleString()}/${total.toLocaleString()})${costDisplay}\n`;
                    }
                });
        }

        resultsText.value = output;
        resultsText.select();
    }

    // 添加拖拽功能
    function makeDraggable(element) {
        const header = document.getElementById('calculator-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'auto';
        });
    }

    // 监听DOM变化，等待目标按钮出现
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            // 检查目标按钮是否存在，以及我们的触发按钮是否不存在
            if (document.querySelector('.HousePanel_housePanel__lpphK button.Button_button__1Fe9z') &&
                !document.getElementById('house-calculator-trigger')) {
                addTriggerButton();
                // 不再断开连接，继续观察DOM变化
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化观察器
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOM);
    } else {
        observeDOM();
    }
})();