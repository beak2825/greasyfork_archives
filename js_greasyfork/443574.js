// ==UserScript==
// @name        Idlescape shut up chat
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description The chatbox in Idlescape is initially hidden but can be expanded
// @license     GPL-3.0
// @author      WilliW
// @match       https://idlescape.com/game
// @icon        https://no-fun.de/images/shutup.png
// @downloadURL https://update.greasyfork.org/scripts/443574/Idlescape%20shut%20up%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/443574/Idlescape%20shut%20up%20chat.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  "use strict";

  onGameReady(hideChat);

  function onGameReady(callback) {
    const chatButtons = document.getElementsByClassName("chat-buttons");
    if (chatButtons.length === 0) {
      setTimeout(function () {
        onGameReady(callback);
      }, 250);
    } else {
      callback(chatButtons[0]);
    }
  }

  function hideChat(buttons) {
    const hideButton = buttons.firstChild;
    if (hideButton) {
      hideButton.click();
    }
  }
})();
