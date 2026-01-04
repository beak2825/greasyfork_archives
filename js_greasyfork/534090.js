// ==UserScript==
// @name         Microsoft Download URL Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Retrieve URLs starting with https://download.microsoft.com/ from the page source.
// @author       CreeperKong
// @match        *://www.microsoft.com/*/download/details.aspx*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/534090/Microsoft%20Download%20URL%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/534090/Microsoft%20Download%20URL%20Extractor.meta.js
// ==/UserScript==

/*
    Github: https://github.com/CreeperKong/msdl
*/

(function() {
    'use strict';

    // Function to extract URLs from the page source
    function extractDownloadURLs() {
        // Get the entire HTML source of the page
        const pageSource = document.documentElement.outerHTML;

        // Regular expression to match URLs starting with https://download.microsoft.com/
        const urlRegex = /https:\/\/download\.microsoft\.com\/[^\s"'<>]+/g;

        // Find all matching URLs
        const matches = pageSource.match(urlRegex);

        if (matches && matches.length > 0) {
            // Remove duplicate URLs
            const uniqueURLs = [...new Set(matches)];

            // Log URLs to the console
            console.log('Found Microsoft Download URLs:', uniqueURLs);

            // Display URLs on the page
            displayURLs(uniqueURLs);
        } else {
            console.log('No Microsoft Download URLs found on this page.');
        }
    }

    // Function to display URLs in a floating box on the page
    function displayURLs(urls) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = '#f1f1f1';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.zIndex = '9999';
        container.style.maxHeight = '300px';
        container.style.overflowY = 'auto';
        container.style.fontSize = '12px';

        const title = document.createElement('h4');
        title.innerText = 'Microsoft Download URLs';
        title.style.margin = '0 0 10px 0';
        container.appendChild(title);

        const list = document.createElement('ul');
        urls.forEach(url => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = url;
            link.innerText = url;
            link.target = '_blank';
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
        container.appendChild(list);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.onclick = () => container.remove();
        container.appendChild(closeButton);

        document.body.appendChild(container);
    }

    // Run the extraction after the page fully loads
    window.addEventListener('load', extractDownloadURLs);
})();
