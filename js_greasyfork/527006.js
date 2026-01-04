// ==UserScript==
// @name         GOG Wishlist - Sort by Price (Button)
// @namespace    https://github.com/idkicarus
// @homepageURL  https://github.com/idkicarus/GOG-wishlist-sort
// @supportURL   https://github.com/idkicarus/GOG-wishlist-sort/issues
// @description  Enables sorting by price (ascending and descending) via a button on a GOG wishlist page. Switching between "sort by price" and a native sorting option (title, date added, user reviews) automatically refreshes the page twice. 
// @version      1.04
// @license      MIT
// @match        https://www.gog.com/account/wishlist*
// @match        https://www.gog.com/*/account/wishlist*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527006/GOG%20Wishlist%20-%20Sort%20by%20Price%20%28Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527006/GOG%20Wishlist%20-%20Sort%20by%20Price%20%28Button%29.meta.js
// ==/UserScript==

(function () {
    // --------------------------------------------------
    // Global State Variables
    // --------------------------------------------------
    // `ascendingOrder`: Boolean flag that determines if sorting is ascending.
    // `lastSortWasPrice`: Tracks whether the last sort action was performed using the custom price sort.
    // `refreshStage`: A flag stored in sessionStorage to manage a two-stage refresh process when switching back to native sorting.
    let ascendingOrder = true;
    let lastSortWasPrice = false;
    let refreshStage = sessionStorage.getItem("gog_sort_fix_stage");

    // --------------------------------------------------
    // Helper Functions for Managing Wishlist Visibility
    // --------------------------------------------------

    /**
     * hideWishlist
     *
     * Hides the wishlist section by reducing its opacity and disabling pointer events.
     * This is used during the refresh process to prevent users from seeing a transitional or unsorted state.
     */
    function hideWishlist() {
        const wishlistSection = document.querySelector(".account__product-lists");
        if (wishlistSection) {
            wishlistSection.style.opacity = "0";
            wishlistSection.style.pointerEvents = "none";
        }
    }

    /**
     * showWishlist
     *
     * Restores the wishlist section's visibility and re-enables pointer events.
     * This is called after the refresh process to reveal the sorted or native list.
     */
    function showWishlist() {
        const wishlistSection = document.querySelector(".account__product-lists");
        if (wishlistSection) {
            wishlistSection.style.opacity = "1";
            wishlistSection.style.pointerEvents = "auto";
        }
    }

    // --------------------------------------------------
    // Two-Stage Refresh for Native Sorting
    // --------------------------------------------------
    // When switching back to a native sort, a two-stage refresh process is used:
    // 1. The first stage hides the wishlist to avoid showing a transitional state.
    // 2. A second refresh reloads the page and then reveals the wishlist.
    if (refreshStage === "1") {
        // Once the DOM content is loaded, hide the wishlist.
        document.addEventListener("DOMContentLoaded", () => {
            hideWishlist();
        });
        console.log("[Sort By Price] In refresh stage 1; scheduling second refresh.");
        // Schedule the second refresh after a short delay.
        setTimeout(() => {
            console.log("[Sort By Price] Performing second refresh to finalize native sorting.");
            sessionStorage.removeItem("gog_sort_fix_stage"); // Clear the refresh flag.
            location.reload(); // Reload the page to complete native sorting.
        }, 50);
    }

    // --------------------------------------------------
    // Custom Sorting Logic: "Sort by Price" Button
    // --------------------------------------------------

    // Create a button element for sorting the wishlist by price.
    const sort_btn = document.createElement("button");
    sort_btn.innerHTML = "Sort by Price";

    // Attach an event listener to the button to trigger sorting when clicked.
    sort_btn.addEventListener("click", () => {
        console.log("[Sort By Price] Button Clicked. Sorting Started.");

        // Retrieve the wishlist container; it is assumed to be the second element with class 'list-inner'.
        const listInner = document.querySelectorAll('.list-inner')[1];
        if (!listInner) {
            console.error("[Sort By Price] ERROR: .list-inner element not found.");
            return;
        }

        // Get all product rows within the wishlist.
        const productRows = Array.from(listInner.querySelectorAll('.product-row-wrapper'));
        console.log(`[Sort By Price] Found ${productRows.length} product rows.`);

        // Initialize arrays to store items with valid prices and those marked as TBA/SOON.
        const pricedItems = [];
        const tbaItems = [];

        // Process each product row to extract title and price information.
        productRows.forEach(row => {
            // Retrieve the product title; default to "Unknown Title" if not found.
            const titleElement = row.querySelector('.product-row__title');
            const title = titleElement ? titleElement.innerText.trim() : "Unknown Title";

            // Retrieve price elements: the standard price and any discount price.
            const priceElement = row.querySelector('._price.product-state__price');
            const discountElement = row.querySelector('.price-text--discount span.ng-binding');

            // Check for a "SOON" flag that indicates the product is not yet available.
            const soonFlag = row.querySelector('.product-title__flag--soon');

            // Determine which price text to use; prefer the discount price if available.
            const priceText = discountElement ? discountElement.innerText : priceElement ? priceElement.innerText : null;
            // Convert the extracted price text into a numeric value.
            const priceNumeric = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '').replace(/,/g, '')) : null;

            // Check if a "TBA" badge is visibly displayed (i.e., its parent element is not hidden).
            const tbaBadge = row.querySelector('.product-state__is-tba');
            const isTbaVisible = tbaBadge && tbaBadge.offsetParent !== null;

            // Determine if this product should be treated as TBA.
            const isTBA = isTbaVisible || priceText === null;

            // Categorize the product:
            // - If it's marked as TBA (or its price is a placeholder like 99.99 with a "SOON" flag, or the price is not a number),
            //   add it to the tbaItems array.
            // - Otherwise, add it to the pricedItems array with its associated data.
            if (isTBA || (priceNumeric === 99.99 && soonFlag) || isNaN(priceNumeric)) {
                console.log(`[Sort By Price] Marked as TBA/SOON: ${title}`);
                tbaItems.push(row);
            } else {
                console.log(`[Sort By Price] ${title} - Extracted Price: ${priceNumeric}`);
                pricedItems.push({ row, price: priceNumeric, title });
            }
        });

        console.log("[Sort By Price] Sorting priced items...");
        // Sort the array of priced items in ascending or descending order based on the current flag.
        pricedItems.sort((a, b) => ascendingOrder ? a.price - b.price : b.price - a.price);
        console.log("[Sort By Price] Sorted Prices:", pricedItems.map(p => `${p.title}: $${p.price}`));

        // Rearrange the wishlist: add the sorted priced items first, then append the TBA items in their original order.
        pricedItems.forEach(item => listInner.appendChild(item.row));
        tbaItems.forEach(item => listInner.appendChild(item));

        // Toggle the sort order for the next click and record that the last sort action was by price.
        ascendingOrder = !ascendingOrder;
        lastSortWasPrice = true;
        console.log("[Sort By Price] Sorting Completed.");
    });

    // --------------------------------------------------
    // Append the "Sort by Price" Button to the UI
    // --------------------------------------------------
    // The button is added to the page after a delay to ensure that the target container has loaded.
    if (/wishlist/.test(document.location.href)) {
        setTimeout(() => {
            let el;
            // Identify the appropriate header element to which the button should be appended.
            const header = document.querySelector(".header__main");
            if (/Wishlisted by/.test(header?.innerHTML)) {
                el = document.querySelector(".collection-header");
            } else {
                const headers = document.querySelectorAll(".header__main");
                el = headers[headers.length - 1];
            }
            if (el) {
                el.appendChild(sort_btn);
                console.log("[Sort By Price] Sort button added to UI.");
            }
        }, 900);
    }

    // --------------------------------------------------
    // Native Sort Refresh Logic
    // --------------------------------------------------

    /**
     * handleNativeSortClick
     *
     * Handles clicks on native sort options (such as sort by title, date added, or user reviews).
     * When the last sort was performed using the custom "Sort by Price" button,
     * this function triggers a two-stage refresh process:
     *   1. Set a flag in sessionStorage and reload the page with the wishlist hidden.
     *   2. After reload, clear the flag and show the wishlist to allow the native sort to take effect.
     *
     * @param {string} option - The label of the native sort option selected.
     */
    function handleNativeSortClick(option) {
        console.log(`[Sort By Price] Switching to native sort: ${option}`);
        // If already in the first refresh stage, complete the process.
        if (refreshStage === "1") {
            console.log("[Sort By Price] Second refresh triggered to apply native sorting.");
            sessionStorage.removeItem("gog_sort_fix_stage");
            showWishlist();
            return;
        }
        // Set the refresh flag for the first stage and hide the wishlist.
        sessionStorage.setItem("gog_sort_fix_stage", "1");
        console.log("[Sort By Price] First refresh (hiding wishlist before native sort).");
        hideWishlist();
        // Reload the page after a short delay to initiate native sorting.
        setTimeout(() => {
            location.reload();
        }, 50);
    }

    /**
     * addNativeSortListeners
     *
     * Attaches event listeners to native sort dropdown items.
     * These listeners trigger the native sort refresh logic when a native sort option is clicked
     * after a custom price sort has been applied.
     */
    function addNativeSortListeners() {
        // Select all native sort dropdown items.
        const nativeSortItems = document.querySelectorAll(".header__dropdown ._dropdown__item");
        // If the native sort options are not yet available, retry after a short delay.
        if (!nativeSortItems.length) {
            setTimeout(addNativeSortListeners, 500);
            return;
        }
        // Attach click event listeners to each native sort item.
        nativeSortItems.forEach(item => {
            // Ensure that multiple listeners are not attached to the same element.
            if (!item.dataset.priceSortListenerAdded) {
                item.addEventListener("click", () => {
                    // Only trigger the refresh process if the last sort was done by the custom price sort.
                    if (lastSortWasPrice) {
                        handleNativeSortClick(item.innerText);
                        lastSortWasPrice = false; // Reset the flag after handling.
                    }
                });
                // Mark this element as having a listener attached.
                item.dataset.priceSortListenerAdded = "true";
            }
        });
    }

    // Use a MutationObserver to monitor the DOM for the insertion of the native sort dropdown.
    // Once the dropdown is found, attach native sort listeners.
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector(".header__dropdown ._dropdown__items")) {
            addNativeSortListeners();
            obs.disconnect(); // Stop observing once listeners are attached.
        }
    });
    // Start observing the document body for dynamic changes.
    observer.observe(document.body, { childList: true, subtree: true });
})();
