// ==UserScript==
// @name         last used weapon
// @namespace    last-weapon.zero.nao
// @version      0.5
// @description  highlights the last used weapon
// @author       nao [2669774]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512909/last%20used%20weapon.user.js
// @updateURL https://update.greasyfork.org/scripts/512909/last%20used%20weapon.meta.js
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

const { fetch: origFetch } = window;
window.fetch = async (...args) => {
  //  console.log("fetch called with args:", args);

  const response = await origFetch(...args);

  /* work with the cloned response in a separate promise
     chain -- could use the same chain with `await`. */

  if (response.url.includes("loader.php?sid=attackData")) {
    //  console.log("REsponseL : "+response);

    response
      .clone()
      .json()
      .then(function (body) {
        console.log("body");

        let user2EquipedItemID = body.user2EquipedItemID - 1;
        let status = body.currentAttackStatus;
        if (status != "process") {
          return;
        }
        //   let user2EquipedItemID = "1";
        if (
          $($("div[class^='weaponList_'] > div", $("#defender"))).length > 0
        ) {
          $(
            $("div[class^='weaponList_'] > div", $("#defender"))[
              user2EquipedItemID
            ],
          ).css("background-color", "purple");
        }
      })
      .catch((err) => console.error(err));
  }

  return response;
};
