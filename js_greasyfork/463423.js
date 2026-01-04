// ==UserScript==
// @name         Disable Outlook Reading Pane Zooming
// @license      MIT
// @namespace    http://greasyfork.org/
// @version      0.2
// @description  as the name states
// @author       You
// @match        https://outlook.office.com/mail/*
// @match        https://outlook.office365.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=office.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/463423/Disable%20Outlook%20Reading%20Pane%20Zooming.user.js
// @updateURL https://update.greasyfork.org/scripts/463423/Disable%20Outlook%20Reading%20Pane%20Zooming.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Remember the previous paneDiv element
  let previousPaneDiv = null;

  // Define the callback function to execute when the paneDiv element is created
  const onPaneDivCreated = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length) {
        // If the addedNodes list contains the paneDiv element, execute the code block
        const currentPaneDiv = document.querySelector(
          "#ReadingPaneContainerId > div > div > div"
        );

        if (currentPaneDiv && currentPaneDiv !== previousPaneDiv) {
          // Remove the event listener from the previous paneDiv element
          if (previousPaneDiv) {
            previousPaneDiv.removeEventListener("wheel", stopPropagation, true);
          }

          // Add the event listener to the current paneDiv element
          currentPaneDiv.addEventListener("wheel", stopPropagation, true);

          // Remember the current paneDiv element as the previous one
          previousPaneDiv = currentPaneDiv;
        }
      }
    }
  };

  // Define the function to stop event propagation
  const stopPropagation = function (e) {
    e.stopPropagation();
  };

  // Create a new MutationObserver object and pass in the callback function
  const observer = new MutationObserver(onPaneDivCreated);

  // Configure the observer to watch for changes to the parent of the paneDiv element
  const config = { childList: true, subtree: true };
  const parentElement = document;

  // Start observing the parent element for changes
  observer.observe(parentElement, config);
})();
