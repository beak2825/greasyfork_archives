// ==UserScript==
// @name         Enable Picture-in-Picture for Microsoft Stream
// @namespace    https://greasyfork.org/en/users/555204-bcldvd
// @version      0.2
// @description  As per title :)
// @author       You
// @match        https://web.microsoftstream.com/video/*
// @match        https://*.sharepoint.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405034/Enable%20Picture-in-Picture%20for%20Microsoft%20Stream.user.js
// @updateURL https://update.greasyfork.org/scripts/405034/Enable%20Picture-in-Picture%20for%20Microsoft%20Stream.meta.js
// ==/UserScript==

(function() {
    let intervalID = window.setInterval(checkForVideoElement, 500);

    function checkForVideoElement() {
        if (document.getElementsByTagName('video').length === 0) return;

        clearContextMenu(document.getElementsByTagName('video')[0])
        window.clearInterval(intervalID);
    }

    function clearContextMenu(video) {
        video.oncontextmenu = function(event) {
            // Don't block
        }
    }
})();