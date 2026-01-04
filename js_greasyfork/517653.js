// ==UserScript==
// @name         IMDB VidSrc Player
// @version      1.0.0
// @description  Add video player from vidsrc.net directly into IMDB movie/series webpage.
// @author       https://github.com/atefr
// @license      MIT
// @match        https://www.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @icon         https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png
// @connect      imdb.com
// @connect      m.imdb.com
// @connect      vidsrc.net
// @namespace https://greasyfork.org/users/1397577
// @downloadURL https://update.greasyfork.org/scripts/517653/IMDB%20VidSrc%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/517653/IMDB%20VidSrc%20Player.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Utility function to log errors
    const logError = (error) => console.error(`Error: ${error.message || error}`);

    insertPlayer();

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


    // Common function to insert the video player into the IMDB page
    function insertPlayer() {
        const imdbId = window.location.pathname.split('/')[2];
        const isMovie = document.title.indexOf('TV Series') === -1;
        const isEpisode = document.title.indexOf('TV Episode') === -1;
        let vidsrcUrl;

        if (isMovie && isEpisode) {
            vidsrcUrl = `https://vidsrc.net/embed/movie/${imdbId}`;
        } else {
            if (isMovie) {
                const seasonEpisode = extractSeasonEpisode();
                const seriesId = extractSeriesId();
                if (seasonEpisode && seriesId) {
                    const {
                        season,
                        episode
                    } = seasonEpisode;
                    vidsrcUrl = `https://vidsrc.net/embed/tv/${seriesId}/${season}/${episode}`;

                }
            } else {
                vidsrcUrl = `https://vidsrc.net/embed/tv/${imdbId}`;
            }
        }

        const iframe = createIframe(vidsrcUrl);

        const targetLocation = document.querySelector("main");
        if (targetLocation) {
            targetLocation.before(iframe);
            console.log(`Player embedded for ${type === "tv" ? "Series" : "Movie"}`);
        } else {
            logError("Target location for player insertion not found on the page");
        }
    }

    // Helper function to create an iframe for embedding the video player
    function createIframe(src) {
        const iframe = document.createElement("iframe");
        iframe.style.height = "800px";
        iframe.style.width = "100%";
        iframe.style.margin = "0 auto";
        iframe.id = "vidsrc";
        iframe.src = src;
        iframe.allowFullscreen = true;
        iframe.setAttribute("webkitallowfullscreen", "true");
        iframe.setAttribute("mozallowfullscreen", "true");
        return iframe;
    }
})();