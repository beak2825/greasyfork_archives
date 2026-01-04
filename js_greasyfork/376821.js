// ==UserScript==
// @name 翻译去回车
// @description 翻译去回车啊
// @namespace Violentmonkey Scripts
// @match https://translate.google.cn/* 
// @match https://translate.google.com/*
// @grant none
// @run-at document-end
// @version 0.0.1.20201223024712
// @downloadURL https://update.greasyfork.org/scripts/376821/%E7%BF%BB%E8%AF%91%E5%8E%BB%E5%9B%9E%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/376821/%E7%BF%BB%E8%AF%91%E5%8E%BB%E5%9B%9E%E8%BD%A6.meta.js
// ==/UserScript==

function deleteEnter(){
  txtarea = $(".er8xn")[0]
  txt = txtarea.value;
  //console.log(txt)

  for (var i=0;i<txt.length;i++)
  {
    if(txt.indexOf("\n"))txt = txt.replace("\n"," ");
  }
  //console.log(txt)
  txtarea.value = txt;
}
function helloworld(){
  let buttonParent = $(".U0xwnf")
  let button = $('<div class="cWQYBc" jsaction="JIbuQc: XS1pob" jsname="qDeCrf"><button class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc Rj2Mlf OLiIxf PDpWxe hL2wFc" jscontroller="soHxf" jsaction="click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef;" aria-label="文档翻译"><div class="VfPpkd-Jh9lGc"></div><i class="material-icons-extended VfPpkd-kBDsod ep0rzf" aria-hidden="true" lang="">insert_drive_file</i><span jsname="V67aGc" class="VfPpkd-vQzf8d" aria-hidden="true">去回车</span></button></div>')
  button.click(deleteEnter)
  buttonParent.append(button)
}
//window.onload=function(){
  helloworld()
  //window.setTimeout(helloworld,1000);
//}