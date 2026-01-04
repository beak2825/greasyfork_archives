// ==UserScript==
// @name			Убрать автозапуск с каналов YouTube
// @namespace       https://greasyfork.org/users/953995
// @description		Убирает автозапуск видео каналов YouTube
// @version         blic-1.1
// @date			2022-09-03
// @author          blic
// @icon			https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @match       https://www.youtube.com/*
// @run-at          document-end
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/459732/%D0%A3%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%20%D1%81%20%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB%D0%BE%D0%B2%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/459732/%D0%A3%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%20%D1%81%20%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB%D0%BE%D0%B2%20YouTube.meta.js
// ==/UserScript==

(function main() {
  'use strict';

  const log = (...args) => console.log(`${GM.info.script.name}:`, ...args);
  log('start');

  const root = document.querySelector('ytd-page-manager');
  if (!root) return log('root node not found, exit');

  { // try to prevent autoplay w/o observer
    const video = root.querySelector('ytd-channel-video-player-renderer')?.querySelector('video');
    if (video) {
      video.addEventListener('loadstart', (e) => e.target.pause(), { passive: true });
      return log('channel video autoplay prevented w/o observer');
    }
  }

  const observer = new MutationObserver((mutationsList) => {
    const channelRenderer = root.querySelector('ytd-channel-video-player-renderer');
    mutationsList.some((mutationRecord) => {
      if (!mutationRecord.target.classList.contains('html5-video-container')) return false;
      return Array.from(mutationRecord.addedNodes).some((node) => {
        if (node.nodeName === 'VIDEO') {
          log('video captured');
          if (channelRenderer?.contains(node)) {
            observer.disconnect();
            node.addEventListener('loadstart', (e) => e.target.pause(), { passive: true });
            log('channel video autoplay prevented');
          }
        }
      });
    });
  });
  observer.observe(root, { childList: true, subtree: true });
  return log('observer observe');
}());
