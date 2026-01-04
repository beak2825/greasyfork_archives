// ==UserScript==
// @name         Robux Spoofer PLUS
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  This allows you to change both your Robux on the corner AND when you click on it! Even better fooling! Press ESC to change the amount! Numbers are formatted with K's and M's and B's!
// @author       Siydge (Modified)
// @match        https://www.roblox.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464901/Robux%20Spoofer%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/464901/Robux%20Spoofer%20PLUS.meta.js
// ==/UserScript==

var amount = 12820

document.addEventListener('keydown', function(event){
	if(event.key === "Escape"){
    var UsernameDoc = document.getElementsByClassName("age-bracket-label-username")[0]
    console.log(UsernameDoc)
    var _ = prompt("Choose the Number to set "+UsernameDoc.innerHTML+"'s Robux to")
    console.log(Number.isInteger(_))
    if(!isNaN(_)){setValue(_);}else{setValue(0);}
    var a = getValue("RobuxSaved", "default").then(function(result){
      amount = result
    })
	}
});

function setValue(amount){GM.setValue("RobuxSaved", amount)}
function getValue(name){return GM.getValue(name)}
(async function(){
  console.log("HAHAHAHAHA!!!")
  getValue("RobuxSaved", "default").then(function(result){
    if(result != "default" && result != "undefined"){
      amount = result;
      console.log(result);
    }
  })
})();

function format(num) {
  if(num < 1000){ return num.toString() }
  if(num > 999 && num < 1000000){
    return num.toString().substring(0,num.toString().length-3) + "K+";
  }
  if(num > 999999 && num < 1000000000){
    return num.toString().substring(0,num.toString().length-6) + "M+";
  }
  if(num > 999999999){
    return num.toString().substring(0,num.toString().length-9) + "B+";
  }
}

function start() {
  var robux = document.getElementById("nav-robux-amount");
  if(robux && robux.innerHTML !== format(amount)) {
    robux.innerHTML = format(amount);
  }
  var robux2 = document.getElementById("nav-robux-balance");
  if(robux2 && robux2.innerHTML && robux2.innerHTML !== amount.toLocaleString()) {
    robux2.innerHTML = amount.toLocaleString()+' Robux';
  }
  setTimeout(start, 0);
}
start();