// ==UserScript==
// @name         Use Old YouTube Color Palette
// @namespace    https://greasyfork.org/en/scripts/513941-use-old-youtube-color-palette
// @version      1.3
// @description  Change the new YouTube color palette to the old color palette.
// @author       Tanuki
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/8fa11322/img/favicon_144x144.png
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513941/Use%20Old%20YouTube%20Color%20Palette.user.js
// @updateURL https://update.greasyfork.org/scripts/513941/Use%20Old%20YouTube%20Color%20Palette.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Favicon url
    const FAVICON_URL = "https://www.youtube.com/s/desktop/8fa11322/img/favicon_144x144.png";
    // Define the CSS rule to inject
    const TANMOD_CSS = `
        *[fill="#FF0033"] {
            fill: #FE0000 !important;
        }
        #endpoint > tp-yt-paper-item > yt-icon.guide-entry-badge.style-scope.ytd-guide-entry-renderer > span > div {
            color: #FE0000 !important;
            fill: #FE0000 !important;
        }
        #button > yt-icon-badge-shape > div > div.yt-spec-icon-badge-shape__badge {
            color: #f1f1f1 !important;
            background-color: #FE0000 !important;
        }
        #scrubber > desktop-shorts-player-controls > div > yt-progress-bar > div > div > yt-progress-bar-playhead > div,
        #scrubber > desktop-shorts-player-controls > div > yt-progress-bar > div > div > yt-progress-bar-line > div > div.YtProgressBarLineProgressBarPlayed.YtProgressBarLineProgressBarPlayedRefresh {
            background: #FE0000 !important;
        }
        .html5-play-progress,
        .ytp-play-progress,
        .html5-scrubber-button,
        .ytp-scrubber-button {
            background: #FE0000 !important;
        }
    }
    `;

    function changeFavicon(new_favicon_url) {
        // Select the first favicon link element, if available.
        const favicon = document.querySelector("link[rel='shortcut icon']");
        // Collect all link elements with either 'shortcut icon' or 'icon' in their rel attribute.
        [favicon, ...document.querySelectorAll("link[rel='icon']")].forEach(favicon => {
            favicon.remove(); // Remove each icon element to avoid duplicates.
        })

        // Clone Favicon Node
        const newFavicon = favicon.cloneNode();
        newFavicon.href = new_favicon_url;
        // Append the updated favicon to the document head.
        document.head.appendChild(newFavicon);
    }

    // Function to add global CSS by creating a <style> tag
    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.classList.add('tanuki-mod-style'); // Unique class for easy checking
        style.textContent = css;
        document.head.appendChild(style);
        console.log("CSS has been successfully injected!");
    }

    // Inject Favicon initially
    changeFavicon(FAVICON_URL);
    // Inject CSS initially
    addGlobalStyle(TANMOD_CSS);

    // Use MutationObserver to re-inject CSS on DOM changes
    const observer = new MutationObserver(() => {
        if (!document.querySelector('.tanuki-mod-style')) {
            addGlobalStyle(TANMOD_CSS); // Reapply if removed
        }
    });

    // Observe changes in the entire document body
    observer.observe(document.body, { childList: true, subtree: true });

})();
