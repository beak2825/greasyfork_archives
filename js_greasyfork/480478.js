// ==UserScript==
// @name         D2L Brightspace LMS video player swap
// @description  Changes the default video player on brightspace learning shells to use the browsers implementation.
// @author       https://github.com/tadghh
// @namespace    https://github.com/tadghh/brightspace-lms-video-swap
// @version      0.6
// @supportURL   https://github.com/tadghh/brightspace-lms-video-swap/
// @match        https://*/d2l/le/content/*/viewContent/*/View
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d2l.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480478/D2L%20Brightspace%20LMS%20video%20player%20swap.user.js
// @updateURL https://update.greasyfork.org/scripts/480478/D2L%20Brightspace%20LMS%20video%20player%20swap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the div with class vui-mediaplayer
    const mediaPlayerDiv = document.querySelector('div.vui-mediaplayer');

    // Check if the div exists
    if (mediaPlayerDiv) {
        // Get the value of the data-mediaplayer-src attribute
        const mediaPlayerSrc = mediaPlayerDiv.getAttribute('data-mediaplayer-src');

        // Create a new video element
        const videoElement = document.createElement('video');
        videoElement.setAttribute('controls', '');

        // Add the class to the video element
        videoElement.classList.add('d2l-labs-media-player-type-is-video');

        // Set styles for the video element, taken from the constructed stylesheet
        videoElement.style.cursor = 'auto';
        videoElement.style.display = 'flex';
        videoElement.style.minHeight = '17rem';
        videoElement.style.height = '100%';
        videoElement.style.width = '100%';
        videoElement.style.aspectRatio = '1.77778 / 1';

        // Create a source element inside the video element
        const sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', mediaPlayerSrc);
        sourceElement.setAttribute('type', 'video/mp4');

        // Append the source element to the video element
        videoElement.appendChild(sourceElement);

        // Replace the mediaPlayerDiv with the videoElement
        mediaPlayerDiv.parentNode.replaceChild(videoElement, mediaPlayerDiv);
    }
})();
