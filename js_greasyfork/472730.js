// ==UserScript==
// @name         bithub.win
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  coletar Faucet bithub
// @author       White
// @match        https://bithub.win/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bithub.win
// @license       MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/472730/bithubwin.user.js
// @updateURL https://update.greasyfork.org/scripts/472730/bithubwin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isPageFullyLoaded() {
        return document.readyState === 'complete';
    }

    function onPageLoaded() {
        console.log("A página está completamente carregada. Seu código pode ser executado agora.");

        if (window.location.href === "https://bithub.win/") {
            window.location.href = "https://bithub.win/?r=262154";
            return;
        }
                if (window.location.href === "https://bithub.win/?r=262154") {
            window.location.href = "https://bithub.win/login";
            return;
        }

        if (window.location.href === "https://bithub.win/dashboard") {
            window.location.href = "https://bithub.win/faucet";
            return;
        }

        if (window.location.href === "https://bithub.win/login") {
            var email = "email";
            var senha = "senha";

            var inputEmail = document.getElementById("email");
            var inputSenha = document.getElementById("password");

            if (inputEmail && inputSenha) {
                inputEmail.value = email;
                inputSenha.value = senha;
            }

            setTimeout(function() {
                var botaoLogin = document.querySelector("button[type='submit']");
                if (botaoLogin) {
                    botaoLogin.click();
                }
            }, 10000);
        }

        if (window.location.href.includes("bithub.win/faucet")) {
            let claim = setInterval(function() {
                let rscpatcha = document.querySelector('input#rscaptcha_response');
                let gpcaptcha = document.querySelector('input#captcha_choosen');
                let boton = document.querySelector("button.claim-button");

                if (((gpcaptcha && gpcaptcha.value.length > 0) || (rscpatcha && rscpatcha.value.length > 0)) && boton) {
                    boton.click();
                    clearInterval(claim);
                } else {
                    setTimeout(function() {
                        clearInterval(claim);
                        window.location.reload();
                    }, 180000);
                }
            }, 10000);
        }
    }

    var checkInterval = setInterval(function() {
        if (isPageFullyLoaded()) {
            clearInterval(checkInterval);
            onPageLoaded();
        }
    }, 500);
})();
