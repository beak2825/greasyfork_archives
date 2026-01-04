// ==UserScript==
// @name         digitask
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Claim 270474 dogetoshi (0.0002 USD) every minute
// @author       DINOLINO
// @match        https://digitask.ru/*
// @match        https://digitask.ru?r=DBxah19JkGMTvaD32RFH2araRxQ8DmX9io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digitask.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462363/digitask.user.js
// @updateURL https://update.greasyfork.org/scripts/462363/digitask.meta.js
// ==/UserScript==

(function() {
    'use strict';

var adress = "DBxah19JkGMTvaD32RFH2araRxQ8DmX9io";//Edit whith your faucetpay doge ,solve the first hcaptcha then leave the tab open, recaptcha solver need

setTimeout (() => {
    if ( document.URL =="https://digitask.ru/")
    { window.location.replace("https://digitask.ru?r=DBxah19JkGMTvaD32RFH2araRxQ8DmX9io");
    }},1000)

setInterval (() => {if (document.querySelector("#address")){
    document.querySelector("#address").value = adress; }},1000);

setTimeout(function(){if (document.querySelector("body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > form > div:nth-child(5) > button")){
    document.querySelector("body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > form > div:nth-child(5) > button").click()}},3000);

let Doge = setInterval(function XRP() {
    let btn = document.querySelector("#login")
    if (window.grecaptcha.getResponse().length > 0
       && btn && btn.value == 'Verify Captcha' ) {
        btn.click()
        clearInterval(Doge);
    }}, 10000)
setTimeout(function(){if (document.querySelector("#countdown > button")){
    document.querySelector("#countdown > button").click()}},3000);

setTimeout(function(){if (document.querySelector("#cf_alert_div > div > table > tbody > tr > td.refresh > a")){
    document.querySelector("#cf_alert_div > div > table > tbody > tr > td.refresh > a").click()}},3000);
setTimeout(function succeessclaime() {
    let succ = document.querySelector("body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > div.form > div.alert.alert-success.fade.show")
    if (succ && succ.innerText.includes("was sent")) {
        window.location.replace("https://digitask.ru?r=DBxah19JkGMTvaD32RFH2araRxQ8DmX9io")
    }}, 60000)
setTimeout(function succeessclaime() {
    let sleep = document.querySelector("body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > div.form > div.alert.alert-danger.fade.show")
    if (sleep && sleep.innerText.includes("wait")) {
        window.location.replace("https://digitask.ru?r=DBxah19JkGMTvaD32RFH2araRxQ8DmX9io")
    }}, 50000)
setTimeout(function stuck() {
        window.location.replace("https://digitask.ru?r=DBxah19JkGMTvaD32RFH2araRxQ8DmX9io")
    }, 350000)
})();