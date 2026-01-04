// ==UserScript==
// @name         CPAE Banned Title SIM Link Generator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Convert 'Inform CPAE' text to SIM link while preserving IMDb links
// @author       Your name
// @match        https://crisp.amazon.com/details/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542789/CPAE%20Banned%20Title%20SIM%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/542789/CPAE%20Banned%20Title%20SIM%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and insert the link
    function createSIMLink() {
        // Find the CPAE Banned Title element
        const elements = document.querySelectorAll('tr');
        elements.forEach(row => {
            if (row.textContent.includes('PV CPAE Banned Title')) {
                // Get the cell containing the textext
                const cell = row.querySelector('td:last-child');
                if (cell) {
                    const originalText = cell.textContent;

                    // Clear the cell
                    cell.textContent = '';

                    // Split the text by spaces to process each word
                    const words = originalText.split(/\s+/);

                    words.forEach(word => {
                        if (word === 'Inform' && words[words.indexOf(word) + 1] === 'CPAE') {
                            // Create link for "Inform CPAE"
                            const link = document.createElement('a');
                            link.href = 'https://t.corp.amazon.com/create/templates/d018645a-689b-4d44-8b9d-e940dcb71753';
                            link.textContent = 'Inform CPAE';
                            link.style.color = '#0066c0';
                            link.target = '_blank';
                            cell.appendChild(link);
                            cell.appendChild(document.createTextNode(' ')); // Add space after link

                            // Skip the next word (CPAE) since we've already added it
                            words[words.indexOf(word) + 1] = '';
                        } else if (word.startsWith('tt') && /^tt\d+$/.test(word)) {
                            // Preserve existing IMDb links
                            const imdbLink = document.createElement('a');
                            imdbLink.href = `https://pro.imdb.com/title/${word}`;
                            imdbLink.textContent = word;
                            imdbLink.style.color = '#0066c0';
                            imdbLink.target = '_blank';
                            cell.appendChild(imdbLink);
                            cell.appendChild(document.createTextNode(' ')); // Add space after link
                        } else if (word) {
                            // Add regular text
                            cell.appendChild(document.createTextNode(word + ' '));
                        }
                    });
                }
            }
        });
    }

    // Wait for page to load completely
    window.addEventListener('load', function() {
        createSIMLink();
    });

    // For dynamic content loading
    const observer = new MutationObserver(function(mutations) {
        createSIMLink();
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
})();