// ==UserScript==
// @name         CPAE Banned Title SIM Link Generator
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Convert 'Inform CPAE' text to SIM link while preserving IMDb links
// @author       BARNALI
// @match        https://crisp.amazon.com/details/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543936/CPAE%20Banned%20Title%20SIM%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/543936/CPAE%20Banned%20Title%20SIM%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createSIMLink() {
        const elements = document.querySelectorAll('tr');
        elements.forEach(row => {
            if (row.dataset.processed) return;

            if (row.textContent.includes('PV CPAE Banned Title')) {
                const cell = row.querySelector('td:last-child');
                if (!cell) return;

                row.dataset.processed = 'true';
                const originalText = cell.innerHTML;

                // Replace all instances of "Inform CPAE" with the link
                const newText = originalText.replace(/Inform CPAE/g,
                    '<a href="https://t.corp.amazon.com/create/templates/d018645a-689b-4d44-8b9d-e940dcb71753" style="color: #0066c0" target="_blank">Inform CPAE</a>'
                );

                // Update the cell content
                cell.innerHTML = newText;

                // Handle IMDb links if present
                const text = cell.textContent;
                const imdbMatches = text.match(/\btt\d+\b/g);
                if (imdbMatches) {
                    imdbMatches.forEach(ttNumber => {
                        const regex = new RegExp(ttNumber, 'g');
                        cell.innerHTML = cell.innerHTML.replace(regex,
                            `<a href="https://pro.imdb.com/title/${ttNumber}" style="color: #0066c0" target="_blank">${ttNumber}</a>`
                        );
                    });
                }
            }
        });
    }

    // Initial run
    createSIMLink();

    // Observer for dynamic content
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(createSIMLink, 500);
    });

    // Observe the page for changes
    const targetNode = document.querySelector('#main-content') || document.body;
    observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();