// ==UserScript==
// @name         Gmail Auto-Menu Disabler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script disiables the Gmail AutoMenu when you hover over there.
// @author       marc0u
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387417/Gmail%20Auto-Menu%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/387417/Gmail%20Auto-Menu%20Disabler.meta.js
// ==/UserScript==

var elTarget = document.getElementsByClassName("nH oy8Mbf nn");
var btnTarget = document.querySelector('[aria-label="Main menu"]');

function ready() {
    console.log(btnTarget);
    if (elTarget.length == 0){
        elTarget = document.getElementsByClassName("nH oy8Mbf nn");
    }
    if (btnTarget == null){
        btnTarget = document.querySelector('[aria-label="Main menu"]');
    }
    if (elTarget.length > 0 && btnTarget != null){
        console.log("------------------------------");
        console.log("AUTOMENU DISABLER v1.0 LOADED!");
        console.log("------------------------------");
        btnTarget.addEventListener("click", addButtonAction1);
        elTarget[0].classList.remove("aeN");
    } else{
        console.log("------------------------------------------");
        console.log("¡¡ERROR!! AUTOMENU DISABLER v1.0 ¡¡ERROR!!");
        console.log("------------------------------------------");
    }
}

function addButtonAction1(){
    btnTarget.removeEventListener("click", addButtonAction1);
    btnTarget.addEventListener("click", addButtonAction2);
    elTarget[0].classList.add("aeN");
    elTarget[0].classList.remove("bhZ");
}

function addButtonAction2(){
    btnTarget.removeEventListener("click", addButtonAction2);
    btnTarget.addEventListener("click", addButtonAction1);
    elTarget[0].classList.add("bhZ");
    elTarget[0].classList.remove("aeN")
}

window.onload = function() {
    ready();
};