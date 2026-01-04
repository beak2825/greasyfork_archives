// ==UserScript==
// @name            Amazon Wish List Custom Items
// @namespace       https://greasyfork.org/en/scripts/430176-amazon-wish-list-custom-items
// @version         0.6
// @description     Add custom items to your wish list. Links to eBay and external sites. Replaces idea list image with yellow lightbulb.
// @author          asheroto
// @license         MIT
// @icon            https://www.amazon.com/favicon.ico
// @match           https://www.amazon.com/gp/registry/wishlist/*
// @match           https://www.amazon.com/hz/wishlist/*
// @downloadURL https://update.greasyfork.org/scripts/430176/Amazon%20Wish%20List%20Custom%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/430176/Amazon%20Wish%20List%20Custom%20Items.meta.js
// ==/UserScript==

// ==OpenUserScript==
// @author          asheroto
// ==/OpenUserScript==

/* jshint esversion: 6 */

(function () {
  // Set length
  let g_length = 0;

  // Match maker
  function e_match(elem, ih_match, regexPattern, replaceThis, hrefPrepend, hrefText) {
    try {
      // If keyword matches
      if (elem.innerHTML.includes(ih_match)) {
        // Match regex pattern
        let e_matches = elem.innerHTML.match(regexPattern);

        // Get number of matches
        let e_length = e_matches.length;

        // If at least 1 match
        if (e_length > 0) {
          // Replace data
          let e_href = hrefPrepend + e_matches[0].replace(replaceThis, "");

          // Create link
          let e_result = '<a href="' + e_href + '" target="_blank">' + hrefText + "<a/>";

          // Replace data in DOM
          elem.innerHTML = e_result;
        }
      }
    }
    catch (e) {}

    return true;
  }

  // Checker
  function check() {
    // Get all comments box elements
    let wt = document.getElementsByClassName("wrap-text");
    let wt_length = wt.length;
    for (let i = 0; i <= wt_length - 1; i++) {
      // Get element
      let elem = document.getElementsByClassName("wrap-text")[i];

      // eBay Search
      e_match(elem, "ebay:", "\\bebay:(.*)\\S", "ebay:", "https://www.ebay.com/sch/i.html?_nkw=", '<img src="https://svgur.com/i/Zhh.svg" width="75x"></img>');

      // eBay Item
      e_match(elem, "ebay_item:", "\\bebay_item:(.*)\\S", "ebay_item:", "https://www.ebay.com/itm/", '<img src="https://svgur.com/i/Zhh.svg" width="75x"></img>');

      // URL
      e_match(elem, "url:", "\\burl:(.*)\\S", "url:", "", "External Website");
    }

    // Get all idea images
    let ii = document.getElementsByTagName("img");
    let ii_length = ii.length;
    for (let i = 0; i <= ii_length - 1; i++) {
      // Get element
      let elemI = ii[i];

      // Image
      let img = elemI.src;
      if (img.includes("wfa_idea")) {
        // Replace img src
        let i_result = "https://i.ibb.co/6vf3qNs/idea.png";

        // Replace data in DOM
        elemI.src = i_result;
        elemI.width = "135";
        elemI.height = "135";
      }
    }
  }

  // Check if page has changed by comparing length
  function runCheck() {
    let gil = document.getElementById("g-items").innerHTML.length;
    if (gil > g_length) {
      g_length = gil;
      check();
    }
  }

  // Run check every 2 seconds
  let repeat = setInterval(runCheck, 2000);

  // Initial run
  runCheck();
})();
