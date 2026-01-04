// ==UserScript==
// @name         Freeltc
// @namespace    freeltc.online
// @version      0.1
// @description  Auto Login e Faucet
// @author       White
// @match        https://freeltc.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freeltc.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474104/Freeltc.user.js
// @updateURL https://update.greasyfork.org/scripts/474104/Freeltc.meta.js
// ==/UserScript==

(function() {
    'use strict';

var email = "";

   let claim = setInterval(function() {
    let boton = document.querySelector("button[id='subbut']")
    if (grecaptcha && grecaptcha.getResponse().length > 0) {
        $('form').submit()
        clearInterval(claim)
    }
}, 5000)

    if (window.location.href === "https://freeltc.online/" || window.location.href === ("https://freeltc.online")) {
        window.location.href = "https://freeltc.online/?r=1187";
    }

if (window.location.href === "https://freeltc.online/?r=1187") {
    setTimeout(function() {
        let mailform = document.querySelector("input#InputEmail");
        let loginbutton1 = document.querySelector("button[data-target='#login']:not(.rounded-pill)");
        let loginbutton2 = document.querySelector("button[type='submit']:not(.rounded-pill)");
        if (loginbutton1) {
            loginbutton1.click();

            setTimeout(function() {
                if (mailform && mailform.value !== email) {
                    mailform.value = email;

                    setTimeout(function() {
                        if (mailform && mailform.value === email) {
                            loginbutton2.click();
                        }
                    }, 2000);
                }
            }, 2000);
        }
    }, 3000);
}


if (window.location.href === "https://freeltc.online/?r=1187") {
    setTimeout(function() {
        window.location.href = "https://freeltc.online/faucet/currency/ltc";
    }, 40000);
}


if (window.location.href.includes("firewall")) {
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
}

if (window.location.href === "https://freeltc.online/faucet/currency/ltc") {
function refreshRandomInterval(min, max) {
    const interval = Math.random() * (max - min) + min;
    setTimeout(function() {
        location.reload();
        refreshRandomInterval(min, max);
    }, interval);
}
refreshRandomInterval(300000, 360000);
}

})();
