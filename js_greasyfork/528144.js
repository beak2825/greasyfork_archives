// ==UserScript==
// @name         Bilibili-B站视频URL清理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除B站视频链接不必要的参数
// @author       LongSir
// @match        https://www.bilibili.com/video/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528144/Bilibili-B%E7%AB%99%E8%A7%86%E9%A2%91URL%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/528144/Bilibili-B%E7%AB%99%E8%A7%86%E9%A2%91URL%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心清理函数（支持非标准URL解析）
    const cleanUrl = (url) => {
        if (!url) return url;
        try {
            // 预处理：移除路径末尾斜杠
            const sanitizedUrl = url.replace(/(https?:\/\/[^/]+\/video\/[^/?]+)\/+/, '$1');
            const urlObj = new URL(sanitizedUrl);

            // 提取p参数
            const params = new URLSearchParams(urlObj.search);
            const pValue = params.get('p');

            // 重建纯净URL
            let cleanHref = `${urlObj.origin}${urlObj.pathname.replace(/\/+$/, '')}`;
            if (pValue) {
                cleanHref += `?p=${encodeURIComponent(pValue)}`;
            }
            if (urlObj.hash) {
                cleanHref += urlObj.hash;
            }
            return cleanHref;
        } catch {
            // 降级处理：手动提取参数
            const [base, query] = url.split('?');
            const cleanBase = base.replace(/\/+$/, '');
            if (!query) return cleanBase;

            const pMatch = query.match(/[&?]p=([^&]*)/);
            return pMatch
                ? `${cleanBase}?p=${encodeURIComponent(pMatch[1])}`
                : cleanBase;
        }
    };

    // 代理history方法
    const proxyHistoryMethod = () => {
        const origPush = history.pushState;
        const origReplace = history.replaceState;

        history.pushState = function(state, title, url) {
            return origPush.call(this, state, title, cleanUrl(url));
        };

        history.replaceState = function(state, title, url) {
            return origReplace.call(this, state, title, cleanUrl(url));
        };
    };

    // 初始化处理
    proxyHistoryMethod();
    const initialClean = cleanUrl(location.href);
    if (initialClean !== location.href) {
        history.replaceState(null, '', initialClean);
    }

    // 动态URL监控
    let lastHref = location.href;
    const checkAndClean = () => {
        if (location.href === lastHref) return;
        lastHref = location.href;
        const cleaned = cleanUrl(lastHref);
        if (cleaned !== location.href) {
            history.replaceState(null, '', cleaned);
        }
    };

    // 全面监听策略
    const observer = new MutationObserver(checkAndClean);
    observer.observe(document, { subtree: true, childList: true });
    window.addEventListener('popstate', checkAndClean);
    window.addEventListener('hashchange', checkAndClean);
})();

console.log('%c BiliURLc %c Author/作者:LongSir', 'background: linear-gradient(120deg, #8183ff, #58b3f5);color:#fff;border-radius:2px;', '');