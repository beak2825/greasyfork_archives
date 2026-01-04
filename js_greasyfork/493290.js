// ==UserScript==
// @name         Classic Youtube Layout
// @version      1.01
// @description  Revert to old Youtube UI Layout. Comments below the video and recommendations in the sidebar. Forked from https://greasyfork.org/en/scripts/488254-pre-2024-youtube-ui v.1.1.0 by KartongFace on 4/22/2024
// @author       Andrew Toups
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @namespace    2psy
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493290/Classic%20Youtube%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/493290/Classic%20Youtube%20Layout.meta.js
// ==/UserScript==
GM_addStyle(`
ytd-watch-flexy ytd-rich-grid-row #dismissible.ytd-rich-grid-media {
  flex-direction: row;
  max-width: 100%;
  width: 100%;
  gap: 1rem;
}
ytd-watch-flexy ytd-rich-grid-row #thumbnail {
  width: 100%;
  flex: 1 0 50%;
}
ytd-watch-flexy ytd-rich-grid-row #details.ytd-rich-grid-media {
  flex: 1 0 50%;
  -moz-box-flex: unset;
  width: auto;
  max-width: 100%;
  flex-direction: column;
}
ytd-watch-flexy #avatar-link.ytd-rich-grid-media { display: none; }
ytd-watch-flexy #video-title.ytd-rich-grid-media {
  font-size: 1.4rem;
  line-height: 1.2;
}
ytd-watch-flexy h3.ytd-rich-grid-media { margin-top: 0; }
ytd-watch-flexy ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block,
ytd-watch-flexy ytd-video-meta-block[rich-meta] #byline-container.ytd-video-meta-block {
  font-size: 1.2rem;
  line-height: 1.2;
}
ytd-watch-flexy ytd-rich-item-renderer { margin-bottom: 7px; }
ytd-watch-flexy ytd-rich-grid-renderer[reduced-top-margin] #contents.ytd-rich-grid-renderer { padding-top: 0; }
ytd-watch-flexy ytd-rich-grid-row #contents.ytd-rich-grid-row { margin: 0; }
`);

(function () {
  'use strict';
    setInterval(function() {
        // Revert the new YouTube 2024 redesign experiment flags
        if (typeof ytcfg === "object") {
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
        }
    }, 100);
})();
const marker = "/*ignore*/";
window.addEventListener('load', function () {
    setInterval(function() {
        const isFull = document.fullscreenElement !== null;
        const isCin = document.querySelector('#player-container-inner')?.children.length === 0;
        if (isFull || isCin) return;
        const controls = document.querySelector(".ytp-chrome-bottom");
        const baseWidth = parseInt(controls?.style.width);
        const padding = 2 * parseInt(controls?.style.left);
        const basis = baseWidth + padding;
        const column = document.querySelector("#primary.ytd-watch-flexy");
        column?.setAttribute("style",
                         `--ytd-watch-flexy-max-player-width: min(calc((100vh - var(--ytd-watch-flexy-masthead-height) - var(--ytd-watch-flexy-space-below-player))*(var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))), ${basis}px);
                         flex: 1 0 calc(48px + ${basis}px);`);
        const container = column.querySelector("#player-container-outer");
        container.setAttribute("style", `min-width: ${basis}px;`);
    }, 100);
});

function callback() {
    if (document.fullscreenElement) {
        document.getElementById("chips-wrapper").style.visibility = "hidden";
    } else {
        document.getElementById("chips-wrapper").style.visibility = "visible";
    }
}
document.addEventListener('fullscreenchange', callback);
document.addEventListener('webkitfullscreenchange', callback);