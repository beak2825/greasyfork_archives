// ==UserScript==
// @name         (OLD)UGC Sniper (pain)(for roblox)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  pain sniper is the newest one
// @author       fishcat#2431
// @match        https://www.roblox.com/catalog/*
// @match        https://www.roblox.com/bundles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/464323/%28OLD%29UGC%20Sniper%20%28pain%29%28for%20roblox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464323/%28OLD%29UGC%20Sniper%20%28pain%29%28for%20roblox%29.meta.js
// ==/UserScript==

function snipeitem() {
 const buttons = document.querySelectorAll('button');
 const buyButton = Array.from(buttons).find((button) => button.textContent === 'Buy');
 buyButton.click();
 setTimeout(() => {
   const buttons2 = document.querySelectorAll('button');
   const buyButton2 = Array.from(buttons2).find((button) => button.textContent === 'Get Now');
   buyButton2.click();
   window.location.reload();
   /*setTimeout(() => {
     const buttons3 = document.querySelectorAll('button');
     const buyButton3 = Array.from(buttons3).find((button) => button.textContent === 'Not Now');
     buyButton3.click();
     setTimeout(snipeitem, 1000);
   }, 500);
window.location.reload()*/
 }, 500);
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
    }
}, 100);