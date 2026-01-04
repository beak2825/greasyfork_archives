// ==UserScript==
// @name         Sleek YouTube Downloader
// @namespace    https://github.com/thisismy-github
// @description  A simple tool that adds YouTube-style buttons for multi-format downloading. Lighter than most download scripts.
// @author       thisismy-github
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/playlist*
// @grant        none
// @license      MIT
// @run-at       document-end
// @version      3.2.0
// @downloadURL https://update.greasyfork.org/scripts/438233/Sleek%20YouTube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/438233/Sleek%20YouTube%20Downloader.meta.js
// ==/UserScript==


// Valid formats: MP4 || MP3, WAV, M4A, WEBM, AAC, FLAC, OPUS, OGG
const buttons = ["MP3", "MP4"];


// There is no consistent variable for border-radius (button roundness) yet.
// Old border-radius: 2px. New border-radius: 20px or higher.
const cssText = `
    .download-button {
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        cursor: pointer;
        background-color: var(--yt-spec-10-percent-layer);
        color: var(--yt-spec-text-secondary);
        padding: var(--yt-button-padding);
        margin: auto var(--ytd-subscribe-button-margin, 4px);
        white-space: nowrap;
        font-size: var(--ytd-tab-system-font-size, 1.4rem);
        font-weight: var(--ytd-tab-system-font-weight, 500);
        letter-spacing: var(--ytd-tab-system-letter-spacing, .007px);
        text-transform: var(--ytd-tab-system-text-transform, uppercase);
    }
    .download-button-text {
        --yt-formatted-string-deemphasize_-_display: initial;
        --yt-formatted-string-deemphasize-color: var(--yt-spec-text-secondary);
        --yt-formatted-string-deemphasize_-_margin-left: 4px;
    }
    .download-button-container {
        display: flex;
        flex-direction: row;
    }
    .download-playlist-button {
        margin-right: 8px;
        margin-left: 0px;
    }
    .download-playlist-button-text {
        color: #E4E4E4;
    }
`;


(function() {
    'use strict';
    window.onload = () => {

        // playlist pages will try to add the buttons repeatedly
        let playlistButtonsAdded = false;

        window.addEventListener("yt-navigate-finish", () => {
            setTimeout(() => {

                // apply css
                const style = document.createElement("style");
                style.type = "text/css";
                style.innerHTML = cssText;
                document.head.appendChild(style);

                // check for playlist and create appropriate query
                let query = "#analytics-button:not(.download-panel)";
                let inPlaylist = location.href.includes("/playlist");
                if (inPlaylist && !playlistButtonsAdded) {
                    query += ", div.metadata-buttons-wrapper:not(.download-panel)";
                    playlistButtonsAdded = true;
                }

                document.querySelectorAll(query).forEach(panel => {

                    // outer container (to flex buttons side-by-side)
                    const container = document.createElement("div");
                    container.classList.add("download-button-container");

                    for (let i = 0; i < buttons.length; i++) {
                        const button = document.createElement("div");        // button
                        button.classList.add("download-button");
                        if (inPlaylist) { button.classList.add("download-playlist-button"); }

                        button.addEventListener("click", () => {             // download function
                            let link = encodeURIComponent(location.href);
                            let format = buttons[i].toLowerCase();
                            if (format === "mp4") { format = "7"; }
                            window.open(`https://loader.to/?link=${ link }&f=${ format }&s=1&e=1&r=loader`);
                        });

                        const buttonText = document.createElement("span");   // button text
                        buttonText.classList.add("download-button-text");
                        if (inPlaylist) { buttonText.classList.add("download-playlist-button-text"); }
                        buttonText.innerHTML = buttons[i];
                        button.appendChild(buttonText);                      // append text to button
                        container.appendChild(button);
                    }

                    panel.classList.add("download-panel");
                    panel.insertBefore(container, panel.firstElementChild);
                });
            }, 200);
        });
    };
})();