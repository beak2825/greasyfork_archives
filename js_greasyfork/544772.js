// ==UserScript==
// @name         Starblast.io Aggressive FPS Uncap
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces requestAnimationFrame with setTimeout to uncap FPS in Starblast.io (may cause flickering)
// @author       WOB
// @match        *://starblast.io/*
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544772/Starblastio%20Aggressive%20FPS%20Uncap.user.js
// @updateURL https://update.greasyfork.org/scripts/544772/Starblastio%20Aggressive%20FPS%20Uncap.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Replace requestAnimationFrame with ultra-fast setTimeout
    window.requestAnimationFrame = function(callback) {
        return setTimeout(() => callback(performance.now()), 0);
    };

    // Slightly speed up setTimeout and setInterval
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay, ...args) {
        return originalSetTimeout(fn, Math.max(0, delay - 5), ...args);
    };

    const originalSetInterval = window.setInterval;
    window.setInterval = function(fn, delay, ...args) {
        return originalSetInterval(fn, Math.max(1, delay - 5), ...args);
    };
})();
