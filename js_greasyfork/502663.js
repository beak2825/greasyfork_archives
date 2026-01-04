// ==UserScript==
// @name         PSChina Server Translation CAP
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0.2
// @author       Sun_ever、AL(Silver)
// @description  PSChina Server Translation CAP汉化脚本
// @match        *://china.psim.us/*
// @match        *://replay.pokemonshowdown.com/*
// @match        *://play.pokemonshowdown.com/*
// @match        *://dex.pokemonshowdown.com/*
// @match        *://smogtours.psim.us/*
// @match        *://psc.sciroccogti.top/*
// @downloadURL https://update.greasyfork.org/scripts/502663/PSChina%20Server%20Translation%20CAP.user.js
// @updateURL https://update.greasyfork.org/scripts/502663/PSChina%20Server%20Translation%20CAP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        // CAP OU

        "Arghonaut": "阿尔戈船蛸",
        "Astrolotl": "太空蝾螈",
        "Aurumoth": "极光蛾",
        "Caribolt": "雷震驯鹿",
        "Cawmodore": "乌鸦海将",
        "Cresceidon": "新月海王",
        "Chuggalong": "鸣擎龙车",
        "Chromera": "绮美拉",
        "Colossoil": "钻土巨鲸",
        "Crucibelle": "坩锅巫女",
        "Cyclohm": "雷暴气旋龙",
        "Equilibra": "平衡天平",
        "Fidgit": "躁躁蛛",
        "Hemogoblin": "热血灵",
        "Jumbao": "大大包",
        "Kerfluffle": "胡闹拳",
        "Kitsunoh": "无脸鬼狐",
        "Krilowatt": "瓦特磷虾",
        "Malaconda": "叶水蚺",
        "Miasmaw": "龙尾瘴蝎",
        "Mollux": "发光壳",
        "Naviathan": "圣教水手",
        "Necturna": "甘露夜妖",
        "Pajantom": "睡袍双子",
        "Plasmanta": "等离魔鬼鱼",
        "Pyroak": "燃木灵",
        "Revenankh": "圣符归魂",
        "Saharaja": "沙漠驼帝",
        "Smokomodo": "弥烟巨蜥",
        "Snaelstrom": "漩涡牛",
        "Stratagem": "战略飞石",
        "Syclant": "冰刺蚁",
        "Tomohawk": "飞弹鹰",
        "Venomicon": "毒蚀圣典",
        "-Epilogue": "-终章",
        "Venomicon-Epilogue": "毒蚀圣典-终章",
        "Volkraken": "火海山妖",
        "Voodoom": "巫毒咒娃",

        //CAP NFE

        "Argalis": "银虫蛹",
        "Caimanoe": "船鳄",
        "Coribalis": "珊壳蛹",
        "Duohm": "双电云",
        "Electrelk": "秀电鹿",
        "Flarelm": "焚甲木",
        "Scattervein": "散脉灵",
        "Smoguana": "浓烟蜥",
        "Tactite": "战斗岩矿",

        //CAP LC

        "Ababo": "血系宝",
        "Brattler": "鼓童蛇",
        "Breezi": "吹风虫",
        "Cawdet": "鸟学员",
        "Cupra": "铜虫仔",
        "Dorsoil": "掘地鲸",
        "Embirch": "焚怒树精",
        "Fawnifer": "翠叶鹿",
        "Floatoy": "浮泳鳄",
        "Justyke": "审判锤",
        "Miasmite": "浊螨",
        "Monohm": "独电云",
        "Mumbao": "顽宝树",
        "Necturine": "蜜露甘灵",
        "Nohface": "无脸狐",
        "Pluffle": "毛绒偶",
        "Privatyke": "童兵章",
        "Protowatt": "原虾",
        "Rebble": "诈诡石",
        "Saharascal": "纨绔驼子",
        "Scratchet": "斧冲鹰雏",
        "Smogecko": "薄雾蜥蜴",
        "Snugglow": "抱荧鲼",
        "Solotl": "日光螈",
        "Swirlpool": "漩涡发",
        "Syclar": "小冰蚁",
        "Volkritter": "火山乌贼",
        "Voodoll": "恶巫偶",

        //CAP 特性

        "Rebound": "弹反",
        "On switch-in, blocks certain status moves and bounces them back to the user.": "当登场时，无效并反弹部分以自身为目标的变化招式。",
        "Persistent": "持之以恒",
        "When used, Gravity/Heal Block/Safeguard/Tailwind/Room effects last 2 more turns.": "当使用时，将重力/回复封锁/神秘守护/顺风/空间类效果持续回合数延长2回合。",
        "Mountaineer": "登山者",
        "On switch-in, this Pokemon avoids all Rock-type attacks and Stealth Rock.": "当登场时，该特性的宝可梦免疫所有岩石属性攻击以及隐形岩。",

        // CAP 招式

        "Shadow Strike": "暗影突击",
        "Paleo Wave": "远古波",
        "20% chance to lower the target's Attack by 1.": "有20%几率使目标的攻击下降1级",

        // CAP 道具

        "Vile Vial": "恶毒魔瓶",

        // 更多翻译对照
    };
    if (unsafeWindow.__pokemon_init_dict) {
        unsafeWindow.__pokemon_init_dict(translations)
    } else {
        unsafeWindow.__pokemon_showdown__translations = translations
        unsafeWindow.__pokemon_showdown__back_dict = {}
        for (let key of Object.keys(translations)) {
            unsafeWindow.__pokemon_showdown__back_dict[translations[key]] = key
        }
    }
})();