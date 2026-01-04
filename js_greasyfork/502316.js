// ==UserScript==
// @name         Steam 頁面繁體簡體中文轉換器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自動將 Steam 頁面在繁體中文和簡體中文之間轉換，並提供選項讓使用者選擇是否開啟自動跳轉。由於某些 Steam 頁面僅提供簡體中文，導致繁體中文系統瀏覽這些頁面時會顯示為空白。此插件由 Minidoracat 開發，用於解決這一問題。更多信息請參閱作者的 Discord。
// @description:zh-CN 自动将 Steam 页面在繁体中文和简体中文之间转换，并提供选项让用户选择是否开启自动跳转。由于某些 Steam 页面仅提供简体中文，导致繁体中文系统浏览这些页面时会显示为空白。此插件由 Minidoracat 开发，用于解决这一问题。更多信息请参阅作者的 Discord。
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @author       Minidoracat
// @match        *://store.steampowered.com/*
// @match        *://steamcommunity.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @homepageURL  https://github.com/Minidoracat/Steam-ZH-Language-Switcher
// @supportURL   https://discord.gg/Gur2V67
// @downloadURL https://update.greasyfork.org/scripts/502316/Steam%20%E9%A0%81%E9%9D%A2%E7%B9%81%E9%AB%94%E7%B0%A1%E9%AB%94%E4%B8%AD%E6%96%87%E8%BD%89%E6%8F%9B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/502316/Steam%20%E9%A0%81%E9%9D%A2%E7%B9%81%E9%AB%94%E7%B0%A1%E9%AB%94%E4%B8%AD%E6%96%87%E8%BD%89%E6%8F%9B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const discordUrl = 'https://discord.gg/Gur2V67';

    // 在右上角工具欄附近增加一個切換語言的按鈕
    function addSwitchButton() {
        let buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '50px';
        buttonContainer.style.right = '50px';
        buttonContainer.style.zIndex = '9999';

        let switchButton = document.createElement('button');
        switchButton.style.backgroundColor = '#1b2838'; // 深藍色背景
        switchButton.style.color = '#c6d4df'; // 淺灰色文字
        switchButton.style.border = '1px solid #4a90e2'; // 藍色邊框
        switchButton.style.padding = '10px';
        switchButton.style.cursor = 'pointer';
        switchButton.style.fontSize = '14px';
        switchButton.style.fontWeight = 'bold';
        switchButton.style.borderRadius = '5px'; // 圓角邊框

        let url = new URL(window.location.href);
        if (url.searchParams.get('l') === 'schinese') {
            switchButton.innerHTML = '切換到繁體中文';
            switchButton.onclick = function() {
                url.searchParams.set('l', 'tchinese');
                window.location.href = url.href;
            };
        } else {
            switchButton.innerHTML = '切換到簡體中文';
            switchButton.onclick = function() {
                url.searchParams.set('l', 'schinese');
                window.location.href = url.href;
            };
        }

        buttonContainer.appendChild(switchButton);
        document.body.appendChild(buttonContainer);
    }

    addSwitchButton();

    // 初始化選單
    function initMenu() {
        // 先註銷現有的選單命令
        GM_unregisterMenuCommand('autoSwitchToChineseEnable');
        GM_unregisterMenuCommand('autoSwitchToChineseDisable');
        GM_unregisterMenuCommand('autoSwitchToTraditionalChineseEnable');
        GM_unregisterMenuCommand('autoSwitchToTraditionalChineseDisable');

        const autoSwitchToChinese = GM_getValue('autoSwitchToChinese', false);
        const autoSwitchToTraditionalChinese = GM_getValue('autoSwitchToTraditionalChinese', false);

        if (autoSwitchToChinese) {
            GM_registerMenuCommand('停用自動跳轉到簡體中文', () => {
                disableAutoSwitchToChinese();
                location.reload(); // 更新選單後刷新頁面
            }, 'd');
        } else {
            GM_registerMenuCommand('啟用自動跳轉到簡體中文', () => {
                enableAutoSwitchToChinese();
                location.reload(); // 更新選單後刷新頁面
            }, 'e');
        }

        if (autoSwitchToTraditionalChinese) {
            GM_registerMenuCommand('停用自動跳轉到繁體中文', () => {
                disableAutoSwitchToTraditionalChinese();
                location.reload(); // 更新選單後刷新頁面
            }, 'f');
        } else {
            GM_registerMenuCommand('啟用自動跳轉到繁體中文', () => {
                enableAutoSwitchToTraditionalChinese();
                location.reload(); // 更新選單後刷新頁面
            }, 'g');
        }

        GM_registerMenuCommand('加入作者 Discord', joinDiscord);
    }

    // 初始化選單
    initMenu();

    function enableAutoSwitchToChinese() {
        GM_setValue('autoSwitchToChinese', true);
        GM_setValue('autoSwitchToTraditionalChinese', false); // 禁用自動跳轉到繁體中文
        alert('自動跳轉到簡體中文已啟用');
        autoSwitchToSimplifiedChinese();
    }

    function disableAutoSwitchToChinese() {
        GM_setValue('autoSwitchToChinese', false);
        alert('自動跳轉到簡體中文已停用');
    }

    function enableAutoSwitchToTraditionalChinese() {
        GM_setValue('autoSwitchToTraditionalChinese', true);
        GM_setValue('autoSwitchToChinese', false); // 禁用自動跳轉到簡體中文
        alert('自動跳轉到繁體中文已啟用');
        autoSwitchToTraditionalChinese();
    }

    function disableAutoSwitchToTraditionalChinese() {
        GM_setValue('autoSwitchToTraditionalChinese', false);
        alert('自動跳轉到繁體中文已停用');
    }

    // 檢查是否開啟自動跳轉
    if (GM_getValue('autoSwitchToChinese', false)) {
        autoSwitchToSimplifiedChinese();
    } else if (GM_getValue('autoSwitchToTraditionalChinese', false)) {
        autoSwitchToTraditionalChinese();
    }

    function autoSwitchToSimplifiedChinese() {
        let url = new URL(window.location.href);
        if (url.searchParams.get('l') !== 'schinese') {
            url.searchParams.set('l', 'schinese');
            window.location.href = url.href;
        }
    }

    function autoSwitchToTraditionalChinese() {
        let url = new URL(window.location.href);
        if (url.searchParams.get('l') !== 'tchinese') {
            url.searchParams.set('l', 'tchinese');
            window.location.href = url.href;
        }
    }

    function joinDiscord() {
        window.open(discordUrl, '_blank');
    }
})();
