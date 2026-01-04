// ==UserScript==
// @name         Pokémon Showdown Replay Scouter 汉化与增强
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  对Replay Scouter界面进行汉化和增强。
// @author       AnsonIsTheBest
// @match        https://fulllifegames.com/Tools/ReplayScouter/*
// @grant        GM_addStyle
// @grant        GM_log
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/544355/Pok%C3%A9mon%20Showdown%20Replay%20Scouter%20%E6%B1%89%E5%8C%96%E4%B8%8E%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/544355/Pok%C3%A9mon%20Showdown%20Replay%20Scouter%20%E6%B1%89%E5%8C%96%E4%B8%8E%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const keyElementSelector = 'textarea'; // <--- 这是脚本启动的关键，如果无效请修改这里

    const checkPageReady = setInterval(() => {
        const keyElement = document.querySelector(keyElementSelector);

        if (keyElement) {
            clearInterval(checkPageReady);
            initializeEnhancements(keyElement);
        }
    }, 500);
    setTimeout(() => clearInterval(checkPageReady), 20000);


    function initializeEnhancements(replayTextBox) {
        GM_log('Replay Scouter 增强脚本已启动！');
        const translations = {
            'Replays': '回放链接',
            'Names': '用户名',
            'Date Filters': '按日期筛选',
            'Tiers': '分级',
            'Format': '格式',
            'Opponents': '对手名字',
            'Grouped': '按组分类',
            'Visual Representation': '可视化展示',
            'Optional: User Definition (e.g. \'fulllifegames\' or \'fulllifegames,fulllifegamer\')': '（可选项）用户名称（例：\'fulllifegames\' 或 \'fulllifegames,AnsonIsTheBest\'',
            'Optional: List of replays (separate by new line)': '（可选项）在此处粘贴回放链接，每行一个',
            'Enter the Showdown Usernames':'输入ps玩家名',
            'Optional: Search for a Tier Definition (e.g. \'[Gen 9] OU\' or add one with \'gen9ou\')':'（可选项）分级名称（例：\'[Gen 9] OU\'或输入\'gen9ou\'来搜索（不怎么可靠，建议使用下拉框以防万一））',
            'Enter the Showdown Tiers':'输入分级名字',
            'Optional: Opponent Definition (e.g. \'patlop2307\' or \'patlop2307,Fantos13\')':'（可选项）对手名称（例：\'nh7\'或\'nh7,cscl\'，请删除名字中的中文字符，例：xieeee左手->xieeee）',//sry I have to use the short names here
            'Enter the Opponent\'s Showdown Usernames':'输入对手名字',
            //'Enter Replays':'输入回放链接',
            //'Select if the replays should be grouped by team':'选择是否要将回放按组分类',
            //TODO: Those two will smh make the button or the input box disappear
            'List Representation':'按列表展示',
            'Raw Representation':'展示原始数据',
            'Text Representation':'按文本展示',
            'Table Representation':'按表格展示',
            'Pokémon Statistics (Table)':'宝可梦使用数据（表格）',
            'Combos Statistics (Table)':'组合使用数据（表格）',
            'Combos Statistics With Leads (Table)':'带首发的组合使用数据（表格）',
            'Graph Statistics':'使用数据图表',
            'Item Statistics (Table)':'道具使用数据（表格）',
            'Item by Pokémon Statistics (Table)':'按照宝可梦数据排的道具数据（表格）',
            'Lead Statistics (Table)':'首发数据（表格）',
            'Move Statistics (Table)':'技能数据（表格）',
            'Move by Pokémon Statistics (Table)':'按宝可梦数据排的技能数据（表格）',
            'Search Queries':'关键词',
            'As an example, you can search for specific Pokémon, Moves, Items, Formats or even the Players (negate with a \'-\' in front)':'举例来说，你可以搜索具体的宝可梦，招式，分级甚至是玩家（在前面加\'-\'以排除）',
            'Enter Search Queries for the content down below':'输入关键词',
            'Enter a Minimum and Maximum Date':'输入一个最小和最大日期',
            'Sort Options':'筛选选项',
            'Choose a tag...':'选择一个排序方法',
            'Date (Asc)':'日期（升序）',
            'Date (Desc)':'日期（降序）',
            'Format (Asc)':'分级（升序）',
            'Format (Desc)':'分级（降序）',
            'Number of Replays (Asc)':'回放数量（升序）',
            'Number of Replays (Desc)':'回放数量（降序）',
            'Player (Asc)':'玩家（升序）',
            'Player (Desc)':'玩家（降序）',
            'Rating (Asc)':'分数（升序）',
            'Rating (Desc)':'分数（降序）',
            'Views (Asc)':'观看数量（升序）',
            'Views (Desc)':'观看数量（降序）',
            'Please provide at a minimum a name, a tier or a list of replays (note that private replays will be cached and might appear on the public search).':'请至少提供一个玩家名称、一个分级或一个回放列表（请注意，私人回放将被缓存并可能出现在公共搜索中）。',
        };

        function translatePage() {
            document.querySelectorAll('body, body *').forEach(element => {
                const textToTranslate = element.textContent.trim();
                if (translations[textToTranslate]) {
                    element.textContent = translations[textToTranslate];
                }
                if (element.placeholder && translations[element.placeholder]) {
                    element.placeholder = translations[element.placeholder];
                }
            });
             GM_log('页面已汉化。');
        }
        translatePage();


        GM_addStyle(`
            .replay-scouter-highlight {
                border: 2px solid #28a745 !important;
                box-shadow: 0 0 10px rgba(40, 167, 69, 0.5) !important;
                transition: all 0.3s ease-in-out;
            }
        `);

        async function checkClipboardAndHighlight() {
            try {
                const clipboardText = await navigator.clipboard.readText();
                if (clipboardText.includes('replay.pokemonshowdown.com')) {
                    replayTextBox.classList.add('replay-scouter-highlight');
                } else {
                    replayTextBox.classList.remove('replay-scouter-highlight');
                }
            } catch (err) {
                replayTextBox.classList.remove('replay-scouter-highlight');
                // GM_log('无法读取剪贴板'); // 这一行可以取消注释用于调试
            }
        }
        window.addEventListener('focus', checkClipboardAndHighlight);
        checkClipboardAndHighlight();
    }
})();