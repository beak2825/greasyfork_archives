// ==UserScript==
// @name         BJ's Wholesale Club Coupon Clipper with Live Count (Improved)
// @namespace    Violentmonkey Scripts
// @match        *://*.bjs.com/*
// @grant        none
// @version      1.6
// @author       @raxityo (modified)
// @description  Adds a button that shows a live count of coupons being clipped on any BJ's website subdomain.
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/528560/BJ%27s%20Wholesale%20Club%20Coupon%20Clipper%20with%20Live%20Count%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528560/BJ%27s%20Wholesale%20Club%20Coupon%20Clipper%20with%20Live%20Count%20%28Improved%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to clip all available coupons and update live count
  async function clipAllOffers() {
    // Disable the button to prevent multiple clicks
    button.disabled = true;
    button.style.backgroundColor = "#ccc";
    button.style.cursor = "not-allowed";

    try {
      const membershipNumber = localStorage.getItem("x_MembershipNumber");
      const clubDetails = localStorage.getItem("clubDetailsForClubId");
      if (!membershipNumber || !clubDetails) {
        console.error("Missing membership or club details in localStorage.");
        updateButtonText("Missing login/club info", true);
        return;
      }

      const clubData = JSON.parse(clubDetails);
      const zipcode = clubData.postalCode;

      // Fetch available offers
      updateButtonText("Fetching coupons...", false);
      const response = await fetch("https://api.bjs.com/digital/live/api/v1.0/member/available/offers", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          membershipNumber,
          zipcode,
          category: "",
          isPrev: false,
          isNext: true,
          pagesize: 500,
          searchString: "",
          indexForPagination: 0,
          brand: ""
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch offers: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Ensure data format is correct
      if (!data || !Array.isArray(data) || !data[0]?.availableOffers) {
        console.error("Unexpected response structure.", data);
        updateButtonText("Unexpected response format", true);
        return;
      }

      const offers = data[0].availableOffers;
      const total = offers.length;

      if (total === 0) {
        updateButtonText("No coupons available", true);
        return;
      }

      // Track successes and failures
      let succeeded = 0;
      let failed = 0;

      // Process each available offer sequentially with delay and better error handling
      for (let i = 0; i < total; i++) {
        updateButtonText(`Clipping ${i + 1}/${total} - S:${succeeded} F:${failed}`, false);
        const { offerId, storeId } = offers[i];

        try {
          const clipResponse = await fetch(
            `https://api.bjs.com/digital/live/api/v1.0/store/${storeId}/coupons/activate?zip=${zipcode}&offerId=${offerId}`,
            {
              method: 'GET',
              credentials: "include",
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          if (clipResponse.ok) {
            succeeded++;
          } else {
            console.error(`Failed to clip coupon ${offerId}:`, clipResponse.status, clipResponse.statusText);
            failed++;
          }

          // Add a small delay between requests to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));

        } catch (clipError) {
          console.error(`Error clipping coupon ${offerId}:`, clipError);
          failed++;
        }
      }

      updateButtonText(`Complete: ${succeeded} clipped, ${failed} failed`, true);
    } catch (error) {
      console.error("Error in coupon clipping process:", error);
      updateButtonText(`Error: ${error.message}`, true);
    }
  }

  function updateButtonText(text, enableButton) {
    button.textContent = text;
    if (enableButton) {
      button.disabled = false;
      button.style.backgroundColor = "#007bff";
      button.style.cursor = "pointer";
    }
  }

  // Create and style the button
  const button = document.createElement("button");
  button.textContent = "Clip All Coupons";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.zIndex = "10000";
  button.style.padding = "10px 15px";
  button.style.backgroundColor = "#007bff";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

  // Attach click event to run the function
  button.addEventListener("click", clipAllOffers);

  // Append the button to the document body when DOM is ready
  function addButton() {
    if (!document.body.contains(button)) {
      document.body.appendChild(button);
    }
  }

  // Ensure the button is added even if the page changes dynamically
  const observer = new MutationObserver(addButton);
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial button placement
  addButton();
})();
