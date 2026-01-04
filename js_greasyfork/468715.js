// ==UserScript==
// @name         YouTube Script Downloader Button
// @description  Adds a button that passes the URL to youtubetranscript.com for the transcript
// @author       dhaden
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      MIT
// @run-at       document-end
// @version      1.0
// @namespace https://greasyfork.org/users/186630
// @downloadURL https://update.greasyfork.org/scripts/468715/YouTube%20Script%20Downloader%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/468715/YouTube%20Script%20Downloader%20Button.meta.js
// ==/UserScript==

const buttons = ["Script"];

// The YouTube styled button in CSS
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
        margin: auto var(--ytd-subscribe-button-margin, 12px);
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

                // apply CSS
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

                    // make an outer div container (to flex buttons side-by-side)
                    const container = document.createElement("div");
                    container.classList.add("download-button-container");

                    for (let i = 0; i < buttons.length; i++) {
                        const button = document.createElement("div");             // the button
                        button.classList.add("download-button");
                        if (inPlaylist) { button.classList.add("download-playlist-button"); }

                        button.addEventListener("click", () => {                  // passthrough function
                            let link = (window.location.search);                  // get the search portion of the current URL
                            let linkbase = "https://www.youtubetranscript.com/";  // get the base domain part of the current URL
                            var string_url = linkbase + link;                     // combine them together without /watch
                            (function (change) {
                                window.location = string_url;                     // click the button and the Web link becomes the new combo URL
                            })();
                        });

                        const buttonText = document.createElement("span");        // button text
                        buttonText.classList.add("download-button-text");
                        if (inPlaylist) { buttonText.classList.add("download-playlist-button-text"); }
                        buttonText.innerHTML = buttons[i];
                        button.appendChild(buttonText);                           // append text to button
                        container.appendChild(button);
                    }

                    panel.classList.add("download-panel");
                    panel.insertBefore(container, panel.firstElementChild);
                });
            }, 200);
        });
    };
})();