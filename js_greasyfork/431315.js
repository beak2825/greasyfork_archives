// ==UserScript==
// @name         YouTube Remove Thin icons
// @namespace    goodtube.github.io
// @version      0.2
// @description  Edits yt.config_
// @author       GoodTube
// @match        *://*.youtube.com/*
// @icon         https://www.yotube.com/favicon.ico
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431315/YouTube%20Remove%20Thin%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/431315/YouTube%20Remove%20Thin%20icons.meta.js
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
document.getElementsByTagName("html")[0].removeAttribute("system-icons");
