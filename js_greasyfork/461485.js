// ==UserScript==
// @name         Discogs - Sort by Total Price in Marketplace
// @namespace    https://greasyfork.org/en/scripts/461485
// @version      2.1
// @description  Sort by the italicized 'total' price on a Discogs release page instead of pre-shipping price
// @author       Jon Uleis (@MovingToTheSun)
// @match        https://www.discogs.com/*sell*/*
// @match        https://www.discogs.com/*shop*/*
// @icon         https://www.discogs.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461485/Discogs%20-%20Sort%20by%20Total%20Price%20in%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/461485/Discogs%20-%20Sort%20by%20Total%20Price%20in%20Marketplace.meta.js
// ==/UserScript==
/*jshint esversion: 11 */

(function () {
  "use strict";

  const isShopPage = window.location.pathname.includes("/shop/");
  const isSellPage = window.location.pathname.includes("/sell/");
  const UNAVAILABLE_PRICE = 999999;

  // /sell/ page logic
  if (isSellPage) {
    function tableSort() {
      const priceSort = document.querySelector(
        ".price_header .sortable_link_selected"
      );
      if (!priceSort) return;

      const ascending = priceSort.title.includes("ascending");
      const rows = Array.from(document.querySelectorAll("tr[data-release-id]"));

      rows.sort((rowA, rowB) => {
        const priceA = getRowPrice(rowA, ascending);
        const priceB = getRowPrice(rowB, ascending);
        return ascending ? priceA - priceB : priceB - priceA;
      });

      rows.forEach(row => row.parentNode.appendChild(row));

      const headerText = document.querySelector(".price_header .link-text");
      if (headerText) {
        headerText.innerText = "Total Price";
      }
    }

    function getRowPrice(row, ascending) {
      const price =
        row.querySelector(".converted_price") || row.querySelector(".price");
      const hasAddToCart = row.querySelector(".item_add_to_cart .button");
      const weight = hasAddToCart || !ascending ? 0 : UNAVAILABLE_PRICE;
      return parseFloat(price.textContent.replace(/[^0-9]/g, "")) + weight;
    }

    const pjaxContainer = document.querySelector("#pjax_container");
    if (pjaxContainer) {
      const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList" && mutation.addedNodes.length) {
            const hasTableNodes = Array.from(mutation.addedNodes).some(
              node => node.nodeName === "TBODY" || node.nodeName === "TABLE"
            );
            if (hasTableNodes) {
              tableSort();
            }
          }
        }
      });
      observer.observe(pjaxContainer, { subtree: true, childList: true });
    }

    tableSort();
  }

  // /shop/ page logic
  if (isShopPage) {
    function detectSortOrder() {
      const sortDropdowns = document.querySelectorAll("select.brand-select");
      for (const dropdown of sortDropdowns) {
        const hasPrice = Array.from(dropdown.options).some(
          opt => opt.text === "Price Lowest" || opt.text === "Price Highest"
        );
        if (hasPrice) {
          const selectedText = dropdown.options[dropdown.selectedIndex]?.text;
          if (selectedText === "Price Lowest") return "asc";
          if (selectedText === "Price Highest") return "desc";
        }
      }
      return null;
    }

    let isSorting = false;
    let observer;
    let rootContainer;

    function shopSort() {
      if (isSorting) return;
      isSorting = true;

      if (observer) observer.disconnect();

      const sortOrder = detectSortOrder();
      if (!sortOrder) {
        if (observer && rootContainer) {
          observer.observe(rootContainer, { subtree: true, childList: true });
        }
        isSorting = false;
        return;
      }

      let allItemElements = Array.from(
        document.querySelectorAll('[data-test="list-item-desktop"]')
      ).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
      if (allItemElements.length === 0) {
        allItemElements = Array.from(
          document.querySelectorAll("[data-itemid]")
        );
      }
      if (allItemElements.length === 0) {
        if (observer && rootContainer) {
          observer.observe(rootContainer, { subtree: true, childList: true });
        }
        isSorting = false;
        return;
      }

      const commonParent = findCommonParent(allItemElements);
      if (!commonParent) {
        if (observer && rootContainer) {
          observer.observe(rootContainer, { subtree: true, childList: true });
        }
        isSorting = false;
        return;
      }

      const itemContainers = buildItemContainers(
        allItemElements,
        commonParent,
        sortOrder
      );
      if (itemContainers.length < 2) {
        if (observer && rootContainer) {
          observer.observe(rootContainer, { subtree: true, childList: true });
        }
        isSorting = false;
        return;
      }

      itemContainers.sort((a, b) => {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      });

      try {
        itemContainers.forEach(item => {
          if (item.container.parentElement === commonParent) {
            commonParent.appendChild(item.container);
          }
        });
      } catch (e) {
        if (observer && rootContainer) {
          observer.observe(rootContainer, { subtree: true, childList: true });
        }
        isSorting = false;
        return;
      }

      updateHeaderText();

      if (observer && rootContainer) {
        observer.observe(rootContainer, { subtree: true, childList: true });
      }
      isSorting = false;
    }

    function findCommonParent(elements) {
      let parent = elements[0];
      let maxLevels = 15;

      while (maxLevels-- > 0 && parent) {
        parent = parent.parentElement;
        if (!parent) break;

        const containsAll = elements.every(item => parent.contains(item));
        if (containsAll && parent.children.length >= elements.length) {
          return parent;
        }
      }
      return null;
    }

    function buildItemContainers(itemElements, commonParent, sortOrder) {
      const containers = [];
      const seen = new Set();

      for (const itemElement of itemElements) {
        let container = itemElement;
        while (container && container.parentElement !== commonParent) {
          container = container.parentElement;
        }

        if (container && !seen.has(container)) {
          seen.add(container);
          const price = getItemPrice(itemElement, sortOrder);
          containers.push({ container, price });
        }
      }

      return containers;
    }

    function getItemPrice(itemElement, sortOrder) {
      const italicEls = itemElement.querySelectorAll(".italic");
      const totalPriceEl = Array.from(italicEls).find(el =>
        /total/.test(el.textContent)
      );
      const isUnavailable = /unavailable in/i.test(itemElement.textContent);

      let priceText = null;

      if (totalPriceEl) {
        priceText = totalPriceEl.textContent;
      } else {
        const italicEl = Array.from(italicEls).find(el =>
          /[\d,]+\.?\d*/.test(el.textContent)
        );
        if (italicEl) {
          priceText = italicEl.textContent;
        } else {
          const boldElements = itemElement.querySelectorAll(".font-bold");
          for (const el of boldElements) {
            if (/[\d,]+\.?\d*/.test(el.textContent)) {
              priceText = el.textContent;
              break;
            }
          }
        }
      }

      if (!priceText) {
        return sortOrder === "asc" ? UNAVAILABLE_PRICE : 0;
      }

      const priceMatch = priceText.match(/([\d,]+\.?\d*)/);
      const price = priceMatch
        ? parseFloat(priceMatch[1].replace(/,/g, ""))
        : UNAVAILABLE_PRICE;

      if (isUnavailable && sortOrder === "asc") {
        return UNAVAILABLE_PRICE;
      }

      return price;
    }

    function updateHeaderText() {
      const priceHeaderButton = document.querySelector(
        ".justify-self-end button"
      );
      if (priceHeaderButton) {
        for (const node of priceHeaderButton.childNodes) {
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim() === "Price"
          ) {
            node.textContent = "Total Price";
            break;
          }
        }
      }
    }

    let sortTimeout;
    function debouncedSort(mutations) {
      const isItemMutation = mutations.some(mutation => {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (
              node.matches?.(
                '[data-test="list-item-desktop"], [data-itemid]'
              ) ||
              node.querySelector?.(
                '[data-test="list-item-desktop"], [data-itemid]'
              )
            ) {
              return true;
            }
          }
        }
        return false;
      });
      if (!isItemMutation) return;

      clearTimeout(sortTimeout);
      sortTimeout = setTimeout(shopSort, 100);
    }

    rootContainer = document.querySelector("#root");
    if (rootContainer) {
      observer = new MutationObserver(debouncedSort);
      observer.observe(rootContainer, { subtree: true, childList: true });
    }
  }
})();
