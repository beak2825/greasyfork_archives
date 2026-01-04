// ==UserScript==
// @name        YouTube: Plain Video Player (Alternative)
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @exclude     /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @grant       none
// @version     0.2.3
// @author      CY Fung
// @license     MIT
// @description To force  Low Resource
// @run-at      document-start
// @inject-into page
// @unwrap
// @license             MIT
// @compatible          chrome
// @compatible          firefox
// @compatible          opera
// @compatible          edge
// @compatible          safari
// @allFrames           true
// @downloadURL https://update.greasyfork.org/scripts/494233/YouTube%3A%20Plain%20Video%20Player%20%28Alternative%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494233/YouTube%3A%20Plain%20Video%20Player%20%28Alternative%29.meta.js
// ==/UserScript==


(() => {


  const debug22 = new Set();

  const WITH_NAVBAR = true;
  const WITH_SIDEBAR = true;
  const WITH_COMMENT = true;
  const WITH_TOP_RIGHT_BUTTONS = true;
  const WITH_VIDEO_INFO = true;
  const WITH_VIDEO_INFO_TRADITIONAL = true;

  window.debug22 = debug22;
  const whitelist = new Set([

    ...(WITH_NAVBAR ? [

      "ytd-masthead",
    ] : []),

    ...(WITH_SIDEBAR ? [


      "ytd-topbar-logo-renderer",
      "ytd-mini-guide-renderer",
      "ytd-permission-role-bottom-bar-renderer",
      "ytd-logo",


      "ytd-guide-renderer",
      "ytd-guide-section-renderer",

      "ytd-guide-entry-renderer",
      "ytd-guide-collapsible-section-entry-renderer",
      "ytd-guide-collapsible-entry-renderer",

      "ytd-guide-downloads-entry-renderer"

    ]
      : []),


    "ytd-thumbnail",


    // "ytd-topbar-logo-renderer",
    // "ytd-mini-guide-renderer",
    // "ytd-permission-role-bottom-bar-renderer",
    // "ytd-yoodle-renderer",
    // "ytd-badge-supported-renderer",
    // "ytd-playlist-panel-renderer",
    // "ytd-watch-next-secondary-results-renderer",
    // "ytd-video-quality-promo-renderer",
    // "ytd-video-primary-info-renderer",
    // "ytd-sentiment-bar-renderer",
    // "ytd-menu-renderer",
    // "ytd-download-button-renderer",
    // "ytd-video-view-count-renderer",
    // "ytd-video-secondary-info-renderer",
    // "ytd-video-owner-renderer",
    // "ytd-structured-description-content-renderer",
    // "ytd-metadata-row-container-renderer",
    // "ytd-video-description-transcript-section-renderer",
    // "ytd-subscribe-button-renderer",
    // "ytd-engagement-panel-section-list-renderer",
    // "ytd-ads-engagement-panel-content-renderer",
    // "ytd-clip-section-renderer",
    // "ytd-clip-creation-text-input-renderer",
    // "ytd-clip-ad-state-renderer",
    // "ytd-video-description-header-renderer",
    // "ytd-expandable-video-description-body-renderer",
    // "ytd-section-list-renderer",
    // "ytd-item-section-renderer",
    // "ytd-continuation-item-renderer",
    // "ytd-thumbnail-overlay-time-status-renderer",
    // "ytd-thumbnail-overlay-now-playing-renderer",
    // "ytd-thumbnail-overlay-resume-playback-renderer",
    // "ytd-comments-header-renderer",
    // "ytd-comment-simplebox-renderer",
    // "ytd-comment-thread-renderer",
    // "ytd-comment-replies-renderer",
    // "ytd-toggle-button-renderer",
    // "ytd-sponsor-comment-badge-renderer",
    // "ytd-channel-legal-info-renderer",
    // "ytd-playlist-sidebar-renderer",
    // "ytd-settings-sidebar-renderer",
    // "ytd-two-column-browse-results-renderer",
    // "ytd-rich-grid-renderer",
    // "ytd-rich-item-renderer",
    // "ytd-thumbnail-overlay-bottom-panel-renderer",
    // "ytd-playlist-video-thumbnail-renderer",
    // "ytd-feed-filter-chip-bar-renderer",
    // "ytd-ghost-grid-renderer",
    // "ytd-mini-guide-entry-renderer",

    ...(WITH_VIDEO_INFO ? [


      // "ytd-topbar-logo-renderer",
      // "ytd-mini-guide-renderer",
      // "ytd-permission-role-bottom-bar-renderer",
      // "ytd-yoodle-renderer",
      // "ytd-badge-supported-renderer",
      // "ytd-playlist-panel-renderer",
      // "ytd-watch-next-secondary-results-renderer",
      // "ytd-video-quality-promo-renderer",
      // "ytd-video-primary-info-renderer",
      // "ytd-sentiment-bar-renderer",
      // "ytd-menu-renderer",
      // "ytd-download-button-renderer",
      // "ytd-video-view-count-renderer",
      // "ytd-video-secondary-info-renderer",
      // "ytd-video-owner-renderer",
      // "ytd-structured-description-content-renderer",
      // "ytd-metadata-row-container-renderer",
      // "ytd-video-description-transcript-section-renderer",
      // "ytd-subscribe-button-renderer",
      // "ytd-engagement-panel-section-list-renderer",
      // "ytd-ads-engagement-panel-content-renderer",
      // "ytd-clip-section-renderer",
      // "ytd-clip-creation-text-input-renderer",
      // "ytd-clip-ad-state-renderer",
      // "ytd-video-description-header-renderer",
      // "ytd-expandable-video-description-body-renderer",
      // "ytd-section-list-renderer",
      // "ytd-item-section-renderer",
      // "ytd-continuation-item-renderer",
      // "ytd-thumbnail-overlay-time-status-renderer",
      // "ytd-thumbnail-overlay-now-playing-renderer",
      // "ytd-thumbnail-overlay-resume-playback-renderer",
      // "ytd-comments-header-renderer",
      // "ytd-comment-simplebox-renderer",
      // "ytd-comment-thread-renderer",
      // "ytd-comment-replies-renderer",
      // "ytd-toggle-button-renderer",
      // "ytd-sponsor-comment-badge-renderer",
      // "ytd-channel-legal-info-renderer",
      // "ytd-playlist-sidebar-renderer",
      // "ytd-settings-sidebar-renderer",
      // "ytd-two-column-browse-results-renderer",
      // "ytd-rich-grid-renderer",
      // "ytd-rich-item-renderer",
      // "ytd-thumbnail-overlay-bottom-panel-renderer",
      // "ytd-playlist-video-thumbnail-renderer",
      // "ytd-feed-filter-chip-bar-renderer",
      // "ytd-ghost-grid-renderer",
      // "ytd-mini-guide-entry-renderer",


      // "ytd-lottie-player",
      // "ytd-expander",
      // "ytd-miniplayer-toast",
      // "ytd-video-preview",
      "ytd-watch-metadata",
      // "ytd-watch-engagement-panels",
      // "ytd-channel-name",
      // "ytd-video-meta-block",
      // "ytd-thumbnail-overlay-equalizer"

    ] : []),

    ...(WITH_VIDEO_INFO_TRADITIONAL?[

        // old
        "ytd-expander",
        "ytd-video-secondary-info-renderer",
    ]:[]),

    ...(WITH_COMMENT ? [

      "ytd-section-list-renderer",
      "ytd-item-section-renderer",
      "ytd-continuation-item-renderer",
      "ytd-comments-header-renderer",
      "ytd-comment-simplebox-renderer",
      "ytd-comment-thread-renderer",
      "ytd-comment-replies-renderer",

      "ytd-comment-view-model",
      "ytd-thumbnail-overlay-toggle-button-renderer",
      "ytd-moving-thumbnail-renderer",


      "ytd-comment-reply-dialog-renderer",
      "ytd-thumbnail-overlay-toggle-button-renderer",

      "ytd-moving-thumbnail-renderer",



    ] : []),

    /*

        "ytd-comment-view-model",
        "ytd-thumbnail-overlay-toggle-button-renderer",
        "ytd-moving-thumbnail-renderer",


        "ytd-comment-reply-dialog-renderer",
        "ytd-thumbnail-overlay-toggle-button-renderer",

        "ytd-moving-thumbnail-renderer",

    */



    ...([


      // "ytd-lottie-player",
      // "ytd-expander",
      // "ytd-miniplayer-toast",
      // "ytd-video-preview",
      // "ytd-watch-metadata",
      // "ytd-watch-engagement-panels",
      // "ytd-channel-name",
      // "ytd-video-meta-block",
      // "ytd-thumbnail-overlay-equalizer"


    ]),


    ...(WITH_TOP_RIGHT_BUTTONS ? [

      "ytd-subscription-notification-toggle-button-renderer-next",
      "ytd-topbar-menu-button-renderer",
      "ytd-notification-topbar-button-renderer",

      "ytd-multi-page-menu-renderer",
      "ytd-active-account-header-renderer",
      "ytd-compact-link-renderer",
      "ytd-toggle-theme-compact-link-renderer",

      "ytd-simple-menu-header-renderer",
      "ytd-account-section-list-renderer",
      "ytd-toggle-item-renderer",
      "ytd-account-item-section-renderer",
      "ytd-google-account-header-renderer",
      "ytd-accounts-dialog-header-renderer",
      "ytd-account-item-renderer",
      "ytd-account-item-section-header-renderer"

    ] : [])


    // -----


  ]);

  const whitelist_live_chat = new Set([
    // "ytd-lottie-player",
    // "ytd-expander",
    "ytd-section-list-renderer",
    // "ytd-badge-supported-renderer",
    "ytd-menu-popup-renderer",
    "ytd-menu-service-item-renderer",
    "ytd-menu-navigation-item-renderer"

  ])



  const cssText = () => `

      ytd-engagement-panel-section-list-renderer:empty{
          display: none;
      }

      #related-skeleton :empty {
        display: none;
      }

  `;

  let addCSS = 0;

  const ytDOMWM = new WeakMap();
  Object.defineProperty(Element.prototype, 'usePatchedLifecycles', {
    get() {
      let val = ytDOMWM.get(this);
      if (val === 0) val = false;
      return val;
    },
    set(nv) {


      let add = 0;
      if (window.debug11) console.log(this.is)

      if (location.pathname === '/watch') {

        if (whitelist.has(this.is)) {
        } else {

          add = 1;
        }

      } else if (location.pathname.startsWith('/live_chat')) {
        // console.log(12323)
        if (whitelist_live_chat.has(this.is)) {

        } else {

          add = 1;

        }
      }

      if (add) {

        if (!addCSS) {
          addCSS = 1;
          // document.body.appendChild(document.createElement('ytd-watch-flexy'))
          document.head.appendChild(document.createElement('style')).textContent = cssText();
        }
        debug22.add(this.is)
        nv = 0;
      }

      ytDOMWM.set(this, nv);
      return true;
    },
    enumerable: false,
    configurable: true
  });

})();
