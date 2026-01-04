// ==UserScript==
// @name         Rollercoin (Bot)
// @namespace    https://greasyfork.org/users/592063
// @icon         https://icons.duckduckgo.com/ip2/rollercoin.com.ico
// @version      0.6.2
// @description  Script automatizado para Rollercoin, aumenta tus ganancias.
// @author       wuniversales
// @match        https://rollercoin.com/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416331/Rollercoin%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416331/Rollercoin%20%28Bot%29.meta.js
// ==/UserScript==

let cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_recharge_electricity: {
            type: 'checkbox',
            default: true
        },
        Hide_ads: {
            type: 'checkbox',
            default: true
        },
    }
});

let autorechargeelectricity=cfg.get('Auto_recharge_electricity');
let hideads=cfg.get('Hide_ads');

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
    if(autorechargeelectricity){
        async function autorechargeelectricity() {
            setInterval(function(){
                if(window.location.pathname.indexOf("/game")>=0 && window.location.pathname.indexOf("/game/")<0){
                    haz_click("button","RECHARGE");
                }
            },random_numbers(5000, 1000));
        }
        autorechargeelectricity();
    }
    if(hideads){
        addGlobalStyle(".banners-container{display:none;}");
    }
})();