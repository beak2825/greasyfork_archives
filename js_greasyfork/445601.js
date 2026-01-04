// ==UserScript==
// @name         Presearch (Bot)
// @icon         https://icons.duckduckgo.com/ip2/presearch.com.ico
// @version      0.3
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Presearch, redirige los resultados de Presearch a cualquier otro buscador.
// @author       wuniversales
// @include      https://presearch.com/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @run-at       document-end
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445601/Presearch%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445601/Presearch%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Redireccionar_el_buscador: {
            type: 'checkbox',
            default: true
        },
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
    }
});

var redireccionar=cfg.get('Redireccionar_el_buscador');
var buscadoralqueredirigir=cfg.get('Buscador_al_que_redirigir');
var urlpersonalizada=cfg.get('URL_Personalizada');
var metododeredireccion=cfg.get('Metodo_de_redireccion');
var url;
(function() {
    'use strict';
    if(window.location.pathname.indexOf("/search")==0){
        if(redireccionar){
            if(buscadoralqueredirigir=="Duckduckgo"){url="https://duckduckgo.com?q=";}
            if(buscadoralqueredirigir=="Startpage"){url="https://www.startpage.com/do/search?query=";}
            if(buscadoralqueredirigir=="Google"){url="https://www.google.com/search?q=";metododeredireccion="Get";}
            if(buscadoralqueredirigir=="Bing"){url="https://www.bing.com/search?q=";metododeredireccion="Get";}
            if(buscadoralqueredirigir=="URL Personalizada"){url=urlpersonalizada;}
            var busqueda=document.querySelector("input[type=text][name=q]").value.trim();
            if(metododeredireccion=="Get"){
                document.write("<h1>Redireccionando...</h1>");location.replace(url+encodeURIComponent(busqueda));
            }else{
                url = url.replace("?", "&#63;");
                if(url.search("&#63;")>=0 || url.search("&q=")>=0){url=url.replace("&#63;","?");url=url.replace("?q=","");url=url.replace("&q=","");}
                if(url.search("&#63;")>=0 || url.search("&w=")>=0){url=url.replace("&#63;","?");url=url.replace("?w=","");url=url.replace("&w=","");}
                if(url.search("&#63;")>=0 || url.search("&text=")>=0){url=url.replace("&#63;","?");url=url.replace("?text=","");url=url.replace("&text=","");}
                if(url.search("&#63;")>=0 || url.search("&q=")>=0){url=url.replace("&#63;","?");url=url.replace("?p=","");url=url.replace("&p=","");}
                document.write("<h1>Redireccionando...</h1>");
                document.write("<form id='redirpost' action='"+url+"' method='post'><input type='hidden' id='q' name='q' value='"+busqueda+"'><input type='hidden' id='query' name='query' value='"+busqueda+"'><input type='hidden' id='text' name='text' value='"+busqueda+"'><input type='hidden' id='p' name='p' value='"+busqueda+"'></form>");
                document.getElementById("redirpost").submit();
            }
        }
    }
})();