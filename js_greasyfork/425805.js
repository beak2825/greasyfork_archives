// ==UserScript==
// @name         Twitter Labs
// @description  Enable hidden Twitter PWA feature flags (Chromium only!)
// @author       Darek
// @namespace    
// @version      1.0
// @date         2021-05-2

// @icon         https://script.sominemo.com/twitter_labs/icon.png
// @icon64       https://script.sominemo.com/twitter_labs/icon64.png

// @run-at       document-start
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*

// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/425805/Twitter%20Labs.user.js
// @updateURL https://update.greasyfork.org/scripts/425805/Twitter%20Labs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(
        unsafeWindow,
        "__INITIAL_STATE__",
        {
            set(s) {
                const curMode = unsafeWindow.localStorage.getItem("twitter-labs-replace-mode") || "0"

                const rewrites = {
                    conversation_controls_limited_replies_creation_enabled: true,
                    responsive_web_composer_card_previews_enabled: true,
                    responsive_web_conversation_tree_enabled: true,
                    responsive_web_conversation_tree_toggle: true,
                    responsive_web_dm_quick_access_enabled: true,
					responsive_web_hide_media_previews_enabled: true,
                    responsive_web_dm_quick_access_with_close_enabled: true,
                    responsive_web_dm_quick_access_no_empty_drawer_enabled: true,
                    responsive_web_elevated_qt_combined_retweets_dynamic_label: true,
                    dm_reactions_config_active_reactions: [
                        "😂:funny",
                    	"😲:surprised",
                    	"😢:sad",
                    	"❤:like",
                    	"🔥:excited",
                    	"👍:agree",
                    	"👎:disagree",
                        "😠:angry",
                    ],
                    dm_reactions_config_inactive_reactions: [],
                    responsive_web_feature_switch_dash_enabled: true,
                    responsive_web_hw_cards_in_dms_enabled: true,
                    responsive_web_inline_reply_enabled: true,
                    responsive_web_inline_reply_with_fab_enabled: true,
                    responsive_web_instream_video_enabled: true,
                    responsive_web_live_video_parity_periscope_auth_enabled: true,
                    responsive_web_moment_maker_enabled: true,
                    responsive_web_ntab_verified_mentions_vit_internal_dogfood: true,
                    responsive_web_second_degree_replies_nudge_get_enabled: true,
                    responsive_web_second_degree_replies_nudge_force_enabled: true,
                    responsive_web_second_degree_replies_nudge_show_enabled: true,
                    responsive_web_tweet_detail_to_tweet_enabled: true,
                    responsive_web_zipkin_api_requests_enabled: true,
                    search_channels_discovery_page_enabled: true,
                    search_channels_description_enabled: true,
                    topic_landing_page_enabled: true,
                    topics_descriptions_enabled: true,
                    topics_dismiss_control_enabled: true,
                    topics_new_mgmt_enabled: true,
                    unified_cards_cta_color_blue_cta: true,
                }

                if (curMode === "1") {
                    Object.entries(s.featureSwitch.config).forEach(([key, {value}]) => {
                        if (value === false) s.featureSwitch.config[key] = {value: true}
                    })
                } else {
                    Object.entries(rewrites).forEach(([key, value]) => {s.featureSwitch.config[key] = {value}})
                }

                unsafeWindow.fakeInit = s
            },
            get() {return unsafeWindow.fakeInit},
            configurable: true
        })


    let curCommand = null
    let sw
    function updatePalette() {
        const curMode = unsafeWindow.localStorage.getItem("twitter-labs-replace-mode") || "0"
        if (curCommand !== null) GM_unregisterMenuCommand(curCommand)
        if (curMode === "0") curCommand = GM_registerMenuCommand("Use false-to-true mode", sw)
        if (curMode === "1") curCommand = GM_registerMenuCommand("Use manual rewrites mode", sw)
    }
    sw = () => {
        const curMode = unsafeWindow.localStorage.getItem("twitter-labs-replace-mode") || "0"
        if (curMode === "0") {
            unsafeWindow.localStorage.setItem("twitter-labs-replace-mode", "1")
            updatePalette()
            unsafeWindow.location.reload()
        }
        else if (curMode === "1") {
            unsafeWindow.localStorage.setItem("twitter-labs-replace-mode", "0")
            updatePalette()
            unsafeWindow.location.reload()
        }
    }
    updatePalette()
})();