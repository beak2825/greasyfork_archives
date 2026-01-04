// ==UserScript==
// @name         Even Gold (Bot)
// @icon         https://icons.duckduckgo.com/ip2/elvengold.net.ico
// @version      0.2.4
// @description  Script automatizado para Even Gold, configuralo segun tus gustos.
// @author       wuniversales
// @namespace    https://greasyfork.org/users/592063
// @include      https://elvengold.net/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/407278/Even%20Gold%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407278/Even%20Gold%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Recoger_monedas_automaticamente: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_recogida: {
            type: 'number',
            default: 300
        },
        Vender_monedas_automaticamente: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_venta: {
            type: 'number',
            default: 300
        },
        Intercambio_automatico: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_intercambio: {
            type: 'number',
            default: 300
        },
        Recoger_monedas_del_abismo: {
            type: 'checkbox',
            default: true
        },
        Bono_automatico: {
            type: 'checkbox',
            default: true
        },
    }
});

var autohuevo=cfg.get('Recoger_monedas_automaticamente');
var seghuevo=cfg.get('Segundos_de_espera_recogida');
var autoventa=cfg.get('Vender_monedas_automaticamente');
var segventa=cfg.get('Segundos_de_espera_venta');
var autointer=cfg.get('Intercambio_automatico');
var seginter=cfg.get('Segundos_de_espera_intercambio');
var autoabismo=cfg.get('Recoger_monedas_del_abismo');
var bono=cfg.get('Bono_automatico');

(function() {
    'use strict';
    $( document ).ready(function() {
        var locationsite=window.location.pathname;
        var site1=locationsite.indexOf('/game');
        var site2=locationsite.indexOf('/exchange');
        var site3=locationsite.indexOf('/bonus');

        if(site1==0){
            if(autohuevo==true){
                setInterval(function(){
                    if(parseInt($(".l-collect-coins").text())!=0){
                        $("#get_coins").each(function() {
                            this.click();
                        });
                    }
                },parseInt(seghuevo+'000'));
            }
            if(autoventa==true){
                setInterval(function(){
                    if(parseInt($(".l-sell-coins").text())>=20){
                        $("#sell_coins").each(function() {
                            this.click();
                        });
                    }
                },parseInt(segventa+'000'));
            }
            if(bono==true){
                var buscabono = $(".get_bonus_area_btn").each(function(){return $(this).html();}).get();
                if (buscabono[0] === undefined){}else{
                    $(".get_bonus_area_btn").each(function() {
                        this.click();
                    });
                    $(".get_bonus_area_btn").css("display", "none");
                }

            }
            if(autoabismo==true){
                setInterval(function(){
                        try{$("div[class=ga_coin]").click();}catch(e){}
                },parseInt('1000'));
            }
        }
        if(site2==0){
            if(autointer==true){
                setInterval(function(){
                    $("#exchange-gold").each(function() {
                        this.click();
                    });
                }, parseInt(seginter+'000'));
            }
        }
        if(site3==0){
            if(bono==true){
                var buscasubmit = $(".btn-get-bonus").each(function(){return $(this).html();}).get();
                if (buscasubmit[0] === undefined){
                    var time = $("#bonus-time").text();
                    var array = time.split(" ");
                    var x=0;
                    var y=0;
                    var test=[];
                    for(x;x<array.length;x++) {
                        if(isNaN(parseInt(array[x]))==false){
                            if(y==0){
                                test[y]=array[x];
                                y++;
                            }else{
                                test[y]=test[y-1]+array[x];
                                y++;
                            }
                        }
                    }
                    var segundos=null;
                    if(test.length==1){
                        segundos=parseInt(test[0])*60;
                    }else{
                        var minutos=parseInt(test[0])*60;
                        segundos=(parseInt(test[1])+minutos)*60;
                    }
                    setTimeout(function(){location.href=window.location;}, segundos+'000');
                }else{
                    $(".btn-get-bonus").each(function() {
                        this.click();
                    });
                }
            }
        }
    });
})();