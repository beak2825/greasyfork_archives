// ==UserScript==
// @name         Chase One-Click Offer Activator
// @namespace    https://anhpham.dev/
// @version      0.1
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
    const offerButtons = document.querySelectorAll(
      '[data-cy="commerce-tile-button"]'
    );
    offerButtons.forEach((btn) => btn.click());
    alert(`Activated ${offerButtons.length} offers!`);
  }

  // Show button only on the specific offer hub page
  function checkPage() {
    const isOfferHub =
      window.location.hash === "#/dashboard/merchantOffers/offer-hub";
    button.style.display = isOfferHub ? "flex" : "none";
  }

  // Monitor URL hash changes to toggle button visibility on navigation
  window.addEventListener("hashchange", checkPage);

  // Initial check in case the page loads directly to the offer hub
  checkPage();

  // Add click event listener to activate offers
  button.addEventListener("click", activateOffers);
})();
