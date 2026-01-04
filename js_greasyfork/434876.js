// ==UserScript==
// @name         vigalu-server.synology.me (Bot)
// @icon         https://icons.duckduckgo.com/ip2/synology.me.ico
// @version      0.1.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para vigalu-server.synology.me, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://vigalu-server.synology.me/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/434876/vigalu-serversynologyme%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/434876/vigalu-serversynologyme%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Autofaucet: {
            type: 'checkbox',
            default: true
        },
        Wallet: {
            type: 'text',
            default: ''
        },
    }
});

var autofaucet=cfg.get('Autofaucet');
var wallet=cfg.get('Wallet');

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
            if(document.body.querySelectorAll("div.alert-success").length>0 || document.body.querySelectorAll("p.alert-info").length>0){
                setTimeout("location.reload(true);",60000);
            }else{
                try{document.body.querySelector("input[type=text]").value=wallet;}catch(e){}
                setInterval(function(){
                    if(wallet!=''){
                        if(detecta_hcaptcha_completado()){
                            try{
                                document.body.querySelector("input[type=submit]").click();
                            }catch(e){
                                console.log(e);
                            }
                        }
                    }
                },random_numbers(2000, 2500));
            }
        }
    }
})();