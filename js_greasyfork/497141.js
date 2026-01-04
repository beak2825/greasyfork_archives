// ==UserScript==
// @name         vive la hispania
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @license      MIT
// @description  Remove cooldown restrictions
// @author       HackGPT & gabri
// @match        https://pixelcanvas.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497141/vive%20la%20hispania.user.js
// @updateURL https://update.greasyfork.org/scripts/497141/vive%20la%20hispania.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove cooldown restrictions with a slight delay
    if (!Date.prototype.originalGetTime) {
        Date.prototype.originalGetTime = Date.prototype.getTime;
        Date.prototype.getTime = function() {
            return this.originalGetTime() - Math.floor(Math.random() * 100) + 100; // Add a small delay to avoid server detection
        };
    }
})();