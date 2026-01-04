// ==UserScript==
// @name         watchporn.to Video Src Extractor
// @version      1.0
// @description  Retrieves the video src URL from the page's source code.
// @author       https://github.com/matthewseat449
// @match        https://watchporn.to/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1442738
// @downloadURL https://update.greasyfork.org/scripts/528934/watchpornto%20Video%20Src%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/528934/watchpornto%20Video%20Src%20Extractor.meta.js
// ==/UserScript==

// userscript that just opens a JS alert on pageload, and contains the video SRC / source. Sometimes just needs a refresh of the page and it will work. 

(function() {
    'use strict';

    // Run the script as soon as the DOM is fully loaded
    window.onload = function() {
        // Find all video elements on the page
        const videoElements = document.querySelectorAll('video');

        if (videoElements.length > 0) {
            videoElements.forEach((videoElement, index) => {
                if (videoElement.src) {
                    const videoSrc = videoElement.src;
                    console.log(`Video source #${index + 1} found:`, videoSrc);

                    // Show the video source in an alert window
                    alert(`Video source #${index + 1} found: ${videoSrc}`);
                } else {
                    console.log(`Video element #${index + 1} has no src attribute.`);
                }
            });
        } else {
            console.log('No video elements found on this page.');
            alert('No video elements found on this page.');
        }
    };
})();
