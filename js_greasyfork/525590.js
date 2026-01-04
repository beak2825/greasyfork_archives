// ==UserScript==
// @name         DOI to Sci-Hub
// @namespace    DOIToSciHub
// @version      1.3
// @description  Redirects DOI links and converts plain text DOIs to Sci-Hub
// @match        *://*/*
// @license      AGPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525590/DOI%20to%20Sci-Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/525590/DOI%20to%20Sci-Hub.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const SCIHUB_URL = 'https://www.tesble.com/';
    // Updated regex to better handle complex DOIs
    const DOI_REGEX = /\b(10\.\d{4,}\/[a-zA-Z0-9./-]+)\b/g;
    const DOI_ORG_URL = 'https://doi.org/';

    const convertDOI = doi => {
        // Clean up the DOI by removing any trailing periods or special characters
        const cleanDOI = doi.replace(/[.,;:]$/, '');
        return `${SCIHUB_URL}${cleanDOI.startsWith('http') ? cleanDOI : DOI_ORG_URL + cleanDOI}`;
    };

    const processLinks = () => {
        const doiSelectors = [
            'a[href^="http://dx.doi.org/"]',
            'a[href^="https://dx.doi.org/"]',
            'a[href^="http://doi.org/"]',
            'a[href^="https://doi.org/"]'
        ].join(',');

        document.querySelectorAll(doiSelectors).forEach(link => {
            if (!link.dataset.scihub) {
                link.dataset.scihub = 'true';
                link.addEventListener('click', e => {
                    e.preventDefault();
                    window.location.href = convertDOI(link.href);
                });
            }
        });
    };

    const processText = () => {
        const walk = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToProcess = [];
        while (walk.nextNode()) {
            if (DOI_REGEX.test(walk.currentNode.textContent)) {
                nodesToProcess.push(walk.currentNode);
            }
        }

        nodesToProcess.forEach(node => {
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            const text = node.textContent;
            DOI_REGEX.lastIndex = 0;

            let match;
            while ((match = DOI_REGEX.exec(text)) !== null) {
                // Add text before the match
                if (match.index > lastIndex) {
                    fragment.appendChild(
                        document.createTextNode(text.substring(lastIndex, match.index))
                    );
                }

                const link = document.createElement('a');
                link.href = DOI_ORG_URL + match[1];
                link.textContent = match[1];
                link.style.color = '#1a0dab';
                link.dataset.scihub = 'true';
                link.addEventListener('click', e => {
                    e.preventDefault();
                    window.location.href = convertDOI(link.href);
                });
                fragment.appendChild(link);

                lastIndex = match.index + match[0].length;
            }

            // Add remaining text
            if (lastIndex < text.length) {
                fragment.appendChild(
                    document.createTextNode(text.substring(lastIndex))
                );
            }

            node.replaceWith(fragment);
        });
    };

    // Create a debounced version of the processing functions
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const debouncedProcess = debounce(() => {
        processLinks();
        processText();
    }, 250);

    // Set up the observer with debounced processing
    const observer = new MutationObserver(debouncedProcess);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial processing
    processLinks();
    processText();
})();