// ==UserScript==
// @name         AI风月系列-自动显示历史记录
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动显示游玩历史记录，省去手动点击的麻烦
// @author       zjxdiu
// @license      Unlicense
// @match        https://aifun.wiki/zh/explore/*
// @match        https://aifuck.cc/zh/explore/*
// @match        https://aiporn.tw/zh/explore/*
// @match        https://aigirlfriend.baby/zh/explore/*
// @match        https://aigirlfriend.homes/zh/explore/*
// @match        https://aigirlfriendnetwork.com/zh/explore/*
// @match        https://aigirlfriendnow.com/zh/explore/*
// @match        https://aigirlfriendstudio.com/zh/explore/*
// @match        https://aitrader.wiki/zh/explore/*
// @match        https://acepro.store/zh/explore/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539370/AI%E9%A3%8E%E6%9C%88%E7%B3%BB%E5%88%97-%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/539370/AI%E9%A3%8E%E6%9C%88%E7%B3%BB%E5%88%97-%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 封装点击逻辑
    function clickTarget() {
        const svg = document.querySelector('svg.MuiSvgIcon-root.css-q7mezt');
        if (svg) {
            const parent = svg.closest('div');
            if (parent && typeof parent.click === 'function') {
                console.log("✅ 点击第一个图标");
                parent.click();

                // 延迟后点击第二个按钮
                setTimeout(() => {
                    const secondButton = document.querySelector('button.MuiButtonBase-root.css-wfoumx');
                    if (secondButton && typeof secondButton.click === 'function') {
                        console.log("✅ 延迟后点击第二个按钮（关闭按钮）");
                        secondButton.click();
                    } else {
                        console.warn("⚠ 找不到第二个按钮");
                    }
                }, 0);
            } else {
                console.warn("⚠ 找到 SVG 但父元素不可点击");
            }
        } else {
            console.log("⏳ 等待第一个图标出现...");
        }
    }

    // 定时尝试点击目标图标（适配异步加载）
    function attemptClickWithRetry(retryCount = 0, intervalMs = 700) {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            clickTarget();
            if (attempts >= retryCount) clearInterval(interval);
        }, intervalMs);
    }

    // 初始化首次点击
    attemptClickWithRetry();

    // 监听 URL 变化的辅助函数
    function observeUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                console.log("🌐 URL 变化:", currentUrl);
                lastUrl = currentUrl;
                callback();
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // 在 URL 变化后重新尝试点击
    observeUrlChange(() => {
        attemptClickWithRetry();
    });

    // 也监听 pushState/replaceState（更彻底）
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;
    history.pushState = function () {
        _pushState.apply(this, arguments);
        window.dispatchEvent(new Event('urlchange'));
    };
    history.replaceState = function () {
        _replaceState.apply(this, arguments);
        window.dispatchEvent(new Event('urlchange'));
    };
    window.addEventListener('urlchange', () => {
        console.log("🧭 history 变更检测到 URL 改变");
        attemptClickWithRetry();
    });
})();