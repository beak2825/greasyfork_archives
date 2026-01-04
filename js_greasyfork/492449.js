// ==UserScript==
// @name         Rotator 25
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       keno venas
// @license      MIT
// @match        https://onlyfaucet.com/*
// @match        https://freeltc.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freeltc.fun
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlyfaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492449/Rotator%2025.user.js
// @updateURL https://update.greasyfork.org/scripts/492449/Rotator%2025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    'use strict';

    if (window.location.href === "https://freeltc.fun/") {
        window.location.href = "https://freeltc.fun/faucet/currency/ltc";
    }
    if (window.location.href === "https://onlyfaucet.com/") {
        window.location.href = "https://onlyfaucet.com/faucet/currency/ltc";
    }
function redirecionarProximaURL() {
    const redirecionamentos = {
        "https://onlyfaucet.com/faucet/currency/ltc": "https://onlyfaucet.com/faucet/currency/doge",
        "https://onlyfaucet.com/faucet/currency/doge": "https://onlyfaucet.com/faucet/currency/usdt",
        "https://onlyfaucet.com/faucet/currency/usdt": "https://onlyfaucet.com/faucet/currency/sol",
        "https://onlyfaucet.com/faucet/currency/sol": "https://onlyfaucet.com/faucet/currency/trx",
        "https://onlyfaucet.com/faucet/currency/trx": "https://onlyfaucet.com/faucet/currency/bnb",
        "https://onlyfaucet.com/faucet/currency/bnb": "https://onlyfaucet.com/faucet/currency/bch",
        "https://onlyfaucet.com/faucet/currency/bch": "https://onlyfaucet.com/faucet/currency/dash",
        "https://onlyfaucet.com/faucet/currency/dash": "https://onlyfaucet.com/faucet/currency/dgb",
        "https://onlyfaucet.com/faucet/currency/dgb": "https://onlyfaucet.com/faucet/currency/eth",
        "https://onlyfaucet.com/faucet/currency/eth": "https://onlyfaucet.com/faucet/currency/fey",
        "https://onlyfaucet.com/faucet/currency/fey": "https://onlyfaucet.com/faucet/currency/btc",
        "https://onlyfaucet.com/faucet/currency/btc": "https://onlyfaucet.com/faucet/currency/ton",
        "https://onlyfaucet.com/faucet/currency/ton": "https://onlyfaucet.com/faucet/currency/zec",
        "https://onlyfaucet.com/faucet/currency/zec": "https://freeltc.fun/faucet/currency/ltc",
        "https://freeltc.fun/faucet/currency/ltc": "https://freeltc.fun/faucet/currency/doge",
        "https://freeltc.fun/faucet/currency/doge": "https://freeltc.fun/faucet/currency/dgb",
        "https://freeltc.fun/faucet/currency/dgb": "https://freeltc.fun/faucet/currency/trx",
        "https://freeltc.fun/faucet/currency/sol": "https://freeltc.fun/faucet/currency/trx",
        "https://freeltc.fun/faucet/currency/trx": "https://freeltc.fun/faucet/currency/bch",
        "https://freeltc.fun/faucet/currency/bnb": "https://freeltc.fun/faucet/currency/bch",
        "https://freeltc.fun/faucet/currency/bch": "https://freeltc.fun/faucet/currency/eth",
        "https://freeltc.fun/faucet/currency/dash": "https://freeltc.fun/faucet/currency/eth",
        "https://freeltc.fun/faucet/currency/eth": "https://freeltc.fun/faucet/currency/fey",
        "https://freeltc.fun/faucet/currency/fey": "https://freeltc.fun/faucet/currency/zec",
        "https://freeltc.fun/faucet/currency/zec": "hhttps://onlyfaucet.com/"
    };

    const urlAtual = window.location.href;
    if (urlAtual in redirecionamentos) {
        const proximaURL = redirecionamentos[urlAtual];
        setTimeout(function() {
            window.location.href = proximaURL;
        }, 5000);
    }
}
function verificarMutacao(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const alertPrimary = document.querySelector('div.alert-primary');
            if (alertPrimary) {
                redirecionarProximaURL();
                observer.disconnect();
                break;
            }
        }
    }
}
function detectTextOnPage(text) {
    return document.body.innerText.includes(text);
}
const observer = new MutationObserver(verificarMutacao);
observer.observe(document.body, { childList: true, subtree: true });
let claim2 = setInterval(function (){
    let turnstile = document.querySelector("input[name='cf-turnstile-response']")
    let button = document.querySelector("button[data-target='#myModal']:not([disabled])")
    let button2 = document.querySelector("button.btn",)
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