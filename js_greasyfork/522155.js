// ==UserScript==
// @name         EromeDL
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Download videos from EROME with ease, bypassing download restrictions.
// @author       BLOCKCHAIN021
// @match        https://*.erome.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @icon         https://simp6.jpg5.su/images3/Captura-de-tela-2024-12-28-225950f9d0bb2acb8ae452.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522155/EromeDL.user.js
// @updateURL https://update.greasyfork.org/scripts/522155/EromeDL.meta.js
// ==/UserScript==

/*
 * Aviso Legal:
 *
 * Este script é fornecido "no estado em que se encontra", sem garantias de qualquer tipo, expressas ou implícitas.
 * O uso deste script é de inteira responsabilidade do usuário. Certifique-se de que a utilização está de acordo
 * com as políticas do site e as leis locais. O autor não se responsabiliza por quaisquer danos ou violações decorrentes
 * do uso deste script.
 *
 *
 * Legal Disclaimer:
 *
 * This script is provided "as is," without any warranties, express or implied.
 * The use of this script is entirely at the user's own risk. Ensure that its use complies
 * with the site's policies and local laws. The author is not responsible for any damages
 * or violations resulting from the use of this script.
 */


(function () {
    'use strict';

    // Helper function to create styled buttons
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'absolute';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '12px 18px';
        button.style.backgroundColor = '#28a745';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0px 5px 10px rgba(0, 0, 0, 0.2)';
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#218838';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#28a745';
        });
        button.onclick = onClick;
        return button;
    }

    // Function to add download buttons to videos
    function addDownloadButtons() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.parentNode.querySelector('.download-button')) {
                const downloadButton = createButton('Download', () => downloadVideo(video));
                downloadButton.className = 'download-button';
                video.parentNode.style.position = 'relative'; // Ensure parent has relative position for button placement
                video.parentNode.appendChild(downloadButton);
            }
        });
    }

    // Function to download video
    function downloadVideo(video) {
        let videoUrl = '';

        // Attempt to get URL from <source> tag
        const sourceTag = video.querySelector('source');
        if (sourceTag && sourceTag.src) {
            videoUrl = sourceTag.src;
        }

        // Fallback: Try direct video attributes
        if (!videoUrl) {
            videoUrl = video.src || video.getAttribute('data-src') || '';
        }

        // Advanced Fallback: Attempt to fetch video URL via GM_xmlhttpRequest
        if (!videoUrl) {
            const videoId = video.id;
            const config = video.getAttribute('data-setup');
            if (config) {
                try {
                    const parsedConfig = JSON.parse(config.replace(/&quot;/g, '"'));
                    if (parsedConfig.poster) {
                        videoUrl = parsedConfig.poster.replace(/\.jpg$/, '_720p.mp4');
                    }
                } catch (e) {
                    console.error('Failed to parse video config:', e);
                }
            }
        }

        // Log the URL to the console for debugging
        console.log('Video URL:', videoUrl);

        // If URL is found, attempt download
        if (videoUrl) {
            openVideoInNewTab(videoUrl);
        } else {
            alert('Could not locate the video URL. Please ensure the video is loaded.');
        }
    }

    // Function to open video in a new tab with styling
    function openVideoInNewTab(videoUrl) {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head>
                    <title>Video</title>
                    <style>
                        body {
                            margin: 0;
                            background-color: black;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                        video {
                            max-width: 90%;
                            max-height: 90%;
                            object-fit: contain;
                        }
                    </style>
                </head>
                <body>
                    <video controls autoplay>
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </body>
            </html>
        `);
    }

    // Observe DOM changes to dynamically add buttons
    const observer = new MutationObserver(() => addDownloadButtons());
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to add buttons
    addDownloadButtons();
})();
