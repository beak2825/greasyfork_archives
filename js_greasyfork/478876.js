// ==UserScript==
// @name         Attention Span Extender
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Uses sophisticated psychological techniques to keep your attention on TUM pages
// @author       https://github.com/jaylann
// @match        *://*.tum.de/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478876/Attention%20Span%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/478876/Attention%20Span%20Extender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videos = [
        '7ghSziUQnhs',
        'NX-i0IWl3yg',
        'dvjy6V4vLlI',
        'zBN729Jwab0',
        'hZyjsJJ51kQ',
        'AsetdKZN11o'
    ];

    // Get the current video index from session storage
    const currentIndex = parseInt(sessionStorage.getItem('currentVideoIndex')) || 0;

    // Calculate the index of the next video to play
    const nextIndex = (currentIndex + 1) % videos.length;

    // Update the current video index in session storage
    sessionStorage.setItem('currentVideoIndex', nextIndex);

    const videoId = videos[currentIndex];

    // Create a container for the YouTube video
    const videoContainer = document.createElement('div');
    videoContainer.style.position = 'fixed';
    videoContainer.style.top = '100px';
    videoContainer.style.right = '10px';
    videoContainer.style.width = '560px';
    videoContainer.style.height = '315px';
    videoContainer.style.border = '1px solid #000';
    videoContainer.style.zIndex = '1000';
    videoContainer.style.borderRadius = '10px';
    videoContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    videoContainer.style.overflow = 'hidden';

    // Create an iframe to embed the YouTube video
    const iframe = document.createElement('iframe');
    const randomStartTime = Math.floor(Math.random() * 180);
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&start=${randomStartTime}&controls=0`;
    iframe.width = '560';
    iframe.height = '315';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '10px';

    // Append the iframe to the video container
    videoContainer.appendChild(iframe);

    // Append the video container to the body of the webpage
    document.body.appendChild(videoContainer);

})();
