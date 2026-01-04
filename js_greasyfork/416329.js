// ==UserScript==
// @name         Free Multicoins (Bot)
// @icon         https://icons.duckduckgo.com/ip2/freecardano.com.ico
// @version      0.1.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Free Multicoins, aumenta tus ganancias.
// @author       wuniversales
// @include      https://freesteam.io/*
// @include      https://freenem.com/*
// @include      https://freecardano.com/*
// @include      https://coinfaucet.io/*
// @include      https://freebitcoin.io/*
// @include      https://freetether.com/*
// @include      https://freeusdcoin.com/*
// @include      https://freebinancecoin.com/*
// @include      https://freeethereum.com/*
// @include      https://free-tron.com/*
// @include      https://freedash.io/*
// @include      https://freechain.link/*
// @include      https://freeneo.io/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416329/Free%20Multicoins%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416329/Free%20Multicoins%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
        Auto_giro: {
            type: 'checkbox',
            default: true
        },
    }
});

var esconderpublicidad=cfg.get('Esconder_publicidad');
var autogiro=cfg.get('Auto_giro');

(function() {
    'use strict';
    $(document).ready(function(){
        if(esconderpublicidad==true){
            async function esconderpublicidad() {
                $('div[id^="rc-widget"]').css("display", "none");
                $('div[id*="ScriptRoot"]').css("display", "none");
                $('iframe').css("visibility", "hidden");
                $('div.d-none.d-lg-block').css("visibility", "hidden");
            }
            esconderpublicidad();
        }
        if(window.location.pathname.indexOf("/free")>=0){
            if(autogiro==true){
                async function autoclick() {
                    setInterval(function(){
                        if($("div.minutes > div.digits").html().indexOf("-")>=0 || $("div.seconds > div.digits").html().indexOf("-")>=0 || $("div.minutes > div.digits").html()=='0' && $("div.seconds > div.digits").html()=='0'){location.reload(true);}
                        if($("button.main-button-2.roll-button.bg-2").is(':visible')==true){
                            $("button.main-button-2.roll-button.bg-2").click();
                            $("button.main-button-2.roll-button.bg-2").hide();
                        }
                    },3000);
                }
                autoclick();
            }
        }
    });
})();