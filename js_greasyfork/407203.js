// ==UserScript==
// @name         Scroll button Voxer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  xdddd
// @author       Mav3ricK
// @match        https://www.voxed.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407203/Scroll%20button%20Voxer.user.js
// @updateURL https://update.greasyfork.org/scripts/407203/Scroll%20button%20Voxer.meta.js
// ==/UserScript==

 window.onload = function ()
    {

     var element = document.querySelector('.commentsVoxCount');
     var divB = document.createElement("div");
     var iconB = document.createElement("i");

     element.insertBefore(divB, element.childNodes[0]);

     divB.setAttribute("id", "buttonToDown");
     divB.setAttribute("class", "attachButton tooltip-bottom");
     divB.addEventListener("click", function() {scrollpage();}, false);

     divB.appendChild(iconB);
     iconB.setAttribute("class", "fas fa-arrow-circle-down");

    var Height=document.documentElement.scrollHeight;
    function scrollpage() {

        window.scrollTo(0,Height);
    }
   

 }