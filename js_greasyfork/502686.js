// ==UserScript==
// @name         IMDb to VidSrc (2024)
// @namespace    https://www.imdb.com/
// @icon         https://vidsrc.me/assets/embed/images/favicon.png
// @version      3.0
// @description  Adds a button to redirect to vidsrc.me on IMDb pages.
// @author       Undefined42
// @license MIT
// @match        https://*.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502686/IMDb%20to%20VidSrc%20%282024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502686/IMDb%20to%20VidSrc%20%282024%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract season and episode numbers from the IMDb page
    function extractSeasonEpisode() {
        const seasonEpisodeDiv = document.querySelector('[data-testid="hero-subnav-bar-season-episode-numbers-section"]');
        if (seasonEpisodeDiv) {
            const seasonEpisodeText = seasonEpisodeDiv.textContent.trim();
            const match = seasonEpisodeText.match(/S(\d+).E(\d+)/);
            if (match) {
                return {
                    season: match[1],
                    episode: match[2]
                };
            }
        }
        return null;
    }

    // Function to extract the series ID from the IMDb page
    function extractSeriesId() {
        const seriesLink = document.querySelector('[data-testid="hero-title-block__series-link"]');
        if (seriesLink) {
            const href = seriesLink.getAttribute('href');
            const match = href.match(/\/title\/(tt\d+)\//);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    // Create a function to open the specified URL in a new tab for episodes
    function redirectToEpisode() {
        const seasonEpisode = extractSeasonEpisode();
        const seriesId = extractSeriesId();
        if (seasonEpisode && seriesId) {
            const { season, episode } = seasonEpisode;
            const vidsrcUrl = `https://vidsrc.me/embed/tv/${seriesId}/${season}/${episode}`;
            window.open(vidsrcUrl, '_blank');
        }
    }

    // Create a function to open the specified URL in a new tab for movies or series
    function redirectToVidSrc() {
        const imdbId = window.location.pathname.split('/')[2];
        const isMovie = document.title.indexOf('TV Series') === -1;
        const isEpisode = document.title.indexOf('TV Episode') === -1;
        let vidsrcUrl;

        if (isMovie && isEpisode) {
            vidsrcUrl = `https://vidsrc.me/embed/movie/${imdbId}`;
        } else {
            if (isMovie) {
                redirectToEpisode();
                return;
            } else {
                vidsrcUrl = `https://vidsrc.me/embed/tv/${imdbId}`;
            }
        }

        window.open(vidsrcUrl, '_blank');
    }


    // Create the button element
    const button = document.createElement('button');
    button.textContent = '📽 Watch on VidSrc';
    button.style.fontFamily = 'Arial';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.background = '#CEE300';
    button.style.color = '#152c42';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.borderRadius = '5px';
    button.style.zIndex = '9999';
    button.style.filter = 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))';

    // Add a click event listener to the button
    button.addEventListener('click', redirectToVidSrc);

    // Append the button to the body of the page
    document.body.appendChild(button);
})();