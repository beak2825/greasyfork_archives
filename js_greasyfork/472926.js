// ==UserScript==
// @name         Fifa resale ticket snatcher
// @namespace    fuck.you.fifa
// @version      1
// @description  Refreshes through fifa resale page and puts in your cart any Valid ticket available
// @author       fuckfifaforreal
// @match        https://resale-aus.fwwc23.tickets.fifa.com/secured/selection/resale*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fifa.com
// @grant        none
// @run-at       document-end
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/472926/Fifa%20resale%20ticket%20snatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/472926/Fifa%20resale%20ticket%20snatcher.meta.js
// ==/UserScript==
(function () {
  "use strict";
  
  const TARGET_TARIFF = "Adult"; // Leave this be or change at your own risk
  const TARGET_CATEGORY = ""; // Leave blank to target any ticket or specify a category, e.g.: "Category 1"
  const TARGET_TICKETS_QTY = 2; // Edit this to change the quantity of tickets to select (keep in mind you won't be able to buy more than 10 per game)
  const REFRESH_INTERVAL = 2000; // Edit this to chsnge refresh interval (in milliseconds e.g.: 1000 is 1 second)

  function reload(message = "") {
    if (message) {
      console.log(message);
    }
    setTimeout(() => {
      window.location.reload();
    }, REFRESH_INTERVAL);
  }

  function isTicketValid(row) {
    const category = row.querySelector(".seatCat");
    const tariff = row.querySelector(".tariff");

    // Check tariff 
    const isValidTariff =
      tariff && tariff.innerText.trim() === TARGET_TARIFF;

    // Check category if specified
    if (TARGET_CATEGORY) {
      return (
        isValidTariff &&
        category &&
        category.innerText.trim() === TARGET_CATEGORY
      );
    }

    return isValidTariff;
  }

  function main() {
    const rows = document.querySelectorAll("tr");
    
    // If no rows are found, reload page
    if (!rows || !rows.length) {
      reload("No elements found");
      return;
    }

    // Check each row for valid tickets
    let selectedTicketsQuantity = 0;
    for (
      let i = 0;
      i < rows.length - 1 && selectedTicketsQuantity < TARGET_TICKETS_QTY;
      i++
    ) {
      const row = rows[i];
      if (isTicketValid(row)) {
        row.click();
        selectedTicketsQuantity++;
      }
    }

    // If no tickets are found, reload page
    if (selectedTicketsQuantity === 0) {
      reload("No valid tickets found");
      return;
    }

    // Click the booking button
    const bookButton = document.querySelector("#book");
    if (!bookButton) {
      reload("No buy button found");
      return;
    } else {
      bookButton.click();
    }
  }

  setTimeout(() => {
    main();
  }, 500); // Initial delay to let the tickets load
})();
