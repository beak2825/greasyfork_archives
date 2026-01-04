// ==UserScript==
// @name         Imgur Top Right Volume
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Move the volume controls back to the top right
// @author       zeno_shogun
// @match        *://*imgur.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518408/Imgur%20Top%20Right%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/518408/Imgur%20Top%20Right%20Volume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the CSS rules to the page
    const style = document.createElement('style');
    style.textContent = `
        .PostVideoControls-audio-container {
            bottom: initial !important;
            top: 20px !important;
        }
        .PostVideoControls-audio {
            top: -1em !important;
        }
        .PostVideoControls-volume {
            top: 1em !important;
        }
    `;
    document.head.appendChild(style);
})();
