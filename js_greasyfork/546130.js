// ==UserScript==
// @name         YouTube™ YTMusic™ Nonstop
// @namespace    https://github.com/nvbangg
// @version      1.1
// @description  Prevent auto-pause, keep YouTube & YouTube Music nonstop
// @author       nvbangg (https://github.com/nvbangg)
// @copyright    Copyright (c) 2025 Nguyễn Văn Bằng (nvbangg, github.com/nvbangg)
// @homepage     https://github.com/nvbangg/Nonstop_Audio_Only_for_Youtube_YTMusic
// @icon         https://raw.githubusercontent.com/nvbangg/Nonstop_Audio_Only_for_Youtube_YTMusic/main/src/icon.png
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/546130/YouTube%E2%84%A2%20YTMusic%E2%84%A2%20Nonstop.user.js
// @updateURL https://update.greasyfork.org/scripts/546130/YouTube%E2%84%A2%20YTMusic%E2%84%A2%20Nonstop.meta.js
// ==/UserScript==

//! 📌 Use the Chrome Web Store extension for full features:
//! https://chromewebstore.google.com/detail/nonstop-audio-only-for-yo/bobdimbkbnkabpfhdfbddjoppiohcodi

(() => {
  "use strict";
  // Force page to always appear visible
  Object.defineProperties(document, {
    hidden: { value: false },
    visibilityState: { value: "visible" },
  });

  // Block visibilitychange events
  addEventListener(
    "visibilitychange",
    (e) => e.stopImmediatePropagation(),
    true
  );

  // Keep last activity fresh
  const keepAlive = () => {
    if ("_lact" in window)
      setInterval(() => (window._lact = Date.now()), 300000);
    else setTimeout(keepAlive, 1000);
  };
  keepAlive();
})();
