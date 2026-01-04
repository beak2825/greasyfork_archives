// ==UserScript==
// @name         Shopify Enhancer
// @namespace    https://github.com/sparanoid/userscript
// @supportURL   https://github.com/sparanoid/userscript/issues
// @version      2025-05-04
// @description  Enhance Shopify admin dashboard with third-party providers support
// @author       Sparanoid
// @license      AGPL
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @compatible   firefox 74 or later
// @compatible   safari 13.1 or later
// @match        https://admin.shopify.com/store/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501654/Shopify%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/501654/Shopify%20Enhancer.meta.js
// ==/UserScript==

(() => {
  const wrapperObserver = new MutationObserver((mutationsList, _observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        [...mutation.addedNodes].map((item) => {
          // console.log('mutation wrapper added', item);

          // Main wrapper
          if (
            item.classList?.contains("Polaris-Page") ||
            item?.id === "AppFrame"
          ) {
            console.log("Main wrapper detected", item);

            // Look for spans containing phone numbers
            const phoneSpans = item?.querySelectorAll(
              "span.Polaris-Text--root",
            );

            if (phoneSpans && phoneSpans.length > 0) {
              phoneSpans.forEach((span) => {
                const text = span.textContent?.trim();

                // Check if text starts with +86
                if (text?.startsWith?.("+86")) {
                  // Check if we already added the link to this span
                  if (
                    !span.nextElementSibling ||
                    !span.nextElementSibling.classList.contains("rouzao-link")
                  ) {
                    // Extract phone number
                    const telStr = text
                      .replaceAll(" ", "")
                      .replaceAll("+86", "");

                    // Create link
                    const link = document.createElement("a");
                    link.setAttribute(
                      "href",
                      `https://rouzao.com/orders/list?mobile=${telStr}`,
                    );
                    link.setAttribute("target", "_blank");
                    link.setAttribute("class", "rouzao-link");
                    link.textContent = "Search in Rouzao";
                    link.style.marginLeft = "0.5em";

                    // Insert link after the span
                    span.parentElement.insertBefore(link, span.nextSibling);
                  }
                }
              });
            }
          }
        });
      }
    }
  });
  wrapperObserver.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });
})();
