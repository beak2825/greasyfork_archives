// ==UserScript==
// @name         H2OX (Bot)
// @icon         https://icons.duckduckgo.com/ip2/h2ox.io.ico
// @version      0.1.6
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para H2OX, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://h2ox.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423456/H2OX%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423456/H2OX%20%28Bot%29.meta.js
// ==/UserScript==

var autofaucets=true;
var autorefrescar=true;

(function() {
    'use strict';
    function haz_click(identificador) {
        var x, i,status=false;
        try{
        x = document.querySelectorAll(identificador);
        if(x){
            if (x.length > 0) {
                for (i = 0; i < x.length; i++) {
                    if(x[i].style.display!='none' && !x[i].disabled){
                        x[i].click();status=true;
                        break;
                    }
                }
            }
        }
        }catch(e){console.log(e);}
        return status;
    }
    function random_numbers(min, max) {
        if (min == null || max == null) { console.log('Error: random_number(min,max); El valor min o max es null.'); } else {
            try {
                min = parseInt(min);
                max = parseInt(max);
            } catch (e) { console.log(e); }
            return Math.floor((Math.random() * max) + min);
        }
    }
    if(location.hostname.indexOf('h2ox.io')>=0){
        if(autofaucets){
            async function autofaucets() {
                var status=true;
                setInterval(function(){
                    if(window.location.pathname.indexOf("/faucets")>=0){
                        if(status){
                            document.querySelector("div[class=faucetBox]").remove();
                            status=false;
                        }
                        haz_click("div[class=one] > div.ticon");
                    }
                    if(window.location.pathname.indexOf("-faucet")>=0){
                        haz_click("span[id=claimbtn]");
                        try{
                            if(document.querySelector("div.btn.green").innerText.indexOf("claimed")>=0){
                                window.location='/faucets';
                            }
                        }catch(e){}
                        try{
                            if(document.querySelector("div.btn.salmon").innerText.indexOf("claim yet")>=0){
                                window.location='/faucets';
                            }
                        }catch(e){}
                    }
                },random_numbers(3000, 1000));
            }
            autofaucets();
        }
        if(autorefrescar){
            if(window.location.pathname.indexOf("/faucets")>=0){
                async function autorefrescar() {
                    setInterval('location.reload(true);',900000);
                }
                autorefrescar();
            }
        }
    }
})();