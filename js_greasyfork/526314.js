// ==UserScript==
// @name         DeepSeek Auto-Retry
// @version      1.1
// @description  Automatically click the retry button when DS message blocks show "The server is busy. Please try again later." or "Thought for 0 seconds". Uses a cooldown so that repeated clicks occur if the error persists.Automatically click the retry button when DS message blocks show error messages.
// @author       Staninna
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/526314/DeepSeek%20Auto-Retry.user.js
// @updateURL https://update.greasyfork.org/scripts/526314/DeepSeek%20Auto-Retry.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration object with error phrases and timing settings.
  const config = {
    autoRetryEnabled: true,
    cooldown: 15000, // 15 seconds between retries per message block.
    interval: 3000, // Check every 3 seconds.
    errorMessages: [
      "The server is busy. Please try again later.",
      "服务器繁忙，请稍后再试。",
      "Thought for 0 seconds",
    ],
  };

  // Returns true if the provided text contains any of the error phrases.
  function isError(text) {
    return config.errorMessages.some((msg) => text.includes(msg));
  }

  // Locate the retry button by looking for a matching SVG element.
  function findRetryButton() {
    const buttons = document.querySelectorAll("div.ds-icon-button");

    // Loop backward to prioritize the end of the array.
    for (let i = buttons.length - 1; i >= 0; i--) {
      const btn = buttons[i];
      if (btn.querySelector("svg rect#重新生成") !== null) {
        return btn;
      }
    }
    return null;
  }

  // Returns the inner text of a DS markdown block.
  function getMarkdownText(el) {
    return el.innerText || "";
  }

  // Checks all DS markdown blocks for error messages. If a block shows an error and
  // if the cooldown period has passed, this function triggers a retry click.
  function checkErrorMarkdowns() {
    if (!config.autoRetryEnabled) return;

    const blocks = document.querySelectorAll(
      "div.ds-markdown.ds-markdown--block"
    );
    blocks.forEach((block) => {
      const text = getMarkdownText(block);
      if (isError(text)) {
        const last = parseInt(block.dataset.lastRetry || "0", 10);
        const now = Date.now();
        if (now - last > config.cooldown) {
          block.dataset.lastRetry = now.toString();
          console.log("Auto-retry triggered due to error text in markdown block.");
          const btn = findRetryButton();
          if (btn) {
            btn.click();
          } else {
            console.log("Retry button not found.");
          }
        }
      }
    });
  }

  // Creates a DS-style UI toggle to allow users to enable/disable the auto-retry.
  function createToggleUI() {
    const uiContainer = document.createElement("div");
    uiContainer.id = "autoRetryToggleUI";
    uiContainer.className = "ds-form-item ds-form-item--label-s";
    uiContainer.style.position = "fixed";
    uiContainer.style.bottom = "70px";
    uiContainer.style.right = "20px";
    uiContainer.style.zIndex = "9999";

    uiContainer.innerHTML = `
      <label class="ds-checkbox-wrapper ds-checkbox-wrapper--m" 
             style="cursor: pointer; user-select: none;">
        <span class="ds-checkbox">
          <input type="checkbox" id="autoRetryCheckbox" class="ds-checkbox__input" checked>
          <span class="ds-checkbox__box"></span>
        </span>
        <span class="ds-checkbox__label">Auto‑Retry</span>
      </label>
    `;
    document.body.appendChild(uiContainer);

    document
      .getElementById("autoRetryCheckbox")
      .addEventListener("change", function () {
        config.autoRetryEnabled = this.checked;
        console.log("Auto‑Retry turned " + (this.checked ? "ON" : "OFF"));
      });
  }

  // Initialize the script: Set up the UI and start periodic error checks.
  function initialize() {
    createToggleUI();
    setInterval(checkErrorMarkdowns, config.interval);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
