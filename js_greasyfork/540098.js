// ==UserScript==
// @name            Auto adblock skipper on Youtube
// @namespace       https://greasyfork.org/nl/users/1486038-JooostS
// @version         2.8
// @author          JooostS
// @description     Auto-skips all ads and removes adblock popups on YouTube.
// @description:de  Entfernt die lästige Popup-Nachricht zur Verwendung eines Adblockers auf YouTube.
// @description:ru  Удаление всплывающего окна об использовании блокировщика рекламы на YouTube.
// @description:uk  Видалення спливаючого вікна про використання блокувальника реклами на YouTube.
// @description:zh  YouTube 广告拦截器弹出窗口移除器：移除 YouTube 上关于使用广告拦截器的烦人弹出窗口消息。
// @description:ja  YouTube広告ブロッカーポップアップリムーバー：YouTubeで広告ブロッカーを使用する際の迷惑なポップアップメッセージを除去します。
// @description:nl  YouTube Adblock Popup-verwijderaar: Verwijdert het vervelende pop-upbericht over het gebruik van een adblocker op YouTube.
// @description:pt  Removedor de pop-up de bloqueador de anúncios do YouTube: Remove a mensagem irritante de pop-up sobre o uso de um bloqueador de anúncios no YouTube.
// @description:es  Removedor de pop-up del bloqueador de anuncios de YouTube: Elimina el molesto mensaje emergente sobre el uso de un bloqueador de anuncios en YouTube.
// @description:it  Rimozione del popup del blocco pubblicità di YouTube: Rimuove il fastidioso messaggio popup sull'uso di un blocco pubblicità su YouTube.
// @description:ar  إزالة النافذة المنبثقة لمانع الإعلانات على يوتيوب: يزيل الرسالة المنبثقة المزعجة حول استخدام مانع الإعلانات على يوتيوب.
// @description:fr  Supprimeur de popup de bloqueur de publicités YouTube : Supprime le message pop-up ennuyeux sur l'utilisation d'un bloqueur de publicités sur YouTube.
// @match           *://www.youtube.com/*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/540098/Auto%20adblock%20skipper%20on%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/540098/Auto%20adblock%20skipper%20on%20Youtube.meta.js
// ==/UserScript==

const config = GM_getValue('config', { allowedReloadPage: true });
let video = null;
let pausedByUser = false;
let allowPauseVideoTimeoutId = 0;

function log(msg) {
  console.log(`[AdSkipper] ${msg}`);
}

function getSkipButton() {
  return document.querySelector('.ytp-skip-ad-button, .ytp-ad-skip-button, [class*="skip-ad"]');
}

function skipAd() {
  const player = document.querySelector('#movie_player');
  if (!player) return;

  video = player.querySelector('video.html5-main-video');
  if (!video) return;

  if (player.classList.contains('ad-showing')) {
    const skipButton = getSkipButton();
    if (skipButton) {
      skipButton.click();
      log('Ad skipped via button.');
    } else {
      video.currentTime = video.duration || 9999;
      video.playbackRate = 16;
      log('Ad accelerated.');
    }
  }
}

function removeAdblockPopups() {
  const popupSelectors = [
    'tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)',
    '.yt-playability-error-supported-renderers:has(.ytd-enforcement-message-view-model)'
  ];

  popupSelectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      el.remove();
      log('Adblock popup removed.');
      if (config.allowedReloadPage) location.reload();
    }
  });
}

function resumeVideoIfPausedUnexpectedly() {
  if (pausedByUser || document.hidden || !video || video.duration - video.currentTime < 0.1) return;
  video.play();
  log('Resumed video after unexpected pause.');
}

function enableVideoPause() {
  pausedByUser = true;
  clearTimeout(allowPauseVideoTimeoutId);
  allowPauseVideoTimeoutId = setTimeout(() => pausedByUser = false, 500);
}

function observePlayer() {
  const player = document.querySelector('#movie_player');
  if (!player || !window.MutationObserver) return;

  const observer = new MutationObserver(() => {
    skipAd();
    removeAdblockPopups();
  });

  observer.observe(player, { childList: true, subtree: true });
  log('MutationObserver attached to player.');
}

function initializeMenuCommands() {
  GM_registerMenuCommand(
    `Reload page if ad can't be skipped: ${config.allowedReloadPage ? 'Yes' : 'No'}`,
    () => {
      config.allowedReloadPage = !config.allowedReloadPage;
      GM_setValue('config', config);
      initializeMenuCommands();
    }
  );
}

function applyCustomStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #player-ads, #masthead-ad, ytd-ad-slot-renderer,
    ytd-rich-item-renderer:has(.ytd-ad-slot-renderer),
    ytd-reel-video-renderer:has(.ytd-ad-slot-renderer),
    .ytp-suggested-action, .ytp-endscreen-content,
    .ytp-ce-element, .ytp-pause-overlay,
    .ytp-ad-image-overlay, .ytp-ad-overlay-slot, .ytp-ad-module,
    .ytd-promoted-video-renderer, ytd-display-ad-renderer {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
  log('Custom styles applied.');
}

function setupEventListeners() {
  window.addEventListener('keydown', e => {
    if (['KeyK', 'MediaPlayPause', 'Space'].includes(e.code)) enableVideoPause();
  });
  window.addEventListener('keyup', e => {
    if (e.code === 'Space') enableVideoPause();
  });
  document.addEventListener('yt-navigate-finish', () => {
    observePlayer();
  });
}

function init() {
  applyCustomStyles();
  observePlayer();
  setupEventListeners();
  initializeMenuCommands();

  // periodic check for reliability
  setInterval(() => {
    skipAd();
    removeAdblockPopups();
  }, 1000);

  log('Script initialized.');
}

init();