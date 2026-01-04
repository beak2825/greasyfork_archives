// ==UserScript==
// @name         9gag video enhancer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       Llorx
// @match        https://9gag.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421629/9gag%20video%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/421629/9gag%20video%20enhancer.meta.js
// ==/UserScript==

// from 0 to 100
var VOUME_LEVEL = 50;

function onFirstPlay(e) {
    e.target.removeEventListener("play", onFirstPlay);
    e.target.click(); // element click instead of setting the video muted attribute, so 9gag internal state also changes to umnmuted
    e.target.volume = VOUME_LEVEL/100;
}

(function() {
    function checkVideos(node) {
        if (node.querySelectorAll) { // Check if is an Element without the need of "instanceof Element"
            if (node.classList && node.classList.contains("length")) { // Check if is the timestamp overlay, which is added dynamically
                var v = node.parentNode.querySelector("video"); // If is a .length element with the same parent as a video, then is a timestamp overlay. Hide it
                if (v && v.parentNode === node.parentNode) {
                    node.style.display = "none";
                }
            } else {
                var videoLength = node.querySelectorAll("video"); // Get all videos and do the work
                for (var i = 0; i < videoLength.length; i++) {
                    var video = videoLength[i];

                    // Show controls
                    video.setAttribute("controls", "1");

                    // Set volume by clicking over the video, but only after the video plays automatically (managed by 9gag)
                    if (VOUME_LEVEL > 0) {
                        var audiotoggle = video.parentNode.querySelector(".sound-toggle");
                        if (audiotoggle) { // Has audio
                            video.addEventListener("play", onFirstPlay);
                        }
                    }

                    // Fix timebar drag bug
                    var drag = video.closest(".badge-track");
                    if (drag) {
                        drag.addEventListener("dragstart", function(e) {
                            e.preventDefault();
                        });
                    }

                    // Hide 9gag overlays
                    var els = video.parentNode.querySelectorAll(".sound-toggle,.length");
                    for (var ii = 0; ii < els.length; ii++) {
                        els[ii].style.display = "none";
                    }
                }
            }
        }
    }
    var observer = new MutationObserver(function(mutationsList) {
        // Check for dynamic added content to the body
        for (var i = 0; i < mutationsList.length; i++) {
            for (var ii = 0; ii < mutationsList[i].addedNodes.length; ii++) {
                checkVideos(mutationsList[i].addedNodes[ii]);
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    checkVideos(document.body);
})();