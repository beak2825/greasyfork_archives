// ==UserScript==
// @name         Zoom Records Hotkeys
// @namespace    https://kyleschwartz.ca
// @version      0.1.1
// @description  Add hotkeys for prerecorded zoom videos
// @author       Kyle Schwartz
// @match        https://*.zoom.us/rec/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412034/Zoom%20Records%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/412034/Zoom%20Records%20Hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', e => {
        if (e.code === "Space"){
            document.getElementsByClassName("vjs-play-control")[0].click();
        } else if (e.code === "KeyF") {
            document.getElementsByClassName("vjs-fullscreen-toggle-control-button")[0].click();
        } else if (e.code === "ArrowLeft"){
            document.getElementById("vjs_video_3_html5_api").currentTime -= 10;
        } else if (e.code === "ArrowRight"){
            document.getElementById("vjs_video_3_html5_api").currentTime += 10;
        }
    });
})();