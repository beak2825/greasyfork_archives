// ==UserScript==
// @name         YouTube - Disable Inline Playback ("Keep hovering to play")
// @namespace    Violentmonkey Scripts
// @match        *://www.youtube.com/*
// @version      2.6
// @author       jez9999
// @description  Disable the Inline Playback feature ("keep hovering to play") on YouTube even when logged out
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447727/YouTube%20-%20Disable%20Inline%20Playback%20%28%22Keep%20hovering%20to%20play%22%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447727/YouTube%20-%20Disable%20Inline%20Playback%20%28%22Keep%20hovering%20to%20play%22%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ********************
    // Reminder: set the following in Violentmonkey advanced settings for Editor:
    // "tabSize": 4,
    // "indentUnit": 4,
    // "autoCloseBrackets": false,
    //
    // Also, bear in mind there appears to be a bug in Violentmonkey where after a while, MutationObserver's
    // stop being debuggable and the whole browser needs restarting before it'll work again.
    // ********************

    // Allow strings for HTML/CSS/etc. trusted injections
	if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: string => string,
            createScriptURL: string => string,
            createScript: string => string
        });
    }

    // Hide video preview on hover
    var sheet = document.createElement('style');
    sheet.innerHTML = `
        ytd-video-preview { display: none !important; }
        .ytd-thumbnail-overlay-loading-preview-renderer { display: none !important; }
        .ytp-inline-preview-ui { display: none !important; }
        #preview { display: none !important; }
        ytd-thumbnail[now-playing] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail { display: flex !important; }
        ytd-thumbnail[is-preview-loading] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail { display: flex !important; }
        #mouseover-overlay { display: none !important; }
        animated-thumbnail-overlay-view-model { display: none !important; }
    `;

    document.head.appendChild(sheet);
})();
