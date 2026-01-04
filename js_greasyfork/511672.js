// ==UserScript==
// @name         Replace Images and Videos with White Divs (Social Media Version)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Replace all images and videos on Facebook, Instagram, and Reddit with white divs
// @match        *://*.facebook.com/*
// @match        *://*.instagram.com/*
// @match        *://*.reddit.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511672/Replace%20Images%20and%20Videos%20with%20White%20Divs%20%28Social%20Media%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511672/Replace%20Images%20and%20Videos%20with%20White%20Divs%20%28Social%20Media%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceRedditVideos() {
        const redditVideos = document.querySelectorAll('shreddit-player');
        redditVideos.forEach(player => {
            const div = document.createElement('div');
            div.style.width = '640px';  // Default video width
            div.style.height = '360px'; // Default video height
            div.style.backgroundColor = 'white';
            div.style.display = 'inline-block';
            div.textContent = 'Video Blocked';
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.alignItems = 'center';
            div.style.color = 'black';
            div.style.fontFamily = 'Arial, sans-serif';
            if (player.parentNode) {
                player.parentNode.replaceChild(div, player);
            }
        });
    }

    function replaceMediaWithDivs() {
        const mediaElements = document.querySelectorAll('img, video');
        mediaElements.forEach(element => {
            const div = document.createElement('div');
            if (element.tagName.toLowerCase() === 'img') {
                div.style.width = (element.width || element.offsetWidth || 100) + 'px';
                div.style.height = (element.height || element.offsetHeight || 100) + 'px';
            } else if (element.tagName.toLowerCase() === 'video') {
                div.style.width = (element.videoWidth || element.offsetWidth || 640) + 'px';
                div.style.height = (element.videoHeight || element.offsetHeight || 360) + 'px';
            }
            div.style.backgroundColor = 'white';
            div.style.display = 'inline-block';
            if (element.parentNode) {
                element.parentNode.replaceChild(div, element);
            }
        });

        // Call the function to replace Reddit videos
        replaceRedditVideos();
    }

    // Run the functions when the page loads
    window.addEventListener('load', () => {
        replaceMediaWithDivs();
        replaceRedditVideos();
    });

    // Run the functions periodically to catch dynamically loaded media
    setInterval(() => {
        replaceMediaWithDivs();
        replaceRedditVideos();
    }, 2000);

    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(() => {
        replaceMediaWithDivs();
        replaceRedditVideos();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();