// ==UserScript==
// @name        Odysee: remove "+10"/"-10" skip indicators
// @match       https://odysee.com/*
// @description Removes the skip indicators on Odysee ("+10" or "-10")
// @version     1.0.0
// @grant       none
// @namespace   com.odysee.annoying.timeskips
// @author      https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @icon        https://www.google.com/s2/favicons?sz=128&domain=odysee.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/449958/Odysee%3A%20remove%20%22%2B10%22%22-10%22%20skip%20indicators.user.js
// @updateURL https://update.greasyfork.org/scripts/449958/Odysee%3A%20remove%20%22%2B10%22%22-10%22%20skip%20indicators.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    const STYLE_TAG_ID = 'odysee-disable-skip-overlays';

    setInterval(function() {
        if (document.getElementById(STYLE_TAG_ID) === null) { // not installed yet
            const styleTag = document.createElement('style');
            styleTag.setAttribute('id', STYLE_TAG_ID);
            styleTag.innerText = 'div.vjs-overlay.vjs-overlay-seeked { display: none; }';

            const body = document.querySelector('body');
            if (body) {
                body.appendChild(styleTag);
            }
        }
    }, 1000);
})();