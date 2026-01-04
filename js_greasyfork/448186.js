// ==UserScript==
// @name         youtube darker dark theme enabler
// @version      1.0
// @description  enforces youtubes built in darker dark theme feature flag. This is currently a beta feature that only a small percentage of people have
// @author       Cat Bot
// @license MIT
// @match        *://*.youtube.com/*
// @namespace    https://www.reddit.com/user/Cat_Bot4
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448186/youtube%20darker%20dark%20theme%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/448186/youtube%20darker%20dark%20theme%20enabler.meta.js
// ==/UserScript==

(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};

    var iv = setInterval(function() {
        yt.config_.EXPERIMENT_FLAGS.web_darker_dark_theme = true; //set this to false if you already have this feature but want to disable it
    }, 1);

    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
})();
