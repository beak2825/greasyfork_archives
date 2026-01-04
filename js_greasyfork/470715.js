// ==UserScript==
// @name         红布林环境工具悬浮窗
// @namespace    your-namespace
// @version      1.0
// @description  在网页上添加一个侧边悬浮框
// @match        https://mis.aplum.com/mis/*
// @match        https://mis-pre.aplum.com:7443/*
// @match        https://pre-c2b.hongbulin.net/*
// @match        https://c2b.hongbulin.net/*
// @grant        GM_addStyle
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/470715/%E7%BA%A2%E5%B8%83%E6%9E%97%E7%8E%AF%E5%A2%83%E5%B7%A5%E5%85%B7%E6%82%AC%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/470715/%E7%BA%A2%E5%B8%83%E6%9E%97%E7%8E%AF%E5%A2%83%E5%B7%A5%E5%85%B7%E6%82%AC%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮框元素
    var sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.textContent = '线上环境';

    // 添加样式
    GM_addStyle(`
        #sidebar {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%) rotate(0deg);
            background-color: #ee3f4d;
            padding: 10px;
            border: 2px solid #ccc;
            border-radius: 10px;
            z-index: 9999;
            writing-mode: vertical-lr;
            text-orientation: mixed;
            opacity: 0.5;
            color: black;
            font-size: 22px;
        }
    `);

    // 将悬浮框添加到页面中
    document.body.appendChild(sidebar);
})();
