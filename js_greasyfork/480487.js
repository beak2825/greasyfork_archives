// ==UserScript==
// @name         FMovies Shuffle Play
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a shuffle button to select a random episode on FMovies for a show
// @author       YourName
// @match        https://fmoviesz.to/tv/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480487/FMovies%20Shuffle%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/480487/FMovies%20Shuffle%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add the shuffle button
  function addShuffleButton() {
        // Locate the Auto Play button
        const autoPlayButton = document.querySelector('.auto-play');

        if (autoPlayButton) {
            // Create the shuffle button
            const shuffleButton = document.createElement('div');
            shuffleButton.className = 'item shuffle';
            shuffleButton.innerHTML = '<i class="bi bi-shuffle"></i> Shuffle';

            // Insert the shuffle button next to Auto Play
            autoPlayButton.parentNode.insertBefore(shuffleButton, autoPlayButton.nextSibling);

            // Event listener for the shuffle button
            shuffleButton.addEventListener('click', () => {
                const episodes = getEpisodeUrls();
                playRandomEpisode(episodes);
            });
        }
    }
    // Function to get URLs of all episodes
function getEpisodeUrls() {
    // Extract the show's base path from the current URL
    const basePath = window.location.pathname.split('/').slice(0, 3).join('/');

    // Select all episode links that start with the show's base path
    const episodeLinks = document.querySelectorAll(`a[href^="${basePath}"]`);
    return Array.from(episodeLinks).map(link => link.href);
}


    // Function to play a random episode
    function playRandomEpisode(episodes) {
        if (episodes.length > 0) {
            const randomEpisodeUrl = episodes[Math.floor(Math.random() * episodes.length)];
            window.location.href = randomEpisodeUrl;
        } else {
            alert('No episodes found');
        }
    }

    // Add the shuffle button when the page loads
    window.addEventListener('load', addShuffleButton);
})();
