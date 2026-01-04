// ==UserScript==
// @name         one-click-listing-itemprice
// @namespace    one-click-listing.zero.nao
// @version      0.5
// @description  one click listing in the item market based on the item market price, updated for bazaar
// @author       nao [2669774]
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/522244/one-click-listing-itemprice.user.js
// @updateURL https://update.greasyfork.org/scripts/522244/one-click-listing-itemprice.meta.js
// ==/UserScript==

const api = "";

if (!localStorage.itemPricePerc) {
  localStorage.itemPricePerc = 0;
}

async function getItemPrice(itemid) {
  let response = await $.getJSON(
    `https://api.torn.com/v2/market/${itemid}/itemmarket?key=${api}&offset=0`,
  );

  const lowestPrice = response.itemmarket.listings[0].price;
  return lowestPrice;
}

function insertPerc() {
  const container = document.querySelector("div[class^='titleContainer_']");

  if (!container) {
    setTimeout(insertPerc, 300);
    return;
  }
  const label = document.createElement("label");
  label.innerText = "Percentage: ";
  const percInput = document.createElement("input");
  percInput.setAttribute("type", "number");
  percInput.value = localStorage.itemPricePerc;
  percInput.addEventListener("input", function () {
    localStorage.itemPricePerc = this.value;
  });

  container.appendChild(label);
  container.appendChild(percInput);
}

function insert() {
  $(".items-cont > li:not([processed])").each(function () {
    let img = $("img[src^='/images/items']", $(this));
    if (img.length == 0) return;

    const itemid = $(img).attr("src").split("items/")[1].split("/")[0];

    const parent = $(this);

    $(img).css("background", "rgba(159, 42, 202, 0.5)");
    $(img).on("click", async function (e) {
      e.stopPropagation();

      let itemprice = await getItemPrice(itemid);
      itemprice = itemprice * ((100 + 1 * localStorage.itemPricePerc) / 100);
      itemprice = Math.round(itemprice);

      const qty = 9999999999999;

      const amountInput = $(".amount > input", parent)[0];
      if (amountInput) {
        amountInput.value = qty;
        amountInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if ($(".amount > input", parent)) {
        $(".amount > input", parent).click();
      }

      $(".price > div > input", parent).val(itemprice).trigger("input");
    });

    $(this).attr("processed", true);
  });
}

function update() {
  $("div[class^='row_']").each(function () {
    let img = $("img[src^='/images/items']", $(this));
    if (img.length == 0) return;

    const itemid = $(img).attr("src").split("items/")[1].split("/")[0];

    const parent = $(this);

    $(img).css("background", "rgba(159, 42, 202, 0.5)");
    $(img).on("click", async function (e) {
      e.stopPropagation();

      let itemprice = await getItemPrice(itemid);
      itemprice = itemprice * ((100 + 1 * localStorage.itemPricePerc) / 100);
      itemprice = Math.round(itemprice);

      $(".input-money", parent).val(itemprice).trigger("input");
    });

    $(this).attr("processed", true);
  });
}

function main() {
  if (window.location.href.includes("add")) {
    insertPerc();
    setInterval(insert, 1000);
  } else if (window.location.href.includes("manage")) {
    setInterval(update, 1000);
  } else {
    setTimeout(main, 2000);
  }
}

main();
