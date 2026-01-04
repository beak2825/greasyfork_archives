// ==UserScript==
// @name         Crypto-lovers (Bot)
// @icon         https://icons.duckduckgo.com/ip2/crypto-lovers.club.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para crypto-lovers, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://crypto-lovers.club/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/432197/Crypto-lovers%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432197/Crypto-lovers%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_faucet_home: {
            type: 'checkbox',
            default: true
        },
        Auto_captcha_shortlinks: {
            type: 'checkbox',
            default: true
        },
        Auto_actualizar_shortlinks: {
            type: 'checkbox',
            default: true
        },
        Auto_ptc: {
            type: 'checkbox',
            default: true
        },
        Auto_actualizar_ptc: {
            type: 'checkbox',
            default: true
        },
    }
});

let afh=cfg.get('Auto_faucet_home');
let acst=cfg.get('Auto_captcha_shortlinks');
let aast=cfg.get('Auto_actualizar_shortlinks');
let ap=cfg.get('Auto_ptc');
let aap=cfg.get('Auto_actualizar_ptc');

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


        if(afh){
            async function auto_captcha_shortlinks() {
                if(window.location.pathname.indexOf("/faucet/check")>=0){
                    window.location.replace("https://crypto-lovers.club/home");
                }
            }
            auto_captcha_shortlinks();
        }
        if(acst){
            async function auto_captcha_shortlinks() {
                if(window.location.pathname.indexOf("/shortlink/checkpoint/")>=0){
                    setTimeout(function(){
                        try{document.querySelector("button[type=submit][id=btnSubmit]").click();}catch(e){console.log(e);}
                    }, random_numbers(10500, 11000));
                }
            }
            auto_captcha_shortlinks();
        }
        if(aast){
            async function reload_st() {
                if(window.location.pathname=="/shortlink/wall"){
                    setTimeout('location.reload(true);',random_numbers(10500, 11000));
                }
            }
            reload_st();
        }
        if(ap){
            async function auto_ptc() {
                if(window.location.pathname.indexOf("/ptc")>=0){

                    if(window.location.pathname.indexOf("/ptc/")>=0){
                        setTimeout(function(){
                            try{document.querySelector("button[type=submit][id=btnSubmit]").click();}catch(e){console.log(e);}
                        }, random_numbers(10500, 11000));
                    }
                }
            }
            auto_ptc();
        }

        if(aap){
            async function reload_ptc() {
                if(window.location.pathname=="/ptc"){
                    setTimeout('location.reload(true);',random_numbers(10500, 11000));
                }
            }
            reload_ptc();
        }
    }
})();