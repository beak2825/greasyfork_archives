// ==UserScript==
// @name         Cryptowin (Bot)
// @icon         https://icons.duckduckgo.com/ip2/cryptowin.io.ico
// @version      0.1.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para cryptowin, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://cryptowin.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433593/Cryptowin%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433593/Cryptowin%20%28Bot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random_numbers(min, max) {
        if (min == null || max == null) { console.log('Error: random_number(min,max); El valor min o max es null.'); } else {
            try {
                min = parseInt(min);
                max = parseInt(max);
            } catch (e) { console.log(e); }
            return Math.floor((Math.random() * max) + min);
        }
    }
    function detecta_hcaptcha_completado() {
        let status=false;
        if (document.body.querySelector("iframe[src*='hcaptcha.com']").getAttribute("data-hcaptcha-response") != ''){
            status=true;
        }
        return status;
    }
    window.onload = function() {
        async function Faucet() {
            if(window.location.pathname.indexOf("/faucet")>=0){
                setInterval(function(){
                    if(document.body.querySelectorAll('a[data-target="#claim"]').length>0){
                        document.body.querySelector('a[data-target="#claim"]').click();
                        document.body.querySelector('a[data-target="#claim"]').remove();
                    }
                    if(document.body.querySelectorAll('button[type=submit]:not(:disabled)').length>0){
                        if(detecta_hcaptcha_completado()){
                            document.body.querySelector('button[type=submit]:not(:disabled)').click();
                        }
                    }
                },random_numbers(2000,3000));
            }
        }
        Faucet();
    }
})();