// ==UserScript==
// @name Suppress YouTube playback preview
// @namespace    http://tampermonkey.net/
// @description  When viewing a YouTube page, prevent from videos playing automatically in a thumbnail
// @license MIT
// @author       Igor Makarov
// @match        *://*.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @version 0.0.1.20250428101053
// @downloadURL https://update.greasyfork.org/scripts/534259/Suppress%20YouTube%20playback%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/534259/Suppress%20YouTube%20playback%20preview.meta.js
// ==/UserScript==

// disable inline playback
(function() {
    'use strict';

    var sheet = document.createElement('style');
    sheet.innerHTML = `
        ytd-video-preview { display: none !important; }
        .ytd-thumbnail-overlay-loading-preview-renderer { display: none !important; }
        .ytp-inline-preview-ui { display: none !important; }
        .ytp-inline-preview-scrip { display: none !important; }
        #preview { display: none !important; }
        ytd-thumbnail[now-playing] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail { display: flex !important; }
        ytd-thumbnail[is-preview-loading] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail { display: flex !important; }
    `;

    document.head.appendChild(sheet);
})();