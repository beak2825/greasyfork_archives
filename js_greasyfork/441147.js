// ==UserScript==
// @name         imgur fullscreem/bigger images
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove columns and make the images in imgur larger so it covers most of the screen.
// @author       Vorm--
// @match        *://imgur.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441147/imgur%20fullscreembigger%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/441147/imgur%20fullscreembigger%20images.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


addGlobalStyle(`
.Gallery-Sidebar {
    display: none;
}

.Gallery {
    width: 99% !important;
    max-width: 100% !important;
}

.Gallery-contentWrapper {
    padding-left: 0 !important;
    margin-left: 10px !important;
}

.badges-wrapper {
    padding: 10px;
}

.post-container {
    width: 100% !important;
}

#inside {
    width: 90% !important;
}

.left {
    float: none !important;
}

.post-header {
    width: 100% !important;
}

.post-header.fixed  {
    width: 90% !important;
}

`);