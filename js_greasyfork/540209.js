// ==UserScript==
// @name         mistral Hide Specific Ancestor on Mistral Chat
// @description  Finds polygon elements whose points start with "242.424,90.909", locates the closest span ancestor with class "rounded-md", then hides the grandparent of that span (two levels up) by setting display: none !important
// @match        https://chat.mistral.ai/*
// @run-at       document-idle
// @version 0.0.1.20250621071922
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/540209/mistral%20Hide%20Specific%20Ancestor%20on%20Mistral%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/540209/mistral%20Hide%20Specific%20Ancestor%20on%20Mistral%20Chat.meta.js
// ==/UserScript==

(function() {
  function hideMatchingAncestors() {
    // Select all <polygon> elements with points starting "242.424,90.909"
    const polygons = document.querySelectorAll('polygon[points^="242.424,90.909"]');

    polygons.forEach(polygon => {
      // Find the nearest <span> ancestor
      const span = polygon.closest('span');
      // If that span has class "rounded-md"
      if (span && span.classList.contains('rounded-md')) {
        // Climb two levels up from the span: span → parent → grandparent
        const grandparent = span.parentElement && span.parentElement.parentElement;
        if (grandparent) {
          // Hide that grandparent element
          grandparent.style.setProperty('display', 'none', 'important');
        }
      }
    });
  }

  // Run once on initial page load
  hideMatchingAncestors();

  // Observe DOM changes to catch newly added polygons
  const observer = new MutationObserver(hideMatchingAncestors);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
