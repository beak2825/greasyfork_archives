// ==UserScript==
// @name         YouTube Ads Auto-Skipper (Safe Audio)
// @version      2025.08.31
// @description  FXVNPRo Script Manager - Automatically skips YouTube ads, hides ad elements, and restores audio after skipping
// @author       130195
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @namespace    https://greasyfork.org/en/users/1491267
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547494/YouTube%20Ads%20Auto-Skipper%20%28Safe%20Audio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547494/YouTube%20Ads%20Auto-Skipper%20%28Safe%20Audio%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  
  const CHECK_INTERVAL_MS = 200;       
  const SEEK_THRESHOLD_MS = 12000;     
  const LONG_AD_MIN_SECONDS = 25;      
  const SEEK_END_MARGIN_S = 0.8;       
  // ========================================

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const isHidden = el => !el || el.offsetParent === null || el.hidden || el.closest?.("[hidden]");

  const SKIP_BTN_SELECTOR = ".ytp-ad-skip-button, .ytp-ad-skip-button-modern";
  const CLOSE_OVERLAY_SELECTOR = ".ytp-ad-overlay-close-button";
  const ADS_CONTAINER_SELECTOR = ".video-ads.ytp-ad-module";
  const MOVIE_PLAYER_ID = "movie_player";

  const fastSeekFn = HTMLVideoElement.prototype.fastSeek || null;

  
  const audioState = new WeakMap(); // video -> { prevMuted, prevVolume }

  function rememberAudio(video) {
    if (!video) return;
    if (!audioState.has(video)) {
      audioState.set(video, {
        prevMuted: !!video.muted,
        prevVolume: typeof video.volume === "number" ? video.volume : 1
      });
    } else {
      const st = audioState.get(video);
      st.prevMuted = !!video.muted;
      if (typeof video.volume === "number") st.prevVolume = video.volume;
      audioState.set(video, st);
    }
  }

  function restoreAudio(video) {
    try {
      if (!video) return;
      const st = audioState.get(video);
      if (!st) return;

      
      if (st.prevMuted === false) {
        video.muted = false;
        if (typeof st.prevVolume === "number" && st.prevVolume > 0) {
          video.volume = st.prevVolume;
        }

        
        const ytplayer = video.closest("ytd-player, ytmusic-player");
        const cnt = ytplayer && (ytplayer.polymerController || ytplayer.inst || ytplayer);
        const api = (cnt && (cnt.player_ || cnt.playerApi || cnt.getPlayer?.())) || null;
        if (api && typeof api.setMuted === "function") {
          api.setMuted(false);
        }
      }
    } catch (e) {
      // OKie
    }
  }

  
  function tryClickSkip() {
    const adsContainer = $(ADS_CONTAINER_SELECTOR);
    if (!adsContainer) return false;

    const skipBtn = $(`${SKIP_BTN_SELECTOR}`, adsContainer);
    if (skipBtn && !isHidden(skipBtn)) {
      skipBtn.click();
      return true;
    }

    
    const closeOverlayBtn = $(`${CLOSE_OVERLAY_SELECTOR}`, adsContainer);
    if (closeOverlayBtn && !isHidden(closeOverlayBtn)) {
      closeOverlayBtn.click();
      
    }
    return false;
  }

  
  function smartFastSeek(video) {
    try {
      if (!video) return false;
      const dur = Number(video.duration) || 0;
      if (dur <= 0) return false;

      const target = Math.max(0, dur - SEEK_END_MARGIN_S);
      if (fastSeekFn) fastSeekFn.call(video, target);
      else video.currentTime = target;

      return true;
    } catch {
      return false;
    }
  }

  
  function getMoviePlayer(video) {
    return (video && video.closest?.(`#${MOVIE_PLAYER_ID}`)) || document.getElementById(MOVIE_PLAYER_ID);
  }

  
  let adWatch = null; // { video, startedAt, interval, seekTimeout, endedOnce }

  function clearAdWatch() {
    if (!adWatch) return;
    try {
      if (adWatch.interval) clearInterval(adWatch.interval);
      if (adWatch.seekTimeout) clearTimeout(adWatch.seekTimeout);
    } catch {}
    adWatch = null;
  }

  
  function onAdStart(video) {
    clearAdWatch();
    if (!video) return;

    rememberAudio(video);

    adWatch = {
      video,
      startedAt: performance.now(),
      interval: null,
      seekTimeout: null,
      endedOnce: false
    };

    
    adWatch.interval = setInterval(() => {
      tryClickSkip();
    }, CHECK_INTERVAL_MS);

    
    adWatch.seekTimeout = setTimeout(() => {
      const dur = Number(video.duration) || 0;
      const elapsed = (performance.now() - adWatch.startedAt) / 1000;

      
      if (dur >= LONG_AD_MIN_SECONDS || elapsed >= LONG_AD_MIN_SECONDS) {
        
        const stillAd = getMoviePlayer(video)?.classList.contains("ad-showing");
        if (stillAd) smartFastSeek(video);
      }
    }, SEEK_THRESHOLD_MS);
  }

  
  function onAdEnd(video) {
    if (adWatch && adWatch.video === video && !adWatch.endedOnce) {
      adWatch.endedOnce = true;
    }
    clearAdWatch();
    restoreAudio(video);
  }

  
  function observeAdState(video) {
    const moviePlayer = getMoviePlayer(video);
    if (!moviePlayer) return;

    const mo = new MutationObserver(() => {
      const inAd = moviePlayer.classList.contains("ad-showing");
      if (inAd) onAdStart(video);
      else onAdEnd(video);
    });
    mo.observe(moviePlayer, { attributes: true, attributeFilter: ["class"] });

    
    const inAdNow = moviePlayer.classList.contains("ad-showing");
    if (inAdNow) onAdStart(video);
  }

  
  function attachToMainVideo(video) {
    if (!video || video._yt_ad_handler_attached) return;
    video._yt_ad_handler_attached = true;

    
    const onLoadedMeta = () => rememberAudio(video);
    video.addEventListener("loadedmetadata", onLoadedMeta, { passive: true });

    
    const onPlaying = () => {
      
      const mp = getMoviePlayer(video);
      if (mp && !mp.classList.contains("ad-showing")) restoreAudio(video);
    };
    video.addEventListener("playing", onPlaying, { passive: true });

    observeAdState(video);
  }

  
  const pageMO = new MutationObserver(() => {
    const video = $("video.video-stream.html5-main-video");
    if (video) attachToMainVideo(video);
  });
  pageMO.observe(document.documentElement, { childList: true, subtree: true });

  
  const initVideo = $("video.video-stream.html5-main-video");
  if (initVideo) attachToMainVideo(initVideo);
})();