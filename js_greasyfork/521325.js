// ==UserScript==
// @name         EPG.PW Stream Player
// @namespace    https://greasyfork.org/en/users/781396
// @version      0.2
// @description  Open stream links on a draggable HLS Player 😜
// @author       YAD
// @match        https://epg.pw/livestreams/*
// @license      MIT
// @grant        none
// @icon         https://epg.pw/static/bulma/images/logo-32.png
// @downloadURL https://update.greasyfork.org/scripts/521325/EPGPW%20Stream%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/521325/EPGPW%20Stream%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to dynamically load HLS.js
    function loadHlsJs(callback) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Create player container
    const playerContainer = document.createElement('div');
    playerContainer.id = 'playerContainer';
    playerContainer.style.position = 'fixed';
    playerContainer.style.top = '50px';
    playerContainer.style.right = '10px';
    playerContainer.style.width = '500px';
    playerContainer.style.backgroundColor = '#333';
    playerContainer.style.border = '1px solid #555';
    playerContainer.style.color = '#fff';
    playerContainer.style.padding = '10px';
    playerContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    playerContainer.style.display = 'none';
    playerContainer.style.zIndex = 1000;
    document.body.appendChild(playerContainer);

    // Make player container draggable
    playerContainer.style.cursor = 'move';
    let isDragging = false, xOffset = 0, yOffset = 0;

    playerContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        xOffset = e.clientX - playerContainer.offsetLeft;
        yOffset = e.clientY - playerContainer.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            playerContainer.style.left = `${e.clientX - xOffset}px`;
            playerContainer.style.top = `${e.clientY - yOffset}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginBottom = '10px';
    closeButton.style.backgroundColor = '#444';
    closeButton.style.color = '#fff';
    playerContainer.appendChild(closeButton);

    // Create video element
    const player = document.createElement('video');
    player.id = 'player';
    player.width = 500;
    player.controls = true;
    playerContainer.appendChild(player);

    // Close player on button click
    closeButton.addEventListener('click', () => {
        player.pause();
        player.src = '';
        playerContainer.style.display = 'none';
    });

    // Add click event to stream links
    document.querySelectorAll('a[href$=".m3u8"], a[href$=".cts"], a[href$=".ts"], a[href$=".ctv"]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            let streamUrl = link.href;

            // Replace .ctv with .m3u8
            if (streamUrl.endsWith('.ctv')) {
                streamUrl = streamUrl.replace('.ctv', '.m3u8');
            }

            if (streamUrl.endsWith('.m3u8')) {
                loadHlsJs(() => {
                    // Use HLS.js to play the stream
                    if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource(streamUrl);
                        hls.attachMedia(player);
                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                            player.play();
                        });
                    } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
                        player.src = streamUrl;
                        player.addEventListener('loadedmetadata', () => {
                            player.play();
                        });
                    }
                });
            } else if (streamUrl.endsWith('.cts') || streamUrl.endsWith('.ts')) {
                player.src = streamUrl;
                player.addEventListener('loadedmetadata', () => {
                    player.play();
                });
            }

            playerContainer.style.display = 'block';
        });
    });
})();
