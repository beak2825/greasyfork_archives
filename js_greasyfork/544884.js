// ==UserScript==
// @name         微博侧边栏Sticky效果
// @namespace    https://github.com/YishenTu/tampermonkey-scripts
// @version      1.0
// @description  侧边栏滚动到顶部时固定
// @author       YT
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @match        https://s.weibo.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544884/%E5%BE%AE%E5%8D%9A%E4%BE%A7%E8%BE%B9%E6%A0%8FSticky%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/544884/%E5%BE%AE%E5%8D%9A%E4%BE%A7%E8%BE%B9%E6%A0%8FSticky%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sidebarSelector = '.Main_sideMain_263ZF';
    // 顶部导航栏高度偏移量
    const topOffset = 56;

    function applyStickyEffect() {
        const sidebar = document.querySelector(sidebarSelector);
        if (!sidebar || sidebar.hasAttribute('data-sticky')) return;

        // 使用原生CSS sticky定位
        sidebar.style.position = 'sticky';
        sidebar.style.top = topOffset + 'px';
        sidebar.style.height = 'fit-content';
        sidebar.style.maxHeight = `calc(100vh - ${topOffset + 20}px)`;
        sidebar.style.overflowY = 'auto';

        sidebar.setAttribute('data-sticky', 'true');

    }

    // 初始化脚本
    function init() {
        // 监听DOM变化以处理动态加载的内容
        const observer = new MutationObserver(() => {
            applyStickyEffect();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 立即尝试应用sticky效果
        applyStickyEffect();
    }

    init();
})();