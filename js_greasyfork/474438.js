// ==UserScript==
// @name         南+ 自動跳轉桌面版網頁
// @namespace    https://greasyfork.org/scripts/474438
// @version      0.3
// @description  南+ 自動使用底部桌面版按鈕的鏈結跳轉桌面版網頁
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
// @downloadURL https://update.greasyfork.org/scripts/474438/%E5%8D%97%2B%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%E6%A1%8C%E9%9D%A2%E7%89%88%E7%B6%B2%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/474438/%E5%8D%97%2B%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%E6%A1%8C%E9%9D%A2%E7%89%88%E7%B6%B2%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict'

    if (!window.location.href.includes('/simple/')){
        return false;
    }

    f();
})();

function f() {
    //console.log("南+ 自動跳轉桌面版網頁 開始");

    document.querySelectorAll('body > div.container > center > a').forEach(function(element) {
        if (element.innerHTML.includes('桌面版')) {
            //console.log(element);
            window.location.href = element.href;
        }
    });

    //console.log("南+ 自動跳轉桌面版網頁 結束");
}












