// ==UserScript==
// @name         MyAnonamouse Auto Buy FL
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically clicks the "Buy as FL" button on MyAnonamouse torrent pages
// @license MIT
// @match        https://www.myanonamouse.net/t/*
// @require      https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543690/MyAnonamouse%20Auto%20Buy%20FL.user.js
// @updateURL https://update.greasyfork.org/scripts/543690/MyAnonamouse%20Auto%20Buy%20FL.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Extract torrent ID from URL (e.g. /t/123456 -> 123456)
    const tidMatch = window.location.pathname.match(/^\/t\/(\d+)$/);
    if (!tidMatch) return;
    const tid = Number(tidMatch[1]);

    /**
     * Fallback flow:
     * If freeleechCallback is not available or errors,
     * this clicks the "Buy as FL" button and confirms the dialog by clicking "Ok"
     * This mimics the manual user actions.
     */
    function fallbackClickFlow() {
        waitForKeyElements('input[name="personalFL"][value="Buy as FL"]', function(btn) {
            console.log('[Auto Buy FL] freeleechCallback unavailable, clicking Buy as FL button');
            btn[0].click();

            waitForKeyElements(
                '.ui-dialog-buttonset button.ui-button:contains("Ok")',
                function(okBtn) {
                    console.log('[Auto Buy FL] Clicking confirmation Ok button');
                    okBtn[0].click();
                },
                true
            );
        }, true);
    }

    try {
        if (typeof freeleechCallback === 'function') {
            // Attempt to directly call freeleechCallback to buy FL without UI interaction
            console.log(`[Auto Buy FL] Trying freeleechCallback([${tid}, "personalFL"]) directly`);
            freeleechCallback([tid, "personalFL"]);
        } else {
            // If the function doesn't exist, fallback to button clicking
            console.warn('[Auto Buy FL] freeleechCallback not found, falling back to button clicks');
            fallbackClickFlow();
        }
    } catch (e) {
        // If calling the function throws an error (maybe site changed), fallback to button clicking
        console.error('[Auto Buy FL] Error calling freeleechCallback:', e);
        fallbackClickFlow();
    }
})();