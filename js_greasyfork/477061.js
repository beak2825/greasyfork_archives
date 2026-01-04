// ==UserScript==
// @name         Elamigos - Embed YouTube Video
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Embed YouTube videos on elamigos.site/data/* pages if a YouTube link is present.
// @author       Drigtime
// @match        https://elamigos.site/data/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elamigos.site
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477061/Elamigos%20-%20Embed%20YouTube%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/477061/Elamigos%20-%20Embed%20YouTube%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the YouTube video ID from a YouTube link
    function extractVideoId(url) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=))([^&\n?#]+)/);
        return match && match[1];
    }

    // Find all links on the page
    const allParagraphs = document.querySelectorAll('p');

    // Loop through each link
    allParagraphs.forEach(paragraph => {
        const text = paragraph.textContent;
        const videoId = extractVideoId(text);
        if (videoId) {
            // Create an iframe to embed the YouTube video
            const iframe = document.createElement('iframe');
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.frameborder = '0';
            iframe.allow = 'fullscreen';

            // Replace the link with the embedded video
            paragraph.parentNode.replaceChild(iframe, paragraph);
        }
    });
})();
