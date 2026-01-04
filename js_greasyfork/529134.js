// ==UserScript==
// @name         YouTube Auto Loop
// @version      1.0
// @description  Force loop YouTube videos
// @match        https://m.youtube.com/watch*
// @grant        none
// @license     MIT
// @namespace https://greasyfork.org/users/1443366
// @downloadURL https://update.greasyfork.org/scripts/529134/YouTube%20Auto%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/529134/YouTube%20Auto%20Loop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loopVideo = () => {
        const video = document.querySelector('video');
        if (video && !video.loop) {
            video.loop = true;
        }
    };

    const observer = new MutationObserver(loopVideo);
    observer.observe(document.body, { childList: true, subtree: true });

    loopVideo();
})();
