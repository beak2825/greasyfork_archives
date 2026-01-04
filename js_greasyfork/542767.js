// ==UserScript==
// @name         Letterboxd to P-Stream
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add P-Stream links to Letterboxd film pages
// @author       archiivv
// @match        https://letterboxd.com/film/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542767/Letterboxd%20to%20P-Stream.user.js
// @updateURL https://update.greasyfork.org/scripts/542767/Letterboxd%20to%20P-Stream.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Wait a bit for dynamic content to load
        setTimeout(addPstreamButton, 1000);
    }

    function addPstreamButton() {
        // Get film data from the page
        let filmTitle, filmYear;

        // Try to get from filmData global variable (if available)
        if (typeof window.filmData !== 'undefined') {
            filmTitle = window.filmData.name;
            filmYear = window.filmData.releaseYear;
        } else {
            // Fallback: scrape from page elements
            const titleElement = document.querySelector('h1.headline-1');
            const yearElement = document.querySelector('.number a');

            if (titleElement) {
                filmTitle = titleElement.textContent.trim();
            }
            if (yearElement) {
                filmYear = yearElement.textContent.trim();
            }
        }

        if (!filmTitle) {
            console.log('Could not find film title');
            return;
        }

        console.log('Film:', filmTitle, filmYear);

        // Look for TMDB link on the page
        const tmdbLink = document.querySelector('a[data-track-action="TMDb"], a[href*="themoviedb.org"]');

        if (tmdbLink) {
            const tmdbMatch = tmdbLink.href.match(/themoviedb\.org\/movie\/(\d+)/);
            if (tmdbMatch) {
                const tmdbId = tmdbMatch[1];
                console.log('Found TMDB ID:', tmdbId);
                createPstreamButton(tmdbId, filmTitle);
                return;
            }
        }

        // If no TMDB link found, search via API
        searchTMDBForId(filmTitle, filmYear);
    }

    function searchTMDBForId(title, year) {
        // Free TMDB API - you need to get a key from https://www.themoviedb.org/settings/api
        const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

        if (apiKey === 'YOUR_API_KEY_HERE') {
            console.log('Please add your TMDB API key to the script');
            // For now, let's try to construct URL without API
            createPstreamButtonFallback(title, year);
            return;
        }

        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&year=${year}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: searchUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.results && data.results.length > 0) {
                        const tmdbId = data.results[0].id;
                        console.log('Found TMDB ID via API:', tmdbId);
                        createPstreamButton(tmdbId, title);
                    } else {
                        console.log('No TMDB results found');
                        createPstreamButtonFallback(title, year);
                    }
                } catch (error) {
                    console.error('Error parsing TMDB response:', error);
                    createPstreamButtonFallback(title, year);
                }
            },
            onerror: function(error) {
                console.error('Error fetching TMDB data:', error);
                createPstreamButtonFallback(title, year);
            }
        });
    }

    function createPstreamButton(tmdbId, title) {
        // Create slug from title
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const pstreamUrl = `https://pstream.mov/media/tmdb-movie-${tmdbId}-${slug}`;

        addButtonToPage(pstreamUrl, 'Watch on P-Stream');
    }

    function createPstreamButtonFallback(title, year) {
        // Create a generic search URL or best guess
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const pstreamUrl = `https://pstream.mov/search?q=${encodeURIComponent(title + ' ' + year)}`;

        addButtonToPage(pstreamUrl, 'Search on P-Stream');
    }

    function addButtonToPage(url, text) {
        // Find the actions panel ul
        const actionsList = document.querySelector('.actions-panel ul, .js-actions-panel ul');

        if (!actionsList) {
            console.log('Could not find actions panel list');
            return;
        }

        // Create li element to match Letterboxd structure
        const listItem = document.createElement('li');
        listItem.className = 'pstream-action';

        // Create the link
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.textContent = text;

        // Add the link to the list item
        listItem.appendChild(link);

        // Add to the actions list
        actionsList.appendChild(listItem);

        console.log('Added P-Stream button:', url);
    }

    // Add CSS to match Letterboxd's design
    GM_addStyle(`
        .pstream-action {
            color: var(--content-color) !important;
            background-color: #456 !important;
            text-align: center !important;
            border-bottom: 1px solid #2C3440 !important;
            padding: 10px 0 !important;
            box-sizing: border-box !important;
        }

        .pstream-action a {
            color: var(--content-color) !important;
            text-decoration: none !important;
            display: block !important;
            width: 100% !important;
            height: 100% !important;
        }

        .pstream-action a:hover {
            color: var(--content-color) !important;
        }
    `);

})();