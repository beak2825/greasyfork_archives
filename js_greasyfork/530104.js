// ==UserScript==
// @name         Archon链接汉化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将archon.gg页面中wowhead链接转换为中文版本
// @author       DeepSeek
// @match        https://www.archon.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archon.gg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530104/Archon%E9%93%BE%E6%8E%A5%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530104/Archon%E9%93%BE%E6%8E%A5%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改链接的核心函数
    function convertToCN(originalUrl) {
        return originalUrl.replace(
            /^(https?:\/\/www\.wowhead\.com)(?!\/cn)/,
            '$1/cn'
        );
    }

    // 处理所有存在的链接
    function updateLinks() {
        const wowheadLinks = document.querySelectorAll('a[href*="wowhead.com"]');

        wowheadLinks.forEach(link => {
            const originalHref = link.href;
            const newHref = convertToCN(originalHref);

            if (originalHref !== newHref) {
                link.href = newHref;

                // 移除跳转中间页面（可选）
                if (link.search.includes('?') && !link.search.includes('cn')) {
                    link.search = link.search.replace('?', '?cn&');
                }
            }
        });
    }

    // 初始化执行 + 动态内容监听
    updateLinks();
    new MutationObserver(updateLinks).observe(document.body, {
        childList: true,
        subtree: true
    });
})();