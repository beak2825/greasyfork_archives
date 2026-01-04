// ==UserScript==
// @name         Passive Expert (Bot)
// @icon         https://icons.duckduckgo.com/ip2/passive.expert.ico
// @version      0.1.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Passive Expert, oculta la publicidad del login entre otras funciones.
// @author       wuniversales
// @include      https://passive.expert/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/411866/Passive%20Expert%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411866/Passive%20Expert%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Esconder_publicidad_inicial: {
            type: 'checkbox',
            default: true
        },
        Anuncios_iniciales_automaticos: {
            type: 'checkbox',
            default: true
        },
    }
});

var esconderpublicidad=cfg.get('Esconder_publicidad_inicial');
var anunciosautomaticos=cfg.get('Anuncios_iniciales_automaticos');

(function() {
    'use strict';
    var locationsite=window.location.pathname;
    var site1=locationsite.indexOf("/ads.php");
    var site2=locationsite.indexOf("/ads2.php");
    if(site1==0 || site2==0){
        if(esconderpublicidad==true){
            $("iframe").hide();//Esconder publicidad
        }
        if(anunciosautomaticos==true){
            $("form").submit();
        }
    }
})();