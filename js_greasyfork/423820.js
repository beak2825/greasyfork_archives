// ==UserScript==
// @name         轻之国度快速翻图
// @namespace    test
// @version      0.2
// @description  方便浏览小说里所有图片
// @author       You
// @match        https://www.lightnovel.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423820/%E8%BD%BB%E4%B9%8B%E5%9B%BD%E5%BA%A6%E5%BF%AB%E9%80%9F%E7%BF%BB%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/423820/%E8%BD%BB%E4%B9%8B%E5%9B%BD%E5%BA%A6%E5%BF%AB%E9%80%9F%E7%BF%BB%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
var pic=8
function rm(){
var a1=document.documentElement.scrollTop
var a3=document.getElementsByTagName('img')[pic].offsetTop
var a33=document.getElementsByTagName('img')[8].offsetTop
if(a3<a33){pic-=1;a3=document.getElementsByTagName('img')[pic].offsetTop}
var dt=a3-a1
pic=pic+1
window.scrollBy(0,dt)
}
function rmk(){
var a1=document.documentElement.scrollTop
pic=pic-2
if(pic<8){pic=8}
var a3=document.getElementsByTagName('img')[pic].offsetTop
var dt=a3-a1
pic=pic+1
window.scrollBy(0,dt)
}
function tt()
{pic=8;var a=document.getElementsByTagName("body")[0];//$('.sidebar-buttons')//
var a22=document.createElement("li");
a.appendChild(a22)
var a2k=document.createElement("a");
a22.appendChild(a2k)
a2k.innerHTML='&nbsp&nbsp↑↑'
a2k.id='biligunak';a2k.style.position = "fixed";a2k.style.left = "0px";a2k.style.top = "390px";a2k.style.opacity=0.30;a2k.style.fontSize='40px'
a2k.onclick=rmk
var a2=document.createElement("a");
a22.appendChild(a2)
a2.innerHTML='&nbsp&nbsp↓↓'
a2.id='biliguna';a2.style.position = "fixed";a2.style.left = "0px";a2.style.top = "440px";a2.style.opacity=0.30;a2.style.fontSize='40px'
a2.onclick=rm
};

setTimeout(tt,3000)//onload=tt()//

/*
var dcTime=250;       // doubleclick time
var dcDelay=100;     // no clicks after doubleclick
var dcAt=0;               // time of doubleclick
var savEvent=null; // save Event for handling doClick().
var savEvtTime=0;   // save time of click event.
var savTO=null;       // handle of click setTimeOut

function showMe(txt) {
  document.forms[0].elements[0].value += txt;
}

function handleWisely(which) {
  switch (which) {
      case " click" :
          savEvent = which;
          d = new Date();
          savEvtTime = d.getTime();
          savTO = setTimeout(" doClick(savEvent)" , dcTime);
          break;
      case " dblclick" :
          doDoubleClick(which);
          break;
      default:
  }
}

function doClick(which) {
  if (savEvtTime - dcAt <= 0) {
      return false;
  }
  showMe(" 单击" );
}

function doDoubleClick(which) {
  var d = new Date();
  dcAt = d.getTime();
  if (savTO != null) {
      savTO = null;
  }
  showMe(" 双击" );
}
*/
    // Your code here...
})();