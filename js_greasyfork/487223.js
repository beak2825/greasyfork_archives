// ==UserScript==
// @name         Modyolo dl shortener
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Reduces waittime on modyolo downloads
// @author       JKamsker
// @match        https://modyolo.com/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=modyolo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487223/Modyolo%20dl%20shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/487223/Modyolo%20dl%20shortener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store the original setTimeout function
    var originalSetTimeout = window.setTimeout;

    // Override the global setTimeout function
    window.setTimeout = function(callback, delay) {
        // Check if the delay is the specific one you want to override
        if (delay === 4000) {
            // Call the callback immediately without delay
            debugger;
            callback();
        } else {
            // Otherwise, use the original setTimeout function
            originalSetTimeout(callback, delay);
        }
    };
})();
