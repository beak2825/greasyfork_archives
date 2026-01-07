// ==UserScript==
// @name         Chase One-Click Offer Activator
// @namespace    https://anhpham.dev/
// @version      0.2.1
// @description  Adds a floating button to activate all offers on Chase's offer hub page with one click.
// @author       Anh Pham
// @license      MIT
// @match        https://secure.chase.com/web/auth/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515862/Chase%20One-Click%20Offer%20Activator.user.js
// @updateURL https://update.greasyfork.org/scripts/515862/Chase%20One-Click%20Offer%20Activator.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Create the floating action button
  const button = document.createElement("div");
  button.className = "float";
  button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.25" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
    `;
  button.style.cssText = `
        position: fixed;
        width: 4.5em;
        height: 4.5em;
        bottom: 2.5em;
        right: 2.5em;
        color: #212121;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(136, 136, 136, 0.3);
        cursor: pointer;
        font-size: 0.75rem;
        z-index: 10000;
    `;

  button.style.display = "none";
  document.body.appendChild(button);

  // Function to activate all offers
  function activateOffers() {
    // The markup places the clickable behavior on a wrapper (role=button or data-cy="commerce-tile")
    // while the selector targets an inner SVG. Some SVG elements may not have a .click() method,
    // so find the nearest interactive ancestor and dispatch a MouseEvent for compatibility.
    const svgButtons = document.querySelectorAll(
      '[data-cy="commerce-tile-button"]'
    );
    let activated = 0;
    svgButtons.forEach((btn) => {
      try {
        const clickable =
          btn.closest(
            '[role="button"], [data-cy="commerce-tile"], button, a'
          ) || btn;
        clickable.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        activated++;
      } catch (e) {
        console.error("Failed to activate offer element", btn, e);
      }
    });
    alert(
      `Activated ${activated} offers (found ${svgButtons.length} targets).`
    );
  }

  // Show button only on the specific offer hub page
  function checkPage() {
    // The UI may append query params to the hash (e.g. "#/dashboard/merchantOffers/offer-hub?accountId=...")
    // so use startsWith and also check the full href as a fallback.
    const isOfferHub =
      window.location.hash.startsWith("#/dashboard/merchantOffers/offer-hub") ||
      window.location.href.includes("/merchantOffers/offer-hub");
    button.style.display = isOfferHub ? "flex" : "none";
  }

  // Monitor URL hash changes to toggle button visibility on navigation
  window.addEventListener("hashchange", checkPage);

  // Initial check in case the page loads directly to the offer hub
  checkPage();

  // Setup SPA navigation observers: patch history API and observe DOM mutations
  // to handle route changes that do not emit hashchange events.
  let locationChangeTimeout = null;
  function setupNavigationObservers() {
    // Patch history methods to emit a custom event `locationchange`
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;
    history.pushState = function (...args) {
      const ret = _pushState.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };
    history.replaceState = function (...args) {
      const ret = _replaceState.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };
    // Back/forward navigation
    window.addEventListener("popstate", () =>
      window.dispatchEvent(new Event("locationchange"))
    );

    // Debounced handler for location changes
    window.addEventListener("locationchange", () => {
      if (locationChangeTimeout) clearTimeout(locationChangeTimeout);
      locationChangeTimeout = setTimeout(() => {
        checkPage();
      }, 100);
    });

    // MutationObserver to detect when offer tiles or grid are added to the DOM
    // This helps for pages that update content after navigation.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (
            node.matches?.(
              '[data-cy="commerce-tile"], [data-cy="commerce-tile-button"], [data-testid="grid-items-container"]'
            ) ||
            node.querySelector?.(
              '[data-cy="commerce-tile"], [data-cy="commerce-tile-button"], [data-testid="grid-items-container"]'
            )
          ) {
            // Ensure the page visibility logic runs when new content appears
            checkPage();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Start observing SPA navigation and DOM changes
  setupNavigationObservers();

  // Add click event listener to activate offers
  button.addEventListener("click", activateOffers);
})();