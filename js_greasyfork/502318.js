// ==UserScript==
// @name        Target Invoice Summary
// @namespace   nikhilweee
// @match       https://www.target.com/orders/*/invoices/*
// @grant       none
// @version     1.0
// @author      nikhilweee
// @description Summarize Target Invoice
// @icon        https://www.target.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/502318/Target%20Invoice%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/502318/Target%20Invoice%20Summary.meta.js
// ==/UserScript==

function allElementsLoaded() {
  const detailsCards = document.querySelectorAll(
    '[data-test="invoice-details-card"]'
  );
  return detailsCards.length > 0;
}

function runScriptWhenReady() {
  if (allElementsLoaded()) {
    const detailsCards = document.querySelectorAll(
      '[data-test="invoice-details-card"]'
    );
    const table = document.createElement("table");
    let totalQuantity = 0;
    table.style = "width: 100%; text-align: left;";
    table.innerHTML = "<th>Price</th><th>Item</th>";

    detailsCards.forEach((card) => {
      const boldElements = Array.from(card.querySelectorAll("b"));
      const [itemName, quantity, , , , , , itemPrice] = boldElements.map(
        (el) => el?.textContent.trim() || ""
      );
      const [_, itemNameShort] = itemName.split(" - ");
      totalQuantity += parseInt(quantity);
      const row = table.insertRow();
      row.innerHTML = `<td>${itemPrice}</td><td>(${quantity}) ${itemNameShort}</td>`;
    });

    const invoiceTotal =
      document.querySelector("div.h-text-lg p")?.textContent.trim() || "";
    const invoiceRow = table.insertRow();
    invoiceRow.innerHTML = `<th>${invoiceTotal}</th><th>(${totalQuantity}) Total</th>`;

    const invoiceMetaElement = document.querySelector(
      '[data-test="invoice-meta"]'
    );
    invoiceMetaElement.insertAdjacentElement("afterend", table);
  } else {
    setTimeout(runScriptWhenReady, 100);
  }
}

window.addEventListener("load", runScriptWhenReady);
