// ==UserScript==
// @name         MPAA Rating Lookup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lookup MPAA ratings on filmratings.com
// @author       aakpooni
// @match        https://kdpow.amazon.com/work/vdp/baseline/*
// @match        https://crisp.amazon.com/details/*
// @match        https://kdpow.amazon.com/work/pv/baseline/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/542027/MPAA%20Rating%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/542027/MPAA%20Rating%20Lookup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if MPAA rating exists
    function hasMPAARating() {
        const ratingCell = document.querySelector('th.a-span5.aok-break-word');
        return ratingCell && ratingCell.textContent.toLowerCase().includes('mpaa');
    }

    // Function to get movie title
    function getMovieTitle() {
        const titleElement = document.querySelector('th.a-span3');
        if (titleElement && titleElement.textContent.includes('Title')) {
            const titleCell = titleElement.nextElementSibling;
            return titleCell ? titleCell.textContent.trim() : null;
        }
        return null;
    }

    // Function to create and insert lookup link
    function createLookupLink(title) {
        // Check if link already exists
        if (document.querySelector('.mpaa-lookup-link')) {
            return;
        }

        const encodedTitle = encodeURIComponent(title);
        const mpaaSearchUrl = `https://www.filmratings.com/search?filmTitle=${encodedTitle}`;

        const linkContainer = document.createElement('div');
        linkContainer.className = 'mpaa-lookup-link';
        linkContainer.style.margin = '10px 0';

        const link = document.createElement('a');
        link.href = mpaaSearchUrl;
        link.target = '_blank';
        link.textContent = 'Look up MPAA Rating';
        link.style.color = '#0066c0';
        link.style.textDecoration = 'underline';

        linkContainer.appendChild(link);

        // Insert after the rating section
        const ratingCell = document.querySelector('th.a-span5.aok-break-word');
        if (ratingCell && !ratingCell.nextElementSibling.querySelector('.mpaa-lookup-link')) {
            ratingCell.nextElementSibling.appendChild(linkContainer);
        }
    }

    // Main function
    function init() {
        if (hasMPAARating()) {
            const title = getMovieTitle();
            if (title) {
                createLookupLink(title);
            }
        }
    }

    // Wait for page to load
    setTimeout(init, 1000);

    // Disconnect previous observer if it exists
    if (window.mpaaObserver) {
        window.mpaaObserver.disconnect();
    }

    // Create new observer with debouncing
    let timeout;
    window.mpaaObserver = new MutationObserver(function(mutations) {
        clearTimeout(timeout);
        timeout = setTimeout(init, 500);
    });

    window.mpaaObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
