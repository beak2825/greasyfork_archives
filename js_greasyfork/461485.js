// ==UserScript==
// @name         Discogs - Sort by Total Price in Marketplace
// @namespace    https://greasyfork.org/en/scripts/461485
// @version      1.4
// @description  Sort by the italicized 'total' price on a Discogs release page instead of pre-shipping price
// @author       Jon Uleis (@MovingToTheSun)
// @match        https://www.discogs.com/*sell*/*
// @icon         https://www.discogs.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461485/Discogs%20-%20Sort%20by%20Total%20Price%20in%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/461485/Discogs%20-%20Sort%20by%20Total%20Price%20in%20Marketplace.meta.js
// ==/UserScript==
/*jshint esversion: 11 */

(function () {
  "use strict";
  const priceSort = document.querySelector(".price_header .sortable_link_selected");
  const ascending = priceSort?.title.includes("ascending");

  function tableSort() {
    // continue only if we are sorting by price
    if (priceSort) {
      const rows = Array.from(document.querySelectorAll("tr[data-release-id]"));
      rows.sort((rowA, rowB) => {
        const priceA = getRowPrice(rowA);
        const priceB = getRowPrice(rowB);
        return ascending ? priceA - priceB : priceB - priceA;
      });
      // append back to table in new order
      rows.forEach((row) => row.parentNode.appendChild(row));
      // change title text
      document.querySelector(".price_header .link-text").innerText = "Total Price";
    }
  }

  function getRowPrice(row) {
    // if there's no total price, get the original bold one
    const price = row.querySelector(".converted_price") || row.querySelector(".price");
    // if the item is unavailable and we're sorting by lowest, push to bottom
    const weight = row.querySelector(".item_add_to_cart .button") || !ascending ? 0 : 9999999;
    // strip everything else out of the price text
    return parseFloat(price.textContent.replace(/[^0-9]/g, "")) + weight;
  }

  const pjaxContainer = document.querySelector("#pjax_container");
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      // run function again if we're ajax loading in another table of items
      // console.log(mutation.addedNodes);
      if (
        mutation.type === "childList" &&
        mutation.addedNodes.length &&
        (mutation.addedNodes[1]?.nodeName === "TBODY" || mutation.addedNodes[3]?.nodeName === "TABLE")
      ) {
        tableSort();
      }
    }
  });
  observer.observe(pjaxContainer, { subtree: true, childList: true });

  // first run
  tableSort();
})();