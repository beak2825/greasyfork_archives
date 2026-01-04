// ==UserScript==
// @name         Google English Language + No SafeSearch
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  English interface with any-language results and SafeSearch off
// @author       DrSexo
// @match        https://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527843/Google%20English%20Language%20%2B%20No%20SafeSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/527843/Google%20English%20Language%20%2B%20No%20SafeSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const forceParams = {
        hl: 'en',       // English interface
        safe: 'off'     // Disable SafeSearch
    };

    const url = new URL(window.location.href);
    let modified = false;

    // Set forced parameters
    Object.entries(forceParams).forEach(([key, value]) => {
        if (url.searchParams.get(key) !== value) {
            url.searchParams.set(key, value);
            modified = true;
        }
    });

    // Remove language restriction (lr param)
    if (url.searchParams.has('lr')) {
        url.searchParams.delete('lr');
        modified = true;
    }

    if (modified) {
        window.stop();
        window.location.replace(url.toString());
    }
})();