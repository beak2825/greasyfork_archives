// ==UserScript==
// @name         Docked Panel on Product List
// @namespace    http://butosklep.pl/
// @version      0.9
// @description  Add a docked panel with a button to retrieve product IDs
// @author       Marcin
// @match        https://butosklep.pl/panel/products-list.php?*
// @match        https://butosklep.iai-shop.com/panel/products-list.php?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496243/Docked%20Panel%20on%20Product%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/496243/Docked%20Panel%20on%20Product%20List.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const stylesCSS = `
       .yui-dt-paginator {
          padding-bottom: 35px !important;
       }
       #dockedPanel {
          position: fixed;
          bottom: 38px;
          left: 0;
          width: 100%;
          background-color: var(--gray--light);
          color: white;
          text-align: center;
          padding: 5px;
          box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
          z-index: 997;
        }

        .panelButton {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 16px;
          margin: 0 5px;
        }

        .panelButton:hover {
          background-color: #0056b3;
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = stylesCSS;
  document.head.appendChild(styleSheet);

  const dockedPanel = `
      <div id="dockedPanel">
        <button id="getProductIdsButton" class="panelButton">Skopiuj ID</button>
        <button id="openProductEditLinksButton" class="panelButton">Otwórz edycje towarów</button>
        <button id="unhideProducts" class="panelButton">Odkryj towary</button>
        <button id="hideProducts" class="panelButton">Ukryj towary</button>
      </div>
    `;

  const panelDiv = document.createElement("div");
  panelDiv.innerHTML = dockedPanel;

  const targetElement = document.getElementById("bottom_menu_products");
  if (targetElement) {
    document.body.appendChild(panelDiv);
  } else {
    console.error("Target element not found");
  }

  function getProductIds() {
    const checkedProducts = IAI.Table.checkedID["products"];
    const productIds = Object.keys(checkedProducts);

    if (productIds.length === 0) {
      console.log("Nie zaznaczono żadnych produktów");
      return;
    }

    const productIdsText = productIds.join("\n");
    navigator.clipboard
      .writeText(productIdsText)
      .then(() => {})
      .catch((err) => {
        console.error("Nie udało się skopiować ID: ", err);
      });
  }

  function openProductEditLinks() {
    const checkedProducts = IAI.Table.checkedID["products"];
    const productIds = Object.keys(checkedProducts);
    console.log(productIds);
    if (productIds.length === 0) {
      console.log("Nie zaznaczono żadnych produktów");
      return;
    }

    let openedLinks = 0;
    productIds.forEach((productId) => {
      let link = document.querySelector(
        `a[href*="product-edit.php?idt=${productId}"]`
      );
      let url = link.href;
      url += "#images";
      window.open(url, "_blank");
      openedLinks++;
    });

    if (openedLinks === 0) {
      console.log("Nie znaleziono linków do otwarcia");
    }
  }

  function hideOrUnhideProducts(visible) {
    const checkedProducts = IAI.Table.checkedID["products"];
    const productIds = Object.keys(checkedProducts);

    if (productIds.length === 0) {
      console.log("Nie zaznaczono żadnych produktów");
      return;
    }

    const params = new URLSearchParams();
    params.append("visible", visible); // "y" or "n"
    productIds.forEach((id) => params.append("elements[]", id));

    const url =
      "/panel/ajax/group-edit.php?editType=Products&view=ajax_content&action=save&featureToEdit=visible";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const getProductIdsButton = document.getElementById("getProductIdsButton");
  if (getProductIdsButton) {
    getProductIdsButton.addEventListener("click", getProductIds);
  } else {
    console.warn("getProductIdsButton not found");
  }

  const openProductEditLinksButton = document.getElementById(
    "openProductEditLinksButton"
  );
  if (openProductEditLinksButton) {
    openProductEditLinksButton.addEventListener("click", openProductEditLinks);
  } else {
    console.warn("openProductEditLinksButton not found");
  }

  const unhideProductsButton = document.getElementById("unhideProducts");
  if (unhideProductsButton) {
    unhideProductsButton.addEventListener("click", () =>
      hideOrUnhideProducts("y")
    );
  } else {
    console.warn("unhideProductsButton not found");
  }

  const hideProductsButton = document.getElementById("hideProducts");
  if (hideProductsButton) {
    hideProductsButton.addEventListener("click", () =>
      hideOrUnhideProducts("n")
    );
  } else {
    console.warn("hideProductsButton not found");
  }
})();
