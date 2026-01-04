// ==UserScript==
// @name        Bypass m.forasm.com redirect
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Automatically redirect to target URL on m.forasm.com
// @match       *://m.forasm.com/*
// @grant       none
// @author      wisp
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/524450/Bypass%20mforasmcom%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/524450/Bypass%20mforasmcom%20redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[QuickRedirect] Script started.");

    // Function to locate and redirect
    function redirectToLink() {
        const linkElement = document.querySelector('.edu-btn');
        if (linkElement && linkElement.href) {
            console.log("[QuickRedirect] Redirecting to:", linkElement.href);
            window.location.href = linkElement.href;
        } else {
            console.error("[QuickRedirect] Link with class 'edu-btn' not found.");
        }
    }

    // Run the redirection logic immediately
    redirectToLink();
})();
