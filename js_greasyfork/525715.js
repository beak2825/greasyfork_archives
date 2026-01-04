// ==UserScript==
// @name         Open_Genius_For_YoutubeMusic
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  // @description  Automatically opens Genius page according to your present Youtube tab dynamically while the mapping is stored on Github: www.github.com/188751671/Open_Genius_For_YoutubeMusic. And adjusts the Genius layout and adds a dark mode toggle for Genius.
// @author       Ace
// @match        https://www.youtube.com/watch*
// @match        https://genius.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/525715/Open_Genius_For_YoutubeMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/525715/Open_Genius_For_YoutubeMusic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const host = window.location.host;

    // ---------------------
    // Code for YouTube pages
    // ---------------------
    if (host.includes('youtube.com')) {
        const CSV_URL = 'https://raw.githubusercontent.com/188751671/Open_Genius_For_YoutubeMusic/refs/heads/main/videoID_To_GeniusURL.csv';
        const CHECK_INTERVAL = 2000; // 2 seconds
        let processedVideoId = null;

        const CACHE_KEY = 'geniusMapping';
        const CACHE_TIMESTAMP_KEY = 'lastRetrivalTime';
        const CACHE_LIFETIME = 10 * 60 * 1000; // 10 minutes

        function extractVideoId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('v');
        }

        function getCachedMapping(callback) {
            let cachedMapping = GM_getValue(CACHE_KEY, null);
            let timestamp = GM_getValue(CACHE_TIMESTAMP_KEY, 0);
            let now = Date.now();

            if (cachedMapping && (now - timestamp < CACHE_LIFETIME)) {
                console.log('Using Cached CSV');
                callback(cachedMapping);
            } else {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: CSV_URL,
                    onload: function(response) {
                        console.log('New Retrieved CSV:', response.responseText);
                        try {
                            const data = parseCSV(response.responseText, true);
                            GM_setValue(CACHE_KEY, data);
                            GM_setValue(CACHE_TIMESTAMP_KEY, now);
                            callback(data);
                        } catch (e) {
                            console.error('Error parsing CSV:', e);
                        }
                    },
                    onerror: function(error) {
                        console.error('Error fetching mapping:', error);
                    }
                });
            }
        }

        function parseCSV(csvString, skipHeader = false) {
            let rows = csvString
                .trim()
                .split("\n")
                .map(row => row.trim())
                .filter(row => row !== "")
                .map(row => row.split(",").map(item => item.trim()));

            return skipHeader ? rows.slice(1) : rows;
        }


        let geniusTab = null;
        function openGeniusPage(url) {
            if (geniusTab && !geniusTab.closed) {
                // Reuse the already opened Genius tab
                geniusTab.location.href = url;
                // Try to return focus to the current (YouTube) tab
                window.focus();
            } else {
                // Open a new tab and store the reference
                geniusTab = window.open(url, 'genius_tab');
                // Attempt to remove focus from the new tab and bring back YouTube
                try {
                    geniusTab.blur();
                } catch (e) { /* ignore if not allowed */ }
                window.focus();
            }
        }



        function getGeniusUrl(csvArray, videoId) {
            const foundRow = csvArray.find(row => row[0] === videoId);
            return foundRow ? `https://genius.com/${foundRow[1]}` : null;
        }

        function checkAndOpenLyrics() {
            let currentVideoId = extractVideoId();
            console.log('Retrieved YouTube ID:', currentVideoId);

            if (!currentVideoId || currentVideoId === processedVideoId) return;
            processedVideoId = currentVideoId;

            getCachedMapping(function(mapping) {
                const geniusUrl = getGeniusUrl(mapping, currentVideoId);
                if (geniusUrl) {
                    console.log('Retrieved Genius URL:', geniusUrl);
                    openGeniusPage(geniusUrl);
                } else {
                    console.warn('Video ID not found in CSV, not opening Genius.');
                }
            });
        }

        console.log('YouTube Script is starting...');
        setInterval(checkAndOpenLyrics, CHECK_INTERVAL);
    }

    // ---------------------
    // Code for Genius pages
    // ---------------------
    else if (host.includes('genius.com')) {
        const style = document.createElement('style');
        style.innerHTML = `
          /* Set up the main container as a two-column grid with a 5% left margin (for a total 10% gap on the left) */
          #lyrics-root {
              display: grid !important;
              grid-template-columns: 1fr 250px !important;
              gap: 10px;
              margin-left: 5% !important;
              width: 90% !important;
          }

          /* Make the header and footer span both columns */
          #lyrics-root > .LyricsHeader-sc-2146e4fc-1,
          #lyrics-root > .LyricsFooter-sc-c3476ba7-0 {
              grid-column: 1 / -1 !important;
          }

          /* Place all lyrics containers in the left column */
          #lyrics-root > div[data-lyrics-container="true"] {
              grid-column: 1 / 2 !important;
              max-width: none !important;
              width: auto !important;
          }

          /* Place all sidebar blocks in the right column */
          #lyrics-root > .RightSidebar-sc-29f47c92-0 {
              grid-column: 2 / 3 !important;
              width: 250px !important;
          }
        `;
        document.head.appendChild(style);


        // ---------------------
        // Dark Mode Toggle
        // ---------------------
        let darkModeEnabled = GM_getValue('darkMode', false);

        const darkModeStyles = `
            body { background-color: #292929; color: #BAB7BA; }
            .header { background-color: #1f1f1f; }
            .jAzSMw, .cNCMgo { background-color: #333333!important; color: #BAB7BA; }
            .cNXXxk, .dddWnX, .hwdUNy { color: #BAB7BA !important; }
        `;


        const darkModeStyleElement = document.createElement('style');
        darkModeStyleElement.textContent = darkModeStyles;

        function applyDarkMode(state) {
            if (state) {
                document.head.appendChild(darkModeStyleElement);
            } else {
                if (darkModeStyleElement.parentNode) {
                    darkModeStyleElement.parentNode.removeChild(darkModeStyleElement);
                }
            }
        }

        applyDarkMode(darkModeEnabled);

        GM_registerMenuCommand(darkModeEnabled ? 'Disable Dark Mode' : 'Enable Dark Mode', () => {
            darkModeEnabled = !darkModeEnabled;
            GM_setValue('darkMode', darkModeEnabled);
            applyDarkMode(darkModeEnabled);
            location.reload();
        });
    }

})();


