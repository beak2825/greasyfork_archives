// ==UserScript==
// @name                  YouTube Configuration
// @name:en               YouTube Configuration
// @description           Read and Make YouTube Configuration
// @description:en        Read and Make YouTube Configuration

// @version               0.1.4
// @require               https://greasyfork.org/scripts/465421-vanilla-js-dialog/code/Vanilla%20JS%20Dialog.js?version=1184885

// @namespace             http://tampermonkey.net/
// @author                CY Fung
// @license               MIT
// @run-at                document-start
// @match                 https://www.youtube.com/*
// @exclude               /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                  https://cdn-icons-png.flaticon.com/512/1850/1850952.png

// @grant                 GM_registerMenuCommand
// @grant                 unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465494/YouTube%20Configuration.user.js
// @updateURL https://update.greasyfork.org/scripts/465494/YouTube%20Configuration.meta.js
// ==/UserScript==

(function (uWind) {
    'use strict';
    uWind = uWind || window;

    function insertCSS(cssText) {
        const styleEl = document.createElement('style');
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
    }


    function addCSSForList() {

        const style =
            `
      html {
    --yc-background-color: #fbfbfb;
    --yc-text-color: #333;
    --yc-border-color: #ccc;
    --yc-selected-background-color: #cce6ff;
    --yc-input-outline-color: currentColor;
  --yc-list-entry-mainkey-color: rgb(158, 45, 30);
  --yc-list-entry-minorkey-same-color: rgb(194, 185, 193);
  --yc-list-entry-minorkey-diff-color: rgb(199, 29, 185);
  }
  
  html[dark] {
    --yc-background-color: #222;
    --yc-text-color: #ddd;
    --yc-border-color: #555;
    --yc-selected-background-color: #4d4d4d;
    --yc-input-outline-color: #aaa;
  --yc-list-entry-mainkey-color: rgb(248, 160, 20);
  --yc-list-entry-minorkey-same-color: rgb(82, 77, 82);
  --yc-list-entry-minorkey-diff-color: rgb(228, 90, 217);
  }
  
  
  .list-container-wrapper{
  
  display: block;
  overflow-x: scroll;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
    max-width: 80vw;
    max-height: 60vh;
    overflow: auto;
    border: 1px solid var(--yc-border-color);
  }
  .list-container {
    font-family: monospace;
    font-size: 14px;
    margin: 10px auto;
    background-color: var(--yc-background-color);
    color: var(--yc-text-color);
    display: table;
    border-collapse: collapse;
    width: calc(100% - 16px);
  }
  
  .list-container:focus {
    outline: 0;
  }
  
  .list-entry {
    display: table-row;
    cursor: pointer;
  
  }
  
  html body .list-container[class] .list-entry[class]{
    user-select: none !important;
  }
  
  .list-entry.selected {
    background-color: var(--yc-selected-background-color);
  }
  
  .list-entry span.key,
  .list-entry span.value {
    display: table-cell;
    /* padding: 2px 8px; */
    padding:0;
  }
  
  .list-entry span.key {
  
    padding-left: 4px;
    padding-top: 2px;
    padding-bottom: 2px;
    max-width: 38em;
    min-width: 12em;
  }
  
  
  .list-entry span.value {
    max-width: 12em;
    min-width: 12em;
  }
  
  .list-entry input.value {
    display: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    cursor: text;
    border: 0;
    outline: 1px solid var(--yc-input-outline-color);
    border-radius: 4px;
  }
  
  .list-entry.editing span.value div {
    display: none;
  }
  
  .list-entry.editing input.value {
    display: table-cell;
  }
  
  .list-entry span.key {
    margin-right: 5px;
    font-weight: normal;
  }
  
  .list-entry.list-entry-mainkey span.key  div{
  /*    font-weight: 900 !important;*/
  /*
      color:rgb(158, 45, 30); */
  }
  

  .list-entry span.key  div::before{
  
    display:block;
    content:'　';

    color: var(--yc-list-entry-mainkey-color);
    float:left;
    margin-right:8px;
}

  .list-entry.list-entry-mainkey span.key  div::before{
  
      display:block;
      content:'※';
  
      color: var(--yc-list-entry-mainkey-color);
      float:left;
      margin-right:8px;
  }
  
  
  
  .list-entry.list-entry-minorkey-diff span.key div ,
  .list-entry.list-entry-minorkey-diff span.value div {
  
  font-weight: normal;
  
  color:var(--yc-list-entry-minorkey-diff-color);
  }
  
  .list-entry.list-entry-minorkey-same span.key div,
  .list-entry.list-entry-minorkey-same span.value div {
  
  font-weight: normal;
  
  color:var(--yc-list-entry-minorkey-same-color);
  }
  
  
  .list-container-wrapper::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  
  .list-container-wrapper::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }
  
  .list-container-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, .7);
  }
  .list-entry span.key div,
  .list-entry span.value div {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  
  }
  .list-entry.selected.editing span.key div{
      white-space: pre-wrap;
      height:auto;
  
      overflow-wrap: anywhere;
      white-space: pre-wrap !important;
  
  
  }
  
  .list-entry input{
  
      width: calc(100% - 32px) !important;
  
  }
  
  .list-hide-minor-same .list-entry.list-entry-minorkey-same{
      display:none;
  }
  
  .list-entry .value::before{
      content:':';
      float:left;
      margin-right:1em;
  }
      `;

        insertCSS(style);

    }

    function sortEntryKeys(keysArray){

        let mArr = keysArray.map(keyText => {
            return {
                keyText: keyText,
                sorterText: keyText.replace(/\.(\d+)\b/,(_, idx)=>{
                    idx = ('000'+idx).slice(-4);
                    return `.${idx}`;
                })
            };
        } );


        mArr.sort((a, b) => (a.sorterText > b.sorterText) ? 1 : -1);

        return mArr.map(o=>o.keyText);

    }


    function getModuleGetConfig() {

        function getConfig() {
            return uWind.yt.config_;
        }

        const prefs = {
            'PLAYER_CONFIG': 40,
            'PLAYER_REFERENCE': 40,
            'FEEDBACK_LOCALE_LANGUAGE': 40,
            'SANDBAR_LOCALE': 40,
            'HL_LOCALE': 40,
            'GAPI_LOCALE': 38,
            'IS_TABLET': 36,
            'WEB_PLAYER_CONTEXT_CONFIGS': 34,
            'HL': 34,
            'FILLER_DATA.player': 32,
            'FILLER_DATA.player.sts': 32,
            'INNERTUBE_CONTEXT': 30,
            'PAGE_NAME': 28,
            'LIST_ID': 26,
            'INNERTUBE_CONTEXT_GL': 24,
            'INNERTUBE_CONTEXT_HL': 24,
            'JS_COMMON_MODULE': 22,
            'BUTTON_REWORK': 20,

            'SBOX_SETTINGS.IS_POLYMER': 18,

            'DISABLE_YT_IMG_DELAY_LOADING': 16,





            'LOGGED_IN': 14,
            'DELEGATED_SESSION_ID': 14,
            'INNERTUBE_CONTEXT.client.visitorData': 14,
            'INNERTUBE_CONTEXT_CLIENT_NAME': 14,
            'INNERTUBE_CONTEXT_CLIENT_VERSION': 14,
            'ID_TOKEN': 14
        }

        const flags = `
  
  
  
  
  
  
  
  
  
  polymer_verifiy_app_state
  
  warm_load_nav_start_web
  
  kevlar_player_response_swf_config_wrapper_killswitch
  
  desktop_delay_player_resizing
  
  desktop_player_touch_gestures
  
  web_animated_like
  
  web_animated_like_lazy_load
  
  render_unicode_emojis_as_small_images
  
  kevlar_refresh_on_theme_change
  
  
  kevlar_watch_cinematics
  
  kevlar_watch_comments_panel_button
  
  
  kevlar_watch_hide_comments_while_panel_open
  
  
  kevlar_watch_comments_ep_disable_theater
  
  
  
  
  
  
  
  
  
  kevlar_updated_logo_icons
  
  kevlar_updated_icons
  
  kevlar_system_icons
  
  kevlar_watch_color_update
  
  desktop_mic_background
  
  web_snackbar_ui_refresh
  
  
  
  
  
  
  
  web_darker_dark_theme
  
  
  
  
  
  
  
  
  
  kevlar_updated_logo_icons
  
  kevlar_updated_icons
  
  kevlar_system_icons
  
  kevlar_watch_color_update
  
  
  
  
  
  
  kevlar_updated_logo_icons
  
  kevlar_updated_icons
  
  kevlar_system_icons
  
  kevlar_watch_color_update
  
  desktop_mic_background
  
  
  
  
  
  
  
  
  kevlar_updated_icons
  
  kevlar_system_icons
  
  kevlar_watch_color_update
  
  
  
  
  
  
  
  kevlar_watch_snap_sizing
  
  
  
  
  
  
  desktop_mic_background
  
  
  
  polymer_verifiy_app_state
  
  
  
  
  
  
  
  
  
  kevlar_player_response_swf_config_wrapper_killswitch
  
  
  desktop_player_touch_gestures
  
  
  
  
  
  
  kevlar_updated_icons
  
  kevlar_system_icons
  
  kevlar_watch_color_update
  
  kevlar_watch_structured_description_height_matches_player
  
  kevlar_watch_skeleton
  
  web_structure_description_show_metadata
  
  
  
  
  
  
  
  
  
  kevlar_unavailable_video_error_ui_client
  
  
  
  
  
  
  
  web_snackbar_ui_refresh
  
  
  
  
  
  
  kevlar_refresh_on_theme_change
  
  kevlar_watch_cinematics
  
  kevlar_watch_metadata_refresh
  
  kevlar_watch_metadata_refresh_attached_subscribe
  
  kevlar_watch_metadata_refresh_clickable_description
  
  kevlar_watch_metadata_refresh_compact_view_count
  
  kevlar_watch_metadata_refresh_description_info_dedicated_line
  
  kevlar_watch_metadata_refresh_description_inline_expander
  
  kevlar_watch_metadata_refresh_description_primary_color
  
  kevlar_watch_metadata_refresh_for_live_killswitch
  
  kevlar_watch_metadata_refresh_full_width_description
  
  kevlar_watch_metadata_refresh_narrower_item_wrap
  
  kevlar_watch_metadata_refresh_relative_date
  
  kevlar_watch_metadata_refresh_top_aligned_actions
  
  kevlar_watch_modern_metapanel
  
  kevlar_watch_modern_panels
  
  kevlar_watch_panel_height_matches_player
  
  web_animated_like
  
  web_button_rework
  
  web_button_rework_with_live
  
  web_darker_dark_theme
  
  web_filled_subscribed_button
  
  web_guide_ui_refresh
  
  web_modern_ads
  
  web_modern_buttons
  
  web_modern_chips
  
  web_modern_dialogs
  
  web_modern_playlists
  
  web_modern_subscribe
  
  web_rounded_containers
  
  web_rounded_thumbnails
  
  web_searchbar_style
  
  web_segmented_like_dislike_button
  
  web_sheets_ui_refresh
  
  web_snackbar_ui_refresh
  
  
  
  
  
  
  
  
  kevlar_watch_comments_panel_button
  
  kevlar_watch_hide_comments_while_panel_open
  
  kevlar_watch_comments_ep_disable_theater
  
  
  
  
  
  
  creator_enable_dark_theme_in_account_menu
  
  enable_playlist_list_in_content
  
  polymer_verifiy_app_state
  
  studio_system_icons
  
  
  
      `.replace(/\s*[\r\n]+\s*/g, '\n').trim().split('\n');

        //    console.log(flags)


        let pFlags = [...Object.keys(prefs)];
        let qFlags = new Set();

        for (const f of pFlags) qFlags.add(`${f}`);
        for (const f of flags) qFlags.add(`EXPERIMENT_FLAGS.${f}`);
        console.log([...qFlags.keys()]);

        const experFlags = {



        }


        const logger = new Map();

        const skipObjects = ['device', 'openPopupConfig', 'INNERTUBE_CONTEXT.client'];
        const skipper = new Set();
        for (const skipObject of skipObjects) {
            skipper.add(skipObject + '.');

        }


        const keywords = [
            'apiKey',
            'api-key',
            'API-KEY',
            'SESSION',
            'Id',
            'ID',
            'token',
            'id',
            'visitor',
            'VISITOR',
            'Visitor',
            'datasyncId',
            'DEVICE',
            'Device',
            'device',
            'endpoint',
            'GAPI-HINT-PARAMS',
            'clickTracking',
            'TRACKING',
            'LOGIN-INFO',
            'configData',
            'SITEKEY',
            'CLIENT',
            'HASH',
            'URL',
            'URLS',
            'client',
            'TOKEN',
            'rid',
            'host',
            'HOST',
            'Host',
            'Domain',
            'DOMAIN',
            'domain'
        ];

        const keywordRegexp = new RegExp('\\b(' + keywords.join('|') + ')\\b')

        function looper(obj, prefix, ws) {
            if (ws.has(obj)) return;
            ws.add(obj);
            if (obj instanceof Node) return;
            if (skipper.has(prefix)) return;
            for (const k of Object.keys(obj)) {




                let p = 0;
                switch (typeof obj[k]) {
                    case 'boolean':
                        p = 1;
                    case 'string':
                    case 'number':
                        p = 2;
                        break;
                    case 'object':
                        if (!obj[k]) {
                            p = 1;
                        }
                        else {
                            p = 3;
                        }
                        break;
                }

                if (p == 2 || p == 3) {

                    if (keywordRegexp.test(k.replace(/[^a-zA-Z0-9]/g, '-'))) p = 0;

                }

                if (p === 1 || p === 2) {


                    logger.set(prefix + k, obj[k]);

                } else if (p === 3) {


                    looper(obj[k], prefix + k + '.', ws);
                }

            }
        }



        let config_ = getConfig();
        logger.clear();
        looper(config_, '', new WeakSet());

        let looperKeys = [...logger.keys()];
        looperKeys.sort();
        let p = {};
        for (const key of looperKeys) {
            p[key] = logger.get(key);
        }

        return p;


    };



    const mainKeys = [
        "PLAYER_CONFIG",
        "PLAYER_REFERENCE",
        "FEEDBACK_LOCALE_LANGUAGE",
        "SANDBAR_LOCALE",
        "HL_LOCALE",
        "GAPI_LOCALE",
        "IS_TABLET",
        "WEB_PLAYER_CONTEXT_CONFIGS",
        "HL",
        "FILLER_DATA.player",
        "FILLER_DATA.player.sts",
        "INNERTUBE_CONTEXT",
        "PAGE_NAME",
        "LIST_ID",
        "INNERTUBE_CONTEXT_GL",
        "INNERTUBE_CONTEXT_HL",
        "JS_COMMON_MODULE",
        "BUTTON_REWORK",
        "SBOX_SETTINGS.IS_POLYMER",
        "DISABLE_YT_IMG_DELAY_LOADING",
        "LOGGED_IN",
        "DELEGATED_SESSION_ID",
        "INNERTUBE_CONTEXT.client.visitorData",
        "INNERTUBE_CONTEXT_CLIENT_NAME",
        "INNERTUBE_CONTEXT_CLIENT_VERSION",
        "ID_TOKEN",
        "EXPERIMENT_FLAGS.polymer_verifiy_app_state",
        "EXPERIMENT_FLAGS.warm_load_nav_start_web",
        "EXPERIMENT_FLAGS.kevlar_player_response_swf_config_wrapper_killswitch",
        "EXPERIMENT_FLAGS.desktop_delay_player_resizing",
        "EXPERIMENT_FLAGS.desktop_player_touch_gestures",
        "EXPERIMENT_FLAGS.web_animated_like",
        "EXPERIMENT_FLAGS.web_animated_like_lazy_load",
        "EXPERIMENT_FLAGS.render_unicode_emojis_as_small_images",
        "EXPERIMENT_FLAGS.kevlar_refresh_on_theme_change",
        "EXPERIMENT_FLAGS.kevlar_watch_cinematics",
        "EXPERIMENT_FLAGS.kevlar_watch_comments_panel_button",
        "EXPERIMENT_FLAGS.kevlar_watch_hide_comments_while_panel_open",
        "EXPERIMENT_FLAGS.kevlar_watch_comments_ep_disable_theater",
        "EXPERIMENT_FLAGS.kevlar_updated_logo_icons",
        "EXPERIMENT_FLAGS.kevlar_updated_icons",
        "EXPERIMENT_FLAGS.kevlar_system_icons",
        "EXPERIMENT_FLAGS.kevlar_watch_color_update",
        "EXPERIMENT_FLAGS.desktop_mic_background",
        "EXPERIMENT_FLAGS.web_snackbar_ui_refresh",
        "EXPERIMENT_FLAGS.web_darker_dark_theme",
        "EXPERIMENT_FLAGS.kevlar_watch_snap_sizing",
        "EXPERIMENT_FLAGS.kevlar_watch_structured_description_height_matches_player",
        "EXPERIMENT_FLAGS.kevlar_watch_skeleton",
        "EXPERIMENT_FLAGS.web_structure_description_show_metadata",
        "EXPERIMENT_FLAGS.kevlar_unavailable_video_error_ui_client",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_attached_subscribe",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_clickable_description",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_compact_view_count",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_description_info_dedicated_line",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_description_inline_expander",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_description_primary_color",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_for_live_killswitch",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_full_width_description",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_narrower_item_wrap",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_relative_date",
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_top_aligned_actions",
        "EXPERIMENT_FLAGS.kevlar_watch_modern_metapanel",
        "EXPERIMENT_FLAGS.kevlar_watch_modern_panels",
        "EXPERIMENT_FLAGS.kevlar_watch_panel_height_matches_player",
        "EXPERIMENT_FLAGS.web_button_rework",
        "EXPERIMENT_FLAGS.web_button_rework_with_live",
        "EXPERIMENT_FLAGS.web_filled_subscribed_button",
        "EXPERIMENT_FLAGS.web_guide_ui_refresh",
        "EXPERIMENT_FLAGS.web_modern_ads",
        "EXPERIMENT_FLAGS.web_modern_buttons",
        "EXPERIMENT_FLAGS.web_modern_chips",
        "EXPERIMENT_FLAGS.web_modern_dialogs",
        "EXPERIMENT_FLAGS.web_modern_playlists",
        "EXPERIMENT_FLAGS.web_modern_subscribe",
        "EXPERIMENT_FLAGS.web_rounded_containers",
        "EXPERIMENT_FLAGS.web_rounded_thumbnails",
        "EXPERIMENT_FLAGS.web_searchbar_style",
        "EXPERIMENT_FLAGS.web_segmented_like_dislike_button",
        "EXPERIMENT_FLAGS.web_sheets_ui_refresh",
        "EXPERIMENT_FLAGS.creator_enable_dark_theme_in_account_menu",
        "EXPERIMENT_FLAGS.enable_playlist_list_in_content",
        "EXPERIMENT_FLAGS.studio_system_icons"
    ];
    const minorKeyValues =

    {
        "BUTTON_REWORK": true,
        "CSI_SERVICE_NAME": "youtube",
        "DCLKSTAT": 1,
        "DEFERRED_DETACH": true,
        "DISABLE_WARM_LOADS": false,
        "DISABLE_YT_IMG_DELAY_LOADING": false,
        "ELEMENT_POOL_DEFAULT_CAP": 75,
        "EXPERIMENT_FLAGS.H5_async_logging_delay_ms": 30000,
        "EXPERIMENT_FLAGS.H5_enable_full_pacf_logging": true,
        "EXPERIMENT_FLAGS.H5_use_async_logging": true,
        "EXPERIMENT_FLAGS.addto_ajax_log_warning_fraction": 0.1,
        "EXPERIMENT_FLAGS.allow_skip_networkless": true,
        "EXPERIMENT_FLAGS.autoescape_tempdata_url": true,
        "EXPERIMENT_FLAGS.autoplay_pause_by_lact_sampling_fraction": 0,
        "EXPERIMENT_FLAGS.autoplay_pause_by_lact_sec": 0,
        "EXPERIMENT_FLAGS.autoplay_time": 8000,
        "EXPERIMENT_FLAGS.autoplay_time_for_fullscreen": 3000,
        "EXPERIMENT_FLAGS.autoplay_time_for_music_content": 3000,
        "EXPERIMENT_FLAGS.background_thread_flush_logs_due_to_batch_limit": true,
        "EXPERIMENT_FLAGS.botguard_async_snapshot_timeout_ms": 3000,
        "EXPERIMENT_FLAGS.browse_ajax_log_warning_fraction": 1,
        "EXPERIMENT_FLAGS.browse_next_continuations_migration_playlist": true,
        "EXPERIMENT_FLAGS.c3_watch_page_component": true,
        "EXPERIMENT_FLAGS.cache_utc_offset_minutes_in_pref_cookie": true,
        "EXPERIMENT_FLAGS.cancel_pending_navs": true,
        "EXPERIMENT_FLAGS.caption_edit_on_hover": true,
        "EXPERIMENT_FLAGS.check_navigator_accuracy_timeout_ms": 0,
        "EXPERIMENT_FLAGS.check_user_lact_at_prompt_shown_time_on_web": true,
        "EXPERIMENT_FLAGS.cinematic_watch_css_filter_blur_strength": 40,
        "EXPERIMENT_FLAGS.cinematic_watch_effect_opacity": 0.4,
        "EXPERIMENT_FLAGS.cinematic_watch_fade_out_duration": 500,
        "EXPERIMENT_FLAGS.clear_user_partitioned_ls": true,
        "EXPERIMENT_FLAGS.cloud_save_game_data_rate_limit_ms": 3000,
        "EXPERIMENT_FLAGS.cold_missing_history": true,
        "EXPERIMENT_FLAGS.compress_gel": true,
        "EXPERIMENT_FLAGS.compression_disable_point": 10,
        "EXPERIMENT_FLAGS.compression_performance_threshold": 250,
        "EXPERIMENT_FLAGS.csi_on_gel": true,
        "EXPERIMENT_FLAGS.debug_forced_internalcountrycode": "",
        "EXPERIMENT_FLAGS.decorate_autoplay_renderer": true,
        "EXPERIMENT_FLAGS.defer_menus": true,
        "EXPERIMENT_FLAGS.defer_overlays": true,
        "EXPERIMENT_FLAGS.defer_rendering_outside_visible_area": true,
        "EXPERIMENT_FLAGS.deprecate_csi_has_info": true,
        "EXPERIMENT_FLAGS.deprecate_pair_servlet_enabled": true,
        "EXPERIMENT_FLAGS.deprecate_two_way_binding_child": true,
        "EXPERIMENT_FLAGS.deprecate_two_way_binding_parent": true,
        "EXPERIMENT_FLAGS.desktop_add_to_playlist_renderer_dialog_popup": true,
        "EXPERIMENT_FLAGS.desktop_adjust_touch_target": true,
        "EXPERIMENT_FLAGS.desktop_animate_miniplayer": true,
        "EXPERIMENT_FLAGS.desktop_delay_player_resizing": true,
        "EXPERIMENT_FLAGS.desktop_enable_dmpanel_click_drag_scroll": true,
        "EXPERIMENT_FLAGS.desktop_enable_dmpanel_scroll": true,
        "EXPERIMENT_FLAGS.desktop_enable_dmpanel_wheel_scroll": true,
        "EXPERIMENT_FLAGS.desktop_image_cta_no_background": true,
        "EXPERIMENT_FLAGS.desktop_keyboard_capture_keydown_killswitch": true,
        "EXPERIMENT_FLAGS.desktop_log_img_click_location": true,
        "EXPERIMENT_FLAGS.desktop_mix_use_sampled_color_for_bottom_bar": true,
        "EXPERIMENT_FLAGS.desktop_mix_use_sampled_color_for_bottom_bar_search": true,
        "EXPERIMENT_FLAGS.desktop_mix_use_sampled_color_for_bottom_bar_watch_next": true,
        "EXPERIMENT_FLAGS.desktop_notification_high_priority_ignore_push": true,
        "EXPERIMENT_FLAGS.desktop_notification_set_title_bar": true,
        "EXPERIMENT_FLAGS.desktop_persistent_menu": true,
        "EXPERIMENT_FLAGS.desktop_search_bigger_thumbs_style": "DEFAULT",
        "EXPERIMENT_FLAGS.desktop_search_prominent_thumbs": true,
        "EXPERIMENT_FLAGS.desktop_search_suggestion_tap_target": 0,
        "EXPERIMENT_FLAGS.desktop_searchbar_style": "default",
        "EXPERIMENT_FLAGS.desktop_sparkles_light_cta_button": true,
        "EXPERIMENT_FLAGS.desktop_swipeable_guide": true,
        "EXPERIMENT_FLAGS.desktop_themeable_vulcan": true,
        "EXPERIMENT_FLAGS.desktop_touch_gestures_usage_log": true,
        "EXPERIMENT_FLAGS.desktop_use_new_history_manager": true,
        "EXPERIMENT_FLAGS.disable_child_node_auto_formatted_strings": true,
        "EXPERIMENT_FLAGS.disable_dependency_injection": true,
        "EXPERIMENT_FLAGS.disable_features_for_supex": true,
        "EXPERIMENT_FLAGS.disable_legacy_desktop_remote_queue": true,
        "EXPERIMENT_FLAGS.disable_pacf_logging_for_memory_limited_tv": true,
        "EXPERIMENT_FLAGS.disable_rich_grid_inline_player_pop_out": true,
        "EXPERIMENT_FLAGS.disable_simple_mixed_direction_formatted_strings": true,
        "EXPERIMENT_FLAGS.disable_thumbnail_preloading": true,
        "EXPERIMENT_FLAGS.embeds_web_enable_replace_unload_w_pagehide": true,
        "EXPERIMENT_FLAGS.embeds_web_enable_ve_logging_unification": true,
        "EXPERIMENT_FLAGS.embeds_web_nwl_disable_nocookie": true,
        "EXPERIMENT_FLAGS.embeds_web_synth_ch_headers_banned_urls_regex": "",
        "EXPERIMENT_FLAGS.enable_audio_pivot_back_nav_button": true,
        "EXPERIMENT_FLAGS.enable_button_behavior_reuse": true,
        "EXPERIMENT_FLAGS.enable_call_to_action_clarification_renderer_bottom_section_conditions": true,
        "EXPERIMENT_FLAGS.enable_channel_page_modern_profile_section": true,
        "EXPERIMENT_FLAGS.enable_desktop_amsterdam_info_panels": true,
        "EXPERIMENT_FLAGS.enable_dma_web_toast": true,
        "EXPERIMENT_FLAGS.enable_docked_chat_messages": true,
        "EXPERIMENT_FLAGS.enable_gel_log_commands": true,
        "EXPERIMENT_FLAGS.enable_h5_instream_watch_next_params_oarlib": true,
        "EXPERIMENT_FLAGS.enable_h5_video_ads_oarlib": true,
        "EXPERIMENT_FLAGS.enable_handles_account_menu_switcher": true,
        "EXPERIMENT_FLAGS.enable_handles_in_mention_suggest_posts": true,
        "EXPERIMENT_FLAGS.enable_header_channel_handler_ui": true,
        "EXPERIMENT_FLAGS.enable_image_poll_post_creation": true,
        "EXPERIMENT_FLAGS.enable_inline_shorts_on_wn": true,
        "EXPERIMENT_FLAGS.enable_madison_search_migration": true,
        "EXPERIMENT_FLAGS.enable_masthead_quartile_ping_fix": true,
        "EXPERIMENT_FLAGS.enable_memberships_and_purchases": true,
        "EXPERIMENT_FLAGS.enable_mentions_in_reposts": true,
        "EXPERIMENT_FLAGS.enable_microformat_data": true,
        "EXPERIMENT_FLAGS.enable_mini_app_container": true,
        "EXPERIMENT_FLAGS.enable_mixed_direction_formatted_strings": true,
        "EXPERIMENT_FLAGS.enable_multi_image_post_creation": true,
        "EXPERIMENT_FLAGS.enable_names_handles_account_switcher": true,
        "EXPERIMENT_FLAGS.enable_offer_suppression": true,
        "EXPERIMENT_FLAGS.enable_on_yt_command_executor_command_to_navigate": true,
        "EXPERIMENT_FLAGS.enable_pacf_through_ybfe_tv": true,
        "EXPERIMENT_FLAGS.enable_pacf_through_ysfe_tv": true,
        "EXPERIMENT_FLAGS.enable_poll_choice_border_on_web": true,
        "EXPERIMENT_FLAGS.enable_polymer_resin": true,
        "EXPERIMENT_FLAGS.enable_polymer_resin_migration": true,
        "EXPERIMENT_FLAGS.enable_post_cct_links": true,
        "EXPERIMENT_FLAGS.enable_post_scheduling": true,
        "EXPERIMENT_FLAGS.enable_premium_voluntary_pause": true,
        "EXPERIMENT_FLAGS.enable_product_list_skip_pdp_for_desktop": true,
        "EXPERIMENT_FLAGS.enable_programmed_playlist_color_sample": true,
        "EXPERIMENT_FLAGS.enable_programmed_playlist_redesign": true,
        "EXPERIMENT_FLAGS.enable_purchase_activity_in_paid_memberships": true,
        "EXPERIMENT_FLAGS.enable_reel_watch_sequence": true,
        "EXPERIMENT_FLAGS.enable_rejected_sasde_for_html5": true,
        "EXPERIMENT_FLAGS.enable_rendererstamper_listener_cleanup": true,
        "EXPERIMENT_FLAGS.enable_seedless_shorts_url": true,
        "EXPERIMENT_FLAGS.enable_server_stitched_dai": true,
        "EXPERIMENT_FLAGS.enable_service_ajax_csn": true,
        "EXPERIMENT_FLAGS.enable_servlet_errors_streamz": true,
        "EXPERIMENT_FLAGS.enable_servlet_streamz": true,
        "EXPERIMENT_FLAGS.enable_sfv_audio_pivot_url": true,
        "EXPERIMENT_FLAGS.enable_shorts_singleton_channel_web": true,
        "EXPERIMENT_FLAGS.enable_signals": true,
        "EXPERIMENT_FLAGS.enable_skip_ad_guidance_prompt": true,
        "EXPERIMENT_FLAGS.enable_skippable_ads_for_unplugged_ad_pod": true,
        "EXPERIMENT_FLAGS.enable_smearing_expansion_dai": true,
        "EXPERIMENT_FLAGS.enable_sparkles_web_clickable_description": true,
        "EXPERIMENT_FLAGS.enable_squiffle_gif_handles_landing_page": true,
        "EXPERIMENT_FLAGS.enable_streamline_repost_flow": true,
        "EXPERIMENT_FLAGS.enable_structured_description_shorts_web_mweb": true,
        "EXPERIMENT_FLAGS.enable_tectonic_ad_ux_for_halftime": true,
        "EXPERIMENT_FLAGS.enable_third_party_info": true,
        "EXPERIMENT_FLAGS.enable_topsoil_wta_for_halftime_live_infra": true,
        "EXPERIMENT_FLAGS.enable_unavailable_videos_watch_page": true,
        "EXPERIMENT_FLAGS.enable_watch_next_pause_autoplay_lact": true,
        "EXPERIMENT_FLAGS.enable_web_ketchup_hero_animation": true,
        "EXPERIMENT_FLAGS.enable_web_poster_hover_animation": true,
        "EXPERIMENT_FLAGS.enable_web_scheduler_signals": true,
        "EXPERIMENT_FLAGS.enable_web_shorts_audio_pivot": true,
        "EXPERIMENT_FLAGS.enable_window_constrained_buy_flow_dialog": true,
        "EXPERIMENT_FLAGS.enable_yoodle": true,
        "EXPERIMENT_FLAGS.enable_ypc_spinners": true,
        "EXPERIMENT_FLAGS.enable_yt_ata_iframe_authuser": true,
        "EXPERIMENT_FLAGS.enable_ytc_refunds_submit_form_signal_action": true,
        "EXPERIMENT_FLAGS.enable_ytc_self_serve_refunds": true,
        "EXPERIMENT_FLAGS.export_networkless_options": true,
        "EXPERIMENT_FLAGS.external_fullscreen": true,
        "EXPERIMENT_FLAGS.external_fullscreen_button_click_threshold": 2,
        "EXPERIMENT_FLAGS.external_fullscreen_button_shown_threshold": 10,
        "EXPERIMENT_FLAGS.external_fullscreen_with_edu": true,
        "EXPERIMENT_FLAGS.fill_single_video_with_notify_to_lasr": true,
        "EXPERIMENT_FLAGS.fix_scrubber_overlay_transition": true,
        "EXPERIMENT_FLAGS.formatted_description_log_warning_fraction": 0.01,
        "EXPERIMENT_FLAGS.gcf_config_store_enabled": true,
        "EXPERIMENT_FLAGS.gda_enable_playlist_download": true,
        "EXPERIMENT_FLAGS.gel_queue_timeout_max_ms": 300000,
        "EXPERIMENT_FLAGS.get_async_timeout_ms": 60000,
        "EXPERIMENT_FLAGS.gfeedback_for_signed_out_users_enabled": true,
        "EXPERIMENT_FLAGS.global_spacebar_pause": true,
        "EXPERIMENT_FLAGS.gpa_sparkles_ten_percent_layer": true,
        "EXPERIMENT_FLAGS.guide_business_info_countries.0": "KR",
        "EXPERIMENT_FLAGS.guide_legal_footer_enabled_countries.0": "NL",
        "EXPERIMENT_FLAGS.guide_legal_footer_enabled_countries.1": "ES",
        "EXPERIMENT_FLAGS.h5_companion_enable_adcpn_macro_substitution_for_click_pings": true,
        "EXPERIMENT_FLAGS.h5_enable_generic_error_logging_event": true,
        "EXPERIMENT_FLAGS.h5_inplayer_enable_adcpn_macro_substitution_for_click_pings": true,
        "EXPERIMENT_FLAGS.h5_reset_cache_and_filter_before_update_masthead": true,
        "EXPERIMENT_FLAGS.handles_in_mention_suggest_posts": true,
        "EXPERIMENT_FLAGS.high_priority_flyout_frequency": 3,
        "EXPERIMENT_FLAGS.html5_enable_single_video_vod_ivar_on_pacf": true,
        "EXPERIMENT_FLAGS.html5_log_trigger_events_with_debug_data": true,
        "EXPERIMENT_FLAGS.html5_recognize_predict_start_cue_point": true,
        "EXPERIMENT_FLAGS.html5_server_stitched_dai_group": true,
        "EXPERIMENT_FLAGS.html5_web_enable_halftime_preroll": true,
        "EXPERIMENT_FLAGS.il_use_view_model_logging_context": true,
        "EXPERIMENT_FLAGS.include_autoplay_count_in_playlists": true,
        "EXPERIMENT_FLAGS.initial_gel_batch_timeout": 2000,
        "EXPERIMENT_FLAGS.is_browser_support_for_webcam_streaming": true,
        "EXPERIMENT_FLAGS.is_part_of_any_user_engagement_experiment": true,
        "EXPERIMENT_FLAGS.json_condensed_response": true,
        "EXPERIMENT_FLAGS.kevlar_app_shortcuts": true,
        "EXPERIMENT_FLAGS.kevlar_appbehavior_attach_startup_tasks": true,
        "EXPERIMENT_FLAGS.kevlar_append_toggled_engagement_panels_top": true,
        "EXPERIMENT_FLAGS.kevlar_appshell_service_worker": true,
        "EXPERIMENT_FLAGS.kevlar_autofocus_menu_on_keyboard_nav": true,
        "EXPERIMENT_FLAGS.kevlar_autonav_popup_filtering": true,
        "EXPERIMENT_FLAGS.kevlar_av_eliminate_polling": true,
        "EXPERIMENT_FLAGS.kevlar_background_color_update": true,
        "EXPERIMENT_FLAGS.kevlar_cache_cold_load_response": true,
        "EXPERIMENT_FLAGS.kevlar_cache_on_ttl_player": true,
        "EXPERIMENT_FLAGS.kevlar_cache_on_ttl_search": true,
        "EXPERIMENT_FLAGS.kevlar_calculate_grid_collapsible": true,
        "EXPERIMENT_FLAGS.kevlar_cancel_scheduled_comment_jobs_on_navigate": true,
        "EXPERIMENT_FLAGS.kevlar_center_search_results": true,
        "EXPERIMENT_FLAGS.kevlar_channel_creation_form_resolver": true,
        "EXPERIMENT_FLAGS.kevlar_channel_trailer_multi_attach": true,
        "EXPERIMENT_FLAGS.kevlar_chapters_list_view_seek_by_chapter": true,
        "EXPERIMENT_FLAGS.kevlar_clear_duplicate_pref_cookie": true,
        "EXPERIMENT_FLAGS.kevlar_clear_non_displayable_url_params": true,
        "EXPERIMENT_FLAGS.kevlar_command_handler": true,
        "EXPERIMENT_FLAGS.kevlar_command_handler_clicks": true,
        "EXPERIMENT_FLAGS.kevlar_command_handler_formatted_string": true,
        "EXPERIMENT_FLAGS.kevlar_command_url": true,
        "EXPERIMENT_FLAGS.kevlar_continue_playback_without_player_response": true,
        "EXPERIMENT_FLAGS.kevlar_delay_watch_initial_data": true,
        "EXPERIMENT_FLAGS.kevlar_disable_background_prefetch": true,
        "EXPERIMENT_FLAGS.kevlar_disable_pending_command": true,
        "EXPERIMENT_FLAGS.kevlar_dragdrop_fast_scroll": true,
        "EXPERIMENT_FLAGS.kevlar_dropdown_fix": true,
        "EXPERIMENT_FLAGS.kevlar_droppable_prefetchable_requests": true,
        "EXPERIMENT_FLAGS.kevlar_early_popup_close": true,
        "EXPERIMENT_FLAGS.kevlar_enable_download_upsell_type_a": true,
        "EXPERIMENT_FLAGS.kevlar_enable_editable_playlists": true,
        "EXPERIMENT_FLAGS.kevlar_enable_reorderable_playlists": true,
        "EXPERIMENT_FLAGS.kevlar_enable_shorts_prefetch_in_sequence": true,
        "EXPERIMENT_FLAGS.kevlar_enable_shorts_response_chunking": true,
        "EXPERIMENT_FLAGS.kevlar_enable_up_arrow": true,
        "EXPERIMENT_FLAGS.kevlar_enable_upsell_on_video_menu": true,
        "EXPERIMENT_FLAGS.kevlar_enable_ybp_op_for_shoptube": true,
        "EXPERIMENT_FLAGS.kevlar_exit_fullscreen_leaving_watch": true,
        "EXPERIMENT_FLAGS.kevlar_fix_playlist_continuation": true,
        "EXPERIMENT_FLAGS.kevlar_flexible_menu": true,
        "EXPERIMENT_FLAGS.kevlar_fluid_touch_scroll": true,
        "EXPERIMENT_FLAGS.kevlar_frontend_queue_recover": true,
        "EXPERIMENT_FLAGS.kevlar_gel_error_routing": true,
        "EXPERIMENT_FLAGS.kevlar_guide_refresh": true,
        "EXPERIMENT_FLAGS.kevlar_help_use_locale": true,
        "EXPERIMENT_FLAGS.kevlar_hide_playlist_playback_status": true,
        "EXPERIMENT_FLAGS.kevlar_hide_pp_url_param": true,
        "EXPERIMENT_FLAGS.kevlar_hide_time_continue_url_param": true,
        "EXPERIMENT_FLAGS.kevlar_home_skeleton": true,
        "EXPERIMENT_FLAGS.kevlar_home_skeleton_hide_later": true,
        "EXPERIMENT_FLAGS.kevlar_js_fixes": true,
        "EXPERIMENT_FLAGS.kevlar_keyboard_button_focus": true,
        "EXPERIMENT_FLAGS.kevlar_larger_three_dot_tap": true,
        "EXPERIMENT_FLAGS.kevlar_lazy_list_resume_for_autofill": true,
        "EXPERIMENT_FLAGS.kevlar_link_capturing_mode": "",
        "EXPERIMENT_FLAGS.kevlar_local_innertube_response": true,
        "EXPERIMENT_FLAGS.kevlar_macro_markers_keyboard_shortcut": true,
        "EXPERIMENT_FLAGS.kevlar_masthead_store": true,
        "EXPERIMENT_FLAGS.kevlar_mealbar_above_player": true,
        "EXPERIMENT_FLAGS.kevlar_mini_guide_width_threshold": 791,
        "EXPERIMENT_FLAGS.kevlar_miniplayer": true,
        "EXPERIMENT_FLAGS.kevlar_miniplayer_expand_top": true,
        "EXPERIMENT_FLAGS.kevlar_miniplayer_play_pause_on_scrim": true,
        "EXPERIMENT_FLAGS.kevlar_miniplayer_queue_user_activation": true,
        "EXPERIMENT_FLAGS.kevlar_modern_sd": true,
        "EXPERIMENT_FLAGS.kevlar_next_cold_on_auth_change_detected": true,
        "EXPERIMENT_FLAGS.kevlar_nitrate_driven_tooltips": true,
        "EXPERIMENT_FLAGS.kevlar_no_autoscroll_on_playlist_hover": true,
        "EXPERIMENT_FLAGS.kevlar_op_infra": true,
        "EXPERIMENT_FLAGS.kevlar_op_warm_pages": true,
        "EXPERIMENT_FLAGS.kevlar_pandown_polyfill": true,
        "EXPERIMENT_FLAGS.kevlar_passive_event_listeners": true,
        "EXPERIMENT_FLAGS.kevlar_persistent_guide_width_threshold": 1312,
        "EXPERIMENT_FLAGS.kevlar_playback_associated_queue": true,
        "EXPERIMENT_FLAGS.kevlar_player_cached_load_config": true,
        "EXPERIMENT_FLAGS.kevlar_player_check_ad_state_on_stop": true,
        "EXPERIMENT_FLAGS.kevlar_player_load_player_no_op": true,
        "EXPERIMENT_FLAGS.kevlar_player_new_bootstrap_adoption": true,
        "EXPERIMENT_FLAGS.kevlar_player_playlist_use_local_index": true,
        "EXPERIMENT_FLAGS.kevlar_playlist_drag_handles": true,
        "EXPERIMENT_FLAGS.kevlar_playlist_use_x_close_button": true,
        "EXPERIMENT_FLAGS.kevlar_prefetch": true,
        "EXPERIMENT_FLAGS.kevlar_prevent_polymer_dynamic_font_load": true,
        "EXPERIMENT_FLAGS.kevlar_queue_use_update_api": true,
        "EXPERIMENT_FLAGS.kevlar_refresh_gesture": true,
        "EXPERIMENT_FLAGS.kevlar_refresh_on_theme_change": true,
        "EXPERIMENT_FLAGS.kevlar_rendererstamper_event_listener": true,
        "EXPERIMENT_FLAGS.kevlar_replace_short_to_short_history_state": true,
        "EXPERIMENT_FLAGS.kevlar_request_sequencing": true,
        "EXPERIMENT_FLAGS.kevlar_resolve_command_for_confirm_dialog": true,
        "EXPERIMENT_FLAGS.kevlar_response_command_processor_page": true,
        "EXPERIMENT_FLAGS.kevlar_scroll_chips_on_touch": true,
        "EXPERIMENT_FLAGS.kevlar_scrollbar_rework": true,
        "EXPERIMENT_FLAGS.kevlar_service_command_check": true,
        "EXPERIMENT_FLAGS.kevlar_set_internal_player_size": true,
        "EXPERIMENT_FLAGS.kevlar_set_sd_enabled_browse_request": true,
        "EXPERIMENT_FLAGS.kevlar_shell_for_downloads_page": true,
        "EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list": true,
        "EXPERIMENT_FLAGS.kevlar_show_playlist_dl_btn": true,
        "EXPERIMENT_FLAGS.kevlar_simp_shorts_reset_scroll": true,
        "EXPERIMENT_FLAGS.kevlar_smart_downloads": true,
        "EXPERIMENT_FLAGS.kevlar_smart_downloads_setting": true,
        "EXPERIMENT_FLAGS.kevlar_startup_lifecycle": true,
        "EXPERIMENT_FLAGS.kevlar_structured_description_content_inline": true,
        "EXPERIMENT_FLAGS.kevlar_system_icons": true,
        "EXPERIMENT_FLAGS.kevlar_tabs_gesture": true,
        "EXPERIMENT_FLAGS.kevlar_text_inline_expander_formatted_snippet": true,
        "EXPERIMENT_FLAGS.kevlar_three_dot_ink": true,
        "EXPERIMENT_FLAGS.kevlar_thumbnail_fluid": true,
        "EXPERIMENT_FLAGS.kevlar_time_caching_end_threshold": 15,
        "EXPERIMENT_FLAGS.kevlar_time_caching_start_threshold": 15,
        "EXPERIMENT_FLAGS.kevlar_toast_manager": true,
        "EXPERIMENT_FLAGS.kevlar_tooltip_impression_cap": 2,
        "EXPERIMENT_FLAGS.kevlar_topbar_logo_fallback_home": true,
        "EXPERIMENT_FLAGS.kevlar_touch_feedback": true,
        "EXPERIMENT_FLAGS.kevlar_touch_feedback_lockups": true,
        "EXPERIMENT_FLAGS.kevlar_touch_gesture_ves": true,
        "EXPERIMENT_FLAGS.kevlar_transcript_engagement_panel": true,
        "EXPERIMENT_FLAGS.kevlar_tuner_default_comments_delay": 1000,
        "EXPERIMENT_FLAGS.kevlar_tuner_run_default_comments_delay": true,
        "EXPERIMENT_FLAGS.kevlar_tuner_scheduler_soft_state_timer_ms": 800,
        "EXPERIMENT_FLAGS.kevlar_tuner_should_defer_detach": true,
        "EXPERIMENT_FLAGS.kevlar_tuner_thumbnail_factor": 1,
        "EXPERIMENT_FLAGS.kevlar_tuner_visibility_time_between_jobs_ms": 100,
        "EXPERIMENT_FLAGS.kevlar_typography_spacing_update": true,
        "EXPERIMENT_FLAGS.kevlar_typography_update": true,
        "EXPERIMENT_FLAGS.kevlar_undo_delete": true,
        "EXPERIMENT_FLAGS.kevlar_unified_errors_init": true,
        "EXPERIMENT_FLAGS.kevlar_unified_player_logging_threshold": 1,
        "EXPERIMENT_FLAGS.kevlar_use_response_ttl_to_invalidate_cache": true,
        "EXPERIMENT_FLAGS.kevlar_use_vimio_behavior": true,
        "EXPERIMENT_FLAGS.kevlar_use_ytd_player": true,
        "EXPERIMENT_FLAGS.kevlar_variable_youtube_sans": true,
        "EXPERIMENT_FLAGS.kevlar_vimio_use_shared_monitor": true,
        "EXPERIMENT_FLAGS.kevlar_voice_logging_fix": true,
        "EXPERIMENT_FLAGS.kevlar_voice_search": true,
        "EXPERIMENT_FLAGS.kevlar_watch_cinematics": true,
        "EXPERIMENT_FLAGS.kevlar_watch_color_update": true,
        "EXPERIMENT_FLAGS.kevlar_watch_comments_ep_disable_theater": true,
        "EXPERIMENT_FLAGS.kevlar_watch_contents_data_provider": true,
        "EXPERIMENT_FLAGS.kevlar_watch_contents_data_provider_persistent": true,
        "EXPERIMENT_FLAGS.kevlar_watch_disable_legacy_metadata_updates": true,
        "EXPERIMENT_FLAGS.kevlar_watch_drag_handles": true,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_fullscreen_manager": true,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_loading_state_manager": true,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_metadata_height": 136,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_miniplayer_manager": true,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_navigation_manager": true,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_player_loop_manager": true,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_scroll_manager": true,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_title_manager": true,
        "EXPERIMENT_FLAGS.kevlar_watch_flexy_use_controller": true,
        "EXPERIMENT_FLAGS.kevlar_watch_focus_on_engagement_panels": true,
        "EXPERIMENT_FLAGS.kevlar_watch_gesture_pandown": true,
        "EXPERIMENT_FLAGS.kevlar_watch_hide_comments_teaser": true,
        "EXPERIMENT_FLAGS.kevlar_watch_hide_comments_while_panel_open": true,
        "EXPERIMENT_FLAGS.kevlar_watch_js_panel_height": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_attached_subscribe": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_clickable_description": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_compact_view_count": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_description_info_dedicated_line": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_description_inline_expander": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_description_lines": 3,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_description_primary_color": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_for_live_killswitch": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_full_width_description": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_left_aligned_video_actions": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_lower_case_video_actions": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_narrower_item_wrap": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_relative_date": true,
        "EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_top_aligned_actions": true,
        "EXPERIMENT_FLAGS.kevlar_watch_modern_metapanel": true,
        "EXPERIMENT_FLAGS.kevlar_watch_modern_panels": true,
        "EXPERIMENT_FLAGS.kevlar_watch_panel_height_matches_player": true,
        "EXPERIMENT_FLAGS.kevlar_woffle": true,
        "EXPERIMENT_FLAGS.kevlar_woffle_fallback_image": true,
        "EXPERIMENT_FLAGS.kevlar_ytb_live_badges": true,
        "EXPERIMENT_FLAGS.killswitch_toggle_button_behavior_resolve_command": true,
        "EXPERIMENT_FLAGS.live_chat_banner_expansion_fix": true,
        "EXPERIMENT_FLAGS.live_chat_chunk_rendering": 0,
        "EXPERIMENT_FLAGS.live_chat_collapse_merch_banner": true,
        "EXPERIMENT_FLAGS.live_chat_enable_mod_view": true,
        "EXPERIMENT_FLAGS.live_chat_enable_qna_banner_overflow_menu_actions": true,
        "EXPERIMENT_FLAGS.live_chat_enable_qna_channel": true,
        "EXPERIMENT_FLAGS.live_chat_filter_emoji_suggestions": true,
        "EXPERIMENT_FLAGS.live_chat_increased_min_height": true,
        "EXPERIMENT_FLAGS.live_chat_max_chunk_size": 5,
        "EXPERIMENT_FLAGS.live_chat_min_chunk_interval_ms": 300,
        "EXPERIMENT_FLAGS.live_chat_over_playlist": true,
        "EXPERIMENT_FLAGS.live_chat_unicode_emoji_json_url": "https://www.gstatic.com/youtube/img/emojis/emojis-svg-9.json",
        "EXPERIMENT_FLAGS.live_chat_web_enable_command_handler": true,
        "EXPERIMENT_FLAGS.live_chat_web_use_emoji_manager_singleton": true,
        "EXPERIMENT_FLAGS.log_errors_through_nwl_on_retry": true,
        "EXPERIMENT_FLAGS.log_gel_compression_latency": true,
        "EXPERIMENT_FLAGS.log_heartbeat_with_lifecycles": true,
        "EXPERIMENT_FLAGS.log_vis_on_tab_change": true,
        "EXPERIMENT_FLAGS.log_web_meta_interval_ms": 0,
        "EXPERIMENT_FLAGS.log_window_onerror_fraction": 0.1,
        "EXPERIMENT_FLAGS.max_body_size_to_compress": 500000,
        "EXPERIMENT_FLAGS.max_duration_to_consider_mouseover_as_hover": 600000,
        // "EXPERIMENT_FLAGS.max_prefetch_window_sec_for_livestream_optimization": 10,
        "EXPERIMENT_FLAGS.mdx_enable_privacy_disclosure_ui": true,
        "EXPERIMENT_FLAGS.mdx_load_cast_api_bootstrap_script": true,
        "EXPERIMENT_FLAGS.migrate_events_to_ts": true,
        "EXPERIMENT_FLAGS.min_mouse_still_duration": 100,
        // "EXPERIMENT_FLAGS.min_prefetch_offset_sec_for_livestream_optimization": 20,
        "EXPERIMENT_FLAGS.minimum_duration_to_consider_mouseover_as_hover": 500,
        "EXPERIMENT_FLAGS.music_on_main_handle_playlist_edit_video_added_result_data": true,
        "EXPERIMENT_FLAGS.music_on_main_open_playlist_recommended_videos_in_miniplayer": true,
        "EXPERIMENT_FLAGS.mweb_actions_command_handler": true,
        "EXPERIMENT_FLAGS.mweb_command_handler": true,
        "EXPERIMENT_FLAGS.mweb_disable_set_autonav_state_in_player": true,
        "EXPERIMENT_FLAGS.mweb_enable_consistency_service": true,
        "EXPERIMENT_FLAGS.mweb_enable_hlp": true,
        "EXPERIMENT_FLAGS.mweb_history_manager_cache_size": 100,
        "EXPERIMENT_FLAGS.mweb_logo_use_home_page_ve": true,
        "EXPERIMENT_FLAGS.mweb_navigate_to_watch_with_op": true,
        "EXPERIMENT_FLAGS.mweb_render_crawler_description": true,
        "EXPERIMENT_FLAGS.mweb_stop_truncating_meta_tags": true,
        "EXPERIMENT_FLAGS.mweb_use_desktop_canonical_url": true,
        "EXPERIMENT_FLAGS.network_polling_interval": 30000,
        "EXPERIMENT_FLAGS.networkless_gel": true,
        "EXPERIMENT_FLAGS.networkless_logging": true,
        "EXPERIMENT_FLAGS.no_sub_count_on_sub_button": true,
        "EXPERIMENT_FLAGS.nwl_send_fast_on_unload": true,
        "EXPERIMENT_FLAGS.nwl_send_from_memory_when_online": true,
        "EXPERIMENT_FLAGS.offline_error_handling": true,
        "EXPERIMENT_FLAGS.pacf_logging_delay_milliseconds_through_ybfe_tv": 30000,
        "EXPERIMENT_FLAGS.pageid_as_header_web": true,
        "EXPERIMENT_FLAGS.pause_ad_video_on_desktop_engagement_panel_click": true,
        "EXPERIMENT_FLAGS.pbj_navigate_limit": -1,
        "EXPERIMENT_FLAGS.pdg_enable_flow_logging_for_super_chat": true,
        "EXPERIMENT_FLAGS.pdg_enable_flow_logging_for_super_stickers": true,
        "EXPERIMENT_FLAGS.play_ping_interval_ms": 300000,
        "EXPERIMENT_FLAGS.player_allow_autonav_after_playlist": true,
        "EXPERIMENT_FLAGS.player_bootstrap_method": true,
        "EXPERIMENT_FLAGS.player_doubletap_to_seek": true,
        "EXPERIMENT_FLAGS.player_enable_playback_playlist_change": true,
        "EXPERIMENT_FLAGS.player_endscreen_ellipsis_fix": true,
        "EXPERIMENT_FLAGS.polymer_bad_build_labels": true,
        "EXPERIMENT_FLAGS.polymer_log_prop_change_observer_percent": 0,
        "EXPERIMENT_FLAGS.polymer_task_manager_proxied_promise": true,
        "EXPERIMENT_FLAGS.polymer_task_manager_status": "production",
        "EXPERIMENT_FLAGS.polymer_verifiy_app_state": true,
        "EXPERIMENT_FLAGS.polymer_video_renderer_defer_menu": true,
        "EXPERIMENT_FLAGS.polymer_warm_thumbnail_preload": true,
        "EXPERIMENT_FLAGS.polymer_ytdi_enable_global_injector": true,
        "EXPERIMENT_FLAGS.post_type_icons_rearrange": 1,
        "EXPERIMENT_FLAGS.prefetch_comments_ms_after_video": 0,
        "EXPERIMENT_FLAGS.prefetch_coordinator_command_timeout_ms": 60000,
        "EXPERIMENT_FLAGS.prefetch_coordinator_error_logging_sampling_rate": 1,
        "EXPERIMENT_FLAGS.prefetch_coordinator_max_inflight_requests": 1,
        "EXPERIMENT_FLAGS.problem_walkthrough_sd": true,
        "EXPERIMENT_FLAGS.qoe_send_and_write": true,
        "EXPERIMENT_FLAGS.record_app_crashed_web": true,
        "EXPERIMENT_FLAGS.reload_without_polymer_innertube": true,
        "EXPERIMENT_FLAGS.rich_grid_true_inline_playback_trigger_delay": 0,
        "EXPERIMENT_FLAGS.rich_grid_watch_meta_side": true,
        "EXPERIMENT_FLAGS.rich_grid_watch_open_animation_duration": 0,
        "EXPERIMENT_FLAGS.rich_grid_watch_show_watch_next": true,
        "EXPERIMENT_FLAGS.scheduler_use_raf_by_default": true,
        "EXPERIMENT_FLAGS.search_ui_enable_pve_buy_button": true,
        "EXPERIMENT_FLAGS.search_ui_official_cards_enable_paid_virtual_event_buy_button": true,
        "EXPERIMENT_FLAGS.searchbox_reporting": true,
        "EXPERIMENT_FLAGS.send_config_hash_timer": 0,
        "EXPERIMENT_FLAGS.serve_pdp_at_canonical_url": true,
        "EXPERIMENT_FLAGS.service_worker_enabled": true,
        "EXPERIMENT_FLAGS.service_worker_push_enabled": true,
        "EXPERIMENT_FLAGS.service_worker_push_force_notification_prompt_tag": "1",
        "EXPERIMENT_FLAGS.service_worker_push_home_page_prompt": true,
        "EXPERIMENT_FLAGS.service_worker_push_logged_out_prompt_watches": -1,
        "EXPERIMENT_FLAGS.service_worker_push_prompt_cap": -1,
        "EXPERIMENT_FLAGS.service_worker_push_prompt_delay_microseconds": 3888000000000,
        "EXPERIMENT_FLAGS.service_worker_push_watch_page_prompt": true,
        "EXPERIMENT_FLAGS.service_worker_scope": "/",
        "EXPERIMENT_FLAGS.service_worker_subscribe_with_vapid_key": true,
        "EXPERIMENT_FLAGS.shorts_desktop_watch_while_p2": true,
        "EXPERIMENT_FLAGS.shorts_enable_snap_stop": true,
        "EXPERIMENT_FLAGS.shorts_inline_player_triggering_delay": 500,
        "EXPERIMENT_FLAGS.shorts_profile_header_c3po": true,
        "EXPERIMENT_FLAGS.should_clear_video_data_on_player_cued_unstarted": true,
        "EXPERIMENT_FLAGS.show_civ_reminder_on_web": true,
        "EXPERIMENT_FLAGS.skip_invalid_ytcsi_ticks": true,
        "EXPERIMENT_FLAGS.skip_ls_gel_retry": true,
        "EXPERIMENT_FLAGS.skip_setting_info_in_csi_data_object": true,
        "EXPERIMENT_FLAGS.slow_compressions_before_abandon_count": 4,
        "EXPERIMENT_FLAGS.sponsorships_gifting_enable_opt_in": true,
        "EXPERIMENT_FLAGS.super_sticker_emoji_picker_category_button_icon_filled": true,
        "EXPERIMENT_FLAGS.suppress_error_204_logging": true,
        "EXPERIMENT_FLAGS.track_webfe_innertube_auth_mismatch": true,
        "EXPERIMENT_FLAGS.transport_use_scheduler": true,
        "EXPERIMENT_FLAGS.tv_pacf_logging_sample_rate": 0.01,
        "EXPERIMENT_FLAGS.use_ads_engagement_panel_desktop_footer_cta": true,
        "EXPERIMENT_FLAGS.use_better_post_dismissals": true,
        "EXPERIMENT_FLAGS.use_border_and_grid_wrapping_on_desktop_panel_tiles": true,
        "EXPERIMENT_FLAGS.use_new_cml": true,
        "EXPERIMENT_FLAGS.use_new_in_memory_storage": true,
        "EXPERIMENT_FLAGS.use_new_nwl_initialization": true,
        "EXPERIMENT_FLAGS.use_new_nwl_saw": true,
        "EXPERIMENT_FLAGS.use_new_nwl_stw": true,
        "EXPERIMENT_FLAGS.use_new_nwl_wts": true,
        "EXPERIMENT_FLAGS.use_player_abuse_bg_library": true,
        "EXPERIMENT_FLAGS.use_profilepage_event_label_in_carousel_playbacks": true,
        "EXPERIMENT_FLAGS.use_request_time_ms_header": true,
        "EXPERIMENT_FLAGS.use_session_based_sampling": true,
        "EXPERIMENT_FLAGS.use_source_element_if_present_for_actions": true,
        "EXPERIMENT_FLAGS.use_ts_visibilitylogger": true,
        "EXPERIMENT_FLAGS.use_watch_fragments2": true,
        "EXPERIMENT_FLAGS.user_engagement_experiments_rate_limit_ms": 86400000,
        "EXPERIMENT_FLAGS.user_mention_suggestions_edu_impression_cap": 10,
        "EXPERIMENT_FLAGS.verify_ads_itag_early": true,
        "EXPERIMENT_FLAGS.visibility_time_between_jobs_ms": 100,
        "EXPERIMENT_FLAGS.vss_final_ping_send_and_write": true,
        "EXPERIMENT_FLAGS.vss_playback_use_send_and_write": true,
        "EXPERIMENT_FLAGS.warm_load_nav_start_web": true,
        "EXPERIMENT_FLAGS.warm_op_csn_cleanup": true,
        "EXPERIMENT_FLAGS.watch_next_pause_autoplay_lact_sec": 4500,
        "EXPERIMENT_FLAGS.web_always_load_chat_support": true,
        "EXPERIMENT_FLAGS.web_amsterdam_playlists": true,
        "EXPERIMENT_FLAGS.web_amsterdam_post_mvp_playlists": true,
        "EXPERIMENT_FLAGS.web_animated_like": true,
        "EXPERIMENT_FLAGS.web_animated_like_lazy_load": true,
        "EXPERIMENT_FLAGS.web_api_url": true,
        "EXPERIMENT_FLAGS.web_appshell_purge_trigger": true,
        "EXPERIMENT_FLAGS.web_appshell_refresh_trigger": true,
        "EXPERIMENT_FLAGS.web_autonav_allow_off_by_default": true,
        "EXPERIMENT_FLAGS.web_button_rework": true,
        "EXPERIMENT_FLAGS.web_cinematic_masthead": true,
        "EXPERIMENT_FLAGS.web_darker_dark_theme": true,
        "EXPERIMENT_FLAGS.web_darker_dark_theme_deprecate": true,
        "EXPERIMENT_FLAGS.web_darker_dark_theme_live_chat": true,
        "EXPERIMENT_FLAGS.web_dedupe_ve_grafting": true,
        "EXPERIMENT_FLAGS.web_defer_shorts_ui": true,
        "EXPERIMENT_FLAGS.web_defer_shorts_ui_phase2": true,
        "EXPERIMENT_FLAGS.web_deprecate_service_ajax_map_dependency": true,
        "EXPERIMENT_FLAGS.web_emulated_idle_callback_delay": 0,
        "EXPERIMENT_FLAGS.web_enable_error_204": true,
        "EXPERIMENT_FLAGS.web_enable_history_cache_map": true,
        "EXPERIMENT_FLAGS.web_enable_video_preview_migration": true,
        "EXPERIMENT_FLAGS.web_enable_voz_audio_feedback": true,
        "EXPERIMENT_FLAGS.web_engagement_panel_show_description": true,
        "EXPERIMENT_FLAGS.web_ep_chevron_tap_target_size": true,
        "EXPERIMENT_FLAGS.web_filled_subscribed_button": true,
        "EXPERIMENT_FLAGS.web_foreground_heartbeat_interval_ms": 28000,
        "EXPERIMENT_FLAGS.web_forward_command_on_pbj": true,
        "EXPERIMENT_FLAGS.web_gel_debounce_ms": 60000,
        "EXPERIMENT_FLAGS.web_gel_timeout_cap": true,
        "EXPERIMENT_FLAGS.web_guide_ui_refresh": true,
        "EXPERIMENT_FLAGS.web_hide_autonav_headline": true,
        "EXPERIMENT_FLAGS.web_hide_autonav_keyline": true,
        "EXPERIMENT_FLAGS.web_home_feed_reload_delay": 1440,
        "EXPERIMENT_FLAGS.web_home_feed_reload_experience": "none",
        "EXPERIMENT_FLAGS.web_imp_thumbnail_click_fix_enabled": true,
        "EXPERIMENT_FLAGS.web_inline_player_enabled": true,
        "EXPERIMENT_FLAGS.web_inline_player_no_playback_ui_click_handler": true,
        "EXPERIMENT_FLAGS.web_inline_player_triggering_delay": 1000,
        "EXPERIMENT_FLAGS.web_kevlar_enable_adaptive_signals": true,
        "EXPERIMENT_FLAGS.web_log_memory_total_kbytes": true,
        "EXPERIMENT_FLAGS.web_log_player_watch_next_ticks": true,
        "EXPERIMENT_FLAGS.web_log_reels_ticks": true,
        "EXPERIMENT_FLAGS.web_logging_max_batch": 150,
        "EXPERIMENT_FLAGS.web_modern_ads": true,
        "EXPERIMENT_FLAGS.web_modern_buttons": true,
        "EXPERIMENT_FLAGS.web_modern_buttons_bl_survey": true,
        "EXPERIMENT_FLAGS.web_modern_chips": true,
        "EXPERIMENT_FLAGS.web_modern_dialogs": true,
        "EXPERIMENT_FLAGS.web_modern_playlists": true,
        "EXPERIMENT_FLAGS.web_modern_subscribe": true,
        "EXPERIMENT_FLAGS.web_modern_subscribe_style": "filled",
        "EXPERIMENT_FLAGS.web_move_autoplay_video_under_chip": true,
        "EXPERIMENT_FLAGS.web_moved_super_title_link": true,
        "EXPERIMENT_FLAGS.web_one_platform_error_handling": true,
        "EXPERIMENT_FLAGS.web_paused_only_miniplayer_shortcut_expand": true,
        "EXPERIMENT_FLAGS.web_player_add_ve_conversion_logging_to_outbound_links": true,
        "EXPERIMENT_FLAGS.web_player_autonav_empty_suggestions_fix": true,
        "EXPERIMENT_FLAGS.web_player_autonav_toggle_always_listen": true,
        "EXPERIMENT_FLAGS.web_player_autonav_use_server_provided_state": true,
        // "EXPERIMENT_FLAGS.web_player_caption_language_preference_stickiness_duration": 15,
        "EXPERIMENT_FLAGS.web_player_decouple_autonav": true,
        "EXPERIMENT_FLAGS.web_player_disable_inline_scrubbing": true,
        "EXPERIMENT_FLAGS.web_player_enable_early_warning_snackbar": true,
        "EXPERIMENT_FLAGS.web_player_enable_featured_product_banner_on_desktop": true,
        "EXPERIMENT_FLAGS.web_player_enable_ipp": true,
        "EXPERIMENT_FLAGS.web_player_enable_premium_hbr_in_h5_api": true,
        "EXPERIMENT_FLAGS.web_player_enable_premium_hbr_playback_cap": true,
        "EXPERIMENT_FLAGS.web_player_entities_middleware": true,
        "EXPERIMENT_FLAGS.web_player_log_click_before_generating_ve_conversion_params": true,
        "EXPERIMENT_FLAGS.web_player_move_autonav_toggle": true,
        "EXPERIMENT_FLAGS.web_player_mutable_event_label": true,
        "EXPERIMENT_FLAGS.web_player_should_honor_include_asr_setting": true,
        "EXPERIMENT_FLAGS.web_player_small_hbp_settings_menu": true,
        "EXPERIMENT_FLAGS.web_player_topify_subtitles_for_shorts": true,
        "EXPERIMENT_FLAGS.web_player_touch_mode_improvements": true,
        "EXPERIMENT_FLAGS.web_player_use_new_api_for_quality_pullback": true,
        "EXPERIMENT_FLAGS.web_player_ve_conversion_fixes_for_channel_info": true,
        "EXPERIMENT_FLAGS.web_player_watch_next_response": true,
        "EXPERIMENT_FLAGS.web_prefetch_preload_video": true,
        "EXPERIMENT_FLAGS.web_prs_testing_mode_killswitch": true,
        "EXPERIMENT_FLAGS.web_replace_thumbnail_with_image": true,
        "EXPERIMENT_FLAGS.web_rounded_thumbnails": true,
        "EXPERIMENT_FLAGS.web_search_inline_playback_mouse_enter": true,
        "EXPERIMENT_FLAGS.web_search_inline_player_triggering_delay": 500,
        "EXPERIMENT_FLAGS.web_search_shorts_inline_playback_duration_ms": 0,
        "EXPERIMENT_FLAGS.web_segmented_like_dislike_button": true,
        "EXPERIMENT_FLAGS.web_set_inline_preview_setting_in_home_browse_request": true,
        "EXPERIMENT_FLAGS.web_sheets_ui_refresh": true,
        "EXPERIMENT_FLAGS.web_shorts_early_player_load": true,
        "EXPERIMENT_FLAGS.web_shorts_error_logging_threshold": 0.001,
        "EXPERIMENT_FLAGS.web_shorts_expanded_overlay_type": "DEFAULT",
        "EXPERIMENT_FLAGS.web_shorts_inline_playback_preview_ms": 0,
        "EXPERIMENT_FLAGS.web_shorts_intersection_observer_threshold_override": 0,
        "EXPERIMENT_FLAGS.web_shorts_nvc_dark": true,
        "EXPERIMENT_FLAGS.web_shorts_overlay_vertical_orientation": "bottom",
        "EXPERIMENT_FLAGS.web_shorts_progress_bar": true,
        "EXPERIMENT_FLAGS.web_shorts_scrubber_threshold_sec": 0,
        "EXPERIMENT_FLAGS.web_shorts_shelf_fixed_position": 9,
        "EXPERIMENT_FLAGS.web_shorts_shelf_on_search": true,
        "EXPERIMENT_FLAGS.web_shorts_skip_loading_same_index": true,
        "EXPERIMENT_FLAGS.web_shorts_storyboard_threshold_seconds": 0,
        "EXPERIMENT_FLAGS.web_smoothness_test_duration_ms": 0,
        "EXPERIMENT_FLAGS.web_smoothness_test_method": 0,
        "EXPERIMENT_FLAGS.web_snackbar_ui_refresh": true,
        "EXPERIMENT_FLAGS.web_structured_description_show_more": true,
        "EXPERIMENT_FLAGS.web_suggestion_box_restyle": true,
        "EXPERIMENT_FLAGS.web_system_health_fraction": 0.01,
        "EXPERIMENT_FLAGS.web_turn_off_imp_on_thumbnail_mousedown": true,
        "EXPERIMENT_FLAGS.web_use_cache_for_image_fallback": true,
        "EXPERIMENT_FLAGS.web_yt_config_context": true,
        "EXPERIMENT_FLAGS.woffle_clean_up_after_entity_migration": true,
        "EXPERIMENT_FLAGS.woffle_enable_download_status": true,
        "EXPERIMENT_FLAGS.woffle_orchestration": true,
        "EXPERIMENT_FLAGS.woffle_playlist_optimization": true,
        "EXPERIMENT_FLAGS.woffle_undo_delete": true,
        "EXPERIMENT_FLAGS.yoodle_base_url": "",
        "EXPERIMENT_FLAGS.yoodle_end_time_utc": 0,
        "EXPERIMENT_FLAGS.yoodle_start_time_utc": 0,
        "EXPERIMENT_FLAGS.yoodle_webp_base_url": "",
        "EXPERIMENT_FLAGS.your_data_entrypoint": true,
        "EXPERIMENT_FLAGS.yt_network_manager_component_to_lib_killswitch": true,
        "EXPERIMENT_FLAGS.ytidb_clear_embedded_player": true,
        "EXPERIMENT_FLAGS.ytidb_fetch_datasync_ids_for_data_cleanup": true,
        "EXPERIMENT_FLAGS.ytidb_remake_db_retries": 3,
        "EXPERIMENT_FLAGS.ytidb_reopen_db_retries": 3,
        "EXPERIMENT_FLAGS.ytidb_transaction_ended_event_rate_limit": 0.02,
        "EXPERIMENT_FLAGS.ytidb_transaction_ended_event_rate_limit_session": 0.2,
        "EXPERIMENT_FLAGS.ytidb_transaction_ended_event_rate_limit_transaction": 0.1,
        "FEXP_EXPERIMENTS.0": 23983296,
        // "FEXP_EXPERIMENTS.1": 23986031,
        "FEXP_EXPERIMENTS.10": 24433679,
        "FEXP_EXPERIMENTS.11": 24437577,
        "FEXP_EXPERIMENTS.12": 24439361,
        // "FEXP_EXPERIMENTS.13": 24449113,
        // "FEXP_EXPERIMENTS.14": 24453783,
        "FEXP_EXPERIMENTS.15": 24468691,
        // "FEXP_EXPERIMENTS.16": 24470719,
        // "FEXP_EXPERIMENTS.17": 24499116,
        // "FEXP_EXPERIMENTS.18": 24499792,
        // "FEXP_EXPERIMENTS.19": 24512415,
        "FEXP_EXPERIMENTS.2": 24004644,
        // "FEXP_EXPERIMENTS.20": 24514873,
        "FEXP_EXPERIMENTS.21": 24516157,
        "FEXP_EXPERIMENTS.22": 24550458,
        "FEXP_EXPERIMENTS.23": 24558190,
        "FEXP_EXPERIMENTS.24": 24559764,
        "FEXP_EXPERIMENTS.25": 24693103,
        "FEXP_EXPERIMENTS.26": 39323074,
        "FEXP_EXPERIMENTS.3": 24007246,
        "FEXP_EXPERIMENTS.4": 24080738,
        "FEXP_EXPERIMENTS.5": 24135310,
        // "FEXP_EXPERIMENTS.6": 24219381,
        // "FEXP_EXPERIMENTS.7": 24255163,
        // "FEXP_EXPERIMENTS.8": 24406084,
        // "FEXP_EXPERIMENTS.9": 24415864,
        "FILLER_DATA.browse.filler": true,
        "FILLER_DATA.browse.page": "browse",
        "FILLER_DATA.search.filler": true,
        "FILLER_DATA.search.page": "search",
        "FILLER_DATA.watch.filler": true,
        "FILLER_DATA.watch.page": "watch",
        "FILLER_DATA.watch.playerResponse.playabilityStatus.status": "OK",
        // "GAPI_LOCALE": "en_US",
        // "GL": "JP",
        // "GOOGLE_FEEDBACK_PRODUCT_DATA.accept_language": "en-US,en;q=0.9",
        "GOOGLE_FEEDBACK_PRODUCT_DATA.polymer": "active",
        "GOOGLE_FEEDBACK_PRODUCT_DATA.polymer2": "active",
        // "HL": "en",
        "HTML_DIR": "ltr",
        // "HTML_LANG": "en",
        "INNERTUBE_API_VERSION": "v1",
        "INNERTUBE_CONTEXT.request.useSsl": true,
        "INNERTUBE_CONTEXT.user.lockedSafetyMode": false,
        // "INNERTUBE_CONTEXT_GL": "JP",
        // "INNERTUBE_CONTEXT_HL": "en",
        "IS_TABLET": false,
        "IS_WATCH_PAGE_COLD": true,
        "LIVE_CHAT_BASE_TANGO_CONFIG.channelUri": "https://client-channel.google.com/client-channel/client",
        "LIVE_CHAT_BASE_TANGO_CONFIG.clientName": "yt-live-comments",
        // "LIVE_CHAT_BASE_TANGO_CONFIG.requiresAuthToken": true,
        "LIVE_CHAT_BASE_TANGO_CONFIG.senderUri": "https://clients4.google.com/invalidation/lcs/client",
        "LIVE_CHAT_BASE_TANGO_CONFIG.useNewTango": true,
        "LIVE_CHAT_SEND_MESSAGE_ACTION": "live_chat/watch_page/send",
        // "LOGGED_IN": false,
        "MENTIONS_EDU_HELP_LINK": "https://support.google.com/youtube/?p=creator_community",
        "NON_DEFERRED_HORIZONTAL_LIST_ITEM_COUNT": 5,
        "NON_DEFERRED_HORIZONTAL_LIST_ROW_COUNT": 0,
        "NO_EMPTY_DATA_IMG": true,
        "NUM_NAV": 0,
        "PAGE_BUILD_LABEL": "youtube.desktop.web_20230502_04_RC00",
        "PAGE_CL": 528763904,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45352180.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45353397.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45358145.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45364993.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45366266.intFlagValue": 60000,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45366267.intFlagValue": 1,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45366268.doubleFlagValue": 1,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45367987.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45368386.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45368498.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45368787.intFlagValue": 200,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45370961.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45372814.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45374306.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45374860.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45375564.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45375565.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45379855.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.experimentFlags.45388742.booleanFlagValue": true,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.androidEnablePip": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.androidNgwUiEnabled": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.androidRestoreBrowseContentsFromBackStack": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.androidThumbnailMonitorCount": 0,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.androidThumbnailMonitorEnabled": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.androidThumbnailMonitorMinimumWidth": 0,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.enableDetailedNetworkStatusReporting": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.enableGhostCards": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.enableInlineMuted": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.enableMobileAutoOffline": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.hourToReportNetworkStatus": 0,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.iosEnableDynamicFontSizing": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.iosSearchviewRefactoryEnabled": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.iosSsoSafariFsiPromoEnabled": true,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.iosTodayWidgetEnabled": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.iosWatchExpandTransitionWithoutSnapshot": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.networkStatusReportingWindowSecs": 0,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.ngwFlexyEnabled": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.ngwFlexyMaxCropRatio": 1,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.postsV2": false,
        "RAW_COLD_CONFIG_GROUP.mainAppColdConfig.searchHintExp": "search_youtube",
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45353338.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45355378.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45356954.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45356979.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45362297.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45365137.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45365843.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45366943.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45367289.doubleFlagValue": 2,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45369552.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45371287.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45375292.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45375445.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45377081.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45377737.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45379169.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45382142.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45382537.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45389043.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45390547.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.experimentFlags.45399984.booleanFlagValue": true,
        "RAW_HOT_CONFIG_GROUP.loggingHotConfig.eventLoggingConfig.enabled": true,
        "RAW_HOT_CONFIG_GROUP.loggingHotConfig.eventLoggingConfig.maxAgeHours": 720,
        "RAW_HOT_CONFIG_GROUP.loggingHotConfig.eventLoggingConfig.requestRetryEnabled": true,
        "RAW_HOT_CONFIG_GROUP.loggingHotConfig.eventLoggingConfig.retryConfig.fixedBatchRetryEnabled": false,
        "RAW_HOT_CONFIG_GROUP.loggingHotConfig.eventLoggingConfig.shouldForceSetAllPayloadsToImmediateTier": false,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.exposeConfigRefreshSetting": false,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosEarlySetWatchTransition": false,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosEnableSearchButtonOnPlayerOverlay": false,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosFreshFullRefresh": false,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosFreshHomeIntervalSecs": 0,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosFreshNotificationsInboxIntervalSecs": 0,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosFreshSubscriptionsIntervalSecs": 0,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosMinimumTooltipDurationMsecs": 1000,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosTodayWidgetRefreshIntervalSecs": 28800,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.iosWatchExpandTransition": false,
        "RAW_HOT_CONFIG_GROUP.mainAppHotConfig.signedOutNotificationsIosPrompt": true,
        "REMAINING_DOVA_DEFERRED_CHUNKS": 6,
        "REUSE_COMPONENTS": true,
        "ROOT_VE_TYPE": 3832,
        // "SBOX_LABELS.SUGGESTION_DISMISSED_LABEL": "Suggestion removed",
        // "SBOX_LABELS.SUGGESTION_DISMISS_LABEL": "Remove",
        "SBOX_SETTINGS.ENABLE_DELETE_ICON": false,
        "SBOX_SETTINGS.ENABLE_DELETE_ICON_HOVER": false,
        "SBOX_SETTINGS.HAS_ON_SCREEN_KEYBOARD": false,
        "SBOX_SETTINGS.HIDE_REMOVE_LINK": false,
        "SBOX_SETTINGS.IS_FUSION": false,
        "SBOX_SETTINGS.IS_POLYMER": true,
        // "SBOX_SETTINGS.REQUEST_LANGUAGE": "en",
        // "SBOX_SETTINGS.SBOX_STRINGS.SBOX_REPORT_SUGGESTIONS": "Report search predictions",
        "SBOX_SETTINGS.SEARCHBOX_BEHAVIOR_EXPERIMENT": "zero-prefix",
        "SBOX_SETTINGS.SEARCHBOX_ENABLE_REFINEMENT_SUGGEST": true,
        "SBOX_SETTINGS.SEARCHBOX_REPORTING": true,
        "SBOX_SETTINGS.SEARCHBOX_TAP_TARGET_EXPERIMENT": 0,
        "SBOX_SETTINGS.SEARCHBOX_ZERO_TYPING_SUGGEST_USE_REGULAR_SUGGEST": "always",
        // "SBOX_SETTINGS.SUGGESTION_BOX_RESTYLE": true,
        "SBOX_SETTINGS.SUGGESTION_BOX_RESTYLE_BOLDER": false,
        "SCHEDULED_LAZY_LIST": true,
        "SERVER_NAME": "WebFE",
        "SERVER_VERSION": "prod",
        "SERVICE_WORKER_PROMPT_NOTIFICATIONS": true,
        "STAMPER_STABLE_LIST": true,
        "START_IN_FULL_WINDOW_MODE": false,
        "START_IN_THEATER_MODE": false,
        "STS": 19478,
        // "TIME_CREATED_MS": 1683185951488,
        "TIMING_ACTION": "watch",
        "TIMING_AFT_KEYS.0": "pbs",
        "TIMING_AFT_KEYS.1": "pbp",
        "TIMING_AFT_KEYS.2": "pbu",
        "TIMING_INFO.yt_ad": "1",
        "VISIBILITY_TIME_BETWEEN_JOBS_MS": 100,
        "XSRF_FIELD_NAME": "session_token",
        // "initialBodyClientWidth": 1464,
        // "initialInnerHeight": 765,
        // "initialInnerWidth": 1464,
        "networkless_performanceTIMING_ACTION": "networkless_performance",
        "player_attTIMING_ACTION": "player_att",
        "scheduler.timeout": 20,
        "scheduler.useRaf": true,
        "wn_commentsTIMING_ACTION": "wn_comments"
    }
        ;
    function createConfigEditor(container, entries) {

        const buildEntry = (key, value) => {
            const entry = document.createElement('div');
            entry.classList.add('list-entry');
            let displayValue = typeof value !== 'string' ? value + "" : `"${value}"`;

            const keySpan = document.createElement('span');
            keySpan.className = 'key';
            keySpan.setAttribute('title', key)
            const keyDiv = document.createElement('div');
            keyDiv.textContent = `${key}`;
            keySpan.appendChild(keyDiv);

            const valueSpan = document.createElement('span');
            valueSpan.className = 'value';
            valueSpan.setAttribute('title', displayValue)
            const valueDiv = document.createElement('div');
            valueDiv.textContent = displayValue;
            valueSpan.appendChild(valueDiv);

            const valueInput = document.createElement('input');
            valueInput.className = 'value';
            valueInput.type = 'text';
            valueInput.value = displayValue;

            entry.appendChild(keySpan);
            entry.appendChild(valueSpan);
            valueSpan.appendChild(valueInput);

            if (mainKeys.includes(key)) entry.classList.add('list-entry-mainkey');
            if (key in minorKeyValues) {
                if (minorKeyValues[key] === value) entry.classList.add('list-entry-minorkey-same');
                else entry.classList.add('list-entry-minorkey-diff');
            }

            return entry;
        };

        for (const key of sortEntryKeys(Object.keys(entries))) {
            const entry = buildEntry(key, entries[key]);
            container.appendChild(entry);
        }

        function ensureElementIsInView(el) {
            const rect = el.getBoundingClientRect();
            const scrollable = findScrollableElement(el);
            const viewHeight = scrollable.clientHeight;

            if (rect.top < 0) el.scrollIntoView(true);
            else if (rect.bottom > viewHeight) el.scrollIntoView(false);
        }

        function findScrollableElement(el) {
            let p = el.parentNode;
            while (p) {
                if (p.scrollHeight > p.clientHeight) return p;
                p = p.parentNode;
            }
            return document.documentElement;
        }



        let lastSelectedEntry = null;
        let selectedEntries = [];
        const toggleEntrySelection = (entry) => {
            let beforeSelected = entry.classList.contains('selected');
            let afterSelected = !beforeSelected;
            if (!beforeSelected) {
                if (entry.matches('.list-hide-minor-same .list-entry.list-entry-minorkey-same')) {
                    return;
                }
            }
            entry.classList.toggle('selected');
            if (afterSelected) {
                lastSelectedEntry = entry;
                ensureElementIsInView(entry);
            }
            let left = 0;
            let right = selectedEntries.length - 1;
            let insertIndex = selectedEntries.length;
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                if (entry.compareDocumentPosition(selectedEntries[mid]) & Node.DOCUMENT_POSITION_FOLLOWING) {
                    insertIndex = mid;
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
            if (insertIndex === selectedEntries.length) {
                selectedEntries.push(entry);
            } else {
                selectedEntries.splice(insertIndex, 0, entry);
            }
        };

        const editEntries = (entries) => {
            entries.forEach((entry) => {
                // entry.classList.add('editing');
                const input = entry.querySelector('input.value');
                if (input) {
                    input.focus();
                    input.select();
                }
            });
        };



        let firstSelectedEntry = null;

        function selectEntriesBetween(entry1, entry2) {
            let startSelection = false;
            let entries = Array.from(container.querySelectorAll('.list-entry'));
            if (entries.indexOf(entry1) < 0 || entries.indexOf(entry2) < 0) return;
            if (entry1 == entry2) {



                for (const entry of entries) {
                    if (entry === entry1) {
                        if (!entry.classList.contains('selected'))
                            toggleEntrySelection(entry);
                    } else {
                        if (entry.classList.contains('selected'))
                            toggleEntrySelection(entry);
                    }
                }

                return;
            }

            for (const entry of entries) {
                if (entry === entry1 || entry === entry2) {
                    startSelection = !startSelection;
                    if (!entry.classList.contains('selected'))
                        toggleEntrySelection(entry);
                } else if (startSelection) {

                    if (!entry.classList.contains('selected'))
                        toggleEntrySelection(entry);
                } else if (!startSelection) {

                    if (entry.classList.contains('selected'))
                        toggleEntrySelection(entry);
                }
            }
        }

        container.addEventListener('click', (e) => {
            if (e.target.matches('.list-entry input')) return;

            const entry = e.target.closest('.list-entry');
            if (!entry) return;

            if (e.detail === 2) {
                editEntries(selectedEntries.length > 0 ? selectedEntries : [entry]);
            } else {
                if (e.ctrlKey || e.metaKey) {
                    toggleEntrySelection(entry);
                    if (!firstSelectedEntry) {
                        firstSelectedEntry = entry;
                    }
                } else if (e.shiftKey && firstSelectedEntry) {
                    selectEntriesBetween(firstSelectedEntry, entry);
                } else {
                    selectedEntries.forEach((e) => e.classList.remove('selected'));
                    selectedEntries = [entry];
                    firstSelectedEntry = entry;
                    toggleEntrySelection(entry);
                }
            }
        });


        container.addEventListener('blur', (e) => {
            if (!e.target.matches('.list-entry input.value')) return;
            const entry = e.target.closest('.list-entry');
            let newValue = e.target.value.trim();

            let valueDom = entry.querySelector('span.value div');
            let oldValue = valueDom.textContent.trim();
            if (oldValue !== newValue) {

                const isBoolean = /^(true|false)$/i.test(oldValue);
                if (isBoolean) {
                    if (/^(0)$/.test(newValue)) {
                        newValue = false;
                    } else
                        if (/^(1)$/.test(newValue)) {
                            newValue = true;
                        }
                }

                const isValidBoolean = /^(true|false)$/i.test(newValue);
                const isValidNumber = /^-?\d+(\.\d+)?$/.test(newValue);
                const isValidString = /^"([^"]|\\")*"$/.test(newValue);

                if (!isValidBoolean && !isValidNumber && !isValidString) {
                    entry.classList.remove('editing');
                    e.target.value = oldValue;
                } else {
                    entry.classList.remove('editing');
                    valueDom.textContent = newValue;
                }
            } else {
                entry.classList.remove('editing');
            }
        }, true);

        container.addEventListener('dblclick', (e) => {
            if (!e.target.matches('.list-entry span.value')) return;
            const target = e.target;
            requestAnimationFrame(() => {

                const entry = target.closest('.list-entry');
                const input = entry.querySelector('input.value');
                if (input) {
                    input.setSelectionRange(0, input.value.length);
                }

            })
        });

        const selectAdjacentEntry = (entry, direction, addToSelection) => {
            if (!entry) return;

            let adjacentEntry = direction === 'up' ? entry.previousElementSibling : entry.nextElementSibling;

            if (!adjacentEntry) return;
            while (adjacentEntry) {
                if (adjacentEntry.matches('.list-hide-minor-same .list-entry.list-entry-minorkey-same')) {
                    adjacentEntry = direction === 'up' ? adjacentEntry.previousElementSibling : adjacentEntry.nextElementSibling;
                } else {
                    break;
                }
            }

            if (!adjacentEntry) return;

            if (!addToSelection) {
                selectedEntries.forEach((e) => e.classList.remove('selected'));
                selectedEntries = [];
            } else {
                if (adjacentEntry.classList.contains('selected')) {
                    lastSelectedEntry = adjacentEntry;
                    toggleEntrySelection(entry);
                    return;
                }
            }

            toggleEntrySelection(adjacentEntry);
        };
        function selectAllEntries() {
            const entries = container.querySelectorAll('.list-entry:not(.selected)');
            for (const entry of entries) {
                toggleEntrySelection(entry);
            }
        }


        container.addEventListener('keydown', (e) => {
            if (e.target.matches('.list-entry input.value')) {


                if (e.key === 'Enter') {
                    e.preventDefault();
                    let container = e.target.closest('.list-container');
                    e.target.blur();
                    container.focus();
                }

                if (e.key === 'Escape') {
                    e.preventDefault();
                    let container = e.target.closest('.list-container');
                    e.target.blur();
                    container.focus();
                }

            } else {


                if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                    console.log(selectedEntries)
                    const lines = selectedEntries.map(entry => {
                        const key = entry.querySelector('.key div').textContent + ":";
                        const value = entry.querySelector('.value div').textContent;
                        return `${key} ${value}`;
                    });
                    const textToCopy = lines.join(',\n');
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        console.log('Copied to clipboard');
                    }).catch((err) => {
                        console.error('Error copying to clipboard', err);
                    });
                } else {

                    if (selectedEntries.length === 0) return;
                    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                        e.preventDefault();
                        selectAllEntries();
                    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        if (lastSelectedEntry !== null && selectedEntries.indexOf(lastSelectedEntry) >= 0) {
                            selectAdjacentEntry(lastSelectedEntry, e.key === 'ArrowUp' ? 'up' : 'down', e.shiftKey);
                        } else {
                            lastSelectedEntry = null;
                        }
                        e.preventDefault();
                    } else if (e.key === 'Enter') {
                        if (!selectedEntries.some(entry => entry.classList.contains('editing'))) {
                            editEntries(selectedEntries);
                        }
                    }
                }
            }
        });


    }

    function createDialog() {

        const _themeProps_ = {
            dialogBackgroundColor: '#f6f6f6',
            dialogBackgroundColorDark: '#23252a',
            backdropColor: '#b5b5b568',
            textColor: '#111111',
            textColorDark: '#f0f3f4',
            zIndex: 60000,
            fontSize: '10pt',
            dialogMinWidth: '32px',
            dialogMinHeight: '24px',
        };

        class VJSD extends VanillaJSDialog {

            get themeProps() {
                return _themeProps_
            }

            isDarkTheme() {
                return document.documentElement.hasAttribute('dark');
            }

            onBeforeShow() {

            }

            onFirstCreation() {

                const S = this.S; /* this is the global method */

                /* on top of the setup function, override the icon widget on global method */
                S.widgets.icon = (iconTag) => {
                    return S.ce('i', { className: 'vjsd-icon fa-solid fa-' + iconTag });
                }

                /* you might also overide `S.importCSS` by the use of Userscript Manager's import */
                S.importCSS(
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/fontawesome.min.css#sha512=SgaqKKxJDQ/tAUAAXzvxZz33rmn7leYDYfBP+YoMRSENhf3zJyx3SBASt/OfeQwBHA1nxMis7mM3EV/oYT6Fdw==',
                    // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/brands.min.css',
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/solid.min.css#sha512=yDUXOUWwbHH4ggxueDnC5vJv4tmfySpVdIcN1LksGZi8W8EVZv4uKGrQc0pVf66zS7LDhFJM7Zdeow1sw1/8Jw=='
                );

                /* load CSS files, etc - You might overide the `getTheme()` in VanillaJSDialog */
                this.themeSetup();
            }

            /* init is called after setup function is called */
            init() {
                const S = this.S; /* this is the global method */

                const es = this.es; /* this is a store for HTMLElements binded to this dialog */

                es.dialog = S.ce('div', {
                    className: 'vjsd-dialog'
                }, {
                    '__vjsd__': ''
                });

                es.dialog.append(
                    es.header = S.ce('div', {
                        className: 'vjsd-dialog-header vjsd-hflex'
                    }),
                    es.body = S.ce('div', {
                        className: 'vjsd-dialog-body vjsd-gap-2 vjsd-overscroll-none vjsd-vflex'
                    }),

                );


                es.footer = S.ce('div', {
                    className: 'vjsd-dialog-footer vjsd-hflex'
                });

                es.header.append(
                    S.widgets.icon('circle-info', (a) => {

                    }),
                    S.widgets.title('YouTube Configuration', {
                        className: 'vjsd-flex-fill'
                    }),
                    S.widgets.buttonIcon('square-xmark', {
                        'vjsd-clickable': '#dialogXmark'
                    })
                );

                const checkBoxChanged = () => {
                    let elmChoice1 = [...document.getElementsByName('tabview-tab-default')].filter(e => e.checked).map(e => e.value);
                    console.assert(elmChoice1.length <= 1);
                    es.checkboxSelectionDisplay.textContent = elmChoice1.length === 1 ? `The default tab will be set to ${elmChoice1[0]}` : `The default tab will be reset.`;
                }

                es.body.append(
                    es.ycConfigPlacholder = S.ce('div', { id: 'yc-config-placeholder' })
                );

                const onXMarkClicked = () => {
                    this.dismiss();
                }

                const onClearClicked = () => {
                    es.checkbox1.checked = false;
                    es.checkbox2.checked = false;
                    es.checkbox3.checked = false;
                    checkBoxChanged();
                }

                const onConfirmClicked = () => {
                    let myDefaultTab = null;
                    for (const checkbox of document.getElementsByName('tabview-tab-default')) {
                        if (checkbox.checked) myDefaultTab = checkbox.value;
                    }
                    myDefaultTab = myDefaultTab || null;
                    console.log(myDefaultTab)
                    setMyDefaultTab(myDefaultTab);
                    this.dismiss();
                }

                const onCancelClicked = () => {
                    this.dismiss();
                }

                es.footer.append(
                    es.clearButton = S.widgets.button('Clear', {
                        'vjsd-clickable': '#clear'
                    }),
                    S.widgets.space(),
                    S.widgets.button('Cancel', {
                        'vjsd-clickable': '#cancel'
                    }),
                    S.widgets.button('Confirm', {
                        'vjsd-clickable': '#confirm'
                    }),
                )

                this.clickable('#cancel', onCancelClicked)
                this.clickable('#clear', onClearClicked)
                this.clickable('#confirm', onConfirmClicked)
                this.clickable('#dialogXmark', onXMarkClicked);

                this.backdrop = 'dismiss';
                document.body.appendChild(es.dialog)
            }
        }

        VJSD.setup1();
        return new VJSD();
    }




    let dialog = null;


    let containerWrapper = null;


    GM_registerMenuCommand("Read", function () {

        addCSSForList();


        let p = getModuleGetConfig()
        console.log(p);

        const ytEntries = p;
        let container = null;

        if (containerWrapper === null) {

            container = document.createElement('div');
            container.className = 'list-container list-hide-minor-same';
            container.setAttribute('tabindex', '0');

            containerWrapper = document.createElement('div');
            containerWrapper.className = 'list-container-wrapper';
            containerWrapper.setAttribute('tabindex', '-1');

            containerWrapper.appendChild(container);
        } else {
            container = containerWrapper.querySelector('.list-container');
            container.textContent = '';
        }

        // const container = document.querySelector('#list-container');
        // createConfigEditor(container, ytEntries);

        createConfigEditor(container, ytEntries);
        console.log(containerWrapper);



        dialog = dialog || createDialog();
        dialog.show();

        document.querySelector('#yc-config-placeholder').appendChild(containerWrapper);




    });



    function moduleSetYC() {

        let configMap = new WeakSet();

        function cloneIt(target, source) {

            if (!target) return;

            if (configMap.has(target)) return;

            configMap.add(target)

            Object.assign(target, source);

            return true;

        }
        function assign(target, key, value) {

            let m = key.split('.');
            let object = target;
            for (let i = 0; i < m.length - 1; i++) {

                let k = m[i];
                if (object[k] && typeof object[k] == 'object') {
                    object = object[k];
                } else {
                    return;
                }

            }
            if (object && m[m.length - 1]) {
                object[m[m.length - 1]] = value;
            }

        }

        function cloneIt2(target, source) {


            if (!target) return;

            if (configMap.has(target)) return;

            configMap.add(target)

            for (const key of Object.keys(source)) {

                assign(target, key, source[key]);

            }
            return true;


        }

        let pConfig = `
        EXPERIMENT_FLAGS.action_companion_center_align_description: true,
  EXPERIMENT_FLAGS.action_companion_center_align_description: true,
  EXPERIMENT_FLAGS.enable_pacf_through_ybfe_tv_for_page_top_formats: true,
  EXPERIMENT_FLAGS.enable_rta_manager: true,
  EXPERIMENT_FLAGS.kevlar_enable_em_offlineable_discovery: true,
  EXPERIMENT_FLAGS.kevlar_show_em_dl_btn: true,
  EXPERIMENT_FLAGS.kevlar_show_em_dl_menu_item: true,
  EXPERIMENT_FLAGS.kevlar_show_em_dl_settings_tab: true,
  EXPERIMENT_FLAGS.max_prefetch_window_sec_for_livestream_optimization: 10,
  EXPERIMENT_FLAGS.min_prefetch_offset_sec_for_livestream_optimization: 20,
  EXPERIMENT_FLAGS.polymer_on_demand_shady_dom: true,
  EXPERIMENT_FLAGS.suggest_caption_correction_menu_item: true,
  EXPERIMENT_FLAGS.use_rta_manager_for_async: true,
  EXPERIMENT_FLAGS.web_enable_imp_audio_cc: true,
  EXPERIMENT_FLAGS.web_enable_pdp_mini_player: true,
  EXPERIMENT_FLAGS.web_modern_surveys: true,
  EXPERIMENT_FLAGS.web_modern_vwt_surveys: true,
  EXPERIMENT_FLAGS.web_modern_vwt_surveys_sampled: true,
  EXPERIMENT_FLAGS.web_modern_vwt_surveys_sampled_unclickable_video: true,
  EXPERIMENT_FLAGS.web_modern_vwt_surveys_v2: true,
  EXPERIMENT_FLAGS.web_player_caption_language_preference_stickiness_duration: 0,
  FEXP_EXPERIMENTS.1: 23986017,
  FEXP_EXPERIMENTS.10: 24405914,
  FEXP_EXPERIMENTS.11: 24415864,
  FEXP_EXPERIMENTS.12: 24433679,
  FEXP_EXPERIMENTS.13: 24437577,
  FEXP_EXPERIMENTS.14: 24439361,
  FEXP_EXPERIMENTS.15: 24443594,
  FEXP_EXPERIMENTS.16: 24449113,
  FEXP_EXPERIMENTS.17: 24468691,
  FEXP_EXPERIMENTS.18: 24470719,
  FEXP_EXPERIMENTS.19: 24483241,
  FEXP_EXPERIMENTS.2: 24000320,
  FEXP_EXPERIMENTS.20: 24499792,
  FEXP_EXPERIMENTS.21: 24514873,
  FEXP_EXPERIMENTS.22: 24516157,
  FEXP_EXPERIMENTS.23: 24537882,
  FEXP_EXPERIMENTS.24: 24550458,
  FEXP_EXPERIMENTS.25: 24557784,
  FEXP_EXPERIMENTS.3: 24004644,
  FEXP_EXPERIMENTS.4: 24007246,
  FEXP_EXPERIMENTS.5: 24080738,
  FEXP_EXPERIMENTS.6: 24135310,
  FEXP_EXPERIMENTS.7: 24208765,
  FEXP_EXPERIMENTS.8: 24219382,
  FEXP_EXPERIMENTS.9: 24255165,
  GAPI_LOCALE: "en_US",
  GL: "JP",
  GOOGLE_FEEDBACK_PRODUCT_DATA.accept_language: "ja,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
  HL: "en",
  HTML_LANG: "en",
  INNERTUBE_CONTEXT.request.consistencyTokenJars.0.encryptedTokenJarContents: "ACeCFAWPJTilGecAEUw37owUN5_xgOWFbkxSbkG-z1L__jJzx90RSyjM8p6MiYgVKLx7lfx4fBplED4ZHvwM9ONpBLAr-kYBW1tcXp1vaKvA3Z-7vSUl3dvCVZA02bkjDPA4VsQlfB37Iv9tAzMwVR_EA_C0N-wHqgcdqZ12SR2OYA",
  INNERTUBE_CONTEXT_GL: "JP",
  INNERTUBE_CONTEXT_HL: "en",
  LIVE_CHAT_BASE_TANGO_CONFIG.requiresAuthToken: false,
  LOGGED_IN: true,
  PAGE_BUILD_LABEL: "youtube.desktop.web_20230504_01_RC00",
  PAGE_CL: 529318761,
  SBOX_LABELS.SUGGESTION_DISMISSED_LABEL: "Suggestion removed",
  SBOX_LABELS.SUGGESTION_DISMISS_LABEL: "Remove",
  SBOX_SETTINGS.REQUEST_LANGUAGE: "en",
  SBOX_SETTINGS.SBOX_STRINGS.SBOX_REPORT_SUGGESTIONS: "Report search predictions",
  SBOX_SETTINGS.SUGGESTION_BOX_RESTYLE: false,
  TIME_CREATED_MS: 1683272855180,
  initialBodyClientWidth: 1263,
  initialInnerHeight: 569,
  initialInnerWidth: 1280
  `;
        pConfig = pConfig.split(',\n').map(x => x.split(': '));
        let qConfig = {};
        for (const s of pConfig) {
            try{
                qConfig[s[0].trim()] = JSON.parse(s[1]);
            }catch(e){}
        }

        function configSet() {

            const yt = uWind.yt;
            if (!yt) return;

            if (yt && yt.config_) {

                cloneIt2(yt.config_, qConfig);

                /*
                cloneIt2(yt.config_, {
                    PAGE_BUILD_LABEL: "youtube.desktop.web_20230504_01_RC00",
                    PAGE_CL: 529318761,
                    GAPI_LOCALE: "en_US",
                    GL: "JP",
                    HL: "en",
                    HTML_LANG: "en",
                    INNERTUBE_CONTEXT_GL: "JP",
                    INNERTUBE_CONTEXT_HL: "en",
                    LOGGED_IN: true,
                    PAGE_BUILD_LABEL: "youtube.desktop.web_20230504_01_RC00",
                    PAGE_CL: 529318761,
                })
                */
            }

            if (yt && yt.config_ && yt.config_.EXPERIMENT_FLAGS) {

                cloneIt(yt.config_.EXPERIMENT_FLAGS, {
                });
            }

            // TODO


        }
        let afk = 0;
        const MAX_AFK = 1e5; // don't change
        const PROCESS_UNLOCK_MULTIPLER = 180; // 16 for slow PC; 180 for forced effectiveness
        const FORCED_TIMEOUT = 4000; // actually 1000ms shall be fine
        const af = async () => {
            while (afk < MAX_AFK) {
                // for Mac M1, afk ends at 1000

                configSet();
                if (((++afk) % PROCESS_UNLOCK_MULTIPLER) === 0) {
                    await Promise.race([new Promise(r => requestAnimationFrame(r)), new Promise(r => setTimeout(r, 0))]);
                } else {
                    await Promise.resolve(0);
                }

            }
        }
        af();


        const afBreakEventHandler = () => {
            afk = MAX_AFK;
        }

        // play safe
        setTimeout(afBreakEventHandler, FORCED_TIMEOUT);

        // here we introduced two event hanlding to end the config force set.
        document.addEventListener('navigate-finish', afBreakEventHandler, true);
        document.addEventListener('yt-page-data-updated', afBreakEventHandler, true);

    }

    // moduleSetYC();


    // Your code here...
})(typeof unsafeWindow === 'object' ? unsafeWindow : window);