// ==UserScript==
// @name         Scroll Element Into View on rule34.xxx
// @namespace    http://your.namespace.com
// @version      0.2
// @description  Scrolls into view either the element with the id "image" or "gelcomVideoPlayer" on rule34.xxx
// @author       You
// @match        https://rule34.xxx/index.php?page=post*
// @grant        none
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/485623/Scroll%20Element%20Into%20View%20on%20rule34xxx.user.js
// @updateURL https://update.greasyfork.org/scripts/485623/Scroll%20Element%20Into%20View%20on%20rule34xxx.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to scroll an element into view
    function scrollIntoView(element) {
        document.querySelector("#image, #gelcomVideoPlayer").style.width = "auto"
        document.querySelector("#image, #gelcomVideoPlayer").style.maxHeight = "85vh"
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    }

    // Try to find the element with id "image"
    var imageElement = document.querySelector('#image');

    // If not found, try to find the element with id "gelcomVideoPlayer"
    if (!imageElement) {
        var videoPlayerElement = document.querySelector('#gelcomVideoPlayer');
        scrollIntoView(videoPlayerElement);
    } else {
        scrollIntoView(imageElement);
    }
})();
