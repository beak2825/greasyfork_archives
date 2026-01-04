// ==UserScript==
// @name         Click cripto (Bot)
// @icon         https://icons.duckduckgo.com/ip2/dogeclick.com.ico
// @version      0.1.2
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para bots de Click Bot de telegram.
// @author       wuniversales
// @include      http*://dogeclick.com/*
// @include      http*://doge.click/*
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/414630/Click%20cripto%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414630/Click%20cripto%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Autocerrar_publicidad: {
            type: 'checkbox',
            default: true
        },
    }
});

var acp=cfg.get('Autocerrar_publicidad');

(function() {
    'use strict';

    function send_ajax(url,data) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("accept", "*/*");
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");
        xhttp.withCredentials = true;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                return this.responseText;
            }
        };
        xhttp.send(data);
    }
    if(window.location.pathname.indexOf("/visit")>=0){
        window.onload = function() {
            var token=document.querySelector("div#headbar").getAttribute("data-token");
            var codigo=document.querySelector("div#headbar").getAttribute("data-code");
            var espera=document.querySelector("div#headbar").getAttribute("data-timer");

            setTimeout(function(){
                send_ajax('https://doge.click/reward','code='+codigo+'&token='+token);
                if(acp){
                    window.close();
                }
            },parseInt(espera+'000'));
        }
    }
})();