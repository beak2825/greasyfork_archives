// ==UserScript==
// @name         RedGifs Downloader
// @namespace    http://tampermonkey.net/
// @version      2024-02-26
// @description  Adds a download button on every video, that downloads the video from the RedGifs iframe page when clicked
// @author       NoodleDude
// @match        https://www.redgifs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redgifs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488350/RedGifs%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/488350/RedGifs%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname.includes('/ifr/')) {

        // Create and display the overlay
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            zIndex: '10000',
        });
        overlay.textContent = 'Finding video on page...';
        document.body.appendChild(overlay);
        document.querySelector("body").style.overflow = "hidden"

        function downloadVideo() {
            document.querySelector("body").style.overflow = "hidden"
            const video = document.querySelector('video');
            if (video) {
                const urlParts = window.location.pathname.split('/');
                const slug = urlParts[urlParts.length - 1];
                const title = document.title;
                const creatorPrefixIndex = title.indexOf('by ');
                let creator = '';
                if (creatorPrefixIndex !== -1) {
                    creator = title.substring(creatorPrefixIndex + 3);
                }

                // Check if the video source includes 'mobile'
                if (video.src.includes('mobile')) {
                    overlay.textContent = 'Switching quality to HD...';
                    // Attempt to change the video quality
                    try {
                        document.querySelector(".gifQuality").parentElement.click();
                    } catch (e) {
                        console.error('Error clicking quality switch:', e);
                    }

                    // Remove overlay and retry after 500ms
                    document.body.removeChild(overlay);
                    setTimeout(downloadVideo, 500);
                    return; // Exit the function to prevent further execution
                }

                overlay.textContent = 'Fetching video, this may take a minute...';

                fetch(video.src).then(response => {
                    const contentLength = response.headers.get('Content-Length');
                    if (!response.body || !contentLength) {
                        console.error('Download progress cannot be tracked.');
                        return;
                    }

                    const totalBytes = parseInt(contentLength, 10);
                    let receivedBytes = 0;
                    const reader = response.body.getReader();
                    const stream = new ReadableStream({
                        start(controller) {
                            function read() {
                                reader.read().then(({done, value}) => {
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    receivedBytes += value.length;
                                    // Convert bytes to MB for display
                                    const receivedMB = (receivedBytes / 1e6).toFixed(2);
                                    const totalMB = (totalBytes / 1e6).toFixed(2);
                                    overlay.textContent = `Downloading: ${receivedMB}MB / ${totalMB}MB`;
                                    controller.enqueue(value);
                                    read();
                                }).catch(error => {
                                    console.error('Error reading video stream', error);
                                    controller.error(error);
                                });
                            }
                            read();
                        }
                    });
                    return new Response(stream).blob();
                }).then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `${slug} - ${creator}.mp4`;
                    document.body.appendChild(a);
                    a.click();
                    overlay.textContent = 'Video downloaded. Feel free to close this popup.';
                }).catch(err => {
                    console.error('Error in fetching video:', err);
                    overlay.textContent = 'Failed to download video. Please try again.';
                });
            } else {
                console.error('No video found, retrying in 500ms');
                setTimeout(downloadVideo, 500);
            }
        }

        setTimeout(downloadVideo, 500);

    } else {

        function enhancePlayers() {
            const players = document.querySelectorAll('.Player');

            players.forEach(player => {
                const id = player.id;
                if (!id.includes('gif_')) return;

                const slug = id.replace('gif_', '');
                const navGroup = player.querySelector('.SideBar');

                // Check if the download button has already been added
                if (navGroup && !navGroup.querySelector('.downloadButton')) {
                    const li = document.createElement('li');
                    li.className = 'SideBar-Item downloadButton'; // Added class 'downloadButton' here

                    const button = document.createElement('button');
                    button.className = 'rg-button icon';

                    button.innerHTML = `<svg style="margin-top: 8px" width="28px" height="28px" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m6.864 3.424c.502-.301 1.136.063 1.136.642 0 .264-.138.509-.365.644-2.476 1.486-4.135 4.197-4.135 7.292 0 4.691 3.808 8.498 8.498 8.498s8.497-3.807 8.497-8.498c0-3.093-1.656-5.803-4.131-7.289-.225-.136-.364-.38-.364-.644 0-.582.635-.943 1.137-.642 2.91 1.748 4.858 4.936 4.858 8.575 0 5.519-4.479 9.998-9.997 9.998s-9.998-4.479-9.998-9.998c0-3.641 1.951-6.83 4.864-8.578zm.831 8.582s2.025 2.021 3.779 3.774c.147.147.339.22.53.22.192 0 .384-.073.531-.22 1.753-1.752 3.779-3.775 3.779-3.775.145-.145.217-.336.217-.526 0-.192-.074-.384-.221-.531-.292-.293-.766-.294-1.056-.004l-2.5 2.499v-10.693c0-.414-.336-.75-.75-.75s-.75.336-.75.75v10.693l-2.498-2.498c-.289-.289-.762-.286-1.054.006-.147.147-.221.339-.222.531 0 .19.071.38.215.524z" fill-rule="nonzero" fill="white"/></svg>`;

                    button.onclick = function() {
                        window.open(`https://www.redgifs.com/ifr/${slug}`, 'newwindow', 'width=640, height=400', "popup");
                        return false;
                    };

                    li.appendChild(button);
                    navGroup.appendChild(li);
                }
            });
        }

        setInterval(enhancePlayers, 500);
    }
})();
