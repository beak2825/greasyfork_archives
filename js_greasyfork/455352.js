// ==UserScript==
// @name         樂詞網自動選擇顯示 50 筆
// @namespace    https://github.com/zica87
// @version      0.1.1
// @description  每頁筆數自動選擇 50
// @author       zica
// @match        https://terms.naer.edu.tw/search/*
// @grant        none
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/455352/%E6%A8%82%E8%A9%9E%E7%B6%B2%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E9%A1%AF%E7%A4%BA%2050%20%E7%AD%86.user.js
// @updateURL https://update.greasyfork.org/scripts/455352/%E6%A8%82%E8%A9%9E%E7%B6%B2%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E9%A1%AF%E7%A4%BA%2050%20%E7%AD%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const a = document.getElementsByClassName('form-select-sm')[0];
    // 0 = 10 筆（即預設值）
    // 1 = 20 筆
    // 2 = 50 筆
    // 3 = 100 筆
    const selectIndex = 2;
    a.selectedIndex = selectIndex;
    a.children[selectIndex].dispatchEvent(new Event('change', {bubbles: true}));
})();
