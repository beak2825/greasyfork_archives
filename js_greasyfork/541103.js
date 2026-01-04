// ==UserScript==
// @name         Focused YouTube
// @version      34
// @author       Richard B
// @namespace    https://www.365devnet.eu/focusedyoutube
// @description  Remove ads, shorts, and algorithmic suggestions on YouTube (EN/NL/DE/FR)
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541103/Focused%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/541103/Focused%20YouTube.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Richard B
Permission is hereby granted, free of charge, to any person obtaining a copy...
(license text unchanged)
*/

// -----------------------------
// Config
// -----------------------------
const DEFAULT_SETTINGS = {
  /// homepage redirect ///
  redirectHomepage: false, // Options: 'wl', 'subs', 'lib', false
  hideHomepageButton: false,
  /// homepage suggestions ///
  hideAllSuggestions: false,
  hideAllButOneRow: false,
  hideInfiniteScroll: false,
  /// video player ///
  skipAds: true,
  hideLiveChat: true,
  hideRelatedVideos: true,
  hideMiniPlayerButton: true,
  hidePlayNextButton: true,
  forceCinemaMode: true,
  /// shorts ///
  hideShorts: true,
  redirectShortsPlayer: true,
  /// misc ///
  hideSearchButton: false,
  cleanSearchResults: true,
  hideSponsoredContent: true,
  hideFilterBar: true,
  forceAudioTrack: true,
  preferredAudioLanguage: 'en', // 'en','nl','de','fr','es','it','pt','ja','ko','zh',...
  /// video buttons ///
  hideThanksButton: true,
  hideClipButton: true,
  hideSponsorButton: true,
  /// audio control ///
  blockMultiAudio: true,
  aggressiveAudioControl: true,
  /// layout fixes ///
  removeFirstColumnClass: true,
};

const SETTINGS = DEFAULT_SETTINGS;

// Mark settings in HTML
const HTML = document.documentElement;
Object.keys(SETTINGS).forEach(key => {
  HTML.setAttribute(key, SETTINGS[key]);
});

// -----------------------------
// CSS Blocklists
// -----------------------------
const DESKTOP_BLOCK_LIST = [
  // Ads
  '#masthead-ad',
  'ytd-mealbar-promo-renderer',
  'ytd-carousel-ad-renderer',
  '.ytd-display-ad-renderer',
  'ytd-ad-slot-renderer',
  'div.ytp-ad-overlay-image',
  '.iv-branding.annotation-type-custom.annotation',

  // Shorts
  'html[hideShorts="true"] ytd-rich-section-renderer',
  'html[hideShorts="true"] ytd-reel-shelf-renderer',
  'html[hideShorts="true"] ytd-shelf-renderer',

  // Left Bar Navigation
  'a[href="/feed/trending"]',
  'a[href="/feed/explore"]',
  'html[hideShorts="true"] ytd-guide-section-renderer a[title="Shorts"]',
  'html[hideShorts="true"] ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
  'ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(4)',
  'ytd-guide-section-renderer.ytd-guide-renderer.style-scope:nth-of-type(3)',

  // Homepage
  'html[hideHomepageButton="true"] a:not(#logo)[href="/"]',
  'html[hideAllSuggestions="true"] ytd-browse[page-subtype="home"]',
  'html[hideAllButOneRow="true"] ytd-browse[page-subtype="home"] #header',
  'html[hideAllButOneRow="true"] ytd-browse[page-subtype="home"] ytd-rich-grid-renderer>#contents>ytd-rich-grid-row:nth-child(n+2)',
  'html[hideInfiniteScroll="true"] ytd-browse[page-subtype="home"] ytd-rich-grid-renderer>#contents>ytd-continuation-item-renderer',

  // Video Player
  'html[hideRelatedVideos="true"] #secondary>div.circle',
  'html[hideRelatedVideos="true"] #related',
  'html[hideRelatedVideos="true"] .html5-endscreen',
  'html[hidePlayNextButton="true"] a.ytp-next-button.ytp-button',
  'html[hidePlayNextButton="true"] a.ytp-prev-button.ytp-button',
  'html[hideLiveChat="true"] #chat',
  'html[hideMiniPlayerButton="true"] .ytp-button.ytp-miniplayer-button',
  '.ytd-download-button-renderer.style-scope',

  // Video Action Buttons
  'html[hideThanksButton="true"] ytd-menu-renderer button[aria-label="Thanks"]',
  'html[hideThanksButton="true"] ytd-menu-renderer button[title="Show support with Super Thanks"]',
  'html[hideThanksButton="true"] ytd-menu-renderer yt-button-view-model:has(button[aria-label="Thanks"])',
  'html[hideClipButton="true"] ytd-menu-renderer button[aria-label="Clip"]',
  'html[hideClipButton="true"] ytd-menu-renderer button[title="Clip"]',
  'html[hideClipButton="true"] ytd-menu-renderer yt-button-view-model:has(button[aria-label="Clip"])',
  'html[hideSponsorButton="true"] #sponsor-button',
  'html[hideSponsorButton="true"] ytd-video-owner-renderer #sponsor-button',
  'html[hideSponsorButton="true"] ytd-video-owner-renderer timed-animation-button-renderer',
  'html[hideSponsorButton="true"] ytd-video-owner-renderer button[aria-label="Subscribe Plus"]',

  // Search
  'div.sbdd_a',
  '#container.ytd-search ytd-search-pyv-renderer',
  'html[hideSearchButton="true"] div.ytd-masthead>ytd-searchbox',
  'html[hideSearchButton="true"] div.ytd-masthead>#voice-search-button',

  // Filter Bar (Chips)
  'html[hideFilterBar="true"] ytd-feed-filter-chip-bar-renderer',
  'html[hideFilterBar="true"] #chips-wrapper',
];

const MOBILE_BLOCK_LIST = [
  // Ads
  'ytm-companion-ad-renderer',
  'ytm-promoted-sparkles-web-renderer',

  // Homepage
  'html[hideHomepageButton="true"] div[tab-identifier="FEwhat_to_watch"]',
  'html[hideSearchButton="true"] #header-bar > header > div > button',
  'html[hideSearchButton="true"] #center.style-scope.ytd-masthead',

  // Shorts in search results
  'html[hideShorts="true"] ytm-reel-shelf-renderer.item',

  // Video Player
  'html[hideRelatedVideos="true"] ytm-item-section-renderer[section-identifier="related-items"]>lazy-list',
  'html[hidePlayNextButton="true"] .player-controls-middle-core-buttons > div:nth-child(1)',
  'html[hidePlayNextButton="true"] .player-controls-middle-core-buttons > div:nth-child(5)',

  // Video Action Buttons - Mobile
  'html[hideThanksButton="true"] ytm-menu-renderer button[aria-label="Thanks"]',
  'html[hideThanksButton="true"] ytm-menu-renderer yt-button-view-model:has(button[aria-label="Thanks"])',
  'html[hideClipButton="true"] ytm-menu-renderer button[aria-label="Clip"]',
  'html[hideClipButton="true"] ytm-menu-renderer yt-button-view-model:has(button[aria-label="Clip"])',
  'html[hideSponsorButton="true"] ytm-video-owner-renderer #sponsor-button',
  'html[hideSponsorButton="true"] ytm-video-owner-renderer timed-animation-button-renderer',
  'html[hideSponsorButton="true"] ytm-video-owner-renderer button[aria-label="Subscribe Plus"]',

  // Navigation Bar
  'html[hideHomepageButton="true"] ytm-pivot-bar-item-renderer:nth-child(1)',
  'html[hideShorts="true"] ytm-pivot-bar-item-renderer:nth-child(2)',
  'ytm-chip-cloud-chip-renderer[chip-style="STYLE_EXPLORE_LAUNCHER_CHIP"]',

  // Filter Bar (Chips) - Mobile
  'html[hideFilterBar="true"] ytm-feed-filter-chip-bar-renderer',
];

// -----------------------------
// Utilities
// -----------------------------
function addStyle(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

function addFilterBarSpacingFix() {
  const spacingCSS = `
    /* Fix spacing when filter bar is hidden */
    html[hideFilterBar="true"] ytd-browse[page-subtype="home"] #primary #contents,
    html[hideFilterBar="true"] ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
    html[hideFilterBar="true"] ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer {
      padding-top: 32px !important;
      margin-top: 16px !important;
    }
    html[hideFilterBar="true"] ytd-browse[page-subtype="home"] ytd-rich-grid-row:first-child {
      margin-top: 24px !important;
      padding-top: 16px !important;
    }
    html[hideFilterBar="true"] ytd-browse[page-subtype="home"] #primary > #contents {
      padding-top: 32px !important;
    }
    /* Mobile */
    html[hideFilterBar="true"] ytm-browse[page-subtype="home"] #contents,
    html[hideFilterBar="true"] ytm-rich-grid-renderer #contents {
      padding-top: 24px !important;
      margin-top: 12px !important;
    }
    html[hideFilterBar="true"] ytd-browse[page-subtype="subscriptions"] #primary #contents {
      padding-top: 32px !important;
    }
  `;
  addStyle(spacingCSS);
}

// -----------------------------
// Robust remover for first-column marker (class OR attribute, Shadow DOM aware)
// -----------------------------

// Walk document + nested shadow roots
function* deepElements(root = document) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;

    if (node.nodeType === 1) yield node; // element

    const sr = node.shadowRoot;
    if (sr) for (let i = sr.children.length - 1; i >= 0; i--) stack.push(sr.children[i]);
    if (node.children) for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i]);
  }
}

function clearFirstColumnFlagOn(el) {
  // Remove attribute form (homepage uses this)
  if (el.hasAttribute && el.hasAttribute('is-in-first-column')) {
    el.removeAttribute('is-in-first-column');
  }
  // Remove class form (some pages still use this)
  if (el.classList?.contains('is-in-first-column')) {
    el.classList.remove('is-in-first-column');
  }
}

function stripFirstColumnFlagDeep(root = document) {
  for (const el of deepElements(root)) {
    clearFirstColumnFlagOn(el);
  }
}

function observeDeep(target, cb) {
  const observers = new Set();

  const attach = (rootNode) => {
    if (!rootNode) return;
    const obs = new MutationObserver(cb);
    obs.observe(rootNode, {
      childList: true,
      subtree: true,
      attributes: true,
      // Watch both class and the boolean attribute
      attributeFilter: ['class', 'is-in-first-column'],
    });
    observers.add(obs);
  };

  attach(target);
  if (document.body) attach(document.body);

  // Attach to existing shadow roots
  for (const el of deepElements(document)) {
    if (el.shadowRoot) attach(el.shadowRoot);
  }

  // Discover future shadow roots
  const discover = new MutationObserver(() => {
    for (const el of deepElements(document)) {
      if (el.shadowRoot) attach(el.shadowRoot);
    }
  });
  discover.observe(document.documentElement, { childList: true, subtree: true });

  return () => {
    discover.disconnect();
    observers.forEach(o => o.disconnect());
  };
}

function setupFirstColumnStripping() {
  if (!SETTINGS.removeFirstColumnClass) return;

  const run = () => stripFirstColumnFlagDeep(document);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  observeDeep(document, (mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes') {
        const el = m.target;
        clearFirstColumnFlagOn(el);
      } else if (m.type === 'childList') {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) stripFirstColumnFlagDeep(n);
        });
      }
    }
  });

  // Periodic safety sweep
  setInterval(run, 1200);
}

// -----------------------------
// Audio track control
// -----------------------------
function initializeAudioBlocking() {
  function hookYouTubePlayer() {
    if (!location.hostname.includes('youtube.com')) return;
    const playerElement = document.querySelector('#movie_player');
    if (!playerElement) return;

    try {
      if (playerElement.setAudioTrack && !playerElement.setAudioTrackHooked) {
        playerElement.setAudioTrackHooked = true;
        const original = playerElement.setAudioTrack;
        playerElement.setAudioTrack = function (trackId) {
          if (SETTINGS.aggressiveAudioControl && trackId !== 0) return;
          return original.call(this, trackId);
        };
      }
      if (playerElement.selectAudioTrack && !playerElement.selectAudioTrackHooked) {
        playerElement.selectAudioTrackHooked = true;
        const original = playerElement.selectAudioTrack;
        playerElement.selectAudioTrack = function (trackId) {
          if (SETTINGS.aggressiveAudioControl && trackId !== 0) return;
          return original.call(this, trackId);
        };
      }
      if (playerElement.changeAudioTrack && !playerElement.changeAudioTrackHooked) {
        playerElement.changeAudioTrackHooked = true;
        const original = playerElement.changeAudioTrack;
        playerElement.changeAudioTrack = function (trackId) {
          if (SETTINGS.aggressiveAudioControl && trackId !== 0) return;
          return original.call(this, trackId);
        };
      }
    } catch (_) { /* silent */ }
  }

  const originalCreateElement = document.createElement;
  document.createElement = function (tagName) {
    const element = originalCreateElement.call(this, tagName);
    if (String(tagName).toLowerCase() === 'video') {
      const checkForTracks = setInterval(() => {
        try {
          if (element.audioTracks && element.audioTracks.length > 0) {
            for (let i = 0; i < element.audioTracks.length; i++) {
              element.audioTracks[i].enabled = (i === 0);
            }
            const monitorInterval = setInterval(() => {
              if (!document.contains(element)) return clearInterval(monitorInterval);
              if (element.audioTracks && element.audioTracks.length > 1) {
                const active = Array.from(element.audioTracks).findIndex(t => t.enabled);
                if (active !== 0) {
                  for (let i = 0; i < element.audioTracks.length; i++) {
                    element.audioTracks[i].enabled = (i === 0);
                  }
                }
              }
            }, 2000);
            clearInterval(checkForTracks);
          }
        } catch (_) { /* silent */ }
      }, 500);
      setTimeout(() => clearInterval(checkForTracks), 30000);
    }
    return element;
  };

  hookYouTubePlayer();
  setInterval(hookYouTubePlayer, 2000);

  if (SETTINGS.blockMultiAudio) {
    const audioBlockCSS = `
      html[blockMultiAudio="true"] .ytp-menuitem[role="menuitem"]:has([aria-label*="audio" i]),
      html[blockMultiAudio="true"] .ytp-menuitem[role="menuitem"]:has([aria-label*="sprache" i]),
      html[blockMultiAudio="true"] .ytp-menuitem[role="menuitem"]:has([aria-label*="langue" i]),
      html[blockMultiAudio="true"] .ytp-menuitem[role="menuitem"]:has([aria-label*="track" i]) { display: none !important; }
      html[blockMultiAudio="true"] .ytp-chrome-controls .ytp-button[aria-label*="audio" i] { display: none !important; }
      html[blockMultiAudio="true"] .ytp-panel-menu .ytp-menuitem:has([class*="audio"]) { display: none !important; }
    `;
    addStyle(audioBlockCSS);
  }
}

// -----------------------------
// Dynamic behaviors
// -----------------------------
function redirectHomepage() {
  if (location.pathname === '/') {
    if (SETTINGS.redirectHomepage === 'wl')   location.replace('/playlist/?list=WL');
    if (SETTINGS.redirectHomepage === 'subs') location.replace('/feed/subscriptions');
    if (SETTINGS.redirectHomepage === 'lib')  location.replace('/feed/library');
  }
}

function redirectShortsPlayer() {
  if (location.pathname.startsWith('/shorts')) {
    const redirPath = location.pathname.replace('shorts', 'watch');
    location.replace(redirPath);
  }
}

function disableRelatedAutoPlay() {
  document.querySelectorAll('.ytp-autonav-toggle-button[aria-checked=true]').forEach(e => e.offsetParent && e.click());
  document.querySelectorAll('.ytm-autonav-toggle-button-container[aria-pressed=true]').forEach(e => e.offsetParent && e.click());
}

function forceAudioTrack() {
  if (!location.pathname.startsWith('/watch')) return;
  const video = document.querySelector('.html5-main-video');
  if (!video || !video.audioTracks) return;

  if (video.audioTracks.length > 1) {
    const preferred = String(SETTINGS.preferredAudioLanguage || '').toLowerCase();
    let target = 0;
    for (let i = 0; i < video.audioTracks.length; i++) {
      const lang = (video.audioTracks[i].language || '').toLowerCase();
      if (lang === preferred || lang.startsWith(preferred + '-')) { target = i; break; }
    }
    for (let i = 0; i < video.audioTracks.length; i++) video.audioTracks[i].enabled = (i === target);
  }
}

function forceCinemaMode() {
  if (!location.pathname.startsWith('/watch')) return;
  const pageManager = document.querySelector('ytd-watch-flexy');
  if (pageManager && pageManager.hasAttribute('theater')) return;

  const clickIfVisible = sel => {
    const el = document.querySelector(sel);
    if (el && el.offsetParent) el.click();
  };
  clickIfVisible('.ytp-size-button');
  clickIfVisible('button[aria-keyshortcuts="t"]');
  clickIfVisible('.ytp-button[data-tooltip-target-id*="theater"]');
}

function skipVideoAds() {
  if (!location.pathname.startsWith('/watch')) return;

  document.querySelector(".ytp-ad-skip-button-slot button,.ytp-ad-overlay-close-button")?.click();

  const adShowing = document.querySelector('.ad-showing');
  if (adShowing) {
    const video = document.querySelector('.html5-main-video');
    if (video && !isNaN(video.duration)) {
      video.play();
      video.currentTime = video.duration;
    }
  }
}

function cleanSearchResults() {
  if (!location.pathname.startsWith('/results')) return;
  const badges = document.querySelectorAll('ytm-badge');
  badges.forEach(badge => {
    if (badge.innerText === '相關影片' || badge.innerText === '相关视频' || badge.innerText === 'Related') {
      badge.closest('ytm-video-with-context-renderer')?.remove();
    }
  });
}

function runDynamicSettings() {
  if (SETTINGS.redirectHomepage) redirectHomepage();
  if (SETTINGS.redirectShortsPlayer) redirectShortsPlayer();
  if (SETTINGS.cleanSearchResults) cleanSearchResults();
  if (SETTINGS.skipAds) skipVideoAds();
  if (SETTINGS.hideRelatedVideos) disableRelatedAutoPlay();
  if (SETTINGS.forceCinemaMode) forceCinemaMode();
  if (SETTINGS.forceAudioTrack) forceAudioTrack();
  setTimeout(runDynamicSettings, 500);
}

// -----------------------------
// Boot
// -----------------------------
(function init() {
  if (location.hostname.startsWith('www.')) {
    addStyle(DESKTOP_BLOCK_LIST.map(e => `${e} {display: none !important}`).join('\n'));
    addFilterBarSpacingFix();
  }
  if (location.hostname.startsWith('m.')) {
    addStyle(MOBILE_BLOCK_LIST.map(e => `${e} {display: none !important}`).join('\n'));
    addFilterBarSpacingFix();
  }

  if (SETTINGS.blockMultiAudio) {
    initializeAudioBlocking();
  }

  setupFirstColumnStripping();     // <— robust removal for .is-in-first-column
  runDynamicSettings();
})();