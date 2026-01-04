// ==UserScript==
// @name         Total Cookie Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks all cookies on all sites by overriding document.cookie API (client-side only).
// @author       Wassim
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544736/Total%20Cookie%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/544736/Total%20Cookie%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override document.cookie to block read and write
    Object.defineProperty(document, 'cookie', {
        get: function() {
            console.log('[Cookie Blocker] Attempted to read cookies');
            return ''; // Return empty to simulate no cookies
        },
        set: function(value) {
            console.log('[Cookie Blocker] Blocked cookie write:', value);
            // Do not actually set the cookie
        },
        configurable: false
    });

    // Delete all accessible cookies
    function deleteAllCookies() {
        const cookies = document.cookie.split("; ");
        for (let c of cookies) {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos) : c;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
        console.log('[Cookie Blocker] All cookies deleted.');
    }

    // Try deleting cookies on DOM ready
    window.addEventListener('DOMContentLoaded', deleteAllCookies);
})();
