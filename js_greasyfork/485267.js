// ==UserScript==
// @name         Balanz ccl new web
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CCL = (mejor venta en pesos) / (mejor compra cable). Escribe el resultado en la columna #3
// @author       https://github.com/jose-velarde
// @match        https://clientes.balanz.com/*
// @grant        none
// @run-at       context-menu
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/485267/Balanz%20ccl%20new%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/485267/Balanz%20ccl%20new%20web.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function parseArNumber(raw) {
    if (!raw) return NaN;
    let s = String(raw).trim();

    // Por si viene "40172 × 998,70"
    if (s.includes('×')) s = s.split('×')[1].trim();

    // Quitar separador de miles y pasar coma a punto
    s = s.replace(/\./g, '').replace(',', '.');

    // Limpiar cualquier cosa no numérica (por si hay "usd", etc.)
    s = s.replace(/[^0-9.]/g, '');

    return parseFloat(s);
  }

  const rows = document.querySelectorAll('tbody tr.d-flex.d-md-table-row.ng-star-inserted');

  let compraCable = NaN;
  let ventaPesos = NaN;

  for (const row of rows) {
    const t = row.querySelector('td:nth-child(2) a span')?.textContent?.trim();
    if (!t) continue;

    // precio "Vender" (izquierda) y "Comprar" (derecha)
    const sellPriceText = row.querySelector('app-button-actions .btn-outline-danger')  // botón Vender
      ?.closest('div.w-50')?.querySelector('b.exchange-lower')?.textContent;

    const buyPriceText = row.querySelector('app-button-actions .btn-outline-success') // botón Comprar
      ?.closest('div.w-50')?.querySelector('b.exchange-upper')?.textContent;

    const venta = parseArNumber(sellPriceText);
    const compra = parseArNumber(buyPriceText);

    // dónde escribir el CCL (tu "ultCol")
    const outCell = row.querySelector('td:nth-child(3) div');

    if (t.endsWith('C')) {
      compraCable = compra;

      if (outCell && Number.isFinite(ventaPesos) && Number.isFinite(compraCable) && compraCable !== 0) {
        outCell.textContent = (ventaPesos / compraCable).toFixed(2);
      } else if (outCell) {
        outCell.textContent = '';
      }
    } else {
      ventaPesos = venta;
      if (outCell) outCell.textContent = '';
    }
  }
})();
