// ==UserScript==
// @name         market-qol.zed
// @namespace    market-qol.zed.zero.nao
// @version      0.3
// @description  market-qol updates for zed.city
// @author       root
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/526911/market-qolzed.user.js
// @updateURL https://update.greasyfork.org/scripts/526911/market-qolzed.meta.js
// ==/UserScript==

if (!localStorage.getItem("root-market-data")) {
  localStorage.setItem("root-market-data", JSON.stringify({}));
}

let market_data = JSON.parse(localStorage.getItem("root-market-data"));

let store_items = {};
let current_inventory = {};

const ITEM_LIMIT = 360;
let limit;

(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._interceptedURL = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    this.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        try {
          const response = JSON.parse(this.responseText);
          const eventData = { url: this._interceptedURL, response };

          // Dispatch a custom event for other scripts
          window.dispatchEvent(
            new CustomEvent("xhrIntercepted", { detail: eventData }),
          );
        } catch (e) {
          console.error("Error processing intercepted response:", e);
        }
      }
    });

    return originalSend.apply(this, arguments);
  };
})();

window.addEventListener("xhrIntercepted", function (e) {
  const { url, response } = e.detail;
  if (url.includes("getMarket")) {
    saveMarketPrices(response);
  } else if (url.includes("store_id")) {
    handleNPCStore(response);
  }
});

function sendNotification(title, body, link) {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification(title, {
          body: body,
          icon: "https://www.google.com/s2/favicons?sz=64&domain=zed.city",
        });
        notification.onclick = () => {
          window.open(link);
          notification.close();
        };
      }
    });
  }
}

function insertPrice() {
  if ($(".q-py-sm > div:nth-child(1)").length == 0) {
    setTimeout(insertPrice, 100);
    return;
  }

  const itemName = document.querySelector(
    ".q-py-sm > div:nth-child(1)",
  ).textContent;
  if (market_data[itemName]) {
    const price = market_data[itemName];
    const priceElementParet = document.querySelector(".zed-money-input");

    if (!priceElementParet) {
      setTimeout(insertPrice, 300);
      return;
    }
    const priceElement = priceElementParet.querySelector("input");

    if (!priceElement) {
      setTimeout(insertPrice, 100);
      return;
    }
    priceElement.value = price;
    priceElement.dispatchEvent(new Event("input", { bubbles: true }));
    $(
      ".zed-money-input > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > i:nth-child(1)",
    ).css("color", "#da5aec");
  }
}

function insertQty() {
  const subtextElement = document.querySelector(".q-mb-md > div:nth-child(1)");
  if (!subtextElement) return;
  const quantityElement = subtextElement.parentElement.querySelector("input");
  const itemName = document.querySelector(
    ".small-modal > div:nth-child(1)",
  ).textContent;
  const quantity = Math.min(ITEM_LIMIT - limit, store_items[itemName] || 0);
  if (quantityElement) {
    const isBuying = document
      .querySelector(
        "div.text-center:nth-child(2) > button:nth-child(1) > span:nth-child(2) > span:nth-child(1)",
      )
      .textContent.includes("Buy");
    if (isBuying) {
      quantityElement.value = quantity;
    } else {
      const inventoryQuantity = current_inventory[itemName] || 0;
      quantityElement.value = inventoryQuantity;
    }
    quantityElement.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    setTimeout(insertQty, 300);
  }
}

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

// Store element states
const elementStates = new Map();

// Configure the elements you want to watch
const elementsToWatch = [];

// Function to check a single element
function checkElement(config) {
  const url = config.url;
  if (!window.location.href.includes(url)) {
    return;
  }

  const element = document.querySelector(config.selector);
  const isFound = element?.textContent === config.text;
  const wasPresent = elementStates.get(config.selector);

  if (isFound && !wasPresent) {
    // Element has appeared
    elementStates.set(config.selector, true);
    config.callback();
  } else if (!isFound && wasPresent) {
    // Element has disappeared
    console.log(config.text + " disappeared!");
    elementStates.set(config.selector, false);
  }
}
//
// Create observer that checks all elements
const observer = new MutationObserver(() => {
  elementsToWatch.forEach(checkElement);
});

// Start observing
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// Example of how to add a new element to watch later:
function addElementToWatch(selector, text, url, callback) {
  elementsToWatch.push({ selector, text, url, callback });
  elementStates.set(selector, false);
}

// market price
addElementToWatch(".title div", "Create Listing", "/market-listings", () => {
  insertPrice();
});

// store qty
addElementToWatch(
  ".text-negative > span:nth-child(2) > span:nth-child(1)",
  "Cancel",
  "store/",
  () => {
    console.log("store qty appeared!");
    insertQty();
  },
);

function saveMarketPrices(response) {
  for (const item of response.items) {
    const name = item.name;
    const price = item.market_price;
    market_data[name] = price;
  }
  localStorage.setItem("root-market-data", JSON.stringify(market_data));
}

function handleNPCStore(response) {
  limit = response.limits?.limit || 0;
  let limitLeft = response.limits?.limit_left || 0;
  limit = limit - limitLeft;
  console.log(limit);

  for (const item of response.storeItems) {
    const name = item.name;
    const quantity = item.quantity;
    store_items[name] = quantity;
  }
  for (const item of response.userItems) {
    const name = item.name;
    const quantity = item.quantity;
    current_inventory[name] = quantity;
  }
}
