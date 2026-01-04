// ==UserScript==
// @name         Open NewAtlas Links in New Tab (Auto Refresh)
// @namespace    http://www.example.com
// @version      1.0
// @description  Opens all links on NewAtlas in a new tab and refreshes the page every 2 seconds
// @author       Your Name
// @match        https://newatlas.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467155/Open%20NewAtlas%20Links%20in%20New%20Tab%20%28Auto%20Refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467155/Open%20NewAtlas%20Links%20in%20New%20Tab%20%28Auto%20Refresh%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add target="_blank" to the links
    function openLinksInNewTab() {
        // Get all the anchor tags on the page
        var links = document.querySelectorAll('a');

        // Loop through each anchor tag
        for (var i = 0; i < links.length; i++) {
            // Add target="_blank" to open the link in a new tab
            links[i].setAttribute('target', '_blank');
        }
    }

    // Execute the function initially
    openLinksInNewTab();

    // Execute the function every 2 seconds
    setInterval(openLinksInNewTab, 2000);
})();
