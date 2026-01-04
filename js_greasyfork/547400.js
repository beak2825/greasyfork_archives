// ==UserScript==
// @name         Myfaucet.club Auto Roll
// @namespace    FXVNPRo Scripts Manager
// @match        https://myfaucet.club/faucet*
// @grant        none
// @license MIT
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version      1.0
// @description  Myfaucet.club Auto Roll after captcha sloved
// @downloadURL https://update.greasyfork.org/scripts/547400/Myfaucetclub%20Auto%20Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/547400/Myfaucetclub%20Auto%20Roll.meta.js
// ==/UserScript==

function autoClaim() {
  
  let firstBtn = document.querySelector('button.btn.btn-primary.btn-lg[data-bs-toggle="modal"]');
  if (firstBtn) {
    firstBtn.click(); 
    
    
    setTimeout(() => {
      let secondBtn = document.querySelector('button.btn.btn-primary[type="submit"]');
      if (secondBtn) {
        secondBtn.click();
        console.log(" click claim!");
      } else {
        console.log("No");
      }
    }, 3000);
  } else {
    console.log("No");
  }
}


setInterval(autoClaim, 310000);