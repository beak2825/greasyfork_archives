// ==UserScript==
// @name         CryptoRotator (Bot)
// @icon         https://icons.duckduckgo.com/ip2/cryptorotator.website.ico
// @version      0.1.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para CryptoRotator, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://cryptorotator.website/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/423130/CryptoRotator%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423130/CryptoRotator%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_refrescar_cryptorotator: {
            type: 'checkbox',
            default: false
        },
        Segundos_de_espera: {
            type: 'number',
            default: 900
        },
        Auto_ptc: {
            type: 'checkbox',
            default: true
        },
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
    }
});

var autorefrescarcryptorotator=cfg.get('Auto_refrescar_cryptorotator');
var segundosdeespera=cfg.get('Segundos_de_espera');
var autoptc=cfg.get('Auto_ptc');
var esconderpublicidad=cfg.get('Esconder_publicidad');

(function() {
    'use strict';
    function haz_click(identificador,text) {
        var x, i,status=false;
        x = document.querySelectorAll(identificador);
        if(x){
            if (x.length > 0) {
                for (i = 0; i < x.length; i++) {
                    if(x[i].innerText.search(text)>=0 && x[i].style.display!='none' && !x[i].disabled){
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
    if(location.hostname.indexOf('cryptorotator.website')>=0){
        if(autorefrescarcryptorotator){
            async function reload() {
                setInterval('location.reload(true)',parseInt(segundosdeespera+'000'));
            }
            reload();
        }
        if(autoptc){
            async function autoptc() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/ptc")>=0){
                        if(!haz_click("button","OK")){
                            if(window.location.pathname.indexOf("/view")>=0){
                                if(document.querySelector("div#ptcCaptcha[style*=block]")!=null){
                                    haz_click("button[id=verify]","Verify");
                                }
                            }else{
                                haz_click("button","Go");
                            }
                        }
                    }
                },random_numbers(5000, 1000));
            }
            autoptc();
        }
        if(esconderpublicidad){
            async function esconderpublicidad() {addGlobalStyle("div.ads{display:none;}");}
            esconderpublicidad();
        }
    }
})();