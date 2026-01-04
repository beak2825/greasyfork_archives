// ==UserScript==
// @name         Pornhub: Copy username along with video title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Saves time pasting filenames to downloaded pornhub videos.
// @license      gpl-3.0
// @match        https://www.tampermonkey.net/scripts.php
// @grant        none
// @include https://www.pornhub.com/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/488919/Pornhub%3A%20Copy%20username%20along%20with%20video%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/488919/Pornhub%3A%20Copy%20username%20along%20with%20video%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elem2 = document.querySelector("div.video-wrapper h1.title span");
    elem2.addEventListener('copy', function (e) {
        e.preventDefault();
        var clipboardData = e.clipboardData;
        if (clipboardData == null) clipboardData = window.clipboardData;
        var value = "- " + elem2.innerHTML;
        var elem3 = document.querySelector("div.video-wrapper div.usernameWrap a");
        if (elem3 != null) value = "ph-" + elem3.innerText + value;
        else value = "ph" + value;
        clipboardData.setData('text/plain', value);
    });

})();