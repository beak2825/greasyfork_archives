// ==UserScript==
// @name         Remove YT Embed Pause Overlay
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.3
// @description  Removes the pause overlay from embedded YouTube videos
// @author       rend
// @include      https://www.youtube*.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29187/Remove%20YT%20Embed%20Pause%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/29187/Remove%20YT%20Embed%20Pause%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        document.getElementsByClassName("ytp-pause-overlay ytp-scroll-min")[0]?.remove();
        document.getElementsByClassName("ytp-pause-overlay")[0]?.remove();
        document.getElementsByClassName("ytp-pause-overlay-container")[0]?.remove();
    }, 1000);
})();