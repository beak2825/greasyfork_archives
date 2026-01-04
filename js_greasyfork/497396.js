// ==UserScript==
// @name         Streamtape Direct Downloader
// @namespace    StreamtapeDownloader
// @version      1.0
// @author       sharmanhall
// @description  Streamtape Video Downloader with direct URL resolution
// @match        *://streamtape.com/*
// @match        *://streamtape.xyz/*
// @match        *://streamtape.to/*
// @match        *://streamtape.net/*
// @match        *://streamtape.site/*
// @match        *://streamtape.cc/*
// @match        *://tapecontent.net/*
// @match        *://streamadblockplus.com/*
// @match        *://streamta.pe/*
// @match        *://strtape.cloud/*
// @match        *://strtape.site/*
// @match        *://strtapeadblock.club/*
// @match        *://strcloud.link/*
// @match        *://strcloud.club/*
// @match        *://strcloud.in/*
// @match        *://tapeadsenjoyer.com/*
// @match        *://gettapeads.com/*
// @match        *://streamtape.com/*
// @match        *://tapelovesads.org/*
// @match        https://streamtape.com/*
// @match        https://streamadblocker.xyz/*
// @match        https://*.tapecontent.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=streamtape.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/497396/Streamtape%20Direct%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/497396/Streamtape%20Direct%20Downloader.meta.js
// ==/UserScript==

console.log("StreamtapeDownloader");

function checkVideoSrc() {
    const mainVideo = document.querySelector('#mainvideo');
    const subheadingParent = document.querySelector('.subheading').parentNode;

    if (mainVideo) {
        const videoSrc = mainVideo.src;

        if (videoSrc) {
            console.log("Video source found:", videoSrc);

            if (!document.getElementById('downloadsDiv')) {
                const downloadsDiv = document.createElement('div');
                //downloadsDiv.id = 'downloadsDiv';
                //downloadsDiv.style.border = '2px solid blue';
                //downloadsDiv.style.borderRadius = '7.5px';
                //downloadsDiv.style.marginTop = '10px';

                const openInTabDiv = document.createElement('div');
                openInTabDiv.style.border = '2px solid blue';
                openInTabDiv.style.borderRadius = '7.5px';
                openInTabDiv.style.marginTop = '10px';

                const downloadDiv = document.createElement('div');
                downloadDiv.style.border = '2px solid blue';
                downloadDiv.style.borderRadius = '7.5px';
                downloadDiv.style.marginTop = '10px';

                const resolveDiv = document.createElement('div');
                resolveDiv.style.border = '2px solid blue';
                resolveDiv.style.borderRadius = '7.5px';
                resolveDiv.style.marginTop = '10px';

                const openInTabButton = document.createElement('a');
                openInTabButton.innerText = 'Open in New Tab';
                openInTabButton.setAttribute('href', videoSrc);
                openInTabButton.setAttribute('target', '_blank');
                openInTabButton.style.display = 'block';
                openInTabButton.style.marginTop = '5px';

                const downloadButton = document.createElement('a');
                downloadButton.innerText = 'Download';
                const downloadSrc = videoSrc;
                downloadButton.setAttribute('href', downloadSrc);
                downloadButton.setAttribute('download', '');
                downloadButton.style.display = 'block';
                downloadButton.style.marginTop = '5px';

                const resolveButton = document.createElement('a');
                resolveButton.innerText = 'Click here to generate direct URL';
                resolveButton.style.display = 'block';
                resolveButton.style.marginTop = '5px';

                // Function to resolve the final download URL
                resolveButton.addEventListener('click', async function(event) {
                    event.preventDefault();
                    try {
                        const response = await fetch(videoSrc);
                        if (response.ok) {
                            const resolvedURL = response.url;
                            window.open(resolvedURL, '_blank');
                            resolveButton.setAttribute('href', resolvedURL);
                            resolveButton.setAttribute('download', '');
                        } else {
                            console.error('Failed to resolve URL');
                        }
                    } catch (error) {
                        console.error('Error resolving URL:', error);
                    }
                });

                openInTabDiv.appendChild(openInTabButton);
                downloadDiv.appendChild(downloadButton);
                resolveDiv.appendChild(resolveButton);

                downloadsDiv.appendChild(openInTabDiv);
                downloadsDiv.appendChild(downloadDiv);
                downloadsDiv.appendChild(resolveDiv);

                subheadingParent.appendChild(downloadsDiv);

                // Stop the interval once buttons are created
                clearInterval(intervalId);
            } else {
                console.log("Buttons already exist. Skipping creation.");
            }

        } else {
            console.log("Video source not found. Retrying...");
        }
    } else {
        console.log("Main video element not found. Retrying...");
    }
}

// Initial check
checkVideoSrc();

// Check every second until the buttons are created
const intervalId = setInterval(checkVideoSrc, 1000);

console.log("StreamtapeDownloader script loaded.");
