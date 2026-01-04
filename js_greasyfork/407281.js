// ==UserScript==
// @name         Golden Mines (Bot)
// @icon         https://icons.duckduckgo.com/ip2/goldenmines.biz.ico
// @version      0.2.3
// @description  Script automatizado para Golden Mines, configuralo segun tus gustos.
// @author       wuniversales
// @namespace    https://greasyfork.org/users/592063
// @include      https://goldenmines.biz/*
// @include      https://golden-mines.biz/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/407281/Golden%20Mines%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407281/Golden%20Mines%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Recoger_oro_automaticamente: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_recogida: {
            type: 'number',
            default: 600
        },
        Procesar_oro_automaticamente: {
            type: 'checkbox',
            default: true
        },
        Segundos_de_espera_proceso: {
            type: 'number',
            default: 600
        },
        Bono_automatico: {
            type: 'checkbox',
            default: true
        }
    }
});

var autohuevo=cfg.get('Recoger_oro_automaticamente');
var seghuevo=cfg.get('Segundos_de_espera_recogida');
var autoventa=cfg.get('Procesar_oro_automaticamente');
var segventa=cfg.get('Segundos_de_espera_proceso');
var bono=cfg.get('Bono_automatico');

(function() {
    'use strict';
    $( document ).ready(function() {
        var locationsite=window.location.pathname;
        var site1=locationsite.indexOf("/en/account/store");
        var site11=locationsite.indexOf("/ru/account/store");
        var site12=locationsite.indexOf("/uk/account/store");
        var site2=locationsite.indexOf("/en/account/market");
        var site21=locationsite.indexOf("/ru/account/market");
        var site22=locationsite.indexOf("/uk/account/market");
        var site3=locationsite.indexOf("/en/account/bonus");
        var site31=locationsite.indexOf("/ru/account/bonus");
        var site32=locationsite.indexOf("/uk/account/bonus");

        if(site1==0 || site11==0 || site12==0){
            if(autohuevo==true){
                setInterval(function(){
                    $(":submit").each(function() {
                        this.click();
                    });
                },parseInt(seghuevo+'000'));
            }
        }
        if(site2==0 || site21==0 || site22==0){
            if(autoventa==true){
                setInterval(function(){
                    $(":submit").each(function() {
                        this.click();
                    });
                },parseInt(segventa+'000'));
            }
        }
        if(site3==0 || site31==0 || site32==0){
            if(bono==true){
                var buscasubmit = $(".text-green").each(function(){return $(this).html();}).get();
                if (parseInt(buscasubmit.length) === 1){
                    var time = $(".text-green").text();
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
                    $(".button--farm").each(function() {
                        this.click();
                    });
                    setTimeout(function(){location.href=window.location;}, '86400');
                }
            }
        }
    });
})();