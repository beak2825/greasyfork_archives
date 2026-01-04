// ==UserScript==
// @name         删除知乎发想法区域
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动删除知乎首页等页面中“分享此刻想法”的发布框区域
// @author       ChatGPT
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542830/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%8F%91%E6%83%B3%E6%B3%95%E5%8C%BA%E5%9F%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/542830/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%8F%91%E6%83%B3%E6%B3%95%E5%8C%BA%E5%9F%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用于删除匹配的元素
    function removeWriteArea() {
        const target = document.querySelector('div.WriteArea.Card.css-uvvvlo');
        if (target) {
            target.remove();
            console.log('知乎发想法区域已删除');
        }
    }

    // 初始尝试删除
    removeWriteArea();

    // 若页面内容是动态加载的，使用 MutationObserver 持续监控 DOM 变化
    const observer = new MutationObserver(() => {
        removeWriteArea();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
