// ==UserScript==
// @name         RandomSatoshi (Bot)
// @icon         https://icons.duckduckgo.com/ip2/randomsatoshi.win.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para RandomSatoshi, aumenta tus ganancias.
// @author       wuniversales
// @include      https://randomsatoshi.win/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416332/RandomSatoshi%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416332/RandomSatoshi%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
    }
});

var esconderpublicidad=cfg.get('Esconder_publicidad');

(function() {
    'use strict';
    function sleep(milliseconds) {const date = Date.now();let currentDate = null;do {currentDate = Date.now();} while (currentDate - date < milliseconds);}
    $(document).ready(function(){
        if(esconderpublicidad==true){
            async function esconderpublicidad() {
                if(location.hostname=='randomsatoshi.win'){
                    try{$('div [class^="RS-Header-banner"]').css("visibility", "hidden");}catch(e){}
                }
            }
            esconderpublicidad();
        }
    });
})();