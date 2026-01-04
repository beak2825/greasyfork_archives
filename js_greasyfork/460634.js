// ==UserScript==
// @name         Picture-in-picture on Hulu (press H)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press H to enable or disable picture-in-picture on Hulu
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @match        https://www.hulu.com/*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=hulu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460634/Picture-in-picture%20on%20Hulu%20%28press%20H%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460634/Picture-in-picture%20on%20Hulu%20%28press%20H%29.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    function hasNoModifiers(event) {
        return !(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey);
    }

    function findVideoElement() {
        return Array.from(document.querySelectorAll('video')) // find all <video> elements
            .filter((v) => v.currentTime > 0 && !(v.ended)) // keep only the ones with a "currentTime" set and not marked as "ended"
            .map((v) => ({element: v, area: (v.clientWidth * v.clientHeight)})) // compute the size for each
            .reduce((best, current) => current.area > best.area ? current : best, {element: null, area: 0}) // and keep only the largest one, likely the one we want
            .element; // returning the element
    }

    addEventListener('keypress', (e) => {
        if (e.code === 'KeyH' && hasNoModifiers(e)) {
            const video = findVideoElement();
            if (video !== null) {
                if (video.hasAttribute('disablepictureinpicture')) { // Hulu sets this, let's drop it.
                    video.removeAttribute('disablepictureinpicture');
                }
                if (document.pictureInPictureElement) { // already in PiP mode
                    document.exitPictureInPicture();
                } else {
                    video.requestPictureInPicture();
                }
            }
        }
    });
})();