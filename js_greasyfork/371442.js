// ==UserScript==
// @name     bilibili动态修复
// @author   eh5
// @license  MIT License
// @version  1.0
// @description  修复BiliBili在Firefox Quantum下使用缩放插件引起的动态高度过大的问题
// @namespace sokka.cn
// @include  http*://t.bilibili.com/*
// @grant    none
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/371442/bilibili%E5%8A%A8%E6%80%81%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/371442/bilibili%E5%8A%A8%E6%80%81%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
(function (){
  'use strict';
	var onload = function (){

    var cardlist = document.getElementsByClassName("card-list")[0];

    var searchfunc = function () {
      var content = cardlist.getElementsByClassName("content")[0];
      if(content){
        content.style.lineHeight = "";
        if(!content.style.lineHeight){
          console.log("动态样式修复成功");
          cardlist.removeEventListener("DOMNodeInserted",searchfunc);
        }
      }
    }
    
    if(cardlist)
      cardlist.addEventListener("DOMNodeInserted",searchfunc);
    else
      console.log("未找到动态面板DOM元素");
    
  }
  
  window.addEventListener("load", onload);
})()
