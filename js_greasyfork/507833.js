// ==UserScript==
// @name         Auto Redirect to Freedium
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically redirects Medium/TowardsDataScience articles to Freedium
// @author       low_mist
// @match        *://medium.com/*
// @match        *://towardsdatascience.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507833/Auto%20Redirect%20to%20Freedium.user.js
// @updateURL https://update.greasyfork.org/scripts/507833/Auto%20Redirect%20to%20Freedium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentUrl = window.location.href;

    // Check if it's an article (to avoid redirecting homepage or other non-article pages)
    if (currentUrl.includes('/')) {
        // Extract the path (everything after the domain)
        const path = window.location.pathname + window.location.search;

        // Construct the new Freedium URL
        const freediumUrl = `https://freedium-mirror.cfd${path}`;

        // Redirect to Freedium
        window.location.href = freediumUrl;
    }
})();
