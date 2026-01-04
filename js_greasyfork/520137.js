// ==UserScript==
// @name         Douban Book Auto Sort 
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Free Trial: Automatically sorts books on the current Douban book search page
// @author       ang
// @match        https://search.douban.com/book/subject_search*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520137/Douban%20Book%20Auto%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/520137/Douban%20Book%20Auto%20Sort.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Free Trial Notice
    const trialNotice = document.createElement('div');
    trialNotice.innerText = '✨ This script is a free trial version ✨';
    trialNotice.style.position = 'fixed';
    trialNotice.style.top = '10px';
    trialNotice.style.right = '10px';
    trialNotice.style.background = 'rgba(255, 215, 0, 0.9)';
    trialNotice.style.color = '#000';
    trialNotice.style.padding = '10px 20px';
    trialNotice.style.borderRadius = '5px';
    trialNotice.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    trialNotice.style.zIndex = '10000';
    document.body.appendChild(trialNotice);

    // Configuration parameters
    const M = 50;
    const alpha = 1.3;

    /**
     * Calculate weighted score
     * @param {number} rating Rating
     * @param {number} reviews Number of reviews
     * @param {number} avgRating Average rating
     * @returns {number} Weighted score
     */
    function calculateWeightedScore(rating, reviews, avgRating) {
        if (reviews === 0) return 0;
        return ((Math.pow(rating, alpha) * reviews) + (M * avgRating)) / (reviews + M) * Math.log(reviews + 1);
    }

    /**
     * Get book elements and extract information
     * @returns {Array} Array of books
     */
    function getBooks() {
        const books = [];
        const bookElements = document.querySelectorAll('.item-root'); // Adjust according to actual class name
        bookElements.forEach(el => {
            const title = el.querySelector('.title-text')?.innerText.trim() || 'Unknown Title';
            const rating = parseFloat(el.querySelector('.rating_nums')?.innerText.trim()) || 0;
            const reviewsText = el.querySelector('.rating .pl')?.innerText || '0';
            const reviews = parseInt(reviewsText.match(/(\d+)/)?.[1]) || 0;
            books.push({ element: el, title, rating, reviews });
        });
        return books;
    }

    /**
     * Sort and rearrange book elements
     * @param {Array} books Array of books
     */
    function sortAndDisplayBooks(books) {
        const filtered = books.filter(book => book.reviews >= M);
        const avgRating = filtered.reduce((sum, book) => sum + book.rating, 0) / (filtered.length || 1);
        books.forEach(book => {
            book.weighted_score = calculateWeightedScore(book.rating, book.reviews, avgRating);
        });
        books.sort((a, b) => b.weighted_score - a.weighted_score);

        const container = document.querySelector('#wrapper'); // Adjust according to actual container
        if (container) {
            books.forEach(book => container.appendChild(book.element));
        }
    }

    // Display loading prompt
    const loading = document.createElement('div');
    loading.innerText = 'Sorting books, please wait...';
    loading.style.position = 'fixed';
    loading.style.top = '50%';
    loading.style.left = '50%';
    loading.style.transform = 'translate(-50%, -50%)';
    loading.style.background = 'rgba(0,0,0,0.8)';
    loading.style.color = '#fff';
    loading.style.padding = '20px';
    loading.style.borderRadius = '8px';
    loading.style.zIndex = '10000';
    document.body.appendChild(loading);

    // Execute sorting
    setTimeout(() => {
        const books = getBooks();
        sortAndDisplayBooks(books);
        document.body.removeChild(loading);
        // Optionally remove the trial notice after sorting
        // document.body.removeChild(trialNotice);
    }, 1000); // Wait for page load
})();
