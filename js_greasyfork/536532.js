// ==UserScript==
// @name        Download Video from Studyforge
// @namespace   studyforge-dl
// @match       https://tool.studyforge.net/lesson/*
// @grant       window.open
// @version     1.1
// @author      InterstellarOne
// @description Activate with Shift+S
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536532/Download%20Video%20from%20Studyforge.user.js
// @updateURL https://update.greasyfork.org/scripts/536532/Download%20Video%20from%20Studyforge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'S') {

            event.preventDefault();

            const videoElement = document.querySelector('.element.show .video-container .video-wrapper video');
            if (videoElement) {
                const sourceElement = videoElement.querySelector('source');
                if (sourceElement && sourceElement.src) {
                    window.open(sourceElement.src, '_blank');
                } else {
                    console.log('Could not find video source.');
                }
            } else {
                console.log('Could not find video.');
            }
        }
    });
})();