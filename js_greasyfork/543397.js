// ==UserScript==
// @name         YouTube – Set Custom Number of Videos per Row
// @namespace    http://tampermonkey.net/
// @version      2025-07-23
// @description  after a unwanted change from 4 to 3 vids per row I've to spend time correcting their hiccup
// @author       MaxBrandner
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543397/YouTube%20%E2%80%93%20Set%20Custom%20Number%20of%20Videos%20per%20Row.user.js
// @updateURL https://update.greasyfork.org/scripts/543397/YouTube%20%E2%80%93%20Set%20Custom%20Number%20of%20Videos%20per%20Row.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change this number to your desired items per row
    let desiredItemsPerRow = 4;

    function setGridItemsPerRow(itemsPerRow) {
        let allGridRenderers = document.querySelectorAll("ytd-rich-grid-renderer");

        if (allGridRenderers.length > 0) {
            allGridRenderers.forEach(gridRenderer => {
                gridRenderer.style.setProperty("--ytd-rich-grid-items-per-row", itemsPerRow);
            });
            console.log(`Set grid items per row to: ${itemsPerRow} on ${allGridRenderers.length} element(s)`);
        } else {
            console.warn("Grid renderer not found, retrying...");
            setTimeout(() => setGridItemsPerRow(itemsPerRow), 1000);
        }
    }

    function checkGridItemsPerRowChanges(itemsPerRow) {
        let allGridRenderers = document.querySelectorAll("ytd-rich-grid-renderer");
        if (allGridRenderers.length > 0) {
            allGridRenderers.forEach(gridRenderer => {
                const current = window.getComputedStyle(gridRenderer).getPropertyValue("--ytd-rich-grid-items-per-row");
                if (parseInt(current) !== itemsPerRow) {
                    setGridItemsPerRow(itemsPerRow);
                }
            });
        } else {
            console.warn("Grid renderer not found, retrying...");
            setTimeout(() => checkGridItemsPerRowChanges(itemsPerRow), 1000);
        }
    }

    // Monitor changes every 500ms
    setInterval(() => checkGridItemsPerRowChanges(desiredItemsPerRow), 500);
})();