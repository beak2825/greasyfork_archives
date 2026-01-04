// ==UserScript==
// @name          Amazon Sendungsverfolgungsnummer als Barcode
// @description   Zeigt unter der Sendungsverfolgungsnummer einen Barcode an, um zum Beispiel diese Sendung einfacher in die Verfolgungsapp einzutragen.
// @include       https://www.amazon.de/progress-tracker/package*
// @include       https://www.amazon.de/gp/your-account/ship-track*
// @run-at        document-start
// @version       0.8
// @namespace     https://greasyfork.org/users/94906
// @require       https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/barcodes/JsBarcode.code128.min.js
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/411041/Amazon%20Sendungsverfolgungsnummer%20als%20Barcode.user.js
// @updateURL https://update.greasyfork.org/scripts/411041/Amazon%20Sendungsverfolgungsnummer%20als%20Barcode.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
  let innerText = document.getElementsByClassName("pt-delivery-card-trackingId")[0].innerText;
  let trackingNumber = innerText.substring(innerText.lastIndexOf(" ") + 1);
  let barcode = document.createElement("img");
  let a_row_div = document.createElement("div");
  a_row_div.setAttribute("class", "a-row");
  let grid_col = document.createElement("div");
  grid_col.setAttribute("class", "a-fixed-right-grid-col");
  grid_col.setAttribute("style", "float:left;");
  grid_col.appendChild(barcode);
  a_row_div.appendChild(grid_col);
  if (trackingNumber) {
    JsBarcode(barcode, trackingNumber);
    document.getElementById("carrierRelatedInfo-container").firstElementChild.appendChild(a_row_div);
  }
});
