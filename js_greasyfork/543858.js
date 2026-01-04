// ==UserScript==
// @name         ITDOG 广告消失术
// @version      1.5
// @description  让 .gg_link 广告透明化（opacity: 0），并禁止点击，不影响页面布局
// @author       Dahi
// @match        *://www.itdog.cn/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1442595
// @downloadURL https://update.greasyfork.org/scripts/543858/ITDOG%20%E5%B9%BF%E5%91%8A%E6%B6%88%E5%A4%B1%E6%9C%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/543858/ITDOG%20%E5%B9%BF%E5%91%8A%E6%B6%88%E5%A4%B1%E6%9C%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 强制全局CSS：仅透明化 + 禁止交互
    GM_addStyle(`
        .gg_link, [class*="gg_link"] {
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `);

    // 2. 监控动态加载的广告
    const observer = new MutationObserver(function(mutations) {
        document.querySelectorAll('.gg_link, [class*="gg_link"]').forEach(el => {
            el.style.setProperty('opacity', '0', 'important');
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
            value += ' transparent-ad'; // 标记广告元素
        }
        originalSetAttribute.call(this, name, value);
    };
})();