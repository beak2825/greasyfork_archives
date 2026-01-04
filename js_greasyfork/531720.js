// ==UserScript==
// @name        BHD Pop-up Player for YT Trailers
// @namespace   Violentmonkey Scripts
// @match       https://beyond-hd.me/library/title/*
// @match       https://beyond-hd.me/torrents/*
// @grant       none
// @version     1.0
// @author      CodeX0
// @license     MIT
// @description A pop-up player for YouTube trailer video on the BHD title page.
// @downloadURL https://update.greasyfork.org/scripts/531720/BHD%20Pop-up%20Player%20for%20YT%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/531720/BHD%20Pop-up%20Player%20for%20YT%20Trailers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[BHD Trailer Pop-Up Player] - Script loaded.");

    const videoLinkSelector = 'a[href*="youtube.com/watch"]';

    let popup = null;

    function extractVideoUrl(redirectUrl) {
        console.log("[BHD Trailer Pop-Up Player] - Extracting video URL from:", redirectUrl);

        if (redirectUrl.startsWith("https://anon.to/?")) {
            const realUrl = redirectUrl.split("https://anon.to/?")[1];
            console.log("[BHD Trailer Pop-Up Player] - Extracted video URL:", realUrl);
            return realUrl;
        }

        console.log("[BHD Trailer Pop-Up Player] - No redirect found, using original URL:", redirectUrl);
        return redirectUrl;
    }

    function convertToEmbedUrl(videoUrl) {
        console.log("[BHD Trailer Pop-Up Player] - Converting to embed URL:", videoUrl);

        const videoId = videoUrl.split("v=")[1];
        if (!videoId) {
            console.error("[BHD Trailer Pop-Up Player] - Could not extract video ID from URL:", videoUrl);
            return null;
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        console.log("[BHD Trailer Pop-Up Player] - Embed URL:", embedUrl);
        return embedUrl;
    }

    function createPopup(videoUrl) {
        console.log("[BHD Trailer Pop-Up Player] - Creating pop-up for video URL:", videoUrl);

        popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '640px';
        popup.style.height = '360px';
        popup.style.backgroundColor = '#000';
        popup.style.zIndex = '1000';
        popup.style.border = '2px solid #fff';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        const iframe = document.createElement('iframe');
        iframe.src = videoUrl;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        const closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = 'red';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px 10px';
        closeButton.style.borderRadius = '50%';
        closeButton.onclick = () => {
            console.log("[BHD Trailer Pop-Up Player] - Closing pop-up via close button.");
            closePopup();
        };

        popup.appendChild(iframe);
        popup.appendChild(closeButton);
        document.body.appendChild(popup);

        document.addEventListener('click', handleOutsideClick);

        console.log("[BHD Trailer Pop-Up Player] - Pop-up created and appended to the body.");
    }

    function closePopup() {
        if (popup) {
            console.log("[BHD Trailer Pop-Up Player] - Closing pop-up.");
            document.body.removeChild(popup);
            popup = null;

            document.removeEventListener('click', handleOutsideClick);
        }
    }

    function handleOutsideClick(event) {
        if (!popup || popup.contains(event.target)) {
            return;
        }

        closePopup();
    }

    document.querySelectorAll(videoLinkSelector).forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            console.log("[BHD Trailer Pop-Up Player] - Video link clicked:", this.href);

            const videoUrl = extractVideoUrl(this.href);
            console.log("[BHD Trailer Pop-Up Player] - Final video URL:", videoUrl);

            const embedUrl = convertToEmbedUrl(videoUrl);
            if (!embedUrl) {
                console.error("[BHD Trailer Pop-Up Player] - Failed to convert to embed URL.");
                return;
            }

            createPopup(embedUrl);
        });
    });

    console.log("[BHD Trailer Pop-Up Player] - Event listeners added to video links.");
})();