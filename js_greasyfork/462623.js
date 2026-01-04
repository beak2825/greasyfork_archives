// ==UserScript==
// @name         Replace preview with i
// @namespace    https://i.redd.it
// @version      1.0
// @description  Replace preview with i in Reddit image URLs
// @match        *://*/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/462623/Replace%20preview%20with%20i.user.js
// @updateURL https://update.greasyfork.org/scripts/462623/Replace%20preview%20with%20i.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Define a function to replace image URLs
    function replaceImageURLs() {
        // Get all images on the page
        var images = document.getElementsByTagName("img");
        // Loop through each image
        for (var i = 0; i < images.length; i++) {
            // Get the current src value
            var src = images[i].src;
            // Check if it contains preview.redd.it
            if (src.includes("preview.redd.it")) {
                // Replace preview with i
                var newSrc = src.replace("preview", "i");
                // Set the new src value
                images[i].src = newSrc;
            }
        }
    }
    // Create a mutation observer instance
    var observer = new MutationObserver(replaceImageURLs);
    // Define the observer options: observe all child nodes and attributes of the body element
    var options = {childList: true, subtree: true, attributes: true};
    // Start observing the body element for changes
    observer.observe(document.body, options);
})();