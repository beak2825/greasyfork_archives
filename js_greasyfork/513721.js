// ==UserScript==
// @name         Company Trainer
// @namespace    trainer.zero.torn
// @version      0.4
// @description  company training tracker
// @author       nao
// @match        https://www.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/513721/Company%20Trainer.user.js
// @updateURL https://update.greasyfork.org/scripts/513721/Company%20Trainer.meta.js
// ==/UserScript==

GM_addStyle(`
.trainOrder {
width: 100%;
}

`);

let trains = getData();

function getData() {
  let tempValue = localStorage.trainsOrdered || "{}";
  tempValue = JSON.parse(tempValue);
  return tempValue;
}

function updateData() {
  console.log(trains);
  localStorage.trainsOrdered = JSON.stringify(trains);
}

function update() {
  trains = getData();
  $(".trainOrder").each(function () {
    let val = $(this).attr("value") || 0;
    console.log(`Value ${val}`);
    let userId = $(this).attr("userid");

    trains[userId] = val;
  });
  console.log(trains);
  updateData();
  updateDisplayValue();
}

function updateDisplayValue() {
  let currTrains = getData();

  $(".trainOrder").each(function () {
    let uid = $(this).attr("userid");
    let nTrains = currTrains[uid] || 0;

    $(this).attr("value", parseInt(nTrains));
  });
}

function train(id) {
  console.log(`Training ${id}`);
  $.post(
    `https://www.torn.com/companies.php?rfcv=${getRFC()}`,
    {
      step: "trainemp2",
      ID: id,
    },
    function (response) {
      response = JSON.parse(response);
      if (response.success) {
        trains[id]--;
      }
      if (trains[id] <= 0) {
        $(".train", $(`li[data-user="${id}"]`)).html("N/A");
      }
      updateData();
      updateDisplayValue();
      console.log(response);
    },
  );
}
let displayUpdated = false;
function updateTrainDisplay() {
  if (displayUpdated) {
    return;
  }

  if ($(".torn-btn", $(".fire")).length > 0) {
    GM_addStyle(`

        .zeroTrain {
        width: 110px;
        margin: 10px 0px 10px 10px;
        }
`);
  }
}

function insert() {
  let url = window.location.href;
  if (!url.includes("employees")) {
    return;
  }

  if ($(".employee-list > li").length > 0) {
    $(".employee-list > li:not([processed])").each(function () {
      console.log("here");
      let userid = $(this).attr("data-user");
      $(".days", $(this)).html(
        `<input type="text" userid="${userid}" class="trainOrder">`,
      );

      if (trains[userid] && trains[userid] > 0) {
        $(".train", $(this)).on("click", function (e) {
          e.stopPropagation();
          e.preventDefault();
          train(userid);
        });
      } else {
        $(".train", $(this)).html("N/A");
      }
      $(this).attr("processed", true);
      updateDisplayValue();
    });
    if ($("#updateTrains").length == 0) {
      $("div.title:nth-child(1)").append(
        `<button id="updateTrains" class="torn-btn">Update Trains</button>`,
      );
      $("#updateTrains").on("click", function () {
        update();
      });
    }
  }
  setTimeout(insert, 1000);
}

$(window).on("hashchange", function (e) {
  insert();
});

insert();
