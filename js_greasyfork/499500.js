// ==UserScript==
// @name         RYM Star Rating
// @namespace    http://rateyourmusic.com/
// @version      2.0.0
// @description  Adds an artist rating based on the average of their entire discography
// @author       Michael Santos
// @match        https://rateyourmusic.com/artist/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499500/RYM%20Star%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/499500/RYM%20Star%20Rating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all divs with the specified classes
    const divs = document.querySelectorAll('div.disco_avg_rating');

    // Extract the text content and convert to floats
    const ratings = Array.from(divs)
      .map(div => div.textContent.trim())
      .filter(text => text !== '')
      .map(text => parseFloat(text));

    // Calculate the average
    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    // Round the average to two decimal places
    const roundedAverage = average.toFixed(2);

    // Create new elements to append
    const starRatingHeader = document.createElement('div');
    starRatingHeader.className = 'info_hdr';
    starRatingHeader.textContent = 'Star rating';

    const starRatingContent = document.createElement('div');
    starRatingContent.className = 'info_content';
    starRatingContent.innerHTML = `<b>${roundedAverage}</b>`;

    // Append the new elements at the beginning of the artist_info_main div
    const artistInfoMain = document.querySelector('div.artist_info_main');

    artistInfoMain.insertBefore(starRatingContent, artistInfoMain.firstChild);
    artistInfoMain.insertBefore(starRatingHeader, artistInfoMain.firstChild);
})();