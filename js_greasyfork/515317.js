// ==UserScript==
// @name         Remove Tooltips on Yahoo Fantasy Football for Domes and Fair Weather
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the .tooltip class from elements with domes/fair weather on Yahoo Fantasy Football
// @author       Brendan Myers
// @match        https://*.fantasysports.yahoo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515317/Remove%20Tooltips%20on%20Yahoo%20Fantasy%20Football%20for%20Domes%20and%20Fair%20Weather.user.js
// @updateURL https://update.greasyfork.org/scripts/515317/Remove%20Tooltips%20on%20Yahoo%20Fantasy%20Football%20for%20Domes%20and%20Fair%20Weather.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTooltipClass() {
        document.querySelectorAll('.Tst-dome.F-icon.F-shade.tooltip, .Tst-weather.F-icon.F-shade.tooltip').forEach((el) => {
            el.classList.remove('tooltip');
        });
    }

    removeTooltipClass();

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(() => {
        removeTooltipClass();
    });

    // Start observing the entire document for added/changed nodes
    observer.observe(document.body, { childList: true, subtree: true });
})();