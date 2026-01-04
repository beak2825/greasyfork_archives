// ==UserScript==
// @name         WeShareAbundance (Bot)
// @icon         https://icons.duckduckgo.com/ip2/weshareabundance.com.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para WeShareAbundance, aumenta tus ganancias.
// @author       wuniversales
// @match        https://weshareabundance.com/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/422121/WeShareAbundance%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422121/WeShareAbundance%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_login: {
            type: 'checkbox',
            default: true
        },
        Auto_mensajes: {
            type: 'checkbox',
            default: true
        },
    }
});

var autologin=cfg.get('Auto_login');
var automensajes=cfg.get('Auto_mensajes');

(function() {
    'use strict';
    function haz_click(identificador,text) {//Hacer Click si existe el elemento
        if(document.getElementsByClassName('progress-loaded')[0].style.opacity==''){
            if(document.hasFocus()){
                var x, i;
                x = document.querySelectorAll(identificador);
                if(x){
                    if (x.length > 0) {
                        for (i = 0; i < x.length; i++) {
                            if(x[i].innerText.search(text)>=0 && x[i].style.display!='none'){
                                try{x[i].click();}catch(e){console.log(e);}
                                break;
                            }
                        }
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
    async function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }
    if(window.location.pathname.indexOf("/members")>=0){
        async function bot() {
            console.log(document.querySelector("input[type=text][id=username]").value);
            setInterval(function(){
                if(autologin){
                    if(document.querySelector("input[type=text][id=username]").value!='' && document.querySelector("input[type=password][id=password]").value!=''){
                        try{document.querySelector("input[type=submit][id=login-submit]").click();}catch(e){console.log(e);}
                    }
                }
                if(automensajes){
                    if(document.querySelector("span[class=messages-span]").innerText.indexOf("0")!=0){
                        try{document.querySelector("a[id=app-view]").click();}catch(e){console.log(e);}
                    }
                }
            },random_numbers(3000,1000));
        }
        bot();
    }
})();