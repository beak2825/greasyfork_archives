// ==UserScript==
// @name         Remove Ads (Safe for Content)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Remove or hide ads, including video overlays, banners, scripts, and auto-close ad overlays, while preserving all content, videos, and images
// @author       You
// @match        *://rphang.ph/*
// @match        *://*.rphang.ph/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535513/Remove%20Ads%20%28Safe%20for%20Content%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535513/Remove%20Ads%20%28Safe%20for%20Content%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of ad selectors (updated with new ad-specific selectors)
    const adSelectors = [
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="googlesyndication.com"]',
        'iframe[src*="bankingbloatedcaptive.com"]',
        'iframe[src*="chestgoingpunch.com"]',
        'iframe[src*="magsrv.com"]',
        'iframe[src*="ad.plus"]',
        'iframe[src*="adnxs"]',
        'iframe[src*="adsystem"]',
        'iframe[id*="__clb-"]',
        'script[src*="doubleclick.net"]',
        'script[src*="googlesyndication.com"]',
        'script[src*="bankingbloatedcaptive.com"]',
        'script[src*="chestgoingpunch.com"]',
        'script[src*="magsrv.com"]',
        'script[src*="adserver"]',
        'script[src*="popunder"]',
        'script[id*="__clb-"]',
        'script[class*="__clb-"]',
        '[class*="ads"]',
        '[id*="ads"]',
        '[class*="ad-banner"]',
        '[id*="ad-banner"]',
        '[class*="advertisement"]',
        '[id*="advertisement"]',
        '[class*="sponsor"]',
        '[id*="sponsor"]',
        '[class*="ad-"]',
        '[id*="ad-"]',
        '.samOverlayCloseButton',
        '.samVideoOverlay',
        '.samCodeUnit',
        '.ad-container',
        '.ad-content',
        'ins[data-zoneid]',
        '[class^="eas"]',
        '.samBannerUnit',
        '.samItem',
        'a[href*="utm_source=rphangme"]',
        'a[href*="adserver"]',
        'a[href*="clicktrack"]',
        'img[src*="rphang.online/images/pc-"]',
        'div[id*="banner"]',
        'div[class*="banner"]',
        'div[id*="popup"]',
        'div[class*="popup"]',
        'div[id*="sticky"]',
        'div[class*="sticky"]',
        'div[id*="float"]',
        'div[class*="float"]',
        'div[style*="position: fixed"][style*="z-index: 9999"]',
        '.adsbygoogle',
        '#overlay-ad',
        '.overlay-ad',
        'div[data-position="footer_fixed"]', // New: Targets footer ad unit
        'div[data-position="container_breadcrumb_top_above"]', // New: Targets top banner ad unit
        'video.catfishpc', // New: Targets video ads
        'img.catfishpc', // New: Targets image ads
        'a[href*="b52.cc"]', // New: Targets specific ad link
        'a[href*="vip79.com"]', // New: Targets specific ad link
        'a[href*="da88.win"]', // New: Targets specific ad link
        'a[href*="hong88.com"]', // New: Targets specific ad link
        'a[rel="nofollow"][href*="utm_term=sex"]' // New: Targets ad links with specific utm_term
    ];

    // Whitelist to prevent false positives
    const whitelist = [
        'player',
        'video-container',
        'content-main',
        'navigation',
        'header',
        'footer',
        'sidebar',
        'message-userContent',
        'video-player'
    ];

    // Function to check if element is in whitelist
    function isWhitelisted(element) {
        if (!element) return false;
        return whitelist.some(term => {
            if (element.id && element.id.includes(term)) return true;
            if (element.className && typeof element.className === 'string' && element.className.includes(term)) return true;
        }) || element.closest('.message-userContent, .video-player');
    }

    // Function to hide or remove ads safely
    function removeAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                try {
                    if (!el.querySelector('video:not(.catfishpc)') && !isWhitelisted(el)) { // Updated to allow non-ad videos
                        console.log('Hiding ad element:', selector, el);
                        el.style.display = 'none';
                        if (selector.includes('script') || selector.includes('iframe') || selector.includes('video.catfishpc')) {
                            el.remove();
                        }
                    }
                } catch (error) {
                    console.error('Error hiding/removing ad:', selector, error);
                }
            });
        });
    }

    // Function to auto-click the "Close Ad" button
    function autoCloseAdOverlay() {
        document.querySelectorAll('.samOverlayCloseButton, .samCloseButton, .ad-close-button, .close-ad, [class*="close"][class*="ad"]').forEach(closeButton => {
            try {
                console.log('Close button found:', closeButton);
                closeButton.click();
                const clickEvent = new Event('click', { bubbles: true });
                closeButton.dispatchEvent(clickEvent);
                const adContainer = closeButton.closest('.samBannerUnit, .samCodeUnit, .ad-container, [class*="ad-"]');
                if (adContainer && !adContainer.querySelector('video:not(.catfishpc)') && !adContainer.querySelector('img:not([src*="ad"])') && !isWhitelisted(adContainer)) {
                    console.log('Hiding ad container:', adContainer);
                    adContainer.style.display = 'none';
                }
            } catch (error) {
                console.error('Error closing ad overlay:', error);
            }
        });
    }

    // Disable AdProvider to prevent ad reinjection
    function disableAdProvider() {
        try {
            window.AdProvider = {
                push: function() {
                    console.log('Blocked AdProvider.push');
                }
            };
        } catch (error) {
            console.error('Error disabling AdProvider:', error);
        }
    }

    // Remove inline event attributes that trigger ads
    function removeInlineAdEvents() {
        document.querySelectorAll('[onclick], [ondblclick]').forEach(el => {
            try {
                el.removeAttribute('onclick');
                el.removeAttribute('ondblclick');
            } catch (error) {
                console.error('Error removing inline events:', error);
            }
        });
    }

    // Block click and double-click event listeners to prevent ad popups
    function blockAdEvents() {
        ['click', 'dblclick'].forEach(eventType => {
            document.body.addEventListener(eventType, function(e) {
                const isAdElement = adSelectors.some(selector => e.target.closest(selector));
                if (isAdElement) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }, true);
        });
    }

    // Optimized hideOverlayAds
    function hideOverlayAds() {
        const potentialOverlays = document.querySelectorAll('div[style*="position: fixed"], div[style*="position: absolute"], iframe[style*="position: fixed"], iframe[style*="position: absolute"]');
        potentialOverlays.forEach(el => {
            try {
                const style = window.getComputedStyle(el);
                const zIndex = parseInt(style.zIndex, 10);
                if (zIndex > 1000 && !el.querySelector('video:not(.catfishpc)') && !isWhitelisted(el)) {
                    if (style.display !== 'none' &&
                        (style.width === '100%' || parseInt(style.width) > 300) &&
                        (style.height === '100%' || parseInt(style.height) > 200)) {
                        console.log('Hiding high z-index element:', el);
                        el.style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('Error hiding overlay:', error);
            }
        });
    }

    // Resource cleanup function
    function cleanupResources() {
        if (observer) {
            observer.disconnect();
        }
        if (interval) {
            clearInterval(interval);
        }
    }

    // Initial run
    disableAdProvider();
    removeAds();
    autoCloseAdOverlay();
    removeInlineAdEvents();
    blockAdEvents();
    hideOverlayAds();

    // Efficient MutationObserver configuration
    const observer = new MutationObserver((mutations) => {
        const shouldProcess = mutations.some(mutation =>
            mutation.type === 'childList' && mutation.addedNodes.length > 0 ||
            (mutation.type === 'attributes' &&
             (mutation.target.tagName === 'IFRAME' ||
              mutation.attributeName === 'src' ||
              mutation.attributeName === 'class' ||
              mutation.attributeName === 'id' ||
              mutation.attributeName === 'style'))
        );

        if (shouldProcess) {
            removeAds();
            autoCloseAdOverlay();
            removeInlineAdEvents();
            hideOverlayAds();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'class', 'id', 'style']
    });

    // Interval to check for ads in the first 20 seconds
    const interval = setInterval(() => {
        autoCloseAdOverlay();
        removeAds();
        hideOverlayAds();
    }, 500);

    setTimeout(() => clearInterval(interval), 20000);

    // Cleanup on page unload
    window.addEventListener('unload', cleanupResources);
})();