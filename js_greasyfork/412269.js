// ==UserScript==
// @name         FaucetCrypto (Bot)
// @icon         https://icons.duckduckgo.com/ip2/faucetcrypto.com.ico
// @version      1.0.8
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para FaucetCrypto, aumenta tus ganancias.
// @author       RT-Team
// @include      http*://faucetcrypto.com/*
// @include      http*://faucet.gold/*
// @include      http*://claim4.fun/*
// @include      http*://exe.io/*
// @include      http*://exe.app/*
// @include      http*://exee.io/*
// @include      http*://exee.app/*
// @include      http*://clik.pw/*
// @include      http*://mealip.com/*
// @include      http*://ivn3.com/*
// @include      http*://bitcoinly.in/*
// @include      *.fc-lc.com/*
// @include      http*://fcc.lc/*
// @include      http*://fc.lc/*
// @include      http*://pslfive.com/*
// @include      http*://asia-mag.com/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/412269/FaucetCrypto%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412269/FaucetCrypto%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_refrescar_faucetcrypto: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera: {
            type: 'number',
            default: 900
        },
        Auto_recompensa_principal: {
            type: 'checkbox',
            default: true
        },
        Bonos_automaticos: {
            type: 'checkbox',
            default: true
        },
        Auto_shortlinks: {
            type: 'checkbox',
            default: true
        },
        Auto_ptc: {
            type: 'checkbox',
            default: true
        },
        Auto_AsiaMag: {
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

var autorefrescarfaucetcrypto=cfg.get('Auto_refrescar_faucetcrypto');
var segundosdeespera=cfg.get('Segundos_de_espera');
var autorecompensaprincipal=cfg.get('Auto_recompensa_principal');
var bonosautomaticos=cfg.get('Bonos_automaticos');
var autoshortlinks=cfg.get('Auto_shortlinks');
var autoptc=cfg.get('Auto_ptc');
var esconderpublicidad=cfg.get('Esconder_publicidad');
var esconderchat=cfg.get('Esconder_chat');
var autoasiamag=cfg.get('Auto_AsiaMag');

(function() {
    'use strict';
    function haz_click(identificador,text) {//Hacer Click si existe el elemento
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
    function random_numbers(min, max) {
        if (min == null || max == null) { console.log('Error: random_number(min,max); El valor min o max es null.'); } else {
            try {
                min = parseInt(min);
                max = parseInt(max);
            } catch (e) { console.log(e); }
            return Math.floor((Math.random() * max) + min);
        }
    }
    function limpia_link(identificador,text) {//Limpiador
        var x, i;
        x = document.querySelectorAll(identificador);
        if (x.length > 0) {
            for (i = 0; i < x.length; i++) {
                if(x[i].innerText.search(text)>=0 && x[i].style.display!='none'){
                    try{x[i].removeAttribute("target");}catch(e){console.log(e);}
                    try{x[i].removeAttribute("href");}catch(e){console.log(e);}
                    try{x[i].setAttribute("href", "#");}catch(e){console.log(e);}
                    break;
                }
            }
        }
    }
    function return_status(identificador,text) { //Revuelve true o false si el elemento es detectado
        var x, i, status=false;
        x = document.querySelectorAll(identificador);
        if (x.length > 0) {
            for (i = 0; i < x.length; i++) {
                if(x[i].innerText.search(text)>=0 && x[i].style.display!='none'){
                    status=true;
                    break;
                }
            }
        }
        return status;
    }
    function ocultar(identificador) {
        var x, i;
        x = document.querySelectorAll(identificador);
        if (x.length > 0) {
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
        }
    }
    window.onload = function() {
        if(autorefrescarfaucetcrypto){
            if(location.hostname=='faucetcrypto.com'){
                async function reload() {
                    setInterval('location.reload(true)',parseInt(segundosdeespera+'000'));
                }
                reload();
            }
        }
        if(autorecompensaprincipal){
            async function autorecompensaprincipal() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/dashboard")==0){
                        haz_click("a","Claim Reward");
                    }
                },random_numbers(5000, 1000));
            }
            autorecompensaprincipal();
        }
        if(bonosautomaticos){
            async function bonosautomaticos() {
                if(location.hostname=='faucetcrypto.com'){
                    setInterval(function(){
                        if(window.location.pathname.indexOf("/task/")>=0 || window.location.pathname.indexOf("/achievement/complete/")>=0){
                            if(return_status("p","The system is telling me that you are a good person")){//Captcha completado
                                if(return_status("h4","Captcha Error")){//Si da error en captcha
                                    location.reload(true);
                                }else{
                                    haz_click("button","Get Reward");
                                }
                            }
                        }
                        if(window.location.pathname.indexOf("/achievement/list")>=0){
                            haz_click("a","Claim");
                        }
                    },random_numbers(5000, 1000));
                }
            }
            bonosautomaticos();
        }
        if(autoshortlinks){
            async function autoshortlinks() {
                if(location.hostname=='faucetcrypto.com'){
                    setInterval(function(){
                        if(window.location.pathname.indexOf("/shortlink/list")==0){
                            haz_click("a","Claim Link");
                        }
                    },random_numbers(5000, 1000));
                }
                if(location.hostname=='faucet.gold' || location.hostname=='faucetcrypto.com' || location.hostname=='claim4.fun'){
                    setInterval(function(){
                        if(window.location.pathname.indexOf("/claim/step/1")==0 || window.location.pathname.indexOf("/claim/step/2")==0 || window.location.pathname.indexOf("/claim/step/3")==0 || window.location.pathname.indexOf("/BTC")==0 || window.location.pathname.indexOf("/BCH")==0 || window.location.pathname.indexOf("/ETH")==0){
                            haz_click("button","Show Timer / Click Here");
                            haz_click("button","Continue");
                        }
                    },random_numbers(5000, 1000));
                }
                if(location.hostname=='ivn3.com' || location.hostname=='exe.io' || location.hostname=='exe.app' || location.hostname=='exee.io' || location.hostname=='pslfive.com' || location.hostname=='mealip.com'){//Parche exe.io
                    setInterval(function(){
                        haz_click("button","Continue");
                        haz_click("button","continue");
                        haz_click("a.get-link","continue");
                        try {
                            if(document.querySelectorAll("body")[0].innerHTML.search("Get Link")>=0){
                                window.location=document.querySelectorAll('a.get-link')[0].getAttribute("href");
                            }
                        }catch(e){console.log(e);}
                    },random_numbers(5000, 1000));
                }
                if(location.hostname.indexOf('.fc-lc.com')>=0 || location.hostname.indexOf('fcc.lc')>=0 || location.hostname.indexOf('fc.lc')>=0 || location.hostname.indexOf('clik.pw')>=0){//Parche fc.lc y clik.pw
                    setInterval(function(){
                        haz_click("button#submitbtn","continue");
                        haz_click("button#invisibleCaptchaShortlink","continue");
                    },random_numbers(5000, 1000));
                }
            }
            autoshortlinks();
        }
        if(esconderpublicidad){
            async function esconderpublicidad() {setInterval(function(){if(window.location.pathname.indexOf("/ads/")>=0){ocultar('body');}},1000);}
            async function esconderpublicidadextra() {setInterval(function(){ocultar('div#ct_cVwmADZpmuL_disp');},1000);}
            async function escondercoinzilla() {setInterval(function(){ocultar('div.coinzilla');},1000);}
            async function esconderpublicidadptc() {if(window.location.pathname.indexOf("/ptc/view")>=0){setInterval(function(){ocultar('iframe');},1000);}}
            if(location.hostname=='faucetcrypto.com'){esconderpublicidad();esconderpublicidadextra();escondercoinzilla();esconderpublicidadptc();}
        }
        if(esconderchat){
            async function esconderchat() {setInterval(function(){ocultar('div.chatbro_minimized_header.chatbro_header.chatbro_opacity');},1000);}
            if(location.hostname=='faucetcrypto.com'){esconderchat();}
        }
        if(autoasiamag){//Asia-mag automático
            async function autoasiamag() {
                if(location.hostname=='asia-mag.com'){
                    setInterval(function(){
                        if(document.getElementById("video-id")!=null){
                            document.getElementById("video-id").play();
                        }
                        //haz_click("button","START");
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
            }
            autoasiamag();
        }
        if(autoptc){//Listado de PTC y PTC automático
            async function autoptc() {
                if(location.hostname=='faucetcrypto.com'){
                    setInterval(function(){
                        if(window.location.pathname.indexOf("/ptc/list")>=0){
                            haz_click("a","Watch");
                        }
                        if(window.location.pathname.indexOf("/ptc/view")>=0){
                            limpia_link("a","Continue");
                            haz_click("a","Continue");
                        }
                    },random_numbers(5000, 1000));
                }
            }
            autoptc();
        }
    };
})();