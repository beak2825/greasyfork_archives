// ==UserScript==
// @name         Enhanced Web Page Optimizer
// @namespace    https://discord.gg/gFNAH7WNZj
// @version      1.4
// @description  Improve web page performance by blocking ads, lazy-loading images, and removing intrusive elements.
// @author       Bacon But Pro
// @match        *://*/*
// @grant        none
// @icon         https://cdn141.picsart.com/351217840073211.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497981/Enhanced%20Web%20Page%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/497981/Enhanced%20Web%20Page%20Optimizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const blockedDomains = [
        'doubleclick.net', 'googlesyndication.com', 'google-analytics.com',
        'adsafeprotected.com', 'adnxs.com', 'rubiconproject.com',
        'pubmatic.com', 'scorecardresearch.com', 'bluekai.com',
        'facebook.net', 'amazon-adsystem.com', 'ads-twitter.com',
        'criteo.com', 'taboola.com', 'outbrain.com',
        'cdn.ampproject.org', 'quantserve.com', 'googletagmanager.com',
        'gemini.yahoo.com'
    ];

    const blockAds = () => {
        document.querySelectorAll('script[src], iframe[src]').forEach(el => {
            if (blockedDomains.some(domain => el.src.includes(domain))) {
                el.remove();
            }
        });
    };

    const adObserver = new MutationObserver(blockAds);
    adObserver.observe(document.documentElement, { childList: true, subtree: true });

    const enableLazyLoading = () => {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => img.setAttribute('loading', 'lazy'));

        const lazyLoadObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    lazyLoadObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            if (!img.src && img.dataset.src) {
                img.src = img.dataset.src;
            }
            lazyLoadObserver.observe(img);
        });
    };

    document.addEventListener('DOMContentLoaded', enableLazyLoading);

    const intrusiveSelectors = [
        '.popup', '.ad-banner', '#subscribe-modal', '.overlay'
    ];

    const removeIntrusiveElements = () => {
        intrusiveSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    };

    const intrusiveObserver = new MutationObserver(removeIntrusiveElements);
    intrusiveObserver.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', removeIntrusiveElements);

    const essentialButtonSelectors = ['button.important', '.keep-this-button'];

    const preserveEssentialButtons = () => {
        essentialButtonSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'block';
            });
        });
    };

    const buttonObserver = new MutationObserver(preserveEssentialButtons);
    buttonObserver.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', preserveEssentialButtons);
})();
