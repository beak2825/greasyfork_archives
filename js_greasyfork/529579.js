// ==UserScript==
// @name        adfoc.us skip
// @namespace   Violentmonkey Scripts
// @match       http://adfoc.us/*
// @match       https://adfoc.us/*
// @grant       none
// @version     1.2
// @author      Baba-Yagan
// @license     CC BY-NC-SA 4.0
// @license     https://creativecommons.org/licenses/by-nc-sa/4.0/
// @description Auto Open Skip Link & Show Hidden Button
// @homepage    https://greasyfork.org/en/scripts/529579-adfoc-us-skip
// @downloadURL https://update.greasyfork.org/scripts/529579/adfocus%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/529579/adfocus%20skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Make #showSkip visible
    let skipDiv = document.querySelector("#showSkip");
    if (skipDiv) {
        skipDiv.removeAttribute("style");
    }

    // Wait for the page to fully load
    window.onload = function() {
        let skipLink = document.querySelector("#showSkip a");
        if (skipLink && skipLink.href) {
            window.location.href = skipLink.href; // Redirect to the URL
        }
    };
})();
