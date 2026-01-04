// ==UserScript==
// @name         Stickpage Ruffle Injector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically injects Ruffle on any Stickpage.com page
// @author       blobcoder21
// @match        https://www.stickpage.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535655/Stickpage%20Ruffle%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/535655/Stickpage%20Ruffle%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if Ruffle is already loaded
    if (!window.RufflePlayer) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@ruffle-rs/ruffle';
        script.onload = function() {
            console.log('Ruffle loaded and ready.');
        };
        script.onerror = function() {
            console.warn('Failed to load Ruffle.');
        };
        document.head.appendChild(script);
    } else {
        console.log('Ruffle is already injected.');
    }
})();
