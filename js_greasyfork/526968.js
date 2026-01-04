// ==UserScript==
// @name         Booru Volume Fixer
// @version      1.0
// @namespace    Booru Volume Fixer
// @description  Fix the problem in certain boorus where volume would always be set to a certain percentage.
// @author       NecRaul
// @license      MIT; https://github.com/NecRaul/booru-volume-fixer/blob/main/LICENSE
// @match        *://rule34.xxx/*
// @match        *://gelbooru.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuroneko.dev
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526968/Booru%20Volume%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/526968/Booru%20Volume%20Fixer.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === 1 &&
          node.tagName === "SCRIPT" &&
          node.innerHTML.includes("video.volume")
        ) {
          node.remove();
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
