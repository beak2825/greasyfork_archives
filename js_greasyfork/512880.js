// ==UserScript==
// @name         Uncap FPS
// @version      1.0
// @description  Uncaps the FPS limit on every website
// @author       hynap
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1381858
// @downloadURL https://update.greasyfork.org/scripts/512880/Uncap%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/512880/Uncap%20FPS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalRequestAnimationFrame = window.requestAnimationFrame;

    window.requestAnimationFrame = function(callback) {
        return originalRequestAnimationFrame(function(timestamp) {
            setTimeout(() => callback(performance.now()), 0); // Uncap FPS
        });
    };

    if ('requestAnimationFrame' in window) {
        console.log('FPS uncapped.');
    }
})();