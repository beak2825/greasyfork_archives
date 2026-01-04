// ==UserScript==
// @name        Yandex Mail Adblock
// @namespace   Violentmonkey Scripts
// @match       https://mail.yandex.ru/*
// @grant       none
// @version     1.0.2
// @author      lavrent
// @description block the horizontal and the vertical ad bars
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521286/Yandex%20Mail%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/521286/Yandex%20Mail%20Adblock.meta.js
// ==/UserScript==

(() => {
  function clearAds() {
    const adsVBar = document.querySelector('[class^="PageLayout-m__body--"]');
    if (adsVBar && adsVBar.children.length === 2) {
      adsVBar.children[1].remove();
    }

    const headerDiv = document.querySelector('[class^="ContentHeader-m__header--"]');
    if (headerDiv && headerDiv.children.length === 3) {
      headerDiv.children[1].remove();
    }
  }

  const observer = new MutationObserver(clearAds);
  const page = document.querySelector('[class^="PageLayout-m__main--"]');
  observer.observe(page, { childList: true, subtree: true });
})();



