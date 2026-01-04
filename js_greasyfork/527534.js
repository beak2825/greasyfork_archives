// ==UserScript==
// @name         Deepseek Chat Width Wizard (style)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Designed to optimize the width of the chat window, you can enjoy the best chat experience at any screen size. This plugin provides a more intuitive and comfortable chat interface by automatically adjusting and customizing element widths.|界面优化
// @author       Bela Proinsias
// @match        https://chat.deepseek.com/a/chat/*
// @match        https://chat.deepseek.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527534/Deepseek%20Chat%20Width%20Wizard%20%28style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527534/Deepseek%20Chat%20Width%20Wizard%20%28style%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const TARGET_VARIABLE = "--message-list-max-width";

  function setCustomWidth() {
    const dynamicWidth = window.innerWidth * 0.85;
    const FINAL_WIDTH = `${dynamicWidth}px`;

    document.documentElement.style.setProperty(
      TARGET_VARIABLE,
      FINAL_WIDTH,
      "important"
    );

    document.querySelectorAll("*").forEach((el) => {
      if (getComputedStyle(el).getPropertyValue(TARGET_VARIABLE)) {
        el.style.setProperty(TARGET_VARIABLE, FINAL_WIDTH, "important");
      }
    });
  }

  function observeChanges() {
    new MutationObserver(setCustomWidth).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  window.addEventListener("load", () => {
    setCustomWidth();
    observeChanges();
  });

  window.addEventListener("resize", setCustomWidth);
})();
