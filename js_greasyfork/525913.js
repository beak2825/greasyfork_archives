// ==UserScript==
// @name         Block Gmail Gemini Elements
// @namespace    http://tampermonkey.net/
// @version      2025-02-04
// @description  hide gemini elements from gmail
// @author       Dipack
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525913/Block%20Gmail%20Gemini%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/525913/Block%20Gmail%20Gemini%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeBadStuff() {
        const selectors = ['[data-label="Summarize this email"]', '[aria-label="Ask Gemini"]'];
        const badElements = selectors.flatMap((s) => {
            return [...document.querySelectorAll(s).values()];
        });
        if (badElements.length > 0) {
            badElements.forEach((el) => el.remove());
        }
    }
    // This is needed to ensure that we wait for the page to fully load before running our script.
    window.addEventListener('load', function() {
        removeBadStuff();
    }, false);

    // Also run periodically.
    setInterval(removeBadStuff, 500);
})();