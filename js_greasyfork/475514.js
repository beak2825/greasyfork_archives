// ==UserScript==
// @name YouTube™ Multi Downloader - sfrom.net (Shift + D)
// @namespace    https://greasyfork.org/en/users/1175165-arnvgl
// @version      1.0
// @description  Adds "sfrom.net/" to the front of YouTube URL when Shift + D is pressed to enable downloading videos easily.
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475514/YouTube%E2%84%A2%20Multi%20Downloader%20-%20sfromnet%20%28Shift%20%2B%20D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475514/YouTube%E2%84%A2%20Multi%20Downloader%20-%20sfromnet%20%28Shift%20%2B%20D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'D') {
            event.preventDefault();
            var currentUrl = window.location.href;
            var newUrl = 'https://sfrom.net/' + currentUrl;
            window.location.href = newUrl;
        }
    });
})();