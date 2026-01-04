// ==UserScript==
// @name         Prevent Video Pause on Click
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Prevent video from pausing on click
// @author       You
// @match        http://192.168.31.60:5265/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499272/Prevent%20Video%20Pause%20on%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/499272/Prevent%20Video%20Pause%20on%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function preventVideoPause() {
        let videoElements = document.querySelectorAll('video');
        videoElements.forEach((video) => {
            video.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
            });
        });
    }

    // Run the function once the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', preventVideoPause);

    // Observe the document for any new video elements being added dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName && node.tagName.toLowerCase() === 'video') {
                        node.addEventListener('click', (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
