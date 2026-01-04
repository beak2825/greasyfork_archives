// ==UserScript==
// @name Hide YouTube Expandable Metadata Box In Search Results
// @description Hides the Expandable Metadata box from YouTube search results.
// @namespace slysnake96 & ChatGPT
// @version 2
// @license MIT
// @grant none
// @match *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/461210/Hide%20YouTube%20Expandable%20Metadata%20Box%20In%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/461210/Hide%20YouTube%20Expandable%20Metadata%20Box%20In%20Search%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var metadata = mutation.target.querySelector('#expandable-metadata');
            if (metadata) {
                metadata.style.display = 'none';
            }
            var newMetadata = mutation.target.querySelectorAll('.metadata-snippet-container.style-scope.ytd-video-renderer.style-scope.ytd-video-renderer, .metadata-snippet-container-one-line.style-scope.ytd-video-renderer.style-scope.ytd-video-renderer');
            if (newMetadata) {
                for (var i = 0; i < newMetadata.length; i++) {
                    newMetadata[i].style.display = 'none';
                }
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();