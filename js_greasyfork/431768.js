// ==UserScript==
// @name         K-Ruoka sort by unit price.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sorts K-Ruoka search results by unit price.
// @author       Santeri Hetekivi
// @match        https://www.k-ruoka.fi/kauppa/tuotehaku*
// @icon         https://www.google.com/s2/favicons?domain=k-ruoka.fi
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/431768/K-Ruoka%20sort%20by%20unit%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/431768/K-Ruoka%20sort%20by%20unit%20price.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Seconds to wait after scrolling for items to load.
  const SCROLL_LOAD_WAIT = 1000;
  // Query to get result list.
  const QUERY_RESULT_LIST = ".product-search-result-list";
  /**
   * Get price for given item
   * @param {object} _item JQuery element.
   * @returns Price as float or 0.00 if not found.
   */
  const UNIT_PRICE = (_item) => {
    // Get price in parts.
    const PARTS = _item.find(".reference").text().match("([0-9]*),([0-9]*)");
    // Get unit price.
    const UNIT_PRICE = PARTS
      ? // If got parts generate float.
        parseFloat((PARTS[1] ?? "0") + "." + (PARTS[2] ?? "00"))
      : // If did not get parts use 0.00
        0.0;
    // Ouput debug with
    console.debug(
      // product name,
      _item.find(".product-name").text(),
      // unit price.
      UNIT_PRICE,
      // and parts.
      PARTS
    );
    return UNIT_PRICE;
  };

  /**
   * Order item list by unit price.
   */
  const ORDER = () => {
    "use strict";
    // Query for results element.
    const QUERY_RESULTS = "#product-search-results";
    // Query for items.
    const QUERY_RESULT_ITEMS = QUERY_RESULTS + " .bundle-list-item";

    // Collecting items.
    console.debug("Collecting items...");
    // Init array for items.
    var items = [];
    // Get all items
    $(QUERY_RESULT_ITEMS).each(function () {
      // and add them as detached to items array.
      items.push($(this).detach());
    });
    // Ouput how many items where collected.
    console.debug("Items collected: ", items.length);

    // Order items by unit price.
    console.debug("Ordering items...");
    items.sort((item1, item2) => {
      return UNIT_PRICE(item1) - UNIT_PRICE(item2);
    });

    // Remove items from UI.
    console.debug("Removing items...");
    $(QUERY_RESULT_ITEMS).remove();

    // Add items back in unit price order.
    console.debug("Adding items back...");
    items.forEach((item) => {
      item.appendTo(QUERY_RESULTS);
    });

    // Scroll to top of result list.
    console.debug("Scrolling to top...");
    $(QUERY_RESULT_LIST).scrollTop(0);

    // All done.
    console.debug("DONE!");
  };

  // Init last scroll top to null.
  var lastScrollTop = null;
  /**
   * Scroll to botton while loading data.
   */
  const SCROLL = () => {
    "use strict";
    // Get current scroll top.
    const CURR_SCROLL_TOP = $(QUERY_RESULT_LIST).scrollTop();
    console.debug("CURR_SCROLL_TOP", CURR_SCROLL_TOP);

    // If last scroll was same as current
    if (lastScrollTop === CURR_SCROLL_TOP) {
      // Order by unit price.
      ORDER();
    }
    // If last scroll was not same as curren.
    else {
      // Update last scroll top with current.
      lastScrollTop = CURR_SCROLL_TOP;
      // Scroll to bottom.
      $(QUERY_RESULT_LIST).scrollTop(CURR_SCROLL_TOP + 300000);
      // Wait for more items to load and call SCROLL again.
      setTimeout(SCROLL, SCROLL_LOAD_WAIT);
    }
  };

  // Add order by unit price button.
  // Id for the button element.
  const ID_BUTTON = "unitPriceSortButton";
  // Button HTML-code.
  const BUTTON_HTML =
    "<button id='" + ID_BUTTON + "'>Order By Unit Price</button>";
  // Get advanced search bar.
  const ADVANCED_SEARCH_BAR = $(".advanced-search-bar");
  // If advanced search bar is found,
  if (ADVANCED_SEARCH_BAR.length === 1) {
    // prepend button to it
    ADVANCED_SEARCH_BAR.prepend(BUTTON_HTML);
  } else {
    // else append it to subcategory search field.
    $(".subcategory-search-field").append(BUTTON_HTML);
  }
  // Set to start with scrolling on click.
  $("#" + ID_BUTTON).on("click", SCROLL);
})();
