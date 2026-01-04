// ==UserScript==
// @name         Remove Gradients From Video Controls - All Sites
// @description  Removes gradients from HTML5 video players + other video players controls on all sites
// @namespace    https://github.com/BD9Max/userscripts
// @icon         https://github.com/BD9Max/userscripts/raw/refs/heads/main/media/icons/remove_video_player_gradients.png
// @version      1.3
// @run-at       document-end
// @author       DB9Max
// @grant        GM_addStyle
// @license      MIT
// @match        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/542321/Remove%20Gradients%20From%20Video%20Controls%20-%20All%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/542321/Remove%20Gradients%20From%20Video%20Controls%20-%20All%20Sites.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Inject all CSS rules
  GM_addStyle(`
    /* === Native HTML5 Video Controls === */
    video::-webkit-media-controls-panel,
    video::-webkit-media-controls-enclosure,
    video::-webkit-media-controls-overlay-enclosure,
    video::-webkit-media-controls-timeline-container,
    video::-webkit-media-controls {
      background: transparent !important;
      background-image: none !important;
      background-color: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-shadow: none !important;
    }

    video::-moz-media-controls {
      background: transparent !important;
      background-image: none !important;
    }

    video {
      background: transparent !important;
    }

    /* === Plyr === */
    .plyr__controls,
    .plyr__controls::before {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === Video.js === */
    .vjs-control-bar,
    .vjs-control-bar::before,
    .vjs-control-bar::after {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === JW Player === */
    .jw-controlbar,
    .jw-controlbar::before,
    .jw-controlbar::after {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === Vidstack / Media Chrome / Vime === */
    media-controller::part(controls),
    media-controller::part(control-bar),
    .vds-control-bar {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === Ruffle (Flash emulator) === */
    ruffle-player::part(controls),
    .ruffle-control-bar {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === TikTok === */
    .tiktok-1itcwxg-DivControlsContainer,
    .tiktok-14i2jc-DivSeekBarBackground,
    .tiktok-1itcwxg-DivControlsContainer::before,
    .tiktok-1itcwxg-DivControlsContainer::after {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === Instagram (Web & Mobile Web) === */
    .x1lliihq,
    .x1i10hfl::before,
    .x1i10hfl::after,
    .xds687c,
    .x1ypdohk {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === Twitter / X === */
    div[data-testid="videoPlayer"]::before,
    div[data-testid="videoPlayer"]::after,
    .r-1oszu61,
    .r-14lw9ot {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === Facebook === */
    .x6s0dn4,
    .x1n2onr6,
    .x5yr21d,
    .x78zum5,
    .x1pi30zi {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === Vimeo === */
    .vp-controls,
    .vp-controls::before,
    .vp-bottom-gradient,
    .vp-gradient-top,
    .vp-gradient-bottom {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* === Dailymotion === */
    .dmp_ControlBar,
    .dmp_ControlBar::before,
    .dmp_Overlay,
    .dmp_UIOverlay {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
    }
  `);

  // Gradient-heavy selectors for dynamic cleanup
  const gradientSelectors = [
    /* YouTube */
    '.ytp-gradient-top',
    '.ytp-gradient-bottom',

    /* Plyr */
    '.plyr__controls',

    /* Video.js */
    '.vjs-control-bar',

    /* JW Player */
    '.jw-controlbar',

    /* Vidstack / Media Chrome */
    'media-controller::part(controls)',
    'media-controller::part(control-bar)',
    '.vds-control-bar',

    /* Ruffle */
    'ruffle-player::part(controls)',
    '.ruffle-control-bar',

    /* TikTok */
    '.tiktok-1itcwxg-DivControlsContainer',
    '.tiktok-14i2jc-DivSeekBarBackground',

    /* Instagram */
    '.x1lliihq',
    '.xds687c',
    '.x1ypdohk',

    /* Twitter / X */
    'div[data-testid="videoPlayer"]',
    '.r-1oszu61',
    '.r-14lw9ot',

    /* Facebook */
    '.x6s0dn4',
    '.x1n2onr6',
    '.x5yr21d',
    '.x78zum5',
    '.x1pi30zi',

    /* Vimeo */
    '.vp-controls',
    '.vp-bottom-gradient',
    '.vp-gradient-top',
    '.vp-gradient-bottom',

    /* Dailymotion */
    '.dmp_ControlBar',
    '.dmp_Overlay',
    '.dmp_UIOverlay'
  ];

  function removeGradientStyles() {
    gradientSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        try {
          el.style.background = 'transparent';
          el.style.backgroundImage = 'none';
          el.style.boxShadow = 'none';
        } catch (e) {}
      });
    });
  }

  function forceRemoveGradients() {
    document.querySelectorAll('video').forEach(video => {
      video.style.setProperty('background', 'transparent', 'important');
      try {
        const shadowRoot = video.shadowRoot;
        if (shadowRoot) {
          shadowRoot.querySelectorAll('*').forEach(el => {
            el.style?.setProperty('background', 'transparent', 'important');
            el.style?.setProperty('background-image', 'none', 'important');
          });
        }
      } catch (e) {}
    });
  }

  // Run cleanup
  function runCleanup() {
    forceRemoveGradients();
    removeGradientStyles();
  }

  // Initial pass
  runCleanup();

  // Observe DOM changes
  const observer = new MutationObserver(runCleanup);
  observer.observe(document.body, { childList: true, subtree: true });

  // Desktop and mobile event triggers
  document.addEventListener('DOMContentLoaded', runCleanup);
  window.addEventListener('load', runCleanup);
  document.addEventListener('loadedmetadata', runCleanup, true);

  // Mobile-specific interactions
  window.addEventListener('touchstart', runCleanup, { passive: true });
  window.addEventListener('pointerdown', runCleanup, { passive: true });

})();