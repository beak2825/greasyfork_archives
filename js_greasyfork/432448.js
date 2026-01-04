// ==UserScript==
// @name         PTT預設字型使用微軟正黑體
// @namespace    https://github.com/livinginpurple
// @version      2025.11.27.21
// @description  PTT字型用微軟正黑體，設定選單改為深色風格
// @license      WTFPL
// @author       livinginpurple
// @match        *://*.ptt.cc/*
// @match        *://disp.cc/b/*
// @match        *://disp.cc/m/*
// @match        *://disp.cc/ptt/*
// @match        *://www.pttweb.cc/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432448/PTT%E9%A0%90%E8%A8%AD%E5%AD%97%E5%9E%8B%E4%BD%BF%E7%94%A8%E5%BE%AE%E8%BB%9F%E6%AD%A3%E9%BB%91%E9%AB%94.user.js
// @updateURL https://update.greasyfork.org/scripts/432448/PTT%E9%A0%90%E8%A8%AD%E5%AD%97%E5%9E%8B%E4%BD%BF%E7%94%A8%E5%BE%AE%E8%BB%9F%E6%AD%A3%E9%BB%91%E9%AB%94.meta.js
// ==/UserScript==

(() => {
    'use strict';
    console.log(`${GM_info.script.name} is loading.`);

    // 修改處：將選單樣式改為深色系 (Dark Mode)
    GM_addStyle(`
        #font-setting-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            border-radius: 10px;
            background-color: #2b2b2b; /* 背景改深灰 */
            border: 1px solid #444;     /* 增加深色邊框 */
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.7); /* 加深陰影 */
            z-index: 9999;
            color: #e0e0e0;             /* 文字改淺灰 */
            width: 300px;
            box-sizing: border-box;
            font-family: "Microsoft JhengHei", sans-serif; /* 確保選單本身字型清晰 */
        }
        #font-setting-container label {
            display: block; 
            margin-bottom: 8px; 
            font-size: 14px; 
            font-weight: bold;
            color: #fff; /* 標籤文字全白 */
        }
        #font-setting-container select {
            margin-bottom: 15px;
            width: 100%;
            height: 35px;
            border: 1px solid #555;
            border-radius: 5px;
            background-color: #3d3d3d; /* 下拉選單背景深色 */
            font-size: 14px;
            color: #fff;               /* 下拉選單文字白色 */
            padding: 5px;
            box-sizing: border-box;
            outline: none;
        }
        #font-setting-container select:focus {
            border-color: #007bff;
        }
        #font-setting-container button {
            height: 32px; 
            border: none; 
            border-radius: 5px; 
            color: #fff; 
            font-size: 14px; 
            cursor: pointer;
            width: 48%;
            box-sizing: border-box;
            transition: background-color 0.2s;
        }
        #font-setting-container .btn-save {
            background-color: #007bff;
            margin-right: 4%;
        }
        #font-setting-container .btn-save:hover {
            background-color: #0056b3;
        }
        #font-setting-container .btn-cancel {
            background-color: #555; /* 取消按鈕改深灰 */
        }
        #font-setting-container .btn-cancel:hover {
            background-color: #444;
        }
    `);

    const fontSetting = 'fontSetting';
    const options = [
        { label: '微軟正黑體', value: 'Microsoft JhengHei' },
        { label: '微軟雅黑體', value: 'Microsoft YaHei' },
        { label: 'LINE Seed TW Regular', value: 'LINE Seed TW_OTF Regular' },
        { label: 'Noto Sans CJK TC Regular', value: 'Noto Sans CJK TC Regular' },
        { label: 'Noto Sans Mono CJK TC Regular', value: 'Noto Sans Mono CJK TC Regular' },
        { label: '更紗黑體 TC', value: 'Sarasa Gothic TC' },
        { label: '更紗等距黑體 TC', value: 'Sarasa Mono TC' },
        { label: 'Noto Sans TC', value: 'Noto Sans TC' },
        { label: 'Noto Serif TC', value: 'Noto Serif TC' },
        { label: 'MiSans', value: 'MiSans' },
        { label: 'MiSans TC', value: 'MiSans TC' }
    ];

    const savedFont = GM_getValue(fontSetting, options[0].value);
    changeFont(savedFont); // 預設使用儲存的選項
    GM_registerMenuCommand('字型設定', openOptionsMenu);
    let container;

    function openOptionsMenu() {
        // 防止重複開啟
        if (document.getElementById('font-setting-container')) return;

        const originalFont = GM_getValue(fontSetting, options[0].value);
        container = createContainer();

        const label = createLabel('請選擇字型：');
        const select = createSelect(options);
        select.value = originalFont; // 設定下拉選單的值

        select.addEventListener('change', () => {
            changeFont(select.value);
        });

        const saveButton = createButton('儲存', () => {
            const selectedOption = container.querySelector('select').value;
            GM_setValue(fontSetting, selectedOption);
            container.remove();
        }, 'btn-save');

        const cancelButton = createButton('取消', () => {
            changeFont(originalFont);
            container.remove();
        }, 'btn-cancel');

        appendChildren(container, [label, select, saveButton, cancelButton]);
        document.body.appendChild(container);
    }

    function changeFont(font) {
        switch (location.hostname) {
            case 'www.pttweb.cc':
                document.querySelectorAll('.application').forEach(el => {
                    el.style.fontFamily = font;
                });
                break;
            case 'disp.cc':
                document.body.style.fontFamily = font;
                break;
            default:
                document.querySelectorAll('.bbs-content').forEach(el => {
                    el.style.fontFamily = font;
                });
                break;
        }
        console.log(`字型已切換成：${font}`);
    }

    function createContainer() {
        const container = document.createElement('div');
        container.id = 'font-setting-container';
        return container;
    }

    function createLabel(text) {
        const label = document.createElement('label');
        label.textContent = text;
        return label;
    }

    function createSelect(options) {
        const select = document.createElement('select');

        options.forEach(option => {
            const optionElement = document.createElement('option');
            Object.assign(optionElement, {
                value: option.value,
                textContent: option.label,
            });
            select.appendChild(optionElement);
        });

        return select;
    }

    function createButton(text, clickHandler, className) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = className;
        button.addEventListener('click', clickHandler);
        return button;
    }

    function appendChildren(parent, children) {
        children.forEach(child => parent.appendChild(child));
    }

    console.log(`${GM_info.script.name} is running.`);
})();