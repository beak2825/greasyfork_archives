// ==UserScript==
// @name         BNB-Valve.io (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.3
// @description  Auto Claim.
// @author       Jadson Tavares
// @match        *://*.bnb-valve.io/*
// @match        *://*.pescadordecripto.com/install
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424285/BNB-Valveio%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424285/BNB-Valveio%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var wallet_type;

    setInterval(function(){
        // Defina a sua carteira
        if($("#modal-login > div.modal__body > div.modal-login__cards > a:nth-child(2) > span").text() == "TrustWallet"){
            wallet_type = 6; // Se Metamask = 1, Se TrustWallet= 2, Se MathWallet = 3, Se TokenPocket = 4, Se WalletConnect = 5, Se Binance = 6, Se SafePal Wallet = 7
        } else {
            wallet_type = 2; // Se Metamask = 1, Se Binance = 2
        }

        // Login
        if($('.header__btn.btn.btn-orange').text().indexOf('Log in') > -1){
            if(!$('#modal-login').is(':visible')){
                $('.header__btn.btn.btn-orange').click();
            } else {
               document.querySelector("#modal-login > div.modal__body > div.modal-login__cards > a:nth-child("+wallet_type+")").click();
            }
        }

        // Check Percent Claim
        if( parseInt($('body > div.level > div > div > div.level__generation > div.level__content > div.level__percent').text().substr(0,$('body > div.level > div > div > div.level__generation > div.level__content > div.level__percent').text().indexOf('.'))) == 100 ){
            if(!$('#modal-buy').is(':visible')){
                document.querySelector("body > div.level > div > div > div.level__generation > div.level__toolbar > a").click();
            }
        }

        // Check Recaptcha Response / Click Button
        if($('#modal-claim').is(':visible')){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                document.querySelector('#modal-claim > div.modal__body > div > a').click();
            }
            setTimeout(function(){
                if($('#modal-claim').is(':visible')){
                    window.history.go(0);
                }
            },30000);
        }

        // Close Buy Modal
        if($('#modal-buy').is(':visible')){
            document.querySelector("#modal-buy > div.modal__header > div.modal__close > img").click();
            window.history.go(0);
        }
    },5000);

    if (window.location.href.indexOf("pescadordecripto.com/install") > -1) {
        document.getElementById('bnb-valve-io').classList.add("faucet-active");
    }
})();