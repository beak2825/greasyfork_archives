// ==UserScript==
// @name         Directdownload (Bot)
// @namespace    https://greasyfork.org/users/592063
// @version      0.1
// @description  Script automatizado para Directdownload, aumenta tus ganancias.
// @author       wuniversales
// @match        https://directdownload.xyz/*
// @icon         https://icons.duckduckgo.com/ip2/directdownload.xyz.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439434/Directdownload%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439434/Directdownload%20%28Bot%29.meta.js
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
            let click=true;
            setInterval(function(){
                if(document.querySelectorAll("input[value^=Claim").length>0){
                    if(click){
                        document.querySelector("input[value^=Claim").click();
                        click=false;
                    }
                }else{
                    click=true;
                }
            },random_numbers(1000, 1500));
        }
    }
})();