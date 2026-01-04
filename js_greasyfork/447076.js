// ==UserScript==
// @name           colori random con pulsante
// @author         figuccio
// @namespace      https://greasyfork.org/users/237458
// @description    pulsante per cambio colori
// @version        1.5
// @match          *://*/*
// @grant          GM_registerMenuCommand
// @noframes
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @license        MIT
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/447076/colori%20random%20con%20pulsante.user.js
// @updateURL https://update.greasyfork.org/scripts/447076/colori%20random%20con%20pulsante.meta.js
// ==/UserScript==
(function() {
    'use strict';
let $ = window.jQuery.noConflict();
const body=document.body
var Button = document.createElement('button');
let btn_style = "position:absolute;text-align:center;border:3px solid green;font-size:19px;top:300px;right:;z-index:9999999999999999999999;background-color:aquamarine;color:red;padding:15px;border-radius:5px;";
let box=document.createElement("div");
    /////////////////////////////////////
    box.title = 'cambiare colore';
    box.innerHTML=`
<button id="random" style="font-size:15px;color:black;background:red;border:2px solid green;">CAMBIA COLORI AL CLICK</button><br>
      `;
    ////////////////////////////////////

box.style=btn_style;
$(box).draggable();
body.append(box);
          //////////////////////////
  if(GM_getValue("bg")!==null){
    body.style.background=GM_getValue("bg");
}

function randomColor() {
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
         body.style.background = randomColor;
        box.innerHTML = "&nbsp;cambio colore <br/>&nbsp;"+ randomColor;
        //colore button dello stesso colore della pagina
        box.style.backgroundColor = randomColor;
         //colore testo button
        box.style.color = 'white';
    }
       //cambio colore al click
        box.addEventListener("click",function(){
        body.style.background=`background:${randomColor("color")};color:${randomColor("color")};transition:.6s;`;
        GM_setValue("bg",body.style.background)
       })

})();
