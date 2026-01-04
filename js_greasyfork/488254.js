// ==UserScript==
// @name         Pre 2024 Youtube UI
// @version      1.1.0
// @description  Revert to old Youtube UI
// @author       Hared
// @match        *.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @grant        none
// @license MIT
// @namespace hared_yt
// @downloadURL https://update.greasyfork.org/scripts/488254/Pre%202024%20Youtube%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/488254/Pre%202024%20Youtube%20UI.meta.js
// ==/UserScript==
(function () {
  'use strict';
setInterval(function() {
  // Revert the new YouTube 2024 redesign experiment flags
  ytcfg.set('EXPERIMENT_FLAGS', {
    ...ytcfg.get('EXPERIMENT_FLAGS'),
    web_player_enable_featured_product_banner_exclusives_on_desktop:false,
    kevlar_watch_comments_ep_disable_theater:true,
    kevlar_watch_comments_panel_button:true,
    fill_view_models_on_web_vod:true,
    kevlar_watch_flexy_metadata_height:136,
    kevlar_watch_grid:false,
    kevlar_watch_max_player_width:1280,
    live_chat_over_engagement_panels:false,
    live_chat_scaled_height:false,
    live_chat_smaller_min_height:false,
    main_app_controller_extraction_batch_18:false,
    main_app_controller_extraction_batch_19:false,
    no_iframe_for_web_stickiness:false,
    optimal_reading_width_comments_ep:false,
    remove_masthead_channel_banner_on_refresh:false,
    small_avatars_for_comments:false,
    small_avatars_for_comments_ep:false,
    web_watch_compact_comments:false,
    web_watch_compact_comments_header:false,
    web_watch_log_theater_mode:false,
    web_watch_theater_chat:false,
    web_watch_theater_fixed_chat:false,
    wn_grid_max_item_width:0,
    wn_grid_min_item_width:0,
  });
}, 100);


})();

window.addEventListener('load', function () {

    setTimeout(function() {
        setInterval(function() {
        let isFull = window.screenTop;
        let isCin = document.querySelector('#player-container-inner').children.length == 0;
        if(isFull || isCin)
            return;
        let el = document.querySelector(".ytd-page-manager");
        el.setAttribute("style", "--ytd-watch-flexy-scrollbar-width: 17px; --ytd-watch-flexy-max-player-width-wide-screen: 1280px; --ytd-watch-flexy-space-below-player: 136px; --ytd-watch-flexy-panel-max-height: 695px; --ytd-watch-flexy-chat-max-height: 695px; --ytd-watch-flexy-structured-description-max-height: 695px; --ytd-watch-flexy-comments-panel-max-height: 695px; --ytd-comments-engagement-panel-content-height: 695px;");
}, 100)
}, 1000)

    setTimeout(function() {
        setInterval(function() {
        let isFull = window.screenTop;
        let isCin = document.querySelector('#player-container-inner').children.length == 0;
        if(isFull || isCin)
            return;
        let el = document.querySelector(".ytp-chrome-bottom");
        el.setAttribute("style", "width: 1260px; left: 12px;");
        el = document.querySelector(".video-stream");
        el.setAttribute("style", "height: 720px; left: 0px; top: 0px; width: 1280px;");
}, 100)
}, 1000)

})

function callback() {
if (document.fullscreenElement) {
document.getElementById("chips-wrapper").style.visibility = "hidden";
} else {
document.getElementById("chips-wrapper").style.visibility = "visible";
}
}
document.addEventListener('fullscreenchange', callback);
document.addEventListener('webkitfullscreenchange', callback);