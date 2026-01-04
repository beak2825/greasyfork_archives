// ==UserScript==
// @name         Scroll Limiter
// @namespace    https://www.qs5.org/?Scroll-Limiter
// @version      1.0
// @description  Limits excessive scrolling on social media.
// @author       kmfb@github
// @match        *://*.facebook.com/*
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.weibo.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.xiaohongshu.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.reddit.com/*
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514953/Scroll%20Limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/514953/Scroll%20Limiter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULTS = {
        SCROLL_LIMIT: 8000,
        PROGRESS_BAR_CONFIG: {
            HEIGHT: "4px",
            COLOR: "#4CAF50",
            HIDE_DELAY: 1000, // ms
        },
        NOTIFICATION_CONFIG: {
            DURATION: 3000, // ms
            BACKGROUND: "#333",
            TEXT_COLOR: "#fff",
        },
    };

    const state = {
        scrollLimit: DEFAULTS.SCROLL_LIMIT,
        hasReachedLimit: false,
        progressBar: null,
        scrollTimeout: null,
        enabled: true,
    };

    const progressBarManager = {
        create() {
            const bar = document.createElement("div");
            Object.assign(bar.style, {
                position: "fixed",
                top: "0",
                left: "0",
                height: DEFAULTS.PROGRESS_BAR_CONFIG.HEIGHT,
                backgroundColor: DEFAULTS.PROGRESS_BAR_CONFIG.COLOR,
                transition: "width 0.2s",
                zIndex: "9999",
            });
            document.body.appendChild(bar);
            return bar;
        },
        update(percentage) {
            if (state.progressBar) {
                state.progressBar.style.width = `${percentage}%`;
            }
        },
        remove() {
            if (state.progressBar) {
                state.progressBar.remove();
                state.progressBar = null;
            }
        },
    };

    const notificationManager = {
        show() {
            this.removeExisting();
            const notification = document.createElement("div");
            Object.assign(notification.style, {
                position: "fixed",
                top: "10px",
                right: "10px",
                backgroundColor: DEFAULTS.NOTIFICATION_CONFIG.BACKGROUND,
                color: DEFAULTS.NOTIFICATION_CONFIG.TEXT_COLOR,
                padding: "10px",
                borderRadius: "5px",
                zIndex: "10000",
            });
            notification.className = "scroll-limit-notification";
            notification.textContent = "You've reached your scrolling limit!";
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), DEFAULTS.NOTIFICATION_CONFIG.DURATION);
        },
        removeExisting() {
            document.querySelectorAll(".scroll-limit-notification").forEach(notification => notification.remove());
        },
    };

    function handleScroll() {
        if (!state.enabled) return;

        if (!state.progressBar) {
            state.progressBar = progressBarManager.create();
        }

        clearTimeout(state.scrollTimeout);
        state.scrollTimeout = setTimeout(() => {
            progressBarManager.remove();
        }, DEFAULTS.PROGRESS_BAR_CONFIG.HIDE_DELAY);

        const scrollPercentage = (window.scrollY / state.scrollLimit) * 100;
        progressBarManager.update(scrollPercentage);

        if (window.scrollY >= state.scrollLimit) {
            window.scrollTo(0, state.scrollLimit);
            notificationManager.show();
        } else {
            state.hasReachedLimit = false;
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedHandleScroll = debounce(handleScroll, 16);
    window.addEventListener("scroll", debouncedHandleScroll);

    // Initialize
    window.addEventListener("scroll", handleScroll);
})();
