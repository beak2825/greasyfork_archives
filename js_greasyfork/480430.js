// ==UserScript==
// @name         Steam市场cs武器箱批量出售
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  批量出售cs武器箱
// @author       慌得一批的荒
// @include      https://steamcommunity.com/market/
// @match        https://steamcommunity.com/market/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480430/Steam%E5%B8%82%E5%9C%BAcs%E6%AD%A6%E5%99%A8%E7%AE%B1%E6%89%B9%E9%87%8F%E5%87%BA%E5%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/480430/Steam%E5%B8%82%E5%9C%BAcs%E6%AD%A6%E5%99%A8%E7%AE%B1%E6%89%B9%E9%87%8F%E5%87%BA%E5%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化脚本状态
    let scriptEnabled = false;

    // 创建按钮和面板
    const panel = document.createElement('div');
    const button = document.createElement('button');

    // 面板样式
    GM_addStyle(`
        #scriptPanel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: white;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
            z-index: 10000;
        }

        #scriptToggleButton {
            background-color: #4CAF50;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
    `);

    // 面板配置
    panel.id = 'scriptPanel';
    button.id = 'scriptToggleButton';
    button.textContent = '批量出售';

    // 按钮点击事件
    button.addEventListener('click', function() {
        scriptEnabled = !scriptEnabled;
        button.textContent = scriptEnabled ? '关闭' : '批量出售';
        if (scriptEnabled) {
            runScript();
        }
    });

    // 将面板和按钮添加到文档中
    panel.appendChild(button);
    document.body.appendChild(panel);

    // 提取地址栏中最后一个 / 后的内容
    function extractLastSegment(url) {
        const parts = url.split('/');
        return parts.pop() || parts.pop();  // 处理潜在的尾部斜杠
    }

    // 脚本启用时的功能
    function runScript() {
        const item = extractLastSegment(window.location.href);
        const steamUrl = `https://steamcommunity.com/market/multisell?appid=730&contextid=2&items[]=${item}`;
        window.open(steamUrl, '_blank');
        console.log("批量出售已打开");
    }
})();

