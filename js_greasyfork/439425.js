// ==UserScript==
// @name         Faucetworld (Bot)
// @namespace    https://greasyfork.org/users/592063
// @version      0.2.2
// @description  Script automatizado para Faucetworld, aumenta tus ganancias.
// @author       wuniversales
// @match        https://faucetworld.in/roll-game/*
// @icon         https://icons.duckduckgo.com/ip2/faucetworld.in.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439425/Faucetworld%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439425/Faucetworld%20%28Bot%29.meta.js
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
        if(autofaucet){
            if(document.querySelectorAll("li.collection-item > div")[4].innerText.search("can play")>=0){
                let solved=setInterval(function(){
                    if(document.querySelectorAll("input#adcopy_response").length>=0){//Search solved captcha
                        if(document.querySelector("input#adcopy_response").value!=''){
                            document.querySelector("button#claim").click();//Claim
                            clearInterval(solved);
                        }else{
                            location.pathname='/roll-game/';
                        }
                    }
                },random_numbers(7000, 7500));
            }else{
                if(document.querySelectorAll("span.seconds").length>=2 && document.querySelectorAll("span.minutes").length>=2){
                    document.querySelector("div#shortlink-counter-div").remove();
                    let sec,min;
                    let reloj=setInterval(function(){
                        sec=parseInt(document.querySelector("span.seconds").innerText);
                        min=parseInt(document.querySelector("span.minutes").innerText);
                        if(sec<=0 && min<=0){
                            location.pathname='/roll-game/';
                            clearInterval(reloj);
                        }else{
                            console.log('Waiting: '+min+':'+sec);
                        }
                    },1000);
                }
            }
        }
    }
})();