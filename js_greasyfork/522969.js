// ==UserScript==
// @name         buy-max
// @namespace    buy-max.zero.nao
// @version      0.1
// @description  buy max based on money on hand
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/522969/buy-max.user.js
// @updateURL https://update.greasyfork.org/scripts/522969/buy-max.meta.js
// ==/UserScript==

$(document).on("click", ".input-money-symbol", function () {
  let parent = $(this).parents("li[class^='rowWrapper_']");
  let current = parent;
  if (parent.length === 0) {
    parent = $("li[class*='expanded']");
    current = $(this).parents("li[class^='buyDialog_']");
  }
  console.log(parent);
  const price = $("div[class^='price_']", parent)
    .text()
    .trim()
    .replace("$", "")
    .replaceAll(",", "");
  const money = Math.floor(
    parseInt(document.getElementById("user-money").getAttribute("data-money")),
  );

  console.log(price, money);

  const qty = Math.floor(money / parseInt(price));

  const qtyInput = $(".input-money", current);
  $(qtyInput).val(qty);
  $(qtyInput).trigger("input").trigger("input");
});
