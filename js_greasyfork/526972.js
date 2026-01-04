// ==UserScript==
// @name         GOG Wishlist - Sort by Price (Dropdown)
// @namespace    https://github.com/idkicarus
// @homepageURL  https://github.com/idkicarus/GOG-wishlist-sort
// @supportURL   https://github.com/idkicarus/GOG-wishlist-sort/issues
// @description  Enables sorting by price (ascending and descending) via the dropdown on a GOG wishlist page. Switching between "sort by price" and a native sorting option (title, date added, user reviews) automatically refreshes the page twice.
// @version      1.04
// @license      MIT
// @match        https://www.gog.com/account/wishlist*
// @match        https://www.gog.com/*/account/wishlist*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526972/GOG%20Wishlist%20-%20Sort%20by%20Price%20%28Dropdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526972/GOG%20Wishlist%20-%20Sort%20by%20Price%20%28Dropdown%29.meta.js
// ==/UserScript==

(function () {
    // Global flags to track the sorting state.
    // lastSortWasPrice: Tracks if the last sort action was by price.
    // ascendingOrder: Determines if the current sort order should be ascending.
    let lastSortWasPrice = false;
    let ascendingOrder = true;

    // Retrieve the current refresh stage from sessionStorage.
    // This is used to coordinate a two-step refresh process that helps to avoid visual glitches.
    let refreshStage = sessionStorage.getItem("gog_sort_fix_stage");

    /**
     * Hides the wishlist section.
     *
     * Sets the opacity to 0 and disables pointer events so that the user does not see the unsorted list during refresh.
     */
    function hideWishlist() {
        let wishlistSection = document.querySelector(".account__product-lists");
        if (wishlistSection) {
            wishlistSection.style.opacity = "0";
            wishlistSection.style.pointerEvents = "none";
        }
    }

    /**
     * Shows the wishlist section.
     *
     * Restores the opacity and re-enables pointer events to reveal the sorted content.
     */
    function showWishlist() {
        let wishlistSection = document.querySelector(".account__product-lists");
        if (wishlistSection) {
            wishlistSection.style.opacity = "1";
            wishlistSection.style.pointerEvents = "auto";
        }
    }

    // If we are in the first stage of refresh (refreshStage equals "1"),
    // wait until the DOM is fully loaded and then hide the wishlist.
    // This prevents the user from seeing the intermediate unsorted state.
    if (refreshStage === "1") {
        document.addEventListener("DOMContentLoaded", () => {
            hideWishlist();
        });
    }

    /**
     * Sorts the wishlist products by price.
     *
     * This function performs the following steps:
     * 1. Logs the start of the sort process.
     * 2. Retrieves the wishlist container (the second element with class 'list-inner').
     * 3. Collects all product rows from the container.
     * 4. Iterates over each product row to extract the product title and price.
     *    - Separates items with a valid price from those marked as "TBA" (to be announced).
     * 5. Determines the sort order:
     *    - If the last sort was by price, toggle the order (ascending/descending);
     *    - Otherwise, default to ascending.
     * 6. Sorts the priced items based on the selected order.
     * 7. Clears the current product rows from the container.
     * 8. Appends the sorted priced items followed by TBA items back to the container.
     * 9. Sets the flag indicating that the last sort action was by price.
     */
    function sortByPrice() {
        console.log("[Sort By Price] Sorting Started.");

        // Retrieve the wishlist container element (using the second occurrence of '.list-inner').
        let listInner = document.querySelectorAll('.list-inner')[1];
        if (!listInner) {
            console.error("[Sort By Price] ERROR: Wishlist list-inner element not found.");
            return;
        }

        // Convert the NodeList of product rows to an array.
        let productRows = Array.from(listInner.querySelectorAll('.product-row-wrapper'));
        console.log(`[Sort By Price] Found ${productRows.length} product rows.`);

        let pricedItems = []; // Array to hold products with valid prices.
        let tbaItems = [];    // Array to hold products that are TBA or marked as SOON.

        // Process each product row.
        productRows.forEach(row => {
            // Extract the title from the product row.
            const titleElement = row.querySelector('.product-row__title');
            const title = titleElement ? titleElement.innerText.trim() : "Unknown Title";

            // Extract the standard price and discounted price elements.
            const priceElement = row.querySelector('._price.product-state__price');
            const discountElement = row.querySelector('.price-text--discount span.ng-binding');

			// Check if the game is flagged as "SOON" by inspecting a dedicated element.
            const soonFlag = row.querySelector('.product-title__flag--soon');

            // Determine the price: if a discount price exists, use it; otherwise, use the standard price.
            let priceText = discountElement ? discountElement.innerText : priceElement ? priceElement.innerText : null;
            // Convert the price text to a numeric value by stripping out non-numeric characters.
            let priceNumeric = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '').replace(/,/g, '')) : null;

            // Check if the product is marked as TBA by determining the visibility of the TBA badge.
            const tbaBadge = row.querySelector('.product-state__is-tba');
            const isTbaVisible = tbaBadge && tbaBadge.offsetParent !== null;

            // Use the visibility check or missing price to classify as TBA.
            const isTBA = isTbaVisible || priceText === null;

            // If the item is TBA, or its price is set to 99.99 with a "SOON" flag, or the price is not a number,
            // add it to the TBA list; otherwise, add it to the priced items list.
            if (isTBA || (priceNumeric === 99.99 && soonFlag) || isNaN(priceNumeric)) {
                console.log(`[Sort By Price] Marked as TBA/SOON: ${title}`);
                tbaItems.push(row);
            } else {
                console.log(`[Sort By Price] ${title} - Extracted Price: ${priceNumeric}`);
                pricedItems.push({ row, price: priceNumeric, title });
            }
        });

        // Determine sort order:
        // If the last sort was by price, toggle the order; if not, default to ascending.
        ascendingOrder = lastSortWasPrice ? !ascendingOrder : true;
        // Sort the priced items based on price.
        pricedItems.sort((a, b) => (ascendingOrder ? a.price - b.price : b.price - a.price));

        // Force a reflow by briefly hiding and showing the container.
        listInner.style.display = "none";
        listInner.offsetHeight;
        listInner.style.display = "block";

        // Clear current content of the wishlist container.
        while (listInner.firstChild) {
            listInner.removeChild(listInner.firstChild);
        }

        // Append sorted priced items first.
        pricedItems.forEach(item => listInner.appendChild(item.row));
        // Append TBA items after the priced items.
        tbaItems.forEach(item => listInner.appendChild(item));

        // Set flag indicating that the last sort action was by price.
        lastSortWasPrice = true;
        console.log("[Sort By Price] Sorting Completed.");
    }

    /**
     * Handles switching back to the native sort method.
     *
     * If the sort was changed after sorting by price, this function triggers a two-stage page refresh
     * to revert the changes smoothly.
     *
     * @param {string} option - The native sort option selected by the user.
     */
    function handleNativeSortClick(option) {
        console.log(`[Sort By Price] Switching to native sort: ${option}`);

        // If we're in the second stage of refresh, remove the flag and show the wishlist.
        if (refreshStage === "1") {
            console.log("[Sort By Price] Second refresh triggered to apply sorting.");
            sessionStorage.removeItem("gog_sort_fix_stage");
            showWishlist();
            return;
        }

        // Otherwise, set the refresh stage and hide the wishlist before reloading.
        sessionStorage.setItem("gog_sort_fix_stage", "1");
        console.log("[Sort By Price] First refresh (hiding only wishlist section).");

        hideWishlist();
        setTimeout(() => {
            location.reload();
        }, 50);
    }

    /**
     * Adds the "Price" sort option to the existing dropdown menu.
     *
     * This function:
     * 1. Searches for the dropdown container.
     * 2. If not found, retries after a short delay.
     * 3. Creates a new span element representing the "Price" option.
     * 4. Attaches an event listener to handle sorting when clicked.
     * 5. Appends the new option to the dropdown.
     * 6. Adds event listeners to the native sort options to handle switching back if needed.
     */
    function addSortByPriceOption() {
        const dropdown = document.querySelector(".header__dropdown ._dropdown__items");
        if (!dropdown) {
            console.log("[Sort By Price] WARNING: Dropdown not found. Retrying...");
            // If the dropdown is not found, try again after 500ms (wait for DOM elements to be available)
            setTimeout(addSortByPriceOption, 500);
            return;
        }

        // If the "Price" sort option has already been added, exit early
        if (document.querySelector("#sort-by-price")) return;

        // Create a new span element to serve as the "Price" sort option
        let sortPriceOption = document.createElement("span");
        sortPriceOption.id = "sort-by-price";
        sortPriceOption.className = "_dropdown__item";
        sortPriceOption.innerText = "Price";

        // When the "Price" option is clicked, sort the wishlist and update the header.
        sortPriceOption.addEventListener("click", () => {
            sortByPrice();
            updateSortHeader("Price");
        });

        // Add the new option to the dropdown.
        dropdown.appendChild(sortPriceOption);
        console.log("[Sort By Price] 'Price' option added to sort dropdown.");

        // Add click event listeners to all other native sort options in the dropdown.
        // When any of these are clicked after a "Price" sort, trigger the native sort refresh process.
        document.querySelectorAll(".header__dropdown ._dropdown__item").forEach(item => {
            if (item.id !== "sort-by-price") {
                item.addEventListener("click", () => {
                    // Only trigger the native sort refresh if the last sort was by price
                    if (lastSortWasPrice) {
                        handleNativeSortClick(item.innerText);
                    }
                });
            }
        });
    }

    /**
     * Updates the sort header in the dropdown to reflect the current sorting option.
     *
     * This function:
     * 1. Finds the header element.
     * 2. Hides any native sort option indicators.
     * 3. Creates or updates a custom header element with the provided sort option text.
     *
     * @param {string} option - The sort option to display (e.g., "Price").
     */
    function updateSortHeader(option) {
        console.log(`[Sort By Price] Updating sort header to: ${option}`);
        const sortHeader = document.querySelector(".header__dropdown ._dropdown__pointer-wrapper");
        if (!sortHeader) {
            console.log("[Sort By Price] ERROR: Sort header not found.");
            return;
        }

        // Hide any elements that show native sort options.
        document.querySelectorAll(".header__dropdown span[ng-show]").forEach(el => {
            el.style.display = "none";
        });

        // Check if the custom sort header exists; if not, create it.
        let customSortHeader = document.querySelector("#sort-by-price-header");
        if (!customSortHeader) {
            customSortHeader = document.createElement("span");
            customSortHeader.id = "sort-by-price-header";
            customSortHeader.className = "";
            sortHeader.insertBefore(customSortHeader, sortHeader.firstChild);
        }

        // Update the custom header text and make it visible.
        customSortHeader.innerText = option;
        customSortHeader.style.display = "inline-block";
    }

    // Create a MutationObserver to watch for the dropdown menu element.
    // When the dropdown is found, add the "Price" sort option and disconnect the observer.
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector(".header__dropdown ._dropdown__items")) {
            addSortByPriceOption();
            obs.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // If we are in the refresh stage "1", trigger a second refresh after a short delay.
    if (refreshStage === "1") {
        console.log("[Sort By Price] Performing second refresh to finalize sorting.");
        sessionStorage.removeItem("gog_sort_fix_stage");

        setTimeout(() => {
            location.reload();
        }, 50);
    }
})();
