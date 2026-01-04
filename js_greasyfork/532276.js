// ==UserScript==
// @name         Ultimate IMDB Stream
// @namespace    https://legendzer0.io/
// @version      1.1
// @description  Adds a watch button on IMDb pages to stream via Vidsrc with overlay and season/episode controls.
// @author       LegendZer0
// @match        https://www.imdb.com/title/*
// @grant        none
// @icon         https://www.iconpacks.net/icons/1/free-icon-movie-850.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532276/Ultimate%20IMDB%20Stream.user.js
// @updateURL https://update.greasyfork.org/scripts/532276/Ultimate%20IMDB%20Stream.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getIMDbId() {
        const match = window.location.pathname.match(/title\/(tt\d+)/);
        return match ? match[1] : null;
    }

    function extractSeasonEpisode() {
        const seasonEpisodeDiv = document.querySelector('[data-testid="hero-subnav-bar-season-episode-numbers-section"]');
        if (seasonEpisodeDiv) {
            const seasonEpisodeText = seasonEpisodeDiv.textContent.trim();
            const match = seasonEpisodeText.match(/S(\d+).E(\d+)/);
            if (match) return { season: match[1], episode: match[2] };
        }
        return null;
    }

    function extractSeriesId() {
        const seriesLink = document.querySelector('[data-testid="hero-title-block__series-link"]');
        if (seriesLink) {
            const href = seriesLink.getAttribute('href');
            const match = href.match(/\/title\/(tt\d+)\//);
            if (match) return match[1];
        }
        return null;
    }

    function isTVSeries() {
        return [...document.querySelectorAll("li.ipc-inline-list__item")]
            .some(el => el.textContent.trim() === "TV Series")
            || document.body.innerText.includes("TV Series");
    }

    function createWatchButton(imdbId) {
        const watchButton = document.createElement("button");
        watchButton.textContent = "▶ Watch";
        watchButton.style.position = "fixed";
        watchButton.style.bottom = "20px";
        watchButton.style.right = "20px";
        watchButton.style.padding = "10px 15px";
        watchButton.style.backgroundColor = "#e50914";
        watchButton.style.color = "#fff";
        watchButton.style.border = "none";
        watchButton.style.cursor = "pointer";
        watchButton.style.zIndex = "9999";
        watchButton.style.fontSize = "16px";
        watchButton.style.borderRadius = "5px";
        watchButton.style.filter = "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))";

        watchButton.addEventListener("click", () => showOverlay(imdbId));
        document.body.appendChild(watchButton);
    }

    function createControlButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '8px 12px';
        button.style.margin = '5px';
        button.style.backgroundColor = '#e50914';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        return button;
    }

    function showOverlay(imdbId) {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 1)";
        overlay.style.zIndex = "10000";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.width = "80%";
        container.style.height = "80%";

        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'fullscreen');

        // Determine content type
        const seasonEpisode = extractSeasonEpisode();
        const seriesId = extractSeriesId();
        let isSeries = false;
        let currentSeason = 1;
        let currentEpisode = 1;
        let imdbIdForTV = imdbId;

        if (seasonEpisode && seriesId) {
            // Episode page
            isSeries = true;
            imdbIdForTV = seriesId;
            currentSeason = parseInt(seasonEpisode.season);
            currentEpisode = parseInt(seasonEpisode.episode);
        } else if (isTVSeries()) {
            // Series main page
            isSeries = true;
        }

        const updateIframe = () => {
            iframe.src = isSeries
                ? `https://vidsrc.xyz/embed/tv?imdb=${imdbIdForTV}&season=${currentSeason}&episode=${currentEpisode}`
                : `https://vidsrc.xyz/embed/movie?imdb=${imdbId}`;
        };

        // Add controls for series content
        if (isSeries) {
            const controls = document.createElement("div");
            controls.style.position = "absolute";
            controls.style.bottom = "-50px";
            controls.style.width = "100%";
            controls.style.display = "flex";
            controls.style.justifyContent = "space-between";
            controls.style.padding = "0 20px";

            // Season controls
            const seasonControls = document.createElement("div");
            const seasonDown = createControlButton("⪡ Season", () => {
                if (currentSeason > 1) currentSeason--;
                updateIframe();
            });
            const seasonUp = createControlButton("Season ⪢", () => {
                currentSeason++;
                updateIframe();
            });
            seasonControls.append(seasonDown, seasonUp);

            // Episode controls
            const episodeControls = document.createElement("div");
            const episodeDown = createControlButton("⪡ Episode", () => {
                if (currentEpisode > 1) currentEpisode--;
                updateIframe();
            });
            const episodeUp = createControlButton("Episode ⪢", () => {
                currentEpisode++;
                updateIframe();
            });
            episodeControls.append(episodeDown, episodeUp);

            controls.append(seasonControls, episodeControls);
            container.appendChild(controls);
        }

        // Close button
        const closeButton = document.createElement("button");
        closeButton.textContent = "✖";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.fontSize = "24px";
        closeButton.style.background = "none";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", () => document.body.removeChild(overlay));

        // Initial load
        updateIframe();

        container.appendChild(iframe);
        overlay.appendChild(container);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);
    }

    const imdbId = getIMDbId();
    if (imdbId) createWatchButton(imdbId);
})();