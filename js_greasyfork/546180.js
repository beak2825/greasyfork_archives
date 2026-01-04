// ==UserScript==
// @name         YouTube Auto-Liker + Ukrainian Anthem
// @namespace    https://github.com/custom-scripts
// @version      2.0
// @description  Автоматически ставит лайки на YouTube и проигрывает гимн Украины при клике "Лайк"
// @author       Freedom
// @license      MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg
// @match        *://*.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546180/YouTube%20Auto-Liker%20%2B%20Ukrainian%20Anthem.user.js
// @updateURL https://update.greasyfork.org/scripts/546180/YouTube%20Auto-Liker%20%2B%20Ukrainian%20Anthem.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === Настройки ===
  const WATCH_THRESHOLD = 30; // процент просмотра для автолайка
  const LIKE_IF_NOT_SUBSCRIBED = true; // ставить лайки даже если не подписан
  const AUTO_LIKE_LIVE_STREAMS = true; // лайкать стримы

  // === Селекторы ===
  const SELECTORS = {
    PLAYER: '#movie_player',
    SUBSCRIBE_BUTTON: '#subscribe-button',
    LIKE_BUTTON: '#menu #top-level-buttons-computed ytd-toggle-button-renderer:nth-child(1) button, #segmented-like-button button',
    DISLIKE_BUTTON: '#menu #top-level-buttons-computed ytd-toggle-button-renderer:nth-child(2) button, #segmented-dislike-button button'
  };

  const autoLikedVideoIds = [];
  let anthemPlayer = null;

  // === Воспроизведение гимна ===
  function playAnthem() {
    if (anthemPlayer) anthemPlayer.remove();
    anthemPlayer = document.createElement("audio");
    anthemPlayer.src = "https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d1/State_Anthem_of_Ukraine_instrumental.ogg/State_Anthem_of_Ukraine_instrumental.ogg.mp3";
    anthemPlayer.autoplay = true;
    anthemPlayer.volume = 0.8;
    document.body.appendChild(anthemPlayer);
  }

  // === Получение ID видео ===
  function getVideoId() {
    const elem = document.querySelector('#page-manager > ytd-watch-flexy');
    if (elem && elem.hasAttribute('video-id')) {
      return elem.getAttribute('video-id');
    } else {
      return new URLSearchParams(window.location.search).get('v');
    }
  }

  // === Проверка процента просмотра ===
  function watchThresholdReached() {
    const player = document.querySelector(SELECTORS.PLAYER);
    if (player && player.getDuration && player.getCurrentTime) {
      const watched = player.getCurrentTime() / player.getDuration();
      return watched >= WATCH_THRESHOLD / 100;
    }
    return false;
  }

  // === Проверка подписки ===
  function isSubscribed() {
    const subscribeButton = document.querySelector(SELECTORS.SUBSCRIBE_BUTTON);
    if (!subscribeButton) return false;
    return subscribeButton.innerText.includes("Вы подписаны") || subscribeButton.querySelector("paper-button[subscribed]") !== null;
  }

  // === Проверка кнопки ===
  function isButtonPressed(button) {
    return button?.classList.contains('style-default-active') || button?.getAttribute('aria-pressed') === 'true';
  }

  // === Лайк ===
  function like(auto = false) {
    const likeButton = document.querySelector(SELECTORS.LIKE_BUTTON);
    const dislikeButton = document.querySelector(SELECTORS.DISLIKE_BUTTON);
    if (!likeButton || !dislikeButton) return;

    const videoId = getVideoId();

    if (isButtonPressed(likeButton)) {
      autoLikedVideoIds.push(videoId);
    } else if (isButtonPressed(dislikeButton)) {
      return;
    } else if (autoLikedVideoIds.includes(videoId) && auto) {
      return;
    } else {
      likeButton.click();
      if (isButtonPressed(likeButton)) {
        autoLikedVideoIds.push(videoId);
        if (!auto) playAnthem(); // только если кликнул сам
      }
    }
  }

  // === Автолайк ===
  function wait() {
    if (watchThresholdReached()) {
      try {
        if (LIKE_IF_NOT_SUBSCRIBED || isSubscribed()) {
          if (AUTO_LIKE_LIVE_STREAMS ||
            window.getComputedStyle(document.querySelector('.ytp-live-badge') || {}).display === 'none') {
            like(true);
          }
        }
      } catch (e) {
        console.warn("Auto-like error:", e);
      }
    }
  }

  // === Слушатель на клик лайка (чтобы включался гимн) ===
  document.addEventListener("click", e => {
    if (e.target.closest(SELECTORS.LIKE_BUTTON)) {
      playAnthem();
    }
  });

  // === Запуск ===
  setInterval(wait, 5000);
})();
