// ==UserScript==
// @name         IMDb Show Viewer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds IMDb Show Viewer functionality
// @author       You
// @match        https://www.imdb.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479636/IMDb%20Show%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/479636/IMDb%20Show%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractShowIdFromURL() {
        var match = window.location.href.match(/\/title\/(tt\d+)\/.*/);
        return match ? match[1] : null;
    }

    function watchShow() {
        var showId = extractShowIdFromURL();

        if (showId) {
            window.open(`https://vidsrc.to/embed/tv/${showId}/`);
        } else {
            alert('Unable to extract IMDb Show ID from the URL.');
        }
    }

    function watchMovie() {
        var showId = extractShowIdFromURL();

        if (showId) {
            window.open(`https://vidsrc.to/embed/movie/${showId}`);
        } else {
            alert('Unable to extract IMDb Show ID from the URL.');
        }
    }

    // Add UI element to the IMDb webpage
    function addIMDbShowViewer() {
        var container = document.createElement('div');
        container.innerHTML = `
            <h1>IMDb Show Viewer</h1>
            <button id="watchShowButton">Watch Show</button>
            <button id="watchMovieButton">Watch Movie</button>
        `;
        document.body.prepend(container);

        document.getElementById('watchShowButton').addEventListener('click', watchShow);
        document.getElementById('watchMovieButton').addEventListener('click', watchMovie);
    }

    // Add the IMDb Show Viewer to the IMDb webpage
    addIMDbShowViewer();
})();
