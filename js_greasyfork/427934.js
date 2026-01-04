// ==UserScript==
// @name         block dygang adv
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  去掉电影港网站的广告
// @author       You
// @match        https://www.dygang.org/*
// @icon         https://www.dygang.org/skin/dygang/images/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427934/block%20dygang%20adv.user.js
// @updateURL https://update.greasyfork.org/scripts/427934/block%20dygang%20adv.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clearAdv(){
     for(let el of document.querySelectorAll('a')){
         let src = el.src||'';
         if(!(src.startsWith("https://www.dygang.org/") || src.startsWith("/") || src=='')){
           el.parentNode.removeChild(el);
           console.log("remove one adv::"+src);
         }
     }
    for(let el of document.querySelectorAll('brde')){
         let src = el.getAttribute("src")||'';
         if(!src.startsWith("https://www.dygang.org/")){
           el.parentNode.removeChild(el);
           console.log("remove one adv");
         }
     }
    let bm = document.querySelector('.gotop');
        while(true){
            let s = bm.nextElementSibling
            if(s){
                bm.parentNode.removeChild(s);
                console.log('remove one adv');
            }else {
                console.error('adv not found');
                break
            }
        }
    window.setTimeout(clearAdv, 100);
    }
    clearAdv();
})();