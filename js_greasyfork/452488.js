// ==UserScript==
// @name         YouTube Shorts-Be-Gone
// @namespace    https://www.soltoder.com/
// @version      2.0
// @description  Automatically redirect from the terrible YouTube Shorts viewer to the normal viewer.
// @author       AjaxGb
// @match        *.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @license      MIT-0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452488/YouTube%20Shorts-Be-Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/452488/YouTube%20Shorts-Be-Gone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isShorts(url) {
        return url.pathname.startsWith('/shorts/');
    }

    function redirectToNormal(shortsUrl) {
        const url = new URL(shortsUrl);

        const videoId = url.pathname.substring('/shorts/'.length);
        url.pathname = '/watch';
        url.searchParams.set('v', videoId);

        window.location = url;
    }

    window.addEventListener('yt-navigate', e => {
        if (isShorts(window.location)) {
            window.history.back(); // Delete the Shorts history entry
            redirectToNormal(window.location);
        }
    });

    if (isShorts(window.location)) {
        // Changing window.location during initial load
        // automatically overwrites the original history entry
        redirectToNormal(window.location);
    }
})();