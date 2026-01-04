// ==UserScript==
// @name         YouTube Fix Arrow Key Volume Control
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Focus player when an arrow key is pressed
// @author       merkantilizm
// @license MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499905/YouTube%20Fix%20Arrow%20Key%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/499905/YouTube%20Fix%20Arrow%20Key%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define video element
    var video;
    
    // Add event listener for keydown
    window.addEventListener('keydown', function(e) {
        // Check if arrow keys are pressed
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            
            // Get video element (has to be done inside of the function or it doesnt work for some reason)
            video = document.querySelector('video');
            
            // Prevent default action of arrow keys (e.g., scrolling the page)
            e.preventDefault();
            
            // Focus the video player
            video.focus();
        }
    });
})();
