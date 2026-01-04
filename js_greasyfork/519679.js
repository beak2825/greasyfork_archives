// ==UserScript==
// @name         DflixFTP CDS & WEB- Player Buttons
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Add IINA, Infuse, VLC, PotPlayer buttons beside Preview or replace Preview button based on URL patterns
// @author       slxls
// @match        https://dflix.discoveryftp.net/s/view/*
// @match        https://*.discoveryftp.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519679/DflixFTP%20CDS%20%20WEB-%20Player%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/519679/DflixFTP%20CDS%20%20WEB-%20Player%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to create buttons with the same style as the preview button
    const createStyledButton = (label, handler) => {
        const btn = document.createElement('div');
        btn.innerText = label;
        btn.className = 'badge badge-fill'; // Same class as the preview button
        btn.style.cssText = 'font-size: 15px; background: darkgray; color: black; margin-left: 5px; cursor: pointer;';
        btn.onclick = handler;
        return btn;
    };

    // Function to handle opening the video with different players
    const openWithPlayer = (playerCommand, videoUrl) => {
        return () => {
            const commandUrl = `${playerCommand}${encodeURIComponent(videoUrl)}`;
            window.open(commandUrl, '_blank');
        };
    };

    // Logic for dflix.discoveryftp.net/s/view/*
    const handleDflixView = () => {
        const previewAnchors = document.querySelectorAll('a[href*="/secure/"]');
        previewAnchors.forEach((previewAnchor) => {
            const videoUrl = previewAnchor.href;

            const iinaButton = createStyledButton('IINA', openWithPlayer('iina://open?url=', videoUrl));
            const infuseButton = createStyledButton('Infuse', openWithPlayer('infuse://x-callback-url/play?url=', videoUrl));
            const vlcButton = createStyledButton('VLC', openWithPlayer('vlc://', videoUrl));
            const potPlayerButton = createStyledButton('PotPlayer', openWithPlayer('potplayer://', videoUrl));

            previewAnchor.parentNode.appendChild(iinaButton);
            previewAnchor.parentNode.appendChild(infuseButton);
            previewAnchor.parentNode.appendChild(vlcButton);
            previewAnchor.parentNode.appendChild(potPlayerButton);
        });

        const viewButtons = document.querySelectorAll('.test3[onclick*="view("]');
        viewButtons.forEach((viewButton) => {
            const onclickAttr = viewButton.getAttribute('onclick');
            const videoUrlMatch = onclickAttr.match(/view\('(.+?)'\)/);
            if (!videoUrlMatch || videoUrlMatch.length < 2) return;
            const videoUrl = videoUrlMatch[1];

            const iinaButton = createStyledButton('Open in IINA', openWithPlayer('iina://open?url=', videoUrl));
            const infuseButton = createStyledButton('Open in Infuse', openWithPlayer('infuse://x-callback-url/play?url=', videoUrl));
            const vlcButton = createStyledButton('Open in VLC', openWithPlayer('vlc://', videoUrl));
            const potPlayerButton = createStyledButton('Open in PotPlayer', openWithPlayer('potplayer://', videoUrl));

            const parent = viewButton.parentNode;
            viewButton.remove();

            parent.appendChild(iinaButton);
            parent.appendChild(infuseButton);
            parent.appendChild(vlcButton);
            parent.appendChild(potPlayerButton);
        });
    };

    // Logic for cds*.discoveryftp.net/*
    const handleCDSView = () => {
        const viewButtons = document.querySelectorAll('.test3[onclick*="view("]');
        viewButtons.forEach((viewButton) => {
            const onclickAttr = viewButton.getAttribute('onclick');
            const videoUrlMatch = onclickAttr.match(/view\('(.+?)'\)/);
            if (!videoUrlMatch || videoUrlMatch.length < 2) return;
            const videoUrl = videoUrlMatch[1];

            const createStyledButton = (label, handler) => {
                const btn = viewButton.cloneNode(true);
                btn.innerText = label;
                btn.removeAttribute('onclick');
                btn.setAttribute('title', label);
                btn.onclick = handler;
                return btn;
            };

            const openWithPlayer = (playerCommand) => {
                return () => {
                    const commandUrl = `${playerCommand}${encodeURIComponent(videoUrl)}`;
                    window.open(commandUrl, '_blank');
                };
            };

            const iinaButton = createStyledButton('Open in IINA', openWithPlayer('iina://open?url='));
            const infuseButton = createStyledButton('Open in Infuse', openWithPlayer('infuse://x-callback-url/play?url='));
            const vlcButton = createStyledButton('Open in VLC', openWithPlayer('vlc://'));
            const potPlayerButton = createStyledButton('Open in PotPlayer', openWithPlayer('potplayer://'));

            const parent = viewButton.parentNode;
            viewButton.remove();

            parent.appendChild(iinaButton);
            parent.appendChild(infuseButton);
            parent.appendChild(vlcButton);
            parent.appendChild(potPlayerButton);
        });
    };

    // Determine which logic to run based on URL
    if (window.location.href.startsWith('https://dflix.discoveryftp.net/s/view/')) {
        handleDflixView();
    } else if (window.location.href.includes('.discoveryftp.net') && window.location.href.startsWith('https://cds')) {
        handleCDSView();
    }
})();
