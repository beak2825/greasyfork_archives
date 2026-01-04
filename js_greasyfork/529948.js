// ==UserScript==
// @name         Youtube Time Saver
// @namespace    http://tampermonkey.net/
// @version      2025-02-26
// @description  save time position in youtube URLs
// @author       ZXMushroom63
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license GPL3
// @downloadURL https://update.greasyfork.org/scripts/529948/Youtube%20Time%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/529948/Youtube%20Time%20Saver.meta.js
// ==/UserScript==

(function() {
    var lastWrittenTimecode = -1;
    function updateVideoProgress() {
        var video = document.querySelector("video[tabindex=\"-1\"][src]");
        if (!video || (Math.abs(video.currentTime - lastWrittenTimecode) < 5)) {
            return;
        }
        lastWrittenTimecode = Math.round(video.currentTime);
        var params = new URLSearchParams(location.search);
        params.set("t", Math.round(video.currentTime) + "s");
        history.replaceState(null, "", location.pathname + "?" + params.toString());
    }
    setInterval(updateVideoProgress, 1000*60*8);
    addEventListener("blur", updateVideoProgress);
    addEventListener("beforeunload", updateVideoProgress);
})();