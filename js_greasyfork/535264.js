// ==UserScript==
// @name         text request search unfilter
// @namespace    http://tampermonkey.net/
// @version      2025-05-07.01
// @description  search unfilter
// @author       You
// @match        https://app.textrequest.com/app/queue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=textrequest.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535264/text%20request%20search%20unfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/535264/text%20request%20search%20unfilter.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const waitForElement = (selector, callback) => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Listen for input or change events on the phone selector input
  waitForElement("#phoneSelectorInput", (input) => {
      if (input != "") {
    console.log("Search input detected. Listening for input/change...");

    // When the user starts typing
    input.addEventListener("input", () => {
      console.log("Input typing...");
    });

    // When the input value changes (e.g., loses focus or a selection is made)
    input.addEventListener("change", () => {
      console.log("Input value changed (blur or selection made)");

      // Trigger filter logic after input change
      // Step 1: Click the filter button
      waitForElement(".fiter-button", (filterBtn) => {
        filterBtn.click();

        // Step 2: Click the first flag
        waitForElement(
          "body > txr-root > txr-portal > txr-main > div > div > div > txr-queue > txr-queue-page > div > txr-queue-header > div > div.txr-queue-header__desktop > div.txr-queue-header__bottom > div.header__bottom-item.bottom-item__selected > div.bottom-item__command.filter-item.desktop-filter > div > div.txr-popper.txr-mobile-full-width.txr-popover-opened > div > div > txr-queue-filter-selector > div > div.queue-filter-selector_scroll > div.queue-filter-selector__flags.flex > div",
          (flagOption) => {
            flagOption.click();
            document
              .querySelector(
                "body > txr-root > txr-portal > txr-main > div > div > div > txr-queue > txr-queue-page > div > txr-queue-header > div > div.txr-queue-header__desktop > div.txr-queue-header__bottom > div.header__bottom-item.bottom-item__selected > div.bottom-item__command.filter-item.desktop-filter > div > div.txr-popper.txr-mobile-full-width > div > div > txr-queue-filter-selector > div > div.queue-filter-selector__footer > txr-button2.txr-button2.txr-action-button.txr-outline > button"
              )
              .click();
            console.log("Apply & Close clicked!");
            document
              .querySelector(
                "body > txr-root > txr-portal > txr-main > div > div > div > txr-queue > txr-queue-page > div > div > div.queue__header > div.queue-header__left > txr-phone-selector > div > div > i"
              )
              .addEventListener("click", () => {
                location.reload();
                /*waitForElement(
                  "body > txr-root > txr-portal > txr-main > div > div > div > txr-queue > txr-queue-page > div > div > div.queue__header > div.queue-header__left > txr-phone-selector > div > div > i",
                  (xBtn) => {
                    console.log("clicked-x");
                    //location.reload();
                    setTimeout(() => {
                      waitForElement(".fiter-button", (filterBtn) => {
                        filterBtn.click();
                        waitForElement(
                          "body > txr-root > txr-portal > txr-main > div > div > div > txr-queue > txr-queue-page > div > txr-queue-header > div > div.txr-queue-header__desktop > div.txr-queue-header__bottom > div.header__bottom-item.bottom-item__selected > div.bottom-item__command.filter-item.desktop-filter > div > div.txr-popper.txr-mobile-full-width.txr-popover-opened > div > div > txr-queue-filter-selector > div > div.queue-filter-selector_scroll > div.queue-filter-selector__flags.flex > div",
                          (flagOption) => {
                            flagOption.click();
                            document
                              .querySelector(
                                "body > txr-root > txr-portal > txr-main > div > div > div > txr-queue > txr-queue-page > div > txr-queue-header > div > div.txr-queue-header__desktop > div.txr-queue-header__bottom > div.header__bottom-item.bottom-item__selected > div.bottom-item__command.filter-item.desktop-filter > div > div.txr-popper.txr-mobile-full-width.txr-popover-opened > div > div > txr-queue-filter-selector > div > div.queue-filter-selector__footer > txr-button2.txr-button2.txr-action-button.txr-outline > button"
                              )
                              .click();
                            console.log("Apply & Close clicked!");
                              setTimeout(() => {
                              document.querySelector("body > txr-root > txr-portal > txr-main > div > div > div > txr-queue > txr-queue-page > div > txr-queue-header > div > div.txr-queue-header__desktop > div.txr-queue-header__bottom > div.header__bottom-item.bottom-item__selected > div.bottom-item__command.refresh-item > i").click()
                          }, 100)
                          }
                        );
                      });
                    }, 50);
                  }
                );*/
              });
          }
        );

      });

    });
  }
  });
})();