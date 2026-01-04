// ==UserScript==
// @name         LINE GIFT - Show 7-11 i-Gift Serial Number
// @name:zh-TW   LINE 禮物 - 顯示 7-11 i禮贈序號
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reload page and the i-Gift serial number will be displayed.
// @description:zh-TW  重新整理禮物兌換頁面，即顯示i禮贈序號
// @icon         https://www.line-website.com/giftshop-tw/resource/image/favicon/v3/192x192.png
// @author       Gian
// @match        https://giftshop-tw.line.me/received/voucher/*
// @grant        none
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/520064/LINE%20GIFT%20-%20Show%207-11%20i-Gift%20Serial%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/520064/LINE%20GIFT%20-%20Show%207-11%20i-Gift%20Serial%20Number.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        let nuxtData = window.__NUXT__;
        let couponNo = 'text';
        if (nuxtData?.data?.[0]?.vm?.couponItemDetail?.ecoupon?.couponNo) {
            couponNo = nuxtData.data[0].vm.couponItemDetail.ecoupon.couponNo;
            prompt("到期日依照LINE禮物到期日為準", couponNo);
        }
    } catch (error) {
        console.error('取得 couponNo 時發生例外錯誤', error);
    }
})();
