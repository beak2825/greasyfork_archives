// ==UserScript==
// @name        hipda TOP button
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Hello world!
// @author       lampwu
// @match        https://www.hi-pda.com/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36424/hipda%20TOP%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/36424/hipda%20TOP%20button.meta.js
// ==/UserScript==

(    function rolltop() {
     var rott=[];
     rott=document.getElementsByTagName("a");
     for(i=0;i<rott.length;i++){
        if(rott[i].innerHTML =="TOP"){
            rott[i].onclick=function rrr(){
    document.documentElement.scrollTop = 0;
    };
        }
         else{}
     }
})();