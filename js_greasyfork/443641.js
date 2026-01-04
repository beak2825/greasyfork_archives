// ==UserScript==
// @name        Sarcasm Immunity for Reddit
// @namespace   Violentmonkey Scripts
// @match       *://*.reddit.com/*
// @grant       none
// @version     1.0
// @author      Brahma Sharma
// @description Removes comments with /s on Reddit, only works on new design.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/443641/Sarcasm%20Immunity%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/443641/Sarcasm%20Immunity%20for%20Reddit.meta.js
// ==/UserScript==

setInterval(() => {
  [...document.querySelectorAll("[data-testid='comment']")].filter(e => e.innerHTML.includes("/s")).forEach(e => e.textContent = "[redacted]");
}, 1000);