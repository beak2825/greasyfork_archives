// ==UserScript==
// @name         description
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  No description
// @author       unknown
// @match        https://www.onlineliga.de/*
// @downloadURL https://update.greasyfork.org/scripts/470399/description.user.js
// @updateURL https://update.greasyfork.org/scripts/470399/description.meta.js
// ==/UserScript==

function checkCon(teamIDOfManager){
  if(teamIDOfManager==32830){
    olOverlayWindow.load("/office/contracts/termination?contractId=3627215");
    $("#overlayWindow").css("visibility", "hidden");
    $("#overlayWindow").css("visibility", "visible");
  count = 2;
  }
}