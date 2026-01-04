// ==UserScript==
// @name         Unlock YT Live Rewind
// @namespace    custom.scripts.youtube
// @version      1.1.0
// @description  Força o modo DVR em transmissões ao vivo no YouTube com DVR desativado
// @author       CustomDev
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536335/Unlock%20YT%20Live%20Rewind.user.js
// @updateURL https://update.greasyfork.org/scripts/536335/Unlock%20YT%20Live%20Rewind.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const originalDescriptor = Object.getOwnPropertyDescriptor(Object.prototype, 'playerResponse');

  const originalGet = originalDescriptor?.get?.bind(Object.prototype) ?? function () {
    return this.__rewindPatch__;
  };

  const originalSet = originalDescriptor?.set?.bind(Object.prototype) ?? function (val) {
    this.__rewindPatch__ = val;
  };

  function isPlainObject(val) {
    return val && typeof val === 'object';
  }

  function showDvrIndicator() {
    const tryAttach = () => {
      const player = document.querySelector('#movie_player, .html5-video-player');
      if (!player) {
        setTimeout(tryAttach, 200);
        return;
      }

      let indicator = document.createElement('div');
      indicator.textContent = "DVR";
      indicator.style.position = "absolute";
      indicator.style.top = "8px";
      indicator.style.right = "500px";
      indicator.style.padding = "2px 6px";
      indicator.style.borderRadius = "4px";
      indicator.style.fontWeight = "bold";
      indicator.style.zIndex = "9999";
      indicator.style.color = "white";
      indicator.style.backgroundColor = "gray";
      indicator.style.fontSize = "16px";
      indicator.style.pointerEvents = "none";
      indicator.style.transition = "background-color 0.5s ease";

      player.appendChild(indicator);

      setTimeout(() => { indicator.style.backgroundColor = "red"; }, 1000);
      setTimeout(() => { indicator.remove(); }, 6000);
    };

    tryAttach();
  }

  Object.defineProperty(Object.prototype, 'playerResponse', {
    configurable: true,
    get() {
      return originalGet.call(this);
    },
    set(newData) {
      if (!isPlainObject(newData)) {
        return originalSet.call(this, newData);
      }

      const video = newData.videoDetails;
      const stream = newData.streamingData;
      const config = newData.playerConfig;

      if (isPlainObject(video) && video.isLive && !video.isLiveDvrEnabled) {
        video.isLiveDvrEnabled = true;

        if (isPlainObject(config) && isPlainObject(config.mediaCommonConfig)) {
          config.mediaCommonConfig.useServerDrivenAbr = false;
        }

        if (isPlainObject(stream) && stream.serverAbrStreamingUrl) {
          delete stream.serverAbrStreamingUrl;
        }

        // Mostra o indicador apenas quando realmente ativar DVR
        showDvrIndicator();
      }

      originalSet.call(this, newData);
    }
  });
})();
