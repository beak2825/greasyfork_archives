// ==UserScript==
// @name         Скрыть записи трансляций на YouTube
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Скрывает записи трансляций на YouTube (с подписью "Трансляция закончилась ... назад").
// @author       KrypyonFG
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540383/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B8%20%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BB%D1%8F%D1%86%D0%B8%D0%B9%20%D0%BD%D0%B0%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/540383/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%B8%20%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BB%D1%8F%D1%86%D0%B8%D0%B9%20%D0%BD%D0%B0%20YouTube.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const observer = new MutationObserver(hideEndedStreams);
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  // Шаблон "Трансляция закончилась ... назад" — с разными единицами времени
  const endedStreamRegex = /Трансляция закончилась\s.+назад/i;

  function hideEndedStreams() {
    const items = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer');

    items.forEach(item => {
      if (item.innerText.match(endedStreamRegex)) {
        item.style.display = 'none';
      }
    });
  }

  // Запустить сразу и потом следить за изменениями
  hideEndedStreams();
  observer.observe(targetNode, config);
})();
