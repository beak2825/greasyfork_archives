// ==UserScript==
// @name         Btcpop (Bot)
// @namespace    https://greasyfork.org/users/592063
// @icon         https://icons.duckduckgo.com/ip2/btcpop.co.ico
// @version      0.2
// @description  Script automatizado para Btcpop, aumenta tus ganancias.
// @author       wuniversales
// @license      MIT
// @match        http*://btcpop.co/Faucet/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/435171/Btcpop%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435171/Btcpop%20%28Bot%29.meta.js
// ==/UserScript==

let cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_faucets: {
            type: 'checkbox',
            default: true
        },
        Username: {
            type: 'text',
            default: ''
        },
    }
});

let autofaucets=cfg.get('Auto_faucets');
let username=cfg.get('Username');

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
        if(document.body.querySelectorAll("iframe[src*='hcaptcha.com']").length>0){
            if (document.body.querySelector("iframe[src*='hcaptcha.com']").getAttribute("data-hcaptcha-response") != ''){
                status=true;
            }
        }
        return status;
    }

    if(autofaucets){
        async function loadbot() {
            if(username!=''){
                setInterval(function(){
                    if(document.body.querySelectorAll('div#timer-overlay').length==0){
                        document.body.querySelector('input#username-input').value=username;
                        if(detecta_hcaptcha_completado()){
                            document.body.querySelector('button[type=submit]').click();
                            setTimeout('location.reload(true);',random_numbers(5000, 5500));
                        }
                    }
                },random_numbers(5000, 5500));
                setTimeout('location.reload(true);',random_numbers(4000000, 4000500));
            }
        }
        loadbot();
    }
})();