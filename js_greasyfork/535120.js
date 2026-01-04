// ==UserScript==
// @name         YouTube - Hide force-pushed low-view videos
// @namespace    https://github.com/BobbyWibowo
// @version      1.3.5
// @description  Hide videos matching thresholds, in home page, and watch page's sidebar. CONFIGURABLE!
// @author       Bobby Wibowo
// @license      MIT
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/sentinel-js@0.0.7/dist/sentinel.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535120/YouTube%20-%20Hide%20force-pushed%20low-view%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/535120/YouTube%20-%20Hide%20force-pushed%20low-view%20videos.meta.js
// ==/UserScript==

/* global sentinel */

(function () {
  'use strict';

  const _LOG_TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });

  const log = (message, ...args) => {
    const prefix = `[${_LOG_TIME_FORMAT.format(Date.now())}]: `;
    if (typeof message === 'string') {
      return console.log(prefix + message, ...args);
    } else {
      return console.log(prefix, message, ...args);
    }
  };

  /** CONFIG **/

  /* It's recommended to edit these values through your userscript manager's storage/values editor.
   * Visit YouTube once after installing the script to allow it to populate its storage with default values.
   * Especially necessary for Tampermonkey to show the script's Storage tab when Advanced mode is turned on.
   */
  const ENV_DEFAULTS = {
    MODE: 'PROD',

    VIEWS_THRESHOLD: 999,
    VIEWS_THRESHOLD_NEW: null, // requires "TEXT_BADGE_NEW" to be set properly depending on your locale
    VIEWS_THRESHOLD_LIVE: null, // based on the livestream's accumulative views count reported by YouTube API

    TEXT_BADGE_NEW: 'New',

    ALLOWED_CHANNEL_IDS: [],

    DISABLE_STYLES: false,
    DISABLE_HIDE_PROCESSING: false,

    SELECTORS_ALLOWED_PAGE: null,
    SELECTORS_VIDEO: null
  };

  /* Hard-coded preset values.
   * Specifying custom values will extend instead of replacing them.
   */
  const PRESETS = {
    // To ensure any custom values will be inserted into array, or combined together if also an array.
    ALLOWED_CHANNEL_IDS: [],

    // Keys that starts with "SELECTORS_", and in array, will automatically be converted to single-line strings.
    SELECTORS_ALLOWED_PAGE: [
      'ytd-browse[page-subtype="home"]:not([hidden])', // home
      'ytd-watch-flexy:not([hidden])' // watch page
    ],
    SELECTORS_VIDEO: [
      'ytd-compact-video-renderer:has(#dimissible)',
      'ytd-rich-item-renderer:has(#dismissible, yt-lockup-view-model, ytm-shorts-lockup-view-model-v2)',
      'ytd-item-section-renderer yt-lockup-view-model',
      '#items > ytm-shorts-lockup-view-model-v2',
      'ytd-player .ytp-suggestion-set',
      'ytd-player .ytp-ce-video.ytp-ce-element-show'
    ]
  };

  const ENV = {};

  // Store default values.
  for (const key of Object.keys(ENV_DEFAULTS)) {
    const stored = GM_getValue(key);
    if (stored === null || stored === undefined) {
      ENV[key] = ENV_DEFAULTS[key];
      GM_setValue(key, ENV_DEFAULTS[key]);
    } else {
      ENV[key] = stored;
    }
  }

  const _DOCUMENT_FRAGMENT = document.createDocumentFragment();
  const queryCheck = selector => _DOCUMENT_FRAGMENT.querySelector(selector);

  const isSelectorValid = selector => {
    try {
      queryCheck(selector);
    } catch {
      return false;
    }
    return true;
  };

  const CONFIG = {};

  // Extend hard-coded preset values with user-defined custom values, if applicable.
  for (const key of Object.keys(ENV)) {
    if (key.startsWith('SELECTORS_')) {
      if (Array.isArray(PRESETS[key])) {
        CONFIG[key] = PRESETS[key].join(', ');
      } else {
        CONFIG[key] = PRESETS[key] || '';
      }
      if (ENV[key]) {
        CONFIG[key] += `, ${Array.isArray(ENV[key]) ? ENV[key].join(', ') : ENV[key]}`;
      }
      if (!isSelectorValid(CONFIG[key])) {
        console.error(`${key} contains invalid selector =`, CONFIG[key]);
        return;
      }
    } else if (Array.isArray(PRESETS[key])) {
      CONFIG[key] = PRESETS[key];
      if (ENV[key]) {
        const customValues = Array.isArray(ENV[key]) ? ENV[key] : ENV[key].split(',').map(s => s.trim());
        CONFIG[key].push(...customValues);
      }
    } else {
      CONFIG[key] = PRESETS[key] || null;
      if (ENV[key] !== null) {
        CONFIG[key] = ENV[key];
      }
    }
  }

  let logDebug = () => {};
  if (CONFIG.MODE !== 'PROD') {
    logDebug = log;
    for (const key of Object.keys(CONFIG)) {
      logDebug(`${key} =`, CONFIG[key]);
    }
  }

  /** STYLES **/

  // Styling that must always be enabled for the script's core functionality.
  GM_addStyle(/*css*/`
    [data-noview_threshold_unmet] {
      display: none !important;
    }
  `);

  if (!CONFIG.DISABLE_HIDE_PROCESSING) {
    GM_addStyle(/*css*/`
      :is(${CONFIG.SELECTORS_ALLOWED_PAGE}) :is(${CONFIG.SELECTORS_VIDEO}) {
        transition: 0.2s opacity;
      }

      /* Visually hide, while still letting the element occupy the space.
      * To prevent YouTube from infinitely loading more videos. */
      :is(${CONFIG.SELECTORS_ALLOWED_PAGE}) :is(${CONFIG.SELECTORS_VIDEO}):not([data-noview_views], [data-noview_allowed_channel]) {
        visibility: hidden;
        opacity: 0;
      }
    `);
  }

  if (!CONFIG.DISABLE_STYLES) {
    GM_addStyle(/*css*/`
      [data-noview_allowed_channel] #metadata-line span:nth-last-child(2 of .inline-metadata-item),
      [data-noview_allowed_channel] yt-content-metadata-view-model div:nth-child(2) span:nth-last-child(2 of .yt-core-attributed-string),
      [data-noview_allowed_channel] .ytp-videowall-still-info-author {
        font-style: italic !important;
      }

      /* Fix YouTube's home styling when some videos are hidden. */
      ytd-browse[page-subtype="home"] ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column],
      ytd-browse[page-subtype="home"] #content.ytd-rich-section-renderer {
        margin-left: calc(var(--ytd-rich-grid-item-margin) / 2) !important;
      }

      ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer {
        padding-left: calc(var(--ytd-rich-grid-item-margin) / 2 + var(--ytd-rich-grid-gutter-margin)) !important;
      }
    `);
  }

  /** UTILS **/

  const waitPageLoaded = () => {
    return new Promise(resolve => {
      if (document.readyState === 'complete' ||
        document.readyState === 'loaded' ||
        document.readyState === 'interactive') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', resolve);
      }
    });
  };

  class DataCache {
    cache;
    init;
    cacheLimit;

    constructor (init, cacheLimit = 2000) {
      this.cache = {};
      this.init = init;
      this.cacheLimit = cacheLimit;
    }

    getFromCache (key) {
      return this.cache[key];
    }

    setupCache (key) {
      if (!this.cache[key]) {
        this.cache[key] = {
          ...this.init(),
          lastUsed: Date.now()
        };

        if (Object.keys(this.cache).length > this.cacheLimit) {
          const oldest = Object.entries(this.cache).reduce((a, b) => a[1].lastUsed < b[1].lastUsed ? a : b);
          delete this.cache[oldest[0]];
        }
      }

      return this.cache[key];
    }

    cacheUsed (key) {
      if (this.cache[key]) this.cache[key].lastUsed = Date.now();

      return !!this.cache[key];
    }
  }

  const isPartialElementInViewport = element => {
    if (element.style.display === 'none') {
      return false;
    }

    const rect = element.getBoundingClientRect();

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horzInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    return (vertInView && horzInView);
  };

  let intersectionObserver = null;

  let currentPage = null;

  window.addEventListener('yt-navigate-start', event => {
    currentPage = null;

    // Clear previous intersection observer.
    if (intersectionObserver !== null) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }
  });

  window.addEventListener('yt-navigate-finish', event => {
    // Determine if navigated page is allowed.
    currentPage = document.querySelector(CONFIG.SELECTORS_ALLOWED_PAGE);

    if (!currentPage) {
      logDebug('Page not allowed.');
      return;
    }

    // Re-init intersection observer.
    intersectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          doVideoWrapped(entry.target);
          intersectionObserver.unobserve(entry.target);
        }
      }
    }, { delay: 100, threshold: 0 });
    logDebug('Page allowed, waiting for videos\u2026');
  });

  /** MAIN **/

  const emptyMetadata = {
    channelIDs: null,
    author: null,
    isLive: null,
    isUpcoming: null,
    viewCount: null
  };

  const fetchVideoDataDesktopClient = async videoID => {
    const url = 'https://www.youtube.com/youtubei/v1/player';
    const data = {
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20230327.07.00'
        }
      },
      videoId: videoID
    };

    try {
      const result = await fetch(url, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });

      if (result.ok) {
        const response = await result.json();
        const newVideoID = response?.videoDetails?.videoId ?? null;
        if (newVideoID !== videoID) {
          return structuredClone(emptyMetadata);
        }

        const channelIds = new Set();
        if (response?.videoDetails?.channelId) {
          channelIds.add(response?.videoDetails?.channelId);
        }

        // To get IDs of parent channel for auto-generated topic channels.
        const subscribeChannelIds = response?.playerConfig?.webPlayerConfig?.webPlayerActionsPorting?.subscribeCommand?.subscribeEndpoint?.channelIds;
        if (subscribeChannelIds?.length) {
          for (const id of subscribeChannelIds) {
            channelIds.add(id);
          }
        }

        const author = response?.videoDetails?.author ?? null;
        const isLive = response?.videoDetails?.isLive ?? null;
        const isUpcoming = response?.videoDetails?.isUpcoming ?? null;
        const viewCount = response?.videoDetails?.viewCount ?? null;
        const playabilityStatus = response?.playabilityStatus?.status ?? null;

        return {
          channelIDs: channelIds,
          author,
          isLive,
          isUpcoming,
          viewCount,
          playabilityStatus
        };
      }
    } catch (e) {}

    return structuredClone(emptyMetadata);
  };

  const videoMetadataCache = new DataCache(() => (structuredClone(emptyMetadata)));

  const waitingForMetadata = [];

  function setupMetadataOnRecieve () {
    const onMessage = event => {
      if (event.data?.type === 'youtube-noview:video-metadata-received') {
        const data = event.data;
        if (data.videoID && data.metadata && !videoMetadataCache.getFromCache(data.videoID)) {
          const metadata = data.metadata;
          const cachedData = videoMetadataCache.setupCache(data.videoID);

          cachedData.channelIDs = metadata.channelIDs;
          cachedData.author = metadata.author;
          cachedData.isLive = metadata.isLive;
          cachedData.isUpcoming = metadata.isUpcoming;
          cachedData.viewCount = metadata.viewCount;

          const index = waitingForMetadata.findIndex((item) => item.videoID === data.videoID);
          if (index !== -1) {
            waitingForMetadata[index].callbacks.forEach((callback) => {
              callback(data.metadata);
            });

            waitingForMetadata.splice(index, 1);
          }
        }
      } else if (event.data?.type === 'youtube-noview:video-metadata-requested' &&
        !(event.data.videoID in activeRequests)) {
        waitingForMetadata.push({
          videoID: event.data.videoID,
          callbacks: []
        });
      }
    };

    window.addEventListener('message', onMessage);
  }

  const activeRequests = {};

  const fetchVideoMetadata = async videoID => {
    const cachedData = videoMetadataCache.getFromCache(videoID);
    if (cachedData && cachedData.viewCount !== null) {
      return cachedData;
    }

    let waiting = waitingForMetadata.find(item => item.videoID === videoID);
    if (waiting) {
      return new Promise((resolve) => {
        if (!waiting) {
          waiting = {
            videoID,
            callbacks: []
          };

          waitingForMetadata.push(waiting);
        }

        waiting.callbacks.push(metadata => {
          videoMetadataCache.cacheUsed(videoID);
          resolve(metadata);
        });
      });
    }

    try {
      const result = activeRequests[videoID] ?? (async () => {
        window.postMessage({
          type: 'youtube-noview:video-metadata-requested',
          videoID
        }, '*');

        const metadata = await fetchVideoDataDesktopClient(videoID).catch(() => null);

        if (metadata) {
          const videoCache = videoMetadataCache.setupCache(videoID);
          videoCache.channelIDs = metadata.channelIDs;
          videoCache.author = metadata.author;
          videoCache.isLive = metadata.isLive;
          videoCache.isUpcoming = metadata.isUpcoming;
          videoCache.viewCount = metadata.viewCount;

          // Remove this from active requests after it's been dealt with in other places
          setTimeout(() => delete activeRequests[videoID], 500);

          window.postMessage({
            type: 'youtube-noview:video-metadata-received',
            videoID,
            metadata: videoCache
          }, '*');

          return videoCache;
        }

        const _emptyMetadata = structuredClone(emptyMetadata);
        window.postMessage({
          type: 'youtube-noview:video-metadata-received',
          videoID,
          metadata: _emptyMetadata
        }, '*');
        return _emptyMetadata;
      })();

      activeRequests[videoID] = result;
      return await result;
    } catch (e) { }

    return structuredClone(emptyMetadata);
  };

  const getVideoID = element => {
    const videoLink = (element.matches('a[href]') && element) || element.querySelector('a[href]');
    if (!videoLink) {
      return null;
    }

    const url = videoLink.href;

    let urlObject;
    try {
      urlObject = new URL(url);
    } catch (error) {
      log('Unable to parse URL:', url);
      return null;
    }

    let videoID;
    if (urlObject.searchParams.has('v') && ['/watch', '/watch/'].includes(urlObject.pathname)) {
      videoID = urlObject.searchParams.get('v');
    } else if (urlObject.pathname.match(/^\/embed\/|^\/shorts\/|^\/live\//)) {
      try {
        const id = urlObject.pathname.split('/')[2];
        if (id?.length >= 11) {
          videoID = id.slice(0, 11);
        }
      } catch (e) {
        log('Video ID not valid for:', url);
      }
    }

    return videoID;
  };

  const getVideoData = async element => {
    const videoID = getVideoID(element);
    if (!videoID) {
      return null;
    }

    let channelId;
    let metadata = {};

    // YouTube newest design.
    const lockupViewModel = (element.tagName === 'YT-LOCKUP-VIEW-MODEL' && element) ||
      element.querySelector('yt-lockup-view-model');

    if (lockupViewModel) {
      if (CONFIG.ALLOWED_CHANNEL_IDS.length) {
        // Attempt to get channel ID early through DOM properties.
        const symbols = Object.getOwnPropertySymbols(lockupViewModel.componentProps?.data ?? {});
        if (symbols.length) {
          const _metadata = lockupViewModel.componentProps.data[symbols[0]].value?.metadata?.lockupMetadataViewModel;
          channelId = _metadata?.image?.decoratedAvatarViewModel?.rendererContext?.commandContext?.onTap
            ?.innertubeCommand?.browseEndpoint?.browseId;
        }
      }
    } else {
      // YouTube older design.
      // Live videos will fallback to YouTube API method.
      const dismissible = element.querySelector('#dismissible');
      if (dismissible) {
        const data = dismissible.__dataHost?.__data?.data;
        if (CONFIG.ALLOWED_CHANNEL_IDS.length) {
          // Attempt to get channel ID early through DOM properties.
          channelId = data?.owner?.navigationEndpoint?.browseEndpoint?.browseId ||
            data?.longBylineText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId;
        }

        // For older design, views count can also be parsed through DOM properties.
        const views = data?.viewCountText?.simpleText;
        if (views) {
          metadata.viewCount = 0;
          const digits = views.match(/\d/g);
          if (digits !== null) {
            metadata.viewCount = Number(digits.join(''));
          }
        }
      }
    }

    if (channelId) {
      metadata.channelIDs = new Set([channelId]);
      // If early-found channel ID is allowed, skip onward.
      if (CONFIG.ALLOWED_CHANNEL_IDS.includes(channelId)) {
        logDebug('Skipped metadata fetch due to allowed channel', element);
        return { videoID, allowedChannel: channelId, metadata };
      }
    }

    if (typeof metadata?.viewCount === 'undefined') {
      // Fetch metadata via YouTube API.
      metadata = await fetchVideoMetadata(videoID);
    }

    return { videoID, metadata };
  };

  const isVideoNew = element => {
    if (element.tagName === 'YT-LOCKUP-VIEW-MODEL') {
      const badges = Array.from(element.querySelectorAll('yt-content-metadata-view-model .badge-shape-wiz__text'));
      return badges.some(badge => badge?.innerText === CONFIG.TEXT_BADGE_NEW);
    } else {
      return Boolean(element.querySelector(`#dismissible .badge[aria-label="${CONFIG.TEXT_BADGE_NEW}"]`));
    }
  };

  const doVideo = async element => {
    const data = await getVideoData(element);
    if (!data) {
      return false;
    }

    element.dataset.noview_id = data.videoID;

    if (CONFIG.ALLOWED_CHANNEL_IDS.length) {
      delete element.dataset.noview_allowed_channel;
      if (data.allowedChannel) {
        // Through early check via DOM properties.
        element.dataset.noview_channel_ids = JSON.stringify([data.allowedChannel]);
        element.dataset.noview_allowed_channel = true;
        return false;
      } else if (data.metadata?.channelIDs?.size) {
        // Through metadata fetch from API.
        element.dataset.noview_channel_ids = JSON.stringify([...data.metadata.channelIDs]);
        if (CONFIG.ALLOWED_CHANNEL_IDS.some(id => data.metadata.channelIDs.has(id))) {
          element.dataset.noview_allowed_channel = true;
          return false;
        }
      }
    }

    if (data.metadata?.isUpcoming) {
      return false;
    }

    if (!data.metadata || data.metadata.viewCount === null) {
      logDebug('Unable to access views data', element);
      return false;
    }

    const viewCount = parseInt(data.metadata.viewCount);
    let thresholdUnmet = null;

    if (CONFIG.VIEWS_THRESHOLD_LIVE !== null && data.metadata.isLive) {
      if (viewCount <= CONFIG.VIEWS_THRESHOLD_LIVE) {
        thresholdUnmet = CONFIG.VIEWS_THRESHOLD_LIVE;
      }
    } else {
      // Do not look for New badge if thresholds are identical.
      const isNew = CONFIG.VIEWS_THRESHOLD_NEW !== null &&
        (CONFIG.VIEWS_THRESHOLD_NEW !== CONFIG.VIEWS_THRESHOLD) &&
        isVideoNew(element);

      if (isNew) {
        if (viewCount <= CONFIG.VIEWS_THRESHOLD_NEW) {
          thresholdUnmet = CONFIG.VIEWS_THRESHOLD_NEW;
        }
      } else {
        if (viewCount <= CONFIG.VIEWS_THRESHOLD) {
          thresholdUnmet = CONFIG.VIEWS_THRESHOLD;
        }
      }
    }

    if (thresholdUnmet !== null) {
      log(`Hid video (${viewCount} <= ${thresholdUnmet})`, element);
      element.dataset.noview_threshold_unmet = thresholdUnmet;
    }

    element.dataset.noview_views = viewCount;
    return true;
  };

  const waitForVideoIDChange = async element => {
    const oldID = element.dataset.noview_id || getVideoID(element);
    if (!oldID) {
      return false;
    }

    const newID = await new Promise(resolve => {
      let interval = null;
      const findNewID = () => {
        // Exit if the element is no longer in DOM.
        if (!document.body.contains(element)) {
          clearInterval(interval);
          return resolve();
        }
        // Only do thorough checks if the element is in the currently visible page.
        if (currentPage?.contains(element)) {
          const newID = getVideoID(element);
          if (oldID !== newID) {
            clearInterval(interval);
            return resolve(newID);
          }
        }
      };
      findNewID();
      interval = setInterval(findNewID, 1000);
    });

    if (newID) {
      delete element.dataset.noview_id;
      delete element.dataset.noview_views;
      delete element.dataset.noview_threshold_unmet;
      delete element.dataset.noview_channel_ids;
      delete element.dataset.noview_allowed_channel;
      doVideoWrapped(element);
    }
  };

  const doVideoWrapped = async element => {
    return doVideo(element)
      .finally(() => {
        if (typeof element.dataset.noview_views === 'undefined') {
          element.dataset.noview_views = '';
        }
        waitForVideoIDChange(element);
      });
  };

  const processNewElement = element => {
    if (isPartialElementInViewport(element)) {
      doVideoWrapped(element);
    } else {
      // If not in viewport, observe intersection.
      intersectionObserver.observe(element);
    }
  };

  /** SENTINEL */

  waitPageLoaded().then(() => {
    setupMetadataOnRecieve();

    sentinel.on(CONFIG.SELECTORS_VIDEO, element => {
      if (currentPage?.contains(element)) {
        processNewElement(element);
      }
    });
  });
})();