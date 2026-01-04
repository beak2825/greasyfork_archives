// ==UserScript==
// @name         blink
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  remind you to blink
// @author       jackC
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461077/blink.user.js
// @updateURL https://update.greasyfork.org/scripts/461077/blink.meta.js
// ==/UserScript==


(function() {
    'use strict';
    if(self==top){
     blink();
     addStyle();
   }
})();
function blink(){
    let body=document.body;
    let blink=document.createElement('div');
    blink.classList.add('blink')
    body.appendChild(blink);
}
function addStyle(){
    let css=`
     .blink{
      pointer-events:none;
      position:fixed;
      z-index:9999;
      top:0;
      left:0;
      height:100%;
      background-color:transparent;
      width:100%;
      animation:blink 2s linear 0s infinite alternate;
     }
     @keyframes blink{
     0% ,74% {background-color:transparent;}
     75% {background-image: radial-gradient(transparent 99%,black);}
     76% {background-image: radial-gradient(transparent 95%,black);}
     77% {background-image: radial-gradient(transparent 91%,black);}
     78% {background-image: radial-gradient(transparent 87%,black);}
     79% {background-image: radial-gradient(transparent 83%,black);}
     80% {background-image: radial-gradient(transparent 79%,black);}
     81% {background-image: radial-gradient(transparent 75%,black);}
     82% {background-image: radial-gradient(transparent 71%,black);}
     83% {background-image: radial-gradient(transparent 67%,black);}
     84% {background-image: radial-gradient(transparent 63%,black);}
     85% {background-image: radial-gradient(transparent 59%,black);}
     86% {background-image: radial-gradient(transparent 55%,black);}
     87% {background-image: radial-gradient(transparent 51%,black);}
     88% {background-image: radial-gradient(transparent 47%,black);}
     89% {background-image: radial-gradient(transparent 43%,black);}
     90% {background-image: radial-gradient(transparent 39%,black);}
     91% {background-image: radial-gradient(transparent 35%,black);}
     92% {background-image: radial-gradient(transparent 31%,black);}
     93% {background-image: radial-gradient(transparent 27%,black);}
     94% {background-image: radial-gradient(transparent 23%,black);}
     95% {background-image: radial-gradient(transparent 19%,black);}
     96% {background-image: radial-gradient(transparent 15%,black);}
     97% {background-image: radial-gradient(transparent 11%,black);}
     98% {background-image: radial-gradient(transparent 7%,black);}
     99% {background-image: radial-gradient(transparent 3%,black);}
     100% {background-color: black;}
     }
    `
    GM_addStyle(css)
}