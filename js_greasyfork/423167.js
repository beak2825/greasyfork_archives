// ==UserScript==
// @name         Permission (Bot)
// @icon         https://icons.duckduckgo.com/ip2/permission.io.ico
// @version      0.1.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Permission, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://*.permission.io/*

// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/423167/Permission%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423167/Permission%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_play: {
            type: 'checkbox',
            default: true
        },
        Eliminar_focus: {
            type: 'checkbox',
            default: true
        },
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
    }
});

var autoplay=cfg.get('Auto_play');
var eliminarfocus=cfg.get('Eliminar_focus');
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
    if(location.hostname.indexOf('permission.io')>=0){
        if(autoplay){
            async function autoplay() {
                setInterval(function(){
                    haz_click("button[type=button][title='Play Video']");
                },random_numbers(3000, 1000));
            }
            autoplay();
        }
        if(eliminarfocus){
            async function autoptc() {
                setInterval(function(){
                    haz_click("button[type=button][title='Play']");
                },random_numbers(3000, 1000));
            }
            autoptc();
        }
        if(esconderpublicidad){
            async function esconderpublicidad() {addGlobalStyle("div.GoogleCreativeContainerClass, div[id*='-ad-']{display:none;}");}
            esconderpublicidad();
        }
    }
})();