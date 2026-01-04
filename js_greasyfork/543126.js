// ==UserScript==
// @name         去除chatgpt外链utm_source
// @version      1.0
// @author       seejoooo
// @description  自动移除 chatgpt.com 页面中外链中的 utm_source=chatgpt.com 参数
// @match        http*://chatgpt.com/*
// @grant        none
// @namespace https://greasyfork.org/users/18857
// @downloadURL https://update.greasyfork.org/scripts/543126/%E5%8E%BB%E9%99%A4chatgpt%E5%A4%96%E9%93%BEutm_source.user.js
// @updateURL https://update.greasyfork.org/scripts/543126/%E5%8E%BB%E9%99%A4chatgpt%E5%A4%96%E9%93%BEutm_source.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const clean = link => {
        try {
            const url = new URL(link.href);
            // 只处理外部链接，且参数值为 chatgpt.com
            if (url.hostname !== location.hostname && url.searchParams.get('utm_source') === 'chatgpt.com') {
                url.searchParams.delete('utm_source');
                link.setAttribute('href', url.toString());
            }
        } catch {
            // 忽略解析失败的链接
        }
    };

    // 批量清理页面上已有的所有链接
    const process = () => document.querySelectorAll('a[href]').forEach(clean);

    // 监听新插入的链接元素，并处理其中的 a 标签
    const observe = () => new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
                if (n.tagName === 'A') clean(n);
                n.querySelectorAll?.('a[href]').forEach(clean);
            }
        }));
    }).observe(document.body, { childList: true, subtree: true });

    // 等待 <body> 出现后再启动主逻辑（防止脚本运行太早）
    if (document.body) {
        process();
        observe();
    } else {
        // 如果 <body> 尚未出现，使用 MutationObserver 等待
        new MutationObserver((_, obs) => {
            if (document.body) {
                obs.disconnect();
                process();
                observe();
            }
        }).observe(document.documentElement, { childList: true });
    }
})();
