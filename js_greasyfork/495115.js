// ==UserScript==
// @name         faucetsfly.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  faucetsfly
// @author       LTW
// @license      none
// @match        https://faucetsfly.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetsfly.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495115/faucetsflycom.user.js
// @updateURL https://update.greasyfork.org/scripts/495115/faucetsflycom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var emailOrUsernameValue = "";
    var passwordValue = "";
    var redirecionamento = "https://faucetsfly.com/roll.html";
    setTimeout(function () {
        if (document.querySelector('.btn-one[data-bs-target="#login-modal"]')) {
            document.querySelector('.btn-one[data-bs-target="#login-modal"]').click();

            setTimeout(function () {
                var checkbox = document.getElementById('remember');
                if (checkbox && !checkbox.checked) {
                    checkbox.click();
                }

                setTimeout(function () {
                    var emailOrUsernameField = document.querySelector('input[placeholder="Email or Username"]');
                    if (emailOrUsernameField) {
                        emailOrUsernameField.value = emailOrUsernameValue;
                    }

                    var passwordField = document.querySelector('input[placeholder="Password"]');
                    if (passwordField) {
                        passwordField.value = passwordValue;
                    }

                    var waitForRecaptcha = setInterval(function () {
                        if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0) {
                            clearInterval(waitForRecaptcha);
                            var signInButton = document.querySelector('.btn-submit');
                            if (signInButton) {
                                signInButton.click();
                            }
                        }
                    }, 1000);
                }, 1000);
            }, 3000);
        } else {
if (window.location.href === "https://faucetsfly.com/roll.html") {
    function verificarEReivindicar() {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length !== 0) {
            var claimBtn = document.querySelector('button.claim-btn.d-flex.align-items-center.w-100.mt-2');
            if (claimBtn) {
                claimBtn.click();
                clearInterval(intervalID);
                setTimeout(function () {
                    var pageContent = document.body.textContent || document.body.innerText;
                    if (pageContent.includes("You must visit 1 Shortlink today to be able to Roll & Win FREE Faucet Tokens!")) {
                        window.location.href = 'https://faucetsfly.com/shortlinks.html';
                    } else {
                        setTimeout(function () {
                            window.location.href = redirecionamento;
                        }, 2000);
                    }
                }, 3000);
            }
        }
    }
    var intervalID = setInterval(verificarEReivindicar, 2000);
}

            if (window.location.href === 'https://faucetsfly.com/' || window.location.href === 'https://faucetsfly.com/dashboard.html') {
                window.location.href = "https://faucetsfly.com/roll.html";
            }
        }
    }, 3000);
})();
