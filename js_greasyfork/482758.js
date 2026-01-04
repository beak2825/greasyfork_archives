// ==UserScript==
// @name         Hejto-dodatkowe ikonki nawigacyjne
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hejto-dodatkowe ikonki nawigacyjne i szary pasek
// @author       You
// @match        https://www.hejto.pl/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482758/Hejto-dodatkowe%20ikonki%20nawigacyjne.user.js
// @updateURL https://update.greasyfork.org/scripts/482758/Hejto-dodatkowe%20ikonki%20nawigacyjne.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var element = document.querySelector("#__next > div > header > div.max-w-screen-lg.w-full.mx-auto.flex.items-center.px-2.lg\\:px-0.relative.gap-1\\.5")

    // Change color to gray
    element.style.backgroundColor = "#616161";

    // Create link element
    var link = document.createElement("a");
    link.href = "https://www.hejto.pl/najnowsze/typ/artykuly";


    // Create icon element
    var icon = document.createElement("img");
    icon.src = "https://upload.wikimedia.org/wikipedia/commons/c/cf/OOjs_UI_icon_eye.svg";
    icon.style.width = "25px";
    icon.style.height = "25px";

    // Add icon to link
    link.appendChild(icon);

    // Style link
    link.style.position = "fixed";
    link.style.top = "5%";
    link.style.left = "28%";
    link.style.transform = "translate(-50%, -50%)";
    link.style.zIndex = "9999";

    // Add link to body
    document.body.appendChild(link);


    // Create scroll-bottom icon
    var scrollBottom = document.createElement("img");
  scrollBottom.src = "https://cdn-icons-png.flaticon.com/512/9403/9403190.png";
    scrollBottom.style.width = "27px";
    scrollBottom.style.height = "27px";
    scrollBottom.style.cursor = "pointer";
    scrollBottom.style.position = "fixed";
       scrollBottom.style.top = "19px";
       scrollBottom.style.left = "20%";
    scrollBottom.style.zIndex = "9999";
    scrollBottom.onclick = function() {
        window.scrollTo(0, document.body.scrollHeight);
    };



     // Create scroll-top icon
    var scrollTop = document.createElement("img");
  scrollTop.src = "https://cdn-icons-png.flaticon.com/512/4196/4196777.png";
  
    scrollTop.style.width = "35px";
    scrollTop.style.height = "35px";
    scrollTop.style.cursor = "pointer";
    scrollTop.style.position = "fixed";
      scrollTop.style.top = "15px";
      scrollTop.style.left = "23%";

    scrollTop.style.zIndex = "9999";
    scrollTop.onclick = function() {
        window.scrollTo(0, 0);
    };


    // Add icons to body
    document.body.appendChild(scrollTop);
   document.body.appendChild(scrollBottom);

    // Create prev-page icon
    var prevPage = document.createElement("img");
    prevPage.src = "https://upload.wikimedia.org/wikipedia/commons/c/ca/Font_Awesome_5_solid_arrow-circle-left.svg";
    prevPage.style.width = "25px";
    prevPage.style.height = "25px";
    prevPage.style.cursor = "pointer";
    prevPage.style.position = "fixed";
	   prevPage.style.top = "3%";
       prevPage.style.left = "15%";

    prevPage.style.zIndex = "9999";
    prevPage.onclick = function() {
        window.history.back();
    };

    // Create next-page icon
    var nextPage = document.createElement("img");
    nextPage.src = "https://upload.wikimedia.org/wikipedia/commons/c/ce/Font_Awesome_5_solid_arrow-circle-right.svg";
    nextPage.style.width = "25px";
    nextPage.style.height = "25px";
    nextPage.style.cursor = "pointer";
    nextPage.style.position = "fixed";
	   nextPage.style.top = "3%";
       nextPage.style.left = "17%";

    nextPage.style.zIndex = "9999";
    nextPage.onclick = function() {
        window.history.forward();
    };

    // Add icons to body
    document.body.appendChild(prevPage);
    document.body.appendChild(nextPage);
})();
