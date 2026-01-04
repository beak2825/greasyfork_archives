// ==UserScript==
// @name         SYNOTTIP - m na sport
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace "m" with "sport" in specific URL
// @author       Lukáš Malec
// @match        https://m.synottip.cz/live-zapas/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496384/SYNOTTIP%20-%20m%20na%20sport.user.js
// @updateURL https://update.greasyfork.org/scripts/496384/SYNOTTIP%20-%20m%20na%20sport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Current URL
    let currentUrl = window.location.href;

    // Replace "m" with "sport" in the hostname
    let newUrl = currentUrl.replace("m.synottip.cz", "sport.synottip.cz");

    // Redirect to the new URL if it is different from the current URL
    if (newUrl !== currentUrl) {
        window.location.replace(newUrl);
    }
})();
