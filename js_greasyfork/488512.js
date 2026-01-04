// ==UserScript==
// @name         文本替换插件
// @namespace    your-namespace
// @version      2.0
// @description  在网页中替换文本,支持直接替换、多组替换规则和可靠的撤销功能
// @match        *://*/*
// @match        file:///D:/Downloads/sheet.htm
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488512/%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/488512/%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let replacementRules = GM_getValue('replacementRules', []);
    let replacementHistory = [];

    GM_addStyle(`
        #textReplacerDialog {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f0f0f0;
            color: #333;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            display: none;
            font-family: Arial, sans-serif;
            width: 300px;
        }
        #textReplacerDialog input {
            width: calc(100% - 10px);
            padding: 5px;
            margin: 5px 0;
        }
        #textReplacerDialog button {
            margin: 2px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        #textReplacerDialog button:hover {
            background-color: #45a049;
        }
        #rulesList {
            margin-top: 10px;
            max-height: 150px;
            overflow-y: auto;
        }
        .ruleItem {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            font-size: 12px;
        }
        .ruleItem button {
            background-color: #f44336;
            padding: 2px 5px;
            font-size: 10px;
        }
        .ruleItem button:hover {
            background-color: #da190b;
        }
    `);

    const dialog = document.createElement('div');
    dialog.id = 'textReplacerDialog';
    dialog.innerHTML = `
        <h3 style="margin-top: 0;">文本替换工具</h3>
        <input type="text" id="originalText" placeholder="要替换的文本">
        <input type="text" id="replacementText" placeholder="替换后的文本">
        <button id="replaceButton">直接替换</button>
        <button id="addRuleButton">添加规则</button>
        <button id="applyRulesButton">应用所有规则</button>
        <button id="undoButton">撤销</button>
        <button id="closeButton">关闭</button>
        <div id="rulesList"></div>
    `;
    document.body.appendChild(dialog);

    const originalTextInput = document.getElementById('originalText');
    const replacementTextInput = document.getElementById('replacementText');
    const replaceButton = document.getElementById('replaceButton');
    const addRuleButton = document.getElementById('addRuleButton');
    const applyRulesButton = document.getElementById('applyRulesButton');
    const undoButton = document.getElementById('undoButton');
    const closeButton = document.getElementById('closeButton');
    const rulesList = document.getElementById('rulesList');

    replaceButton.addEventListener('click', function() {
        const original = originalTextInput.value.trim();
        const replacement = replacementTextInput.value.trim();
        if (original && replacement) {
            performReplace([{ original, replacement }]);
        }
    });

    addRuleButton.addEventListener('click', function() {
        const original = originalTextInput.value.trim();
        const replacement = replacementTextInput.value.trim();
        if (original && replacement) {
            replacementRules.push({ original, replacement });
            updateRulesList();
            GM_setValue('replacementRules', replacementRules);
            originalTextInput.value = '';
            replacementTextInput.value = '';
        }
    });

    applyRulesButton.addEventListener('click', function() {
        if (replacementRules.length > 0) {
            performReplace(replacementRules);
        }
    });

    function updateRulesList() {
        rulesList.innerHTML = '';
        replacementRules.forEach((rule, index) => {
            const ruleItem = document.createElement('div');
            ruleItem.className = 'ruleItem';
            ruleItem.innerHTML = `
                <span>${rule.original} → ${rule.replacement}</span>
                <button class="deleteRule" data-index="${index}">删除</button>
            `;
            rulesList.appendChild(ruleItem);
        });

        document.querySelectorAll('.deleteRule').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                replacementRules.splice(index, 1);
                updateRulesList();
                GM_setValue('replacementRules', replacementRules);
            });
        });
    }

    undoButton.addEventListener('click', function() {
        if (replacementHistory.length > 0) {
            const lastOperation = replacementHistory.pop();
            restoreTextNodes(lastOperation);
        }
    });

    closeButton.addEventListener('click', function() {
        dialog.style.display = 'none';
    });

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'h') {
            dialog.style.display = dialog.style.display === 'none' ? 'block' : 'none';
        }
    });

    function performReplace(rules) {
        const snapshot = [];
        const elements = document.getElementsByTagName('*');
        for (let element of elements) {
            for (let node of element.childNodes) {
                if (node.nodeType === 3) {
                    let originalText = node.nodeValue;
                    let newText = originalText;
                    rules.forEach(rule => {
                        newText = newText.replace(new RegExp(rule.original, 'g'), rule.replacement);
                    });
                    if (newText !== originalText) {
                        snapshot.push({ node: node, text: originalText });
                        node.nodeValue = newText;
                    }
                }
            }
        }
        if (snapshot.length > 0) {
            replacementHistory.push(snapshot);
        }
    }

    function restoreTextNodes(snapshot) {
        snapshot.forEach(item => {
            if (item.node.parentNode) {
                item.node.nodeValue = item.text;
            }
        });
    }

    updateRulesList();
})();
