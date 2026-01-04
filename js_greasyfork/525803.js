// ==UserScript==
// @name         Hacker News Archive Link Replacer
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Replace links on Hacker News with archive.today links from a GitHub-hosted mapping and add an icon to the left of the title—if an archive exists, display a green checkbox; otherwise, display a magnifying glass. Both open in new tabs.
// @author       Your Name
// @match        https://news.ycombinator.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525803/Hacker%20News%20Archive%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/525803/Hacker%20News%20Archive%20Link%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of your GitHub-hosted JSON file mapping original links to archive links.
    const mappingUrl = 'https://raw.githubusercontent.com/nevillejohn/hn_archive_links/refs/heads/master/archive_mapping.json';

    // Use GM_xmlhttpRequest to fetch the JSON mapping (bypasses CSP restrictions)
    GM_xmlhttpRequest({
        method: "GET",
        url: mappingUrl,
        onload: function(response) {
            if (response.status !== 200) {
                console.error("Network response was not ok: " + response.statusText);
                return;
            }
            let mapping;
            try {
                mapping = JSON.parse(response.responseText);
            } catch (e) {
                console.error("Error parsing mapping JSON:", e);
                return;
            }
            processMapping(mapping);
        },
        onerror: function(err) {
            console.error("Error fetching mapping file:", err);
        }
    });

    // Process the mapping and add an icon at the beginning of each title.
    // If the URL is archived (exists in mapping), a green check mark is shown (replacing the magnifier).
    // Otherwise, a magnifying glass is shown.
    function processMapping(mapping) {
        // Find all title cells on Hacker News.
        const titleCells = document.querySelectorAll('td.title');
        titleCells.forEach(cell => {
            // Look for the titleline span.
            const titleLine = cell.querySelector('span.titleline');
            if (!titleLine) return;

            // Find the main article link within the titleline.
            const articleLink = titleLine.querySelector('a');
            if (!articleLink) return;

            const originalHref = articleLink.href;

            // Create a container for the icon.
            const iconContainer = document.createElement('span');
            iconContainer.style.marginRight = '5px';

            // Create the icon link.
            let iconLink;
            if (mapping.hasOwnProperty(originalHref)) {
                // Archive exists: create a green checkbox (check mark).
                iconLink = document.createElement('a');
                iconLink.href = mapping[originalHref];
                iconLink.target = "_blank"; // Open in new tab.
                iconLink.style.display = 'inline-block';
                iconLink.style.backgroundColor = '#4CAF50';
                iconLink.style.color = 'white';
                iconLink.style.padding = '2px 4px';
                iconLink.style.borderRadius = '3px';
                iconLink.style.textDecoration = 'none';
                iconLink.style.fontWeight = 'bold';
                iconLink.title = 'View archive';
                iconLink.textContent = '✔';
            } else {
                // No archive: create a magnifying glass.
                iconLink = document.createElement('a');
                iconLink.href = "https://archive.ph/" + encodeURIComponent(originalHref);
                iconLink.target = "_blank"; // Open in new tab.
                iconLink.style.display = 'inline-block';
                iconLink.style.backgroundColor = '#ccc';
                iconLink.style.color = 'black';
                iconLink.style.padding = '2px 4px';
                iconLink.style.borderRadius = '3px';
                iconLink.style.textDecoration = 'none';
                iconLink.style.fontWeight = 'bold';
                iconLink.title = 'Search archive';
                // Unicode for magnifying glass is U+1F50D.
                iconLink.textContent = '🔍';
            }
            iconContainer.appendChild(iconLink);

            // Insert the icon container at the beginning of the titleline.
            titleLine.insertBefore(iconContainer, titleLine.firstChild);
            console.log(`Processed ${originalHref}: ${mapping.hasOwnProperty(originalHref) ? "checkbox" : "magnifier"} added.`);
        });
    }
})();
