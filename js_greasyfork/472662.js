// ==UserScript==
// @name         Neopets Inventory Quick Actions
// @namespace    https://github.com/lsfgrd/neopets-inventory-quick-actions/
// @version      0.1
// @description  Userscript that adds new quick actions button to the inventory modal on Neopets.
// @author       Lauro Figueiredo
// @match        https://www.neopets.com/inventory.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472662/Neopets%20Inventory%20Quick%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/472662/Neopets%20Inventory%20Quick%20Actions.meta.js
// ==/UserScript==

(function () {
  /*
    Button colors:
    red, yellow, blue, green, purple,

    Actions:
    <option value="safetydeposit">Put into your Safety Deposit Box</option>
    <option value="donate">Donate Item</option>
    <option value="drop">Discard Item</option>
    <option value="stockshop">Put into your Shop</option>
    <option value="stockgallery">Put into your Gallery</option>
    <option value="give">Give to NeoFriend</option>
    <option value="auction">Put up for Auction!</option>
  */

  const buttonWrapper = () => {
    const wrapperStyles = `
        margin-top: 15px;
    `;

    const ribbonStyle = `
      font-size: 24px !important;
      display: block;
      font-family: 'Cafeteria', 'Arial Bold', sans-serif;
      text-align: left;
      padding-left: 10px;
      background: #E6E4DD;
      padding-top: 5px;
      padding-bottom: 5px;
      width: 120px;
    `;

    return `
      <div id="userScriptButtonWrapper" style="${wrapperStyles}">
        <span style="${ribbonStyle}">Quick actions</span>
      </div>
    `;
  };

  const buttonStyle = `
    display: inline-flex;
    width: 80px;
    margin-right: 10px;
    margin-top: 10px;
    justify-content: center;
    min-height: 50px;
    align-items: center;
  `;

  const buildButton = (color, action, name) =>
    `<div class="button-default__2020 button-${color}__2020" style="${buttonStyle}" onclick="useItem('${action}')">${name}</div>`;

  const buttons = [
    buildButton("yellow", "stockshop", "$ Shop"),
    buildButton("purple", "stockgallery", "𖣯 Gallery"),
    buildButton("green", "safetydeposit", "❒ SDB"),
    buildButton("blue", "give", "★ Give"),
    buildButton("red", "donate", "♥︎ Donate"),
    buildButton("red", "drop", "✘  Discard"),
  ];

  const modalBody = document.querySelector("#invDesc > .popup-body__2020");
  const modalWrapper = document.querySelector("#invDesc.togglePopup__2020");
  if (!modalBody) return;

  modalWrapper.style.marginTop = "-285px";
  modalBody.style.maxHeight = "500px";

  const observer = new MutationObserver((mutations, returnedObserver) => {
    if (mutations.length >= 2) {
      returnedObserver.disconnect();

      const itemBox = document.querySelector(".invDesc .inv-itemBox");
      itemBox.style.width = "100px";

      // delete existing wrapper to avoid duplication
      const existingWrapper = document.getElementById(
        "userScriptButtonWrapper"
      );
      if (existingWrapper) {
        existingWrapper.remove();
      }

      modalBody.insertAdjacentHTML("beforeend", buttonWrapper());

      const wrapper = document.getElementById("userScriptButtonWrapper");

      buttons.forEach((button) => {
        wrapper.insertAdjacentHTML("beforeend", button);
      });

      returnedObserver.observe(modalBody, {
        subtree: true,
        attributes: false,
        childList: true,
      });
    }
  });
  observer.observe(modalBody, {
    subtree: true,
    attributes: false,
    childList: true,
  });
})();

const $ = unsafeWindow.$;
const centerPopup__2020 = unsafeWindow.centerPopup__2020;

unsafeWindow.useItem = (obj_action) => {
  const doAction = () => {
    var obj_id_value = $("#invDesc").data("objid");
    var useURL = "";

    // Using items takes time, please hold
    $("#invResult")
      .find(".popup-body__2020")
      .html("<div class='inv-loading-static'></div><p>Loading...</p>");
    $("#invResult").find("h3").html("Loading...");

    if ($("#" + obj_id_value + "").data("itemset") === "nc") {
      useURL =
        "/np-templates/views/process_cash_object.phtml?cash_obj_id=" +
        obj_id_value;
      var cashData = {
        obj_id: obj_id_value,
        action: obj_action,
      };

      $.ajax({
        type: "POST",
        url: useURL,
        data: cashData,
        dataType: "html",
        success: function (response) {
          var scriptSource = document.createElement("script");
          scriptSource.type = "text/javascript";
          scriptSource.text =
            "$(document).ready(function(){" +
            "$('input[value=\"Close and Refresh\"]').click(function(){" +
            "window.location.reload();" +
            "});" +
            "});";

          //$('#invResult').data('objid', $('#invDesc').data('objid'));
          // Display Results
          $("#invResult").find(".popup-body__2020").html(response);
          $("#invResult").find(".popup-body__2020").append(scriptSource);
          $("#invResult").find("h3").html("Success!");
          centerPopup__2020();
        },
        error: function () {
          console.log("Error");
          $("#invResult").find("h3").html("Uh oh!");
          centerPopup__2020();
        },
      });
    } else {
      useURL = "/np-templates/views/useobject.phtml";
      var postData = {
        obj_id: obj_id_value,
        action: obj_action,
        petcare: 0,
      };

      $.ajax({
        type: "POST",
        url: useURL,
        data: postData,
        dataType: "html",
        success: function (response) {
          var scriptSource = document.createElement("script");
          scriptSource.type = "text/javascript";
          scriptSource.text =
            "$(document).ready(function(){" +
            "$('input[value=\"Close and Refresh\"]').click(function(){" +
            "window.location.reload();" +
            "});" +
            "});";

          $("#invResult").find(".popup-body__2020").html(response);
          $("#invResult").find(".popup-body__2020").append(scriptSource);
          $("#invResult").find("h3").html("Success!");
          centerPopup__2020();
        },
        error: function () {
          console.log("Error");
          $("#invResult").find("h3").html("Uh oh!");
          centerPopup__2020();
        },
      });
    }

    // Show the Popup
    $("#invDesc").hide();
    $("#navpopupshade__2020").hide();
    $("#refreshshade__2020").show();
    $("#invResult").show();
    centerPopup__2020();
    return false;
  };

  let confirmMessage = null;

  switch (obj_action) {
    case "drop":
      confirmMessage = "The item will be deleted forever. Are you sure?";
      break;
    case "donate":
      confirmMessage = "Do you really want to donate this item?";
      break;
    default:
      confirmMessage = null;
      break;
  }

  if (confirmMessage) {
    const confirmResult = confirm(confirmMessage);

    if (confirmResult) {
      doAction();
    }
  } else {
    doAction();
  }
};

unsafeWindow.centerPopup__2020 = () => {
  const popup = document.getElementsByClassName("togglePopup__2020");
  const popupBody = document.getElementsByClassName("popup-body__2020");
  const popupHeader = document.getElementsByClassName("popup-header__2020");
  const popupFooter = document.getElementsByClassName("popup-footer__2020");

  // Center the popup in the viewport
  for (let i = 0; i < popup.length; i++) {
    popup[i].style.marginTop = (popup[i].offsetHeight / 1.6) * -1 + "px"; // negative half of its height
    popup[i].style.marginLeft = (popup[i].offsetWidth / 2) * -1 + "px"; // negative half of its width
  }
  // set the max Height for the body content of the popup based on the height of the header & footer
  for (let x = 0; x < popup.length; x++) {
    // popupBody[x].style.maxHeight = window.innerHeight - 40 - popupHeader[x].offsetHeight - popupFooter[x].offsetHeight + "px";
    popupBody[x].style.maxHeight = window.innerHeight * 0.7 - 20 + "px";
  }
};
