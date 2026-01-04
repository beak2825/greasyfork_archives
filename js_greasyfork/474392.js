// ==UserScript==
// @name         南+ 搜尋結果高亮修復
// @namespace    https://greasyfork.org/scripts/474392
// @version      0.4
// @description  南+搜尋結果關鍵字紅字高亮漏掉的用綠字標記起來
// @author       fmnijk
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @icon         https://www.google.com/s2/favicons?domain=south-plus.net
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474392/%E5%8D%97%2B%20%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E9%AB%98%E4%BA%AE%E4%BF%AE%E5%BE%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/474392/%E5%8D%97%2B%20%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E9%AB%98%E4%BA%AE%E4%BF%AE%E5%BE%A9.meta.js
// ==/UserScript==

(function() {
    'use strict'

    if (!window.location.href.includes('search.php')){
        return false;
    }

    fixHighlightBug();
})();

function fixHighlightBug() {
    console.log("南+ 搜尋結果高亮修復 開始");

    /*找出關鍵字*/
    const metaTag = document.querySelector('meta[name="keywords"]');
    let keywords = metaTag.getAttribute('content').split(',');

    /*開始修復*/
    const postTitles = document.querySelectorAll("#main > div.t > table > tbody > tr > th > a");
    for (const postTitle of postTitles) {
        for (const match of keywords) {
            const regex = new RegExp(`(?<!<u>)(${match})(?!<\/u>)`, 'gi');
            postTitle.innerHTML = postTitle.innerHTML.replace(regex, '<span style="color: green;">$1</span>');
        }
    }

    console.log("南+ 搜尋結果高亮修復 結束");
}












