// ==UserScript==
// @name         Funnyjunk - Soundless Autoplay Begone
// @namespace    http://tampermonkey.net/
// @version      1.10.1
// @description  Convert autoplay videos with sound to click-to-play, keep silent autoplay videos looping, show thumbnail, conditional controls
// @match        *://funnyjunk.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544763/Funnyjunk%20-%20Soundless%20Autoplay%20Begone.user.js
// @updateURL https://update.greasyfork.org/scripts/544763/Funnyjunk%20-%20Soundless%20Autoplay%20Begone.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function processVideoLogic(video) {
        const hasAudio =
            (typeof video.mozHasAudio !== 'undefined' && video.mozHasAudio) ||
            (typeof video.webkitAudioDecodedByteCount !== 'undefined' && video.webkitAudioDecodedByteCount > 0) ||
            (video.audioTracks && video.audioTracks.length > 0);

        if (!hasAudio) {
            // Silent autoplay video: keep autoplay & loop enabled, muted, no controls (like GIF)
            video.controls = false;
            video.loop = true;
            video.muted = true;
            // No changes to autoplay or playback state
        } else {
            // Video has sound: convert to click-to-play
            video.removeAttribute('autoplay');
            video.removeAttribute('loop');
            video.loop = false;

            video.pause();
            video.muted = true;   // start muted

            video.controls = true;

            let userInteracted = false;

            // Override play() to block autoplay until user interaction
            const originalPlay = video.play.bind(video);
            video.play = function () {
                if (!userInteracted) {
                    return Promise.resolve();
                }
                return originalPlay();
            };

            // On first user play, unmute and play again
            video.addEventListener('play', function onPlay() {
                if (!userInteracted) {
                    userInteracted = true;
                    video.muted = false;
                    video.play();
                }
            }, { once: true });

            // Show thumbnail frame
            if (video.currentTime === 0) {
                video.currentTime = 0.01;
            }

            video.pause();
        }

        video.dataset.converted = 'true';
    }

    function setupVideo(video) {
        if (video.dataset.converted) return;

        if (video.autoplay && video.muted) {
            if (video.readyState >= 1) {
                // Metadata already loaded, process immediately
                processVideoLogic(video);
            } else {
                // Wait for metadata
                video.addEventListener('loadedmetadata', function onMeta() {
                    video.removeEventListener('loadedmetadata', onMeta);
                    processVideoLogic(video);
                });
            }
        }
    }

    function processNode(node) {
        if (node.nodeName === 'VIDEO') {
            setupVideo(node);
        } else if (node.querySelectorAll) {
            node.querySelectorAll('video').forEach(setupVideo);
        }
    }

    function run() {
        processNode(document);
    }

    run();

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            run();
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(processNode);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
