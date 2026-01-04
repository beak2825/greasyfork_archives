// ==UserScript==
// @name         CPAE Banned Title SIM Link Generator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Convert 'Inform CPAE' text to SIM link while preserving IMDb links
// @author          Your name
// @match        https://crisp.amazon.com/details/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542792/CPAE%20Banned%20Title%20SIM%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/542792/CPAE%20Banned%20Title%20SIM%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createSIMLink() {
        // Find the CPAE Banned Title element
        const elements = document.querySelectorAll('tr');
        elements.forEach(row => {
            // Skip if already processed
            if (row.dataset.processed) return;

            if (row.textContent.includes('PV CPAE Banned Title')) {
                const cell = row.querySelector('td:last-child');
                if (!cell) return;

                // Mark as processed to avoid reprocessing
                row.dataset.processed = 'true';

                const originalText = cell.textContent;
                cell.textContent = '';

                const words = originalText.split(/\s+/);

                words.forEach(word => {
                    if (word === 'Inform' && words[words.indexOf(word) + 1] === 'CPAE') {
                        const link = document.createElement('a');
                        link.href = 'https://t.corp.amazon.com/create/templates/d018645a-689b-4d44-8b9d-e940dcb71753';
                        link.textContent = 'Inform CPAE';
                        link.style.color = '#0066c0';
                        link.target = '_blank';
                        cell.appendChild(link);
                        cell.appendChild(document.createTextNode(' '));
                        words[words.indexOf(word) + 1] = '';
                       } else if (word.startsWith('tt') && /^tt\d+$/.test(word)) {
                        const imdbLink = document.createElement('a');
                        imdbLink.href = `https://pro.imdb.com/title/${word}`;
                        imdbLink.textContent = word;
                        imdbLink.style.color = '#0066c0';
                        imdbLink.target = '_blank';
                        cell.appendChild(imdbLink);
                        cell.appendChild(document.createTextNode(' '));
                    } else if (word) {
                        cell.appendChild(document.createTextNode(word + ' '));
                    }
                });
            }
        });
    }

    // Initial run after DOM content is loaded
    document.addEventListener('DOMContentLoaded', createSIMLink);

    // Debounced observer for dynamic content
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(createSIMLink, 500);
    });

    // Observe only specific parts of the page that actually change
    const targetNode = document.querySelector('#main-content') || document.body;
    observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();
