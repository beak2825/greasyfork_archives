// ==UserScript==
// @name         清大校務行政系統按鈕優化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  將清大校務資訊系統的資料夾文字也賦予開啟函數，方便點擊展開細項
// @author       You
// @match        https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/*
// @icon         https://www.ccxp.nthu.edu.tw/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544638/%E6%B8%85%E5%A4%A7%E6%A0%A1%E5%8B%99%E8%A1%8C%E6%94%BF%E7%B3%BB%E7%B5%B1%E6%8C%89%E9%88%95%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/544638/%E6%B8%85%E5%A4%A7%E6%A0%A1%E5%8B%99%E8%A1%8C%E6%94%BF%E7%B3%BB%E7%B5%B1%E6%8C%89%E9%88%95%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const folderDivs = document.querySelectorAll('div[id^="folder"]');


    folderDivs.forEach(div => {
        const sourceLink = div.querySelector('td:first-child a[href]');
        const targetTextAnchor = div.querySelector('td:nth-child(2) a');

        if (sourceLink && targetTextAnchor) {
            const linkHref = sourceLink.getAttribute('href');
            targetTextAnchor.setAttribute('href', linkHref);
            targetTextAnchor.style.cursor = 'pointer';
        }
    });
})();