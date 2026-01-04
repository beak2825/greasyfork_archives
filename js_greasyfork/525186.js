// ==UserScript==
// @name          Dynamic RTL/LTR Direction
// @namespace     http://tampermonkey.net/
// @version       V1
// @description   Dynamically set text direction for Deepseek chat elements based on content
// @author        Abdo Ibrahim
// @match         https://chat.deepseek.com/
// @match         https://chat.deepseek.com/*
// @match         https://chat.deepseek.com/*/chat/*/*
// @icon          https://www.deepseek.com/path/to/icon.png
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/525186/Dynamic%20RTLLTR%20Direction.user.js
// @updateURL https://update.greasyfork.org/scripts/525186/Dynamic%20RTLLTR%20Direction.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const textareaClass = "c92459f0";
  const targetClass = "ds-markdown ds-markdown--block";
  const codeClass = "md-code-block";
  const submitButtonClass = "f6d670";

  function isRTL(text) {
    const rtlPattern = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlPattern.test(text);
  }

  function updateDirection() {
    const targetElements = document.getElementsByClassName(targetClass);
    const codeElements = document.getElementsByClassName(codeClass);

    if (targetElements.length > 0) {
      const latestElement = targetElements[targetElements.length - 1];
      const textContent = latestElement.textContent.trim();
      const newDirection = isRTL(textContent) ? "rtl" : "ltr";

      if (textContent.length > 0 && latestElement.style.direction !== newDirection) {
        latestElement.style.direction = newDirection;
      }

      for (let i = 0; i < codeElements.length; i++) {
        codeElements[i].style.direction = "ltr";
      }
    }
  }

  function startObserving() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          updateDirection();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function handleSubmitButtonClick() {
    const submitButton = document.getElementsByClassName(submitButtonClass)[0];
    if (submitButton) {
      submitButton.addEventListener("click", () => {
        setTimeout(updateDirection, 500);
      });
    }
  }

  updateDirection();
  startObserving();
  handleSubmitButtonClick();
})();
