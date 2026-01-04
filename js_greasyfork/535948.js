// ==UserScript==
// @name         DLsite tags replace
// @name:zh-TW   DLsite還原標籤與關鍵字（自用版）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  還原大部分DLsite和諧tag和◯文字和諧
// @match        *://*.dlsite.com/*
// @author       月下黑猫
// @icon         https://www.dlsite.com/images/web/common/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535948/DLsite%20tags%20replace.user.js
// @updateURL https://update.greasyfork.org/scripts/535948/DLsite%20tags%20replace.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) [2024] [月下黑猫]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    let replaceCount = 0;
    let originalTexts = [];
    let isReplacing = true;
    let isSimplified = true;

    const replacements = {
        tags: {
            '秘密さわさわ': ['痴汉', '痴漢'],
            '偷偷摸摸': ['痴汉', '痴漢'],
            '命令/無理矢理': ['命令/無理矢理', '強制/無理矢理'],
            '命令/半推半就': ['强制/強行', '強制/強行'],
            '回し': ['轮奸', '輪姦'],
            '輪流播種': ['轮奸', '輪姦'],
            '逆レ': ['逆姦', '逆レイプ'],
            '強制你播種': ['逆姦', '逆姦'],
            '合意なし': ['强奸', 'レイプ'],
            '強制播種': ['强奸', '強姦'],
            '超ひどい': ['鬼畜', '鬼畜'],
            '很過分': ['鬼畜', '鬼畜'],
            'しつけ': ['調教', '調教'],
            '教育': ['调教', '調教'],
            'トランス/暗示': ['催眠', '催眠'],
            '暗示': ['催眠', '催眠'],
            'トランス/暗示ボイス': ['催眠音聲', '催眠音聲'],
            '暗示音聲': ['催眠音聲', '催眠音聲'],
            '機械責め': ['机械奸', '機械姦'],
            '機械播種': ['机械奸', '機械姦'],
            '畜えち': ['兽奸', '獸姦'],
            '獸系播種': ['兽奸', '獸姦'],
            '異種えっち': ['异种奸', '異種姦'],
            '異種播種': ['异种奸', '異種姦'],
            'すやすやえっち': ['睡眠奸', '睡眠姦'],
            '睡眠播種': ['睡眠奸', '睡眠姦'],
            'モブおじさん': ['路人奸', 'モブ姦'],
            '路人播種': ['路人奸', '路人姦'],
            '精神支配': ['洗脑', '洗腦'],
            '精神控制': ['洗脑', '洗腦'],
            '屈辱': ['陵辱', '陵辱'],
            '羞辱': ['陵辱', '陵辱'],
            '近親もの': ['近親相姦', '近親相姦'],
            '親上加親': ['近親相姦', '近親相姦'],
            '下僕': ['奴隷', '奴隷'],
            '服從': ['奴隷', '奴隸'],
            'ボクっ娘': ['男の娘', '男の娘'],
            '男性自稱少女/僕娘': ['男娘', '男娘'],
            '酪梨': ['萝莉', '蘿莉'],
            '酪梨老太婆': ['萝莉老太婆', '蘿莉老太婆'],
            '閉じ込め': ['监禁', '監禁'],
            '關起來': ['监禁', '監禁'],
            'ざぁ～こ♡': ['メスガキ', 'メスガキ'],
            '雜~魚♡/美式咖哩': ['雌小鬼', '雌小鬼']
        },
        content: {
            '催[〇○◯]': ['催眠', '催眠'],
            '痴[〇○◯]': ['痴漢', '痴漢'],
            '陵[〇○◯]': ['凌辱', '陵辱'],
            '凌[〇○◯]': ['凌辱', '凌辱'],
            '强[〇○◯]': ['强制', '強制'],
            '強[〇○◯]': ['強制', '強制'],
            'レ[〇○◯]プ': ['レイプ', 'レイプ'],
            '輪[〇○◯]': ['輪姦', '輪姦'],
            '轮[〇○◯]': ['轮奸', '輪姦'],
            'メ[〇○◯]ガ': ['メスガ', 'メスガ'],
            'せ[〇○◯]リ': ['せなリ', 'せなリ'],
            'J[〇○◯]': ['JK', 'JK'],
            '[〇○◯]K': ['JK', 'JK'],
            '近親相[〇○◯]': ['近親相姦', '近親相姦'],
            '強[〇○◯]発情': ['强制発情', '強制発情'],
            'ち[〇○◯]ぽ': ['ちんぽ', 'ちんぽ'],
            'ま[〇○◯]こ': ['まんこ', 'まんこ'],
            '睡眠[〇○◯]': ['睡眠姦', '睡眠姦'],
            '[〇○◯]リ': ['ロリ', 'ロリ'],
            '奴[〇○◯]': ['奴隶', '奴隸'],
            '[〇○◯]女': ['少女', '少女'],
            'ロ[〇○◯]': ['ロリ', 'ロリ'],
            '金[〇○◯]': ['金玉', '金玉'],
            '孤[〇○◯]院': ['孤儿院', '孤兒院'],
            '[〇○◯]サクヤ': ['反サクヤ', '反サクヤ'],
            '[〇○◯]学生': ['小学生', '小學生'],
            '年[〇○◯]': ['年若', '年輕'],
            '犯[〇○◯]れ': ['犯され', '犯され'],
            '监[〇○◯]': ['监禁', '監禁'],
            '監[〇○◯]': ['監禁', '監禁'],
            'モブ[〇○◯]などなど': ['モブ姦などなど', 'モブ姦などなど'],
            'お[〇○◯]ん': ['おまん', 'おまん']
        }
    };

    function createFloatingUI() {
        const ui = document.createElement('div');
        ui.id = 'keyword-replace-ui';
        ui.style.cssText = `
            position: fixed;
            right: 0;
            top: 50%;
            background-color: rgba(173, 216, 230, 0.7);
            padding: 5px;
            border-radius: 5px 0 0 5px;
            cursor: move;
            user-select: none;
            z-index: 9999;
            width: 45px;
            height: 45px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            text-align: center;
            line-height: 1.2;
            font-family: "黑体", sans-serif;
            font-weight: bold;
        `;
        updateUIContent(ui);

        let isDragging = false;
        let startY;
        let startTop;

        ui.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startTop = ui.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newTop = startTop + e.clientY - startY;
                ui.style.top = `${newTop}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        ui.addEventListener('click', toggleReplacement);

        document.body.appendChild(ui);
        return ui;
    }

    function updateUIContent(ui) {
        ui.innerHTML = isReplacing ?
            `替換<br>${replaceCount}次` :
            `關閉<br>替換`;
    }

    function toggleReplacement() {
        isReplacing = !isReplacing;
        const ui = document.getElementById('keyword-replace-ui');
        if (isReplacing) {
            replaceAllText();
        } else {
            undoReplacements();
        }
        updateUIContent(ui);
    }

    function replaceText(node, replacementType) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.textContent;
            let text = originalText;

            for (let [key, value] of Object.entries(replacements[replacementType])) {
                text = text.replace(new RegExp(key, 'g'), isSimplified ? value[0] : value[1]);
            }

            if (replacementType === 'content') {
                // 特殊规则：如果"强[〇○◯]"后面没有中文、日文或为空，替换为"强奸"/"強姦"
                text = text.replace(/强[〇○◯](?![ぁ-んァ-ン一-龯\u4e00-\u9fa5]|$)/g, isSimplified ? '强奸' : '強姦');
            }

            if (text !== originalText) {
                originalTexts.push({node: node, text: originalText});
                node.textContent = text;
                replaceCount++;
                updateUIContent(document.getElementById('keyword-replace-ui'));
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let child of node.childNodes) {
                replaceText(child, replacementType);
            }
        }
    }

    function replaceAllText() {
        replaceCount = 0;
        originalTexts = [];
        document.querySelectorAll('.main_genre a').forEach(node => replaceText(node, 'tags'));
        replaceText(document.body, 'content');
    }

    function undoReplacements() {
        while (originalTexts.length > 0) {
            const {node, text} = originalTexts.pop();
            node.textContent = text;
        }
        replaceCount = 0;
        updateUIContent(document.getElementById('keyword-replace-ui'));
    }

    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (isReplacing) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches('.main_genre a')) {
                            replaceText(node, 'tags');
                        } else {
                            replaceText(node, 'content');
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function checkLanguage() {
        const langSelector = document.querySelector('.header_dropdown_nav_Link.type_language_top i');
        isSimplified = langSelector && langSelector.textContent.includes('简体中文');
    }

    // 创建UI
    createFloatingUI();

    // 检查语言并设置isSimplified
    checkLanguage();

    // 初始替换
    replaceAllText();

    // 监听动态变化
    observeChanges();
})();