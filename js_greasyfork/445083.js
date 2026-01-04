// ==UserScript==
// @name         bring back old dialog boxes
// @version      1.0
// @description  reverts the dialog boxes to the old ones which match your dark/light theme setting
// @author       Cat Bot
// @license MIT
// @match        *://*.youtube.com/*
// @namespace    https://www.reddit.com/user/Cat_Bot4
// @icon         https://www.youtube.com/favicon.ico
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445083/bring%20back%20old%20dialog%20boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/445083/bring%20back%20old%20dialog%20boxes.meta.js
// ==/UserScript==

(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};

    var iv = setInterval(function() {
        yt.config_.EXPERIMENT_FLAGS.web_snackbar_ui_refresh = false;
    }, 1);

    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
})();