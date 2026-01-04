// ==UserScript==
// @name         Letterboxd Watchlist
// @namespace    https://github.com/ar3h1d/Letterboxd_Watchlist
// @version      0.1
// @description  Highlight films in your watchlist on Letterboxd
// @author       ar3h1d
// @match        https://letterboxd.com/*
// @grant        none
// @icon         https://raw.githubusercontent.com/ar3h1d/Letterboxd_Watchlist/main/Letterboxd_Watchlist.png
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478480/Letterboxd%20Watchlist.user.js
// @updateURL https://update.greasyfork.org/scripts/478480/Letterboxd%20Watchlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to highlight films
    function highlightFilms() {
        // Get all films elements
        var films = document.getElementsByClassName('react-component poster film-poster');

        // Loop through each film and add a highlight if it's in the watchlist
        for (var i = 0; i < films.length; i++) {
            if (films[i].getAttribute('data-film-in-watchlist') === 'true') {
                var film = films[i];
                film.style.position = 'relative';
                film.style.zIndex = '1';
                film.style.backgroundClip = 'padding-box';
                film.style.padding = '2px';

                var before = document.createElement('div');
                before.style.content = '';
                before.style.position = 'absolute';
                before.style.zIndex = '-1';
                before.style.top = '0';
                before.style.right = '0';
                before.style.bottom = '0';
                before.style.left = '0';
                before.style.backgroundImage = 'linear-gradient(to bottom, #00e054, blue)';
                before.style.borderRadius = '5px';

                film.appendChild(before);
            }
        }
    }

    // Run the highlight function when the DOM is ready
    window.onload = highlightFilms;
})();