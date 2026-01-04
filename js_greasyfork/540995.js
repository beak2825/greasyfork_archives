// ==UserScript==
// @name         移除 daybuy.tw 自動翻頁功能
// @name:zh-TW   移除 daybuy.tw 自動翻頁功能
// @name:en      Disable Daybuy.tw Auto Next Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  當滾動到頁面底部時，禁用自動跳轉到下一頁的功能。
// @description:zh-TW 當滾動到頁面底部時，禁用自動跳轉到下一頁的功能。
// @description:en Disable the function that automatically jumps to the next page when scrolling to the bottom of the page.
// @author       abc0922001
// @license      MIT
// @match        https://*.daybuy.tw/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540995/%E7%A7%BB%E9%99%A4%20daybuytw%20%E8%87%AA%E5%8B%95%E7%BF%BB%E9%A0%81%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/540995/%E7%A7%BB%E9%99%A4%20daybuytw%20%E8%87%AA%E5%8B%95%E7%BF%BB%E9%A0%81%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Daybuy auto-pager disabler loaded.');

    // 在 "capture" 階段攔截 scroll 事件，並立即停止其傳播
    // 這可以防止頁面自身的 scroll 事件監聽器 (用於自動翻頁) 被觸發
    // The 'true' argument ensures this listener runs in the capture phase.
    window.addEventListener('scroll', function(e) {
        e.stopImmediatePropagation();
        // console.log('Scroll event stopped.'); // 用於除錯，可以取消註解來確認是否運作
    }, true);
})();
