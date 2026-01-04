// ==UserScript==
// @name         Autofaucet.org
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autologin
// @author       keno venas
// @match        https://autofaucet.org/*
// @match        https://fc-lc.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autofaucet.org
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492975/Autofaucetorg.user.js
// @updateURL https://update.greasyfork.org/scripts/492975/Autofaucetorg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clicarComDelay() {
        setTimeout(function() {
            var botao = document.querySelector('button#invisibleCaptchaShortlink');
            if (botao) {
                botao.click();
            } else {
                console.log('Botão não encontrado.');
            }
        }, 2000);
    }
    clicarComDelay();


    var username = "seuusuario";
    var password = "suasenha";

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    if (window.location.href === "https://autofaucet.org/") {
        window.location.replace("https://cuty.io/quFOzb");
    }

    if (window.location.href.includes("https://autofaucet.org/auth/signin")) {
        setInterval(function() {
            if (document.querySelector("#l-form-username")) {
                document.querySelector("#l-form-username").value = username;
            }
            if (document.querySelector("#l-form-password")) {
                document.querySelector("#l-form-password").value = password;
            }

            if (isCaptchaChecked()) {
                if (document.querySelector(".btn.btn-primary.button")) {
                    document.querySelector(".btn.btn-primary.button").click();
                }
            }
        }, 5000);
    }

    if (window.location.href === "https://autofaucet.org/dashboard") {
        window.location.replace("https://cuty.io/8eryG9");
    }

    document.addEventListener('DOMContentLoaded', function() {
        setInterval(() => {
            const rows = document.querySelectorAll('.item');
            const rowsToRemove = Array.from(rows).filter(row => {
                const searchText = [
                    'Clks',
                    'Rsshort',
                    'Earnow',
                    'Adlink',
                    'Shortyfi',
                    'CryptoShorty',
                    'Megaurl',
                    'Megafly',
                    'Shortox',
                ];
                return searchText.some(text => row.textContent.includes(text));
            });
            rowsToRemove.forEach(row => {
                row.remove();
            });

        }, 0);
    });
    var clickInterval = 120000;
    var buttonSelectors = [
        'button[class="btn btn-success visit-button"]'
    ];
    function doDelayedClick(elementSelector, delay) {
        var element = document.querySelector(elementSelector);
        if (element) {
            setTimeout(function() {
                element.click();
            }, delay);
            return true;
        }
        return false;
    }
    function runAutoClicker(index) {
        if (index >= buttonSelectors.length) {
            console.log("Não há mais botões disponíveis para clicar.");
            return;
        }
        var currentButtonSelector = buttonSelectors[index];
        setTimeout(function() {
            if (doDelayedClick(currentButtonSelector, 0)) {
                setTimeout(function() {
                    runAutoClicker(index + 1);
                }, clickInterval);
            } else {
                console.log("Botão não encontrado para o seletor: " + currentButtonSelector);
                runAutoClicker(index + 1);
            }
        }, 5000);
    }
    if (window.location.href.includes('https://autofaucet.org/dashboard/shortlinks')) {
        runAutoClicker(0);
    }
})();

