// ==UserScript==
// @name         Rounded Thumbnails
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix the non-rounded corners on the video that you hover the mouse over.
// @author       dsvl0
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539375/Rounded%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/539375/Rounded%20Thumbnails.meta.js
// ==/UserScript==

(function() {
    const fixStyle = document.createElement('style');
    fixStyle.textContent = ` div#video-preview-container {border-radius: 12px; overflow: hidden} `
    document.body.after(fixStyle);
    // It's not that hard, is it, Google?
})();