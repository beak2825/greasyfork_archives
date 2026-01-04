// ==UserScript==
// @name         BtcMaker (Bot)
// @icon         https://icons.duckduckgo.com/ip2/btcmaker.io.ico
// @version      0.1.3
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para BtcMaker, aumenta tus ganancias.
// @author       wuniversales
// @include      https://btcmaker.io/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416551/BtcMaker%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416551/BtcMaker%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_reclamar: {
            type: 'checkbox',
            default: true
        },
        Tiempo_de_espera_en_segundos: {
            type: 'number',
            default: 3603
        },
    }
});

var tiempodeesperaensegundos=cfg.get('Tiempo_de_espera_en_segundos');
var autoreclamar=cfg.get('Auto_reclamar');

(function() {
    'use strict';
    $(document).ready(function(){
        if(autoreclamar==true){
            if(window.location.pathname.indexOf("/faucet.php")==0){
                async function autoreclamar() {
                    setInterval(function(){process_claim_hourly_faucet();},tiempodeesperaensegundos+'000');
                }
                $('button#process_claim_hourly_faucet').on('click', autoreclamar);
            }
        }
    });
})();