// ==UserScript==
// @name         Zoom download recorded video
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *.zoom.us/rec/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411323/Zoom%20download%20recorded%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/411323/Zoom%20download%20recorded%20video.meta.js
// ==/UserScript==

 downloa = function(){
    'use strict';


     function enableContextMenu(aggressive = false) {
void(document.ondragstart=null);
void(document.onselectstart=null);
void(document.onclick=null);
void(document.onmousedown=null);
void(document.onmouseup=null);
void(document.body.oncontextmenu=null);
enableRightClickLight(document);
if (aggressive) {
  enableRightClick(document);
  removeContextMenuOnAll("body");
  removeContextMenuOnAll("img");
  removeContextMenuOnAll("td");
  } }

function removeContextMenuOnAll(tagName) {
var elements = document.getElementsByTagName(tagName);
  for (var i = 0; i < elements.length; i++) {
    enableRightClick(elements[i]);
  }
}

function enableRightClickLight(el) {
  el || (el = document);
  el.addEventListener("contextmenu", bringBackDefault, true);
}

function enableRightClick(el) {
  el || (el = document);
  el.addEventListener("contextmenu", bringBackDefault, true);
  el.addEventListener("dragstart", bringBackDefault, true);
  el.addEventListener("selectstart", bringBackDefault, true);
  el.addEventListener("click", bringBackDefault, true);
  el.addEventListener("mousedown", bringBackDefault, true);
  el.addEventListener("mouseup", bringBackDefault, true);
}

function restoreRightClick(el) {
  el || (el = document);
  el.removeEventListener("contextmenu", bringBackDefault, true);
  el.removeEventListener("dragstart", bringBackDefault, true);
  el.removeEventListener("selectstart", bringBackDefault, true);
  el.removeEventListener("click", bringBackDefault, true);
  el.removeEventListener("mousedown", bringBackDefault, true);
  el.removeEventListener("mouseup", bringBackDefault, true);
}
function bringBackDefault(event) {
  event.returnValue = true;
  (typeof event.stopPropagation === 'function') &&
  event.stopPropagation();
  (typeof event.cancelBubble === 'function') &&
  event.cancelBubble();
}



     

    

     function func(){


     if(document.getElementsByTagName("video")[0].readyState != 0){
        var downlo = document.createElement("a");
        downlo.href = document.getElementsByTagName("video")[0].src;
        downlo.innerText = "Download(Save link as)";
        downlo.width = "50px";

        var logo2 = document.getElementsByClassName("logo")[0];
        logo2.insertBefore(downlo, logo2.childNodes[-1]);
        }else{downloa();}

        enableContextMenu();

     }

     window.addEventListener("load", ()=>{
        setTimeout(()=>{
            func()
        }, 2000)
     }, false)

};

downloa();