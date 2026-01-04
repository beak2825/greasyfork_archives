// ==UserScript==
// @name         TDX: Open links in modal (2/2)
// @description  Part 2 of the Open Links in Modal script
// @version      2024-10-31
// @author       Nate Kean
// @namespace    https://github.com/garlic-os
// @license      MIT
// @match        https://tdx.umsystem.edu/TDNext/Apps/*
// @icon         https://tdx.umsystem.edu/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515241/TDX%3A%20Open%20links%20in%20modal%20%2822%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515241/TDX%3A%20Open%20links%20in%20modal%20%2822%29.meta.js
// ==/UserScript==

(async function() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    console.debug("Popups2Tabs: Polling for openWinReturn function to override...");
    while (!("openWinReturn" in window)) {
        console.debug("Popups2Tabs: Not found. Waiting 100ms...");
        await delay(100);
    }
    console.debug("Popups2Tabs: openWinReturn found. Overriding...");
    window.openWinHref = function(url, width, height, name, scrollbars) {
        return true;
    };

    console.debug("Popups2Tabs: Polling for openWin function to override...");
    while (!("openWinReturn" in window)) {
        console.debug("Popups2Tabs: Not found. Waiting 100ms...");
        await delay(100);
    }
    console.debug("Popups2Tabs: openWin found. Overriding...");
    window.openWin = function(url, width, height, name, scrollbars) {
        window.location.href = url;
    };
})();
