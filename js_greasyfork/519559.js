// ==UserScript==
// @name          Inventory Sorter according to QTY
// @namespace     https://greasyfork.org/en/
// @description   Allows you to sort your inventory by price or quantity in ascending/descending order
// @version       1.0.2
// @author        Unique
// @grant         none
// @match         https://www.torn.com/item.php
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519559/Inventory%20Sorter%20according%20to%20QTY.user.js
// @updateURL https://update.greasyfork.org/scripts/519559/Inventory%20Sorter%20according%20to%20QTY.meta.js
// ==/UserScript==
(function () {
  "use strict";
  const titleBarEl = document.querySelector(".title-black");
  const categoriesList = document.querySelector("#categoriesList");
  let sortState = "default";
  let sortType = "price"; // Added to track sorting type
  let parentElement;
  let itemsOriginal;
  let posOriginal;
  let loadedAll = false;

  // Create sorting buttons
  function createSortButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginBottom = '10px';

    // Price Sort Button
    const priceSortBtn = document.createElement('button');
    priceSortBtn.textContent = 'Sort by Price';
    priceSortBtn.style.padding = '5px 10px';
    priceSortBtn.addEventListener('click', () => {
      sortType = 'price';
      titleBarEl.click();
    });

    // Quantity Sort Button
    const quantitySortBtn = document.createElement('button');
    quantitySortBtn.textContent = 'Sort by Quantity';
    quantitySortBtn.style.padding = '5px 10px';
    quantitySortBtn.addEventListener('click', () => {
      sortType = 'quantity';
      titleBarEl.click();
    });

    buttonContainer.appendChild(priceSortBtn);
    buttonContainer.appendChild(quantitySortBtn);
    titleBarEl.insertAdjacentElement('afterend', buttonContainer);
  }

  titleBarEl.addEventListener("click", async (e) => {
    parentElement = document.querySelectorAll('[aria-hidden="false"]');
    if (e.target.closest("#items_search")) return;
    if (!document.querySelector(".tt-item-price")) {
      alert(
        "Inventory Sorter requires Torn Tools to work properly. Make sure you install it before using this script!"
      );
      return;
    }
    if (!posOriginal && !loadedAll) {
      posOriginal = window.scrollY;
      await loadAllItems();
    }
    if (sortState === "default") {
      itemsOriginal = Array.from(parentElement[0].childNodes).map((itemEl) => {
        const price = +itemEl
          .querySelector(".tt-item-price")
          .lastChild.textContent.replace(/[^0-9.-]+/g, "");

        // Extract quantity
        const quantityEl = itemEl.querySelector('.qty');
        const quantity = quantityEl ? +quantityEl.textContent.replace(/[^0-9]/g, "") : 0;

        return {
          element: itemEl,
          price,
          quantity
        };
      });
    }
    sortItems(sortValues([...itemsOriginal]), parentElement);
  });

  categoriesList.addEventListener("click", () => {
    handleTabChange();
  });

  const sortValues = function (items) {
    if (sortState === "default") {
      sortState = "descending";
      return items.sort((a, b) =>
        sortType === 'price'
          ? b.price - a.price
          : b.quantity - a.quantity
      );
    } else if (sortState === "descending") {
      sortState = "ascending";
      return items.sort((a, b) =>
        sortType === 'price'
          ? a.price - b.price
          : a.quantity - b.quantity
      );
    } else if (sortState === "ascending") {
      sortState = "default";
      return [...itemsOriginal];
    }
  };

  const handleTabChange = function () {
    sortItems(itemsOriginal, parentElement);
    sortState = "default";
    itemsOriginal = null;
    posOriginal = null;
    loadedAll = false;
  };

  const sortItems = function (_items, _parentElement) {
    _items.forEach((item) => _parentElement[0].appendChild(item.element));
  };

  const loadAllItems = async function () {
    const text = document.querySelector("#load-more-items-desc").textContent;
    if (text.toLowerCase().includes("full")) {
      window.scroll(0, posOriginal);
      loadedAll = true;
      return;
    }
    if (text.toLowerCase().includes("load more")) {
      document.querySelector(".items-wrap").lastElementChild.scrollIntoView();
      await new Promise((resolve) => setTimeout(resolve, 500));
      return loadAllItems();
    }
  };

  // Initialize script
  function init() {
    // Wait for the page to load
    const checkExist = setInterval(() => {
      const titleBar = document.querySelector(".title-black");
      if (titleBar) {
        clearInterval(checkExist);
        createSortButtons();
      }
    }, 100);
  }

  // Run initialization
  init();
})();