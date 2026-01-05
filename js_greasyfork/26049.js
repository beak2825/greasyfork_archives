// ==UserScript==
// @name         20161226_01_load_github_mobile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fuer mobile Endgeraete mit Dolphin-Browser
// @author       S.K.
// @match        http://uni3.xorbit.de/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

function start(){
alert(frames[1].document.body.innerHTML);
}

alert('start');
alert(frames.length);
// alert(frames[1].document.getElementById('met').innerText);
frames[1].document.addEventListener('load',function(){alert('a');},false);
