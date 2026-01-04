// ==UserScript==
// @name         Letterboxd 30nama Link
// @namespace    https://github.com/ar3h1d/letterboxd_30nama_link
// @version      0.1.1
// @description  Adds a button to Letterboxd movie pages that links to the 30nama page of the movie.
// @author       ar3h1d
// @match        https://letterboxd.com/film/*
// @grant        none
// @icon         https://raw.githubusercontent.com/ar3h1d/letterboxd_30nama_link/main/ltb30n.png
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/477944/Letterboxd%2030nama%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/477944/Letterboxd%2030nama%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract movie title from the page
    const movieTitle = document.querySelector('.headline-1').textContent.trim().toLowerCase();

    // Check if the URL already contains the year
    const yearFromUrl = window.location.href.match(/-(\d{4})$/);
    let movieYear = yearFromUrl ? yearFromUrl[1] : null;

    // Extract movie year from the page if not found in the URL
    if (!movieYear) {
        const movieYearElement = document.querySelector('a[href^="/films/year/"]');
        movieYear = movieYearElement ? movieYearElement.textContent.trim() : null;
    }

    if (movieTitle && movieYear) {
        // Create the 30nama link
        const sinamaLink = `https://30nama.com/search?q=${movieTitle}+${movieYear}`;

        // Create the button element
        const sinamaButton = document.createElement('a');
        sinamaButton.className = 'micro-button track-event';
        sinamaButton.href = sinamaLink;
        sinamaButton.textContent = '30nama';
        sinamaButton.target = '_blank';
        sinamaButton.style.marginLeft = '3px';

        // Find the TMDb button
        const tmdbButton = document.querySelector('a[data-track-action="TMDb"]');
        if (tmdbButton) {
            // Insert the 30nama button after the TMDb button
            tmdbButton.parentNode.insertBefore(sinamaButton, tmdbButton.nextSibling);
        }
    }
})();
