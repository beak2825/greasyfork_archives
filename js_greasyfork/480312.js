// ==UserScript==
// @name          Compact Youtube layout
// @description   Corrections to UI of youtube.com: trying to make it more compact like in good old times
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.youtube.com/*
// @match         *://*.youtu.be/*
// @icon          https://cdn.icon-icons.com/icons2/1488/PNG/512/5295-youtube-i_102568.png
// @version       2.1.9
// @license       MIT
// @require       https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/480312/Compact%20Youtube%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/480312/Compact%20Youtube%20layout.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  var css = `
  /*=== Home screen ===*/
    /*--- Make list of videos narrower and align it to center ---*/
    ytd-two-column-browse-results-renderer.grid > #primary {
      width: [fldGWidth]% !important;
      max-width: [fldGWidth]% !important;
    }
    ytd-rich-grid-renderer.ytd-two-column-browse-results-renderer {
      margin: 0 0 !important;
    }
    ytd-two-column-browse-results-renderer.grid {
      justify-content: center !important;
    }
    /*--- Remove width for channel's grid of videos ---*/
    ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
      max-width: 100% !important;
    }
    ytd-two-column-browse-results-renderer.grid-6-columns:not(.foo), .grid-6-columns.ytd-two-column-browse-results-renderer {
      max-width: 100% !important;
      width: 100% !important;
    }
    /*--- Align section margin ---*/
    ytd-rich-section-renderer > #content {
      margin: 0px !important;
    }
    ytd-rich-section-renderer > #content #contents {
      margin: 0px !important;
    }
    /*--- Decrease font size of video name ---*/
    #video-title.ytd-rich-grid-media, #video-title.ytd-rich-grid-slim-media,
    .yt-lockup-metadata-view-model-wiz--compact .yt-lockup-metadata-view-model-wiz__title,
    #video-title.ytd-grid-video-renderer,
    h3.ytd-grid-video-renderer,
    ytm-shorts-lockup-view-model h3 { /*Name of playlist*/
      font-size: 1.3rem !important;
      line-height: 1.6rem !important;
      font-weight: 500 !important;
      margin-top: 2px !important;
      padding-right: 10px !important;
    }
    ytm-shorts-lockup-view-model h3 {
      min-height: unset !important;
    }
    /*--- Decrease gap between thumbnails ---*/
    h3.ytd-rich-grid-media {
      margin: 2px 0 4px 0 !important;
    }
    h3.ytd-rich-grid-slim-media {
      padding: 2px 24px 0 0 !important;
    }
    /*--- Remove avatars ---*/
    #avatar-container {
      display: [fldRemoveHomeAvatar] !important;
    }
    /*--- Decrease font size of latest posts name ---*/
    ytd-post-renderer[uses-compact-lockup] #home-content-text.ytd-post-renderer {
      font-size: 1.3rem !important;
      line-height: 1.6rem !important;
    }
    /*--- Make more space before and less space after header for Shorts and Latest posts ---*/
    ytd-browse[page-subtype="home"] #content #rich-shelf-header-container {
      margin-top: 30px !important;
      /*margin-bottom: 0px !important;*/
    }
    ytd-browse[page-subtype="home"] ytd-rich-shelf-renderer[standard-shelf-margins][is-shorts][is-show-more-hidden][is-show-less-hidden][is-truncated] #dismissible.ytd-rich-shelf-renderer {
      margin-bottom: 0 !important;
    }
    /*--- Move some videos to the position before Shorts ---*/
    ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > div#contents > ytd-rich-item-renderer:nth-child(-n+14) {
      order: -1 !important;
    }
    /*--- Decrease size of menu button ---*/
    ytd-rich-item-renderer button yt-icon, .shortsLockupViewModelHostOutsideMetadataMenu button yt-icon,
    ytd-browse[page-subtype="channels"] ytd-grid-video-renderer button.yt-icon-button > yt-icon {
      position: absolute !important;
      width: 18px !important;
      height: 18px !important;
      margin-right: 0px !important;
      margin-top: 0px !important;
    }
    /*--- Change position of menu button under video ---*/
    /*ytd-rich-item-renderer button.yt-spec-button-shape-next yt-icon, ytd-grid-video-renderer button.yt-icon-button > yt-icon {*/
    ytd-rich-item-renderer button yt-icon {
      top: -1px !important;
      right: 2px !important;
    }
    /*--- Change position of menu button under short ---*/
    .shortsLockupViewModelHostOutsideMetadataMenu button yt-icon {
      top: -3px !important;
      right: -3px !important;
    }

  /*=== Menu ===*/
    /*--- Change background color and make selection rectangle less round ---*/
    html:not([dark]) ytd-guide-entry-renderer[active] > #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, html:not([dark]) ytd-guide-entry-renderer[active] > #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {
      background-color: #f00 !important;
      border-radius: 3px !important;
    }
    html:not([dark]) ytd-guide-entry-renderer[active] .title.ytd-guide-entry-renderer {
      color: #fff !important;
    }
    html:not([dark]) ytd-guide-entry-renderer:not([active]) > #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover,
    html:not([dark]) ytd-guide-entry-renderer:not([active]) > #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer > tp-yt-paper-item:before {
      background-color: #ccc !important;
      border-radius: 3px !important;
    }
    /*--- Decrease font size ---*/
    .title.ytd-guide-entry-renderer {
      font-size: 13px !important;
    }
    /*--- Decrease height of menu item ---*/
    #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer > tp-yt-paper-item {
      min-height: 25px !important;
      max-height: 30px !important;
    }
    /*--- Leave section menu button intact ---*/
    #rich-shelf-header button.yt-icon-button > yt-icon {
      width: unset !important;
      height: unset !important;
    }

  /*=== Notifications ===*/
    /*--- Decrease font size ---*/
    .message.ytd-notification-renderer, ytd-commentbox yt-formatted-string#contenteditable-textarea.ytd-commentbox {
      font-size: 1.3rem !important;
      line-height: 1.6rem !important;
    }

  /*=== Thumbnails ==*/
    /*--- Correct overlay data ---*/
    ytd-thumbnail-overlay-resume-playback-renderer:not(.foo) {
      display: block !important;
      opacity: 1 !important;
      background: rgba(0, 0, 0, 0) !important;
      transition: all 0s ease 0s !important;
      z-index: 9 !important;
    }
    /*--- Correct progress bar ---*/
    #progress.ytd-thumbnail-overlay-resume-playback-renderer:not(.foo) {
      display: block !important;
      background-color: red !important;
      opacity: 1 !important;
    }
    /*--- Correct video duration background ---*/
    ytd-thumbnail-overlay-resume-playback-renderer:hover:not(.foo) {
      height: inherit !important;
      opacity: 1 !important;
    }
    ytd-app ytd-thumbnail-overlay-time-status-renderer:not(.foo) {
      font-size: 12px !important;
      height: 12px !important;
      line-height: 12px !important;
      opacity: 1 !important;
      padding: 5px 4px !important;
    }
    #scroll-container.yt-horizontal-list-renderer ytd-thumbnail-overlay-time-status-renderer:not(.foo) {
      top: auto !important;
    }
    /*--- Make thumbnail corners less round ---*/
    ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before, .yt-thumbnail-view-model--medium,
    .shortsLockupViewModelHostThumbnailContainerRounded, yt-img-shadow, yt-image-banner-view-model,
    ytd-reel-video-renderer:not(.foo) .watch-while-engagement-panel.ytd-reel-video-renderer {
      border-radius: 3px !important;
    }
    /*--- Set thumbnail width in search results ---*/
    ytd-video-renderer[is-search] ytd-thumbnail.ytd-video-renderer, ytd-video-renderer[use-search-ui] ytd-thumbnail.ytd-video-renderer, ytd-playlist-thumbnail.ytd-radio-renderer, ytd-playlist-thumbnail.ytd-playlist-renderer {
      max-width: [fldTWidth]px !important;
      min-width: [fldTWidth]px !important;
      margin-left: 8px !important;
      margin-right: 8px !important;
    }

  /*=== Grid of videos ===*/
    /*--- Decrease width of each thumbnail ---*/
    ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div > ytd-rich-item-renderer {
      display: inline-block !important;
      width: [fldTWidth]px !important;
      contain: none !important;
    }
    div#contents > ytd-rich-item-renderer ytd-rich-grid-media.ytd-rich-item-renderer, div#contents > ytd-rich-item-renderer[rendered-from-rich-grid],
    ytd-browse[page-subtype="channels"] ytd-item-section-renderer ytd-thumbnail, ytd-browse[page-subtype="channels"] ytd-grid-video-renderer {
      max-width: [fldTWidth]px !important;
      width: [fldTWidth]px !important;
    }
    ytd-browse[page-subtype="channels"] ytd-item-section-renderer ytd-thumbnail, ytd-browse[page-subtype="channels"] yt-collection-thumbnail-view-model,
    ytd-browse[page-subtype="channels"] yt-thumbnail-view-model .yt-thumbnail-view-model__image, .yt-thumbnail-view-model {
      height: calc([fldTWidth]px/1.7778) !important;
    }
    /*--- Keep aspect ratio for thumbnails on channel's home tab ---*/
    ytd-browse[page-subtype="channels"] .yt-core-image--content-mode-scale-aspect-fill {
      object-fit: unset !important;
    }
    /*--- Decrease size of channel logo ---*/
    #avatar-container.ytd-rich-grid-media {
      height: 20px !important;
      margin-top: 5px !important;
      margin-right: 8px !important;
    }
    .yt-spec-avatar-shape--avatar-size-medium {
      margin: 0px !important;
      width: 23px !important;
      height: 23px !important;
    }
    .yt-spec-avatar-shape__button--button-medium {
      width: 20px !important;
      height: 20px !important;
    }
    /*--- Decrease size of menu button and shift it to the right ---*/
    /*ytd-rich-grid-renderer ytd-menu-renderer .ytd-menu-renderer[style-target="button"],
    #container:not(.ytd-search) ytd-section-list-renderer ytd-shelf-renderer .ytd-menu-renderer[style-target="button"] {
      --yt-icon-button-icon-width: 18px !important;
      --yt-icon-button-icon-height: 18px !important;
      width: unset !important;
      height: unset !important;
    }*/
    ytd-section-list-renderer ytd-shelf-renderer ytd-menu-renderer.ytd-grid-video-renderer {
      top: 5px !important;
    }
    ytd-rich-grid-renderer ytd-menu-renderer.ytd-rich-grid-media {
      right: -5px !important;
    }
    ytm-shorts-lockup-view-model button.yt-spec-button-shape-next {
      width: 10px !important;
      -moz-box-align: unset !important;
      align-items: unset !important;
    }
    /*--- Increase width for title name ---*/
    ytm-shorts-lockup-view-model .shortsLockupViewModelHostOutsideMetadata {
      padding-right: 22px !important;
      padding-top: 0px !important;
    }
    /*--- Decrease width of each shorts thumbnail ---*/
    ytd-rich-shelf-renderer[is-shorts] > #dismissible > div > ytd-rich-item-renderer:not(.foo), div#contents > ytd-rich-item-renderer[is-shorts-grid],
    div#contents > ytd-rich-item-renderer[is-slim-media], /*#scroll-container > #items >*/ .shortsLockupViewModelHost {
      display: inline-block !important;
      width: 145px !important;
      contain: none !important;
    }
    /*--- Decrease width of each shorts thumbnail in suggested videos ---*/
    ytd-watch-flexy .shortsLockupViewModelHost {
      width: 130px !important;
    }
    ytd-watch-flexy .shortsLockupViewModelHostThumbnail, ytd-watch-flexy .shortsLockupViewModelHostThumbnailContainer {
      width: 130px !important;
      height: calc(130px/0.6667) !important;
    }
    /*--- Decrease width of shorts thumbnail at home tab ---*/
    ytd-browse[page-subtype="channels"] #scroll-container > #items > ytd-reel-item-renderer {
      width: 145px !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin)) !important;
    }
    /*--- Decrease video menu buttons at home tab and change its position ---*/
    ytd-browse[page-subtype="channels"] ytd-grid-video-renderer button.yt-icon-button > yt-icon,
    ytd-browse[page-subtype="channels"] .shortsLockupViewModelHostOutsideMetadataMenu button.yt-icon-button > yt-icon {
      top: -1px !important;
      right: 2px !important;
   }
    /*--- Position of shorts menu button at home screen and home tab ---*/
    /*ytd-browse[page-subtype="channels"] .shortsLockupViewModelHostOutsideMetadataMenu {
      position: absolute !important;
      top: 4px !important;
      right: -2px !important;
    }*/
    /*--- Make more videos in one row ---*/
    ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer {
      display: inline !important;
    }
    /*div#contents.style-scope.ytd-rich-grid-renderer {
      display: block !important;
    }*/
    ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div {
      display: inline !important;
      margin: 0 !important;
    }
    /*--- Set margin between videos in a row ---*/
    ytd-rich-item-renderer, ytd-rich-item-renderer[rendered-from-rich-grid], ytd-rich-item-renderer[is-slim-grid]:first-of-type, ytd-rich-item-renderer[is-slim-grid]:last-of-type,
    ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] /*#scroll-container > #items >*/ /*.shortsLockupViewModelHost*/,
    ytd-browse[page-subtype="channels"] ytd-grid-video-renderer, ytd-browse[page-subtype="channels"] .shortsLockupViewModelHost {
      margin-left: 0 !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin)) !important;
    }
    ytd-browse[page-subtype="channels"] .shortsLockupViewModelHost img, ytd-browse[page-subtype="channels"] .shortsLockupViewModelHostThumbnailContainerCustomDimensions,
    ytd-browse[page-subtype="history"] .shortsLockupViewModelHostThumbnailContainerCustomDimensions {
      height: calc(145px/0.6667) !important;
    }
    /*ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
      margin-left: 0 !important;
    }*/
    /*--- Set height of each row ---*/
    ytd-rich-item-renderer {
      margin-bottom: 12px !important;
    }
    /*--- Set height of each row of playlists (make extra space above for thumbnails stack) ---*/
    ytd-rich-item-renderer[items-per-row="4"] {
      margin-top: 10px !important;
    }
    /*--- Font size for channel name and views count ---*/
    ytd-video-meta-block #byline-container.ytd-video-meta-block, ytd-video-meta-block #metadata-line.ytd-video-meta-block, .badge.ytd-badge-supported-renderer,
    ytm-shorts-lockup-view-model > div > div, #metadata-container.ytd-grid-video-renderer:not(.foo), ytd-grid-video-renderer:not([rich-meta]) #metadata-line.ytd-grid-video-renderer {
      font-size: 11px !important;
      line-height: 1.4rem !important;
    }
    /*--- Font size for playlist details ---*/
    .yt-content-metadata-view-model-wiz--medium-text .yt-content-metadata-view-model-wiz__metadata-text,
    .yt-content-metadata-view-model-wiz .yt-content-metadata-view-model-wiz__metadata-text {
      font-size: 11.5px !important;
      line-height: 1.4rem !important;
      white-space: wrap !important;
    }
    ytd-browse[page-subtype] .yt-lockup-view-model-wiz__metadata {
      padding-right: 24px !important;
    }
    /*--- No padding under playlist thumbnail ---*/
    .yt-lockup-view-model-wiz--vertical .yt-lockup-view-model-wiz__content-image {
      padding-bottom: 0px !important;
    }

  /*=== Subscriptions ===*/
    /*--- Make bigger gap between header and grid of videos ---*/
    ytd-browse[page-subtype="subscriptions"] ytd-shelf-renderer:not([is-shorts]) {
      margin-bottom: 20px !important;
    }
    /*--- Make smaller gap between header and grid of shorts ---*/
    ytd-browse[page-subtype="subscriptions"] #rich-shelf-header.ytd-rich-shelf-renderer {
      margin-bottom: 14px !important;
      margin-left: 0px !important;
    }
    /*--- Make bigger gap before grid of shorts ---*/
    ytd-browse[page-subtype="subscriptions"] ytd-rich-section-renderer {
      margin-top: 15px !important;
    }
    ytd-browse[page-subtype="subscriptions"] .grid-subheader.ytd-shelf-renderer {
      margin-top: 0px !important;
    }
    /*--- Make smaller gap between shorts ---*/
    /*ytd-browse[page-subtype="subscriptions"] .shortsLockupViewModelHost {
      margin-right: unset !important;
    }*/
    /*--- Position of shorts menu button at home screen and home tab ---*/
    ytd-browse[page-subtype="subscriptions"] .shortsLockupViewModelHostOutsideMetadataMenu {
      right: 0px !important;
    }

  /*=== Channel's header ===*/
    /*--- Make banner lower ---*/
    #header #page-header-banner img {
      width: auto !important;
      height: auto !important;
      max-height: 150px !important;
    }
    #header #page-header-banner-sizer.ytd-tabbed-page-header {
      height: auto !important;
      padding-top: 150px !important;
    }
    /*--- Make avatar smaller ---*/
    #header yt-avatar-shape img {
      width: auto !important;
      height: auto !important;
      max-height: 100px !important;
    }
    /*--- Make channel description more compact ---*/
    #header #page-header yt-description-preview-view-model,
    #header #page-header yt-flexible-actions-view-model {
      margin-top: 6px !important;
    }
    #header #page-header yt-attribution-view-model {
      margin-top: 4px !important;
    }
    #header #tabs-container.ytd-tabbed-page-header {
      height: 33px !important;
    }
    #header #tabs-container tp-yt-paper-tabs.ytd-tabbed-page-header {
      height: 41px !important;
    }
    #header tp-yt-app-toolbar {
      margin-top: -15px !important;
    }
    /*#header #contentContainer {
      margin-top: -15px !important;
    }*/

  /*=== Main player ===*/
    /*--- Make player corners less round ---*/
    ytd-watch-flexy #ytd-player.ytd-watch-flexy {
      border-radius: 3px !important;
    }
    ytd-thumbnail a.ytd-thumbnail, ytd-thumbnail::before, .yt-video-attribute-view-model--image-large .yt-video-attribute-view-model__hero-section,
    #playlist-thumbnail.ytd-structured-description-playlist-lockup-renderer, .player-container.ytd-reel-video-renderer,
    ytd-browse[page-subtype="channels"] ytd-player {
      border-radius: 3px !important;
    }
    /*--- Make Shorts comments corners less round ---*/
    .anchored-panel.ytd-shorts {
      border-radius: 3px !important;
    }
    /*--- Remove channel avatar, suggested videos and next videos overlay ---*/
    ytd-watch-flexy div.ytp-ce-element.ytp-ce-channel, ytd-watch-flexy div.ytp-ce-element.ytp-ce-video, ytd-watch-flexy div.html5-endscreen.ytp-player-content {
      display: [fldRemoveSuggested] !important;
    }
    /*--- Remove autoplay and miniplayer buttons ---*/
    .ytp-chrome-controls button[data-tooltip-target-id="ytp-autonav-toggle-button"], .ytp-chrome-controls button.ytp-miniplayer-button {
      display: [fldRemoveAutoplay] !important;
    }
    /*--- Make player icons smaller ---*/
    .ytp-chrome-bottom {
      height: 35px !important;
      padding-top: 0px !important;
    }
    .ytp-chrome-controls {
      height: 35px !important;
      line-height: 35px !important;
      font-size: 90%;
    }
    #player #movie_player .ytp-chrome-bottom .ytp-progress-bar-container {
      bottom: 36px !important;
    }
    .ytp-chrome-controls button {
      margin-left: -4px !important;
      margin-right: -4px !important;
    }
    /*--- Align chapter title ---*/
    .ytp-chrome-controls .ytp-chapter-container > button.ytp-chapter-title {
      -webkit-align-items: center !important;
      align-items: center !important;
    }
    .ytp-chrome-controls .ytp-chapter-container {
      line-height: unset !important;
    }
    /*--- Correct size of volume button ---*/
    .ytp-left-controls > .ytp-volume-area > button {
      height: 45px !important;
      margin-top: -5px !important;
    }
    /*--- Correct font size of time display ---*/
    .ytp-chrome-controls .ytp-time-display {
      font-size: 120% !important;
      line-height: 35px !important;
    }
    /*--- Correct font size of chapters ---*/
    ytd-horizontal-card-list-renderer #endpoint h4 {
      font-size: 13px !important;
      line-height: 1.3em !important;
    }
    /*--- Correct font size of description, comments ---*/
    ytd-text-inline-expander, #content-text.ytd-comment-renderer, #content-text.ytd-comment-view-model, #expander.ytd-comment-replies-renderer button,
    #message.ytd-message-renderer, .more-button.ytd-comment-renderer, .less-button.ytd-comment-renderer {
      font-size: 13px !important;
      line-height: 1.3em !important;
      letter-spacing: 0 !important;
    }
    ytd-watch-flexy[video-id] .yt-spec-button-shape-next, ytd-watch-flexy[video-id] .animated-rolling-number-wiz,
    #grid-container .yt-spec-button-shape-next {
      font-size: 13px !important;
    }
    /*--- Correct font size of Translate, Show more and Show less buttons ---*/
    ytd-comment-thread-renderer tp-yt-paper-button, .more-button, .less-button {
      font-size: 12px !important;
      line-height: 1.3em !important;
      letter-spacing: 0 !important;
    }
    /*--- Make like/dislike buttons in comments smaller ---*/
    #like-button yt-button-shape yt-icon, #dislike-button yt-button-shape yt-icon {
      width: 18px !important;
      height: 18px !important;
    }
    /*--- Make size of other buttons in description and comments smaller ---*/
    div#description-inner .yt-spec-button-shape-next, .ytd-comments div#contents .yt-spec-button-shape-next {
      height: 26px;
    }
    /*--- Correct creator's comment ---*/
    ytd-comment-replies-renderer #creator-thumbnail.ytd-comment-replies-renderer yt-img-shadow.ytd-comment-replies-renderer {
      width: 18px !important;
      height: 18px !important;
    }
    /*--- Correct font size of suggested videos ---*/
    /*ytd-video-meta-block #byline-container.ytd-video-meta-block,*/ /*ytd-video-meta-block #metadata-line.ytd-video-meta-block,*/ /*.badge.ytd-badge-supported-renderer {
      font-size: 12px !important;
      line-height: 1.4rem !important;
    }*/
    ytd-app #video-title[class*="renderer"], ytd-compact-video-renderer #video-title.ytd-compact-video-renderer, ytd-two-column-search-results-renderer #channel-title .ytd-channel-name {
      /*font-size: 14px !important;*/
      line-height: 1.1 !important;
    }
    /*--- Remove "Infocards" section from video description --*/
    div#description #items > ytd-video-description-infocards-section-renderer {
      display: none !important;
    }
    /*--- Remove "Music" section from video description --*/
    div#description #items > ytd-horizontal-card-list-renderer {
      display: none !important;
    }
    /*--- Remove "Shorts remixing this video" section from video description --*/
    div#description #items > ytd-reel-shelf-renderer {
      display: none !important;
    }
    /*--- Remove "People mentioned" section from video description --*/
    div#description #items > yt-video-attributes-section-view-model {
      display: none !important;
    }
    /*--- Remove text around "Show transcript" button ---*/
    div#description #items > ytd-video-description-transcript-section-renderer > #header, #items > ytd-video-description-transcript-section-renderer > #sub-header {
      display: none !important;
    }
    /*--- Decrease size and position of menu button near suggested video ---*/
    ytd-watch-flexy div#secondary ytd-item-section-renderer button yt-icon,
    yt-horizontal-list-renderer .yt-horizontal-list-renderer.arrow button yt-icon {
      position: absolute !important;
      width: 18px !important;
      height: 18px !important;
      margin-right: 0px !important;
      margin-top: 0px !important;
      top: 6px !important;
      right: 0px !important;
    }
    /*--- Decrease size and position of menu button near notifications ---*/
    ytd-menu-renderer.ytd-notification-renderer button yt-icon {
      width: 18px !important;
      height: 18px !important;
    }
    /*--- Change position of menu button near suggested short ---*/
    ytd-watch-flexy div#secondary ytd-item-section-renderer .shortsLockupViewModelHostOutsideMetadataMenu button yt-icon {
      top: -4px !important;
      right: -4px !important;
    }
    /*--- Set margin between suggested shorts ---*/
    ytd-watch-flexy div#secondary ytd-reel-shelf-renderer .shortsLockupViewModelHost {
      margin-left: 0 !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin)/2) !important;
    }
    /*--- Change size and position of left/right button of suggested shorts ---*/
    ytd-watch-flexy div#secondary ytd-item-section-renderer yt-horizontal-list-renderer button yt-icon,
    yt-horizontal-list-renderer .yt-horizontal-list-renderer.arrow button yt-icon {
      position: unset !important;
      height: unset !important;
      margin-top: 3px !important;
    }
    /*ytd-watch-flexy div#secondary*/ ytd-item-section-renderer yt-horizontal-list-renderer ytd-button-renderer.arrow,
    ytd-menu-renderer .ytd-menu-renderer[style-target="button"] {
      width: 30px !important;
      height: 30px !important;
    }

  /*=== Miniplayer ===*/
    /*--- Make player corners less round ---*/
    ytd-miniplayer:not(.foo) #player-container.ytd-miniplayer, ytd-miniplayer:not(.foo) #video-container.ytd-miniplayer .video.ytd-miniplayer, ytd-miniplayer:not(.foo) #card.ytd-miniplayer, ytd-miniplayer:not(.foo),
    .ytp-player-minimized .html5-main-video, .ytp-player-minimized .ytp-miniplayer-scrim, .ytp-player-minimized.html5-video-player {
      border-radius: 3px 3px 0 0 !important;
    }

  /*=== Search box ===*/
    /*--- Make corners less round ---*/
    .ytSearchboxComponentInputBox {
      height: 30px !important;
      border-radius: 3px 0 0 3px !important;
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }
    .ytSearchboxComponentSearchButton {
      height: 32px !important;
      border-radius: 0 3px 3px 0 !important;
    }
    /*--- Make search box smaller ---*/
    /*#search-form.ytd-searchbox, #search-icon-legacy.ytd-searchbox {
      height: 30px !important;
    }*/
    .yt-spec-button-shape-next--icon-only-default {
      width: 30px !important;
      height: 30px !important;
    }
    #voice-search-button.ytd-masthead {
      margin-top: -8px !important;
    }
    /*--- Move box to the right ---*/
    #center.ytd-masthead {
      margin-right: auto !important;
    }

  /*=== Search results ===*/
    /*--- Remove channel avatar ---*/
    ytd-search #channel-thumbnail.ytd-video-renderer {
      display: none !important;
    }
    /*--- Decrease font size ---*/
    ytd-video-renderer #dismissible h3 {
      font-size: 1.3rem !important;
      line-height: 1.6rem !important;
      margin-bottom: 3px !important;
    }
    /*--- Make thumbnails smaller ---*/
    #dismissible.ytd-video-renderer > ytd-thumbnail, yt-lockup-view-model .yt-lockup-view-model-wiz__content-image {
      /*margin-left: calc(var(--ytd-rich-grid-item-margin)/2) !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin)/2) !important;*/
      margin-left: 0px !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin)) !important;
      width: [fldTWidth]px !important;
    }
    ytd-search #dismissible ytd-thumbnail, ytd-search #dismissible ytd-thumbnail #thumbnail.ytd-thumbnail {
      height: calc([fldTWidth]px/1.7778) !important;
    }
    ytd-search #dismissible ytd-thumbnail img.yt-core-image--content-mode-scale-aspect-fill {
      object-fit: unset !important;
    }
    .yt-lockup-view-model-wiz--horizontal .yt-lockup-view-model-wiz__content-image {
      padding-right: 0px !important;
    }
    ytd-video-renderer[use-search-ui] ytd-thumbnail.ytd-video-renderer::before {
      display: inline !important;
    }
    /*--- Make channel logo smaller ---*/
    yt-img-shadow.ytd-channel-renderer {
      height: 85px !important;
      width: 85px !important;
    }
    img.yt-img-shadow {
      max-height: var(--yt-img-max-height,100%) !important;
    }
    ytd-channel-renderer #avatar-section.ytd-channel-renderer {
      margin-top: 5px !important;
    }
    ytd-channel-renderer #info.ytd-channel-renderer {
      padding-bottom: 5px !important;
      justify-content: unset !important;
    }
    /*--- Make list of channels more compact ---*/
    #grid-container.ytd-expanded-shelf-contents-renderer > .ytd-expanded-shelf-contents-renderer:not(:last-child) {
      margin-bottom: 10px !important;
    }
    /*--- Make shorts smaller ---*/
    ytd-search .shortsLockupViewModelHostThumbnailContainerCustomDimensions {
      height: calc(145px/0.6667) !important;
    }
    /*--- Make video name smaller ---*/
    #video-title.ytd-video-renderer, #video-title.ytd-radio-renderer, ytd-playlist-renderer #content h3, ytd-playlist-renderer #content h3 #video-title, .yt-lockup-metadata-view-model-wiz--standard.yt-lockup-metadata-view-model-wiz--legacy-typography .yt-lockup-metadata-view-model-wiz__title {
      font-size: 1.6rem !important;
      font-weight: 500 !important;
    }
    /*--- Make metadata bigger ---*/
    #dismissible.ytd-video-renderer .text-wrapper, #description-text.ytd-video-renderer, .yt-content-metadata-view-model-wiz .yt-content-metadata-view-model-wiz__metadata-text {
      font-size: 1.2rem !important;
      /*font-size: 11px !important;*/
    }
    /*--- Align channel avatar ---*/
    #avatar-section.ytd-channel-renderer {
      max-width: [fldTWidth]px !important;
      min-width: [fldTWidth]px !important;
    }
    /*--- Make bigger gap between filters and list of videos ---*/
    ytd-search ytd-search-header-renderer {
      margin-bottom: 20px !important;
    }

  /*=== Playlists ===*/
    /*--- Decrease font size ---*/
    ytd-grid-renderer #details h3 {
      font-size: 1.3rem !important;
      line-height: 1.6rem !important;
      margin-bottom: 3px !important;
    }
    /*--- Make thumbnail corners less round ---*/
    ytd-playlist-thumbnail a.ytd-playlist-thumbnail, ytd-playlist-thumbnail::before {
      border-radius: 3px !important;
    }
    /*--- Make thumbnails smaller ---*/
    #items.ytd-grid-renderer > ytd-grid-playlist-renderer.ytd-grid-renderer {
      margin-left: calc(var(--ytd-rich-grid-item-margin)/2) !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin)/2) !important;
      width: [fldTWidth]px !important;
    }
    ytd-grid-renderer .yt-thumbnail-view-model {
      margin-top: auto !important;
    }
    ytd-grid-renderer .collections-stack-wiz__collection-stack1--medium {
      height: calc([fldTWidth]px/1.7778) !important;
    }
    ytd-playlist-thumbnail.ytd-grid-playlist-renderer {
      width: [fldTWidth]px !important;
    }
    /*--- Change position of menu button under playlist ---*/
    /*ytd-rich-item-renderer button.yt-spec-button-shape-next yt-icon, ytd-grid-video-renderer button.yt-icon-button > yt-icon {*/
    ytd-rich-item-renderer yt-lockup-view-model button yt-icon {
      top: 8px !important;
      right: 5px !important;
    }
    .yt-thumbnail-view-model--aspect-ratio-16-by-9, .yt-thumbnail-view-model--aspect-ratio-1-by-1 {
      padding-top: unset !important;
    }

  /*=== List of uploads in your channel ===*/
    /*--- Make thumbnails smaller ---*/
    /*#items ytd-grid-video-renderer {
      margin-left: calc(var(--ytd-rich-grid-item-margin)/2) !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin)/2) !important;
      width: [fldTWidth]px !important;
    }*/
    /*ytd-thumbnail.ytd-grid-video-renderer {
      width: [fldTWidth]px !important;
      max-width: [fldTWidth]px !important;
      min-width: [fldTWidth]px !important;
      height: 118px !important;
    }*/

  /*=== Community posts ===*/
    /*--- Decrease font size ---*/
    #content-text.ytd-backstage-post-renderer {
      font-size: 13px !important;
    }

  /*=== Shorts tab ===*/
    /*--- Align thumbnails on top ---*/
    ytd-rich-grid-slim-media > #dismissible ytd-thumbnail.ytd-rich-grid-slim-media {
      vertical-align: top !important;
      display: inline !important;
    }
    ytd-rich-grid-slim-media > #dismissible ytd-thumbnail.ytd-rich-grid-slim-media::before {
      display: inline !important;
    }
    ytd-rich-grid-slim-media > #dismissible ytd-thumbnail #thumbnail.ytd-thumbnail {
      position: relative !important;
    }
    ytm-shorts-lockup-view-model .shortsLockupViewModelHostOutsideMetadataMenu button yt-icon {
      top: -4px !important;
      right: -5px !important;
    }

  /*=== Watch history ===*/
    /*--- Make thumbnail height smaller ---*/
    ytd-video-renderer[is-history]/* > #dismissible >*/ ytd-thumbnail > #thumbnail.ytd-thumbnail {
      height: unset !important;
      position: relative !important;
    }
    ytd-video-renderer[is-history]/*:not([use-search-ui]) > #dismissible >*/ ytd-thumbnail.ytd-video-renderer {
      height: unset !important;
    }
    /*--- Make left margin ---*/
    ytd-section-list-renderer[page-subtype="history"] #contents.ytd-section-list-renderer {
      margin-left: auto !important;
    }
    ytd-browse[page-subtype="history"] yt-page-header-renderer {
      margin-left: 100px !important;
    }
    /*--- Make smaller gap between header and grid of shorts ---*/
    ytd-browse[page-subtype="history"] #contents.ytd-reel-shelf-renderer {
      margin-top: 15px !important;
    }
    /*--- Set margin between shorts in a row ---*/
    ytd-browse[page-subtype="history"] .shortsLockupViewModelHost {
      margin-left: 0 !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin)/2) !important;
    }
    /*--- Position of shorts menu button ---*/
    ytd-browse[page-subtype="history"] .shortsLockupViewModelHostOutsideMetadataMenu {
      right: 0px !important;
    }
    /*--- Decrease size of shorts menu button ---*/
    ytd-browse[page-subtype="history"] .shortsLockupViewModelHostOutsideMetadataMenu button.yt-spec-button-shape-next yt-icon {
      /*width: 18px !important;
      height: 18px !important;*/
      margin-right: 0px !important;
      margin-top: 0px !important;
    }
  `;

  var gm_css = `
  #compact_youtube_layout * {
    font-family: Roboto, Arial, sans-serif !important;
  }
  #compact_youtube_layout .config_header {
    font-size: 20px !important;
    font-weight: bold !important;
  }
  #compact_youtube_layout .field_label {
    position: absolute !important;
    margin-top: -10px !important;
    margin-left: 60px !important;
    font-size: 13px !important;
    font-weight: 400 !important;
  }
  #compact_youtube_layout input[type="text"] {
    position: absolute !important;
    margin-top: -12px !important;
    width: 50px !important;
    font-size: 12px !important;
    font-weight: bold !important;
    border-radius: 3px !important;
  }
  #compact_youtube_layout input[type="checkbox"] {
    position: absolute !important;
    margin-top: -9px !important;
    margin-left: 19px !important;
  }
  #compact_youtube_layout button {
    font-size: 12px !important;
  }`;

  var gm_frameStyle = `border: 2px solid rgb(0, 0, 0); border-radius: 6px; height: 30%; width: 30%; margin: 0px; max-height: 300px; max-width: 95%; min-height: 150px; min-width: 500px; opacity: 1; overflow: auto; padding: 0px; position: fixed; z-index: 9999; display: block;`;

  GM_config.init({
    id: 'compact_youtube_layout',
    title: 'Settings for "' + GM_info.script.name + '" script',
    css: gm_css,
    frameStyle: gm_frameStyle,
    fields: {
      'fldTWidth': {
        'label': 'Width of video thumbnail (in pixels, default value 193px):',
        'labelPos': 'above',
        'type': 'unsigned int',
        'min': 50,
        'max': 300,
        'default': 193
      },
      'fldGWidth': {
        'label': 'Width of videos grid (in percent, default value 80%):',
        'labelPos': 'above',
        'type': 'unsigned int',
        'min': 20,
        'max': 100,
        'default': 80
      },
      'fldRemoveHomeAvatar': {
        'label': 'Home screen: Remove channel avatar',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': false
      },
      'fldRemoveSuggested': {
        'label': 'Player: Remove channel avatar, suggested videos and next videos overlay',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldRemoveAutoplay': {
        'label': 'Player: Remove autoplay toggle',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      }
    }
  });

  GM_registerMenuCommand('Settings', () => {
    GM_config.open();
  });

  var observerCombineShorts = null;
  const callbackCombine = function (mutationsList, observer) {
  }

  var observerBody = null;
  const callbackBody = function (mutationsList, observer) {
    css = css.replace(/\[fldTWidth\]/g, GM_config.fields['fldTWidth'].value);
    css = css.replace(/\[fldGWidth\]/g, GM_config.fields['fldGWidth'].value);
    if (GM_config.fields['fldRemoveHomeAvatar'].value) {
      css = css.replace(/\[fldRemoveHomeAvatar\]/g, 'none');
    } else {
      css = css.replace(/\[fldRemoveHomeAvatar\]/g, 'initial');
    }
    if (GM_config.fields['fldRemoveSuggested'].value) {
      css = css.replace(/\[fldRemoveSuggested\]/g, 'none');
    } else {
      css = css.replace(/\[fldRemoveSuggested\]/g, 'initial');
    }
    if (GM_config.fields['fldRemoveAutoplay'].value) {
      css = css.replace(/\[fldRemoveAutoplay\]/g, 'none');
    } else {
      css = css.replace(/\[fldRemoveAutoplay\]/g, 'initial');
    }

    if (window.location === window.parent.location) { //Do not apply fixes for embedded video

      if (typeof GM_addStyle != 'undefined') {
        GM_addStyle(css);
      } else if (typeof PRO_addStyle != 'undefined') {
        PRO_addStyle(css);
      } else if (typeof addStyle != 'undefined') {
        addStyle(css);
      } else {
        var node = document.createElement('style');
        node.type = 'text/css';
        node.appendChild(document.createTextNode(css));
        document.documentElement.appendChild(node);
      }
    }

    observerBody.disconnect();
  }

  let nodeBody = document.querySelector("body");
  if (nodeBody != null) {
    observerBody = new MutationObserver(callbackBody);
    observerBody.observe(nodeBody, {childList: true, subtree: true, attributes: true, characterData: false});
  }

})();
