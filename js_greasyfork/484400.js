// ==UserScript==
// @name         Arabic Reddit Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhance reddit.com with Arabic support
// @author       You
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484400/Arabic%20Reddit%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/484400/Arabic%20Reddit%20Enhancements.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function logger(text) {
    console.log(`Arabic Reddit: ${text}`);
  }

  function fixDir() {
    logger(`fixing dir`);
    const allTags = document.querySelectorAll("*");
    allTags.forEach((e) => e.setAttribute("dir", "auto"));

    // check if it works in development
    if (typeof GM_info !== "undefined") {
      addStyle(`
    :dir(rtl) {
        background-color: red;
        }`);
    }

    // Create an observer instance
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const allTags = document.querySelectorAll("*");
        allTags.forEach((e) => e.setAttribute("dir", "auto"));
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function fixArabic() {
    fixDir();
  }

  // run on page load / changes
  window.addEventListener("popstate", () => fixArabic());
  // run on page load
  document.addEventListener("DOMContentLoaded", () => fixArabic());
  fixArabic();
})();
