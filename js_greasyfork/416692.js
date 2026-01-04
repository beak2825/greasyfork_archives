// ==UserScript==
// @name         FaucetPay (Bot)
// @icon         https://icons.duckduckgo.com/ip2/faucetpay.io.ico
// @version      0.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para FaucetPay, autoacepta los puntos de regalo.
// @author       wuniversales
// @include      https://faucetpay.io/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416692/FaucetPay%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416692/FaucetPay%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Eliminar_popup_completo: {
            type: 'checkbox',
            default: true
        },
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
    }
});

var eliminarpopupcompleto=cfg.get('Eliminar_popup_completo');
var esconderpublicidad=cfg.get('Esconder_publicidad');

(function() {
    'use strict';

    function haz_click(identificador,text) {
        var x, i,status=false;
        x = document.querySelectorAll(identificador);
        if(x){
            if (x.length > 0) {
                for (i = 0; i < x.length; i++) {
                    if(x[i].innerText.search(text)>=0 && x[i].style.display!='none' && !x[i].disabled && x[i].style.visibility!='none'){
                        try{x[i].click();status=true;}catch(e){console.log(e);}
                        break;
                    }
                }
            }
        }
        return status;
    }
    function random_numbers(min, max) {
        if (min == null || max == null) { console.log('Error: random_number(min,max); El valor min o max es null.'); } else {
            try {
                min = parseInt(min);
                max = parseInt(max);
            } catch (e) { console.log(e); }
            return Math.floor((Math.random() * max) + min);
        }
    }
    async function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }
    window.addEventListener('load', (e) => {
        if(eliminarpopupcompleto){
            if(window.location.pathname.indexOf('/page/user-admin')>=0){
                setInterval(function(){
                    haz_click('button','I LIKE IT');
                },random_numbers(1000,5000));
            }
        }
    });
    if(esconderpublicidad){
        addGlobalStyle('a[href*=banner-ad]{display:none;}');
    }
})();