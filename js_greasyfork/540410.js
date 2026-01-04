// ==UserScript==
// @name         Autoplay Visible Videos on reddtastic.com
// @namespace    http://tampermonkey.net/
// @version      2025-06-26
// @description  Autoplay videos when in view, pause when not
// @author       You
// @match        *://reddtastic.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddtastic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540410/Autoplay%20Visible%20Videos%20on%20reddtasticcom.user.js
// @updateURL https://update.greasyfork.org/scripts/540410/Autoplay%20Visible%20Videos%20on%20reddtasticcom.meta.js
// ==/UserScript==

(function () {
    'use strict';
 const style = document.createElement('style');
    style.textContent = `
        body {
            scroll-behavior: smooth;
            font-family: 'Trebuchet MS', sans-serif;
            background-color: #131313;
            max-width: 100%;
        }

        .nav-bar__logo {
            display: none;
        }

        #posts {
            align-items: center;
            flex-direction: column;
            align-self: center;
            max-width: 600px;
        }

        .post {
            width: 600px;
            max-width: 100vw;
            display: flex;
            margin-bottom: 20px;
            border: solid;
            border-radius: 15px;
            border-color: #333333;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background-color: #1e1e20;
            color: #e1e7e9;
            font-family: 'Trebuchet MS', sans-serif;
            font-weight: bold;
        }

        .post__column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 100vw;
        }

        .post img {
            border-radius: 8px;
        }

        .post video {
            border-radius: 8px;
            width: 100%;
            max-height: 80vh;
            object-fit: cover;
        }

        .post a {
            color: #e1e7e9;
            text-decoration: none;
            align-self: self-start;
        }

        .post a:hover {
            text-decoration: underline;
        }

        .post__title {
            font-size: 18px;
        }

        .post__meta {
            align-self: self-start;
            font-weight: normal;
        }
    `;
    document.head.appendChild(style);

    let currentlyPlaying = null;
    const observedVideos = new Set(); // Track which videos we're already observing

    const intersectionObserver = new IntersectionObserver((entries) => {
        // Sort by visibility ratio (most visible first)
        const visibleVideos = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        // Pause all observed videos except the most visible one
        entries.forEach(entry => {
            if (entry.target !== visibleVideos[0]?.target) {
                entry.target.pause();
            }
        });

        // Play the most visible one
        if (visibleVideos.length > 0) {
            const topVideo = visibleVideos[0].target;
            if (currentlyPlaying && currentlyPlaying !== topVideo) {
                currentlyPlaying.pause();
            }
            topVideo.play().catch(e => console.log('Autoplay blocked:', e));
            currentlyPlaying = topVideo;
        }
    }, {
        threshold: [0.75]
    });

    function observeVideo(video) {
        if (!observedVideos.has(video)) {
            intersectionObserver.observe(video);
            observedVideos.add(video);
        }
    }

    function observeAllVideos() {
        document.querySelectorAll('video').forEach(observeVideo);
    }

    // MutationObserver to watch for dynamically added videos
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node is a video
                    if (node.tagName === 'VIDEO') {
                        observeVideo(node);
                    }
                    // Check if the added node contains videos
                    else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(observeVideo);
                    }
                }
            });

            // Clean up removed videos
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'VIDEO') {
                        intersectionObserver.unobserve(node);
                        observedVideos.delete(node);
                        if (currentlyPlaying === node) {
                            currentlyPlaying = null;
                        }
                    }
                    else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach((video) => {
                            intersectionObserver.unobserve(video);
                            observedVideos.delete(video);
                            if (currentlyPlaying === video) {
                                currentlyPlaying = null;
                            }
                        });
                    }
                }
            });
        });
    });

    // Start observing for DOM changes
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial observation setup
    const waitForVideos = () => {
        observeAllVideos();
        // Keep checking periodically for any videos we might have missed
        setTimeout(waitForVideos, 2000);
    };

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForVideos);
    } else {
        waitForVideos();
    }
})();