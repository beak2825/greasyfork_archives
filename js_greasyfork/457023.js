// ==UserScript==
// @name         Hide Twitter Views link
// @namespace    https://twitter.com/14letterhandle
// @version      0.6
// @description  Remove the twitter views link from people's tweets
// @author       14letterhandle
// @match        https://twitter.com/*
// @icon         https://static.thenounproject.com/png/1159224-200.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457023/Hide%20Twitter%20Views%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/457023/Hide%20Twitter%20Views%20link.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const removeViews = () => {
    // Remove link version of view count
    Array.from(document.querySelectorAll("article a"))
      .filter(({ href }) => href.endsWith("/analytics"))
      .filter(({ innerHTML }) => !innerHTML.includes("View Tweet analytics"))
      .forEach(({ parentElement }) => parentElement.remove());

    // Remove span version of view count
    Array.from(document.querySelectorAll("span"))
      .filter(({ textContent }) => /^.* views?$/i.test(textContent))
      .forEach((el) => el.remove());

    // Trim any excess text decoration left from deleting view count
    Array.from(document.querySelectorAll("span:last-child"))
      .filter(({ textContent }) => textContent === "·")
      .forEach((el) => el.remove());
  };

  new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => !!addedNodes.length && removeViews());
  }).observe(document.body, { childList: true, subtree: true });

  removeViews();
})();