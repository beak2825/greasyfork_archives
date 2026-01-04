// ==UserScript==
// @name         Disable accidental youtube video seek for arrow up and down keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  After changing the position of the video by clicking the progress bar, up and down arrow keys will seek the video instead of changing the volume. this script fixes this by refocusing to the video element
// @author       @dhalsim
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452226/Disable%20accidental%20youtube%20video%20seek%20for%20arrow%20up%20and%20down%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/452226/Disable%20accidental%20youtube%20video%20seek%20for%20arrow%20up%20and%20down%20keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const progressBarClassName = 'ytp-progress-bar';

    const [progressBar] = document.getElementsByClassName(progressBarClassName);

    progressBar.addEventListener("focus", function(event) {
        console.log('focused');

        progressBar.blur();

        const [videoContainer] = document.querySelectorAll('div.html5-video-container video');
        
        videoContainer.focus();
    }, true);

})();