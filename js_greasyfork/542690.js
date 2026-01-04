// ==UserScript==
// @name        yt Disable Paid Promotion Link Clicks
// @match       *://*.youtube.com/*
// @version 0.0.1.20250716065535
// @namespace https://greasyfork.org/users/1435046
// @description a
// @downloadURL https://update.greasyfork.org/scripts/542690/yt%20Disable%20Paid%20Promotion%20Link%20Clicks.user.js
// @updateURL https://update.greasyfork.org/scripts/542690/yt%20Disable%20Paid%20Promotion%20Link%20Clicks.meta.js
// ==/UserScript==

(function() {
  const PAID_PROMO_SELECTOR = 'ytm-paid-content-overlay-renderer a.ytmPaidContentOverlayLink';

  // Disable clicks on these links
  function disableClicks() {
    document.querySelectorAll(PAID_PROMO_SELECTOR).forEach(link => {
      // Avoid adding multiple listeners
      if (!link.dataset.disableClickListener) {
        link.addEventListener('click', e => {
          e.preventDefault();
          e.stopImmediatePropagation();
        }, true); // capture phase to catch early
        link.dataset.disableClickListener = 'true';
      }
    });
  }

  disableClicks();

  // Also observe dynamic additions
  new MutationObserver(disableClicks).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
