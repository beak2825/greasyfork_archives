// ==UserScript==
// @name         YouTube Speed Changer
// @namespace    https://fxzfun.com/
// @version      0.2
// @description  Use a url parameter to change the video speed
// @author       FXZFun
// @match        https://www.youtube.com/live/*
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/460146/YouTube%20Speed%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/460146/YouTube%20Speed%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var params = new URLSearchParams(location.search);
    var speed = params.get("s", null);
    if (speed) {
        document.querySelector("video").playbackRate = speed;
    }
})();