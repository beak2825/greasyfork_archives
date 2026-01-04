// ==UserScript==
// @name        Login Wall Bypass
// @namespace   Violentmonkey Scripts
// @match       https://www.wattpad.com/*
// @grant       none
// @version     1.0
// @author      AstroVD
// @description 17/02/2021 à 16:37:50
// @downloadURL https://update.greasyfork.org/scripts/421896/Login%20Wall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/421896/Login%20Wall%20Bypass.meta.js
// ==/UserScript==

//WATTPAD
if (location.href.startsWith("https://www.wattpad.com/")){
  wtpnames = [".modal-dialog.signup-modal-wrapper",".modal-backdrop.fade.in",".modal.fade.in","#generic-modal"]
  wtpnamesdone = []
  var wtpinterval = setInterval(function(){
    for (i in wtpnames){
      //console.log(wtpnames[i])
      //console.log(i)
      document.querySelectorAll(wtpnames[i]).forEach(function(wtpitem) {
        wtpitem.remove()
        wtpnamesdone.push(wtpnames[i])
      });
    }
    document.querySelector("body").classList.remove("modal-open")
    var donetest = 0
    if (donetest == 0){
      for (i in wtpnames){
        if (wtpnamesdone.includes(wtpnames[i])){console.log(wtpnames[i] + " included")}
        else{donetest = -1}
      }
      if (donetest == 0){donetest = 1}
    }
    if (donetest == 1){
      console.log("all done!")
      clearInterval(wtpinterval)
    }
  }, 45);
}