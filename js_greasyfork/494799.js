// ==UserScript==
// @name         arcteryx inventory check
// @namespace    http://tampermonkey.net/
// @version      2024-05-09
// @description  check the inventory of the product
// @author       You
// @match        https://*.arcteryx.com/*/*/shop/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arcteryx.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494799/arcteryx%20inventory%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/494799/arcteryx%20inventory%20check.meta.js
// ==/UserScript==

function printInventory(product) {
  // console.log(product.variants);
  // console.log(product.colourOptions);
  // console.log(product.sizeOptions);

  const result = {};

  for (const c of product.colourOptions.options) {
    result[c.label] = {};
    for (const s of product.sizeOptions.options) {
      // console.log(c.label, c.value, s.label, s.value);
      const inventory = product.variants.find(
        (v) => v.colourId === c.value && v.sizeId === s.value
      ).inventory;
      result[c.label][s.label] = inventory;
    }
  }
  console.table(result);
  return result;
}


function toHtml(s) {
  var cols = [];
  for (var k in s) {
    for (var c in s[k]) {
      if (cols.indexOf(c) === -1) cols.push(c);
    }
  }
  var html =
    '<table class=tftable><thead><tr><th></th>' +
    cols
      .map(function (c) {
        return '<th>' + c + '</th>';
      })
      .join('') +
    '</tr></thead><tbody>';
  for (var l in s) {
    html +=
      '<tr><th>' +
      l +
      '</th>' +
      cols
        .map(function (c) {
          return '<td>' + s[l][c] + '</td>';
        })
        .join('') +
      '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

function renderToDialog(tableHtml, showBtn) {
  var dialog = document.createElement('dialog');

  dialog.innerHTML = tableHtml;
  var closeButton = document.createElement('button');
  closeButton.innerHTML = 'Close';
  dialog.appendChild(closeButton);

  document.body.appendChild(dialog);

  // "Show the dialog" button opens the dialog modally
  showBtn.addEventListener('click', () => {
    dialog.showModal();
  });

  // "Close" button closes the dialog
  closeButton.addEventListener('click', () => {
    dialog.close();
  });
}


function run(product) {
  var inventory = printInventory(product)
  var tableHtml = toHtml(inventory);
  var showBtn = document.querySelector("#primary-info h1")
  renderToDialog(tableHtml, showBtn);
}

(function() {
    'use strict';

    // Your code here...

    var a = document.querySelector("#__NEXT_DATA__")
    var b= a.innerText
    var c = JSON.parse(b)
    var d = c.props.pageProps.product
    var e = JSON.parse(d)
    // console.log(e.variants)
    run(e)
})();