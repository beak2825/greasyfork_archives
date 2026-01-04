// ==UserScript==
// @name         GramFree (Bot)
// @icon         https://icons.duckduckgo.com/ip2/gramfree.website.ico
// @version      0.1.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para GramFree, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://gramfree.website/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/423254/GramFree%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423254/GramFree%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_roll: {
            type: 'checkbox',
            default: true
        },
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
    }
});

var autoroll=cfg.get('Auto_roll');
var esconderpublicidad=cfg.get('Esconder_publicidad');

(function() {
    'use strict';
    function haz_click(identificador) {
        var x, i,status=false;
        x = document.querySelectorAll(identificador);
        if(x){
            if (x.length > 0) {
                for (i = 0; i < x.length; i++) {
                    if(x[i].style.display!='none' && !x[i].disabled){
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
    if(location.hostname.indexOf('gramfree.website')>=0){
        if(autoroll){
            async function autofaucets() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/free")>=0){
                        haz_click("button[id*=roll]");
                    }
                },random_numbers(3000, 1000));
            }
            autofaucets();
        }
        if(esconderpublicidad){
            async function esconderpublicidad() {addGlobalStyle("div[id*='-ad-']{display:none;}");}
            esconderpublicidad();
        }
    }
})();