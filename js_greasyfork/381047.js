// ==UserScript==
// @name         RM stat names
// @namespace    https://lotc.cc
// @version      0.2.1
// @description  RM stat names in zh-CN
// @author       @GeckoXtra
// @match        https://riven.market/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381047/RM%20stat%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/381047/RM%20stat%20names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dictName = {
        "Damage": "伤害",
        "Multishot": "多重射击",
        "Fire Rate / Attack Speed": "射速/攻速",
        "Damage to Corpus": "对Corpus伤害",
        "Damage to Grineer": "对Grineer伤害",
        "Damage to Infested": "对Infested伤害",
        "Impact": "冲击伤害",
        "Puncture": "穿刺伤害",
        "Slash": "切割伤害",
        "Cold": "冰冻伤害",
        "Electric": "电击伤害",
        "Heat": "火焰伤害",
        "Toxin": "毒素伤害",
        "Channeling Damage": "导引伤害",
        "Channeling Efficiency": "导引效率",
        "Combo Duration": "连击时间",
        "Critical Chance": "暴击几率",
        "Critical Damage": "暴击伤害",
        "Critical Chance for Slide Attack": "滑行暴击率",
        "Finisher Damage": "终结技伤害",
        "Flight Speed": "飞行速度",
        "Ammo Max": "备弹",
        "Magazine Capacity": "弹夹容量",
        "Punch Through": "穿透",
        "Reload Speed": "换弹速度",
        "Range": "范围",
        "Status Chance": "触发几率",
        "Status Duration": "触发时间",
        "Weapon Recoil": "武器后坐力",
        "Zoom": "变焦",
        "Initial Combo": "初始连击数",
        "Melee Combo Efficiency": "近战连击效率",
        "Chance to gain extra Combo count": "额外连击数几率",
        "Chance to not gain Combo count": "不增长连击数几率",
        "Additional Combo Count Chance": "额外连击数几率",
        "Heavy Attack Efficiency": "近战重击效率"
    };

    var dictDesc = {
        "Damage": "伤害",
        "Melee Damage": "近战伤害",
        "Multishot": "多重射击",
        "Fire Rate": "射速",
        "Attack Speed": "攻速",
        "Damage to Corpus": "对Corpus伤害",
        "Damage to Grineer": "对Grineer伤害",
        "Damage to Infested": "对Infested伤害",
        "Impact": "冲击伤害",
        "Puncture": "穿刺伤害",
        "Slash": "切割伤害",
        "Cold": "冰冻伤害",
        "Electricity": "电击伤害",
        "Heat": "火焰伤害",
        "Toxin": "毒素伤害",
        "Damage while Channeling": "导引状态时伤害",
        "Efficiency while Channeling": "导引状态效率",
        "Slide Attack has +": "滑行攻击有+",
        "Critical Chance for Slide Attack": "几率造成暴击",
        "Combo Duration": "连击时间",
        "Critical Chance": "暴击几率",
        "Critical Damage": "暴击伤害",
        "Finisher Damage": "终结技伤害",
        "Projectile Flight Speed": "子弹飞行速度",
        "Ammo Maximum": "备弹",
        "Magazine Size": "弹夹容量",
        "Punch Through": "穿透",
        "Reload Speed": "换弹速度",
        "Range": "范围",
        "Status Chance": "触发几率",
        "Status Duration": "触发时间",
        "Weapon Recoil": "武器后坐力",
        "Zoom": "变焦",
        "Initial Combo": "初始连击数",
        "Melee Combo Efficiency": "近战连击效率",
        "Chance to gain extra Combo count": "额外连击数几率",
        "Chance to not gain Combo count": "不增长连击数几率",
        "Additional Combo Count Chance": "额外连击数几率",
        "Heavy Attack Efficiency": "近战重击效率"
    };

    for(var key in statsData){
        statsData[key]["Name"] = statsData[key]["Name"] in dictName ? dictName[statsData[key]["Name"]] : statsData[key]["Name"];
        statsData[key]["Desc"] = statsData[key]["Desc"] in dictDesc ? dictDesc[statsData[key]["Desc"]] : statsData[key]["Desc"];
        statsData[key]["Pre"] = statsData[key]["Pre"] in dictDesc ? dictDesc[statsData[key]["Pre"]] : statsData[key]["Pre"];
        if("MeleeDesc" in statsData[key]) {
            statsData[key]["MeleeDesc"] = statsData[key]["MeleeDesc"] in dictDesc ? dictDesc[statsData[key]["MeleeDesc"]] : statsData[key]["MeleeDesc"];
        }
    }

    formatStats();
})();