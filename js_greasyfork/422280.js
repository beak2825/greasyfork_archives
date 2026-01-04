// ==UserScript==
// @name         SimpleBits (Bot)
// @icon         https://icons.duckduckgo.com/ip2/simplebits.io.ico
// @version      0.1.4
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para SimpleBits, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://simplebits.io/*
// @include      http*://getitall.top/*
// @include      http*://pentafaucet.com/*
// @include      http*://hitbits.io/*
// @include      http*://satoshilabs.net/*
// @include      http*://asia-mag.com/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/422280/SimpleBits%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422280/SimpleBits%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_refrescar_simplebits: {
            type: 'checkbox',
            default: false
        },
        Segundos_de_espera: {
            type: 'number',
            default: 900
        },
        Auto_faucet: {
            type: 'checkbox',
            default: true
        },
        Auto_ptc: {
            type: 'checkbox',
            default: true
        },
        Auto_shortlinks: {
            type: 'checkbox',
            default: true
        },
        Auto_challenges: {
            type: 'checkbox',
            default: true
        },
        Auto_achievements: {
            type: 'checkbox',
            default: true
        },
        Auto_mining: {
            type: 'checkbox',
            default: true
        },
        Auto_claim_mining: {
            type: 'checkbox',
            default: true
        },
        Auto_asiamag: {
            type: 'checkbox',
            default: true
        },
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
        Esconder_chat: {
            type: 'checkbox',
            default: false
        },
    }
});

var autorefrescarsimplebits=cfg.get('Auto_refrescar_simplebits');
var segundosdeespera=cfg.get('Segundos_de_espera');
var autofaucet=cfg.get('Auto_faucet');
var autoptc=cfg.get('Auto_ptc');
var autoshortlinks=cfg.get('Auto_shortlinks');
var autochallenges=cfg.get('Auto_challenges');
var autoachievements=cfg.get('Auto_achievements');
var automining=cfg.get('Auto_mining');
var autoclaimmining=cfg.get('Auto_claim_mining');
var esconderpublicidad=cfg.get('Esconder_publicidad');
var esconderchat=cfg.get('Esconder_chat');
var autoasiamag=cfg.get('Auto_asiamag');

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
    if(location.hostname.indexOf('simplebits.io')>=0){
        if(autorefrescarsimplebits){
            async function reload() {
                setInterval('location.reload(true)',parseInt(segundosdeespera+'000'));
            }
            reload();
        }
        if(autofaucet){
            async function autofaucet() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/faucet")>=0){
                        haz_click("button","Claim");
                    }
                },random_numbers(5000, 1000));
            }
            autofaucet();
        }
        if(autoptc){
            async function autoptc() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/ptc")>=0){
                        haz_click("button","VIEW");
                        haz_click("button","Claim");
                    }
                },random_numbers(5000, 1000));
            }
            autoptc();
        }
        if(automining){
            async function automining() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/mining/")>=0){
                        if(!haz_click("button.py-1","100")){
                            if(!haz_click("button.py-1","20")){
                                if(!haz_click("button.py-1","10")){
                                    if(!haz_click("button.py-1","5")){
                                        haz_click("button.py-1","1");
                                    }
                                }
                            }
                        }
                    }
                },random_numbers(5000, 1000));
            }
            automining();
        }
        if(autoclaimmining){
            async function autoclaimmining() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/mining/log")>=0){
                        haz_click("button","Claim");
                    }
                },random_numbers(5000, 1000));
            }
            autoclaimmining();
        }
        if(autochallenges){
            async function autochallenges() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/challenges")>=0){
                        haz_click("button","Claim");
                    }
                },random_numbers(5000, 1000));
            }
            autochallenges();
        }
        if(autoachievements){
            async function achievements() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/achievements")>=0){
                        haz_click("button","Claim");
                    }
                },random_numbers(5000, 1000));
            }
            achievements();
        }
        if(esconderchat){
            async function esconderchat() {addGlobalStyle("div.chatbro_minimized_chat{display:none;}");}
            esconderchat();
        }
        if(esconderpublicidad){
            async function esconderpublicidad() {addGlobalStyle("iframe[src^='/ads/']{display:none;}");}
            esconderpublicidad();
        }
    }
    if(autoshortlinks){
        async function autoshortlinks() {
            if(location.hostname=='getitall.top' || location.hostname=='pentafaucet.com' || location.hostname=='hitbits.io'|| location.hostname=='simplebits.io' || location.hostname=='satoshilabs.net'){
                setInterval(function(){
                    if(window.location.pathname.indexOf("/s")>=0 || window.location.pathname.indexOf("/f")>=0){
                        haz_click("div > button","Start");
                        haz_click("div > button","Next");
                        haz_click("div > button","Complete");
                    }
                },random_numbers(5000, 1000));
                if(esconderpublicidad){
                    addGlobalStyle("iframe{display:none;}");
                }
            }
        }
        autoshortlinks();
    }
    if(location.hostname=='asia-mag.com'){
        if(autoasiamag){
            async function autoasiamag() {
                setInterval(function(){
                    if(document.getElementById("video-id")!=null){
                        document.getElementById("video-id").play();
                    }
                    haz_click("button","Click");
                    haz_click("button","Final");
                    haz_click("a","ANOTHER TOUR");
                    if(document.querySelectorAll("h5")[0].innerText.search("any other post")>=0){
                        location.reload(true);
                    }
                    if(document.querySelectorAll("h5")[0].innerText.search("on any posts")>=0){
                        location.href="/hyuna-im-not-cool-mv/";
                    }
                },random_numbers(5000, 1000));
            }
            autoasiamag();
        }
    }
})();