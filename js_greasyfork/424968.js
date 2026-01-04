// ==UserScript==
// @name         DigitalGain (Bot)
// @icon         https://icons.duckduckgo.com/ip2/digitalgain.net.ico
// @version      0.1.43
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para DigitalGain, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://digitalgain.net/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424968/DigitalGain%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424968/DigitalGain%20%28Bot%29.meta.js
// ==/UserScript==

var autoclaim=true;

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
    if(location.hostname.indexOf('digitalgain.net')>=0){
        if(autoclaim){
            async function autoclaim() {
                setInterval(function(){
                    if(window.location.pathname.indexOf("/account/wallet")>=0){
                        try{document.body.querySelectorAll('button[type=button][class=button]')[1].click();}catch(e){console.log(e);}
                    }
                },random_numbers(3600000,3660000));
            }
            autoclaim();
        }
    }
})();