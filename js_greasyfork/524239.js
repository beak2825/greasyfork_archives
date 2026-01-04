// ==UserScript==
// @name        Shazam YouTube Search Button for track pages
// @namespace   Violentmonkey Scripts
// @match       https://www.shazam.com/song/*
// @grant       none
// @version     1.0
// @author      raefraem
// @description Adds a YouTube search button to Shazam track pages next to track name
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524239/Shazam%20YouTube%20Search%20Button%20for%20track%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/524239/Shazam%20YouTube%20Search%20Button%20for%20track%20pages.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Function to create YouTube search URL
  function createYouTubeSearchURL(track, artist) {
    const searchQuery = encodeURIComponent(`${track} - ${artist}`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  }

  // Function to create YouTube button
  function createYouTubeButton(track, artist) {
    const button = document.createElement('button');
    button.innerHTML = '▶ YouTube';
    button.style.cssText = `
            background-color: #FF0000;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            margin-left: 10px;
            cursor: pointer;
            font-size: 12px;
            vertical-align: middle;
        `;

    button.addEventListener('click', e => {
      // Stop the event from bubbling up and triggering Shazam's click handler
      e.preventDefault();
      e.stopPropagation();

      // Open YouTube in a new tab
      window.open(createYouTubeSearchURL(track, artist), '_blank');

      // Return false to ensure the event is completely stopped
      return false;
    });

    return button;
  }

  function addYouTubeButton() {
    const artistEl = document.querySelector('.TrackPageHeader_songDetail__I618J h1');
    const artist = artistEl.textContent;
    const track = document.querySelector('.TrackPageHeader_songDetail__I618J h2').textContent;

    console.log('artist', artist, 'track', track);

    const youtubeButton = createYouTubeButton(track, artist);
    artistEl.appendChild(youtubeButton);
  }

  setTimeout(addYouTubeButton, 300);
})();
