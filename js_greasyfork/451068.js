// ==UserScript==
// @name         CleverTap session extender
// @version      1.0
// @description  Protects against irritating and dangerously short session inactivity timeouts, which can lead to losing progress when editing campaigns.
// @author       Christopher Orr <chris@website>
// @website      https://klima.com/
// @namespace    https://klima.com/
// @license      MIT
// @match        https://*.dashboard.clevertap.com/*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=clevertap.com
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      self
// @downloadURL https://update.greasyfork.org/scripts/451068/CleverTap%20session%20extender.user.js
// @updateURL https://update.greasyfork.org/scripts/451068/CleverTap%20session%20extender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cleverTapRefresh = () => {
        console.log('UserScript: Keeping CleverTap session alive in the background…');

        // Fetch the top-level URL every 5–10 minutes, i.e. much more often than the ~45-minute session inactivity timeout.
        // This redirects to the main dashboard page, and so should prolong the current logged-in session
        GM_xmlhttpRequest({ url: '/' });

        // Repeat so long as this tab is open
        const intervalMs = 5 * 60 * 1000;
        return setTimeout(cleverTapRefresh, intervalMs + (intervalMs * Math.random()));
    };

    cleverTapRefresh();
})();
