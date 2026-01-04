// ==UserScript==
// @name         Wretched Beagle Normality Optimized
// @namespace    https://codeberg.org/shmup/junk-trove
// @version      1.0
// @description  Remove the bullshit
// @author       shmup
// @match        https://www.record-eagle.com/*
// @grant        none
// @run-at       document-end
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/480771/Wretched%20Beagle%20Normality%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/480771/Wretched%20Beagle%20Normality%20Optimized.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const idsToRemove = [
    "sub_message",
    "asset-below",
    "site-footer-container",
    "ta_background",
    "ta_invisible",
  ];

  const removeElements = () => {
    idsToRemove.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.remove();
    });
  };

  const observer = new MutationObserver(removeElements);

  observer.observe(document.body, { childList: true, subtree: true });
})();