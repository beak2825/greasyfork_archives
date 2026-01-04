// ==UserScript==
// @name         happy-jumper
// @namespace    happy-jumper.zero.nao
// @version      0.2
// @description  tracks happy jumps
// @author       nao [2669774]
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/516008/happy-jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/516008/happy-jumper.meta.js
// ==/UserScript==

let api = "";
let url = window.location.href;
let rfc = getRFC();

let itemOrder = [
  "xanax",
  "xanax",
  "xanax",
  "xanax",
  "edvd",
  "edvd",
  "edvd",
  "edvd",
  "ecstacy",
];

if (!localStorage.happyhelper && itemOrder.length > 0) {
  localStorage.happyhelper = 0;
}

let itemIds = {
  xanax: 206,
  edvd: 366,
  ecstacy: 197,
};

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

function useItem(itemId, useFac = "0") {
  $.post(
    `https://www.torn.com/item.php?rfcv=${getRFC()}`,
    {
      step: "useItem",
      itemID: itemId,
      fac: useFac,
    },
    function (response) {
      response = JSON.parse(response);
      $(".items-name").html(response.text);

      if (response.success) {
        if (response.text.includes("overdose")) {
          localStorage.happyhelper = 0;
        } else {
          localStorage.happyhelper =
            (localStorage.happyhelper * 1 + 1) % itemOrder.length;
        }

        updateButton();
      }
      console.log(response.text);
    },
  );
}

function updateButton() {
  let currItem = localStorage.happyhelper;
  $("#hhitem").html(itemOrder[currItem]);
  $("#hhitem").attr("item", itemOrder[currItem]);
}

function insert() {
  if ($(".items-wrap").length == 0) {
    setTimeout(insert, 1000);
    return;
  }

  let currentItem = localStorage.happyhelper;
  currentItem = currentItem % itemOrder.length;
  const buttons = `<button id="hhitem" class='torn-btn' item='${itemOrder[currentItem]}' style="width:150px;height:150px;margin-right:15px;">${itemOrder[currentItem]}</button><button class='torn-btn' id='hhreset' style="width:150px;height:150px;">Reset</button>`;

  $(".items-wrap").prepend(buttons);

  $(`#hhitem`).on("click", function () {
    const item = $(this).attr("item");
    const itemId = itemIds[item];

    useItem(itemId);
  });

  $("#hhreset").on("click", () => {
    if (itemOrder.length > 0) {
      localStorage.happyhelper = 0;
      updateButton();
    } else {
      alert("You need to have at least one item in item order");
    }
  });
}

insert();
