// ==UserScript==
// @name         屏蔽网页上的图片
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽网页上所有的图片，方便摸鱼
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462475/%E5%B1%8F%E8%94%BD%E7%BD%91%E9%A1%B5%E4%B8%8A%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/462475/%E5%B1%8F%E8%94%BD%E7%BD%91%E9%A1%B5%E4%B8%8A%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 获取到所有的 img 标签
            const images = mutation.target.getElementsByTagName('img');
            // 将所有的 img 标签隐藏
            for (let i = 0; i < images.length; i++) {
                images[i].style.display = 'none';
            }
        });
    });

    // 开始监听 body 节点，用于处理 js 新加载出来的图片
    observer.observe(document.body, { childList: true, subtree: true });
})();
