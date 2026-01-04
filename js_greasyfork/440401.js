// ==UserScript==
// @name         Digitask (Bot)
// @namespace    https://greasyfork.org/users/592063
// @version      0.1.3
// @description  Script automatizado para Digitask, aumenta tus ganancias.
// @author       wuniversales
// @match        https://digitask.ru/*
// @icon         https://icons.duckduckgo.com/ip2/digitask.ru.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440401/Digitask%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440401/Digitask%20%28Bot%29.meta.js
// ==/UserScript==

let autofaucet=true;

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

    window.onload = function() {
        setInterval(function(){
            if(autofaucet){
                if(document.querySelectorAll("input[type=checkbox]").length>0){
                    try{document.querySelector('input[type=checkbox]').checked=true;}catch(e){}
                }
                if(document.querySelectorAll("button.claim-button.g-recaptcha").length>0){
                    try{document.querySelector("button.claim-button.g-recaptcha").click();}catch(e){}
                }
                if(document.querySelectorAll("div.alert-success").length>0){
                    location.href=location.href;
                }
            }
        },random_numbers(2000, 5500));
    }
})();