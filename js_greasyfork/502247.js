// ==UserScript==
// @name         3DGame去广告
// @namespace    http://tampermonkey.net/
// @version      2024-07-30
// @description  3DGame去广告，自用的，广告类型不全
// @author      gemail1024
// @license      CC-BY-NC-SA-4.0
// @match        *://*.3dmgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3dmgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502247/3DGame%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/502247/3DGame%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数，用于移除广告元素
    function removeAds() {
        // 选择常见的广告元素，通过类名、ID或其他选择器
        var adSelectors = [
            '[id*="yxj_fmt_gg"]',// 右下角广告
            '[id*="index_bg_box"]',// 背景广告
            '.Tonglan_785',      // 顶部广告类名Content_R
            '.Content_R',        // 热门
            '.header_wrap',      // 表头
            '.news_warp_c',      // 底部
            '.news_warp_f',      // 底部
            '.commentswrap',     // 底部
            '.fotter.fottertheme',// 底部综合
            'div.content > div:nth-child(2) > a:last-of-type'// 底部推广
        ];

        // 循环所有选择器，选择并移除匹配的元素
        adSelectors.forEach(function(selector) {
            var ads = document.querySelectorAll(selector);
            ads.forEach(function(ad) {
                ad.remove();
            });
        });
    }

    // 可选：每隔一段时间检查并移除动态加载的广告
        setInterval(removeAds, 3000);

})();