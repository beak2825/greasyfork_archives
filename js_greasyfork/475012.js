// ==UserScript==
// @name         Microsoft Teams auto dark mode
// @version      0.1.4
// @description  Automatically switch the dark mode according to the system settings, which uses the official style
// @namespace    https://teams.microsoft.com/
// @match        https://teams.microsoft.com/_*
// @icon         https://statics.teams.cdn.office.net/hashed/favicon/prod/favicon-32x32-4102f07.png
// @author       bowencool
// @license      MIT
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/waitForElementToExist.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475012/Microsoft%20Teams%20auto%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/475012/Microsoft%20Teams%20auto%20dark%20mode.meta.js
// ==/UserScript==

(function () {
  "use strict";

  async function toggle(
    isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    const link = document.querySelector('#themed-stylesheet[rel="stylesheet"]');
    const url = link.href;
    const currentThemeIsDark = url.includes("dark");
    console.log({ isDarkMode, currentThemeIsDark });
    if (isDarkMode) {
      if (currentThemeIsDark) return;
      (await waitForElementToExist("#settings-menu-button")).click();
      (
        await waitForElementToExist(
          '[data-tid="settingsDropdownOptionsButton"]'
        )
      ).click();
      (
        await waitForElementToExist(
          '[data-tid="optionsSettingsDialog-General"]'
        )
      ).click();
      (await waitForElementToExist('[data-tid="dark-theme"]')).click();
      (await waitForElementToExist('[data-tid="closeModelDialogBtn"]')).click();
    } else {
      if (!currentThemeIsDark) return;
      (await waitForElementToExist("#settings-menu-button")).click();
      (
        await waitForElementToExist(
          '[data-tid="settingsDropdownOptionsButton"]'
        )
      ).click();
      (
        await waitForElementToExist(
          '[data-tid="optionsSettingsDialog-General"]'
        )
      ).click();
      (await waitForElementToExist('[data-tid="default-theme"]')).click();
      (await waitForElementToExist('[data-tid="closeModelDialogBtn"]')).click();
    }
  }
  toggle();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      toggle(e.matches);
    });
})();
