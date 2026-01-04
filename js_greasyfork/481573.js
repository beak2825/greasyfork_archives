// ==UserScript==
// @name         Automatic Rolimons Trade Ad Poster
// @namespace    https://anyas.me/
// @version      0.1.1
// @description  adds a button that automatically posts trades
// @author       anyastrophic
// @match        https://www.rolimons.com/tradeadcreate
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rolimons.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481573/Automatic%20Rolimons%20Trade%20Ad%20Poster.user.js
// @updateURL https://update.greasyfork.org/scripts/481573/Automatic%20Rolimons%20Trade%20Ad%20Poster.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.getElementsByClassName("col-12 d-none d-sm-block")[0].innerHTML =
    '<div class="col-12 d-none d-sm-block" style="display: flex;"> <input class="btn btn-dark btn-flat-light-blue btn-very-sharp shadow" id="submit_trade" type="submit" value="Submit" style="position: absolute; bottom: 19px; left: 50%; transform: translateX(-50%)" disabled=""><input type="submit" style="position: absolute; bottom: 19px; left: 60%; transform: translateX(-50%); height: 41.5px; background-color: rgb(210, 43, 43);" id="auto_submit_trade" class="btn btn-dark btn-very-sharp shadow" value="Auto Submit"> <span id="last-trade-auto-submitted" class="text-info lead">last trade automatically submitted: </span></div>';

  var lastTradeSubmittedAt = 0;
  function postTradeAd() {
    var t = {
      player_id: jwt_player_id,
      offer_item_ids: trade_ad_offer_item_ids,
      request_item_ids: trade_ad_request_item_ids,
      request_tags: trade_ad_request_tags,
    };

    $.ajax({
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      url: "/tradeapi/create",
      data: JSON.stringify(t),
      success: function () {
        console.log("success trade post");
        lastTradeSubmittedAt = new Date().getTime() / 1000;
      },
      error: function () {
        console.log("fail trade post");
      },
    });
  }

  const autoTradeBtn = document.getElementById("auto_submit_trade");
  const lastTradeSubmitted = document.getElementById(
    "last-trade-auto-submitted",
  );

  setInterval(() => {
    if (lastTradeSubmittedAt === 0) {
      lastTradeSubmitted.innerHTML =
        "idk when the last trade was auto-submitted";
    } else {
      lastTradeSubmitted.innerHTML = `last trade auto-submitted was ${
        Math.floor((new Date().getTime() / 1000 - lastTradeSubmittedAt) / 60)
      } minutes ago`;
    }
  }, 1000);

  autoTradeBtn.style.backgroundColor = "#D22B2B";

  let autoTradeOn = false;
  let interval;
  autoTradeBtn.addEventListener("click", () => {
    autoTradeOn = !autoTradeOn;

    if (autoTradeOn) {
      interval = setInterval(postTradeAd, 30 * 1000);
      autoTradeBtn.style.backgroundColor = "#50C878";
    } else {
      clearInterval(interval);
      autoTradeBtn.style.backgroundColor = "#D22B2B";
    }
  });
})();
