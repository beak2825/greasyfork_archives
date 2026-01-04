// ==UserScript==
// @name         ANTfinity Scrolling
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows for infinite scroll when in torrents page
// @author       EnigmaticBacon
// @match        https://anthelion.me/torrents.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489012/ANTfinity%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/489012/ANTfinity%20Scrolling.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Turns off the userscript for individual torrent pages
    function getQueryParams(url) {
        const queryParams = {};
        const urlSearchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlSearchParams.entries()) {
            queryParams[key] = value;
        }
        return queryParams;
    }
    const queryParams = getQueryParams(window.location.href);
    if ('id' in queryParams) {
        console.log('URL with "id" parameter detected, skipping script.');
        return;
    }

    let isLoading = false;
    let currentPage = 1;
    let lastFetchTime = 0; // Track the time of the last fetch
    let fetchEnabled = true; // Flag to enable/disable fetching based on content availability

    // Create a loading signifier
    const loadingSignifier = document.createElement('div');
    loadingSignifier.style.position = 'fixed';
    loadingSignifier.style.left = '50%';
    loadingSignifier.style.bottom = '20px';
    loadingSignifier.style.transform = 'translateX(-50%)';
    loadingSignifier.style.padding = '10px';
    loadingSignifier.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingSignifier.style.color = 'white';
    loadingSignifier.style.borderRadius = '5px';
    loadingSignifier.style.display = 'none'; // Initially hidden
    loadingSignifier.innerText = 'Loading...';
    document.body.appendChild(loadingSignifier);

    function showLoadingSignifier() {
        loadingSignifier.style.display = 'block';
    }

    function hideLoadingSignifier() {
        loadingSignifier.style.display = 'none';
    }

    // Initialize currentPage based on URL
    const parseCurrentPage = () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        return page ? parseInt(page, 10) : 1;
    };

    currentPage = parseCurrentPage();

    window.addEventListener('scroll', () => {
        const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 500;
        const now = Date.now(); // Get the current time

        if (nearBottom && !isLoading && fetchEnabled && (now - lastFetchTime >= 1000)) {
            showLoadingSignifier();
            isLoading = true;
            currentPage += 1;
            fetchMorePosters(currentPage);
            lastFetchTime = now; // Update the time of the last fetch
        }
    });

    function fetchMorePosters(page) {
        const params = new URLSearchParams(window.location.search);
        params.delete('page'); // Remove the existing 'page' parameter
        params.set('page', page); // Set the 'page' parameter to the new page number

        const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        const fetchUrl = `${baseUrl}?${params.toString()}`;

        fetch(fetchUrl)
            .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Network response was not ok.');
        })
            .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const fetchedTorrentTableContents = doc.querySelector('.box.torrent_table.cats.grouping.gallery-toggle#torrent_table tbody');

            if (fetchedTorrentTableContents && fetchedTorrentTableContents.children.length > 0) {
                const currentTorrentTable = document.querySelector('.box.torrent_table.cats.grouping.gallery-toggle#torrent_table tbody');

                if (fetchedTorrentTableContents && currentTorrentTable) {
                    const firstTr = fetchedTorrentTableContents.querySelector('tr');
                    if (firstTr) {
                        fetchedTorrentTableContents.removeChild(firstTr);
                    }

                    Array.from(fetchedTorrentTableContents.children).forEach(child => {
                        currentTorrentTable.appendChild(child.cloneNode(true));
                    });
                }
            } else {
                // If fetched content is empty, disable further fetching
                fetchEnabled = false;
            }

            const fetchedHiddenElement = doc.querySelector('.hidden.gallery-toggle #ant-userscript-gallery-container');
            const currentHiddenContainer = document.querySelector('.hidden.gallery-toggle #ant-userscript-gallery-container');
            if (fetchedHiddenElement && currentHiddenContainer) {
                currentHiddenContainer.innerHTML += fetchedHiddenElement.innerHTML;
            }
            hideLoadingSignifier();
            isLoading = false;
        })
            .catch(error => {
            console.error('Error loading more posters:', error);
            isLoading = false;
        });
    }

    // Create the Scroll to Top Button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '&#x2191;'; // Upward arrow symbol
    document.body.appendChild(scrollToTopButton);

    // Style the Scroll to Top Button
    scrollToTopButton.style.position = 'fixed';
    scrollToTopButton.style.bottom = '20px';
    scrollToTopButton.style.right = '20px';
    scrollToTopButton.style.padding = '10px 15px';
    scrollToTopButton.style.fontSize = '20px';
    scrollToTopButton.style.zIndex = '1000';
    scrollToTopButton.style.cursor = 'pointer';
    scrollToTopButton.style.borderRadius = '5px';
    scrollToTopButton.style.border = 'none';
    scrollToTopButton.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    scrollToTopButton.style.color = 'white';
    scrollToTopButton.style.opacity = 0.2;
    scrollToTopButton.style.transition = 'opacity 0.3s';


    scrollToTopButton.addEventListener('mouseenter', () => {
        scrollToTopButton.style.opacity = '1';
    });
    scrollToTopButton.addEventListener('mouseleave', () => {
        scrollToTopButton.style.opacity = '0.2';
    });
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopButton.style.display = 'block';
        } else {
            scrollToTopButton.style.display = 'none';
        }
    });

    scrollToTopButton.style.display = 'none'; // Initially hide the button
})();
