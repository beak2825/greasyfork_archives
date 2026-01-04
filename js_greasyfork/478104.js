// ==UserScript==
// @name         Hide YouTube suggested videos and channels
// @namespace    azb-hidesuggest
// @version      0.1
// @description  Hide suggested videos and channels at the end of a YouTube video
// @author       Azb
// @match        *://www.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478104/Hide%20YouTube%20suggested%20videos%20and%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/478104/Hide%20YouTube%20suggested%20videos%20and%20channels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideElements = () => {
        const selectors = [
            '.ytp-ce-video.ytp-ce-large-round',
            '.ytp-ce-playlist.ytp-ce-large-round',
            '.ytp-ce-large-round .ytp-ce-expanding-overlay-background',
            '.ytp-ce-channel',
            '.ytp-ce-channel .ytp-ce-expanding-image',
            '.ytp-ce-channel .ytp-ce-element-shadow'
        ];

        for(let selector of selectors) {
            const elementsToHide = document.querySelectorAll(selector);

            for(let el of elementsToHide) {
                el.style.display = 'none';
            }
        }
    };

    hideElements();

    new MutationObserver(hideElements).observe(document.body, {
        childList: true,
        subtree: true
    });

})();