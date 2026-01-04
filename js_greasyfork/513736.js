// ==UserScript==
// @name         filter-box
// @namespace    filter-box.zero.nao
// @version      0.1
// @description  adds a filter box
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/513736/filter-box.user.js
// @updateURL https://update.greasyfork.org/scripts/513736/filter-box.meta.js
// ==/UserScript==

let api = "";
let url = window.location.href;
let rfc = getRFC();

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
// https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Melee&sortField=price&sortOrder=ASC&damageFrom=15&damageTo=100&priceFrom=150000000

function insert() {
  if ($("div[class^='sliders_']").length > 0) {
    let container = ``;
    $("div[class^='sliderWrapper_']").each(function () {
      let type;
      let html = $(this).html();
      if (html.includes("Price")) {
        type = "Price";
      } else if (html.includes("Damage")) {
        type = "Damage";
      } else if (html.includes("Accuracy")) {
        type = "Accuracy";
      } else if (html.includes("Armor")) {
        type = "Armor";
      }

      if (type) {
        let insertData = `
<div>
                    <input type="number" id="${type}-lower" class="valueRangeBox" placeholder="${type} lower">
                    <input type="number" id="${type}-upper" class="valueRangeBox" placeholder="${type} upper">
</div>
`;
        container += insertData;
      }
    });

    if ($("#valueContainer").length == 0) {
      console.log("Inserting Box");
      container =
        `<div id="valueContainer">` +
        container +
        `<button id='updateRange' class='torn-btn'>Filter</button></div?`;
      console.log(container);
      $("div[class^='filtersWrapper']").append(container);

      $("#updateRange").on("click", update);
    }
  } else {
    setTimeout(insert, 1000);
  }
}

function update() {
  let pricelower =
    $("#Price-lower").length > 0 ? $("#Price-lower").attr("value") || 0 : 0;
  let priceupper =
    $("#Price-upper").length > 0 ? $("#Price-upper").attr("value") || 0 : 0;
  let dmglower =
    $("#Damage-lower").length > 0 ? $("#Damage-lower").attr("value") || 0 : 0;
  let dmgupper =
    $("#Damage-upper").length > 0 ? $("#Damage-upper").attr("value") || 0 : 0;
  let acclower =
    $("#Accuracy-lower").length > 0
      ? $("#Accuracy-lower").attr("value") || 0
      : 0;
  let accupper =
    $("#Accuracy-upper").length > 0
      ? $("#Accuracy-upper").attr("value") || 0
      : 0;
  let armorlower =
    $("#Armor-lower").length > 0 ? $("#Armor-lower").attr("value") || 0 : 0;
  let armorupper =
    $("#Armor-upper").length > 0 ? $("#Armor-upper").attr("value") || 0 : 0;

  let url = window.location.href;
  if (url.includes("=ASC")) {
    url = url.split("=ASC")[0] + "=ASC";
  } else if (url.includes("=DESC")) {
    url = url.split("=DESC")[0] + "=DESC";
  }
  if (pricelower > 0) {
    url += `&priceFrom=${pricelower}`;
  }
  if (priceupper > 0) {
    url += `&priceTo=${priceupper}`;
  }
  if (dmglower > 0) {
    url += `&damageFrom=${dmglower}`;
  }
  if (dmgupper > 0) {
    url += `&damageTo=${dmgupper}`;
  }
  if (acclower > 0) {
    url += `&accuracyFrom=${acclower}`;
  }
  if (accupper > 0) {
    url += `&accuracyTo=${accupper}`;
  }
  if (armorlower > 0) {
    url += `&armorFrom=${armorlower}`;
  }
  if (armorupper > 0) {
    url += `&armorTo=${armorupper}`;
  }
  window.location.href = url;
}

$(window).on("hashchange", function (e) {
  insert();
});

insert();