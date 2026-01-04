// ==UserScript==
// @name         Open Video Links in New Tabs
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Open each video page link in a new tab
// @author       955whynot
// @match        https://www.bloomsburyvideolibrary.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515038/Open%20Video%20Links%20in%20New%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/515038/Open%20Video%20Links%20in%20New%20Tabs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait until the page fully loads
    window.addEventListener('load', () => {
        // Update this selector to match the links to each video's page
        const videoLinkSelector = 'a.search-title';

        // Function to open a single link with a delay
        function openLink(url) {
            const newTab = window.open(url, '_blank');
            if (newTab) {
                newTab.focus(); // Focus on the new tab
                console.log(`Opened: ${url}`); // Log the opened URL
            } else {
                console.log(`Failed to open: ${url}`);
            }
        }

        // Function to open all video links in new tabs
        async function openVideoLinks() {
            const links = document.querySelectorAll(videoLinkSelector);
            console.log(`Found ${links.length} links.`); // Log the number of links found

            if (links.length === 0) {
                alert('No video links found on this page.');
                return;
            }

            // Confirm to open all links
            if (confirm(`Open ${links.length} video links in new tabs?`)) {
                const urls = Array.from(links).map(link => {
                    return 'https://www.bloomsburyvideolibrary.com' + link.getAttribute('href');
                });

                // Open each link with a slight delay
                for (let i = 0; i < urls.length; i++) {
                    openLink(urls[i]);

                };
            }
        }

        // Add a button to manually trigger the script on the page
        const button = document.createElement('button');
        button.innerText = 'Open All Video Links';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'lightgreen';
        button.style.border = 'none';
        button.style.cursor = 'pointer';

        // When the button is clicked, run the openVideoLinks function
        button.addEventListener('click', openVideoLinks);

        // Append the button to the body of the webpage
        document.body.appendChild(button);
    });
})();