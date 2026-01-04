// ==UserScript==
// @name         OKCupid AutoLike by Percentage
// @include      https://*okcupid.com/discover
// @version      1.0
// @description  Automatically like/reject based on percentage
// @namespace https://greasyfork.org/users/756126
// @downloadURL https://update.greasyfork.org/scripts/424659/OKCupid%20AutoLike%20by%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/424659/OKCupid%20AutoLike%20by%20Percentage.meta.js
// ==/UserScript==

setInterval(function(){
var firstdigit = document.getElementsByClassName("cardsummary-match-pct")[0].innerHTML[0];
var logicdigit = (firstdigit=="8")||(firstdigit=="7")||(firstdigit=="6")||(firstdigit=="5")||(firstdigit=="4")||(firstdigit=="3")||(firstdigit=="2")||(firstdigit=="1");
if (logicdigit == true){
      document.getElementsByClassName("pass-pill-button-inner")[0].click();
      firstdigit = null;
      lengthcheck = null;
}
if (logicdigit == false){
      document.getElementsByClassName("likes-pill-button-inner")[0].click();
      firstdigit = null;
      lengthcheck = null;
}
}, 800);