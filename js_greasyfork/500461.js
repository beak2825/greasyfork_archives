// ==UserScript==
// @name YouTube Music Light Mode
// @namespace userstyles.world/user/oterin
// @version 20230928.11.12
// @description Turns YouTube Music White
// @author oterin
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @match *://*.music.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/500461/YouTube%20Music%20Light%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/500461/YouTube%20Music%20Light%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
ytmusic-logo {
    content: url('https://link.oterin.ch/ytm_light/img/on_platform_logo_dark.svg');
  }

  html {
    --ytmusic-background: #f4f4f4;
    --ytmusic-text-primary: #121212;
    --ytmusic-overlay-text-primary: #121212;
    --ytmusic-overlay-text-secondary: rgba(0, 0, 0, 0.65);
    --ytmusic-brand-background-solid: #f4f4f4;
    --ytmusic-nav-bar: #f4f4f4;
    --ytmusic-divider: rgba(0, 0, 0, 0.1);
    --ytmusic-menu-item-hover-background-color: #dcdcdc;
  }

  .yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--filled {
    color: #fff;
  }
    
    .yt-spec-touch-feedback-shape--touch-response-inverse .yt-spec-touch-feedback-shape__fill {
        background-color: #fff;
    }

  #iron-label-1 {
    color: #000;
  }

  #items > ytmusic-navigation-button-renderer > button > yt-formatted-string {
    color: #fff;
  }

  #header > ytmusic-header-renderer > h2 > yt-formatted-string {
    color: #000;
  }

  html,
  [dark][dark] {
    --yt-spec-badge-chip-background: rgba(0, 0, 0, 0.1);
    --yt-spec-text-primary: #f4f4f4;
    --yt-spec-touch-response: #121212;
    --yt-spec-mono-tonal-hover: rgba(0,0,0,0.2);
    --yt-spec-mono-filled-hover: rgba(0,0,0,0.75);
    --yt-spec-brand-background-primary: #f4f4f4;
    --yt-spec-button-chip-background-hover: rgba(0, 0, 0, 0.25);
    --yt-spec-outline: rgba(0,0,0,0.2);
    --yt-spec-general-background-a: #ffffff;
  }

  html:not(.style-scope) {
    --paper-dialog-background-color: #f4f4f4;
  }
    
  ytmusic-search-box[is-bauhaus-sidenav-enabled][is-mobile-view][opened], ytmusic-search-box[is-bauhaus-sidenav-enabled][is-mobile-view][has-query] {
      --ytmusic-search-background: #fff;
    }

  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_LARGE_TRANSLUCENT_AND_SELECTED_WHITE] a.ytmusic-chip-cloud-chip-renderer:hover, ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_UNKNOWN] a.ytmusic-chip-cloud-chip-renderer:hover, ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_DEFAULT] a.ytmusic-chip-cloud-chip-renderer:hover {
    background-color: rgba(0,0,0,0.15)
  }

  #hover-time-info.ytmusic-player-bar {
    color: #aaa;  
  }

  #scrollable > yt-formatted-string > span:nth-child(2) {
    color: #121212;  
  }

  ytmusic-guide-entry-renderer:not([is-primary]) .title.ytmusic-guide-entry-renderer,
  ytmusic-guide-entry-renderer,
  .title.ytmusic-guide-entry-renderer {
    color: #121212;
  }

  #subtitle-badges > ytmusic-inline-badge-renderer > yt-icon, ytmusic-two-row-item-renderer[item-size=COLLECTION_STYLE_ITEM_SIZE_SMALL_STATIC] .details.ytmusic-two-row-item-renderer .subtitle.ytmusic-two-row-item-renderer {
    color: var(--ytmusic-overlay-text-secondary);
  }

  #undercards > ytmusic-message-renderer > yt-formatted-string, .section-heading.ytmusic-add-to-playlist-renderer, #title.ytmusic-playlist-add-to-option-renderer {
    color: #000;
  }

  yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string, #corrected-link > span {
      color: #000;
}

  .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline:hover, ytmusic-item-thumbnail-overlay-renderer:not([play-button-has-background_]):not([play-button-state=default]) #background.ytmusic-item-thumbnail-overlay-renderer, ytmusic-item-thumbnail-overlay-renderer[indexed] #background.ytmusic-item-thumbnail-overlay-renderer {
    border-color: rgba(0,0,0,0.5);
  }

  #input-9 > input, .title.ytmusic-responsive-list-item-renderer {
    color: #121212;  
  }

  .dropdown-content.ytmusic-dropdown-renderer {
    --paper-listbox-background-color: #f4f4f4;  
  }

  .label.ytmusic-dropdown-item-renderer {
    color: #121212;    
  }

  #divider.ytmusic-guide-section-renderer {
    border-top: 1px solid rgba(0, 0, 0, 0.15);
  }



  #primary-renderer > ytmusic-player-queue-item > div.song-info.style-scope.ytmusic-player-queue-item > yt-formatted-string {
    color: #121212;
  }

  #header > ytmusic-editable-playlist-detail-header-renderer > ytmusic-detail-header-renderer > div > div.metadata.style-scope.ytmusic-detail-header-renderer > h2 > yt-formatted-string {
    color: #121212;
  }

  #contents > ytmusic-player-queue-item > div.song-info.style-scope.ytmusic-player-queue-item > yt-formatted-string {
    color: #121212;
  }

  ytmusic-av-toggle[toggle-disabled] .song-button.ytmusic-av-toggle {
    color: rgba(0, 0, 0, 0.3);
  }

  .subtitle.ytmusic-queue-header-renderer {
    color: #121212;
  }

  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_PRIMARY] a.ytmusic-chip-cloud-chip-renderer,
  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_SECONDARY] a.ytmusic-chip-cloud-chip-renderer,
  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_UNKNOWN][is-selected] a.ytmusic-chip-cloud-chip-renderer {
    color: #f4f4f4;
    --yt-endpoint-hover-color: #121212;
    background: #121212;
  }

  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_UNKNOWN] a.ytmusic-chip-cloud-chip-renderer,
  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_DEFAULT] a.ytmusic-chip-cloud-chip-renderer {
    background: rgba(0, 0, 0, 0.1);
    --yt-endpoint-hover-color: rgba(0, 0, 0, 0.1);
  }

  #contents > ytmusic-description-shelf-renderer > yt-formatted-string.non-expandable.description.style-scope.ytmusic-description-shelf-renderer {
      color: #121212;
  }


  .description.ytmusic-description-shelf-renderer {
    color: #121212;
  }

  #description {
    color: #121212;
  }



  .subtitle.ytmusic-card-shelf-renderer,
  #columnar-layout-badges > ytmusic-inline-badge-renderer > yt-icon, yt-icon.ytmusic-inline-badge-renderer {
    color: var(--ytmusic-overlay-text-secondary);
  }

  tp-yt-paper-icon-button.ytmusic-carousel-shelf-renderer {
    border: solid 1px rgba(0, 0, 0, 0.2)
  }

  #content > ytmusic-multi-select-menu-bar > div.text.style-scope.ytmusic-multi-select-menu-bar > yt-formatted-string {
    color: #121212;
  }

  #contents.ytmusic-playlist-shelf-renderer > *.ytmusic-playlist-shelf-renderer:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1)
  }

  #contents > ytmusic-card-shelf-renderer > div > div.card-content-container.style-scope.ytmusic-card-shelf-renderer > div.main-card-container.style-scope.ytmusic-card-shelf-renderer > div > div.details-container.style-scope.ytmusic-card-shelf-renderer > div.metadata-container.style-scope.ytmusic-card-shelf-renderer > div > yt-formatted-string > a {
    color: var(--ytmusic-overlay-text-secondary);
  }

  .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
    color: #f4f4f4;
  }



  .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline {
    color: #121212;
    border-color: rgba(0, 0, 0, 0.2);
  }

  ytmusic-tabs.stuck {
    background-color: #f4f4f4;
  }

  ytmusic-tabs.iron-selected .tab.ytmusic-tabs,
  .tab.selected.ytmusic-tabs {
    color: #121212;
    border-bottom: 2px solid #121212;
  }

  ytmusic-toggle-button-renderer #button.ytmusic-toggle-button-renderer {
    color: #121212;
  }



  #more-content-button > yt-button-renderer > yt-button-shape > button > div > span {
    color: #121212;
  }

  #contents > ytmusic-responsive-list-item-renderer > div.flex-columns.style-scope.ytmusic-responsive-list-item-renderer > div.title-column.style-scope.ytmusic-responsive-list-item-renderer > yt-formatted-string {
    color: #121212;
  }

  #contents > ytmusic-responsive-list-item-renderer > div.flex-columns.style-scope.ytmusic-responsive-list-item-renderer > div.title-column.style-scope.ytmusic-responsive-list-item-renderer > yt-formatted-string > a {
    color: #121212;
  }

  #contents > ytmusic-card-shelf-renderer > div > div.card-content-container.style-scope.ytmusic-card-shelf-renderer > div.main-card-container.style-scope.ytmusic-card-shelf-renderer > div > div.details-container.style-scope.ytmusic-card-shelf-renderer > div.metadata-container.style-scope.ytmusic-card-shelf-renderer > yt-formatted-string > a {
    color: #121212;
  }

  ytmusic-subscribe-button-renderer[is-subscribed] {
    --ytmusic-subscribe-button-outline-color: rgba(0, 0, 0, 0.2);
    --ytmusic-subscribe-button-color: #121212;
  }

  @media (min-width: 936px) {
    ytmusic-subscribe-button-renderer[is-subscribed] {
        --ytmusic-subscribe-button-outline-color: rgba(0, 0, 0, 0.7);
    }
  }

  #contents.ytmusic-shelf-renderer > *.ytmusic-shelf-renderer:not(:last-child) {
    border-color: rgba(0, 0, 0, 0.1)
  }

  .tab.ytmusic-tabs {
    color: rgba(0, 0, 0, 0.5);
  }

  ytmusic-search-box[is-bauhaus-sidenav-enabled] {
    --ytmusic-search-background: #f4f4f4;
  }

  ytmusic-search-suggestion {
    color: rgba(0, 0, 0, 0.5);
  }

  #items > ytmusic-responsive-list-item-renderer > div.flex-columns.style-scope.ytmusic-responsive-list-item-renderer > div.title-column.style-scope.ytmusic-responsive-list-item-renderer > yt-formatted-string > a {
    color: #121212;
  }



  ytmusic-immersive-header-renderer[is-description-expanded] .image.ytmusic-immersive-header-renderer ~ .content-container-wrapper.ytmusic-immersive-header-renderer {
    background-color: rgba(255, 255, 255, 0.6)
  }

  ytmusic-search-box[has-query] input.ytmusic-search-box,
  ytmusic-search-box[opened] input.ytmusic-search-box {
    color: #121212;
  }

  .tab-container.ytmusic-tabs {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .immersive-background.ytmusic-card-shelf-renderer ytmusic-fullbleed-thumbnail-renderer.ytmusic-card-shelf-renderer {
    z-index: -1;
  }


  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_UNKNOWN] a.ytmusic-chip-cloud-chip-renderer,
  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_DEFAULT] a.ytmusic-chip-cloud-chip-renderer {
    color: #121212;
    background: rgba(0, 0, 0, 0.1);
  }

  tp-yt-paper-tabs.ytmusic-player-page {
    --paper-tab-ink: #121212;
    --paper-tabs-selection-bar-color: #121212;
  }

  tp-yt-paper-tab.iron-selected.ytmusic-player-page {
    color: #121212;
    --yt-endpoint-hover-color: #121212;
  }

  tp-yt-paper-tab.ytmusic-player-page {
    color: rgba(0, 0, 0, 0.7);
    --yt-endpoint-hover-color: rgba(0, 0, 0, 0.7);
  }

  .yt-simple-endpoint {
    --yt-endpoint-hover-color:
  }

  tp-yt-paper-tab.ytmusic-player-page[disabled] {
    color: rgba(0, 0, 0, 0.3)
  }

  .av-toggle.ytmusic-av-toggle,
  .song-button.ytmusic-av-toggle,
  .video-button.ytmusic-av-toggle {
    background-color: #dedede;
    color: #121212;
  }

  #input-3 > input {
    color: #121212;
  }

  ytmusic-av-toggle[playback-mode=ATV_PREFERRED] .song-button.ytmusic-av-toggle {
    background-color: #eee;
  }

  ytmusic-av-toggle[playback-mode=OMV_PREFERRED] .video-button.ytmusic-av-toggle {
    background-color: #eee;
  }

  tp-yt-paper-textarea.ytmusic-playlist-form .input-content.tp-yt-paper-input-container>input, tp-yt-paper-textarea.ytmusic-playlist-form .input-content.tp-yt-paper-input-container>iron-input, tp-yt-paper-textarea.ytmusic-playlist-form .input-content.tp-yt-paper-input-container>textarea, tp-yt-paper-textarea.ytmusic-playlist-form .input-content.tp-yt-paper-input-container>iron-autogrow-textarea, tp-yt-paper-textarea.ytmusic-playlist-form .input-content.tp-yt-paper-input-container>.paper-input-input, iron-input.tp-yt-paper-input > input.tp-yt-paper-input {
    color: #121212;
  }

  ytd-multi-page-menu-renderer {
    background: #f4f4f4;
  }

  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_LARGE_TRANSLUCENT_AND_SELECTED_WHITE][is-selected]:not(.iron-selected) a.ytmusic-chip-cloud-chip-renderer {
    background: #121212;
    color: #f4f4f4;
  }

  .image.ytmusic-immersive-header-renderer ~ .content-container-wrapper.ytmusic-immersive-header-renderer {
    background-color: rgba(255, 255, 255, 0.4)
  }

  #header > ytmusic-immersive-header-renderer > div > div > div > yt-formatted-string.title.style-scope.ytmusic-immersive-header-renderer {
    color: #121212;
  }

  #header > ytmusic-immersive-header-renderer > div > div > div > div > div > div > yt-button-renderer.play-button.style-scope.ytmusic-immersive-header-renderer > yt-button-shape > button > div.yt-spec-button-shape-next__icon {
    color: #f4f4f4;
  }

  ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_LARGE_TRANSLUCENT_AND_SELECTED_WHITE] a.ytmusic-chip-cloud-chip-renderer {
    background: rgba(0, 0, 0, 0.1);
    color: #121212;
  }

  ytmusic-app-layout[is-bauhaus-sidenav-enabled] #mini-guide-background.ytmusic-app-layout {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    background: #f4f4f4;
  }

  ytmusic-app-layout[is-bauhaus-sidenav-enabled] #nav-bar-background.ytmusic-app-layout {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  #right-content > ytmusic-cast-button > tp-yt-paper-button > div > tp-yt-iron-icon.chromecast.style-scope.ytmusic-cast-button {
    fill: #121212;
  }

  ytmusic-guide-entry-renderer[active] tp-yt-paper-item.ytmusic-guide-entry-renderer {
    background-color: rgba(0, 0, 0, 0.075)
  }

  tp-yt-paper-item.ytmusic-guide-entry-renderer:hover {
    background-color: rgba(0, 0, 0, 0.115)
  }

  #items > ytmusic-two-row-item-renderer > div.details.style-scope.ytmusic-two-row-item-renderer > div > yt-formatted-string,
  #items > ytmusic-two-row-item-renderer > div.details.style-scope.ytmusic-two-row-item-renderer > div > yt-formatted-string > a {
    color: #121212;
  }


  #details > yt-formatted-string > a {
    color: #121212;
  }

  #more-content-button > yt-button-renderer > yt-button-shape > button {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  #items > ytmusic-navigation-button-renderer > button {
    background-color: rgba(0, 0, 0, 0.15);
  }

  .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text {
    color: #000;
}

  #layout > ytmusic-nav-bar > div.center-content.style-scope.ytmusic-nav-bar > ytmusic-search-box > div {
    color: rgba(0, 0, 0, 0.5);
  }

  #layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string {
    color: #121212;
  }

  #guide-icon,
  #inline-badges > ytmusic-inline-badge-renderer > yt-icon,
  #badges > ytmusic-inline-badge-renderer > yt-icon,
  #left-controls > span {
    color: var(--ytmusic-overlay-text-secondary);
  }

  #guide-icon,
  #inline-badges > ytmusic-inline-badge-renderer > yt-icon,
  #badges > ytmusic-inline-badge-renderer > yt-icon,
  #left-controls > span {
    color: var(--ytmusic-overlay-text-secondary);
  }

  #icon {
    fill: #121212;
  }

  #items > ytmusic-responsive-list-item-renderer > ytmusic-custom-index-column-renderer > div > yt-formatted-string {
    color: #121212;
  }

  tp-yt-paper-toast {
    background-color: #ededed;
    color: #121212;
  }

  #text.yt-notification-action-renderer {
    color: #121212;
  }

  #header > ytmusic-detail-header-renderer > div > div.metadata.style-scope.ytmusic-detail-header-renderer > h2 > yt-formatted-string {
    color: #121212;
  }

  #navigation-endpoint > yt-formatted-string,
  #items > ytmusic-menu-service-item-renderer > yt-formatted-string,
  #items > ytmusic-toggle-menu-service-item-renderer > yt-formatted-string {
    color: #121212;
  }

  #secondaryProgress.tp-yt-paper-progress {
    background: rgba(0, 0, 0, 0.25);
  }

  .volume-slider.ytmusic-player-bar,
  .expand-volume-slider.ytmusic-player-bar {
    --paper-slider-container-color: #424242;
    --paper-slider-active-color: #121212;
    --paper-slider-knob-color: #121212;
    --paper-slider-disabled-knob-color: #121212;
    --paper-slider-knob-start-color: #121212;
    --paper-slider-knob-start-border-color: #121212;
  }

  ytmusic-browse-response[has-background]:not([disable-gradient]) .background-gradient.ytmusic-browse-response {
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), var(--ytmusic-background));
  }

  #background > ytmusic-fullbleed-thumbnail-renderer > picture > img {
    content: url('https://i.imgur.com/LuYSXte.png');
  }

  .title.ytmusic-carousel-shelf-basic-header-renderer {
    color: #000;
  }

  ytmusic-search-box[is-bauhaus-sidenav-enabled]:not([opened]):not([has-query]) .search-box.ytmusic-search-box {
    background: rgba(0, 0, 0, 0.15);
  }

  ytmusic-search-box[is-bauhaus-sidenav-enabled] {
    --ytmusic-search-border: rgba(0, 0, 0, 0.15)
  }

  ytmusic-carousel-shelf-basic-header-renderer[style_=MUSIC_CAROUSEL_SHELF_BASIC_HEADER_STYLE_TITLE_TWO] .title.ytmusic-carousel-shelf-basic-header-renderer {
      color: #000;
  }

  #items > ytmusic-navigation-button-renderer > button {
    background-color: rgba(0, 0, 0, 0.7)
  }

  ytmusic-guide-entry-renderer:not([is-primary]) #play-button.ytmusic-guide-entry-renderer,
  ytmusic-guide-entry-renderer[play-button-state=playing]:not([is-primary]) #play-button.ytmusic-guide-entry-renderer {
    --iron-icon-fill-color: #121212;
  }

  #play-button > div > yt-icon {
    color: #f4f4f4;
  }

  body {
    background-color: #f4f4f4;
  }

  .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
    color: #fff;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
