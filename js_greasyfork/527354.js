// ==UserScript==
// @name         Disable Web Share API on Bahn.de
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Restores the text pop-up on travel connections for easy copy&paste. Technically overrides navigator.share to prevent native share dialog. Restricted to Bahn.de sites. 
// @match        https://bahn.de/*
// @match        https://www.bahn.de/*
// @run-at       document-start
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/527354/Disable%20Web%20Share%20API%20on%20Bahnde.user.js
// @updateURL https://update.greasyfork.org/scripts/527354/Disable%20Web%20Share%20API%20on%20Bahnde.meta.js
// ==/UserScript==

(function() {
    // Override navigator.share before any page script runs
    Object.defineProperty(navigator, 'share', {
        configurable: true,
        enumerable: true,
        writable: false,
        value: undefined
    });
})();
