// ==UserScript==
// @name         Cobalt Tools (YouTube Playlist Downloader)
// @description  Adds a cobalt.tools button to YouTube playlists, redirecting users to a playlist download page.
// @icon         https://raw.githubusercontent.com/exyezed/cobalt-tools/refs/heads/main/extras/cobalt-tools.png
// @version      1.2
// @author       exyezed
// @namespace    https://github.com/exyezed/cobalt-tools/
// @supportURL   https://github.com/exyezed/cobalt-tools/issues
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529719/Cobalt%20Tools%20%28YouTube%20Playlist%20Downloader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529719/Cobalt%20Tools%20%28YouTube%20Playlist%20Downloader%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_RETRIES = 5;
    const RETRY_DELAY = 1000;
    let retryCount = 0;

    function createSVGElement(tag, attrs) {
        const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [key, value] of Object.entries(attrs)) {
            elem.setAttribute(key, value);
        }
        return elem;
    }

    function getPlaylistId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('list');
    }

    function createCobaltPlaylistBtn() {
        var existingButton = document.getElementById("cobaltPlaylistBtn");
        if (existingButton) {
            return existingButton;
        }

        var button = document.createElement("span");
        button.id = "cobaltPlaylistBtn";
        button.setAttribute("aria-label", "Cobalt Playlist");
        
        var svg = createSVGElement('svg', {
            width: '16',
            height: '12',
            viewBox: '0 0 24 16',
            fill: 'currentColor'
        });

        var path1 = createSVGElement('path', {
            d: 'M0 15.6363L0 12.8594L9.47552 8.293L0 3.14038L0 0.363525L12.8575 7.4908V9.21862L0 15.6363Z'
        });

        var path2 = createSVGElement('path', {
            d: 'M11.1425 15.6363V12.8594L20.6181 8.293L11.1425 3.14038V0.363525L24 7.4908V9.21862L11.1425 15.6363Z'
        });

        svg.appendChild(path1);
        svg.appendChild(path2);
        button.appendChild(svg);
        
        button.style.cssText = `
            cursor: pointer;
            width: 40px;
            height: 40px;
            background-color: transparent;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            padding: 0;
            position: relative;
            transition: background-color 0.1s;
            color: var(--yt-spec-text-primary);
        `;

        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });

        button.addEventListener('click', function() {
            const playlistId = getPlaylistId();
            if (playlistId) {
                window.open(`https://cobaltapis.vercel.app/playlist/${playlistId}`, '_blank');
            }
        });

        return button;
    }

    function insertButton() {
        if (retryCount >= MAX_RETRIES) {
            console.log("Max retries reached. Stopping insertion attempts.");
            return;
        }

        var button = createCobaltPlaylistBtn();
        var targetElement = document.querySelector("#secondary #playlist-actions #start-actions #top-level-buttons-computed");
        
        if (targetElement && !targetElement.contains(button)) {
            targetElement.appendChild(button);
            console.log("Cobalt Playlist button successfully inserted.");
            retryCount = 0;
        } else if (!targetElement) {
            console.log(`Target element not found. Retry attempt ${retryCount + 1}/${MAX_RETRIES}`);
            retryCount++;
            if (retryCount < MAX_RETRIES) {
                setTimeout(insertButton, RETRY_DELAY);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        insertButton();
    }

    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            retryCount = 0;
            setTimeout(insertButton, RETRY_DELAY);
        }
    });

    urlObserver.observe(document, {subtree: true, childList: true});
    console.log('Cobalt Tools (YouTube Playlist Downloader) is running');
})();