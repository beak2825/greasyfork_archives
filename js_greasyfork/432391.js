// ==UserScript==
// @name         Bad Dragon Inch to CM Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert unit from inch to centimeter in Bad Dragon
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://bad-dragon.com/products/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432391/Bad%20Dragon%20Inch%20to%20CM%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/432391/Bad%20Dragon%20Inch%20to%20CM%20Converter.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    "use strict";
    window.addEventListener('load', function() {
    var t = setInterval(tick, 1000);
    function tick(){
        if(document.querySelector("div.modal.modal--revealed.sizing-chart__modal")){
            let b=false;
            Array.from(
                document.querySelectorAll("table > tbody > tr > td")
            ).forEach(
                x=>{
                    if(b||x.innerText.includes("(cm)")){
                        b=true;
                        clearInterval(t);
                        return;
                    }
                    if(x.innerText.match(/\d(\.\d)?/)){
                       x.innerText=`${(Number(x.innerText)*2.54).toFixed(2)}`;
                    }
                    x.innerText=x.innerText.replace("(inches)","(cm)");
                }
            );
        }
    }
    }, false);
}());
