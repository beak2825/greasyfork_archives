// ==UserScript==
// @name         YouTube - Force rounded corners + tweaks included
// @version      2026.01.22.1
// @description  This script forces the rounded version of the layout (which includes some fewer tweaks applied along with CSS tweaks/fixes and disables most of experimental flags).
// @author       Joey_JTS (original author: xX_LegendCraftd_Xx)
// @license MIT
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @allFrames    true
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/503344/YouTube%20-%20Force%20rounded%20corners%20%2B%20tweaks%20included.user.js
// @updateURL https://update.greasyfork.org/scripts/503344/YouTube%20-%20Force%20rounded%20corners%20%2B%20tweaks%20included.meta.js
// ==/UserScript==

// Attributes to remove from <html>
const ATTRS = [
    "darker-dark-theme",
    "darker-dark-theme-deprecate"
];

// Regular config keys.
const CONFIGS = {
    BUTTON_REWORK: true
}

// Experiment flags.
const EXPFLAGS = {
    /* Force rounded corners */
    web_button_rework: true,
    web_button_rework_with_live: true,
    web_darker_dark_theme: true,
    web_filled_subscribed_button: true,
    web_guide_ui_refresh: true,
    web_modern_ads: true,
    web_modern_buttons: true,
    web_modern_chips: true,
    web_modern_dialogs: true,
    web_modern_playlists: true,
    web_modern_subscribe: true,
    web_rounded_containers: true,
    web_rounded_thumbnails: true,
    web_searchbar_style: "rounded_corner_borders_light_btn",
    web_segmented_like_dislike_button: true,
    web_sheets_ui_refresh: true,
    web_snackbar_ui_refresh: true,
    /* Force rounded watch layout and few tweaks to be included (such as disabling the useless 'watch grid' UI and ambient lighting) */
    kevlar_watch_cinematics: false,
    kevlar_watch_metadata_refresh: true,
    kevlar_watch_metadata_refresh_attached_subscribe: true,
    kevlar_watch_metadata_refresh_clickable_description: true,
    kevlar_watch_metadata_refresh_compact_view_count: true,
    kevlar_watch_metadata_refresh_description_info_dedicated_line: true,
    kevlar_watch_metadata_refresh_description_inline_expander: true,
    kevlar_watch_metadata_refresh_description_primary_color: true,
    kevlar_watch_metadata_refresh_for_live_killswitch: true,
    kevlar_watch_metadata_refresh_full_width_description: true,
    kevlar_watch_metadata_refresh_narrower_item_wrap: true,
    kevlar_watch_metadata_refresh_relative_date: true,
    kevlar_watch_metadata_refresh_top_aligned_actions: true,
    kevlar_watch_modern_metapanel: true,
    kevlar_watch_modern_panels: true,
    kevlar_watch_panel_height_matches_player: true,
    kevlar_watch_grid: false,
    kevlar_watch_grid_hide_chips: false,
    small_avatars_for_comments: false,
    small_avatars_for_comments_ep: false,
    web_watch_compact_comments: false,
    web_watch_compact_comments_ep: false,
    web_watch_theater_chat: false,
    web_watch_theater_fixed_chat: false,
    live_chat_over_engagement_panels: false,
    live_chat_scaled_height: false,
    live_chat_smaller_min_height: false,
    wn_grid_max_item_width: 0,
    wn_grid_min_item_width: 0,
    kevlar_set_internal_player_size: false,
    kevlar_watch_flexy_metadata_height: "136",
    kevlar_watch_max_player_width: "1280",
    web_watch_rounded_player_large: false,
    desktop_delay_player_resizing: false,
    /* Additional tweaks (which includes reverting new UI changes except for last 2 configs that are set to true) */
    kevlar_refresh_on_theme_change: false,
    smartimation_background: false,
    web_animated_actions: false,
    web_animated_like: false,
    web_animated_like_lazy_load: false,
    enable_channel_page_header_profile_section: false,
    kevlar_modern_sd_v2: false,
    web_modern_collections_v2: false,
    web_modern_typography: true,
    web_enable_youtab: true
}

// Player flags
// !!! USE STRINGS FOR VALUES !!!
// For example: "true" instead of true
const PLYRFLAGS = {
    web_rounded_containers: "true",
    web_rounded_thumbnails: "true"
}

class YTP {
    static observer = new MutationObserver(this.onNewScript);

    static _config = {};

    static isObject(item) {
        return (item && typeof item === "object" && !Array.isArray(item));
    }

    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.mergeDeep(target, ...sources);
    }


    static onNewScript(mutations) {
        for (var mut of mutations) {
            for (var node of mut.addedNodes) {
                YTP.bruteforce();
            }
        }
    }

    static start() {
        this.observer.observe(document, {childList: true, subtree: true});
    }

    static stop() {
        this.observer.disconnect();
    }

    static bruteforce() {
        if (!window.yt) return;
        if (!window.yt.config_) return;

        this.mergeDeep(window.yt.config_, this._config);
    }

    static setCfg(name, value) {
        this._config[name] = value;
    }

    static setCfgMulti(configs) {
        this.mergeDeep(this._config, configs);
    }

    static setExp(name, value) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};

        this._config.EXPERIMENT_FLAGS[name] = value;
    }

    static setExpMulti(exps) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};

        this.mergeDeep(this._config.EXPERIMENT_FLAGS, exps);
    }

    static decodePlyrFlags(flags) {
        var obj = {},
            dflags = flags.split("&");

        for (var i = 0; i < dflags.length; i++) {
            var dflag = dflags[i].split("=");
            obj[dflag[0]] = dflag[1];
        }

        return obj;
    }

    static encodePlyrFlags(flags) {
        var keys = Object.keys(flags),
            response = "";

        for (var i = 0; i < keys.length; i++) {
            if (i > 0) {
                response += "&";
            }
            response += keys[i] + "=" + flags[keys[i]];
        }

        return response;
    }

    static setPlyrFlags(flags) {
        if (!window.yt) return;
        if (!window.yt.config_) return;
        if (!window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) return;
        var conCfgs = window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
        if (!("WEB_PLAYER_CONTEXT_CONFIGS" in this._config)) this._config.WEB_PLAYER_CONTEXT_CONFIGS = {};

        for (var cfg in conCfgs) {
            var dflags = this.decodePlyrFlags(conCfgs[cfg].serializedExperimentFlags);
            this.mergeDeep(dflags, flags);
            this._config.WEB_PLAYER_CONTEXT_CONFIGS[cfg] = {
                serializedExperimentFlags: this.encodePlyrFlags(dflags)
            }
        }
    }
}

window.addEventListener("yt-page-data-updated", function tmp() {
    YTP.stop();
    for (i = 0; i < ATTRS.length; i++) {
        document.getElementsByTagName("html")[0].removeAttribute(ATTRS[i]);
    }
    window.removeEventListener("yt-page-date-updated", tmp);
});

YTP.start();

YTP.setCfgMulti(CONFIGS);
YTP.setExpMulti(EXPFLAGS);
YTP.setPlyrFlags(PLYRFLAGS);

function $(q) {
    return document.querySelector(q);
}

(function() {
let css = `
/* Theme color and HTML tweaks along with adding rounded corners on both search box and home grid skeleton */
html[dark] {
--yt-spec-general-background-a: #181818 !important;
--yt-spec-general-background-b: #0f0f0f !important;
--yt-spec-brand-background-primary: rgba(33, 33, 33, 0.98) !important;
--yt-spec-10-percent-layer: rgba(255, 255, 255, 0.1) !important;
--yt-spec-base-background: #0f0f0f !important;
--yt-spec-guide-background-active: #272727 !important
}

html:not([dark]) {
--yt-spec-general-background-a: #f9f9f9 !important;
--yt-spec-general-background-b: #f1f1f1 !important;
--yt-spec-brand-background-primary: rgba(255, 255, 255, 0.98) !important;
--yt-spec-10-percent-layer: rgba(0, 0, 0, 0.1) !important;
--yt-spec-base-background: #fff !important;
--yt-spec-guide-background-active: #f2f2f2 !important
}

ytd-watch-flexy {
--ytd-watch-flexy-non-player-height: calc(var(--ytd-watch-flexy-masthead-height) + var(--ytd-margin-6x) + var(--ytd-watch-flexy-space-below-player));
--ytd-watch-flexy-non-player-width: calc(var(--ytd-watch-flexy-sidebar-width) + var(--ytd-margin-6x)*3);
--ytd-watch-flexy-min-player-height: 240px;
--ytd-watch-flexy-min-player-width: calc(var(--ytd-watch-flexy-min-player-height)*(var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio)));
--ytd-watch-flexy-max-player-height: calc(100vh - var(--ytd-watch-flexy-masthead-height) - var(--ytd-margin-6x) - var(--ytd-watch-flexy-space-below-player));
--ytd-watch-flexy-max-player-width: calc((100vh - var(--ytd-watch-flexy-masthead-height) - var(--ytd-margin-6x) - var(--ytd-watch-flexy-space-below-player))*(var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio)))
}

ytd-masthead {
background: var(--yt-spec-base-background) !important
}

ytd-app {
background: var(--yt-spec-base-background) !important
}

ytd-browse[page-subtype="channels"] {
background: var(--yt-spec-base-background) !important
}

ytd-c4-tabbed-header-renderer {
--yt-lightsource-section1-color: var(--yt-spec-base-background) !important
}

#page-header.ytd-tabbed-page-header, #tabs-inner-container.ytd-tabbed-page-header {
background: var(--yt-spec-base-background) !important
}

#tabs-divider.ytd-c4-tabbed-header-renderer, #tabs-divider.ytd-tabbed-page-header {
border-bottom: 1px !important
}

#guide-content.ytd-app {
background: var(--yt-spec-base-background) !important
}

ytd-mini-guide-renderer {
background-color: var(--yt-spec-base-background) !important
}

ytd-mini-guide-entry-renderer {
background-color: var(--yt-spec-base-background) !important
}

[page-subtype="home"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
background-color: var(--yt-spec-base-background) !important;
border-top: 0px !important;
border-bottom: 0px !important
}

ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer::after {
background: linear-gradient(to right,var(--yt-spec-base-background) 20%,rgba(33,33,33,0) 80%) !important
}

ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer::before {
background: linear-gradient(to left,var(--yt-spec-base-background) 20%,rgba(33,33,33,0) 80%) !important
}

ytd-feed-filter-chip-bar-renderer #left-arrow-button.ytd-feed-filter-chip-bar-renderer,
ytd-feed-filter-chip-bar-renderer #right-arrow-button.ytd-feed-filter-chip-bar-renderer {
background-color: var(--yt-spec-base-background) !important
}

yt-chip-cloud-renderer[is-dark-theme] #right-arrow.yt-chip-cloud-renderer::before {
background: linear-gradient(to left,var(--yt-spec-base-background) 20%,rgba(33,33,33,0) 80%) !important
}

yt-chip-cloud-renderer #left-arrow-button.yt-chip-cloud-renderer,
yt-chip-cloud-renderer #right-arrow-button.yt-chip-cloud-renderer {
background: var(--ytd-chip-cloud-background, var(--yt-spec-base-background)) !important
}

yt-chip-cloud-renderer[is-dark-theme] #left-arrow.yt-chip-cloud-renderer::after {
background: linear-gradient(to right,var(--yt-spec-base-background) 20%,rgba(33,33,33,0) 80%) !important
}

yt-chip-cloud-renderer #left-arrow.yt-chip-cloud-renderer::after {
background: linear-gradient(to right,var(--yt-spec-base-background) 20%,rgba(33,33,33,0) 80%) !important
}

yt-chip-cloud-renderer #right-arrow.yt-chip-cloud-renderer::before {
background: linear-gradient(to left,var(--yt-spec-base-background) 20%,rgba(33,33,33,0) 80%) !important
}

ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_HASHTAG_LANDING_PAGE"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
background-color: var(--yt-spec-base-background) !important
}

ytd-masthead.shell, #home-chips, #home-container-media, #guide-skeleton {
background: var(--yt-spec-base-background) !important
}

#home-chips {
border: 0 !important;
padding: 0 !important
}

#home-container-media {
padding-top: 18px !important;
margin-top: 0 !important
}

#home-page-skeleton .rich-thumbnail,
#home-page-skeleton .rich-thumbnail:before {
border-radius: 12px !important
}

#container.ytd-searchbox {
border-radius: 40px 0 0 40px;
margin-left: 32px;
padding: 0 4px 0 16px;
}

ytd-searchbox[has-focus] #container.ytd-searchbox {
margin-left: 0;
padding: 2px 4px 2px 48px;
}

#search-icon.ytd-searchbox {
padding: 0 16px !important
}

#search-icon-legacy.ytd-searchbox {
border-radius: 0 40px 40px 0 !important
}

/* Add rounded corners under the player */
div#ytp-id-17.ytp-popup.ytp-settings-menu,
div#ytp-id-18.ytp-popup.ytp-settings-menu {
border-radius: 12px !important
}

div.branding-context-container-inner.ytp-rounded-branding-context {
border-radius: 8px !important
}

.iv-card {
border-radius: 8px !important
}

.ytp-ad-overlay-container.ytp-overlay-ad .ytp-ad-overlay-image img, .ytp-ad-overlay-container.ytp-overlay-ad .ytp-ad-text-overlay, .ytp-ad-overlay-container.ytp-overlay-ad .ytp-ad-enhanced-overlay {
border-radius: 8px !important
}

.ytp-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg {
border-top-left-radius: 12px !important;
border-bottom-left-radius: 12px !important
}

.ytp-tooltip.ytp-text-detail.ytp-preview {
border-radius: 12px !important
}

.ytp-ce-video.ytp-ce-medium, .ytp-ce-playlist.ytp-ce-medium, .ytp-ce-medium .ytp-ce-expanding-overlay-background {
border-radius: 8px !important
}

.ytp-autonav-endscreen-upnext-thumbnail {
border-radius: 8px !important
}

.ytp-autonav-endscreen-upnext-button {
border-radius: 18px !important
}

.ytp-videowall-still-image {
border-radius: 8px !important
}

.ytp-sb-subscribe, .ytp-sb-unsubscribe {
border-radius: 18px !important
}

/* Watch page tweaks (including the 'Revert video list' CSS) */
ytd-watch-metadata[action-buttons-update-owner-width] #owner.ytd-watch-metadata {
min-width: calc(50% - 6px) !important;
max-width: calc(50% - 6px) !important;
margin-right: 12px !important
}

ytd-watch-metadata[actions-on-separate-line] #owner.ytd-watch-metadata {
max-width: 100% !important
}

#actions.ytd-watch-metadata {
min-width: auto !important
}

ytd-menu-renderer[has-flexible-items][safe-area] .top-level-buttons.ytd-menu-renderer {
margin-bottom: 0 !important
}

ytd-watch-metadata.ytd-watch-flexy {
padding-bottom: 36px !important
}

ytd-watch-flexy[default-layout][reduced-top-margin] #primary.ytd-watch-flexy, ytd-watch-flexy[default-layout][reduced-top-margin] #secondary.ytd-watch-flexy {
padding-top: var(--ytd-margin-6x) !important
}

#primary.ytd-watch-flexy, ytd-watch-flexy[flexy] #secondary.ytd-watch-flexy {
padding-right: var(--ytd-margin-6x) !important
}

#primary.ytd-watch-flexy {
margin-left: var(--ytd-margin-6x) !important
}

#secondary.ytd-watch-grid,
#secondary.ytd-watch-flexy {
width: 402px !important;
min-width: 300px !important
}

h1.ytd-watch-metadata {
font-size: 2rem !important;
line-height: 2.8rem !important
}

ytd-comments-header-renderer[compact-header] #title.ytd-comments-header-renderer {
margin-bottom: 24px !important
}

ytd-comments-header-renderer[modern-typography][compact-header] .count-text.ytd-comments-header-renderer {
font-size: 2rem !important;
line-height: 2.8rem !important;
font-weight: 700 !important;
max-height: 2.8rem !important;
display: flex !important;
flex-direction: row-reverse !important
}

[compact-header] .count-text.ytd-comments-header-renderer {
display: flex !important;
flex-direction: row-reverse !important
}

[compact-header] .count-text.ytd-comments-header-renderer span {
margin-right: 6px !important
}

ytd-watch-flexy #comment-teaser.ytd-watch-metadata {
display: none
}

#secondary.ytd-watch-flexy ytd-rich-item-renderer[rendered-from-rich-grid] {
--ytd-rich-item-row-usable-width: 100% !important
}

#secondary.ytd-watch-flexy ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
margin-left: 0
}

#secondary.ytd-watch-flexy ytd-rich-item-renderer ytd-menu-renderer .ytd-menu-renderer[style-target=button] {
width: 24px !important;
height: 24px !important
}

#secondary.ytd-watch-flexy #dismissible.ytd-rich-grid-media {
flex-direction: row
}

#secondary.ytd-watch-flexy #attached-survey.ytd-rich-grid-media,
#secondary.ytd-watch-flexy #avatar-link.ytd-rich-grid-media,
#secondary.ytd-watch-flexy #avatar-container.ytd-rich-grid-media {
display: none
}

#secondary.ytd-watch-flexy ytd-thumbnail.ytd-rich-grid-media,
#secondary.ytd-watch-flexy ytd-playlist-thumbnail.ytd-rich-grid-media {
margin-right: 8px;
height: 94px;
width: 168px
}

#secondary.ytd-watch-flexy ytd-thumbnail[size=large] a.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large]:before,
#secondary.ytd-watch-flexy ytd-thumbnail[size=large][large-margin] a.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large][large-margin]:before {
border-radius: 8px
}

ytd-watch-flexy ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail,
ytd-watch-flexy ytd-thumbnail[size=large] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-watch-flexy ytd-thumbnail[size=large] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail {
margin: 4px
}

#secondary.ytd-watch-flexy ytd-rich-item-renderer,
#secondary.ytd-watch-flexy ytd-rich-grid-row #contents.ytd-rich-grid-row {
margin: 0
}

#secondary.ytd-watch-flexy ytd-rich-item-renderer[reduced-bottom-margin] {
margin-top: 8px;
margin-bottom: 0
}

#secondary.ytd-watch-flexy ytd-rich-grid-renderer[reduced-top-margin] #contents.ytd-rich-grid-renderer {
padding-top: 0px
}

#secondary.ytd-watch-flexy ytd-rich-grid-media {
margin-bottom: 8px
}

#secondary.ytd-watch-flexy #details.ytd-rich-grid-media {
width: 100%;
min-width: 0
}

#secondary.ytd-watch-flexy ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block,
#secondary.ytd-watch-flexy #channel-name.ytd-video-meta-block {
font-family: "Roboto", "Arial", sans-serif;
font-size: 1.2rem;
line-height: 1.8rem;
font-weight: 400
}

#secondary.ytd-watch-flexy #video-title.ytd-rich-grid-media {
margin: 0 0 4px 0;
display: block;
font-family: "Roboto", "Arial", sans-serif;
font-size: 1.4rem;
line-height: 2rem;
font-weight: 500;
overflow: hidden;
display: block;
max-height: 4rem;
-webkit-line-clamp: 2;
display: box;
display: -webkit-box;
-webkit-box-orient: vertical;
text-overflow: ellipsis;
white-space: normal
}

#secondary.ytd-watch-flexy h3.ytd-rich-grid-media {
margin: 0
}

#secondary.ytd-watch-flexy .title-badge.ytd-rich-grid-media, ytd-watch-flexy .video-badge.ytd-rich-grid-media {
margin-top: 0
}

#secondary.ytd-watch-flexy ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer {
display: none
}

#secondary.ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar] ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer, ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar-on-watch] ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer, ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar-on-home] #header.ytd-rich-grid-renderer ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer {
display: flex;
height: 51px;
margin-bottom: 8px
}

#secondary.ytd-watch-flexy #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
position: relative;
top: 0
}

#secondary.ytd-watch-flexy ytd-feed-filter-chip-bar-renderer[fluid-width] #chips-content.ytd-feed-filter-chip-bar-renderer {
padding: 0
}

#secondary.ytd-watch-flexy yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer, ytd-watch-flexy yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer:first-of-type {
margin: 8px;
margin-left: 0
}

#secondary.ytd-watch-flexy ytd-button-renderer.ytd-feed-filter-chip-bar-renderer {
margin: 0;
padding: 0 8px
}

#secondary.ytd-watch-flexy .yt-lockup-view-model--horizontal .yt-lockup-view-model__content-image {
max-width: 168px !important
}

#secondary.ytd-watch-flexy .yt-lockup-view-model--vertical .yt-lockup-view-model__content-image {
min-width: 168px !important;
padding-right: 8px !important;
padding-bottom: 0 !important
}

#secondary.ytd-watch-flexy .yt-lockup-view-model--vertical {
flex-direction: row !important
}

/* More tweaks to be applied (main experimental flags to be disabled were included in this code) */
#channel-header-links.style-scope.ytd-c4-tabbed-header-renderer,
.page-header-view-model-wiz__page-header-attribution,
.yt-page-header-view-model__page-header-attribution {
display: none !important
}

#title.ytd-feed-nudge-renderer,
#title.ytd-playlist-sidebar-primary-info-renderer,
ytd-inline-form-renderer[component-style=INLINE_FORM_STYLE_TITLE] #text-displayed.ytd-inline-form-renderer,
[page-subtype="playlist"] .page-header-view-model-wiz__page-header-title--page-header-title-medium,
[page-subtype="playlist"] .page-header-view-model-wiz__page-header-title--page-header-title-large,
[page-subtype="playlist"] .yt-page-header-view-model__page-header-title--page-header-title-medium,
[page-subtype="playlist"] .yt-page-header-view-model__page-header-title--page-header-title-large {
font-family: YouTube Sans !important;
font-weight: 700 !important
}

div#end.style-scope.ytd-masthead .yt-spec-icon-badge-shape--style-overlay.yt-spec-icon-badge-shape--type-cart-refresh .yt-spec-icon-badge-shape__badge {
color: #fff !important
}

ytd-button-renderer.ytd-feed-filter-chip-bar-renderer {
background-color: transparent !important
}

#left-arrow-button.ytd-feed-filter-chip-bar-renderer,
#right-arrow-button.ytd-feed-filter-chip-bar-renderer {
background-color: var(--yt-spec-base-background) !important
}

#left-arrow.ytd-feed-filter-chip-bar-renderer:after {
background: linear-gradient(to right, var(--yt-spec-base-background) 20%, rgba(255, 255, 255, 0) 80%) !important
}

#right-arrow.ytd-feed-filter-chip-bar-renderer:before {
background: linear-gradient(to left, var(--yt-spec-base-background) 20%, rgba(255, 255, 255, 0) 80%) !important
}

#background.ytd-masthead, #frosted-glass.ytd-app {
background: var(--yt-spec-base-background) !important;
backdrop-filter: none !important
}

.ytp-progress-bar .ytp-scrubber-button {
opacity: 0 !important
}

.ytp-progress-bar:hover .ytp-scrubber-button {
opacity: 1 !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Remove"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="取り除く"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Usunąć"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Alisin"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Retirer"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Eliminar"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Remover"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Удалять"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Távolítsa el"],
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Verwijderen"] {
visibility: hidden !important
}

.ytSuggestionComponentRemoveLinkClearButton::before {
font-family: "Roboto", "sans-serif" !important;
color: var(--yt-spec-call-to-action) !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Remove"]::before {
content: "Remove";
font-family: "Roboto", "sans-serif" !important;
color: var(--yt-spec-call-to-action) !important;
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="取り除く"]::before {
content: "取り除く";
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Usunąć"]::before {
content: "Usunąć";
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Alisin"]::before {
content: "Alisin";
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Retirer"]::before {
content: "Retirer";
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Eliminar"]::before {
content: "Eliminar";
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Remover"]::before {
content: "Remover";
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Удалять"]::before {
content: "Удалять";
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Távolítsa el"]::before {
content: "Távolítsa el";
visibility: visible !important
}

.ytSuggestionComponentRemoveLinkClearButton[aria-label="Verwijderen"]::before {
content: "Verwijderen";
visibility: visible !important
}

.ytSuggestionComponentThumbnailContainer,
.ytSuggestionComponentvisualSuggestThumbnail {
display: none !important
}

#author-thumbnail.ytd-comment-simplebox-renderer,
#primary #author-thumbnail.ytd-comment-view-model,
#author-thumbnail.ytd-comment-view-model yt-img-shadow.ytd-comment-view-model {
width: 40px !important;
height: 40px !important
}

.thread-hitbox.ytd-comment-thread-renderer {
display: none !important
}

.ytSubThreadThreadline,
.threadline.style-scope.ytd-comment-view-model {
visibility: hidden !important
}

ytSubThreadSubThreadContent {
margin-top: 0 !important
}

.ytSubThreadSubThreadContent .yt-spec-button-shape-next {
color: var(--yt-spec-call-to-action) !important;
flex-direction: row-reverse !important
}

.ytSubThreadSubThreadContent .ytd-comment-engagement-bar .yt-spec-button-shape-next {
color: var(--yt-spec-icon-active-other) !important
}

.ytSubThreadSubThreadContent .yt-spec-button-shape-next__icon {
margin-left: 0 !important;
margin-right: 6px !important
}

ytd-watch-metadata[description-collapsed]:hover #description.ytd-watch-metadata:hover {
opacity: 1 !important;
background: var(--yt-spec-additive-background) !important
}

ytd-browse[page-subtype="home"] yt-touch-feedback-shape {
display: none !important
}

.ytp-delhi-modern .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox, .ytp-delhi-modern.big-mode .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox {
background: var(--yt-spec-red-indicator, #e1002d) !important
}

/* Revert giant search thumbnails back to normal size */
ytd-two-column-search-results-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] #primary.ytd-two-column-search-results-renderer,
ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search {
max-width: 1096px !important
}

ytd-channel-renderer[use-bigger-thumbs][bigger-thumb-style=BIG] #avatar-section.ytd-channel-renderer,
ytd-channel-renderer[use-bigger-thumbs] #avatar-section.ytd-channel-renderer,
ytd-video-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-video-renderer,
ytd-video-renderer[use-search-ui] ytd-thumbnail.ytd-video-renderer,
ytd-playlist-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-playlist-thumbnail.ytd-playlist-renderer,
ytd-playlist-renderer[use-bigger-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer,
ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-radio-renderer,
ytd-radio-renderer[use-bigger-thumbs] ytd-thumbnail.ytd-radio-renderer,
ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-radio-renderer,
ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-playlist-thumbnail.ytd-radio-renderer,
ytd-movie-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] .thumbnail-container.ytd-movie-renderer,
ytd-movie-renderer[use-bigger-thumbs] .thumbnail-container.ytd-movie-renderer,
ytd-promoted-video-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-promoted-video-renderer,
ytd-promoted-sparkles-web-renderer[web-search-layout][use-bigger-thumbs][bigger-thumbs-style=BIG] #thumbnail-container.ytd-promoted-sparkles-web-renderer,
ytd-text-image-no-button-layout-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] #text-image-container.ytd-text-image-no-button-layout-renderer,
.yt-lockup-view-model-wiz--horizontal .yt-lockup-view-model-wiz__content-image,
.yt-lockup-view-model--horizontal .yt-lockup-view-model__content-image {
max-width: 360px !important
}

/* Rename from 'Posts' to 'Community' */
yt-tab-shape[tab-title="Posts"]  .yt-tab-shape-wiz__tab,
yt-tab-shape[tab-title="Posts"]  .yt-tab-shape__tab {
visibility: hidden !important;
padding: 0px 0px 0px 0px !important
}

yt-tab-shape[tab-title="Posts"]  .yt-tab-shape-wiz__tab:after,
yt-tab-shape[tab-title="Posts"]  .yt-tab-shape__tab:after {
content: 'Community';
visibility: visible !important;
margin-left: -45px !important;
text-align: center !important
}

/* Left sidebar tweaks (swaps 'Subscriptions' and 'You' sections along with cleaning up items) */
#sections {
display: flex !important;
flex-direction: column !important
}

#sections > ytd-guide-section-renderer {
order: 0 !important
}

#sections > ytd-guide-section-renderer:nth-of-type(2) {
order: 3 !important
}

#sections > ytd-guide-section-renderer:nth-of-type(3) {
order: 2 !important
}

#sections > ytd-guide-section-renderer:nth-of-type(4) {
order: 4 !important
}

#sections > ytd-guide-section-renderer:nth-of-type(5) {
order: 5 !important
}

#sections > ytd-guide-section-renderer:nth-of-type(6) {
order: 6 !important
}

ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(4) {
display: none
}

ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-last-of-type(2) {
display: none
}

ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-last-of-type(1) {
display: block !important
}

ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(1) ytd-guide-entry-renderer.ytd-guide-section-renderer.style-scope:nth-of-type(3), .ytd-mini-guide-entry-renderer[href="/shorts/"] {
display: none !important
}

/* Other fixes (includes hiding 'Shorts' feed on most pages) */
#background.ytd-masthead {
opacity: 1 !important
}

ytd-guide-entry-renderer {
background-color: var(--yt-spec-base-background) !important
}

ytd-guide-entry-renderer:hover {
background-color: var(--yt-spec-general-background-b) !important
}

ytd-guide-entry-renderer[active] {
background-color: var(--yt-spec-guide-background-active) !important
}

ytd-search ytd-video-renderer, ytd-search ytd-channel-renderer, ytd-search ytd-playlist-renderer, ytd-search ytd-radio-renderer, ytd-search ytd-movie-renderer, ytd-video-renderer.style-scope.ytd-item-section-renderer, ytd-playlist-renderer.style-scope.ytd-item-section-renderer, ytd-search .lockup.ytd-item-section-renderer {
margin-top: 16px !important
}

ytd-compact-video-renderer.style-scope.ytd-item-section-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer, ytd-compact-movie-renderer, ytd-item-section-renderer[section-identifier="sid-wn-chips"] yt-lockup-view-model.ytd-item-section-renderer.lockup {
margin-top: 8px !important
}

.ytSearchboxComponentDesktop .ytSearchboxComponentClearButtonIcon {
color: var(--yt-spec-text-primary) !important
}

.ytGridShelfViewModelHost, .ytd-search ytd-shelf-renderer,
[page-subtype='home'] ytd-reel-shelf-renderer,
[page-subtype='subscriptions'] ytd-reel-shelf-renderer,
[page-subtype='subscriptions'] ytd-rich-section-renderer,
ytd-reel-shelf-renderer.ytd-watch-next-secondary-results-renderer.style-scope,
#related ytd-compact-video-renderer:has(a[href^="/shorts"]) {
display: none !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

// Watch Resize Fix integration (credit: CY Fung)
/* jshint esversion:8 */

((__CONTEXT01__) => {
  'use strict';


  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'ahceihvpbosz';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.
  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1'
      let frame = document.getElementById(frameId);
      let removeIframeFn = null;
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = frameId;
        const blobURL = typeof webkitCancelAnimationFrame === 'function' && typeof kagi === 'undefined' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null; // avoid Brave Crash
        frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
        let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
        n.appendChild(frame);
        while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
        const root = document.documentElement;
        root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
        if (blobURL) Promise.resolve().then(() => URL.revokeObjectURL(blobURL));

        removeIframeFn = (setTimeout) => {
          const removeIframeOnDocumentReady = (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            e = n;
            n = win = removeIframeFn = 0;
            setTimeout ? setTimeout(() => e.remove(), 200) : e.remove();
          }
          if (!setTimeout || document.readyState !== 'loading') {
            removeIframeOnDocumentReady();
          } else {
            win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
          }
        }
      }
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      try {
        const { requestAnimationFrame, setTimeout, clearTimeout } = fc;
        const res = { requestAnimationFrame, setTimeout, clearTimeout };
        for (let k in res) res[k] = res[k].bind(win); // necessary
        if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
        return res;
      } catch (e) {
        if (removeIframeFn) removeIframeFn();
        return null;
      }
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const isWatchPageURL = (url) => {
    url = url || location;
    return location.pathname === '/watch' || location.pathname.startsWith('/live/')
  };

  cleanContext(win).then(__CONTEXT02__ => {
    if (!__CONTEXT02__) return null;

    const { ResizeObserver } = __CONTEXT01__;
    const { requestAnimationFrame, setTimeout, clearTimeout } = __CONTEXT02__;
    const elements = {};
    let rid1 = 0;
    let rid2 = 0;
    /** @type {MutationObserver | null} */
    let attrObserver = null;
    /** @type {ResizeObserver | null} */
    let resizeObserver = null;
    let isHTMLAttrApplied = false;
    const core = {
      begin() {
        document.addEventListener('yt-player-updated', core.hanlder, true);
        document.addEventListener('ytd-navigate-finish', core.hanlder, true);
      },
      hanlder: () => {
        rid1++;
        if (rid1 > 1e9) rid1 = 9;
        const tid = rid1;
        requestAnimationFrame(() => {
          if (tid !== rid1) return;
          core.runner();
        })
      },
      async runner() {
        if (!location.href.startsWith('https://www.youtube.com/')) return;
        if (!isWatchPageURL()) return;

        elements.ytdFlexy = document.querySelector('ytd-watch-flexy');
        elements.video = document.querySelector('ytd-watch-flexy #movie_player video, ytd-watch-flexy #movie_player audio.video-stream.html5-main-video');
        if (elements.ytdFlexy && elements.video) { } else return;
        elements.moviePlayer = elements.video.closest('#movie_player');
        if (!elements.moviePlayer) return;

        // resize Video
        let { ytdFlexy } = elements;
        if (!ytdFlexy.ElYTL) {
          ytdFlexy.ElYTL = 1;
          const ytdFlexyCnt = insp(ytdFlexy);
          if (typeof ytdFlexyCnt.calculateNormalPlayerSize_ === 'function') {
            ytdFlexyCnt.calculateNormalPlayerSize_ = core.resizeFunc(ytdFlexyCnt.calculateNormalPlayerSize_, 1);
          } else {
            console.warn('ytdFlexyCnt.calculateNormalPlayerSize_ is not a function.')
          }
          if (typeof ytdFlexyCnt.calculateCurrentPlayerSize_ === 'function') {
            ytdFlexyCnt.calculateCurrentPlayerSize_ = core.resizeFunc(ytdFlexyCnt.calculateCurrentPlayerSize_, 0);
          } else {
            console.warn('ytdFlexyCnt.calculateCurrentPlayerSize_ is not a function.')
          }
        }
        ytdFlexy = null;

        // when video is fetched
        elements.video.removeEventListener('canplay', core.triggerResizeDelayed, false);
        elements.video.addEventListener('canplay', core.triggerResizeDelayed, false);

        // when video is resized
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        if (typeof ResizeObserver === 'function') {
          resizeObserver = new ResizeObserver(core.triggerResizeDelayed);
          resizeObserver.observe(elements.moviePlayer);
        }

        // MutationObserver:[collapsed] @ ytd-live-chat-frame#chat
        if (attrObserver) {
          attrObserver.takeRecords();
          attrObserver.disconnect();
          attrObserver = null;
        }
        let chat = document.querySelector('ytd-watch-flexy ytd-live-chat-frame#chat');
        if (chat) {
          // resize due to DOM update
          attrObserver = new MutationObserver(core.triggerResizeDelayed);
          attrObserver.observe(chat, { attributes: true, attributeFilter: ["collapsed"] });
          chat = null;
        }

        // resize on idle
        Promise.resolve().then(core.triggerResizeDelayed);
      },
      resizeFunc(originalFunc, kb) {
        return function () {
          rid2++;
          if (!isHTMLAttrApplied) {
            isHTMLAttrApplied = true;
            Promise.resolve(0).then(() => {
              document.documentElement.classList.add('youtube-video-resize-fix');
            }).catch(console.warn);
          }
          if (document.fullscreenElement === null) {

            // calculateCurrentPlayerSize_ shall be always return NaN to make correct positioning of toolbars
            if (!kb) return { width: NaN, height: NaN };

            let ret = core.calculateSize();
            if (ret.height > 0 && ret.width > 0) {
              return ret;
            }
          }
          return originalFunc.apply(this, arguments);
        }
      },
      calculateSize_() {
        const { moviePlayer, video } = elements;
        const rect1 = { width: video.videoWidth, height: video.videoHeight }; // native values independent of css rules
        if (rect1.width > 0 && rect1.height > 0) {
          const rect2 = moviePlayer.getBoundingClientRect();
          const aspectRatio = rect1.width / rect1.height;
          let h2 = rect2.width / aspectRatio;
          let w2 = rect2.height * aspectRatio;
          return { rect2, h2, w2 };
        }
        return null;
      },
      calculateSize() {
        let rs = core.calculateSize_();
        if (!rs) return { width: NaN, height: NaN };
        const { rect2, h2, w2 } = rs;
        if (h2 > rect2.height) {
          return { width: w2, height: rect2.height };
        } else {
          return { width: rect2.width, height: h2 };
        }
      },
      triggerResizeDelayed: () => {
        rid2++;
        if (rid2 > 1e9) rid2 = 9;
        const tid = rid2;
        requestAnimationFrame(() => {
          if (tid !== rid2) return;
          const { ytdFlexy } = elements;
          let r = false;
          const ytdFlexyCnt = insp(ytdFlexy);
          const windowSize_ = ytdFlexyCnt.windowSize_;
          if (windowSize_ && typeof ytdFlexyCnt.onWindowResized_ === 'function') {
            try {
              ytdFlexyCnt.onWindowResized_(windowSize_);
              r = true;
            } catch (e) { }
          }
          if (!r) window.dispatchEvent(new Event('resize'));
        })
      }
    };
    core.begin();







    // YouTube Watch Page Reflect (WPR)



    // This script enhances the functionality of YouTube pages by reflecting changes in the page state.

    (async function youTubeWPR() {

      let checkPageVisibilityChanged = false;

      // A WeakSet to keep track of elements being monitored for mutations.
      const monitorWeakSet = new WeakSet();

      /** @type {globalThis.PromiseConstructor} */
      const Promise = (async () => { })().constructor;

      // Function to reflect the current state of the YouTube page.
      async function _reflect() {
        await Promise.resolve();

        const youtubeWpr = document.documentElement.getAttribute("youtube-wpr");
        let s = '';

        // Check if the current page is the video watch page.
        if (isWatchPageURL()) {
          let watch = document.querySelector("ytd-watch-flexy");
          let chat = document.querySelector("ytd-live-chat-frame#chat");

          if (watch) {
            // Determine the state of the chat and video player on the watch page and generate a state string.
            s += !chat ? 'h0' : (chat.hasAttribute('collapsed') || !document.querySelector('iframe#chatframe')) ? 'h1' : 'h2';
            s += watch.hasAttribute('is-two-columns_') ? 's' : 'S';
            s += watch.hasAttribute('fullscreen') ? 'F' : 'f';
            s += watch.hasAttribute('theater') ? 'T' : 't';
          }
        }

        // Update the reflected state if it has changed.
        if (s !== youtubeWpr) {
          document.documentElement.setAttribute("youtube-wpr", s);
        }

      }

      // Function to reflect changes in specific attributes of monitored elements.
      async function reflect(nodeName, attrNames, forced) {
        await Promise.resolve();

        if (!forced) {
          let skip = true;
          for (const attrName of attrNames) {
            if (nodeName === 'ytd-live-chat-frame') {
              if (attrName === 'collapsed') skip = false;
            } else if (nodeName === 'ytd-watch-flexy') {
              if (attrName === 'is-two-columns_') skip = false;
              else if (attrName === 'fullscreen') skip = false;
              else if (attrName === 'theater') skip = false;
            }
          }
          if (skip) return;
        }

        // Log the mutated element and its attributes.
        // console.log(nodeName, attrNames);

        // Call _reflect() to update the reflected state.
        _reflect();
      }

      // Callback function for the MutationObserver that tracks mutations in monitored elements.
      function callback(mutationsList) {
        const attrNames = new Set();
        let nodeName = null;
        for (const mutation of mutationsList) {
          if (nodeName === null && mutation.target) nodeName = mutation.target.nodeName.toLowerCase();
          attrNames.add(mutation.attributeName);
        }
        reflect(nodeName, attrNames, false);
      }

      function getParent(element) {
        return element.__shady_native_parentNode || element.__shady_parentNode || element.parentNode;
      }

      let lastPageTypeChanged = 0;
      function chatContainerMutationHandler() {
        if (Date.now() - lastPageTypeChanged < 800) _reflect();
      }

      // Function to start monitoring an element for mutations.
      function monitor(element) {
        if (!element) return;
        if (monitorWeakSet.has(element)) {
          return;
        }

        monitorWeakSet.add(element);

        const observer = new MutationObserver(callback);
        observer.observe(element, { attributes: true });

        if (element.id === 'chat') {
          const parentNode = getParent(element);
          if (parentNode instanceof Element && parentNode.id === 'chat-container' && !monitorWeakSet.has(parentNode)) {
            monitorWeakSet.add(parentNode);
            const observer = new MutationObserver(chatContainerMutationHandler);
            observer.observe(parentNode, { childList: true, subtree: false });
          }
        }

        return 1;
      }

      let timeout = 0;

      // Function to monitor relevant elements and update the reflected state.
      let g = async (forced) => {
        await Promise.resolve();
        let b = 0;
        b = b | monitor(document.querySelector("ytd-watch-flexy"));
        b = b | monitor(document.querySelector("ytd-live-chat-frame#chat"));
        if (b || forced) {
          _reflect();
        }
      }
      // let renderId = 0;
      // Event handler function that triggers when the page finishes navigation or page data updates.
      let eventHandlerFunc = async (evt) => {
        checkPageVisibilityChanged = true;
        timeout = Date.now() + 800;
        g(1);
        if (evt.type === 'yt-navigate-finish') {
          // delay required when page type is changed for #chat (home -> watch).
          setTimeout(() => {
            g(1);
          }, 80);
        } else if (evt.type === 'yt-page-type-changed') {
          lastPageTypeChanged = Date.now();
          // setTimeout(() => {
          //   if (renderId > 1e9) renderId = 9;
          //   const t = ++renderId;
          //   requestAnimationFrame(() => {
          //     if (t !== renderId) return;
          //     g(1);
          //   });
          // }, 180);
          if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
              g(1);
            });
          }
        }
      }

      let loadState = 0;

      // Function to initialize the script and start monitoring the page.
      async function actor() {
        if (loadState === 0) {
          if (!document.documentElement.hasAttribute("youtube-wpr")) {
            loadState = 1;
            document.documentElement.setAttribute("youtube-wpr", "");
            document.addEventListener("yt-navigate-finish", eventHandlerFunc, false);
            document.addEventListener("yt-page-data-updated", eventHandlerFunc, false);
            document.addEventListener("yt-page-type-changed", eventHandlerFunc, false);
          } else {
            loadState = -1;
            document.removeEventListener("yt-page-data-fetched", actor, false);
            return;
          }
        }
        if (loadState === 1) {
          timeout = Date.now() + 800;
          // Function to continuously monitor elements and update the reflected state.
          let pf = () => {
            g(0);
            if (Date.now() < timeout) requestAnimationFrame(pf);
          };
          pf();
        }
      }

      // Event listener that triggers when page data is fetched.
      document.addEventListener("yt-page-data-fetched", actor, false);

      // Update after visibility changed (looks like there are bugs due to inactive tab)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        if (checkPageVisibilityChanged) {
          checkPageVisibilityChanged = false;
          setTimeout(() => {
            g(1);
          }, 100);
          requestAnimationFrame(() => {
            g(1);
          });
        }
      }, false);


    })();

  });

})({ ResizeObserver });
 
// Re-add 'Subscriptions' tab from top of the left sidebar
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
 
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
 
    function restoreTrending() {
 
        var trendingData = {
            "navigationEndpoint": {
                "clickTrackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
                "commandMetadata": {
                    "webCommandMetadata": {
                        "url": "/feed/subscriptions",
                        "webPageType": "WEB_PAGE_TYPE_BROWSE",
                        "rootVe": 6827,
                        "apiUrl": "/youtubei/v1/browse"
                    }
                },
                "browseEndpoint": {
                    "browseId": "FEtrending"
                }
            },
            "icon": {
                "iconType": "SUBSCRIPTIONS"
            },
            "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "formattedTitle": {
                "simpleText": "Subscriptions"
            },
            "accessibility": {
                "accessibilityData": {
                    "label": "Subscriptions"
                }
            },
            "isPrimary": true
        };
 
        var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = trendingData;
 
    }
 
 
waitForElm("#items.ytd-guide-section-renderer").then((elm) => {
    restoreTrending();
});
