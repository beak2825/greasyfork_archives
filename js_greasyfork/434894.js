// ==UserScript==
// @name         Togatech (Bot)
// @icon         https://icons.duckduckgo.com/ip2/solfaucet.togatech.org.ico
// @version      0.1.3
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Togatech, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://solfaucet.togatech.org/*
// @include      http*://xchfaucet.togatech.org/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/434894/Togatech%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/434894/Togatech%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Autofaucet: {
            type: 'checkbox',
            default: true
        }
    }
});

var autofaucet=cfg.get('Autofaucet');

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
        if(autofaucet){
            if(window.location.pathname.indexOf("/arcade")>=0 || window.location.pathname.indexOf("/casual")>=0){
                let stop;
                setTimeout(function(){
                    showModal();
                        stop=setInterval(function(){
                            if(detecta_hcaptcha_completado()){
                                setTimeout(function(){claim();}, random_numbers(1000, 1500));
                                clearInterval(stop);
                                setTimeout(function(){location.reload(true);}, random_numbers(5000, 5500));
                            }
                        },random_numbers(1000, 1500));
                },random_numbers(300000, 300500));
            }
        }
    }
})();