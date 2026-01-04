// ==UserScript==
// @name         Sussy Links Stream Player
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Play video stream URLs and redirect to PatronReact
// @author       God
// @match        https://www.patreon.com/*
// @grant        GM_xmlhttpRequest
// @icon         https://cdn.discordapp.com/icons/879103759328903289/4bca65635b628c53c71ed94a54d89cfd.webp?size=1024
// @downloadURL https://update.greasyfork.org/scripts/538783/Sussy%20Links%20Stream%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/538783/Sussy%20Links%20Stream%20Player.meta.js
// ==/UserScript==

// Load HLS.js BEFORE running anything else
(function loadHlsThenRun() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = () => main(); // Call your main function after HLS is ready
    document.head.appendChild(script);
})();

function main() {
    'use strict';

    function createButtons() {
        if (document.querySelector('#sussy-play-button') || document.querySelector('#sussy-redirect-button')) {
            console.log('Buttons already exist, skipping creation.');
            return;
        }

        const playButton = document.createElement('button');
        playButton.id = 'sussy-play-button';
        playButton.textContent = '▶ Play HLS Stream';
        playButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateX(-90px);
            padding: 12px 24px;
            font-size: 18px;
            z-index: 9999;
            background: #FF424D;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        const redirectButton = document.createElement('button');
        redirectButton.id = 'sussy-redirect-button';
        redirectButton.textContent = 'Redirect';
        redirectButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateX(90px);
            padding: 12px 24px;
            font-size: 18px;
            z-index: 9999;
            background: #90EE90;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        function setupPlayer(streamUrl) {
            playButton.style.display = 'none';
            redirectButton.style.display = 'none';

            while (document.body.firstChild) {
                document.body.removeChild(document.body.firstChild);
            }
            document.body.appendChild(playButton);
            document.body.appendChild(redirectButton);

            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
                z-index: 9998;
                background: black;
            `;

            const backButton = document.createElement('button');
            backButton.textContent = '✕ Close';
            backButton.style.cssText = `
                position: fixed;
                top: 15px;
                right: 15px;
                padding: 8px 12px;
                z-index: 9999;
                background: rgba(0,0,0,0.7);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 16px;
            `;
            backButton.onclick = () => {
                document.body.removeChild(video);
                document.body.removeChild(backButton);
                playButton.style.display = 'block';
                redirectButton.style.display = 'block';
            };

            document.body.appendChild(video);
            document.body.appendChild(backButton);

            if (Hls.isSupported()) {
                const hls = new Hls({
                    maxBufferLength: 30,
                    maxMaxBufferLength: 600,
                    enableWorker: false
                });

                hls.loadSource(streamUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        alert(`HLS Error: ${data.type}. Try another player.`);
                        backButton.click();
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                video.addEventListener('error', () => {
                    alert('Native HLS failed. Install HLS.js-supported browser.');
                    backButton.click();
                });
            } else {
                alert('Your browser doesn\'t support HLS. Try Firefox with HLS.js.');
                backButton.click();
            }
        }

        playButton.onclick = () => {
            const streamUrl = prompt("Paste stream URL:", "");
            if (streamUrl && (streamUrl.includes('.m3u8') || streamUrl.includes('mux.com'))) {
                setupPlayer(streamUrl);
            } else if (streamUrl) {
                alert("Not a valid HLS stream URL ( for example, must contain .m3u8)");
            }
        };

        redirectButton.onclick = () => {
            const pageSource = document.documentElement.outerHTML;
            const creatorIdMatch = pageSource.match(/"creator":{"data":{"id":"([^"]+)"/);

            if (creatorIdMatch && creatorIdMatch[1]) {
                const creatorId = creatorIdMatch[1];
                window.location.href = `https://www.patronreact.com/channel/${creatorId}`;
            } else {
                alert("Could not find creator ID on this page.");
                console.log('Creator ID not found in page source.');
            }
        };

        document.body.appendChild(playButton);
        document.body.appendChild(redirectButton);
        console.log('Buttons appended to the page.');
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded, creating buttons.');
        createButtons();
    });

    const observer = new MutationObserver((mutations) => {
        console.log('DOM changed, checking for buttons.');
        createButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        console.log('Fallback: Attempting to create buttons after delay.');
        createButtons();
    }, 2000);
}
