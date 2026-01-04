// ==UserScript==
// @name             IMDB Movie to 1337x search button
// @description      When on IMDB click this red button to find it on 1337x.to
// @namespace        mikethedead
// @author           mikethedead
// @copyright        2023, ChatGPT
// @license MIT
// @match          https://www.imdb.com/*
// @version          1
// @grant            none
// @icon             https://media.discordapp.net/attachments/1051666993033527296/1133215830700740658/images.png?width=282&height=278
// @downloadURL https://update.greasyfork.org/scripts/471647/IMDB%20Movie%20to%201337x%20search%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/471647/IMDB%20Movie%20to%201337x%20search%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractMovieTitleAndRelease() {
        const pageTitle = document.title;
        const regex = /^(.*?)\s*\((\d{4})\)/;
        const matches = pageTitle.match(regex);

        if (matches && matches.length === 3) {
            const movieTitle = matches[1].trim();
            const releaseYear = matches[2];

            // Create and append the custom button
            const customButton = document.createElement('a');
            customButton.textContent = `1337 Link for ${movieTitle} (${releaseYear})`;
            customButton.href = `https://1337x.to/search/${movieTitle} ${releaseYear}/1/`;
            customButton.target = '_blank';
            customButton.style.backgroundColor = 'red';
            customButton.style.color = 'white';
            customButton.style.padding = '5px 10px';
            customButton.style.marginRight = '10px';

            // Find the header block with the given ID and append the custom button to it
            const header = document.querySelector('#imdbHeader');
            if (header) {
                header.appendChild(customButton);
            }
        } else {
            console.error("Failed to extract movie title and release year from page title.");
        }
    }

    // Delay the execution of the script to ensure the required elements are present
    setTimeout(extractMovieTitleAndRelease, 10);
})();