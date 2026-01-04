// ==UserScript==
// @name         Moonbounce Focus Keybind
// @namespace    https://github.com/diary001/moonbounce
// @supportURL   https://discord.gg/pixel
// @license      MIT
// @version      1.0.3
// @description  Allows you to use the "=" key to toggle focus. ((made with <3 by lune))
// @author       lune / linktr.ee/moon
// @match        *://*/*
// @icon         https://framerusercontent.com/images/iuVZmsE2sifPExZXNrETQrDkU.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494339/Moonbounce%20Focus%20Keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/494339/Moonbounce%20Focus%20Keybind.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const simulateClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  function toggleFocus() {
    const focusContainer = document.querySelector("div#moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem");
    if (focusContainer) {
      const focusButton1 = focusContainer.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL > div:nth-child(4) > div > div > div > div._base_1b9zj_1._show_1b9zj_26 > button") || focusContainer.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL > div:nth-child(2) > div > div > div > div._base_1b9zj_1._show_1b9zj_26 > button");
      const focusButton2 = focusContainer.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL > div:nth-child(4) > div > div > div > div._base_1b9zj_1._hide_1b9zj_30 > button") || focusContainer.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL > div:nth-child(2) > div > div > div > div._base_1b9zj_1._hide_1b9zj_30 > button");
      const focusButton = focusButton1 || focusButton2;
      if (focusButton) {
        focusButton.dispatchEvent(simulateClick);
      }
    }
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === '=') {
      toggleFocus();
    }
  });
})();
