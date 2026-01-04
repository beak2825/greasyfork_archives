// ==UserScript==
// @name         Twitter Auto Theme
// @namespace    https://techandnature.net/
// @version      0.1
// @description  Automatically switches between light and dark themes on Twitter.com (web version) based on system settings.
// @author       Christian Daus
// @match        https://twitter.com/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452575/Twitter%20Auto%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/452575/Twitter%20Auto%20Theme.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const MAX_AGE = 60 * 60 * 24 * 365; //seconds in a year
  let currentNightMode = document.cookie
    .split(";")
    .find(cookie => cookie.includes("night_mode"))
    .split("=")[1];
  let newNightMode;
  let wasThemeSwitched = false;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    newNightMode = "1";
  } else {
    newNightMode = "0";
  }

  if (newNightMode !== currentNightMode) {
    wasThemeSwitched = true;
    document.cookie = `night_mode=${newNightMode}; domain=.twitter.com; secure; max-age=${MAX_AGE}`;
  }

  console.log(
    `Twitter Auto Theme: Theme changed: ${wasThemeSwitched}, Night mode: ${newNightMode}`
  );
})();
