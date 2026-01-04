// ==UserScript==
// @name         GenkiSushiTotalPrice
// @namespace    https://hkfoggyu.github.io/
// @version      0.5
// @description  Calculate the total price of Genki Sushi
// @author       Young
// @supportURL   https://github.com/HKFoggyU/USTscripts
// @match        https://genki*.order.place/*
// @icon         none
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445243/GenkiSushiTotalPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/445243/GenkiSushiTotalPrice.meta.js
// ==/UserScript==

function calcTotalPrice() {
    let cols = document.getElementsByClassName("col");
    var totalPrice = 0.0;
    var dishes = [];
    for (var i=7; i<cols.length; i+=4) {
        //dishes.push(cols[i]);
        totalPrice += parseFloat(cols[i].childNodes[4].innerText.slice(1))
    }
    return totalPrice;
}

function displayPrice() {
    var totalPrice = calcTotalPrice();
    var outputText = `Total price: $${totalPrice}`;
    //try { var rawText = document.getElementsByClassName("update-time-text")[0].children[0].innerText; } catch(error) { console.log("[-] Element DNE."); };
    try { document.getElementsByClassName("update-time-text")[0].children[0].innerText = outputText; } catch(error) { console.log("[-] Element DNE."); };
    try { console.log("[+] "+outputText); } catch(error) { console.log("[-] Total Price DNE."); };
}

(function() {
    'use strict';
    //displayPrice();
    console.log("[+] Started.");
    setInterval(displayPrice, 1000);
    // Your code here...
})();
