// ==UserScript==
// @name         Trakt to Jellyseerr
// @namespace    https://trakt.tv/
// @icon         https://docs.jellyseerr.dev/img/favicon.ico
// @version      1.0
// @description  Add a button to search Trakt shows/movies on Jellyseerr
// @author       Undefined42
// @license MIT
// @match        https://trakt.tv/shows/*
// @match        https://trakt.tv/movies/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511623/Trakt%20to%20Jellyseerr.user.js
// @updateURL https://update.greasyfork.org/scripts/511623/Trakt%20to%20Jellyseerr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // FIXME: Replace with your Jellyseerr URL
    const jellyseerrUrl = 'https://jellyseerr.example.org';

    // Function to create and add the button
    function addJellyseerrButton() {
        const jellyseerrButton = document.createElement('button');
        jellyseerrButton.textContent = 'Search on Jellyseerr';
        jellyseerrButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #4f46e5cc;
            color: white;
            border: 0.8px solid #6366f1;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        `;

        jellyseerrButton.addEventListener('click', searchOnJellyseerr);
        document.body.appendChild(jellyseerrButton);
    }

    // Function to search on Jellyseerr
    function searchOnJellyseerr() {
        const { tmdbId, mediaType } = getTmdbIdAndType();
        if (!tmdbId) {
            alert('TMDB ID not found');
            return;
        }

        const jellyseerrSearchUrl = `${jellyseerrUrl}/${mediaType}/${tmdbId}`;
        window.open(jellyseerrSearchUrl, '_blank');
    }

    // Function to get TMDB ID and media type from the page
    function getTmdbIdAndType() {
        const tmdbLink = document.querySelector('a[href^="https://www.themoviedb.org/"]');
        if (!tmdbLink) return { tmdbId: null, mediaType: null };

        const tmdbUrl = tmdbLink.href;
        const urlParts = tmdbUrl.split('/');

        let tmdbId, mediaType;

        if (urlParts.includes('movie')) {
            mediaType = 'movie';
            tmdbId = urlParts[urlParts.indexOf('movie') + 1];
        } else if (urlParts.includes('tv')) {
            mediaType = 'tv';
            tmdbId = urlParts[urlParts.indexOf('tv') + 1];
        } else {
            return { tmdbId: null, mediaType: null };
        }

        return { tmdbId, mediaType };
    }

    // Run the script
    addJellyseerrButton();
})();