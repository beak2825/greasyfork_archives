// ==UserScript==
// @name         Brave Infinite Scroll
// @description  Enables infinite scroll on Brave Search
// @match        *://search.brave.com/search*
// @run-at       document-end
// @version 0.0.1.20250309090434
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/529272/Brave%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/529272/Brave%20Infinite%20Scroll.meta.js
// ==/UserScript==

let pageNumber = 1;
let isLoading = false;
let hasMore = true;

const fetchNextPage = async () => {
    const baseUrl = new URL(window.location.href);
    baseUrl.searchParams.set('offset', pageNumber);
    
    try {
        const response = await fetch(baseUrl.toString());
        const text = await response.text();
        const newDoc = new DOMParser().parseFromString(text, 'text/html');

        // Create container for new results
        const container = document.createElement('div');
        container.id = `page-${pageNumber}`;
        container.style.marginTop = '20px';

        // Add new results (adjust selector based on Brave's structure)
        newDoc.querySelectorAll('#results > .snippet').forEach(result => {
            container.appendChild(result.cloneNode(true));
        });

        // Find insertion point (before pagination element)
        const insertionPoint = document.querySelector('#pagination-snippet') || 
                             document.querySelector('#results').lastElementChild;

        if (insertionPoint) {
            insertionPoint.before(container);
        }

        // Check for more pages (look for Next button)
        hasMore = !!newDoc.querySelector('a[href*="offset="]:not([disabled])');
        if (hasMore) pageNumber++;
    } catch (error) {
        console.error('Error fetching next page:', error);
        hasMore = false;
    }
};

window.addEventListener('scroll', async () => {
    const scrollThreshold = 1000;
    const scrollPosition = window.innerHeight + window.scrollY;
    const scrollMax = document.documentElement.scrollHeight - scrollThreshold;

    if (!isLoading && hasMore && scrollPosition >= scrollMax) {
        isLoading = true;
        await fetchNextPage();
        isLoading = false;
    }
});