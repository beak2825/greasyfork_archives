// ==UserScript==
// @name         Enable HTML5 Video Controls
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically adds the controls attribute to all HTML5 video elements
// @author       YeXiu_AU
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497758/Enable%20HTML5%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/497758/Enable%20HTML5%20Video%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add controls attribute to video elements
    function enableVideoControls() {
        var videos = document.querySelectorAll("video");
        videos.forEach(function(video) {
            video.setAttribute("controls", "true");
        });
    }

    // Add controls to existing video elements
    enableVideoControls();

    // Use MutationObserver to monitor for new video elements being added to the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeName === "VIDEO") {
                        node.setAttribute("controls", "true");
                    } else if (node.querySelectorAll) {
                        var videos = node.querySelectorAll("video");
                        videos.forEach(function(video) {
                            video.setAttribute("controls", "true");
                        });
                    }
                });
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Ensure that controls are added when the DOM is ready
    document.addEventListener("DOMContentLoaded", enableVideoControls);
})();