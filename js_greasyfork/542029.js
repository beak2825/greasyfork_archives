// ==UserScript==
// @name         BBFC Rating Lookup for Series
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lookup BBFC ratings on bbfc.co.uk for Series/Episodes
// @author       aakpooni
// @match        https://kdpow.amazon.com/work/vdp/baseline/*
// @match        https://crisp.amazon.com/details/*
// @match        https://kdpow.amazon.com/work/pv/baseline/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/542029/BBFC%20Rating%20Lookup%20for%20Series.user.js
// @updateURL https://update.greasyfork.org/scripts/542029/BBFC%20Rating%20Lookup%20for%20Series.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if review type is episode
    function isEpisodeReview() {
        const reviewTypeHeader = Array.from(document.getElementsByTagName('th'))
            .find(th => th.textContent === 'Review Type');
        if (reviewTypeHeader) {
            const reviewTypeData = reviewTypeHeader.nextElementSibling;
            return reviewTypeData && reviewTypeData.textContent.trim().toLowerCase() === 'episode';
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

    // Updated function to get series title based on the specific HTML structure
    function getSeriesTitle() {
        const parentCell = document.querySelector('td.a-color-secondary.a-text-center.a-text-bold[colspan="2"]');
        if (parentCell && parentCell.textContent.trim() === 'Parent') {
            // Get the next row which should contain the series name
            const nextRow = parentCell.closest('tr').nextElementSibling;
            if (nextRow) {
                const seriesNameLink = nextRow.querySelector('a');
                return seriesNameLink ? seriesNameLink.textContent.trim() : null;
            }
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
        link.textContent = 'Look up Series BBFC Rating';
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
        // Only proceed if it's an episode review and has BBFC rating
        if (isEpisodeReview() && hasBBFCRating()) {
            const seriesTitle = getSeriesTitle();
            if (seriesTitle) {
                createLookupLink(seriesTitle);
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
