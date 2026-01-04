// ==UserScript==
// @name         DFFilter Translation
// @namespace    http://tampermonkey.net/
// @version      2023-12-30
// @description  Translation
// @author       Czk
// @match        https://maelstroom.net/*
// @icon         https://www.playdarktide.com/
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/483419/DFFilter%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/483419/DFFilter%20Translation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义翻译字典
    var dictionary = {
        'Books / Circumstance': '书籍/特殊状况',
        'Difficulty': '难度',
        'Exact Circumstance': '特殊状况',
        'Flash Missions Only': '只筛选金级任务',
        'Filter Low-Int missions': '只筛选简单任务',
        'Filter Hazardous missions': '只筛选危险人物',
        'No Filter': '无筛选',
        'Filter Missions': '筛选任务',
        'Requires Circumstance': '只需要特殊状况',
        'Requires Book': '只需要书籍',
        'Requires Either': '需要任一个',
        'Requires Both': '两者都需要',
        'Power Supply/Hunting Ground/Snipers': '供电中断/狩猎场/狙击手',
        'Vigil Station Oblivium': '◯奥布里维姆监测站',
        'Comms-Plex 154/2f': '◯154/2f 通讯站',
        'Consignment Yard HL-17-36': '◯HL-17-36 货运站',
        'Chasm Logistratum': '◯隘口后勤处',
        'Chasm Station HL-16-11': '◯HL-16-11 隘口站',
        'Ascension Riser 31': '◯31号升降机',
        'Smelter Complex HL-17-36': '◯HL-17-36 综合熔炼厂',
        'Excise Vault Spireside-13': '◯尖塔区-13 特许仓库',
        'Refinery Delta-17': '◯D-17 精炼厂',
        'Power Matrix HL-17-36': '◯HL-17-36 电力矩阵',
        'Magistrati Oubliette TM8-707': '◯TM8-707 法庭密牢',
        'Silo Cluster 18-66/a': '◯18-66/a 水仓群',
        'Comms-Plex 154/2f': '◯154/2f 通讯站',
        'Relay Station TRS-150': '◯TRS-150 中继站',
        'Enclavum Baross': '◯巴洛斯飞地',
        'Archivum Sycorax': '◯赛克拉克斯档案馆',
        'Hab Dreyko': '◯德雷克居住区',
        'FREIGHT PORT HL-32-2, "The Hourglass"': '◯HL-32-2货运港口，“沙漏区”',
        'Throneside': '◯王座区',
        'Chasm Station': '◯隘口终点站',
        'Metalfab 36': '◯36号冶金厂',
        'The Torrent': '◯奔流区',
        'Espionage': '谍报',
        'Raid': '突袭',
        'Assassination': '暗杀',
        'Strike': '打击',
        'Investigation': '调查',
        'Repair': '修理',
        'Disruption': '破坏',
        'Hi-Intensity ': '高强度',
        'Low-Intensity ': '低强度',
        'Hunting Grounds': '狩猎场',
        'Shock Troop Gauntlet': '突击部队挑战',
        'Engagement Zone': '交战区',
        'Power Supply Interruption': '供电中断',
        'Sniper Gauntlet': '狙击手挑战',
        'Ventilation Purge': '通风净化',
        'Gauntlet': '挑战',
        'Default': '默认',
        'Seize Grimoires': '获取魔法书',
        'Recover Scriptures': '找回圣经',
        'No books': '没有书',
        'Started ': '开始于',
        'hrs ago': '小时之前',
        'Extra Barrels': '额外炸药桶',
        'Sedition': 'n1',
        'Uprising': 'n2',
        'Malice': 'n3',
        'Heresy': 'n4',
        'Damnation': 'n5',
        'Mercantile': '◯贸易区',
        'Warren': '◯窄道',
        'Extra Grenades & Barrels': '强化闪击&炸药桶',
        'Mutants': '一波又一波的变种人',
        'Poxbursters': '额外的瘟疫爆者',
        'Cooldowns Reduced': '技能冷却减少',
        'Nurgle-Blessed Shock Troop': '受纳垢祝福的突击部队',
        'Monstrous': '怪物专家'
    };

    // 获取所有文本
    var textNodes = document.evaluate("//body//text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // 循环遍历替换文本
    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        var text = node.nodeValue;

        // 跳过不相关文本
        if (text.trim() === "" || text.startsWith("/mmtimport")) {
            continue;
        }

        // 用字典文本替换
        for (var key in dictionary) {
            var value = dictionary[key];
            text = text.replace(key, value);
        }

        // 更新值为字典文本
        node.nodeValue = text;
    }
})();