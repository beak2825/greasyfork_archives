// ==UserScript==
// @name         Bigfreegiveaway (Bot)
// @icon         https://icons.duckduckgo.com/ip2/bigfreegiveaway.com.ico
// @version      0.1.8
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Bigfreegiveaway, aumenta tus ganancias.
// @author       wuniversales
// @include      https://bigfreegiveaway.com/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/413861/Bigfreegiveaway%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/413861/Bigfreegiveaway%20%28Bot%29.meta.js
// ==/UserScript==

let cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_raffle: {
            type: 'checkbox',
            default: true
        },
        Auto_refrescar: {
            type: 'checkbox',
            default: true
        },
        Segundos_para_refrescar: {
            type: 'number',
            default: 300
        },
    }
});

let autoraffle=cfg.get('Auto_raffle');
let autorefrescar=cfg.get('Auto_refrescar');
let segundospararefrescar=cfg.get('Segundos_para_refrescar');
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
    if(window.location.pathname.indexOf("/my-tickets")>=0){
        if(autoraffle){
            setInterval(function(){
                haz_click('form > button',"Claim Today's Ticket");
            },random_numbers(5000, 1000));
        }
        if(autorefrescar){
            setInterval('location.reload(true)',parseInt(segundospararefrescar+'000'));
        }
    }
})();