// ==UserScript==
// @name         item-price
// @namespace    item-price.zero.nao
// @version      0.1
// @description  show item price and total value
// @author       nao [2669774]
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/516899/item-price.user.js
// @updateURL https://update.greasyfork.org/scripts/516899/item-price.meta.js
// ==/UserScript==

let api = "###PDA-APIKEY###";
let url = window.location.href;
let rfc = getRFC();
let data;
function getRFC() {
  var rfc = $.cookie("rfc_v");
  if (!rfc) {
    var cookies = document.cookie.split("; ");
    for (var i in cookies) {
      var cookie = cookies[i].split("=");
      if (cookie[0] == "rfc_v") {
        return cookie[1];
      }
    }
  }
  return rfc;
}

async function getData() {
  let req_url = `https://api.torn.com/torn/?selections=items&key=${api}&comment=itemData`;
  data = await $.getJSON(req_url);
}

async function main() {
  await getData();
  insert();
}

function insert() {
  $("li[data-item]:not([processedItemData])").each(function () {
    const dataid = $(this).attr("data-item");
    const dataqty = $(this).attr("data-qty") || 1;
    const dataprice = data.items[dataid].market_value;

    const insertData = `<span style="color:green; float:right;">$${numberWithCommas(dataprice)} x ${numberWithCommas(dataqty)} = $${numberWithCommas(dataqty * dataprice)}<span>`;
    $(".name-wrap", $(this)).append(insertData);
    $(this).attr("processedItemData", true);
  });

  setTimeout(insert, 1000);
}

function numberWithCommas(x) {
  if (!x) {
    return;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

main();
