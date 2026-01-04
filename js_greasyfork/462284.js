// ==UserScript==
// @name         cryptof
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Claim 78904 satoshi (0.0003 USD) every minute
// @author       Dinolino
// @match        https://cryptofuture.co.in/ripple/
// @match        https://cryptofuture.co.in/ripple/?r=dinolino2014@gmail.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptofuture.co.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462284/cryptof.user.js
// @updateURL https://update.greasyfork.org/scripts/462284/cryptof.meta.js
// ==/UserScript==

(function() {
    'use strict';

var adress = "dinolino2014@gmail.com";//Edit whith your faucetpay email,go to "https://cryptofuture.co.in/ripple/" and leave IT open, recaptcha and ABlink 


setTimeout (() => {
    if ( document.URL =="https://cryptofuture.co.in/ripple/")
    { window.location.replace("https://cryptofuture.co.in/ripple/?r=dinolino2014@gmail.com");
    }},1000)

setInterval (() => {if (document.querySelector("#address")){
    document.querySelector("#address").value = adress; }},1000);

setTimeout(function(){if (document.querySelector("#faucet_form > div:nth-child(4) > button")){
    document.querySelector("#faucet_form > div:nth-child(4) > button").click()}},3000);

let Ripple = setInterval(function XRP() {
    let btn = document.querySelector("#login")
    let antibotsolved = document.querySelector("#antibotlinks_reset")
    if (window.grecaptcha.getResponse().length > 0
       && btn && btn.value == 'Verify Captcha' && antibotsolved && antibotsolved.style.display !== 'none') {
        btn.click()
        clearInterval(Ripple);
    }}, 10000)

setTimeout(function ablink() {
    let antibot = document.querySelector("#antibotlinks_reset")
    if (antibot && antibot.style.display == 'none') {
        window.location.replace("https://cryptofuture.co.in/ripple/?r=dinolino2014@gmail.com")
    }}, 5*60000)
setTimeout(function succeessclaime() {
    let succ = document.querySelector("body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > div.form > div.alert.alert-success.fade.show > i")
    if (succ && succ.innerText.includes("was sent")) {
        window.location.replace("https://cryptofuture.co.in/ripple/?r=dinolino2014@gmail.com")
    }}, 60000)
setTimeout(function succeessclaime() {
    let sleep = document.querySelector("body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > div.form > div.alert.alert-danger.fade.show")
    if (sleep && sleep.innerText.includes("wait")) {
        window.location.replace("https://cryptofuture.co.in/ripple/?r=dinolino2014@gmail.com")
    }}, 60000)
setTimeout(function stuck() {
        window.location.replace("https://cryptofuture.co.in/ripple/?r=dinolino2014@gmail.com")
    }, 10*60000)
})();