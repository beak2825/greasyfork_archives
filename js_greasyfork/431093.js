// ==UserScript==
// @name         Fix YouTube Icons (Credit Goes To Ian Hiew)
// @namespace    http://cleantalk.cf
// @version      0.1.5
// @description  Fixes The New YouTube Icons with the old icons. Code By Bobby Resine.
// @author       You
// @match        https://*.youtube.com/*
// @icon         https://imgur.com/Fdblw8I.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431093/Fix%20YouTube%20Icons%20%28Credit%20Goes%20To%20Ian%20Hiew%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431093/Fix%20YouTube%20Icons%20%28Credit%20Goes%20To%20Ian%20Hiew%29.meta.js
// ==/UserScript==


var iv = setInterval(function(){
    if (typeof yt.config_.EXPERIMENT_FLAGS !== 'undefined')
    {
        // !!! YOUR CODE HERE !!!
        yt.config_.EXPERIMENT_FLAGS.kevlar_updated_icons = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_system_icons = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_color_update = false;
        clearInterval(iv);
    }
}, 1);