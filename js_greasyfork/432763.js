// ==UserScript==
// @name         Sinobu online (Bot)
// @icon         https://icons.duckduckgo.com/ip2/sinobu.online.ico
// @version      0.1.7
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Sinobu online, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://sinobu.online/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432763/Sinobu%20online%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432763/Sinobu%20online%20%28Bot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random_numbers(min, max) {
        if (min == null || max == null) { console.log('Error: random_number(min,max); El valor min o max es null.'); } else {
            try {
                min = parseInt(min);
                max = parseInt(max);
            } catch (e) { console.log(e); }
            return Math.floor((Math.random() * max) + min);
        }
    }
    function detecta_hcaptcha_completado() {
        let status=false;
        if (document.body.querySelector("iframe[src*='hcaptcha.com']").getAttribute("data-hcaptcha-response") != ''){
            status=true;
        }
        return status;
    }
    if(window.location.pathname=="/" || window.location.pathname=="/index.php"){
        if(document.body.querySelector("input.form-control")==null){
            setInterval(function(){
                try{document.body.querySelector("button[type=submit]").click();}catch(e){console.log(e);}
                try{document.body.querySelector("a.btn.btn-danger").click();}catch(e){console.log(e);}
                try{document.body.querySelector("div.alert-danger > a[href='index.php']").click();}catch(e){console.log(e);}
                
            },random_numbers(2000, 2500));
        }
    }
    if(window.location.pathname.indexOf("/verify.php")>=0){
        setInterval(function(){
            if(detecta_hcaptcha_completado()){
                try{document.body.querySelector("button[type=submit]").click();}catch(e){console.log(e);}
            }
        },random_numbers(2000, 2500));
    }
})();