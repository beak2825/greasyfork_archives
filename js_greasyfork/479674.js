// ==UserScript==
// @name         Twitter do not loop videos
// @namespace    zezombye.dev
// @version      0.1
// @description  Do not automatically loop videos on twitter (when they're under 60s). Didn't test with autoplay. Disable autoplay in twitter settings if it doesn't work
// @author       Zezombye
// @match        https://twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479674/Twitter%20do%20not%20loop%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/479674/Twitter%20do%20not%20loop%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var videos = document.getElementsByTagName("video");
        for (var video of videos) {
            if (video.hasAttribute("has-anti-loop-event")) {
                continue;
            }
            video.onended = function() {if (this.currentTime < 1) {this.pause()}}
            video.setAttribute("has-anti-loop-event", "true");
        }
    }, 100);
})();