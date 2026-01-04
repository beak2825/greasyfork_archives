// ==UserScript==
// @name         Twitter Remove Trends Panel
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove the in-your-face trends panel on the side of your feed.
// @author       Cromachina
// @match        https://*.twitter.com/*
// @match        https://*.x.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/399025/Twitter%20Remove%20Trends%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/399025/Twitter%20Remove%20Trends%20Panel.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';
    // Constantly attempt to remove the trends panel, as navigating the site will regenerate it.
    setInterval(function ()
    {
        document.querySelector('div[aria-label="Timeline: Trending now"]')?.remove();
    }, 500);
})();
