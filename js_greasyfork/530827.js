// ==UserScript==
// @description  2025-3-25更新
// @name         B站广告精准屏蔽（修复版）
// @match        https://www.bilibili.com/*
// @grant        GM_addStyle
// @version 0.0.1.20250325141130
// @namespace https://greasyfork.org/users/398195
// @downloadURL https://update.greasyfork.org/scripts/530827/B%E7%AB%99%E5%B9%BF%E5%91%8A%E7%B2%BE%E5%87%86%E5%B1%8F%E8%94%BD%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530827/B%E7%AB%99%E5%B9%BF%E5%91%8A%E7%B2%BE%E5%87%86%E5%B1%8F%E8%94%BD%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        // 更精准的广告路径匹配
        adHrefPattern: /^(https:\/\/cm\.bilibili\.com\/cm\/api\/fees\/pc\/)/,
        // 广告父容器特征
        parentSelectors: [
            'div.bili-video-card',
            'div[data-ad-unit]',
            'section[data-feeds-ad]'
        ],
        debug: true
    };

    function log(...args) {
        if(config.debug) console.log('[广告调试]', ...args);
    }

    // 修正版安全检测
    function isUnsafeContainer(container) {
        if (!container) return false;

        // 特征1：包含广告属性
        const hasAdAttr = container.hasAttribute('data-ad') ||
                         container.querySelector('[data-ad-mark]');

        // 特征2：存在广告类名
        const hasAdClass = Array.from(container.classList).some(c =>
            c.includes('ad') || c.includes('commercial'));

        // 特征3：尺寸符合广告特征
        const isAdSize = container.offsetWidth > 280 &&
                        container.offsetWidth < 680;

        return hasAdAttr || hasAdClass || isAdSize;
    }

    function preciseBlock() {
        document.querySelectorAll('a').forEach(a => {
            try {
                // 严格匹配逻辑
                if (!config.adHrefPattern.test(a.href)) return;

                const container = a.closest(config.parentSelectors.join(','));
                if (!container || container.dataset.processed) return;

                // 关键逻辑修正！！！
                if (isUnsafeContainer(container)) {
                    container.style.display = 'none';
                    container.dataset.processed = true;
                    log('成功屏蔽：', container);
                } else {
                    log('安全容器（未屏蔽）：', container);
                }

            } catch (error) {
                log('处理异常：', error);
            }
        });
    }

    // 观察者配置保持不变
    const observer = new MutationObserver(() => preciseBlock());
    observer.observe(document, { subtree: true, childList: true });

    // 初始化
    preciseBlock();
    setInterval(preciseBlock, 1500);
})();