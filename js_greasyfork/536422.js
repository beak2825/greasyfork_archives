// ==UserScript==
// @name         VK Volume Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shift + Scroll изменяет громкость плеера
// @author       wilovan
// @match        https://vk.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536422/VK%20Volume%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/536422/VK%20Volume%20Scroll.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function linearToVkVolume(linear) {
    return Math.pow(linear, 2.2);
  }

  function vkVolumeToLinear(vkVol) {
    return Math.pow(vkVol, 1 / 2.2);
  }

  let volumeLinear = 0;

  setTimeout(() => {
    try {
      const vkVol = getAudioPlayer()._userVolume ?? 0;
      volumeLinear = vkVolumeToLinear(vkVol);
      console.log('Начальная линейная громкость:', volumeLinear.toFixed(2));
    } catch {
      volumeLinear = 0;
      console.warn('Не удалось получить громкость, ставим 0');
    }
  }, 2000);

  document.addEventListener('wheel', function (e) {
    if (!e.shiftKey) return;

    const delta = e.deltaY < 0 ? 0.01 : -0.01; //0.01 шаг громкости - 1%
    volumeLinear = Math.min(1, Math.max(0, volumeLinear + delta));

    const vkVolToSet = linearToVkVolume(volumeLinear);

    try {
      getAudioPlayer().setVolume(vkVolToSet);
      console.log(`🔊 Громкость: ${volumeLinear.toFixed(2)} (VK: ${vkVolToSet.toFixed(3)})`);
    } catch (err) {
      console.error('❌ Ошибка при вызове getAudioPlayer().setVolume()', err);
    }

    e.preventDefault();
  }, { passive: false });
})();
