// ==UserScript==
// @name         coinadster.com
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  coinadster
// @author       LTW
// @license      none
// @match        https://coinadster.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinadster.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495114/coinadstercom.user.js
// @updateURL https://update.greasyfork.org/scripts/495114/coinadstercom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var login = "";
    var senha = "";
setTimeout(function () {
   if (window.location.href === 'https://coinadster.com' || window.location.href === 'https://coinadster.com/') {
    var elementoLink = document.querySelector('a.nav-link.btn.btn-info.text-white[href="javascript:void(0)"][data-toggle="modal"][data-target="#slogi22Mo2dal"]');
    if (elementoLink) {
        elementoLink.click();
        setTimeout(function() {
            var checkbox = document.getElementById('remember');
            if (checkbox && !checkbox.checked) {
                checkbox.click();
                var campoLogin = document.querySelector('input[placeholder="Username / Email"]');
                if (campoLogin) {
                    campoLogin.value = login;
                }
                var campoSenha = document.querySelector('input[placeholder="Password"]');
                if (campoSenha) {
                    campoSenha.value = senha;
                }
                var intervalo = setInterval(function() {
                    if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0) {
                        clearInterval(intervalo);
                        var botaoLogin = document.querySelector('button[type="submit"].btn.btn-primary.btn-block.btn-lg');
                        if (botaoLogin) {
                            botaoLogin.click();
                        }
                    }
                }, 1000);
            }
        }, 1000);
    } else {
        window.location.href = "https://coinadster.com/faucet.html";
    }
}
}, 3000);
    const redirecionamento = 'https://coinadster.com/faucet.html';
    if (window.location.href === 'https://coinadster.com/faucet.html') {

        setTimeout(function () {
            window.location.href = redirecionamento;
        }, 180000);

        var cardBody = document.querySelector('.card-body');

        if (cardBody) {
            var exclamationIcon = cardBody.querySelector('i.fa-exclamation-circle.fa-fw');
            var claimText = cardBody.textContent || cardBody.innerText;

            if (exclamationIcon && claimText.includes('You can claim again in')) {
              //s  window.location.href = redirecionamento;
            } else {
            }
        } else {
        }

        var modalTriggered = false;

        function handlePageUnload() {
            modalTriggered = false;
        }

        window.addEventListener('beforeunload', handlePageUnload);

        setTimeout(function () {
            var button = document.querySelector('button[data-target="#modal22my"]');
            if (button && !modalTriggered) {
                button.click();
                modalTriggered = true;
                button.addEventListener('click', function (event) {
                    event.stopPropagation();
                });
            }
        }, 1500);

        var waitForRecaptcha = setInterval(function () {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0) {
                clearInterval(waitForRecaptcha);
                var customButton = document.querySelector('button[class="aa3322uu"]');
                if (customButton) {

                    setTimeout(function () {
                        customButton.click();

                        setTimeout(function () {
                            window.location.href = redirecionamento;
                        }, 2000);
                    }, 1500);
                }
            }
        }, 1000);
    }
})();
