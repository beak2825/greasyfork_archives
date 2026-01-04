// ==UserScript==
// @name         Super Birds (Bot)
// @icon         https://icons.duckduckgo.com/ip2/super-birds.com.ico
// @version      0.2.1
// @description  Script automatizado para Super Birds, configuralo segun tus gustos.
// @author       wuniversales
// @namespace    https://greasyfork.org/users/592063
// @include      https://super-birds.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/407275/Super%20Birds%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407275/Super%20Birds%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Recoger_huevos_automaticamente: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_recogida: {
            type: 'number',
            default: 600
        },
        Vender_huevos_automaticamente: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_venta: {
            type: 'number',
            default: 600
        },
        Bono_automatico: {
            type: 'checkbox',
            default: true
        }
    }
});

var autohuevo=cfg.get('Recoger_huevos_automaticamente');
var seghuevo=cfg.get('Segundos_de_espera_recogida');
var autoventa=cfg.get('Vender_huevos_automaticamente');
var segventa=cfg.get('Segundos_de_espera_venta');
var bono=cfg.get('Bono_automatico');

(function() {
    'use strict';
    $( document ).ready(function() {
        var locationsite=window.location.pathname;
        var site1=locationsite.indexOf("/farm/store");
        var site2=locationsite.indexOf("/farm/market");
        var site3=locationsite.indexOf("/farm/bonus");

        if(site1==0){
            if(autohuevo==true){
                setInterval(function(){
                    $(":submit").each(function() {
                        this.click();
                    });
                },parseInt(seghuevo+'000'));
            }
        }
        if(site2==0){
            if(autoventa==true){
                setInterval(function(){
                    $(":submit").each(function() {
                        this.click();
                    });
                },parseInt(segventa+'000'));
            }
        }
        if(site3==0){
            if(bono==true){
                var boton = $(":submit").each(function(){return $(this).html();}).get();
                if (boton[0] === undefined){
                    var reloj=null;
                    var hora=null;
                    var minutos=null;
                    var segundoss=null;
                    const stop = setInterval(function(){
                        reloj=$(".is-countdown").text();
                        var array = reloj.split(":");
                        if(array.length==1){
                            segundoss=array[0];
                            minutos=0;
                            hora=0;
                        }
                        if(array.length==2){
                            segundoss=array[1];
                            minutos=array[0];
                            hora=0;
                        }
                        if(array.length==3){
                            segundoss=array[2];
                            minutos=array[1];
                            hora=array[0];
                        }
                        if (hora==0 && minutos==0 && segundoss==0) {location.href=window.location;clearInterval(stop);}
                    },parseInt('1000'));
                }else{
                    $(":submit").each(function() {this.click();});
                    setTimeout(function(){location.href=window.location;}, 5000);
                }
            }
        }
    });
})();