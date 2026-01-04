// ==UserScript==
// @name         Instacart Automated Sort & Load
// @description  Automatically loads all items on Instacart sales pages and sorts them by price (low to high). No user interface.
// @version      2.2
// @license      MIT
// @match        https://*.instacart.ca/*
// @match        https://*.instacart.com/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/1428059-dexteon
// @downloadURL https://update.greasyfork.org/scripts/525093/Instacart%20Automated%20Sort%20%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/525093/Instacart%20Automated%20Sort%20%20Load.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let maxLoadMoreClicks = Infinity; // Default: Unlimited "Load More" clicks
  let loadMoreClickCount = 0;

  // Helper function to scroll to an element
  function scrollToElement(element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Function to click the "Load More" button
  function autoLoadMore(callback) {
    const loadMoreButton = document.querySelector('.e-1sdcacc .e-1opyh2e'); // Selector for "Load More" button

    if (loadMoreButton && loadMoreClickCount < maxLoadMoreClicks) {
      console.log("Clicking 'Load More' button...");
      scrollToElement(loadMoreButton);
      loadMoreButton.click();
      loadMoreClickCount++;

      // Wait 3 seconds before checking again
      setTimeout(() => autoLoadMore(callback), 3000);
    } else if (loadMoreClickCount >= maxLoadMoreClicks) {
      console.log(`Reached max 'Load More' clicks (${maxLoadMoreClicks}).`);
      callback(); // Call the sorting function when done
    } else {
      console.log("No more 'Load More' button found. Proceeding to sorting...");
      if (callback) callback();
    }
  }

  // Function to sort products by price
  function sortProducts() {
    const productContainer = document.querySelector("#store-wrapper ul"); // Update this selector if necessary
    if (!productContainer) {
      console.error("Product container not found.");
      return;
    }

    const productItems = Array.from(productContainer.querySelectorAll("li")); // Adjust selector if needed
    if (productItems.length === 0) {
      console.error("No products found to sort.");
      return;
    }

    const pricePattern = /[\d,.]+/;

    // Extract prices and sort items
    const sortedItems = productItems
      .map((item) => {
        const priceElement = item.querySelector("[class*='price']"); // Adjust selector for price
        const priceText = priceElement?.textContent.match(pricePattern);
        const price = priceText ? parseFloat(priceText[0].replace(/,/g, "")) : Infinity;
        return { item, price };
      })
      .sort((a, b) => a.price - b.price); // Sort low to high

    // Clear container and reappend sorted items
    productContainer.innerHTML = "";
    sortedItems.forEach(({ item }) => productContainer.appendChild(item));

    console.log("Products sorted by price (low to high).");
  }

  // Scroll to top of the page
  function scrollToTop() {
    console.log("Scrolling to the top of the page...");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Main function to execute the process
  function main() {
    console.log("Starting automated loading and sorting...");
    autoLoadMore(() => {
      sortProducts(); // Sort products after all items are loaded
      scrollToTop(); // Scroll to the top of the page
    });
  }

  // Run the script
  main();
})();