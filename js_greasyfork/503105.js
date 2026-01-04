// ==UserScript==
// @name Auto Coins
// @namespace https://bot-hosting.net/
// @version 1.0
// @description Automaticly claim coins on bot-hosting.net (You still need to complete captcha)
// @author Gyro3630
// @match https://bot-hosting.net/*
// @grant none
// @license MIT
// @icon https://bot-hosting.net/assets/img/bothosting2.png
// @downloadURL https://update.greasyfork.org/scripts/503105/Auto%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/503105/Auto%20Coins.meta.js
// ==/UserScript==

function clickclaimbutton() {
const button = document.querySelector("#app > div > section > section > article > div > main > div.form > div > div.earnBox > div > div > button")
if (button) {
button.click()
}
}

setInterval(clickclaimbutton, 1000);




function clickconfirm() {
var button = document.querySelector("body > div.swal-overlay > div > div.swal-footer > div > div")
if (button) {
button.click()
}
}

setInterval(clickconfirm, 1000);



function soloff() {
const button = document.querySelector("#adModal > div > span")
if (button) {
button.click()
}
}

setInterval(soloff, 1000);


function captchabypasser() {
var captcha = document.querySelector("body > div:nth-child(4) > div:nth-child(2)")
if (captcha) {
console.log("do captcha yourself")
}
}
clickclaimbutton()
clickconfirm()
soloff()