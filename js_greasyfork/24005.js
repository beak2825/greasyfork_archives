// ==UserScript==
// @name         Youtube Sound Slider Always Show
// @namespace    Show Youtub Sound Slider bar
// @description  Show youtube sound slider bar without hovering
// @author       Absolute
// @version      1.1.2
// @match        http*://www.youtube.com/*
// @icon         https://youtube.com/favicon.ico
// @copyright    Absolute
// @license      BSD
// @grant        None

// @downloadURL https://update.greasyfork.org/scripts/24005/Youtube%20Sound%20Slider%20Always%20Show.user.js
// @updateURL https://update.greasyfork.org/scripts/24005/Youtube%20Sound%20Slider%20Always%20Show.meta.js
// ==/UserScript==

  (function() {

   setTimeout(function () { ShowSlider(); },1000);
   setTimeout(function () { ShowSlider(); },2000);
   setTimeout(function () { ShowSlider(); },3000);
   setTimeout(function () { ShowSlider(); },5000);
   setTimeout(function () { ShowSlider(); },10000);

   function ShowSlider () {
   var css_1 = document.querySelector(".ytp-volume-panel");
   css_1.style.width = "52px";
   css_1.style.marginRight = "3px";
   var ccs_2 = document.querySelector(".ytp-big-mode .ytp-volume-panel");
   ccs_2.style.width = "78px";
   ccs_2.style.marginRight = "5px";

   }})();
  


