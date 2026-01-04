// ==UserScript==
// @name         Laptop Guy
// @version      1.1
// @description  LTG Quick
// @author       You
// @match        http*://www.swagbucks.com/?cmd=gn-jun-frame&acct=1
// @match        http*://static.jungroup.com/static_skins/*
// @match        http*://static.hyprmx.com/static_skins/*
// @match        http*://www.mypoints.com/jun-group*
// @grant        none
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/380557/Laptop%20Guy.user.js
// @updateURL https://update.greasyfork.org/scripts/380557/Laptop%20Guy.meta.js
// ==/UserScript==

function doStuff() {
//     if (window.location.href == "https://www.swagbucks.com/?cmd=gn-jun-frame&acct=1") {
//         var myFrame = document.getElementById("junFrame");
//         var myURL = "https://" + myFrame.getAttribute('src');
//         window.location.href = myURL;
//     }
//     else {
    var startButton = document.getElementById("webtraffic_popup_start_button");
    if (startButton.style.display == "") startButton.click();
    var restartButton = document.getElementById("thank_you");
//        if (restartButton.style.display != "none") {
  //          window.location.href = "https://www.swagbucks.com/?cmd=gn-jun-frame&acct=1";
    //        alert("Hey! It's done!");
      //  }
    var nextButton = document.getElementById("webtraffic_popup_next_button");
    if (nextButton.className == "active webtraffic_button") nextButton.click();
    //var nextButton2 = document.getElementsByClassName("nextstepimg");
    //if (nextButton2.length > 0) nextButton2[0].click();
//    }
}

setInterval(doStuff, 2500)