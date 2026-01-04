// ==UserScript==
// @name         Old Icons Restorer
// @namespace    goodtube.github.io
// @version      1.0
// @description  Restores the old icons for YouTube
// @author       diyamund
// @match        *.youtube.com/*
// @icon         https://www.yotube.com/favicon.ico
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430925/Old%20Icons%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/430925/Old%20Icons%20Restorer.meta.js
// ==/UserScript==
(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};

    var iv = setInterval(function() {
        yt.config_.EXPERIMENT_FLAGS.kevlar_updated_icons = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_system_icons = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_color_update = false;
    }, 1);

    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
})();