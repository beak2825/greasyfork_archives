// ==UserScript==
// @name         帽子云控制台深浅色随系统切换
// @namespace    https://dash.maoziyun.com/*
// @version      0.1
// @description  给帽子云控制台的网页添加深浅色跟随系统切换的功能
// @author       xxnuo
// @match        https://dash.maoziyun.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520983/%E5%B8%BD%E5%AD%90%E4%BA%91%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%B7%B1%E6%B5%85%E8%89%B2%E9%9A%8F%E7%B3%BB%E7%BB%9F%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/520983/%E5%B8%BD%E5%AD%90%E4%BA%91%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%B7%B1%E6%B5%85%E8%89%B2%E9%9A%8F%E7%B3%BB%E7%BB%9F%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建反色样式
    const style = document.createElement('style');
    style.textContent = `
        @media (prefers-color-scheme: light) {
            html {
                filter: invert(1) hue-rotate(180deg);
            }
            img, video, canvas {
                filter: invert(1) hue-rotate(180deg);
            }
        }
    `;

    // 添加样式到页面
    document.head.appendChild(style);

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        style.disabled = e.matches;
    });

    // 初始化时检查是否为深色模式
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        style.disabled = true;
    }
})();
