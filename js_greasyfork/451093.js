// ==UserScript==
// @name         Robux changer 😎
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  Press escape on a roblox site to change robux. Not real robux.
// @author       Gunnar Discord
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM.setValue
// @grant GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451093/Robux%20changer%20%F0%9F%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/451093/Robux%20changer%20%F0%9F%98%8E.meta.js
// ==/UserScript==
 
var originalrobux
var originalbalance
 
 
window.addEventListener('DOMContentLoaded', (event) => {
        var originalrobux = document.getElementById("nav-robux-amount").textContent();
    var originalbalance = document.getElementById("nav-robux-balance").textContent();
});
var RobuxAmount = 10813152;
document.addEventListener('keydown', function(event){
	if(event.key === "Escape"){
        console.log("a");
        var _ = prompt("Amount to save\nwrite 'none' to have original value")
        console.log(Number.isInteger(_))
        if(!isNaN(_)){setValue(_)}else{setValue(10813152)}
        var a = getValue("RobuxSaved", "default").then(function(result){
        RobuxAmount = result
        console.log(result)})
 
	}
});
function setValue(amount){GM.setValue("RobuxSaved", amount)}
function getValue(name){return GM.getValue(name)}
function a23(){getValue("RobuxSaved", "default").then(function(result){if(result != "default" && result != "undefined"){RobuxAmount = result; console.log(result)};})}
async function ads(){await a23()}
 
 
ads()
 
 
 
 
 
 
 
function Robux() {
    if(RobuxAmount != 10813152){
    try{
    var robux = document.getElementById("nav-robux-amount");
    var balance = document.getElementById("nav-robux-balance");
    robux.innerHTML = RobuxAmount;
    balance.innerHTML = RobuxAmount + " Robux";
    balance.title = RobuxAmount;
    }
    catch(error){if(!error == "TypeError: Cannot set properties of null (setting 'innerHTML')"){console.log(error)}}
    }else{try{robux = originalrobux; balance.innerHTML = originalbalance; balance.title = originalbalance + " Robux"}catch(error){if(!error == "TypeError: Cannot set properties of null (setting 'innerHTML')"){console.log(error)}}}};
 
setInterval(Robux, 1);