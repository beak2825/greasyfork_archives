// ==UserScript==
// @name         Cryptoflare Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate actions on Cryptoflare and Google pages
// @author       White
// @match        https://cryptoflare.net/*
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoflare.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480423/Cryptoflare%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/480423/Cryptoflare%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tempoLimite = 360000;
    var claimButtons = document.querySelectorAll('.claim-btn');
    var rscaptcha = document.querySelector('input#rscaptcha_response');
    var submitButton = document.querySelector('button.btn-one[type="submit"]');
    var cryptoflareLink = document.querySelector('a[href*="https://cryptoflare.net/blog/post/"]');
    var verifyButton = document.querySelector('button.blog-card-btn.mb-2');

    function clickButtonWithDelay() {
        setTimeout(function() {
            if (claimButtons.length > 0) {
                claimButtons[0].click();
            }
        }, 5000);
    }

    function checkCaptchaAndSubmit() {
        setTimeout(function() {
            if (rscaptcha && rscaptcha.value.trim().length > 0 && submitButton) {
                submitButton.click();
            }
        }, 5000);
    }

    function clickOnCryptoflareLink() {
        setTimeout(function() {
            if (cryptoflareLink) {
                cryptoflareLink.click();
            }
        }, 5000);
    }

    function checkCaptchaAndClick() {
        setTimeout(function() {
            if (rscaptcha && rscaptcha.value.trim().length > 0 && verifyButton) {
                verifyButton.click();
            }
        }, 5000);
    }

    function recarregarPagina() {
        location.reload();
    }

    const temporizador = setTimeout(recarregarPagina, tempoLimite);

    setInterval(function() {
        var currentUrl = document.location.href;

        if (currentUrl.includes("https://www.google.com/url?")) {
            clickOnCryptoflareLink();
        } else if (currentUrl.includes("/article/view/")) {
            checkCaptchaAndSubmit();
        } else if (currentUrl.includes("https://cryptoflare.net/blog/post/")) {
            checkCaptchaAndClick();
        } else if (currentUrl.includes("https://cryptoflare.net/")) {
            clickButtonWithDelay();
        }
    }, 5000);
})();
