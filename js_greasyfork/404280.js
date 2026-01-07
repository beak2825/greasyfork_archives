// ==UserScript==
// @name Facebook Hide Marketplace Deals
// @namespace https://github.com/bricemciver/GreasemonekeyScripts
// @description Hide the sponsored deals that show up in marketplace searches
// @license MIT
// @version 0.0.2
// @match *://*.facebook.com/marketplace/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/404280/Facebook%20Hide%20Marketplace%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/404280/Facebook%20Hide%20Marketplace%20Deals.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
"use strict";
(() => {
  // src/main/facebook-hide-marketplace-deals/facebook-hide-marketplace-deals.user.ts
  var FacebookHideMarketplaceDeals;
  ((FacebookHideMarketplaceDeals2) => {
    const config = {
      childList: true,
      attributes: true,
      subtree: true
    };
    const removeTracking = (node) => {
      var _a;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const dealsLink = node.querySelector("a[href*='tracking']");
        if (dealsLink) {
          (_a = dealsLink.parentElement) == null ? void 0 : _a.remove();
        }
      }
    };
    const callback = (mutationsList) => {
      var _a;
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          for (const node of mutation.addedNodes) {
            removeTracking(node);
          }
        }
        if (mutation.type === "attributes" && mutation.attributeName === "href" && mutation.target.nodeType === Node.ELEMENT_NODE) {
          const link = mutation.target;
          if (link.href.includes("tracking")) {
            (_a = link.parentElement) == null ? void 0 : _a.remove();
          }
        }
      }
    };
    FacebookHideMarketplaceDeals2.main = () => {
      new MutationObserver(callback).observe(document, config);
    };
  })(FacebookHideMarketplaceDeals || (FacebookHideMarketplaceDeals = {}));
  FacebookHideMarketplaceDeals.main();
})();
//# sourceMappingURL=facebook-hide-marketplace-deals.user.js.map
