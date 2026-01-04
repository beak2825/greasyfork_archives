// ==UserScript==
// @name         SPWN geo bypass
// @namespace    spwn.geo.bypass
// @version      0.3
// @description  Bypass SPWN geocheck.
// @author       PokeGuys
// @match        *://spwn.jp/*
// @match        *://virtual.spwn.jp/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428530/SPWN%20geo%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/428530/SPWN%20geo%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook `fetch` function to inject our patched code.
    const originalFetch = window.fetch;
    window.fetch = async function() {
        return Promise.resolve(originalFetch.apply(window, arguments)).then(res => {
            // Apply response patch to `/check_geo` endpoint
            const url = new URL(res.url);
            if (url.pathname.includes('/check_geo')) {
                // Apply patch and restore hook
                window.fetch = originalFetch;
                return new Response('{"isError": false}');
            }

            return res;
        });
    }
})();