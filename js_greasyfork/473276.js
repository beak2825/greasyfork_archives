// ==UserScript==
// @name         Strona zamówienia | IAI
// @namespace    http://butosklep.pl/panel/
// @version      1.2
// @description  Button allegro, lokalizacja produktów
// @author       Marcin
// @match        https://butosklep.pl/panel/orderd.php?id*
// @match        https://butosklep.iai-shop.com/panel/orderd.php?id*
// @match        https://butosklep.pl/panel/rma.php?action=edit&id_r=*
// @match        https://butosklep.iai-shop.com/panel/rma.php?action=edit&id_r=*
// @icon         https://butosklep.pl/gfx/pol/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473276/Strona%20zam%C3%B3wienia%20%7C%20IAI.user.js
// @updateURL https://update.greasyfork.org/scripts/473276/Strona%20zam%C3%B3wienia%20%7C%20IAI.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // --- CONFIG --- //

  const SELECTORS = {
    allegroIcon: "div.orderd-footer-content > div:nth-child(1) > table > tbody > tr:nth-child(4) > td.description > img",
    orderId: "div:nth-child(1) > table > tbody > tr:nth-child(4) > td.text > ul > li:nth-child(5)",
    shopLabel: "td.text > ul > li:nth-child(4) > a",
    buttonContainer: "table > tbody > tr:nth-child(1) > td > div > form > div > table > tbody > tr > td:nth-child(1)",
    deliveryAddress: "#delivAddr",
    productRows: "[id^='yui-rec']",
    productCodeCell: ".yui-dt0-col-code .yui-dt-liner",
    productCodeLink: "a.nohref",
    weightSpanInCodeCell: "span",
  };

  const SHOP_IDS = {
    www_butosklep_pl: 35297107,
    butosklep_outlet: 44626763,
    SmA_Butosklep: 107144881,
    big_star_shoes: 111839706,
  };

  function getSellerId() {
      const shopLabelText = document.querySelector(SELECTORS.shopLabel)?.textContent.trim().toLowerCase();
      return SHOP_IDS[shopLabelText] || null;
  }

  // --- ALLEGRO BUTTONS --- //

  function addAllegroOrderButton() {
    try {
      const isAllegroOrder = !!document.querySelector(SELECTORS.allegroIcon);
      if (!isAllegroOrder) return;

      const orderIdText = document.querySelector(SELECTORS.orderId)?.textContent;
      const orderAllegroID = orderIdText?.split(": ")[1];
      const sellerId = getSellerId();
      const buttonContainer = document.querySelector(SELECTORS.buttonContainer);

      if (orderAllegroID && sellerId && buttonContainer) {
        const allegroLink = `https://salescenter.allegro.com/orders/${orderAllegroID}?sellerId=${sellerId}`;
        const buttonHTML = `<td><a href="${allegroLink}" class="formbutton btn btn-sm btn-primary" target="_blank">Zamówienie na Allegro</a></td>`;
        buttonContainer.insertAdjacentHTML("afterend", buttonHTML);
      }
    } catch (error) {
      console.error("Błąd podczas tworzenia buttonu zamówienia Allegro:", error);
    }
  }


  function addAllegroReturnsButton() {
    try {
        const isAllegroOrder = !!document.querySelector(SELECTORS.allegroIcon);
        if (!isAllegroOrder) return;

        const deliveryInfo = document.querySelector(SELECTORS.deliveryAddress)?.textContent;
        const phoneMatch = deliveryInfo?.match(/(\d{9})\s*$/);
        const phoneNumber = phoneMatch ? phoneMatch[1] : null;

        const sellerId = getSellerId();
        const buttonContainer = document.querySelector(SELECTORS.buttonContainer);

        if (phoneNumber && sellerId && buttonContainer) {
            const fromDate = new Date();
            fromDate.setMonth(fromDate.getMonth() - 3); // 3 miesiące do tyłu
            fromDate.setHours(0, 0, 0, 0); // początek dnia

            const url = new URL('https://salescenter.allegro.com/returns');
            url.searchParams.set('sellerId', sellerId);
            url.searchParams.set('from', fromDate.toISOString());
            url.searchParams.set('search', phoneNumber);

            const buttonHTML = `<td><a href="${url.href}" class="formbutton btn btn-sm btn-success" target="_blank">Zwrot na Allegro</a></td>`;
            buttonContainer.insertAdjacentHTML("afterend", buttonHTML);
        }
    } catch (error) {
        console.error("Błąd podczas tworzenia buttonu zwrotu Allegro::", error);
    }
  }

  // --- PRODUCT LOCATION --- //

  async function displayProductLocations() {
    try {
      const productRows = document.querySelectorAll(SELECTORS.productRows);
      const productElementMap = new Map();

      productRows.forEach(row => {
        const codeLink = row.querySelector(`${SELECTORS.productCodeCell} ${SELECTORS.productCodeLink}`);
        if (codeLink) {
          let productCode = codeLink.textContent.trim().split("\n")[0];
          productCode = productCode.replace(/\(.+\)$/, "").trim();
          if (productCode) {
            productElementMap.set(productCode, row);
          }
        }
      });

      if (productElementMap.size === 0) return;

      const barcodesArray = [...productElementMap.keys()];
      const response = await fetch(`https://butosklep.cfolks.pl/descriptions_app/api/products/info/sizecode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcodes: barcodesArray }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const productsInfo = await response.json();
      if (!productsInfo || productsInfo.length === 0) return;

      productsInfo.forEach(product => {
        const parentElement = productElementMap.get(product.foundBy);
        if (!parentElement) return;

        const codeCell = parentElement.querySelector(SELECTORS.productCodeCell);
        const weightSpan = Array.from(codeCell.querySelectorAll(SELECTORS.weightSpanInCodeCell))
                                .find(span => span.textContent.includes("Waga:"));

        if (weightSpan) {
            const locationsHTML = product.stockLocations.map(loc => loc.location).join("<br>");
            const delivererHTML = product.delivererName ? `<br>Dostawca: ${product.delivererName}` : '';

            const locationElement = document.createElement("span");
            locationElement.innerHTML = `Lokalizacja:<br>${locationsHTML}${delivererHTML}`;

            const br1 = document.createElement("br");
            const br2 = document.createElement("br");

            weightSpan.insertAdjacentElement("afterend", locationElement);
            locationElement.insertAdjacentElement("beforebegin", br2);
            br2.insertAdjacentElement("beforebegin", br1);
        }
      });
    } catch (error) {
      console.error("Błąd podczas pobierania danych o lokalizacji:", error);
    }
  }

  // --- EXEC --- //
  addAllegroOrderButton();
  addAllegroReturnsButton();
  // Defer
  setTimeout(displayProductLocations, 2000);
})();