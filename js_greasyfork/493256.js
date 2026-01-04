// ==UserScript==
// @name         得到网页版单栏居中限宽显示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  通过得到网页版阅读书籍时,单栏模式默认铺满全屏，跨度较大，使用该脚本可以使文字居中显示，且宽度显示为1200.
// @author       You
// @match        https://www.dedao.cn/*       /* 匹配所有网站，或者你可以指定具体的网站 */
// @match        https://*.dedao.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493256/%E5%BE%97%E5%88%B0%E7%BD%91%E9%A1%B5%E7%89%88%E5%8D%95%E6%A0%8F%E5%B1%85%E4%B8%AD%E9%99%90%E5%AE%BD%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/493256/%E5%BE%97%E5%88%B0%E7%BD%91%E9%A1%B5%E7%89%88%E5%8D%95%E6%A0%8F%E5%B1%85%E4%B8%AD%E9%99%90%E5%AE%BD%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const LOCKED_VIEWPORT_WIDTH = 1200;

    function lockViewportWidth() {
        const htmlElement = document.documentElement;
        ['width', 'min-width', 'max-width'].forEach(prop => {
            htmlElement.style.setProperty(prop, `${LOCKED_VIEWPORT_WIDTH}px`, 'important');
        });
        htmlElement.style.setProperty('margin', '0 auto', 'important');
        htmlElement.style.setProperty('overflow-x', 'auto', 'important');
    }

    // 双保险事件监听
    document.addEventListener('DOMContentLoaded', lockViewportWidth);
    window.addEventListener('load', lockViewportWidth);
    window.addEventListener('resize', lockViewportWidth);

    // 动态内容适配
    new MutationObserver(lockViewportWidth).observe(document.body, {
        childList: true,
        subtree: true
    });
})();