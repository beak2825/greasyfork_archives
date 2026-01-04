// ==UserScript==
// @name         BBFC Rating Lookup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lookup BBFC ratings on bbfc.co.uk for Standalone reviews
// @author       aakpooni
// @match        https://kdpow.amazon.com/work/vdp/baseline/*
// @match        https://crisp.amazon.com/details/*
// @match        https://kdpow.amazon.com/work/pv/baseline/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/542028/BBFC%20Rating%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/542028/BBFC%20Rating%20Lookup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if review type is standalone
    function isStandaloneReview() {
        const reviewTypeHeader = Array.from(document.getElementsByTagName('th'))
            .find(th => th.textContent === 'Review Type');
        if (reviewTypeHeader) {
            const reviewTypeData = reviewTypeHeader.nextElementSibling;
            return reviewTypeData && reviewTypeData.textContent.trim().toLowerCase() === 'standalone';
        }
        return false;
    }

    // Function to check if BBFC rating exists
    function hasBBFCRating() {
        const ratingHeaders = document.getElementsByTagName('th');
        for (let header of ratingHeaders) {
            if (header.textContent.toLowerCase().includes('bbfc')) {
                return true;
            }
        }
        return false;
    }

    // Function to get movie title
    function getMovieTitle() {
        const titleHeader = Array.from(document.getElementsByTagName('th'))
            .find(th => th.textContent === 'Title');
        if (titleHeader) {
            const titleData = titleHeader.nextElementSibling;
            return titleData ? titleData.textContent.trim() : null;
        }
        return null;
    }

    // Function to create and insert lookup link
    function createLookupLink(title) {
        // Check if link already exists
        if (document.querySelector('.bbfc-lookup-link')) {
            return;
        }

        const encodedTitle = encodeURIComponent(title);
        const bbfcSearchUrl = `https://www.bbfc.co.uk/search?q=${encodedTitle}`;

        const linkContainer = document.createElement('div');
        linkContainer.className = 'bbfc-lookup-link';
        linkContainer.style.margin = '10px 0';

        const link = document.createElement('a');
        link.href = bbfcSearchUrl;
        link.target = '_blank';
        link.textContent = 'Look up BBFC Rating';
        link.style.color = '#0066c0';
        link.style.textDecoration = 'underline';

        linkContainer.appendChild(link);

        // Find the BBFC rating cell and insert the link after it
        const ratingHeaders = document.getElementsByTagName('th');
        for (let header of ratingHeaders) {
            if (header.textContent.toLowerCase().includes('bbfc')) {
                const ratingCell = header.nextElementSibling;
                if (ratingCell && !ratingCell.querySelector('.bbfc-lookup-link')) {
                    ratingCell.appendChild(linkContainer);
                }
                break;
            }
        }
    }

    // Main function
    function init() {
        // Only proceed if it's a standalone review and has BBFC rating
        if (isStandaloneReview() && hasBBFCRating()) {
            const title = getMovieTitle();
            if (title) {
                createLookupLink(title);
            }
        }
    }

    // Initial delay to ensure page is loaded
    setTimeout(init, 1000);

    // Disconnect previous observer if it exists
    if (window.bbfcObserver) {
        window.bbfcObserver.disconnect();
    }

    // Create new observer with debouncing
    let timeout;
    window.bbfcObserver = new MutationObserver(function(mutations) {
        clearTimeout(timeout);
        timeout = setTimeout(init, 500);
    });

    // Start observing
    window.bbfcObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
