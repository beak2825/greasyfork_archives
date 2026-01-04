// ==UserScript==
// @name         Mining Blocks (Bot)
// @icon         https://icons.duckduckgo.com/ip2/miningblocks.club.ico
// @version      0.1.3
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Mining Blocks, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://miningblocks.club/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432572/Mining%20Blocks%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432572/Mining%20Blocks%20%28Bot%29.meta.js
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
    let click=true;
    if(window.location.pathname.indexOf("/Faucet/Claim")>=0){
        setTimeout('location.reload(true);',random_numbers(60000, 61000));
        setInterval(function(){
            if(detecta_hcaptcha_completado()){
                if(click){
                    try{document.body.querySelector("button#btnClaim").click();}catch(e){console.log(e);}
                    click=false;
                }
            }else{click=true;}
        },random_numbers(1000, 1500));
    }
})();