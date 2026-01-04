// ==UserScript==
// @name         Deku Deals Link Target Modifier
// @namespace    https://codeberg.org/shmup/junk-trove
// @version      1.0
// @description  Various things I like
// @author       shmup
// @match        https://www.dekudeals.com/*
// @grant        none
// @run-at       document-end
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/480779/Deku%20Deals%20Link%20Target%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/480779/Deku%20Deals%20Link%20Target%20Modifier.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // open the eshop links in the same tab
  document
    .querySelectorAll("a[href*='nintendo.com/store/products/']")
    .forEach((link) => {
      link.target = "_self";
    });

  // open the game links in a new tab
  document.querySelectorAll("a[href*='/items/']").forEach((link) => {
    link.target = "_blank";
  });

  // auto-expand the game info
  document.querySelectorAll("main a.collapse-control").forEach((expand) => {
    const h3 = expand.querySelector("h3");
    if (h3 && h3.textContent.trim() === "Screenshots") return;
    expand.click();
  });

  // scroll to the price history
  const priceHistory = document.querySelector("#price-history");
  if (priceHistory) {
    priceHistory.scrollIntoView();
  }
})();