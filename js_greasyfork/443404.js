// ==UserScript==
// @name         Restore Classic video unavailable page
// @version      1.0
// @description  Edits yt.config_
// @author       Cat Bot
// @license MIT
// @match        *://*.youtube.com/*
// @namespace    https://www.reddit.com/user/Cat_Bot4
// @icon         https://www.youtube.com/favicon.ico
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443404/Restore%20Classic%20video%20unavailable%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/443404/Restore%20Classic%20video%20unavailable%20page.meta.js
// ==/UserScript==

(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};

    var iv = setInterval(function() {
        yt.config_.EXPERIMENT_FLAGS.kevlar_unavailable_video_error_ui_client = false;
    }, 1);

    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
})();