// ==UserScript==
// @name        Price per m2 on njuskalo.hr
// @namespace   Violentmonkey Scripts
// @match       https://www.njuskalo.hr/*
// @grant       none
// @version     1.1
// @author      M3talen
// @description 8/15/2023, 9:46:29 PM
// @downloadURL https://update.greasyfork.org/scripts/473139/Price%20per%20m2%20on%20njuskalohr.user.js
// @updateURL https://update.greasyfork.org/scripts/473139/Price%20per%20m2%20on%20njuskalohr.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Function to calculate and display price per m2
  function calculateAndDisplayPricePerM2() {
    const posts = document.querySelectorAll("article.entity-body");

    posts.forEach((post) => {
      const priceElement = post.querySelector(
        ".entity-prices .price-item .price--hrk"
      );
      const areaElement = post.querySelector(".entity-description-main");

      if (priceElement && areaElement) {
        const priceText = priceElement.textContent;
        const euroMatch = priceText.match(/(\d+(\.\d{3})*)(?:\s*€)/);
        var areaValue = 1;
        var euroValue = 1;
        if (euroMatch) {
          euroValue = parseFloat(
            euroMatch[1].replace(/\./g, "").replace(",", ".")
          );
        }
        const areaText = areaElement.textContent;
        const areaM2 = areaText.match(/Stambena površina:\s*([\d.]+)\s*m2/);
        if (areaM2) {
          areaValue = parseFloat(areaM2[1]);
        }

        const pricePerM2 = euroValue / areaValue;
        if(pricePerM2 !== NaN) {
          const pricePerM2Formatted = pricePerM2.toLocaleString("hr-HR", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const pricePerM2Element = document.createElement("p");
          pricePerM2Element.className = "price-per-m2";
          pricePerM2Element.textContent = `Cijena po m2: ${pricePerM2Formatted}`;

          post
            .querySelector(".entity-description-main")
            .appendChild(pricePerM2Element);
          }
        }
    });
  }

  // Run the function when the page is loaded
  window.addEventListener("load", calculateAndDisplayPricePerM2);
})();
