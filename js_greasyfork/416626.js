// ==UserScript==
// @name         FollowFast (Bot)
// @icon         https://icons.duckduckgo.com/ip2/followfast.com.ico
// @version      0.1.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para FollowFast, aumenta tus ganancias.
// @author       wuniversales
// @include      https://followfast.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416626/FollowFast%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416626/FollowFast%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_youtube_play: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_minimos: {
            type: 'number',
            default: 1
        },
        Segundos_de_espera_maximos: {
            type: 'number',
            default: 15
        },
    }
});

var autoyoutubeplay=cfg.get('Auto_youtube_play');
var segundosdeesperaminimos=cfg.get('Segundos_de_espera_minimos');
var segundosdeesperamaximos=cfg.get('Segundos_de_espera_maximos');

(function() {
    'use strict';
    function aleatorio(min,max) {return Math.round(Math.random() * (max - min) + min);}
    function sleep(milliseconds) {const date = Date.now();let currentDate = null;do {currentDate = Date.now();} while (currentDate - date < milliseconds);}
    $(document).ready(function(){
        if(autoyoutubeplay==true){
            if(window.location.pathname.indexOf("/youtube.php")==0){
                var segundos=aleatorio(segundosdeesperaminimos,segundosdeesperamaximos);
                sleep(segundos+'000');
                try{SurfPlayVideo();}catch{}
            }
        }
    });
})();