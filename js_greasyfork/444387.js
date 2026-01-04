// ==UserScript==
// @name        Soundsnap Downloader
// @namespace   https://github.com/Enchoseon/enchos-assorted-userscripts/raw/main/soundsnap-downloader.user.js
// @version     1.1.0
// @description Add download link to Soundsnap previews.
// @author      Enchoseon
// @include     *soundsnap.com/search/audio?*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/444387/Soundsnap%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/444387/Soundsnap%20Downloader.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // =================
    // Mutation Observer
    // =================
    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(added_node) {
                if (added_node.classList && added_node.classList.contains("ojoo-teaser")) {
                    start();
                }
            });
        });
    });
    observer.observe(document, { subtree: true, childList: true });
    function start() {
        // =========================
        // Intercept Download Button
        // =========================
        document.querySelectorAll("div.ojoo-teaser").forEach((track) => {
            if (track.dataset.processed) return;
            track.dataset.processed = "true";
            const downloadButton = track.querySelector("a.button-icon.teaser-icons.primary.ojoo-icon-download");
            console.log(downloadButton);
            downloadButton.removeAttribute("href");
            downloadButton.addEventListener("click", () => {
                var event = new MouseEvent("mouseover", {
                    "bubbles": true,
                    "cancelable": true
                });
                track.querySelector("span.ojoo-play").dispatchEvent(event);
                downloadTrack(track.querySelector("audio").src, track.querySelector("div.audio-description").innerHTML);
            });
        });
        // =================
        // Download Function
        // =================
        function downloadTrack(url, name) {
            console.log("Downloading: " + name + " (" + url + ")");
            window.open(url);
        }
    }
})();
