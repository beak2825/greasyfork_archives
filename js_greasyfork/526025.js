// ==UserScript==
// @name        Remove Specific Rules Link on Torn.com
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @grant       none
// @version     1.4
// @license     MIT
// @description Removes the specific "Rules" link on all Torn.com pages reliably
// @downloadURL https://update.greasyfork.org/scripts/526025/Remove%20Specific%20Rules%20Link%20on%20Torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/526025/Remove%20Specific%20Rules%20Link%20on%20Torncom.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Function to remove the specific "Rules" link
  const removeRulesLink = () => {
    // Target the <a> link with href="/rules.php" and the known class
    const linkToRemove = document.querySelector(
      'a[href="/rules.php"].desktopLink___SG2RU'
    );

    if (linkToRemove) {
      linkToRemove.remove();
      console.log("Specific 'Rules' link has been removed.");
    }
  };

  // Run initially to handle already loaded content
  removeRulesLink();

  // Use MutationObserver to monitor dynamic content changes
  const observer = new MutationObserver(() => {
    removeRulesLink(); // Recheck for the link whenever changes occur
  });

  // Keep observing changes indefinitely
  observer.observe(document.body, {
    childList: true, // Watch for added or removed elements
    subtree: true,   // Watch the entire DOM tree
  });

  console.log("Script is running and watching for changes...");
})();