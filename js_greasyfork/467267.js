// ==UserScript==
// @name         UGC Sniper (pain)(for roblox)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  reload page and spam buys pls dont skid
// @author       fishcat#2431
// @match        https://www.roblox.com/catalog/*
// @match        https://www.roblox.com/bundles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/467267/UGC%20Sniper%20%28pain%29%28for%20roblox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467267/UGC%20Sniper%20%28pain%29%28for%20roblox%29.meta.js
// ==/UserScript==

const MAX_PRICE = 50; //edit this number to change max price
const Check_Price = true; //edit to check price

function snipeitem() {
 const buttons = document.querySelectorAll('button');
 const buyButton = Array.from(buttons).find((button) => button.textContent === 'Buy');
 buyButton.click();
 const rb = document.getElementsByClassName("text-robux-lg")[0].innerText
 var MPC = rb <= MAX_PRICE
 if (false == Check_Price){
       buyButton.click();
   }else{
          if (true == MPC) {
          console.log("can buy")
          buyButton.click();
         }else{
         alert("price too high")
      }
   }
   document.getElementById("refresh-details-button").click();
 /* setTimeout(() => {
   const buttons2 = document.querySelectorAll('button');
   const buyButton2 = Array.from(buttons2).find((button) => button.textContent === 'Buy Now');
   if (false == Check_Price){
       buyButton2.click();
   }else{
          if (true == MPC) {
          console.log("can buy")
          buyButton2.click();
         }else{
         alert("price too high")
      }
   }
   document.getElementById("refresh-details-button").click();
   setTimeout(() => {
     const buttons3 = document.querySelectorAll('button');
     const buyButton3 = Array.from(buttons3).find((button) => button.textContent === 'Not Now');
     buyButton3.click();
     setTimeout(snipeitem, 1000);
   }, 500);
window.location.reload()
 }, 500); */
}

var intv = setInterval(function() {
    var elems = document.getElementsByClassName("btn-growth-lg btn-fixed-width-lg")
    if(elems.length < 1){
        return false;
    }
    //when element is found, clear the interval.by fishcat#2431
    clearInterval(intv);
    for (var i = 0, len = elems.length; i < len; i++){
        elems[i].value = "";
        console.log("by fishcat#2431")
        snipeitem();
        document.getElementById("refresh-details-button").click();
    }
}, 100);