// ==UserScript==
// @name         Show Absolute Time On Reddit Posts (2025)
// @namespace    ShowAbsoluteTimeOnRedditPosts
// @version      2.0.0
// @description  Show absolute time next to relative time on Reddit posts and comments (new Reddit UI)
// @author       Updated by ChatGPT
// @match        https://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532561/Show%20Absolute%20Time%20On%20Reddit%20Posts%20%282025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532561/Show%20Absolute%20Time%20On%20Reddit%20Posts%20%282025%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function updateTimestamps() {
    const times = document.querySelectorAll("time");

    times.forEach((timeEl) => {
      // Avoid duplicating the absolute time
      if (timeEl.dataset.absoluteShown) return;

      const absoluteTime = timeEl.getAttribute("datetime");
      if (absoluteTime) {
        // Format the absolute time
        const date = new Date(absoluteTime);
        const formatted = date.toLocaleString(); // Local user format

        // Append absolute time in parentheses
        timeEl.textContent += ` (${formatted})`;
        timeEl.dataset.absoluteShown = "true";
      }
    });
  }

  // Initial call
  updateTimestamps();

  // Observe dynamically loaded content (React-based site)
  const observer = new MutationObserver(updateTimestamps);
  observer.observe(document.body, { childList: true, subtree: true });
})();
