// ==UserScript==
// @name         VDP Top Title Match Link Generator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Convert content type keywords to SIM link while preserving IMDb links
// @author       BARNALI
// @match        https://crisp.amazon.com/details/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543133/VDP%20Top%20Title%20Match%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/543133/VDP%20Top%20Title%20Match%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processVDPMatches() {
        // Look for the specific span containing "VDP Top Title Match"
        const vdpSpans = document.querySelectorAll('th.a-span5');

        vdpSpans.forEach(span => {
            if (span.textContent.includes('VDP Top Title Match')) {
                // Find the adjacent td that contains the values
                const row = span.closest('tr');
                if (!row) return;

                const valueCell = row.querySelector('td.a-color-error');
                if (!valueCell || valueCell.dataset.processed) return;

                valueCell.dataset.processed = 'true';
                const text = valueCell.textContent;
                const words = text.split(/\s+/);
                const fragment = document.createDocumentFragment();

                words.forEach(word => {
                    if (['movie', 'tvminiseries', 'tvmovie', 'tvseries'].includes(word.toLowerCase())) {
                        const link = document.createElement('a');
                        link.href = 'https://t.corp.amazon.com/create/templates/d018645a-689b-4d44-8b9d-e940dcb71753';
                        link.textContent = word;
                        link.style.color = '#0066c0';
                        link.target = '_blank';
                        fragment.appendChild(link);
                        fragment.appendChild(document.createTextNode(' '));
                    } else if (/^tt\d+$/.test(word)) {
                        const imdbLink = document.createElement('a');
                        imdbLink.href = `https://pro.imdb.com/title/${word}`;
                        imdbLink.textContent = word;
                        imdbLink.style.color = '#0066c0';
                        imdbLink.target = '_blank';
                        fragment.appendChild(imdbLink);
                        fragment.appendChild(document.createTextNode(' '));
                    } else {
                        fragment.appendChild(document.createTextNode(word + ' '));
                    }
                });

                valueCell.textContent = '';
                valueCell.appendChild(fragment);
            }
        });
    }

    // Initial run with delay
    setTimeout(processVDPMatches, 2000);

    // Watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        setTimeout(processVDPMatches, 500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add refresh button
    const button = document.createElement('button');
    button.textContent = 'Refresh VDP Links';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.addEventListener('click', processVDPMatches);
    document.body.appendChild(button);
})();