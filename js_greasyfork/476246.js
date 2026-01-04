// ==UserScript==
// @name         Azure devops auto dark mode
// @version      0.1.2
// @description  Automatically switch the dark mode according to the system settings, which uses the official style
// @namespace    https://dev.azure.com/
// @match        https://dev.azure.com/*
// @icon         https://cdn.vsassets.io/content/icons/favicon.ico
// @author       bowencool
// @license      MIT
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/waitForElementToExist.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476246/Azure%20devops%20auto%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/476246/Azure%20devops%20auto%20dark%20mode.meta.js
// ==/UserScript==

(function () {
  "use strict";

  async function toggle(
    isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    /* 有两个事件会触发，而且有循环，必须加判断 */
    const bgColor = window.getComputedStyle(document.body).backgroundColor;

    const currentThemeIsDark = bgColor !== "rgb(255, 255, 255)";
    console.log({ isDarkMode, currentThemeIsDark });
    if (isDarkMode) {
      if (currentThemeIsDark) return;
      (await waitForElementToExist('[aria-label="User settings"]')).click();
      (await waitForElementToExist("#__bolt-changeThemeLink")).click();
      (
        await waitForElementToExist("#theme-ms-vss-web-vsts-theme-dark")
      ).click();
      (await waitForElementToExist('.theme-panel [aria-label="Close"]')).click();
    } else {
      if (!currentThemeIsDark) return;
      (await waitForElementToExist('[aria-label="User settings"]')).click();
      (await waitForElementToExist("#__bolt-changeThemeLink")).click();
      (
        await waitForElementToExist("#theme-ms-vss-web-vsts-theme")
      ).click();
      (await waitForElementToExist('.theme-panel [aria-label="Close"]')).click();
    }
  }
  toggle();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      toggle(e.matches);
    });
})();
