// ==UserScript==
// @name         WatchNow IMDb TMDB
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quickly redirect IMDb and TMDB titles to vidbinge.dev with custom settings.
// @author       Bitgineer https://github.com/bitgineer
// @match        https://www.imdb.com/title/tt*/*
// @match        https://www.themoviedb.org/*/*/*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520196/WatchNow%20IMDb%20TMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/520196/WatchNow%20IMDb%20TMDB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*************** Styles Injection ***************/
    const styles = `
    /* WatchNow Styles */
    #WatchNow-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        background-color: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Roboto', sans-serif;
        padding: 20px;
        box-sizing: border-box;
    }

    #WatchNow-container h2 {
        font-size: 1.4rem;
        margin-bottom: 20px;
        text-align: center;
        color: #6200ea;
    }

    .wn-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 16px;
        font-size: 1rem;
        background-color: #6200ea;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s, box-shadow 0.3s;
        width: 100%;
        margin-bottom: 15px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .wn-button:hover {
        background-color: #3700b3;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .wn-toggle-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    }

    .wn-toggle-label {
        font-size: 1rem;
        flex: 1;
        margin-right: 10px;
    }

    .wn-toggle-switch {
        position: relative;
        width: 50px;
        height: 24px;
        flex-shrink: 0;
    }

    .wn-toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .wn-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 24px;
    }

    .wn-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    .wn-toggle-switch input:checked + .wn-slider {
        background-color: #6200ea;
    }

    .wn-toggle-switch input:checked + .wn-slider:before {
        transform: translateX(26px);
    }

    .wn-section {
        margin-bottom: 15px;
        display: none;
    }

    .wn-section.active {
        display: block;
    }

    .wn-section label {
        display: block;
        margin-bottom: 8px;
        font-size: 0.95rem;
    }

    .wn-radio-group {
        display: flex;
        justify-content: space-around;
        margin-bottom: 15px;
        flex-wrap: wrap;
    }

    .wn-radio-group label {
        display: flex;
        align-items: center;
        font-size: 0.95rem;
        cursor: pointer;
        margin-bottom: 8px;
        width: 45%;
    }

    .wn-radio-group input {
        margin-right: 6px;
        flex-shrink: 0;
    }

    .wn-input-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .wn-input-group label {
        font-size: 0.95rem;
    }

    .wn-input-group input {
        padding: 8px 12px;
        font-size: 1rem;
        border: 1px solid #cccccc;
        border-radius: 4px;
        outline: none;
        transition: border-color 0.3s;
        width: 100%;
    }

    .wn-input-group input:focus {
        border-color: #6200ea;
    }

    .wn-footer {
        font-size: 0.85rem;
        color: #777777;
        text-align: center;
    }

    /* Snackbar Styles */
    #wn-snackbar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333333;
        color: #ffffff;
        padding: 10px 20px;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.5s ease, bottom 0.5s ease;
        z-index: 10001;
        font-size: 0.9rem;
        max-width: 80%;
        text-align: center;
        pointer-events: none;
    }

    #wn-snackbar.show {
        opacity: 1;
        bottom: 30px;
    }

    /* Responsive Design */
    @media (max-width: 400px) {
        #WatchNow-container {
            width: 90%;
            right: 5%;
            bottom: 10px;
            padding: 15px;
        }

        #WatchNow-container h2 {
            font-size: 1.2rem;
        }

        .wn-button {
            font-size: 0.95rem;
            padding: 10px 12px;
        }

        .wn-toggle-label, .wn-section label, .wn-radio-group label, .wn-input-group label {
            font-size: 0.85rem;
        }
    }
    `;

    GM_addStyle(styles);

    /*************** UI Injection ***************/
    const container = document.createElement('div');
    container.id = 'WatchNow-container';
    container.innerHTML = `
        <h2>WatchNow</h2>

        <button id="wn-redirectButton" class="wn-button">
            ▶️ Watch Now!
        </button>

        <div class="wn-toggle-container">
            <span class="wn-toggle-label">Enable Redirect</span>
            <label class="wn-toggle-switch">
                <input type="checkbox" id="wn-redirectCheckbox">
                <span class="wn-slider"></span>
            </label>
        </div>

        <!-- Redirect Options Section -->
        <div id="wn-redirectOptions" class="wn-section">
            <label>Open Redirect:</label>
            <div class="wn-radio-group">
                <label>
                    <input type="radio" name="wn-redirectTarget" value="same" id="wn-redirectSame">
                    Same Tab
                </label>
                <label>
                    <input type="radio" name="wn-redirectTarget" value="new" id="wn-redirectNew">
                    New Tab
                </label>
            </div>
        </div>

        <!-- Season and Episode Inputs -->
        <div id="wn-seasonEpisodeOptions" class="wn-section">
            <div class="wn-input-group">
                <label for="wn-seasonInput">Season:</label>
                <input type="number" id="wn-seasonInput" min="1" value="1">
            </div>
            <div class="wn-input-group">
                <label for="wn-episodeInput">Episode:</label>
                <input type="number" id="wn-episodeInput" min="1" value="1">
            </div>
        </div>

        <div class="wn-footer">
            <p>Stream effortlessly with WatchNow.</p>
        </div>
    `;
    document.body.appendChild(container);

    // Snackbar Element
    const snackbar = document.createElement('div');
    snackbar.id = 'wn-snackbar';
    document.body.appendChild(snackbar);

    /*************** Utility Functions ***************/
    // Function to show snackbar messages
    function showSnackbar(message) {
        snackbar.textContent = message;
        snackbar.classList.add('show');
        setTimeout(() => {
            snackbar.classList.remove('show');
        }, 3000);
    }

    // Function to toggle visibility of sections
    function toggleSections(show) {
        const redirectOptions = document.getElementById('wn-redirectOptions');
        const seasonEpisodeOptions = document.getElementById('wn-seasonEpisodeOptions');
        if (show) {
            redirectOptions.classList.add('active');
            seasonEpisodeOptions.classList.add('active');
        } else {
            redirectOptions.classList.remove('active');
            seasonEpisodeOptions.classList.remove('active');
        }
    }

    // Function to extract IMDb ID using a robust regex
    function getImdbId(url) {
        const regex = /\/title\/(tt\d{7,8})/; // IMDb IDs typically have 7 or 8 digits
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Function to determine the title type on IMDb by inspecting specific list items
    function determineImdbTitleType() {
        const listItems = document.querySelectorAll('ul.ipc-inline-list.ipc-inline-list--show-dividers li.ipc-inline-list__item');
        for (const item of listItems) {
            const text = item.textContent.trim().toLowerCase();
            if (text.includes('tv series') || text.includes('tv mini-series')) {
                return 'tv';
            }
            // You can add more conditions here for other types if needed
        }
        return 'movie'; // Default to 'movie' if no TV indicators are found
    }

    // Function to extract TMDB ID and type from the URL
    function getTmdbInfo(url) {
        const regex = /https:\/\/www\.themoviedb\.org\/(movie|tv)\/(\d+)/;
        const match = url.match(regex);
        if (match) {
            return { type: match[1], id: match[2] };
        }
        return null;
    }

    // Function to build the redirect URL with optional season and episode for TV
    function buildRedirectUrl(titleType, id, season, episode) {
        let url = `https://vidbinge.dev/embed/${titleType}/${id}`;
        if (titleType === 'tv' && season && episode) {
            url += `/${season}/${episode}`;
        }
        return url;
    }

    /*************** Settings Management ***************/
    // Load existing settings
    let redirectEnabled = GM_getValue('redirectEnabled', false);
    let redirectTarget = GM_getValue('redirectTarget', 'same');
    let season = GM_getValue('season', 1);
    let episode = GM_getValue('episode', 1);

    // Initialize UI with settings
    const redirectCheckbox = document.getElementById('wn-redirectCheckbox');
    const redirectSame = document.getElementById('wn-redirectSame');
    const redirectNew = document.getElementById('wn-redirectNew');
    const seasonInput = document.getElementById('wn-seasonInput');
    const episodeInput = document.getElementById('wn-episodeInput');

    redirectCheckbox.checked = redirectEnabled;
    toggleSections(redirectEnabled);

    if (redirectTarget === 'same') {
        redirectSame.checked = true;
    } else {
        redirectNew.checked = true;
    }

    seasonInput.value = season;
    episodeInput.value = episode;

    /*************** Event Listeners ***************/
    // Event listener for the redirect checkbox
    redirectCheckbox.addEventListener('change', function() {
        const isEnabled = redirectCheckbox.checked;
        GM_setValue('redirectEnabled', isEnabled);
        toggleSections(isEnabled);
    });

    // Event listeners for radio buttons
    redirectSame.addEventListener('change', function() {
        if (this.checked) {
            GM_setValue('redirectTarget', 'same');
        }
    });

    redirectNew.addEventListener('change', function() {
        if (this.checked) {
            GM_setValue('redirectTarget', 'new');
        }
    });

    // Event listeners for Season and Episode inputs
    seasonInput.addEventListener('input', function() {
        let val = parseInt(seasonInput.value, 10);
        if (isNaN(val) || val < 1) {
            val = 1;
            seasonInput.value = val;
        }
        GM_setValue('season', val);
    });

    episodeInput.addEventListener('input', function() {
        let val = parseInt(episodeInput.value, 10);
        if (isNaN(val) || val < 1) {
            val = 1;
            episodeInput.value = val;
        }
        GM_setValue('episode', val);
    });

    // Event listener for the redirect button
    document.getElementById('wn-redirectButton').addEventListener('click', function() {
        const url = window.location.href;

        // Check if URL is IMDb
        const imdbId = getImdbId(url);
        if (imdbId) {
            const titleType = determineImdbTitleType();

            if (titleType === 'tv') {
                const currentSeason = GM_getValue('season', 1);
                const currentEpisode = GM_getValue('episode', 1);
                const redirectUrl = buildRedirectUrl(titleType, imdbId, currentSeason, currentEpisode);
                performRedirect(redirectUrl);
            } else {
                // For movies, no season and episode
                const redirectUrl = buildRedirectUrl(titleType, imdbId);
                performRedirect(redirectUrl);
            }
            return;
        }

        // Check if URL is TMDB
        const tmdbInfo = getTmdbInfo(url);
        if (tmdbInfo) {
            const { type, id } = tmdbInfo;
            if (type === 'tv') {
                const currentSeason = GM_getValue('season', 1);
                const currentEpisode = GM_getValue('episode', 1);
                const redirectUrl = buildRedirectUrl(type, id, currentSeason, currentEpisode);
                performRedirect(redirectUrl);
            } else {
                // For movies, no season and episode
                const redirectUrl = buildRedirectUrl(type, id);
                performRedirect(redirectUrl);
            }
            return;
        }

        showSnackbar('This is not a supported title page.');
    });

    /*************** Redirection Function ***************/
    function performRedirect(url) {
        if (!GM_getValue('redirectEnabled', false)) {
            showSnackbar('Redirect is disabled in settings.');
            return;
        }

        const target = GM_getValue('redirectTarget', 'same');
        if (target === 'same') {
            window.location.href = url;
            showSnackbar('Redirecting...');
        } else if (target === 'new') {
            window.open(url, '_blank');
            showSnackbar('Redirecting to new tab...');
        } else {
            showSnackbar('Invalid redirect target.');
        }
    }

    /*************** Optional: Auto Redirect ***************/
    // Uncomment the following block if you want to auto redirect when enabled
    /*
    if (redirectEnabled) {
        const url = window.location.href;

        // Check if URL is IMDb
        const imdbId = getImdbId(url);
        if (imdbId) {
            const titleType = determineImdbTitleType();

            if (titleType === 'tv') {
                const currentSeason = GM_getValue('season', 1);
                const currentEpisode = GM_getValue('episode', 1);
                const redirectUrl = buildRedirectUrl(titleType, imdbId, currentSeason, currentEpisode);
                performRedirect(redirectUrl);
            } else {
                // For movies, no season and episode
                const redirectUrl = buildRedirectUrl(titleType, imdbId);
                performRedirect(redirectUrl);
            }
            return;
        }

        // Check if URL is TMDB
        const tmdbInfo = getTmdbInfo(url);
        if (tmdbInfo) {
            const { type, id } = tmdbInfo;
            if (type === 'tv') {
                const currentSeason = GM_getValue('season', 1);
                const currentEpisode = GM_getValue('episode', 1);
                const redirectUrl = buildRedirectUrl(type, id, currentSeason, currentEpisode);
                performRedirect(redirectUrl);
            } else {
                // For movies, no season and episode
                const redirectUrl = buildRedirectUrl(type, id);
                performRedirect(redirectUrl);
            }
            return;
        }

        console.error('This is not a valid IMDb or TMDB title page.');
    }
    */

})();