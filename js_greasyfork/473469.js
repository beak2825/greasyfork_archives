// ==UserScript==
// @name         BG color Fix
// @namespace    bg_color_fix_owot
// @version      1
// @description  This userscript fixes the BG color not being set and you needing to click a preset first.
// @author       e_g.
// @match        https://*.ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473469/BG%20color%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/473469/BG%20color%20Fix.meta.js
// ==/UserScript==

function updateBgColor(){
    w.changeBgColor(parseInt(document.getElementsByClassName("jscolor")[1].value, 16) || -1);
}
let bgColorModal = document.getElementsByClassName("modal_client")[4];
bgColorModal.firstChild.lastChild.firstChild.addEventListener("click", updateBgColor);
bgColorModal.onkeydown = function(e){
    if(checkKeyPress(e, "ENTER")) updateBgColor();
}