// ==UserScript==
// @name         YouTube Pornhub Theme + Auto Zoom 120%
// @version      1.1
// @description  Pornhub風テーマ + 自動120％ズーム for YouTube
// @author       Kdroidwin + mod
// @license      GPL-3.0
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1344730
// @downloadURL https://update.greasyfork.org/scripts/542961/YouTube%20Pornhub%20Theme%20%2B%20Auto%20Zoom%20120%25.user.js
// @updateURL https://update.greasyfork.org/scripts/542961/YouTube%20Pornhub%20Theme%20%2B%20Auto%20Zoom%20120%25.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ZOOM_LEVEL = 1.2; // ← ここで倍率を変更可能 (1.2 = 120%)

  // -----------------------------
  //  Pornhub風テーマ適用部分
  // -----------------------------
  window.addEventListener('load', () => {
    const observer = new MutationObserver(() => {
      const logoIcon = document.querySelector("ytd-logo yt-icon");
      const signInBtn = document.querySelector("a[href^='https://accounts.google.com']");
      const uploadButton = document.querySelector("ytd-button-renderer[button-renderer][target-id='upload-icon'] yt-icon");

      if (!logoIcon || signInBtn) return;

      if (!logoIcon.dataset.phLogoInjected) {
        logoIcon.innerHTML = '';
        const img = document.createElement('img');
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Pornhub-logo.svg';
        img.alt = 'Pornhub';
        img.style.height = '24px';
        img.style.width = 'auto';
        img.style.objectFit = 'contain';
        logoIcon.appendChild(img);
        logoIcon.dataset.phLogoInjected = 'true';
      }

      if (uploadButton && !uploadButton.dataset.phCameraReplaced) {
        uploadButton.innerHTML = `
          <svg viewBox="0 0 24 24" height="24" width="24" fill="#aaa">
            <path d="M10 8v8l6-4-6-4zm12-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
          </svg>
        `;
        uploadButton.dataset.phCameraReplaced = 'true';
      }

      applyPornhubStyles();
      observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function applyPornhubStyles() {
      const style = document.createElement('style');
      style.textContent = `
        body, ytd-app {
          background-color: #111 !important;
          color: #eee !important;
        }
        ytd-masthead, #container.ytd-masthead {
          background-color: #000 !important;
          border-bottom: none !important;
        }
        #search-input, input, textarea {
          background-color: #222 !important;
          color: #fff !important;
        }
        a#video-title {
          color: #ff9900 !important;
        }
        ytd-thumbnail:hover {
          filter: brightness(1.2);
        }
        paper-button, ytd-button-renderer {
          background-color: #ff9900 !important;
          color: #000 !important;
        }
        .ytp-play-progress,
        .ytp-swatch-background-color,
        .ytp-load-progress,
        .ytp-progress-bar,
        .ytp-buffered,
        .ytp-progress-linear-live-buffer {
          background-color: #ff9900 !important;
        }
        .ytp-play-button svg path {
          fill: #ff9900 !important;
        }
        .ytp-chrome-bottom,
        .ytp-chrome-top {
          background: #000 !important;
        }
        .html5-video-player {
          background-color: #000 !important;
        }
      `;
      document.head.appendChild(style);
    }
  });

  // -----------------------------
  //  自動ズーム部分
  // -----------------------------
  function applyZoom() {
    document.body.style.zoom = ZOOM_LEVEL;
  }

  applyZoom();

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(applyZoom, 500); // ページ切り替え後に再適用
    }
  }).observe(document, { childList: true, subtree: true });

})();
