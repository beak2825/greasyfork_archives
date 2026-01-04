// ==UserScript==
// @name         Duração Restante da Playlist no YouTube
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Mostra automaticamente a duração restante da playlist no título, ao assistir um vídeo do YouTube com playlist.
// @author       JPedro-M
// @match        http://*.youtube.com/*
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533548/Dura%C3%A7%C3%A3o%20Restante%20da%20Playlist%20no%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/533548/Dura%C3%A7%C3%A3o%20Restante%20da%20Playlist%20no%20YouTube.meta.js
// ==/UserScript==

(function () {
  'use strict';

  setInterval(() => {
      init();
  }, 5000);

  function init() {
      const containers = document.querySelectorAll("#playlist");
      const titlesContainers = document.querySelectorAll("#header-description > h3:nth-child(1) > yt-formatted-string");
      if (containers.length === 0 || titlesContainers.length === 0) {
          return;
      }

      const itens = containers[containers.length - 1].querySelectorAll(".badge-shape-wiz__text");
      const title = titlesContainers[titlesContainers.length - 1];

      let totalTime = 0;
      let viewed = false;

      if (itens.length === 0) {
          return;
      }

      itens.forEach(element => {
          const time = element.textContent.trim();
          const timeParts = time.split(":").map(Number);

          const minutes = timeParts.length === 2 ? timeParts[0] : 0;
          const seconds = timeParts.length === 2 ? timeParts[1] : 0;

          if (element.closest("#playlist-items").hasAttribute("selected")) {
              viewed = true;
          }
          if (!viewed) {
             return;
          }

          const totalSeconds = (minutes * 60) + seconds;

          totalTime += totalSeconds;
      })

      const totalHours = Math.floor(totalTime / 3600);
      const totalMinutes = Math.floor((totalTime % 3600) / 60);
      const totalSeconds = totalTime % 60;
      const totalTimeFormatted = `${totalHours > 0 ? String(totalHours).padStart(2, '0') + ":" : ""}${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

      title.textContent = `${title.title} - ${totalTimeFormatted}`;
  }
})();