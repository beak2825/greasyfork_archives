// ==UserScript==
// @name         DHL Web App QoL Tweaks
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.3.1
// @match        *://*/*
// @description As per name
// @downloadURL https://update.greasyfork.org/scripts/439306/DHL%20Web%20App%20QoL%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/439306/DHL%20Web%20App%20QoL%20Tweaks.meta.js
// ==/UserScript==

(function () {
  // TODO: Userscripts (https://apps.apple.com/us/app/userscripts/id1463298887) vs. Macaque (https://apps.apple.com/us/app/macaque/id1595306197)

  MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;

  window.addEventListener("load", function () {
    const currentPage = window.location.href;
    if (currentPage.indexOf("dhl.com/") >= 0) {
      function funcExpand() {
        // Expand dropdowns
        const moreDetails = document.querySelector(
          ".c-tracking-result--moredetails-dropdown"
        );
        if (moreDetails) {
          const muButton = moreDetails.querySelector(
            ".c-tracking-result--moredetails-dropdown-button"
          );
          if (muButton) muButton.click();
        }

        const allUpdates = document.querySelector(
          ".c-tracking-result--checkpoints-dropdown"
        );
        if (allUpdates) {
          const auButton = allUpdates.querySelector(
            ".c-tracking-result--moredetails-dropdown-button"
          );
          if (auButton) auButton.click();
        }

        // Expand Piece IDs
        document
          .querySelectorAll(".c-tracking-result-pieceid--header")
          .forEach(el => {
            if (!el.classList.contains("is-open")) {
              el.click();
            }
          });
      }

      function funcColorize() {
        // Colorize Piece IDs
        const uniqueIDs = [];
        document
          .querySelectorAll(".c-tracking-result-pieceid--content")
          .forEach(el => {
            const arr = el.innerText.split("\n");
            arr.forEach(id => {
              if (uniqueIDs.indexOf(id) < 0) {
                uniqueIDs.push(id);
              }
            });
          });
        // console.log(uniqueIDs);

        const colorArr = [
          "lightsalmon",
          "lightseagreen",
          "lightskyblue",
          "limegreen",
          "tomato",
          "aqua"
        ];

        // Second pass - overwrite innerHTML with color codes
        document
          .querySelectorAll(".c-tracking-result-pieceid--content")
          .forEach(el => {
            let newHTMLStr = "";
            const arr = el.innerText.split("\n");
            arr.forEach(id => {
              const idIndex = uniqueIDs.indexOf(id);
              const colorCode = colorArr[idIndex];
              newHTMLStr += `<span style=background-color:${colorCode};padding:2px;>${id}</span><br>`;
            });
            el.innerHTML = newHTMLStr;
          });
      }

      function funcDeleteCruft() {
        // Remove unnecessary elements from multi-results page
        document
          .querySelectorAll(".c-tracking-result--delivery") // Estimated delivery dates
          .forEach(el => {
            el.remove();
          });

        document
          .querySelectorAll(".c-tracking--result--description-more") // Validation blurb
          .forEach(el => {
            el.remove();
          });

        document
          .querySelectorAll(".c-tracking-result--origin") // Trim "Service Area: " for origin
          .forEach(el => {
            const prevText = el.innerText;
            const newText = prevText.split("Service Area: ")[1];
            el.innerText = newText;
          });

        document
          .querySelectorAll(".c-tracking-result--destination") // Trim "Service Area: " for destination
          .forEach(el => {
            const prevText = el.innerText;
            const newText = prevText.split("Service Area: ")[1];
            el.innerText = newText;
          });
      }

      let numRetries = 0;
      function mainObserve() {
        // Observe changes to the tracking container
        const observerTarget = document.querySelector(".c-tracking--container");
        if (!observerTarget) {
          if (numRetries < 10) {
            numRetries += 1;
            setTimeout(mainObserve, 1000); // Retry every second, up to 10 times (handle 3-2-1 loading screen)
            // Seems like insta-fail if that screen is hit... w/e keeping this anyway
          }
        } else {
          const observer = new MutationObserver(function () {
            // Derive whether we're on a single or multiple results page
            if (
              observerTarget.querySelector(
                ".c-multiple-tracking-result--container"
              )
            ) {
              // Disconnect and reconnect later to prevent mutation loop
              observer.disconnect();

              // Feature: Multi-results logic (only expand dropdowns, no color code)
              funcExpand();
              funcDeleteCruft();

              // Re-observe after mutation-inducing logic
              observer.observe(observerTarget, {
                childList: true,
                subtree: true
              });
            } else if (
              observerTarget.querySelector(".c-tracking-result--container")
            ) {
              // Disconnect and reconnect later to prevent mutation loop
              observer.disconnect();

              // Feature: Single result logic (expand dropdowns + color code)
              funcExpand();
              funcColorize();

              // Re-observe after mutation-inducing logic
              observer.observe(observerTarget, {
                childList: true,
                subtree: true
              });
            }
          });

          // Initial observe
          observer.observe(observerTarget, {
            childList: true,
            subtree: true
          });

          // Force a quick mutation in case attach is a little delayed
          const testEl = document.createElement("div");
          observerTarget.appendChild(testEl);
        }
      }

      mainObserve();
    }
  });
})();
