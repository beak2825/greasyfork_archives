// ==UserScript==
// @name         Streamtape Direct Downloader
// @namespace    StreamtapeDownloader
// @version      1.1
// @author       sharmanhall
// @description  Streamtape Video Downloader with direct URL resolution
// @icon         https://www.google.com/s2/favicons?sz=64&domain=streamtape.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @match        *://*.adblockeronstape.com/*
// @match        *://*.adblockeronstape.xyz/*
// @match        *://*.adblockeronstape.site/*
// @match        *://*.adblockeronstape.net/*
// @match        *://*.adblockplustape.com/*
// @match        *://*.adblockplustape.xyz/*
// @match        *://*.adblockplustape.site/*
// @match        *://*.adblockplustape.net/*
// @match        *://*.adblockstreamtape.com/*
// @match        *://*.adblockstreamtape.xyz/*
// @match        *://*.adblockstreamtape.site/*
// @match        *://*.adblockstreamtape.net/*
// @match        *://*.adblockstrtape.com/*
// @match        *://*.adblockstrtape.xyz/*
// @match        *://*.adblockstrtape.site/*
// @match        *://*.adblockstrtape.net/*
// @match        *://*.adblockstrtech.com/*
// @match        *://*.adblockstrtech.xyz/*
// @match        *://*.adblockstrtech.site/*
// @match        *://*.adblockstrtech.net/*
// @match        *://*.advertape.net/*
// @match        *://*.advertisertape.com/*
// @match        *://*.antiadtape.com/*
// @match        *://*.antiadtape.xyz/*
// @match        *://*.antiadtape.site/*
// @match        *://*.antiadtape.net/*
// @match        *://*.gettapeads.com/*
// @match        *://*.noblocktape.com/*
// @match        *://*.noblocktape.xyz/*
// @match        *://*.noblocktape.site/*
// @match        *://*.noblocktape.net/*
// @match        *://*.shavetape.com/*
// @match        *://*.shavetape.xyz/*
// @match        *://*.shavetape.site/*
// @match        *://*.shavetape.net/*
// @match        *://*.shavetape.cash/*
// @match        *://*.stapadblockuser.com/*
// @match        *://*.stapadblockuser.xyz/*
// @match        *://*.stapadblockuser.site/*
// @match        *://*.stapadblockuser.net/*
// @match        *://*.stape.com/*
// @match        *://*.stape.xyz/*
// @match        *://*.stape.site/*
// @match        *://*.stape.net/*
// @match        *://*.stape.fun/*
// @match        *://*.strcloud.com/*
// @match        *://*.strcloud.xyz/*
// @match        *://*.strcloud.site/*
// @match        *://*.strcloud.net/*
// @match        *://*.strcloud.link/*
// @match        *://*.strcloud.club/*
// @match        *://*.strcloud.in/*
// @match        *://*.streamadblocker.com/*
// @match        *://*.streamadblocker.xyz/*
// @match        *://*.streamadblocker.site/*
// @match        *://*.streamadblocker.net/*
// @match        *://*.streamadblockplus.com/*
// @match        *://*.streamadblockplus.xyz/*
// @match        *://*.streamadblockplus.site/*
// @match        *://*.streamadblockplus.net/*
// @match        *://*.streamnoads.com/*
// @match        *://*.streamta.com/*
// @match        *://*.streamta.xyz/*
// @match        *://*.streamta.site/*
// @match        *://*.streamta.net/*
// @match        *://*.streamta.pe/*
// @match        *://*.streamtape.com/*
// @match        *://*.streamtape.xyz/*
// @match        *://*.streamtape.to/*
// @match        *://*.streamtape.net/*
// @match        *://*.streamtape.site/*
// @match        *://*.streamtape.cc/*
// @match        *://*.streamtapeadblock.com/*
// @match        *://*.streamtapeadblock.xyz/*
// @match        *://*.streamtapeadblock.site/*
// @match        *://*.streamtapeadblock.net/*
// @match        *://*.streamtapeadblockuser.com/*
// @match        *://*.streamtapeadblockuser.xyz/*
// @match        *://*.streamtapeadblockuser.site/*
// @match        *://*.streamtapeadblockuser.net/*
// @match        *://*.strtape.com/*
// @match        *://*.strtape.xyz/*
// @match        *://*.strtape.site/*
// @match        *://*.strtape.net/*
// @match        *://*.strtape.cloud/*
// @match        *://*.strtapeadblock.com/*
// @match        *://*.strtapeadblock.xyz/*
// @match        *://*.strtapeadblock.site/*
// @match        *://*.strtapeadblock.net/*
// @match        *://*.strtapeadblock.club/*
// @match        *://*.strtapeadblocker.com/*
// @match        *://*.strtapeadblocker.xyz/*
// @match        *://*.strtapeadblocker.site/*
// @match        *://*.strtapeadblocker.net/*
// @match        *://*.strtapewithadblock.com/*
// @match        *://*.strtapewithadblock.xyz/*
// @match        *://*.strtapewithadblock.site/*
// @match        *://*.strtapewithadblock.net/*
// @match        *://*.strtpe.com/*
// @match        *://*.strtpe.xyz/*
// @match        *://*.strtpe.site/*
// @match        *://*.strtpe.net/*
// @match        *://*.strtpe.link/*
// @match        *://*.tapeadsenjoyer.com/*
// @match        *://*.tapeadvertisement.com/*
// @match        *://*.tapeantiads.com/*
// @match        *://*.tapeblocker.com/*
// @match        *://*.tapecontent.net/*
// @match        *://*.tapelovesads.org/*
// @match        *://*.tapenoads.com/*
// @match        *://*.tapepops.com/*
// @match        *://*.tapewithadblock.org/*
// @match        *://*.watchadsontape.com/*
// @downloadURL https://update.greasyfork.org/scripts/497396/Streamtape%20Direct%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/497396/Streamtape%20Direct%20Downloader.meta.js
// ==/UserScript==

console.log("StreamtapeDownloader");

function checkVideoSrc() {
    const mainVideo = document.querySelector('#mainvideo');
    const subheadingParent = document.querySelector('.subheading')?.parentNode;

    if (mainVideo && subheadingParent) {
        const videoSrc = mainVideo.src;

        if (videoSrc) {
            console.log("Video source found:", videoSrc);

            if (!document.getElementById('downloadsDiv')) {
                const downloadsDiv = document.createElement('div');
                downloadsDiv.id = 'downloadsDiv';

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
                resolveButton.style.cursor = 'pointer';

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