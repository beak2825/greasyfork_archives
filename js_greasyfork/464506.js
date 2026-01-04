// ==UserScript==
// @name         Twitter Advertiser Blocker
// @namespace    http://phocks.org
// @version      0.3.0
// @description  Blocks advertisers on Twitter as you scroll
// @author       @phocks@bne.social
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464506/Twitter%20Advertiser%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/464506/Twitter%20Advertiser%20Blocker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let blockedCount = 0;

  /**
   * Searches the page for spans that contain the word "Promoted"
   * and returns the first one it finds. Checks for the svg icon too.
   */
  function getPromotedTweet() {
    const spans = document.querySelectorAll('[dir="ltr"] > span');
    let btn = null;

    for (let span of spans) {
      if (!span.textContent) continue;

      if (span.textContent === "Ad") {
        console.log(span);
        btn = span;
        break;
      }
    }

    return btn;
  }

  // const spans = document.querySelectorAll("span");
  // let btn = null;

  // for (let span of spans) {
  //   if (!span.textContent) continue;

  //   if (
  //     span.textContent.includes("Promoted") ||
  //     span.textContent.includes("Promoted by")
  //   ) {
  //     // Are we sure it's not just a tweet that says "Promoted"??
  //     // Let's try to be more sure. Check for svg promoted icon.
  //     if (!span.parentNode) continue;

  //     const divPromoted = span.parentNode.parentNode;
  //     if (!divPromoted) continue;

  //     const svgPromoted = divPromoted.querySelector(
  //       'svg[viewBox="0 0 24 24"]'
  //     );
  //     if (!svgPromoted) continue;

  //     const svgShape = divPromoted.querySelector(
  //       '[d="M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"]'
  //     );
  //     if (!svgShape) continue;

  //     btn = span;
  //     break;
  //   }
  // }

  // return btn;
  // }

  function blockAdvertiser() {
    // const spans = document.querySelectorAll("span");
    // let btn = null;

    // for (let span of spans) {
    //   if (
    //     span.textContent.includes("Promoted") ||
    //     span.textContent.includes("Promoted by")
    //   ) {
    //     // Are we sure it's not just a tweet that says "Promoted"??
    //     // Let's try to be more sure. Check for svg promoted icon.
    //     const divPromoted = span.parentNode.parentNode;
    //     const svgPromoted = divPromoted.querySelector(
    //       'svg[viewBox="0 0 24 24"]'
    //     );
    //     if (!svgPromoted) continue;

    //     const svgShape = divPromoted.querySelector(
    //       '[d="M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"]'
    //     );
    //     if (!svgShape) continue;

    //     btn = span;
    //     break;
    //   }
    // }

    const btn = getPromotedTweet();

    if (!btn) return;

    const pnt = btn.closest("article");
    if (!pnt) return;

    const someSpans = pnt.querySelectorAll("span");

    someSpans.forEach((span) => {
      if (!span.textContent) return;
      if (span.textContent.includes("@")) console.log(span.textContent);
    });

    /** @type {HTMLButtonElement | null} */
    const more = pnt.querySelector('[role="button"]');
    more?.click();

    /** @type {HTMLButtonElement | null} */
    const block = document.querySelector('[data-testid="block"]');
    block?.click();

    /** @type {HTMLButtonElement | null} */
    const confirm = document.querySelector(
      '[data-testid="confirmationSheetConfirm"]'
    );

    confirm?.click();

    blockedCount++;
    console.log("Advertisers blocked:", blockedCount);
  }

  setInterval(() => {
    blockAdvertiser();
  }, 5000);
})();
