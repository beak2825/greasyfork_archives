// ==UserScript==
// @name         phind
// @description  Listen for postMessage from parent, log to console, enter it into the chat input, and submit
// @match        https://www.phind.com/*
// @version 0.0.1.20250521215436
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536748/phind.user.js
// @updateURL https://update.greasyfork.org/scripts/536748/phind.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener("message", (event) => {

    if (event.data && event.data.type === 'newChatButtonClicked') {
      // Click the "New Chat" button
      const newChatButton = document.querySelector('button#new-chat-button');
      if (newChatButton) newChatButton.click();
      return;
    }

    if (event.data?.type === "prompt") {
      const input = document.getElementById("chat-input");
      const button = document.getElementById("send-message-button");

      input.innerText = event.data.content;

      const observer = new MutationObserver(() => {
        if (!button.hasAttribute("disabled")) {
          button.click();
          observer.disconnect(); // stop observing once clicked
        }
      });

      observer.observe(button, { attributes: true, attributeFilter: ["disabled"] });
    }
  });
})();