// ==UserScript==
// @name         Letterboxd Total Votes Count 
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Show total review votes just under the sidebar on Letterboxd film pages, indented for alignment
// @author       you
// @match        https://letterboxd.com/film/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/547657/Letterboxd%20Total%20Votes%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/547657/Letterboxd%20Total%20Votes%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Grab the page source
    const pageSource = document.documentElement.innerHTML;

    // Look for "ratingCount":xxxxx
    const match = pageSource.match(/"ratingCount":(\d+)/);
    if (!match) return;

    const ratingCount = parseInt(match[1], 10);

    // Find the sidebar container
    const sidebar = document.querySelector(".sidebar");

    if (sidebar) {
        // Create a container for the rating count
        const box = document.createElement("div");
        box.textContent = `Total Ratings: ${ratingCount.toLocaleString()}`;
        box.style.fontWeight = "bold";
        box.style.margin = "8px 0";
        box.style.padding = "6px 0";
        box.style.color = "#00ac3e"; // Letterboxd green
        box.style.marginLeft = "50ch"; // indent ~50 spaces to the right

        // Insert right after the .sidebar element
        sidebar.insertAdjacentElement("afterend", box);
    }
})();
