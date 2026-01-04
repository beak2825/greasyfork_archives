// ==UserScript==
// @name         EroMe - Sort All Pages by Views
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a link to fetch albums from the next 25 pages, then sorts all of them by view count.
// @author       Your Gemini Assistant (based on original script by ChatGPT)
// @match        https://www.erome.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542871/EroMe%20-%20Sort%20All%20Pages%20by%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/542871/EroMe%20-%20Sort%20All%20Pages%20by%20Views.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Parses the view count text (e.g., "1.2K", "5M") into a number.
     * @param {string} text - The text content from the view count element.
     * @returns {number} The numerical representation of the view count.
     */
    function parseViews(text) {
        if (!text) return 0;
        // Clean the string, keep numbers and KM, and standardize decimal separator.
        let cleaned = text.replace(/[^0-9,.KM]/g, '').replace(',', '.');
        if (cleaned.includes('K')) return parseFloat(cleaned) * 1000;
        if (cleaned.includes('M')) return parseFloat(cleaned) * 1000000;
        return parseFloat(cleaned) || 0;
    }

    /**
     * Fetches albums from subsequent pages, combines them with current albums,
     * sorts them, and replaces the content on the page.
     * @param {HTMLElement} sortLink - The link element that was clicked.
     */
    async function fetchAndSortAllPages(sortLink) {
        const PAGES_TO_FETCH = 25;
        const container = document.querySelector('#albums');
        if (!container) return;

        // --- UI Update: Show initial loading state ---
        const originalLinkText = sortLink.textContent;
        sortLink.style.pointerEvents = 'none'; // Disable link to prevent multiple clicks
        sortLink.textContent = 'Starting...';

        try {
            // --- 1. Collect all albums from current and subsequent pages ---
            let allAlbums = Array.from(document.querySelectorAll('.album'));
            const baseUrl = location.href.split('?')[0]; // Get URL without query parameters

            for (let i = 1; i <= PAGES_TO_FETCH; i++) {
                const pageNum = i + 1; // Start fetching from page 2
                sortLink.textContent = `⏳ Loading page ${i}/${PAGES_TO_FETCH}...`;

                const response = await fetch(`${baseUrl}?page=${pageNum}`);
                if (!response.ok) {
                    console.warn(`Could not fetch page ${pageNum}. Status: ${response.status}`);
                    continue; // Skip this page on error
                }

                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const newAlbums = Array.from(doc.querySelectorAll('.album'));

                if (newAlbums.length === 0) {
                    console.log(`No more albums found on page ${pageNum}. Stopping fetch.`);
                    break; // Stop if we find an empty page
                }

                allAlbums.push(...newAlbums);
            }

            // --- 2. Sort all the collected albums by view count ---
            sortLink.textContent = '🔄 Sorting all albums...';

            const sortedAlbums = allAlbums.sort((a, b) => {
                const viewsA = parseViews(a.querySelector('.album-bottom-views')?.innerText);
                const viewsB = parseViews(b.querySelector('.album-bottom-views')?.innerText);
                return viewsB - viewsA; // Sort descending
            });

            // --- 3. Display the sorted albums ---
            // Use a DocumentFragment for better performance when adding many elements.
            const fragment = document.createDocumentFragment();
            sortedAlbums.forEach(album => fragment.appendChild(album));

            container.innerHTML = ''; // Clear the existing albums
            container.appendChild(fragment);

            console.log(`Sorting complete. Displaying ${sortedAlbums.length} albums.`);
            sortLink.textContent = '↩ Unsort (Reload)';
            sortLink.dataset.sorted = 'true'; // Mark state as sorted

        } catch (error) {
            console.error('An error occurred during the fetch/sort process:', error);
            sortLink.textContent = '❌ Error! Check console.';
            // Restore original link text after a few seconds
            setTimeout(() => {
                sortLink.textContent = originalLinkText;
            }, 5000);
        } finally {
            // Re-enable the link regardless of success or failure
            sortLink.style.pointerEvents = 'auto';
        }
    }

    /**
     * Creates and inserts the "Sort by Views" link onto the page.
     */
    function insertSortLink() {
        // Only run on pages that have a #page and #albums container
        const pageContainer = document.querySelector('#page');
        const albumsContainer = document.querySelector('#albums');
        if (!pageContainer || !albumsContainer || document.querySelector('#sortViewsLink')) {
            return;
        }

        const sortLink = document.createElement('a');
        sortLink.href = '#';
        sortLink.id = 'sortViewsLink';
        sortLink.textContent = '🔽 Sort by Views (All Pages)';

        // --- Styling for the link ---
        Object.assign(sortLink.style, {
            display: 'inline-block',
            margin: '20px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#e91e63',
            textDecoration: 'none',
            border: '1px solid #e91e63',
            padding: '8px 15px',
            borderRadius: '5px'
        });

        sortLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (sortLink.dataset.sorted === 'true') {
                location.reload(); // To "unsort", simply reload the page
            } else {
                fetchAndSortAllPages(sortLink);
            }
        });

        // Insert the link at the top of the main page container
        pageContainer.insertBefore(sortLink, pageContainer.firstChild);
    }

    /**
     * Waits for a specific element to be present in the DOM before executing a callback.
     * This is useful for pages that load content dynamically.
     */
    const waitForElement = (selector, callback, timeout = 10000) => {
        const start = Date.now();
        const check = () => {
            const el = document.querySelector(selector);
            if (el) {
                callback(el);
            } else if (Date.now() - start < timeout) {
                requestAnimationFrame(check);
            } else {
                console.log(`UserScript timed out waiting for selector: "${selector}"`);
            }
        };
        check();
    };

    // Wait for the #page container to exist, then run the script.
    waitForElement('#page', insertSortLink);

})();