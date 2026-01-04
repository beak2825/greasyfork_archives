// ==UserScript==
// @name         FAST.COM auto
// @version      0.10
// @description  auto test
// @match        *://fast.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1354338
// @downloadURL https://update.greasyfork.org/scripts/504219/FASTCOM%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/504219/FASTCOM%20auto.meta.js
// ==/UserScript==

function restartTest(){
  const button = document.getElementById("speed-progress-indicator");
  if(!button )return;
  if(button.className.includes("succeeded")){
    console.log("restart testing")
    button.click();
  }
}

(function() {
  setInterval(restartTest, 500);
})();