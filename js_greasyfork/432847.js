// ==UserScript==
// @name         Freenanofaucet (Bot)
// @icon         https://icons.duckduckgo.com/ip2/freenanofaucet.com.ico
// @version      0.1.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Freenanofaucet, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://freenanofaucet.com/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/432847/Freenanofaucet%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432847/Freenanofaucet%20%28Bot%29.meta.js
// ==/UserScript==


let cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Nano_Wallet: {
            type: 'text',
            default: 'nano_3syxqotng9ymwogaiczrdsay3pp4m3iymow6cxtsg1grdkw5b4u9bnz9ffac'
        },
       Auto_claim: {
            type: 'checkbox',
            default: true
        },
    }
});

let wallet=cfg.get('Nano_Wallet');
let autoclaim=cfg.get('Auto_claim');

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
    window.onload = function() {
        if(autoclaim){
            if(window.location.pathname=="/"){
                document.body.querySelector('input#nanoAddr').value=wallet;
                setTimeout(function(){
                    document.body.querySelector('input#getNano').click();
                },random_numbers(601000, 601500));
            }
            if(window.location.pathname.indexOf("/faucet")>=0){
                setTimeout(function(){
                    window.location.pathname='/';
                },random_numbers(1000, 1500));
            }
        }
    }
})();