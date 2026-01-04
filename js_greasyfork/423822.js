// ==UserScript==
// @name         acfun后退快进(鼠标)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用云备份
// @author       You
// @match        https://www.acfun.cn/bangumi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423822/acfun%E5%90%8E%E9%80%80%E5%BF%AB%E8%BF%9B%28%E9%BC%A0%E6%A0%87%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423822/acfun%E5%90%8E%E9%80%80%E5%BF%AB%E8%BF%9B%28%E9%BC%A0%E6%A0%87%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
var ttt=1
function rm(){
var videoElement = $('.no-cursor')[0]
videoElement.currentTime -= 5
}
function rmk(){
var videoElement = $('.no-cursor')[0]
videoElement.currentTime += 5
}
function rmkk(){
var videoElement = $('.no-cursor')[0]
if(ttt==1){videoElement.pause();ttt=0}else{videoElement.play();ttt=1}
}
function tt()
{var a=document.getElementsByTagName("body")[0];
var a22=document.createElement("li");
a.appendChild(a22)
var a2kk=document.createElement("a");
a22.appendChild(a2kk)
a2kk.innerHTML='&nbsp&nbsp↓↓'
a2kk.id='biliguna1';a2kk.style.position = "fixed";a2kk.style.left = "0px";a2kk.style.top = "340px";a2kk.style.opacity=0.30;a2kk.style.fontSize='40px'
a2kk.onclick=rmkk
var a2k=document.createElement("a");
a22.appendChild(a2k)
a2k.innerHTML='&nbsp&nbsp←'
a2k.id='biligunak2';a2k.style.position = "fixed";a2k.style.left = "0px";a2k.style.top = "390px";a2k.style.opacity=0.30;a2k.style.fontSize='40px'
a2k.onclick=rm
var a2=document.createElement("a");
a22.appendChild(a2)
a2.innerHTML='&nbsp&nbsp→'
a2.id='biliguna3';a2.style.position = "fixed";a2.style.left = "0px";a2.style.top = "440px";a2.style.opacity=0.30;a2.style.fontSize='40px'
a2.onclick=rmk
};

setTimeout(tt,3000)
    // Your code here...
})();