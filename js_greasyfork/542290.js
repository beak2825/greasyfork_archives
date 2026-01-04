// ==UserScript==
// @name         xlmnp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Finds and clicks a button with a specific class
// @author       You
// @match        https://csgobig.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542290/xlmnp.user.js
// @updateURL https://update.greasyfork.org/scripts/542290/xlmnp.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Wait until the page fully loads
    window.addEventListener('load', () => {
 
        // Optional: retry until the button appears
        const interval = setInterval(() => {
            // Replace this with your actual class
            const button = document.querySelector('button large player-view__button-join--vertical primary');
 
            if (button) {
                button.click();
                console.log('Button clicked!');
            } else {
                console.log('Button not found yet...');
            }
        }, 100); // Check every second
    });
})();