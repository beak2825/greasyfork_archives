// ==UserScript==
// @name         直接跳转修复（新标签页版）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  修复重定向链接并强制在新标签页打开目标网站
// @author       You
// @match        https://m.statscrop.com/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534614/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E4%BF%AE%E5%A4%8D%EF%BC%88%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534614/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E4%BF%AE%E5%A4%8D%EF%BC%88%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const regex = /^(?:https?:\/\/m\.statscrop\.com)?\/www\/(https?%3A%2F%2F)?(.*)/i;

    function fixLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.href;
            const match = href.match(regex);

            if (match) {
                let targetUrl = match[2];
                targetUrl = decodeURIComponent(targetUrl);

                // 处理协议头
                let fullUrl;
                if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                    fullUrl = targetUrl;
                } else {
                    fullUrl = `https://${targetUrl.replace(/^(https?%3A%2F%2F)/, '')}`;
                }

                // 修改链接属性
                link.href = fullUrl;
                link.target = '_blank'; // 关键修改点：强制新标签页打开

                // 移除原有事件监听器并防止覆盖
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
            }
        });
    }

    const observer = new MutationObserver(fixLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    fixLinks();
})();