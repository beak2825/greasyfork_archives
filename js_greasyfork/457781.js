// ==UserScript==
// @name         YouTube - Read Comments while Watching
// @version      1.0.1
// @description  This script reads comments while watching a video if you're acting like a tablet interface.
// @author       Magma_Craft
// @license MIT
// @match        https://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457781/YouTube%20-%20Read%20Comments%20while%20Watching.user.js
// @updateURL https://update.greasyfork.org/scripts/457781/YouTube%20-%20Read%20Comments%20while%20Watching.meta.js
// ==/UserScript==

(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};

    var iv = setInterval(function() {
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_comments_panel_button = true;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_hide_comments_while_panel_open = true;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_comments_ep_disable_theater = false;
    }, 1);

    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
})();

(function() {
ApplyCSS();

function ApplyCSS() {
var styles = document.createElement("style");
styles.innerHTML=`
/* Removes second comment teaser box */
#comment-teaser.ytd-watch-metadata {
display: none !important;
}`
document.head.appendChild(styles);
}
})();