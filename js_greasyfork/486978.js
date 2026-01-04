// ==UserScript==
// @name           🌚 Dark Get Emoji
// @namespace      https://greasyfork.org/pl/users/1081704-nameniok
// @version        1.0.4
// @author         Nameniok
// @description    Dark mode for Get Emoji
// @run-at         document-start
// @match          https://getemoji.com/
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/486978/%F0%9F%8C%9A%20Dark%20Get%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/486978/%F0%9F%8C%9A%20Dark%20Get%20Emoji.meta.js
// ==/UserScript==

(function() {
  var DarkGetEmojiStyles = document.createElement('style');
  DarkGetEmojiStyles.textContent = `
    body {
      background-color: #111 !important;
      color: #ccc !important;
    }
    input {
      background-color: #333 !important;
      outline: none !important;
    }
    .emoji-button {
      border-width: 0px !important;
    }
    .emoji-button:hover {
      background-color: transparent !important;
    }
    .emoji-copied-text {
      background-color: #222 !important;
      border-width: 0px !important;
      color: #ccc !important;
    }
    *::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
    *::-webkit-scrollbar-track {
      background: transparent;
    }
    *::-webkit-scrollbar-thumb {
      background-color: #222;
      border-radius: 6px;
    }
    *::-webkit-scrollbar-thumb:hover {
      background-color: #333;
    }
    *::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    * {
      scrollbar-width: thin;
      scrollbar-color: #222 transparent;
    }
    *:hover {
      scrollbar-color: #333 transparent;
    }
  `;
  document.documentElement.insertAdjacentHTML('afterbegin', DarkGetEmojiStyles.outerHTML);
})();