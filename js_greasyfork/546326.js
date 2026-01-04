// ==UserScript==
// @name         Удаление блока Gamers VPN
// @namespace    Tampermonkey
// @version      1.0
// @description  Удаляет рекламный блок на YouTube при загрузке страницы
// @author       KryptonFG
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546326/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0%20Gamers%20VPN.user.js
// @updateURL https://update.greasyfork.org/scripts/546326/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0%20Gamers%20VPN.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function removePremiumBlock() {
    const el = document.querySelector('div.premium.premium--animated.premium--gradient.premium--dark');
    if (el) {
      el.remove();
      // console.log("Premium-блок удалён");
    }
  }

  // Удалить сразу после загрузки
  removePremiumBlock();

  // Наблюдатель, чтобы удалять при динамических подгрузках (SPA)
  const observer = new MutationObserver(removePremiumBlock);
  observer.observe(document.body, { childList: true, subtree: true });
})();
