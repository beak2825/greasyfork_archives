// ==UserScript==
// @name        Photopea No Ads Sidebar
// @namespace   imxitiz's-Scripts
// @version     0.1
// @grant       unsafeWindow
// @license     GNU GPLv3
// @author      imxitiz
// @match       https://www.photopea.com/*
// @description Remove the gap of ads Sidebar
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/503627/Photopea%20No%20Ads%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/503627/Photopea%20No%20Ads%20Sidebar.meta.js
// ==/UserScript==

function resize() {
  const adWidth =
    document.querySelector(".app").offsetWidth -
    document.querySelector(".app > div").offsetWidth;
  Object.defineProperty(window, "innerWidth", {
    get() {
      return parseInt(document.documentElement.offsetWidth, 10) + adWidth;
    },
  });
  window.dispatchEvent(new Event("resize"));
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === 1 && node.matches(".app *")) {
        observer.disconnect();
        resize();
        return;
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
