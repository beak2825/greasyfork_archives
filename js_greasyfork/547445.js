// ==UserScript==
// @name Auto Claim Faucet Earnbitmoon 2025
// @namespace FXVNPRo Scripts
// @match https://earnbitmoon.club/*
// @grant none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 1.0.2
// @description Auto claim faucet with captcha sloved
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547445/Auto%20Claim%20Faucet%20Earnbitmoon%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/547445/Auto%20Claim%20Faucet%20Earnbitmoon%202025.meta.js
// ==/UserScript==

function autoRoll() {

let firstBtn = document.querySelector('button[data-toggle="modal"][data-target="#modal2my"]');
if (firstBtn) {
firstBtn.click();
console.log("Click ROLL NOW");


setTimeout(() => {
let secondBtn = document.querySelector('button.zxz[onclick="starzRoll3();"]');
if (secondBtn) {
secondBtn.click();
console.log("click Press & Win");
} else {
console.log("OK");
}
}, 30000);
} else {
console.log("Not found");
}
}


autoRoll();


setInterval(() => {
console.log("Reload...");
location.reload();
}, 7 * 60 * 1123);