// ==UserScript==
// @name         ESO-Hub Emote Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extract emote data from ESO-Hub collectibles page with a nice button
// @author       https://gasper.app
// @match        https://eso-hub.com/en/collectibles/category/emotes*
// @grant        none
// @license      CC BY 4.0
// @copyright    2024 https://gasper.app/ (https://gasper.app/)
// @downloadURL https://update.greasyfork.org/scripts/521409/ESO-Hub%20Emote%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/521409/ESO-Hub%20Emote%20Extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastScrollHeight = 0;
    let collectedData = [];

    // Function to extract data from <tr> tags
    function extractData() {
        const rows = document.querySelectorAll('tr[data-v-36c6cb50]');
        rows.forEach(row => {
            const imgTag = row.querySelector('img[data-v-36c6cb50]');
            const nameAnchor = row.querySelector('td[data-label="Name"] a');
            const descriptionDiv = row.querySelector('td[data-label="Description"] div');

            if (imgTag && nameAnchor && descriptionDiv) {
                const imgSrc = imgTag.getAttribute('src');
                const name = nameAnchor.textContent.trim();
                const description = descriptionDiv.textContent.trim();
                const url = nameAnchor.getAttribute('href');

                collectedData.push({
                    name,
                    description,
                    url: url.startsWith('http') ? url : `https://eso-hub.com${url}`,
                    imgSrc: imgSrc.startsWith('http') ? imgSrc : `https://eso-hub.com${imgSrc}`
                });
            }
        });
    }

    // Function to scroll and extract data
    function scrollAndExtract() {
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(() => {
            // Check if new content has loaded
            if (document.body.scrollHeight > lastScrollHeight) {
                lastScrollHeight = document.body.scrollHeight;
                extractData();
                scrollAndExtract();
            } else {
                // When no more content loads, output the collected data
                console.log('Collected Data:', JSON.stringify(collectedData, null, 2));
                alert('Data extraction complete! Check the console for results.');
            }
        }, 2000); // Adjust timeout as necessary for content loading
    }

    // Function to create the stylish button
    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Extract Emotes';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#0056b3';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#007BFF';
        });

        // Add click event to start extraction
        button.addEventListener('click', () => {
            alert('Starting data extraction...');
            scrollAndExtract();
        });

        document.body.appendChild(button);
    }

    // Add the button to the page
    createButton();
})();
