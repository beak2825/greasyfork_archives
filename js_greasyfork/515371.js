// ==UserScript==
// @name         TORN: Market Price Changer
// @namespace    dekleinekobini.private.marketpricechanger
// @version      1.0.1
// @author       DeKleineKobini [2114440]
// @description  Easily update market prices at a fixed rate.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/515371/TORN%3A%20Market%20Price%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/515371/TORN%3A%20Market%20Price%20Changer.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .mpc-button{cursor:pointer}.mpc-button:hover{background-color:#f006}@media screen and (max-width: 784px){[class*=viewListingWrapper___] [class*=imageWrapper___],[class*=viewListingWrapper___] [class*=checkboxWrapper___]{display:none}} ");

(function () {
  'use strict';

  function findByPartialClass(node, className, subSelector = "") {
    return node.querySelector(`[class*='${className}'] ${subSelector}`.trim());
  }
  function findAll(node, selector) {
    return [...node.querySelectorAll(selector)];
  }
  async function findDelayed(node, findElement, timeout) {
    return new Promise((resolve, reject) => {
      const initialElement = findElement();
      if (initialElement) {
        resolve(initialElement);
        return;
      }
      const observer = new MutationObserver(() => {
        const element = findElement();
        element && (clearTimeout(timeoutId), observer.disconnect(), resolve(element));
      }), timeoutId = setTimeout(() => {
        observer.disconnect(), reject("Failed to find the element within the acceptable timeout.");
      }, timeout);
      observer.observe(node, { childList: true, subtree: true });
    });
  }
  async function findBySelectorDelayed(node, selector, timeout = 5e3) {
    return findDelayed(node, () => node.querySelector(selector), timeout);
  }
  const PRICE_CHANGE_AMOUNT = 20;
  const isDesktop = window.innerWidth > 784;
  function onItemsListed() {
    const items = findAll(document.body, "[class*='itemRowWrapper___']:not(.mpc-changed)");
    if (items.length < 1) return;
    items.forEach((item) => {
      item.classList.add("mpc-changed");
      const title = findByPartialClass(item, "info___");
      if (!title) return;
      const decreaseButton = document.createElement("button");
      decreaseButton.classList.add("mpc-button");
      decreaseButton.textContent = isDesktop ? "undo" : "-";
      decreaseButton.addEventListener("click", (event) => onClickButton(event, item, "decrease"));
      title.appendChild(decreaseButton);
      const plusButton = document.createElement("button");
      plusButton.classList.add("mpc-button");
      plusButton.textContent = isDesktop ? "add" : "+";
      plusButton.addEventListener("click", (event) => onClickButton(event, item, "increase"));
      title.appendChild(plusButton);
    });
  }
  async function onPageChange() {
    if (!window.location.hash.startsWith("#/viewListing")) return;
    const view = findByPartialClass(document.body, "viewListingWrapper___");
    if (!view) return;
    await findBySelectorDelayed(view, "[class*='itemRow___'], [class*='noItems___']");
    if (findByPartialClass(document.body, "noItems___")) return;
    onItemsListed();
    new MutationObserver(onItemsListed).observe(view, { childList: true });
  }
  function onClickButton(event, item, action) {
    event.stopPropagation();
    const priceInput = item.querySelector("[class*='priceInputWrapper___'] .input-money:not([type='hidden'])");
    if (!priceInput) return;
    const oldPriceValue = priceInput.value.replace(/\D/g, "");
    if (!oldPriceValue) return;
    const oldPrice = parseInt(oldPriceValue, 10);
    let newPrice;
    switch (action) {
      case "increase":
        newPrice = Math.floor(oldPrice * (1 + PRICE_CHANGE_AMOUNT / 100));
        break;
      case "decrease":
        newPrice = Math.floor(oldPrice / (1 + PRICE_CHANGE_AMOUNT / 100));
        break;
      default:
        return;
    }
    priceInput.value = newPrice.toString();
    setTimeout(() => priceInput.dispatchEvent(new Event("input", { bubbles: true })), 0);
  }
  (() => {
    void onPageChange();
    window.addEventListener("hashchange", onPageChange);
  })();

})();