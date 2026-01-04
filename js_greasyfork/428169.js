// ==UserScript==
// @name        Clear Unit Price
// @namespace   Violentmonkey Scripts
// @include     http://192.168.1.182/inventory/PurchaseOrderCreateMain.asp*
// @include     http://192.168.1.182/inventory/PurchaseOrderEditor.asp*
// @grant       none
// @run-at      document-idle
// @description   Violentmonkey Scripts
// @version 0.0.1.20210619071057
// @downloadURL https://update.greasyfork.org/scripts/428169/Clear%20Unit%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/428169/Clear%20Unit%20Price.meta.js
// ==/UserScript==

var title = document.getElementsByClassName("hdr")[0];

var pricelist = document.getElementsByClassName("row20px")[0].getElementsByTagName("tr");

function clearunitprice() {
  for (var i = 0; i < pricelist.length; i++) {
    var td = pricelist[i].getElementsByTagName("td");
    if (td.length > 5) {
      td[6].innerHTML = "";
    }
  }
}

var checkbox = document.createElement('input');
checkbox.type = "button";
checkbox.id = "clrAll";
checkbox.value = "Clear All";
checkbox.onclick = clearunitprice;

title.getElementsByTagName("td")[6].appendChild(checkbox);

