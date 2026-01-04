// ==UserScript==
// @name         Uptocoin (Bot)
// @icon         https://icons.duckduckgo.com/ip2/uptocoin.tk.ico
// @version      0.1.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Uptocoin, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://uptocoin.tk/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/432267/Uptocoin%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432267/Uptocoin%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Mejorar_autofaucet: {
            type: 'checkbox',
            default: true
        },
    }
});

var mejorar_autofaucet=cfg.get('Mejorar_autofaucet');

(function() {
    'use strict';

    window.onload = function() {
        if(window.location.pathname.indexOf("/fp/faucet.php")==0){
            if(mejorar_autofaucet){
                if(location.protocol=="http:"){ location.protocol = "https:"; } //Forzar https
                document.body.innerHTML = '<b style="text-align:center">'+document.body.querySelector("div .alert-success").innerText+'</b>';
                setTimeout("location.reload(true);",60000);
            }
        }
    }
})();