// ==UserScript==
// @name         ITDOG 广告去无踪
// @version      1.6
// @description  完全隐藏 .gg_link 广告（display: none），并禁止点击
// @author       Dahi
// @match        *://www.itdog.cn/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1442595
// @downloadURL https://update.greasyfork.org/scripts/543860/ITDOG%20%E5%B9%BF%E5%91%8A%E5%8E%BB%E6%97%A0%E8%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/543860/ITDOG%20%E5%B9%BF%E5%91%8A%E5%8E%BB%E6%97%A0%E8%B8%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 强制全局CSS：完全隐藏 + 禁止交互
    GM_addStyle(`
        .gg_link, [class*="gg_link"] {
            display: none !important;
            pointer-events: none !important;
        }
    `);

    // 2. 监控动态加载的广告
    const observer = new MutationObserver(function(mutations) {
        document.querySelectorAll('.gg_link, [class*="gg_link"]').forEach(el => {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // 3. 防止JS强行恢复广告
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'class' && value.includes('gg_link')) {
            value += ' hidden-ad'; // 标记广告元素
        }
        originalSetAttribute.call(this, name, value);
    };
})();