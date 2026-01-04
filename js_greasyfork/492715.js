// ==UserScript==
// @name         Remove PrimeVideo X-ray
// @namespace    http://your.site.com
// @version      1.0
// @description  remove the X-ray panel on Prime Video for uninterrupted viewing pleasure.
// @author       Nilesh Agarwal <NileshAgarwal10@gmail.com>
// @match        https://www.primevideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492715/Remove%20PrimeVideo%20X-ray.user.js
// @updateURL https://update.greasyfork.org/scripts/492715/Remove%20PrimeVideo%20X-ray.meta.js
// ==/UserScript==

let xrayVanisherExecuted = false;

function vanishXrayPanel() {
  if (!xrayVanisherExecuted) {
    const style = document.createElement("style");
    style.type = "text/css";
    document.head.appendChild(style);

    const sheet = style.sheet;
    const rule = ".xrayQuickView { visibility: hidden !important; }";

    sheet.insertRule(rule, sheet.cssRules.length);

    xrayVanisherExecuted = true;
  }
}

function observeDOM() {
  const targetNode = document.body;

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        const xrayPanel = document.querySelector(".xrayQuickView");
        if (xrayPanel) {
          vanishXrayPanel();
          observer.disconnect();
        }
      }
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(targetNode, config);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afterLoaded);
} else {
  afterLoaded();
}

function afterLoaded() {
  observeDOM();
}