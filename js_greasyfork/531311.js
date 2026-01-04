// ==UserScript==
// @name        Boycott Percentage
// @description Displays the percentage taken off at market when sale happens
// @version     0.1.4
// @author      ingine
// @namespace   Violentmonkey scripts
// @license     MIT
// @match       https://www.torn.com/page.php?sid=ItemMarket*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531311/Boycott%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/531311/Boycott%20Percentage.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  try {
    GM_registerMenuCommand("Set Percentage", setPercentage);
  } catch (error) {
    console.warn("[BoycottPercentage] Tampermonkey not detected!");
  }

  const FEE_PERCENTAGE_KEY = "ingine-boycott-percentage-fee";

  let feePercentage = localStorage.getItem(FEE_PERCENTAGE_KEY) ?? "2";

  let GM_addStyle = function (s) {
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = s;
    document.head.appendChild(style);
  };

  GM_addStyle(
    `#item-market-root [class^="addListingWrapper__"],
    #item-market-root [class^="addListingWrapper__"]  [class^="itemRowWrapper"],
    #item-market-root [class^="viewListingWrapper__"],
    #item-market-root [class^="viewListingWrapper__"]  [class^="itemRowWrapper"]{
      overflow:visible;
    }
    .ingine-fee-percentage-processed{
      position:relative;
    }
    .ingine-market-fee-view{
      position:absolute;
      right:-104px;
      top:50%;
      transform:translateY(-50%);
      padding: 4px 4px;
      text-align: left;
      width:100px;
      color: #e84118;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 11px;
      box-sizing: border-box;
      border: none;
      height: 32px;
    }`
  );

  const pages = { AddItems: 10, ViewItems: 20, Other: 0 };
  let currentPage = pages.Other;

  const observerTarget = document.querySelector("#item-market-root");
  const observerConfig = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  };
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach((mutationRaw) => {
      let mutation = mutationRaw.target;
      currentPage = getCurrentPage();
      if (currentPage === pages.AddItems) {
        if (mutation.id.startsWith("headless-ui-tabs-panel-")) {
          mutation
            .querySelectorAll(
              "[class*=itemRowWrapper___]:not(.ingine-fee-percentage-processed) > [class*=itemRow___]:not([class*=grayedOut___]) [class^=priceInputWrapper___]"
            )
            .forEach((x) => AddMarketFeeView(x));
        }
        if (mutation.className.indexOf("priceInputWrapper___") > -1) {
          AddMarketFeeView(mutation);
        }
      } else if (currentPage === pages.ViewItems) {
        console.log("View Listings Page found");
        if (mutation.className.startsWith("viewListingWrapper___")) {
          mutation
            .querySelectorAll(
              "[class*=itemRowWrapper___]:not(.ingine-fee-percentage-processed) > [class*=itemRow___]:not([class*=grayedOut___]) [class^=priceInputWrapper___]"
            )
            .forEach((x) => {
              AddMarketFeeView(x);
              console.log("View listings: Adding Market fee view");
            });
        }
      }
    });
  });
  observer.observe(observerTarget, observerConfig);

  function AddMarketFeeView(itemPriceElement) {
    if (itemPriceElement.querySelector(".ingine-item-market-fee") != null) {
      return;
    }

    const wrapperParent = findParentByCondition(
      itemPriceElement,
      (el) => el.className.indexOf("itemRowWrapper___") > -1
    );

    wrapperParent.classList.add("ingine-fee-percentage-processed");

    const div = document.createElement("div");
    div.className = "ingine-market-fee-view";

    const priceInputField = itemPriceElement.querySelector(
      `input[placeholder="Price"]`
    );

    const quantityInputField = wrapperParent.querySelector(
      `input[placeholder="Qty"]`
    );
    const individualPriceSpan = document.createElement("span");
    const qtySpan = document.createElement("span");
    div.appendChild(individualPriceSpan);
    div.appendChild(qtySpan);
    wrapperParent.appendChild(div);

    let roundedUpValue;
    let totalValue;
    let qty;

    if (priceInputField && quantityInputField) {
      // This function handles both price and quantity updates
      const updateValues = () => {
        const price = priceInputField.value;
        const quantity = quantityInputField.value;

        // Update market fee (individual price)
        let inputtedValue = parseInt(price.replace(/,/g, ""));
        if (isNaN(inputtedValue)) {
          individualPriceSpan.innerHTML = "";
          totalValue = 0;
        } else {
          roundedUpValue = Math.ceil((inputtedValue * feePercentage) / 100);
          individualPriceSpan.innerHTML = `${Intl.NumberFormat("en-EN", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(roundedUpValue)}`;
        }

        // Update quantity and total value
        if (roundedUpValue === undefined) return;
        if (quantity === "") {
          qtySpan.innerHTML = "";
          return;
        }
        qty = quantity;
        totalValue = roundedUpValue * qty;
        qtySpan.innerHTML = `${qty}x = ${Intl.NumberFormat("en-EN", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }).format(totalValue)}`;
        // div.style.borderBottom = "1px solid #444";
        div.style.background = "#333";
        div.style.border = "1px solid #222";
      };

      // Initial update if there's already a value
      updateValues();

      priceInputField.addEventListener("input", updateValues);

      quantityInputField.addEventListener("input", updateValues);
    }
  }

  function findParentByCondition(element, conditionFn) {
    let currentElement = element;
    while (currentElement !== null) {
      if (conditionFn(currentElement)) {
        return currentElement;
      }
      currentElement = currentElement.parentElement;
    }
    return null;
  }

  function setPercentage() {
    let userInput = prompt("Enter Item Market Fee Percentage (default: 2%):");
    if (userInput !== null) {
      feePercentage = userInput;
      localStorage.setItem(FEE_PERCENTAGE_KEY, userInput);
    } else {
      console.error(
        "[BoycottPercentage] User cancelled the fee percentage input."
      );
    }
  }

  function getCurrentPage() {
    if (window.location.href.indexOf("#/addListing") > -1) {
      return pages.AddItems;
    } else if (window.location.href.indexOf("#/viewListing") > -1) {
      return pages.ViewItems;
    } else {
      return pages.Other;
    }
  }
})();
