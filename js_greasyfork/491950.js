// ==UserScript==
// @name         YouTube - Permanently disable the 'darker-dark-theme' feature
// @version      2025.09.29
// @description  This userscript will permanently get rid of the web_darker_dark_theme flag when it was first introduced back in March 2022 before this flag has been patched since May 2023 in a favor of CSS. This will also disables most of the rounded corners too except for the searchbox.
// @author       LegendCraftMC
// @icon         https://www.youtube.com/favicon.ico
// @namespace    https://greasyfork.org/en/users/933798
// @license      MIT
// @match        https://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/491950/YouTube%20-%20Permanently%20disable%20the%20%27darker-dark-theme%27%20feature.user.js
// @updateURL https://update.greasyfork.org/scripts/491950/YouTube%20-%20Permanently%20disable%20the%20%27darker-dark-theme%27%20feature.meta.js
// ==/UserScript==

// Attributes to remove from <html>
const ATTRS = [
    "darker-dark-theme",
    "darker-dark-theme-deprecate"
];

// Regular config keys.
const CONFIGS = {
};

// Experiment flags.
const EXPFLAGS = {
    // Disable both 'darker_dark_theme' and 'amsterdam_playlists' (both flags have been patched since Q2 and Q4 '23)
    web_darker_dark_theme: false,
    web_amsterdam_playlists: false,
    // Disable the refresh on theme change (this flag has been patched since Q2 '23)
    kevlar_refresh_on_theme_change: false,
    // Remove the ambient mode if you are on both dark theme (and theater mode)
    kevlar_watch_cinematics: false
};

// Player flags
// !!! USE STRINGS FOR VALUES !!!
// For example: "true" instead of true
const PLYRFLAGS = {
};

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

(function() {
let css = `
html[dark] { --yt-spec-general-background-a: #181818 !important; --yt-spec-general-background-b: #0f0f0f !important; --yt-spec-brand-background-primary: rgba(33, 33, 33, 0.98) !important; --yt-spec-10-percent-layer: rgba(255, 255, 255, 0.1) !important }
html:not([dark]) { --yt-spec-general-background-a: #f9f9f9 !important; --yt-spec-general-background-b: #f1f1f1 !important; --yt-spec-brand-background-primary: rgba(255, 255, 255, 0.98) !important; --yt-spec-10-percent-layer: rgba(0, 0, 0, 0.1) !important }

/* Removes ambient mode if dark theme was enabled */
#cinematics.ytd-watch-flexy { display: none !important }

/* Button improvements (including edit and sponsor buttons, along with the red 'Subscribe' button) */
#voice-search-button.ytd-masthead { background-color: var(--yt-spec-general-background-a) !important; margin-left: 4px !important }
#edit-buttons > ytd-button-renderer > yt-button-shape > a { color: var(--yt-spec-text-primary-inverse) !important; background-color: var(--yt-spec-call-to-action) !important }
div#sponsor-button.style-scope.ytd-video-owner-renderer > ytd-button-renderer.style-scope.ytd-video-owner-renderer > yt-button-shape > .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline { background-color: var(--yt-spec-badge-chip-background) !important; border: none !important; color: var(--yt-spec-text-primary) !important }
div#sponsor-button.style-scope.ytd-c4-tabbed-header-renderer > ytd-button-renderer.style-scope.ytd-c4-tabbed-header-renderer > yt-button-shape > .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline { background-color: var(--yt-spec-badge-chip-background) !important; border: none !important; color: var(--yt-spec-text-primary) !important }
button.yt-spec-button-shape-next.yt-spec-button-shape-next--outline.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m[aria-label="Join this channel"] { background-color: var(--yt-spec-badge-chip-background) !important; border: none !important; color: var(--yt-spec-text-primary) !important }
#subscribe-button-shape .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled { background-color: #c00 !important }
lottie-component.smartimation__border-gradient.lottie-component, smartimation__background-lottie lottie-component, .smartimation__border { display: none !important }
.smartimation--active-border .smartimation__overlay { opacity: 0; z-index: 0 }

/* Apply the old colored theme and chips bar */
ytd-masthead { background: var(--yt-spec-brand-background-solid) !important }
ytd-app { background: var(--yt-spec-general-background-a) !important }
ytd-browse[page-subtype="channels"] { background: var(--yt-spec-general-background-b) !important }
ytd-c4-tabbed-header-renderer { --yt-lightsource-section1-color: var(--yt-spec-general-background-a) !important }
#page-header.ytd-tabbed-page-header, #tabs-inner-container.ytd-tabbed-page-header { background: var(--yt-spec-general-background-a) !important }
#tabs-divider.ytd-c4-tabbed-header-renderer, #tabs-divider.ytd-tabbed-page-header { border-bottom: 0 !important }
ytd-mini-guide-renderer, ytd-mini-guide-entry-renderer { background-color: var(--yt-spec-brand-background-solid) !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope, #guide-content.ytd-app { background-color: var(--yt-spec-brand-background-solid) !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope:hover { background-color: var(--yt-spec-general-background-b) !important }
#header.ytd-rich-grid-renderer { width: 100% !important }
ytd-guide-entry-renderer { background-color: var(--yt-spec-brand-background-solid) !important }
ytd-guide-entry-renderer:hover { background-color: var(--yt-spec-general-background-b) !important }
html[dark] ytd-guide-entry-renderer[active] { background-color: #272727 !important }
html:not([dark]) ytd-guide-entry-renderer[active] { background-color: #f2f2f2 !important }
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
div#end.style-scope.ytd-masthead .yt-spec-icon-badge-shape--style-overlay.yt-spec-icon-badge-shape--type-cart-refresh .yt-spec-icon-badge-shape__badge { color: #fff !important }
ytd-feed-filter-chip-bar-renderer[frosted-glass] ytd-button-renderer.ytd-feed-filter-chip-bar-renderer { background-color: transparent !important }
ytd-masthead[frosted-glass=with-chipbar] #background.ytd-masthead, ytd-masthead[frosted-glass=without-chipbar] #background.ytd-masthead { backdrop-filter: none !important }

/* Disable the amsterdam playlists UI */
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

/* Remove most rounded corners */
yt-interaction.ytd-guide-entry-renderer, ytd-guide-entry-renderer, ytd-guide-entry-renderer[guide-refresh], ytd-mini-guide-entry-renderer, ytd-guide-entry-renderer[active], .style-scope.ytd-guide-entry-renderer:hover, tp-yt-paper-item.style-scope.ytd-guide-entry-renderer { border-radius: 0 !important }
ytd-guide-entry-renderer[guide-refresh] { width: 100% !important }
ytd-mini-guide-renderer[guide-refresh] { padding: 0 !important }
a#endpoint.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer { margin: 0 !important }
tp-yt-paper-item.ytd-guide-entry-renderer { --paper-item-focused-before-border-radius: 0 !important }
ytd-guide-section-renderer.style-scope.ytd-guide-renderer { padding-left: 0 !important }
tp-yt-paper-item.style-scope.ytd-guide-entry-renderer { padding-left: 24px !important }
.style-scope.ytd-rich-item-renderer { border-radius: 2px !important }
.style-scope.ytd-item-section-renderer { border-radius: 0 !important }
#tooltip.tp-yt-paper-tooltip { border-radius: 2px !important }
div.style-scope.yt-tooltip-renderer { border-radius: 0 !important }
.style-scope.ytd-topic-link-renderer { border-radius: 2px !important }
ytd-multi-page-menu-renderer { border-radius: 0 !important; border: 1px solid var(--yt-spec-10-percent-layer) !important; border-top: none !important; box-shadow: none !important }
yt-dropdown-menu { --paper-menu-button-content-border-radius: 2px !important }
ytd-menu-popup-renderer { border-radius: 2px !important }
.style-scope.ytd-shared-post-renderer, div#repost-context.style-scope.ytd-shared-post-renderer, ytd-post-renderer.style-scope.ytd-shared-post-renderer { border-radius: 0 !important }
div#dismissed.style-scope.ytd-compact-video-renderer { border-radius: 0 !important }
.style-scope.ytd-feed-nudge-renderer, .style-scope.ytd-inline-survey-renderer { border-radius: 2px !important }
.style-scope.ytd-brand-video-shelf-renderer, div#dismissible.style-scope.ytd-brand-video-singleton-renderer, #inline-survey-compact-video-renderer { border-radius: 0 !important }
ytd-merch-shelf-renderer { background-color: transparent !important }
div#clarify-box.attached-message.style-scope.ytd-watch-flexy { margin-top: 0 !important }
ytd-clarification-renderer.style-scope.ytd-item-section-renderer, ytd-clarification-renderer.style-scope.ytd-watch-flexy, ytd-info-panel-container-renderer[rounded-container] { border: 1px solid !important; border-color: #0000001a !important; border-radius: 0 !important }
ytd-info-panel-container-renderer[rounded-container][has-title] .header.ytd-info-panel-container-renderer, ytd-info-panel-content-renderer[rounded-container] { border-radius: 0 !important }
yt-formatted-string.description.style-scope.ytd-clarification-renderer { font-size: 1.4rem !important }
div.content-title.style-scope.ytd-clarification-renderer { padding-bottom: 4px !important }
ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer, ytd-tvfilm-offer-module-renderer[modern-panels], ytd-donation-shelf-renderer.style-scope.ytd-watch-flexy, ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]) { border-radius: 0 !important }
ytd-playlist-panel-renderer[modern-panels]:not([hide-header-text]) .title.ytd-playlist-panel-renderer { font-family: Roboto !important; font-size: 1.4rem !important; line-height: 2rem !important; font-weight: 500 !important }
ytd-tvfilm-offer-module-renderer[modern-panels] #header.ytd-tvfilm-offer-module-renderer, ytd-engagement-panel-title-header-renderer[modern-panels]:not([ads-semantic-text]) #title-text.ytd-engagement-panel-title-header-renderer { border-radius: 0 !important; font-family: Roboto !important; font-size: 1.6rem !important; line-height: 2.2rem !important; font-weight: 400 !important }
ytd-donation-shelf-renderer[modern-panels] #header-text.ytd-donation-shelf-renderer { font-family: Roboto !important; font-size: 1.6rem !important; font-weight: 500 !important }
ytd-post-renderer[rounded-container] { border-radius: 0 !important }

/* Remove all rounded corners from the video player and thumbnails */
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
@font-face { font-family: no-parens; src: url("data:application/x-font-woff;base64,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"); unicode-range: U+0028, U+0029 }
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
ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before, ytd-thumbnail[size="medium"] a.ytd-thumbnail, ytd-thumbnail[size="medium"]::before, .ShortsLockupViewModelHostThumbnailContainerRounded { border-radius: 0 !important }
ytd-playlist-thumbnail[size="medium"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="medium"]::before, ytd-playlist-thumbnail[size="large"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="large"]::before { border-radius: 0 !important }
.collections-stack-wiz__collection-stack1--medium, .collections-stack-wiz__collection-stack2, .yt-thumbnail-view-model--medium, .ytThumbnailViewModelMedium, .ytThumbnailViewModelLarge, .ytCollectionsStackCollectionStack1Medium, .ytCollectionsStackCollectionStack2, .ytContentPreviewImageViewModelLargeRoundedImage { border-radius: 0 !important }
ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer { border-radius: 0 !important }
ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail { border-radius: 2px !important }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();