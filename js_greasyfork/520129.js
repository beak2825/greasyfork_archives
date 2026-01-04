// ==UserScript==
// @name        Reddit Instant Auto-Translation Bypass (Minimal Version)
// @namespace   Violentmonkey Scripts
// @match       *://*.reddit.com/*
// @run-at      document-start
// @grant       none
// @version     0.1
// @license     MIT
// @author      rv1sr
// @description Remove parameter and redirect back to the original content
// @downloadURL https://update.greasyfork.org/scripts/520129/Reddit%20Instant%20Auto-Translation%20Bypass%20%28Minimal%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520129/Reddit%20Instant%20Auto-Translation%20Bypass%20%28Minimal%20Version%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const url = new URL(window.location.href), param = "tl";
    if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        window.location.href = url.toString();
    }
})();
