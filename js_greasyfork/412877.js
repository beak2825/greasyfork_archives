// ==UserScript==
// @name         [000] Hotkeys bc.game dice
// @description  //amount x2 (E) //amount x1/2 (W) //amount min (Q) //amount max (R)
// @description  //chance +5 (A) //chance -5 (S) //chance min (D) //chance max (F)
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @grant        window.close
// @run-at       document-start
// @version      1.0
// @match        https://bc.game/dice
// @ include     https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412877/%5B000%5D%20Hotkeys%20bcgame%20dice.user.js
// @updateURL https://update.greasyfork.org/scripts/412877/%5B000%5D%20Hotkeys%20bcgame%20dice.meta.js
// ==/UserScript==

//amount x2 (E) //amount x1/2 (W) //amount min (Q) //amount max (R)
//chance +5 (A) //chance -5 (S) //chance min (D) //chance max (F)


//buttons lesen
//document.addEventListener("keydown", function(event) {
//  console.log(event.which);
//})
//buttons lesen

//chance min
//document.getElementsByClassName("xinput-after")[2].getElementsByClassName("xbutton amount-scale")[0]

//chance-5
//document.getElementsByClassName("xinput-after")[2].getElementsByClassName("xbutton amount-scale")[1]

//chance+5
//document.getElementsByClassName("xinput-after")[2].getElementsByClassName("xbutton amount-scale")[2]

//chanc max
//document.getElementsByClassName("xinput-after")[2].getElementsByClassName("xbutton amount-scale")[3]

//amount max
//document.getElementsByClassName("xinput-after")[3].getElementsByClassName("xbutton amount-scale")[0]

//amount x 1/2
//document.getElementsByClassName("xinput-after")[3].getElementsByClassName("xbutton amount-scale")[1]

//amount x 2
//document.getElementsByClassName("xinput-after")[3].getElementsByClassName("xbutton amount-scale")[2]

//amount min
//document.getElementsByClassName("xinput-after")[3].getElementsByClassName("xbutton amount-scale")[3]


//amount //amount //amount //amount //amount //amount //amount //amount //amount //amount //amount //amount
//amount max
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyR") {
document.getElementsByClassName("xinput-after")[3].getElementsByClassName("xbutton amount-scale")[0].click();
    event.preventDefault();
  }
});

//amount min
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyQ") {
document.getElementsByClassName("xinput-after")[3].getElementsByClassName("xbutton amount-scale")[3].click();
    event.preventDefault();
  }
});

//amount 1/2
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyW") {
document.getElementsByClassName("xinput-after")[3].getElementsByClassName("xbutton amount-scale")[1].click();
    event.preventDefault();
  }
});

//amount x2
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyE") {
document.getElementsByClassName("xinput-after")[3].getElementsByClassName("xbutton amount-scale")[2].click();
    event.preventDefault();
  }
});
//amount //amount //amount //amount //amount //amount //amount //amount //amount //amount //amount //amount


//chance //chance //chance //chance //chance //chance //chance //chance //chance //chance //chance //chance //chance
//chance max
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyF") {
document.getElementsByClassName("xinput-after")[2].getElementsByClassName("xbutton amount-scale")[3].click();
    event.preventDefault();
  }
});

//chance min
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyA") {
document.getElementsByClassName("xinput-after")[2].getElementsByClassName("xbutton amount-scale")[0].click();
    event.preventDefault();
  }
});

//chance -5
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyS") {
document.getElementsByClassName("xinput-after")[2].getElementsByClassName("xbutton amount-scale")[1].click();
    event.preventDefault();
  }
});

//chance +5
document.addEventListener("keydown", function(event) {
    if (event.code === "KeyD") {
document.getElementsByClassName("xinput-after")[2].getElementsByClassName("xbutton amount-scale")[2].click();
    event.preventDefault();
  }
});
//chance //chance //chance //chance //chance //chance //chance //chance //chance //chance //chance //chance //chance


//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play
document.addEventListener("keydown", function(event) {
 if (event.code === "ControlLeft") {
  //   (event.ctrlKey == 'ControlLeft' && (event.ctrlKey || event.metaKey)) {
   document.getElementsByClassName("xbutton xbutton-big xbutton-full")[0].click();
    event.preventDefault();
  }
});
//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play//play