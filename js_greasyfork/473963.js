// ==UserScript==
// @name         viefaucet.xyz
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Faucet
// @author       White
// @match        https://viefaucet.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=viefaucet.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473963/viefaucetxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/473963/viefaucetxyz.meta.js
// ==/UserScript==

var email = ""
if (window.location.href === "https://viefaucet.xyz/") {
   window.location.replace("https://viefaucet.xyz/?r=23");
}
if (window.location.href === "https://viefaucet.xyz/?r=23") {
     window.location.replace("https://viefaucet.xyz/login");
}
if (window.location.href === "https://viefaucet.xyz/login") {
setTimeout(function login() {
let mailform = document.querySelector("input#InputEmail")
let loginbutton2 = document.querySelector("button[type='submit']")
        setTimeout(function() {
            if (mailform && mailform.value !== email) {
                mailform.value = email
                setTimeout(function() {
                    if (mailform && mailform.value == email) {
                        loginbutton2.click()
                    }}, 2000)
            }}, 3000)
    }, 8000)
}

    let okbutton = document.querySelector("button[type='submit'][class='btn btn-primary-confirm btn btn-primary-styled']");

    let check_address = window.location.origin;

    if (window.location.href.includes(check_address +'/dashboard')) {
        window.location.replace(check_address +'/faucet');
    }

    if(window.location.href.includes(check_address +'/faucet')){
        setInterval(function(){ document.querySelector("#fauform button[type='submit']").click();
                                   setTimeout(function() {
        var button = document.querySelector('a[href="https://viefaucet.xyz/faucet"]');
        if (button) {
            button.click();
        }
    }, 3000);

        }, 10000)
    }
    setTimeout(function() {
   window.location.reload()
   }, 5*60000)

if (window.location.href.includes("firewall")) {
        setTimeout(function() {
   window.location.reload()
   }, 2*20000)
let firewall = setInterval(function() {
    let recaptchav3 = document.querySelector("input#recaptchav3Token")
    let hcaptcha = document.querySelector('.h-captcha > iframe')
    let turnstile = document.querySelector('.cf-turnstile > input')
    let boton = document.querySelector("button[type='submit']")
    if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0)
|| grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
        boton.click()
        clearInterval(firewall)
    }}, 5000)
setTimeout(function scroll() {

    let hcaptcha = document.querySelector('.h-captcha > iframe')
    if (hcaptcha) {
    }
}, 10000)
};