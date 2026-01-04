// ==UserScript==
// @name         GameHag (Bot)
// @icon         https://icons.duckduckgo.com/ip2/gamehag.com.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para GameHag, aumenta tus ganancias.
// @author       wuniversales
// @include      http*://gamehag.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422385/GameHag%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422385/GameHag%20%28Bot%29.meta.js
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

    if(window.location.pathname.indexOf("/tv-zone")>=0){
        setInterval(function(){
            if(!document.querySelector('button.video__play').disabled){
                if(document.querySelector('div.cpmsvideoclosebanner')!=null){
                    try{document.querySelector('div.cpmsvideoclosebanner').click();}catch(e){console.log(e);}
                }else{
                    if(document.querySelector('div.result.is-visible')!=null){
                        try{document.querySelector('button.result__primary').click();}catch(e){console.log(e);}
                    }else{
                        try{document.querySelector('button.video__play').click();}catch(e){console.log(e);}
                    }

                }
            }
        },random_numbers(5000, 3000));
    }
})();