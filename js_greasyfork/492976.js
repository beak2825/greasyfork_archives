// ==UserScript==
// @name         Letterboxd IMDb Code Extractor
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Extract and copy IMDb code on Letterboxd film pages
// @author       You
// @match        https://letterboxd.com/film/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492976/Letterboxd%20IMDb%20Code%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/492976/Letterboxd%20IMDb%20Code%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a button that matches the IMDb button style
    function createMatchingButton(imdbCode) {
        const button = document.createElement('button');
        button.textContent = imdbCode;
        // Apply provided styles
        button.style.background = '#14181c'; // Background color as per request
        button.style.border = '2px solid #303840';
        button.style.borderRadius = '2px';
        button.style.color = '#9ab';
        button.style.fontSize = '.76923077rem';
        button.style.letterSpacing = '.075em';
        button.style.padding = '4px 5px 3px';
        button.style.textTransform = 'uppercase';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '10px'; // Space from the existing TMDB button
        button.onclick = function() {
            navigator.clipboard.writeText(imdbCode).then(function() {
                console.log('IMDb code copied to clipboard');
            }, function(err) {
                console.error('Could not copy IMDb code: ', err);
            });
        };
        return button;
    }

    // Wait for the TMDB button to load on the page
    const waitForTmdbButton = setInterval(function() {
        const tmdbButton = document.querySelector('a[href*="themoviedb.org/movie/"]'); // The TMDB button element
        if (tmdbButton) {
            clearInterval(waitForTmdbButton);

            // Extract the IMDb code from the page
            const imdbLinkElement = document.querySelector('a[href*="imdb.com/title/tt"]');
            if (imdbLinkElement) {
                const imdbUrl = imdbLinkElement.href;
                const imdbCodeMatch = imdbUrl.match(/title\/(tt\d+)/);
                if (imdbCodeMatch && imdbCodeMatch[1]) {
                    const imdbCode = imdbCodeMatch[1];
                    const matchingButton = createMatchingButton(imdbCode);
                    tmdbButton.parentNode.insertBefore(matchingButton, tmdbButton.nextSibling); // Insert the button after the TMDB button
                }
            }
        }
    }, 500); // Check every 500ms if the TMDB button has loaded
})();
