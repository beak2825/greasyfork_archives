// ==UserScript==
// @name         IMDb 30nama Link
// @namespace    https://github.com/ar3h1d/letterboxd_30nama_link
// @version      0.1
// @description  Adds a button to IMDb movie pages that links to the 30nama page of the movie.
// @author       ar3h1d
// @match        https://www.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @grant        none
// @icon         https://raw.githubusercontent.com/ar3h1d/letterboxd_30nama_link/main/IMDb_30nama_icon.png
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/478419/IMDb%2030nama%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/478419/IMDb%2030nama%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract movie title from the URL
    let movieID = document.URL.split("/")[4];
    if (movieID) {
        // Create the 30nama link
        const cinamaLink = `https://30nama.com/search?q=${movieID}`;

        // Create the button element
        const cinamaButton = document.createElement('button');
        cinamaButton.className = 'ipc-responsive-button ipc-btn--theme-baseAlt ipc-responsive-button--transition-m ipc-btn--on-textPrimary ipc-responsive-button--single-padding';
        cinamaButton.href = cinamaLink;
        cinamaButton.textContent = '30nama';
        cinamaButton.target = '_blank';
        cinamaButton.style.marginLeft = '10px';
        cinamaButton.style.marginRight = '15px';
        cinamaButton.style.border = '1px solid';
        cinamaButton.style.color = '#d24040';

        // Add an onclick attribute that calls a function to redirect the user
        cinamaButton.onclick = function() {
            window.open(cinamaLink, '_blank');
        };

        // Find the TMDb button
        const reviewsButton = document.querySelector('button[aria-label="View all topics"]');
        if (reviewsButton) {
            // Insert the 30nama button after the All Topics button
            reviewsButton.parentNode.insertBefore(cinamaButton, reviewsButton.nextSibling);
        }
    }
})();