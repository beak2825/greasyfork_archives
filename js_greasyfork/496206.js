// ==UserScript==
// @name         palette hotkeys
// @namespace    https://greasyfork.org/users/846553
// @version      1
// @description  hotkey
// @license      MIT
// @author       stal
// @match        https://sketchful.io/
// @grant        none
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/496206/palette%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/496206/palette%20hotkeys.meta.js
// ==/UserScript==
document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Digit1':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit2':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+1; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit3':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+2; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit4':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+3; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit5':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+4; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit6':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+5; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit7':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+6; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit8':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+7; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit9':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+8; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;
            case 'Digit0':
                var n = JSON.parse(localStorage.getItem("palettes")).length -parseInt(localStorage.getItem('paletteIndex'));
for(i = 0; i < n+9; i++) {document.querySelector("#gameTools > button.fas.fa-arrow-right").click();}
                break;

        }
    })