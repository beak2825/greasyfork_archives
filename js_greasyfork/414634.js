// ==UserScript==
// @name         Freegridco.in (Bot)
// @icon         https://icons.duckduckgo.com/ip2/freegridco.in.ico
// @version      0.1.3
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Freegridco.in, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://freegridco.in/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/414634/Freegridcoin%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414634/Freegridcoin%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_GRC: {
            type: 'checkbox',
            default: true
        },
    }
});

var autogrc=cfg.get('Auto_GRC');

(function() {
    'use strict';
    window.onload = function() {
        if(autogrc==true){
            setInterval(function(){
                if (document.querySelectorAll('p#roll_button').length > 0) {
                    if (document.querySelector('p#roll_button').style.display!='none'){
                        try {
                            do_free_roll();
                        }
                        catch(e) {}
                    }
                }
            },1000);
        }
    }
})();