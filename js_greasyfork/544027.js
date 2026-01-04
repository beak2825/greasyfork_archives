// ==UserScript==
// @name         Telegram Web — перемотка + сохранение прогресса видео
// @version      1.1
// @description  Перемотка видео стрелками и восстановление по автору и времени
// @match        https://web.telegram.org/*
// @grant        none
// @namespace    https://greasyfork.org/users/789838
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544027/Telegram%20Web%20%E2%80%94%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D1%82%D0%BA%D0%B0%20%2B%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B0%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/544027/Telegram%20Web%20%E2%80%94%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D1%82%D0%BA%D0%B0%20%2B%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B0%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- Configuration ---
  const STORAGE_KEY = 'tg_video_progress';
  const REWIND_TIME_SECONDS = 5; // Time to jump forward/backward on arrow key press
  const SAVE_PROGRESS_INTERVAL_MS = 2000; // How often to save video progress

  // --- Utility Functions ---

  /**
   * Loads video progress from localStorage.
   * @returns {Object} An object mapping video keys to their last known playback time.
   */
  const loadProgress = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Telegram Video Progress: Error loading progress from localStorage:', e);
      return {};
    }
  };

  /**
   * Saves video progress to localStorage.
   * @param {Object} obj The object to save.
   */
  const saveProgress = obj => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      console.error('Telegram Video Progress: Error saving progress to localStorage:', e);
    }
  };

  /**
   * Checks if an element is visibly rendered on the page.
   * @param {HTMLElement} el The element to check.
   * @returns {boolean} True if the element is visible, false otherwise.
   */
  const isVisible = el => {
    return el && el.offsetParent !== null &&
           el.offsetWidth > 0 &&
           el.offsetHeight > 0 &&
           window.getComputedStyle(el).visibility !== 'hidden' &&
           window.getComputedStyle(el).display !== 'none'; // Added display check
  };

  // --- Keyboard Event Handler for Rewind ---

  // Using a Set to keep track of active interval IDs for each video
  const activeIntervals = new Map();

  document.addEventListener('keydown', e => {
    // Check if the focus is on an input field to prevent unintended rewinds
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Find the currently active/visible video.
      // Prioritize videos within the media viewer if open, otherwise any visible video.
      let video = document.querySelector('.media-viewer-content video');
      if (!video || !isVisible(video)) {
        const videos = Array.from(document.querySelectorAll('video')).filter(v => isVisible(v));
        video = videos[0]; // Take the first visible video if media viewer is not active
      }

      if (video && !video.paused && !video.ended) { // Only rewind if video is playing
        const newTime = video.currentTime + (e.key === 'ArrowRight' ? REWIND_TIME_SECONDS : -REWIND_TIME_SECONDS);
        video.currentTime = Math.max(0, Math.min(newTime, video.duration || newTime)); // Clamp to valid range

        e.stopPropagation(); // Stop event propagation to prevent Telegram's default actions
        e.preventDefault();  // Prevent default browser action (e.g., scrolling)
      }
    }
  }, true); // Use `true` for capture phase to ensure it runs before Telegram's handlers

  // --- Media Viewer Observer ---

  const observer = new MutationObserver(mutations => {
    // Optimized to only re-evaluate when necessary
    const mediaViewer = document.querySelector('.media-viewer-modal, .media-viewer-backdrop'); // More robust selector for the viewer
    if (!mediaViewer || !isVisible(mediaViewer)) {
      // If media viewer is closed or not visible, clear all intervals
      activeIntervals.forEach(intervalId => clearInterval(intervalId));
      activeIntervals.clear();
      return;
    }

    const nameEl = mediaViewer.querySelector('.media-viewer-name .peer-title, .media-viewer-modal .ChannelInfo-title, .media-viewer-modal .PrivateChatInfo-title'); // Broader selection for titles
    const dateEl = mediaViewer.querySelector('.media-viewer-date, .media-viewer-modal .ChatInfo-date'); // Broader selection for dates
    const video = mediaViewer.querySelector('video');

    if (!nameEl || !dateEl || !video || !isVisible(video)) {
      return;
    }

    const name = nameEl.textContent.trim();
    const date = dateEl.textContent.trim();
    // Use a combination of URL and date to make the key more unique for the same author on different dates
    const videoSrc = video.src || video.currentSrc;
    const key = `${name} @ ${date} ${videoSrc}`;

    let store = loadProgress();

    // Restore progress
    // Use a unique dataset attribute or a WeakMap for tracking to avoid conflicts
    if (store[key] && !video.dataset.tgProgressRestored) {
      video.currentTime = store[key];
      video.dataset.tgProgressRestored = 'true'; // Mark as restored
      console.log(`Telegram Video Progress: Restored progress for "${name}" from ${store[key].toFixed(2)}s`);
    }

    // Set up interval for saving progress
    // Ensure only one interval per video instance
    if (!activeIntervals.has(key)) {
      // Clear any existing interval for this key if it somehow lingered
      if (activeIntervals.has(key)) {
        clearInterval(activeIntervals.get(key));
      }

      const intervalId = setInterval(() => {
        if (video.paused || video.ended || !isVisible(video)) {
          // Clear interval if video is paused, ended, or no longer visible
          clearInterval(intervalId);
          activeIntervals.delete(key);
          console.log(`Telegram Video Progress: Stopped saving progress for "${name}".`);
          return;
        }

        // Only save if progress changed meaningfully to avoid excessive writes
        if (Math.abs(store[key] - video.currentTime) > 1) { // Save if changed by more than 1 second
          store[key] = video.currentTime;
          saveProgress(store);
          // console.log(`Telegram Video Progress: Saved progress for "${name}" to ${video.currentTime.toFixed(2)}s`);
        }
      }, SAVE_PROGRESS_INTERVAL_MS);

      activeIntervals.set(key, intervalId);
      console.log(`Telegram Video Progress: Started saving progress for "${name}".`);
    }
  });

  // Observe the document body for changes, particularly when the media viewer opens/closes
  observer.observe(document.body, { childList: true, subtree: true });

  console.log('Telegram Video Progress: Script initialized.');
})();