// ==UserScript==
// @name         inventory-max-button
// @namespace    torn.inventory.boosters.maxbutton
// @version      0.1
// @description  Adds a "Max" button to fill qty in trade
// @author       Snake
// @match        https://www.torn.com/trade.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/537170/inventory-max-button.user.js
// @updateURL https://update.greasyfork.org/scripts/537170/inventory-max-button.meta.js
// ==/UserScript==

function addMaxButtons() {
  const interval = setInterval(() => {
    const rows = document.querySelectorAll("li.clearfix.no-mods");

    // Wait until inventory is fully loaded
    if (rows.length === 0) return;

    rows.forEach((row) => {
      // Skip if untradable
      if (row.textContent.includes("Untradable")) return;

      // Avoid duplicating buttons
      if (row.querySelector(".max-btn")) return;

      const tornToolsPrices = row.querySelector(".tt-item-price")
      if (tornToolsPrices) tornToolsPrices.right = "70 px";

      const item = row.querySelector(".title-wrap")
      const qtyInput = row.querySelector(".amount input");
      if (!qtyInput) return;
        console.log(qtyInput);

      const itemQtyMatch = row.innerText.match(/x\s*(\d+)/i);
      const itemQty = itemQtyMatch ? parseInt(itemQtyMatch[1], 10) : null;

      if (!itemQty) return;

      const maxBtn = document.createElement("button");
      maxBtn.textContent = "Max";
      maxBtn.className = "torn-btn max-btn";
      maxBtn.float = "right";
      maxBtn.position = "absolute";
      maxBtn.right = 0;

      maxBtn.addEventListener("click", () => {
        event.stopPropagation();
        event.preventDefault();
        qtyInput.value = itemQty;
        qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
      });

      item.appendChild(maxBtn);
    });

    clearInterval(interval);
  }, 500);
}

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .max-btn {
      float: right;
      position: absolute;
      right: 0px;
      padding: 2px 5px;
    }
  `;
  document.head.appendChild(style);
}

injectStyles();
addMaxButtons();