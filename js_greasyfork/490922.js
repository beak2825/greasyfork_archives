// ==UserScript==
// @name         Markdown Table Of Contents
// @version      1.1
// @author       Rust1667
// @description  Creates a table of contents for some markdown-based websites
// @match        https://rentry.co/*
// @match        https://rentry.org/*
// @match        https://*.reddit.com/r/*/wiki/*
// @match        https://*.github.io/*
// @match        https://saidit.net/s/*/wiki/*
// @match        https://wiki.dbzer0.com/*
// @match        https://*/*.html
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/490922/Markdown%20Table%20Of%20Contents.user.js
// @updateURL https://update.greasyfork.org/scripts/490922/Markdown%20Table%20Of%20Contents.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentPageUrl = window.location.href;
    let indexContainer = null;

    function createIndex() {
        let subheaderSelector = 'h2[id], h3[id], h4[id], h5[id], h6[id]';

        // Check if there is more than one h1 subheader
        if (document.querySelectorAll('h1[id]').length > 1) {
            subheaderSelector = 'h1[id], ' + subheaderSelector;
        }

        const subheaders = document.querySelectorAll(subheaderSelector);
        if (subheaders.length === 0) {
            removeIndex();
            return;
        }

        // Determine the highest subheader tier
        let highestTier = 7; // Set to 7 to ensure padding is always greater
        subheaders.forEach(subheader => {
            const level = parseInt(subheader.tagName[1]);
            if (level < highestTier) {
                highestTier = level;
            }
        });

        // Remove existing index container if it exists
        if (indexContainer) {
            indexContainer.remove();
        }

        indexContainer = document.createElement('div');
        indexContainer.style.position = 'fixed';
        indexContainer.style.top = '50%';
        indexContainer.style.right = '0';
        indexContainer.style.transform = 'translateY(-50%)'; // Adjust to center vertically
        indexContainer.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('background-color');
        indexContainer.style.border = '1px solid #ced4da';
        indexContainer.style.padding = '0'; // Remove padding
        indexContainer.style.zIndex = '9999';
        indexContainer.style.maxHeight = '80vh';
        indexContainer.style.overflowY = 'auto';
        indexContainer.style.maxWidth = '200px'; // Limit maximum width

        const indexList = document.createElement('ul');
        indexList.style.margin = '0'; // Remove margin
        indexList.style.padding = '0'; // Remove padding
        indexList.style.listStyleType = 'none'; // Remove bullet points

        subheaders.forEach(subheader => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            let textContent = subheader.textContent.trim();
            // Trim long titles
            if (textContent.length > 20) {
                textContent = textContent.substring(0, 20) + '...';
            }
            link.textContent = textContent;
            link.href = '#' + subheader.id;
            link.style.whiteSpace = 'nowrap'; // Prevent line breaks
            link.style.overflow = 'hidden'; // Hide overflowing text
            link.style.textOverflow = 'ellipsis'; // Add ellipsis for overflow
            const level = parseInt(subheader.tagName[1]);
            listItem.style.paddingLeft = (level - highestTier) * 2 + 'em'; // Adjust padding based on the difference from the highest tier
            indexList.appendChild(listItem);
            listItem.appendChild(link);
        });

        indexContainer.appendChild(indexList);
        document.body.appendChild(indexContainer);
    }

    function removeIndex() {
        if (indexContainer) {
            indexContainer.remove();
            indexContainer = null;
        }
    }

    function checkUrlChange() {
        const newUrl = window.location.href;
        if (newUrl !== currentPageUrl) {
            currentPageUrl = newUrl;
            createIndex();
        } else if (!document.querySelector('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')) {
            // Page URL hasn't changed, but no subheaders found
            removeIndex();
        }
    }

    // Check if the page has subheaders that can be linked to with a URL
    const hasSubheaders = document.querySelector('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    if (hasSubheaders) {
        createIndex();
        // Uncommenting the interval check
        setInterval(checkUrlChange, 1000); // Check for URL change every second
    }
})();
