// ==UserScript==
// @name         FireFaucet (Bot)
// @icon         https://icons.duckduckgo.com/ip2/firefaucet.win.ico
// @version      0.1.5
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para FireFaucet, aumenta tus ganancias.
// @author       wuniversales
// @include      https://firefaucet.win/*
// @include      https://*.freebcc.org/*
// @include      https://dogemate.com/*
// @include      https://faupto.com/*
// @include      *theblogcash.in/*
// @include      *.dutchycorp.space/*
// @include      https://dutchycorp.ovh/*
// @include      *linkdesh.xyz/*
// @include      *.100count.net/*
// @include      https://100count.net/*
// @include      https://zagl.info/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416106/FireFaucet%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416106/FireFaucet%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
        Esconder_chat: {
            type: 'checkbox',
            default: false
        },
        Autofoco_en_captcha: {
            type: 'checkbox',
            default: true
        },
        Niveles_y_recompensas_automaticas: {
            type: 'checkbox',
            default: true
        },
        Tareas_automaticas: {
            type: 'checkbox',
            default: true
        },
        Auto_shortlinks: {
            type: 'checkbox',
            default: true
        },
    }
});

var esconderpublicidad=cfg.get('Esconder_publicidad');
var esconderchat=cfg.get('Esconder_chat');
var autofocoencaptcha=cfg.get('Autofoco_en_captcha');
var nivelesyrecompensasautomaticas=cfg.get('Niveles_y_recompensas_automaticas');
var tareasautomaticas=cfg.get('Tareas_automaticas');
var autoshortlinks=cfg.get('Auto_shortlinks');

(function() {
    'use strict';
    function sleep(milliseconds) {const date = Date.now();let currentDate = null;do {currentDate = Date.now();} while (currentDate - date < milliseconds);}
    $(document).ready(function(){
        if(esconderpublicidad==true){
            async function esconderpublicidad() {
                if(location.hostname=='firefaucet.win'){
                    $('div.l3').css("visibility", "hidden");
                    $('div#sad-1').css("visibility", "hidden");
                    if(window.location.pathname.indexOf("/viewptc")>=0){
                        $('iframe').css("visibility", "hidden");
                    }
                }
            }
            esconderpublicidad();
        }
        if(esconderchat==true){
            async function esconderchat() {
                if(location.hostname=='firefaucet.win'){
                    try{$("div.chatbro_header.chatbro_minimized_header.chatbro_opacity").css("display", "none");}catch(e){console.log(e);}
                }
            }
            esconderchat();
        }
        if(location.hostname=='firefaucet.win'){
            if(window.location.pathname.indexOf("/viewptc")>=0){
                if(autofocoencaptcha==true){
                    async function autofocoencaptcha() {
                        setInterval(function(){
                            if($("input[type=text][name=captcha]").is(':visible')==true){
                                $("input[type=text][name=captcha]").focus();
                            }
                        },1000);
                    }
                    autofocoencaptcha();
                }
            }
            if(window.location.pathname.indexOf("/tasks")>=0){
                if(tareasautomaticas==true){
                    async function tareasautomaticas() {
                        sleep('1000');
                        if($('table > tbody > tr > td > a.btn.waves-effect.waves-light.collect-btn:not(.disabled):first').length > 0){
                            window.location.href=window.location.protocol+'//'+window.location.hostname+$('table > tbody > tr > td > a.btn.waves-effect.waves-light.collect-btn:not(.disabled):first').attr("href");
                        }
                    }
                    tareasautomaticas();
                }
            }
            if(window.location.pathname.indexOf("/levels")>=0){
                if(nivelesyrecompensasautomaticas==true){
                    async function nivelesyrecompensasautomaticas() {
                        sleep('1000');
                        if($('table > tbody > tr > th > a.btn.waves-effect.waves-light.collect-btn:not(.disabled):first').length > 0){
                            window.location.href=window.location.protocol+'//'+window.location.hostname+$('table > tbody > tr > th > a.btn.waves-effect.waves-light.collect-btn:not(.disabled):first').attr("href");
                        }
                    }
                    nivelesyrecompensasautomaticas();
                }
            }
            if(window.location.pathname.indexOf('/shortlinks')>=0){
                $('form').prop('target', '_self');
            }
        }
        if(autoshortlinks==true){
            if(location.hostname.indexOf(".freebcc.org")>=0){
                window.location.href=$('button#makingdifferenttimer.btn-captchas').attr('onclick').replace(/ /g, "").substring(70).replace("');",'');
            }
            if(location.hostname=='dogemate.com' || location.hostname=='faupto.com' || location.hostname=='linkdesh.xyz'){
                $('button#bdt:submit').click();
            }
            if(location.hostname=='theblogcash.in' || location.hostname=='linkdesh.xyz'){
                $('button#mdt:submit').click();
            }
            if(location.hostname=='100count.net'){
                if($("div#cl1 > a").length > 0){
                    window.location.href=$('div#cl1 > a').attr("href");
                }
            }
            if(location.hostname.indexOf(".100count.net")>=0){
                if($('button#mdt:submit').length > 0){
                    $('button#mdt:submit').click();
                }
            }
            if(location.hostname.indexOf(".dutchycorp.space")>=0){
                sleep('10000');
                if($("div#cl1 > center > a").length > 0){
                    window.location.href=$("div#cl1 > center > a").attr("href");
                }
            }
            if(location.hostname=='dutchycorp.ovh'){
                sleep('10000');
                if($("div#cl0").length > 0){
                    showElem('cl1');
                }
                if($("div#cl1").length > 0){
                    showElem('cl2');
                }
            }
            if(location.hostname.indexOf("zagl.info")>=0){
                if(typeof $('a.btn.btn-primary').attr("href") !== "undefined"){window.location.href='//'+location.hostname+$('a.btn.btn-primary').attr("href");}
            }
        }
    });
})();