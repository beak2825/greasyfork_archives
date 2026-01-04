// ==UserScript==
// @name          Dynamic DeepSeek RTL/LTR Direction
// @namespace     http://tampermonkey.net/
// @version       V4.1
// @description   Dynamically set text direction for Deepseek chat elements based on content
// @author        Reda Elsayed
// @match         https://chat.deepseek.com/
// @match         https://chat.deepseek.com/*
// @match         https://chat.deepseek.com/*/chat/*/*
// @icon          https://www.deepseek.com/path/to/icon.png
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/523987/Dynamic%20DeepSeek%20RTLLTR%20Direction.user.js
// @updateURL https://update.greasyfork.org/scripts/523987/Dynamic%20DeepSeek%20RTLLTR%20Direction.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const textareaClass = "c92459f0";
  const targetClass = "ds-markdown ds-markdown--block";
  const codeClass = "md-code-block";

  function isRTL(text) {
    const rtlPattern = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlPattern.test(text);
  }

  function updateDirection() {
    const targetElements = document.getElementsByClassName(targetClass);
    const codeElements = document.getElementsByClassName(codeClass);

    Array.from(targetElements).forEach((element) => {
      const textContent = element.textContent.trim();
      const newDirection = isRTL(textContent) ? "rtl" : "ltr";

      if (textContent.length > 0 && element.style.direction !== newDirection) {
        element.style.direction = newDirection;
        element.style.textAlign = newDirection === "rtl" ? "right" : "left";
      }
    });

    Array.from(codeElements).forEach((element) => {
      element.style.direction = "ltr";
      element.style.textAlign = "left";
    });
  }

  function observeChanges() {
    const observer = new MutationObserver(() => {
      updateDirection();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function observeTextArea() {
    const textAreaElements = document.getElementsByClassName(textareaClass);
    Array.from(textAreaElements).forEach((textArea) => {
      textArea.addEventListener("input", () => {
        const text = textArea.value.trim();
        const direction = isRTL(text) ? "rtl" : "ltr";
        textArea.style.direction = direction;
        textArea.style.textAlign = direction === "rtl" ? "right" : "left";
      });
    });
  }

  function applyToExistingMessages() {
    // Ensure all existing messages have the correct direction on load
    updateDirection();
  }

  // Initialize the script
  applyToExistingMessages();
  observeChanges();
  observeTextArea();
})();
