// ==UserScript==
// @name         IMDB Video Player
// @version      1.0.0
// @description  Add video player from vidsrc.cc directly into IMDB movie/series webpage.
// @author       M4X1MUS07
// @license      MIT
// @match        https://www.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @icon         https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png
// @grant        GM_xmlhttpRequest
// @connect      imdb.com
// @connect      m.imdb.com
// @connect      vidsrc.cc
// @connect      api.themoviedb.org
// @namespace https://greasyfork.org/users/1381554
// @downloadURL https://update.greasyfork.org/scripts/513145/IMDB%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/513145/IMDB%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Utility function to log errors
    const logError = (error) => console.error(`Error: ${error.message || error}`);

    // Extract IMDB id from the URL
    const imdbID = getImdbIdFromURL();
    if (!imdbID) {
        return logError('Invalid IMDB URL: Could not extract IMDB ID');
    }

    // Determine if it's a series or a movie and act accordingly
    if (document.title.includes("Series")) {
        handleSeries(imdbID);
    } else {
        handleMovie(imdbID);
    }

    // Function to extract IMDB ID from the current URL
    function getImdbIdFromURL() {
        const urlParts = document.URL.split("/");
        return urlParts[4] || null;
    }

    // Function to handle series page logic
    function handleSeries(imdbID) {
        getTmdbIDForSeries(imdbID).then((tmdbId) => {
            if (tmdbId) {
                insertPlayer("tv", tmdbId);
            } else {
                logError("TMDB ID for the series could not be retrieved.");
            }
        }).catch(logError);
    }

    // Function to handle movie page logic
    function handleMovie(imdbID) {
        insertPlayer("movie", imdbID);
    }

    // Fetch TMDB ID for series using IMDB ID
    function getTmdbIDForSeries(imdbID) {
        return new Promise((resolve, reject) => {
            const apiKey = '8d6d91941230817f7807d643736e8a49'; // this is a public api key
            const url = `https://api.themoviedb.org/3/find/${imdbID}?api_key=${apiKey}&language=en-US&external_source=imdb_id`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => {
                    try {
                        const result = JSON.parse(response.responseText);
                        const tmdbID = result.tv_results?.[0]?.id || null;
                        resolve(tmdbID);
                    } catch (error) {
                        reject(`Failed to parse TMDB response: ${error}`);
                    }
                },
                onerror: (error) => reject(`Network error: ${error.statusText || error}`)
            });
        });
    }

    // Common function to insert the video player into the IMDB page
    function insertPlayer(type, id) {
        const playerUrl = `https://vidsrc.cc/v2/embed/${type}/${id}`;
        const iframe = createIframe(playerUrl);

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