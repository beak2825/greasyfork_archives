// ==UserScript==
// @name         one-click-listing
// @namespace    one-click-listing.zero.nao
// @version      0.2
// @description  one click listing in the item market
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/514563/one-click-listing.user.js
// @updateURL https://update.greasyfork.org/scripts/514563/one-click-listing.meta.js
// ==/UserScript==

let extra_percent = 1;
let multiplier = 1 + extra_percent/100;

function insert() {
  $("div[class^='itemRowWrapper_']:not([processed])").each(function () {
    let itemid = $("img[src^='/images/items']", $(this))
      .attr("src")
      .split("items/")[1]
      .split("/")[0];

    $("img", $(this)).css("background", "rgba(159, 42, 202, 0.5)");
    $(`img`, $(this)).on("click", function (e) {
      e.stopPropagation();

      let parent = $(this).parents('div[class^="itemRowWrapper"]');
      let itemprice = $("div[class^='price']", $(parent))
        .text()
        .split(" ")[0]
        .replaceAll(",", "")
        .replace("$", "");
        itemprice =parseInt(itemprice * multiplier);

      if ($(".input-money-symbol > input", $(parent)).length > 0) {
        $(".input-money-symbol", $(parent)).trigger("click");
      }

      if ($("input[id^='itemRow-selectCheckbox']", $(parent)).length > 0) {
        $("input[id^='itemRow-selectCheckbox']", $(parent)).trigger("click");
      }

      let inputsWrapper = $("div[class^='priceInputWrapper_']", $(parent));
      $("input", $(inputsWrapper)).val(itemprice).trigger("input");
    });

    $(this).attr("processed", true);
  });
}
setInterval(insert, 1000);
