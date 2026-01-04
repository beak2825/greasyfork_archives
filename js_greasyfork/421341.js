// ==UserScript==
// @name         StakeCube (Bot)
// @icon         https://icons.duckduckgo.com/ip2/stakecube.net.ico
// @version      0.5
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para StakeCube, aumenta tus ganancias.
// @author       RT-Team
// @license      MIT
// @include      https://stakecube.net/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/421341/StakeCube%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421341/StakeCube%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_refrescar_url: {
            type: 'checkbox',
            default: true
        },
        Auto_refrescar_faucets: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera: {
            type: 'number',
            default: 300
        },
        Auto_recoger_faucets: {
            type: 'checkbox',
            default: true
        },
        Eliminar_publicidad: {
            type: 'checkbox',
            default: true
        },
    }
});

var autorefrescarurl=cfg.get('Auto_refrescar_url');
var autorefrescarfaucets=cfg.get('Auto_refrescar_faucets');
var segundosdeespera=cfg.get('Segundos_de_espera');
var autorecogerfaucets=cfg.get('Auto_recoger_faucets');
var eliminarpublicidad=cfg.get('Eliminar_publicidad');

(function() {
    'use strict';
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
    window.onload = function() {
        if(location.hostname.indexOf('stakecube.net')>=0){
            if(window.location.pathname.indexOf("/app/community/faucets")>=0){
                if(autorefrescarurl){
                    async function autorefrescarurl() {
                        setInterval('location.reload(true);',900000);
                    }
                    autorefrescarurl();
                }
                if(autorefrescarfaucets){
                    async function autorefrescarfaucets() {
                        setInterval('getFaucets();',parseInt(segundosdeespera+'000'));
                    }
                    autorefrescarfaucets();
                }
                if(autorecogerfaucets){
                    async function autorecogerfaucets() {
                        setInterval(function(){
                            if(document.body.querySelectorAll("button.btn-success.btn-claim").length>0){
                                document.body.querySelector("button.btn-success.btn-claim").click();
                            }
                        },random_numbers(1000, 3000));
                    }
                    autorecogerfaucets();
                }
            }
        };
        if(eliminarpublicidad){
            addGlobalStyle("iframe[src*=mellowads]{display:none;}");
        }
    }
})();