// ==UserScript==
// @name         bilibili CC字幕簡體轉繁體
// @name:en      bilibili Auto CC Subtitle Translation (Simplified Chinese -> Traditional Chinese)
// @name:zh-TW   bilibili CC字幕簡體轉繁體
// @description  自動將 Bilibili 影片的 CC 字幕從簡體轉為繁體
// @description:en  自動將 Bilibili 影片的 CC 字幕從簡體轉為繁體
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       R
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://greasyfork.org/scripts/430412-chinese-conversion-api/code/Chinese%20Conversion%20API.js?version=957744
// @license      MIT
// @run-at       document-start
// @grant        none
//代碼修改自 Rurutie 的腳本 https://greasyfork.org/zh-TW/scripts/431021
// 解決了 Bilibili（B站）番劇的 CC 字幕的簡繁轉換
// 代碼修改自 CY Fung 的腳本
// 原始腳本：https://greasyfork.org/zh-CN/scripts/428492
// 授權：MIT License
// @downloadURL https://update.greasyfork.org/scripts/526187/bilibili%20CC%E5%AD%97%E5%B9%95%E7%B0%A1%E9%AB%94%E8%BD%89%E7%B9%81%E9%AB%94.user.js
// @updateURL https://update.greasyfork.org/scripts/526187/bilibili%20CC%E5%AD%97%E5%B9%95%E7%B0%A1%E9%AB%94%E8%BD%89%E7%B9%81%E9%AB%94.meta.js
// ==/UserScript==

const { sc2tc } = window.ChineseConversionAPI; // 修改為簡轉繁 sc2tc

(function () {
    'use strict';

    const hKey_json_parse = 'rhlxuprkmayw';

    JSON.parse[hKey_json_parse] || !(() => {
        const $$parse = JSON.parse;
        JSON.parse = function () {
            if (typeof arguments[0] === 'string' && arguments[0].length > 16) {
                if (/\"(from|to|location)\"\s*:\s*[\d\.]+/.test(arguments[0])) {
                    arguments[0] = sc2tc(arguments[0]); // 修改為簡轉繁
                }
            }
            return $$parse.apply(this, arguments);
        };
        JSON.parse.toString = () => $$parse.toString();
        JSON.parse[hKey_json_parse] = true;
    })();
})();

(function $$() {
    'use strict';

    if (!document || !document.documentElement) window.requestAnimationFrame($$);

    function addStyle(styleText) {
        const styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.textContent = styleText;
        document.documentElement.appendChild(styleNode);
        return styleNode;
    }

    addStyle(`
    .bilibili-player-video-subtitle .subtitle-item-text {
        font-family: system-ui;
    }
    `);
})();
