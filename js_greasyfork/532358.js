// ==UserScript==
// @name         Auto Dark Mode for Twitch
// @namespace    https://bengrant.dev
// @version      0.4
// @description  Works for desktop
// @author       Avi (https://avi12.com)
// @copyright    2025 Avi (https://avi12.com)
// @license      MIT
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532358/Auto%20Dark%20Mode%20for%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/532358/Auto%20Dark%20Mode%20for%20Twitch.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * @returns {HTMLButtonElement}
   */
  const getElButtonProfile = () => document.querySelector("button[data-a-target=user-menu-toggle]");
  const OBSERVER_OPTIONS = { childList: true, subtree: true };

  function setTheme() {
    const { activeElement } = document;
    const elButtonProfile = getElButtonProfile();
    new MutationObserver((_, observer) => {
      const elDarkToggle = document.querySelector("[data-test-selector=user-menu-dropdown__main-menu] input[type=checkbox]");
      if (!elDarkToggle) {
        return;
      }
      observer.disconnect();
      elDarkToggle.click();
      elButtonProfile.click();
      activeElement.focus();
    }).observe(document, OBSERVER_OPTIONS);
    elButtonProfile.click();
  }

  const darkQuery = matchMedia("(prefers-color-scheme: dark)");
  new MutationObserver((_, observer) => {
    if (!getElButtonProfile()) {
      return;
    }

    const themeNew = darkQuery.matches ? "dark" : "light";
    const themeCurrent = document.documentElement.classList.value.match(/tw-root--theme-(dark|light)/)[1];
    const isChangeTheme = themeNew !== themeCurrent;
    observer.disconnect();
    if (!isChangeTheme) {
      return;
    }
    setTheme();
  }).observe(document, OBSERVER_OPTIONS);

  darkQuery.addEventListener("change", setTheme);
})();
