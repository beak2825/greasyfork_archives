// ==UserScript==
// @name        吉大党课 - 10.100.66.32
// @namespace   Violentmonkey Scripts
// @match       http://10.100.66.31/jjfz/play
// @match       https://webvpn.jlu.edu.cn/http/*/jjfz/play
// @grant        GM_getValue
// @version     1.3
// @license     GPL License
// @author      zyyyds
// @description 2022/5/24 14:39:58
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/445480/%E5%90%89%E5%A4%A7%E5%85%9A%E8%AF%BE%20-%20101006632.user.js
// @updateURL https://update.greasyfork.org/scripts/445480/%E5%90%89%E5%A4%A7%E5%85%9A%E8%AF%BE%20-%20101006632.meta.js
// ==/UserScript==
(function () {
  'use strict';
  setInterval(function(){
    
    var zhidaole = document.querySelector( "div[style='left: 40%;'] a.public_submit");
    var xiayige = document.querySelectorAll('[style="width:70%;"]')[1];
    //let jixuguankan = document.querySelector(".public_btn .public_cancel");
    var jixu = document.querySelector(".public_btn .public_submit");
    var bofang = document.querySelector("button[aria-label='Play']");
  if(jixu != null){
    jixu.click();}
  if(zhidaole != null){
        zhidaole.click();
    xiayige.click()
    //setTimeout(xiayige.click(),3000)       
     ;}
  if(bofang != null){
      bofang.click();}
  
    } , 3000);
  //aria-label="Play"
  })();