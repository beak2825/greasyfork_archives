// ==UserScript==
// @name        Filter keywords on Azure
// @namespace   Violentmonkey Scripts
// @match       https://portal.azure.com/*
// @grant       none
// @version     1.0
// @author      chaoscreater
// @description 1/16/2024, 8:12:42 PM
// @downloadURL https://update.greasyfork.org/scripts/486229/Filter%20keywords%20on%20Azure.user.js
// @updateURL https://update.greasyfork.org/scripts/486229/Filter%20keywords%20on%20Azure.meta.js
// ==/UserScript==

const getVisibleElements = (selector) =>
  [...document.querySelectorAll(selector)].filter((it) => it.checkVisibility());

// load for 5 seconds

const loadValues = ({ interval = 250, timeout = 5000 } = {}) => {
  return new Promise((resolve) => {
    let timer = null,
      stop = () => resolve(clearInterval(timer));

    timer = setInterval(() => {
      var $loadMores = getVisibleElements(".azc-grid-pageable-loadMoreContainer");

      for (let $loadMore of $loadMores) {
        if (!$loadMore.classList.contains("fxs-display-none")) {
          $loadMore?.click();
          return;
        }
      }

      stop();
    }, interval);

    setTimeout(stop, timeout);
  });
};

const getValueRows = () =>
  getVisibleElements(".azc-grid-full").flatMap((it) => [...it.querySelectorAll("tbody > tr")]);

const filterValues = (term) => {
  return getValueRows().filter((tr) => {
    const matched = new RegExp(term, "gi").test(tr.innerText);
    tr.style.display = matched ? "" : "none";
    return matched;
  });
};

const resetFilter = () => {
  getValueRows().forEach((tr) => {
    tr.style.display = "";
  });
};

const loadAndFilterValues = async (term) => {
  await loadValues();
  filterValues(term);
};

// Modified keybinding for SHIFT+F and CTRL+SHIFT+F to be case-insensitive
document.addEventListener("keydown", async (event) => {
  if (event.ctrlKey && event.shiftKey && event.key.toUpperCase() === "F") {
    const term = prompt("Enter keyword to filter on and load more:");
    if (term !== null) {
      await loadValues();
      loadAndFilterValues(term);
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.shiftKey && !event.ctrlKey && event.key.toUpperCase() === "F") {
    const term = prompt("Enter keyword to filter on:");
    if (term !== null) {
      filterValues(term);
    }
  }
});

const actions = {
  "L": function LoadMore() {
    loadValues();
  },
  "Z": function ResetLoadMore() {
    resetFilter();
  }
};

// Adjusted for case-insensitive action keys
document.body.addEventListener("keyup", ev => {
  if (ev.ctrlKey) {
    if (ev.key === '/') {
      alert(`Shift + F : Filter by keyword\nCTRL+Shift + F : Filter by keyword and click on Load More\n` + `CTRL+SHIFT+ L (hold CTRL+SHIFT while releasing L) to click on Load More\nCTRL+Shift + Z (hold CTRL+SHIFT while releasing Z) : Reset filter\n` + '\n\nGreat for checking Activity Logs, Sign-in logs or blobs in a Storage account container etc...');
    } else if (ev.shiftKey) {
      const action = actions[ev.key.toUpperCase()]; // Convert ev.key to uppercase for action lookup
      action && action();
    }
  }
});
