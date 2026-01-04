// ==UserScript==
// @name         Unhide Discord Spoilers
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically unhide spoilers in discord
// @author       pfn0#0001
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463772/Unhide%20Discord%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/463772/Unhide%20Discord%20Spoilers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeClass(e, pred) {
        e.classList.forEach(c => {
            if (pred(c)) {
                e.classList.remove(c);
            }
        });
    }
    function processSelection(selector, predicate) {
        document.querySelectorAll(selector).forEach(e => {
            removeClass(e, predicate);
        });

    }
    function unhideSpoilers() {
        var giftag = document.querySelectorAll("[class*='spoilerWarning']");
        giftag.forEach(e => {
            e.style.visibility = "";
            e.style.display = "none";
        });

        processSelection("[class*='hiddenSpoiler-']", c => c.startsWith("hiddenSpoiler-"));
        processSelection("[class*='hiddenSpoilers']", c => c.startsWith("hiddenSpoilers-"));
        processSelection("[class*='obscured']", c => c.startsWith("obscured"));

        processSelection("[aria-label=Spoiler]", c => c.startsWith("obscuredTextContent"));
        processSelection("[aria-label=Spoiler]", c => c.startsWith("spoilerContent"));

    }
    document.addEventListener("scroll", unhideSpoilers, true);
    document.addEventListener("load", unhideSpoilers, true);
})();