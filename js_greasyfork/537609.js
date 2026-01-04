// ==UserScript==
// @name         ChatGPT Submit on Enter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Submit on Enter immediately even before button exists, includes composer-submit-button click
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/537609/ChatGPT%20Submit%20on%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/537609/ChatGPT%20Submit%20on%20Enter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener("load", () => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();

        const composerButton = document.getElementById("composer-submit-button");
        if (composerButton && !composerButton.disabled) {
          composerButton.click();
          return;
        }
      }
    });
  });
})();
