// ==UserScript==
// @name         Homestar Runner Fullscreen 
// @namespace    http://baconbytes.me
// @version  0.4
// @description  Maximizes size of flash video while keeping aspect ratio
// @author       Grant Bacon <btnarg at the mail site google made>
// @match        http*://*homestarrunner.com/*.html
// @grant        
// @downloadURL https://update.greasyfork.org/scripts/12993/Homestar%20Runner%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/12993/Homestar%20Runner%20Fullscreen.meta.js
// ==/UserScript==

window.onresize = function() {
   var movieElement = document.querySelectorAll("embed")[0],
       width = document.body.clientWidth,
       height = document.body.clientHeight,
       aspectRatio = 550/400; // width/height taken from original element


   if (movieElement) {
       // 20 pixels are removed on each dimension to save space for footer
       movieElement.style.width = (height * aspectRatio - 20) + "px";
       movieElement.style.height = (height - 20) + "px";
   }

};

window.onresize();
