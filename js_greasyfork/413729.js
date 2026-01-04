// ==UserScript==
// @name         Memorise_Niks
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  try to take over the world!
// @author       Life
// @match        https://shikme.ru/
// @icon         https://shikme.ru/default_images/icon.png
// @grant        none
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/413729/Memorise_Niks.user.js
// @updateURL https://update.greasyfork.org/scripts/413729/Memorise_Niks.meta.js
// ==/UserScript==
/* jshint esversion: 6*/
(function() {
    'use strict';
//init
const l=document.getElementById("chat_logs_container");
if(!localStorage.memoriser)var qq={}; else qq=JSON.parse(localStorage.memoriser);
var GMI=GM_info;
//proc
l.addEventListener("DOMNodeInserted", (e)=>{if(e.target.getElementsByClassName&&e.target.getElementsByClassName("my_text").length){
var rl=e.target.getElementsByClassName("get_av");
if (rl.length&&rl[0].getAttribute('onclick'))rl=rl[0].getAttribute('onclick').split("'")[3]; else return;
var un;
if (qq[rl]){
var nik=qq[rl];
if (typeof nik != "string" && nik.pop) nik=nik[0]+' - '+nik.length;

un=e.target.getElementsByClassName("logs_date"); if(un&&un.length)un=un[0];
un.insertAdjacentText('afterbegin',nik+' - ');

un=e.target.getElementsByClassName("username"); if(un&&un.length)un=un[0];
if (qq[rl].push && !qq[rl].includes(un.innerText)) {qq[rl].push(un.innerText); localStorage.memoriser=JSON.stringify(qq);}
if (typeof qq[rl] == "string" && qq[rl]!=un.innerText) {qq[rl]=[nik]; qq[rl].push(un.innerText); localStorage.memoriser=JSON.stringify(qq);}

var cm=e.target.getElementsByClassName("chat_message");
cm[0].className="chat_message ";//+qq[rl].b;
for(var i=0;i<cm[0].children.length;i++){cm[0].children[i].style='';}
}else{
un=e.target.getElementsByClassName("username"); if(un&&un.length)un=un[0];
qq[rl]=un.innerText;
localStorage.memoriser=JSON.stringify(qq);
}}}, false);
console.log(GMI.script.name+' v'+GMI.script.version+' run');
})();

//for (o in b) {if (!a[o] || a[o]==b[o]) {a[o]=b[o]; delete b[o];} }