// ==UserScript==
// @name         Cycle Playback Speed
// @version      1.1
// @description  Cycles through video speed values by pressing 'S' on hovered videos with 4chanX
// @author       kpganon
// @license      MIT
// @namespace    https://github.com/kpg-anon/scripts
// @include      /^https?:\/\/boards\.4chan(nel)?\.org\/.*\/thread\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483284/Cycle%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/483284/Cycle%20Playback%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hoveredVideo = null;
    const playbackSpeeds = [0.25, 0.4, 0.5, 1.0];

    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '40px';
    indicator.style.right = '10px';
    indicator.style.zIndex = '10000';
    indicator.style.background = 'rgba(0, 0, 0, 0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '5px 10px';
    indicator.style.borderRadius = '5px';
    indicator.style.display = 'none';
    document.body.appendChild(indicator);

    function updateIndicator() {
        if (hoveredVideo) {
            indicator.textContent = `Playback: ${hoveredVideo.playbackRate}x`;
        }
    }

    function setHoveredVideo(videoElement) {
        hoveredVideo = videoElement;
        indicator.style.display = 'block';
        updateIndicator();
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'VIDEO') {
                    setHoveredVideo(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.body.addEventListener('keydown', event => {
        if (event.key === 's' && hoveredVideo) {
            const currentSpeedIndex = playbackSpeeds.indexOf(hoveredVideo.playbackRate);
            let newSpeedIndex = currentSpeedIndex + 1;

            if (newSpeedIndex >= playbackSpeeds.length) {
                newSpeedIndex = 0;
            }

            hoveredVideo.playbackRate = playbackSpeeds[newSpeedIndex];
            updateIndicator();
        }
    });

    document.body.addEventListener('mouseout', event => {
        if (hoveredVideo && (event.relatedTarget === null || event.relatedTarget.nodeName !== 'VIDEO')) {
            hoveredVideo = null;
            indicator.style.display = 'none';
        }
    });
})();
