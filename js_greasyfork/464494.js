// ==UserScript==
// @name         B站合集列表增高
// @description  拉高播放页播放列表 | 兼容 Safari/Firefox/Chrome/Edge
// @version      1.1.0
// @license      WTFPL
// @author       Joseph Chris <joseph@josephcz.xyz>
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/bilibili-extend-content-list
// @homepageURL  https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/bilibili-extend-content-list
// @supportURL   mailto:tampermonkey-support@josephcz.xyz
// @compatible   firefox
// @compatible   safari
// @compatible   chrome
// @compatible   edge
// @match        https://www.bilibili.com/video/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464494/B%E7%AB%99%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E5%A2%9E%E9%AB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/464494/B%E7%AB%99%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E5%A2%9E%E9%AB%98.meta.js
// ==/UserScript==
    
(function() {
    'use strict';
    const observe = new MutationObserver((_mutationList, _observer) => {
        function updateElementHeightAndMaxHeight(selector, heightPixel) {
            const el = document.querySelector(selector);
            if (!el) return;
            el.style.height = `${heightPixel}px`;
            el.style.maxHeight = `${heightPixel}px`;
        }

        updateElementHeightAndMaxHeight(".video-sections-content-list", 500);
        updateElementHeightAndMaxHeight(".video-pod__body", 500);
    });
    observe.observe(document, { childList: true, subtree: true });
})();
