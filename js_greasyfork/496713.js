// ==UserScript==
// @name         mmdfans mod title
// @namespace    mmdfans mod title.
// @version      0.1
// @description  mmdfans mod title.
// @author       You
// @license       MIT
// @match        https*://mmdfans.net/mmd/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mmdfans.net
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.6.4/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/496713/mmdfans%20mod%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/496713/mmdfans%20mod%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.title = document.title
        + ' - ' + $('#p-d > div.mdui-container > div:nth-child(7) > a > button').text()
        + ' - ' + $('#p-d > div.mdui-container > div:nth-child(10) > button.mdui-btn.mdui-color-theme-accent.mdui-ripple').text().match(/\d+\-\d+-\d+/)[0]
        + ' iwara mmdfans.mp4 '
})();