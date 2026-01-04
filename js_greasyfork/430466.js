// ==UserScript==
// @name         YouTube Config Editor
// @namespace    goodtube.github.io
// @version      0.1
// @description  Edits yt.config_
// @author       GoodTube
// @match        *.youtube.com/*
// @icon         https://www.yotube.com/favicon.ico
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430466/YouTube%20Config%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/430466/YouTube%20Config%20Editor.meta.js
// ==/UserScript==
(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};

    var iv = setInterval(function() {
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_snap_sizing = true;
    }, 1);

    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
})();