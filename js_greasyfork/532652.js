// ==UserScript==
// @name         百度百科精简【移动端】
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  隐藏移动端的百度百科中的广告和杂项内容，给你一个干净爽快的体验。
// @author       黄瓜战神
// @match        *://baike.baidu.com/*
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/532652/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E7%B2%BE%E7%AE%80%E3%80%90%E7%A7%BB%E5%8A%A8%E7%AB%AF%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/532652/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E7%B2%BE%E7%AE%80%E3%80%90%E7%A7%BB%E5%8A%A8%E7%AB%AF%E3%80%91.meta.js
// ==/UserScript==
 

(function () {
    'use strict';

    const selectors = [
        '#J-lemma-videos',
        '#J-lemma-star-map-wrap',
        '#BK_body_content_wrapper > div.BK-after-content-wrapper:nth-child(4)',
        'div.title-part:first-child > div.title > div.edit-tool-container.J-edit-tool-container:nth-child(2)',
        'h2.title-level-2 > span.tool-right-btn.J-lemma-edit.J-active:last-child',
        'h2.title-level-2 > div.tool-right-btn.part-audio-play.audio-play:first-child',
        '#J-human-relation',
        '#J-loft-content-wrapper > div.loft-body:nth-child(2) > div.lemma-card-bottom:last-child',
        '#J-loft-content-wrapper > div.loft-body:nth-child(2) > div.lemma-card:first-child > div.lemma-head-icons:last-child',
        '#J-graph-card-wrapper',
        '#BK_content_wrapper > div.BK-main-content:nth-child(2) > div.para:last-child > div.floatTashuo-list-wrapper:nth-child(3)',
        '#J-tashuo-button-fixed',
        '#BK_before_content_wrapper > div.card-part:nth-child(5) > ul.authority-list:nth-child(3)',
        '#J_tashuo_recommend',
        '.BK-main-content .floatTashuo-list-wrapper',
        '#J-catalog-content > ol.catalog-list > li.catalog-item.level1.current:last-child',
        '#BK_before_content_wrapper > div.news-container.J-news-container:nth-child(10)',
        '#BK_before_content_wrapper > div.card-part:nth-child(3) > ul.authority-list:first-child',
        '#J-lemma-feedback',
        '#BK_content_wrapper > div.BK-main-content:nth-child(2) > div.personal-portal:last-child'
    ];

    function removeElements() {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    // 页面初次加载时移除
    removeElements();

    // 观察 DOM 变化，移除后续加载的内容
    const observer = new MutationObserver(() => {
        removeElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
