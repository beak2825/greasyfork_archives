// ==UserScript==
// @name        PwnBonappetit
// @namespace   pwa
// @match       https://*bonappetit.com/*
// @icon        https://www.bonappetit.com/favicon.ico
// @license     MIT
// @grant       none
// @author      pwa
// @description 10/10/2023, 01:01:01 PM
// @version 0.0.1.20231012140705
// @downloadURL https://update.greasyfork.org/scripts/477257/PwnBonappetit.user.js
// @updateURL https://update.greasyfork.org/scripts/477257/PwnBonappetit.meta.js
// ==/UserScript==

//let nag_sel = "PersistentBottomWrapper-eddooY";

window.hack = function() {
  console.log("hack...");
  document.querySelector(".PersistentBottomWrapper-eddooY").style.visibility = "hidden";
  //document.querySelector(".PersistentBottomWrapper-eddooY").style.display = 'none';
}


var rid = setInterval(function() {
  console.log("[+] checking availability...");

  let sel = document.querySelector(".PersistentBottomWrapper-eddooY");
  console.log("style:", sel.style.visibility);
  if (sel.style.visibility !== "hidden") {
    window.hack();
    clearInterval(rid);
    return;
  }
  //console.log("not yet available");
}, 1000);

