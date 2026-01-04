// ==UserScript==
// @name         网页广告屏蔽(Ai😍) 不行就刷新页面
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  自动屏蔽网页广告(Ai)
// @author       Han
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530509/%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%28Ai%F0%9F%98%8D%29%20%E4%B8%8D%E8%A1%8C%E5%B0%B1%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/530509/%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%28Ai%F0%9F%98%8D%29%20%E4%B8%8D%E8%A1%8C%E5%B0%B1%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 精细化广告选择器（仅隐藏，不删除）
    const adSelectors = [
        '[id*="ad-"]', '[class*="ad-"]', '[id*="banner"]', '[class*="banner"]', '[class*="popup"]',
        '[id*="sponsor"]', '[class*="sponsor"]', '[class*="promotion"]', '[class*="close"]',
        '[id*="ads"]', '[class*="ads"]', '[class*="modal"]', '[class*="overlay"]',
        '[class*="interstitial"]'
    ];

    // **避免误删的关键元素**
    const safeSelectors = [
        'video', 'canvas', 'input', 'textarea',
        '[id*="player"]', '[class*="player"]', '[id*="content"]', '[class*="content"]',
        '[id*="login"]', '[class*="login"]', '[id*="signin"]', '[id*="loginForm"]',
        '[id*="subscribe"]', '[class*="subscribe"]', '[id*="payment"]', '[class*="payment"]',
        '[id*="search"]', '[class*="search"]', '[id*="navigation"]', '[class*="navigation"]',
        '[id*="header"]', '[class*="header"]', '[id*="footer"]', '[class*="footer"]',
        '[id*="main"]', '[class*="main"]', '[id*="article"]', '[class*="article"]', // 防止文章内容被删除
        '[id*="comments"]', '[class*="comments"]', '[id*="discussion"]', '[class*="discussion"]'
    ];

    function hideAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // 检查是否为安全元素
                if (!safeSelectors.some(safe => el.matches(safe) || el.closest(safe))) {
                    el.style.transition = "opacity 0.5s";
                    el.style.opacity = "0";
                    setTimeout(() => el.style.display = "none", 500);
                }
            });
        });
    }

    // 监听 DOM 变化，防止新广告出现
    const observer = new MutationObserver(hideAds);
    observer.observe(document.body, { childList: true, subtree: true });

    // 定时清理广告（防止懒加载广告）
    setInterval(hideAds, 5000);

    // **初始执行一次**
    hideAds();
})();
