// ==UserScript==
// @name         Dutchycorp (Bot)
// @namespace    https://greasyfork.org/users/592063
// @version      0.1
// @description  Script automatizado para Dutchycorp, aumenta tus ganancias.
// @author       wuniversales
// @match        http*://autofaucet.dutchycorp.space/*
// @icon         https://icons.duckduckgo.com/ip2/autofaucet.dutchycorp.space.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444266/Dutchycorp%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444266/Dutchycorp%20%28Bot%29.meta.js
// ==/UserScript==

let autoptc=true;
let autodice=true;

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
        try{
            if (document.body.querySelector("iframe[src*='hcaptcha.com']").getAttribute("data-hcaptcha-response") != ''){
                status=true;
            }
        }catch(e){}
        return status;
    }
    window.addEventListener("load", function(){
        if(autoptc){
            if(location.pathname.search('/ptc/')>=0){
                let temp=setInterval(function(){
                    try{
                        document.querySelector('iframe').sandbox='';
                        if(document.querySelector('span#sec > span > b').innerText=='0'){
                            document.querySelector('form > div#submit_captcha > center > button[type=submit]').click();
                            clearInterval(temp);
                        }
                    }catch(e){console.log(e);}
                },1000);
            }
        }
        if(autodice){
            if(location.pathname.search('/dice.php')>=0){
                let bet_base=1,multiplier=65;
                    setTimeout(function(){
                        if(document.querySelectorAll('input#multiplier').length>0){
                            if(document.querySelectorAll('div#active_win').length>0){
                                console.log(document.querySelector('div#active_win').innerText);
                            }
                            if(document.querySelectorAll('div#active_loss').length>0){
                                console.log(document.querySelector('div#active_loss').innerText);
                            }
                            document.querySelector('input#multiplier').value=multiplier;
                            document.querySelector('input#bet').value=bet_base;
                            document.querySelector('input#rollLo').click();
                        }
                },random_numbers(500, 1000));
            }
        }
    });
})();