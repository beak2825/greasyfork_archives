// ==UserScript==
// @name           random color menu comand
// @namespace      https://greasyfork.org/users/237458
// @version        0.8
// @description    cambio colore dal pulsante e dal menu
// @author         figuccio
// @match          *://*/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/448081/random%20color%20menu%20comand.user.js
// @updateURL https://update.greasyfork.org/scripts/448081/random%20color%20menu%20comand.meta.js
// ==/UserScript==
(function() {
    'use strict';
let $ = window.jQuery.noConflict();
const body=document.body;
let btn_style="position:fixed;top:370px;left:0px;z-index:999999999999;text-align:center;width:130px;border:1px solid green;background-color:green;color:red;padding:3px;border-radius:5px;border-color:black;";
let box=document.createElement("div");
box.innerText="cambia colore random";
box.title="random color";
box.id="prova";
box.style=btn_style;
let box_state="btn";
    // Verifica se sono memorizzate le coordinate x e y del box
if (GM_getValue('boxPosX') && GM_getValue('boxPosY')) {
    box.style.left = GM_getValue('boxPosX') + 'px';
    box.style.top = GM_getValue('boxPosY') + 'px';
}
$(box).draggable({
    containment: "window",
    stop: function(event, ui) {
        // Memorizza le coordinate x e y del box al termine del trascinamento
        GM_setValue('boxPosX', ui.position.left);
        GM_setValue('boxPosY', ui.position.top);
    }
}); // Aggiunta della proprietà containment
body.append(box);

     /////////////////////////////////
     if(GM_getValue("bg")!==null){
  document.body.style.background=GM_getValue("bg");
}
    ///////////////////////////////
function changeColor(){
        var color = '#'+Math.floor(Math.random()*16777215).toString(16);
        document.body.style.background = color;
        box.innerHTML = "&nbsp;cambio colore <br/>&nbsp;"+ color;
                      //colore button dello stesso colore della pagina
        box.style.backgroundColor = color;
         //colore testo button
        box.style.color = 'white';
    }

body.addEventListener("click",function(){
       document.body.style.background=`background:${changeColor("color")};color:${changeColor("color")};transition:.6s;`;
        GM_setValue("bg",document.body.style.background)
       })

    ///////////////////////////////////
    GM_registerMenuCommand("genera color",function(){
       document.body.style.background=`background:${changeColor("color")};color:${changeColor("color")};transition:.6s;`;
        GM_setValue("bg",document.body.style.background)
       })
///////////////////////////////////////////////////////////////////////
  function myFunctionnasc() {
 if(box.style.display = (box.style.display!=='none') ? 'none' : 'block');}
GM_registerMenuCommand("mostra pulsante/nascondi",myFunctionnasc);
})();
