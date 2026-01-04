// ==UserScript==
// @name         Spotify Downloader with Lucida
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automates Spotify link submission to Lucida downloader and auto-scrolls the Lucida page undetected.
// @author       UniverseDev
// @license      GPL-3.0-or-later
// @match        *://open.spotify.com/*
// @match        https://lucida.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520648/Spotify%20Downloader%20with%20Lucida.user.js
// @updateURL https://update.greasyfork.org/scripts/520648/Spotify%20Downloader%20with%20Lucida.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes('open.spotify.com')) {
        const style = document.createElement('style');

        style.innerText = `
        [role='grid'] {
            margin-left: 50px;
        }

        [data-testid='tracklist-row'] {
            position: relative;
        }

        .btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 0;
            background-color: #1fdf64;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"/><path d="M10 15l5-6h-4V1H9v8H5l5 6z"/></svg>');
            background-position: center;
            background-repeat: no-repeat;
            cursor: pointer;
        }

        .btn:hover {
            transform: scale(1.1);
        }

        [data-testid='tracklist-row'] .btn {
            position: absolute;
            top: 50%;
            right: 100%;
            margin-top: -20px;
            margin-right: 10px;
        }
        `;

        document.body.appendChild(style);

        function getTrackURI(trackElement) {
            const link = trackElement.querySelector('a[href*="/track/"]');
            return link ? link.getAttribute('href').split('/track/')[1] : null;
        }

        function addButton(track) {
            const button = document.createElement('button');
            button.className = 'btn';
            button.onclick = () => {
                const trackURI = getTrackURI(track);
                if (trackURI) {
                    const spotifyLink = `https://open.spotify.com/track/${trackURI}`;
                    window.open(`https://lucida.to?url=${encodeURIComponent(spotifyLink)}`, '_blank');
                } else {
                    console.error("Failed to retrieve track URI.");
                }
            };
            track.appendChild(button);
            track.dataset.hasButton = 'true';
        }

        function animate() {
            const tracks = document.querySelectorAll('[data-testid="tracklist-row"]');
            tracks.forEach(track => {
                if (!track.dataset.hasButton) {
                    addButton(track);
                }
            });
        }

        setInterval(animate, 1000);
    }

    if (window.location.href.includes('lucida.to')) {
        window.addEventListener('load', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const spotifyLink = urlParams.get('url');

            if (spotifyLink) {
                const inputField = document.querySelector('input#download');
                const goButton = document.querySelector('button#go');

                if (inputField && goButton) {
                    inputField.value = spotifyLink;
                    goButton.click();
                }
            }

            const scrollInterval = setInterval(() => {
                window.scrollBy(0, 100);
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    clearInterval(scrollInterval);
                }
            }, 100);
        });
    }
})();