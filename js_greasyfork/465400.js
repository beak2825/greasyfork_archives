// ==UserScript==
// @name         Hide YouTube Reaction Videos from Search
// @namespace    http://tampermonkey-react-videos/
// @version      1.0
// @description  Hides any low-effort reaction YouTube videos with "react" in the title or channel name and prints hidden video info to the console.
// @author       Luke-L
// @match        https://www.youtube.com/*
// @grant        none
// @license      CC BY-NC
// @downloadURL https://update.greasyfork.org/scripts/465400/Hide%20YouTube%20Reaction%20Videos%20from%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/465400/Hide%20YouTube%20Reaction%20Videos%20from%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideVideos = () => {
        const videoElements = document.querySelectorAll('ytd-video-renderer:not([data-hidden="true"])');
        videoElements.forEach(video => {
            const title = video.querySelector('#video-title').innerText.trim().replace(/\n/g, ' ');
            let channel = video.querySelector('#channel-name').innerText.trim().replace(/\n/g, ' ');
            channel = channel.replace(/\s{2,}.*/gmi, '');
            if (
            (title.toLowerCase().includes('react') || channel.toLowerCase().includes('react')) &&
                !title.toLowerCase().includes('chemical')
            ){
                const videoLinkElement = video.querySelector('#video-title');
                const videoLink = videoLinkElement.getAttribute('href').split('&')[0];
                const videoId = videoLink.substring(videoLink.indexOf('v=') + 2);
                if (videoId) {
                    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    console.log(`Hid ${videoUrl}\n"${title}"\nBy "${channel}"`);
                } else {
                    console.log(`Could not find video link for "${title}" from channel "${channel}"\n`);
                }
                video.style.display = 'none';
                video.setAttribute('data-hidden', 'true');
            }
        });
    };

    // Hide videos on page load
    hideVideos();

    // Observe changes to the page and hide videos as they are added
    const observer = new MutationObserver(hideVideos);
    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
})();
