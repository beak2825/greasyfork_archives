// ==UserScript==
// @name         K-Ruoka hide non keto items.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide non keto foods from K-Ruoka search results.
// @author       Santeri Hetekivi
// @match        https://www.k-ruoka.fi/kauppa/tuotehaku*
// @icon         https://www.google.com/s2/favicons?domain=k-ruoka.fi
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/431766/K-Ruoka%20hide%20non%20keto%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/431766/K-Ruoka%20hide%20non%20keto%20items.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Max amount of allowed carohydrates.
  const MAX_CARBOHYDRATE_GRAMS = 1.0;
  // Keys to get carbohydrates amount from state.
  const STATE_KEYS = [
    "page",
    "state",
    "productDetails",
    "nutritionalDetails",
    "nutritionalContent",
    "carbohydrates",
    "amount",
  ];
  // How many state keys there are.
  const STATE_KEYS_LENGTH = STATE_KEYS.length;
  // Level of state must be of this type.
  const STATE_TYPE = "object";

  // Seconds to wait after scrolling for items to load.
  const SCROLL_LOAD_WAIT = 1000;
  // Query to get result list.
  const QUERY_RESULT_LIST = ".product-search-result-list";

  /**
   * Clear non keto foods from the list.
   */
  const CLEAR_NON_KETO = () => {
    // Get all product links.
    const PRODUCT_LINKS = $(".product-result-item .click-area");
    // How many product links there where.
    const PRODUCT_LINK_COUNT = PRODUCT_LINKS.length;
    // Initalize handeled counter.
    var handeled = 0;
    // Loop all product links.
    PRODUCT_LINKS.each(function () {
      // Request product data from link url.
      $.get(this.href, (_html) => {
        // Get state from gotten HTML-code.
        var state = $($.parseHTML(_html))
          .filter("div#applicationState")
          .data("state");
        // Init success.
        var success = true;
        // Init index.
        var i = 0;
        // Loop while is successful and not all keys looped.
        while (success && i < STATE_KEYS_LENGTH) {
          // Set success true if current state's type is correct and key in state.
          success = typeof state === STATE_TYPE && STATE_KEYS[i] in state;
          // If was successful step into key.
          if (success) state = state[STATE_KEYS[i]];
          // Increment index.
          ++i;
        }

        // If was successfull, then carbs is current state, else failed to get.
        const CARBS = success ? state : null;
        // Get current item.
        const ITEM = $(this).parents(".product-result-item").first();
        // Debug output product name and carbs.
        console.debug(ITEM.find(".product-name").text(), CARBS);
        // If was successful, got carbs and carbs where less or same as max.
        if (success && CARBS !== null && CARBS <= MAX_CARBOHYDRATE_GRAMS) {
          // Add carb data to reference.
          ITEM.find(".reference").append("<br>" + CARBS + " g");
        }
        // Else if failed to get carbs or they where over the max
        else {
          // Remove product from the list.
          $(this).parents(".bundle-list-item").first().remove();
        }
        // Increment handeled count
        ++handeled;
        console.debug(handeled, PRODUCT_LINK_COUNT);
        // Inform if all handeled.
        if (PRODUCT_LINK_COUNT <= handeled) {
          // Scroll to top of result list.
          console.debug("Scrolling to top...");
          $(QUERY_RESULT_LIST).scrollTop(0);

          // All done.
          console.debug("DONE!");
          alert("All non keto products removed!");
        }
      });
    });
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
      // Clear non keto products.
      CLEAR_NON_KETO();
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

  // Add button to clear non keto foods.
  // Id for the button element.
  const ID_BUTTON = "unitClearNonKetoButton";
  // Button HTML-code.
  const BUTTON_HTML = "<button id='" + ID_BUTTON + "'>Clear Non Keto</button>";
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
