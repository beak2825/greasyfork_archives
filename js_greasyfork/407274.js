// ==UserScript==
// @name         Golden Tea (Bot)
// @icon         https://icons.duckduckgo.com/ip2/golden-tea.me.ico
// @version      0.2.1
// @description  Script automatizado para Golden Tea, configuralo segun tus gustos.
// @author       wuniversales
// @namespace    https://greasyfork.org/users/592063
// @include      https://golden-tea.me/*
// @include      https://golden-tea.com/*
// @include      https://golden-tea.cc/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/407274/Golden%20Tea%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407274/Golden%20Tea%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Recoger_hojas_automaticamente: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_recogida: {
            type: 'number',
            default: 60
        },
        Vender_hojas_automaticamente: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_venta: {
            type: 'number',
            default: 60
        },
        Riego_automatico: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_del_riego: {
            type: 'number',
            default: 60
        },
        Bono_automatico: {
            type: 'checkbox',
            default: true
        }
    }
});

var autohuevo=cfg.get('Recoger_hojas_automaticamente');
var seghuevo=cfg.get('Segundos_de_espera_recogida');
var autoventa=cfg.get('Vender_hojas_automaticamente');
var segventa=cfg.get('Segundos_de_espera_venta');
var riegoauto=cfg.get('Riego_automatico');
var segriego=cfg.get('Segundos_de_espera_del_riego');
var bono=cfg.get('Bono_automatico');

(function() {
    'use strict';
    $( document ).ready(function() {
        var locationsite=window.location.pathname;
        var site1=locationsite.indexOf("/game/");
        var site2=locationsite.indexOf("/bonus/");
        
        if(site1==0){
            if(autohuevo==true){
                if(parseInt($("#countCollectList").text())!=0){
                    setInterval(function(){
                        clkGameCollect();
                    }, parseInt(seghuevo+'000'));
                }
            }
            if(autoventa==true){
                if(parseInt($("#countSellList").text())>=20){
                    setInterval(function(){
                        clkGameSell();
                    }, parseInt(segventa+'000'));
                }
            }
            if(riegoauto==true){
                setInterval(function(){
                    clkPolivField();
                }, parseInt(segriego+'000'));
            }
            if(autohuevo==true || autoventa==true || riegoauto==true){
                $(".modal-backdrop").css("display:", "none");
            }
        }
        if(site2==0){
            if(bono==true){
                var hora=null;
                var minutos=null;
                var segundoss=null;
                var contador=null;

                setInterval(function(){
                    contador = $(".inn").each(function(){return $(this).html();}).get();
                    hora=parseInt(contador[3].innerText+contador[7].innerText);
                    minutos=parseInt(contador[11].innerText+contador[15].innerText);
                    segundoss=parseInt(contador[19].innerText+contador[23].innerText);
                    if (hora==0 && minutos==0 && segundoss==0) {$(":submit").each(function() {this.click();});}
                },parseInt('1000'));
            }
        }
    });
})();