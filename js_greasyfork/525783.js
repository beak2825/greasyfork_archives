// ==UserScript==
// @name        Add Links back to IP2Always
// @namespace   Violentmonkey Scripts
// @match       https://communities.win/c/ip2always
// @match       https://communities.win/c/ip2always/active
// @match       https://communities.win/c/ip2always/new
// @match       https://communities.win/c/ip2always/rising
// @match       https://communities.win/c/ip2always/top
// @grant       none
// @version     1.0.2
// @license     MIT
// @author      Tammer
// @description Add old links back to IP2Always
// @downloadURL https://update.greasyfork.org/scripts/525783/Add%20Links%20back%20to%20IP2Always.user.js
// @updateURL https://update.greasyfork.org/scripts/525783/Add%20Links%20back%20to%20IP2Always.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addLinks() {
        // Find menu div
        let menuDiv = document.querySelector('.sc-1ifomfq-5.cKDyLg');

        if (!menuDiv) {
            console.log("Menu not found, retrying...");
            setTimeout(addLinks, 500); // Try again after 1 second
            return;
        }

        // Prevent duplicate injection
        if (document.getElementById('custom-links-container')) {
            return;
        }

        // Create a new div for links
        let linksContainer = document.createElement('div');
        linksContainer.id = 'custom-links-container';
        linksContainer.style.position = "absolute";
        linksContainer.style.marginTop = "-1.5pt";
        linksContainer.style.marginLeft = "200px";

        // Define links
        let links = [
            { text: "HOT", url: "https://communities.win/c/ip2always" },
            { text: "ACTIVE", url: "https://communities.win/c/ip2always/active" },
            { text: "NEW", url: "https://communities.win/c/ip2always/new" },
            { text: "RISING", url: "https://communities.win/c/ip2always/rising" },
            { text: "TOP", url: "https://communities.win/c/ip2always/top" }

        ];

        // Generate links and append links
        links.forEach(linkData => {
            let link = document.createElement('a');
            link.href = linkData.url;
            link.textContent = linkData.text;
            link.style.marginRight = "20px";
            link.style.fontSize = "17px"
            link.style.letterSpacing = "2pt"
            linksContainer.appendChild(link);
        });

        // Append links next to mew existing stupid dropdown menu
        menuDiv.appendChild(linksContainer);
    }

    // Run script when DOM is fully loaded
    window.addEventListener('load', addLinks);
})();
