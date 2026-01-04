// ==UserScript==
// @name         YouTube - Late 2022 - Early 2023 non-rounded design
// @version      2023.06.17
// @description  This script disables YouTube's new rounded design but keeps Shorts, rounded searchbox, and new replies UI. This is the last version of the non-rounded design before it was removed in February 2023.
// @author       Alpharetzy
// @license MIT
// @match        https://www.youtube.com/*
// @namespace    example.com
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/468869/YouTube%20-%20Late%202022%20-%20Early%202023%20non-rounded%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/468869/YouTube%20-%20Late%202022%20-%20Early%202023%20non-rounded%20design.meta.js
// ==/UserScript==

// Attributes to remove from <html>
const ATTRS = [
    "darker-dark-theme",
    "darker-dark-theme-deprecate"
];

// Regular config keys.
const CONFIGS = {
    BUTTON_REWORK: false
}

// Experiment flags.
const EXPFLAGS = {
    enable_header_channel_handler_ui: false,
    kevlar_unavailable_video_error_ui_client: false,
    kevlar_refresh_on_theme_change: false,
    kevlar_watch_cinematics: false,
    kevlar_watch_metadata_refresh: false,
    kevlar_watch_modern_metapanel: false,
    web_amsterdam_playlists: false,
    web_animated_like: false,
    web_button_rework: false,
    web_button_rework_with_live: false,
    web_darker_dark_theme: false,
    web_filled_subscribed_button: false,
    web_guide_ui_refresh: false,
    web_modern_ads: false,
    web_modern_buttons: false,
    web_modern_chips: false,
    web_modern_dialogs: false,
    web_modern_playlists: false,
    web_modern_subscribe: false,
    web_rounded_containers: false,
    web_rounded_thumbnails: false,
    web_searchbar_style: "default",
    web_segmented_like_dislike_button: false,
    web_sheets_ui_refresh: false,
    web_snackbar_ui_refresh: false
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

// Fix for like and dislike ratio (Return YouTube Dislike is required)
function $(q) {
    return document.querySelector(q);
}
 
addEventListener('yt-page-data-updated', function() {
    if(!location.pathname.startsWith('/watch')) return;
    
    var lds = $('ytd-video-primary-info-renderer div#top-level-buttons-computed');
    var like = $('ytd-video-primary-info-renderer div#segmented-like-button > ytd-toggle-button-renderer');
    var share = $('ytd-video-primary-info-renderer div#top-level-buttons-computed > ytd-segmented-like-dislike-button-renderer + ytd-button-renderer');
    
    lds.insertBefore(like, share);
    
    like.setAttribute('class', like.getAttribute('class').replace('ytd-segmented-like-dislike-button-renderer', 'ytd-menu-renderer force-icon-button'));
    like.removeAttribute('is-paper-button-with-icon');
    like.removeAttribute('is-paper-button');
    like.setAttribute('style-action-button', '');
    like.setAttribute('is-icon-button', '');
    like.querySelector('a').insertBefore(like.querySelector('yt-formatted-string'), like.querySelector('tp-yt-paper-tooltip'));
    try { like.querySelector('paper-ripple').remove(); } catch(e) {}
    var paper = like.querySelector('tp-yt-paper-button');
    paper.removeAttribute('style-target');
    paper.removeAttribute('animated');
    paper.removeAttribute('elevation');
    like.querySelector('a').insertBefore(paper.querySelector('yt-icon'), like.querySelector('yt-formatted-string'));
    paper.outerHTML = paper.outerHTML.replace('<tp-yt-paper-button ', '<yt-icon-button ').replace('</tp-yt-paper-button>', '</yt-icon-button>');
    paper = like.querySelector('yt-icon-button');
    paper.querySelector('button#button').appendChild(like.querySelector('yt-icon'));
    
    var dislike = $('ytd-video-primary-info-renderer div#segmented-dislike-button > ytd-toggle-button-renderer');
    lds.insertBefore(dislike, share);
    $('ytd-video-primary-info-renderer ytd-segmented-like-dislike-button-renderer').remove();
    dislike.setAttribute('class', dislike.getAttribute('class').replace('ytd-segmented-like-dislike-button-renderer', 'ytd-menu-renderer force-icon-button'));
    dislike.removeAttribute('has-no-text');
    dislike.setAttribute('style-action-button', '');
    var dlabel = document.createElement('yt-formatted-stringx');
    dlabel.setAttribute('id', 'text');
    if(dislike.getAttribute('class').includes('style-default-active'))
        dlabel.setAttribute('class', dlabel.getAttribute('class').replace('style-default', 'style-default-active'));
    dislike.querySelector('a').insertBefore(dlabel, dislike.querySelector('tp-yt-paper-tooltip'));
    
    $('ytd-video-primary-info-renderer').removeAttribute('flex-menu-enabled');
});

// CSS adjustments and UI fixes (both userstyles are required) + Remove "Video paused. Continue watching?" popup
(function() {
ApplyCSS();
function ApplyCSS() {
var styles = document.createElement("style");
styles.innerHTML=`
ytd-masthead {
  background: var(--yt-spec-brand-background-solid) !important;
}

ytd-app {
  background: var(--yt-spec-general-background-a) !important;
}

ytd-browse[page-subtype="channels"] {
  background: var(--yt-spec-general-background-b) !important;
}

ytd-c4-tabbed-header-renderer {
  --yt-lightsource-section1-color: var(--yt-spec-general-background-a) !important;
}

#container.ytd-searchbox {
  background-color: var(--ytd-searchbox-background) !important;
  color: var(--ytd-searchbox-text-color) !important;
}

#guide-content.ytd-app {
  background: var(--yt-spec-brand-background-solid) !important;
}

ytd-guide-entry-renderer[guide-refresh] {
  width: 100% !important;
  border-radius: 0px !important;
}

ytd-mini-guide-renderer {
  background-color: var(--yt-spec-brand-background-solid) !important;
}

ytd-mini-guide-entry-renderer {
  background-color: var(--yt-spec-brand-background-solid) !important;
  border-radius: 0 !important;
}

ytd-guide-section-renderer.style-scope.ytd-guide-renderer {
  padding-left: 0px !important;
}

ytd-mini-guide-renderer[guide-refresh] {
  padding: 0 !important;
}

ytd-guide-entry-renderer[active] {
  border-radius: 0px !important;
}

.style-scope.ytd-guide-entry-renderer:hover {
  border-radius: 0 !important;
}

tp-yt-paper-item.style-scope.ytd-guide-entry-renderer {
  border-radius: 0px !important;
  padding-left: 24px !important;
}

#guide-section-title.ytd-guide-section-renderer {
  color: var(--yt-spec-text-secondary) !important;
  padding: 8px 24px !important;
  font-size: var(--ytd-tab-system-font-size) !important;
  font-weight: var(--ytd-tab-system-font-weight) !important;
  letter-spacing: var(--ytd-tab-system-letter-spacing) !important;
  text-transform: var(--ytd-tab-system-text-transform) !important;
}

yt-chip-cloud-chip-renderer {
  height: 32px !important;
  border: 1px solid var(--yt-spec-10-percent-layer) !important;
  border-radius: 16px !important;
  box-sizing: border-box !important;
}

[page-subtype="home"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
  background-color: var(--yt-spec-brand-background-primary) !important;
  border-top: 1px solid var(--yt-spec-10-percent-layer) !important;
  border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important;
}

ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer::after {
  background: linear-gradient(to right, var(--yt-spec-brand-background-primary) 20%, rgba(33, 33, 33, 0) 80%) !important;
}

ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer::before {
  background: linear-gradient(to left, var(--yt-spec-brand-background-primary) 20%, rgba(33, 33, 33, 0) 80%) !important;
}

ytd-feed-filter-chip-bar-renderer #left-arrow-button.ytd-feed-filter-chip-bar-renderer,
ytd-feed-filter-chip-bar-renderer #right-arrow-button.ytd-feed-filter-chip-bar-renderer {
  background-color: var(--yt-spec-brand-background-primary) !important;
}

yt-chip-cloud-renderer[is-dark-theme] #right-arrow.yt-chip-cloud-renderer::before {
  background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important;
}

yt-chip-cloud-renderer #left-arrow-button.yt-chip-cloud-renderer,
yt-chip-cloud-renderer #right-arrow-button.yt-chip-cloud-renderer {
  background: var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) !important;
}

yt-chip-cloud-renderer[is-dark-theme] #left-arrow.yt-chip-cloud-renderer::after {
  background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important;
}

yt-chip-cloud-renderer #left-arrow.yt-chip-cloud-renderer::after {
  background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important;
}

yt-chip-cloud-renderer #right-arrow.yt-chip-cloud-renderer::before {
  background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important;
}

ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_HASHTAG_LANDING_PAGE"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
  background-color: var(--yt-spec-general-background-b) !important;
}

.style-scope.ytd-rich-item-renderer {
  border-radius: 2px !important;
}

.style-scope.ytd-item-section-renderer {
  border-radius: 0px !important;
}

#tooltip.tp-yt-paper-tooltip {
  border-radius: 2px !important;
}

.style-scope.ytd-topic-link-renderer {
  border-radius: 2px !important;
}

.bold.style-scope.yt-formatted-string {
  font-family: Roboto !important;
}

.style-scope.yt-formatted-string {
  font-family: Roboto !important;
}

#bar {
  border-radius: 2px !important;
}

ytd-multi-page-menu-renderer {
  border-radius: 0px !important;
  border: 1px solid var(--yt-spec-10-percent-layer) !important;
  border-top: none !important;
  box-shadow: none !important;
}

yt-dropdown-menu {
  --paper-menu-button-content-border-radius:  2px !important;
}

ytd-menu-popup-renderer {
  border-radius: 2px !important;
}

.style-scope.ytd-shared-post-renderer {
  border-radius: 0px !important;
}

div#dismissed.style-scope.ytd-compact-video-renderer {
  border-radius: 0px !important;
}

.style-scope.ytd-feed-nudge-renderer {
  border-radius: 2px !important;
}

tp-yt-paper-button#button.style-scope.ytd-button-renderer.style-inactive-outline.size-default {
  border-radius: 2px !important;
}

div#dismissed.style-scope.ytd-rich-grid-media {
  border-radius: 0px !important;
}

ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail {
  border-radius: 2px !important;
}

ytd-compact-link-renderer.ytd-settings-sidebar-renderer {
  margin: 0px !important;
  border-radius: 0px !important;
}

img#img.style-scope.yt-image-shadow {
  border-radius: 50px !important;
}

#title.style-scope.ytd-feed-nudge-renderer {
  font-family: Roboto !important;
}

yt-chip-cloud-chip-renderer.style-scope.ytd-feed-nudge-renderer {
  border-radius: 50px !important;
}

#meta #avatar {
  width: 48px;
  height: 48px;
  margin-right: 16px;
}

#meta #avatar img {
  width: 100%;
}

#channel-name.ytd-video-owner-renderer {
  font-size: 1.4rem !important;
}

#info.ytd-video-primary-info-renderer {
  height: 40px !important;
}

div#clarify-box.attached-message.style-scope.ytd-watch-flexy {
  margin-top: 0px !important;
}

ytd-clarification-renderer.style-scope.ytd-item-section-renderer {
  border: 1px solid !important;
  border-color: #0000001a !important;
  border-radius: 0px !important;
}

ytd-clarification-renderer.style-scope.ytd-watch-flexy {
  border: 1px solid !important;
  border-color: #0000001a !important;
  border-radius: 0px !important;
}

yt-formatted-string.description.style-scope.ytd-clarification-renderer {
  font-size: 1.4rem !important;
}

div.content-title.style-scope.ytd-clarification-renderer {
  padding-bottom: 4px !important;
}

ytd-rich-metadata-renderer[rounded] {
  border-radius: 0px !important;
}

ytd-live-chat-frame[rounded-container] {
  border-radius: 0px !important;
}

ytd-live-chat-frame[rounded-container] #show-hide-button.ytd-live-chat-frame ytd-toggle-button-renderer.ytd-live-chat-frame {
  border-radius: 0px !important;
}

iframe.style-scope.ytd-live-chat-frame {
  border-radius: 0px !important;
}

ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
  border-radius: 0px !important;
}

ytd-playlist-panel-renderer[modern-panels]:not([hide-header-text]) .title.ytd-playlist-panel-renderer {
  font-family: Roboto !important;
  font-size: 1.4rem !important;
  line-height: 2rem !important;
  font-weight: 500 !important;
}

ytd-tvfilm-offer-module-renderer[modern-panels] {
  border-radius: 0px !important;
}

ytd-tvfilm-offer-module-renderer[modern-panels] #header.ytd-tvfilm-offer-module-renderer {
  border-radius: 0px !important;
  font-family: Roboto !important;
  font-size: 1.6rem !important;
  line-height: 2.2rem !important;
  font-weight: 400 !important;
}

ytd-donation-shelf-renderer.style-scope.ytd-watch-flexy {
  border-radius: 0px !important;
}

ytd-donation-shelf-renderer[modern-panels] #header-text.ytd-donation-shelf-renderer {
  font-family: Roboto !important;
  font-size: 1.6rem !important;
  font-weight: 500 !important;
}

ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer {
  border-radius: 0px !important;
}

ytd-universal-watch-card-renderer[rounded] #header.ytd-universal-watch-card-renderer {
  border-radius: 0px !important;
}

ytd-universal-watch-card-renderer[rounded] #hero.ytd-universal-watch-card-renderer {
  border-radius: 0px !important;
}

#title.ytd-settings-sidebar-renderer {
  font-family: Roboto !important;
  font-weight: 400 !important;
}

ytd-compact-link-renderer.ytd-settings-sidebar-renderer {
  margin: 0px !omportant;
  border-radius: 0 !important;
}

ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar][active] {
  border-radius: 0 !important;
}

#channel-container.ytd-c4-tabbed-header-renderer {
  height: 100px !important;
}

#contentContainer.tp-yt-app-header-layout {
  padding-top: 353px !important;
}

#channel-header-container.ytd-c4-tabbed-header-renderer {
  padding-top: 0 !important;
}

ytd-c4-tabbed-header-renderer[use-modern-style] #channel-name.ytd-c4-tabbed-header-renderer {
  margin-bottom: 0px !important;
}

ytd-c4-tabbed-header-renderer[use-modern-style] #avatar-editor.ytd-c4-tabbed-header-renderer {
  --ytd-channel-avatar-editor-size: 80px !important;
}

#avatar.ytd-c4-tabbed-header-renderer {
  width: 80px !important;
  height: 80px !important;
  margin: 0 24px 0 0 !important;
  flex: none !important;
  border-radius: 50% !important;
  background-color: transparent !important;
  overflow: hidden !important;
}

#wrapper > .ytd-channel-tagline-renderer.style-scope,#videos-count {
  display: none !important;
}

/* Remove rounded corners from the video player (Thanks to oldbutgoldyt for the code) */
.ytp-ad-player-overlay-flyout-cta-rounded {
border-radius: 2px !important;
}

.ytp-flyout-cta .ytp-flyout-cta-action-button.ytp-flyout-cta-action-button-rounded {
font-family: Arial !important;
background: #167ac6 !important;
border: solid 1px transparent !important;
border-color: #167ac6 !important;
border-radius: 2px !important;
box-shadow: 0 1px 0 rgba(0,0,0,.05) !important;
font-size: 11px !important;
font-weight: 500 !important;
height: 28px !important;
margin: 0 8px 0 0 !important;
max-width: 140px !important;
padding: 0 10px !important;
}

.ytp-ad-action-interstitial-action-button.ytp-ad-action-interstitial-action-button-rounded {
background-color: #167ac6 !important;
border: none !important;
border-radius: 2px;
font-family: Arial !important;
font-size: 23px !important;
height: 46px !important;
line-height: 46px !important;
min-width: 164px !important;
padding: 0 20px !important;
}

.ytp-settings-menu {
border-radius: 2px !important;
}

.ytp-sb-subscribe {
border-radius: 2px !important;
background-color: #f00 !important;
color: #fff !important;
text-transform: uppercase !important;
}

.ytp-sb-unsubscribe {
border-radius: 2px !important;
background-color: #eee !important;
color: #606060 !important;
text-transform: uppercase !important;
}

.ytp-sb-subscribe.ytp-sb-disabled {
background-color: #f3908b !important;
}

.branding-context-container-inner.ytp-rounded-branding-context {
border-radius: 2px !important;
}

.ytp-tooltip.ytp-rounded-tooltip:not(.ytp-preview) .ytp-tooltip-text {
border-radius: 2px !important;
}

.ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-button-rounded {
border-radius: 2px !important;
}

.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-overlay-image img, .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-text-overlay, .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-enhanced-overlay {
border-radius: 0 !important;
}

.ytp-videowall-still-image {
border-radius: 0 !important;
}

div.iv-card.iv-card-video.ytp-rounded-info {
border-radius: 0 !important;
}

div.iv-card.iv-card-playlist.ytp-rounded-info {
border-radius: 0 !important;
}

div.iv-card.iv-card-channel.ytp-rounded-info {
border-radius: 0 !important;
}

div.iv-card.ytp-rounded-info {
border-radius: 0 !important;
}

.ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview, .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg {
border-radius: 2px !important;
}

.ytp-ce-video.ytp-ce-medium-round, .ytp-ce-playlist.ytp-ce-medium-round, .ytp-ce-medium-round .ytp-ce-expanding-overlay-background {
border-radius: 0 !important;
}

.ytp-autonav-endscreen-upnext-thumbnail {
border-radius: 0 !important;
}

@font-face {
font-family: no-parens;
src: url("data:application/x-font-woff;base64,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");;
unicode-range: U+0028, U+0029;
}

span.ytp-menu-label-secondary {
font-family: "no-parens", "Roboto", sans-serif;
}

.ytp-swatch-color-white {
color: #f00 !important;
}

.iv-card {
border-radius: 0 !important;
}

.iv-branding .branding-context-container-inner {
border-radius: 2px !important;
}

.ytp-offline-slate-bar {
border-radius: 2px !important;
}

.ytp-offline-slate-button {
border-radius: 2px !important;
}

.ytp-ce-video.ytp-ce-large-round, .ytp-ce-playlist.ytp-ce-large-round, .ytp-ce-large-round .ytp-ce-expanding-overlay-background {
border-radius: 0 !important;
}

.ytp-flyout-cta .ytp-flyout-cta-icon.ytp-flyout-cta-icon-rounded {
border-radius: 0 !important;
}

.ytp-player-minimized .html5-main-video, .ytp-player-minimized .ytp-miniplayer-scrim, .ytp-player-minimized.html5-video-player {
border-radius: 0 !important;
}

ytd-miniplayer #player-container.ytd-miniplayer, ytd-miniplayer #video-container.ytd-miniplayer .video.ytd-miniplayer, ytd-miniplayer #card.ytd-miniplayer, ytd-miniplayer {
border-radius: 0 !important;
}

#player.ytd-channel-video-player-renderer {
border-radius: 0 !important;
}

#player.ytd-channel-video-player-renderer .ytp-small-mode .ytp-chrome-bottom {
height: 36px !important;
}

ytd-video-masthead-ad-primary-video-renderer[rounded] #player-container.ytd-video-masthead-ad-primary-video-renderer {
border-radius: 0 !important;
}

/* Subscribe button fix when you are logged in */
#buttons.ytd-c4-tabbed-header-renderer {
flex-direction: row-reverse !important;
}

yt-button-shape.style-scope.ytd-subscribe-button-renderer {
display: flex !important;
}

#subscribe-button ytd-subscribe-button-renderer button {
height: 37px !important;
letter-spacing: 0.5px !important;
border-radius: 2px !important;
text-transform: uppercase !important;
}

.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
color: #fff !important;
background: #c00 !important;
border-radius: 2px !important;
text-transform: uppercase !important;
letter-spacing: 0.5px !important;
}

button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m {
height: 37px !important;
letter-spacing: 0.5px !important;
border-radius: 2px !important;
text-transform: uppercase !important;
}

button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-s {
height: 25px !important;
letter-spacing: 0.5px !important;
border-radius: 2px !important;
text-transform: uppercase !important;
}

div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m {
background-color: transparent !important;
border-radius: 16px !important;
padding-left: 14px !important;
padding-right: 2px !important;
margin-left: 4px !important;
}

div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.cbox.yt-spec-button-shape-next--button-text-content {
display: none !important;
}

div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.yt-spec-button-shape-next__secondary-icon {
display: none !important;
}

yt-smartimation.ytd-subscribe-button-renderer {
display: flex !important;
}`
document.head.appendChild(styles);
}
})();