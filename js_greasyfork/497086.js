// ==UserScript==
// @name         Auto-fullscreen image/video (rule34.xxx)
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.1
// @description  fuh tingleling
// @author       You
// @match        https://rule34.xxx/index.php*
// @match        https://*.rule34.xxx/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/497086/Auto-fullscreen%20imagevideo%20%28rule34xxx%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497086/Auto-fullscreen%20imagevideo%20%28rule34xxx%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loc = window.location.href;
    if (loc.includes("index.php")) {
        document.cookie = "resize-notification=1;"
        document.cookie = "resize-original=1;"

        let image = document.getElementById("image")
        if (image) {
            window.location.href = image.src
        }

        let video = document.querySelectorAll('source')[0]
        if (video) {
            window.location.href = video.src
        }
    }

    if (loc.includes("mp4.rule34.xxx")) {
        let vid = document.querySelectorAll('video')[0]
        vid.style = "width: 100%;height: 100vh;position: fixed"
        vid.loop = true
        vid.preload = true
    }
})();