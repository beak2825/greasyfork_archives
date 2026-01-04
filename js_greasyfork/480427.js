// ==UserScript==
// @name         Bithub Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate actions on Bithub and Google pages
// @author       White
// @match        https://bithub.win/*
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bithub.win
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480427/Bithub%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/480427/Bithub%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tempoLimite = 360000;
    var claimButtons = document.querySelectorAll('.btn.btn-one.w-100.text-white');
    var rscaptcha = document.querySelector('input#rscaptcha_response');
    var submitButton = document.querySelector('.btn-one.btn-block.mb-2 span');
    var cryptoflareLink = document.querySelector('a[href*="https://bithub.win/blog/post/"]');
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
        } else if (currentUrl.includes("/articles/view/")) {
            checkCaptchaAndSubmit();
        } else if (currentUrl.includes("https://bithub.win/blog/post/")) {
            checkCaptchaAndClick();
        } else if (currentUrl.includes("https://bithub.win/articles")) {
            clickButtonWithDelay();
        }
    }, 5000);
})();
