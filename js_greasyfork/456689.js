// ==UserScript==
// @name         Variable Manager v2
// @namespace    https://github.com/MichnoAZ
// @version      1.0
// @description  Better variable manager, idea - VirusterDev.
// @author       Pulsar, Viruster (idea)
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456689/Variable%20Manager%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/456689/Variable%20Manager%20v2.meta.js
// ==/UserScript==
/**
   *  Autor: Pulsar
   *  Github: https://github.com/MichnoAZ
   *  License: MIT
   Help:
   a - Menu element
   b - iteration for rainbow color in the menu
   window.box - function for changing variables
**/

var a=document.createElement("div");
a.innerHTML="\n Variable Manager<br>\n <input id = 'n' placeholder = 'Variable Name'><br><input id = 'v' placeholder = 'Value'> <button onclick = 'window.box(document.getElementById(`n`).value, document.getElementById(`v`).value)'> Edit Variable</button><br>";
a.style="font-family: monospace !important; \n border-width: 6px; \n overflow:auto;\n max-width:170px;\n max-height:90px;\n width:400px;\n height: 90px;\n color:white;\n font-size:12px !important;\n background:rgba(0, 0, 0, 0.5);\n background-size:250%;\n top:0 !important;\n left:0 !important;\n position:fixed;\n font-family:monospace !important;\n z-index:999999999999999999999999999999999999999999999999999999999999999999;\n border-radius-bottom:15px;\n border-radius-right:15px;\n border-radius:15px;\n text-align:center;\n border: 2.5px solid transparent;\n border-image: linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);\n border-image-slice: 1;\n box-shadow: inset 0 0 30px 0 #0d0d0d;\n background-size:100%;";
var b=0;
setInterval(function(){
    b++;
    a.style.color="hsl("+360*b/100+",80%,50%)";254<b&&(b=0)},25);
    document.body.appendChild(a);
    window.box=function(c,d){return"window Object.prototype Function.prototype localStorage Array.prototype sessionStorage".split(" ").map(function(e){return top[e][c]=d}
)};







