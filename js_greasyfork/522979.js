// ==UserScript==
// @name         Any Hackernews Link
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Check if current page has been posted to Hacker News
// @author       RoCry
// @icon         https://news.ycombinator.com/favicon.ico
// @match        https://*/*
// @exclude      https://news.ycombinator.com/*
// @exclude      https://hn.algolia.com/*
// @exclude      https://*.google.com/*
// @exclude      https://mail.yahoo.com/*
// @exclude      https://outlook.com/*
// @exclude      https://proton.me/*
// @exclude      https://localhost/*
// @exclude      https://127.0.0.1/*
// @exclude      https://192.168.*.*/*
// @exclude      https://10.*.*.*/*
// @exclude      https://172.16.*.*/*
// @exclude      https://web.whatsapp.com/*
// @exclude      https://*.facebook.com/messages/*
// @exclude      https://*.twitter.com/messages/*
// @exclude      https://*.linkedin.com/messaging/*
// @grant        GM_xmlhttpRequest
// @connect      hn.algolia.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require https://update.greasyfork.org/scripts/524693/1644711/Any%20Hackernews%20Link%20Utils.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522979/Any%20Hackernews%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/522979/Any%20Hackernews%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Initialize GM polyfills
    GMPolyfills.initialize();

    /**
     * Main application logic
     */
    const App = {
        floatElement: null,

        /**
         * Initialize the floating element
         */
        initializeUI() {
            // Create the floating element
            this.floatElement = UIHelpers.createFloatingElement();
            document.body.appendChild(this.floatElement);

            // Apply saved position
            const savedPosition = GM_getValue('hnPosition', 'BOTTOM_LEFT');
            UIHelpers.applyPosition(this.floatElement, UI_CONSTANTS.POSITIONS[savedPosition]);

            // Add drag functionality
            UIHelpers.makeDraggable(this.floatElement, (x, y) => {
                const position = UIHelpers.getClosestPosition(x, y);
                UIHelpers.applyPosition(this.floatElement, UI_CONSTANTS.POSITIONS[position]);
                GM_setValue('hnPosition', position);
            });
        },

        /**
         * Update UI with HN data
         */
        updateUI(data) {
            UIHelpers.updateFloatingElement(this.floatElement, data);
        }
    };

    /**
     * Initialize the script
     */
    function init() {
        // Skip if we're in an iframe
        if (window.top !== window.self) {
            console.log('📌 Skipping execution in iframe');
            return;
        }

        // Skip if document is hidden (like background tabs or invisible frames)
        if (document.hidden) {
            console.log('📌 Skipping execution in hidden document');
            // Add listener for when the tab becomes visible
            document.addEventListener('visibilitychange', function onVisible() {
                if (!document.hidden) {
                    init();
                    document.removeEventListener('visibilitychange', onVisible);
                }
            });
            return;
        }

        const currentUrl = window.location.href;

        // Check if the floating element already exists
        if (document.getElementById('hn-float')) {
            console.log('📌 HN float already exists, skipping');
            return;
        }

        if (URLUtils.shouldIgnoreUrl(currentUrl)) {
            console.log('🚫 Ignored URL:', currentUrl);
            return;
        }

        // Check if content is primarily English
        if (!ContentUtils.isEnglishContent()) {
            console.log('🈂️ Non-English content detected, skipping');
            return;
        }

        GM_addStyle(UI_CONSTANTS.STYLES);
        const normalizedUrl = URLUtils.normalizeUrl(currentUrl);
        console.log('🔗 Normalized URL:', normalizedUrl);

        App.initializeUI();
        HNApi.checkHackerNews(normalizedUrl, (data) => App.updateUI(data));
    }

    // Start the script
    init();
})();
