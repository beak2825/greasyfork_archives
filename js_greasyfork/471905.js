// ==UserScript==
// @name         Group AutoClaimer (Automaticaly join and claim ownership)
// @namespace    http://roblox.com
// @match        https://*.roblox.com/groups/*
// @version      44.4
// @author       Mendy
// @grant        none
// @run-at       document-idle
// @description  Claim ownership instantly
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/471905/Group%20AutoClaimer%20%28Automaticaly%20join%20and%20claim%20ownership%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471905/Group%20AutoClaimer%20%28Automaticaly%20join%20and%20claim%20ownership%29.meta.js
// ==/UserScript==

setTimeout(function() {
  $('#group-join-button').click(); //join group
  $('.icon-more').click(); //open "more" tab
  setTimeout(function() {
    const claimOwnershipBtn = $('#claim-ownership button'); //claims ownership
    if (claimOwnershipBtn.length) {
      claimOwnershipBtn.click();
      console.log("Claim Ownership clicked!");
    } else {
      console.log("Claim Ownership button not found.");
    }
  }, 890); // Claim ownership timer (This must be higher than Join group time)
}, 820); //Join group timer (This must be lower than Claim ownership time)
