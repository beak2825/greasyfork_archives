// ==UserScript==
// @name         爱奇艺视频暂停的广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除暂停时的广告，调整视频为全屏显示
// @author       pangyue
// @match        *://www.iqiyi.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500522/%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E7%9A%84%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/500522/%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E7%9A%84%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 创建样式元素
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .iqp-player-videolayer {
                width: 100% !important;
                height: 100% !important;
                top: 0 !important;
                left: 0 !important;
            }
        `;
        // 将样式元素添加到head部分
        document.head.appendChild(style);
    });
})();
