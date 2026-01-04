// ==UserScript==
// @name        YouTube Share Link Cleaner
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @match       https://youtu.be/*
// @grant       none
// @version     1.2
// @author      DRagon Vase
// @description Remove tracking query parameters from YouTube share links
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/490789/YouTube%20Share%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/490789/YouTube%20Share%20Link%20Cleaner.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Attach listeners when the page loads
  window.addEventListener("load", () => {
    attachShareButtonListener();
    observeDocumentForChanges();
  });

  function attachShareButtonListener() {
    const shareButton = document.querySelector("ytd-menu-renderer");
    if (shareButton) {
      // Ensure we don't attach multiple listeners
      shareButton.removeEventListener("click", initiateCleanProcess);
      shareButton.addEventListener("click", initiateCleanProcess);
    }
  }

  // Start the process to clean the URL after the share button is clicked
  function initiateCleanProcess() {
    // Set an interval to periodically check the dialog's visibility and clean the URL
    const intervalId = setInterval(() => {
      const dialog = document.querySelector("tp-yt-paper-dialog");
      const inputField = document.querySelector(
        "ytd-unified-share-panel-renderer input#share-url"
      );

      if (dialog && window.getComputedStyle(dialog).display !== "none") {
        // has dialog and is displayed
        if (inputField && inputField.value) {
          cleanShareUrl(inputField);
        }
      } else if (dialog && window.getComputedStyle(dialog).display === "none") {
        // has dialog but not displayed, stop checking
        clearInterval(intervalId);
      } else if (!dialog) {
        // no dialog, keep checking for 2 seconds incase it's not displayed due to slow internet/application
        setTimeout(() => {
          if (!dialog) {
            // no dialog, stop checking
            clearInterval(intervalId);
          }
        }, 2000);
      } else {
        // something went wrong, stop checking
        clearInterval(intervalId);
      }
    }, 500); // Check every 500ms
  }

  // Cleans the URL in the share input field
  function cleanShareUrl(inputField) {
    let cleanUrl = new URL(inputField.value);
    cleanUrl.searchParams.delete("si"); // Remove the 'si' parameter
    inputField.value = cleanUrl.href;
  }

  // Reattach the share button listener when navigating to a new video
  function observeDocumentForChanges() {
    const observer = new MutationObserver(attachShareButtonListener);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
