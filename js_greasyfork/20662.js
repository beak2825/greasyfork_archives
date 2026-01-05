// ==UserScript==
// @name         Whatsapp spam 2.0
// @namespace    http://razor.260mb.org
// @version      2.0
// @description  Made by Macr1408 (Also known as Razor1408) for razor.260mb.org
// @author       Macr1408
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20662/Whatsapp%20spam%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/20662/Whatsapp%20spam%2020.meta.js
// ==/UserScript==

function general(){
    item = document.createElement("div");
    item.innerHTML = "<img src='http://k30.kn3.net/9CE61B28D.png' style='width:24px;height:24px;' id='spam'>"
    item2 = document.getElementsByClassName("pane-header pane-list-header")[0];
    item2.insertBefore(item, item2.childNodes[1]);
    panel = document.getElementsByClassName("pane pane-list")[0];
    elemento = document.createElement("div");
    elemento.innerHTML = "<header class='pane-header pane-list-header'><input type='text' id='mensaje' size='30'><input type='number' min='1' id='repeticiones' style='width:50px'>Times </header>";
    panel.insertBefore(elemento, panel.childNodes[1]);
    document.getElementById("spam").addEventListener("click", spam);
}

setTimeout(general,5000);

function dispatch(target, eventType, char) {
   var evt = document.createEvent("TextEvent");    
   evt.initTextEvent (eventType, true, true, window, char, 0, "en-US");
   target.focus();
   target.dispatchEvent(evt);
}

function spam(){
  texto = document.getElementById("mensaje").value
  reps = document.getElementById("repeticiones").value
  campo = document.getElementsByClassName("input")[1];
  contador = 1;
  while(contador<=reps){
    dispatch(campo, "textInput", texto); 
    var input = document.getElementsByClassName("icon btn-icon icon-send");
    input[0].click();
    contador++;
    setTimeout(function(){ }, 1);
  }
}