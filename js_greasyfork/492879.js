// ==UserScript==
// @name               Pause videos when not visible
// @namespace          https://greasyfork.org/users/821661
// @version            1.0
// @description        play/pause videos
// @author             hdyzen
// @match              https://*/*
// @grant              none
// @license            MIT
// ==/UserScript==
'use strict';

function observerIt(elements, threshold) {
    const observer = new MutationObserver(() => {
        const videos = document.querySelectorAll(elements);
        if (videos.length) {
            videos.forEach(video => {
                pauseVideo(video, threshold);
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function pauseVideo(element, threshold) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                !entry.isIntersecting && !entry.target.paused ? entry.target.pause() : undefined;
            });
        },
        { threshold: threshold },
    );

    observer.observe(element);
}
