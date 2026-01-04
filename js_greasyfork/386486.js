// ==UserScript==
// @name         ShiftCodes for Borderlands
// @namespace    https://victor-lange.de/
// @version      2.2
// @description  Automatically enters SHiFT-Codes for Borderlands.
// @author       Victor Lange
// @website      https://victor-lange.de
// @match        https://shift.gearboxsoftware.com/rewards
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM.xmlHttpRequest
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @connect      borderlands.gamerangerz.de
// @downloadURL https://update.greasyfork.org/scripts/386486/ShiftCodes%20for%20Borderlands.user.js
// @updateURL https://update.greasyfork.org/scripts/386486/ShiftCodes%20for%20Borderlands.meta.js
// ==/UserScript==
var $ = window.jQuery;
var ShiftCodes = [];

$("div.main.sh_code_redemption_section > div.shift-secondary-title").before(
  '<div class="btn-group"><button type="button" id="BO1Click" class="btn btn-default">Borderlands 1</button><button type="button" id="BO2Click" class="btn btn-default">Borderlands 2</button><button type="button" id="PSClick" class="btn btn-default">Pre-Sequel</button><button type="button" id="BO3Click" class="btn btn-default">Borderlands 3</button><button type="button" id="NEWClick" class="btn btn-success">New Codes</button><button type="button" id="ResetClick" class="btn btn-danger">Reset</button></div>'
);

$("#BO2Click").click(function() {
  GM_setValue("ShiftIndex", 0);
  GM_setValue("ShiftMode", "BO2");
  location.reload();
});

$("#PSClick").click(function() {
  GM_setValue("ShiftIndex", 0);
  GM_setValue("ShiftMode", "BOPS");
  location.reload();
});

$("#BO1Click").click(function() {
  GM_setValue("ShiftIndex", 0);
  GM_setValue("ShiftMode", "BO1");
  location.reload();
});

$("#BO3Click").click(function() {
  GM_setValue("ShiftIndex", 0);
  GM_setValue("ShiftMode", "BO3");
  location.reload();
});

$("#NEWClick").click(function() {
  GM_setValue("ShiftIndex", 0);
  GM_setValue("ShiftMode", "NEW");
  location.reload();
});

$("#ResetClick").click(function() {
  GM_deleteValue("ShiftIndex");
  GM_deleteValue("ShiftMode");
  location.reload();
});

var MsgShiftGame = [
  "Um weitere SHiFT-Codes einzulösen, starte bitte zuerst ein SHiFT-verbundenes Spiel.",
  "To continue to redeem SHiFT codes, please launch a SHiFT-enabled title first!"
];
var ContinueRedeemFlag = true;

if (GM_getValue("ShiftMode") === undefined) {
  //Nothing happend
} else {
  GM.xmlHttpRequest({
    method: "GET",
    url: "https://borderlands.gamerangerz.de/?game=" + GM_getValue("ShiftMode"),
    onload: function(data) {
      ShiftCodes = JSON.parse(data.responseText);
      $("div.shift-secondary-title > h1").html(
        "SHiFT-Code " +
          (GM_getValue("ShiftIndex") + 1) +
          " of " +
          ShiftCodes.length
      );

      if ($(".alert.notice").val() != undefined) {
        //Alert exists
        if (
          MsgShiftGame.includes(
            $(".alert.notice")
              .html()
              .trim()
          )
        ) {
          //Start SHiFT Game
          GM_setValue("ShiftIndex", Number(GM_getValue("ShiftIndex")) - 1);
          ContinueRedeemFlag = false;
          alert(
            "Please start or restart your game! Reload the page to continue!"
          );
        }
      }

      if (
        GM_getValue("ShiftIndex") <= ShiftCodes.length - 1 &&
        ContinueRedeemFlag
      ) {
        console.log(ShiftCodes[GM_getValue("ShiftIndex")]);
        $("#shift_code_input").val(ShiftCodes[GM_getValue("ShiftIndex")]);
        $("#shift_code_check").click();
        setTimeout(function() {
          if ($(".redeem_button").length) {
            $(".redeem_button").click();
          } else {
            alert(
              "We are too quick... Please wait a minute and redeem this code manually."
            );
          }
        }, 500);
        GM_setValue("ShiftIndex", Number(GM_getValue("ShiftIndex")) + 1);
      } else {
        if (GM_getValue("ShiftIndex") > ShiftCodes.length - 1) {
          $("div.shift-secondary-title > h1").html(
            ShiftCodes.length + " SHiFT-Codes redeemed"
          );
          GM_deleteValue("ShiftIndex");
          GM_deleteValue("ShiftMode");
        }
      }
    }
  });
}
