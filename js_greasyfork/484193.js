// ==UserScript==
// @name         bilibili直播弹幕屏蔽连击相关
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  隐藏b站 bilibili直播新增的连击相关模块
// @author       sakiko
// @match        https://live.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484193/bilibili%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E8%BF%9E%E5%87%BB%E7%9B%B8%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/484193/bilibili%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E8%BF%9E%E5%87%BB%E7%9B%B8%E5%85%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 通过CSS隐藏目标元素，自动覆盖动态添加的元素
    const style = document.createElement('style');
    style.textContent = `
        #combo-card,
        .danmaku-item-container .bilibili-combo-danmaku-container,
        .danmaku-item-container .bilibili-danmaku.mode-adv {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
