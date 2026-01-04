// ==UserScript==
// @name         Daft.ie exclude listings
// @namespace    https://github.com/cad0p
// @version      0.2
// @description  try to get a place to stay in Ireland!
// @author       Pier Carlo Cadoppi
// @match        https://www.daft.ie/*showMap=true*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=daft.ie
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471198/Daftie%20exclude%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/471198/Daftie%20exclude%20listings.meta.js
// ==/UserScript==

(function () {
  const listingsToExclude = retrieveExcludedListings();

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      // Only intercept JSON requests.
      const contentType = this.getResponseHeader("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return;
      }
      const res = JSON.parse(this.responseText);
      if ("listings" in res) {
        console.log("Excluding listings:", listingsToExclude);
        // Filter the listings
        res.listings = res.listings.filter(
          (l) => !listingsToExclude.has(l.listing.id)
        );
        // Override the response text.
        Object.defineProperty(this, "responseText", {
          get() {
            return JSON.stringify(res);
          },
        });
      }
    });
    origOpen.apply(this, arguments);
  };

  function storeExcludedListings() {
    // Convert the set of excluded listings to a JSON string
    const excludedListingsJSON = JSON.stringify([...listingsToExclude]);
    // Store the JSON string in the local storage with a key of "excludedListings"
    localStorage.setItem("excludedListings", excludedListingsJSON);
  }

  function retrieveExcludedListings() {
    // Retrieve the JSON string from the local storage with the same key
    let retrievedJSON = localStorage.getItem("excludedListings");
    // Check if the retrieved JSON is null
    if (retrievedJSON === null) {
      // Use an empty array as the default value
      retrievedJSON = "[]";
    }
    // Convert the JSON string back to a set of excluded listings
    return new Set(JSON.parse(retrievedJSON));
  }

  /**
   * Updates the map to show the excluded listings
   * by zooming out and then zooming in
   */
  function updateMap() {
    // Select the zoom out button
    const zoomOutButton = document.querySelector(".mapboxgl-ctrl-zoom-out");
    // Select the zoom in button
    const zoomInButton = document.querySelector(".mapboxgl-ctrl-zoom-in");
    // Click on the zoom out button once
    zoomOutButton.click();
    // Wait for a short delay
    setTimeout(() => {
      // Click on the zoom in button once
      zoomInButton.click();
    }, 500); // Adjust the delay as needed
  }

  /**
   * Add a listing id to the exclude set
   * @param {number} id
   */
  function excludeListing(id) {
    listingsToExclude.add(id);
    console.log(`Excluded listing ${id}`);
    storeExcludedListings();
  }

  /**
   * Create a button element to exclude a listing
   * @param {HTMLElement} map
   * @param {string} id
   * @returns
   */
  function createButton(map, id) {
    const button = document.createElement("button");
    button.style.position = "absolute";
    button.style.top = "5px"; // Move it down by 5 pixels
    button.style.right = "5px"; // Move it left by 5 pixels
    button.style.backgroundColor = "red";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "5px";
    button.style.cursor = "pointer";
    button.textContent = "EXCLUDE"; // Use capital letters
    button.addEventListener("click", (event) => {
      // Prevent the default behavior of the anchor element
      event.preventDefault();
      // Exclude the listing
      excludeListing(parseInt(id));
      // Close the popup
      const popup = map.querySelector(".SubUnit__Wrapper-sc-10x486s-0");
      popup.remove();
      updateMap();
    });
    return button;
  }

  // Create a mutation observer
  const observer = new MutationObserver((mutations) => {
    // Loop through the mutations
    for (const mutation of mutations) {
      // Check if any nodes were added
      if (mutation.addedNodes.length > 0) {
        // Loop through the added nodes
        for (const node of mutation.addedNodes) {
          // Check if the node is the map element
          if (node.classList.contains("MapSearch__MapWrapper-sc-1ibpnqf-1")) {
            // Select the map element
            const map = node;
            console.log("Map element", map);
            updateMap();
            // Add a click event listener with useCapture option
            map.addEventListener(
              "click",
              () => {
                console.log("Map clicked");

                // Wait for a short delay to let the listings load
                setTimeout(() => {
                  // Select all the listing elements
                  const mapListing = map.querySelector(
                    ".SubUnit__Wrapper-sc-10x486s-0"
                  );

                  if (mapListing) {
                    console.log("Found map listing:", mapListing);

                    // Get the listing id from the href attribute
                    const href = mapListing.getAttribute("href");
                    const id = href.split("/").pop();
                    console.log("Listing id", id);

                    // Create a button for this listing
                    const button = createButton(map, id);

                    // Append it to the thumbnail div
                    const thumbnail = mapListing.querySelector(
                      ".SubUnit__ColA-sc-10x486s-1"
                    );
                    thumbnail.appendChild(button);
                  }
                }, 100); // Adjust the delay as needed
              },
              true
            ); // Set useCapture to true
            // Disconnect the observer
            observer.disconnect();
            // Break the loop
            break;
          }
        }
      }
    }
  });

  // Select the parent element of the map element
  const parent = document.querySelector(
    ".SearchPage__MapSearchContainer-gg133s-11"
  );

  // Start observing the parent element for child node changes
  observer.observe(parent, { childList: true });
})();
