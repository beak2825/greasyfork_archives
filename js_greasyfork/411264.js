// ==UserScript==
// @name         Beruby (Bot)
// @icon         https://icons.duckduckgo.com/ip2/es.beruby.com.ico
// @version      0.3.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Beruby, redirige los resultados de Beruby a cualquier otro buscador y aumenta tus ganancias.
// @author       wuniversales
// @include      https://*.beruby.com/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/411264/Beruby%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411264/Beruby%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Buscador_al_que_redirigir: {
            type: 'select',
            choices: ['Google', 'Bing', 'Duckduckgo', 'Startpage', 'URL Personalizada'],
            default: 'Duckduckgo'
        },
        URL_Personalizada: {
            type: 'text',
            default: ''
        },
        Metodo_de_redireccion: {
            type: 'select',
            choices: [ 'Get', 'Post'],
            default: 'Get'
        },
        Monetizar_mi_pagina: {
            type: 'checkbox',
            default: true
        },
        Monetizar_el_buscador_beruby: {
            type: 'checkbox',
            default: true
        },
        Monetizar_lo_mas_buscado: {
            type: 'checkbox',
            default: true
        },
        Monetizar_Dias_peugeot_profesionales: {
            type: 'checkbox',
            default: false
        },
        Monetizar_Gama_electrificada_profesionales: {
            type: 'checkbox',
            default: false
        },
        Monetizar_Mes_de_Peugeot: {
            type: 'checkbox',
            default: false
        },
        Monetizar_Nueva_seccion_de_encuestas: {
            type: 'checkbox',
            default: false
        },
        Monetizar_Nuevos_videos_de_moda: {
            type: 'checkbox',
            default: false
        },
    }
});

var mmp=cfg.get('Monetizar_mi_pagina');
var mbb=cfg.get('Monetizar_el_buscador_beruby');
var mlmb=cfg.get('Monetizar_lo_mas_buscado');
var mp=cfg.get('Monetizar_Dias_peugeot_profesionales');
var mmdp=cfg.get('Monetizar_Mes_de_Peugeot');
var mnvdm=cfg.get('Monetizar_Nuevos_videos_de_moda');
var mnsde=cfg.get('Monetizar_Nueva_seccion_de_encuestas');
var mngep=cfg.get('Monetizar_Gama_electrificada_profesionales');
var buscadoralqueredirigir=cfg.get('Buscador_al_que_redirigir');
var urlpersonalizada=cfg.get('URL_Personalizada');
var metododeredireccion=cfg.get('Metodo_de_redireccion');
var url=null;

(function() {
    'use strict';
    function special_search_Get(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable) {
                return decodeURIComponent(pair[1].replace(/[+]/g,' '));
            }
        }
        return '';
    }
    function send_ajax(url,data,token) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("accept", "text/javascript");
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");
        xhttp.setRequestHeader("x-csrf-token", token);
        xhttp.withCredentials = true;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                return this.responseText;
            }
        };
        xhttp.send(data);
    }
    if(window.location.pathname.indexOf("/portal/home")>=0){
        document.querySelector("input[type=text][name=p][id=p]").value = special_search_Get("q");
        var busqueda = document.querySelector("input[type=text][name=p][id=p]").value;
        if(busqueda!=""){
            var token=document.querySelector("input[type=hidden][name=authenticity_token]").value.trim();
            var utf8=document.querySelector("input[type=hidden][name=utf8]").value.trim();
            var ei=document.querySelector("input[type=hidden][name=ei]").value.trim();
            var fr=document.querySelector("input[type=hidden][name=fr]").value.trim();
            if(mmp){
                async function monetiza1() {
                    send_ajax('https://es.beruby.com/portal/click_account?widget_id=3','utf8='+utf8+'&p='+busqueda+'&ei='+ei+'&fr='+fr+'&authenticity_token='+token,token);
                }
                monetiza1();
            }
            if(mbb){
                async function monetiza2() {
                    send_ajax('https://es.beruby.com/portal/click_account?widget_id=502105','authenticity_token='+token,token);
                }
                monetiza2();
            }
            if(mlmb){
                async function monetiza3() {
                    send_ajax('https://es.beruby.com/portal/click_account?widget_id=216245','authenticity_token='+token,token);
                }
                monetiza3();
            }
            if(mp){
                async function monetiza4() {
                    send_ajax('https://es.beruby.com/portal/click_account?widget_id=499997','authenticity_token='+token,token);
                }
                monetiza4();
            }
            if(mmdp){
                async function monetiza5() {
                    send_ajax('https://es.beruby.com/portal/click_account?widget_id=501887','authenticity_token='+token,token);
                }
                monetiza5();
            }
            if(mnvdm){
                async function monetiza6() {
                    send_ajax('https://es.beruby.com/portal/click_account?widget_id=502853','authenticity_token='+token,token);
                }
                monetiza6();
            }
            if(mnsde){
                async function monetiza7() {
                    send_ajax('https://es.beruby.com/portal/click_account?widget_id=504706','authenticity_token='+token,token);
                }
                monetiza7();
            }
            if(mngep){
                async function monetiza8() {
                    send_ajax('https://es.beruby.com/portal/click_account?widget_id=499615','authenticity_token='+token,token);
                }
                monetiza8();
            }
            if(buscadoralqueredirigir=="Duckduckgo"){url="https://duckduckgo.com?q=";}
            if(buscadoralqueredirigir=="Startpage"){url="https://www.startpage.com/do/search?query=";}
            if(buscadoralqueredirigir=="Google"){url="https://www.google.com/search?q=";metododeredireccion="Get";}
            if(buscadoralqueredirigir=="Bing"){url="https://www.bing.com/search?q=";metododeredireccion="Get";}
            if(buscadoralqueredirigir=="URL Personalizada"){url=urlpersonalizada;}
            function sleep(milliseconds) {const date = Date.now();let currentDate = null;do {currentDate = Date.now();} while (currentDate - date < milliseconds);}
            if(metododeredireccion=="Get"){
                document.write("<h1>Redireccionando...</h1>");sleep('1000');location.replace(url+encodeURIComponent(busqueda));
            }else{
                busqueda = busqueda.split("+").join(" ");
                url = url.replace("?", "&#63;");
                if(url.search("&#63;")>=0 || url.search("&q=")>=0){url=url.replace("&#63;","?");url=url.replace("?q=","");url=url.replace("&q=","");}
                if(url.search("&#63;")>=0 || url.search("&w=")>=0){url=url.replace("&#63;","?");url=url.replace("?w=","");url=url.replace("&w=","");}
                if(url.search("&#63;")>=0 || url.search("&text=")>=0){url=url.replace("&#63;","?");url=url.replace("?text=","");url=url.replace("&text=","");}
                if(url.search("&#63;")>=0 || url.search("&q=")>=0){url=url.replace("&#63;","?");url=url.replace("?p=","");url=url.replace("&p=","");}
                document.write("<h1>Redireccionando...</h1>");sleep('1000');
                document.write("<form id='redirpost' action='"+url+"' method='post'><input type='hidden' id='q' name='q' value='"+busqueda+"'><input type='hidden' id='query' name='query' value='"+busqueda+"'><input type='hidden' id='text' name='text' value='"+busqueda+"'><input type='hidden' id='p' name='p' value='"+busqueda+"'></form>");
                sleep('1000');document.getElementById("redirpost").submit();
            }
        }
    }
})();