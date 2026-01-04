// ==UserScript==
// @name         Earnfromsr (Bot)
// @icon         https://icons.duckduckgo.com/ip2/earnfromsr.tk.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Earnfromsr, aumenta tus ganancias.
// @author       wuniversales
// @include      https://earnfromsr.tk/faucet.php?r=TShQCjULLBA9ujpL7pbd8Q6LqhuEee4e7C
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441400/Earnfromsr%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441400/Earnfromsr%20%28Bot%29.meta.js
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
    function detecta_hcaptcha_completado() {
        let status=false;
        if (document.body.querySelector("iframe[src*='hcaptcha.com']").getAttribute("data-hcaptcha-response") != ''){
            status=true;
        }
        return status;
    }
    window.onload = function() {
        if(autofaucet){
            if(window.location.pathname.indexOf('/faucet.php')>=0 && location.search==atob('P3I9VFNoUUNqVUxMQkE5dWpwTDdwYmQ4UTZMcWh1RWVlNGU3Qw')){
                if(document.querySelectorAll("input[type=text]").length==2){
                    let stop;
                    stop=setInterval(function(){
                        if(detecta_hcaptcha_completado()){
                            if(document.querySelector("input[type=text]").value!=''){
                                if(!document.querySelector("[type=submit]").disabled){
                                    document.querySelector("[type=submit]").click();
                                    clearInterval(stop);
                                }
                            }
                        }
                    },random_numbers(1000, 1500));
                }else{setTimeout(function(){location.href=location.href;}, random_numbers(120000, 120500));}
            }
        }
    }
})();