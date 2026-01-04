// ==UserScript==
// @name        Storyblocks Downloader
// @namespace   https://github.com/Enchoseon/enchos-assorted-userscripts/raw/main/storyblocks-downloader.user.js
// @version     1.1
// @description Add download link to Storyblocks previews.
// @author      Enchoseon
// @match       https://www.storyblocks.com/audio/search/*
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/453817/Storyblocks%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/453817/Storyblocks%20Downloader.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // =================
    // Mutation Observer
    // =================
    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(added_node) {
                console.log(added_node);
                if (added_node.nodeName === "SECTION" && added_node.classList.contains("audio")) { // Intercept every track element as it's created and modify its download button
                    processTrack(added_node);
                }
            });
        });
    });
    observer.observe(document.querySelector("main#search"), { subtree: true, childList: true });
    // =======================
    // Intercept Track Element
    // =======================
    function processTrack(track) {
        const downloadButton = track.querySelector("a.download-button"); // Get the built-in download button...
        downloadButton.removeAttribute("href"); // ... and remove its ability to redirect us to a "Sign Up to Download" page
        downloadButton.addEventListener("click", () => { // Start playing the song
            var event = new MouseEvent("click", {
                "bubbles": true,
                "cancelable": true
            });
            track.querySelector("button.audioPlayButton-button").dispatchEvent(event);
            downloadTrack(document.querySelector("audio#audio").src, downloadButton.getAttribute("aria-label").split("Download audio track ")[1]);
        });
    }
    // =================
    // Download Function
    // =================
    function downloadTrack(url, name) {
        console.log("Downloading: " + name + " (" + url + ")");
        const filename = name.replace(/[<>:"/\|?*]/, "_"); // Strip illegal filename characters
        const extension = url.split(".").slice(-1); // Get the file extension
        GM_download(url, filename + "." + extension);
    }
})();

