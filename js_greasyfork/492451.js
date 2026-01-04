// ==UserScript==
// @name         firewall freeltc
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  O amanhã será tarde demais!!!
// @author       keno venas
// @license      MIT
// @match        https://freeltc.fun/firewall
// @match        https://onlyfaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freeltc.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492451/firewall%20freeltc.user.js
// @updateURL https://update.greasyfork.org/scripts/492451/firewall%20freeltc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function redirectToFaucet() {
        window.location.href = 'https://freeltc.fun/faucet/currency/dgb';
    }
    function observeMutation(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches('.authkong_captcha div:nth-child(3)')) {
                            redirectToFaucet();
                            observer.disconnect();
                            return;
                        }
                    }
                }
            }
        }
    }
    const observer = new MutationObserver(observeMutation);

    const config = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, config);
    var botoesParaClicar = ['button.w-md'];

    function clicarNosBotoes() {
        for (var i = 0; i < botoesParaClicar.length; i++) {
            var botao = document.querySelector(botoesParaClicar[i]);
            if (botao) {
                botao.click();
            }
        }
    }
    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse();
    }
    var verificarCaptchaInterval = setInterval(function() {
        if (isCaptchaChecked()) {
            clearInterval(verificarCaptchaInterval);
            clicarNosBotoes();
        }
    }, 1000);
     let claim2 = setInterval(function (){
                let turnstile = document.querySelector("input[name='cf-turnstile-response']")
                let button = document.querySelector("button[data-target='#myModal']:not([disabled])")
                let button2 = document.querySelector("button.w-md",)
                if(button){
                    button.click();
                }
                if(button2 && turnstile && turnstile.value.length > 0){
                    setTimeout(function() { window.location.reload() }, 60000)
                    button2.click();
                    clearInterval(claim2);
                }

            },2000)
})();