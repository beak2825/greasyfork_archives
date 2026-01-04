// ==UserScript==

// @name         紳士漫畫 - 開關式 自動點擊下拉閱讀按鈕
// @name:zh-TW   紳士漫畫 - 開關式 自動點擊下拉閱讀按鈕
// @name:zh-CN   绅士漫画 - 开关式 自动点击下拉阅读按钮
// @name:ja      wnacg - 開閉式スイッチ - ドロップダウンリーディングボタンの自動クリック
// @name:en      wnacg - Switch - Automatically Click Dropdown Read Button
// @version      0.6.1
// @author       Scott

// @description         點擊漫畫封面進入後，自動點擊下拉閱讀按鈕
// @description:zh-TW   點擊漫畫封面進入後，自動點擊下拉閱讀按鈕
// @description:zh-CN   点击漫画封面进入后，自动点击下拉阅读按钮
// @description:ja      漫画の表紙をクリックして入ると、自動的にドロップダウン読書ボタンをクリックします。
// @description:en      After clicking on the comic cover to enter, automatically click the dropdown reading button.

// @match        http://www.wnacg.com/*
// @match        https://www.wnacg.com/*
// @match        http://wnacg.com/*
// @match        https://wnacg.com/*

// @grant        none

// @license      MIT
// @namespace    https://greasyfork.org/users/1284613

// @downloadURL https://update.greasyfork.org/scripts/493845/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%20-%20%E9%96%8B%E9%97%9C%E5%BC%8F%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E4%B8%8B%E6%8B%89%E9%96%B1%E8%AE%80%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/493845/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%20-%20%E9%96%8B%E9%97%9C%E5%BC%8F%20%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E4%B8%8B%E6%8B%89%E9%96%B1%E8%AE%80%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 檢查localStorage是否有記錄開關狀態，如果沒有則預設為true（開啟狀態）
    var enableScript = localStorage.getItem('enableScript') === 'false' ? false : true;

    // 新增開關功能的HTML
    var switchHTML = `
        <li>
            <input type="checkbox" id="switch" ${enableScript ? 'checked' : ''} />
            <label for="switch" class="switch-label">
                <span class="switch-ball"></span>
                <span class="switch-txt" turnOn="ON" turnOff="OFF">${enableScript ? 'ON' : 'OFF'}</span>
            </label>
        </li>
    `;

    // 新增開關功能的CSS
    var switchCSS = `
        input[type=checkbox] {
            height: 0;
            width: 0;
            visibility: hidden;
        }

        .switch-label {
            cursor: pointer;
            width: 60px; /* 調整開關寬度 */
            height: 25px;
            background: grey;
            display: inline-block;
            position: relative;
            border-radius: 12.5px;
            vertical-align: middle;
            margin-right: 10px;
            transform: translateY(30%);
        }

        .switch-ball {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 2px;
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            transition: 0.3s;
        }

        .switch-txt {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 30px;
            font-size: 12px;
            color: #fff;
            padding-left: 5px; /* 新增的padding */
            transition: 0.3s;
            left: 36%;
        }

        input:checked + .switch-label {
            background: #2196F3;
        }

        input:checked + .switch-label .switch-ball {
            left: calc(100% - 22px);
        }

        input:checked + .switch-label .switch-txt {
            left: 2px;
            transform: translateY(-50%);
        }
    `;

    // 插入開關功能的HTML和CSS
    var navElement = document.querySelector('.nav ul#album_tabs');
    if (navElement) {
        navElement.insertAdjacentHTML('beforeend', switchHTML);
        var styleElement = document.createElement('style');
        styleElement.textContent = switchCSS;
        document.head.appendChild(styleElement);

        // 更新開關文字
        var switchText = document.querySelector('.switch-txt');
        if (switchText) {
            switchText.textContent = enableScript ? 'ON' : 'OFF';
        }

        // 監聽開關按鈕的變化
        document.getElementById('switch').addEventListener('change', function() {
            enableScript = this.checked;
            switchText.textContent = enableScript ? 'ON' : 'OFF';

            // 將開關狀態保存到localStorage中
            localStorage.setItem('enableScript', enableScript);
            
            // 檢查並執行自動點擊功能
            if (enableScript && window.location.pathname.startsWith("/photos")) {
                // 取得網址片段
                var urlFragment = window.location.href.match(/aid-(\d+)\.html/);

                // 如果找到網址片段，則使用它來構建目標按鈕的href屬性值
                if (urlFragment) {
                    // 動態構建href屬性值
                    var targetHref = '/photos-slide-aid-' + urlFragment[1] + '.html';
                    // 找到目標按鈕
                    var targetButton = document.querySelector('a.btn[href="' + targetHref + '"]');

                    // 如果找到了目標按鈕，則模擬點擊
                    if (targetButton) {
                        targetButton.click();
                    }
                }
            } else {
                // 如果開關為關閉狀態，則清除自動點擊的操作
                // 這裡放置清除自動點擊功能的代碼
            }
        });
    }

    // 如果腳本已啟用，則執行自動點擊功能
    if (enableScript && window.location.pathname.startsWith("/photos")) {
        // 取得網址片段
        var urlFragment = window.location.href.match(/aid-(\d+)\.html/);

        // 如果找到網址片段，則使用它來構建目標按鈕的href屬性值
        if (urlFragment) {
            // 動態構建href屬性值
            var targetHref = '/photos-slide-aid-' + urlFragment[1] + '.html';
            // 找到目標按鈕
            var targetButton = document.querySelector('a.btn[href="' + targetHref + '"]');

            // 如果找到了目標按鈕，則模擬點擊
            if (targetButton) {
                targetButton.click();
            }
        }
    }
})();