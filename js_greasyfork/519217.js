// ==UserScript==
// @name         Items sorter with RW weapon filter
// @namespace    Nurv@IronNerd.me
// @description  Allows you to sort your items, by RW or price.
// @version      0.1
// @author       Nurv [669537]
// @license      Copyright IronNerd.me
// @match        https://www.torn.com/item.php*

// @downloadURL https://update.greasyfork.org/scripts/519217/Items%20sorter%20with%20RW%20weapon%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/519217/Items%20sorter%20with%20RW%20weapon%20filter.meta.js
// ==/UserScript==

(function () {
  "use strict";


  function init() {
    const titleBarEl = document.querySelector(".title-black.hospital-dark.top-round.scroll-dark[role='heading'][aria-level='5']");

    if (!titleBarEl) {
      console.error("Title bar element not found!");
      return;
    }

    if (document.getElementById("sort-default")) {
      console.log("Sorting buttons already added.");
      return;
    }

    const controlPanel = document.createElement("div");
    controlPanel.style.display = "inline-block";
    controlPanel.style.marginLeft = "20px";
    controlPanel.style.gap = "10px";
    controlPanel.style.verticalAlign = "middle";

    const buttonStyle = `
      padding: 8px 12px;
      cursor: pointer;
      color: white;
      background-color: #555;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      transition: background-color 0.3s;
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      #sort-default:hover { background-color: #777; }
      #sort-rw:hover { background-color: #888; }
      #sort-price:hover { background-color: #999; }

      #sort-default, #sort-rw, #sort-price {
        border: 1px solid #333;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      @media (max-width: 600px) {
        #sort-default, #sort-rw, #sort-price {
          font-size: 12px;
          padding: 6px 8px;
        }

        .control-panel {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    controlPanel.innerHTML = `
      <button id="sort-default" style="${buttonStyle}" aria-label="Sort items to default order">Default</button>
      <button id="sort-rw" style="${buttonStyle}" aria-label="Sort RW weapons">RW</button>
      <button id="sort-price" style="${buttonStyle}" aria-label="Sort items by price">Price</button>
    `;

    const itemsSorterIcon = titleBarEl.querySelector(".items-sorter");
    if (itemsSorterIcon && itemsSorterIcon.parentNode) {
      itemsSorterIcon.parentNode.appendChild(controlPanel);
      console.log("Sorting buttons added to the page.");
    } else {
      console.error("Items sorter icon's parent not found.");
      return;
    }

    const categoriesList = document.querySelector("#categoriesList");
    if (!categoriesList) {
      console.error("Categories list not found!");
      return;
    }

    let sortState = "default";
    let parentElement;
    let itemsOriginal;
    let posOriginal;
    let loadedAll = false;

    document.getElementById("sort-default").addEventListener("click", () => {
      resetSorting();
    });

    document.getElementById("sort-rw").addEventListener("click", async () => {
      await handleSorting("rw");
    });

    document.getElementById("sort-price").addEventListener("click", async () => {
      await handleSorting("price");
    });

    categoriesList.addEventListener("click", () => {
      handleTabChange();
    });

    async function handleSorting(type) {
      parentElement = document.querySelectorAll('[aria-hidden="false"]');

      if (type === "price" && !document.querySelector(".tt-item-price")) {
        alert(
          "Inventory Sorter requires Torn Tools to work properly. Make sure you install it before using this script!"
        );
        return;
      }

      if (!posOriginal && !loadedAll) {
        posOriginal = window.scrollY;
        await loadAllItems();
      }

      if (!itemsOriginal || sortState === "default") {
        cacheOriginalItems();
      }

      if (type === "rw") {
        sortItems(sortRW([...itemsOriginal]), parentElement);
        sortState = "rw";
      } else if (type === "price") {
        sortItems(sortPrices([...itemsOriginal]), parentElement);
      }

      localStorage.setItem("sortState", sortState);
    }

    function cacheOriginalItems() {
      itemsOriginal = Array.from(parentElement[0].childNodes).map((itemEl) => {
        const priceText = itemEl.querySelector(".tt-item-price")?.lastChild?.textContent || "0";
        const price = +priceText.replace(/[^0-9.-]+/g, "");

        const imageWrap = itemEl.querySelector(".image-wrap");
        const isRW =
          imageWrap &&
          (imageWrap.classList.contains("glow-yellow") ||
            imageWrap.classList.contains("glow-orange") ||
            imageWrap.classList.contains("glow-red"));

        let colorPriority = 4;
        if (imageWrap.classList.contains("glow-red")) colorPriority = 1;
        else if (imageWrap.classList.contains("glow-orange")) colorPriority = 2;
        else if (imageWrap.classList.contains("glow-yellow")) colorPriority = 3;

        return { element: itemEl, price, isRW, colorPriority };
      });
    }

    function sortRW(items) {
      return items.sort((a, b) => {
        if (a.isRW && !b.isRW) return -1;
        if (!a.isRW && b.isRW) return 1;
        return a.colorPriority - b.colorPriority;
      });
    }

    function sortPrices(items) {
      if (sortState === "price-descending") {
        sortState = "price-ascending";
        return items.sort((a, b) => a.price - b.price);
      } else {
        sortState = "price-descending";
        return items.sort((a, b) => b.price - a.price);
      }
    }

    function resetSorting() {
      if (itemsOriginal && parentElement) {
        sortItems(itemsOriginal, parentElement);
      }
      sortState = "default";
      localStorage.setItem("sortState", sortState);
      itemsOriginal = null;
      posOriginal = null;
      loadedAll = false;
    }

    function sortItems(_items, _parentElement) {
      _items.forEach((item) => _parentElement[0].appendChild(item.element));
    }

    function handleTabChange() {
      resetSorting();
    }

    async function loadAllItems() {
      const loadMoreDesc = document.querySelector("#load-more-items-desc");
      if (!loadMoreDesc) {
        console.error("#load-more-items-desc element not found!");
        return;
      }

      const text = loadMoreDesc.textContent;

      if (text.toLowerCase().includes("full")) {
        window.scroll(0, posOriginal);
        loadedAll = true;
        return;
      }

      if (text.toLowerCase().includes("load more")) {
        const lastItem = document.querySelector(".items-wrap").lastElementChild;
        if (lastItem) {
          lastItem.scrollIntoView();
          await new Promise((resolve) => setTimeout(resolve, 500));
          return loadAllItems();
        }
      }
    }

    const savedSortState = localStorage.getItem("sortState");
    if (savedSortState && savedSortState !== "default") {
      handleSorting(savedSortState);
    }

    if (window.matchMedia("(max-width: 600px)").matches) {
      titleBarEl.addEventListener("click", () => {
        if (sortState === "default") {
          handleSorting("rw");
        } else {
          resetSorting();
        }
      });
    }
  }

  const observer = new MutationObserver((mutations, obs) => {
    const titleBarEl = document.querySelector(".title-black.hospital-dark.top-round.scroll-dark[role='heading'][aria-level='5']");
    if (titleBarEl) {
      init();
      obs.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();