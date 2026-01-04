// ==UserScript==
// @name         Letterboxd and IMDb Buttons for KinoPub
// @version      2.4
// @description  Add "Open on Letterboxd" and "Open on IMDb" buttons to movie pages on KinoPub
// @author       LUXUS_FORMAT
// @match        https://*.dpr.ovh/item/view/*
// @match        https://kino.pub/item/view/*
// @grant        none
// @namespace https://greasyfork.org/en/users/1303860
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495494/Letterboxd%20and%20IMDb%20Buttons%20for%20KinoPub.user.js
// @updateURL https://update.greasyfork.org/scripts/495494/Letterboxd%20and%20IMDb%20Buttons%20for%20KinoPub.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Wait for the DOM to load
    window.addEventListener('load', function() {
        let imdbLink = document.querySelector('a[href*="imdb.com/title/"]');
        if (imdbLink) {
            // Extract only the numeric part of the IMDb ID
            let imdbIdMatch = imdbLink.href.match(/tt(\d+)/);
            let imdbId = imdbIdMatch ? imdbIdMatch[1] : null;
            if (imdbId) {
                let letterboxdUrl = `https://letterboxd.com/imdb/${imdbId}`;
                let imdbUrl = `https://www.imdb.com/title/tt${imdbId}/`;
                let seenButton = document.getElementById('movie-status');
 
                if (seenButton) {
                    // Create Letterboxd button
                    let letterboxdButton = document.createElement('button');
                    letterboxdButton.textContent = 'Open on Letterboxd';
                    letterboxdButton.className = seenButton.className; // Copy the class of "Уже видел" button
                    letterboxdButton.style.marginLeft = '10px';
                    letterboxdButton.onclick = function() {
                        window.open(letterboxdUrl, '_blank');
                    };
 
                    // Create IMDb button
                    let imdbButton = document.createElement('button');
                    imdbButton.textContent = 'Open on IMDb';
                    imdbButton.className = seenButton.className; // Copy the class of "Уже видел" button
                    imdbButton.style.marginLeft = '10px';
                    imdbButton.onclick = function() {
                        window.open(imdbUrl, '_blank');
                    };
 
                    // Insert the buttons
                    seenButton.parentNode.insertBefore(letterboxdButton, seenButton.nextSibling);
                    letterboxdButton.parentNode.insertBefore(imdbButton, letterboxdButton.nextSibling);
                }
            }
        }
    });
})();