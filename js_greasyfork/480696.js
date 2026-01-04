// ==UserScript==
// @name         YouTube Embedded Video Link
// @namespace    https://kennedn.com
// @license      MIT
// @version      1.0
// @description  Adds a shortcut to open the embedded video page on YouTube video pages
// @author       Your Name
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480696/YouTube%20Embedded%20Video%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/480696/YouTube%20Embedded%20Video%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract video ID from YouTube video URL
    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    // Function to navigate to the embedded video page
    function navigateToEmbeddedPage(videoId) {
        const embeddedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
        //window.location.href = embeddedUrl;
        window.open(embeddedUrl, '_blank');
    }

    // Keyboard shortcut handler
    function handleKeyPress(event) {
        // Check if the key pressed is 'E' (can be customized)
        if (event.ctrlKey && event.key === 'e') {
            const videoId = getVideoId();
            if (videoId) {
                navigateToEmbeddedPage(videoId);
            }
        }
    }

    // Event listener for key press
    document.addEventListener('keydown', handleKeyPress);
})();