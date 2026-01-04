// ==UserScript==
// @name         YouTube Music Spinning Album Art (Turntable Base)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Spins album artwork with grooves, shine, spindle, and a turntable-style base behind the record. Syncs with play/pause state on YouTube Music.
// @author       Chesley
// @match        https://music.youtube.com/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533665/YouTube%20Music%20Spinning%20Album%20Art%20%28Turntable%20Base%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533665/YouTube%20Music%20Spinning%20Album%20Art%20%28Turntable%20Base%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID = 'spinning-cropped-art-style';
  let initialized = false;
  let lastImgKey = null;
  let songObserver = null;
  let playListenersBound = false;

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        /* Animation */
        --album-spin-duration: 8s;
        --shine-duration: 6s;

        /* Turntable base sizing (relative to player area) */
        --base-size: 115%; /* Decreased from 120% to 115% */

        /* Thumbnail ring & effects */
        --thumb-ring: rgba(255, 255, 255, 0.2);
        --thumb-glow: rgba(255, 255, 255, 0.2);
      }

      @keyframes spinAlbum {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes shineMove {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        ytmusic-player #thumbnail img,
        ytmusic-player #thumbnail .shine {
          animation: none !important;
        }
      }

      /* --- Player container & Turntable Base --- */
      ytmusic-player {
        position: relative;        /* needed for ::after positioning */
        background: transparent;
        contain: layout paint style;
      }
      /* The "turntable" disk under the record */
      ytmusic-player::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: var(--base-size);
        height: var(--base-size);
        background: radial-gradient(circle,
                    var(--base-inner-color) 40%,
                    var(--base-outer-color) 100%);
        border-radius: 50%;
        z-index: 0;                 /* sits behind the record (#thumbnail) */
        pointer-events: none;
        filter: drop-shadow(0 20px 40px rgba(0,0,0,0.35));
      }

      /* --- Record (thumbnail) --- */
      ytmusic-player #thumbnail {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 50%;
        width: 85%; /* Decreased from 90% to 85% */
        height: 85%; /* Decreased from 90% to 85% */
        margin: auto;
        position: relative;
        border: 2px solid var(--thumb-ring);
        box-shadow: 0 0 20px var(--thumb-glow);
        will-change: transform;
        backface-visibility: hidden;
        z-index: 1; /* above the base (::after) */
      }

      ytmusic-player #thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        animation: spinAlbum var(--album-spin-duration) linear infinite;
        animation-play-state: running;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        z-index: 2;
        will-change: transform;
        backface-visibility: hidden;
      }

      ytmusic-player #thumbnail.paused img,
      ytmusic-player #thumbnail.paused .shine {
        animation-play-state: paused;
      }

      /* Grooves overlay */
      ytmusic-player #thumbnail .grooves {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: repeating-radial-gradient(
          circle,
          rgba(255,255,255,0.08) 0px,
          rgba(255,255,255,0.08) 14.8px,
          rgba(0,0,0,0.28) 15.3px,
          rgba(0,0,0,0) 18px
        );
        pointer-events: none;
        z-index: 3;
        mix-blend-mode: soft-light;
      }

      /* Smoother feathered shine (reduced white edge) */
      ytmusic-player #thumbnail .shine {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: conic-gradient(
          from 0deg,
          rgba(255,255,255,0.18) 0deg,
          rgba(255,255,255,0.12) 30deg,
          rgba(255,255,255,0.05) 80deg,
          rgba(255,255,255,0.00) 140deg,
          rgba(255,255,255,0.00) 360deg
        );
        animation: shineMove var(--shine-duration) linear infinite;
        pointer-events: none;
        z-index: 4;
        will-change: transform;
      }

      /* Spindle / center hub */
      ytmusic-player #thumbnail::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 28px;
        height: 28px;
        background: radial-gradient(circle at 45% 45%, #555 0%, #333 40%, #000 100%);
        border-radius: 50%;
        z-index: 5;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  const getThumbnail = () => document.querySelector('ytmusic-player #thumbnail');
  const getImg = () => getThumbnail()?.querySelector('img') || null;
  const getVideo = () => document.querySelector('video');

  function applyDecorations() {
    const thumbnail = getThumbnail();
    const img = getImg();
    if (!thumbnail || !img) return;

    // Change key if src or srcset changes
    const key = [img.src || '', img.srcset || ''].join('|');
    if (key && key === lastImgKey) return;
    lastImgKey = key;

    if (!thumbnail.querySelector('.grooves')) {
      const grooves = document.createElement('div');
      grooves.className = 'grooves';
      thumbnail.appendChild(grooves);
    }
    if (!thumbnail.querySelector('.shine')) {
      const shine = document.createElement('div');
      shine.className = 'shine';
      thumbnail.appendChild(shine);
    }
  }

  function updatePausedState() {
    const video = getVideo();
    const thumbnail = getThumbnail();
    if (!thumbnail) return;

    const shouldPause = !video || video.paused || document.hidden;
    thumbnail.classList.toggle('paused', !!shouldPause);
  }

  function bindPlaybackSync() {
    if (playListenersBound) return;
    const video = getVideo();
    if (!video) return;

    const onPlay = () => updatePausedState();
    const onPause = () => updatePausedState();

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    document.addEventListener('visibilitychange', onPause);

    playListenersBound = true;
    updatePausedState();
  }

  function observeSongChanges() {
    if (songObserver) return;

    const player = document.querySelector('ytmusic-player');
    if (!player) return;

    songObserver = new MutationObserver((mutations) => {
      let relevant = false;
      for (const m of mutations) {
        if (m.type === 'attributes' &&
            (m.attributeName === 'src' || m.attributeName === 'srcset')) {
          relevant = true; break;
        }
        if (m.type === 'childList') {
          relevant = true; break;
        }
      }
      if (relevant) {
        applyDecorations();
        bindPlaybackSync();
      }
    });

    songObserver.observe(player, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });
  }

  function initialize() {
    if (initialized) return;
    const img = getImg();
    if (!img) return;

    addStyles();
    applyDecorations();
    bindPlaybackSync();
    observeSongChanges();

    initialized = true;
  }

  // Bootstrap: wait until album <img> exists; guard prevents double init
  const bootstrap = new MutationObserver(() => {
    if (getImg()) {
      initialize();
      // keep observing; SPA route changes can nuke nodes
    }
  });
  bootstrap.observe(document.documentElement, { childList: true, subtree: true });

  // Reset cache between tracks/routes
  window.addEventListener('yt-page-data-updated', () => {
    lastImgKey = null;
    applyDecorations();
  });

})();
