// ==UserScript==
// @name         Open All News Sites with Toggle
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Open all news sites in new tabs with a toggle
// @author       davidh_123
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541415/Open%20All%20News%20Sites%20with%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/541415/Open%20All%20News%20Sites%20with%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of news sites to open
    const newsSites = [
        "https://www.nytimes.com/",
        "https://www.wsj.com/",
        "https://www.ft.com/",
        "https://antiwar.com/",
        "https://www.breitbart.com/",
        "https://theintercept.com/",
        "https://www.drudgereport.com/"
    ];

    // Function to open all news sites in new tabs
    function openAllNewsSites() {
        newsSites.forEach(site => {
            window.open(site, '_blank');
        });
    }

    // Check if the script is enabled
    const isEnabled = GM_getValue('openNewsSitesEnabled', false);

    // Register a menu command to toggle the script
    GM_registerMenuCommand("Toggle Open News Sites", () => {
        const newEnabledState = !isEnabled;
        GM_setValue('openNewsSitesEnabled', newEnabledState);
        isEnabled = newEnabledState;
        if (isEnabled) {
            openAllNewsSites();
        }
    }, "O");

    // Open all news sites if the script is enabled
    if (isEnabled) {
        openAllNewsSites();
    }
})();