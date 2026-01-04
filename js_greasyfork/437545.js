// ==UserScript==
// @name         蝦皮廣告封鎖器
// @namespace    https://greasyfork.org/scripts/437545
// @version      2.0
// @description  蝦皮搜尋結果的前幾個商品廣告封鎖
// @author       fmnijk
// @match        https://shopee.tw/*
// @icon         https://www.google.com/s2/favicons?domain=shopee.tw
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437545/%E8%9D%A6%E7%9A%AE%E5%BB%A3%E5%91%8A%E5%B0%81%E9%8E%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/437545/%E8%9D%A6%E7%9A%AE%E5%BB%A3%E5%91%8A%E5%B0%81%E9%8E%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styles = String.raw`
        /*隱藏蝦皮搜尋結果廣告商品*/
        .shopee-search-item-result__item:has(.absolute.bottom-0.right-0.z-30.flex.pr-1.pb-1 > .inline-block.px-1.py-0\.5.rounded-sm.bg-shopee-black26.text-xs\/3.capitalize.text-white.whitespace-nowrap) {
            display: none !important;
        }
        `
    GM_addStyle(styles);
})();
