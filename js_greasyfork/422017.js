// ==UserScript==
// @name         Ronex (Bot)
// @icon         https://icons.duckduckgo.com/ip2/ronex.io.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Ronex, aumenta tus ganancias.
// @author       wuniversales
// @include      https://ronex.io/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/422017/Ronex%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422017/Ronex%20%28Bot%29.meta.js
// ==/UserScript==
var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Eliminar_focus_en_mineria: {
            type: 'checkbox',
            default: true
        },
    }
});

var eliminarfocusenmineria=cfg.get('Eliminar_focus_en_mineria');

(function() {
    'use strict';

    if(window.location.pathname.indexOf("/cabinet/mining")>=0){
        async function hack_mineria() {
            if(eliminarfocusenmineria){
                window.removeEventListener('focus', start_mining);
                window.removeEventListener('blur', stop_mining);
            }
        }
        hack_mineria();
    }
})();