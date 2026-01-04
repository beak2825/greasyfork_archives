// ==UserScript==
// @name         Sleek YouTube Downloader
// @namespace    https://github.com/thisismy-github
// @description  A simple tool that adds YouTube-style buttons for multi-format downloading. Lighter than most download scripts.
// @author       thisismy-github
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      MIT
// @run-at       document-end
// @version      3.0.0
// @downloadURL https://update.greasyfork.org/scripts/453522/Sleek%20YouTube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/453522/Sleek%20YouTube%20Downloader.meta.js
// ==/UserScript==


// Valid formats: MP4 || MP3, WAV, M4A, WEBM, AAC, FLAC, OPUS, OGG
const buttons = ["Download video"];


const cssText = `
    .download-button {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        background-color: var(--yt-spec-10-percent-layer);
        color: var(--yt-spec-text-secondary);
        border-radius: 2px;
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
        cursor: grabbing;
    }
`;


(function() {
    'use strict';
    window.onload = () => {
        window.addEventListener("yt-navigate-finish", () => {
            setTimeout(() => {

                // apply css
                const style = document.createElement("style");
                style.type = "text/css";
                style.innerHTML = cssText;
                document.head.appendChild(style);

                document.querySelectorAll("#analytics-button:not(.download-panel)").forEach(panel => {

                    // outer container (to flex buttons side-by-side)
                    const container = document.createElement("div");
                    container.classList.add("download-button-container");

                    for (let i = 0; i < buttons.length; i++) {
                        const button = document.createElement("div");        // button
                        button.classList.add("download-button");

                        button.addEventListener("click", () => {             // download function
                            let format = buttons[i].toLowerCase();
                            if (format === "mp4") { format = "7"; }
                            window.open(`https://ssyoutube.com`);
                        });

                        const buttonText = document.createElement("span");   // button text
                        buttonText.classList.add("download-button-text");
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