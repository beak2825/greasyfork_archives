// ==UserScript==
// @name        Better billa.at orders page
// @namespace   Violentmonkey Scripts
// @match       https://shop.billa.at/profile/orders
// @grant       none
// @version     1.0
// @author      -
// @run-at      document-start
// @description Easier navigation on the order list: the order being viewed is highlighted in the table, and the footer has a button to return to it - 2023-05-21, 01:41:37 AM
// @downloadURL https://update.greasyfork.org/scripts/466805/Better%20billaat%20orders%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/466805/Better%20billaat%20orders%20page.meta.js
// ==/UserScript==

savedLog = console.log; // they overwrite it

// make sure the DOM is loaded before we try to manipulate it.
document.addEventListener("DOMContentLoaded", function(event) {


// this css class will be used for highlighting the table row of the order currently being viewed.
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
.betterBillaHighlightedOrder { border: 0.2em solid black; }
.betterBillaHighlightedOrder td.action button { color: #CCC; }
.betterBillaHighlightedOrder td.action button:hover { color: #AAA; }
`; // put a border around the table row, gray out the Details button
document.getElementsByTagName('head')[0].appendChild(style);


document.scrollToOrder = function () {
  tr = document.querySelector('tr.betterBillaHighlightedOrder')
  if (tr.previousElementSibling !== null) {
    tr.previousElementSibling.scrollIntoView()
  } else {
    tr.scrollIntoView()
  }
}


// main loop
orderId = null;
function doLoop() {
  // find the order id of the order currently being viewed
  res = document.querySelectorAll('div.basket__articles-header td[data-ng-bind="historicOrder.orderId"]');
  if (res.length === 1) {
    oldOrderId = orderId;
    orderId = res[0].innerText;
    if (orderId !== oldOrderId) {
      highlightedTrs = document.querySelectorAll("table.account__table-overview-list > tbody > tr.betterBillaHighlightedOrder");
      highlightedTrs.forEach(highlightedTr => {
        highlightedTr.classList.remove("betterBillaHighlightedOrder"); // remove highlighting from previously highlighted table row
      });

      // find the order id in the order list up top
      var xpath = "//table[@class='account__table-overview-list']/tbody/tr/td[@data-ng-bind='order.orderIdInternal' and text()='" + orderId + "']";
      res2 = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      td = res2.singleNodeValue;

      // highlight the table row
      if (td !== null) {
        tr = td.parentElement;
        tr.classList.add("betterBillaHighlightedOrder");
      }

      // remove existing "scroll to order" button
      oldButtons = document.querySelectorAll("button.betterBillaFooterButton");
      oldButtons.forEach(oldButton => {
        oldButton.parentNode.removeChild(oldButton);
      });
      // re-add "scroll to order" button
      res3 = document.querySelectorAll("div#body-content footer button");
      if (res3.length === 2) { // there are normally only 2 buttons
        // note in the event callback below we have to use previousElementSibling because of the always-visible top toolbar.
        newButton = `<button class="no-button betterBillaFooterButton" onclick="document.scrollToOrder()">↑ Zurück zur Liste ↑</button>`;
        res3[0].insertAdjacentHTML("afterend", newButton);
      }
    }
  }
}

window.setInterval(doLoop, 1000);


});
