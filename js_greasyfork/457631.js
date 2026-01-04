// ==UserScript==
// @name         Youtube Always Switch To Livestreams
// @namespace    https://www.youtube.com/
// @version      0.1
// @description  this script will enable live chat by default in youtube livestreams
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457631/Youtube%20Always%20Switch%20To%20Livestreams.user.js
// @updateURL https://update.greasyfork.org/scripts/457631/Youtube%20Always%20Switch%20To%20Livestreams.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        document.querySelector("a.yt-simple-endpoint:nth-child(2)").click();
    }catch {}
})();