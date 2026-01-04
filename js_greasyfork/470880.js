// ==UserScript==
// @name        Kbin Open Posts in New Tab
// @match       https://kbin.social/*
// @match       https://fedia.io/*
// @match       https://karab.in/*
// @version      0.1
// @description  Automatically add target="_blank" to all links embedded in h2 tags on Kbin.
// @namespace    https://greasyfork.org/en/users/1127287-harasho
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470880/Kbin%20Open%20Posts%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/470880/Kbin%20Open%20Posts%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function addTargetBlankToLinks() {
    const articleHeaders = document.querySelectorAll("article header"); // Get all header tags within article tags

    // Loop through each header tag and find h2 tags with links
    articleHeaders.forEach(header => {
      const h2Tags = header.querySelectorAll("h2"); // Get all h2 tags within the header

      // Loop through h2 tags and find links
      h2Tags.forEach(h2Tag => {
        const links = h2Tag.querySelectorAll("a"); // Get all links inside the h2 tag

        // Loop through links and add target="_blank" if not already present
        links.forEach(link => {
          if (!link.hasAttribute("target")) {
            link.setAttribute("target", "_blank");
          }
        });
      });
    });
  }

  // Run the function initially on page load
  addTargetBlankToLinks();

  // Use MutationObserver to handle dynamic changes to the page content
  const observer = new MutationObserver(() => {
    addTargetBlankToLinks();
  });

  // Observe changes to the entire document's subtree
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();