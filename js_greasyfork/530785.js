// ==UserScript==
// @name         Bilibili Live Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Stream filtering + Gift bar removal + Live counter for Bilibili
// @author       Gavin Hon
// @match        https://live.bilibili.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530785/Bilibili%20Live%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/530785/Bilibili%20Live%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - Stream Filtering
    const LIVE_FILTER_SELECTOR = '.face.living';
    const TARGET_CONTAINER_SELECTOR = '.single';
    const NAME_SELECTOR = '.name';
    const BLOCKED_NAME = '花芽荔枝';
    const COUNTER_SELECTOR = '.mount';
    const COUNTER_PREFIX = '(Live Streaming: ';

    // Configuration - Gift Bar Removal
    const GIFT_BAR_ID = 'gift-control-vm';

    let liveCount = 0;
    let counterElement = null;
    let timer = null;
    const THROTTLE_TIME = 0;

    // Core Functions
    function updateCounter() {
        if (!counterElement) {
            counterElement = document.querySelector(COUNTER_SELECTOR);
            if (!counterElement) return;
        }
        counterElement.textContent = `${COUNTER_PREFIX}${liveCount})`;
    }

    function filterStreamers() {
        liveCount = 0;
        document.querySelectorAll(TARGET_CONTAINER_SELECTOR).forEach(container => {
            // Name filter
            const nameElem = container.querySelector(NAME_SELECTOR);
            if (nameElem?.textContent.includes(BLOCKED_NAME)) {
                container.remove();
                return;
            }

            // Live status check
            const isLive = container.querySelector(LIVE_FILTER_SELECTOR);
            isLive ? liveCount++ : container.remove();
        });

        updateCounter();
    }

    function removeGiftBar() {
        const giftBar = document.getElementById(GIFT_BAR_ID);
        if (giftBar) giftBar.remove();
    }

    // Throttle function
    function throttle(func) {
        if (!timer) {
            func();
            timer = setTimeout(() => {
                timer = null;
            }, THROTTLE_TIME);
        }
    }

    // Unified observer for all DOM changes
    const mainObserver = new MutationObserver((mutations) => {
        throttle(() => {
            filterStreamers();
            removeGiftBar();
        });
    });

    // Initial setup
    function initialize() {
        // Run features immediately
        removeGiftBar();
        filterStreamers();

        // Start observing
        mainObserver.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: false,
            characterData: false
        });

        // Handle SPA navigation
        window.addEventListener('popstate', initialize);
        window.addEventListener('pushstate', initialize);
    }

    // Start the script
    initialize();
})();