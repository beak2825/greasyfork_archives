// ==UserScript==
// @name         YouTube Direct Downloader
// @description  Add a custom ‘Download’ button on YouTube that lets users download video or audio directly from the page. Include full support for Shorts and a bulk mode to download all videos from a selected channel.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @version      2.0
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @grant        GM.download
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.mp3youtube.cc
// @connect      iframe.y2meta-uk.com
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527945/YouTube%20Direct%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527945/YouTube%20Direct%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let lastSelectedFormat = GM_getValue("lastSelectedFormat", "video");
  
  let lastSelectedVideoQuality = GM_getValue("lastSelectedVideoQuality", "1080");
  let lastSelectedAudioBitrate = GM_getValue("lastSelectedAudioBitrate", "320");
  
  let lastSelectedShortsVideoQuality = GM_getValue("lastSelectedShortsVideoQuality", "1080");
  let lastSelectedShortsAudioBitrate = GM_getValue("lastSelectedShortsAudioBitrate", "320");
  let lastSelectedShortsFormat = GM_getValue("lastSelectedShortsFormat", "video");
  
  let lastSelectedChannelVideoQuality = GM_getValue("lastSelectedChannelVideoQuality", "1080");
  let lastSelectedChannelAudioBitrate = GM_getValue("lastSelectedChannelAudioBitrate", "320");
  let lastSelectedChannelFormat = GM_getValue("lastSelectedChannelFormat", "video");

  const API_KEY_URL = "https://api.mp3youtube.cc/v2/sanity/key";
  const API_CONVERT_URL = "https://api.mp3youtube.cc/v2/converter";

  const REQUEST_HEADERS = {
    "Content-Type": "application/json",
    Origin: "https://iframe.y2meta-uk.com",
    Accept: "*/*",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
  };
  let channelVideos = [];
  let currentPage = 1;
  let videosPerPage = GM_getValue("videosPerPage", 5);
  let selectedVideoIds = new Set();
  let activeRequests = new Map();

  const CACHE_DURATION = 6 * 60 * 60 * 1000;
  
  function formatNumber(num) {
    if (!num && num !== 0) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function getCacheKey(channelId) {
    return `youtube_channel_videos_${channelId}`;
  }

  function getCachedVideos(channelId) {
    try {
      const cacheKey = getCacheKey(channelId);
      const cachedData = localStorage.getItem(cacheKey);
      
      if (!cachedData) return null;
      
      const parsed = JSON.parse(cachedData);
      const now = Date.now();
      
      if (now - parsed.timestamp > CACHE_DURATION) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return parsed.videos;
    } catch (error) {
      console.error("Error reading cache:", error);
      return null;
    }
  }

  function setCachedVideos(channelId, videos) {
    try {
      const cacheKey = getCacheKey(channelId);
      const cacheData = {
        timestamp: Date.now(),
        videos: videos
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  }

  function clearCache(channelId) {
    try {
      const cacheKey = getCacheKey(channelId);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  const SVG_ICONS = {
    DOWNLOAD_SIZE:
      "M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z",
    ESTIMATED_TIME:
      "M160 64C142.3 64 128 78.3 128 96C128 113.7 142.3 128 160 128L160 139C160 181.4 176.9 222.1 206.9 252.1L274.8 320L206.9 387.9C176.9 417.9 160 458.6 160 501L160 512C142.3 512 128 526.3 128 544C128 561.7 142.3 576 160 576L480 576C497.7 576 512 561.7 512 544C512 526.3 497.7 512 480 512L480 501C480 458.6 463.1 417.9 433.1 387.9L365.2 320L433.1 252.1C463.1 222.1 480 181.4 480 139L480 128C497.7 128 512 113.7 512 96C512 78.3 497.7 64 480 64L160 64zM224 139L224 128L416 128L416 139C416 158 410.4 176.4 400 192L240 192C229.7 176.4 224 158 224 139zM240 448C243.5 442.7 247.6 437.7 252.1 433.1L320 365.2L387.9 433.1C392.5 437.7 396.5 442.7 400.1 448L240 448z",
    SPEED:
      "M434.8 54.1C446.7 62.7 451.1 78.3 445.7 91.9L367.3 288L512 288C525.5 288 537.5 296.4 542.1 309.1C546.7 321.8 542.8 336 532.5 344.6L244.5 584.6C233.2 594 217.1 594.5 205.2 585.9C193.3 577.3 188.9 561.7 194.3 548.1L272.7 352L128 352C114.5 352 102.5 343.6 97.9 330.9C93.3 318.2 97.2 304 107.5 295.4L395.5 55.4C406.8 46 422.9 45.5 434.8 54.1z",
    NAV_HOME:
      "M105.4 297.4C92.9 309.9 92.9 330.2 105.4 342.7L265.4 502.7C277.9 515.2 298.2 515.2 310.7 502.7C323.2 490.2 323.2 469.9 310.7 457.4L173.3 320L310.6 182.6C323.1 170.1 323.1 149.8 310.6 137.3C298.1 124.8 277.8 124.8 265.3 137.3L105.3 297.3zM457.4 137.4L297.4 297.4C284.9 309.9 284.9 330.2 297.4 342.7L457.4 502.7C469.9 515.2 490.2 515.2 502.7 502.7C515.2 490.2 515.2 469.9 502.7 457.4L365.3 320L502.6 182.6C515.1 170.1 515.1 149.8 502.6 137.3C490.1 124.8 469.8 124.8 457.3 137.3z",
    NAV_PREV:
      "M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z",
    NAV_NEXT:
      "M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z",      
    NAV_END:
      "M535.1 342.6C547.6 330.1 547.6 309.8 535.1 297.3L375.1 137.3C362.6 124.8 342.3 124.8 329.8 137.3C317.3 149.8 317.3 170.1 329.8 182.6L467.2 320L329.9 457.4C317.4 469.9 317.4 490.2 329.9 502.7C342.4 515.2 362.7 515.2 375.2 502.7L535.2 342.7zM183.1 502.6L343.1 342.6C355.6 330.1 355.6 309.8 343.1 297.3L183.1 137.3C170.6 124.8 150.3 124.8 137.8 137.3C125.3 149.8 125.3 170.1 137.8 182.6L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7z",
    REFRESH:
      "M552 256L408 256C398.3 256 389.5 250.2 385.8 241.2C382.1 232.2 384.1 221.9 391 215L437.7 168.3C362.4 109.7 253.4 115 184.2 184.2C109.2 259.2 109.2 380.7 184.2 455.7C259.2 530.7 380.7 530.7 455.7 455.7C463.9 447.5 471.2 438.8 477.6 429.6C487.7 415.1 507.7 411.6 522.2 421.7C536.7 431.8 540.2 451.8 530.1 466.3C521.6 478.5 511.9 490.1 501 501C401 601 238.9 601 139 501C39.1 401 39 239 139 139C233.3 44.7 382.7 39.4 483.3 122.8L535 71C541.9 64.1 552.2 62.1 561.2 65.8C570.2 69.5 576 78.3 576 88L576 232C576 245.3 565.3 256 552 256z",
  };

  const style = document.createElement("style");
  try {
    style.textContent = `
          .ytddl-download-btn {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background-color 0.2s;
          }

          .ytddl-download-btn:not(.channel-download) {
              margin-left: 8px;
          }

          .ytddl-download-btn.channel-download {
              margin-right: 8px;
          }

          .ytFlexibleActionsViewModelAction .ytddl-download-btn.channel-download {
              margin: 0;
          }

          yt-flexible-actions-view-model .ytFlexibleActionsViewModelAction:first-child {
              margin-left: 0;
          }

          html[dark] .ytddl-download-btn {
              background-color: #ffffff1a;
          }

          html:not([dark]) .ytddl-download-btn {
              background-color: #0000000d;
          }

          html[dark] .ytddl-download-btn:hover {
              background-color: #ffffff33;
          }

          html:not([dark]) .ytddl-download-btn:hover {
              background-color: #00000014;
          }

          .ytddl-download-btn svg {
              width: 18px;
              height: 18px;
          }

          html[dark] .ytddl-download-btn svg {
              fill: var(--yt-spec-text-primary, #fff);
          }

          html:not([dark]) .ytddl-download-btn svg {
              fill: var(--yt-spec-text-primary, #030303);
          }

          .ytddl-shorts-download-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 16px;
              margin-bottom: 16px;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              cursor: pointer;
              transition: background-color 0.3s;
          }

          html[dark] .ytddl-shorts-download-btn {
              background-color: rgba(255, 255, 255, 0.1);
          }

          html:not([dark]) .ytddl-shorts-download-btn {
              background-color: rgba(0, 0, 0, 0.05);
          }

          html[dark] .ytddl-shorts-download-btn:hover {
              background-color: rgba(255, 255, 255, 0.2);
          }

          html:not([dark]) .ytddl-shorts-download-btn:hover {
              background-color: rgba(0, 0, 0, 0.1);
          }

          .ytddl-shorts-download-btn svg {
              width: 24px;
              height: 24px;
          }

          html[dark] .ytddl-shorts-download-btn svg {
              fill: white;
          }

          html:not([dark]) .ytddl-shorts-download-btn svg {
              fill: black;
          }

          .ytddl-dialog {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #000000;
              color: #e1e1e1;
              border-radius: 12px;
              box-shadow: 0 0 0 1px rgba(225,225,225,.1), 0 2px 4px 1px rgba(225,225,225,.18);
              font-family: 'IBM Plex Mono', 'Noto Sans Mono Variable', 'Noto Sans Mono', monospace;
              width: 400px;
              z-index: 9999;
              padding: 16px;
          }

          .ytddl-backdrop {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              z-index: 9998;
          }

          .ytddl-dialog h3 {
              margin: 0 0 16px 0;
              font-size: 18px;
              font-weight: 700;
          }

          .quality-options {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              margin-bottom: 16px;
          }

          .quality-option {
              display: flex;
              align-items: center;
              padding: 8px;
              cursor: pointer;
              border-radius: 6px;
          }

          .quality-option:hover {
              background: #191919;
          }

          .quality-option input[type="radio"] {
              margin-right: 8px;
          }

          .quality-separator {
              grid-column: 1 / -1;
              height: 1px;
              background: #333;
              margin: 8px 0;
              position: relative;
          }

          .quality-separator::after {
              content: 'VP9 (Higher Quality)';
              position: absolute;
              top: -10px;
              left: 50%;
              transform: translateX(-50%);
              background: #000;
              padding: 0 8px;
              font-size: 11px;
              color: #888;
          }

          .download-status {
              text-align: center;
              margin: 16px 0;
              font-size: 12px;
              display: none;
              color: #1ed760;
          }

          .button-container {
              display: flex;
              justify-content: center;
              gap: 8px;
              margin-top: 16px;
          }

          .ytddl-button {
              background: transparent;
              border: 1px solid #e1e1e1;
              color: #e1e1e1;
              font-size: 14px;
              font-weight: 500;
              padding: 8px 16px;
              border-radius: 18px;
              cursor: pointer;
              font-family: inherit;
              transition: all 0.2s;
          }

          .ytddl-button:hover {
              background: #1ed760;
              border-color: #1ed760;
              color: #000000;
          }

          .ytddl-button.cancel:hover {
              background: #f3727f;
              border-color: #f3727f;
              color: #000000;
          }

          .format-selector {
              margin-bottom: 16px;
              display: flex;
              gap: 8px;
              justify-content: center;
          }

          .format-button {
              background: transparent;
              border: 1px solid #e1e1e1;
              color: #e1e1e1;
              padding: 6px 12px;
              border-radius: 14px;
              cursor: pointer;
              font-family: inherit;
              font-size: 12px;
              transition: all 0.2s ease;
          }

          .format-button:hover {
              background: #808080;
              color: #000000;
          }

          .format-button.selected {
              background: #1ed760;
              border-color: #1ed760;
              color: #000000;
          }

          .ytddl-download-manager {
              position: fixed;
              top: 20px;
              right: 20px;
              background: rgba(0, 0, 0, 0.95);
              color: #e1e1e1;
              border-radius: 12px;
              padding: 0;
              width: 380px;
              max-width: 380px;
              max-height: 80vh;
              z-index: 10000;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              box-shadow: 0 0 0 1px rgba(225,225,225,.1), 0 2px 4px 1px rgba(225,225,225,.18), 0 8px 32px rgba(0, 0, 0, 0.4);
              border: 1px solid rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(20px);
              opacity: 0;
              transform: translateX(100%);
              transition: all 0.3s ease;
              overflow: hidden;
          }

          .ytddl-download-manager.show {
              opacity: 1;
              transform: translateX(0);
          }

          .ytddl-manager-header {
              padding: 16px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: rgba(255, 255, 255, 0.02);
          }

          .ytddl-manager-title-section {
              display: flex;
              align-items: center;
              gap: 8px;
          }

          .ytddl-manager-title {
              font-weight: 600;
              font-size: 16px;
              color: #fff;
              margin: 0;
          }

          .ytddl-manager-counter {
              background: #1ed760;
              color: #000;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              min-width: 20px;
              text-align: center;
          }

          .ytddl-manager-close {
              background: none;
              border: none;
              color: #ccc;
              cursor: pointer;
              padding: 4px;
              border-radius: 4px;
              transition: all 0.2s;
              font-size: 18px;
          }

          .ytddl-manager-close:hover {
              color: #f3727f;
          }

          .ytddl-downloads-container {
              max-height: calc(80vh - 70px);
              overflow-y: auto;
              padding: 8px 0;
          }

          .ytddl-download-item {
              padding: 16px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
              transition: background-color 0.2s;
          }

          .ytddl-download-item:hover {
              background: rgba(255, 255, 255, 0.02);
          }

          .ytddl-download-item:last-child {
              border-bottom: none;
          }

          .ytddl-download-filename {
              font-weight: 500;
              margin-bottom: 8px;
              color: #fff;
              font-size: 13px;
              line-height: 1.3;
              word-break: break-word;
          }

          .ytddl-download-info {
              font-size: 11px;
              color: #ccc;
              font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace;
              margin-top: 4px;
          }

          .ytddl-download-info .download-size {
              color: #1ed760;
              font-weight: 500;
          }

          .ytddl-download-info .download-speed {
              color: #ccc;
              font-weight: 500;
          }

          .ytddl-channel-modal {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #000000;
              color: #e1e1e1;
              border-radius: 12px;
              box-shadow: 0 0 0 1px rgba(225,225,225,.1), 0 2px 4px 1px rgba(225,225,225,.18);
              font-family: 'IBM Plex Mono', 'Noto Sans Mono Variable', 'Noto Sans Mono', monospace;
              width: 800px;
              max-width: 90vw;
              max-height: 90vh;
              z-index: 9999;
              padding: 0;
              overflow: hidden;
          }

          .ytddl-channel-header {
              padding: 20px;
              border-bottom: 1px solid #333;
              display: flex;
              justify-content: space-between;
              align-items: center;
          }

          .ytddl-channel-title {
              margin: 0;
              font-size: 18px;
              font-weight: 700;
          }

          .ytddl-channel-info {
              font-size: 12px;
              color: #888;
              margin-top: 4px;
          }

          .ytddl-channel-close {
              background: none;
              border: none;
              color: #ccc;
              cursor: pointer;
              font-size: 24px;
              padding: 4px;
              border-radius: 4px;
              transition: color 0.2s;
          }

          .ytddl-channel-close:hover {
              color: #f3727f;
          }

          .ytddl-channel-controls {
              padding: 16px 20px;
              border-bottom: 1px solid #333;
              display: flex;
              gap: 16px;
              align-items: center;
              flex-wrap: wrap;
          }

          .ytddl-channel-format-selector {
              display: flex;
              gap: 8px;
          }

          .ytddl-channel-quality-selector {
              display: flex;
              gap: 8px;
              align-items: center;
          }

          .ytddl-channel-quality-selector select {
              background: #191919;
              color: #e1e1e1;
              border: 1px solid #333;
              border-radius: 6px;
              padding: 6px 12px;
              font-family: inherit;
              font-size: 12px;
          }

          .ytddl-channel-actions {
              display: flex;
              gap: 8px;
              margin-left: auto;
          }

          .ytddl-channel-content {
              padding: 20px;
              max-height: 60vh;
              overflow-y: auto;
          }

          .ytddl-video-list {
              margin-bottom: 20px;
          }

          .ytddl-video-item {
              display: flex;
              align-items: center;
              padding: 12px;
              border: 1px solid #333;
              border-radius: 8px;
              margin-bottom: 8px;
              transition: background-color 0.2s;
          }

          .ytddl-video-item:hover {
              background: #191919;
          }

          .ytddl-video-checkbox {
              margin-right: 12px;
          }

          .ytddl-video-thumbnail {
              width: 80px;
              height: 45px;
              border-radius: 4px;
              margin-right: 12px;
              object-fit: cover;
          }

          .ytddl-video-details {
              flex: 1;
              min-width: 0;
          }

          .ytddl-video-title {
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          .ytddl-video-meta {
              font-size: 11px;
              color: #888;
          }

          .ytddl-video-download-btn {
              background: transparent;
              border: 1px solid #1ed760;
              color: #1ed760;
              padding: 6px 12px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 11px;
              transition: all 0.2s;
              width: 70px;
              text-align: center;
          }

          .ytddl-video-download-btn:hover {
              background: #1ed760;
              color: #000;
          }

          .ytddl-video-download-btn.cancel-btn {
              border-color: #f3727f;
              color: #f3727f;
          }

          .ytddl-video-download-btn.cancel-btn:hover {
              background: #f3727f;
              color: #000;
          }

          .ytddl-pagination {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              gap: 12px;
              margin-bottom: 20px;
          }

          .ytddl-page-btn {
              background: transparent;
              border: 1px solid #333;
              color: #e1e1e1;
              padding: 6px 12px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              transition: all 0.2s;
          }

          .ytddl-page-btn:hover:not(:disabled) {
              background: #333;
          }

          .ytddl-page-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
          }

          .ytddl-page-btn.active {
              background: #1ed760;
              border-color: #1ed760;
              color: #000;
          }

          .ytddl-page-btn svg {
              display: block;
          }
      `;
  } catch (styleError) {
    console.warn("Failed to set style textContent:", styleError);
    const cssRules = [
      ".ytddl-download-btn { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s; }",
      ".ytddl-download-btn:not(.channel-download) { margin-left: 8px; }",
      ".ytddl-download-btn.channel-download { margin-right: 8px; }",
    ];

    try {
      if (style.sheet) {
        cssRules.forEach((rule) => {
          try {
            style.sheet.insertRule(rule, style.sheet.cssRules.length);
          } catch (ruleError) {
            console.warn("Failed to insert CSS rule:", ruleError);
          }
        });
      }
    } catch (sheetError) {
      console.warn("Failed to access stylesheet:", sheetError);
    }
  }

  try {
    document.head.appendChild(style);
  } catch (appendError) {
    console.error("Failed to append style to head:", appendError);
  }
  let downloadManager = null;
  let activeDownloads = new Map();
  let downloadCounter = 0;
  function safeSetTextContent(element, text) {
    try {
      element.textContent = text;
    } catch (error) {
      console.warn("Failed to set textContent, trying alternative:", error);
      try {
        element.innerText = text;
      } catch (altError) {
        console.error("Failed to set text content:", altError);
        try {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          element.appendChild(document.createTextNode(text));
        } catch (finalError) {
          console.error("All text setting methods failed:", finalError);
        }
      }
    }
  }

  function safeClearElement(element) {
    try {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    } catch (error) {
      console.error("Failed to clear element:", error);
      try {
        element.textContent = "";
      } catch (fallbackError) {
        console.error("Fallback clear also failed:", fallbackError);
      }
    }
  }

  function safeAppendChild(parent, child) {
    try {
      parent.appendChild(child);
      return true;
    } catch (error) {
      console.error("Failed to append child:", error);
      return false;
    }
  }

  function safeInsertBefore(parent, newNode, referenceNode) {
    try {
      parent.insertBefore(newNode, referenceNode);
      return true;
    } catch (error) {
      console.error("Failed to insert before:", error);
      return false;
    }
  }

  function safeRemoveElement(element) {
    try {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
        return true;
      }
    } catch (error) {
      console.error("Failed to remove element:", error);
    }
    return false;
  }

  function createDownloadManager() {
    if (downloadManager) return downloadManager;

    const manager = document.createElement("div");
    manager.className = "ytddl-download-manager";
    const header = document.createElement("div");
    header.className = "ytddl-manager-header";

    const titleSection = document.createElement("div");
    titleSection.className = "ytddl-manager-title-section";

    const title = document.createElement("h3");
    title.className = "ytddl-manager-title";
    safeSetTextContent(title, "Downloads");

    const counter = document.createElement("div");
    counter.className = "ytddl-manager-counter";
    safeSetTextContent(counter, "0");

    titleSection.appendChild(title);
    titleSection.appendChild(counter);

    const closeBtn = document.createElement("button");
    closeBtn.className = "ytddl-manager-close";
    safeSetTextContent(closeBtn, "×");
    closeBtn.addEventListener("click", hideDownloadManager);

    header.appendChild(titleSection);
    header.appendChild(closeBtn);

    const container = document.createElement("div");
    container.className = "ytddl-downloads-container";
    manager.appendChild(header);
    manager.appendChild(container);

    if (!safeAppendChild(document.body, manager)) {
      setTimeout(() => {
        safeAppendChild(document.body, manager);
      }, 100);
    }

    downloadManager = manager;
    return manager;
  }

  function showDownloadManager() {
    try {
      if (!downloadManager) {
        createDownloadManager();
      }
      if (downloadManager) {
        downloadManager.classList.add("show");
        updateDownloadCounter();
      }
    } catch (error) {
      console.error("Error showing download manager:", error);
    }
  }

  function hideDownloadManager() {
    if (downloadManager) {
      downloadManager.classList.remove("show");
    }
  }
  function updateDownloadCounter() {
    if (!downloadManager) return;
    const counter = downloadManager.querySelector(".ytddl-manager-counter");
    const activeCount = Array.from(activeDownloads.values()).filter(
      (download) => !["completed", "error"].includes(download.status)
    ).length;

    if (counter) {
      safeSetTextContent(counter, activeCount.toString());
    }

    if (activeCount === 0 && activeDownloads.size > 0) {
      setTimeout(() => {
        const stillNoActive =
          Array.from(activeDownloads.values()).filter(
            (download) => !["completed", "error"].includes(download.status)
          ).length === 0;

        if (stillNoActive) {
          setTimeout(hideDownloadManager, 3000);
        }
      }, 2000);
    }
  }

  function createDownloadItem(downloadId, filename, format) {
    try {
      const item = document.createElement("div");
      item.className = "ytddl-download-item";
      item.id = `download-${downloadId}`;
      const filenameDiv = document.createElement("div");
      filenameDiv.className = "ytddl-download-filename";
      safeSetTextContent(
        filenameDiv,
        truncateTitle(
          filename || `${format}.${format === "video" ? "mp4" : "mp3"}`,
          45
        )
      );      
      const infoDiv = document.createElement("div");
      infoDiv.className = "ytddl-download-info";
      infoDiv.appendChild(createCompactInfoElement("...", null, "..."));

      item.appendChild(filenameDiv);
      item.appendChild(infoDiv);

      return item;
    } catch (error) {
      console.error("Error creating download item:", error);
      return null;
    }
  }

  function addDownloadToManager(
    downloadId,
    filename,
    format,
    isChannelDownload = false
  ) {
    try {
      if (isChannelDownload) {
        return null;
      }

      if (!downloadManager) {
        createDownloadManager();
      }

      if (!downloadManager) {
        console.error("Failed to create download manager");
        return null;
      }

      const container = downloadManager.querySelector(
        ".ytddl-downloads-container"
      );
      if (!container) {
        console.error("Download container not found");
        return null;
      }

      const downloadItem = createDownloadItem(downloadId, filename, format);

      safeInsertBefore(container, downloadItem, container.firstChild);

      showDownloadManager();
      updateDownloadCounter();

      return downloadItem;
    } catch (error) {
      console.error("Error adding download to manager:", error);
      return null;
    }
  }

  function updateDownloadItem(
    downloadId,
    status,
    details,
    fileSize = null,
    speed = null
  ) {
    const download = activeDownloads.get(downloadId);
    const isChannelDownload = download && download.isChannelDownload;

    if (isChannelDownload && download.videoId) {
      updateChannelVideoProgress(
        download.videoId,
        downloadId,
        status,
        details,
        fileSize,
        speed
      );
    }

    const item = document.getElementById(`download-${downloadId}`);
    if (!item) return;

    const infoEl = item.querySelector(".ytddl-download-info");

    if (infoEl) {
      let elapsed = null;
      if (
        status.toLowerCase() === "downloading" &&
        download &&
        download.downloadStartTime
      ) {
        elapsed = (Date.now() - download.downloadStartTime) / 1000;
      }

      safeClearElement(infoEl);
      const compactInfoElement = createCompactInfoElement(
        fileSize,
        elapsed,
        speed
      );
      safeAppendChild(infoEl, compactInfoElement);
    }

    if (activeDownloads.has(downloadId)) {
      activeDownloads.get(downloadId).status = status
        .toLowerCase()
        .replace(/\s+/g, "-");
    }
    if (status.toLowerCase() === "completed") {
      if (activeDownloads.has(downloadId)) {
        activeDownloads.get(downloadId).status = "completed";
      }
      setTimeout(() => {
        removeDownloadItem(downloadId);
      }, 3000);
    }

    if (status.toLowerCase() === "error") {
      if (activeDownloads.has(downloadId)) {
        activeDownloads.get(downloadId).status = "error";
      }
      setTimeout(() => {
        removeDownloadItem(downloadId);
      }, 3000);
    }

    updateDownloadCounter();
  }

  function removeDownloadItem(downloadId) {
    try {
      const item = document.getElementById(`download-${downloadId}`);
      safeRemoveElement(item);

      activeDownloads.delete(downloadId);
      activeRequests.delete(downloadId);
      updateDownloadCounter();
    } catch (error) {
      console.error("Error removing download item:", error);
    }
  }

  function formatDuration(seconds) {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${Math.floor(seconds % 60)}s`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${Math.floor(minutes % 60)}m`;
  }

  function createSVGIcon(iconKey, size = "12px", marginRight = "4px") {
    const pathData = SVG_ICONS[iconKey];
    if (!pathData) {
      console.error(`Icon ${iconKey} not found`);
      return document.createElement("span");
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 640 640");
    svg.style.width = size;
    svg.style.height = size;
    svg.style.display = "inline-block";
    svg.style.verticalAlign = "middle";
    svg.style.marginRight = marginRight;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", pathData);

    svg.appendChild(path);
    return svg;
  }

  function createNavIcon(iconKey, size = "16px") {
    return createSVGIcon(iconKey, size, "0px");
  }

  function updateChannelVideoProgress(
    videoId,
    downloadId,
    status,
    _details,
    fileSize = null,
    speed = null
  ) {
    const metaElement = document.getElementById(`video-meta-${videoId}`);
    const downloadBtn = document.getElementById(`download-btn-${videoId}`);

    if (!metaElement || !downloadBtn) return;    
    if (
      status.toLowerCase() === "initializing" ||
      status.toLowerCase() === "processing"
    ) {
      safeClearElement(metaElement);
      const progressElement = createCompactInfoElement(
        "Initializing...",
        null,
        null
      );
      safeAppendChild(metaElement, progressElement);

      downloadBtn.style.display = "none";
    } else if (status.toLowerCase() === "downloading") {
      const download = activeDownloads.get(downloadId);
      let elapsed = null;
      if (download && download.downloadStartTime) {
        elapsed = (Date.now() - download.downloadStartTime) / 1000;
      }

      safeClearElement(metaElement);
      const progressElement = createCompactInfoElement(
        fileSize,
        elapsed,
        speed
      );
      safeAppendChild(metaElement, progressElement);    
    } else if (status.toLowerCase() === "completed") {
      const video = channelVideos.find((v) => v.videoId === videoId);
      if (video) {
        safeSetTextContent(
          metaElement,
          `${video.duration} • ${video.publishedTime}`
        );
        safeSetTextContent(downloadBtn, "Download");
        downloadBtn.style.display = "";
        downloadBtn.onclick = () => downloadSingleVideo(video);
      }
    } else if (status.toLowerCase() === "error") {
      safeSetTextContent(metaElement, "Download failed");
      const video = channelVideos.find((v) => v.videoId === videoId);
      if (video) {
        safeSetTextContent(downloadBtn, "Download");
        downloadBtn.style.display = "";
        downloadBtn.onclick = () => downloadSingleVideo(video);
      }
    }
  }

  function createCompactInfoElement(size, elapsed, speed) {
    const container = document.createElement("span");
    container.style.color = "#1ed760"; 

    const sizeIcon = createSVGIcon("DOWNLOAD_SIZE");
    sizeIcon.style.color = "#1ed760"; 
    container.appendChild(sizeIcon);

    const sizeText = document.createElement("span");
    safeSetTextContent(sizeText, size || "...");
    container.appendChild(sizeText);

    const separator1 = document.createElement("span");
    safeSetTextContent(separator1, " | ");
    container.appendChild(separator1);

    const timeIcon = createSVGIcon("ESTIMATED_TIME");
    timeIcon.style.color = "#1ed760"; 
    container.appendChild(timeIcon);

    const timeText = document.createElement("span");
    const timeValue = elapsed !== null ? formatDuration(elapsed) : "...";
    safeSetTextContent(timeText, timeValue);
    container.appendChild(timeText);

    const separator2 = document.createElement("span");
    safeSetTextContent(separator2, " | ");
    container.appendChild(separator2);

    const speedIcon = createSVGIcon("SPEED");
    speedIcon.style.color = "#1ed760"; 
    container.appendChild(speedIcon);

    const speedText = document.createElement("span");
    safeSetTextContent(speedText, speed || "...");
    container.appendChild(speedText);

    return container;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function truncateTitle(title, maxLength = 50) {
    if (!title || title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + "...";
  }

  async function getChannelId() {
    if (window.ytInitialData) {
      const header =
        window.ytInitialData?.header?.c4TabbedHeaderRenderer?.channelId;
      const metadata =
        window.ytInitialData?.metadata?.channelMetadataRenderer?.externalId;

      if (header) return header;
      if (metadata) return metadata;
    }

    const url = window.location.href;
    const match = url.match(/channel\/([^\/\?]+)/);
    if (match) return match[1];

    const handleMatch = url.match(/@([^\/\?]+)/);
    if (handleMatch) {
      const response = await fetch(
        `https://www.youtube.com/@${handleMatch[1]}`
      );
      const html = await response.text();
      const channelMatch = html.match(/"channelId":"([^"]+)"/);
      if (channelMatch) return channelMatch[1];
    }

    return null;
  }

  function getApiKey() {
    const scripts = Array.from(document.scripts);
    for (let script of scripts) {
      const match = script.textContent?.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
      if (match) return match[1];
    }

    return "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
  }

  async function fetchAllVideos(apiKey, channelId, progressCallback = null) {
    const baseUrl = "https://www.youtube.com/youtubei/v1/browse";
    const context = {
      context: {
        client: { clientName: "WEB", clientVersion: "2.20240101.00.00" },
      },
    };

    let allVideos = [];
    let continuationToken = null;
    let requestCount = 0;

    do {      
      requestCount++;

      const payload = continuationToken
        ? { ...context, continuation: continuationToken }
        : { ...context, browseId: channelId, params: "EgZ2aWRlb3PyBgQKAjoA" };

      const response = await fetch(`${baseUrl}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const videos = parseVideos(data);      
      if (videos.length === 0) break;

      allVideos = allVideos.concat(videos);
      
      if (progressCallback) {
        progressCallback(allVideos.length);
      }
      
      continuationToken = findContinuation(data);

      if (!continuationToken) break;

      await new Promise((resolve) => setTimeout(resolve, 500));
    } while (continuationToken && requestCount < 500);

    return allVideos;
  }

  function parseVideos(data) {
    const videos = [];
    let contents = [];

    const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs;
    if (tabs) {
      for (let tab of tabs) {
        const richGrid = tab.tabRenderer?.content?.richGridRenderer?.contents;
        if (richGrid) {
          contents = richGrid;
          break;
        }
      }
    }

    const actions = data?.onResponseReceivedActions;
    if (actions && !contents.length) {
      for (let action of actions) {
        const items = action.appendContinuationItemsAction?.continuationItems;
        if (items) {
          contents = items;
          break;
        }
      }
    }

    for (let item of contents) {
      const renderer =
        item.richItemRenderer?.content?.videoRenderer ||
        item.gridVideoRenderer ||
        item.videoRenderer;

      if (renderer?.videoId) {
        const thumbnail = `https://img.youtube.com/vi/${renderer.videoId}/mqdefault.jpg`;

        const publishedTime =
          renderer.publishedTimeText?.simpleText ||
          renderer.publishedTimeText?.runs?.[0]?.text ||
          "Unknown date";

        const duration =
          renderer.lengthText?.simpleText ||
          renderer.lengthText?.runs?.[0]?.text ||
          renderer.thumbnailOverlays?.find(
            (overlay) => overlay.thumbnailOverlayTimeStatusRenderer
          )?.thumbnailOverlayTimeStatusRenderer?.text?.simpleText ||
          "Unknown duration";

        videos.push({
          videoId: renderer.videoId,
          title:
            renderer.title?.runs?.[0]?.text ||
            renderer.title?.simpleText ||
            "No Title",
          thumbnail: thumbnail,
          publishedTime: publishedTime,
          duration: duration,
        });
      }
    }

    return videos;
  }

  function findContinuation(data) {
    const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs;
    if (tabs) {
      for (let tab of tabs) {
        const contents =
          tab.tabRenderer?.content?.richGridRenderer?.contents || [];
        for (let item of contents) {
          const token =
            item.continuationItemRenderer?.continuationEndpoint
              ?.continuationCommand?.token;
          if (token) return token;
        }
      }
    }

    const actions = data?.onResponseReceivedActions;
    if (actions) {
      for (let action of actions) {
        const items =
          action.appendContinuationItemsAction?.continuationItems || [];
        for (let item of items) {
          const token =
            item.continuationItemRenderer?.continuationEndpoint
              ?.continuationCommand?.token;
          if (token) return token;
        }
      }
    }

    return null;
  }
  async function getAllChannelVideos(progressCallback = null) {    
    try {
      const channelId = await getChannelId();
      if (!channelId) throw new Error("Channel ID not found");

      const cachedVideos = getCachedVideos(channelId);
      if (cachedVideos) {
        if (progressCallback) {
          progressCallback(cachedVideos.length);
        }
        return cachedVideos;
      }

      const apiKey = getApiKey();
      const videos = await fetchAllVideos(apiKey, channelId, progressCallback);

      setCachedVideos(channelId, videos);

      return videos;
    } catch (error) {
      console.error("Error fetching channel videos:", error.message);
      return [];
    }
  }

  function cleanFilename(filename) {
    if (!filename) return "YouTube_Video";

    return (
      filename
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
        .replace(/^\.+/, "")
        .replace(/\.+$/, "")
        .replace(/\s+/g, " ")
        .trim() || "YouTube_Video"
    );
  }

  function createChannelModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "ytddl-backdrop";

    const modal = document.createElement("div");
    modal.className = "ytddl-channel-modal";

    const header = document.createElement("div");
    header.className = "ytddl-channel-header";    
    const titleSection = document.createElement("div");
    
    const title = document.createElement("h3");
    title.className = "ytddl-channel-title";
    title.style.margin = "0";
    safeSetTextContent(title, "Channel Videos");
    const refreshBtn = document.createElement("button");
    refreshBtn.className = "ytddl-button";
    refreshBtn.style.fontSize = "12px";
    refreshBtn.style.padding = "4px";
    refreshBtn.style.display = "flex";
    refreshBtn.style.alignItems = "center";
    refreshBtn.style.justifyContent = "center";
    refreshBtn.style.width = "24px";
    refreshBtn.style.height = "24px";
    refreshBtn.style.flexShrink = "0";
      const refreshIcon = createSVGIcon("REFRESH", "14px", "0px");
    refreshBtn.appendChild(refreshIcon);
    
    refreshBtn.addEventListener("click", async () => {
      try {
        const channelId = await getChannelId();
        if (channelId) {
          clearCache(channelId);
        }
        
        const title = document.querySelector(".ytddl-channel-title");
        const info = document.getElementById("channel-info");
        if (info) {
          safeSetTextContent(info, "Loading...");
          info.style.display = "block";
        }
        
        const videoList = document.getElementById("video-list");
        if (videoList) {
          safeClearElement(videoList);
        }
        const videos = await getAllChannelVideos((count) => {
          if (info) {
            safeSetTextContent(info, `Found: ${formatNumber(count)} videos`);
          }
        });
        
        channelVideos = videos;
        currentPage = 1;
        
        selectedVideoIds.clear();
        videos.forEach(video => {
          selectedVideoIds.add(video.videoId);
        });

        const channelName = getChannelName();
        if (title) {
          safeSetTextContent(title, `${channelName} (${formatNumber(videos.length)} videos)`);
        }

        if (info) {
          info.style.display = "none";
        }

        renderVideoList();
      } catch (error) {
        console.error("Error refreshing channel videos:", error);
        const info = document.getElementById("channel-info");
        if (info) {
          safeSetTextContent(info, "Error refreshing videos");
        }      
      }
    });
    const info = document.createElement("div");
    info.className = "ytddl-channel-info";
    info.id = "channel-info";
    info.style.fontSize = "14px";
    info.style.color = "#666";
    info.style.marginTop = "8px";
    safeSetTextContent(info, "Loading...");
    
    const titleRow = document.createElement("div");
    titleRow.style.display = "flex";
    titleRow.style.alignItems = "center";
    titleRow.style.gap = "8px";
    titleRow.appendChild(title);
    titleRow.appendChild(refreshBtn);
    
    titleSection.appendChild(titleRow);
    titleSection.appendChild(info);

    const headerButtons = document.createElement("div");
    headerButtons.style.display = "flex";
    headerButtons.style.gap = "8px";
    headerButtons.style.alignItems = "center";

    const closeBtn = document.createElement("button");
    closeBtn.className = "ytddl-channel-close";
    safeSetTextContent(closeBtn, "×");
    closeBtn.addEventListener("click", closeChannelModal);    
    headerButtons.appendChild(closeBtn);

    header.appendChild(titleSection);
    header.appendChild(headerButtons);

    const controls = document.createElement("div");
    controls.className = "ytddl-channel-controls";

    const formatSelector = document.createElement("div");
    formatSelector.className = "ytddl-channel-format-selector";    
    const videoBtn = document.createElement("button");
    videoBtn.className = `format-button ${
      lastSelectedChannelFormat === "video" ? "selected" : ""
    }`;
    videoBtn.setAttribute("data-format", "video");
    safeSetTextContent(videoBtn, "VIDEO");

    const audioBtn = document.createElement("button");
    audioBtn.className = `format-button ${
      lastSelectedChannelFormat === "audio" ? "selected" : ""
    }`;
    audioBtn.setAttribute("data-format", "audio");
    safeSetTextContent(audioBtn, "AUDIO");

    formatSelector.appendChild(videoBtn);
    formatSelector.appendChild(audioBtn);

    const qualitySelector = document.createElement("div");
    qualitySelector.className = "ytddl-channel-quality-selector";

    const qualityLabel = document.createElement("span");
    safeSetTextContent(qualityLabel, "Quality:");

    const qualitySelect = document.createElement("select");
    qualitySelect.id = "channel-quality-select";

    const videoQualities = [
      "144",
      "240",
      "360",
      "480",
      "720",
      "1080",
      "1440",
      "2160",
    ];
    const audioQualities = ["128", "256", "320"];    
    function updateQualityOptions(format) {
      safeClearElement(qualitySelect);

      const qualities = format === "video" ? videoQualities : audioQualities;
      const defaultQuality =
        format === "video"
          ? lastSelectedChannelVideoQuality
          : lastSelectedChannelAudioBitrate;

      qualities.forEach((quality) => {
        const option = document.createElement("option");
        option.value = quality;

        if (format === "video") {
          const extension = parseInt(quality) > 1080 ? ".webm" : ".mp4";
          safeSetTextContent(option, `${quality}p ${extension}`);
        } else {
          safeSetTextContent(option, `${quality} kbps`);
        }

        if (quality === defaultQuality) option.selected = true;
        qualitySelect.appendChild(option);
      });
    }

    updateQualityOptions(lastSelectedChannelFormat);    
    qualitySelector.appendChild(qualityLabel);
    qualitySelector.appendChild(qualitySelect);

    qualitySelect.addEventListener("change", function () {
      const format = document.querySelector(".ytddl-channel-format-selector .format-button.selected")?.getAttribute("data-format") || "video";
      if (format === "video") {
        lastSelectedChannelVideoQuality = qualitySelect.value;
        GM_setValue("lastSelectedChannelVideoQuality", qualitySelect.value);
      } else {
        lastSelectedChannelAudioBitrate = qualitySelect.value;
        GM_setValue("lastSelectedChannelAudioBitrate", qualitySelect.value);
      }
    });

    const actions = document.createElement("div");
    actions.className = "ytddl-channel-actions";

    const selectAllBtn = document.createElement("button");
    selectAllBtn.className = "ytddl-button";
    safeSetTextContent(selectAllBtn, "Select All");
    selectAllBtn.addEventListener("click", () => toggleAllVideos(true));

    const deselectAllBtn = document.createElement("button");
    deselectAllBtn.className = "ytddl-button";
    safeSetTextContent(deselectAllBtn, "Deselect All");
    deselectAllBtn.addEventListener("click", () => toggleAllVideos(false));

    const downloadSelectedBtn = document.createElement("button");
    downloadSelectedBtn.className = "ytddl-button";
    downloadSelectedBtn.id = "download-selected-btn";
    safeSetTextContent(downloadSelectedBtn, "Download Selected");
    downloadSelectedBtn.addEventListener("click", downloadSelectedVideos);

    actions.appendChild(selectAllBtn);
    actions.appendChild(deselectAllBtn);
    actions.appendChild(downloadSelectedBtn);

    controls.appendChild(formatSelector);
    controls.appendChild(qualitySelector);
    controls.appendChild(actions);

    const content = document.createElement("div");
    content.className = "ytddl-channel-content";

    const videoList = document.createElement("div");
    videoList.className = "ytddl-video-list";
    videoList.id = "video-list";

    const pagination = document.createElement("div");
    pagination.className = "ytddl-pagination";
    pagination.id = "pagination";

    content.appendChild(videoList);
    content.appendChild(pagination);

    modal.appendChild(header);
    modal.appendChild(controls);
    modal.appendChild(content);

    backdrop.appendChild(modal);    
    [videoBtn, audioBtn].forEach((btn) => {
      btn.addEventListener("click", function () {
        document
          .querySelectorAll(".ytddl-channel-format-selector .format-button")
          .forEach((b) => b.classList.remove("selected"));
        this.classList.add("selected");
        const format = this.getAttribute("data-format");
        lastSelectedChannelFormat = format;
        GM_setValue("lastSelectedChannelFormat", format);
        updateQualityOptions(format);
      });
    });

    return backdrop;
  }  
  
  function closeChannelModal() {
    selectedVideoIds.clear();
    const modal = document.querySelector(".ytddl-backdrop");
    if (modal) {
      safeRemoveElement(modal);
    }
  }

  function renderVideoList() {
    const videoList = document.getElementById("video-list");
    const pagination = document.getElementById("pagination");

    if (!videoList || !pagination) return;

    safeClearElement(videoList);
    safeClearElement(pagination);

    const totalPages = Math.ceil(channelVideos.length / videosPerPage);
    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = Math.min(startIndex + videosPerPage, channelVideos.length);
    const currentVideos = channelVideos.slice(startIndex, endIndex);    
    currentVideos.forEach((video) => {
      const videoItem = document.createElement("div");
      videoItem.className = "ytddl-video-item";
      videoItem.id = `video-item-${video.videoId}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "ytddl-video-checkbox";
      checkbox.checked = selectedVideoIds.has(video.videoId);
      checkbox.setAttribute("data-video-id", video.videoId);
      
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selectedVideoIds.add(video.videoId);
        } else {
          selectedVideoIds.delete(video.videoId);
        }
      });

      const thumbnail = document.createElement("img");
      thumbnail.className = "ytddl-video-thumbnail";
      thumbnail.src = video.thumbnail;
      thumbnail.alt = video.title;

      const details = document.createElement("div");
      details.className = "ytddl-video-details";

      const title = document.createElement("div");
      title.className = "ytddl-video-title";
      title.title = video.title;
      safeSetTextContent(title, video.title);      
      const meta = document.createElement("div");
      meta.className = "ytddl-video-meta";
      meta.id = `video-meta-${video.videoId}`;
      
      const activeDownload = Array.from(activeDownloads.values()).find(
        download => download.videoId === video.videoId && 
        !["completed", "error"].includes(download.status)
      );      
      if (activeDownload) {
        let elapsed = null;
        if (activeDownload && activeDownload.startTime) {
          elapsed = (Date.now() - activeDownload.startTime) / 1000;
        }
        
        const statusText = activeDownload ? activeDownload.status : "downloading";
        const progressElement = createCompactInfoElement(
          statusText === "initializing" || statusText === "processing" ? "Initializing..." : "Downloading...",
          elapsed,
          null
        );
        meta.appendChild(progressElement);
      } else {
        safeSetTextContent(meta, `${video.duration} • ${video.publishedTime}`);
      }

      details.appendChild(title);
      details.appendChild(meta);

      const downloadBtn = document.createElement("button");
      downloadBtn.className = "ytddl-video-download-btn";
      downloadBtn.id = `download-btn-${video.videoId}`;
      safeSetTextContent(downloadBtn, "Download");
      downloadBtn.addEventListener("click", () => downloadSingleVideo(video));
      
      const isDownloading = Array.from(activeDownloads.values()).some(
        download => download.videoId === video.videoId && 
        !["completed", "error"].includes(download.status)
      );
      if (isDownloading) {
        downloadBtn.style.display = "none";
      }

      videoItem.appendChild(checkbox);
      videoItem.appendChild(thumbnail);
      videoItem.appendChild(details);
      videoItem.appendChild(downloadBtn);

      videoList.appendChild(videoItem);
    });

    if (totalPages > 1) {
      const homeBtn = document.createElement("button");
      homeBtn.className = "ytddl-page-btn";
      homeBtn.title = "Jump to First Page";
      homeBtn.disabled = currentPage === 1;
      homeBtn.appendChild(createNavIcon("NAV_HOME"));
      homeBtn.addEventListener("click", () => {
        currentPage = 1;
        renderVideoList();
      });
      pagination.appendChild(homeBtn);

      const prevBtn = document.createElement("button");
      prevBtn.className = "ytddl-page-btn";
      prevBtn.title = "Previous Page";
      prevBtn.disabled = currentPage === 1;
      prevBtn.appendChild(createNavIcon("NAV_PREV"));
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderVideoList();
        }
      });
      pagination.appendChild(prevBtn);      
      const pageInfo = document.createElement("span");
      pageInfo.style.margin = "0 12px";
      pageInfo.style.fontSize = "14px";
      safeSetTextContent(pageInfo, `${formatNumber(currentPage)} / ${formatNumber(totalPages)}`);
      pagination.appendChild(pageInfo);

      const nextBtn = document.createElement("button");
      nextBtn.className = "ytddl-page-btn";
      nextBtn.title = "Next Page";
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.appendChild(createNavIcon("NAV_NEXT"));
      nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderVideoList();
        }
      });
      pagination.appendChild(nextBtn);

      const endBtn = document.createElement("button");
      endBtn.className = "ytddl-page-btn";
      endBtn.title = "Jump to Last Page";
      endBtn.disabled = currentPage === totalPages;
      endBtn.appendChild(createNavIcon("NAV_END"));
      endBtn.addEventListener("click", () => {
        currentPage = totalPages;
        renderVideoList();
      });
      pagination.appendChild(endBtn);
    }

    const perPageContainer = document.createElement("div");
    perPageContainer.style.marginLeft = "auto";
    perPageContainer.style.display = "flex";
    perPageContainer.style.alignItems = "center";
    perPageContainer.style.gap = "8px";

    const perPageLabel = document.createElement("span");
    perPageLabel.style.fontSize = "12px";
    perPageLabel.style.color = "#ccc";
    safeSetTextContent(perPageLabel, "Per page:");

    const perPageSelect = document.createElement("select");
    perPageSelect.id = "videos-per-page-select";
    perPageSelect.style.background = "#191919";
    perPageSelect.style.color = "#e1e1e1";
    perPageSelect.style.border = "1px solid #333";
    perPageSelect.style.borderRadius = "4px";
    perPageSelect.style.padding = "4px 8px";
    perPageSelect.style.fontSize = "12px";

    const perPageOptions = [5, 10, 20, 30, 40, 50, 100];
    perPageOptions.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      safeSetTextContent(optionElement, option.toString());
      if (option === videosPerPage) optionElement.selected = true;
      perPageSelect.appendChild(optionElement);
    });

    perPageSelect.addEventListener("change", function () {
      videosPerPage = parseInt(this.value);
      GM_setValue("videosPerPage", videosPerPage);
      currentPage = 1; 
      renderVideoList();
    });

    perPageContainer.appendChild(perPageLabel);
    perPageContainer.appendChild(perPageSelect);
    pagination.appendChild(perPageContainer);
  }

  function toggleAllVideos(select) {
    if (select) {
      channelVideos.forEach(video => {
        selectedVideoIds.add(video.videoId);
      });
    } else {
      selectedVideoIds.clear();
    }
    
    const checkboxes = document.querySelectorAll(".ytddl-video-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = select;
    });
  }
  async function downloadSingleVideo(video) {
    const qualitySelect = document.getElementById("channel-quality-select");
    const format = lastSelectedChannelFormat;
    const quality = qualitySelect.value;

    const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

    try {
      const codec =
        format === "video" && parseInt(quality) > 1080 ? "vp9" : "h264";
      await downloadWithMP3YouTube(
        videoUrl,
        format,
        quality,
        codec,
        true,
        video.videoId
      );
    } catch (error) {
      console.error("Error downloading video:", error);
      alert(`Error downloading ${video.title}: ${error.message}`);
    }
  }
  async function downloadSelectedVideos() {
    const selectedVideos = channelVideos.filter(video => 
      selectedVideoIds.has(video.videoId)
    );

    if (selectedVideos.length === 0) {
      alert("Please select at least one video to download.");
      return;
    }

    const qualitySelect = document.getElementById("channel-quality-select");
    const format = lastSelectedChannelFormat;
    const quality = qualitySelect.value;
    const codec =
      format === "video" && parseInt(quality) > 1080 ? "vp9" : "h264";

    for (let i = 0; i < selectedVideos.length; i++) {
      const video = selectedVideos[i];
      const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

      try {        
        await downloadWithMP3YouTube(
          videoUrl,
          format,
          quality,
          codec,
          true,
          video.videoId
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error downloading video ${video.title}:`, error);
      }
    }
  }
  async function showChannelModal() {
    const modal = createChannelModal();
    safeAppendChild(document.body, modal);    
    try {
      const videos = await getAllChannelVideos((count) => {
        const info = document.getElementById("channel-info");
        if (info) {
          safeSetTextContent(info, `Found: ${formatNumber(count)} videos`);
        }
      });
      
      channelVideos = videos;
      currentPage = 1;
      
      selectedVideoIds.clear();
      videos.forEach(video => {
        selectedVideoIds.add(video.videoId);
      });

      const channelName = getChannelName();
      const title = document.querySelector(".ytddl-channel-title");
      if (title) {
        safeSetTextContent(title, `${channelName} (${formatNumber(videos.length)} videos)`);
      }

      const channelInfo = document.getElementById("channel-info");
      if (channelInfo) {
        channelInfo.style.display = "none";
      }

      renderVideoList();
    } catch (error) {
      console.error("Error loading channel videos:", error);
      const channelInfo = document.getElementById("channel-info");
      if (channelInfo) {
        safeSetTextContent(channelInfo, "Error loading videos");
      }
    }
  }

  function triggerDirectDownload(url, filename, downloadId) {
    const download = activeDownloads.get(downloadId);
    if (download) {
      download.downloadStartTime = Date.now();
    }

    updateDownloadItem(
      downloadId,
      "downloading",
      "Connecting to server...",
      "0 B",
      "0 B/s"
    );

    fetchAndDownload(url, filename, downloadId);
  }

  function fetchAndDownload(url, filename, downloadId) {
    const download = activeDownloads.get(downloadId);
    const downloadStartTime = download
      ? download.downloadStartTime
      : Date.now();

    let totalSize = 0;
    let downloadedSize = 0;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 250;

    const request = GM.xmlHttpRequest({
      method: "GET",
      url: url,
      responseType: "blob",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        Referer: "https://iframe.y2meta-uk.com/",
        Accept: "*/*",
      },
      onprogress: function (progressEvent) {
        const currentTime = Date.now();
        const elapsed = (currentTime - downloadStartTime) / 1000;

        const shouldUpdate =
          currentTime - lastUpdateTime >= UPDATE_INTERVAL ||
          (progressEvent.lengthComputable &&
            progressEvent.loaded === progressEvent.total);

        if (progressEvent.lengthComputable) {
          totalSize = progressEvent.total;
          downloadedSize = progressEvent.loaded;

          const percentage = Math.round((downloadedSize / totalSize) * 100);
          const speed = elapsed > 0 ? downloadedSize / elapsed : 0;

          if (shouldUpdate) {
            const sizeText = `${formatBytes(downloadedSize)} / ${formatBytes(
              totalSize
            )}`;
            const speedText = `${formatBytes(speed)}/s`;
            const percentText = `${percentage}%`;
            updateDownloadItem(
              downloadId,
              "downloading",
              `Downloading ${percentText}`,
              sizeText,
              speedText
            );

            lastUpdateTime = currentTime;
          }          
          if (currentTime - lastUpdateTime >= 1000 || percentage === 100) {
          }
        } else {
          downloadedSize = progressEvent.loaded || 0;
          const speed = elapsed > 0 ? downloadedSize / elapsed : 0;

          if (shouldUpdate) {
            const sizeText = `${formatBytes(downloadedSize)}`;
            const speedText = `${formatBytes(speed)}/s`;
            const timeText = `${elapsed.toFixed(1)}s`;
            updateDownloadItem(
              downloadId,
              "downloading",
              `Downloading... (${timeText})`,
              sizeText,
              speedText
            );

            lastUpdateTime = currentTime;
          }          
          if (currentTime - lastUpdateTime >= 1000) {
          }
        }      
      },
      onload: function (response) {
        if (response.status === 200 && response.response) {
          updateDownloadItem(
            downloadId,
            "processing",
            "Creating download file...",
            formatBytes(response.response.size || 0),
            "Processing"
          );          
          try {
            const blob = response.response;
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.style.display = "none";
            a.href = blobUrl;
            a.download = filename || "video.mp4";

            safeAppendChild(document.body, a);
            a.click();

            setTimeout(() => {
              safeRemoveElement(a);
              URL.revokeObjectURL(blobUrl);
            }, 1000);            
            updateDownloadItem(
              downloadId,
              "completed",
              "Download completed successfully!",
              formatBytes(blob.size),
              "Complete"
            );
            activeRequests.delete(downloadId);          
          } catch (blobError) {
            updateDownloadItem(
              downloadId,
              "error",
              `Blob conversion error: ${blobError.message}`,
              null,
              null
            );
            activeRequests.delete(downloadId);
          }
        } else {
          updateDownloadItem(
            downloadId,
            "error",
            `Server returned status ${response.status}`,
            null,
            null
          );
          activeRequests.delete(downloadId);
        }
      },
      onerror: function () {
        updateDownloadItem(
          downloadId,
          "error",
          "Network error or invalid URL",
          null,
          null
        );
        activeRequests.delete(downloadId);
      },
      ontimeout: function () {
        updateDownloadItem(
          downloadId,
          "error",
          "Request took too long to complete",
          null,
          null
        );
        activeRequests.delete(downloadId);
      },
    });

    activeRequests.set(downloadId, request);
  }
  function createShortsDownloadDialog() {
    const dialog = document.createElement("div");
    dialog.className = "ytddl-dialog";
    const title = document.createElement("h3");
    safeSetTextContent(title, "");

    const formatSelector = document.createElement("div");
    formatSelector.className = "format-selector";
    const videoBtn = document.createElement("button");
    videoBtn.className = `format-button ${
      lastSelectedShortsFormat === "video" ? "selected" : ""
    }`;
    videoBtn.setAttribute("data-format", "video");
    safeSetTextContent(videoBtn, "VIDEO (.mp4/.webm)");

    const audioBtn = document.createElement("button");
    audioBtn.className = `format-button ${
      lastSelectedShortsFormat === "audio" ? "selected" : ""
    }`;
    audioBtn.setAttribute("data-format", "audio");
    safeSetTextContent(audioBtn, "AUDIO (.mp3)");

    formatSelector.appendChild(videoBtn);
    formatSelector.appendChild(audioBtn);    
    const qualityContainer = document.createElement("div");
    qualityContainer.id = "quality-container";
    const videoQualities = document.createElement("div");
    videoQualities.className = "quality-options";
    videoQualities.id = "video-qualities";
    videoQualities.style.display =
      lastSelectedShortsFormat === "video" ? "grid" : "none";
    const qualityOptions = [
      { quality: "144p", codec: "h264", ext: ".mp4" },
      { quality: "240p", codec: "h264", ext: ".mp4" },
      { quality: "360p", codec: "h264", ext: ".mp4" },
      { quality: "480p", codec: "h264", ext: ".mp4" },
      { quality: "720p", codec: "h264", ext: ".mp4" },
      { quality: "1080p", codec: "h264", ext: ".mp4" },
      { quality: "1440p", codec: "vp9", ext: ".webm" },
      { quality: "2160p", codec: "vp9", ext: ".webm" },
    ];

    qualityOptions.forEach((item, index) => {
      if (index === 6) {
        const separator = document.createElement("div");
        separator.className = "quality-separator";
        videoQualities.appendChild(separator);
      }

      const option = document.createElement("div");
      option.className = "quality-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.id = `quality-${index}`;
      input.name = "quality";
      input.value = item.quality.replace("p", "");
      input.setAttribute("data-codec", item.codec);
      input.setAttribute("data-ext", item.ext);
      const label = document.createElement("label");
      label.setAttribute("for", `quality-${index}`);
      safeSetTextContent(label, `${item.quality} ${item.ext}`);
      label.style.fontSize = "14px";
      label.style.cursor = "pointer";

      option.appendChild(input);
      option.appendChild(label);
      videoQualities.appendChild(option);      
      option.addEventListener("click", function () {
        input.checked = true;
        GM_setValue("lastSelectedShortsVideoQuality", input.value);
        lastSelectedShortsVideoQuality = input.value;
      });
    });    
    const defaultQuality = videoQualities.querySelector(
      `input[value="${lastSelectedShortsVideoQuality}"]`
    );
    if (defaultQuality) {
      defaultQuality.checked = true;
    }    
    const audioQualities = document.createElement("div");
    audioQualities.className = "quality-options";
    audioQualities.id = "audio-qualities";
    audioQualities.style.display =
      lastSelectedShortsFormat === "audio" ? "grid" : "none";
    ["128", "256", "320"].forEach((bitrate, index) => {
      const option = document.createElement("div");
      option.className = "quality-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.id = `bitrate-${index}`;
      input.name = "bitrate";
           input.value = bitrate;
      const label = document.createElement("label");
      label.setAttribute("for", `bitrate-${index}`);
      safeSetTextContent(label, `${bitrate} kbps`);
      label.style.fontSize = "14px";
      label.style.cursor = "pointer";

      option.appendChild(input);
      option.appendChild(label);
      audioQualities.appendChild(option);      
      option.addEventListener("click", function () {
        input.checked = true;
        GM_setValue("lastSelectedShortsAudioBitrate", input.value);
        lastSelectedShortsAudioBitrate = input.value;
      });
    });    
    const defaultBitrate = audioQualities.querySelector(
      `input[value="${lastSelectedShortsAudioBitrate}"]`
    );
    if (defaultBitrate) {
      defaultBitrate.checked = true;
    }

    qualityContainer.appendChild(videoQualities);
    qualityContainer.appendChild(audioQualities);

    const downloadStatus = document.createElement("div");
    downloadStatus.className = "download-status";
    downloadStatus.id = "download-status";    
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const downloadButton = document.createElement("button");
    downloadButton.className = "ytddl-button";
    safeSetTextContent(downloadButton, "Download");

    buttonContainer.appendChild(downloadButton);

    dialog.appendChild(title);
    dialog.appendChild(formatSelector);
    dialog.appendChild(qualityContainer);
    dialog.appendChild(downloadStatus);
    dialog.appendChild(buttonContainer);    
    formatSelector.addEventListener("click", (e) => {
      if (e.target.classList.contains("format-button")) {
        formatSelector.querySelectorAll(".format-button").forEach((btn) => {
          btn.classList.remove("selected");
        });
        e.target.classList.add("selected");
        const format = e.target.getAttribute("data-format");
        if (format === "video") {
          videoQualities.style.display = "grid";
          audioQualities.style.display = "none";
          lastSelectedShortsFormat = "video";
          GM_setValue("lastSelectedShortsFormat", "video");
        } else {
          videoQualities.style.display = "none";
          audioQualities.style.display = "grid";
          lastSelectedShortsFormat = "audio";
          GM_setValue("lastSelectedShortsFormat", "audio");
        }
      }
    });
    const backdrop = document.createElement("div");
    backdrop.className = "ytddl-backdrop";

    return { dialog, backdrop, downloadButton };
  }

  function closeDialog(dialog, backdrop) {
    safeRemoveElement(dialog);
    safeRemoveElement(backdrop);
  }

  function extractVideoId(url) {
    const urlObj = new URL(url);

    const searchParams = new URLSearchParams(urlObj.search);
    const videoId = searchParams.get("v");
    if (videoId) {
      return videoId;
    }

    const shortsMatch = url.match(/\/shorts\/([^?]+)/);
    if (shortsMatch) {
      return shortsMatch[1];
    }

    return null;
  }

  function getChannelName() {
    const selectors = [
      "yt-formatted-string.ytd-channel-name",
      "#channel-name yt-formatted-string",
      "#text.ytd-channel-name",
      "ytd-channel-name #text",
      "#channel-header-container #text",
      ".ytd-c4-tabbed-header-renderer #text",
      "h1.dynamic-text-view-model-wiz__h1",
      ".page-header-view-model-wiz__page-header-headline",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }

    const title = document.title;
    if (title && title.includes(" - YouTube")) {
      return title.replace(" - YouTube", "").trim();
    }

    return "Unknown Channel";
  }

  function createChannelDownloadButton() {
    if (document.querySelector(".ytddl-download-btn.channel-download")) {
      return;
    }

    const downloadButton = document.createElement("div");
    downloadButton.className = "ytddl-download-btn channel-download";
    downloadButton.title = "Download All Channel Videos";
    
    downloadButton.setAttribute("role", "button");
    downloadButton.setAttribute("aria-label", "Download All Channel Videos");

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 512 512");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M256 464c114.9 0 208-93.1 208-208c0-13.3 10.7-24 24-24s24 10.7 24 24c0 141.4-114.6 256-256 256S0 397.4 0 256c0-13.3 10.7-24 24-24s24 10.7 24 24c0 114.9 93.1 208 208 208zM377.6 232.3l-104 112c-4.5 4.9-10.9 7.7-17.6 7.7s-13-2.8-17.6-7.7l-104-112c-9-9.7-8.5-24.9 1.3-33.9s24.9-8.5 33.9 1.3L232 266.9 232 24c0-13.3 10.7-24 24-24s24 10.7 24 24l0 242.9 62.4-67.2c9-9.7 24.2-10.3 33.9-1.3s10.3 24.2 1.3 33.9z"
    );
    svg.appendChild(path);
    downloadButton.appendChild(svg);

    downloadButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      showChannelModal();
    });

    const flexibleActionsContainer = document.querySelector('yt-flexible-actions-view-model.ytFlexibleActionsViewModelHost');
    if (flexibleActionsContainer) {
      const actionContainer = document.createElement('div');
      actionContainer.className = 'ytFlexibleActionsViewModelAction';
      actionContainer.appendChild(downloadButton);
      flexibleActionsContainer.appendChild(actionContainer);
    } else {
      const joinButton = document.querySelector(
        ".yt-flexible-actions-view-model-wiz__action:not(.ytddl-download-btn)"
      );
      if (joinButton) {
        joinButton.parentNode.appendChild(downloadButton);
      } else {
        const buttonContainer = document.querySelector(
          "#subscribe-button + #buttons"
        );
        if (buttonContainer) {
          buttonContainer.appendChild(downloadButton);
        }
      }
    }

    return downloadButton;
  }

  function insertChannelDownloadButton() {
    const channelDownloadBtn = document.querySelector(
      ".ytddl-download-btn.channel-download"
    );
    
    if (channelDownloadBtn) {
      return;
    }

    const flexibleActionsContainer = document.querySelector('yt-flexible-actions-view-model.ytFlexibleActionsViewModelHost');
    
    const joinButton = document.querySelector(
      ".yt-flexible-actions-view-model-wiz__action:not(.ytddl-download-btn)"
    );
    
    const buttonContainer = document.querySelector("#subscribe-button + #buttons");

    if (flexibleActionsContainer || joinButton || buttonContainer) {
      createChannelDownloadButton();
    }
  }

  const observer = new MutationObserver(() => {
    checkAndInsertButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  checkAndInsertButton();

  let previousUrl = location.href;

  function checkUrlChange() {
    const currentUrl = location.href;
    if (currentUrl !== previousUrl) {
      previousUrl = currentUrl;
      setTimeout(() => {
        checkAndInsertButton();
        if (isChannelPage()) {
          setTimeout(() => {
            insertChannelDownloadButton();
          }, 500);
        }
      }, 500);
    }
  }

  history.pushState = (function (f) {
    return function () {
      const result = f.apply(this, arguments);
      checkUrlChange();
      return result;
    };
  })(history.pushState);

  history.replaceState = (function (f) {
    return function () {
      const result = f.apply(this, arguments);
      checkUrlChange();
      return result;
    };
  })(history.replaceState);

  window.addEventListener("popstate", checkUrlChange);

  window.addEventListener("yt-navigate-finish", () => {
    checkAndInsertButton();
    if (isChannelPage()) {
      setTimeout(() => {
        insertChannelDownloadButton();
      }, 300);
    }
  });

  document.addEventListener('yt-action', function(event) {
    if (event.detail && event.detail.actionName === 'yt-reload-continuation-items-command') {
      checkAndInsertButton();
      if (isChannelPage()) {
        setTimeout(() => {
          insertChannelDownloadButton();
        }, 300);
      }
    }
  });

  document.addEventListener("yt-action", function (event) {
    if (
      event.detail &&
      event.detail.actionName === "yt-reload-continuation-items-command"
    ) {
      checkAndInsertButton();
    }
  });

  async function downloadWithMP3YouTube(
    videoUrl,
    format,
    quality,
    codec = "h264",
    isChannelDownload = false,
    videoId = null
  ) {
    const downloadId = `download_${++downloadCounter}_${Date.now()}`;

    let videoTitle = document.title;
    videoTitle = videoTitle.replace(/^\(\d+\)\s*/, "");
    videoTitle = videoTitle.replace(" - YouTube", "");
    if (!videoTitle || videoTitle.trim() === "") {
      const titleElement = document.querySelector(
        "h1.ytd-watch-metadata #title, h1 yt-formatted-string, #title h1"
      );
      if (titleElement) {
        videoTitle = titleElement.textContent.trim();
      }
    }
    if (!videoTitle || videoTitle.trim() === "") {
      videoTitle = "YouTube_Video";
    }
    const cleanedTitle = cleanFilename(videoTitle);

    const downloadInfo = {
      id: downloadId,
      filename: `${cleanedTitle}.${format === "video" ? "mp4" : "mp3"}`,
      format: format,
      status: "initializing",
      url: videoUrl,
      startTime: Date.now(),
      isChannelDownload: isChannelDownload,
      videoId: videoId,
    };

    activeDownloads.set(downloadId, downloadInfo);
    addDownloadToManager(
      downloadId,
      downloadInfo.filename,
      format,
      isChannelDownload
    );

    updateDownloadItem(
      downloadId,
      "initializing",
      "Getting API key...",
      null,
      null
    );

    try {
      const keyResponse = await new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "GET",
          url: API_KEY_URL,
          headers: REQUEST_HEADERS,
          onload: resolve,
          onerror: reject,
          ontimeout: reject,
        });
      });

      const keyData = JSON.parse(keyResponse.responseText);
      if (!keyData || !keyData.key) {
        throw new Error("Failed to get API key");
      }

      const key = keyData.key;
      updateDownloadItem(
        downloadId,
        "processing",
        `Processing ${format} (${
          format === "video" ? quality + "p" : quality + " kbps"
        })`,
        null,
        null
      );

      let payload;
      if (format === "video") {
        payload = {
          link: videoUrl,
          format: "mp4",
          audioBitrate: "128",
          videoQuality: quality,
          filenameStyle: "pretty",
          vCodec: codec,
        };
      } else {
        payload = {
          link: videoUrl,
          format: "mp3",
          audioBitrate: quality,
          filenameStyle: "pretty",
        };
      }

      const customHeaders = {
        ...REQUEST_HEADERS,
        key: key,
      };

      updateDownloadItem(
        downloadId,
        "processing",
        "Converting media...",
        null,
        null
      );

      const downloadResponse = await new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "POST",
          url: API_CONVERT_URL,
          headers: customHeaders,
          data: JSON.stringify(payload),
          onload: resolve,
          onerror: reject,
          ontimeout: reject,
        });
      });

      const apiDownloadInfo = JSON.parse(downloadResponse.responseText);
      if (apiDownloadInfo.url) {
        if (apiDownloadInfo.filename) {
          activeDownloads.get(downloadId).filename = cleanFilename(
            apiDownloadInfo.filename
          );
          const item = document.getElementById(`download-${downloadId}`);
          if (item) {
            const filenameEl = item.querySelector(".ytddl-download-filename");
            if (filenameEl) {
              safeSetTextContent(
                filenameEl,
                truncateTitle(apiDownloadInfo.filename, 45)
              );
            }
          }
        }

        updateDownloadItem(
          downloadId,
          "downloading",
          "Starting download...",
          null,
          null
        );

        triggerDirectDownload(
          apiDownloadInfo.url,
          apiDownloadInfo.filename,
          downloadId
        );

        return apiDownloadInfo;
      } else {
        throw new Error("No download URL received from API");
      }
    } catch (error) {
      updateDownloadItem(
        downloadId,
        "error",
        `Error: ${error.message}`,
        null,
        null
      );

      throw error;
    }
  }
  function createDownloadButton() {
    const downloadButton = document.createElement("div");
    downloadButton.className = "ytddl-download-btn";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 512 512");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M256 464c114.9 0 208-93.1 208-208c0-13.3 10.7-24 24-24s24 10.7 24 24c0 141.4-114.6 256-256 256S0 397.4 0 256c0-13.3 10.7-24 24-24s24 10.7 24 24c0 114.9 93.1 208 208 208zM377.6 232.3l-104 112c-4.5 4.9-10.9 7.7-17.6 7.7s-13-2.8-17.6-7.7l-104-112c-9-9.7-8.5-24.9 1.3-33.9s24.9-8.5 33.9 1.3L232 266.9 232 24c0-13.3 10.7-24 24-24s24 10.7 24 24l0 242.9 62.4-67.2c9-9.7 24.2-10.3 33.9-1.3s10.3 24.2 1.3 33.9z"
    );

    svg.appendChild(path);
    downloadButton.appendChild(svg);

    downloadButton.addEventListener("click", function () {
      showWatchDownloadDialog();
    });

    return downloadButton;
  }
  function createShortsDownloadButton() {
    const downloadButton = document.createElement("div");
    downloadButton.className = "ytddl-shorts-download-btn";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 512 512");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M256 464c114.9 0 208-93.1 208-208c0-13.3 10.7-24 24-24s24 10.7 24 24c0 141.4-114.6 256-256 256S0 397.4 0 256c0-13.3 10.7-24 24-24s24 10.7 24 24c0 114.9 93.1 208 208 208zM377.6 232.3l-104 112c-4.5 4.9-10.9 7.7-17.6 7.7s-13-2.8-17.6-7.7l-104-112c-9-9.7-8.5-24.9 1.3-33.9s24.9-8.5 33.9 1.3L232 266.9 232 24c0-13.3 10.7-24 24-24s24 10.7 24 24l0 242.9 62.4-67.2c9-9.7 24.2-10.3 33.9-1.3s10.3 24.2 1.3 33.9z"
    );

    svg.appendChild(path);
    downloadButton.appendChild(svg);

    downloadButton.addEventListener("click", function () {
      showShortsDownloadDialog();
    });

    return downloadButton;  
  }

  function createDownloadDialog() {
    const dialog = document.createElement("div");
    dialog.className = "ytddl-dialog";
    const title = document.createElement("h3");
    safeSetTextContent(title, "");

    const formatSelector = document.createElement("div");
    formatSelector.className = "format-selector";
    const videoBtn = document.createElement("button");
    videoBtn.className = `format-button ${
      lastSelectedFormat === "video" ? "selected" : ""
    }`;
    videoBtn.setAttribute("data-format", "video");
    safeSetTextContent(videoBtn, "VIDEO (.mp4/.webm)");

    const audioBtn = document.createElement("button");
    audioBtn.className = `format-button ${
      lastSelectedFormat === "audio" ? "selected" : ""
    }`;
    audioBtn.setAttribute("data-format", "audio");
    safeSetTextContent(audioBtn, "AUDIO (.mp3)");

    formatSelector.appendChild(videoBtn);
    formatSelector.appendChild(audioBtn);

    const qualityContainer = document.createElement("div");
    qualityContainer.id = "quality-container";
    const videoQualities = document.createElement("div");
    videoQualities.className = "quality-options";
    videoQualities.id = "video-qualities";
    videoQualities.style.display =
      lastSelectedFormat === "video" ? "grid" : "none";
    const qualityOptions = [
      { quality: "144p", codec: "h264", ext: ".mp4" },
      { quality: "240p", codec: "h264", ext: ".mp4" },
      { quality: "360p", codec: "h264", ext: ".mp4" },
      { quality: "480p", codec: "h264", ext: ".mp4" },
      { quality: "720p", codec: "h264", ext: ".mp4" },
      { quality: "1080p", codec: "h264", ext: ".mp4" },
      { quality: "1440p", codec: "vp9", ext: ".webm" },
      { quality: "2160p", codec: "vp9", ext: ".webm" },
    ];

    qualityOptions.forEach((item, index) => {
      if (index === 6) {
        const separator = document.createElement("div");
        separator.className = "quality-separator";
        videoQualities.appendChild(separator);
      }

      const option = document.createElement("div");
      option.className = "quality-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.id = `quality-${index}`;
      input.name = "quality";
      input.value = item.quality.replace("p", "");
      input.setAttribute("data-codec", item.codec);
      input.setAttribute("data-ext", item.ext);
      const label = document.createElement("label");
      label.setAttribute("for", `quality-${index}`);
      safeSetTextContent(label, `${item.quality} ${item.ext}`);
      label.style.fontSize = "14px";
      label.style.cursor = "pointer";

      option.appendChild(input);
      option.appendChild(label);
      videoQualities.appendChild(option);

      option.addEventListener("click", function () {
        input.checked = true;
        GM_setValue("lastSelectedVideoQuality", input.value);
        lastSelectedVideoQuality = input.value;
      });
    });

    const defaultQuality = videoQualities.querySelector(
      `input[value="${lastSelectedVideoQuality}"]`
    );
    if (defaultQuality) {
      defaultQuality.checked = true;
    }
    const audioQualities = document.createElement("div");
    audioQualities.className = "quality-options";
    audioQualities.id = "audio-qualities";
    audioQualities.style.display =
      lastSelectedFormat === "audio" ? "grid" : "none";
    ["128", "256", "320"].forEach((bitrate, index) => {
      const option = document.createElement("div");
      option.className = "quality-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.id = `bitrate-${index}`;
      input.name = "bitrate";
      input.value = bitrate;
      const label = document.createElement("label");
      label.setAttribute("for", `bitrate-${index}`);
      safeSetTextContent(label, `${bitrate} kbps`);
      label.style.fontSize = "14px";
      label.style.cursor = "pointer";

      option.appendChild(input);
      option.appendChild(label);
      audioQualities.appendChild(option);

      option.addEventListener("click", function () {
        input.checked = true;
        GM_setValue("lastSelectedAudioBitrate", input.value);
        lastSelectedAudioBitrate = input.value;
      });
    });

    const defaultBitrate = audioQualities.querySelector(
      `input[value="${lastSelectedAudioBitrate}"]`
    );
    if (defaultBitrate) {
      defaultBitrate.checked = true;
    }

    qualityContainer.appendChild(videoQualities);
    qualityContainer.appendChild(audioQualities);

    const downloadStatus = document.createElement("div");
    downloadStatus.className = "download-status";
    downloadStatus.id = "download-status";    
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const downloadButton = document.createElement("button");
    downloadButton.className = "ytddl-button";
    safeSetTextContent(downloadButton, "Download");

    buttonContainer.appendChild(downloadButton);

    dialog.appendChild(title);
    dialog.appendChild(formatSelector);
    dialog.appendChild(qualityContainer);
    dialog.appendChild(downloadStatus);
    dialog.appendChild(buttonContainer);

    formatSelector.addEventListener("click", (e) => {
      if (e.target.classList.contains("format-button")) {
        formatSelector.querySelectorAll(".format-button").forEach((btn) => {
          btn.classList.remove("selected");
        });
        e.target.classList.add("selected");
        const format = e.target.getAttribute("data-format");
        if (format === "video") {
          videoQualities.style.display = "grid";
          audioQualities.style.display = "none";
          lastSelectedFormat = "video";
          GM_setValue("lastSelectedFormat", "video");
        } else {
          videoQualities.style.display = "none";
          audioQualities.style.display = "grid";
          lastSelectedFormat = "audio";
          GM_setValue("lastSelectedFormat", "audio");
        }
      }
    });    
    const backdrop = document.createElement("div");
    backdrop.className = "ytddl-backdrop";

    return { dialog, backdrop, downloadButton };
  }

  function showWatchDownloadDialog() {
    const videoUrl = window.location.href;
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      alert("Could not extract video ID from URL");
      return;
    }    
    const { dialog, backdrop, downloadButton } =
      createDownloadDialog();

    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);

    backdrop.addEventListener("click", () => {
      closeDialog(dialog, backdrop);
    });

    downloadButton.addEventListener("click", async () => {
      const selectedFormat = dialog
        .querySelector(".format-button.selected")
        .getAttribute("data-format");
      let quality, codec;

      if (selectedFormat === "video") {
        const selectedQuality = dialog.querySelector(
          'input[name="quality"]:checked'
        );
        if (!selectedQuality) {
          alert("Please select a video quality");
          return;
        }
        quality = selectedQuality.value;
        codec = selectedQuality.getAttribute("data-codec");
      } else {
        const selectedBitrate = dialog.querySelector(
          'input[name="bitrate"]:checked'
        );
        if (!selectedBitrate) {
          alert("Please select an audio bitrate");
          return;
        }
        quality = selectedBitrate.value;
      }

      GM_setValue("lastSelectedFormat", selectedFormat);

      try {
        await downloadWithMP3YouTube(videoUrl, selectedFormat, quality, codec);

        closeDialog(dialog, backdrop, false);
      } catch (error) {
        console.error("Download error:", error);
        closeDialog(dialog, backdrop, false);
      }
    });
  }

  function showShortsDownloadDialog() {
    const videoUrl = window.location.href;
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      alert("Could not extract video ID from URL");
      return;
    }      
    const { dialog, backdrop, downloadButton } =
      createShortsDownloadDialog();

    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);

    backdrop.addEventListener("click", () => {
      closeDialog(dialog, backdrop);
    });

    downloadButton.addEventListener("click", async () => {
      const selectedFormat = dialog
        .querySelector(".format-button.selected")
        .getAttribute("data-format");
      let quality, codec;

      if (selectedFormat === "video") {
        const selectedQuality = dialog.querySelector(
          'input[name="quality"]:checked'
        );
        if (!selectedQuality) {
          alert("Please select a video quality");
          return;
        }
        quality = selectedQuality.value;
        codec = selectedQuality.getAttribute("data-codec");
      } else {
        const selectedBitrate = dialog.querySelector(
          'input[name="bitrate"]:checked'
        );
        if (!selectedBitrate) {
          alert("Please select an audio bitrate");
          return;
        }
        quality = selectedBitrate.value;
      }

      GM_setValue("lastSelectedShortsFormat", selectedFormat);

      try {
        await downloadWithMP3YouTube(videoUrl, selectedFormat, quality, codec);

        closeDialog(dialog, backdrop, false);
      } catch (error) {
        console.error("Download error:", error);
        closeDialog(dialog, backdrop, false);
      }
    });
  }

  function insertDownloadButton() {
    const targetSelector = "#owner";
    const target = document.querySelector(targetSelector);

    if (target && !document.querySelector(".ytddl-download-btn")) {
      const downloadButton = createDownloadButton();
      target.appendChild(downloadButton);
    }
  }

  function insertShortsDownloadButton() {
    const selectors = [
      "ytd-reel-video-renderer[is-active] #like-button",
      "ytd-shorts #like-button",
      "#shorts-player #like-button",
      "ytd-reel-video-renderer #like-button",
    ];

    for (const selector of selectors) {
      const likeButtonContainer = document.querySelector(selector);

      if (
        likeButtonContainer &&
        !document.querySelector(".ytddl-shorts-download-btn")
      ) {
        const downloadButton = createShortsDownloadButton();
        likeButtonContainer.parentNode.insertBefore(
          downloadButton,
          likeButtonContainer
        );
        return true;
      }
    }
    return false;
  }

  function isChannelPage() {
    return (
      window.location.href.includes("youtube.com/") &&
      (window.location.href.includes("/channel/") ||
        window.location.href.includes("/@")) &&
      !window.location.href.includes("/video/") &&
      !window.location.href.includes("/watch")
    );
  }

  function checkAndInsertButton() {
    const isShorts = window.location.pathname.includes("/shorts/");
    const channelPage = isChannelPage();

    if (isShorts) {
      if (!insertShortsDownloadButton()) {
        let retryCount = 0;
        const maxRetries = 10;

        const shortsObserver = new MutationObserver((_mutations, observer) => {
          if (insertShortsDownloadButton()) {
            observer.disconnect();
          } else {
            retryCount++;
            if (retryCount >= maxRetries) {
              observer.disconnect();
            }
          }
        });

        const shortsContainer =
          document.querySelector("ytd-shorts") || document.body;
        shortsObserver.observe(shortsContainer, {
          childList: true,
          subtree: true,
        });

        setTimeout(() => {
          insertShortsDownloadButton();
        }, 1000);
      }
    } else if (window.location.pathname.includes("/watch")) {
      insertDownloadButton();
    } else if (channelPage) {
      insertChannelDownloadButton();
    }
  }
})();