// ==UserScript==
// @name         Suno AI Download Button
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Adds a download button to Suno.ai audio player
// @author       Lyte
// @match        https://app.suno.ai/
// @match        https://suno.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.ai
// @grant        none
// @license      CC-BY 4.0; https://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/491933/Suno%20AI%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/491933/Suno%20AI%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        const selector = 'body > div.css-fhtuey > div.css-bhm5u7 > div > div.css-l9hfgy > div.css-18kfqph > div.chakra-stack.css-18y9vo3';
        const buttonsContainer = document.querySelector(selector);

        if (buttonsContainer) {
            const audioElement = document.querySelector('audio:not([src*="silence.mp3"])');

            if (audioElement && audioElement.src) {
                const audioLink = audioElement.src;

                const existingDownloadButton = buttonsContainer.querySelector('.download-button');
                if (existingDownloadButton) {
                    existingDownloadButton.setAttribute('data-audio-link', audioLink);
                } else {
                    const downloadButton = document.createElement('button');
                    downloadButton.setAttribute('data-theme', 'dark');
                    downloadButton.setAttribute('type', 'button');
                    downloadButton.setAttribute('class', 'chakra-button css-oj2z91 download-button');
                    downloadButton.setAttribute('aria-label', 'Download');
                    downloadButton.setAttribute('data-audio-link', audioLink);
                    downloadButton.innerHTML = `
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                        </svg>`;

                    downloadButton.addEventListener('click', function() {
                        const audioLink = this.getAttribute('data-audio-link');
                        window.open(audioLink, '_blank');
                    });

                    buttonsContainer.appendChild(downloadButton);
                }
            } else {
                const existingDownloadButton = buttonsContainer.querySelector('.download-button');
                if (existingDownloadButton) {
                    existingDownloadButton.remove();
                }
            }
        }
    }

    const observer = new MutationObserver(function(mutations) {
        addDownloadButton();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    addDownloadButton();
})();