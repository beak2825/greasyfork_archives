// ==UserScript==
// @name         Pre 2024 Youtube UI BY: X0T using CLAUDEAI
// @namespace    x0t.youtubeuirevert
// @version      1.3.0
// @description  Revert to old Youtube UI, including player control positioning
// @author       Hared (modified by X0T using CLAUDEAI)
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502920/Pre%202024%20Youtube%20UI%20BY%3A%20X0T%20using%20CLAUDEAI.user.js
// @updateURL https://update.greasyfork.org/scripts/502920/Pre%202024%20Youtube%20UI%20BY%3A%20X0T%20using%20CLAUDEAI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply custom CSS to revert UI changes
    GM_addStyle(`
        /* Revert player control positioning */
        .ytp-chrome-bottom {
            width: calc(100% - 24px) !important;
            left: 12px !important;
        }
        .ytp-progress-bar-container {
            bottom: 49px !important;
        }
        .ytp-chrome-controls {
            padding-left: 12px !important;
            padding-right: 12px !important;
        }
        /* Add more custom CSS here to revert other UI elements */
    `);

    function applyOldUI() {
        if (typeof ytcfg !== 'undefined') {
            ytcfg.set('EXPERIMENT_FLAGS', {
                ...ytcfg.get('EXPERIMENT_FLAGS'),
                web_player_enable_featured_product_banner_exclusives_on_desktop: false,
                kevlar_watch_comments_ep_disable_theater: true,
                kevlar_watch_comments_panel_button: true,
                fill_view_models_on_web_vod: true,
                kevlar_watch_flexy_metadata_height: 136,
                kevlar_watch_grid: false,
                kevlar_watch_max_player_width: 1280,
                live_chat_over_engagement_panels: false,
                live_chat_scaled_height: false,
                live_chat_smaller_min_height: false,
                main_app_controller_extraction_batch_18: false,
                main_app_controller_extraction_batch_19: false,
                no_iframe_for_web_stickiness: false,
                optimal_reading_width_comments_ep: false,
                remove_masthead_channel_banner_on_refresh: false,
                small_avatars_for_comments: false,
                small_avatars_for_comments_ep: false,
                web_watch_compact_comments: false,
                web_watch_compact_comments_header: false,
                web_watch_log_theater_mode: false,
                web_watch_theater_chat: false,
                web_watch_theater_fixed_chat: false,
                wn_grid_max_item_width: 0,
                wn_grid_min_item_width: 0,
            });
        }
    }

    // Apply old UI settings immediately and periodically
    applyOldUI();
    setInterval(applyOldUI, 1000);

    // You can add more functions here to handle other UI elements if needed
})();