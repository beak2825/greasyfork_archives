// ==UserScript==
// @name         FaucetToday (Bot)
// @icon         https://icons.duckduckgo.com/ip2/faucet.today.ico
// @version      0.1.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para FaucetToday, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://faucet.today/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/433694/FaucetToday%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433694/FaucetToday%20%28Bot%29.meta.js
// ==/UserScript==

let cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Wallet: {
            type: 'text',
            default: ''
        }
    }
});

let wallet=cfg.get('Wallet');

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
            if(window.location.pathname.indexOf("/")>=0){
                if(wallet!=''){
                    setInterval(function(){
                        if(document.body.querySelectorAll('input[type=text]').length>0){
                            document.body.querySelector('input[type=text]').clivalue=wallet;
                        }
                        if(document.body.querySelectorAll('input[type=submit]').length>0){
                            if(detecta_hcaptcha_completado()){
                                document.body.querySelector('input[type=submit]').click();
                            }
                        }
                        if(document.body.querySelectorAll('div.alert-success').length>0){
                            window.location.replace('https://faucet.today/?r=DQfjL3JGwpgS8NgWjoib8uvGsd6k14ysKM');
                        }
                    },random_numbers(2000,3000));
                }
            }
        }
        Faucet();
    }
})();