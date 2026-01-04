// ==UserScript==
// @name         Google Invert Colors
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Inverts the colors of Google services for dark mode
// @author       You
// @license      MIT
// @match        https://*.google.com/*
// @exclude      https://drive.google.com/file/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539611/Google%20Invert%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/539611/Google%20Invert%20Colors.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const url = location.href;

  const sites = [
    {
      match: "drive.google.com", // Google Drive
      selectors: [".vhoiae"],
    },
    {
      match: "mail.google.com/chat", // Google Chat
      selectors: ["#loading", ".brC-brG", ".YADHBe", "#aso_search_form_anchor"],
    },
    {
      match: "meet.google.com", // Google Meets
      selectors: ["body", ".NONs6c", ".OMfBQ", ".p2ZbV:not(.zKHdkd)", ".R3Gmyc"],
    },
    {
      match: "docs.google.com/spreadsheets", // Google Spreadsheets
      selectors: ["body"],
    },
    {
      match: "admin.google.com", // Google Admin
      selectors: ["body"],
    },
  ];

  const activeSelectors = sites.filter((site) => url.includes(site.match)).flatMap((site) => site.selectors);
  if (activeSelectors.length) {
    const style = document.createElement("style");
    style.textContent = `${activeSelectors.join(", ")} { filter: invert(100%) hue-rotate(180deg); box-shadow: none !important; }`;
    document.head.appendChild(style);
  }

  // TODO: Fix bug that causes overflow when opening chat
  if (url.includes("meet.google.com")) {
    const observer = new MutationObserver(() => {
      const closeBtn = document.querySelector(".pYTkkf-Bz112c-kBDsod-Rtc0Jf");
      if (closeBtn) {
        closeBtn.click();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
