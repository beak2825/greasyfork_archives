// ==UserScript==
// @name         移除 Bilibili 直播/社情/电视剧 等推荐卡片
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Remove all floor single cards from Bilibili
// @author       magician lib
// @match        https://www.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511885/%E7%A7%BB%E9%99%A4%20Bilibili%20%E7%9B%B4%E6%92%AD%E7%A4%BE%E6%83%85%E7%94%B5%E8%A7%86%E5%89%A7%20%E7%AD%89%E6%8E%A8%E8%8D%90%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/511885/%E7%A7%BB%E9%99%A4%20Bilibili%20%E7%9B%B4%E6%92%AD%E7%A4%BE%E6%83%85%E7%94%B5%E8%A7%86%E5%89%A7%20%E7%AD%89%E6%8E%A8%E8%8D%90%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeFloorSingleCards() {
        // class='floor-single-card' 的卡片全是直播/社情/电视剧等推荐,统统移除!!!!
        const cards = document.querySelectorAll('.floor-single-card');
        cards.forEach(card => card.remove());

        // class='bili-live-card' 直播推荐,统统移除!!!!
        const live_cards = document.querySelectorAll('.bili-live-card');
        live_cards.forEach(card => card.remove());

        // 移除首页轮播图
        const swipe_cards = document.querySelectorAll('.recommended-swipe');
        swipe_cards.forEach(card => card.remove());

        // 移除播放页面 "大家围观的直播" 卡片
        const lives = Array.from(document.querySelectorAll('div')).filter(div => {
            return div.textContent.trim() === '大家围观的直播';
        });
        lives.forEach(div => {
            if (div.parentElement) {
                div.parentElement.remove();
            }
        });
    }

    // 初始调用以移除已有的卡片
    removeFloorSingleCards();

    // 使用 MutationObserver 监视 DOM 变化
    const observer = new MutationObserver(removeFloorSingleCards);
    observer.observe(document.body, { childList: true, subtree: true });
})();
