// ==UserScript==
// @name         YouTube Config Editor (fixed version)
// @version      1.0.1
// @description  Edits yt.config_
// @author       Magma_Craft, Kyle Boyd (original author)
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @run-at       document-start
// @license      MIT
// @namespace    https://greasyfork.org/en/users/933798
// @run-at       document-start
// ==/UserScript==

(function() {
    window['yt'] = window['yt'] || {};
    yt['config_'] = yt.config_ || {};
    yt.config_['EXPERIMENT_FLAGS'] = yt.config_.EXPERIMENT_FLAGS || {};
 
    var iv = setInterval(function() {
        //disable flexy player :D
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_snap_sizing = true;
        //probably for m.youtube.com
        yt.config_.IS_TABLET = true;
        //new mic dark background(not working)
        yt.config_.EXPERIMENT_FLAGS.desktop_mic_background = false;
        //dk what is this
        yt.config_.EXPERIMENT_FLAGS.polymer_verifiy_app_state = false;
        //hh search bar
        yt.config_.SBOX_SETTINGS.IS_POLYMER = false;
        //disables the "warm loading" thingy, ie the red bar when loading, letting the page load completely fresh every single time
        //yt.config_.DISABLE_WARM_LOADS = true;
        //yt.config_.EXPERIMENT_FLAGS.warm_load_nav_start_web = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_player_response_swf_config_wrapper_killswitch = false;
        //yt.config_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH.playerStyle = "blazer";
        yt.config_.EXPERIMENT_FLAGS.desktop_player_touch_gestures = false;
        //loads images faster damnit
        yt.config_.DISABLE_YT_IMG_DELAY_LOADING = true;
        //disable new icons
        yt.config_.EXPERIMENT_FLAGS.kevlar_updated_icons = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_system_icons = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_color_update = false;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_structured_description_height_matches_player = true;
        yt.config_.EXPERIMENT_FLAGS.kevlar_watch_skeleton = false;
        yt.config_.EXPERIMENT_FLAGS.web_structure_description_show_metadata = true;
    }, 1);
 
    var to = setTimeout(function() {
        clearInterval(iv);
    }, 1000)
 
})();

document.getElementsByTagName("html")[0].removeAttribute("system-icons");
document.getElementsByTagName("html")[0].removeAttribute("darker-dark-theme");
document.getElementsByTagName("html")[0].removeAttribute("darker-dark-theme-deprecate");