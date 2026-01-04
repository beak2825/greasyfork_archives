// ==UserScript==
// @name         Moonbounce Chat Keybind
// @namespace    https://github.com/diary001/moonbounce
// @supportURL   https://discord.gg/pixel
// @license      MIT
// @version      1.0.5
// @description  Allows you to use the "/" key to open and close the chat. ((made with <3 by lune))
// @author       lune / linktr.ee/moon
// @match        *://*/*
// @icon         https://framerusercontent.com/images/iuVZmsE2sifPExZXNrETQrDkU.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490052/Moonbounce%20Chat%20Keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/490052/Moonbounce%20Chat%20Keybind.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const simulateClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  function toggleChatbox() {
    const chatBoxContainer = document.querySelector("div#moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem");
    if (chatBoxContainer) {
      const chatBoxButton1 = chatBoxContainer.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL > div:nth-child(2) > div > div > div > div._frame_1htaw_72 > button");
      const chatBoxButton2 = chatBoxContainer.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL > div:nth-child(4) > div > div > div > div._frame_1htaw_72 > button");
      const chatBoxButton = chatBoxButton1 || chatBoxButton2;
      if (chatBoxButton) {
        chatBoxButton.dispatchEvent(simulateClick);
      }
    }
  }

  function focusInput() {
    const inputContainer = document.querySelector("div#moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem");
    if (inputContainer) {
      const input1 = inputContainer.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL > div:nth-child(2) > div > div > div._base_1jfm3_1._overlay_card_mdpvo_9 > div > div:nth-child(5) > div > form > div > input");
      const input2 = inputContainer.shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL > div:nth-child(4) > div > div > div._base_1jfm3_1._overlay_card_mdpvo_9 > div > div:nth-child(5) > div > form > div > input");
      const input = input1 || input2;
      if (input) {
        input.focus();
      }
    }
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === '/' || event.key === 'Escape') {
      toggleChatbox();
      setTimeout(focusInput, 1);
    }
  });
})();
