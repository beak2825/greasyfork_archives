// ==UserScript==
// @name           Ozon.ru show barcode on order page
// @name:ru        Ozon.ru баркод на странице заказа
// @namespace      nikitalocalhost
// @description    Script to show order barcode on Ozon.ru
// @description:ru Скрипт чтобы показать баркод на странице заказа в Ozon.ru
// @match          https://www.ozon.ru/my/orderdetails/*
// @match          https://www.ozon.ru/my/orderlist/
// @grant          none
// @version        2.3
// @author         -
// @description    11/18/2024, 5:39:19 PM
// @run-at         document-idle
// @require        https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/barcodes/JsBarcode.code128.min.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/517918/Ozonru%20show%20barcode%20on%20order%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/517918/Ozonru%20show%20barcode%20on%20order%20page.meta.js
// ==/UserScript==

setTimeout(function() {
  const receiptCodeEl = document.querySelector('[data-widget="receiptCode"]');
  if (!receiptCodeEl) {
    console.error("receiptCode element is not found");
    return;
  }

  let codeEl = null;

  if (location.pathname.includes("orderdetails")) {
    codeEl = receiptCodeEl.querySelector('span[class="tsHeadline600Large"]');
  } else {
    codeEl = receiptCodeEl.firstChild.querySelector("span");
  }
  if (!codeEl) {
    console.error("receiptCode > span (code) element is not found");
    return;
  }

  const codeText = codeEl.textContent;
  const [_match, orderFirst, orderSecond, secret] = codeText.match(/(\d+)\s+(\d+)\s+\*\s+(\d+)/);
  const code = [orderFirst, orderSecond, "*", secret].join("");
  const node = document.createElement("canvas");
  node.setAttribute("id", "barcode");
  receiptCodeEl.prepend(document.createElement("br"));
  receiptCodeEl.prepend(node);

  JsBarcode("#barcode", code);
}, 5000)