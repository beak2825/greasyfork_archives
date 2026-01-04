// ==UserScript==
// @name        iJoiner
// @namespace   Violentmonkey Scripts
// @match       https://student.iclicker.com/*
// @grant       none
// @version     1.1
// @license     MIT
// @author      DeathMage_75
// @description 9/28/2023, 11:30:22 AM
//              automatically joins classes for you
// @downloadURL https://update.greasyfork.org/scripts/477197/iJoiner.user.js
// @updateURL https://update.greasyfork.org/scripts/477197/iJoiner.meta.js
// ==/UserScript==
(function() {
let counter = 0;
unsafeWindow.setInterval(function() {
  if (counter < 10) {
    console.log("iJoiner Starting ");
    counter++;
  }
    const joinButton = unsafeWindow.document.querySelector("button#btnJoin.join-button.white-focus");
    const innerContainer = unsafeWindow.document.querySelector("div#join-inner-container");
    const buttonStyles = unsafeWindow.getComputedStyle(innerContainer);

    if(buttonStyles.getPropertyValue("display") != "none")
      {
        joinButton.click();
      }
  }
, 500);
})();