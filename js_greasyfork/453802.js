// ==UserScript==
// @name         YouTube - Revert UI changes before late-2022 (Non-Rounded Design)
// @version      6.0.6
// @description  This script will revert all UI changes prior to late 2022 (which disables rounded corners on everything and reverts 2019-2022 backgrounds.)
// @author       Magma_Craft
// @license MIT
// @match        https://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453802/YouTube%20-%20Revert%20UI%20changes%20before%20late-2022%20%28Non-Rounded%20Design%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453802/YouTube%20-%20Revert%20UI%20changes%20before%20late-2022%20%28Non-Rounded%20Design%29.meta.js
// ==/UserScript==
 
// Attributes to remove from <html>
const ATTRS = [
    "darker-dark-theme",
    "darker-dark-theme-deprecate",
    "refresh"
];
 
// Regular config keys.
const CONFIGS = {
    BUTTON_REWORK: true
}
 
// Experiment flags.
const EXPFLAGS = {
    enable_channel_page_header_profile_section: false,
    enable_header_channel_handler_ui: false,
    kevlar_unavailable_video_error_ui_client: false,
    kevlar_refresh_on_theme_change: false,
    kevlar_modern_sd_v2: false,
    kevlar_watch_cinematics: false,
    kevlar_watch_comments_panel_button: false,
    kevlar_watch_grid: false,
    kevlar_watch_grid_hide_chips: false,
    kevlar_watch_modern_panels: false,
    kevlar_watch_panel_height_matches_player: false,
    smartimation_background: false,
    web_amsterdam_playlists: false,
    web_animated_actions: false,
    web_animated_like: false,
    web_animated_like_lazy_load: false,
    web_button_rework: true,
    web_button_rework_with_live: true,
    web_darker_dark_theme: false,
    web_enable_youtab: false,
    web_guide_ui_refresh: false,
    web_modern_ads: false,
    web_modern_buttons: true,
    web_modern_chips: false,
    web_modern_collections_v2: false,
    web_modern_dialogs: false,
    web_modern_playlists: false,
    web_modern_subscribe: true,
    web_modern_tabs: false,
    web_modern_typography: false,
    web_rounded_containers: false,
    web_rounded_thumbnails: false,
    web_searchbar_style: "default",
    web_segmented_like_dislike_button: false,
    web_sheets_ui_refresh: false,
    web_snackbar_ui_refresh: false,
    web_watch_rounded_player_large: false,
    // Extra additions to remove the watch grid UI
    web_player_enable_featured_product_banner_exclusives_on_desktop: false,
    kevlar_watch_comments_panel_button: false,
    fill_view_models_on_web_vod: true,
    kevlar_watch_flexy_metadata_height: "136",
    kevlar_watch_max_player_width: "1280",
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
    wn_grid_min_item_width: 0
}
 
// Player flags
// !!! USE STRINGS FOR VALUES !!!
// For example: "true" instead of true
const PLYRFLAGS = {
    web_rounded_containers: "false",
    web_rounded_thumbnails: "false"
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
/* Revert old background color and buttons */
html[dark] { --yt-spec-general-background-a: #181818 !important; --yt-spec-general-background-b: #0f0f0f !important; --yt-spec-brand-background-primary: rgba(33, 33, 33, 0.98) !important; --yt-spec-10-percent-layer: rgba(255, 255, 255, 0.1) !important }
html:not([dark]) { --yt-spec-general-background-a: #f9f9f9 !important; --yt-spec-general-background-b: #f1f1f1 !important; --yt-spec-brand-background-primary: rgba(255, 255, 255, 0.98) !important; --yt-spec-10-percent-layer: rgba(0, 0, 0, 0.1) !important }
ytd-watch-flexy { --ytd-watch-flexy-non-player-height: calc(var(--ytd-watch-flexy-masthead-height) + var(--ytd-margin-6x) + var(--ytd-watch-flexy-space-below-player)); --ytd-watch-flexy-non-player-width: calc(var(--ytd-watch-flexy-sidebar-width) + var(--ytd-margin-6x)*3); --ytd-watch-flexy-min-player-height: 240px; --ytd-watch-flexy-min-player-width: calc(var(--ytd-watch-flexy-min-player-height)*(var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))); --ytd-watch-flexy-max-player-height: calc(100vh - var(--ytd-watch-flexy-masthead-height) - var(--ytd-margin-6x) - var(--ytd-watch-flexy-space-below-player)); --ytd-watch-flexy-max-player-width: calc((100vh - var(--ytd-watch-flexy-masthead-height) - var(--ytd-margin-6x) - var(--ytd-watch-flexy-space-below-player))*(var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))) }
ytd-masthead { background: var(--yt-spec-brand-background-solid) !important }
ytd-app { background: var(--yt-spec-general-background-a) !important }
ytd-browse[page-subtype="channels"] { background: var(--yt-spec-general-background-b) !important }
ytd-c4-tabbed-header-renderer { --yt-lightsource-section1-color: var(--yt-spec-general-background-a) !important }
#page-header.ytd-tabbed-page-header, #tabs-inner-container.ytd-tabbed-page-header { background: var(--yt-spec-general-background-a) !important }
#tabs-divider.ytd-c4-tabbed-header-renderer, #tabs-divider.ytd-tabbed-page-header { border-bottom: 0 !important }
ytd-mini-guide-renderer, ytd-mini-guide-entry-renderer { background-color: var(--yt-spec-brand-background-solid) !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope { background-color: var(--yt-spec-brand-background-solid) !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope:hover { background-color: var(--yt-spec-general-background-b) !important }
#cinematics.ytd-watch-flexy { display: none !important }
#header.ytd-rich-grid-renderer { width: 100% !important }
[page-subtype="home"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer { background-color: var(--yt-spec-brand-background-primary) !important; border-top: 1px solid var(--yt-spec-10-percent-layer) !important; border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important }
ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer::after { background: linear-gradient(to right, var(--yt-spec-brand-background-primary) 20%, rgba(33, 33, 33, 0) 80%) !important }
ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer::before { background: linear-gradient(to left, var(--yt-spec-brand-background-primary) 20%, rgba(33, 33, 33, 0) 80%) !important }
ytd-feed-filter-chip-bar-renderer #left-arrow-button.ytd-feed-filter-chip-bar-renderer, ytd-feed-filter-chip-bar-renderer #right-arrow-button.ytd-feed-filter-chip-bar-renderer { background-color: var(--yt-spec-brand-background-primary) !important }
yt-chip-cloud-renderer[is-dark-theme] #right-arrow.yt-chip-cloud-renderer::before { background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important }
yt-chip-cloud-renderer #left-arrow-button.yt-chip-cloud-renderer, yt-chip-cloud-renderer #right-arrow-button.yt-chip-cloud-renderer { background: var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) !important }
yt-chip-cloud-renderer[is-dark-theme] #left-arrow.yt-chip-cloud-renderer::after { background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important }
yt-chip-cloud-renderer #left-arrow.yt-chip-cloud-renderer::after { background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important }
yt-chip-cloud-renderer #right-arrow.yt-chip-cloud-renderer::before { background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important }
ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_HASHTAG_LANDING_PAGE"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer, ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer { background-color: var(--yt-spec-general-background-b) !important }
yt-chip-cloud-chip-renderer { height: 32px !important; border-radius: 16px !important }
#chip-container.yt-chip-cloud-chip-renderer, yt-chip-cloud-chip-renderer[chip-style=STYLE_HOME_FILTER] #chip-container.yt-chip-cloud-chip-renderer, .ytChipShapeActive, .ytChipShapeInactive { height: 32px; border-radius: 16px !important; border: 1px solid var(--yt-spec-10-percent-layer) !important; box-sizing: border-box !important }
/* Remove rounded corners on buttons and boxes */
#container.ytd-searchbox, .ytSearchboxComponentInputBox { background-color: var(--ytd-searchbox-background) !important; border-radius: 2px 0 0 2px !important; box-shadow: inset 0 1px 2px var(--ytd-searchbox-legacy-border-shadow-color) !important; color: var(--ytd-searchbox-text-color) !important; padding: 2px 6px !important }
ytd-searchbox[desktop-searchbar-style="rounded_corner_dark_btn"] #searchbox-button.ytd-searchbox { display: none !important }
ytd-searchbox[desktop-searchbar-style="rounded_corner_light_btn"] #searchbox-button.ytd-searchbox { display: none !important }
#search[has-focus] #search-input, .ytSearchboxComponentInputBoxHasFocus input { margin-left: 32px !important }
#search-icon-legacy.ytd-searchbox, .ytSearchboxComponentSearchButton { display: block !important; border-radius: 0 2px 2px 0 !important }
.ytSearchboxComponentSuggestionsContainer { top: 48px }
.sbsb_a, .ytSearchboxComponentSuggestionsContainer { border-radius: 2px !important }
.sbsb_c, .ytSearchboxComponentInnerSearchIcon { padding-left: 10px !important }
.ytSuggestionComponentIcon { margin-left: -4px !important; margin-right: 8px !important }
div.sbqs_c::before { margin-right: 10px !important }
ytd-searchbox[has-focus] #search-icon.ytd-searchbox { padding-left: 10px !important; padding-right: 10px !important }
#voice-search-button.ytd-masthead { background-color: var(--yt-spec-general-background-a) !important; margin-left: 4px !important }
button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-only-default[aria-label="Clear search query"] > div.yt-spec-button-shape-next__icon > yt-icon { width: 20px !important; height: 20px !important; margin-top: 2px !important; margin-left: 2px !important }
.ytSearchboxComponentDesktop .ytSearchboxComponentClearButtonIcon { width: 20px !important; height: 20px !important }
.ytSuggestionComponentRoundedSuggestion { height: 32px !important; border-radius: 0 !important; margin: 0 !important }
.ytSuggestionComponentThumbnailContainer, .ytSuggestionComponentNewVideoContainer, .ytSuggestionComponentvisualSuggestThumbnail { display: none !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Remove"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="取り除く"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="Usunąć"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="Alisin"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="Retirer"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="Eliminar"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="Remover"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="Удалять"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="Távolítsa el"], .ytSuggestionComponentRemoveLinkClearButton[aria-label="Verwijderen"] { visibility: hidden !important }
.ytSuggestionComponentRemoveLinkClearButton::before { font-family: "Roboto", "sans-serif" !important; color: var(--yt-spec-call-to-action) !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Remove"]::before { content: "Remove"; font-family: "Roboto", "sans-serif" !important; color: var(--yt-spec-call-to-action) !important; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="取り除く"]::before { content: "取り除く"; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Usunąć"]::before { content: "Usunąć"; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Alisin"]::before { content: "Alisin"; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Retirer"]::before { content: "Retirer"; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Eliminar"]::before { content: "Eliminar"; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Remover"]::before { content: "Remover"; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Удалять"]::before { content: "Удалять"; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Távolítsa el"]::before { content: "Távolítsa el"; visibility: visible !important }
.ytSuggestionComponentRemoveLinkClearButton[aria-label="Verwijderen"]::before { content: "Verwijderen"; visibility: visible !important }
#guide-content.ytd-app { background: var(--yt-spec-brand-background-solid) !important }
yt-interaction.ytd-guide-entry-renderer, ytd-guide-entry-renderer, ytd-guide-entry-renderer[guide-refresh], ytd-mini-guide-entry-renderer, ytd-guide-entry-renderer[active], .style-scope.ytd-guide-entry-renderer:hover, tp-yt-paper-item.style-scope.ytd-guide-entry-renderer { border-radius: 0 !important }
ytd-guide-entry-renderer[guide-refresh] { width: 100% !important }
ytd-mini-guide-renderer[guide-refresh] { padding: 0 !important }
a#endpoint.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer { margin: 0 !important }
tp-yt-paper-item.ytd-guide-entry-renderer { --paper-item-focused-before-border-radius: 0 !important }
ytd-guide-section-renderer.style-scope.ytd-guide-renderer { padding-left: 0 !important }
tp-yt-paper-item.style-scope.ytd-guide-entry-renderer { padding-left: 24px !important }
#guide-section-title.ytd-guide-section-renderer { color: var(--yt-spec-text-secondary) !important; padding: 8px 24px !important; font-size: var(--ytd-tab-system-font-size) !important; font-weight: var(--ytd-tab-system-font-weight) !important; letter-spacing: var(--ytd-tab-system-letter-spacing) !important; text-transform: var(--ytd-tab-system-text-transform) !important }
.style-scope.ytd-rich-item-renderer { border-radius: 2px !important }
.style-scope.ytd-item-section-renderer { border-radius: 0 !important }
#tooltip.tp-yt-paper-tooltip { border-radius: 2px !important }
div.style-scope.yt-tooltip-renderer { border-radius: 0 !important }
.style-scope.ytd-topic-link-renderer { border-radius: 2px !important }
.style-scope.yt-formatted-string, .bold.style-scope.yt-formatted-string { font-family: Roboto !important }
#bar { border-radius: 2px !important }
ytd-multi-page-menu-renderer { border-radius: 0 !important; border: 1px solid var(--yt-spec-10-percent-layer) !important; border-top: none !important; box-shadow: none !important }
yt-dropdown-menu { --paper-menu-button-content-border-radius: 2px !important }
ytd-menu-popup-renderer { border-radius: 2px !important }
.style-scope.ytd-shared-post-renderer, div#repost-context.style-scope.ytd-shared-post-renderer, ytd-post-renderer.style-scope.ytd-shared-post-renderer { border-radius: 0 !important }
div#dismissed.style-scope.ytd-compact-video-renderer { border-radius: 0 !important }
.style-scope.ytd-feed-nudge-renderer, .style-scope.ytd-inline-survey-renderer { border-radius: 2px !important }
.style-scope.ytd-brand-video-shelf-renderer, div#dismissible.style-scope.ytd-brand-video-singleton-renderer, #inline-survey-compact-video-renderer { border-radius: 0 !important }
tp-yt-paper-button#button.style-scope.ytd-button-renderer.style-inactive-outline.size-default { border-radius: 2px !important }
div#dismissed.style-scope.ytd-rich-grid-media { border-radius: 0 !important }
ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before, ytd-thumbnail[size="medium"] a.ytd-thumbnail, ytd-thumbnail[size="medium"]::before, .ShortsLockupViewModelHostThumbnailContainerRounded { border-radius: 0 !important }
ytd-playlist-thumbnail[size="medium"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="medium"]::before, ytd-playlist-thumbnail[size="large"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="large"]::before { border-radius: 0 !important }
.collections-stack-wiz__collection-stack1--medium, .collections-stack-wiz__collection-stack2, .yt-thumbnail-view-model--medium, .ytThumbnailViewModelMedium, .ytThumbnailViewModelLarge, .ytCollectionsStackCollectionStack1Medium, .ytCollectionsStackCollectionStack2, .ytContentPreviewImageViewModelLargeRoundedImage { border-radius: 0 !important }
ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer { border-radius: 0 !important }
ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail { border-radius: 2px !important }
#title.ytd-settings-sidebar-renderer { font-family: Roboto !important; font-weight: 500 !important; font-size: 1.6rem !important; text-transform: uppercase !important }
ytd-compact-link-renderer.ytd-settings-sidebar-renderer { margin: 0 !important; border-radius: 0 !important }
ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar][active] { border-radius: 0 !important }
tp-yt-paper-item.style-scope.ytd-compact-link-renderer::before { border-radius: 0 !important }
ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar] tp-yt-paper-item.ytd-compact-link-renderer { padding-left: 24px !important; padding-right: 24px !important }
img#img.style-scope.yt-image-shadow { border-radius: 50px !important }
#title.style-scope.ytd-feed-nudge-renderer { font-family: Roboto !important }
yt-chip-cloud-chip-renderer.style-scope.ytd-feed-nudge-renderer { border-radius: 50px !important }
div#label-container.style-scope.ytd-thumbnail-overlay-toggle-button-renderer { border: 2px !important; text-transform: uppercase !important }
ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail { border-radius: 2px !important }
ytd-backstage-post-dialog-renderer { border-radius: 2px !important }
yt-bubble-hint-renderer { border-radius: 2px !important }
div#title.text-shell.skeleton-bg-color, div#count.text-shell.skeleton-bg-color, div#owner-name.text-shell.skeleton-bg-color, div#published-date.text-shell.skeleton-bg-color, div.rich-video-title.text-shell.skeleton-bg-color, div.rich-video-meta.text-shell.skeleton-bg-color { border-radius: 2px !important }
div#subscribe-button.skeleton-bg-color { border-radius: 4px !important }
div.rich-thumbnail.skeleton-bg-color { border-radius: 0 !important }
#home-chips { border-top: 1px solid !important; border-bottom: 1px solid !important; border-top-color: var(--yt-spec-10-percent-layer) !important; border-bottom-color: var(--yt-spec-10-percent-layer) !important; padding: 0 !important }
#home-container-media { padding-top: 18px !important; margin-top: 0 !important }
#home-page-skeleton .rich-thumbnail, #home-page-skeleton .rich-thumbnail::before { border-radius: 0 !important }
ytd-masthead.shell, #guide-skeleton, #home-chips { background: var(--yt-spec-brand-background-primary) !important }
#home-container-skeleton { background-color: var(--yt-spec-general-background-a) !important }
.yt-spec-button-shape-next--icon-only-default {background-color: transparent !important }
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after { width: 0 !important; margin-left: 8px !important }
dislike-button-view-model { padding-left: 8px !important }
ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer a, ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer button, #channel-header-container #meta ~ #buttons ytd-button-renderer a, #channel-header-container #meta ~ #buttons ytd-button-renderer button { height: 37px !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px; background: var(--yt-spec-call-to-action) !important; border: 1px solid #075cd3 !important; color: #fff !important }
[dark] #subscribe-button ytd-button-renderer a, [dark] ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer a, [dark] ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer button, [dark] #channel-header-container #meta ~ #buttons ytd-button-renderer a, [dark] #channel-header-container #meta ~ #buttons ytd-button-renderer button { height: 37px !important; background: var(--yt-spec-call-to-action) !important; border: 1px solid #3ea6ff !important; color: #fff !important }
#subscribe-button ytd-button-renderer a, ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer a, ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer button, #channel-header-container #meta ~ #buttons ytd-button-renderer a, #channel-header-container #meta ~ #buttons ytd-button-renderer button { height: 37px !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px; background: var(--yt-spec-call-to-action) !important; border: 0 !important; color: #fff !important }
#edit-buttons ytd-button-renderer a, #edit-buttons ytd-button-renderer button { height: 37px !important; letter-spacing: 0.5px; background: var(--yt-spec-call-to-action) !important; border: 1px solid #075cd3 !important; color: #fff !important }
[dark] #edit-buttons ytd-button-renderer a, [dark] #edit-buttons ytd-button-renderer button { height: 37px !important; background: var(--yt-spec-call-to-action) !important; border: 1px solid #3ea6ff !important; color: #fff !important }
#sponsor-button ytd-button-renderer button { height: 37px !important; border-radius: 2px !important; text-transform: uppercase !important }
yt-button-shape.style-scope.ytd-subscribe-button-renderer { display: flex !important }
#subscribe-button ytd-subscribe-button-renderer button { height: 37px !important; letter-spacing: 0.5px !important; border-radius: 2px !important; text-transform: uppercase !important }
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled { color: #fff !important; background: var(--yt-spec-brand-button-background) !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important }
button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m { height: 37px !important; letter-spacing: 0.5px !important; border-radius: 2px !important; text-transform: uppercase !important }
#subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal { background-color: var(--yt-spec-badge-chip-background) !important; color: var(--yt-spec-text-secondary) !important }
button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-s { background-color: var(--yt-spec-badge-chip-background) !important; color: var(--yt-spec-text-secondary) !important; height: 25px !important; letter-spacing: 0.5px !important; border-radius: 2px !important; text-transform: uppercase !important }
div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m { background-color: transparent !important; border-radius: 16px !important; padding-left: 14px !important; padding-right: 2px !important; margin-left: 4px !important }
#subscribe-button.ytd-channel-renderer a.yt-spec-button-shape-next.yt-spec-button-shape-next--filled.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m { background: var(--yt-spec-brand-button-background) !important }
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subscribe"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Pratite kanal"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Teken in"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="kanalina abun? olun"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Langgan"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Pretplatite se na kanal"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subscriu-te al canal"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="se k"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonner på"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="abonnieren."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Telli"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Suscribirse"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Suscribirme"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Harpidetu"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Mag-subscribe sa"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="S'abonner à"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subscribirse"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Bhalisesla"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Prihlásit sa na odber kanála"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Hefja áskrift að"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Iscriviti"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Fuatilia"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonet kanalu"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Prenumeruoti"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Feliratkozás"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonneren op"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Obuna qiling"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonohu në"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Ðang ký"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="alina abone ol."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?????????? ?? ?????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?????????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="???????? ?????????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="???????? ??????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??????????? ?? ??"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="????????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="???????? ???????? ?? ?????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??????? ?????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??????????? ?? ?????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subscrever"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Inscreva-se em"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Aboneaza-te la"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Prenumerera på"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="????? ?????? ?????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?? ???????? ?????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="????? ???????? ?? ????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="????? ??? ??"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?? ??????? ?????????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?? ???????? ????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?? ????? ????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="? ????? ????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="? ??????????? ?????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??? ????????? ????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?? ??????????? ???."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?????????????? ??????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??????? ?????????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="????????????? ??????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?? ???????????? ????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="???? ?????????? ????????????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??? ???? ????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="???? ???????????????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="????????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="??????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="????????"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="?(?) ?????."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Tilaa"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subskrybuj kanal"] { border-color: var(--yt-spec-brand-button-background) !important; background: var(--yt-spec-brand-button-background) !important; color: #ffffff !important}
div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.cbox.yt-spec-button-shape-next--button-text-content, div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.yt-spec-button-shape-next__secondary-icon, button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing > div.yt-spec-button-shape-next__button-text-content { display: none !important }
#notification-preference-toggle-button:not([hidden]) + yt-animated-action #notification-preference-button.ytd-subscribe-button-renderer[invisible], #subscribe-button-shape.ytd-subscribe-button-renderer[invisible] { pointer-events: auto !important; visibility: visible !important; position: static !important }
yt-smartimation.ytd-subscribe-button-renderer, .smartimation__content > __slot-el { display: flex !important; flex-direction: row !important }
/*join/joined button */
#sponsor-button ytd-button-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal, #channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Join this channel"], button.yt-spec-button-shape-next.yt-spec-button-shape-next--outline.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m[aria-label="Join this channel"] { height: 37px !important; background: /*rgb(7,92,211,0.1)*/ transparent !important; color: var(--yt-spec-call-to-action) !important; border: 1px solid var(--yt-spec-call-to-action) !important; padding-left: 18px !important; padding-right: 18px !important }
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Join this channel"], button.yt-spec-button-shape-next.yt-spec-button-shape-next--outline.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m[aria-label="Join this channel"] { padding-left: 18px !important; padding-right: 18px !important }
div#sponsor-button.channel-action.style-scope.ytd-c4-tabbed-header-renderer { margin-left: 0 !important; margin-right: 8px !important }
 
.yt-spec-button-shape-next--size-m { border-radius: 2px !important }
 
ytd-watch-metadata ytd-video-owner-renderer #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal,
#channel-header-container #meta ~ #buttons #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal
{ background: rgba(0,0,0,0.1) !important; color: #000 !important; border: none !important }
 
[dark] ytd-watch-metadata ytd-video-owner-renderer #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal,
[dark] #channel-header-container #meta ~ #buttons #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal
{ background: rgba(255,255,255,0.1) !important; color: #aaa !important; border: none !important }
 
/**/
 
/**/
ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal { background: transparent !important; color: var(--yt-spec-icon-inactive) !important }
ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover, #info .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover { /*background: rgba(0,0,0,0.1) !important;*/ }
[dark] ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover, [dark] #info .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover { /*background: rgba(255,255,255,0.1) !important;*/ }
/**/
ytd-watch-metadata ytd-menu-renderer button, ytd-button-renderer yt-button-shape button { border-radius: 0 !important }
ytd-watch-metadata ytd-toggle-button-renderer tp-yt-paper-tooltip #tooltip, #info ytd-button-renderer tp-yt-paper-tooltip #tooltip { width: max-content }
ytd-watch-metadata #top-level-buttons-computed  button { padding: 0 12px; text-transform: uppercase }
ytd-watch-metadata #top-level-buttons-computed ytd-button-renderer button { padding: 0 8px; text-transform: uppercase }
ytd-watch-metadata #top-level-buttons-computed > *:not(:first-child) { margin: 0 0 0 8px }
ytd-watch-metadata #flexible-item-buttons > * { margin-left: 8px }
ytd-watch-metadata #flexible-item-buttons  button { padding: 0 8px; text-transform: uppercase }
ytd-segmented-like-dislike-button-renderer button { padding: 0 12px !important }
ytd-watch-metadata ytd-menu-renderer > #button-shape { margin-left: 8px !important }
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--outline { height: 37px !important; padding: 0 11px 0 11px !important; background: transparent !important; border-color: var(--yt-spec-call-to-action) !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important }
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--outline .yt-spec-button-shape-next__icon { margin-left: 0 !important; margin-right: 0 !important }
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--outline div.yt-spec-button-shape-next__button-text-content { height: 34px !important; margin-left: 8px !important }
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--outline { height: 37px !important; border-color: var(--yt-spec-call-to-action) !important; color: #3ea6ff !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important }
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled { height: 37px !important; color: #fff; background: var(--yt-spec-brand-button-background) !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important }
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--filled { border-radius: 2px !important; text-transform: uppercase !important }
.yt-spec-button-shape-next--size-s.yt-spec-button-shape-next--icon-button > div.yt-spec-button-shape-next__icon, .yt-spec-button-shape-next--size-s.yt-spec-button-shape-next--icon-button > div.yt-spec-button-shape-next__icon > yt-icon { width: 18px !important; height: 18px !important; color: var(--yt-spec-icon-inactive) !important }
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal { background: var(--yt-spec-badge-chip-background) !important; text-transform: uppercase !important }
ytd-comments .yt-core-attributed-string--white-space-no-wrap, ytd-comments yt-dropdown-menu[modern-buttons] #label.yt-dropdown-menu, ytd-comments yt-dropdown-menu[modern-buttons] #icon-label.yt-dropdown-menu { letter-spacing: 0.5px !important; text-transform: uppercase !important }
ytd-comments#comments #replies #expander .more-button button > .yt-spec-button-shape-next__button-text-content > span.yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap, ytd-comments#comments #replies #expander .less-button button > .yt-spec-button-shape-next__button-text-content > span.yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap { text-transform: none !important }
[dark] #end.ytd-masthead .yt-spec-button-shape-next__button-text-content { margin-top: 2px !important }
#channel-name.ytd-video-owner-renderer { font-size: 1.4rem !important; line-height: 2rem !important }
#info.ytd-video-primary-info-renderer { height: 40px !important }
ytd-merch-shelf-renderer { background-color: transparent !important }
div#clarify-box.attached-message.style-scope.ytd-watch-flexy { margin-top: 0 !important }
ytd-clarification-renderer.style-scope.ytd-item-section-renderer, ytd-clarification-renderer.style-scope.ytd-watch-flexy, ytd-info-panel-container-renderer[rounded-container] { border: 1px solid !important; border-color: #0000001a !important; border-radius: 0 !important }
ytd-info-panel-container-renderer[rounded-container][has-title] .header.ytd-info-panel-container-renderer, ytd-info-panel-content-renderer[rounded-container] { border-radius: 0 !important }
yt-formatted-string.description.style-scope.ytd-clarification-renderer { font-size: 1.4rem !important }
div.content-title.style-scope.ytd-clarification-renderer { padding-bottom: 4px !important }
ytd-watch-flexy[rounded-player-large]:not([fullscreen]):not([theater]) #ytd-player.ytd-watch-flexy, ytd-watch-flexy[rounded-player] #ytd-player.ytd-watch-flexy { border-radius: 0 !important }
ytd-rich-metadata-renderer[rounded] { border-radius: 0 !important }
ytd-live-chat-frame[rounded-container], ytd-live-chat-frame[rounded-container] #show-hide-button.ytd-live-chat-frame ytd-toggle-button-renderer.ytd-live-chat-frame, iframe.style-scope.ytd-live-chat-frame { border-radius: 0 !important }
ytd-toggle-button-renderer.style-scope.ytd-live-chat-frame, yt-live-chat-header-renderer.style-scope.yt-live-chat-renderer { background: var(--yt-spec-brand-background-solid) !important }
ytd-toggle-button-renderer.style-scope.ytd-live-chat-frame > a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer > tp-yt-paper-button.style-scope.ytd-toggle-button-renderer { padding-top: 4px !important; padding-bottom: 4px !important }
ytd-live-chat-frame #show-hide-button.ytd-live-chat-frame>ytd-button-renderer.ytd-live-chat-frame { margin: 0 !important }
ytd-live-chat-frame button { height: 31px !important }
ytd-live-chat-frame .yt-spec-button-shape-next--size-m { color: var(--yt-live-chat-secondary-text-color) !important; font-size: 11px !important }
ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer, ytd-tvfilm-offer-module-renderer[modern-panels], ytd-donation-shelf-renderer.style-scope.ytd-watch-flexy, ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]) { border-radius: 0 !important }
ytd-playlist-panel-renderer[modern-panels]:not([hide-header-text]) .title.ytd-playlist-panel-renderer { font-family: Roboto !important; font-size: 1.4rem !important; line-height: 2rem !important; font-weight: 500 !important }
ytd-tvfilm-offer-module-renderer[modern-panels] #header.ytd-tvfilm-offer-module-renderer, ytd-engagement-panel-title-header-renderer[modern-panels]:not([ads-semantic-text]) #title-text.ytd-engagement-panel-title-header-renderer { border-radius: 0 !important; font-family: Roboto !important; font-size: 1.6rem !important; line-height: 2.2rem !important; font-weight: 400 !important }
ytd-donation-shelf-renderer[modern-panels] #header-text.ytd-donation-shelf-renderer { font-family: Roboto !important; font-size: 1.6rem !important; font-weight: 500 !important }
ytd-universal-watch-card-renderer[rounded] #header.ytd-universal-watch-card-renderer, ytd-universal-watch-card-renderer[rounded] #hero.ytd-universal-watch-card-renderer { border-radius: 0 !important }
ytd-video-view-count-renderer { font-size: 1.4rem !important }
#upload-info.ytd-video-owner-renderer { margin-left: 4px !important }
div#actions.item.style-scope.ytd-watch-metadata { height: 40px !important }
ytd-segmented-like-dislike-button-renderer { height: 36px !important }
ytd-post-renderer[rounded-container] { border-radius: 0 !important }
/* Remove rounded corners from the video player (Thanks to oldbutgoldyt for the code) */
.ytp-ad-player-overlay-flyout-cta-rounded { border-radius: 2px !important }
.ytp-flyout-cta .ytp-flyout-cta-action-button.ytp-flyout-cta-action-button-rounded { font-family: Arial !important; background: #167ac6 !important; border: solid 1px transparent !important; border-color: #167ac6 !important; border-radius: 2px !important; box-shadow: 0 1px 0 rgba(0,0,0,.05) !important; font-size: 11px !important; font-weight: 500 !important; height: 28px !important; margin: 0 8px 0 0 !important; max-width: 140px !important; padding: 0 10px !important }
.ytp-ad-action-interstitial-action-button.ytp-ad-action-interstitial-action-button-rounded { background-color: #167ac6 !important; border: none !important; border-radius: 2px; font-family: Roboto !important; font-size: 23px !important; height: 46px !important; line-height: 46px !important; min-width: 164px !important; padding: 0 20px !important }
.ytp-settings-menu { border-radius: 2px !important }
.ytp-sb-subscribe { border-radius: 2px !important; background-color: #f00 !important; color: #fff !important; text-transform: uppercase !important }
.ytp-sb-unsubscribe { border-radius: 2px !important; background-color: #eee !important; color: #606060 !important; text-transform: uppercase !important }
.ytp-sb-subscribe.ytp-sb-disabled { background-color: #f3908b !important }
.branding-context-container-inner.ytp-rounded-branding-context { border-radius: 2px !important }
.ytp-tooltip.ytp-rounded-tooltip:not(.ytp-preview) .ytp-tooltip-text { border-radius: 2px !important }
.ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-button-rounded { border-radius: 2px !important }
.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-overlay-image img, .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-text-overlay, .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-enhanced-overlay { border-radius: 0 !important }
.ytp-videowall-still-image { border-radius: 0 !important }
div.iv-card.iv-card-video.ytp-rounded-info { border-radius: 0 !important }
div.iv-card.iv-card-playlist.ytp-rounded-info { border-radius: 0 !important }
div.iv-card.iv-card-channel.ytp-rounded-info { border-radius: 0 !important }
div.iv-card.ytp-rounded-info { border-radius: 0 !important }
.ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview, .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg { border-radius: 2px !important }
.ytp-ce-video.ytp-ce-medium-round, .ytp-ce-playlist.ytp-ce-medium-round, .ytp-ce-medium-round .ytp-ce-expanding-overlay-background { border-radius: 0 !important }
.ytp-autonav-endscreen-upnext-thumbnail { border-radius: 0 !important }
@font-face { font-family: no-parens; src: url("data:application/x-font-woff;base64,d09GRk9UVE8AABuoAAoAAAAASrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAAANJAAADlwAABk8NN4INERTSUcAABugAAAACAAAAAgAAAABT1MvMgAAAVAAAABRAAAAYABfsZtjbWFwAAAEQAAACM0AABnoJENu0WhlYWQAAAD0AAAAMwAAADYFl9tDaGhlYQAAASgAAAAeAAAAJAdaA+9obXR4AAAbgAAAAB8AABAGA+gAfG1heHAAAAFIAAAABgAAAAYIAVAAbmFtZQAAAaQAAAKbAAAF6yBNB5Jwb3N0AAANEAAAABMAAAAg/7gAMnjaY2BkYGBg5G6tPXx8azy/zVcGZuYXQBGGiz6un+F0zf8O5hzmAiCXmYEJJAoAkoQNcAB42mNgZGBgLvjfASRfMNQw1DDnMABFUAATAHAaBFEAAAAAUAAIAQAAeNpjYGZ+wTiBgZWBgamLKYKBgcEbQjPGMRgx3GFAAt//r/v/+/7///wPGOxBfEcXJ38GBwaG//+ZC/53MDAwFzBUJOgz/kfSosDAAAAMpBWaAAAAeNqdU9tu00AQPU6TcqmoRIV46YvFE5Vgm7ZOVDVPSS8iIkqquBTxhJzEuSiOHWwnwH8g/oHfgW9A/AZnx5smQZWg2MrumZ0z47MzEwCP8R0W9GNhS1b95HCPVoY3sIsdg/MrnAJO8NLgTTzEgEwr/4DWF3ww2MJTq2BwDtvWrsEbKFt7BudXOAWk1nuDN/HE+mHwfTjWL4O34OQWeR7lvuZaBm/Dyf+s9qKOb9cCLxy3/cEs8OIDVXRKlepZrVURp/hot2rn136cjKLQziiXrgHDKO1G4Vxb6viwMvHGfpT2VTDqHKqSKh85xfIyE04RYYrPiDFiCYZIYeMbf4co4gBHeHGDS0RV9MjvwCd2GZWQ72PC3UYdIbr0xsynV098PXqeS96U5yfY5/tRXkXGIpuSyAl9e8SrX6khIC/EGG3aA8zEjqlHUZVDVRXyz8hrCVpELuMyf4sn57imJ6baEVkhs69mueSN1k+GZKWiLMT8xqdwzIpUqNZjdl84fZ4GzNqhRzFWoczaOWSXb9X0P3X89xqmzDjlyT6uGDWSrBdyi1S+F1FvymhdR60gY2j9XdohraxvM+KeVMwmf2jU1tHg3pIvhGuZG2sZ9OTcVm/9s++krCd7KjPaoarFXGU5PVmfsaauVM8l1nNTFa2u6HhLdIVXVP2Gu7arnKc21ybtOifDlTu1uZ5yb3Ji6uLROPNdyPw38Y77a3o0R+f2qSqrTizWJ1ZGq09EeySnI/ZlKhXWypXc1Zcb3r2uNmsUrfUkkZguWX1h2mbO9L/F45r1YioKJ1LLRUcSU7+e6f9E7qInbukfEM0lNuSpzmpzviLmjmVGMk26c5miv3VV/THJCRXrzk55ltCrtQXc9R0H9OvKN34D31P2fwB42i3YLfAsS2GG8X9Pf3dP97QjqOBAUAUOHDhwxAUHLnHgwIEDBw4cOHDgEgeOuIsjLnHgAMU1tw7PnvNs1fT7zlfV7q9rd2bn7e0tv729RZYvsySWb76Ft9fr82wN77fHt/F+e3m73+8J74/8zPsxvdbqu3fvXjsYg2e/P/LTP33f367PfMj67sPZjXjsh/iU/V+If7W/Tvms/XPEF+xfJL5kf73lr9i/SnzN/nXiG/Z/I/7d/k3iW/ZvE/9h/0/iO/bvEt+zf5/4gf2HxI/sPyZ+Yn99xJ/Zf078wv5L4lf2XxO/sf+W+C/7fxO/s/+e+IP9f4iP7H8k/mT/f+LP9r8Qf7X/jfiH/WPik48+9E/Y8e4Tpvjv72cl6B/wD/oH/IP+Af+gf8A/6B/wD/oH/IP+Af+gf8A/6B/wD/oH/IP+Af+gf8A/6B/wD/oH/IP+Af+gf8A/6B/wD/oH/IP+Af+gf8A/6B/wD/oH/IP+Af+gf8A/6B/wD/oH/IP+4X8Z/8/OXATnIjAXwbkIkAfnIjAX4eVPv15fA/0v/C/9L/wv/S/8L/1fX5lL/wv/S/8L/0v/C/9L/wv/S/8L/0v/C/9L/wv/S/8L/0v/C/9L/wv/S/8L/0v/C/9L/wv/S/8L/0v/C/9L/wv/S/8L/0v/C/9L/wv/S/8L/0v/C/9L/wv/S/8L/0v/C/9L/wv/S/8L/0v/C/9L/9cvXNQ/4h/1j/hH/SP+Uf+If9Q/4h/1j/hH/SP+Uf+If9Q/4h/1j/hH/SP+Uf+If9Q/4h/1j/hH/SP+Uf+If9Q/4h/1j/hH/SP+Uf+If9Q/4h/1j/hH/SP+Uf+If9Q/4h/1j/hH/SP+Uf+If9Q/4h/1j/hH/SP+Uf/XlSXpn/BP+if8k/4J/6R/wj/pn/BP+if8k/4J/6R/wj/pn/BP+if8k/4J/6R/wj/pn/BP+if8k/4J/6R/wj/pn/BP+if8k/4J/6R/wj/pn/BP+if8k/4J/6R/wj/pn/BP+if8k/4J/6R/wj/pn/BP+if8k/4J/6T/6yqf9c/4Z/0z/ln/jH/WP+Of9c/4Z/0z/ln/jH/WP+Of9c/4Z/0z/ln/jH/WP+Of9c/4Z/0z/ln/jH/WP+Of9c/4Z/0z/ln/jH/WP+Of9c/4Z/0z/ln/jH/WP+Of9c/4Z/0z/ln/jH/WP+Of9c/4Z/0z/ln/jH/WvzAW/Qv+Rf+Cf9G/4F/0L/gX/Qv+Rf+Cf9G/4F/0L/gX/Qv+Rf+Cf9G/4F/0L/gX/Qv+Rf+Cf9G/4F/0L/gX/Qv+Rf+Cf9G/4F/0L/gX/Qv+Rf+Cf9G/4F/0L/gX/Qv+Rf+Cf9G/4F/0L/gX/Qv+Rf+Cf9G/4F/0r6/bT/0r/lX/in/Vv+Jf9a/4V/0r/lX/in/Vv+Jf9a/4V/0r/lX/in/Vv+Jf9a/4V/0r/lX/in/Vv+Jf9a/4V/0r/lX/in/Vv+Jf9a/4V/0r/lX/in/Vv+Jf9a/4V/0r/lX/in/Vv+Jf9a/4V/0r/lX/in/Vv378uuX/4P+65W/6N1aa/g3/pn/Dv+nf8G/6N/yb/g3/pn/Dv+nf8G/6N/yb/g3/pn/Dv+nf8G/6N/yb/g3/pn/Dv+nf8G/6N/yb/g3/pn/Dv+nf8G/6N/yb/g3/pn/Dv+nf8G/6N/yb/g3/pn/Dv+nf8G/6N/yb/g3/pn/Dv+nfGbv+Hf+uf8e/69/x7/p3/Lv+Hf+uf8e/69/x7/p3/Lv+Hf+uf8e/69/x7/p3/Lv+Hf+uf8e/69/x7/p3/Lv+Hf+uf8e/69/x7/p3/Lv+Hf+uf8e/69/x7/p3/Lv+Hf+uf8e/69/x7/p3/Lv+Hf+uf8e/69/x7/q//kEP/Qf+Q/+B/9B/4D/0H/gP/Qf+Q/+B/9B/4D/0H/gP/Qf+Q/+B/9B/4D/0H/gP/Qf+Q/+B/9B/4D/0H/gP/Qf+Q/+B/9B/4D/0H/gP/Qf+Q/+B/9B/4D/0H/gP/Qf+Q/+B/9B/4D/0H/gP/Qf+Q/+B/9B/4D/0n4xT/4n/1H/iP/Wf+E/9J/5T/4n/1H/iP/Wf+E/9J/5T/4n/1H/iP/Wf+E/9J/5T/4n/1H/iP/Wf+E/9J/5T/4n/1H/iP/Wf+E/9J/5T/4n/1H/iP/Wf+E/9J/5T/4n/1H/iP/Wf+E/9J/5T/4n/1H/iP/Wf+E/9X8+Dbv1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9b/xv/W/8b/1v/G/9F+PSf+G/9F/4L/0X/kv/hf/Sf+G/9F/4L/0X/kv/hf/Sf+G/9F/4L/0X/kv/hf/Sf+G/9F/4L/0X/kv/hf/Sf+G/9F/4L/0X/kv/hf/Sf+G/9F/4L/0X/kv/hf/Sf+G/9F/4L/0X/kv/hf/Sf+G/9F/4L/0X/kv/zbj13/hv/Tf+W/+N/9Z/47/13/hv/Tf+W/+N/9Z/47/13/hv/Tf+W/+N/9Z/47/13/hv/Tf+W/+N/9Z/47/13/hv/Tf+W/+N/9Z/47/13/hv/Tf+W/+N/9Z/47/13/hv/Tf+W/+N/9Z/47/13/hv/Tf+W/+N/9b/eT1y1v/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/B/9H/wf/R/8H/0f/5+PWY/4P/6zH/0f/gf/Q/7Dj6H/yP/gf/o//B/+h/8D/6H/yP/gf/o//B/+h/8D/6H/yP/gf/o//B/+h/8D/6H/yP/gf/o//B/+h/8D/6H/yP/gf/o//B/+h/8D/6H/yP/gf/o//B/+h/8D/6H/yP/gf/o//B/+h/8D/6H/zPB/9/AsqUaXgAAAB42mNgZgCD/1sZjBiwAAAswgHqAHja7ZhVc5BNkIWn/QWCEzRAcHd3d3eX4J4Awd0luLu7e3B3d3d3h4RgC99e7I9YnoupOjXdXaempqamGxyjA4AoxVoENmtZvENAp/Z/ZdbwROF+IT5JwhNDeBIM+e4T4SJYkiTkJj5J/TzwSR5WK3pYs5hh9X1S+SVI6pPSCYBGqx0Q9F+Zci1adgpuG9yrRGBQry5tW7cJ9s+eNVuOjH/XXP7/RfjX6NU1uGXHrv7lOjUP7BIU2CUguGUL/7RtgoOD8mfJ0qNHj8wBf8MyNw/smCVd5v9N+c/c/9nMlD1rznzO/XFvv8mBc84DD/5IV8FVdJVcZVfFVXXVXHVXw9V0tVxtV8fVdfVcfdfANXSNXGPXxDV1Aa6Za+5auJaulWvt2ri2rp1r7zq4jq6TC3RBrrPr4rq6YNfNdXc9XE/Xy/V2fVxf18/1dwPcQDfIDXZD3FA3zA13I9xIN8qNdiFujBvrxrnxboKb6Ca5yW6Km+qmueluhpvpZrnZbo6b6+a5+W6BW+gWucVuiVvqlrnlboVb6Va51W6NW+vWufVug9voNrnNbovb6ra5ULfd7XA73S632+1xe90+t98dcAfdIXfYHXFH3TF33J1wJ90pd9qdcWfdOXfeXXAX3SV32V1xV901d93dcDfdLXfb3XF33T133z1wD90j99g9cU/dM/fcvXAv3Sv32r1xb9079959cB/dJ/fZfXFfXZgLd99chPvufrif7pf7DX+vCgIBg4CC/Tn/SBAZooAPRIVoEB1iQEyIBbEhDvhCXIgH8SEBJIRE4AeJIQkkBX9IBskhBaSEVJAa0kBaSAfpIQNkhEyQGbJAVsgG2SEH5IRckBvyQF7IB/mhABSEQlAYikBRKAbFoQSUhFJQGspAWSgH5aECVIRKUBmqQFWoBtWhBtSEWlAb6kBdqAf1oQE0hEbQGJpAUwiAZtAcWkBLaAWtoQ20hXbQHjpAR+gEgRAEnaELdIVg6AbdoQf0hF7QG/pAX+gH/WEADIRBMBiGwFAYBsNhBIyEUTAaQmAMjIVxMB4mwESYBJNhCkyFaTAdZsBMmAWzYQ7MhXkwHxbAQlgEi2EJLIVlsBxWwEpYBathDayFdbAeNsBG2ASbYQtshW0QCtthB+yEXbAb9sBe2Af74QAchENwGI7AUTgGx+EEnIRTcBrOwFk4B+fhAlyES3AZrsBVuAbX4QbchFtwG+7AXbgH9+EBPIRH8BiewFN4Bs/hBbyEV/Aa3sBbeAfv4QN8hE/wGb7AVwiDcPgGEfAdfsBP+AW/0SEgIiGjoKKhh5EwMkZBH4yK0TA6xsCYGAtjYxz0xbgYD+NjAkyIidAPE2MSTIr+mAyTYwpMiakwNabBtJgO02MGzIiZMDNmwayYDbNjDsyJuTA35sG8mA/zYwEsiIWwMBbBolgMi2MJLImlsDSWwbJYDstjBayIlbAyVsGqWA2rYw2sibWwNtbBulgP62MDbIiNsDE2waYYgM2wObbAltgKW2MbbIvtsD12wI7YCQMxCDtjF+yKwdgNu2MP7Im9sDf2wb7YD/vjAByIg3AwDsGhOAyH4wgciaNwNIbgGByL43A8TsCJOAkn4xScitNwOs7AmTgLZ+McnIvzcD4uwIW4CBfjElyKy3A5rsCVuApX4xpci+twPW7AjbgJN+MW3IrbMBS34w7cibtwN+7BvbgP9+MBPIiH8DAewaN4DI/jCTyJp/A0nsGzeA7P4wW8iJfwMl7Bq3gNr+MNvIm38Dbewbt4D+/jA3yIj/AxPsGn+Ayf4wt8ia/wNb7Bt/gO3+MH/Iif8DN+wa8YhuH4DSPwO/7An/gL/zy7BIRExCSkZORRJIpMUciHolI0ik4xKCbFotgUh3wpLsWj+JSAElIi8qPElISSkj8lo+SUglJSKkpNaSgtpaP0lIEyUibKTFkoK2Wj7JSDclIuyk15KC/lo/xUgApSISpMRagoFaPiVIJKUikqTWWoLJWj8lSBKlIlqkxVqCpVo+pUg2pSLapNdagu1aP61IAaUiNqTE2oKQVQM2pOLagltaLW1IbaUjtqTx2oI3WiQAqiztSFulIwdaPu1IN6Ui/qTX2oL/Wj/jSABtIgGkxDaCgNo+E0gkbSKBpNITSGxtI4Gk8TaCJNosk0habSNJpOM2gmzaLZNIfm0jyaTwtoIS2ixbSEltIyWk4raCWtotW0htbSOlpPG2gjbaLNtIW20jYKpe20g3bSLtpNe2gv7aP9dIAO0iE6TEfoKB2j43SCTtIpOk1n6Cydo/N0gS7SJbpMV+gqXaPrdINu0i26TXfoLt2j+/SAHtIjekxP6Ck9o+f0gl7SK3pNb+gtvaP39IE+0if6TF/oK4VROH2jCPpOP+gn/aLf7BgYmZhZWNnY40gcmaOwD0flaBydY3BMjsWxOQ77clyOx/E5ASfkROzHiTkJJ2V/TsbJOQWn5FScmtNwWk7H6TkDZ+RMnJmzcFbOxtk5B+fkXJyb83Bezsf5uQAX5EJcmItwUS7GxbkEl+RSXJrLcFkux+W5AlfkSlyZq3BVrsbVuQbX5Fpcm+twXa7H9bkBN+RG3JibcFMO4GbcnFtwS27FrbkNt+V23J47cEfuxIEcxJ25C3flYO7G3bkH9+Re3Jv7cF/ux/15AA/kQTyYh/BQHsbDeQSP5FE8mkN4DI/lcTyeJ/BEnsSTeQpP5Wk8nWfwTJ7Fs3kOz+V5PJ8X8EJexIt5CS/lZbycV/BKXsWreQ2v5XW8njfwRt7Em3kLb+VtHMrbeQfv5F28m/fwXt7H+/kAH+RDfJiP8FE+xsf5BJ/kU3yaz/BZPsfn+QJf5Et8ma/wVb7G1/kG3+RbfJvv8F2+x/f5AT/kR/yYn/BTfsbP+QW/5Ff8mt/wW37H7/kDf+RP/Jm/8FcO43D+xhH8nX/wT/7Fv+XPt09QSFhEVEw8iSSRJYr4SFSJJtElhsSUWBJb4oivxJV4El8SSEJJJH6SWJJIUvGXZJJcUkhKSSWpJY2klXSSXjJIRskkmSWLZJVskl1ySE7JJbklj+SVfJJfCkhBKSSFpYgUlWJSXEpISSklpaWMlJVyUl4qSEWpJJWlilSValJdakhNqSW1pY7UlXpSXxpIQ2kkjaWJNJUAaSbNpYW0lFbSWtpIW2kn7aWDdJROEihB0lm6SFcJlm7SXXpIT+klvaWP9JV+0l8GyEAZJINliAyVYTJcRshIGSWjJUTGyFgZJ+NlgkyUSTJZpshUmSbTZYbMlFkyW+bIXJkn82WBLJRFsliWyFJZJstlhayUVbJa1shaWSfrZYNslE2yWbbIVtkmobJddshO2SW7ZY/slX2yXw7IQTkkh+WIHJVjclxOyEk5JafljJyVc3JeLshFuSSX5YpclWtyXW7ITbklt+WO3JV7cl8eyEN5JI/liTyVZ/JcXshLeSWv5Y28lXfyXj7IR/kkn+WLfJUwCZdvEiHf5Yf8lF/yW52CopKyiqqaehpJI2sU9dGoGk2jawyNqbE0tsZRX42r8TS+JtCEmkj9NLEm0aTqr8k0uabQlJpKU2saTavpNL1m0IyaSTNrFs2q2TS75tCcmktzax7Nq/k0vxbQglpIC2sRLarFtLiW0JJaSktrGS2r5bS8VtCKWkkraxWtqtW0utbQmlpLa2sdrav1tL420IbaSBtrE22qAdpMm2sLbamttLW20bbaTttrB+2onTRQg7SzdtGuGqzdtLv20J7aS3trH+2r/bS/DtCBOkgH6xAdqsN0uI7QkTpKR2uIjtGxOk7H6wSdqJN0sk7RqTpNp+sMnamzdLbO0bk6T+frAl2oi3SxLtGlukyX6wpdqat0ta7RtbpO1+sG3aibdLNu0a26TUN1u+7QnbpLd+se3av7dL8e0IN6SA/rET2qx/S4ntCTekpP6xk9q+f0vF7Qi3pJL+sVvarX9Lre0Jt6S2/rHb2r9/S+PtCH+kgf6xN9qs/0ub7Ql/pKX+sbfavv9L1+0I/6ST/rF/2qYRqu3zRCv+sP/am/9Lc5A0MjYxNTM/MskkW2KOZjUS2aRbcYFtNiWWyLY74W1+JZfEtgCS2R+VliS2JJzd+SWXJLYSktlaW2NJbW0ll6y2AZLZNltiyW1bJZdsthOS2X5bY8ltfyWX4rYAWtkBW2IlbUillxK2ElrZSVtjJW1spZeatgFa2SVbYqVtWqWXWrYTWtltW2OlbX6ll9a2ANrZE1tibW1AKsmTW3FtbSWllra2NtrZ21tw7W0TpZoAVZZ+tiXS3Yull362E9rZf1tj7W1/pZfxtgA22QDbYhNtSG2XAbYSNtlI22EBtjY22cjbcJNtEm2WSbYlNtmk23GTbTZtlsm2NzbZ7NtwW20BbZYltiS22ZLbcVttJW2WpbY2ttna23DbbRNtlm22JbbZuF2nbbYTttl+22PbbX9tl+O2AH7ZAdtiN21I7ZcTthJ+2UnbYzdtbO2Xm7YBftkl22K3bVrtl1u2E37Zbdtjt21+7ZfXtgD+2RPbYn9tSe2XN7YS/tlb22N/bW3tl7+2Af7ZN9ti/21cIs3L5ZhH23H/bTftlv72/LjR557ImnnnmeF8mL7EXxfLyoXjQvuhfDi+nF8mJ7cTxfL64Xz4vvJfASeok8Py+xl8RL6vl7ybzkXgovpZfKS+2l8dJ66bz0XgYvo5fJy+xl8bJ62bzsXg4vp5fLy+3l8fJ6+bz8XgGvoFfIK+wV8Yp6xbziXgmvpFfKK+2V8cp65bzyXgX/7z6hESlDISxG6LeMoRQWI4J9f/X9NjSir/2s+yuN77eLFnbkRw5ZtsH3+5HwPBL+VZc18/150f6oHBLUyvfPbh758VWj/eMf//jHP/7xj/9//B1wRw5P6pN6ll+CTLG+jwvxk9IhuifynigRz3z/B+I69cx42u3BAQ0AAAgDoG/WNvBjGERgmg0AAADwwAGHXgFoAAAAAAEAAAAA"); unicode-range: U+0028, U+0029 }
span.ytp-menu-label-secondary { font-family: "no-parens", "Roboto", sans-serif }
.ytp-swatch-color-white { color: #f00 !important }
.iv-card { border-radius: 0 !important }
.iv-branding .branding-context-container-inner { border-radius: 2px !important }
.ytp-offline-slate-bar { border-radius: 2px !important }
.ytp-offline-slate-button { border-radius: 2px !important }
.ytp-ce-video.ytp-ce-large-round, .ytp-ce-playlist.ytp-ce-large-round, .ytp-ce-large-round .ytp-ce-expanding-overlay-background { border-radius: 0 !important }
.ytp-flyout-cta .ytp-flyout-cta-icon.ytp-flyout-cta-icon-rounded { border-radius: 0 !important }
.ytp-player-minimized .html5-main-video, .ytp-player-minimized .ytp-miniplayer-scrim, .ytp-player-minimized.html5-video-player { border-radius: 0 !important }
ytd-miniplayer #player-container.ytd-miniplayer, ytd-miniplayer #video-container.ytd-miniplayer .video.ytd-miniplayer, ytd-miniplayer #card.ytd-miniplayer, ytd-miniplayer { border-radius: 0 !important }
ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer { border-radius: 0 !important }
.ytp-tooltip.ytp-rounded-tooltip.ytp-preview:not(.ytp-text-detail), .ytp-tooltip.ytp-rounded-tooltip.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-bg { border-radius: 2px !important }
#movie_player > div.ytp-promotooltip-wrapper > div.ytp-promotooltip-container { border-radius: 2px !important }
.ytp-fine-scrubbing-container { display: none !important }
.ytp-progress-bar, .ytp-heat-map-container, .ytp-fine-scrubbing-container { transform: translateY(0) !important }
.ytp-chrome-bottom { height: auto !important }
.ytp-tooltip-edu { display: none !important }
.ytp-xs-mono-button-style .ytp-time-wrapper { background: none !important; border-radius: 0 !important; padding: 0 !important }
/* Modifing the watch page, compact channel header UI and pre-amsterdam playlists UI */
ytd-watch-metadata[title-headline-xs] h1.ytd-watch-metadata, ytd-watch-metadata[title-headline-m] h1.ytd-watch-metadata { font-family: "YouTube Sans","Roboto",sans-serif !important; font-weight: 600 !important; font-size: 2rem !important; line-height: 2.8rem !important }
ytd-watch-metadata.watch-active-metadata.style-scope.ytd-watch-flexy.style-scope.ytd-watch-flexy { margin-top: var(--ytd-margin-3x) !important }
#top-row.ytd-watch-metadata #top-level-buttons-computed button, #top-row.ytd-watch-metadata #flexible-item-buttons button { text-transform: none }
ytd-watch-metadata[modern-metapanel] #description.ytd-watch-metadata, #description.ytd-watch-metadata, .YtVideoMetadataCarouselViewModelHost { background-color: transparent !important }
ytd-watch-metadata[modern-metapanel] #description-inner.ytd-watch-metadata, #description-inner.ytd-watch-metadata { margin: 0px !important }
ytd-watch-metadata[modern-metapanel-order] #comment-teaser.ytd-watch-metadata {border: 1px solid var(--yt-spec-10-percent-layer) !important; border-radius: 4px !important }
ytd-comments-entry-point-header-renderer[modern-metapanel] { background-color: transparent !important }
.YtVideoMetadataCarouselViewModelHost { padding: 0 !important }
#teaser-carousel.ytd-watch-metadata, div#expandable-metadata.ytd-watch-flexy { display: none !important }
lottie-component.smartimation__border-gradient.lottie-component, smartimation__background-lottie lottie-component, .smartimation__border { display: none !important }
.smartimation--active-border .smartimation__overlay { opacity: 0; z-index: 0 }
#return-youtube-dislike-bar, #ryd-bar, .yt-spec-touch-feedback-shape--touch-response .yt-spec-touch-feedback-shape__fill { background: var(--yt-spec-icon-inactive) !important }
#actions.ytd-watch-metadata { min-width: auto !important }
ytd-watch-metadata[action-buttons-update-owner-width] #actions.ytd-watch-metadata { min-width: 50% !important; justify-content: flex-end !important }
ytd-watch-metadata[action-buttons-update-owner-width] #owner.ytd-watch-metadata { min-width: 50% !important; margin-right: 0 !important }
yt-button-view-model.ytd-menu-renderer .yt-spec-button-shape-next--size-m, ytd-download-button-renderer .yt-spec-button-shape-next--size-m, .yt-spec-button-shape-next--size-m[aria-label="Promote"], #loop-button > .yt-spec-button-shape-next--size-m { margin-left: 8px !important }
#flexible-item-buttons .ytd-menu-renderer, #top-level-buttons-computed yt-button-view-model.ytd-menu-renderer, ytd-button-renderer#loop-button { margin-left: 0 !important }
ytd-comments-header-renderer[compact-header] #title.ytd-comments-header-renderer { margin-bottom: 24px !important }
ytd-watch-flexy ytd-rich-item-renderer[rendered-from-rich-grid] { --ytd-rich-item-row-usable-width: 100% !important }
ytd-watch-flexy ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] { margin-left: 0 }
ytd-watch-flexy ytd-rich-item-renderer ytd-menu-renderer .ytd-menu-renderer[style-target=button] { width: 24px !important; height: 24px !important }
ytd-watch-flexy #dismissible.ytd-rich-grid-media { flex-direction: row; }
ytd-watch-flexy #attached-survey.ytd-rich-grid-media, ytd-watch-flexy #avatar-link.ytd-rich-grid-media, ytd-watch-flexy #avatar-container.ytd-rich-grid-media { display: none; }
ytd-watch-flexy ytd-thumbnail.ytd-rich-grid-media, ytd-watch-flexy ytd-playlist-thumbnail.ytd-rich-grid-media { margin-right: 8px; height: 94px; width: 168px; }
ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail { margin: 4px; }
ytd-watch-flexy ytd-rich-item-renderer, ytd-watch-flexy ytd-rich-grid-row #contents.ytd-rich-grid-row { margin: 0; }
ytd-watch-flexy ytd-rich-item-renderer[reduced-bottom-margin] { margin-top: 8px; margin-bottom: 0; }
ytd-watch-flexy ytd-rich-grid-renderer[reduced-top-margin] #contents.ytd-rich-grid-renderer { padding-top: 0; }
ytd-watch-flexy ytd-rich-grid-media { margin-bottom: 8px; }
ytd-watch-flexy #details.ytd-rich-grid-media { width: 100%; min-width: 0; }
ytd-watch-flexy ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block, ytd-watch-flexy #channel-name.ytd-video-meta-block { font-family: "Roboto", "Arial", sans-serif; font-size: 1.2rem; line-height: 1.8rem; font-weight: 400; }
ytd-watch-flexy #video-title.ytd-rich-grid-media { margin: 0 0 4px 0; display: block; font-family: "Roboto", "Arial", sans-serif; font-size: 1.4rem; line-height: 2rem; font-weight: 500; overflow: hidden; display: block; max-height: 4rem; -webkit-line-clamp: 2; display: box; display: -webkit-box; -webkit-box-orient: vertical; text-overflow: ellipsis; white-space: normal; }
ytd-watch-flexy h3.ytd-rich-grid-media { margin: 0; }
ytd-watch-flexy .title-badge.ytd-rich-grid-media, ytd-watch-flexy .video-badge.ytd-rich-grid-media { margin-top: 0; }
ytd-watch-flexy ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer { display: none; }
ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar] ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer, ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar-on-watch] ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer, ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar-on-home] #header.ytd-rich-grid-renderer ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer { display: flex; height: 51px; margin-bottom: 8px; }
ytd-watch-flexy #chips-wrapper.ytd-feed-filter-chip-bar-renderer, ytd-watch-flexy ytd-feed-filter-chip-bar-renderer #left-arrow-button.ytd-feed-filter-chip-bar-renderer, ytd-watch-flexy ytd-feed-filter-chip-bar-renderer #right-arrow-button.ytd-feed-filter-chip-bar-renderer { background: var(--yt-spec-general-background-a) !important; }
ytd-watch-flexy #left-arrow.ytd-feed-filter-chip-bar-renderer:after { background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important; }
ytd-watch-flexy #right-arrow.ytd-feed-filter-chip-bar-renderer:before { background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important; }
ytd-watch-flexy ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer:after { background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important; }
ytd-watch-flexy ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer:before { background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important; }
ytd-watch-flexy #chips-wrapper.ytd-feed-filter-chip-bar-renderer { position: relative; top: 0; }
ytd-watch-flexy ytd-feed-filter-chip-bar-renderer[fluid-width] #chips-content.ytd-feed-filter-chip-bar-renderer { padding: 0; }
ytd-watch-flexy yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer, ytd-watch-flexy yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer:first-of-type { margin: 8px; margin-left: 0; }
ytd-watch-flexy ytd-button-renderer.ytd-feed-filter-chip-bar-renderer { margin: 0; padding: 0 8px; }
ytd-watch-flexy .yt-lockup-view-model--horizontal .yt-lockup-view-model__content-image { max-width: 168px !important }
ytd-watch-flexy .yt-lockup-view-model--vertical .yt-lockup-view-model__content-image { min-width: 168px !important; padding-right: 8px !important; padding-bottom: 0 !important }
ytd-watch-flexy .yt-lockup-view-model--vertical { flex-direction: row !important }
ytd-watch-flexy[default-layout][reduced-top-margin] #primary.ytd-watch-flexy, ytd-watch-flexy[default-layout][reduced-top-margin] #secondary.ytd-watch-flexy { padding-top: var(--ytd-margin-6x) !important }
#primary.ytd-watch-flexy, ytd-watch-flexy[flexy] #secondary.ytd-watch-flexy { padding-right: var(--ytd-margin-6x) !important }
#primary.ytd-watch-flexy { margin-left: var(--ytd-margin-6x) !important }
#secondary.ytd-watch-grid { width: 402px !important; min-width: 300px !important }
ytd-watch-metadata[title-headline-m] h1.ytd-watch-metadata { font-size: 2rem !important; font-weight: 400 !important; line-height: 2.8rem !important }
#meta #avatar { width: 48px; height: 48px; margin-right: 12px; }
#meta #avatar img { width: 100%; }
.yt-spec-button-shape-next--size-m[aria-label="Promote"], #flexible-item-buttons [aria-label="Promote"], .yt-spec-button-shape-next--size-m[aria-label="Ask"], #flexible-item-buttons [aria-label="Ask"] { display: none !important }
div#info-skeleton.watch-skeleton.style-scope.ytd-watch-flexy, div#meta-skeleton.watch-skeleton.style-scope.ytd-watch-flexy { display: none !important }
[page-subtype="channels"] .page-header-view-model-wiz__page-header-description, [page-subtype="channels"] .yt-page-header-view-model__page-header-description { margin-top: 0px !important; max-width: 236px !important }
[page-subtype="channels"] yt-description-preview-view-model .truncated-text-wiz__truncated-text-content:before, [page-subtype="channels"] .yt-page-header-view-model__page-header-description .yt-truncated-text__truncated-text-content:before { content: "More about this channel >   "; font-weight: 500 !important }
#avatar.ytd-c4-tabbed-header-renderer, .yt-spec-avatar-shape__button--button-giant { width: 80px !important; height: 80px !important; margin: 0 24px 0 0 !important; flex: none !important; overflow: hidden !important }
.yt-spec-avatar-shape__button--button-giant, .yt-spec-avatar-shape--avatar-size-giant, .yt-spec-avatar-shape__button--button-extra-extra-large, .yt-spec-avatar-shape--avatar-size-extra-extra-large { width: 80px !important; height: 80px !important; margin-right: 0px !important }
#avatar-editor.ytd-c4-tabbed-header-renderer { --ytd-channel-avatar-editor-size: 80px !important }
#channel-name.ytd-c4-tabbed-header-renderer { margin-bottom: 0 !important }
#channel-header-container.ytd-c4-tabbed-header-renderer { padding-top: 0 !important; align-items: center !important }
#inner-header-container.ytd-c4-tabbed-header-renderer { margin-top: 0 !important; align-items: center !important }
.yt-content-metadata-view-model-wiz--inline .yt-content-metadata-view-model-wiz__metadata-row { margin-top: 0 !important }
.meta-item.ytd-c4-tabbed-header-renderer { display: block !important }
span.delimiter.style-scope.ytd-c4-tabbed-header-renderer, [page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__delimiter, [page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model__delimiter, [page-subtype="channels"] ytd-tabbed-page-header button.truncated-text-wiz__absolute-button, [page-subtype="channels"] ytd-tabbed-page-header .yt-truncated-text__absolute-button, yt-formatted-string#channel-pronouns.style-scope.ytd-c4-tabbed-header-renderer, #videos-count, #channel-header-links.style-scope.ytd-c4-tabbed-header-renderer, .page-header-view-model-wiz__page-header-attribution, .yt-page-header-view-model__page-header-attribution { display: none !important }
ytd-c4-tabbed-header-renderer[use-page-header-style] #channel-name.ytd-c4-tabbed-header-renderer, [page-subtype="channels"] .page-header-view-model-wiz__page-header-title--page-header-title-large, [page-subtype="channels"] .yt-page-header-view-model__page-header-title--page-header-title-large { font-size: 2.4em !important; font-weight: 400 !important; line-height: var(--yt-channel-title-line-height, 3rem) !important; margin: 0 !important }
#meta.style-scope.ytd-c4-tabbed-header-renderer { width: auto !important }
ytd-c4-tabbed-header-renderer[use-page-header-style] #inner-header-container.ytd-c4-tabbed-header-renderer { flex-direction: row !important }
.page-header-banner.style-scope.ytd-c4-tabbed-header-renderer { margin-left: 0px !important; margin-right: 8px !important; border-radius: 0px !important }
[has-inset-banner] #page-header-banner.ytd-tabbed-page-header { padding-left: 0 !important; padding-right: 0 !important }
ytd-c4-tabbed-header-renderer[use-page-header-style] .page-header-banner.ytd-c4-tabbed-header-renderer, .yt-image-banner-view-model-wiz--inset, .ytImageBannerViewModelInset { border-radius: 0px !important }
[page-subtype="channels"] .yt-content-metadata-view-model-wiz__metadata-text, [page-subtype="channels"] .yt-content-metadata-view-model--medium-text .yt-content-metadata-view-model__metadata-text { margin-right: 8px !important }
[page-subtype="channels"] .yt-content-metadata-view-model-wiz__metadata-text, [page-subtype="channels"] .truncated-text-wiz, [page-subtype="channels"] .truncated-text-wiz__absolute-button, [page-subtype="channels"] .yt-content-metadata-view-model__metadata-text, [page-subtype="channels"] .yt-truncated-text { font-size: 1.4rem !important }
[page-subtype="channels"] .yt-content-metadata-view-model-wiz__metadata-row--metadata-row-inline, [page-subtype="channels"] .yt-content-metadata-view-model__metadata-row--metadata-row-inline { display: flex }
[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__metadata-text:last-of-type, [page-subtype="channels"] .yt-content-metadata-view-model--medium-text .yt-content-metadata-view-model__metadata-text:last-of-type, [page-subtype="channels"] span.yt-core-attributed-string--link-inherit-color:last-of-type { display: none }
[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__metadata-text:first-of-type, [page-subtype="channels"] .yt-content-metadata-view-model--medium-text .yt-content-metadata-view-model__metadata-text:first-of-type, [page-subtype="channels"] span.yt-core-attributed-string--link-inherit-color:first-of-type { display: flex }
[page-subtype="channels"] .yt-core-attributed-string--white-space-pre-wrap:nth-of-type(1) { display: flex; flex-direction: row }
[page-subtype="channels"] .yt-flexible-actions-view-model-wiz--inline { flex-direction: row-reverse }
[page-subtype="channels"] .page-header-view-model-wiz__page-header-flexible-actions, ytd-browse[page-subtype="channels"] .ytFlexibleActionsViewModelInline { margin-top: -56px; flex-direction: row-reverse }
[page-subtype="channels"] .yt-flexible-actions-view-model-wiz__action-row { margin-top: 60px }
[page-subtype="channels"] .yt-flexible-actions-view-model-wiz__action, .ytFlexibleActionsViewModelAction { padding-right: 8px; padding-left: 0px }
[page-subtype="channels"] span.yt-core-attributed-string--link-inherit-color { font-weight: 400 !important }
[page-subtype="channels"] .page-header-view-model-wiz__page-header-headline-info, ytd-browse[page-subtype="channels"] .yt-page-header-view-model__page-header-headline { margin-bottom: 8px }
.yt-tab-shape-wiz, .yt-tab-shape { padding: 0 32px !important; margin-right: 0 !important }
.yt-tab-shape-wiz__tab, .yt-tab-shape__tab { font-size: 14px !important; font-weight: 500 !important; letter-spacing: var(--ytd-tab-system-letter-spacing) !important; text-transform: uppercase !important }
.yt-tab-group-shape-wiz__slider, .tabGroupShapeSlider { display: none !important }
[darker-dark-theme][page-subtype="playlist"], ytd-browse[darker-dark-theme][page-subtype="show"] { background-color: var(--yt-spec-general-background-b) !important; padding-top: 0 !important }
ytd-two-column-browse-results-renderer.ytd-browse[background-refresh] { background-color: var(--yt-spec-general-background-b) !important }
[page-subtype=playlist] .page-header-view-model-wiz__page-header-title--page-header-title-medium, ytd-browse[page-subtype=playlist] .page-header-view-model-wiz__page-header-title--page-header-title-large, .yt-sans-20.yt-dynamic-sizing-formatted-string, .yt-sans-22.yt-dynamic-sizing-formatted-string, .yt-sans-24.yt-dynamic-sizing-formatted-string, .yt-sans-28.yt-dynamic-sizing-formatted-string, yt-text-input-form-field-renderer[component-style="INLINE_FORM_STYLE_TITLE"][amsterdam] tp-yt-paper-input.yt-text-input-form-field-renderer .input-content.tp-yt-paper-input-container > input { font-family: "Roboto", "Arial", sans-serif !important; font-size: 2.4rem !important; line-height: 3.2rem !important; font-weight: 400 !important }
[page-subtype=playlist][amsterdam] { padding-top: 0 !important }
[page-subtype=playlist] ytd-playlist-header-renderer.ytd-browse, ytd-browse[page-subtype=playlist] .page-header-sidebar.ytd-browse, ytd-browse[has-page-header-sidebar] ytd-playlist-header-renderer.ytd-browse, ytd-browse[has-page-header-sidebar] .page-header-sidebar.ytd-browse { background: var(--yt-spec-general-background-a) !important; margin-left: 0 !important; height: calc(100vh - var(--ytd-toolbar-height)) !important }
.immersive-header-container.ytd-playlist-header-renderer { margin-bottom: 0 !important; border-radius: 0 !important }
.image-wrapper.ytd-hero-playlist-thumbnail-renderer { border-radius: 0 !important }
ytd-playlist-header-renderer, yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:visited, .metadata-stats.ytd-playlist-byline-renderer, .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text, ytd-text-inline-expander.ytd-playlist-header-renderer { color: var(--yt-spec-text-primary) !important; --ytd-text-inline-expander-button-color: var(--yt-spec-text-primary) !important }
ytd-dropdown-renderer[no-underline] tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target=input], tp-yt-iron-icon.tp-yt-paper-dropdown-menu-light { color: var(--yt-spec-text-primary) !important }
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal, .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled { background: transparent !important; color: var(--yt-spec-text-primary) !important; border-radius: 2px !important; text-transform: uppercase }
.metadata-text-wrapper.ytd-playlist-header-renderer { --yt-endpoint-color: var(--yt-spec-text-primary) !important; --yt-endpoint-hover-color: var(--yt-spec-text-primary) !important }
div.immersive-header-background-wrapper.style-scope.ytd-playlist-header-renderer > div { background: var(--yt-spec-general-background-a) !important }
#contents > ytd-playlist-video-list-renderer { background: var(--yt-spec-general-background-b) !important; margin-right: 0 !important }
ytd-browse[page-subtype=playlist] ytd-two-column-browse-results-renderer.ytd-browse, ytd-browse[has-page-header-sidebar] ytd-two-column-browse-results-renderer.ytd-browse, ytd-browse[page-subtype=playlist][amsterdam] #alerts.ytd-browse, ytd-browse[page-subtype=playlist] #alerts.ytd-browse, ytd-browse[has-page-header-sidebar] #alerts.ytd-browse { padding-left: 360px !important; padding-right: 0 !important; margin-bottom: 0 !important }
ytd-alert-with-button-renderer[type=INFO], ytd-alert-with-button-renderer[type=SUCCESS] { background: var(--yt-spec-general-background-a) !important }
ytd-item-section-renderer.style-scope.ytd-section-list-renderer[page-subtype="playlist"] > #header.ytd-item-section-renderer > ytd-feed-filter-chip-bar-renderer { display: none !important }
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal { background: var(--yt-spec-base-background) }
iron-input.tp-yt-paper-input > input.tp-yt-paper-input, textarea.tp-yt-iron-autogrow-textarea { color: var(--yt-spec-text-primary) !important }
#labelAndInputContainer.tp-yt-paper-input-container > label, #labelAndInputContainer.tp-yt-paper-input-container > .paper-input-label { color: var(--yt-spec-text-secondary) }
.unfocused-line.tp-yt-paper-input-container, .focused-line.tp-yt-paper-input-container { border-bottom-color: var(--yt-spec-text-primary) !important }
[page-subtype="history"] #page-header.ytd-tabbed-page-header { background-color: var(--yt-spec-general-background-a) !important; padding-top: 0 !important; padding-bottom: 0 !important }
.page-header-view-model-wiz__page-header-title--page-header-title-large { margin-top: 24px !important; margin-bottom: 8px !important; color: var(--yt-spec-text-primary) !important; font-size: 1.6em !important; line-height: 1.4em !important; font-weight: 500 !important }
ytd-browse[page-subtype=playlist] .dynamicTextViewModelH1 { margin-top: 24px !important; margin-bottom: 8px !important; color: var(--yt-spec-text-primary) !important; font-size: 0.75em !important; line-height: 0.55em !important; font-weight: 400 !important }
.yt-content-metadata-view-model-wiz__metadata-text { margin-right: 8px !important }
ytd-browse[page-subtype=playlist], ytd-browse[has-page-header-sidebar] { padding-top: 0 !important }
ytd-browse[page-subtype=playlist] .page-header-sidebar.ytd-browse, ytd-browse[has-page-header-sidebar] .page-header-sidebar.ytd-browse { padding-bottom: 0 !important; border-radius: 0 !important }
div.page-header-view-model-wiz__page-header-background, .yt-page-header-view-model--display-as-sidebar .yt-page-header-view-model__page-header-background { display: none !important }
.yt-content-preview-image-view-model-wiz--large-rounded-image { border-radius: 0 !important }
ytd-browse[page-subtype=playlist] .page-header-view-model-wiz__page-header-content-metadata--page-header-content-metadata-overlay, ytd-browse[page-subtype=playlist] .yt-avatar-stack-view-model-wiz__avatar-stack-text { color: var(--yt-spec-text-secondary) !important; font-size: 1.4rem !important; line-height: 2rem !important }
ytd-browse[page-subtype=playlist] .yt-core-attributed-string--link-inherit-color .yt-core-attributed-string__link--call-to-action-color { font-weight: 400 !important }
yt-dynamic-text-view-model, ytd-browse[page-subtype=playlist] .yt-core-attributed-string--link-inherit-color .yt-core-attributed-string__link--call-to-action-color, ytd-browse[page-subtype=playlist] .yt-content-metadata-view-model__metadata-text, ytd-browse[page-subtype=playlist] .yt-truncated-text, ytd-browse[page-subtype=playlist] .yt-content-metadata-view-model__delimiter { color: var(--yt-endpoint-color, var(--yt-spec-text-primary)) !important }
ytd-playlist-video-renderer #content.ytd-playlist-video-renderer { padding: 16px 0 !important; border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important }
ytd-playlist-video-renderer .style-scope.yt-formatted-string, ytd-playlist-video-renderer .bold.style-scope.yt-formatted-string { display: none }
ytd-playlist-video-renderer div#separator.style-scope.ytd-video-meta-block { display: none !important }
ytd-playlist-video-renderer[amsterdam-post-mvp] ytd-thumbnail.ytd-playlist-video-renderer, ytd-playlist-video-renderer[cairo-collab-playlist-post-mvp] ytd-thumbnail.ytd-playlist-video-renderer { height: 68px !important; width: 120px !important }
/* Modifying the You section along with removing Playables and more stuff from the left side panel + Other elements to be fixed, modified and removed */
ytd-guide-entry-renderer > a[href*="/feed/you"] .guide-icon.ytd-guide-entry-renderer { display: block !important }
ytd-guide-entry-renderer > a[href*="/feed/you"] .arrow-icon.ytd-guide-entry-renderer, ytd-guide-entry-renderer > a[href*="/feed/subscriptions"] .arrow-icon.ytd-guide-entry-renderer { display: none !important }
ytd-guide-entry-renderer > a[href*="/feed/you"] .title.ytd-guide-entry-renderer, ytd-guide-entry-renderer > a[href*="/feed/you"] .title.ytd-guide-entry-renderer::after { color: var(--yt-spec-text-primary) !important; font-size: 1.4rem !important; line-height: 2rem !important; font-weight: 400 !important }
a.ytd-mini-guide-entry-renderer[title="You"] .title.ytd-mini-guide-entry-renderer, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="You"] .title.ytd-guide-entry-renderer, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Playlists"] .title.ytd-guide-entry-renderer { visibility: hidden !important }
a.ytd-mini-guide-entry-renderer[title="You"] .title.ytd-mini-guide-entry-renderer:after, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="You"] .title.ytd-guide-entry-renderer:after { content: 'Library'; visibility: visible !important; margin-left: -24px !important }
a.ytd-mini-guide-entry-renderer[title="You"] .title.ytd-mini-guide-entry-renderer:after { margin-left: -18px !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="You"] .title.ytd-guide-entry-renderer:after { margin-left: -24px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(2) ytd-guide-collapsible-section-entry-renderer { margin-top: 252px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(3) ytd-guide-collapsible-section-entry-renderer { height: 0 !important; margin-top: -640px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(2) ytd-guide-collapsible-entry-renderer[expanded] #expanded.ytd-guide-collapsible-entry-renderer { height: 40px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(3) ytd-guide-collapsible-section-entry-renderer > #section-items > ytd-guide-collapsible-entry-renderer { display: none !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(3) ytd-guide-entry-renderer > a[href*="studio.youtube.com/channel"] { margin-top: -120px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(3) ytd-guide-entry-renderer > a[href*="feed/playlists"] { margin-top: 120px !important; margin-bottom: -120px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(2) ytd-guide-entry-renderer > a[href*="/feed/playlists"] { margin-top: 120px !important; margin-bottom: -160px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(2) ytd-guide-entry-renderer > a[href*="/playlist?list=LL"] { margin-bottom: 40px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(2) ytd-guide-entry-renderer > a[href*="/feed/clips"] { margin-top: -80px !important; margin-bottom: 40px !important; background-color: var(--yt-spec-base-background) !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(2) ytd-guide-entry-renderer > a[href*="/feed/clips"]:hover { background-color: var(--yt-spec-general-background-b) !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Playlists"] path, ytd-guide-collapsible-entry-renderer ytd-guide-entry-renderer path { d: path("m18 9.28-6.35 6.35-6.37-6.35.72-.71 5.64 5.65 5.65-5.65z") !important }
ytd-guide-entry-renderer[active] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Playlists"] path, ytd-guide-entry-renderer[aria-expanded="true"] path { d: path("M18.4 14.6 12 8.3l-6.4 6.3.8.8L12 9.7l5.6 5.7z") !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Playlists"] .title.ytd-guide-entry-renderer:after { content: 'Show more'; visibility: visible !important; margin-left: -52px !important }
ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(3) { border-bottom: none !important }
ytd-guide-entry-renderer > a[href*="/feed/channels"] .title.ytd-guide-entry-renderer, ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(2) ytd-guide-entry-renderer > a[href*="/feed/subscriptions"] .title.ytd-guide-entry-renderer { font-size: 1.6rem !important; line-height: 2.2rem !important; font-weight: 500 !important }
ytd-guide-entry-renderer > a[href*="/feed/channels"] .guide-icon.ytd-guide-entry-renderer, ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(2) ytd-guide-entry-renderer > a[href*="/feed/subscriptions"] .guide-icon.ytd-guide-entry-renderer { display: none !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Your channel"], ytd-guide-entry-renderer > a[href*="/feed/podcasts"], ytd-guide-entry-renderer > a[href*="/playables"], ytd-guide-downloads-entry-renderer, ytd-mini-guide-downloads-entry-renderer, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Your movies & TV"] { display: none !important }
ytd-guide-entry-renderer > a[href*="/channel/UCkYQyvc_i9hXEo4xic9Hh2g"], ytd-guide-entry-renderer > a[href*="/feed/courses_destination"] { display: none !important }
ytd-guide-entry-renderer { background-color: var(--yt-spec-brand-background-solid) !important }
ytd-guide-entry-renderer:hover { background-color: var(--yt-spec-general-background-b) !important }
html[dark] ytd-guide-entry-renderer[active] { background-color: #272727 !important }
html:not([dark]) ytd-guide-entry-renderer[active] { background-color: #f2f2f2 !important }
.yt-tab-shape-wiz { padding: 0 32px !important; margin-right: 0 !important }
.yt-tab-shape-wiz__tab { color: var(--yt-spec-text-secondary) !important; font-size: var(--ytd-tab-system-font-size) !important; font-weight: var(--ytd-tab-system-font-weight) !important; letter-spacing: var(--ytd-tab-system-letter-spacing) !important; text-transform: uppercase !important }
.yt-tab-group-shape-wiz__slider { display: none !important }
yt-chip-cloud-chip-renderer, .ytChipShapeChip, span.style-scope.ytd-rich-shelf-renderer { font-weight: 400 !important }
span.style-scope.ytd-shelf-renderer, ytd-reel-shelf-renderer[modern-typography] #title.ytd-reel-shelf-renderer { font-size: 1.6rem !important; font-weight: 500 !important }
.count-text.ytd-comments-header-renderer { font-size: 1.6rem !important; line-height: 2.2rem !important; font-weight: 400 !important }
ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer > div#contents.style-scope.ytd-item-section-renderer > ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer, ytd-reel-shelf-renderer.ytd-structured-description-content-renderer { display: none !important }
ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer > #header.ytd-video-description-infocards-section-renderer, ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer > #action-buttons.ytd-video-description-infocards-section-renderer, #social-links.ytd-video-description-infocards-section-renderer { display: none !important }
ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer { border-top: 0 !important }
button.ytp-button.ytp-jump-button.ytp-jump-button-enabled { display: none !important }
ytd-player#ytd-player.style-scope.ytd-watch-flexy > div#container.style-scope.ytd-player > .html5-video-player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button { display: block !important }
div#chip-bar.style-scope.ytd-search-header-renderer { display: none !important }
ytd-search-header-renderer .yt-spec-button-shape-next--size-m { flex-direction: row-reverse }
ytd-search-header-renderer .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-trailing .yt-spec-button-shape-next__icon { margin-left: -6px; margin-right: 6px }
#play.ytd-moving-thumbnail-renderer { color: #fff !important }
ytd-button-renderer.style-scope.yt-chip-cloud-renderer div.yt-spec-button-shape-next__icon, ytd-button-renderer.style-scope.yt-chip-cloud-renderer yt-icon, ytd-button-renderer.ytd-feed-filter-chip-bar-renderer div.yt-spec-button-shape-next__icon, ytd-button-renderer.ytd-feed-filter-chip-bar-renderer yt-icon { width: 20px !important; height: 20px !important }
ytd-video-primary-info-renderer div#flexible-item-buttons.style-scope.ytd-menu-renderer > yt-button-view-model > button-view-model > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading,
ytd-video-primary-info-renderer div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer > yt-button-view-model > button-view-model > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading,
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-end.yt-spec-button-shape-next--icon-leading { padding-left: 12px !important; padding-right: 6px !important; background-color: transparent !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading, button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--segmented-start { padding-left: 12px !important; padding-right: 6px !important; background-color: transparent !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--segmented-start { padding-right: 16px !important }
ytd-video-primary-info-renderer dislike-button-view-model.YtDislikeButtonViewModelHost > toggle-button-view-model > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m, ytd-menu-renderer[has-items] yt-button-shape.ytd-menu-renderer > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button, .yt-spec-button-shape-next--disabled.yt-spec-button-shape-next--tonal { background-color: transparent !important }
ytd-video-primary-info-renderer .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after { width: 0 !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end { background: transparent !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Dislike this video"] { width: 92px !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Dislike this video"]::after { padding-left: 6px; content: "Dislike" }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Marcar “No me gusta” en el video"] { width: 134px !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Marcar “No me gusta” en el video"]::after { padding-left: 6px; content: "No me gusta" }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Je n'aime pas cette vidéo"] { width: 106px !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Je n'aime pas cette vidéo"]::after { padding-left: 6px; content: "Je n'aime" }
#author-thumbnail.ytd-comment-simplebox-renderer, #primary #author-thumbnail.ytd-comment-view-model, #author-thumbnail.ytd-comment-view-model yt-img-shadow.ytd-comment-view-model { width: 40px !important; height: 40px !important }
.thread-hitbox.ytd-comment-thread-renderer { display: none !important }
.ytSubThreadThreadline, .threadline.style-scope.ytd-comment-view-model { visibility: hidden !important }
ytSubThreadSubThreadContent { margin-top: 0 !important }
.ytSubThreadSubThreadContent .yt-spec-button-shape-next { color: var(--yt-spec-call-to-action) !important; flex-direction: row-reverse !important }
.ytSubThreadSubThreadContent .ytd-comment-engagement-bar .yt-spec-button-shape-next { color: var(--yt-spec-icon-active-other) !important }
.ytSubThreadSubThreadContent .yt-spec-button-shape-next__icon { margin-left: 0 !important; margin-right: 6px !important }
#less-replies > yt-button-shape > button > div.yt-spec-button-shape-next__icon path, #less-replies-icon > yt-button-shape > button > div path, #less-replies-sub-thread > yt-button-shape > button > div path { d: path("m7 14 5-5 5 5z") }
#more-replies > yt-button-shape > button > div.yt-spec-button-shape-next__icon path, #more-replies-icon > yt-button-shape > button > div path, #more-replies-sub-thread > yt-button-shape > button > div path, #expanded-threads .ytd-continuation-item-renderer .yt-spec-button-shape-next .yt-icon-shape div path  { d: path("m7 10 5 5 5-5z") }
.yt-spec-button-shape-next--size-s .yt-spec-button-shape-next__icon, .yt-spec-button-shape-next--size-s .yt-spec-button-shape-next__icon .ytIconWrapperHost { width: 24px !important; height: 24px !important }
#pinned-comment-badge > ytd-pinned-comment-badge-renderer > yt-icon > yt-icon-shape { color: var(--yt-spec-text-primary) !important }
#creator-heart-button.ytd-creator-heart-renderer { width: 32px !important; height: 32px !important }
#hearted-thumbnail.ytd-creator-heart-renderer { width: 16px !important; height: 16px !important }
ytd-comments-header-renderer[use-space-between] #title.ytd-comments-header-renderer { justify-content: start !important }
#panel-button.ytd-comments-header-renderer { margin-left: 32px; margin-right: 8px }
#panel-button .yt-spec-button-shape-next__icon { margin-right: 0 }
#panel-button .yt-spec-button-shape-next--size-m { padding-left: 12px; padding-right: 6px }
#panel-button .yt-spec-button-shape-next__button-text-content { display: none !important }
#panel-button .yt-spec-button-shape-next__icon path { d: path("M10 3H17V7H10V3ZM20 0H0V14H20V0ZM1 1H19V13H1V1Z") !important; transform: scale(1.20) !important }
ytd-search ytd-video-renderer, ytd-search ytd-channel-renderer, ytd-search ytd-playlist-renderer, ytd-search ytd-radio-renderer, ytd-search ytd-movie-renderer, ytd-video-renderer.style-scope.ytd-item-section-renderer, ytd-playlist-renderer.style-scope.ytd-item-section-renderer { margin-top: 16px !important }
ytd-compact-video-renderer.style-scope.ytd-item-section-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer, ytd-compact-movie-renderer { margin-top: 8px !important }
.yt-lockup-view-model-wiz--horizontal.yt-lockup-view-model-wiz--collection-stack-2 { margin-top: 0 !important }
.yt-spec-button-shape-next--size-m { text-transform: uppercase !important }
/* Undoing UI changes after 2024 redesign */
.ytp-cairo-refresh-signature-moments .ytp-play-progress, .ytp-play-progress, .html5-play-progress, ytd-thumbnail-overlay-resume-playback-renderer[enable-refresh-signature-moments-web] #progress.ytd-thumbnail-overlay-resume-playback-renderer, .YtThumbnailOverlayProgressBarHostWatchedProgressBarSegmentModern, .YtChapteredProgressBarChapteredPlayerBarChapterRefresh, .YtChapteredProgressBarChapteredPlayerBarFillRefresh, .YtProgressBarLineProgressBarPlayedRefresh, yt-page-navigation-progress[enable-refresh-signature-moments-web] #progress.yt-page-navigation-progress, ytd-progress-bar-line[enable-refresh-signature-moments-web] .progress-bar-played.ytd-progress-bar-line, #logo-icon > .yt-spec-icon-shape.yt-icon.style-scope.yt-icon-shape > div > svg > g:first-of-type > path:first-of-type, .ytProgressBarLineProgressBarPlayed, .ytProgressBarPlayheadProgressBarPlayheadDot, div.ytp-scrubber-button.ytp-swatch-background-color { background: #ff0000 !important }
div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m[aria-label="Create"] { height: 40px !important; border-radius: 50px !important; color: var(--yt-spec-icon-active-other) !important; background-color: transparent !important }
div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading[aria-label="Create"] .yt-spec-button-shape-next__button-text-content { display: none !important }
div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading[aria-label="Create"] .yt-spec-button-shape-next__icon { margin-left: -8px !important; margin-right: -8px !important }
div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading[aria-label="Create"] path { d: path("M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z") }
div#end.style-scope.ytd-masthead .yt-spec-icon-badge-shape--style-overlay.yt-spec-icon-badge-shape--type-cart-refresh .yt-spec-icon-badge-shape__badge { color: #fff !important }
ytd-feed-filter-chip-bar-renderer[frosted-glass] ytd-button-renderer.ytd-feed-filter-chip-bar-renderer { background-color: transparent !important }
ytd-masthead[frosted-glass=with-chipbar] #background.ytd-masthead, ytd-masthead[frosted-glass=without-chipbar] #background.ytd-masthead { backdrop-filter: none !important }
.yt-spec-avatar-shape__live-badge, .yt-spec-avatar-shape--live-ring::after { display: none !important }
yt-tab-shape[tab-title="Posts"]  .yt-tab-shape-wiz__tab, yt-tab-shape[tab-title="Posts"]  .yt-tab-shape__tab { visibility: hidden !important; padding: 0px 0px 0px 0px !important }
yt-tab-shape[tab-title="Posts"]  .yt-tab-shape-wiz__tab:after, yt-tab-shape[tab-title="Posts"]  .yt-tab-shape__tab:after { content: 'Community'; visibility: visible !important; margin-left: -45px !important; text-align: center !important }
[d*="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z"] { d: path("M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z") }
[d*="M19 10L11.5 5.75V14.25L19 10Z"] { d: path("M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z") }
[d*="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z"] { d: path("M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z") }
[d*="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z"] { d: path("M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0647 7.34234 47.3234 8.15137C47.5821 8.96275 47.7115 10.0422 47.7115 11.3898V13.2078C47.7115 14.5437 47.5845 15.6161 47.3329 16.4251C47.0812 17.2365 46.672 17.8292 46.1075 18.2031C45.5431 18.5771 44.7764 18.7652 43.8098 18.7652C42.8126 18.7675 42.0342 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 43.0008 8.35833C42.8432 8.77461 42.7656 9.43077 42.7656 10.3292V14.2309C42.7656 15.1575 42.8408 15.8254 42.9914 16.2323C43.1419 16.6415 43.4123 16.8461 43.8074 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z") }
[d*="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z"] { d: path("M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z") }
[d*="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z"] { d: path("M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z") }
[d*="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z"] { d: path("M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z") }
[d*="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z"] {
d: path("M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z") }
[d*="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z"] { d: path("M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.7942 16.343C86.9518 16.0161 87.0365 15.4705 87.0506 14.7085L89.4824 14.8519C89.4965 14.9601 89.5035 15.1106 89.5035 15.3011C89.5035 16.4582 89.186 17.3237 88.5534 17.8952C87.9208 18.4667 87.0247 18.7536 85.8676 18.7536C84.4777 18.7536 83.504 18.3185 82.9466 17.446C82.3869 16.5735 82.1094 15.2259 82.1094 13.4008V11.2136C82.1094 9.33452 82.3987 7.96105 82.9772 7.09558C83.5558 6.2301 84.5459 5.79736 85.9499 5.79736C86.9165 5.79736 87.6597 5.97375 88.1771 6.32888C88.6945 6.684 89.059 7.23433 89.2707 7.98457C89.4824 8.7348 89.5882 9.76961 89.5882 11.0913V13.2362H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83593C84.8892 9.2381 84.8657 9.84722 84.8657 10.6657V11.5641H86.9283V10.6657C86.9283 9.86133 86.9001 9.25221 86.846 8.83593C86.7919 8.41966 86.6931 8.12803 86.5496 7.95635C86.4062 7.78702 86.1851 7.7 85.8864 7.7C85.5854 7.70235 85.3643 7.79172 85.2232 7.96811Z") }
/* Revert icons style from 2022 */
/* home */
[d*="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5h-5v-7h-3v7h-5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146ZM18.5 9.621l-6.5-6.5-6.5 6.5V19.5H9V13a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6.5h3.5V9.621Z"],
[d*="m11.485 2.143-8 4.8-2 1.2a1 1 0 001.03 1.714L3 9.567V20a2 2 0 002 2h6v-7h2v7h6a2 2 0 002-2V9.567l.485.29a1 1 0 001.03-1.714l-2-1.2-8-4.8a1 1 0 00-1.03 0ZM5 8.366l7-4.2 7 4.2V20h-4v-5.5a1.5 1.5 0 00-1.5-1.5h-3A1.5 1.5 0 009 14.5V20H5V8.366Z"] {
d: path("m12 4.44 7 6.09V20h-4v-6H9v6H5v-9.47l7-6.09m0-1.32-8 6.96V21h6v-6h4v6h6V10.08l-8-6.96z")
}
[d*="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5H14v-8h-4v8H5.5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146Z"],
[d*="m11.485 2.143-8 4.8-2 1.2a1 1 0 001.03 1.714L3 9.567V20a2 2 0 002 2h5v-8h4v8h5a2 2 0 002-2V9.567l.485.29a1 1 0 001.03-1.714l-2-1.2-8-4.8a1 1 0 00-1.03 0Z"] {
d: path("M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z")
}
/* shorts */
[d*="m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z"],
[d*="m13.467 1.19-8 4.7a5 5 0 00-.255 8.46 5 5 0 005.32 8.462l8-4.7a5 5 0 00.258-8.462 5 5 0 001.641-6.464l-.12-.217a5 5 0 00-6.844-1.78m5.12 2.79a2.999 2.999 0 01-1.067 4.107l-1.327.78a1 1 0 00.096 1.775l.943.423a3 3 0 01.288 5.323l-8 4.7a3 3 0 01-3.039-5.173l1.327-.78a1 1 0 00-.097-1.775l-.942-.423a3 3 0 01-.288-5.323l8-4.7a3 3 0 014.106 1.066ZM15 12l-5-3v6l5-3Z"] {
d: path("M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z")
}
[d*="M18.45 8.851c1.904-1.066 2.541-3.4 1.422-5.214-1.119-1.814-3.57-2.42-5.475-1.355L5.55 7.247c-1.29.722-2.049 2.069-1.968 3.491.081 1.423.989 2.683 2.353 3.268l.942.404-1.327.742c-1.904 1.066-2.541 3.4-1.422 5.214 1.119 1.814 3.57 2.421 5.475 1.355l8.847-4.965c1.29-.722 2.049-2.068 1.968-3.49-.081-1.423-.989-2.684-2.353-3.269l-.942-.403 1.327-.743ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z"],
[d*="m13.974 2.052-8 4.7a4 4 0 00.385 7.097l.942.423-1.327.78a4 4 0 004.052 6.897l8-4.7a4.001 4.001 0 00-.384-7.096L16.7 9.73l1.326-.78a4 4 0 10-4.052-6.897ZM10 15V9l5 3-5 3Z"] {
d: path("m17.77 10.32-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z")
}
/* subscriptions */
[d*="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z"],
[d*="M18 1H6a2 2 0 00-2 2h16a2 2 0 00-2-2Zm3 4H3a2 2 0 00-2 2v13a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2ZM3 20V7h18v13H3Zm13-6.5L10 10v7l6-3.5Z"] {
d: path("M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 10h18v10H3V10z")
}
[d*="M5.5 3A1.5 1.5 0 004 4.5h16A1.5 1.5 0 0018.5 3h-13ZM2 7.5A1.5 1.5 0 013.5 6h17A1.5 1.5 0 0122 7.5v11a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 18.5v-11Zm8 2.87a.5.5 0 01.752-.431L16 13l-5.248 3.061A.5.5 0 0110 15.63v-5.26Z"],
[d*="M6 1a2 2 0 00-2 2h16a2 2 0 00-2-2H6ZM1 7v13a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2Zm9 10v-7l6 3.5-6 3.5Z"] {
d: path("M20 7H4V6h16v1zm2 2v12H2V9h20zm-7 6-5-3v6l5-3zm2-12H7v1h10V3z")
}
/* you */
[d*="M12 20.5c1.894 0 3.643-.62 5.055-1.666a5.5 5.5 0 00-10.064-.105.755.755 0 01-.054.099A8.462 8.462 0 0012 20.5Zm4.079-5.189a7 7 0 012.142 2.48 8.5 8.5 0 10-12.443 0 7 7 0 0110.3-2.48ZM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm2-12.5a2 2 0 11-4 0 2 2 0 014 0Zm1.5 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z"],
ytd-guide-entry-renderer [d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 016.447 15.276 7 7 0 00-12.895 0A9 9 0 0112 3Zm0 2a4 4 0 100 8 4 4 0 000-8Zm0 2a2 2 0 110 4 2 2 0 010-4Zm-.1 9.001L11.899 16a5 5 0 014.904 3.61A8.96 8.96 0 0112 21a8.96 8.96 0 01-4.804-1.391 5 5 0 014.704-3.608Z"],
[d*="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2ZM8 16V4h12v12H8Zm-4 4V6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2H4Zm13-10-5-3v6l5-3Z"] {
d: path("m11 7 6 3.5-6 3.5V7zm7 13H4V6H3v15h15v-1zm3-2H6V3h15v15zM7 17h13V4H7v13z")
}
[d*="M18.37 19.709A9.98 9.98 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.98 9.98 0 003.63 7.709A9.96 9.96 0 0012 22a9.96 9.96 0 006.37-2.291ZM6.15 18.167a6.499 6.499 0 0111.7 0A8.47 8.47 0 0112 20.5a8.47 8.47 0 01-5.85-2.333ZM15.5 9.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z"],
[d*="M12 1C5.925 1 1 5.925 1 12a10.98 10.98 0 004.68 9c1.788 1.258 3.967 2 6.32 2s4.532-.742 6.32-2c.227-.159.447-.325.66-.499v.001A10.98 10.98 0 0023 12c0-6.075-4.925-11-11-11Zm0 4a3.5 3.5 0 110 7 3.5 3.5 0 010-7Zm0 9a7 7 0 016.446 4.276A8.97 8.97 0 0112 21a8.97 8.97 0 01-6.447-2.724 7 7 0 013.768-3.743A6.998 6.998 0 0112 14Z"] {
d: path("M4 20h14v1H3V6h1v14zM21 3v15H6V3h15zm-4 7.5L11 7v7l6-3.5z")
}
/* history */
[d*="M14.203 4.83c-1.74-.534-3.614-.418-5.274.327-1.354.608-2.49 1.6-3.273 2.843H8.25c.414 0 .75.336.75.75s-.336.75-.75.75H3V4.25c0-.414.336-.75.75-.75s.75.336.75.75v2.775c.935-1.41 2.254-2.536 3.815-3.236 1.992-.894 4.241-1.033 6.328-.392 2.088.641 3.87 2.02 5.017 3.878 1.146 1.858 1.578 4.07 1.215 6.223-.364 2.153-1.498 4.1-3.19 5.48-1.693 1.379-3.83 2.095-6.012 2.016-2.182-.08-4.26-.949-5.849-2.447-1.588-1.499-2.578-3.523-2.784-5.697-.039-.412.264-.778.676-.817.412-.04.778.263.818.675.171 1.812.996 3.499 2.32 4.748 1.323 1.248 3.055 1.973 4.874 2.04 1.818.065 3.598-.532 5.01-1.681 1.41-1.15 2.355-2.773 2.657-4.567.303-1.794-.056-3.637-1.012-5.186-.955-1.548-2.44-2.697-4.18-3.231ZM12.75 7.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v4.886l.314.224 3.5 2.5c.337.241.806.163 1.046-.174.241-.337.163-.806-.174-1.046l-3.186-2.276V7.5Z"],
[d*="M8.76 1.487a11 11 0 11-7.54 12.706 1 1 0 011.96-.4 9 9 0 0014.254 5.38A9 9 0 0016.79 4.38 9 9 0 004.518 7H7a1 1 0 010 2H1V3a1 1 0 012 0v2.678a11 11 0 015.76-4.192ZM12 6a1 1 0 00-1 1v5.58l.504.288 3.5 2a1 1 0 10.992-1.736L13 11.42V7a1 1 0 00-1-1Z"] {
d: path("M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.22 3.86 8.51 2 12 2c5.51 0 10 4.49 10 10z")
}
/* playlists */
[d*="M3.75 5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 5 20.25 5H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 9 20.25 9H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-8.5Zm8.5 4c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h8.5Zm3.498-3.572c-.333-.191-.748.05-.748.434v6.276c0 .384.415.625.748.434L22 17l-6.252-3.572Z"],
[d*="M20 4H4a1 1 0 000 2h16a1 1 0 100-2Zm0 4H4a1 1 0 000 2h16a1 1 0 100-2Zm-6 6v-2H4a1 1 0 000 2h10Zm2-1.098v6.211a.5.5 0 00.762.426l5.738-3.532-5.738-3.53a.5.5 0 00-.762.425ZM14 18v-2H4a1 1 0 000 2h10Z"],
[d*="M8 7.697a.25.25 0 01.38-.213l2.87 1.766-2.87 1.766a.25.25 0 01-.38-.213V7.697ZM7 9.5H2a.5.5 0 010-1h5v1Zm3-4a.5.5 0 010 1H2a.5.5 0 010-1h8Zm0-3a.5.5 0 010 1H2a.5.5 0 010-1h8Z"],
[d*="M16 15.395a.5.5 0 01.762-.426L22.5 18.5l-5.738 3.531a.5.5 0 01-.762-.425v-6.212ZM14 19H4a1 1 0 110-2h10v2Zm6-8a1 1 0 110 2H4a1 1 0 110-2h16Zm0-6a1 1 0 110 2H4a1 1 0 010-2h16Z"] {
d: path("M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z")
}
[d*="M4 5c-.552 0-1 .448-1 1s.448 1 1 1h16c.552 0 1-.448 1-1s-.448-1-1-1H4Zm-1 5c0-.552.448-1 1-1h16c.552 0 1 .448 1 1s-.448 1-1 1H4c-.552 0-1-.448-1-1Zm11 3.862c0-.384.415-.625.748-.434L21 17l-6.252 3.573c-.333.19-.748-.05-.748-.435v-6.276ZM4 13c-.552 0-1 .448-1 1s.448 1 1 1h6c.552 0 1-.448 1-1s-.448-1-1-1H4Zm-1 5c0-.552.448-1 1-1h6c.552 0 1 .448 1 1s-.448 1-1 1H4c-.552 0-1-.448-1-1Z"] {
d: path("M15 19v-8l7 4-7 4Zm7-12H2v2h20V7Zm-9 6H2v-2h11v2Zm0 4H2v-2h11v2Z")
}
yt-thumbnail-overlay-badge-view-model svg [d*="M8 7.697a.25.25 0 01.38-.213l2.87 1.766-2.87 1.766a.25.25 0 01-.38-.213V7.697ZM7 9.5H2a.5.5 0 010-1h5v1Zm3-4a.5.5 0 010 1H2a.5.5 0 010-1h8Zm0-3a.5.5 0 010 1H2a.5.5 0 010-1h8Z"] {
transform: scale(0.6) !important
}
/* mixes */
[d*="M3 3.657v16.689a1 1 0 001.466.883L8 19.369V4.632l-3.534-1.86A1 1 0 003 3.657ZM14 7.79l-4-2.105v12.631l4-2.106V7.79ZM22 12l-6-3.157v6.315L22 12Z"] {
d: path("M10.5 14.41V9.6l4.17 2.4-4.17 2.41zM8.48 8.45l-.71-.7C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l.71-.71C7.57 14.64 7 13.39 7 12s.57-2.64 1.48-3.55zm7.75-.7-.71.71c.91.9 1.48 2.15 1.48 3.54s-.57 2.64-1.48 3.55l.71.71C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25zM5.65 5.63l-.7-.71C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l.71-.71C4.02 16.74 3 14.49 3 12s1.02-4.74 2.65-6.37zm13.4-.71-.71.71C19.98 7.26 21 9.51 21 12s-1.02 4.74-2.65 6.37l.71.71C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08z")
}
/* your videos */
[d*="M3.5 5.5h17v13h-17v-13ZM2 5.5C2 4.672 2.672 4 3.5 4h17c.828 0 1.5.672 1.5 1.5v13c0 .828-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.672-1.5-1.5v-13Zm7.748 2.927c-.333-.19-.748.05-.748.435v6.276c0 .384.415.625.748.434L16 12 9.748 8.427Z"],
[d*="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2ZM3 19V5h18v14H3Zm13-7L9.5 8v8l6.5-4Z"] {
d: path("m10 8 6 4-6 4V8zm11-5v18H3V3h18zm-1 1H4v16h16V4z")
}
/* explore */
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm3.73 2.775L9.028 7.604a2 2 0 00-1.405 1.412l-1.811 6.76a2 2 0 002.458 2.448l6.701-1.828a2 2 0 001.406-1.412l1.812-6.761a2.001 2.001 0 00-2.459-2.448ZM9.555 9.533l6.702-1.828-1.812 6.762-6.702 1.826 1.812-6.76Zm1.238 2.143a1.25 1.25 0 102.415.647 1.25 1.25 0 00-2.415-.647Z"] {
d: path("m9.8 9.8-3.83 8.23 8.23-3.83 3.83-8.23L9.8 9.8zm3.28 2.97c-.21.29-.51.48-.86.54-.07.01-.15.02-.22.02-.28 0-.54-.08-.77-.25-.29-.21-.48-.51-.54-.86-.06-.35.02-.71.23-.99.21-.29.51-.48.86-.54.35-.06.7.02.99.23.29.21.48.51.54.86.06.35-.02.7-.23.99zM12 3c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9m0-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z")
}
/* trending (RIP) */
[d*="M19 3.87v9.77C19 17.7 15.86 21 12 21s-7-3.3-7-7.37v-.13c0-1.06.22-2.13.62-3.09.5-1.19 1.29-2.21 2.27-2.97.85-.66 1.83-1.14 2.87-1.65.39-.19.77-.38 1.15-.58.36-.19.72-.38 1.08-.56v3.22l1.55-1.04L19 3.87M20 2l-6 4V3c-.85.44-1.7.88-2.55 1.33-1.41.74-2.9 1.34-4.17 2.32-1.13.87-2.02 2.05-2.58 3.37-.46 1.09-.7 2.29-.7 3.48v.14C4 18.26 7.58 22 12 22s8-3.74 8-8.36V2zM9.45 12.89 14 10v5.7c0 1.82-1.34 3.3-3 3.3s-3-1.47-3-3.3c0-1.19.58-2.23 1.45-2.81z"],
[d*="m14 2-1.5.886-5.195 3.07C4.637 7.533 3 10.401 3 13.5c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5V1l-1.5 1-3 2L14 5V2ZM8.068 7.248l4.432-2.62v3.175l2.332-1.555L18.5 3.803V13.5c0 3.866-3.134 7-7 7s-7-3.134-7-7c0-2.568 1.357-4.946 3.568-6.252ZM9 15c0-1.226.693-2.346 1.789-2.894L15 10v5c0 1.657-1.343 3-3 3s-3-1.343-3-3Z"] {
d: path("M14.72,17.84c-0.32,0.27-0.83,0.53-1.23,0.66c-1.34,0.33-2.41-0.34-2.62-0.46c-0.21-0.11-0.78-0.38-0.78-0.38 s0.35-0.11,0.41-0.13c1.34-0.54,1.89-1.24,2.09-2.11c0.2-0.84-0.16-1.56-0.31-2.39c-0.12-0.69-0.11-1.28,0.12-1.9 c0.02-0.05,0.12-0.43,0.12-0.43s0.11,0.35,0.13,0.41c0.71,1.51,2.72,2.18,3.07,3.84c0.03,0.15,0.05,0.3,0.05,0.46 C15.8,16.3,15.4,17.26,14.72,17.84z M12.4,4.34c-0.12,0.08-0.22,0.15-0.31,0.22c-2.99,2.31-2.91,5.93-2.31,8.55l0.01,0.03l0.01,0.03 c0.06,0.35-0.05,0.7-0.28,0.96c-0.24,0.26-0.58,0.41-0.95,0.41c-0.44,0-0.85-0.2-1.22-0.6c-0.67-0.73-1.17-1.57-1.5-2.46 c-0.36,0.77-0.75,1.98-0.67,3.19c0.04,0.51,0.12,1,0.25,1.43c0.18,0.6,0.43,1.16,0.75,1.65c1.05,1.66,2.88,2.82,4.78,3.05 c0.42,0.05,0.85,0.08,1.26,0.08c1.34,0,3.25-0.27,4.74-1.57c1.77-1.56,2.35-3.99,1.44-6.06c-0.04-0.1-0.06-0.14-0.09-0.19 l-0.04-0.08c-0.21-0.42-0.47-0.81-0.75-1.14c-0.24-0.3-0.48-0.56-0.79-0.83c-0.3-0.27-0.64-0.51-1-0.77 c-0.46-0.33-0.93-0.67-1.38-1.09C12.98,7.83,12.3,6.11,12.4,4.34 M14.41,2c0,0-0.2,0.2-0.56,0.99c-0.66,1.92-0.15,3.95,1.34,5.39 c0.73,0.69,1.61,1.17,2.36,1.84c0.32,0.29,0.62,0.59,0.89,0.93c0.36,0.42,0.66,0.89,0.91,1.38c0.05,0.1,0.1,0.2,0.14,0.3 c1.12,2.55,0.36,5.47-1.73,7.31C16.23,21.47,14.22,22,12.22,22c-0.47,0-0.95-0.03-1.41-0.09c-2.29-0.28-4.42-1.66-5.63-3.57 c-0.39-0.6-0.68-1.26-0.88-1.93c-0.16-0.54-0.25-1.1-0.29-1.67c-0.12-1.88,0.67-3.63,1.08-4.31c0.41-0.69,1.55-2.18,1.55-2.18 s0,0.03-0.01,0.09C6.41,10.11,7,11.88,8.22,13.22c0.15,0.17,0.27,0.22,0.34,0.22c0.06,0,0.09-0.04,0.08-0.09 C7.79,9.59,8.37,6,11.35,3.7c0.59-0.46,1.51-0.94,1.98-1.18C13.8,2.28,14.41,2,14.41,2L14.41,2z")
}
[d*="M14 6V3c-.85.44-1.7.88-2.55 1.33-1.41.74-2.9 1.34-4.17 2.32-1.13.87-2.02 2.05-2.58 3.37-.46 1.09-.7 2.29-.7 3.48v.14C4 18.26 7.58 22 12 22s8-3.74 8-8.36V2l-6 4zm0 9.7c0 1.82-1.34 3.3-3 3.3s-3-1.47-3-3.3c0-1.19.58-2.24 1.45-2.82L14 10v5.7z"],
[d*="M14 2 7.305 5.956C4.637 7.533 3 10.401 3 13.5c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5V1l-6 4V2ZM9 15c0-1.226.693-2.346 1.789-2.894L15 10v5c0 1.657-1.343 3-3 3s-3-1.343-3-3Z"] {
d: path("M19.48,12.83c-0.04-0.1-0.09-0.2-0.14-0.3c-0.25-0.49-0.55-0.96-0.91-1.38c-0.27-0.34-0.57-0.65-0.89-0.93 c-0.75-0.67-1.63-1.14-2.36-1.84c-1.49-1.44-2-3.46-1.34-5.39C14.2,2.2,14.41,2,14.41,2s-0.6,0.28-1.07,0.52 c-0.47,0.24-1.39,0.72-1.98,1.18C8.37,6,7.79,9.59,8.64,13.35c0.01,0.05-0.02,0.09-0.08,0.09c-0.07,0-0.18-0.06-0.34-0.22 C7,11.88,6.41,10.11,6.64,8.35c0.01-0.06,0.01-0.09,0.01-0.09S5.51,9.74,5.1,10.43c-0.41,0.69-1.2,2.43-1.08,4.31 c0.04,0.56,0.13,1.12,0.29,1.67c0.2,0.68,0.49,1.33,0.88,1.93c1.21,1.91,3.34,3.29,5.63,3.57c0.47,0.06,0.94,0.09,1.41,0.09 c2,0,4.01-0.53,5.53-1.87C19.84,18.3,20.6,15.38,19.48,12.83z M14.72,17.84c-0.32,0.27-0.83,0.53-1.23,0.66 c-1.34,0.33-2.41-0.34-2.62-0.46c-0.21-0.11-0.78-0.38-0.78-0.38s0.35-0.11,0.41-0.13c1.34-0.54,1.89-1.24,2.09-2.11 c0.2-0.84-0.16-1.56-0.31-2.39c-0.12-0.69-0.11-1.28,0.12-1.9c0.02-0.05,0.12-0.43,0.12-0.43s0.11,0.35,0.13,0.41 c0.71,1.51,2.72,2.18,3.07,3.84c0.03,0.15,0.05,0.3,0.05,0.46C15.8,16.3,15.4,17.26,14.72,17.84z")
}
/* shopping */
[d*="M12 2.5c-.328 0-.653.065-.957.19-.303.126-.579.31-.81.542-.233.232-.417.508-.543.811-.125.304-.19.629-.19.957v1h5V5c0-.328-.065-.653-.19-.957-.126-.303-.31-.579-.542-.81-.232-.233-.508-.417-.811-.543-.304-.125-.629-.19-.957-.19ZM16 5v1h3.5c.828 0 1.5.672 1.5 1.5V18c0 2.21-1.79 4-4 4H7c-2.21 0-4-1.79-4-4V7.5C3 6.672 3.672 6 4.5 6H8V5c0-.525.103-1.045.304-1.53.201-.486.496-.927.868-1.298.371-.372.812-.667 1.297-.868C10.955 1.104 11.475 1 12 1c.525 0 1.045.103 1.53.304.486.202.927.496 1.298.868.372.371.667.812.867 1.297C15.896 3.955 16 4.475 16 5Zm-4 7.5c-.328 0-.653-.065-.957-.19-.303-.126-.579-.31-.81-.542-.233-.232-.417-.508-.543-.811-.125-.304-.19-.629-.19-.957 0-.414-.336-.75-.75-.75S8 9.586 8 10c0 .525.103 1.045.304 1.53.201.486.496.927.868 1.298.371.372.812.667 1.297.867.486.201 1.006.305 1.531.305.525 0 1.045-.104 1.53-.305.486-.2.927-.495 1.298-.867.372-.371.667-.812.867-1.297.201-.486.305-1.006.305-1.531 0-.414-.336-.75-.75-.75s-.75.336-.75.75c0 .328-.065.653-.19.957-.126.303-.31.579-.542.81-.232.233-.508.417-.811.543-.304.125-.629.19-.957.19Zm-7.5-5h15V18c0 1.38-1.12 2.5-2.5 2.5H7c-1.38 0-2.5-1.12-2.5-2.5V7.5Z"],
[d*="M16 6h4a2 2 0 012 2v10a4 4 0 01-4 4H6a4 4 0 01-4-4V8a2 2 0 012-2h4V4.344l.005-.048C8.195 2.32 10.039 1 12 1c1.96 0 3.805 1.32 3.995 3.296l.005.048V6Zm-6 0h4V4.447C13.906 3.732 13.149 3 12 3s-1.906.732-2 1.447V6ZM4 18a2 2 0 002 2h12a2 2 0 002-2V8H4v10Zm11-9a1 1 0 00-1 1v.553c-.094.715-.851 1.447-2 1.447s-1.906-.732-2-1.447V10a1 1 0 00-2 0v.656l.005.048C8.195 12.68 10.04 14 12 14c1.961 0 3.805-1.32 3.995-3.296l.005-.048V10a1 1 0 00-1-1Z"] {
d: path("M7 8c0 2.76 2.24 5 5 5s5-2.24 5-5h-1c0 2.21-1.79 4-4 4s-4-1.79-4-4H7zm9.9-2c-.46-2.28-2.48-4-4.9-4S7.56 3.72 7.1 6H4v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6h-3.1zM12 3c1.86 0 3.43 1.27 3.87 3H8.13c.44-1.73 2.01-3 3.87-3zm7 17c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V7h14v13z")
}
[d*="M11.235 3.152c.242-.1.502-.152.765-.152s.523.052.765.152c.243.1.463.248.65.434.185.186.332.406.433.649.1.242.152.502.152.765v1h-4V5c0-.263.052-.523.152-.765.1-.243.248-.464.434-.65.185-.185.406-.332.649-.433ZM8 6V5c0-.525.103-1.045.304-1.53.201-.486.496-.927.868-1.298.371-.372.812-.667 1.297-.868C10.955 1.104 11.475 1 12 1c.525 0 1.045.103 1.53.304.486.202.927.496 1.298.868.372.371.667.812.867 1.297C15.896 3.955 16 4.475 16 5v1h3.5c.828 0 1.5.672 1.5 1.5V18c0 2.21-1.79 4-4 4H7c-2.21 0-4-1.79-4-4V7.5C3 6.672 3.672 6 4.5 6H8Zm4 6c-.263 0-.523-.052-.765-.152-.243-.1-.463-.248-.65-.434-.185-.185-.332-.406-.433-.649-.1-.242-.152-.502-.152-.765 0-.552-.448-1-1-1s-1 .448-1 1c0 .525.103 1.045.304 1.53.201.486.496.927.868 1.298.371.372.812.667 1.297.867.486.201 1.006.305 1.531.305.525 0 1.045-.104 1.53-.305.486-.2.927-.495 1.298-.867.372-.371.667-.812.867-1.297.201-.486.305-1.006.305-1.531 0-.552-.448-1-1-1s-1 .448-1 1c0 .263-.052.523-.152.765-.1.243-.248.463-.434.65-.185.185-.406.332-.649.433-.242.1-.502.152-.765.152Z"],
[d*="M16 6V4.344l-.005-.048C15.805 2.32 13.96 1 12 1c-1.961 0-3.805 1.32-3.995 3.296L8 4.344V6H4a2 2 0 00-2 2v10a4 4 0 004 4h12a4 4 0 004-4V8a2 2 0 00-2-2h-4Zm-6 0V4.447C10.094 3.732 10.851 3 12 3s1.906.732 2 1.447V6h-4Zm5 3a1 1 0 011 1v.656l-.005.048C15.805 12.68 13.96 14 12 14c-1.961 0-3.805-1.32-3.995-3.296L8 10.656V10a1 1 0 012 0v.553c.094.715.851 1.447 2 1.447s1.906-.732 2-1.447V10a1 1 0 011-1Z"] {
d: path("M16.9 6c-.46-2.28-2.48-4-4.9-4S7.56 3.72 7.1 6H4v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6h-3.1zM12 3c1.86 0 3.43 1.27 3.87 3H8.13c.44-1.73 2.01-3 3.87-3zm0 11c-3.31 0-6-2.69-6-6h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 3.31-2.69 6-6 6z")
}
/* music */
[d*="M19 3c0-.271-.146-.521-.383-.654-.237-.133-.527-.127-.758.014l-9 5.5c-.223.136-.359.379-.359.64v7.901C8.059 16.146 7.546 16 7 16c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3v-7.08l7.5-4.583v6.064c-.441-.255-.954-.401-1.5-.401-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3Zm-1.5 13c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5Zm-9 3c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5Zm9-13.42L10 10.162V8.92l7.5-4.584V5.58Z"],
[d*="M11 2.766v10.99a4.5 4.5 0 101.994 3.976L13 17.5V9.2l5.485 3.292A1 1 0 0020 11.634V6.966a1 1 0 00-.485-.857l-7-4.2A1 1 0 0011 2.766Zm2 4.102V4.533l5 3v2.335l-5-3ZM8.5 15a2.5 2.5 0 110 5.001A2.5 2.5 0 018.5 15Z"] {
d: path("M12 4v9.38c-.73-.84-1.8-1.38-3-1.38-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V8h6V4h-7zM9 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm9-12h-5V5h5v2z")
}
[d*="M18.49 2.128A1 1 0 0119 3v13a3 3 0 11-2-2.83V7.784l-7 4.278V19a3 3 0 11-2-2.83V8.5a1 1 0 01.479-.853l9-5.5a1 1 0 011.01-.02Z"],
[d*="M12.514 1.909A1 1 0 0011 2.766v10.992a4.5 4.5 0 102 3.742V9.2l5.485 3.291A1 1 0 0020 11.634V6.966a1 1 0 00-.485-.857l-7-4.2h-.001Z"] {
d: path("M12 4v9.38c-.73-.84-1.8-1.38-3-1.38-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V8h6V4h-7z")
}
/* movies */
[d*="m22.01 4.91-.5-2.96L1.64 5.19 2 8v13h20V8H3.06l18.95-3.09zM5 9l1 3h3L8 9h2l1 3h3l-1-3h2l1 3h3l-1-3h3v11H3V9h2z"],
[d*="m3.116 5.998 16.79-2.66.157.988-16.79 2.66-.157-.988Zm-1.481.235c-.13-.819.428-1.587 1.247-1.717l16.79-2.659c.819-.13 1.587.429 1.716 1.247l.157.988.234 1.481-1.481.235L6.463 7.999H22v11.5c0 .829-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.671-1.5-1.5V8.539L1.79 7.22l-.156-.987Zm7.698 3.266h-2L9 11.999H6l-1.667-2.5H3.5v10h17v-10h-3.167L19 12h-3l-1.667-2.501h-2L14 12h-3L9.333 9.499Z"],
[d*="M20 3H4a3 3 0 00-2.587 1.485l-.001.003-.01.015-.072.133-.037.077a3.046 3.046 0 00-.264.869l-.002.011-.011.1-.005.063-.005.06A3.004 3.004 0 001 6v12a3 3 0 003 3h16a3 3 0 003-3V6a3 3 0 00-3-3ZM4 5h1.986l2 2-2 2H3v-.686L4.313 7 3.04 5.725A1 1 0 014 5Zm13.315 2-2-2h3.67l2 2-2 2h-3.67l2-2Zm-6.5 0L8.814 5h3.672l2 2-2 2H8.815l2-2ZM3 18v-7h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1Z"] {
d: path("M4,21H3V3h1V21z M8,15H6v2h2V15z M8,11H6v2h2V11z M8,7H6v2h2V7z M18,15h-2v2h2V15z M8,19H6v2h2V19z M18,19h-2v2h2V19z M18,11h-2v2h2V11z M18,7h-2v2h2V7z M8,3H6v2h2V3z M18,3h-2v2h2V3z M21,3h-1v18h1V3z")
}
[d*="m22.01 4.91-.5-2.96L1.64 5.19 2 8v13h20V8H3.06l18.95-3.09zM18 9l1 3h-3l-1-3h3zm-5 0 1 3h-3l-1-3h3zM8 9l1 3H6L5 9h3z"],
[d*="M5.636 5.636c.293-.293.293-.768 0-1.06-.293-.294-.768-.294-1.06 0-.976.974-1.75 2.132-2.277 3.406C1.772 9.256 1.5 10.622 1.5 12c0 1.379.272 2.744.8 4.018.527 1.274 1.3 2.432 2.275 3.407.293.293.768.293 1.061 0 .293-.293.293-.768 0-1.061-.836-.836-1.499-1.828-1.95-2.92C3.232 14.352 3 13.182 3 12s.233-2.352.685-3.444c.452-1.092 1.115-2.084 1.951-2.92Zm2.828 1.768c.293.292.293.767 0 1.06-.464.464-.832 1.016-1.083 1.622C7.129 10.693 7 11.343 7 12c0 .656.13 1.306.38 1.913.252.607.62 1.158 1.084 1.622.293.293.293.768 0 1.06-.292.294-.767.294-1.06 0-.604-.603-1.083-1.32-1.41-2.108C5.669 13.7 5.5 12.853 5.5 12c0-.854.168-1.7.495-2.488.326-.788.805-1.505 1.409-2.108.293-.293.768-.293 1.06 0Zm7.072 0c.292-.293.767-.293 1.06 0C17.816 8.623 18.5 10.276 18.5 12c0 1.724-.685 3.377-1.904 4.596-.293.293-.768.293-1.06 0-.293-.293-.293-.768 0-1.06C16.473 14.597 17 13.325 17 12s-.527-2.598-1.464-3.536c-.293-.293-.293-.768 0-1.06Zm2.828-2.829c.293-.293.768-.293 1.06 0C21.395 6.545 22.5 9.215 22.5 12s-1.106 5.456-3.075 7.425c-.293.293-.768.293-1.061 0-.293-.293-.293-.768 0-1.061C20.052 16.676 21 14.387 21 12s-.948-4.676-2.636-6.364c-.293-.293-.293-.768 0-1.06ZM12 14c1.105 0 2-.895 2-2 0-1.104-.895-2-2-2s-2 .896-2 2c0 1.105.895 2 2 2Z"],
[d*="M20 3H4a3 3 0 00-3 3v12a3 3 0 003 3h16a3 3 0 003-3V6a3 3 0 00-3-3ZM4 5h1.986l2 2-2 2H3v-.686L4.313 7 3.04 5.725A1 1 0 014 5Zm11.314 0h3.671l2 2-2 2h-3.671l2-2-2-2Zm-6.5 0h3.672l2 2-2 2H8.814l2-2-2-2Z"] {
d: path("M18,3v2h-2V3H8v2H6V3H3v18h3v-2h2v2h8v-2h2v2h3V3H18z M8,17H6v-2h2V17z M8,13H6v-2h2V13z M8,9H6V7h2V9z M18,17h-2v-2h2V17z M18,13h-2v-2h2V13z M18,9h-2V7h2V9z")
}
/* live */
[d*="M5.636 5.636c.293-.293.293-.768 0-1.06-.293-.294-.768-.294-1.06 0-.976.974-1.75 2.132-2.277 3.406C1.772 9.256 1.5 10.622 1.5 12c0 1.379.272 2.744.8 4.018.527 1.274 1.3 2.432 2.275 3.407.293.293.768.293 1.061 0 .293-.293.293-.768 0-1.061-.836-.836-1.499-1.828-1.95-2.92C3.232 14.352 3 13.182 3 12s.233-2.352.685-3.444c.452-1.092 1.115-2.084 1.951-2.92Zm2.828 1.768c.293.292.293.767 0 1.06-.464.464-.832 1.016-1.083 1.622C7.129 10.693 7 11.343 7 12c0 .656.13 1.306.38 1.913.252.607.62 1.158 1.084 1.622.293.293.293.768 0 1.06-.292.294-.767.294-1.06 0-.604-.603-1.083-1.32-1.41-2.108C5.669 13.7 5.5 12.853 5.5 12c0-.854.168-1.7.495-2.488.326-.788.805-1.505 1.409-2.108.293-.293.768-.293 1.06 0Zm7.072 0c.292-.293.767-.293 1.06 0C17.816 8.623 18.5 10.276 18.5 12c0 1.724-.685 3.377-1.904 4.596-.293.293-.768.293-1.06 0-.293-.293-.293-.768 0-1.06C16.473 14.597 17 13.325 17 12s-.527-2.598-1.464-3.536c-.293-.293-.293-.768 0-1.06Zm2.828-2.829c.293-.293.768-.293 1.06 0C21.395 6.545 22.5 9.215 22.5 12s-1.106 5.456-3.075 7.425c-.293.293-.768.293-1.061 0-.293-.293-.293-.768 0-1.061C20.052 16.676 21 14.387 21 12s-.948-4.676-2.636-6.364c-.293-.293-.293-.768 0-1.06ZM12 14c1.105 0 2-.895 2-2 0-1.104-.895-2-2-2s-2 .896-2 2c0 1.105.895 2 2 2Z"],
[d*="M4.222 4.223a11 11 0 000 15.555 1 1 0 101.414-1.414 9 9 0 010-12.727 1 1 0 10-1.414-1.414Zm13.79.353a1 1 0 000 1.414 8.5 8.5 0 010 12.022 1 1 0 001.413 1.414 10.501 10.501 0 000-14.85 1 1 0 00-1.413 0Zm-2.83 2.827a1 1 0 000 1.414 4.501 4.501 0 010 6.365 1.001 1.001 0 001.414 1.414 6.5 6.5 0 000-9.193 1 1 0 00-1.415 0Zm-7.78 0a6.5 6.5 0 000 9.194 1 1 0 001.415-1.415 4.5 4.5 0 010-6.364 1.001 1.001 0 00-1.415-1.415ZM12 10a2 2 0 100 4 2 2 0 000-4Z"] {
d: path("M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8.48 8.45l-.71-.7C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l.71-.71C7.57 14.64 7 13.39 7 12s.57-2.64 1.48-3.55zm7.75-.7-.71.71c.91.9 1.48 2.15 1.48 3.54s-.57 2.64-1.48 3.55l.71.71C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25zM5.65 5.63l-.7-.71C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l.71-.71C4.02 16.74 3 14.49 3 12s1.02-4.74 2.65-6.37zm13.4-.71-.71.71C19.98 7.26 21 9.51 21 12s-1.02 4.74-2.65 6.37l.71.71C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08z")
}
[d*="M5.99 5.99c.39-.391.39-1.024 0-1.415-.39-.39-1.024-.39-1.415 0C3.6 5.55 2.827 6.708 2.3 7.982 1.772 9.256 1.5 10.622 1.5 12c0 1.379.272 2.744.8 4.018.527 1.274 1.3 2.432 2.275 3.407.39.39 1.024.39 1.415 0 .39-.39.39-1.024 0-1.415-.79-.789-1.416-1.726-1.843-2.757C3.72 14.222 3.5 13.116 3.5 12s.22-2.222.647-3.253C4.574 7.716 5.2 6.78 5.99 5.99Zm2.828 1.414c.39.39.39 1.023 0 1.414-.418.418-.75.914-.975 1.46-.227.546-.343 1.13-.343 1.722 0 .59.116 1.176.343 1.722.226.546.557 1.042.975 1.46.39.39.39 1.023 0 1.414-.39.39-1.024.39-1.414 0-.604-.604-1.083-1.32-1.41-2.109C5.669 13.698 5.5 12.853 5.5 12c0-.854.168-1.7.495-2.488.326-.788.805-1.505 1.409-2.108.39-.391 1.024-.391 1.414 0Zm6.364 0c.39-.391 1.024-.391 1.414 0C17.816 8.623 18.5 10.276 18.5 12c0 1.724-.685 3.377-1.904 4.596-.39.39-1.024.39-1.414 0-.39-.39-.39-1.024 0-1.414.844-.844 1.318-1.989 1.318-3.182 0-1.194-.474-2.338-1.318-3.182-.39-.39-.39-1.024 0-1.414Zm2.828-2.829c.39-.39 1.024-.39 1.415 0C21.394 6.545 22.5 9.215 22.5 12s-1.106 5.456-3.075 7.425c-.39.39-1.024.39-1.415 0-.39-.39-.39-1.024 0-1.415 1.595-1.594 2.49-3.756 2.49-6.01s-.895-4.416-2.49-6.01c-.39-.391-.39-1.024 0-1.415ZM12 14.5c1.38 0 2.5-1.12 2.5-2.5S13.38 9.5 12 9.5 9.5 10.62 9.5 12s1.12 2.5 2.5 2.5Z"] {
d: path("M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM6.36 6.33 4.95 4.92C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l1.41-1.41C4.9 16.22 4 14.21 4 12s.9-4.22 2.36-5.67zm12.69-1.41-1.41 1.41C19.1 7.78 20 9.79 20 12s-.9 4.22-2.36 5.67l1.41 1.41C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08zM9.19 9.16 7.77 7.75C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l1.41-1.41C8.46 14.11 8 13.11 8 12s.46-2.11 1.19-2.84zm7.04-1.41-1.41 1.41C15.54 9.89 16 10.89 16 12s-.46 2.11-1.19 2.84l1.41 1.41C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25z")
}
/* gaming */
[d*="m12 7.75-.772-.464-4.186-2.511L2.5 7.803v6.307L12 19.29l9.5-5.181V7.803l-4.542-3.028-4.186 2.511L12 7.75ZM12 6 7.814 3.488c-.497-.298-1.122-.283-1.604.039L1.668 6.555C1.251 6.833 1 7.3 1 7.803v6.307c0 .548.3 1.054.782 1.316l9.5 5.182c.447.244.989.244 1.436 0l9.5-5.182c.482-.262.782-.768.782-1.316V7.803c0-.502-.25-.97-.668-1.248L17.79 3.527c-.482-.322-1.107-.337-1.604-.039L12 6Zm3.5 6.25c0 .69-.56 1.25-1.25 1.25S13 12.94 13 12.25 13.56 11 14.25 11s1.25.56 1.25 1.25ZM7 8c-.414 0-.75.336-.75.75v1.5h-1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.5v1.5c0 .414.336.75.75.75s.75-.336.75-.75v-1.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.5v-1.5C7.75 8.336 7.414 8 7 8Zm10.75 3c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z"],
[d*="M15.97 2.615 12 4.998 8.03 2.615a2 2 0 00-2.06 0l-5 3A2 2 0 000 7.33v7.34a2 2 0 00.97 1.715l10 6c.634.38 1.426.38 2.06 0l10-6A1.998 1.998 0 0024 14.67V7.33a2 2 0 00-.97-1.715l-5-3a2 2 0 00-2.06 0ZM12 7.33l5-3 5 3v7.34l-10 6-10-6V7.33l5-3 5 3ZM7 7.5a1 1 0 00-1 1v1.502H4.5a1 1 0 000 2H6V13.5a1 1 0 102 0v-1.498h1.5a1 1 0 000-2H8V8.5a1 1 0 00-1-1Zm11.5 1.502a1.5 1.5 0 100 3 1.5 1.5 0 000-3Zm-4 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3Z"] {
d: path("M10 12H8v2H6v-2H4v-2h2V8h2v2h2v2zm7 .5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm3-3c0-.83-.67-1.5-1.5-1.5S17 8.67 17 9.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm-3.03-4.35-4.5 2.53-.49.27-.49-.27-4.5-2.53L3 7.39v6.43l8.98 5.04 8.98-5.04V7.39l-3.99-2.24m0-1.15 4.99 2.8v7.6L11.98 20 2 14.4V6.8L6.99 4l4.99 2.8L16.97 4z")
}
[d*="M1 7.803c0-.502.25-.97.668-1.248L6.21 3.527c.482-.322 1.107-.337 1.604-.039L12 6l4.186-2.512c.497-.298 1.122-.283 1.604.039l4.542 3.028c.417.278.668.746.668 1.248v6.307c0 .549-.3 1.054-.782 1.316l-9.5 5.182c-.447.244-.989.244-1.436 0l-9.5-5.182C1.3 15.164 1 14.658 1 14.11V7.803ZM16 12.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5Zm-9-5c-.552 0-1 .448-1 1V10H4.5c-.552 0-1 .448-1 1 0 .553.448 1 1 1H6v1.5c0 .553.448 1 1 1s1-.447 1-1V12h1.5c.552 0 1-.447 1-1 0-.552-.448-1-1-1H8V8.5c0-.552-.448-1-1-1ZM18.5 11c.828 0 1.5-.672 1.5-1.5S19.328 8 18.5 8 17 8.672 17 9.5s.672 1.5 1.5 1.5Z"],
[d*="M15.97 2.615 12 4.998 8.03 2.615a2 2 0 00-2.06 0l-5 3A2 2 0 000 7.33v7.34a2 2 0 00.97 1.715l10 6c.634.38 1.426.38 2.06 0l10-6A1.998 1.998 0 0024 14.67V7.33a2 2 0 00-.97-1.715l-5-3a2 2 0 00-2.06 0ZM7 7.5a1 1 0 011 1v1.502h1.5a1 1 0 010 2H8V13.5a1 1 0 11-2 0v-1.498H4.5a1 1 0 010-2H6V8.5a1 1 0 011-1Zm11.5 1.502a1.5 1.5 0 110 3 1.5 1.5 0 010-3Zm-4 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3Z"] {
d: path("m16.97 4-4.99 2.8L6.99 4 2 6.8v7.6l9.98 5.6 9.98-5.6V6.8L16.97 4zM10 12H8v2H6v-2H4v-2h2V8h2v2h2v2zm5.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 8 18.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z")
}
/* news */
[d*="M2 5.121V3l.94.94.56.56.5.5.94-.94.12-.12L6 3l.94.94.12.12L8 5l.94-.94.12-.12L10 3l.94.94.12.12L12 5l.94-.94.12-.12L14 3l.94.94.12.12L16 5l.94-.94.12-.12L18 3l.94.94.12.12L20 5l.5-.5.56-.56L22 3v16c0 1.105-.895 2-2 2H4c-1.105 0-2-.895-2-2V5.121ZM10.75 19.5h-4.5v-5.25h4.5v5.25Zm1.25 0V13H5v6.5H4c-.276 0-.5-.224-.5-.5V7.65l2.514-2.514.925.925L8 7.12l1.06-1.06.94-.94.94.94L12 7.12l1.06-1.06.94-.94.94.94L16 7.12l1.06-1.06.926-.925L20.5 7.65V19c0 .276-.224.5-.5.5h-8ZM19 9v2H5V9h14Zm-5 4h5v1.5h-5V13Zm5 3h-5v1.5h5V16Z"],
[d*="M23 17V3H1v14a4 4 0 004 4h14a4 4 0 004-4ZM3 17V5h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2ZM18 7H6a1 1 0 000 2h12a1 1 0 100-2Zm0 4h-3a1 1 0 000 2h3a1 1 0 000-2Zm-7 0H6a1 1 0 00-1 1v4a1 1 0 001 1h5a1 1 0 001-1v-4a1 1 0 00-1-1Zm-4 4v-2h3v2H7Zm11 0h-3a1 1 0 000 2h3a1 1 0 000-2Z"] {
d: path("M11 11v6H7v-6h4m1-1H6v8h6v-8zM3 3.03V21h14l4-4V3.03M20 4v11.99l-.01.01H16v3.99l-.01.01H4V4h16zm-2 4H6V6h12v2zm0 7h-5v-2h5v2zm0-3h-5v-2h5v2z")
}
[d*="M2 3v16c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V3l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2Zm17 5v3H5V8h14Zm-7 5H5v6h7v-6Zm2 0h5v2h-5v-2Zm5 4h-5v2h5v-2Z"],
[d*="M23 17V3H1v14a4 4 0 004 4h14a4 4 0 004-4ZM6 7h12a1 1 0 110 2H6a1 1 0 010-2Zm9 4h3a1 1 0 010 2h-3a1 1 0 010-2Zm-9 0h5a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4a1 1 0 011-1Zm9 4h3a1 1 0 010 2h-3a1 1 0 010-2Z"] {
d: path("M3 3.03V21h14l4-4V3.03H3zM6 6h12v2H6V6zm7 9v-2h5v2h-5zm0-3v-2h5v2h-5zm-1 6H6v-8h6v8zm4-2h3.99L16 19.99V16")
}
/* sports */
[d*="M6.5 3.5h11V9c0 3.038-2.462 5.5-5.5 5.5S6.5 12.038 6.5 9V3.5ZM5 3.5C5 2.672 5.672 2 6.5 2h11c.828 0 1.5.672 1.5 1.5V4h2c.552 0 1 .448 1 1v3c0 2.493-1.825 4.56-4.212 4.938-1.082 1.588-2.8 2.707-4.788 2.991V17.5h1.5c.828 0 1.5.672 1.5 1.5v3H8v-3c0-.828.672-1.5 1.5-1.5H11v-1.57c-1.987-.285-3.706-1.404-4.788-2.992C3.825 12.56 2 10.493 2 8V5c0-.552.448-1 1-1h2v-.5Zm0 1.75H3.25V8c0 1.508.89 2.808 2.174 3.403C5.15 10.654 5 9.845 5 9V5.25Zm13.576 6.153C19.86 10.808 20.75 9.508 20.75 8V5.25H19V9c0 .844-.15 1.654-.424 2.403ZM9.5 20.5V19h5v1.5h-5Z"],
[d*="M17.5 1h-11A1.5 1.5 0 005 2.5V4H2a1 1 0 00-1 1v3a5 5 0 004.669 4.987 7.01 7.01 0 004.72 3.826l-2.926 4.655A1 1 0 008.31 23h7.38a1 1 0 00.847-1.532l-2.927-4.657a7.01 7.01 0 004.72-3.824A5 5 0 0023 8V5a1 1 0 00-1-1h-3V2.5A1.5 1.5 0 0017.5 1ZM7 10V3h10v7a5 5 0 11-10 0ZM3 8V6h2v4c0 .283.017.565.052.845A3 3 0 013 8Zm16 2V6h2v2a3 3 0 01-2.053 2.845c.034-.277.052-.559.053-.845Zm-8.88 11L12 18.008 13.88 21h-3.76Z"] {
d: path("M18 5V2H6v3H3v6l3.23 1.61c.7 2.5 2.97 4.34 5.69 4.38L8 19v3h8v-3l-3.92-2.01c2.72-.04 4.99-1.88 5.69-4.38L21 11V5h-3zM6 11.38l-2-1V6h2v5.38zM15 21H9v-1.39l3-1.54 3 1.54V21zm2-10c0 2.76-2.24 5-5 5s-5-2.24-5-5V3h10v8zm3-.62-2 1V6h2v4.38z")
}
[d*="M6.5 2C5.672 2 5 2.672 5 3.5V4H3c-.552 0-1 .448-1 1v3c0 2.493 1.825 4.56 4.212 4.938 1.082 1.588 2.8 2.707 4.788 2.991V18.5H9.5c-.828 0-1.5.672-1.5 1.5v2h8v-2c0-.828-.672-1.5-1.5-1.5H13v-2.57c1.988-.285 3.706-1.404 4.788-2.992C20.175 12.56 22 10.493 22 8V5c0-.552-.448-1-1-1h-2v-.5c0-.828-.672-1.5-1.5-1.5h-11ZM19 5.25V9c0 .844-.15 1.654-.424 2.403C19.86 10.808 20.75 9.508 20.75 8V5.25H19ZM5.424 11.403C5.15 10.654 5 9.845 5 9V5.25H3.25V8c0 1.508.89 2.808 2.174 3.403Z"],
[d*="M17.5 1h-11A1.5 1.5 0 005 2.5V4H2a1 1 0 00-1 1v3a5 5 0 004.669 4.987 7.01 7.01 0 004.721 3.824l-2.927 4.657A1 1 0 008.31 23h7.38a1 1 0 00.847-1.532l-2.927-4.657a7 7 0 004.72-3.824A5 5 0 0023 8V5a1 1 0 00-1-1h-3V2.5A1.5 1.5 0 0017.5 1ZM3 8V6h2v4c0 .283.017.565.052.845A3 3 0 013 8Zm16 2V6h2v2a3 3 0 01-2.053 2.845c.034-.277.052-.559.053-.845Z"] {
d: path("M18 5V2H6v3H3v6l3.23 1.61c.7 2.5 2.97 4.34 5.69 4.38L8 19v3h8v-3l-3.92-2.01c2.72-.04 4.99-1.88 5.69-4.38L21 11V5h-3zM6 11.38l-2-1V6h2v5.38zm14-1-2 1V6h2v4.38z")
}
/* learning */
[d*="m14.5 16.065.749-.434C17.196 14.505 18.5 12.404 18.5 10c0-3.59-2.91-6.5-6.5-6.5S5.5 6.41 5.5 10c0 2.404 1.304 4.505 3.251 5.631l.749.434V17.5h5v-1.435Zm1.5.865c2.391-1.383 4-3.969 4-6.93 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.961 1.609 5.546 4 6.93V19h8v-2.07ZM16 20v.5c0 .552-.448 1-1 1h-1.063c-.024.09-.053.179-.09.265-.1.243-.247.463-.433.65-.185.185-.406.332-.649.433-.242.1-.502.152-.765.152s-.523-.052-.765-.152c-.243-.1-.463-.248-.65-.434-.185-.186-.332-.406-.433-.649-.036-.086-.065-.175-.088-.265H9c-.552 0-1-.448-1-1V20h8Z"],
[d*="M16 18a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1.07a8 8 0 118 0V18Zm-1.002-2.802a6 6 0 10-5.997 0l.999.578V18h4v-2.224l.998-.578Zm-1.584 7.216A2 2 0 0014 21h-4a2 2 0 003.414 1.414Z"] {
d: path("M16 21h-2.28c-.35.6-.98 1-1.72 1s-1.38-.4-1.72-1H8v-1h8v1zm4-11c0 2.96-1.61 5.54-4 6.92V19H8v-2.08C5.61 15.54 4 12.96 4 10c0-4.42 3.58-8 8-8s8 3.58 8 8zm-5 8v-1.66l.5-.29C17.66 14.8 19 12.48 19 10c0-3.86-3.14-7-7-7s-7 3.14-7 7c0 2.48 1.34 4.8 3.5 6.06l.5.28V18h6z")
}
[d*="M16 16.93c2.391-1.383 4-3.969 4-6.93 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.961 1.609 5.546 4 6.93V19h8v-2.07ZM16 20v.5c0 .552-.448 1-1 1h-1.063c-.024.09-.053.179-.09.265-.1.243-.247.463-.433.65-.185.185-.406.332-.649.433-.242.1-.502.152-.765.152s-.523-.052-.765-.152c-.243-.1-.463-.248-.65-.434-.185-.186-.332-.406-.433-.649-.036-.086-.065-.175-.088-.265H9c-.552 0-1-.448-1-1V20h8Z"],
[d*="M16 16.93a8 8 0 10-8 0V18a2 2 0 002 2h4a2 2 0 002-2v-1.07ZM14 21h-4a2 2 0 004 0Z"] {
d: path("M16 21h-2.28c-.35.6-.98 1-1.72 1s-1.38-.4-1.72-1H8v-1h8v1zm4-11c0 2.96-1.61 5.54-4 6.92V19H8v-2.08C5.61 15.54 4 12.96 4 10c0-4.42 3.58-8 8-8s8 3.58 8 8z")
}
/* courses */
[d*="M11.271 2.689a1.5 1.5 0 011.457 0l9 5A1.5 1.5 0 0122.5 9v7a.75.75 0 01-1.5 0v-5.284l-1.5.833V17a.75.75 0 01-.741.75c-1.9.023-3.076.4-3.941.896-.71.407-1.229.895-1.817 1.448-.159.149-.322.302-.496.46a.75.75 0 01-1.046-.034l-.076-.08c-.702-.73-1.303-1.355-2.164-1.832-.875-.485-2.074-.84-3.976-.858A.75.75 0 014.5 17v-5.45l-2.228-1.24a1.5 1.5 0 010-2.622l9-5ZM6 12.383v3.891c1.703.096 2.946.468 3.946 1.022.858.475 1.508 1.07 2.08 1.652.575-.54 1.221-1.13 2.046-1.603.988-.566 2.215-.963 3.928-1.068v-3.894l-5.272 2.928a1.5 1.5 0 01-1.457 0L6 12.383ZM12 4l9 5-9 5-9-5 9-5Z"],
[d*="M11.485 2.143 1.486 8.148a1 1 0 000 1.715L5 11.968v4.957a2 2 0 00.992 1.73l5.504 3.21a1 1 0 001.008 0l5.504-3.212A2 2 0 0019 16.926V11.97l2-1.2V18a1 1 0 002 0V9a1 1 0 00-.485-.852l-10-6.005a1 1 0 00-1.03 0ZM3.944 9.005 12 4.167l8.057 4.837L12 13.834l-8.056-4.83Zm8.57 6.852L17 13.167v3.759l-5 2.917-5-2.917v-3.758l4.486 2.69a1 1 0 001.028-.001Z"] {
d: path("M22 9.71 12 4 2 9.71l3.5 2v5.57l6.5 3.71 6.5-3.65v-5.63l2.5-1.43v6.46h1V9.71zm-4.5 7.04L12 19.84 6.5 16.7v-4.42l5.5 3.14 5.5-3.14v4.47zM12 14.27 4.02 9.71 12 5.15l7.98 4.56L12 14.27z")
}
[d*="M11.485 2.143 1.486 8.148a1 1 0 000 1.715l10 5.994a1 1 0 001.028 0L21 10.77V18a1 1 0 002 0V9a1 1 0 00-.485-.852l-10-6.005a1 1 0 00-1.03 0ZM19 16.926V14.3l-5.458 3.27a3 3 0 01-3.084 0L5 14.3v2.625a2 2 0 00.992 1.73l5.504 3.21a1 1 0 001.008 0l5.504-3.212A2 2 0 0019 16.926Z"] {
d: path("M12.728 2.689a1.5 1.5 0 00-1.457 0l-9 5a1.5 1.5 0 000 2.622l9 5a1.5 1.5 0 001.457 0L21 10.716V16a.75.75 0 001.5 0V9a1.5 1.5 0 00-.771-1.311l-9-5ZM4.5 17v-3.734l6.043 3.357a3 3 0 002.914 0l6.043-3.357V17a.75.75 0 01-.741.75c-1.9.023-3.076.401-3.941.897-.71.407-1.229.894-1.817 1.447-.159.149-.322.303-.496.46a.75.75 0 01-1.046-.034l-.076-.08c-.702-.73-1.303-1.355-2.164-1.831-.875-.485-2.074-.84-3.976-.859A.75.75 0 014.5 17Z")
}
/* fashion */
[d*="M11.58 2.03c.545-.078 1.1-.003 1.606.214.506.218.942.57 1.26 1.02.319.448.508.976.547 1.525.038.55-.075 1.099-.328 1.588-.252.489-.634.899-1.104 1.185-.254.154-.527.27-.81.343v.705l7.18 5.026c.267.187.383.527.284.84-.098.312-.388.524-.715.524H18v3c0 .552-.448 1-1 1h-2v3h-1v-1h-1v1h-1v-1h-1v1h-1v-1H9v1H8v-1H7v1H6v-7H4.5c-.327 0-.617-.212-.715-.524-.099-.313.017-.653.285-.84l7.18-5.026V7.25c0-.414.336-.75.75-.75.275 0 .545-.076.78-.219.235-.143.427-.348.553-.593.126-.244.183-.519.163-.793-.019-.275-.114-.539-.273-.763-.16-.225-.377-.4-.63-.51-.253-.109-.53-.146-.803-.107-.272.038-.53.151-.742.326-.213.174-.373.404-.464.664-.137.391-.564.597-.955.46-.391-.136-.598-.564-.461-.955.182-.52.503-.98.928-1.328.425-.35.939-.575 1.484-.652ZM15 15h1.5v2.5H15V15Zm2.12-1.5H6.88L12 9.915l5.12 3.585ZM7.5 15h6v4.5h-6V15Z"],
[d*="M11.545 2.782a3.25 3.25 0 00-2.613 2.145 1 1 0 101.888.66 1.25 1.25 0 011.005-.825A1.251 1.251 0 1112 7.25a1 1 0 00-1 1v2.214l-7.56 5.04C.973 17.15 2.138 21 5.106 21h14.38c3.02 0 4.147-3.957 1.582-5.55L13 10.444V9.092a3.25 3.25 0 00-1.455-6.31ZM4.55 17.168l7.468-4.98 7.994 4.962c.855.53.478 1.85-.528 1.85H5.104c-.99 0-1.377-1.283-.554-1.832Z"] {
d: path("M12.5 6.44v-.5C13.36 5.71 14 4.93 14 4c0-1.1-.9-2-2-2s-2 .9-2 2h1c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1h-.5v1.44L4 13h2v6h1v2h1v-2h2v3h1v-3h2v2h1v-2h1v-3h3v-3h2l-7.5-6.56zM6.66 12 12 7.33 17.34 12H6.66zM14 18H7v-5h7v5zm1-3v-2h2v2h-2z")
}
[d*="M11.545 2.78a3.25 3.25 0 00-2.613 2.147 1 1 0 001.888.66A1.25 1.25 0 1112 7.25a1 1 0 00-1 1v2.214l-7.558 5.04C.972 17.15 2.138 21 5.106 21h14.38c3.018 0 4.146-3.957 1.582-5.55L13 10.444V9.09a3.25 3.25 0 00-1.455-6.31ZM4.551 17.169h.001l7.468-4.978 7.993 4.96c.854.53.478 1.85-.527 1.85H5.106c-.99 0-1.378-1.283-.555-1.832ZM19.486 18l-7.447-4.622L5.106 18h14.38Z"] {
d: path("M12.5 6.44v-.5C13.36 5.71 14 4.93 14 4c0-1.1-.9-2-2-2s-2 .9-2 2h1c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1h-.5v1.44L4 13h2v6h1v2h1v-2h2v3h1v-3h2v2h1v-2h1v-3h3v-3h2l-7.5-6.56zM6.66 12 12 7.33 17.34 12H6.66z")
}
/* podcasts */
[d*="M7.278 4.933C8.675 3.999 10.318 3.5 12 3.5c1.681 0 3.325.499 4.722 1.433 1.398.934 2.488 2.261 3.13 3.814.644 1.553.813 3.262.485 4.911-.328 1.65-1.138 3.164-2.327 4.352-.293.293-.293.768 0 1.061.293.293.768.293 1.061 0 1.399-1.399 2.351-3.18 2.737-5.12.386-1.94.188-3.95-.57-5.778-.756-1.827-2.038-3.389-3.682-4.488C15.91 2.586 13.978 2 12 2c-1.978 0-3.911.586-5.556 1.685-1.644 1.1-2.926 2.66-3.683 4.488-.757 1.827-.955 3.838-.569 5.778.386 1.94 1.338 3.721 2.737 5.12.293.293.768.293 1.06 0 .293-.293.293-.768 0-1.06-1.188-1.19-1.998-2.704-2.326-4.353-.328-1.649-.16-3.358.484-4.91.643-1.554 1.733-2.881 3.13-3.815ZM12 7.5c-.89 0-1.76.264-2.5.758-.74.495-1.317 1.198-1.657 2.02-.341.822-.43 1.727-.257 2.6.174.873.603 1.675 1.232 2.304.293.293.293.768 0 1.06-.293.293-.768.293-1.06 0-.84-.839-1.411-1.908-1.643-3.072-.231-1.163-.112-2.37.342-3.466S7.68 7.67 8.667 7.01C9.653 6.351 10.813 6 12 6c1.187 0 2.347.352 3.333 1.011.987.66 1.756 1.597 2.21 2.693.454 1.096.573 2.303.342 3.466-.232 1.164-.803 2.233-1.642 3.073-.293.293-.768.293-1.061 0-.293-.293-.293-.768 0-1.061.63-.63 1.058-1.431 1.231-2.304.174-.873.085-1.778-.256-2.6-.34-.822-.917-1.525-1.657-2.02-.74-.494-1.61-.758-2.5-.758Zm.875 6.299C13.541 13.474 14 12.79 14 12c0-1.105-.895-2-2-2s-2 .895-2 2c0 .79.459 1.474 1.125 1.799V21c0 .483.392.875.875.875s.875-.392.875-.875v-7.201Z"],
[d*="M12 1a10 10 0 00-8.66 15 1 1 0 001.732-1 8 8 0 1113.856 0 1 1 0 001.732 1A10 10 0 0012 1Zm0 5a4 4 0 00-4 4v4a4 4 0 003 3.874V20h-1a1 1 0 000 2h4a1 1 0 000-2h-1v-2.126A4 4 0 0016 14v-4a4 4 0 00-4-4Zm0 2a2 2 0 012 2v4a2 2 0 01-4 0v-4a2 2 0 012-2Z"] {
d: path("M6 12c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.66-.67 3.16-1.77 4.25l-.71-.71C16.44 14.63 17 13.38 17 12c0-2.76-2.24-5-5-5s-5 2.24-5 5c0 1.38.56 2.63 1.47 3.54l-.71.71C6.67 15.16 6 13.66 6 12zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2c0 .74.4 1.38 1 1.72V22h2v-8.28c.6-.34 1-.98 1-1.72zm-9.06 7.08.71-.71C4.01 16.74 3 14.49 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9c0 2.49-1.01 4.74-2.65 6.37l.71.71C20.88 17.27 22 14.77 22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 2.77 1.12 5.27 2.94 7.08z")
}
[d*="M7.278 4.933C8.675 3.999 10.318 3.5 12 3.5c1.681 0 3.325.499 4.722 1.433 1.398.934 2.488 2.261 3.131 3.814.643 1.553.812 3.262.484 4.911-.328 1.65-1.138 3.164-2.327 4.352-.39.39-.39 1.024 0 1.415.39.39 1.024.39 1.415 0 1.468-1.469 2.468-3.34 2.873-5.377.405-2.036.198-4.148-.597-6.066-.795-1.919-2.14-3.559-3.867-4.712C16.107 2.116 14.077 1.5 12 1.5c-2.077 0-4.107.616-5.833 1.77C4.44 4.423 3.094 6.063 2.299 7.982c-.794 1.918-1.002 4.03-.597 6.066.405 2.037 1.405 3.908 2.873 5.377.39.39 1.024.39 1.415 0 .39-.39.39-1.024 0-1.415-1.19-1.188-1.999-2.703-2.327-4.352-.328-1.649-.16-3.358.484-4.91.643-1.554 1.733-2.881 3.13-3.815ZM12 7.5c-.89 0-1.76.264-2.5.758-.74.495-1.317 1.198-1.657 2.02-.341.822-.43 1.727-.257 2.6.174.873.603 1.675 1.232 2.304.39.39.39 1.024 0 1.414-.39.39-1.024.39-1.414 0-.91-.909-1.528-2.067-1.78-3.328-.25-1.26-.121-2.568.37-3.755C6.488 8.325 7.32 7.31 8.39 6.595 9.458 5.881 10.714 5.5 12 5.5s2.542.381 3.611 1.095c1.07.715 1.902 1.73 2.394 2.918.492 1.187.62 2.494.37 3.755-.25 1.261-.87 2.42-1.779 3.328-.39.39-1.024.39-1.414 0-.39-.39-.39-1.024 0-1.414.63-.63 1.058-1.431 1.231-2.304.174-.873.085-1.778-.256-2.6-.34-.822-.917-1.525-1.657-2.02-.74-.494-1.61-.758-2.5-.758Zm1 6.792c.883-.386 1.5-1.267 1.5-2.292 0-1.38-1.12-2.5-2.5-2.5S9.5 10.62 9.5 12c0 1.025.617 1.906 1.5 2.292V21c0 .552.448 1 1 1s1-.448 1-1v-6.708Z"],
[d*="M12 1a10 10 0 018.66 15 1 1 0 01-1.732-1 8 8 0 10-13.856 0 1 1 0 01-1.732 1A10 10 0 0112 1Zm0 5a4 4 0 00-4 4v4a4 4 0 003 3.874V20h-1a1 1 0 000 2h4a1 1 0 000-2h-1v-2.126A4 4 0 0016 14v-4a4 4 0 00-4-4Z"] {
d: path("M13 13.72V22h-2v-8.28c-.6-.35-1-.98-1-1.72 0-1.1.9-2 2-2s2 .9 2 2c0 .74-.4 1.38-1 1.72zm-5.23 2.53 1.42-1.42C8.45 14.11 8 13.11 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.11-.45 2.11-1.18 2.83l1.42 1.42C17.33 15.16 18 13.66 18 12c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 1.66.67 3.16 1.77 4.25zm-2.83 2.83 1.42-1.42C4.9 16.21 4 14.21 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.21-.9 4.21-2.35 5.66l1.42 1.42C20.88 17.27 22 14.77 22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 2.77 1.12 5.27 2.94 7.08z")
}
/* playables */
[d*="M12 1a3 3 0 100 6 3 3 0 000-6Zm8 0a3 3 0 100 6 3 3 0 000-6ZM5.556 1C4.92 1 4.355 1.295 4 1.75A1.97 1.97 0 002.444 1C1.37 1 .5 1.839.5 2.875.5 5.263 3.976 6.988 4 7c.024-.012 3.5-1.737 3.5-4.125C7.5 1.84 6.629 1 5.556 1ZM12 2.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5Zm8 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5Zm-5 7.5L12 8.5l-3 1.75v3.5l3 1.75 3-1.75v-3.5ZM4 9a3 3 0 100 6 3 3 0 000-6Zm16 0a3 3 0 100 6 3 3 0 000-6ZM4 10.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5Zm16 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5ZM4 17a3 3 0 100 6 3 3 0 000-6Zm8 0a3 3 0 100 6 3 3 0 000-6Zm11.5 2.4L21.75 17h-3.5l-1.75 2.4L20 23l3.5-3.6ZM4 18.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5Zm8 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5Z"] {
d: path("M3.167 2C2.247 2 1.5 2.748 1.5 3.672c0 2.138 3 3.679 3 3.679s3-1.541 3-3.68C7.5 2.749 6.753 2 5.833 2c-.545 0-1.029.263-1.333.669C4.196 2.263 3.712 2 3.167 2ZM16.5 19l1.5-2h3l1.5 2-3 3-3-3ZM12 9l2.5 1.5v3L12 15l-2.5-1.5v-3L12 9Zm0-3.25c.69 0 1.25-.56 1.25-1.25S12.69 3.25 12 3.25s-1.25.56-1.25 1.25.56 1.25 1.25 1.25ZM12 7c1.38 0 2.5-1.12 2.5-2.5S13.38 2 12 2 9.5 3.12 9.5 4.5 10.62 7 12 7Zm1.25 12.5c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25Zm1.25 0c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5S10.62 17 12 17s2.5 1.12 2.5 2.5Zm-10 1.25c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Zm0 1.25C5.88 22 7 20.88 7 19.5S5.88 17 4.5 17 2 18.12 2 19.5 3.12 22 4.5 22ZM20.75 4.5c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25Zm1.25 0C22 5.88 20.88 7 19.5 7S17 5.88 17 4.5 18.12 2 19.5 2 22 3.12 22 4.5Zm-2.5 8.75c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Zm0 1.25c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5S17 10.62 17 12s1.12 2.5 2.5 2.5ZM5.75 12c0 .69-.56 1.25-1.25 1.25S3.25 12.69 3.25 12s.56-1.25 1.25-1.25 1.25.56 1.25 1.25ZM7 12c0 1.38-1.12 2.5-2.5 2.5S2 13.38 2 12s1.12-2.5 2.5-2.5S7 10.62 7 12Z")
}
/* settings */
[d*="m14.302 6.457-.668-.278L12.87 3.5h-1.737l-.766 2.68-.668.277c-.482.2-.934.463-1.344.778l-.575.44-2.706-.677-.868 1.504 1.938 2.003-.093.716c-.033.255-.05.514-.05.779 0 .264.017.524.05.779l.093.716-1.938 2.003.868 1.504 2.706-.677.575.44c.41.315.862.577 1.344.778l.668.278.766 2.679h1.737l.765-2.68.668-.277c.483-.2.934-.463 1.345-.778l.574-.44 2.706.677.869-1.504-1.938-2.003.092-.716c.033-.255.05-.514.05-.779 0-.264-.017-.524-.05-.779l-.092-.716 1.938-2.003-.869-1.504-2.706.677-.574-.44c-.41-.315-.862-.577-1.345-.778Zm4.436.214Zm-3.86-1.6-.67-2.346c-.123-.429-.516-.725-.962-.725h-2.492c-.446 0-.838.296-.961.725l-.67 2.347c-.605.251-1.17.58-1.682.972l-2.37-.593c-.433-.108-.885.084-1.108.47L2.717 8.08c-.223.386-.163.874.147 1.195l1.698 1.755c-.04.318-.062.642-.062.971 0 .329.021.653.062.97l-1.698 1.756c-.31.32-.37.809-.147 1.195l1.246 2.158c.223.386.675.578 1.109.47l2.369-.593c.512.393 1.077.72 1.681.972l.67 2.347c.124.429.516.725.962.725h2.492c.446 0 .839-.296.961-.725l.67-2.347c.605-.251 1.17-.58 1.682-.972l2.37.593c.433.108.885-.084 1.109-.47l1.245-2.158c.223-.386.163-.874-.147-1.195l-1.698-1.755c.04-.318.062-.642.062-.971 0-.329-.021-.653-.062-.97l1.698-1.756c.31-.32.37-.809.147-1.195L20.038 5.92c-.224-.386-.676-.578-1.11-.47l-2.369.593c-.512-.393-1.077-.72-1.681-.972ZM15.5 12c0 1.933-1.567 3.5-3.5 3.5S8.5 13.933 8.5 12s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5ZM14 12c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2Z"],
[d*="M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z"] {
d: path("M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-1c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM13.22 3l.55 2.2.13.51.5.18c.61.23 1.19.56 1.72.98l.4.32.5-.14 2.17-.62 1.22 2.11-1.63 1.59-.37.36.08.51c.05.32.08.64.08.98s-.03.66-.08.98l-.08.51.37.36 1.63 1.59-1.22 2.11-2.17-.62-.5-.14-.4.32c-.53.43-1.11.76-1.72.98l-.5.18-.13.51-.55 2.24h-2.44l-.55-2.2-.13-.51-.5-.18c-.6-.23-1.18-.56-1.72-.99l-.4-.32-.5.14-2.17.62-1.21-2.12 1.63-1.59.37-.36-.08-.51c-.05-.32-.08-.65-.08-.98s.03-.66.08-.98l.08-.51-.37-.36L3.6 8.56l1.22-2.11 2.17.62.5.14.4-.32c.53-.44 1.11-.77 1.72-.99l.5-.18.13-.51.54-2.21h2.44M14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14s-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2z")
}
[d*="M9.792 2.725A1 1 0 0110.753 2h2.492a1 1 0 01.961.725l.67 2.347c.605.251 1.17.58 1.682.972l2.37-.593a1 1 0 011.108.47l1.246 2.158a1 1 0 01-.147 1.195l-1.698 1.755a7.584 7.584 0 010 1.942l1.698 1.755a1 1 0 01.147 1.195l-1.245 2.158a1 1 0 01-1.11.47l-2.369-.593a7.494 7.494 0 01-1.681.972l-.67 2.347a1 1 0 01-.962.725h-2.492a1 1 0 01-.961-.725l-.67-2.347a7.494 7.494 0 01-1.682-.972l-2.37.593a1 1 0 01-1.108-.47L2.716 15.92a1 1 0 01.147-1.195l1.698-1.755a7.574 7.574 0 010-1.942L2.863 9.274a1 1 0 01-.147-1.195L3.962 5.92a1 1 0 011.109-.47l2.369.593a7.492 7.492 0 011.681-.972l.67-2.347ZM11.999 15a3 3 0 100-6 3 3 0 000 6Z"],
[d*="M13.023 1.008 12.845 1h-1.69a2 2 0 00-1.92 1.442l-.042.173a3 3 0 01-1.3 1.936l-.143.088a3 3 0 01-2.324.285l-.15-.047a2 2 0 00-2.285.743l-.096.15-.843 1.461a2 2 0 00.418 2.507l.116.107c.566.548.914 1.31.914 2.155l-.004.168a2.98 2.98 0 01-.91 1.985l-.116.108a2 2 0 00-.42 2.505l.844 1.463.096.15a2 2 0 002.286.743l.15-.047a3.001 3.001 0 012.323.286l.143.088a3 3 0 011.3 1.936A2 2 0 0011.154 23h1.69a2 2 0 001.963-1.615 3 3 0 011.443-2.023l.148-.08a3 3 0 012.326-.158 2 2 0 002.38-.893l.845-1.462a2 2 0 00-.418-2.507 3 3 0 01-1.026-2.094L20.5 12a3.002 3.002 0 011.03-2.262l.13-.123a2 2 0 00.37-2.226l-.081-.158-.845-1.462a2 2 0 00-2.21-.943l-.17.05a3 3 0 01-2.326-.158l-.148-.08a3 3 0 01-1.408-1.869l-.034-.154a2 2 0 00-1.785-1.607ZM12 9a3 3 0 110 6 3 3 0 010-6Z"] {
d: path("M19.56 12c0-.39-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z")
}
/* help */
[d*="M3.5 12c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5-3.806-8.5-8.5-8.5S3.5 7.306 3.5 12ZM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm2.245 7.505v-.003l-.003-.045c-.004-.044-.012-.114-.03-.2-.034-.174-.103-.4-.234-.619-.234-.39-.734-.883-1.978-.883s-1.744.494-1.978.883c-.131.22-.2.445-.235.62-.017.085-.025.155-.029.2l-.003.044v.004c-.004.415-.34.749-.755.749-.417 0-.755-.338-.755-.755H9h-.755v-.022l.001-.036.008-.114c.008-.092.023-.218.053-.367.058-.294.177-.694.42-1.1.517-.86 1.517-1.616 3.273-1.616 1.756 0 2.756.756 3.272 1.617.244.405.363.805.421 1.1.03.148.046.274.053.366l.008.114v.036l.001.013v.008L15 9.5h.755c0 .799-.249 1.397-.676 1.847-.374.395-.853.634-1.202.808l-.04.02c-.398.2-.646.333-.82.516-.136.143-.262.358-.262.809 0 .417-.338.755-.755.755s-.755-.338-.755-.755c0-.799.249-1.397.676-1.847.374-.395.853-.634 1.202-.808l.04-.02c.398-.2.646-.333.82-.516.135-.143.261-.356.262-.804ZM12 18.25c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z"],
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm.5 3h-.483a3.45 3.45 0 00-3.089 1.909l-.323.644a1 1 0 001.79.894l.322-.643a1.46 1.46 0 011.3-.804h.483a1.5 1.5 0 01.153 2.992l-.306.016A1.5 1.5 0 0011 12.5v1a1 1 0 002 0v-.535A3.5 3.5 0 0012.5 6Zm-.5 9.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5Z"] {
d: path("M15.36 9.96c0 1.09-.67 1.67-1.31 2.24-.53.47-1.03.9-1.16 1.6l-.04.2H11.1l.03-.28c.14-1.17.8-1.76 1.47-2.27.52-.4 1.01-.77 1.01-1.49 0-.51-.23-.97-.63-1.29-.4-.31-.92-.42-1.42-.29-.59.15-1.05.67-1.19 1.34l-.05.28H8.57l.06-.42c.2-1.4 1.15-2.53 2.42-2.87 1.05-.29 2.14-.08 2.98.57.85.64 1.33 1.62 1.33 2.68zM12 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-15c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z")
}
/* feedback */
[d*="M6.379 17.5H19c.276 0 .5-.224.5-.5V5c0-.276-.224-.5-.5-.5H5c-.276 0-.5.224-.5.5v14.379l1.44-1.44.439-.439Zm-1.879 4-.033.033-.26.26-.353.353c-.315.315-.854.092-.854-.353V5c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H7l-2.5 2.5ZM12 6c.552 0 1 .448 1 1v4c0 .552-.448 1-1 1s-1-.448-1-1V7c0-.552.448-1 1-1Zm0 9.75c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z"],
[d*="M19 2H5a4 4 0 00-4 4v10a4 4 0 004 4h2v1.604a1.41 1.41 0 002.095 1.232L14.2 20H19a4 4 0 004-4V6a4 4 0 00-4-4ZM5 4h14a2 2 0 012 2v10a2 2 0 01-2 2h-5.318l-.453.252L9 20.6V18H5a2 2 0 01-2-2V6a2 2 0 012-2Zm7 2a1 1 0 00-1 1v4.5a1 1 0 002 0V7a1 1 0 00-1-1Zm0 7.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5Z"] {
d: path("M13 14h-2v-2h2v2zm0-9h-2v6h2V5zm6-2H5v16.59l3.29-3.29.3-.3H19V3m1-1v15H9l-5 5V2h16z")
}
/* topbar */
/* hamburger */
[d*="M20 5H4a1 1 0 000 2h16a1 1 0 100-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Z"] {
d: path("M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z")
}
/* search */
[d*="M16.296 16.996a8 8 0 11.707-.708l3.909 3.91-.707.707-3.909-3.909zM18 11a7 7 0 00-14 0 7 7 0 1014 0z"],
[d*="M11 2a9 9 0 105.641 16.01.966.966 0 00.152.197l3.5 3.5a1 1 0 101.414-1.414l-3.5-3.5a1 1 0 00-.197-.153A8.96 8.96 0 0020 11a9 9 0 00-9-9Zm0 2a7 7 0 110 14 7 7 0 010-14Z"] {
d: path("m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z")
}
/* mic */
[d*="M18.063 14.5a1 1 0 111.73 1A8.998 8.998 0 0113 19.942V22a1 1 0 11-2 0v-2.058A8.999 8.999 0 014.206 15.5l.866-.5.865-.5a7.002 7.002 0 0012.125 0ZM12 1a5 5 0 015 5v5a5 5 0 01-10 0V6a5 5 0 015-5ZM4.572 14.134a1 1 0 011.365.366l-1.731 1a1 1 0 01.366-1.366ZM12 3a3 3 0 00-3 3v5a3 3 0 106 0V6a3 3 0 00-3-3Z"] {
d: path("M12 3c-1.66 0-3 1.37-3 3.07v5.86c0 1.7 1.34 3.07 3 3.07s3-1.37 3-3.07V6.07C15 4.37 13.66 3 12 3zm6.5 9h-1c0 3.03-2.47 5.5-5.5 5.5S6.5 15.03 6.5 12h-1c0 3.24 2.39 5.93 5.5 6.41V21h2v-2.59c3.11-.48 5.5-3.17 5.5-6.41z")
}
/* creator studio */
[d*="m13.75 1.456 6.505 3.756a3.5 3.5 0 011.75 3.03v7.511a3.5 3.5 0 01-1.75 3.031L13.75 22.54a3.5 3.5 0 01-3.5 0l-6.505-3.756a3.5 3.5 0 01-1.75-3.03V8.241a3.5 3.5 0 011.75-3.03l6.505-3.755a3.5 3.5 0 013.5 0Zm5.505 5.487L12.75 3.188a1.5 1.5 0 00-1.5 0L4.745 6.943a1.5 1.5 0 00-.75 1.3v7.51a1.5 1.5 0 00.75 1.3l6.505 3.755a1.5 1.5 0 001.5 0l6.505-3.755a1.5 1.5 0 00.75-1.3v-7.51a1.5 1.5 0 00-.75-1.3ZM12.5 5.365l4.996 2.885a1 1 0 01.5.866v5.768a1 1 0 01-.5.866L12.5 18.635a1 1 0 01-1 0L6.504 15.75a1 1 0 01-.5-.866V9.116a1 1 0 01.5-.866L11.5 5.365a1 1 0 011 0ZM12 6.81 7.504 9.404v5.192L12 17.19l4.496-2.595v-5.19L12 6.81ZM15 12l-5-3v6l5-3Z"] {
d: path("M10 9.35 15 12l-5 2.65ZM12 3a.73.73 0 00-.31.06L4.3 7.28a.79.79 0 00-.3.52v8.4a.79.79 0 00.3.52l7.39 4.22a.83.83 0 00.62 0l7.39-4.22a.79.79 0 00.3-.52V7.8a.79.79 0 00-.3-.52l-7.39-4.22A.73.73 0 0012 3m0-1a1.6 1.6 0 01.8.19l7.4 4.22A1.77 1.77 0 0121 7.8v8.4a1.77 1.77 0 01-.8 1.39l-7.4 4.22a1.78 1.78 0 01-1.6 0l-7.4-4.22A1.77 1.77 0 013 16.2V7.8a1.77 1.77 0 01.8-1.39l7.4-4.22A1.6 1.6 0 0112 2Zm0 4a.42.42 0 00-.17 0l-4.7 2.8a.59.59 0 00-.13.39v5.61a.65.65 0 00.13.37l4.7 2.8A.42.42 0 0012 18a.34.34 0 00.17 0l4.7-2.81a.56.56 0 00.13-.39V9.19a.62.62 0 00-.13-.37L12.17 6A.34.34 0 0012 6m0-1a1.44 1.44 0 01.69.17L17.39 8A1.46 1.46 0 0118 9.19v5.61a1.46 1.46 0 01-.61 1.2l-4.7 2.81A1.44 1.44 0 0112 19a1.4 1.4 0 01-.68-.17L6.62 16A1.47 1.47 0 016 14.8V9.19A1.47 1.47 0 016.62 8l4.7-2.8A1.4 1.4 0 0112 5Z")
}
/* switch account */
[d*="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2ZM8 16V4h12v12h-.365a.999.999 0 00-.059-.216 6 6 0 00-11.155.008 1 1 0 00-.058.208H8Zm6-11a3 3 0 100 6 3 3 0 000-6ZM4 20h15a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2v15ZM14 7a1 1 0 110 2 1 1 0 010-2Zm-.003 7a4 4 0 013.467 2h-6.927a4 4 0 013.46-2Z"] {
d: path("M4 20h14v1H3V6h1v14zM6 3v15h15V3H6zm2.02 14c.36-2.13 1.93-4.1 5.48-4.1s5.12 1.97 5.48 4.1H8.02zM11 8.5a2.5 2.5 0 015 0 2.5 2.5 0 01-5 0zm3.21 3.43A3.507 3.507 0 0017 8.5C17 6.57 15.43 5 13.5 5S10 6.57 10 8.5c0 1.69 1.2 3.1 2.79 3.43-3.48.26-5.4 2.42-5.78 5.07H7V4h13v13h-.01c-.38-2.65-2.31-4.81-5.78-5.07z")
}
/* memberships */
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm0 2a1 1 0 00-1 1v1.104a3.5 3.5 0 00-1.435.656C8.886 8.3 8.5 9.09 8.5 10c0 .525.13 1.005.402 1.417.251.368.591.667.989.869.638.339 1.437.495 2.058.615l.109.022c.728.143 1.242.259 1.588.456.107.053.2.133.268.232.039.063.086.174.086.389 0 .2-.267 1-2 1-1.033 0-1.547-.303-1.788-.509a1.199 1.199 0 01-.274-.337 1 1 0 00-1.886.662L9 14.5l-.948.317.001.002.008.024c.055.143.123.281.203.413.175.283.394.537.648.753.478.41 1.156.765 2.088.915V18a1 1 0 002 0v-1.082c1.757-.299 3-1.394 3-2.918 0-.534-.125-1.022-.387-1.444a2.7 2.7 0 00-.978-.915c-.671-.383-1.512-.548-2.153-.673l-.04-.008c-.74-.145-1.258-.251-1.614-.439a.699.699 0 01-.258-.206c-.029-.045-.07-.13-.07-.315 0-.308.114-.518.31-.674C11.027 9.153 11.414 9 12 9c.463.006.917.133 1.316.368.167.095.323.206.468.331l.005.004.01.01a1 1 0 001.408-1.42L14.5 9l.706-.708-.011-.011-.017-.016-.054-.05A5 5 0 0013 7.115V6a1 1 0 00-1-1Z"] {
d: path("M12 3c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9m0-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 7V7h-3V5h-2v2h-1c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h4v2H8v2h3v2h2v-2h1c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-4V9h6z")
}
/* your data */
[d*="M21 4.3 12 1 3 4.3v10.555a6 6 0 003.364 5.39L12 23l5.636-2.755A6 6 0 0021 14.855V4.3ZM5 5.697l7-2.567 7 2.567v9.157a3.999 3.999 0 01-1.36 3.003 7 7 0 00-11.282-.001A4 4 0 015 14.854V5.697ZM12 6a4 4 0 100 8 4 4 0 000-8Zm0 2a2 2 0 110 4 2 2 0 010-4Zm0 9a5 5 0 013.896 1.868L12 20.772 8.104 18.87A5.001 5.001 0 0112 17Z"] {
d: path("m12 3.06 7 3.21v4.84c0 1.3-.25 2.6-.75 3.86-.15.37-.33.76-.55 1.17-.15.27-.31.54-.48.81-1.32 2.01-3.17 3.42-5.23 3.98-2.06-.56-3.91-1.97-5.23-3.98-.17-.27-.33-.54-.48-.81-.22-.41-.4-.79-.55-1.17-.48-1.26-.73-2.56-.73-3.86V6.27l7-3.21m0-1.1L4 5.63v5.49c0 1.47.3 2.9.81 4.22.17.44.37.86.6 1.28.16.3.34.6.52.88 1.42 2.17 3.52 3.82 5.95 4.44l.12.02.12-.03c2.43-.61 4.53-2.26 5.95-4.43.19-.29.36-.58.52-.88.22-.41.43-.84.6-1.28.51-1.33.81-2.76.81-4.23V5.63l-8-3.67zm1.08 10.15c-.32-.06-.64-.11-.96-.12A2.997 2.997 0 0012 6a2.996 2.996 0 00-.12 5.99c-.32.01-.64.06-.96.12C8.64 12.58 7 14.62 7 17h10c0-2.38-1.64-4.42-3.92-4.89zM10 9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm1.12 4.09c.37-.08.64-.11.88-.11s.51.03.88.11c1.48.3 2.63 1.46 3 2.91H8.12c.37-1.45 1.52-2.61 3-2.91z")
}
/* appearance */
[d*="M21.861 14.006a8 8 0 01-10.87-10.87c.452-.816-.101-1.976-1-1.721C5.379 2.724 2 6.965 2 11.998c0 6.075 4.925 11 11 11 5.032 0 9.275-3.38 10.584-7.992.255-.9-.905-1.451-1.723-1Zm-1.137 2.616A9 9 0 118.376 4.275 10 10 0 008 6.998c0 5.522 4.477 10 10 10 .943 0 1.857-.131 2.724-.376Z"] {
d: path("M12 22C10.93 22 9.86998 21.83 8.83998 21.48L7.41998 21.01L8.83998 20.54C12.53 19.31 15 15.88 15 12C15 8.12 12.53 4.69 8.83998 3.47L7.41998 2.99L8.83998 2.52C9.86998 2.17 10.93 2 12 2C17.51 2 22 6.49 22 12C22 17.51 17.51 22 12 22ZM10.58 20.89C11.05 20.96 11.53 21 12 21C16.96 21 21 16.96 21 12C21 7.04 16.96 3 12 3C11.53 3 11.05 3.04 10.58 3.11C13.88 4.81 16 8.21 16 12C16 15.79 13.88 19.19 10.58 20.89Z")
}
/* language */
[d*="M10 2.5a1 1 0 00-2 0V4H2a1 1 0 000 2h9.925c-.204 1.334-.833 2.627-1.975 4.15-.287.382-.603.777-.95 1.184-.328-.385-.645-.78-.95-1.184C7.478 9.387 7.035 8.682 6.709 8h-2.17c.415 1.125 1.06 2.216 1.911 3.35.361.48.763.977 1.206 1.49-1.196 1.285-2.645 2.735-4.363 4.453a1 1 0 101.414 1.414l.057-.057C6.38 17.036 7.795 15.619 9 14.33c.748.8 1.577 1.65 2.485 2.565l.846-1.99a105.74 105.74 0 01-1.987-2.066c.443-.512.845-1.008 1.206-1.489 1.342-1.79 2.175-3.474 2.393-5.35H16a1 1 0 100-2h-6V2.5Zm6.33 8.109-4.25 10a1 1 0 101.84.782L14.937 19h5.126l1.017 2.391a1 1 0 101.84-.782l-4.25-10a1 1 0 00-.92-.609h-.5a1 1 0 00-.92.609Zm1.17 2.36L19.213 17h-3.426l1.713-4.031Z"] {
d: path("M13.33 6c-1 2.42-2.22 4.65-3.57 6.52l2.98 2.94-.7.71-2.88-2.84c-.53.67-1.06 1.28-1.61 1.83l-3.19 3.19-.71-.71 3.19-3.19c.55-.55 1.08-1.16 1.6-1.83l-.16-.15c-1.11-1.09-1.97-2.44-2.49-3.9l.94-.34c.47 1.32 1.25 2.54 2.25 3.53l.05.05c1.2-1.68 2.29-3.66 3.2-5.81H2V5h6V3h1v2h7v1h-2.67zM22 21h-1l-1.49-4h-5.02L13 21h-1l4-11h2l4 11zm-2.86-5-1.86-5h-.56l-1.86 5h4.28z")
}
/* safety */
[d*="M11 2a5 5 0 110 10 5 5 0 010-10ZM8 7a3 3 0 106 0 3 3 0 00-6 0Zm-1.243 9.757a6 6 0 017.185-.986 6 6 0 011.374-1.507A8 8 0 003 21a1 1 0 102 0 6 6 0 011.757-4.243ZM20 15h-2l-.07.554a1 1 0 01-1.38.797l-.514-.217-1 1.732.444.337a1 1 0 010 1.594l-.444.337 1 1.732.514-.217a1 1 0 011.38.797L18 23h2l.07-.553a1 1 0 011.38-.798l.514.217 1-1.732-.445-.337a1 1 0 010-1.594l.445-.337-1-1.732-.514.216a1 1 0 01-1.38-.797L20 15Zm.5 4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0Z"] {
d: path("M12 20.95Q8.975 20.075 6.987 17.312Q5 14.55 5 11.1V5.7L12 3.075L19 5.7V11.35Q18.775 11.275 18.5 11.2Q18.225 11.125 18 11.075V6.375L12 4.15L6 6.375V11.1Q6 12.575 6.438 13.938Q6.875 15.3 7.625 16.438Q8.375 17.575 9.413 18.425Q10.45 19.275 11.625 19.725L11.675 19.7Q11.8 20 11.975 20.288Q12.15 20.575 12.375 20.825Q12.275 20.85 12.188 20.888Q12.1 20.925 12 20.95ZM17 17Q17.625 17 18.062 16.562Q18.5 16.125 18.5 15.5Q18.5 14.875 18.062 14.438Q17.625 14 17 14Q16.375 14 15.938 14.438Q15.5 14.875 15.5 15.5Q15.5 16.125 15.938 16.562Q16.375 17 17 17ZM17 20Q17.8 20 18.438 19.65Q19.075 19.3 19.5 18.7Q18.925 18.35 18.3 18.175Q17.675 18 17 18Q16.325 18 15.7 18.175Q15.075 18.35 14.5 18.7Q14.925 19.3 15.562 19.65Q16.2 20 17 20ZM17 21Q15.325 21 14.163 19.837Q13 18.675 13 17Q13 15.325 14.163 14.162Q15.325 13 17 13Q18.675 13 19.837 14.162Q21 15.325 21 17Q21 18.675 19.837 19.837Q18.675 21 17 21ZM12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Q12 11.95 12 11.95Z")
}
/* location */
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2.007c.048.021.153.081.315.248.302.313.667.872 1.016 1.725.611 1.494 1.053 3.597 1.149 6.02H9.519c.097-2.423.539-4.526 1.15-6.021.349-.852.714-1.411 1.016-1.724.162-.167.267-.228.315-.248Zm-2.835.45C8.248 5.277 7.632 7.96 7.52 11H3.057a9.01 9.01 0 016.108-7.543Zm5.669 0A9.01 9.01 0 0120.943 11H16.48c-.112-3.04-.729-5.723-1.646-7.543ZM9.52 13h4.961c-.097 2.423-.539 4.526-1.15 6.02-.349.853-.714 1.412-1.016 1.725-.162.167-.267.228-.315.248-.048-.021-.153-.081-.315-.248-.302-.313-.667-.872-1.016-1.725-.611-1.494-1.053-3.597-1.149-6.02Zm-6.463 0H7.52c.112 3.039.729 5.722 1.645 7.542A9 9 0 013.057 13Zm13.423 0h4.464a9.001 9.001 0 01-6.11 7.542c.916-1.82 1.534-4.502 1.646-7.542Z"] {
d: path("M11.99,1.98C6.46,1.98,1.98,6.47,1.98,12s4.48,10.02,10.01,10.02c5.54,0,10.03-4.49,10.03-10.02S17.53,1.98,11.99,1.98z M8.86,14.5c-0.16-0.82-0.25-1.65-0.25-2.5c0-0.87,0.09-1.72,0.26-2.55h6.27c0.17,0.83,0.26,1.68,0.26,2.55 c0,0.85-0.09,1.68-0.25,2.5H8.86z M14.89,15.5c-0.54,1.89-1.52,3.64-2.89,5.15c-1.37-1.5-2.35-3.25-2.89-5.15H14.89z M9.12,8.45 c0.54-1.87,1.52-3.61,2.88-5.1c1.36,1.49,2.34,3.22,2.88,5.1H9.12z M16.15,9.45h4.5c0.24,0.81,0.37,1.66,0.37,2.55 c0,0.87-0.13,1.71-0.36,2.5h-4.51c0.15-0.82,0.24-1.65,0.24-2.5C16.39,11.13,16.3,10.28,16.15,9.45z M20.29,8.45h-4.38 c-0.53-1.97-1.47-3.81-2.83-5.4C16.33,3.45,19.04,5.56,20.29,8.45z M10.92,3.05c-1.35,1.59-2.3,3.43-2.83,5.4H3.71 C4.95,5.55,7.67,3.44,10.92,3.05z M3.35,9.45h4.5C7.7,10.28,7.61,11.13,7.61,12c0,0.85,0.09,1.68,0.24,2.5H3.34 c-0.23-0.79-0.36-1.63-0.36-2.5C2.98,11.11,3.11,10.26,3.35,9.45z M3.69,15.5h4.39c0.52,1.99,1.48,3.85,2.84,5.45 C7.65,20.56,4.92,18.42,3.69,15.5z M13.09,20.95c1.36-1.6,2.32-3.46,2.84-5.45h4.39C19.08,18.42,16.35,20.55,13.09,20.95z")
}
/* keyboard */
[d*="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2ZM3 18V6h18v12H3ZM6.5 8h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm3 0h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm3 0h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm3 0h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm3 0h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm-12 3h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm3 0h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm3 0h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm3 0h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm3 0h-1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Zm-3 3h-7a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5Z"] {
d: path("M16 16H8v-2h8v2zm0-5h-2v2h2v-2zm3 0h-2v2h2v-2zm-6 0h-2v2h2v-2zm-3 0H8v2h2v-2zm-3 0H5v2h2v-2zm9-3h-2v2h2V8zm3 0h-2v2h2V8zm-6 0h-2v2h2V8zm-3 0H8v2h2V8zM7 8H5v2h2V8zm15-3v14H2V5h20zm-1 1H3v12h18V6z")
}
/* add account */
[d*="M12 2a5 5 0 100 10 5 5 0 000-10Zm0 2a3 3 0 110 6 3 3 0 010-6Zm0 9a8 8 0 00-8 8 1 1 0 102 0 6 6 0 019.315-5H16v-1.926A8 8 0 0012 13Zm7 2a1 1 0 00-1 1v2h-2a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 000-2h-2v-2a1 1 0 00-1-1Z"] {
d: path("M13.72 11.93A4.004 4.004 0 0017 8c0-2.21-1.79-4-4-4S9 5.79 9 8c0 1.96 1.42 3.59 3.28 3.93C6.77 12.21 4 15.76 4 20h18c0-4.24-2.77-7.79-8.28-8.07zM10 8c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm3 4.9c5.33 0 7.56 2.99 7.94 6.1H5.06c.38-3.11 2.61-6.1 7.94-6.1zM4 12H2v-1h2V9h1v2h2v1H5v2H4v-2z")
}
/* upload */
[d*="M18.707 8.293 12 1.586 5.293 8.293a1 1 0 101.414 1.414L11 5.414V17a1 1 0 002 0V5.414l4.293 4.293a1 1 0 101.414-1.414ZM19 20H5a1 1 0 000 2h14a1 1 0 000-2Z"] {
d: path("M17 18v1H6v-1ZM6.49 9l.71.71 3.8-3.8V16h1V5.91l3.8 3.81.71-.72-5-5Z")
}
/* create post */
[d*="m17.232 2.354-9.546 9.547a3 3 0 00-.789 1.394l-.866 3.462-.404 1.617 1.616-.404 3.463-.865a3 3 0 001.394-.79l9.546-9.547a2.5 2.5 0 000-3.536l-.878-.878a2.5 2.5 0 00-3.536 0ZM14.758 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V9.242l-2 2V20H4V4h8.758l2-2Zm4.597 1.768.877.878a.5.5 0 010 .708l-.732.732L17.915 4.5l.733-.732a.5.5 0 01.707 0ZM9.1 13.315l7.4-7.4L18.086 7.5l-7.4 7.401c-.129.128-.29.22-.465.264l-1.846.46.462-1.846a1 1 0 01.263-.464Z"] {
d: path("M15.01,7.34l1.64,1.64L8.64,17H6.99v-1.64L15.01,7.34 M15.01,5.92l-9.02,9.02V18h3.06l9.02-9.02L15.01,5.92L15.01,5.92z M17.91,4.43l1.67,1.67l-0.67,0.67L17.24,5.1L17.91,4.43 M17.91,3.02L15.83,5.1l3.09,3.09L21,6.11L17.91,3.02L17.91,3.02z M21,10h-1 v10H4V4h10V3H3v18h18V10z")
}
/* plus (create icon) */
[d*="M12 3a1 1 0 00-1 1v7H4a1 1 0 000 2h7v7a1 1 0 002 0v-7h7a1 1 0 000-2h-7V4a1 1 0 00-1-1Z"] {
d: path("M20 12h-8v8h-1v-8H3v-1h8V3h1v8h8v1z")
}
/* signin */
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 016.447 15.276 7 7 0 00-12.895 0A9 9 0 0112 3Zm0 2a4 4 0 100 8 4 4 0 000-8Zm0 2a2 2 0 110 4 2 2 0 010-4Zm-.1 9.001L11.899 16a5 5 0 014.904 3.61A8.96 8.96 0 0112 21a8.96 8.96 0 01-4.804-1.391 5 5 0 014.704-3.608Z"] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1c4.96 0 9 4.04 9 9 0 1.42-.34 2.76-.93 3.96-1.53-1.72-3.98-2.89-7.38-3.03A3.996 3.996 0 0016 9c0-2.21-1.79-4-4-4S8 6.79 8 9c0 1.97 1.43 3.6 3.31 3.93-3.4.14-5.85 1.31-7.38 3.03C3.34 14.76 3 13.42 3 12c0-4.96 4.04-9 9-9zM9 9c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm3 12c-3.16 0-5.94-1.64-7.55-4.12C6.01 14.93 8.61 13.9 12 13.9c3.39 0 5.99 1.03 7.55 2.98C17.94 19.36 15.16 21 12 21z")
}
/* signout */
[d*="M19 2a2 2 0 012 2v16a2 2 0 01-2 2H9a1 1 0 010-2h10V4H9a1 1 0 010-2h10ZM9.293 7.293a1 1 0 000 1.414L11.586 11H4a1 1 0 000 2h7.586l-2.293 2.293a1 1 0 101.414 1.414L15.414 12l-4.707-4.707a1 1 0 00-1.414 0Z"] {
d: path("M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1.7.7 4.4-4.4L11.8 7l-.7.7 3.1 3.1H3v1h11.3l-3.2 3.3z")
}
/* other */
/* clear */
[d*="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z"],
[d*="M17.293 5.293 12 10.586 6.707 5.293a1 1 0 10-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 001.414 1.414L12 13.414l5.293 5.293a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 10-1.414-1.414Z"] {
d: path("M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z")
}
/* filters */
[d*="M9 3a4 4 0 00-3.874 3H3a1 1 0 000 2h2.126a4.002 4.002 0 007.748 0H21a1 1 0 100-2h-8.126A4 4 0 009 3Zm0 2a2 2 0 110 4 2 2 0 010-4Zm6 8a4 4 0 00-3.874 3H3a1 1 0 000 2h8.126a4.002 4.002 0 007.748 0H21a1 1 0 000-2h-2.126A4 4 0 0015 13Zm0 2a2 2 0 110 4 2 2 0 010-4Z"] {
d: path("M15 17h6v1h-6v-1zm-4 0H3v1h8v2h1v-5h-1v2zm3-9h1V3h-1v2H3v1h11v2zm4-3v1h3V5h-3zM6 14h1V9H6v2H3v1h3v2zm4-2h11v-1H10v1z")
}
/* about */
[d*="M20 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2ZM4 20V4h16v16h-1.293a7 7 0 00-13.414 0H4Zm8-14a4 4 0 100 8 4 4 0 000-8Zm0 2a2 2 0 110 4 2 2 0 010-4Zm-.1 9.001h-.002A5 5 0 0116.581 20H7.417a5 5 0 014.483-2.999Z"] {
d: path("M4 20h14v1H3V6h1v14zM6 3v15h15V3H6zm2.02 14c.36-2.13 1.93-4.1 5.48-4.1s5.12 1.97 5.48 4.1H8.02zM11 8.5a2.5 2.5 0 015 0 2.5 2.5 0 01-5 0zm3.21 3.43A3.507 3.507 0 0017 8.5C17 6.57 15.43 5 13.5 5S10 6.57 10 8.5c0 1.69 1.2 3.1 2.79 3.43-3.48.26-5.4 2.42-5.78 5.07H7V4h13v13h-.01c-.38-2.65-2.31-4.81-5.78-5.07z")
}
/* email */
[d*="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2ZM3 7.434V6h18v1.434l-9 5.4-9-5.4Zm9.515 7.423L21 9.766V18H3V9.766l8.485 5.091.515.309.515-.309Z"] {
d: path("M2 5v14h20V5H2zm19 1v.88l-9 6.8-9-6.8V6h18zM3 18V8.13l9 6.8 9-6.8V18H3z")
}
/* global */
[d*=""] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM3 12c0-.7.09-1.37.24-2.02L8 14.71v.79c0 1.76 1.31 3.22 3 3.46v1.98c-4.49-.5-8-4.32-8-8.94zm8.5 6C10.12 18 9 16.88 9 15.5v-1.21l-5.43-5.4C4.84 5.46 8.13 3 12 3c1.05 0 2.06.19 3 .53V5c0 .55-.45 1-1 1h-3v2c0 .55-.45 1-1 1H8v3h6c.55 0 1 .45 1 1v4h2c.55 0 1 .45 1 1v.69C16.41 20.12 14.31 21 12 21v-3h-.5zm7.47-.31C18.82 16.73 18 16 17 16h-1v-3c0-1.1-.9-2-2-2H9v-1h1c1.1 0 2-.9 2-2V7h2c1.1 0 2-.9 2-2V3.95c2.96 1.48 5 4.53 5 8.05 0 2.16-.76 4.14-2.03 5.69z")
}
/* info */
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm0 3.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5ZM13 15v-5h-2.5a1 1 0 000 2h.5v3h-1a1 1 0 000 2h4a1 1 0 000-2h-1Z"] {
d: path("M13 17h-2v-6h2v6zm0-10h-2v2h2V7zm-1-4c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z")
}
/* audience */
[d*="M19.4.2a1 1 0 00-.2 1.4 9 9 0 01-.022 10.83 1 1 0 001.595 1.206A11 11 0 0020.8.4a1 1 0 00-1.4-.2ZM10 2a5 5 0 100 10 5 5 0 000-10Zm6.17.3a1 1 0 00-.028 1.414c.895.932 1.365 2.114 1.358 3.312-.006 1.199-.49 2.378-1.396 3.302a1.001 1.001 0 101.427 1.4c1.257-1.281 1.959-2.953 1.969-4.69.009-1.738-.673-3.416-1.916-4.71A1 1 0 0016.17 2.3ZM10 4a3 3 0 110 6 3 3 0 010-6Zm0 9a8 8 0 00-8 8 1 1 0 102 0 6 6 0 1112 0 1 1 0 002 0 8 8 0 00-8-8Z"] {
d: path("M11.72 11.93C13.58 11.59 15 9.96 15 8c0-2.21-1.79-4-4-4S7 5.79 7 8c0 1.96 1.42 3.59 3.28 3.93C4.77 12.21 2 15.76 2 20h18c0-4.24-2.77-7.79-8.28-8.07zM8 8c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm3 4.9c5.33 0 7.56 2.99 7.94 6.1H3.06c.38-3.11 2.61-6.1 7.94-6.1zm5.68-1.46-.48-.88C17.31 9.95 18 8.77 18 7.5s-.69-2.45-1.81-3.06l.49-.88C18.11 4.36 19 5.87 19 7.5c0 1.64-.89 3.14-2.32 3.94zm2.07 1.69-.5-.87c1.7-.98 2.75-2.8 2.75-4.76s-1.05-3.78-2.75-4.76l.5-.87C20.75 3.03 22 5.19 22 7.5s-1.24 4.47-3.25 5.63z")
}
/* stats */
[d*="M1.283 18.719a1 1 0 001.415 0l6.056-6.056 3.621 3.62a1 1 0 001.414 0l7.221-7.22v3.268a1 1 0 002 0V5.65h-6.682a1 1 0 100 2h3.267l-6.513 6.514-3.62-3.622a1 1 0 00-1.416 0l-6.763 6.764a1 1 0 000 1.413Z"] {
d: path("M22 6v7h-1V7.6l-8.5 7.6-4-4-5.6 5.6-.7-.7 6.4-6.4 4 4L20.2 7H15V6h7z")
}
/* play */
[d*="M5 4.623V19.38a1.5 1.5 0 002.26 1.29L22 12 7.26 3.33A1.5 1.5 0 005 4.623Z"] {
d: path("m7 4 12 8-12 8V4z")
}
/* clear history */
[d*="M19 3h-4V2a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H5a2 2 0 00-2 2h18a2 2 0 00-2-2ZM6 19V7H4v12a4 4 0 004 4h8a4 4 0 004-4V7h-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2Zm4-11a1 1 0 00-1 1v8a1 1 0 102 0V9a1 1 0 00-1-1Zm4 0a1 1 0 00-1 1v8a1 1 0 002 0V9a1 1 0 00-1-1Z"] {
d: path("M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z")
}
/* pause history */
[d*="M9 3H7a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2Zm8 0h-2a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2ZM7 19V5h2v14H7Zm8 0V5h2v14h-2Z"] {
d: path("M11,16H9V8h2V16z M15,8h-2v8h2V8z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12 s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2L12,2z")
}
/* resume history */
[d*="M12 1a11 11 0 00-7.778 18.778A11.002 11.002 0 0022.163 7.79 11 11 0 0012 1Zm0 2a9 9 0 016.364 2.636A9 9 0 015.636 18.364 9.001 9.001 0 0112 3Zm5 9L9 7.2v9.6l8-4.8Z"] {
d: path("M10 8v8l6-4-6-4Zm2-5c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9Zm0-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z")
}
/* promote */
[d*="M21 2h-.697a2 2 0 00-1.11.336l-2.251 1.501a3 3 0 01-.801.377L6.854 7H4a2 2 0 00-2 2v4a2 2 0 002 2h2v5a2 2 0 002 2h1a2 2 0 002-2v-3.757l5.141 1.543a3 3 0 01.802.378l2.25 1.5a2 2 0 001.11.336H21a1 1 0 001-1V3a1 1 0 00-1-1Zm-2.948 3.501L20 4.202v13.596l-1.948-1.299a5 5 0 00-1.337-.629L8 13.254v-4.51l8.715-2.614a5 5 0 001.337-.629ZM4 9h2v4H4V9Zm4 11v-4.656l1 .3V20H8Z"] {
d: path("M14 8.54V5L8 9H2v6h3v4h2v-4h1l6 4v-3.54c1.2-.69 2-1.98 2-3.46s-.8-2.77-2-3.46zm-1 8.59L8.3 14H3v-4h5.3L13 6.87v10.26zm6.35 1.8-3.28-2.29.57-.82 3.28 2.29-.57.82zM22 12.5h-4v-1h4v1zm-5.22-4.32-.57-.82 3.28-2.29.57.82-3.28 2.29z")
}
/* clip */
[d*="m8.042 9.456-.716.08c-.732.08-1.486-.16-2.043-.718-.977-.976-.977-2.559 0-3.535.976-.977 2.559-.977 3.535 0 .558.557.798 1.312.717 2.044l-.079.715.51.51 10.13 10.13c-.97.643-2.291.537-3.146-.318l-4.951-4.951-1.061 1.06 4.951 4.952c1.442 1.442 3.712 1.553 5.282.331.13-.1.255-.212.375-.331l.707-.707-1.06-1.061L15.534 12l5.657-5.657 1.06-1.06-.706-.708c-.12-.12-.245-.23-.376-.331-1.569-1.222-3.839-1.111-5.281.331L13.06 7.404l1.061 1.06 2.829-2.828c.855-.855 2.175-.961 3.146-.318l-4.56 4.56 1.06 1.061L15.536 12l-4.51-4.51c.128-1.164-.254-2.375-1.147-3.268-1.562-1.562-4.095-1.562-5.657 0-1.562 1.562-1.562 4.095 0 5.657.893.893 2.104 1.276 3.269 1.147l2.033 2.033 1.06-1.06-2.033-2.033-.509-.51Zm-.285-3.113c-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.024 0 1.415.39.39 1.024.39 1.414 0 .39-.391.39-1.024 0-1.415Zm-.43 8.122.715.079.51-.51.973-.973L8.465 12l-.975.974c-1.165-.128-2.375.254-3.268 1.147-1.562 1.562-1.562 4.095 0 5.657 1.562 1.562 4.094 1.562 5.657 0 .893-.893 1.275-2.104 1.147-3.269l.974-.973-1.06-1.061-.975.974-.509.509.079.716c.08.732-.16 1.486-.717 2.044-.976.976-2.56.976-3.536 0-.976-.977-.976-2.56 0-3.536.558-.558 1.312-.798 2.044-.717Zm-.984 3.192c.39.39 1.024.39 1.414 0 .39-.39.39-1.024 0-1.414-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.023 0 1.414Z"],
[d*="M6 2.002a4 4 0 102.03 7.445L10.586 12l-2.554 2.555a4 4 0 101.414 1.414L12 13.416l7.07 7.071a2 2 0 002.829 0L9.446 8.032A4 4 0 006 2.002Zm8.826 8.588 7.073-7.074a2 2 0 00-2.828 0l-5.66 5.66 1.415 1.414ZM8 6a2 2 0 11-4 0 2 2 0 014 0Zm0 12a2 2 0 11-4 0 2 2 0 014 0Z"] {
d: path("M8 7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-1 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3.79-7.77L21 18.44V20h-3.27l-5.76-5.76-1.27 1.27c.19.46.3.96.3 1.49 0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.42 0 .81.08 1.19.2l1.37-1.37-1.11-1.11C8 10.89 7.51 11 7 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 .43-.09.84-.21 1.23zm-.71.71-.43-.44.19-.58c.11-.34.16-.64.16-.92 0-1.65-1.35-3-3-3S4 5.35 4 7s1.35 3 3 3c.36 0 .73-.07 1.09-.21l.61-.24.46.46 1.11 1.11.71.71-.71.71-1.37 1.37-.43.43-.58-.18C7.55 14.05 7.27 14 7 14c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3c0-.38-.07-.75-.22-1.12l-.25-.61.47-.47 1.27-1.27.71-.71.71.71L18.15 19H20v-.15l-9.92-9.91zM17.73 4H21v1.56l-5.52 5.52-2.41-2.41L17.73 4zm.42 1-3.67 3.67 1 1L20 5.15V5h-1.85z")
}
[d*="M21.9 19.071c-1.563 1.562-4.095 1.562-5.657 0l-4.4-4.4-.994.995c.468 1.394.147 2.995-.964 4.105-1.562 1.562-4.094 1.562-5.656 0-1.563-1.562-1.563-4.095 0-5.657.98-.98 2.342-1.345 3.608-1.095l1.177-1.177-.928-.927c-1.334.356-2.817.01-3.864-1.036-1.562-1.562-1.562-4.095 0-5.657 1.562-1.562 4.094-1.562 5.657 0 1.046 1.047 1.392 2.53 1.035 3.865l.928.927.002-.002 2.83 2.83-.002.002 7.227 7.227ZM8.5 7c0-.828-.672-1.5-1.5-1.5-.829 0-1.5.672-1.5 1.5 0 .829.671 1.5 1.5 1.5.828 0 1.5-.671 1.5-1.5Zm7.584-2.228c1.563-1.562 4.097-1.56 5.659.001l-6.007 6.007-2.83-2.83 3.178-3.178ZM8.507 16.993c0 .828-.672 1.5-1.5 1.5-.829 0-1.5-.672-1.5-1.5 0-.829.671-1.5 1.5-1.5.828 0 1.5.671 1.5 1.5Z"] {
d: path("M22 3h-4l-5 5 3 3 6-6V3zM10.79 7.79c.12-.41.21-.84.21-1.29C11 4.01 8.99 2 6.5 2S2 4.01 2 6.5 4.01 11 6.5 11c.45 0 .88-.09 1.29-.21L9 12l-1.21 1.21c-.41-.12-.84-.21-1.29-.21C4.01 13 2 15.01 2 17.5S4.01 22 6.5 22s4.5-2.01 4.5-4.5c0-.45-.09-.88-.21-1.29L12 15l6 6h4v-2L10.79 7.79zM6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5 8 5.67 8 6.5 7.33 8 6.5 8zm0 11c-.83 0-1.5-.67-1.5-1.5S5.67 16 6.5 16s1.5.67 1.5 1.5S7.33 19 6.5 19z")
}
/* thanks */
[d*="M16.25 2A6.7 6.7 0 0012 3.509 6.75 6.75 0 001 8.75c0 4.497 2.784 7.818 5.207 9.87a23.498 23.498 0 004.839 3.143l.096.044.03.013.01.005.003.002.002.001c.273-.609.544-1.218.813-1.828 0 0-9-4-9-11.25a4.75 4.75 0 018.932-2.247A1 1 0 0011 7.5v.638c-.357.1-.689.26-.979.49A2.35 2.35 0 009.13 10.5c-.007.424.112.84.342 1.197.21.31.497.563.831.734.546.29 1.23.411 1.693.502.557.109.899.19 1.117.315.086.048.109.082.114.09.004.006.028.045.028.162 0 .024-.008.118-.165.235-.162.122-.5.27-1.09.27-.721 0-1.049-.21-1.181-.323a.6.6 0 01-.142-.168l.005.013.006.014.002.009a.996.996 0 00-1.884.64l.947-.316-.003.001c-.875.292-.939.314-.943.317l.001.003.003.006.004.015.012.032c.045.111.1.218.162.321.146.236.324.444.535.624.357.306.841.566 1.476.702v.605a1 1 0 002 0v-.614c1.29-.289 2.245-1.144 2.245-2.386 0-.44-.103-.852-.327-1.212-.22-.355-.52-.6-.82-.77-.555-.316-1.244-.445-1.719-.539-.567-.111-.915-.185-1.143-.305a.5.5 0 01-.1-.07l-.004-.003-.003-.009a.4.4 0 01-.009-.092c0-.158.053-.244.14-.314.109-.086.341-.19.74-.19.373-.001.73.144.997.404a.996.996 0 001.518-1.286l-.699.58.698-.582v-.001l-.002-.001-.002-.003-.006-.006-.016-.018a2.984 2.984 0 00-.178-.182A3.45 3.45 0 0013 8.154V7.5a1 1 0 00-.933-.997A4.75 4.75 0 0121 8.75C21 16 12 20 12 20l.813 1.827.002-.001.003-.001.01-.005.029-.013.097-.045c.081-.037.191-.09.33-.16a23.5 23.5 0 004.509-2.982C20.216 16.568 23 13.248 23 8.75A6.75 6.75 0 0016.25 2Zm-3.437 19.827L12 20l-.813 1.828.813.36.813-.361Z"] {
d: path("M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm5.5-15c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2zm-3.75 17.85-.75.74-.74-.73-.04-.04C6.27 14.92 3 11.69 3 7.99 3 5.19 4.98 3 7.5 3c1.4 0 2.79.71 3.71 1.89L12 5.9l.79-1.01C13.71 3.71 15.1 3 16.5 3 19.02 3 21 5.19 21 7.99c0 3.7-3.28 6.94-8.25 11.86z")
}
/* share */
[d*="M10 3.158V7.51c-5.428.223-8.27 3.75-8.875 11.199-.04.487-.07.975-.09 1.464l-.014.395c-.014.473.578.684.88.32.302-.368.61-.73.925-1.086l.244-.273c1.79-1.967 3-2.677 4.93-2.917a18.011 18.011 0 012-.112v4.346a1 1 0 001.646.763l9.805-8.297 1.55-1.31-1.55-1.31-9.805-8.297A1 1 0 0010 3.158Zm2 6.27v.002-4.116l7.904 6.688L12 18.689v-4.212l-2.023.024c-1.935.022-3.587.17-5.197 1.024a9 9 0 00-1.348.893c.355-1.947.916-3.39 1.63-4.425 1.062-1.541 2.607-2.385 5.02-2.485L12 9.428Z"] {
d: path("M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z")
}
/* save */
[d*="M18 4v15.06l-5.42-3.87-.58-.42-.58.42L6 19.06V4h12m1-1H5v18l7-5 7 5V3z"],
[d*="M19 2H5a2 2 0 00-2 2v16.887c0 1.266 1.382 2.048 2.469 1.399L12 18.366l6.531 3.919c1.087.652 2.469-.131 2.469-1.397V4a2 2 0 00-2-2ZM5 20.233V4h14v16.233l-6.485-3.89-.515-.309-.515.309L5 20.233Z"] {
d: path("M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z")
}
/* queue */
[d*="M2 2.864v6.277a.5.5 0 00.748.434L9 6.002 2.748 2.43A.5.5 0 002 2.864ZM21 5h-9a1 1 0 100 2h9a1 1 0 100-2Zm0 6H9a1 1 0 000 2h12a1 1 0 000-2Zm0 6H9a1 1 0 000 2h12a1 1 0 000-2Z"] {
d: path("M21 16h-7v-1h7v1zm0-5H9v1h12v-1zm0-4H3v1h18V7zm-11 8-7-4v8l7-4z")
}
/* watch later */
[d*="M20.5 12c0 4.694-3.806 8.5-8.5 8.5S3.5 16.694 3.5 12 7.306 3.5 12 3.5s8.5 3.806 8.5 8.5Zm1.5 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-9.25-5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v5.375l.3.225 4 3c.331.248.802.181 1.05-.15.248-.331.181-.801-.15-1.05l-3.7-2.775V7Z"],
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm0 3a1 1 0 00-1 1v5.565l.485.292 3.33 2a1 1 0 001.03-1.714L13 11.435V7a1 1 0 00-1-1Z"] {
d: path("M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z")
}
[d*="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm1-15c0-.552-.448-1-1-1s-1 .448-1 1v5.5l.4.3 4 3c.442.331 1.069.242 1.4-.2.331-.442.242-1.069-.2-1.4L13 11.5V7Z"],
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 4.5a1 1 0 011 1v4.933l3.515 2.11a1 1 0 01-1.03 1.714l-4-2.4-.485-.291V6.5a1 1 0 011-1Z"] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.97 14.95L10 13.87V7h2v5.76l4.03 2.49-1.06 1.7z")
}
/* download */
[d*="M17.53 11.53c.293-.293.293-.767 0-1.06-.293-.293-.767-.293-1.06 0l-3.72 3.72V3c0-.414-.336-.75-.75-.75s-.75.336-.75.75v11.19l-3.72-3.72c-.293-.293-.767-.293-1.06 0-.293.293-.293.767 0 1.06l5 5 .53.53.53-.53 5-5Zm1.72 8.97c.414 0 .75-.336.75-.75s-.336-.75-.75-.75H4.75c-.414 0-.75.336-.75.75s.336.75.75.75h14.5Z"],
[d*="M12 2a1 1 0 00-1 1v11.586l-4.293-4.293a1 1 0 10-1.414 1.414L12 18.414l6.707-6.707a1 1 0 10-1.414-1.414L13 14.586V3a1 1 0 00-1-1Zm7 18H5a1 1 0 000 2h14a1 1 0 000-2Z"] {
d: path("M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z")
}
/* not interested */
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 018.246 12.605L4.755 6.661A8.99 8.99 0 0112 3ZM3.754 8.393l15.491 8.944A9 9 0 013.754 8.393Z"] {
d: path("M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM3 12c0 2.31.87 4.41 2.29 6L18 5.29C16.41 3.87 14.31 3 12 3c-4.97 0-9 4.03-9 9zm15.71-6L6 18.71C7.59 20.13 9.69 21 12 21c4.97 0 9-4.03 9-9 0-2.31-.87-4.41-2.29-6z")
}
/* don't recommend */
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm4 8H8a1 1 0 000 2h8a1 1 0 000-2Z"] {
d: path("M12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm7 11H5v-2h14v2z")
}
/* collaborate */
[d*="M9 2a5 5 0 100 10A5 5 0 009 2Zm0 2a3 3 0 110 6.001A3 3 0 019 4Zm9 5a3 3 0 100 6 3 3 0 000-6Zm0 2a1 1 0 110 2 1 1 0 010-2Zm-9 2a8 8 0 00-8 8 1 1 0 102 0 5.998 5.998 0 019.776-4.66 7.02 7.02 0 011.355-1.173 4.995 4.995 0 01-.455-.657A8 8 0 009 13Zm9 3a5 5 0 00-5 5 1 1 0 002 0 3.003 3.003 0 013-3 3.003 3.003 0 013 3 1 1 0 002 0 5 5 0 00-5-5Z"] {
d: path("M14 20c0-2.21 1.79-4 4-4s4 1.79 4 4h-8zm4-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-3-8c0-2.21-1.79-4-4-4S7 5.79 7 8c0 1.96 1.42 3.59 3.28 3.93C4.77 12.21 2 15.76 2 20h10.02L12 19H3.06c.38-3.11 2.61-6.1 7.94-6.1.62 0 1.19.05 1.73.13l.84-.84c-.58-.13-1.19-.23-1.85-.26A4.004 4.004 0 0015 8zm-4 3c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z")
}
/* move playlist */
[d*="M5 8h14a1 1 0 100-2H5a1 1 0 000 2Zm.293 8.293a1 1 0 101.414 1.414L12 12.414l5.293 5.293a1 1 0 001.414-1.414l-6-6L12 9.586l-.707.707-6 6Z"] {
d: path("M7 5L7 4L18 4L18 5L7 5ZM7.5 11.6L8.2 12.3L12 8.6L12 19L13 19L13 8.6L16.8 12.4L17.5 11.7L12.5 6.7L7.5 11.6Z")
}
[d*="M18.707 7.707a1 1 0 10-1.414-1.414L12 11.586 6.707 6.293a1 1 0 10-1.414 1.414L12 14.414l6.707-6.707ZM19 18a1 1 0 000-2H5a1 1 0 000 2h14Z"] {
d: path("M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z")
}
[d*="M20 7H4a1 1 0 000 2h16a1 1 0 100-2Zm0 8H4a1 1 0 000 2h16a1 1 0 000-2Z"] {
d: path("M21 10H3V9h18v1Zm0 4H3v1h18v-1Z")
}
/* set pl thumbnail */
[d*=""] {
d: path("M14.04 13.61 16.86 17H11.5l.3-.4 2.24-2.99m-5.11 1.08 1.24 1.86.3.45H7.08l1.85-2.31M14 12l-3 4-2-3-4 5h14l-5-6zm6-8v16H4V4h16m1-1H3v18h18V3z")
}
/* eye */
[d*="M3.132 12.001c3.197-7.95 14.54-7.95 17.736 0-3.197 7.95-14.54 7.95-17.736 0Zm12.868 0a4 4 0 11-8 0 4 4 0 018 0Zm-14.908.258c3.645 10.272 18.172 10.272 21.817 0a.772.772 0 000-.516c-3.645-10.272-18.172-10.272-21.817 0a.771.771 0 000 .516ZM14 12.001a2 2 0 11-4 0 2 2 0 014 0Z"] {
d: path("M12 8.91c1.7 0 3.09 1.39 3.09 3.09S13.7 15.09 12 15.09 8.91 13.7 8.91 12 10.3 8.91 12 8.91m0-1c-2.25 0-4.09 1.84-4.09 4.09s1.84 4.09 4.09 4.09 4.09-1.84 4.09-4.09S14.25 7.91 12 7.91zm0-1.73c3.9 0 7.35 2.27 8.92 5.82-1.56 3.55-5.02 5.82-8.92 5.82-3.9 0-7.35-2.27-8.92-5.82C4.65 8.45 8.1 6.18 12 6.18m0-1C7.45 5.18 3.57 8.01 2 12c1.57 3.99 5.45 6.82 10 6.82s8.43-2.83 10-6.82c-1.57-3.99-5.45-6.82-10-6.82z")
}
[d*="m6.666 5.303 2.122 1.272c4.486-1.548 10.002.26 12.08 5.426-.2.5-.435.968-.696 1.406l1.717 1.03c.41-.69.752-1.42 1.02-2.178a.77.77 0 000-.516l-.18-.473C19.998 4.436 12.294 2.448 6.667 5.303Zm-5.524.183a1.003 1.003 0 00.343 1.371l1.8 1.08a11.8 11.8 0 00-2.193 3.805.77.77 0 000 .516c2.853 8.041 12.37 9.784 18.12 5.235l2.273 1.364a1 1 0 101.03-1.714l-20-12a1 1 0 00-1.373.343Zm11.064 2.52L12 8c-.248 0-.49.022-.727.066l4.54 2.724a4 4 0 00-3.607-2.785ZM5.04 8.99l3.124 1.874C8.057 11.224 8 11.606 8 12l.005.206a4 4 0 003.79 3.79L12 16c1.05 0 2.057-.414 2.803-1.152l2.54 1.524C12.655 19.48 5.556 18.024 3.133 12A9.6 9.6 0 015.04 8.99ZM10 12v-.033l2.967 1.78a1.99 1.99 0 01-2.307-.262 2 2 0 01-.65-1.28L10 12Z"] {
d: path("m3.85 3.15-.7.7L6.19 6.9C4.31 8.11 2.83 9.89 2 12c1.57 3.99 5.45 6.82 10 6.82 1.77 0 3.44-.43 4.92-1.2l3.23 3.23.71-.71L3.85 3.15zM13.8 14.5c-.51.37-1.13.59-1.8.59-1.7 0-3.09-1.39-3.09-3.09 0-.67.22-1.29.59-1.8l4.3 4.3zM12 17.82c-3.9 0-7.35-2.27-8.92-5.82.82-1.87 2.18-3.36 3.83-4.38L8.79 9.5c-.54.69-.88 1.56-.88 2.5 0 2.25 1.84 4.09 4.09 4.09.95 0 1.81-.34 2.5-.88l1.67 1.67c-1.27.61-2.69.94-4.17.94zm-.51-9.87c.17-.02.34-.05.51-.05 2.25 0 4.09 1.84 4.09 4.09 0 .17-.02.34-.05.51l-1.01-1.01c-.21-1.31-1.24-2.33-2.55-2.55l-.99-.99zM9.12 5.59c.92-.26 1.88-.41 2.88-.41 4.55 0 8.43 2.83 10 6.82-.58 1.47-1.48 2.78-2.61 3.85l-.72-.72c.93-.87 1.71-1.92 2.25-3.13C19.35 8.45 15.9 6.18 12 6.18c-.7 0-1.39.08-2.06.22l-.82-.81z")
}
/* public */
[d*=""] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM3 12c0-.7.09-1.37.24-2.02L8 14.71v.79c0 1.76 1.31 3.22 3 3.46v1.98c-4.49-.5-8-4.32-8-8.94zm8.5 6C10.12 18 9 16.88 9 15.5v-1.21l-5.43-5.4C4.84 5.46 8.13 3 12 3c1.05 0 2.06.19 3 .53V5c0 .55-.45 1-1 1h-3v2c0 .55-.45 1-1 1H8v3h6c.55 0 1 .45 1 1v4h2c.55 0 1 .45 1 1v.69C16.41 20.12 14.31 21 12 21v-3h-.5zm7.47-.31C18.82 16.73 18 16 17 16h-1v-3c0-1.1-.9-2-2-2H9v-1h1c1.1 0 2-.9 2-2V7h2c1.1 0 2-.9 2-2V3.95c2.96 1.48 5 4.53 5 8.05 0 2.16-.76 4.14-2.03 5.69z")
}
/* unlisted */
[d*="M9 18c.226 0 .448-.012.667-.037A8.001 8.001 0 018.07 16H7a4 4 0 110-8h2a4 4 0 014 4 2 2 0 001.668 1.973A5.999 5.999 0 009 6H7a6 6 0 100 12h2Zm8 0a6 6 0 100-12h-2c-.225 0-.448.012-.667.036A8 8 0 0115.93 8H17a4 4 0 110 8h-2a4 4 0 01-4-4 2 2 0 00-1.668-1.973A6 6 0 0015 18h2Z"] {
d: path("M17.78 16H13v-1h4.78c1.8 0 3.26-1.57 3.26-3.5S19.58 8 17.78 8H13V7h4.78c2.35 0 4.26 2.02 4.26 4.5S20.13 16 17.78 16zM11 15H6.19c-1.8 0-3.26-1.57-3.26-3.5S4.39 8 6.19 8H11V7H6.19c-2.35 0-4.26 2.02-4.26 4.5S3.84 16 6.19 16H11v-1zm5-4H8v1h8v-1z")
}
/* private */
[d*="M9 .75A3.75 3.75 0 005.25 4.5v2.25h-1.5a1.5 1.5 0 00-1.5 1.5v7.5l.008.153a1.5 1.5 0 001.339 1.34l.153.007h10.5l.153-.008a1.5 1.5 0 001.347-1.492v-7.5a1.5 1.5 0 00-1.5-1.5h-1.5V4.5A3.75 3.75 0 009 .75Zm0 1.5a2.25 2.25 0 012.25 2.25v2.25h-4.5V4.5A2.25 2.25 0 019 2.25Zm-5.25 13.5v-7.5h10.5v7.5H3.75Zm5.25-6a1.5 1.5 0 00-.75 2.798v1.327c0 .207.168.375.375.375h.75a.375.375 0 00.375-.375v-1.327A1.498 1.498 0 009 9.75Z"],
[d*="M12 1a5 5 0 00-5 5v3H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V11a2 2 0 00-2-2h-2V6a5 5 0 00-5-5Zm0 2a3 3 0 013 3v3H9V6a3 3 0 013-3ZM5 21V11h14v10H5Zm7-8a2 2 0 00-1 3.73v1.77a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1.77A2 2 0 0012 13Z"] {
d: path("M17 8V6.63C17 4.08 14.76 2 12 2S7 4.08 7 6.63V8H4v14h16V8h-3zM8 6.63c0-2.02 1.79-3.66 4-3.66s4 1.64 4 3.66V8H8V6.63zM19 21H5V9h14v12zm-7-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z")
}
/* members only */
[d*="M12 1a8.5 8.5 0 00-7.444 12.604 8.5 8.5 0 002.91 3.082l.136.087a8.624 8.624 0 001.09.558l.097.038a7.994 7.994 0 001.644.482A8.503 8.503 0 0012 18a8.5 8.5 0 001.566-.148 8.002 8.002 0 001.645-.482l.098-.038a8.885 8.885 0 001.225-.644A8.5 8.5 0 0012 1Zm.354 4.33 1.191 2.413 2.664.388a.394.394 0 01.22.672l-1.929 1.88.455 2.653a.395.395 0 01-.572.416L12 12.499l-2.383 1.253a.393.393 0 01-.572-.416l.455-2.653-1.928-1.88a.394.394 0 01.22-.672l2.663-.388 1.192-2.413a.394.394 0 01.707 0ZM18 22v-4.5a9.96 9.96 0 01-6 2 9.96 9.96 0 01-6-2V22a1 1 0 001.371.93l4.63-1.853 4.628 1.852A1.001 1.001 0 0018 22Z"] {
d: path("M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7Zm2.47 10.5L7.99 9.94 5.5 11.5l.67-2.97L4 6.5l2.87-.22L8.01 3.5l1.12 2.78L12 6.5 9.82 8.53l.65 2.97Z")
}
/* auto dubbed */
[d*="M19.4.2a1 1 0 00-.2 1.4 9 9 0 01-.022 10.83 1 1 0 001.595 1.206A11 11 0 0020.8.4a1 1 0 00-1.4-.2ZM10 2a5 5 0 100 10 5 5 0 000-10Zm6.17.3a1 1 0 00-.028 1.414c.895.932 1.365 2.114 1.358 3.312-.006 1.199-.49 2.378-1.396 3.302a1.001 1.001 0 101.427 1.4c1.257-1.281 1.959-2.953 1.969-4.69.009-1.738-.673-3.416-1.916-4.71A1 1 0 0016.17 2.3ZM10 13a8 8 0 00-8 8 1 1 0 001 1h14l.102-.005A1 1 0 0018 21a8 8 0 00-8-8Z"] {
d: path("M8 3.975a3 3 0 00-.736-1.942l.755-.656a4 4 0 01.045 5.195l-.766-.643A3 3 0 008 3.975ZM5 6a2 2 0 100-4 2 2 0 000 4Zm2.828 1.526C8.578 8.182 9 9.073 9 10H1c0-.928.421-1.819 1.172-2.475C2.922 6.87 3.939 6.5 5 6.5c1.06 0 2.078.369 2.828 1.025ZM8.774.72a5 5 0 01.056 6.495l.766.643A6 6 0 009.528.064l-.754.657Z");
transform: scale(1.67)
}
/* edit icon */
[d*="M15.293 3.293 4.96 13.626c-.22.219-.385.488-.484.782l-1.924 5.778-.633 1.897 1.897-.633 5.777-1.927a2 2 0 00.78-.482l9.334-9.334 1-1a3.83 3.83 0 00-5.414-5.414Zm4 1.414a1.83 1.83 0 010 2.586L19 7.586 16.414 5l.293-.293a1.83 1.83 0 012.586 0ZM6.374 15.04 15 6.414 17.586 9 8.96 17.626 5.08 18.92l1.294-3.88Z"] {
d: path("m14.06 7.6 2.34 2.34L6.34 20H4v-2.34L14.06 7.6m0-1.41L3 17.25V21h3.75L17.81 9.94l-3.75-3.75zm3.55-2.14 2.37 2.37-1.14 1.14-2.37-2.37 1.14-1.14m0-1.42-2.55 2.55 3.79 3.79 2.55-2.55-3.79-3.79z")
}
/* loop */
[d*="M17.293 1.293a1 1 0 000 1.415L18.586 4H7a5 5 0 00-5 5v4a1 1 0 102 0V9a3 3 0 013-3h11.586l-1.293 1.293a1 1 0 001.414 1.415L22.414 5l-3.707-3.707a1 1 0 00-1.414 0ZM21 10a1 1 0 00-1 1v4a3 3 0 01-3 3H5.414l1.293-1.292a1.001 1.001 0 00-1.414-1.415L1.586 19l3.707 3.707a1 1 0 101.414-1.413L5.414 20H17a5 5 0 005-5v-4a1 1 0 00-1-1Z"] {
d: path("M21 13h1v5l-18.07.03 2.62 2.62-.71.71-3.85-3.86 3.85-3.85.71.71-2.67 2.67L21 17v-4zM3 7l17.12-.03-2.67 2.67.71.71 3.85-3.85-3.85-3.85-.71.71 2.62 2.62L2 6v5h1V7z")
}
/* shuffle */
[d*="M16.293 1.293a1 1 0 00-.001 1.415L18.585 5H17.21a7 7 0 00-5.823 3.118L6.95 14.774A5 5 0 012.79 17H2a1 1 0 000 2h.79a7 7 0 005.822-3.117l4.438-6.656A5 5 0 0117.21 7h1.376l-2.293 2.293a1 1 0 001.414 1.414L22.414 6l-4.707-4.707a1 1 0 00-1.414 0ZM2.789 5H2a1 1 0 000 2h.79a5 5 0 014.159 2.227l.647.97 1.202-1.802-.185-.277A7 7 0 002.789 5Zm13.504 8.293a1 1 0 00-.001 1.414L18.585 17H17.21a5 5 0 01-4.16-2.226l-.648-.972-1.202 1.803.186.278A7 7 0 0017.21 19h1.376l-2.293 2.294-.068.076a1 1 0 001.406 1.406l.076-.07L22.414 18l-4.707-4.707a1 1 0 00-1.414 0Z"] {
d: path("M18.15 13.65 22 17.5l-3.85 3.85-.71-.71L20.09 18H19c-2.84 0-5.53-1.23-7.39-3.38l.76-.65C14.03 15.89 16.45 17 19 17h1.09l-2.65-2.65.71-.7zM19 7h1.09l-2.65 2.65.71.71L22 6.51l-3.85-3.85-.71.71L20.09 6H19c-3.58 0-6.86 1.95-8.57 5.09l-.73 1.34C8.16 15.25 5.21 17 2 17v1c3.58 0 6.86-1.95 8.57-5.09l.73-1.34C12.84 8.75 15.79 7 19 7zM8.59 9.98l.75-.66C7.49 7.21 4.81 6 2 6v1c2.52 0 4.92 1.09 6.59 2.98z")
}
/* report */
[d*="M4.75 3H4v18.25c0 .414.336.75.75.75s.75-.336.75-.75V14H11l.585 1.17c.254.509.774.83 1.342.83H18.5c.828 0 1.5-.672 1.5-1.5v-8c0-.828-.672-1.5-1.5-1.5H13l-.585-1.17C12.16 3.32 11.64 3 11.073 3H4.75Zm.75 9.5h6.427l.415.83.585 1.17H18.5v-8h-6.427l-.415-.83-.585-1.17H5.5v8Z"],
[d*="m4 2.999-.146.073A1.55 1.55 0 003 4.454v16.545a1 1 0 102 0v-6.491a7.26 7.26 0 016.248.115l.752.376a8.94 8.94 0 008 0l.145-.073c.524-.262.855-.797.855-1.382V4.458a1.21 1.21 0 00-1.752-1.083 7.26 7.26 0 01-6.496 0L12 2.999a8.94 8.94 0 00-8 0Zm7.105 1.79v-.002l.752.376A9.26 9.26 0 0019 5.641v7.62a6.95 6.95 0 01-6.105-.052l-.752-.376A9.261 9.261 0 005 12.355v-7.62a6.94 6.94 0 016.105.054Z"] {
d: path("m13.18 4 .24 1.2.16.8H19v7h-5.18l-.24-1.2-.16-.8H6V4h7.18M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z")
}
[d*="M5 3h6.073a1.5 1.5 0 011.342.83L13 5h5.5A1.5 1.5 0 0120 6.5v8a1.5 1.5 0 01-1.5 1.5h-5.573a1.5 1.5 0 01-1.342-.83L11 14H6v7a1 1 0 11-2 0V3h1Z"],
[d*="M3.854 3.072A1.55 1.55 0 003 4.454v16.545a1 1 0 102 0v-6.494a7.262 7.262 0 016.248.119L12 15a8.94 8.94 0 008 0l.146-.074c.524-.262.854-.797.854-1.382V4.458a1.21 1.21 0 00-1.752-1.082 7.26 7.26 0 01-6.496 0L12 3a8.94 8.94 0 00-8 0l-.146.072Z"] {
d: path("M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z")
}
/* sort */
[d*="M21 5H3a1 1 0 000 2h18a1 1 0 100-2Zm-6 6H3a1 1 0 000 2h12a1 1 0 000-2Zm-6 6H3a1 1 0 000 2h6a1 1 0 000-2Z"] {
d: path("M21 6H3V5h18v1zm-6 5H3v1h12v-1zm-6 6H3v1h6v-1z")
}
/* badges */
[d*="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm5.707 7.293a1 1 0 010 1.414L10 17.414l-3.707-3.707a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0Z"] {
d: path("M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z")
}
[d*="M19.793 5.793 8.5 17.086l-4.293-4.293a1 1 0 10-1.414 1.414L8.5 19.914 21.207 7.207a1 1 0 10-1.414-1.414Z"] {
d: path("m9 18.7-5.4-5.4.7-.7L9 17.3 20.6 5.6l.7.7L9 18.7z")
}
[d*="M9.03 2.242 8.272 3H7.2A4.2 4.2 0 003 7.2v1.072l-.758.758a4.2 4.2 0 000 5.94l.758.758V16.8A4.2 4.2 0 007.2 21h1.072l.758.758a4.2 4.2 0 005.94 0l.758-.758H16.8a4.2 4.2 0 004.2-4.2v-1.072l.758-.758a4.2 4.2 0 000-5.94L21 8.272V7.2A4.2 4.2 0 0016.8 3h-1.072l-.758-.758a4.2 4.2 0 00-5.94 0Zm7.73 6.638a.5.5 0 01.241.427v1.743a.256.256 0 01-.386.219L14.001 9.7v4.55a2.75 2.75 0 11-2-2.646V6.888a.5.5 0 01.759-.428l4 2.42Z"] {
d: path("M8 8.764V2h5v3H9v6a3 3 0 11-1-2.236Z");
transform: scale(1.5) !important
}
[d*="M13.053 5.906a2.1 2.1 0 01.002 4.188 2.1 2.1 0 01-2.963 2.961 2.1 2.1 0 01-4.189.003 2.1 2.1 0 01-2.96-2.964 2.1 2.1 0 01-.002-4.188 2.1 2.1 0 012.962-2.961 2.1 2.1 0 014.189-.001 2.1 2.1 0 012.961 2.962ZM7.999 4v4.668a1.75 1.75 0 101 1.582V6h2V4h-3Z"],
[d*="M10.334 4.205a1.8 1.8 0 010 3.59 1.8 1.8 0 01-2.539 2.54 1.8 1.8 0 01-3.59-.001 1.8 1.8 0 01-2.538-2.539 1.8 1.8 0 010-3.59 1.8 1.8 0 012.538-2.539 1.8 1.8 0 013.59 0 1.8 1.8 0 012.539 2.539ZM6 3v2.668A1.75 1.75 0 107 7.25V4h1V3H6Z"] {
d: path("M8 8.764V2h5v3H9v6a3 3 0 11-1-2.236Z")
}
.yt-badge-shape--default {
background: none !important
}
/* heart */
[d*="M16.25 2.5A6.56 6.56 0 0012 4.062 6.56 6.56 0 007.75 2.5C3.927 2.5 1 5.732 1 9.5c0 4.436 2.807 7.696 5.225 9.698a23.597 23.597 0 004.837 3.072l.095.044.029.013.01.004.005.003c.269-.61.535-1.222.799-1.834.797 1.834.799 1.834.799 1.834l.001-.001.003-.002.01-.004.03-.013.095-.044c.08-.037.19-.089.33-.157a23.6 23.6 0 004.507-2.915C20.193 17.196 23 13.936 23 9.5c0-3.768-2.927-7-6.75-7Zm0 2c2.623 0 4.75 2.239 4.75 5 0 7.089-9 11-9 11s-9-3.911-9-11c0-2.761 2.127-5 4.75-5a4.58 4.58 0 012.922 1.058A5 5 0 0112 7.265a5 5 0 011.328-1.707A4.58 4.58 0 0116.25 4.5Zm-3.453 17.834L12 20.5l-.797 1.834.797.347.797-.347Z"] {
d: path("M16.5 3C19.02 3 21 5.19 21 7.99c0 3.7-3.28 6.94-8.25 11.86l-.75.74-.74-.73-.04-.04C6.27 14.92 3 11.69 3 7.99 3 5.19 4.98 3 7.5 3c1.4 0 2.79.71 3.71 1.89L12 5.9l.79-1.01C13.71 3.71 15.1 3 16.5 3Zm0-1c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2Z")
}
[d*="M16.25 3.5c-1.697 0-3.206.765-4.25 1.96C10.956 4.265 9.447 3.5 7.75 3.5 4.527 3.5 2 6.235 2 9.5c0 3.99 2.53 6.996 4.862 8.929 2.355 1.95 4.703 2.972 4.74 2.988l.398.174.398-.174c.037-.016 2.385-1.038 4.74-2.988C19.471 16.495 22 13.49 22 9.5c0-3.265-2.527-6-5.75-6Z"] {
d: path("M16.5 2c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2Z")
}
/* pinned */
[d*="M21.007 6.298 11.7.924l-.077-.04a.85.85 0 00-.772 1.51l.735.425-3.394 5.878-1.718.46a1.5 1.5 0 00-.91.698l-1.012 1.753a.75.75 0 00.274 1.024l9.479 5.473a.75.75 0 001.024-.275l1.01-1.752a1.501 1.501 0 00.15-1.14l-.46-1.715 3.395-5.88.734.425a.85.85 0 00.849-1.47Zm-11.083 3.4 3.243-5.617 4.373 2.525-3.242 5.616a2 2 0 00-.2 1.518l.407 1.517-.283.49-7.313-4.22.283-.49 1.518-.41a2 2 0 001.214-.93ZM7.15 21.814l3.395-5.88-1.96-1.13-3.393 5.879-.152 2.525 2.11-1.394Z"] {
d: path("M16 11V3h1V2H7v1h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2zm1 3H7v-.59l1.71-1.71.29-.29V3h6v8.41l.29.29L17 13.41V14z")
}
/* unpinned */
[d*="m20.272 5.876-.916-.529-6.004-3.466-.918-.529-.06-.035-.674-.39a.85.85 0 10-.85 1.468l.675.39.06.035-.15.262-.85 1.47-1.33 2.304 1.715 1.03 2.196-3.803 4.374 2.525-2.24 3.876 1.717 1.03 1.406-2.436.85-1.47.151-.263.06.035.674.39a.848.848 0 00.848-1.469l-.674-.39-.06-.035Zm-3.82 9.963 5.033 3.02a1 1 0 001.03-1.715l-20-12a1 1 0 10-1.03 1.715l4.38 2.628a1.5 1.5 0 00-.303.37l-1.01 1.753a.75.75 0 00.274 1.024l9.478 5.472a.75.75 0 001.024-.274l1.012-1.752c.045-.077.082-.157.112-.24m-2.136-1.28.188.7-.283.49-7.313-4.222.283-.49.87-.233 6.255 3.755Zm-3.77 1.38-1.96-1.132-3.395 5.878-.15 2.525 2.11-1.393 3.394-5.878Z"] {
d: path("m3.85 3.15-.7.7L8 8.71V11l-2 2v2h5v6l1 1 1-1v-6h1.29l5.85 5.85.71-.71-17-16.99zM13 14H7v-.59l1.71-1.71.29-.29v-1.7L13.29 14H13zM8 3H7V2h10v1h-1v8l2 2v1.41l-3-3V3H9v2.41l-1-1V3z")
}
/* location */
[d*=""] {
d: path("M12 3c3.31 0 6 2.69 6 6 0 3.83-4.25 9.36-6 11.47C9.82 17.86 6 12.54 6 9c0-3.31 2.69-6 6-6m0-1C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-1c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z")
}
/* bell notification */
[d*="m13.497 4.898.053.8.694.4C15.596 6.878 16.5 8.334 16.5 10v2.892c0 .997.27 1.975.784 2.83L18.35 17.5H5.649l1.067-1.778c.513-.855.784-1.833.784-2.83V10c0-1.666.904-3.122 2.256-3.902l.694-.4.053-.8c.052-.78.703-1.398 1.497-1.398.794 0 1.445.618 1.497 1.398ZM6 10c0-2.224 1.21-4.165 3.007-5.201C9.11 3.236 10.41 2 12 2c1.59 0 2.89 1.236 2.993 2.799C16.79 5.835 18 7.776 18 10v2.892c0 .725.197 1.436.57 2.058l1.521 2.535c.4.667-.08 1.515-.857 1.515H15c0 .796-.316 1.559-.879 2.121-.562.563-1.325.879-2.121.879s-1.559-.316-2.121-.879C9.316 20.56 9 19.796 9 19H4.766c-.777 0-1.257-.848-.857-1.515L5.43 14.95c.373-.622.57-1.333.57-2.058V10Zm4.5 9c0 .398.158.78.44 1.06.28.282.662.44 1.06.44s.78-.158 1.06-.44c.282-.28.44-.662.44-1.06h-3Z"] {
d: path("M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z")
}
[d*="M16 19a4 4 0 11-8 0H4.765C3.21 19 2.25 17.304 3.05 15.97l1.806-3.01A1 1 0 005 12.446V8a7 7 0 0114 0v4.446c0 .181.05.36.142.515l1.807 3.01c.8 1.333-.161 3.029-1.716 3.029H16ZM12 3a5 5 0 00-5 5v4.446a3 3 0 01-.428 1.543L4.765 17h14.468l-1.805-3.01A3 3 0 0117 12.445V8a5 5 0 00-5-5Zm-2 16a2 2 0 104 0h-4Z"] {
d: path("M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z")
}
[d*=" M12,3 C9.23900032043457,3 7,5.238999843597412 7,8 C7,8 7,12.446000099182129 7,12.446000099182129 C7,12.989999771118164 6.8520002365112305,13.52400016784668 6.572000026702881,13.989999771118164 C6.572000026702881,13.989999771118164 4.765999794006348,17 4.765999794006348,17 C4.765999794006348,17 19.232999801635742,17 19.232999801635742,17 C19.232999801635742,17 17.42799949645996,13.98900032043457 17.42799949645996,13.98900032043457 C17.148000717163086,13.52299976348877 17,12.989999771118164 17,12.446000099182129 C17,12.446000099182129 17,8 17,8 C17,5.238999843597412 14.76099967956543,3 12,3z M12,1 C15.866000175476074,1 19,4.133999824523926 19,8 C19,8 19,12.446000099182129 19,12.446000099182129 C19,12.626999855041504 19.049999237060547,12.805999755859375 19.14299964904785,12.961000442504883 C19.14299964904785,12.961000442504883 20.947999954223633,15.972000122070312 20.947999954223633,15.972000122070312 C21.74799919128418,17.30500030517578 20.788000106811523,19 19.232999801635742,19 C19.232999801635742,19 4.765999794006348,19 4.765999794006348,19 C3.2119998931884766,19 2.252000093460083,17.30500030517578 3.0510001182556152,15.972000122070312 C3.0510001182556152,15.972000122070312 4.85699987411499,12.961000442504883 4.85699987411499,12.961000442504883 C4.949999809265137,12.805999755859375 5,12.626999855041504 5,12.446000099182129 C5,12.446000099182129 5,8 5,8 C5,4.133999824523926 8.133999824523926,1 12,1z"] {
d: path("M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z")
}
[d*="M18.001 10a6.003 6.003 0 00-4.025-5.667 2 2 0 10-3.945-.002A6.003 6.003 0 006.001 10v3.988a.044.044 0 01-.006.022L3.91 17.485A1 1 0 004.767 19h14.468a1 1 0 00.857-1.515l-2.085-3.475a.044.044 0 01-.006-.022V10Zm-6 12a3.001 3.001 0 002.83-2H9.17A3.001 3.001 0 0012 22Z"] {
d: path("M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87z")
}
[d*=" M10,19 C10,20.104999542236328 10.895000457763672,21 12,21 C13.104999542236328,21 14,20.104999542236328 14,19 C14,19 10,19 10,19z M16,19 C16,21.208999633789062 14.208999633789062,23 12,23 C9.791000366210938,23 8,21.208999633789062 8,19 C8,19 16,19 16,19z"] {
display: none !important
}
[d*="M19.395 1.196a1 1 0 00-.199 1.4A9 9 0 0121 8a1 1 0 002 0 11 11 0 00-2.205-6.605 1 1 0 00-1.4-.199Zm-16.192.2A11 11 0 001 8a1 1 0 002 0 9 9 0 011.803-5.404 1 1 0 00-1.6-1.2ZM12 1a7 7 0 00-7 7v4.446a1 1 0 01-.144.515L3.05 15.972C2.25 17.305 3.21 19 4.766 19H8a4 4 0 108 0h3.233c1.555 0 2.515-1.695 1.715-3.029l-1.805-3.01a1 1 0 01-.143-.515V8a7 7 0 00-7-7Zm0 2a5 5 0 015 5v4.445a3 3 0 00.428 1.545L19.233 17H4.766l1.806-3.01c.28-.466.428-1 .428-1.544V8a5 5 0 015-5Zm-2 16h4a2 2 0 01-4 0Z"],
[d*="M19.395 1.196a1 1 0 00-.199 1.4A9 9 0 0121 8a1 1 0 002 0 11 11 0 00-2.205-6.605 1 1 0 00-1.4-.199Zm-16.192.2A11 11 0 001 8a1 1 0 002 0 9 9 0 011.803-5.404 1 1 0 00-1.6-1.2ZM12 1a7 7 0 00-7 7v4.446a1 1 0 01-.144.515L3.05 15.972C2.25 17.305 3.21 19 4.766 19H8a4 4 0 108 0h3.233c1.555 0 2.515-1.695 1.715-3.029l-1.805-3.01a1 1 0 01-.143-.515V8a7 7 0 00-7-7Zm0 2a5 5 0 015 5v4.445a3 3 0 00.428 1.545L19.233 17H4.766l1.806-3.01c.28-.466.428-1 .428-1.544V8a5 5 0 015-5Zm-2 16h4a2 2 0 01-4 0Z"] {
d: path("M21.5 9h-2v-.19c0-1.91-1.11-3.62-2.9-4.48l.87-1.8c2.49 1.19 4.03 3.6 4.03 6.28V9zm-17-.19c0-1.91 1.11-3.62 2.9-4.48l-.87-1.8C4.04 3.72 2.5 6.13 2.5 8.81V9h2v-.19zM12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm8-4.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87z")
}
[d*="M12 1a7 7 0 00-6.213 3.774l1.719 1.032A5 5 0 0117 8v3.502l2 1.199V8a7 7 0 00-7-7ZM1.141 5.485a1 1 0 00.343 1.372l3.514 2.109v3.48a1 1 0 01-.143.514L3.05 15.97c-.8 1.334.16 3.03 1.716 3.03H8a4 4 0 108 0l6-.001a1 1 0 00.515-1.856l-20-12a1 1 0 00-1.373.342ZM7 12.446v-2.28L18.39 17H4.766l1.806-3.011A3 3 0 007 12.446ZM10 19h4a2 2 0 01-4 0Z"],
[d*="M12 1a7 7 0 00-6.213 3.774l1.719 1.032A5 5 0 0117 8v3.502l2 1.199V8a7 7 0 00-7-7ZM1.141 5.485a1 1 0 00.343 1.372l3.514 2.109v3.48a1 1 0 01-.143.514L3.05 15.97c-.8 1.334.16 3.03 1.716 3.03H8a4 4 0 108 0l6-.001a1 1 0 00.515-1.856l-20-12a1 1 0 00-1.373.342ZM7 12.446v-2.28L18.39 17H4.766l1.806-3.011A3 3 0 007 12.446ZM10 19h4a2 2 0 01-4 0Z"] {
d: path("m3.85 3.15-.7.7 3.48 3.48C6.22 8.21 6 9.22 6 10.32v5.15l-2 1.88V19h14.29l1.85 1.85.71-.71-17-16.99zM5 18v-.23l2-1.88v-5.47c0-.85.15-1.62.41-2.3L17.29 18H5zm5 2h4c0 1.1-.9 2-2 2s-2-.9-2-2zM9.28 5.75l-.7-.7c.43-.29.9-.54 1.42-.7v-.39c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v4.14l-1-1v-3.05c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03-.27.11-.51.24-.75.4z")
}
ytd-notification-topbar-button-renderer [d*="M16 19a4 4 0 11-8 0H4.765C3.21 19 2.25 17.304 3.05 15.97l1.806-3.01A1 1 0 005 12.446V8a7 7 0 0114 0v4.446c0 .181.05.36.142.515l1.807 3.01c.8 1.333-.161 3.029-1.716 3.029H16ZM12 3a5 5 0 00-5 5v4.446a3 3 0 01-.428 1.543L4.765 17h14.468l-1.805-3.01A3 3 0 0117 12.445V8a5 5 0 00-5-5Zm-2 16a2 2 0 104 0h-4Z"] {
d: path("M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z");
fill-rule: evenodd
}
/* unsubscribe */
[d*="M12 2a5 5 0 100 10 5 5 0 000-10Zm0 2a3 3 0 110 6 3 3 0 010-6Zm0 9a8 8 0 00-8 8 1 1 0 102 0 6 6 0 018.296-5.543l.171.075 1.485-1.485A8 8 0 0012 13Zm9.293 3.293L19.5 18.086l-1.793-1.793a1 1 0 10-1.414 1.414l1.793 1.793-1.793 1.793a1 1 0 001.414 1.414l1.793-1.793 1.793 1.793a1 1 0 101.414-1.414L20.914 19.5l1.793-1.793a1 1 0 00-1.414-1.414Z"] {
d: path("M13.72 11.93C15.58 11.59 17 9.96 17 8c0-2.21-1.79-4-4-4S9 5.79 9 8c0 1.96 1.42 3.59 3.28 3.93C6.77 12.21 4 15.76 4 20h18c0-4.24-2.77-7.79-8.28-8.07zM10 8c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm3 4.9c5.33 0 7.56 2.99 7.94 6.1H5.06c.38-3.11 2.61-6.1 7.94-6.1zM7 12H2v-1h5v1z")
}
/* comments */
[d*="M1 6a4 4 0 014-4h14a4 4 0 014 4v10a4 4 0 01-4 4h-4.8l-5.105 2.836A1.41 1.41 0 017 21.604V20H5a4 4 0 01-4-4V6Zm8 12v2.601l4.229-2.35.453-.251H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h4ZM7 8a1 1 0 000 2h10a1 1 0 100-2H7Zm-1 5a1 1 0 001 1h6a1 1 0 000-2H7a1 1 0 00-1 1Z"] {
d: path("M8 7h8v2H8V7zm0 6h5v-2H8v2zM5 3v13h10.41l.29.29 3.3 3.3V3H5M4 2h16v20l-5-5H4V2z")
}
/* chat */
[d*="M16 2H4a3 3 0 00-3 3v8a3 3 0 003 3h1v2.14a.8.8 0 001.188.7L11.3 16H16a3 3 0 003-3V5a3 3 0 00-3-3ZM4 4h12a1 1 0 011 1v8a1 1 0 01-1 1h-5.218l-.452.252L7 16.1V14H4a1 1 0 01-1-1V5a1 1 0 011-1Zm17 2.174A3 3 0 0123 9v8a3 3 0 01-2.846 2.996L20 20v2.14a.8.8 0 01-1.189.7L13.701 20H8.216l3.6-2h2.402l.453.252L18 20.101V18.05l1.95-.05.113-.003A1 1 0 0021 17V6.174Z"] {
d: path("M16 3v11H7.59L5 16.59V3h11m1-1H4v17l4-4h9V2zM8 18h8l4 4V6h-1v13.59L16.41 17H8v1z")
}
/* description */
[d*="M4 5a1 1 0 000 2h16a1 1 0 100-2H4Zm-1 5a1 1 0 001 1h10a1 1 0 000-2H4a1 1 0 00-1 1Zm1 3a1 1 0 000 2h16a1 1 0 000-2H4Zm0 4a1 1 0 000 2h10a1 1 0 000-2H4Z"] {
d: path("M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z")
}
/* subtitles */
ytd-menu-navigation-item-renderer svg path [d*="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2ZM3 19V5h18v14H3ZM6.972 8.346c-.631.336-1.131.881-1.466 1.526A4.6 4.6 0 005 12c-.004.74.17 1.47.506 2.128.336.645.835 1.191 1.466 1.526a2.86 2.86 0 002.066.257c.697-.178 1.294-.606 1.737-1.176a1 1 0 00-1.578-1.228c-.21.27-.444.413-.654.467a.86.86 0 01-.632-.085c-.222-.119-.453-.342-.631-.684A2.64 2.64 0 017 12a2.6 2.6 0 01.281-1.205c.177-.342.408-.565.63-.684a.86.86 0 01.632-.085c.209.054.444.197.654.467a1 1 0 001.578-1.228c-.443-.57-1.04-.998-1.737-1.176a2.86 2.86 0 00-2.066.257Zm8 0c-.631.336-1.131.881-1.466 1.526A4.6 4.6 0 0013 12c-.004.74.17 1.47.506 2.128.336.645.835 1.191 1.466 1.526a2.86 2.86 0 002.066.257c.697-.178 1.294-.606 1.737-1.176a1 1 0 00-1.578-1.228c-.21.27-.444.413-.654.467a.86.86 0 01-.632-.085c-.222-.119-.453-.342-.631-.684A2.64 2.64 0 0115 12a2.6 2.6 0 01.281-1.205c.177-.342.408-.565.63-.684a.86.86 0 01.632-.085c.209.054.444.197.654.467a1 1 0 001.578-1.228c-.443-.57-1.04-.998-1.737-1.176a2.86 2.86 0 00-2.066.257Z"] {
d: path("M6 14v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1zm8 1h3c.55 0 1-.45 1-1v-1h-1.5v.5h-2v-3h2v.5H18v-1c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm6-11H4v16h16V4m1-1v18H3V3.01C3 3 3 3 3.01 3H21z")
}
/* like */
[d*="M14.813 5.018 14.41 6.5 14 8h5.192c.826 0 1.609.376 2.125 1.022.711.888.794 2.125.209 3.101L21 13l.165.413c.519 1.296.324 2.769-.514 3.885l-.151.202v.5c0 1.657-1.343 3-3 3H5c-1.105 0-2-.895-2-2v-8c0-1.105.895-2 2-2h2v.282c0-.834.26-1.647.745-2.325L12 1l1.1.472c1.376.59 2.107 2.103 1.713 3.546ZM7 10.5H5c-.276 0-.5.224-.5.5v8c0 .276.224.5.5.5h2v-9Zm10.5 9h-9V9.282c0-.521.163-1.03.466-1.453l3.553-4.975c.682.298 1.043 1.051.847 1.77l-.813 2.981c-.123.451-.029.934.255 1.305.284.372.725.59 1.192.59h5.192c.37 0 .722.169.954.459.32.399.357.954.094 1.393l-.526.876c-.241.402-.28.894-.107 1.33l.165.412c.324.81.203 1.73-.32 2.428l-.152.202c-.195.26-.3.575-.3.9v.5c0 .828-.672 1.5-1.5 1.5Z"],
[d*="M9.221 1.795a1 1 0 011.109-.656l1.04.173a4 4 0 013.252 4.784L14 9h4.061a3.664 3.664 0 013.576 2.868A3.68 3.68 0 0121 14.85l.02.087A3.815 3.815 0 0120 18.5v.043l-.01.227a2.82 2.82 0 01-.135.663l-.106.282A3.754 3.754 0 0116.295 22h-3.606l-.392-.007a12.002 12.002 0 01-5.223-1.388l-.343-.189-.27-.154a2.005 2.005 0 00-.863-.26l-.13-.004H3.5a1.5 1.5 0 01-1.5-1.5V12.5A1.5 1.5 0 013.5 11h1.79l.157-.013a1 1 0 00.724-.512l.063-.145 2.987-8.535Zm-1.1 9.196A3 3 0 015.29 13H4v4.998h1.468a4 4 0 011.986.528l.27.155.285.157A10 10 0 0012.69 20h3.606c.754 0 1.424-.483 1.663-1.2l.03-.126a.819.819 0 00.012-.131v-.872l.587-.586c.388-.388.577-.927.523-1.465l-.038-.23-.02-.087-.21-.9.55-.744A1.663 1.663 0 0018.061 11H14a2.002 2.002 0 01-1.956-2.418l.623-2.904a2 2 0 00-1.626-2.392l-.21-.035-2.71 7.741Z"] {
d: path("M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z")
}
[d*="M8 21V9.282a4 4 0 01.745-2.325L13 1l.551.33a3 3 0 011.351 3.363L14 8h5.192a2.722 2.722 0 012.334 4.123L21 13l.165.413a4 4 0 01-.514 3.885l-.151.202v.5a3 3 0 01-3 3H8ZM4.5 9A1.5 1.5 0 003 10.5v9A1.5 1.5 0 004.5 21H7V9H4.5Z"],
[d*="M10.72 2.18a3.263 3.263 0 012.352 4.063l-.708 2.476a1 1 0 00.962 1.275h5.29c.848 0 1.624.48 2.003 1.238l.179.359a1.785 1.785 0 01-.6 2.279.446.446 0 00-.198.37v.07c0 .124.041.246.116.346a2.375 2.375 0 01-.41 3.278l-.5.399a.38.38 0 00-.123.416l.07.206c.217.653.1 1.372-.313 1.923a2.8 2.8 0 01-2.24 1.12l-3.914-.002a12 12 0 01-5.952-1.584l-.272-.155a2.002 2.002 0 00-.993-.265H3a1 1 0 01-1-1v-5.996a1 1 0 011.002-1L5.789 12a1 1 0 00.945-.67l3.02-8.628a.816.816 0 01.967-.523Z"] {
d: path("M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z")
}
[d*=" M-2.7780001163482666,-10.204999923706055 C-2.618000030517578,-10.663999557495117 -2.1500000953674316,-10.940999984741211 -1.6699999570846558,-10.862000465393066 C-1.6699999570846558,-10.862000465393066 -0.6299999952316284,-10.687999725341797 -0.6299999952316284,-10.687999725341797 C1.6200000047683716,-10.312000274658203 3.0999999046325684,-8.135000228881836 2.621999979019165,-5.90500020980835 C2.621999979019165,-5.90500020980835 2,-3 2,-3 C2,-3 6.060999870300293,-3 6.060999870300293,-3 C7.7779998779296875,-3 9.265000343322754,-1.8079999685287476 9.637999534606934,-0.13199999928474426 C9.868000030517578,0.9039999842643738 9.631999969482422,1.996000051498413 9,2.8489999771118164 C9,2.8489999771118164 9.020000457763672,2.937000036239624 9.020000457763672,2.937000036239624 C9.319000244140625,4.2210001945495605 8.932999610900879,5.567999839782715 8,6.5 C8,6.5 8,6.543000221252441 8,6.543000221252441 C8,6.543000221252441 7.991000175476074,6.769000053405762 7.991000175476074,6.769000053405762 C7.9730000495910645,6.994999885559082 7.927000045776367,7.2179999351501465 7.855000019073486,7.433000087738037 C7.855000019073486,7.433000087738037 7.749000072479248,7.715000152587891 7.749000072479248,7.715000152587891 C7.164000034332275,9.090999603271484 5.809000015258789,10 4.295000076293945,10 C4.295000076293945,10 0.6890000104904175,10 0.6890000104904175,10 C0.6890000104904175,10 0.2980000078678131,9.993000030517578 0.2980000078678131,9.993000030517578 C-1.5260000228881836,9.932999610900879 -3.312999963760376,9.458999633789062 -4.926000118255615,8.604999542236328 C-4.926000118255615,8.604999542236328 -5.269000053405762,8.416000366210938 -5.269000053405762,8.416000366210938 C-5.269000053405762,8.416000366210938 -5.538000106811523,8.26200008392334 -5.538000106811523,8.26200008392334 C-5.802999973297119,8.109999656677246 -6.098999977111816,8.020999908447266 -6.401000022888184,8.001999855041504 C-6.401000022888184,8.001999855041504 -6.531000137329102,7.998000144958496 -6.531000137329102,7.998000144958496 C-6.531000137329102,7.998000144958496 -8.5,7.998000144958496 -8.5,7.998000144958496 C-9.32800006866455,7.998000144958496 -10,7.326000213623047 -10,6.498000144958496 C-10,6.498000144958496 -10,0.5 -10,0.5 C-10,-0.328000009059906 -9.32800006866455,-1 -8.5,-1 C-8.5,-1 -6.710000038146973,-1 -6.710000038146973,-1 C-6.710000038146973,-1 -6.552999973297119,-1.0130000114440918 -6.552999973297119,-1.0130000114440918 C-6.244999885559082,-1.062000036239624 -5.9770002365112305,-1.2510000467300415 -5.828999996185303,-1.5260000228881836 C-5.828999996185303,-1.5260000228881836 -5.765999794006348,-1.6699999570846558 -5.765999794006348,-1.6699999570846558 C-5.765999794006348,-1.6699999570846558 -2.7780001163482666,-10.204999923706055 -2.7780001163482666,-10.204999923706055z M-3.878000020980835,-1.0089999437332153 C-4.298999786376953,0.1940000057220459 -5.434999942779541,1 -6.710000038146973,1 C-6.710000038146973,1 -8,1 -8,1 C-8,1 -8,5.998000144958496 -8,5.998000144958496 C-8,5.998000144958496 -6.531000137329102,5.998000144958496 -6.531000137329102,5.998000144958496 C-5.835000038146973,5.998000144958496 -5.151000022888184,6.179999828338623 -4.546000003814697,6.526000022888184 C-4.546000003814697,6.526000022888184 -4.275000095367432,6.679999828338623 -4.275000095367432,6.679999828338623 C-4.275000095367432,6.679999828338623 -3.990000009536743,6.8379998207092285 -3.990000009536743,6.8379998207092285 C-2.549999952316284,7.599999904632568 -0.9430000185966492,8 0.6890000104904175,8 C0.6890000104904175,8 4.295000076293945,8 4.295000076293945,8 C5.048999786376953,8 5.718999862670898,7.515999794006348 5.958000183105469,6.801000118255615 C5.958000183105469,6.801000118255615 5.988999843597412,6.673999786376953 5.988999843597412,6.673999786376953 C5.995999813079834,6.630000114440918 6,6.586999893188477 6,6.543000221252441 C6,6.543000221252441 6,5.671000003814697 6,5.671000003814697 C6,5.671000003814697 6.586999893188477,5.085000038146973 6.586999893188477,5.085000038146973 C6.974999904632568,4.697000026702881 7.164000034332275,4.1579999923706055 7.110000133514404,3.619999885559082 C7.110000133514404,3.619999885559082 7.072000026702881,3.3889999389648438 7.072000026702881,3.3889999389648438 C7.072000026702881,3.3889999389648438 7.052000045776367,3.302999973297119 7.052000045776367,3.302999973297119 C7.052000045776367,3.302999973297119 6.8429999351501465,2.4019999504089355 6.8429999351501465,2.4019999504089355 C6.8429999351501465,2.4019999504089355 7.392000198364258,1.659000039100647 7.392000198364258,1.659000039100647 C7.682000160217285,1.2680000066757202 7.788000106811523,0.7670000195503235 7.684999942779541,0.3019999861717224 C7.514999866485596,-0.45899999141693115 6.841000080108643,-1 6.060999870300293,-1 C6.060999870300293,-1 2,-1 2,-1 C1.3960000276565552,-1 0.8240000009536743,-1.2740000486373901 0.4440000057220459,-1.7430000305175781 C0.06499999761581421,-2.2130000591278076 -0.0820000022649765,-2.8289999961853027 0.04399999976158142,-3.4189999103546143 C0.04399999976158142,-3.4189999103546143 0.6669999957084656,-6.322999954223633 0.6669999957084656,-6.322999954223633 C0.906000018119812,-7.438000202178955 0.16599999368190765,-8.527000427246094 -0.9589999914169312,-8.71500015258789 C-0.9589999914169312,-8.71500015258789 -1.1690000295639038,-8.75 -1.1690000295639038,-8.75 C-1.1690000295639038,-8.75 -3.878000020980835,-1.0089999437332153 -3.878000020980835,-1.0089999437332153z"] {
d: path("M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z");
transform: translate(-11.6px, -11.6px) !important
}
[d*=" M-0.2070000022649765,-2.4600000381469727 C0.26600000262260437,-2.0169999599456787 0.6620000004768372,-2.006999969482422 1.3259999752044678,-2.006999969482422 C1.3259999752044678,-2.006999969482422 6.616000175476074,-2.006999969482422 6.616000175476074,-2.006999969482422 C7.465000152587891,-2.00600004196167 8.239999771118164,-1.5269999504089355 8.619000434875488,-0.7680000066757202 C8.619000434875488,-0.7680000066757202 8.79800033569336,-0.4099999964237213 8.79800033569336,-0.4099999964237213 C9.199999809265137,0.3930000066757202 8.942000389099121,1.36899995803833 8.197999954223633,1.86899995803833 C8.074000358581543,1.9520000219345093 8,2.0910000801086426 8,2.240000009536743 C8,2.240000009536743 8,2.309000015258789 8,2.309000015258789 C8,2.434000015258789 8.041000366210938,2.555999994277954 8.116000175476074,2.6559998989105225 C8.88599967956543,3.678999900817871 8.704999923706055,5.133999824523926 7.704999923706055,5.934000015258789 C7.704999923706055,5.934000015258789 7.205999851226807,6.331999778747559 7.205999851226807,6.331999778747559 C7.081999778747559,6.431000232696533 7.0329999923706055,6.5980000495910645 7.083000183105469,6.748000144958496 C7.083000183105469,6.748000144958496 7.1529998779296875,6.953999996185303 7.1529998779296875,6.953999996185303 C7.369999885559082,7.607999801635742 7.252999782562256,8.326000213623047 6.840000152587891,8.876999855041504 C6.310999870300293,9.581999778747559 5.480999946594238,9.998000144958496 4.599999904632568,9.996999740600586 C4.599999904632568,9.996999740600586 0.6869999766349792,9.994999885559082 0.6869999766349792,9.994999885559082 C-1.4010000228881836,9.994000434875488 -3.453000068664551,9.447999954223633 -5.264999866485596,8.41100025177002 C-5.264999866485596,8.41100025177002 -5.538000106811523,8.255999565124512 -5.538000106811523,8.255999565124512 C-5.840000152587891,8.083000183105469 -6.183000087738037,7.992000102996826 -6.531000137329102,7.992000102996826 C-6.531000137329102,7.992000102996826 -9,7.992000102996826 -9,7.992000102996826 C-9.552000045776367,7.992000102996826 -10,7.544000148773193 -10,6.992000102996826 C-10,6.992000102996826 -10,0.9950000047683716 -10,0.9950000047683716 C-10,0.44200000166893005 -9.550999641418457,-0.006000000052154064 -8.998000144958496,-0.004999999888241291 C-8.998000144958496,-0.004999999888241291 -6.210999965667725,0 -6.210999965667725,0 C-5.784999847412109,0.0010000000474974513 -5.406000137329102,-0.2680000066757202 -5.264999866485596,-0.6700000166893005 C-5.264999866485596,-0.6700000166893005 -5.059000015258789,-0.8330000042915344 -4.901000022888184,-1.274999976158142 C-4.301000118255615,-2.950000047683716 -0.859000027179718,-3.2170000076293945 -0.2070000022649765,-2.4600000381469727z"] {
d: path("M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z");
transform: translate(-11.6px, -11.6px) !important
}
[d*=" M0,-3.25 C1.7936749458312988,-3.25 3.25,-1.7936749458312988 3.25,0 C3.25,1.7936749458312988 1.7936749458312988,3.25 0,3.25 C-1.7936749458312988,3.25 -3.25,1.7936749458312988 -3.25,0 C-3.25,-1.7936749458312988 -1.7936749458312988,-3.25 0,-3.25z M0.7960000038146973,-9.994999885559082 C2.5880000591278076,-9.550000190734863 3.575000047683716,-7.699999809265137 3.1480000019073486,-5.933000087738037 C2.9639999866485596,-5.171000003814697 2.755000114440918,-4.4120001792907715 2.440000057220459,-3.4560000896453857 C2.125,-2.5 3.7939999103546143,-2.138000011444092 2.634999990463257,0.45100000500679016 C1.746999979019165,2.434999942779541 -3.75,0.7250000238418579 -2.7279999256134033,-2.1700000762939453 C-1.840999960899353,-4.681000232696533 -1.024999976158142,-7.050000190734863 -0.17000000178813934,-9.472999572753906 C-0.019999999552965164,-9.89900016784668 0.3869999945163727,-10.095999717712402 0.7960000038146973,-9.994999885559082z"] {
display: none !important
}
#like-button.ytd-comment-engagement-bar [d*="M9.221 1.795a1 1 0 011.109-.656l1.04.173a4 4 0 013.252 4.784L14 9h4.061a3.664 3.664 0 013.576 2.868A3.68 3.68 0 0121 14.85l.02.087A3.815 3.815 0 0120 18.5v.043l-.01.227a2.82 2.82 0 01-.135.663l-.106.282A3.754 3.754 0 0116.295 22h-3.606l-.392-.007a12.002 12.002 0 01-5.223-1.388l-.343-.189-.27-.154a2.005 2.005 0 00-.863-.26l-.13-.004H3.5a1.5 1.5 0 01-1.5-1.5V12.5A1.5 1.5 0 013.5 11h1.79l.157-.013a1 1 0 00.724-.512l.063-.145 2.987-8.535Zm-1.1 9.196A3 3 0 015.29 13H4v4.998h1.468a4 4 0 011.986.528l.27.155.285.157A10 10 0 0012.69 20h3.606c.754 0 1.424-.483 1.663-1.2l.03-.126a.819.819 0 00.012-.131v-.872l.587-.586c.388-.388.577-.927.523-1.465l-.038-.23-.02-.087-.21-.9.55-.744A1.663 1.663 0 0018.061 11H14a2.002 2.002 0 01-1.956-2.418l.623-2.904a2 2 0 00-1.626-2.392l-.21-.035-2.71 7.741Z"] {
d: path("M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H3v10h14.43c1.06 0 1.98-.67 2.19-1.61l1.34-6c.27-1.24-.78-2.39-2.19-2.39zM7 20H4v-8h3v8zm12.98-6.83-1.34 6c-.1.48-.61.83-1.21.83H8v-8.61l5.6-6.06c.19-.21.48-.33.78-.33.26 0 .5.11.63.3.07.1.15.26.09.47l-1.52 4.94-.4 1.29h5.58c.41 0 .8.17 1.03.46.13.15.26.4.19.71z")
}
/* dislike */
[d*="m11.31 2 .392.007c1.824.06 3.61.534 5.223 1.388l.343.189.27.154c.264.152.56.24.863.26l.13.004H20.5a1.5 1.5 0 011.5 1.5V11.5a1.5 1.5 0 01-1.5 1.5h-1.79l-.158.013a1 1 0 00-.723.512l-.064.145-2.987 8.535a1 1 0 01-1.109.656l-1.04-.174a4 4 0 01-3.251-4.783L10 15H5.938a3.664 3.664 0 01-3.576-2.868A3.682 3.682 0 013 9.15l-.02-.088A3.816 3.816 0 014 5.5v-.043l.008-.227a2.86 2.86 0 01.136-.664l.107-.28A3.754 3.754 0 017.705 2h3.605ZM7.705 4c-.755 0-1.425.483-1.663 1.2l-.032.126a.818.818 0 00-.01.131v.872l-.587.586a1.816 1.816 0 00-.524 1.465l.038.23.02.087.21.9-.55.744a1.686 1.686 0 00-.321 1.18l.029.177c.17.76.844 1.302 1.623 1.302H10a2.002 2.002 0 011.956 2.419l-.623 2.904-.034.208a2.002 2.002 0 001.454 2.139l.206.045.21.035 2.708-7.741A3.001 3.001 0 0118.71 11H20V6.002h-1.47c-.696 0-1.38-.183-1.985-.528l-.27-.155-.285-.157A10.002 10.002 0 0011.31 4H7.705Z"] {
d: path("M17 4H6.57c-1.07 0-1.98.67-2.19 1.61l-1.34 6C2.77 12.85 3.82 14 5.23 14h4.23l-1.52 4.94C7.62 19.97 8.46 21 9.62 21c.58 0 1.14-.24 1.52-.65L17 14h4V4h-4zm-6.6 15.67c-.19.21-.48.33-.78.33-.26 0-.5-.11-.63-.3-.07-.1-.15-.26-.09-.47l1.52-4.94.4-1.29H5.23c-.41 0-.8-.17-1.03-.46-.12-.15-.25-.4-.18-.72l1.34-6c.1-.47.61-.82 1.21-.82H16v8.61l-5.6 6.06zM20 13h-3V5h3v8z")
}
[d*="M11.313 2.002c2.088 0 4.14.546 5.953 1.583l.273.156a2 2 0 00.993.264H21a1 1 0 011 1V11a1 1 0 01-1.002 1l-2.787-.005a1 1 0 00-.946.67l-3.02 8.628a.815.815 0 01-.966.522 3.262 3.262 0 01-2.35-4.062l.707-2.477a1 1 0 00-.961-1.274h-5.29a2.24 2.24 0 01-2.004-1.238l-.18-.359a1.784 1.784 0 01.601-2.278.446.446 0 00.198-.37v-.07a.578.578 0 00-.116-.347 2.374 2.374 0 01.412-3.278l.498-.399a.379.379 0 00.123-.415l-.07-.207a2.1 2.1 0 01.313-1.923A2.798 2.798 0 017.4 2l3.913.002Z"] {
d: path("M18,4h3v10h-3V4z M5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21c0.58,0,1.14-0.24,1.52-0.65L17,14V4H6.57 C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14z")
}
/* post icons */
[d*="M20 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2ZM4 18.033V4h16v9.233l-2.456-1.473a3 3 0 00-2.906-.1l-.182.1L4 18.033ZM9 6a3 3 0 100 6 3 3 0 000-6Zm0 2a1 1 0 110 2 1 1 0 010-2Zm7.515 5.475L20 15.565V20H4.61l10.875-6.525.122-.063a1 1 0 01.908.063Z"] {
d: path("M14.04 13.61 16.86 17H11.5l.3-.4 2.24-2.99m-5.11 1.08 1.24 1.86.3.45H7.08l1.85-2.31M14 12l-3 4-2-3-4 5h14l-5-6zm6-8v16H4V4h16m1-1H3v18h18V3z")
}
[d*="M4 2a1 1 0 00-2 0v20a1 1 0 102 0V2Zm8 0H6v2h6v2H6v2h6a2 2 0 002-2V4a2 2 0 00-2-2Zm10 9a2 2 0 00-2-2H6v2h14v2H6v2h14a2 2 0 002-2v-2Zm-6 5H6v2h10v2H6v2h10a2 2 0 002-2v-2a2 2 0 00-2-2Z"] {
d: path("M6 6h10v2H6V6zm0 5h15v2H6v-2zm0 5h7v2H6v-2zm-3 5V3h1v18H3z")
}
[d*="M19.343 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2v-9.343l-2 2V20H4V4h13.343l2-2Zm1.95 2.293L12 13.586l-3.293-3.293a1 1 0 10-1.414 1.414L12 16.414 22.707 5.707a1 1 0 10-1.414-1.414Z"] {
d: path("m11 15.71-4.35-4.35.71-.71L11 14.29l8.65-8.65.71.71L11 15.71zM20 20H4V4h12V3H3v18h18v-9h-1v8z")
}
[d*="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h11v-2H3V5h18v9h2V5a2 2 0 00-2-2ZM7 9V7H5v2h2Zm12 0V7h-2v2h2ZM7 13v-2H5v2h2Zm12 0v-2h-2v2h2ZM7 17v-2H5v2h2Zm13-1a1 1 0 00-1 1v2h-2a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 000-2h-2v-2a1 1 0 00-1-1Z"] {
d: path("M21 19h-2v2h-2v-2h-2v-2h2v-2h2v2h2v2zM4 3H3v18h1V3zm4 12H6v2h2v-2zm0-4H6v2h2v-2zm0-4H6v2h2V7zm0 12H6v2h2v-2zm10-8h-2v2h2v-2zm0-4h-2v2h2V7zM8 3H6v2h2V3zm10 0h-2v2h2V3zm3 0h-1v10h1V3z")
}
/* grid icons */
[d*="M1 5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H3a2 2 0 01-2-2V5Zm10-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V5a2 2 0 012-2Zm6 2a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V5ZM3 5v4h2V5H3Zm10 0h-2v4h2V5Zm6 0v4h2V5h-2ZM3 13h2a2 2 0 012 2v4a2 2 0 01-2 2H3a2 2 0 01-2-2v-4a2 2 0 012-2Zm6 2a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4Zm8 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4ZM5 15H3v4h2v-4Zm6 0v4h2v-4h-2Zm8 0v4h2v-4h-2Z"] {
d: path("M8,11H2V4h6V11z M3,10h4V5H3V10z M8,20H2v-7h6V20z M3,19h4v-5H3V19z M15,11H9V4h6V11z M10,10h4V5h-4V10z M15,20H9v-7h6V20z M10,19h4v-5h-4V19z M22,11h-6V4h6V11z M17,10h4V5h-4V10z M22,20h-6v-7h6V20z M17,19h4v-5h-4V19z")
}
[d*="M3 3a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H3Zm6 2v4a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2Zm10-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2ZM1 15v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2H3a2 2 0 00-2 2Zm10-2a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2Zm8 0a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2Z"] {
d: path("M2,4h6v7H2V4z M2,20h6v-7H2V20z M9,11h6V4H9V11z M9,20h6v-7H9V20z M16,4v7h6V4H16z M16,20h6v-7h-6V20z")
}
[d*="M4 4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3ZM20 5H9a1 1 0 000 2h11a1 1 0 100-2ZM4 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3Zm16 .5H9a1 1 0 000 2h11a1 1 0 000-2ZM4 16.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3Zm16 .5H9a1 1 0 000 2h11a1 1 0 000-2Z"] {
d: path("M20 8H9V7h11v1zm0 3H9v1h11v-1zm0 4H9v1h11v-1zM7 7H4v1h3V7zm0 4H4v1h3v-1zm0 4H4v1h3v-1z")
}
/* 3 dots */
[d*="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"] {
d: path("M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z")
}
[d*="M6 10a2 2 0 100 4 2 2 0 000-4Zm6 0a2 2 0 100 4 2 2 0 000-4Zm6 0a2 2 0 100 4 2 2 0 000-4Z"] {
d: path("M7.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm4.5-1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm6 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z")
}
/* arrow icons */
[d*="M8.793 5.293a1 1 0 000 1.414L14.086 12l-5.293 5.293a1 1 0 101.414 1.414L16.914 12l-6.707-6.707a1 1 0 00-1.414 0Z"] {
d: path("m9.4 18.4-.7-.7 5.6-5.6-5.7-5.7.7-.7 6.4 6.4-6.3 6.3z")
}
[d*="M13.793 5.293 7.086 12l6.707 6.707a1 1 0 101.414-1.414L9.914 12l5.293-5.293a1 1 0 10-1.414-1.414Z"] {
d: path("M14.96 18.96 8 12l6.96-6.96.71.71L9.41 12l6.25 6.25-.7.71z")
}
[d*="m13.06 9 5.47 5.47c.293.293.293.767 0 1.06-.293.293-.767.293-1.06 0L12 10.06l-5.47 5.47c-.293.293-.767.293-1.06 0-.293-.293-.293-.767 0-1.06L10.94 9l.53-.53.53-.53.53.53.53.53Z"],
[d*="M5.293 15.207a1 1 0 001.414 0L12 9.914l5.293 5.293a1 1 0 101.414-1.414L12 7.086l-6.707 6.707a1 1 0 000 1.414Z"] {
d: path("M18.4 14.6 12 8.3l-6.4 6.3.8.8L12 9.7l5.6 5.7z")
}
[d*="M5.47 8.47c.293-.293.767-.293 1.06 0L12 13.94l5.47-5.47c.293-.293.767-.293 1.06 0 .293.293.293.767 0 1.06l-6 6-.53.53-.53-.53-6-6c-.293-.293-.293-.767 0-1.06Z"],
[d*="M18.707 8.793a1 1 0 00-1.414 0L12 14.086 6.707 8.793a1 1 0 10-1.414 1.414L12 16.914l6.707-6.707a1 1 0 000-1.414Z"] {
d: path("m18 9.28-6.35 6.35-6.37-6.35.72-.71 5.64 5.65 5.65-5.65z")
}
[d*="M10.293 4.293 2.586 12l7.707 7.706a1 1 0 101.414-1.413L6.414 13H20a1 1 0 000-2H6.414l5.293-5.292a1 1 0 00-1.414-1.415Z"] {
d: path("M21 11v1H5.64l6.72 6.72-.71.71-7.93-7.93 7.92-7.92.71.71L5.64 11H21z")
}
/* Fix disappearing bar in masthead */
#background.ytd-masthead { opacity: 1 !important }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
 
 
// Re-add 'Explore' tab in sidebar (it also replaces the 'Shorts' tab)
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
                        "url": "/feed/explore",
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
                "iconType": "EXPLORE"
            },
            "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "formattedTitle": {
                "simpleText": "Explore"
            },
            "accessibility": {
                "accessibilityData": {
                    "label": "Explore"
                }
            },
            "isPrimary": true
        };
 
        var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = trendingData;
 
        var miniguidetemplate = `<ytd-mini-guide-entry-renderer class="style-scope ytd-mini-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-mini-guide-entry-renderer:nth-child(2)`).data = trendingData;
 
    }
 
 
waitForElm("#items.ytd-guide-section-renderer").then((elm) => {
    restoreTrending();
});
 
waitForElm("#items.ytd-mini-guide-section-renderer").then((elm) => {
    restoreTrending();
});
 
// Restore old comment replies UI and fix watch action buttons (optional)
var observingComments = false;
var hl;
 
const cfconfig = {
    unicodeEmojis: false
};
 
const cfi18n = {
    en: {
        viewSingular: "View reply",
        viewMulti: "View %s replies",
        viewSingularOwner: "View reply from %s",
        viewMultiOwner: "View %s replies from %s and others",
        hideSingular: "Hide reply",
        hideMulti: "Hide replies",
        replyCountIsolator: /( REPLIES)|( REPLY)/
    }
}
 
/**
 * Get a string from the localization strings.
 *
 * @param {string}   string  Name of string to get
 * @param {string}   hl      Language to use.
 * @param {...array} args    Strings.
 * @returns {string}
 */
 function getString(string, hl = "en", ...args) {
    if (!string) return;
    var str;
    if (cfi18n[hl]) {
        if (cfi18n[hl][string]) {
            str = cfi18n[hl][string];
        } else if (cfi18n.en[string]) {
            str = cfi18n.en[string];
        } else {
            return;
        }
    } else {
        if (cfi18n.en[string]) str = cfi18n.en[string];
    }
 
    for (var i = 0; i < args.length; i++) {
        str = str.replace(/%s/, args[i]);
    }
 
    return str;
}
 
/**
 * Wait for a selector to exist
 *
 * @param {string}       selector  CSS Selector
 * @param {HTMLElement}  base      Element to search inside
 * @returns {Node}
 */
async function waitForElm(selector, base = document) {
    if (!selector) return null;
    if (!base.querySelector) return null;
    while (base.querySelector(selector) == null) {
        await new Promise(r => requestAnimationFrame(r));
    };
    return base.querySelector(selector);
};
 
/**
 * Is a value in an array?
 *
 * @param {*}     needle    Value to search
 * @param {Array} haystack  Array to search
 * @returns {boolean}
 */
 function inArray(needle, haystack) {
    for (var i = 0; i < haystack.length; i++) {
        if (needle == haystack[i]) return true;
    }
    return false;
}
 
/**
 * Get text of an InnerTube string.
 *
 * @param {object} object  String container.
 */
function getSimpleString(object) {
    if (object.simpleText) return object.simpleText;
 
    var str = "";
    for (var i = 0; i < object.runs.length; i++) {
        str += object.runs[i].text;
    }
    return str;
}
 
/**
 * Format a commentRenderer.
 *
 * @param {object} comment  commentRenderer from InnerTube.
 */
function formatComment(comment) {
    if (cfconfig.unicodeEmojis) {
        var runs;
        try {
            runs = comment.contentText.runs
            for (var i = 0; i < runs.length; i++) {
                delete runs[i].emoji;
                delete runs[i].loggingDirectives;
            }
        } catch(err) {}
    }
 
    return comment;
}
 
/**
 * Format a commentThreadRenderer.
 *
 * @param {object} thread  commentThreadRenderer from InnerTube.
 */
async function formatCommentThread(thread) {
    if (thread.comment.commentRenderer) {
        thread.comment.commentRenderer = formatComment(thread.comment.commentRenderer);
    }
 
    var replies;
    try {
        replies = thread.replies.commentRepliesRenderer;
        if (replies.viewRepliesIcon) {
            replies.viewReplies.buttonRenderer.icon = replies.viewRepliesIcon.buttonRenderer.icon;
            delete replies.viewRepliesIcon;
        }
 
        if (replies.hideRepliesIcon) {
            replies.hideReplies.buttonRenderer.icon = replies.hideRepliesIcon.buttonRenderer.icon;
            delete replies.hideRepliesIcon;
        }
 
        var creatorName;
        try {
            creatorName = replies.viewRepliesCreatorThumbnail.accessibility.accessibilityData.label;
            delete replies.viewRepliesCreatorThumbnail;
        } catch(err) {}
 
        var replyCount = getSimpleString(replies.viewReplies.buttonRenderer.text);
        replyCount = +replyCount.replace(getString("replyCountIsolator", hl), "");
 
        var viewMultiString = creatorName ? "viewMultiOwner" : "viewMulti";
        var viewSingleString = creatorName ? "viewSingularOwner" : "viewSingular";
 
        replies.viewReplies.buttonRenderer.text = {
            runs: [
                {
                    text: (replyCount > 1) ? getString(viewMultiString, hl, replyCount, creatorName) : getString(viewSingleString, hl, creatorName)
                }
            ]
        }
 
        replies.hideReplies.buttonRenderer.text = {
            runs: [
                {
                    text: (replyCount > 1) ? getString("hideMulti", hl) :  getString("hideSingular", hl)
                }
            ]
        };
    } catch(err) {}
 
    return thread;
}
 
/**
 * Force Polymer to refresh data of an element.
 *
 * @param {Node} element  Element to refresh data of.
 */
function refreshData(element) {
    var clone = element.cloneNode();
    clone.data = element.data;
    // Let the script know we left our mark
    // in a way that doesn't rely on classes
    // because Polymer likes to cast comments
    // into the void for later reuse
    clone.data.fixedByCF = true;
    for (var i in element.properties) {
        clone[i] = element[i];
    }
    element.insertAdjacentElement("afterend", clone);
    element.remove();
}
 
var commentObserver = new MutationObserver((list) => {
    list.forEach(async (mutation) => {
        if (mutation.addedNodes) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var elm = mutation.addedNodes[i];
                if (elm.classList && elm.data && !elm.data.fixedByCF) {
                    if (elm.tagName == "YTD-COMMENT-THREAD-RENDERER") {
                        elm.data = await formatCommentThread(elm.data);
                        refreshData(elm);
                    } else if (elm.tagName == "YTD-COMMENT-RENDERER") {
                        if (!elm.classList.contains("ytd-comment-thread-renderer")) {
                            elm.data = formatComment(elm.data);
                            refreshData(elm);
                        }
                    }
                }
            }
        }
    });
});
 
document.addEventListener("yt-page-data-updated", async (e) => {
    hl = yt.config_.HL;
    commentObserver.observe(document.querySelector("ytd-app"),  { childList: true, subtree: true });
});
 
const abtnconfig = {
    unsegmentLikeButton: false,
    noFlexibleItems: true
};
 
function updateBtns() {
    var watchFlexy = document.querySelector("ytd-watch-flexy");
    var results = watchFlexy.data.contents.twoColumnWatchNextResults.results.results.contents;
 
    for (var i = 0; i < results.length; i++) {
        if (results[i].videoPrimaryInfoRenderer) {
            var actions = results[i].videoPrimaryInfoRenderer.videoActions.menuRenderer;
 
            if (abtnconfig.unsegmentLikeButton) {
                if (actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer) {
                    var segmented = actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer;
                    actions.topLevelButtons.splice(0, 1);
                    actions.topLevelButtons.unshift(segmented.dislikeButton);
                    actions.topLevelButtons.unshift(segmented.likeButton);
                }
            }
 
            if (abtnconfig.noFlexibleItems) {
                for (var i = 0; i < actions.flexibleItems.length; i++) {
                    actions.topLevelButtons.push(actions.flexibleItems[i].menuFlexibleItemRenderer.topLevelButton);
                }
 
                delete actions.flexibleItems
            }
        }
    }
 
    var temp = watchFlexy.data;
    watchFlexy.data = {};
    watchFlexy.data = temp;
}
 
document.addEventListener("yt-page-data-updated", (e) => {
    if (e.detail.pageType == "watch") {
        updateBtns();
    }
});
 
// Add JS code to have an option to revert the pre-delhi player UI changes + includes restoring the miniplayer button
(function () {
  'use strict';
 
  try {
 
function wantsRefresh(cfg, cur, appl){ const mode = (cfg && typeof cfg.refreshToggle === 'string') ? cfg.refreshToggle : null; if (mode === 'onlyOff') return !!(appl && !cur); if (mode === 'onlyOn') return !!(!appl && cur); const prompt = (typeof cfg?.promptRefresh === 'boolean') ? cfg.promptRefresh : false; return !!(prompt && (cur !== appl)); }
function setAppliedIfOnlyOff(cfg, nowOn){ if (cfg?.refreshToggle === 'onlyOff' && nowOn) { appliedSet(cfg.id, true); } }
 
const CONFIG_TOGGLES = [
  {
    id: 'revert_player',
    name: 'Revert Old Youtube Player',
    desc: 'Restores the pre-2025 player UI and hides the new fullscreen UI. May require a refresh.',
    iconName: 'home',
    promptRefresh: true,
    onChange: (state) => {
      if (state) {
        robustRemoveDelhiFlagsWithRetries();
        applyFullscreenHideCSS();
      } else {
        removeFullscreenHideCSS();
      }
    }
  }
];
 
/* =================== Setting blocks =================== */
const CONFIG_BLOCKS = [
  {
    type: 'block',
    id: 'tweaks',
    name: 'Tweaks',
    desc: 'Change the way Youtube looks.',
    iconName: 'tune',
    children: [
      {
        id: 'restore_miniplayer_button',
        name: 'Restore Miniplayer Button',
        desc: 'Adds a Miniplayer button next to the player size control (hidden in fullscreen).',
        iconName: 'picture_in_picture_alt',
        promptRefresh: false,
        onChange: () => (on) => { if (on) applyRestoreMiniplayerButton(); else removeRestoreMiniplayerButton(); }
      },
      {
        id: 'reset_configs',
        name: 'Reset All Settings',
        desc: 'Clears all saved preferences and restores default configuration. Refresh required.',
        iconName: 'restart_alt',
        promptRefresh: true,
        onChange: (on) => {
          if (!on) return;
          const confirmed = confirm('Reset all settings to default?');
          if (!confirmed) return;
 
          try {
            localStorage.clear();
            alert('All settings have been reset.');
            const refreshNow = confirm('Refresh YouTube now to apply changes?');
            if (refreshNow) {
              const tries = [
                () => location.reload(),
                () => { location.href = location.href; },
                () => window.location.reload(),
                () => { window.top && window.top.location && window.top.location.reload(); },
                () => history.go(0)
              ];
              (function chain(i){
                try { tries[i](); }
                catch (_) { if (i + 1 < tries.length) setTimeout(() => chain(i + 1), 30); }
              })(0);
            }
          } catch (e) {
            console.error('Error resetting configs:', e);
            alert('Something went wrong while resetting your settings.');
          }
        }
      },
    ]
  },
 
  /* =============== NEW CONDITIONAL BLOCK: SponsorBlock Tweaks =================
     Appears only when skip_sponsor_segments is ON. All toggles use refreshToggle: 'onlyOff'
  */
  {
    type: 'block',
    id: 'sb_tweaks',
    name: 'SponsorBlock Tweaks',
    desc: 'Edit and change specific skipped sections.',
    iconName: 'playlist_remove', // restored previous icon
    requiresToggle: 'skip_sponsor_segments', // UI will show/hide dynamically
    children: [
      { id: 'sb_cat_sponsor',        name: 'Sponsored segments',    desc: 'Paid promotions / sponsored segments', iconName: 'paid',                refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_intro',          name: 'Intro',                  desc: 'Intro sections of the video',          iconName: 'forward_to_inbox',    refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_outro',          name: 'Outro',                  desc: 'Outro sections of the video',          iconName: 'outbond',             refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_interaction',    name: 'Interaction',            desc: '"Like, comment, subscribe" requests',  iconName: 'thumbs_up_down',      refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_selfpromo',      name: 'Self-promo',             desc: 'Self-promotion segments',              iconName: 'campaign',            refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_music_offtopic', name: 'Music (off-topic)',      desc: 'Music segments that are off-topic',    iconName: 'music_off',           refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_preview',        name: 'Preview',                desc: 'Preview sections for upcoming content',iconName: 'preview',             refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_filler',         name: 'Filler',                 desc: 'Irrelevant or repetitive sections',    iconName: 'hourglass_empty',     refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_nonmusic',       name: 'Non-music in MV',        desc: 'Non-music segments in a music video',  iconName: 'music_note',          refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
      { id: 'sb_cat_unclear',        name: 'Unclear',                desc: 'Segments where the purpose is unclear', iconName: 'help_outline',        refreshToggle: 'onlyOff', onChange: () => SponsorBlock.refresh() },
    ]
  },
 
  /* =============== NEW CONDITIONAL BLOCK: Revert Old YouTube UI Tweaks ========
     Appears only when revert_player is ON.
  */
  {
    type: 'block',
    id: 'revert_ui_tweaks',
    name: 'Revert Old Youtube UI Tweaks',
    desc: 'Edit & tweak revert changes for the updated UI.',
    iconName: 'history',
    requiresToggle: 'revert_player',
    children: [
      {
        id: 'fs_hide_quick_controls',
        name: 'Hide fullscreen quick controls',
        desc: 'Removes the quick action buttons overlay. Refresh needed if hidden beforehand.',
        iconName: 'smart_button',
        promptRefresh: false,
          refreshToggle: 'onlyOff',
        onChange: () => { applyFullscreenHideCSS(); }
      }
    ]
  }
];
 
/* ========= Defaults: main + SB categories + fullscreen-tweak toggles ========= */
const DEFAULT_CONFIG = {
  revert_player: true,
 
  // NEW: Fullscreen Delhi UI hide toggles (enabled by default)
  fs_hide_more_videos: false,
  fs_hide_quick_controls: true
};
 
/** Helper: flatten all toggles (booleans) including those inside blocks */
function getAllToggles(){
  const nested = [];
  for (const b of CONFIG_BLOCKS) {
    if (b && Array.isArray(b.children)) nested.push(...b.children.filter(c=>!c.type || c.type==='toggle'));
  }
  return [...CONFIG_TOGGLES, ...nested];
}
 
/** Fullscreen “Delhi” UI hide defaults (auto-applied when revert_player is ON) */
const HIDE_FULLSCREEN_CONFIG = {
  playerHideFullScreenMoreVideos: false,
  playerHideFullScreenControls:  true
};
 
/* ============================ STORAGE ========================= */
const STORAGE_PREFIX   = 'OldYTPlayer:toggle:'; // booleans only
const APPLIED_PREFIX   = 'OldYTPlayer:applied:'; // booleans only
const VALUE_PREFIX     = 'OldYTPlayer:value:';   // string values (selects, etc.)
const LS = window.localStorage;
 
// boolean toggles
function storageGet(id){ try{ return LS.getItem(STORAGE_PREFIX+id)==='1'; }catch(_){ return false; } }
function storageSet(id,v){ try{ LS.setItem(STORAGE_PREFIX+id, v?'1':'0'); }catch(_){} }
function storageHas(id){ try{ return LS.getItem(STORAGE_PREFIX+id)!==null; }catch(_){ return false; } }
function appliedGet(id){ try{ return LS.getItem(APPLIED_PREFIX+id)==='1'; }catch(_){ return storageGet(id); } }
function appliedSet(id,v){ try{ LS.setItem(APPLIED_PREFIX+id, v?'1':'0'); }catch(_){} }
function appliedSeedFromCurrent(){ for (const cfg of getAllToggles()) appliedSet(cfg.id, storageGet(cfg.id)); }
function ensureSbCategoryDefaults(){
  const keys = (SponsorBlock && SponsorBlock.KEY_TO_API) ? Object.keys(SponsorBlock.KEY_TO_API) : Object.keys(DEFAULT_CONFIG).filter(k=>k.startsWith('sb_cat_'));
  const anyPresent = keys.some(k => storageHas(k));
  if (!anyPresent){
    for (const k of keys){
      const def = Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, k) ? !!DEFAULT_CONFIG[k] : false;
      storageSet(k, def);
    }
  }
}
 
// value selects
function storageGetVal(id, def){ try{ const v=LS.getItem(VALUE_PREFIX+id); return v!==null ? v : def; }catch(_){ return def; } }
function storageSetVal(id, v){ try{ LS.setItem(VALUE_PREFIX+id, String(v)); }catch(_){} }
function storageHasVal(id){ try{ return LS.getItem(VALUE_PREFIX+id)!==null; }catch(_){ return false; } }
 
// seed toggle defaults if missing
for (const cfg of getAllToggles()){
  if (!storageHas(cfg.id)) {
    const def = Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, cfg.id) ? !!DEFAULT_CONFIG[cfg.id] : false;
    storageSet(cfg.id, def);
  }
}
// seed select defaults
for (const b of CONFIG_BLOCKS){
  if (!b.children) continue;
  for (const c of b.children){
    if (c && c.type==='select'){
      if (!storageHasVal(c.id)) storageSetVal(c.id, c.default);
    }
  }
}
 
/** Reset refresh state on every run (fresh load). */
appliedSeedFromCurrent();
 
/* ==================== DELHI FLAG REMOVAL =============== */
const DELHI_STYLE_RE = /ytp-fullscreen-(quick-actions|grid)/;
let didStripDelhiStyles = false;
 
function tryRemoveDelhiFlagsOnce() {
  try {
    const yt = window.yt;
    let mod = 0;
    if (yt && yt.config_ && yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) {
      const cfgs = yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
      for (const k in cfgs) {
        const c = cfgs[k];
        if (c && typeof c.serializedExperimentFlags === 'string') {
          const before = c.serializedExperimentFlags;
          if (!before.includes('delhi_modern_web_player')) {
            if (before.includes('delhi_modern_web_player_icons')) {
              const after = before
                .replace(/&?delhi_modern_web_player_icons=true/g, '')
                .replace(/&&+/g, '&').replace(/^&+/, '').replace(/&+$/, '');
              if (after !== before) { c.serializedExperimentFlags = after; mod++; }
            }
          } else {
            const after = before
              .replace(/&?delhi_modern_web_player=true/g, '')
              .replace(/&?delhi_modern_web_player_icons=true/g, '')
              .replace(/&&+/g, '&').replace(/^&+/, '').replace(/&+$/, '');
            if (after !== before) { c.serializedExperimentFlags = after; mod++; }
          }
        }
      }
    }
    const removed = removeFullscreenQuickActions();
    return mod + (removed ? 1 : 0);
  } catch (_) { return 0; }
}
 
function removeFullscreenQuickActions() {
  let removed = false;
  const hasTargets = document.querySelector('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid');
  if (!didStripDelhiStyles || hasTargets) {
    const styles = document.getElementsByTagName('style');
    for (let i = styles.length - 1; i >= 0; i--) {
      const s = styles[i];
      try {
        const txt = s.textContent;
        if (txt && DELHI_STYLE_RE.test(txt)) {
          s.remove();
          removed = true;
          didStripDelhiStyles = true;
        }
      } catch(_) {}
    }
  }
  if (hasTargets) {
    const q = document.querySelectorAll('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid');
    for (let i=0;i<q.length;i++) { try{ q[i].remove(); removed = true; }catch(_){} }
  }
  return removed;
}
 
function robustRemoveDelhiFlagsWithRetries() {
  if (tryRemoveDelhiFlagsOnce() > 0) return true;
  let tries = 0, max = 60;
  const t = setInterval(() => { tries++; const n = tryRemoveDelhiFlagsOnce(); if (n > 0 || tries >= max) clearInterval(t); }, 200);
  const obs = new MutationObserver((muts) => {
    for (let i=0;i<muts.length;i++){
      const m = muts[i];
      for (let j=0;j<m.addedNodes.length;j++){
        const n = m.addedNodes[j];
        if (n && n.nodeType === 1) {
          const el = n;
          if (el.matches && (el.matches('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid') ||
             (el.tagName === 'STYLE' && DELHI_STYLE_RE.test(el.textContent||'')) )) { removeFullscreenQuickActions(); return; }
          if (el.querySelector && el.querySelector('.ytp-fullscreen-quick-actions, .ytp-fullscreen-grid')) { removeFullscreenQuickActions(); return; }
        }
      }
    }
  });
  obs.observe(document.documentElement, { childList:true, subtree:true });
  return false;
}
 
/* =============== Fullscreen hide CSS =============== */
const HIDE_STYLE_ID = 'oldytplayer-hide-fullscreen-css';
 
function isMobileUA(){ try{ return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || ''); }catch(_){ return false; } }
function isDesktop(){ return !isMobileUA(); }
 
function applyFullscreenHideCSS() {
  removeFullscreenHideCSS();
  const desktop = isDesktop();
  const mobile  = !desktop;
 
  // NEW: use toggle-backed config (defaults true)
  const moreVideos = storageHas('fs_hide_more_videos') ? storageGet('fs_hide_more_videos') : HIDE_FULLSCREEN_CONFIG.playerHideFullScreenMoreVideos;
  const quickControls = storageHas('fs_hide_quick_controls') ? storageGet('fs_hide_quick_controls') : HIDE_FULLSCREEN_CONFIG.playerHideFullScreenControls;
 
  const hideCssSelectors = [];
  const cssRules = [];
 
  if (moreVideos) {
    if (desktop) {
      hideCssSelectors.push('.ytp-fullscreen-grid');
      cssRules.push(`
        #movie_player.ytp-delhi-modern { --ytp-grid-scroll-percentage: 0 !important; }
        .ytp-delhi-modern.ytp-grid-scrolling .ytp-chrome-bottom { bottom: 0 !important; opacity: 1 !important; }
        .ytp-delhi-modern .ytp-gradient-bottom { display: none !important; }
      `);
    }
  }
  if (quickControls) {
    if (desktop) hideCssSelectors.push('.ytp-fullscreen-quick-actions');
  }
  if (quickControls && moreVideos) {
    if (mobile) {
      cssRules.push(`
        body[faux-fullscreen="true"] .enable-fullscreen-controls.fs-watch-system .watch-page-progress-bar { bottom: 0 !important; }
        body[faux-fullscreen="true"] .enable-fullscreen-controls.fs-watch-system .player-controls-bottom { bottom: 30px !important; }
      `);
    }
  }
 
  const style = document.createElement('style'); style.id = HIDE_STYLE_ID;
  const hideBlock = hideCssSelectors.length ? `${hideCssSelectors.join(',\n')} { display: none !important; }` : '';
  const allCss = [hideBlock, ...cssRules].join('\n');
  try{ style.appendChild(document.createTextNode(allCss)); }catch(_){ style.textContent = allCss; }
  (document.head || document.documentElement).appendChild(style);
}
function removeFullscreenHideCSS() { const s = document.getElementById(HIDE_STYLE_ID); if (s) try{ s.remove(); }catch(_){} }
 
/* ===================== Restore Miniplayer Button  ===== */
const OLDYT_MINIPLAYER_BTN_ID    = 'oldyt-miniplayer-button';
const OLDYT_MINIPLAYER_STYLE_ID  = 'oldyt-miniplayer-css';
const OLDYT_MINIPLAYER_OBS_KEY   = '__oldyt_miniplayer_observer';
const OLDYT_MINIPLAYER_RETRY_KEY = '__oldyt_miniplayer_retry';
const OLDYT_MINIPLAYER_NEW_PATH = 'M21.20 3.01C21.66 3.05 22.08 3.26 22.41 3.58C22.73 3.91 22.94 4.33 22.98 4.79L23 5V19C23.00 19.49 22.81 19.97 22.48 20.34C22.15 20.70 21.69 20.93 21.20 20.99L21 21H3L2.79 20.99C2.30 20.93 1.84 20.70 1.51 20.34C1.18 19.97 .99 19.49 1 19V13H3V19H21V5H11V3H21L21.20 3.01ZM1.29 3.29C1.10 3.48 1.00 3.73 1.00 4C1.00 4.26 1.10 4.51 1.29 4.70L5.58 9H3C2.73 9 2.48 9.10 2.29 9.29C2.10 9.48 2 9.73 2 10C2 10.26 2.10 10.51 2.29 10.70C2.48 10.89 2.73 11 3 11H9V5C9 4.73 8.89 4.48 8.70 4.29C8.51 4.10 8.26 4 8 4C7.73 4 7.48 4.10 7.29 4.29C7.10 4.48 7 4.73 7 5V7.58L2.70 3.29C2.51 3.10 2.26 3.00 2 3.00C1.73 3.00 1.48 3.10 1.29 3.29ZM19.10 11.00L19 11H12L11.89 11.00C11.66 11.02 11.45 11.13 11.29 11.29C11.13 11.45 11.02 11.66 11.00 11.89L11 12V17C10.99 17.24 11.09 17.48 11.25 17.67C11.42 17.85 11.65 17.96 11.89 17.99L12 18H19L19.10 17.99C19.34 17.96 19.57 17.85 19.74 17.67C19.90 17.48 20.00 17.24 20 17V12L19.99 11.89C19.97 11.66 19.87 11.45 19.70 11.29C19.54 11.13 19.33 11.02 19.10 11.00ZM13 16V13H18V16H13Z';
const OLDYT_MINIPLAYER_OLD_PATH = 'M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z';
 
function oldytInsertMiniplayerButton() {
  if (document.getElementById(OLDYT_MINIPLAYER_BTN_ID)) return true;
 
  const sizeBtn = document.querySelector('.ytp-chrome-bottom .ytp-size-button');
  if (!sizeBtn || !sizeBtn.parentElement) return false;
 
  const btn = document.createElement('button');
  btn.id = OLDYT_MINIPLAYER_BTN_ID;
  btn.className = 'ytp-button';
  btn.title = '(i)';
  btn.setAttribute('aria-keyshortcuts', 'i');
  btn.style.display = 'inline-flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
 
  const isNewStyle = sizeBtn.parentElement.classList.contains('ytp-right-controls-right');
 
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  if (isNewStyle) {
    svg.setAttribute('fill', 'none');
    svg.setAttribute('height', '24');
    svg.setAttribute('width', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', OLDYT_MINIPLAYER_NEW_PATH);
    path.setAttribute('fill', 'white');
    svg.appendChild(path);
  } else {
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('viewBox', '0 0 36 36');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', OLDYT_MINIPLAYER_OLD_PATH);
    path.setAttribute('fill', '#fff');
    path.setAttribute('fill-rule', 'evenodd');
    svg.appendChild(path);
  }
  btn.appendChild(svg);
 
  sizeBtn.parentElement.insertBefore(btn, sizeBtn);
 
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      bubbles: true, cancelable: true, code: 'KeyI', key: 'i', keyCode: 73, which: 73
    }));
  }, { capture: true });
 
  return true;
}
 
function oldytEnsureMiniplayerButton() {
  if (window[OLDYT_MINIPLAYER_RETRY_KEY]) clearInterval(window[OLDYT_MINIPLAYER_RETRY_KEY]);
  let attempts = 0;
  window[OLDYT_MINIPLAYER_RETRY_KEY] = setInterval(() => {
    attempts++;
    if (oldytInsertMiniplayerButton() || attempts > 40) {
      clearInterval(window[OLDYT_MINIPLAYER_RETRY_KEY]);
      window[OLDYT_MINIPLAYER_RETRY_KEY] = null;
    }
  }, 250);
 
  const startObserver = () => {
    const target = document.body || document.documentElement;
    if (!target || !(target instanceof Node)) return false;
 
    if (window[OLDYT_MINIPLAYER_OBS_KEY]) window[OLDYT_MINIPLAYER_OBS_KEY].disconnect();
    const obs = new MutationObserver(() => {
      if (!document.getElementById(OLDYT_MINIPLAYER_BTN_ID)) {
        oldytInsertMiniplayerButton();
      }
    });
    try {
      obs.observe(target, { childList: true, subtree: true });
      window[OLDYT_MINIPLAYER_OBS_KEY] = obs;
      return true;
    } catch (_) {
      return false;
    }
  };
 
  if (!startObserver()) {
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (startObserver() || tries > 40) clearInterval(t);
    }, 250);
  }
}
 
function applyRestoreMiniplayerButton() {
  removeRestoreMiniplayerButton();
  const css = `ytd-watch-flexy[fullscreen] #${OLDYT_MINIPLAYER_BTN_ID} { display: none !important; }`;
  const style = document.createElement('style');
  style.id = OLDYT_MINIPLAYER_STYLE_ID;
  try { style.appendChild(document.createTextNode(css)); } catch(_) { style.textContent = css; }
  (document.head || document.documentElement).appendChild(style);
 
  oldytEnsureMiniplayerButton();
}
 
function removeRestoreMiniplayerButton() {
  const s = document.getElementById(OLDYT_MINIPLAYER_STYLE_ID);
  if (s) try { s.remove(); } catch(_){}
  const b = document.getElementById(OLDYT_MINIPLAYER_BTN_ID);
  if (b) try { b.remove(); } catch(_){}
  if (window[OLDYT_MINIPLAYER_OBS_KEY]) {
    try { window[OLDYT_MINIPLAYER_OBS_KEY].disconnect(); }catch(_){}
    window[OLDYT_MINIPLAYER_OBS_KEY] = null;
  }
  if (window[OLDYT_MINIPLAYER_RETRY_KEY]) {
    clearInterval(window[OLDYT_MINIPLAYER_RETRY_KEY]);
    window[OLDYT_MINIPLAYER_RETRY_KEY] = null;
  }
}
 
/* ========== Apply toggles/values immediately at load =============== */
if (storageGet('revert_player')) { robustRemoveDelhiFlagsWithRetries(); applyFullscreenHideCSS(); }
if (storageGet('restore_miniplayer_button')) applyRestoreMiniplayerButton();
 
/* ============================ DOM/STYLE ============================= */
const STYLE_ID = 'oldytplayer-style-v077';
 
function safeAppend(p,n){ try{ if(p && n && n.nodeType===1) p.appendChild(n); }catch(_){} }
function ensureMaterialIcons(){
  if (!document.querySelector('link[href*="fonts.googleapis.com/icon"]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/icon?family=Material+Icons';
    (document.head||document.documentElement).appendChild(link);
  }
}
function injectStyles(){
  if (document.getElementById(STYLE_ID)) return;
  ensureMaterialIcons();
  const css = [
    '.oldyt-panel{width:101% !important;box-sizing:border-box;padding:6px 8px;min-height:120px;max-height:100%;display:flex;flex-direction:column;}',
    '.oldyt-top-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;min-height:32px;flex:0 0 auto;}',
    '.oldyt-back{cursor:pointer;display:flex;align-items:center;gap:8px;font-weight:600;color:#fff;transition:color 0.2s ease,opacity 0.2s ease;}',
    '.oldyt-back:hover{color:#ff4e45;opacity:0.9;}',
    '.oldyt-back .material-icons{font-size:18px;transform:translateY(1px);transition:transform 0.2s ease;}',
    '.oldyt-back:hover .material-icons{transform:translateY(1.05) scale(1.05);}',
    '.oldyt-refresh-banner{margin-left:auto;background:#c62828;color:#fff;padding:6px 10px;border-radius:6px;display:flex;align-items:center;gap:8px;font-size:13px;}',
    '.oldyt-refresh-banner.hidden{display:none !important;}',
    '.oldyt-refresh-btn{background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;padding:6px 8px;border-radius:4px;cursor:pointer;font-weight:600;}.oldyt-refresh-btn:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.4);transform: scale(1.02);box-shadow:0 0 8px rgba(255,255,255,0.15)}',
    '.oldyt-list{display:flex;flex-direction:column;gap:6px;flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding-right:6px;-webkit-overflow-scrolling:touch;}',
    '.oldyt-item{display:flex;align-items:center;gap:12px;padding:8px;border-radius:8px;min-height:52px;}',
    '.oldyt-item:hover{background:rgba(255,255,255,0.05);transition:background .03s ease;}',
    '.oldyt-icon{width:32px;height:32px;min-width:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(255,255,255,0.03)}',
    '.oldyt-icon img{width:18px;height:18px;}',
    '.oldyt-icon .material-icons{font-size:18px;}',
    '.oldyt-textcol{display:flex;flex-direction:column;gap:3px;flex:1 1 auto;min-width:0;}',
    '.oldyt-name{color:#fff;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;}',
    '.oldyt-desc{color:rgba(255,255,255,0.78);font-size:12px;line-height:1;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;}',
    '.oldyt-rightcol{margin-left:12px;display:flex;align-items:center;justify-content:flex-end;min-width:26.5px;}',
    '.oldyt-rightcol.has-select{min-width:50px;}',
    '.oldyt-toggle{display:inline-block;width:40px;height:22px;border-radius:22px;background:#6b6b6b;position:relative;box-shadow:inset 0 -2px 0 rgba(0,0,0,0.12);transition:background .12s ease;min-width:40px; cursor: pointer;}',
    '.oldyt-toggle .oldyt-knob{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.35);transition:left .12s ease;}',
    '.oldyt-toggle.on{background:#e53935;}',
    '.oldyt-toggle.on .oldyt-knob{left:21px;}',
    '.oldyt-change-badge{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#c62828;margin-left:8px;vertical-align:middle;flex:0 0 auto;}',
    '.oldyt-change-badge .material-icons{font-size:12px;color:#fff;}',
    '.oldyt-select{appearance:none;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:4px 8px;font-size:12px;min-width:50px;cursor:pointer;}',
    '.oldyt-select:focus{outline:none;}',
    '.oldyt-list::-webkit-scrollbar{width:8px;height:8px;}',
    '.oldyt-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:8px;}',
    /* NEW: conditional reason title */
    '.oldyt-conditional-title{margin:2px 0 6px 12px;font-size:12px;color:rgba(255,255,255,0.82)}',
    '.oldyt-conditional-title b{color:#fff;}'
  ].join('\n');
  const style=document.createElement('style'); style.id=STYLE_ID;
  try{ style.appendChild(document.createTextNode(css)); }catch(_){ style.textContent=css; }
  (document.head||document.documentElement).appendChild(style);
}
function makeMaterialIcon(name){
  const i=document.createElement('i');
  i.className='material-icons'; i.setAttribute('aria-hidden','true'); i.textContent=name;
  return i;
}
 
/* ===================== PENDING / BADGE CALC ======================== */
function computePendingMap(){
  const map={};
  for (const cfg of getAllToggles()){
    const cur=storageGet(cfg.id), appl=appliedGet(cfg.id);
    map[cfg.id] = wantsRefresh(cfg, cur, appl);
  }
  return map;
}
function anyPendingFromMap(m){ for (const k in m) if (m[k]) return true; return false; }
function computePendingMapForChildren(blockCfg){
  const map={};
  for(const cfg of (blockCfg.children||[])){
    if (cfg.type==='select') { map[cfg.id]=false; continue; }
    const cur=storageGet(cfg.id), appl=appliedGet(cfg.id);
    map[cfg.id]=wantsRefresh(cfg, cur, appl);
  }
  return map;
}
 
/* ==================== VIEWPORT / FOCUS HELPERS ===================== */
function isInsidePanel(panelEl, evt) {
  try{
    if (!panelEl || !evt) return false;
    const t = evt.target;
    if (t && panelEl.contains && panelEl.contains(t)) return true;
    if (t && t.closest && t.closest('.oldyt-panel')) return true;
    const p = (typeof evt.composedPath === 'function') ? evt.composedPath() : null;
    if (p && Array.isArray(p) && p.indexOf(panelEl) !== -1) return true;
    const r = panelEl.getBoundingClientRect && panelEl.getBoundingClientRect();
    let x=0,y=0;
    if (evt.touches && evt.touches[0]) { x=evt.touches[0].clientX; y=evt.touches[0].clientY; }
    else if (evt.clientX!=null && evt.clientY!=null) { x=evt.clientX; y=evt.clientY; }
    if (r && (x||y)) return (x>=r.left && x<=r.right && y>=r.top && y<=r.bottom);
  }catch(_){}
  return false;
}
function isMostlyInViewport(el, threshold = 0.1){
  if (!el || !el.getBoundingClientRect) return true;
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const interW = Math.max(0, Math.min(r.right, vw) - Math.min(Math.max(r.left,0), vw));
  const interH = Math.max(0, Math.min(r.bottom, vh) - Math.min(Math.max(r.top,0), vh));
  const interA = interW * interH;
  const area = Math.max(1, r.width * r.height);
  return (interA / area) >= threshold;
}
 
/* ======================== BADGE (menu item) ======================== */
function createChangeBadge(){
  const b=document.createElement('span'); b.className='oldyt-change-badge';
  b.appendChild(makeMaterialIcon('autorenew')); return b;
}
function ensureMenuItemBadge(menuItem, contentDiv, show){
  if(!menuItem || !contentDiv) return;
  let badge = menuItem._oldytBadge;
  if (show){
    if(!badge){
      badge=createChangeBadge();
      contentDiv.insertBefore(badge, contentDiv.firstChild);
      menuItem._oldytBadge=badge;
    }
    badge.style.display='inline-flex';
  } else if (badge){
    badge.style.display='none';
  }
}
 
/* =================== PANEL / POPUP LIFECYCLE ======================= */
function buildSettingsBlockPanel(blockCfg, popup, panelMenu, parentPanel, menuItemRef, menuContentRef){
  injectStyles();
 
  const panel=document.createElement('div');
  panel.className='ytp-panel oldyt-panel';
  panel.setAttribute('role','menu');
 
  const topRow=document.createElement('div'); topRow.className='oldyt-top-row';
 
  const back=document.createElement('div'); back.className='oldyt-back'; back.setAttribute('role','button'); back.setAttribute('tabindex','0'); back.setAttribute('aria-label','Back');
  back.appendChild(makeMaterialIcon('arrow_back'));
  { const label=document.createElement('div'); label.textContent='Back'; back.appendChild(label); }
  topRow.appendChild(back);
 
  const title=document.createElement('div'); title.className='oldyt-name'; title.textContent=blockCfg.name||'Settings';
  title.style.cursor = 'pointer';
  topRow.appendChild(title);
 
  const banner=document.createElement('div'); banner.className='oldyt-refresh-banner hidden'; banner.setAttribute('role','alert');
  const bText=document.createElement('span'); bText.textContent='You must refresh now to apply changes.'; banner.appendChild(bText);
 
  const btn = document.createElement('button'); btn.className='oldyt-refresh-btn';
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  btn.textContent = isSafari ? 'Please Refresh' : 'Refresh now';
  function robustRefreshNow(){
    try{ for (const cfg of getAllToggles()) appliedSet(cfg.id, storageGet(cfg.id)); }catch(_){}
    try{ ensureMenuItemBadge(menuItemRef, menuContentRef, false); }catch(_){}
    try{ panel._detachOutsideHandlers && panel._detachOutsideHandlers(); }catch(_){}
    try{ panel._detachAutoCloseGuards && panel._detachAutoCloseGuards(); }catch(_){}
    const tries=[()=>location.reload(), ()=>{location.href=location.href;}, ()=>window.location.reload(), ()=>{window.top&&window.top.location&&window.top.location.reload();}, ()=>history.go(0)];
    (function chain(i){ try{ tries[i](); }catch(_){ if(i+1<tries.length) setTimeout(()=>chain(i+1),30); } })(0);
  }
  btn.addEventListener('click', robustRefreshNow, {passive:true});
  banner.appendChild(btn);
 
  topRow.appendChild(banner);
  panel.appendChild(topRow);
 
  const version = 'v0.3';
  topRow.style.position = 'relative';
  const versionTop = document.createElement('div');
  versionTop.textContent = version;
  Object.assign(versionTop.style, {
    position: 'absolute', top: '0px', right: '0px', fontSize: '10.5px', fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
    padding: '2px 6px', borderRadius: '5px', textShadow: '0 0 2px rgba(0,0,0,0.35)', boxShadow: '0 0 6px rgba(255,255,255,0.08), 0 0 4px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(5px) saturate(120%)', WebkitBackdropFilter: 'blur(5px) saturate(120%)',
    pointerEvents: 'none', userSelect: 'none', zIndex: '2',
  });
  topRow.appendChild(versionTop);
 
  const list=document.createElement('div'); list.className='oldyt-list';
  const frag=document.createDocumentFragment();
  panel._pendingMap={};
 
  for (const cfg of (blockCfg.children||[])){
    const item=document.createElement('div'); item.className='oldyt-item';
 
    const iconWrap=document.createElement('div'); iconWrap.className='oldyt-icon';
    if(cfg.iconName) iconWrap.appendChild(makeMaterialIcon(cfg.iconName));
    else if (cfg.iconUrl){ const img=document.createElement('img'); img.src=cfg.iconUrl; img.alt=cfg.name||''; iconWrap.appendChild(img); }
    else iconWrap.appendChild(makeMaterialIcon('extension'));
    item.appendChild(iconWrap);
 
    const textcol=document.createElement('div'); textcol.className='oldyt-textcol';
    const name=document.createElement('div'); name.className='oldyt-name'; name.textContent=cfg.name||'Unnamed';
    const desc=document.createElement('div'); desc.className='oldyt-desc'; desc.textContent=cfg.desc||'';
    textcol.appendChild(name); textcol.appendChild(desc); item.appendChild(textcol);
 
    const rightcol=document.createElement('div'); rightcol.className='oldyt-rightcol';
    if (!cfg.type || cfg.type==='toggle'){
      const toggle=document.createElement('div'); toggle.className='oldyt-toggle'; toggle.id='oldyt-toggle-'+cfg.id; toggle.setAttribute('role','switch'); toggle.setAttribute('tabindex','0');
      const knob=document.createElement('div'); knob.className='oldyt-knob'; toggle.appendChild(knob);
      rightcol.appendChild(toggle); item.appendChild(rightcol);
 
      const cur=storageGet(cfg.id);
      if(cur){ toggle.classList.add('on'); toggle.setAttribute('aria-checked','true'); } else toggle.setAttribute('aria-checked','false');
 
      const handleToggle=()=>{
        const nowOn = !toggle.classList.contains('on');
        toggle.classList.toggle('on', nowOn);
        toggle.setAttribute('aria-checked', nowOn ? 'true':'false');
        storageSet(cfg.id, nowOn);
        setAppliedIfOnlyOff(cfg, nowOn);
        if (typeof cfg.onChange==='function'){ try{ cfg.onChange(nowOn, cfg.id); }catch(_){} }
 
        const need = wantsRefresh(cfg, nowOn, appliedGet(cfg.id));
        panel._pendingMap[cfg.id] = need;
 
        const localAny = anyPendingFromMap(panel._pendingMap);
        const globalAny = anyPendingFromMap(computePendingMap());
        panel._setRefreshVisible(localAny);
        ensureMenuItemBadge(menuItemRef, menuContentRef, globalAny);
      };
 
      toggle.addEventListener('click', (e)=>{ e.stopPropagation(); handleToggle(); }, {passive:true});
      toggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); handleToggle(); } }, {passive:false});
    } else if (cfg.type==='select'){
      rightcol.classList.add('has-select');
      const sel = document.createElement('select');
      sel.className = 'oldyt-select';
      const curVal = storageGetVal(cfg.id, cfg.default);
      for (const opt of (cfg.options||[])){
        const o = document.createElement('option');
        o.value = opt.value; o.textContent = opt.label;
        if (opt.value === curVal) o.selected = true;
        sel.appendChild(o);
      }
      sel.addEventListener('change', (e)=>{
        const v = e.target.value;
        storageSetVal(cfg.id, v);
        try{ typeof cfg.onChange==='function' && cfg.onChange(v, cfg.id); }catch(_){}
      }, {passive:true});
 
      rightcol.appendChild(sel);
      item.appendChild(rightcol);
    }
 
    frag.appendChild(item);
  }
 
  list.appendChild(frag);
  panel.appendChild(list);
 
  panel._setRefreshVisible = (v)=>{ if(v) banner.classList.remove('hidden'); else banner.classList.add('hidden'); };
  panel._recalcPending = ()=>{
    panel._pendingMap = computePendingMapForChildren(blockCfg);
    panel._setRefreshVisible(anyPendingFromMap(panel._pendingMap));
  };
  panel._recalcPending();
 
  function goBack(){
    openNestedInPopup(popup, panelMenu, parentPanel);
    const globalMap = computePendingMap();
    const globalAny = anyPendingFromMap(globalMap);
    parentPanel._pendingMap = globalMap;
    parentPanel._setRefreshVisible(globalAny);
    ensureMenuItemBadge(menuItemRef, menuContentRef, globalAny);
  }
  back.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); goBack(); }, {passive:false});
  back.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); goBack(); } }, {passive:false});
 
  panel._detachOutsideHandlers = null;
  panel._attachOutsideHandlers = function attach() {
    const panelEl = panel;
    const onDown = (e) => { const inside = isInsidePanel(panelEl, e); if (!inside) goBack(); };
    const onKeyDown = (e) => { if (e.key === 'Escape') goBack(); };
    function detach(){ document.removeEventListener('pointerdown', onDown, true); document.removeEventListener('mousedown', onDown, true); document.removeEventListener('touchstart', onDown, true); document.removeEventListener('keydown', onKeyDown, true); }
    if (window.PointerEvent) document.addEventListener('pointerdown', onDown, {capture:true, passive:true});
    document.addEventListener('mousedown', onDown, {capture:true, passive:true});
    document.addEventListener('touchstart', onDown, {capture:true, passive:true});
    document.addEventListener('keydown', onKeyDown, {capture:true, passive:true});
    panel._detachOutsideHandlers = detach;
  };
 
  panel._attachAutoCloseGuards = function attachAuto() {
    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    let scrollTick = null;
    let io = null;
 
    const maybeClose = () => {
      if (!document.contains(panel)) return;
      const popupEl = popup;
      const ok = isMostlyInViewport(popupEl) && isMostlyInViewport(player || popupEl);
      if (!ok) goBack();
    };
 
    const onScroll = () => {
      if (scrollTick) return;
      scrollTick = requestAnimationFrame(() => { scrollTick = null; maybeClose(); });
    };
    window.addEventListener('scroll', onScroll, {passive:true, capture:true});
    window.addEventListener('resize', onScroll, {passive:true, capture:true});
 
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        const vis = entries.some(e => e.isIntersecting);
        if (!vis) { goBack(); }
      }, { threshold: 0.01 });
      try { io.observe(popup); } catch(_){}
      if (player) { try { io.observe(player); } catch(_){} }
    }
 
    const onNavStart = () => goBack();
    const onFs = () => goBack();
    window.addEventListener('yt-navigate-start', onNavStart, true);
    document.addEventListener('fullscreenchange', onFs, true);
 
    panel._detachAutoCloseGuards = function detachAuto() {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll, true);
      window.removeEventListener('yt-navigate-start', onNavStart, true);
      document.removeEventListener('fullscreenchange', onFs, true);
      if (io) try { io.disconnect(); } catch(_){}
      io = null;
      if (scrollTick) cancelAnimationFrame(scrollTick);
      scrollTick = null;
    };
  };
 
  return panel;
}
 
/* -------- small helper to build a block menu-item (used for conditional blocks) -------- */
function buildBlockMenuItem(block, popup, panelMenu, parentPanel, menuItemRef, menuContentRef){
  const item=document.createElement('div'); item.className='oldyt-item';
  const iconWrap=document.createElement('div'); iconWrap.className='oldyt-icon';
  if (block.iconName) iconWrap.appendChild(makeMaterialIcon(block.iconName)); else iconWrap.appendChild(makeMaterialIcon('folder'));
  item.appendChild(iconWrap);
 
  const textcol=document.createElement('div'); textcol.className='oldyt-textcol';
  const name=document.createElement('div'); name.className='oldyt-name'; name.textContent=block.name||'Settings';
  const desc=document.createElement('div'); desc.className='oldyt-desc'; desc.textContent=block.desc||'';
  textcol.appendChild(name); textcol.appendChild(desc); item.appendChild(textcol);
 
  const rightcol=document.createElement('div'); rightcol.className='oldyt-rightcol';
  const arrow=document.createElement('div'); arrow.appendChild(makeMaterialIcon('chevron_right'));
  rightcol.appendChild(arrow); item.appendChild(rightcol);
 
  const openBlock = (ev)=>{
    if (ev){
      ev.preventDefault && ev.preventDefault();
      ev.stopPropagation && ev.stopPropagation();
      ev.stopImmediatePropagation && ev.stopImmediatePropagation();
    }
    parentPanel._detachOutsideHandlers && parentPanel._detachOutsideHandlers();
    const blockPanel = buildSettingsBlockPanel(block, popup, panelMenu, parentPanel, menuItemRef, menuContentRef);
    setTimeout(()=>{
      openNestedInPopup(popup, panelMenu, blockPanel);
      try { blockPanel.setAttribute('tabindex','-1'); blockPanel.focus({preventScroll:true}); } catch(_) {}
    }, 0);
  };
 
  item.addEventListener('pointerdown', (e)=>{ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }, {capture:true});
  item.addEventListener('click', openBlock, {capture:true});
  item.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openBlock(e); } });
 
  return item;
}
 
function buildNestedPanel(popup, panelMenu, menuItemRef, menuContentRef){
  injectStyles();
 
  const panel=document.createElement('div');
  panel.className='ytp-panel oldyt-panel';
  panel.setAttribute('role','menu');
 
  const topRow=document.createElement('div'); topRow.className='oldyt-top-row';
  const back=document.createElement('div'); back.className='oldyt-back'; back.setAttribute('role','button'); back.setAttribute('tabindex','0'); back.setAttribute('aria-label','Back to settings');
  back.appendChild(makeMaterialIcon('arrow_back'));
  { const backLabel=document.createElement('div'); backLabel.textContent='Back'; back.appendChild(backLabel); }
  topRow.appendChild(back);
 
/* -------------------- What's new? pill (unchanged) -------------------- */
const whatsNewBtn = document.createElement('div');
whatsNewBtn.setAttribute('role','button');
whatsNewBtn.setAttribute('tabindex','0');
whatsNewBtn.setAttribute('aria-label',"What's new?");
whatsNewBtn.textContent = "What's new?";
Object.assign(whatsNewBtn.style, {
  marginLeft: '10px',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11.5px',
  fontWeight: '600',
  color: 'rgba(255,255,255,0.9)',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
  boxShadow: '0 0 6px rgba(255,255,255,0.08), 0 0 4px rgba(0,0,0,0.25)',
  backdropFilter: 'blur(5px) saturate(120%)',
  WebkitBackdropFilter: 'blur(5px) saturate(120%)',
  cursor: 'pointer',
  userSelect: 'none',
  lineHeight: '1',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
});
const wnDot = document.createElement('span');
Object.assign(wnDot.style, {
  width: '6px', height: '6px', borderRadius: '50%',
  background: '#ff4e45', boxShadow: '0 0 4px rgba(255,78,69,0.9)'
});
whatsNewBtn.appendChild(wnDot);
 
// Popover
const wnBubble = document.createElement('div');
wnBubble.setAttribute('role','dialog');
Object.assign(wnBubble.style, {
  position: 'absolute',
  zIndex: '3',
  minWidth: '260px',
  maxWidth: '360px',
  padding: '10px 12px',
  borderRadius: '10px',
  color: 'rgba(255,255,255,0.95)',
  background: 'linear-gradient(145deg, rgba(0,0,0,0.70), rgba(255,255,255,0.03))',
  boxShadow: '0 8px 22px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06)',
  backdropFilter: 'blur(8px) saturate(140%)',
  WebkitBackdropFilter: 'blur(8px) saturate(140%)',
  display: 'none',
  opacity: '0',
  transform: 'scale(0.86) translateY(6px)',
  willChange: 'transform, opacity'
});
const wnArrow = document.createElement('div');
Object.assign(wnArrow.style, {
  position: 'absolute',
  width: '12px', height: '12px',
  transform: 'rotate(45deg)',
  bottom: '-6px',
  left: 'calc(50% - 6px)',
  background: 'linear-gradient(145deg, rgba(0,0,0,0.70), rgba(255,255,255,0.03))',
  boxShadow: '0 8px 22px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06)',
  opacity: '0',
  willChange: 'transform, opacity'
});
wnBubble.appendChild(wnArrow);
 
// ---------- What's New (TrustedHTML-safe) ----------
const ttPolicy = (() => {
  try {
    if (window.trustedTypes) {
      return (window.__oytp_changelog_policy ||= trustedTypes.createPolicy('oytp-changelog', {
        createHTML: str => str // safe, static HTML only (<b> tags)
      }));
    }
  } catch (_) {}
  return null;
})();
 
const CHANGELOG = [
  '<b>Added:</b> “Revert Old YouTube UI” tweaks to unhide new fullscreen controls or video panels.',
  '<b>Added:</b> SponsorBlock Tweaks panel with customizable skip sections.',
  'New conditional settings also appear with a <i>“Visible because…”</i> title.',
  '<b>Fixed:</b> Dislikes and SponsorBlock toggles now show proper refresh reminders, on disable only.',
];
 
const ul = document.createElement('ul');
Object.assign(ul.style, {
  margin: '0',
  padding: '0 0 0 16px',
  fontSize: '12px',
  lineHeight: '1.4'
});
 
for (const item of CHANGELOG) {
  const li = document.createElement('li');
  if (ttPolicy) {
    li.innerHTML = ttPolicy.createHTML(item);
  } else {
    li.innerHTML = item;
  }
  ul.appendChild(li);
}
wnBubble.appendChild(ul);
 
 
topRow.appendChild(whatsNewBtn);
topRow.style.position = 'relative';
topRow.appendChild(wnBubble);
 
let hideTimer = null;
 
function placeBubble() {
  const btnRect = whatsNewBtn.getBoundingClientRect();
  const rowRect = topRow.getBoundingClientRect();
  wnBubble.style.display = 'block';
  wnBubble.style.opacity = '0';
  wnBubble.style.pointerEvents = 'none';
  requestAnimationFrame(() => {
    const bRect = wnBubble.getBoundingClientRect();
    const left = (btnRect.left + btnRect.width/2) - (bRect.width/2) - rowRect.left;
    const top  = (btnRect.top - bRect.height - 10) - rowRect.top;
    wnBubble.style.left = Math.max(0, left) + 'px';
    wnBubble.style.top  = Math.max(0, top) + 'px';
  });
}
function animateFromButton(open=true) {
  const btnRect = whatsNewBtn.getBoundingClientRect();
  const bRect = wnBubble.getBoundingClientRect();
  const originX = (btnRect.left + btnRect.width / 2) - bRect.left;
  const originY = (btnRect.top  + btnRect.height / 2) - bRect.top;
  wnBubble.style.transformOrigin = `${originX}px ${originY}px`;
  wnArrow.style.transformOrigin  = '50% 50%';
  const timing = { duration: 220, easing: 'cubic-bezier(.2,.85,.2,1)', fill: 'forwards' };
  if (open) {
    wnBubble.animate([{ opacity: 0, transform: 'scale(0.86) translateY(6px)' }, { opacity: 1, transform: 'scale(1) translateY(0px)' }], timing);
    wnArrow.animate([{ opacity: 0, transform: 'rotate(45deg) translateY(4px)' }, { opacity: 1, transform: 'rotate(45deg) translateY(0px)' }], timing);
    wnBubble.style.pointerEvents = 'auto';
  } else {
    const out = wnBubble.animate([{ opacity: 1, transform: 'scale(1) translateY(0px)' }, { opacity: 0, transform: 'scale(0.86) translateY(6px)' }], timing);
    wnArrow.animate([{ opacity: 1, transform: 'rotate(45deg) translateY(0px)' }, { opacity: 0, transform: 'rotate(45deg) translateY(4px)' }], timing);
    out.onfinish = () => {
      wnBubble.style.display = 'none';
      wnBubble.style.pointerEvents = 'none';
      wnBubble.style.opacity = '0';
      wnBubble.style.transform = 'scale(0.86) translateY(6px)';
    };
  }
}
function showBubble() { clearTimeout(hideTimer); placeBubble(); requestAnimationFrame(() => { requestAnimationFrame(() => { animateFromButton(true); }); }); }
function hideBubble() { clearTimeout(hideTimer); hideTimer = setTimeout(() => animateFromButton(false), 80); }
 
whatsNewBtn.addEventListener('mouseenter', showBubble, {passive:true});
whatsNewBtn.addEventListener('mouseleave', hideBubble, {passive:true});
wnBubble.addEventListener('mouseenter', () => clearTimeout(hideTimer), {passive:true});
wnBubble.addEventListener('mouseleave', hideBubble, {passive:true});
whatsNewBtn.addEventListener('click', (e) => {
  e.preventDefault(); e.stopPropagation();
  const hidden = (wnBubble.style.display === 'none' || wnBubble.style.display === '');
  if (hidden) { showBubble(); } else { animateFromButton(false); setTimeout(showBubble, 140); }
}, {passive:false});
whatsNewBtn.addEventListener('focus', showBubble, {passive:true});
whatsNewBtn.addEventListener('blur', hideBubble, {passive:true});
whatsNewBtn.addEventListener('keydown', (e) => { if (e.key==='Enter' || e.key === ' ') { e.preventDefault(); showBubble(); } }, {passive:false});
/* ------------------ end What's new ------------------ */
 
  const banner=document.createElement('div'); banner.className='oldyt-refresh-banner hidden'; banner.setAttribute('role','alert');
  const bText=document.createElement('span'); bText.textContent='You must refresh now to apply changes'; banner.appendChild(bText);
  const btn = document.createElement('button'); btn.className='oldyt-refresh-btn';
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  btn.textContent = isSafari ? 'Please Refresh' : 'Refresh now';
  function robustRefreshNow(){
    try{ for (const cfg of getAllToggles()) appliedSet(cfg.id, storageGet(cfg.id)); }catch(_){}
    try{ ensureMenuItemBadge(menuItemRef, menuContentRef, false); }catch(_){}
    try{ panel._detachOutsideHandlers && panel._detachOutsideHandlers(); }catch(_){}
    try{ panel._detachAutoCloseGuards && panel._detachAutoCloseGuards(); }catch(_){}
    const tries=[()=>location.reload(), ()=>{location.href=location.href;}, ()=>window.location.reload(), ()=>{window.top&&window.top.location&&window.top.location.reload();}, ()=>history.go(0)];
    (function chain(i){ try{ tries[i](); }catch(_){ if(i+1<tries.length) setTimeout(()=>chain(i+1),30); } })(0);
  }
  btn.addEventListener('click', robustRefreshNow, {passive:true});
  banner.appendChild(btn);
  topRow.appendChild(banner);
  panel.appendChild(topRow);
 
  const version = 'v0.3';
  topRow.style.position = 'relative';
  const versionTop = document.createElement('div'); versionTop.textContent = version;
  Object.assign(versionTop.style, {
    position: 'absolute', top: '0px', right: '0px', fontSize: '10.5px', fontWeight: '500',
    color: 'rgba(255,255,255,0.65)', background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
    padding: '2px 6px', borderRadius: '5px', textShadow: '0 0 2px rgba(0,0,0,0.35)', boxShadow: '0 0 6px rgba(255,255,255,0.08), 0 0 4px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(5px) saturate(120%)', WebkitBackdropFilter: 'blur(5px) saturate(120%)', pointerEvents: 'none', userSelect: 'none', zIndex: '2',
  });
  topRow.appendChild(versionTop);
 
  const list=document.createElement('div'); list.className='oldyt-list';
  const frag=document.createDocumentFragment();
  panel._pendingMap={};
 
  /* -------- ROOT toggles -------- */
  const blockForConditional = []; // collect blocks that require a toggle
  for (const block of CONFIG_BLOCKS) { if (block.requiresToggle) blockForConditional.push(block); }
 
  const rootToggles = CONFIG_TOGGLES;
  const afterToggleHooks = []; // we’ll push updateConditionalBlocks to run on certain toggles
 
  function getToggleCfgById(id){ return CONFIG_TOGGLES.find(t=>t.id===id) || null; }
 
  for (const cfg of rootToggles){
    const item=document.createElement('div'); item.className='oldyt-item';
 
    const iconWrap=document.createElement('div'); iconWrap.className='oldyt-icon';
    if(cfg.iconName) iconWrap.appendChild(makeMaterialIcon(cfg.iconName));
    else if (cfg.iconUrl){ const img=document.createElement('img'); img.src=cfg.iconUrl; img.alt=cfg.name||''; iconWrap.appendChild(img); }
    else iconWrap.appendChild(makeMaterialIcon('extension'));
    item.appendChild(iconWrap);
 
    const textcol=document.createElement('div'); textcol.className='oldyt-textcol';
    const name=document.createElement('div'); name.className='oldyt-name'; name.textContent=cfg.name||'Unnamed';
    const desc=document.createElement('div'); desc.className='oldyt-desc'; desc.textContent=cfg.desc||'';
    textcol.appendChild(name); textcol.appendChild(desc); item.appendChild(textcol);
 
    const rightcol=document.createElement('div'); rightcol.className='oldyt-rightcol';
    const toggle=document.createElement('div'); toggle.className='oldyt-toggle'; toggle.id='oldyt-toggle-'+cfg.id; toggle.setAttribute('role','switch'); toggle.setAttribute('tabindex','0');
    const knob=document.createElement('div'); knob.className='oldyt-knob'; toggle.appendChild(knob);
    rightcol.appendChild(toggle); item.appendChild(rightcol);
 
    const cur=storageGet(cfg.id);
    if(cur){ toggle.classList.add('on'); toggle.setAttribute('aria-checked','true'); } else toggle.setAttribute('aria-checked','false');
 
    const handleToggle=()=>{
      const nowOn = !toggle.classList.contains('on');
      toggle.classList.toggle('on', nowOn);
      toggle.setAttribute('aria-checked', nowOn ? 'true':'false');
      storageSet(cfg.id, nowOn);
      setAppliedIfOnlyOff(cfg, nowOn);
      if (typeof cfg.onChange==='function'){ try{ cfg.onChange(nowOn, cfg.id); }catch(_){} }
      const need = wantsRefresh(cfg, nowOn, appliedGet(cfg.id));
      panel._pendingMap[cfg.id] = need;
 
      const any = anyPendingFromMap(panel._pendingMap);
      panel._setRefreshVisible(any);
      ensureMenuItemBadge(menuItemRef, menuContentRef, any);
 
      // If a root toggle controls conditional blocks, update them
      if (cfg.id === 'skip_sponsor_segments' || cfg.id === 'revert_player') {
        for (const hook of afterToggleHooks) try{ hook(); }catch(_){}
      }
    };
 
    toggle.addEventListener('click', (e)=>{ e.stopPropagation(); handleToggle(); }, {passive:true});
    toggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); handleToggle(); } }, {passive:false});
 
    frag.appendChild(item);
  }
 
  /* -------- Normal (always-visible) blocks -------- */
  for (const block of CONFIG_BLOCKS){
    if (block.requiresToggle) continue; // handled conditionally
    const item = buildBlockMenuItem(block, popup, panelMenu, panel, menuItemRef, menuContentRef);
    frag.appendChild(item);
  }
 
  /* -------- Conditional zone (e.g., SponsorBlock Tweaks, Revert UI Tweaks) -------- */
  const conditionalZone = document.createElement('div');
  conditionalZone.style.position = 'relative';
 
  // NEW: "Visible because you have {features} enabled." title just below the blocks
  const conditionalTitle = document.createElement('div');
  conditionalTitle.className = 'oldyt-conditional-title';
  conditionalTitle.style.display = 'none';
  frag.appendChild(conditionalTitle);
  frag.appendChild(conditionalZone);
 
  // Formatting helper to bold feature names and insert commas/and correctly
  function formatBoldList(arr){
    const bold = (s)=>`<b>${s}</b>`;
    if (!arr || !arr.length) return '';
    if (arr.length === 1) return bold(arr[0]);
    if (arr.length === 2) return `${bold(arr[0])} and ${bold(arr[1])}`;
    const allButLast = arr.slice(0,-1).map(bold).join(', ');
    return `${allButLast}, and ${bold(arr[arr.length-1])}`;
  }
 
  // Animation helpers (macOS-like zoom/fade)
  function animateIn(el){
    try{
      el.style.transformOrigin = '50% 0%';
      el.animate(
        [{opacity:0, transform:'scale(0.86) translateY(6px)'},
         {opacity:1, transform:'scale(1) translateY(0px)'}],
        {duration:220, easing:'cubic-bezier(.2,.85,.2,1)', fill:'forwards'}
      );
    }catch(_){}
  }
  function animateOutAndRemove(el){
    try{
      const a = el.animate(
        [{opacity:1, transform:'scale(1) translateY(0px)'},
         {opacity:0, transform:'scale(0.86) translateY(6px)'}],
        {duration:200, easing:'cubic-bezier(.2,.85,.2,1)', fill:'forwards'}
      );
      a.onfinish = ()=>{ try{ el.remove(); }catch(_){ el.style.display='none'; } };
    }catch(_){ try{ el.remove(); }catch(_){} }
  }
 
  const conditionalMap = new Map(); // block.id -> DOM node
function updateConditionalTitle() {
  const activeFeatureNames = [];
 
  for (const block of blockForConditional) {
    if (storageGet(block.requiresToggle)) {
      const t = getToggleCfgById(block.requiresToggle);
      if (t && t.name) activeFeatureNames.push(t.name);
    }
  }
 
  // Clear previous content safely
  conditionalTitle.textContent = '';
 
  if (activeFeatureNames.length) {
    conditionalTitle.style.display = '';
 
    // Build "Visible because you have X, Y, and Z enabled." safely
    const prefix = document.createTextNode('Visible because you have ');
    conditionalTitle.appendChild(prefix);
 
    activeFeatureNames.forEach((name, i) => {
      const bold = document.createElement('b');
      bold.textContent = name;
      conditionalTitle.appendChild(bold);
 
      if (i < activeFeatureNames.length - 1) {
        const sep = document.createTextNode(
          i === activeFeatureNames.length - 2 ? ' and ' : ', '
        );
        conditionalTitle.appendChild(sep);
      }
    });
 
    const suffix = document.createTextNode(' enabled:');
    conditionalTitle.appendChild(suffix);
  } else {
    conditionalTitle.style.display = 'none';
  }
}
 
  function updateConditionalBlocks(){
    for (const block of blockForConditional){
      const shouldShow = storageGet(block.requiresToggle);
      const has = conditionalMap.get(block.id);
      if (shouldShow && !has){
        const node = buildBlockMenuItem(block, popup, panelMenu, panel, menuItemRef, menuContentRef);
        node.style.opacity='0';
        node.style.transform='scale(0.86) translateY(6px)';
        conditionalZone.appendChild(node);
        requestAnimationFrame(()=>requestAnimationFrame(()=>animateIn(node)));
        conditionalMap.set(block.id, node);
      } else if (!shouldShow && has){
        conditionalMap.delete(block.id);
        animateOutAndRemove(has);
      }
    }
    updateConditionalTitle();
  }
  afterToggleHooks.push(updateConditionalBlocks);
  // Initial render
  updateConditionalBlocks();
 
  list.appendChild(frag);
  panel.appendChild(list);
 
  // Hide/Show refresh banner & "What's new?"
  panel._setRefreshVisible = (v)=>{
    if(v){
      banner.classList.remove('hidden');
      whatsNewBtn.style.display = 'none';
      hideBubble(true);
    } else {
      banner.classList.add('hidden');
      whatsNewBtn.style.display = 'inline-flex';
    }
  };
 
  function doBack(){
    const any = anyPendingFromMap(panel._pendingMap);
    restorePanelFromPopup(popup, panel);
    ensureMenuItemBadge(menuItemRef, menuContentRef, any);
  }
  back.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); doBack(); }, {passive:false});
  back.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); doBack(); } }, {passive:false});
 
  panel._detachOutsideHandlers = null;
  panel._attachOutsideHandlers = function attach() {
    const popupEl = popup;
    const panelEl = panel;
 
    const onDown = (e) => {
      const insidePanel = isInsidePanel(panelEl, e);
      const insidePopup = isInsidePanel(popupEl, e);
      if (insidePanel) return;
      if (insidePopup) { doBack(); } else { doBack(); }
    };
    const onFocusIn = (e) => {
      const insidePanel = isInsidePanel(panelEl, e);
      const insidePopup = isInsidePanel(popupEl, e);
      if (insidePanel) return;
      if (insidePopup) { doBack(); } else { doBack(); }
    };
    const onKeyDown = (e) => { if (e.key === 'Escape') doBack(); };
 
    function detach() {
      const cap = true;
      if (window.PointerEvent) document.removeEventListener('pointerdown', onDown, cap);
      document.removeEventListener('mousedown', onDown, cap);
      document.removeEventListener('touchstart', onDown, cap);
      document.removeEventListener('focusin', onFocusIn, cap);
      document.removeEventListener('keydown', onKeyDown, cap);
    }
 
    const cap = true;
    if (window.PointerEvent) document.addEventListener('pointerdown', onDown, {capture:cap, passive:true});
    document.addEventListener('mousedown', onDown, {capture:cap, passive:true});
    document.addEventListener('touchstart', onDown, {capture:cap, passive:true});
    document.addEventListener('focusin', onFocusIn, cap);
    document.addEventListener('keydown', onKeyDown, {capture:cap, passive:true});
 
    panel._detachOutsideHandlers = detach;
  };
 
  panel._attachAutoCloseGuards = function attachAuto() {
    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    let scrollTick = null;
    let io = null;
 
    const close = () => doBack();
 
    const maybeClose = () => {
      if (!document.contains(panel)) return;
      const ok = isMostlyInViewport(popup) && isMostlyInViewport(player || popup);
      if (!ok) close();
    };
 
    const onScroll = () => {
      if (scrollTick) return;
      scrollTick = requestAnimationFrame(() => { scrollTick = null; maybeClose(); });
    };
    window.addEventListener('scroll', onScroll, {passive:true, capture:true});
    window.addEventListener('resize', onScroll, {passive:true, capture:true});
 
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        const vis = entries.some(e => e.isIntersecting);
        if (!vis) close();
      }, { threshold: 0.01 });
      try { io.observe(popup); } catch(_){}
      if (player) { try { io.observe(player); } catch(_){} }
    }
 
    const onNavStart = () => close();
    const onFs = () => close();
    window.addEventListener('yt-navigate-start', onNavStart, true);
    document.addEventListener('fullscreenchange', onFs, true);
 
    // Also close if the player element drifts (layout shift)
    let baseRect = (player || popup).getBoundingClientRect();
    const driftCheck = setInterval(() => {
      if (!document.contains(panel)) { clearInterval(driftCheck); return; }
      const now = (player || popup).getBoundingClientRect();
      const drift = Math.abs(now.top - baseRect.top) + Math.abs(now.left - baseRect.left);
      if (drift > 32) { clearInterval(driftCheck); close(); }
    }, 600);
 
    panel._detachAutoCloseGuards = function detachAuto() {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll, true);
      window.removeEventListener('yt-navigate-start', onNavStart, true);
      document.removeEventListener('fullscreenchange', onFs, true);
      if (io) try { io.disconnect(); } catch(_){}
      io = null;
      clearInterval(driftCheck);
      if (scrollTick) cancelAnimationFrame(scrollTick);
      scrollTick = null;
    };
  };
 
  panel._pendingMap = computePendingMap();
  panel._setRefreshVisible(anyPendingFromMap(panel._pendingMap));
 
  return panel;
}
 
/* ===== menu injection + panel switching ===== */
function injectIntoPopup(popup){
  try{
    if(!popup || !(popup instanceof HTMLElement)) return;
    const panelMenu = popup.querySelector('.ytp-panel-menu') || popup.querySelector('.ytp-panel');
    if(!panelMenu) return;
    if(panelMenu.querySelector('.oldyt-menuitem')) return;
 
    injectStyles();
 
    const menuItem=document.createElement('div'); menuItem.className='ytp-menuitem oldyt-menuitem';
    menuItem.setAttribute('role','menuitem'); menuItem.setAttribute('tabindex','0'); menuItem.setAttribute('aria-haspopup','true');
 
    const iconDiv=document.createElement('div'); iconDiv.className='ytp-menuitem-icon';
    iconDiv.appendChild(makeMaterialIcon('settings')); menuItem.appendChild(iconDiv);
 
    const labelDiv=document.createElement('div'); labelDiv.className='ytp-menuitem-label'; labelDiv.textContent='Player tweaks'; menuItem.appendChild(labelDiv);
 
    const contentDiv=document.createElement('div'); contentDiv.className='ytp-menuitem-content';
    const tip=document.createElement('div'); tip.style.opacity='0.9'; tip.textContent='More';
    contentDiv.appendChild(tip); menuItem.appendChild(contentDiv);
 
    panelMenu.insertBefore(menuItem, panelMenu.firstChild || null);
 
    const nestedPanel = buildNestedPanel(popup, panelMenu, menuItem, contentDiv);
 
    const openHandler = (ev)=>{
      if (ev){ ev.preventDefault && ev.preventDefault(); ev.stopPropagation && ev.stopPropagation(); }
      nestedPanel._pendingMap = computePendingMap();
      nestedPanel._setRefreshVisible(anyPendingFromMap(nestedPanel._pendingMap));
      ensureMenuItemBadge(menuItem, contentDiv, anyPendingFromMap(nestedPanel._pendingMap));
      openNestedInPopup(popup, panelMenu, nestedPanel);
      ensureMenuItemBadge(menuItem, contentDiv, false);
      nestedPanel._attachOutsideHandlers && nestedPanel._attachOutsideHandlers();
      nestedPanel._attachAutoCloseGuards && nestedPanel._attachAutoCloseGuards();
    };
 
    menuItem.addEventListener('click', openHandler, {passive:false});
    menuItem.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openHandler(e); } }, {passive:false});
 
    const popupObserver = new MutationObserver(()=>{
      try{
        if(!document.contains(popup) || (popup.style && popup.style.display==='none')){
          safeRestorePanel(panelMenu);
          const pend = computePendingMap(); ensureMenuItemBadge(menuItem, contentDiv, anyPendingFromMap(pend));
          popupObserver.disconnect();
        }
      }catch(_){}
    });
    popupObserver.observe(popup, { attributes:true, childList:true, subtree:false });
 
    const menuObserver = new MutationObserver(()=>{
      if(!panelMenu.contains(menuItem)){ menuObserver.disconnect(); setTimeout(()=>injectIntoPopup(popup), 120); }
    });
    menuObserver.observe(panelMenu, { childList:true, subtree:false });
 
    panelMenu._oldytInjected = { menuItem, nestedPanel, popupObserver, menuObserver };
  }catch(_) {}
}
 
function openNestedInPopup(_popup, panelMenu, newPanel){
  try{
    const current = panelMenu.querySelector('.oldyt-panel');
    if (current && current !== newPanel){
      if (current._detachOutsideHandlers) { try{ current._detachOutsideHandlers(); }catch(_){} }
      if (current._detachAutoCloseGuards) { try{ current._detachAutoCloseGuards(); }catch(_){} }
      try{ panelMenu.removeChild(current); }catch(_){}
    }
 
    Array.from(panelMenu.children).forEach(ch => {
      if (ch !== newPanel) { try { ch.style.display = 'none'; } catch(_){} }
    });
 
    if (!panelMenu.contains(newPanel)) panelMenu.appendChild(newPanel);
    panelMenu._oldytOpen = true;
 
    newPanel._attachOutsideHandlers && newPanel._attachOutsideHandlers();
    newPanel._attachAutoCloseGuards && newPanel._attachAutoCloseGuards();
  }catch(_){}
}
 
function restorePanelFromPopup(popup, _nestedPanel){
  const panelMenu = popup.querySelector('.ytp-panel-menu') || popup.querySelector('.ytp-panel');
  if(!panelMenu) return;
  safeRestorePanel(panelMenu);
}
 
function safeRestorePanel(panelMenu){
  if(!panelMenu) return;
  const nested = panelMenu.querySelector('.oldyt-panel');
  if (nested){
    if (nested._detachOutsideHandlers) { try{ nested._detachOutsideHandlers(); }catch(_){} }
    if (nested._detachAutoCloseGuards) { try{ nested._detachAutoCloseGuards(); }catch(_){} }
    try{ panelMenu.removeChild(nested); }catch(_) {}
  }
  const ch = panelMenu.children;
  for (let i=0;i<ch.length;i++){ try{ ch[i].style.display=''; }catch(_){} }
  panelMenu._oldytOpen = false;
}
 
/* ==================== GLOBAL INJECTION OBSERVER ===================== */
const processedPopups = new WeakSet();
 
function scanAndInjectAll(){
  injectStyles();
  const list = document.querySelectorAll('.ytp-popup.ytp-settings-menu');
  for (let i=0;i<list.length;i++){
    const p = list[i];
    if (!processedPopups.has(p)) {
      injectIntoPopup(p);
      processedPopups.add(p);
    }
  }
}
function startObserver(){
  setTimeout(scanAndInjectAll, 300);
  const mo=new MutationObserver((muts)=>{
    for (let i=0;i<muts.length;i++){
      const m = muts[i];
      for (let j=0;j<m.addedNodes.length;j++){
        const n = m.addedNodes[j];
        if(!(n && n.nodeType===1)) continue;
        const el = n;
        if (el.matches && el.matches('.ytp-popup.ytp-settings-menu')) {
          if (!processedPopups.has(el)) { injectIntoPopup(el); processedPopups.add(el); }
        } else if (el.querySelector) {
          const found = el.querySelectorAll('.ytp-popup.ytp-settings-menu');
          for (let k=0;k<found.length;k++){
            const p = found[k];
            if (!processedPopups.has(p)) { injectIntoPopup(p); processedPopups.add(p); }
          }
        }
      }
    }
  });
  mo.observe(document.documentElement, { childList:true, subtree:true });
  setInterval(scanAndInjectAll, 3000);
}
startObserver();
 
/* ==================== Little one-time intro glow ==================== */
(function() {
  const LS_KEY = 'oldytp_firstTime';
  if (localStorage.getItem(LS_KEY)) return;
 
  function waitForElement(selector, timeout = 10000) {
    return new Promise(resolve => {
      const tryStart = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (!document.body) return requestAnimationFrame(tryStart);
 
        const obs = new MutationObserver(() => {
          const found = document.querySelector(selector);
          if (found) { obs.disconnect(); resolve(found); }
        });
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
      };
      tryStart();
    });
  }
 
  async function runIntro() {
    const settingsBtn = await waitForElement('.ytp-settings-button');
    if (!settingsBtn) return;
 
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999998;
      background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(0,186,255,0.2) 40%, rgba(0,186,255,0) 70%);
      filter: blur(12px);
      transform: scale(1);
      animation: ps5Glow 1.4s infinite alternate ease-in-out;
    `;
    document.body.appendChild(glow);
 
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ps5Glow {
        0% { transform: scale(0.85); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
 
    let stopAnimation = false;
    function updateGlow() {
      if (stopAnimation) return;
      const rect = settingsBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      glow.style.left = rect.left + rect.width / 2 - size / 2 + 'px';
      glow.style.top = rect.top + rect.height / 2 - size / 2 + 'px';
      glow.style.width = glow.style.height = size + 'px';
      requestAnimationFrame(updateGlow);
    }
    updateGlow();
 
    settingsBtn.addEventListener('click', () => {
      stopAnimation = true;
      glow.remove();
      style.remove();
      localStorage.setItem(LS_KEY, 'true');
    }, { once: true });
  }
 
  runIntro();
})();
ensureSbCategoryDefaults();
  } catch(err){ console.error('[OldYTPlayer] top-level error (Youtube may have updated.)', err); }
})();