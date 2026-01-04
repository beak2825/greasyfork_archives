// ==UserScript==
// @name         ProcessOn 广告屏蔽器
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  屏蔽 ProcessOn 网站上的广告。如果觉得好用，欢迎扫码赞赏，您的支持是我持续更新的动力！
// @author       Your name
// @license      MIT
// @match        https://www.processon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526502/ProcessOn%20%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526502/ProcessOn%20%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 创建样式 - 使用 CSS 隐藏大部分广告，减少 JavaScript 操作
    const style = document.createElement('style');
    style.textContent = `
        /* 广告元素 */
        div.advert,
        div[style*="background-color: rgb(176, 106, 251)"],
        .dialog-box[data-type="ad"],
        a[href*="/ac/250205"],
        .carsouselBox,
        div[class*="carsouselBox"],
        div[data-v-58b88906].carsouselBox,
        .dlg-manage,
        div[class="dlg-manage"],
        div[class*="dlg-manage"],
        .po-report,
        div[class="po-report"],
        div[class*="po-report"],
        /* 动态加载的广告容器 */
        div:has(> img[src*="pocdn.processon.com/admin/file_img"]),
        div:has(> img[src*="pocdn.processon.com/admin/popup_img"]),
        div:has(> img[src*="/image/beca4be061a.png"]) {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
            z-index: -9999 !important;
        }
    `;
    document.head.appendChild(style);

    // 优化的广告移除函数
    const removeAds = debounce(() => {
        const adSelectors = [
            'div.advert',
            'div[style*="background-color: rgb(176, 106, 251)"]',
            '.dialog-box[data-type="ad"]',
            'a[href*="/ac/250205"]',
            '.carsouselBox',
            '.dlg-manage',
            '.po-report'
        ];

        const selector = adSelectors.join(',');
        const ads = document.querySelectorAll(selector);
        
        if (ads.length > 0) {
            ads.forEach(ad => ad.remove());
        }
    }, 100); // 100ms 的防抖时间

    // 优化的 MutationObserver
    let observerTimeout = null;
    const observer = new MutationObserver((mutations) => {
        // 批量处理多个变化
        if (observerTimeout) {
            return;
        }
        
        observerTimeout = setTimeout(() => {
            const hasRelevantChanges = mutations.some(mutation => {
                // 只处理新增节点和样式变化
                return mutation.addedNodes.length > 0 || 
                       (mutation.type === 'attributes' && 
                        (mutation.attributeName === 'style' || mutation.attributeName === 'class'));
            });

            if (hasRelevantChanges) {
                removeAds();
            }
            observerTimeout = null;
        }, 100);
    });

    // 配置 observer，减少不必要的监听
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
        attributeOldValue: false,
        characterData: false,
        characterDataOldValue: false
    });

    // 初始化
    document.addEventListener('DOMContentLoaded', removeAds, { once: true });
    window.addEventListener('load', removeAds, { once: true });

    // 重写广告关闭函数
    window.getAdvert = {
        hideAdvert: removeAds
    };
})(); 