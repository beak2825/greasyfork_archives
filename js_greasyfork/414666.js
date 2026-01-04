// ==UserScript==
// @name         AutoClaim (Bot)
// @icon         https://icons.duckduckgo.com/ip2/autoclaim.in.ico
// @version      0.1.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para AutoClaim.in y Autobitco.in, aumenta tus ganancias.
// @author       wuniversales
// @include      https://autoclaim.in/*
// @include      https://autobitco.in/*
// @include      https://abed-games.com/poro/*
// @include      https://abed-games.com/moro/*
// @include      https://abed-games.com/zoro/*
// @include      https://abed-games.com/short1/*
// @include      https://abed-games.com/short2/*
// @include      https://abed-games.com/short3/*
// @include      https://abed-games.com/1/*
// @include      https://abed-games.com/2/*
// @include      https://abed-games.com/3/*
// @include      https://yoshare.net/*
// @include      https://droplink.co/*
// @include      https://url.namaidani.com/*
// @include      https://idea4cash.com/*
// @include      https://bestmoneysites.com/*
// @include      https://best18vd.com/*
// @include      https://shrtbtc.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/414666/AutoClaim%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414666/AutoClaim%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_shortlinks: {
            type: 'checkbox',
            default: true
        },
    }
});

var autoshortlinks=cfg.get('Auto_shortlinks');

(function() {
    'use strict';
    function sleep(milliseconds) {const date = Date.now();let currentDate = null;do {currentDate = Date.now();} while (currentDate - date < milliseconds);}
        if(autoshortlinks==true){
            var redireccion=null;
            function obtenerGet(variable) {
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable) {
                        return decodeURIComponent(pair[1]);
                    }
                }
                return '';
            }
            if(location.hostname=='abed-games.com'){//Parche Poro / Moro / Zoro / Linkat 1 / Linkat 2 / Linkat 3 / Shink 1 / Shink 2 / Shink 3
                setInterval(function(){
                    if ($("form > input#shorted").length > 0) {
                        redireccion=$('form > input#shorted').val();
                        redireccion=redireccion.trim();
                        if(redireccion!=''){
                            try {
                                window.location.replace($('form > input#shorted').val());
                            }
                            catch(e) {}
                        }
                    }
                },1000);
            }
            if(location.hostname=='yoshare.net' || location.hostname=='droplink.co'){//Parche DropLink
                try {$('form > input:image').click();}catch(e) {}
                try {yuidea();}catch(e) {}

                setInterval(function(){
                    try {
                        if($('a.btn-success').html().indexOf('Get Link')==0){
                            window.location.replace($('a.btn-success').attr('href'));
                        }
                    }
                    catch(e) {}
                },1000);
            }
            if(location.hostname=='url.namaidani.com'){//Parche Namaidani
                setInterval(function(){
                    try {
                        if($('a.btn').html().indexOf('Skip Ad')==0){
                            window.location.href($('a.btn').attr('href'));
                        }
                    }
                    catch(e) {}
                },1000);

            }
            if(location.hostname=='idea4cash.com' || location.hostname=='bestmoneysites.com'|| location.hostname=='best18vd.com' || location.hostname=='shrtbtc.com'){//Parche ShrtBtc
                setInterval(function(){
                    try {
                        if($('a#nexts').attr('href').indexOf('http')==0){
                            window.location.href($('a#nexts').attr('href'));
                        }
                    }
                    catch(e) {}
                },1000);

            }
        }
})();