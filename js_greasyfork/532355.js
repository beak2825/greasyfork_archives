// ==UserScript==
// @name         Auto Dark Mode for Gemini
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Works for both desktop and mobile
// @author       Avi (https://avi12.com)
// @copyright    2025 Avi (https://avi12.com)
// @license      MIT
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532355/Auto%20Dark%20Mode%20for%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/532355/Auto%20Dark%20Mode%20for%20Gemini.meta.js
// ==/UserScript==


(function () {
  "use strict";

  /**
   * @param theme {"dark" | "light"}
   */
  function setTheme(theme) {
    document.body.classList.value = document.body.classList.value.replace(/(light|dark)-theme/, `${theme}-theme`);
    const storageItem = {
      light: "Light",
      dark: "Dark"
    };
    localStorage.setItem("Bard-Color-Theme", `Bard-${storageItem[theme]}-Theme`);
  }

  new MutationObserver((_, observer) => {
    const elMenuButton = document.querySelector("[data-test-id=side-nav-menu-button]");
    if (!elMenuButton) {
      return;
    }

    observer.disconnect();
    const darkQuery = matchMedia("(prefers-color-scheme: dark)");
    setTheme(darkQuery.matches ? "dark" : "light");
    darkQuery.addEventListener("change", e => setTheme(e.matches ? "dark" : "light"));
  }).observe(document, {childList: true, subtree: true});
})();
