// ==UserScript==
// @name         Google Lens Exact Match Sorter
// @namespace    https://minoa.cat
// @version      3.0
// @description  Sorts Google Lens "Exact matches" results with a dropdown.
// @author       minoa.cat
// @match        https://www.google.com/search*udm=48*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545348/Google%20Lens%20Exact%20Match%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/545348/Google%20Lens%20Exact%20Match%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CORE SORTING LOGIC (Unchanged) ---

    function parseRelativeDate(dateString) {
        if (!dateString) return Infinity;
        const now = new Date();
        const parts = dateString.toLowerCase().split(' ');
        const value = parseInt(parts[0]);
        if (isNaN(value)) return Infinity;

        if (parts.some(p => p.startsWith('day'))) return value;
        if (parts.some(p => p.startsWith('week'))) return value * 7;
        if (parts.some(p => p.startsWith('month'))) return value * 30.44;
        if (parts.some(p => p.startsWith('year'))) return value * 365.25;
        return Infinity;
    }

    function parseSize(sizeString) {
        if (!sizeString) return -1;
        const parts = sizeString.toLowerCase().split('x');
        if (parts.length !== 2) return -1;
        const width = parseInt(parts[0]);
        const height = parseInt(parts[1]);
        if (isNaN(width) || isNaN(height)) return -1;
        return width * height;
    }

    function getResultData(resultElement) {
        let dateText = null;
        let sizeText = null;
        const infoContainer = resultElement.querySelector('.oYQBg.Zn52Me');
        if (infoContainer) {
            const infoSpans = infoContainer.querySelectorAll(':scope > span');
            infoSpans.forEach(span => {
                const text = span.innerText;
                if (text.includes('x') && !text.includes('ago')) {
                    sizeText = text;
                } else if (text.match(/ago|year|month|week|day/i)) {
                    dateText = text;
                }
            });
        }
        return { date: dateText, size: sizeText };
    }

    function sortResults(sortBy) {
        const resultsContainer = document.querySelector('#rso');
        if (!resultsContainer) return;

        const results = Array.from(resultsContainer.querySelectorAll('.ULSxyf'));

        if (!results[0].hasAttribute('data-original-order')) {
            results.forEach((result, index) => {
                result.setAttribute('data-original-order', index);
            });
        }

        results.sort((a, b) => {
            const dataA = getResultData(a);
            const dataB = getResultData(b);
            const dateA = parseRelativeDate(dataA.date);
            const dateB = parseRelativeDate(dataB.date);
            const sizeA = parseSize(dataA.size);
            const sizeB = parseSize(dataB.size);

            switch (sortBy) {
                case 'normal':
                    return parseInt(a.getAttribute('data-original-order')) - parseInt(b.getAttribute('data-original-order'));
                case 'date-newest': return dateA - dateB;
                case 'date-oldest': return dateB - dateA;
                case 'size-largest': return sizeB - sizeA;
                case 'size-smallest': return sizeA - sizeB;
                case 'newest-largest': return (dateA - dateB) || (sizeB - sizeA);
                case 'newest-smallest': return (dateA - dateB) || (sizeA - sizeB);
                case 'oldest-largest': return (dateB - dateA) || (sizeB - sizeA);
                case 'oldest-smallest': return (dateB - dateA) || (sizeA - sizeB);
                default: return 0;
            }
        });

        results.forEach(result => resultsContainer.appendChild(result));
    }

    // --- UI CREATION & STYLING (Completely Revamped) ---

    function createStyledDropdown() {
        if (document.getElementById('lensSorterContainer')) return; // Prevents creating duplicates

        const mainHeader = document.querySelector('[data-st-tgt="fb"]');
        if (!mainHeader) return;

        // Create a container bar for our dropdown
        const sortBarContainer = document.createElement('div');
        sortBarContainer.id = 'lensSorterContainer';
        Object.assign(sortBarContainer.style, {
            padding: '8px 16px', // Standard Google padding
            borderTop: '1px solid #3c4043', // Separator line
            borderBottom: '1px solid #3c4043'
        });

        const select = document.createElement('select');
        Object.assign(select.style, {
            backgroundColor: '#303134', // Dark theme background
            color: '#e8eaed', // Light theme text
            border: '1px solid #5f6368', // Subtle border
            borderRadius: '4px',
            padding: '6px 10px',
            fontFamily: 'inherit',
            fontSize: '14px',
            cursor: 'pointer'
        });

        const options = {
            'normal': 'Sort by: Default',
            'date-newest': 'Date (Newest First)',
            'date-oldest': 'Date (Oldest First)',
            'size-largest': 'Size (Largest First)',
            'size-smallest': 'Size (Smallest First)',
            'newest-largest': 'Newest & Largest',
            'newest-smallest': 'Newest & Smallest',
            'oldest-largest': 'Oldest & Largest',
            'oldest-smallest': 'Oldest & Smallest'
        };

        for (const [value, text] of Object.entries(options)) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
        }

        select.addEventListener('change', (event) => {
            sortResults(event.target.value);
        });

        sortBarContainer.appendChild(select);

        // Inject the entire bar after the main header
        mainHeader.appendChild(sortBarContainer);
    }

    // --- SCRIPT INITIALIZATION ---

    const observer = new MutationObserver((mutationsList, observer) => {
        if (document.querySelector('#rso') && document.querySelector('[data-st-tgt="fb"]')) {
            createStyledDropdown();
            // We keep observing in case of page navigation that redraws the DOM
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();