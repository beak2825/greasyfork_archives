// ==UserScript==
// @name         Ko-fi auto dark mode
// @namespace    https://phasmidasmr.com
// @version      1.0
// @description  Ko-fi recently added a native dark mode that has to be manually switched on. This script makes it so that it will automatically follow your OS preference.
// @author       Phasmid ASMR
// @match        https://ko-fi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ko-fi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462360/Ko-fi%20auto%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/462360/Ko-fi%20auto%20dark%20mode.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const toggleDarkTheme = () => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentTheme = document.documentElement.getAttribute("data-theme");

    if ((prefersDarkScheme && currentTheme !== "dark") || (!prefersDarkScheme && currentTheme !== "light")) {
      const newTheme = prefersDarkScheme ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      document.querySelector('#darkThemeToggle').click();
    }
  };

  // Call toggleDarkTheme on load
  toggleDarkTheme();

  // Listen for changes in the user's color scheme preference and call toggleDarkTheme
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", toggleDarkTheme);

})();