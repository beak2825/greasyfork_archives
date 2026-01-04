// ==UserScript==
// @name         Pixiv AdBlock
// @name:en      Pixiv AdBlock
// @name:vi      Pixiv Chặn Quảng Cáo
// @name:zh-CN   Pixiv 广告屏蔽
// @name:zh-TW   Pixiv 廣告封鎖
// @name:ja      Pixiv 広告ブロック
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Block ads on Pixiv
// @description:en  Block ads on Pixiv
// @description:vi  Chặn quảng cáo trên Pixiv
// @description:zh-CN  屏蔽 Pixiv 上的广告
// @description:zh-TW  封鎖 Pixiv 上的廣告
// @description:ja  Pixivの広告をブロックします
// @match        https://www.pixiv.net/*
// @match        https://touch.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @license      GPL-3.0-only
// @author       RenjiYuusei
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503931/Pixiv%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/503931/Pixiv%20AdBlock.meta.js
// ==/UserScript==

(() => {
    // List of advertising selectors to be blocked
    const adSelectors = [
        ".ads", ".ad-container", ".billboard", ".ads-top-info",
        '[class*="ad-"]', '[class*="ads-"]', '[id*="ad-"]', '[id*="ads-"]',
        ".premium-lead-t", ".premium-lead-new-t", ".promotional-popup",
        ".ad-footer", ".ad-header", ".ad-sidebar", ".billboard-ad",
        ".js-premium-lead-header", ".js-premium-lead-footer", ".spotlight-ads",
        ".ad-interstitial", 'iframe[src*="ads"]', "div[data-ad-slot]",
        ".adsbygoogle", "#footer-ads", "#headerAd", ".ads-article-bottom",
        ".ads-article-top", ".ads-sidebar", ".advertisement", ".pixiv-ad",
        ".premium-promotion", "[data-gtm-recommend-ad]", '[data-gtm-value*="ad_"]',
        // Mobile specific selectors
        ".sp-ads", ".mobile-ad", ".mobile-advertisement",
        '[class*="sp-ad-"]', '[id*="sp-ad-"]',
        ".mobile-premium-lead", ".mobile-promotional",
        'div[class*="mobile-ads"]', 'div[id*="mobile-ads"]',
        // Additional ad selectors
        ".sc-e9a5cd03-2", ".bGISCJ", "#adsdk--R1mhutb6",
        'div[id^="adsdk--"]', 'iframe[data-uid^="R"]'
    ];

    // Function to remove ads
    function removeAds() {
        // Remove elements matching the selectors
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });

        // Remove ad close buttons and their containers
        document.querySelectorAll('img[src*="close_icon"][style*="position: absolute"], img[src*="close_button"]').forEach(img => {
            const container = img.closest('div');
            if (container) container.remove();
        });
    }

    // Add CSS to hide ads
    function addBlockingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ${adSelectors.join(', ')},
            img[src*="close_icon"][style*="position: absolute"],
            img[src*="close_button"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
                position: absolute !important;
                top: -9999px !important;
                left: -9999px !important;
            }
            /* Mobile specific styles */
            body.touch-device .ad-container,
            body.touch-device [class*="sp-ad"],
            body.touch-device .mobile-ad {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Observe DOM changes to remove dynamic ads
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
            if (hasNewNodes) removeAds();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function init() {
        addBlockingStyles();
        removeAds();
        observeDOMChanges();
        
        // Process events to ensure ads are removed
        window.addEventListener('load', removeAds);
        document.addEventListener('DOMContentLoaded', removeAds);
        window.addEventListener('scroll', removeAds);
        // Handle touch events for mobile
        document.addEventListener('touchstart', removeAds, {passive: true});
        document.addEventListener('touchend', removeAds, {passive: true});
        setInterval(removeAds, 1000);
    }

    // Run script
    init();
})();
