// ==UserScript==
// @name         StormGain (Bot)
// @icon         https://icons.duckduckgo.com/ip2/stormgain.com.ico
// @version      0.2.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para StormGain, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://app.stormgain.com/*
// @include      http*://promo.stormgain.com/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/421678/StormGain%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421678/StormGain%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_refrescar_stormgain: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera: {
            type: 'number',
            default: 900
        },
        Auto_iniciar_mineria: {
            type: 'checkbox',
            default: true
        },
    }
});

var autorefrescarstormgain=cfg.get('Auto_refrescar_stormgain');
var segundosdeespera=cfg.get('Segundos_de_espera');
var autoiniciarmineria=cfg.get('Auto_iniciar_mineria');

(function() {
    'use strict';
    function haz_click(identificador,text) {//Hacer Click si existe el elemento
        var x, i;
        x = document.querySelectorAll(identificador);
        if(x){
            if (x.length > 0) {
                for (i = 0; i < x.length; i++) {
                    if(x[i].innerHTML.search(text)>=0 && x[i].style.display!='none'){
                        try{x[i].click();}catch(e){console.log(e);}
                        break;
                    }
                }
            }
        }
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
    if(autorefrescarstormgain){
        async function reload() {
            setInterval('location.reload(true)',parseInt(segundosdeespera+"000"));//30 minutos
        }
        reload();
    }
    if(autoiniciarmineria){
        async function auto_miner() {
            if(window.location.hostname.indexOf("app.stormgain.com")>=0 && window.location.pathname.indexOf("/crypto-miner")>=0){
                location.href=document.querySelector("div#region-main > div > iframe").src;
            }
            if(window.location.hostname.indexOf("promo.stormgain.com")>=0 && window.location.pathname.indexOf("/promo/miner")>=0){
                haz_click("button","Activar");
            }
        }
        setInterval(function(){
            auto_miner();
        },random_numbers(5000, 1000));
    }
})();