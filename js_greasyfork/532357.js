// ==UserScript==
// @name         Auto Dark Mode for Firebase Console
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Works for desktop
// @author       Avi (https://avi12.com)
// @copyright    2025 Avi (https://avi12.com)
// @license      MIT
// @match        https://console.firebase.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=firebase.google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532357/Auto%20Dark%20Mode%20for%20Firebase%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/532357/Auto%20Dark%20Mode%20for%20Firebase%20Console.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const darkQuery = matchMedia("(prefers-color-scheme: dark)");
  darkQuery.addEventListener("change", e => {
    const theme = e.matches ? "dark" : "light";
    document.body.classList.value = document.body.classList.value.replace(/fire-scheme-(light|dark)/, `fire-scheme-${theme}`);
    document.documentElement.style.colorScheme = theme;
  });

  new MutationObserver((_, observer) => {
    // noinspection CssInvalidHtmlTagReference
    const elThemeMenuToggle = document.querySelector("fire-theme-switcher");
    if (!elThemeMenuToggle) {
      return;
    }

    observer.disconnect();
    elThemeMenuToggle.click();
    const elThemeMenu = document.querySelector("#mat-menu-panel-1 > div > button:last-of-type");
    elThemeMenu.click();
  }).observe(document, {childList: true, subtree: true});
})();
