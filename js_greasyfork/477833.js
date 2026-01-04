// ==UserScript==
// @name         Better Zendesk for BandLab
// @namespace    https://www.bandlab.com/
// @version      0.2
// @description  Zendesk enhancements for BandLab support team
// @author       Gilles
// @match        https://*.zendesk.com/agent/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zendesk.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477833/Better%20Zendesk%20for%20BandLab.user.js
// @updateURL https://update.greasyfork.org/scripts/477833/Better%20Zendesk%20for%20BandLab.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Use ALT+Number to switch between panel on Zendesk
  document.addEventListener("keydown", function (event) {
    if (event.altKey) {
      switch (event.code) {
        case "Digit1":
          document
            .querySelector('[data-cy-test-element="customer-context"]')
            .click();
          event.preventDefault();
          break;
        case "Digit2":
          document
            .querySelector('[data-cy-test-element="guide-suggestions"]')
            .click();
          event.preventDefault();
          break;
        case "Digit3":
          document
            .querySelector('[data-cy-test-element="smart-assist"]')
            .click();
          event.preventDefault();
          break;
        case "Digit4":
          document.querySelector('[data-cy-test-element="apps"]').click();
          event.preventDefault();
          break;
        default:
          break;
      }
    }
  });

  // Uncheck "Requester can see this comment"
  const observer = new MutationObserver(function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        const newCheckboxes = document.querySelectorAll(
          'input[type="checkbox"][name$="_is_public"]',
        );
        newCheckboxes.forEach(function (checkbox) {
          checkbox.checked = false;
        });
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
