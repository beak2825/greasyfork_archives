// ==UserScript==
// @name         MuteTwitterVideos
// @version      0.2
// @description  On twitter dot com or x dot com, mute all videos.
// @author       BlueK
// @include      https://twitter.com/*, https://x.com/*
// @namespace https://greasyfork.org/users/1352648
// @downloadURL https://update.greasyfork.org/scripts/503813/MuteTwitterVideos.user.js
// @updateURL https://update.greasyfork.org/scripts/503813/MuteTwitterVideos.meta.js
// ==/UserScript==

(function() {
    function muteAllVideos() {
    document.querySelectorAll('video').forEach(video => {
        video.muted = true;
    });
}

// Initially mute all videos on page load
muteAllVideos();

// Set up a MutationObserver to detect when new videos are added
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'VIDEO') {
                    node.muted = true;
                }
                // If the node is not a video but might contain videos, search within it
                if (node.querySelectorAll) {
                    node.querySelectorAll('video').forEach(video => {
                        video.muted = true;
                    });
                }
            });
        }
    });
});

// Start observing the document for added video elements
observer.observe(document.body, { childList: true, subtree: true });
})();