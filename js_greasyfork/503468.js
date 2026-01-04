// ==UserScript==
// @name         YouTube Web Tweaks advanced edition
// @version      2025.12.27
// @description  This script was based on YouTube Web Tweaks lite but converted into ultimate package (which includes stuff from the force rounded corners scripts)
// @author       Joey_JTS
// @license MIT
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @match        https://www.youtube-nocookie.com/embed/*
// @match        https://studio.youtube.com/live_chat*
// @exclude      /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @namespace    https://greasyfork.org/en/users/761382
// @icon         https://www.youtube.com/favicon.ico
// @unwrap
// @run-at       document-idle
// @unwrap
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503468/YouTube%20Web%20Tweaks%20advanced%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/503468/YouTube%20Web%20Tweaks%20advanced%20edition.meta.js
// ==/UserScript==

// Enable strict mode to catch common coding mistakes
"use strict";

// Define the flags to assign to the EXPERIMENT_FLAGS object
const flagsToAssign = {
  // Standard tweaks (YT config editor + Disable animations)
  IS_TABLET: true,
  DISABLE_YT_IMG_DELAY_LOADING: true,
  polymer_verifiy_app_state: false,
  desktop_delay_player_resizing: false,
  web_animated_actions: false,
  web_animated_like: false,
  web_animated_like_lazy_load: false,
  render_unicode_emojis_as_small_images: true,
  smartimation_background: false,
  kevlar_refresh_on_theme_change: false,
  // Disable cinematics (aka ambient lighting)
  kevlar_measure_ambient_mode_idle: false,
  kevlar_watch_cinematics_invisible: false,
  web_cinematic_theater_mode: false,
  web_cinematic_fullscreen: false,
  enable_cinematic_blur_desktop_loading: false,
  kevlar_watch_cinematics: false,
  web_cinematic_masthead: false,
  web_watch_cinematics_preferred_reduced_motion_default_disabled: false
};

const updateFlags = () => {
  // Check if the EXPERIMENT_FLAGS object exists in the window.yt.config_ property chain
  const expFlags = window?.yt?.config_?.EXPERIMENT_FLAGS;

  // If EXPERIMENT_FLAGS is not found, exit the function
  if (!expFlags) return;

  // Assign the defined flags to the EXPERIMENT_FLAGS object
  Object.assign(expFlags, flagsToAssign);
};

// Create a MutationObserver that calls the updateFlags function when changes occur in the document's subtree
const mutationObserver = new MutationObserver(updateFlags);
mutationObserver.observe(document, { subtree: true, childList: true });

(function() {
let css = `
/* Remove all annoyances (including 'shorts' sections) */
ytd-merch-shelf-renderer,
ytd-action-companion-ad-renderer,
ytd-display-ad-renderer,
ytd-video-masthead-ad-advertiser-info-renderer,
ytd-video-masthead-ad-primary-video-renderer,
ytd-in-feed-ad-layout-renderer,
ytd-ad-slot-renderer,
ytd-statement-banner-renderer,
ytd-banner-promo-renderer-background,
ytd-ad-slot-renderer,
ytd-in-feed-ad-layout-renderer,
.ytwPanelAdHeaderImageLockupViewModelHost,
ytd-ads-engagement-panel-content-renderer,
#content.ytd-ads-engagement-panel-content-renderer,
ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer),
.ytd-video-masthead-ad-v3-renderer,
div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
div#main-container.style-scope.ytd-promoted-video-renderer,
div#player-ads.style-scope.ytd-watch-flexy,
#clarify-box,
yt-about-this-ad-renderer,
masthead-ad,
ad-slot-renderer,
yt-mealbar-promo-renderer,
statement-banner-style-type-compact,
ytm-promoted-sparkles-web-renderer,
tp-yt-iron-overlay-backdrop,
#masthead-ad,
#expandable-metadata,
.ytGridShelfViewModelHost,
.ytd-search ytd-shelf-renderer,
[page-subtype='home'] ytd-reel-shelf-renderer,
[page-subtype='home'] ytd-rich-section-renderer,
[page-subtype='subscriptions'] ytd-reel-shelf-renderer,
[page-subtype='subscriptions'] ytd-rich-section-renderer,
ytd-reel-shelf-renderer.ytd-watch-next-secondary-results-renderer.style-scope,
ytm-rich-shelf-renderer, ytm-search ytm-shelf-renderer, ytm-reel-shelf-renderer,
ytm-rich-section-renderer, ytm-pivot-bar-item-renderer:has(> .pivot-shorts),
ytd-guide-entry-renderer[title="Shorts"],
.ytd-mini-guide-entry-renderer[href="/shorts/"] {
display: none !important
}

.style-scope[page-subtype='channels'] ytd-shelf-renderer,
.style-scope[page-subtype='channels'] ytm-shelf-renderer {
display: block !important
}

/* Watch page tweaks (including player tweaks and de-distractions) */
ytd-watch-flexy #related,
.ytp-fullscreen-grid-active.html5-video-player.ended-mode .ytp-fullscreen-grid-main-content,
#comment-teaser,
ytd-horizontal-card-list-renderer[modern-chapters][card-list-style=HORIZONTAL_CARD_LIST_STYLE_TYPE_ENGAGEMENT_PANEL_SECTION],
ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer > #header.ytd-video-description-infocards-section-renderer,
ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer > #action-buttons.ytd-video-description-infocards-section-renderer,
#social-links.ytd-video-description-infocards-section-renderer {
display: none !important
}

ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer {
border-top: 0 !important
}

ytd-watch-metadata.ytd-watch-flexy {
padding-bottom: 36px !important
}

#author-thumbnail.ytd-comment-simplebox-renderer,
#primary #author-thumbnail.ytd-comment-view-model,
#author-thumbnail.ytd-comment-view-model yt-img-shadow.ytd-comment-view-model {
width: 40px !important;
height: 40px !important
}

.ytSubThreadThreadline {
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

#comments.style-scope.ytd-watch-flexy .ytd-item-section-renderer,
.thread-hitbox.ytd-comment-thread-renderer,
ytd-watch-flexy #expanded-threads #author-thumbnail,
ytd-watch-flexy #comments #continuations,
ytd-watch-flexy #comments #spinner {
display: none
}

#comments.style-scope.ytd-watch-flexy .ytd-item-section-renderer:nth-of-type(1),
#comments.style-scope.ytd-watch-flexy .ytd-item-section-renderer:nth-of-type(2),
#comments.style-scope.ytd-watch-flexy .ytd-item-section-renderer:nth-of-type(3),
#comments.style-scope.ytd-watch-flexy .ytd-item-section-renderer:nth-of-type(4),
ytd-watch-flexy:not([full-bleed-player]) #primary #comments .ytd-item-section-renderer:nth-of-type(5),
ytd-watch-flexy:not([full-bleed-player]) #primary #comments .ytd-item-section-renderer:nth-of-type(6),
ytd-watch-flexy #panel-button.style-scope.ytd-comments-header-renderer {
display: block
}

ytd-watch-flexy yt-comment-filter-context-view-model,
#paid-comment-images,
#paid-comment-chip > .yt-pdg-comment-chip-renderer.style-scope,
#paid-comment-background {
display: none !important
}

ytd-watch-flexy #expanded-threads #main.ytd-comment-view-model {
margin-left: 40px !important
}

.ytp-gradient-top, .ytp-gradient-bottom {
height: 50px !important;
padding: 0
}

.ytp-big-mode .ytp-gradient-top, .ytp-big-mode .ytp-gradient-bottom {
height: 61px !important;
height: 0 !important
}

.ytp-big-mode .ytp-gradient-top, .ytp-big-mode .ytp-gradient-bottom {
height: 0 !important
}

.ytp-gradient-top {
background: linear-gradient(to bottom, #0009, #0000) !important
}

.ytp-gradient-bottom {
background: linear-gradient(to top, #0009, #0000) !important
}

.ytd-ghost-grid-renderer,
.info-skeleton,
.meta-skeleton,
#ghost-cards,
#ghost-comment-section,
#related-skeleton {
display: none !important
}

/* More tweaks */
ytm-mobile-topbar-renderer.frosted-glass,
ytm-pivot-bar-renderer.frosted-glass,
ytm-feed-filter-chip-bar-renderer.frosted-glass,
#background.ytd-masthead, #frosted-glass.ytd-app,
#left-arrow-button.ytd-feed-filter-chip-bar-renderer,
#right-arrow-button.ytd-feed-filter-chip-bar-renderer {
background: var(--yt-spec-base-background) !important;
backdrop-filter: none !important;
-webkit-backdrop-filter: none !important
}

#left-arrow.ytd-feed-filter-chip-bar-renderer:after {
background: linear-gradient(to right, var(--yt-spec-base-background) 20%, rgba(255, 255, 255, 0) 80%) !important
}

#right-arrow.ytd-feed-filter-chip-bar-renderer:before {
background: linear-gradient(to left, var(--yt-spec-base-background) 20%, rgba(255, 255, 255, 0) 80%) !important
}

ytd-button-renderer.ytd-feed-filter-chip-bar-renderer {
background: transparent !important
}

div#end.style-scope.ytd-masthead .yt-spec-icon-badge-shape--style-overlay.yt-spec-icon-badge-shape--type-cart-refresh .yt-spec-icon-badge-shape__badge {
color: #fff !important
}

#channel-header-links.style-scope.ytd-c4-tabbed-header-renderer,
.page-header-view-model-wiz__page-header-attribution,
.yt-page-header-view-model__page-header-attribution {
display: none !important
}

#chip-bar.style-scope.ytd-search-header-renderer,
[page-subtype="playlist"] ytd-feed-filter-chip-bar-renderer {
display: none !important
}

ytd-search-header-renderer .yt-spec-button-shape-next--size-m {
flex-direction: row-reverse
}

ytd-search-header-renderer .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-trailing .yt-spec-button-shape-next__icon {
margin-left: -6px;
margin-right: 6px
}

[is-search] ytd-shelf-renderer.ytd-item-section-renderer:not(ytd-channel-renderer + ytd-shelf-renderer),
[is-search] ytd-horizontal-card-list-renderer.ytd-item-section-renderer:not(:first-child),
[is-search] ytd-exploratory-results-renderer.ytd-item-section-renderer {
display: none !important
}

ytd-guide-entry-renderer > a[href*="/channel/UCtFRv9O2AHqOZjjynzrv-xg"],
ytd-guide-entry-renderer > a[href*="/feed/courses_destination"],
ytd-guide-entry-renderer > a[href*="/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ"],
ytd-guide-entry-renderer > a[href*="/channel/UCkYQyvc_i9hXEo4xic9Hh2g"],
ytd-guide-entry-renderer > a[href*="/podcasts"],
ytd-guide-entry-renderer > a[href*="/feed/podcasts"] {
display: none !important
}

#footer.style-scope.ytd-guide-renderer {
display: none !important
}

.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge {
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

// Disable both 'trailer autoplay' and 'automatic pause' features
(function main() {
  'use strict';

  document.createElement = new Proxy(document.createElement, {
    apply(target, that, args) {
      if (args[0]?.toLowerCase() !== 'video') return Reflect.apply(target, that, args);
      const video = Reflect.apply(target, that, args);
      video.addEventListener('loadstart', () => {
        const channel = document.querySelector('ytd-channel-video-player-renderer');
        if (channel?.contains(video)) video.pause();
      }, { passive: true });
      return video;
    },
  });
}());

Object.defineProperties(document, { /*'hidden': {value: false},*/ 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'}, 'webkitVisibilityState': {value: 'visible'} });

setInterval(function(){
    document.dispatchEvent( new KeyboardEvent( 'keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 } ) );
}, 60000);

// Hide the number of notifications to prevent any annoyances
// Save the original descriptor of document.title
const originalTitleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');

// Create a custom getter and setter
Object.defineProperty(document, 'title', {
  get: function() {
    return originalTitleDescriptor.get.call(this);
  },
  set: function(newValue) {
    // Remove the (#) with regex.
    const interceptedValue = newValue.replace(/^\(\d+\)\s?/, "");

    // Call the original setter
    originalTitleDescriptor.set.call(this, interceptedValue);
  }
});

// Other tweaks (includes both memory leak fix and service worker prevention)
(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = '.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge{display:none;}';
    document.head.appendChild(style);
})();

(() => {
  const Promise = ((async () => { })()).constructor;
  const ets = `
      yt-navigate
      yt-navigate-start
      yt-page-type-changed
      yt-player-updated
      yt-page-data-fetched
      yt-navigate-finish`.trim().split(/\s+/)

  const fn = () => {
    if (location.search.includes('pp=')) {
      let oUrl = location.pathname + location.search;
      let nUrl = location.pathname + location.search.replace(/([?&])pp=[^=&?]+\b(\&|)/, (a, p, q) => {
        return !q ? '' : p
      });
      if (oUrl !== nUrl) history.replaceState(history.state, '', nUrl);
    }

  }
  const fh = () => {
    fn();
    Promise.resolve().then(fn);
  }
  for (const et of ets) {

    document.addEventListener(et, fh, false);
  }

})();

if (typeof ServiceWorkerContainer === "function" && typeof ServiceWorkerRegistration === "function" && typeof (ServiceWorkerContainer.prototype || 0).getRegistrations === 'function' && !ServiceWorkerContainer.prototype.register767) {
    const filterSW = (e) => {
        const url = typeof e === 'string' ? e : `${((e || 0).active || 0).scriptURL}`;
        return url.endsWith('/sw.js');
    };
    const makeReject = true;
    const unRegisterAll = () => {
        const sw = ((typeof navigator === 'object' ? navigator : null) || 0).serviceWorker || 0;
        if (sw && typeof sw.getRegistrations === 'function') {
            sw.getRegistrations().then(e => e.length >= 1 && Promise.all(e.filter(filterSW).map(e => e.unregister().catch(console.warn)))).catch(console.warn);
        }
    }
    let i = 0;
    const scriptCollection = document.getElementsByTagName('script');
    (new MutationObserver((mutations, observer) => {
        if (typeof yt !== 'object' || scriptCollection.length === 0) return;
        if (i < 394 && document.readyState === "complete") i = 394;
        if (++i > 400) {
            observer.disconnect();
            return;
        }
        if (typeof navigator !== "object") return;
        if (!('serviceWorker' in navigator) || !navigator.serviceWorker) return;
        if (typeof navigator.serviceWorker.getRegistrations !== "function") return;
        unRegisterAll();
    })).observe(document, { subtree: true, childList: true, attributes: true });
    ServiceWorkerContainer.prototype.register767 = ServiceWorkerContainer.prototype.register;
    ServiceWorkerContainer.prototype.register = function (url, ...args) {
        if (!filterSW(`${url}`)) {
            return this.register767(...arguments);
        }
        if (i < 394) i = 394;
        Promise.resolve().then(unRegisterAll);
        return new Promise((resolve, reject) => {
            makeReject && setTimeout(() => {
                reject(new TypeError("Failed to register a ServiceWorker."));
            }, Math.round(1300 + 1700 * Math.random()) + 0.125);
        });
    };
    Promise.resolve().then(unRegisterAll);
    unRegisterAll();
}


(() => {

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
    const indr = o => insp(o).$ || o.$ || 0;
  
    const getThumbnail = (thumbnails) => {
      let v = 0, n = (thumbnails || 0).length;
      if (!n) return null;
      let j = -1;
      for (let i = 0; i < n; i++) {
        const thumbnail = thumbnails[i];
        let k = thumbnail.width * thumbnail.height;
        if (k > v) {
          j = i;
          v = k;
        }
      }
      if (j >= 0) {
        return thumbnails[j];
      }
      return null;
    }
  
    // let normal = false;
    const ytDOMWM = new WeakMap();
    Object.defineProperty(Element.prototype, 'usePatchedLifecycles', {
      get() {
        let val = ytDOMWM.get(this);
        if (val === 0) val = false;
        if (val && !this.isConnected && !this.classList.contains('style-scope')) val = false;
        return val;
      },
      set(nv) {
        let control = false;
        const nodeName = (this?.nodeName || '').toLowerCase();
        switch (nodeName) {
          case 'yt-attributed-string':
          case 'yt-image':
            if (this?.classList?.length > 0) {
              control = false;
            } else {
              control = true;
            }
            break;
  
          case 'yt-player-seek-continuation':
          // case 'yt-iframed-player-events-relay':
          case 'yt-payments-manager':
          case 'yt-visibility-monitor':
          // case 'yt-invalidation-continuation': // live chat loading
          case 'yt-live-chat-replay-continuation':
          case 'yt-reload-continuation':
          case 'yt-timed-continuation':
  
            control = true;
            break;
          case 'yt-horizontal-list-renderer':
          case 'ytd-rich-grid-slim-media':
          case 'ytd-rich-item-renderer':
          case 'yt-emoji-picker-renderer':
            // if (!normal) {
              // control = true;
            // }
            break;
          case 'yt-img-shadow':
            if (nv) {
              const cnt = insp(this);
              const url0 = getThumbnail(cnt?.__data?.thumbnail?.thumbnails)?.url
              if (url0 && url0.length > 17) {
                // normal = true;
                control = true;
                Promise.resolve(0).then(() => {
                  const url = getThumbnail(cnt?.__data?.thumbnail?.thumbnails)?.url || url0;
                  cnt.$.img.src = `${url}`;
                });
              } else {
                control = false;
              }
            }
            break;
          default:
            control = false;
            // if (nv) {
            //   if (!normal) {
            //     Promise.resolve(0).then(() => {
            //       if (!normal && (this.classList.contains('style-scope') || this.isConnected === true)) {
            //         normal = true;
            //       }
            //     });
            //   }
            // }
        }
        if (control) nv = 0;
        ytDOMWM.set(this, nv);
        return true;
      },
      enumerable: false,
      configurable: true
    });
  
  })();