// ==UserScript==
// @name        steam min price filter
// @namespace   bbk
// @match       *://store.steampowered.com/search*
// @grant       none
// @version     1.1
// @author      bbk
// @description 2024/12/26 04:01:07
// @license MPL
// @downloadURL https://update.greasyfork.org/scripts/521808/steam%20min%20price%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/521808/steam%20min%20price%20filter.meta.js
// ==/UserScript==

var minprice = 5;
const realmin = minprice * 100;
var maxprice = 0;
const realmax = maxprice * 100;

function heckresult(node) {
  let pricenode = node.querySelector(".search_price_discount_combined");
  var price = pricenode.getAttribute("data-price-final");
  price = parseInt(price);
  let itemnode = pricenode.closest(".search_result_row");
  if ( price < realmin  || (maxprice != 0 &&  price > realmax)) {
    itemnode.remove();
  }
}

const targetNode = document.getElementById("search_resultsRows");
const config = { attributes: false, childList: true, subtree: false };

const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    for (const node of mutation.addedNodes){
      if (node.tagName !== "A") continue;
      heckresult(node);
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
let res = targetNode.querySelectorAll(".search_result_row");
for (const n of res) {
  heckresult(n);
}
