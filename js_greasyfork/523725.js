// ==UserScript==
// @name        Pcgamebenchmark Auto fill
// @namespace   Violentmonkey Scripts
// @match       *://*.pcgamebenchmark.com/*
// @grant       none
// @license MIT
// @version     1.0
// @author      SebMa
// @description Auto enters PC specs into fields
// @downloadURL https://update.greasyfork.org/scripts/523725/Pcgamebenchmark%20Auto%20fill.user.js
// @updateURL https://update.greasyfork.org/scripts/523725/Pcgamebenchmark%20Auto%20fill.meta.js
// ==/UserScript==

var gpu = 'Input your GPU'
var cpu = 'Input your CPU'
var ram = 'Input the amount of RAM here'


var buttons = document.getElementsByClassName("button secondary"); // finds all secondary buttons
var secondButton = buttons[1]; // Selects the second button // selects the correct button

document.querySelector('input[name="gpu-value"]').value = gpu; // selects gpu
document.querySelector('input[name="gpu"]').value = gpu; // selects gpu
console.log("selected gpu");


document.querySelector('input[name="cpu-value"]').value = cpu; // selects cpu
document.querySelector('input[name="cpu"]').value = cpu; // selects cpu
console.log("selected cpu");


document.getElementById('form-hardware-memory').value = ram; // selects memory
console.log("selected ram");

secondButton.click(); // clicks the test button, not working but doesnt really need to work