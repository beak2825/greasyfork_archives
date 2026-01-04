// ==UserScript==
// @name         4khd ads remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  替换分页链接为绝对安全路径，防止跳转广告页面，并防新窗口打开行为污染页面来源。
// @author       rainbowflesh
// @match        *://4khd.com/*
// @match        *://vptot.xxtt.ink/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541753/4khd%20ads%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/541753/4khd%20ads%20remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function normalizeHref(href) {
        const url = new URL(window.location.href);
        if (href.startsWith('?') || href.startsWith('/')) {
            return url.origin + url.pathname.replace(/\/+$/, '') + href;
        }
        return href;
    }

    function purifyLink(a) {
        // 已处理的跳过，防止死循环
        if (a.dataset.cleaned === '1') return;

        const href = a.getAttribute('href');
        if (!href) return;

        const cleanHref = normalizeHref(href);
        a.setAttribute('href', cleanHref);
        a.setAttribute('target', '_self');
        a.setAttribute('rel', 'noopener noreferrer');
        a.removeAttribute('onclick');

        // 彻底移除所有事件监听器：克隆替换
        const clean = a.cloneNode(true);
        clean.dataset.cleaned = '1';
        a.replaceWith(clean);
    }

    function purifyAllLinks(container) {
        const links = container.querySelectorAll('a[href]');
        links.forEach(purifyLink);
    }

    function cleanPage() {
        document.querySelectorAll('a.page-numbers[href]').forEach(purifyLink);
        document.querySelectorAll('li.wp-block-post').forEach(purifyAllLinks);
    }

    // 节流执行（防爆栈）
    let scheduled = false;
    function safeCleanPage() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            cleanPage();
            scheduled = false;
        });
    }

    // 初始执行
    cleanPage();

    // 动态监听 + 安全节流
    const observer = new MutationObserver(safeCleanPage);
    observer.observe(document.body, { childList: true, subtree: true });
})();