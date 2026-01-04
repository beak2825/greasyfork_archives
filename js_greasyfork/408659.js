// ==UserScript==
// @name         [0] Show Balance in crypto + $
// @description  Every time you win a bet the script sends your desired % to the Vaulet
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      1.1
// @author       Dauersendung
// @match        https://stake.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/408659/%5B0%5D%20Show%20Balance%20in%20crypto%20%2B%20%24.user.js
// @updateURL https://update.greasyfork.org/scripts/408659/%5B0%5D%20Show%20Balance%20in%20crypto%20%2B%20%24.meta.js
// ==/UserScript==
function getCurrency() {
    return JSON.parse(localStorage.getItem("v2_currency")).currency;
}
function getRate(cur) {
    return JSON.parse(localStorage.getItem('v2_currency')).conversions.rates[cur];
}
function convertCurrency(cur, val) {
    return val * getRate(cur);
}
function getConversionElem() {
    var ele = document.querySelector("#conversionElem");
    if(ele == null) {
        ele = document.createElement("span");
        ele.id = "conversionElem";
        ele.innerText = "0.00$";
        document.querySelector(".styles__Wrap-rlm06o-0.bGSyHm").insertBefore(ele, null);
    }
    return ele;
}
function checkBalance() {
var curBalEle = document.querySelector(".styles__Cashier-puey40-2.dMSTdD .styles__Content-rlm06o-1.ixoRjG").innerText;
    var curBal = curBalEle.innerText;
    getConversionElem().innerText = convertCurrency(getCurrency(), curBalEle).toFixed(2) + "$";
}
window.setInterval(checkBalance, 1200);