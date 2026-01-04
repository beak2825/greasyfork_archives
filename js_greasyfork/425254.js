// ==UserScript==
// @name         Carbon.now.sh Clipboard autocopy
// @namespace    https://greasyfork.org/en/users/171187-eivl
// @version      0.3
// @description  Clicks the copy to image button when you load the page
// @author       Eivind Teig
// @match        https://carbon.now.sh/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/425254/Carbonnowsh%20Clipboard%20autocopy.user.js
// @updateURL https://update.greasyfork.org/scripts/425254/Carbonnowsh%20Clipboard%20autocopy.meta.js
// ==/UserScript==

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}


(function() {
    'use strict';
    let container = document.getElementById("export-container");
    let codemirror = document.getElementsByClassName("react-codemirror2")[0];
    container.style.width = "1024px";
    codemirror.style.width = "900px";
    wait(100);
    let menu_button = document.getElementsByClassName("copy-menu-container")[0].querySelector('button');
    menu_button.click();
    document.getElementById("export-clipboard").click();
})();
