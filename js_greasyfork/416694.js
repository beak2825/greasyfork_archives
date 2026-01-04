// ==UserScript==
// @name         WebFlex24 (Bot)
// @icon         https://icons.duckduckgo.com/ip2/webflex24.com.ico
// @version      0.1.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para WebFlex24, aumenta tus ganancias.
// @author       wuniversales
// @include      https://webflex24.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416694/WebFlex24%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416694/WebFlex24%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_renovar_paquete: {
            type: 'checkbox',
            default: true
        },
        Auto_cerrar_cartel: {
            type: 'checkbox',
            default: true
        },
        Auto_refrescar: {
            type: 'checkbox',
            default: true
        },
        Segundos_para_refrescar: {
            type: 'number',
            default: '300'
        },
    }
});

var autorenovarpaquete=cfg.get('Auto_renovar_paquete');
var autocerrarcartel=cfg.get('Auto_cerrar_cartel');
var autorefrescar=cfg.get('Auto_refrescar');
var segundospararefrescar=cfg.get('Segundos_para_refrescar');

(function() {
    'use strict';
    function sleep(milliseconds) {const date = Date.now();let currentDate = null;do {currentDate = Date.now();} while (currentDate - date < milliseconds);}
    $(document).ready(function(){
        if(autorenovarpaquete==true){
            if(location.hostname=='webflex24.com'){
                async function autorenovarpaquete() {
                    setInterval(function(){
                        if($('#html_cont > div > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > span').is(':visible')==true){
                            $('#html_cont > div > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > span').click();
                            $('#html_cont > div > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) > span').hide();
                        }
                        if($('#In_Lin_1 > div:nth-child(4) > div > div.md_button_send_6').is(':visible')==true){
                            $('#In_Lin_1 > div:nth-child(4) > div > div.md_button_send_6').click();
                            $('#In_Lin_1 > div:nth-child(4) > div > div.md_button_send_6').hide();
                        }
                        if($('#In_Lin_3 > div:nth-child(4) > div > div.md_button_send_2').is(':visible')==true){InfoBlockClose();}
                    },1000);
                }
                autorenovarpaquete();
            }
        }
        if(autocerrarcartel==true){
            if(location.hostname=='webflex24.com'){
                async function autocerrarcartel() {
                    setInterval(function(){
                        if($('#In_Lin_1 > div:nth-child(11) > div > div.md_button_send_2').is(':visible')==true){
                            InfoBlockClose();
                        }
                    },1000);
                }
                autocerrarcartel();
            }
        }
        if(autorefrescar==true){
            setInterval('location.reload(true)',parseInt(segundospararefrescar+'000'));
        }
    });
})();