// ==UserScript==
// @name         Telegram Web — перемотка + сохранение прогресса видео
// @version      1.0
// @description  Перемотка видео стрелками и восстановление по автору и времени
// @match        https://web.telegram.org/*
// @grant        none
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/532597/Telegram%20Web%20%E2%80%94%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D1%82%D0%BA%D0%B0%20%2B%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B0%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/532597/Telegram%20Web%20%E2%80%94%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D1%82%D0%BA%D0%B0%20%2B%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B0%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const STORAGE_KEY = 'tg_video_progress';
  const loadProgress = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const saveProgress = obj => localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));

  const isVisible = el =>
    el.offsetParent !== null &&
    el.offsetWidth > 0 &&
    el.offsetHeight > 0 &&
    window.getComputedStyle(el).visibility !== 'hidden';

  // Обработчик стрелок
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const videos = Array.from(document.querySelectorAll('video')).filter(isVisible);
      if (videos.length) {
        const v = videos[0];
        v.currentTime += (e.key === 'ArrowRight' ? 5 : -5);
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }, true);

  // Слежение за media-viewer
  const observer = new MutationObserver(() => {
    const nameEl = document.querySelector('.media-viewer-name .peer-title');
    const dateEl = document.querySelector('.media-viewer-date');
    const video = document.querySelector('video');

    if (!nameEl || !dateEl || !video) return;

    const name = nameEl.textContent.trim();
    const date = dateEl.textContent.trim();
    const key = `${name} @ ${date}`;
    const store = loadProgress();

    if (store[key] && !video.dataset.restored) {
      video.currentTime = store[key];
      video.dataset.restored = '1';
    }

    if (!video.dataset.listened) {
      video.dataset.listened = '1';
      setInterval(() => {
        if (!video.paused && !video.ended) {
          store[key] = video.currentTime;
          saveProgress(store);
        }
      }, 2000);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
