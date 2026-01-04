// ==UserScript==
// @name         yt config stuff
// @namespace    http://cleantalk.cf
// @version      0.1
// @description  try to configure yt
// @author       You
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430468/yt%20config%20stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/430468/yt%20config%20stuff.meta.js
// ==/UserScript==


//disable flexy player :smile:
var iv = setInterval(function(){
    if (typeof yt.config_.EXPERIMENT_FLAGS !== 'undefined')
    {
        // !!! YOUR CODE HERE !!!
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_snap_sizing = true;
        //probably for m.youtube.com
        yt.config_.IS_TABLET = true;
        //studio stuff, needs researching
        yt.config_.IS_MADISON_ACCOUNT = true;
        //new mic dark background(not working)
        yt.config_.EXPERIMENT_FLAGS.desktop_mic_background = false;
        //dk what is this
        yt.config_.EXPERIMENT_FLAGS.polymer_verifiy_app_state = false;
        //hh search bar
        yt.config_.SBOX_SETTINGS.IS_POLYMER = false;
        //no sub count(what is this??)
        yt.config_.EXPERIMENT_FLAGS.no_sub_count_on_sub_button = false;
        //disables the "warm loading" thingy, ie the red bar when loading, letting the page load completely fresh every single time
        yt.config_.DISABLE_WARM_LOADS = true;
        //yt.config_.EXPERIMENT_FLAGS.warm_load_nav_start_web = false;

        clearInterval(iv);
    }
}, 1);
