// ==UserScript==
// @name         Doge25/ada
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collect Faucet
// @author       White
// @match        https://doge25.in/ada/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=name.tr
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/476402/Doge25ada.user.js
// @updateURL https://update.greasyfork.org/scripts/476402/Doge25ada.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var multicoinmode = "no"
    var email = "email";

var claimUrls = [
    "/ada",
   "/matic",
    "/btc",
    "/bch",
    "/doge",
    "/ltc",
    "/sol",
    "/trx",
    "/bnb",
    "/zec",
    "/xrp",
    "/fey",
];

function redirectToNextURL() {
    var currentURL = window.location.pathname;

    var urlParts = currentURL.split('/');
    var lastPart = urlParts[urlParts.length - 1];

    if (!isNaN(lastPart)) {
        return;
    }

    for (var i = 0; i < claimUrls.length; i++) {
        if (currentURL.includes(claimUrls[i])) {
            var nextIndex = (i + 1) % claimUrls.length;
            var nextURL = claimUrls[nextIndex];
            setTimeout((function(url) {
                return function() {
                    window.location.href = "https://doge25.in/ada/faucet/currency" + url;
                }
            })(nextURL), 3000);
            break;
        }
    }
}
if (multicoinmode === "yes") {
  var pageText1 = document.body.innerText.trim();
  if (pageText1.includes("please comeback again tomorrow.") || pageText1.includes("wait") || pageText1.includes("Go Claim")) {
    redirectToNextURL();
  }
}
var pageText = document.body.innerText.trim();
if (pageText.includes("please comeback again tomorrow.") || pageText.includes("Empty") || pageText.includes("empty") || pageText === "0/250" || pageText === "0/2000") {
    redirectToNextURL();
}

   let claim = setInterval(function() {
    let boton = document.querySelector("button[id='subbut']")
    if (grecaptcha && grecaptcha.getResponse().length > 0) {
        $('form').submit()
        clearInterval(claim)
    }
}, 5000)

    if (window.location.href === "https://doge25.in/ada/" || window.location.href === "https://doge25.in/ada") {
        window.location.href = "https://doge25.in/ada/?r=41";
    }

    if (window.location.href === "https://doge25.in/ada/?r=41") {
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

    if (window.location.href === "https://doge25.in/ada/?r=41") {
        setTimeout(function() {
            window.location.href = "https://doge25.in/ada/?r=41faucet/currency/ada";
        }, 40000);
    }

    if (window.location.href.includes("firewall")) {
        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector("button[type='submit']");
            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                boton.click();
                clearInterval(firewall);
            }
        }, 5000);
    }
        setTimeout(function() {
                location.reload();
            }, 240000);

if (multicoinmode === "no") {
    if (window.location.href.includes("doge25")) {
        let goclaim = setInterval(function() {
            let boton = document.querySelector("a.btn.btn-primary");
            if (boton && boton.innerText === "Go Claim") {
                window.location.reload();
                clearInterval(goclaim);
            }
        }, 6000);
    }
}
})();