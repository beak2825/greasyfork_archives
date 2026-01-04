// ==UserScript==
// @name         Auto Dark Mode for Reddit
// @namespace    https://bengrant.dev
// @version      0.3
// @description  Works for desktop
// @author       Avi (https://avi12.com)
// @copyright    2025 Avi (https://avi12.com)
// @license      MIT
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532356/Auto%20Dark%20Mode%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/532356/Auto%20Dark%20Mode%20for%20Reddit.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * @returns {HTMLButtonElement}
   */
  const getElButtonProfile = () => document.querySelector("button#expand-user-drawer-button");

  // noinspection CssInvalidHtmlTagReference
  /**
   * @returns {HTMLElement}
   */
  const getElDarkToggle = () => document.querySelector("#darkmode-list-item faceplate-switch-input");

  const OBSERVER_OPTIONS = {childList: true, subtree: true};

  function openProfileDrawerAndToggleTheme() {
    const {activeElement} = document;
    const elButtonProfile = getElButtonProfile();
    new MutationObserver((_, observer) => {
      const elDarkToggle = getElDarkToggle();
      if (!elDarkToggle) {
        return;
      }
      const {shadowRoot} = elDarkToggle;
      if (!shadowRoot) {
        return;
      }
      const elDarkToggleInput = shadowRoot.querySelector("input");
      if (!elDarkToggleInput) {
        return;
      }
      observer.disconnect();
      requestAnimationFrame(() => {
        elDarkToggle.click();
        elButtonProfile.click();
        activeElement.focus();
      });
    }).observe(document, OBSERVER_OPTIONS);
    elButtonProfile.click();
  }

  const darkQuery = matchMedia("(prefers-color-scheme: dark)");
  new MutationObserver((_, observer) => {
    if (!getElButtonProfile()) {
      return;
    }

    const themeNew = darkQuery.matches ? "dark" : "light";
    const themeCurrent = document.cookie.match(/theme=([12])/)[1] === "1" ? "light" : "dark";
    const isChangeTheme = themeNew !== themeCurrent;
    observer.disconnect();
    if (!isChangeTheme) {
      return;
    }

    openProfileDrawerAndToggleTheme();
  }).observe(document, OBSERVER_OPTIONS);

  darkQuery.addEventListener("change", () => {
    const elDarkToggle = getElDarkToggle();
    if (elDarkToggle) {
      const {activeElement} = document;
      elDarkToggle.click();
      activeElement.focus();
      return;
    }

    openProfileDrawerAndToggleTheme();
  });
})();
