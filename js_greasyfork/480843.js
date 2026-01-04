// ==UserScript==
// @name        youtube profile picture hd
// @namespace   youtube profile picture hd
// @match       https://yt3.googleusercontent.com/ytc/*=s*
// @match       https://yt3.googleusercontent.com/*=s*
// @run-at      document-start
// @grant       none
// @version     1.4
// @description view youtube profile picture in high resolution
// @downloadURL https://update.greasyfork.org/scripts/480843/youtube%20profile%20picture%20hd.user.js
// @updateURL https://update.greasyfork.org/scripts/480843/youtube%20profile%20picture%20hd.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const currentUrl = window.location.href;
    const newSize = 5000; // Define the new size here
    const sizeRegex = /=s\d+/; // Match the size parameter
    const newUrl = currentUrl.replace(sizeRegex, `=s${newSize}`);
    if (currentUrl !== newUrl) {
        window.location.replace(newUrl);
    }
})();