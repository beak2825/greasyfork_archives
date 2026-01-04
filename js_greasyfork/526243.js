// ==UserScript==
// @name         Hide Unsplash+ Content
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hide Unsplash+ photos and related mentions on unsplash.com
// @author       KosherKale
// @match        https://unsplash.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526243/Hide%20Unsplash%2B%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/526243/Hide%20Unsplash%2B%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = {
        promoContent: [
            'a[href*="/plus"]',
            'div[data-test="related-promo-banner"]',
            'nav a[href*="unsplash.com/plus"]',
            'button[data-test="nav-bar-plus-button"]',
            '.js-plus-info-modal',
            '[data-test="paywall-modal"]'
        ],

        photoContent: [
            'figure:has(button:has(svg[title*="plus"]))',
            'figure:has(.js-plus-tag)',
            'figure:has(a[href*="/plus"])',
            'div[data-test="photo-grid-masonry-item"]:has(button:has(svg[title*="plus"]))',
            'div[data-test="photo-grid-masonry-item"]:has(.js-plus-tag)',
            'div[data-test="plus-photos-modal"]',
            'div[data-test="plus-upsell"]'
        ]
    };

    function hideUnsplashPlusEditButtons(root = document) {
        root.querySelectorAll('button').forEach(btn => {
            const text = (btn.textContent || '').trim().toLowerCase();
            const isEditImage = text.startsWith('edit image');

            const hasUnsplashPlusIcon = Array.from(btn.querySelectorAll('svg > desc'))
                .some(d => (d.textContent || '').toLowerCase().includes('unsplash+'));

            const classHint = (btn.className || '').toLowerCase().includes('modifyimgbtn');

            if ((isEditImage && hasUnsplashPlusIcon) || (isEditImage && classHint)) {
                btn.style.display = 'none';
            }
        });
    }

    function hideElements() {
        const allSelectors = [...selectors.promoContent, ...selectors.photoContent];

        allSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(element => {
                    element.style.display = 'none';
                    const parentFigure = element.closest('figure, div[data-test="photo-grid-masonry-item"]');
                    if (parentFigure) {
                        parentFigure.style.display = 'none';
                    }
                });
            } catch (e) {
                console.debug(`Selector "${selector}" failed:`, e);
            }
        });

        document.querySelectorAll('figure, div[data-test="photo-grid-masonry-item"]').forEach(element => {
            const hasLockIcon = element.querySelector('svg[aria-label*="lock"], svg[title*="lock"]');
            const hasPlusButton = element.querySelector('button:has(svg[title*="plus"])');
            if (hasLockIcon || hasPlusButton) {
                element.style.display = 'none';
            }
        });

        hideUnsplashPlusEditButtons();
    }

    hideElements();

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) {
                hideElements();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            hideElements();
        }
    }).observe(document, { subtree: true, childList: true });

})();