// ==UserScript==
// @name         Steam 不支援繁中自動切換簡中
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  當發現遊戲語言「简体中文」存在且「繁體中文」不存在時，自動切換到簡體版STEAM頁面
// @author       shanlan(ChatGPT o3-mini)
// @match        https://store.steampowered.com/app/*
// @exclude      https://store.steampowered.com/app/*?l=tchinese*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546246/Steam%20%E4%B8%8D%E6%94%AF%E6%8F%B4%E7%B9%81%E4%B8%AD%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E7%B0%A1%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/546246/Steam%20%E4%B8%8D%E6%94%AF%E6%8F%B4%E7%B9%81%E4%B8%AD%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E7%B0%A1%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 取得語言表格
    const langTable = document.getElementById('languageTable');
    if (!langTable) return;

    // 取得所有語言列
    const langRows = langTable.querySelectorAll('tr');
    let hasSimplified = false;
    let hasTraditional = false;

    langRows.forEach(row => {
        const cell = row.querySelector('td.ellipsis');
        if (!cell) return;
        const text = cell.textContent.trim();

        if (text === '简体中文' || text === '簡體中文') {
            hasSimplified = true;
        }
        if ((text === '繁體中文' || text === '繁体中文')) {
            // 只要不是 unsupported 才算有支援繁體中文
            if (!row.classList.contains('unsupported')) {
                hasTraditional = true;
            }
        }
    });

    // 只出現簡體中文且沒有支援繁體中文時才跳轉
    if (hasSimplified && !hasTraditional) {
        // 取得目前網址
        const url = new URL(window.location.href);

        // 若已經是簡體中文頁面則不動作
        if (url.searchParams.get('l') !== 'schinese') {
            url.searchParams.set('l', 'schinese');
            window.location.replace(url.toString());
        }
    }
})();