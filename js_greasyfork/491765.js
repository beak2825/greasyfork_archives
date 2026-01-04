// ==UserScript==
// @name         Twitter Sensitive Media Unblocker
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Automatically unveil hidden thumbnails for sensitive content on Twitter with this user script. Use responsibly at your own discretion.
// @author       nexor85
// @match        *://twitter.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491765/Twitter%20Sensitive%20Media%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/491765/Twitter%20Sensitive%20Media%20Unblocker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function clickByText(texts) {
    const spans = document.querySelectorAll("span");
    spans.forEach((span) => {
      const spanTextLower = span.textContent.trim().toLowerCase();
      texts.forEach((text) => {
        if (spanTextLower === text.toLowerCase()) {
          span.parentNode.click();
        }
      });
    });
  }

  const observerCallback = (mutationsList, observer) => {
    clickByText(["表示", "show"]);
  };

  const observerOptions = {
    childList: true,
    subtree: true,
  };

  const observer = new MutationObserver(observerCallback);

  observer.observe(document.body, observerOptions);
})();
