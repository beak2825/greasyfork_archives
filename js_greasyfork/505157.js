// ==UserScript==
// @name         Global Media Playback Speed Control
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Control playback speed for any media on a webpage using keyboard shortcuts.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505157/Global%20Media%20Playback%20Speed%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/505157/Global%20Media%20Playback%20Speed%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adjust speed increment value
    const speedStep = 0.1;

    // Listen for keydown events
    document.addEventListener('keydown', function(event) {
        if (event.target.tagName.toLowerCase() !== 'input' && event.target.tagName.toLowerCase() !== 'textarea') {
            let mediaElements = document.querySelectorAll('video, audio');

            if (event.key === '[') {
                mediaElements.forEach(media => {
                    media.playbackRate = Math.max(0.1, media.playbackRate - speedStep);
                    console.log(`Playback speed decreased to: ${media.playbackRate}`);
                });
            } else if (event.key === ']') {
                mediaElements.forEach(media => {
                    media.playbackRate += speedStep;
                    console.log(`Playback speed increased to: ${media.playbackRate}`);
                });
            }
        }
    });

})();
