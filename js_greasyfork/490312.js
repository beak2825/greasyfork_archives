// ==UserScript==
// @name         放大亚马逊商品页字号
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  放大亚马逊商品页的标题和商家名的字号
// @author       You
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.co.jp/DP/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490312/%E6%94%BE%E5%A4%A7%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E9%A1%B5%E5%AD%97%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/490312/%E6%94%BE%E5%A4%A7%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E9%A1%B5%E5%AD%97%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let productTitle = document.querySelector('span[id="productTitle"]');
    if(productTitle) {productTitle.style="font-size:30px !important"}

    let sellerProfileTriggerId = document.querySelector('a[id="sellerProfileTriggerId"]');
    if(sellerProfileTriggerId) {sellerProfileTriggerId.style = 'font-size: 16px !important'}
    // Your code here...
})();